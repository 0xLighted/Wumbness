"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type PatientMatchCard = {
  matchId: string;
  counselorId: string;
  counselorName: string;
  counselorBio: string;
  isOnline: boolean;
};

export type CounselorQueueItem = {
  matchId: string;
  patientId: string;
  alias: string;
  unread: number;
  summary: string;
  symptoms: string[];
};

const concludeMatchSchema = z.object({
  matchId: z.uuid("Invalid match identifier"),
});

type MatchRow = {
  id: string;
  patient_id: string;
  counselor_id: string;
  triage_summary: {
    summary?: string;
    symptoms?: string[];
  } | null;
};

type UserProfileRow = {
  id: string;
  fullname: string | null;
  specialties: string[] | null;
};

function toPatientAlias(fullName: string | null): string {
  if (!fullName?.trim()) {
    return "Patient";
  }

  const firstName = fullName.trim().split(/\s+/)[0];
  return `${firstName}`;
}

function toCounselorBio(specialties: string[] | null): string {
  if (!specialties || specialties.length === 0) {
    return "Here to listen and support your wellbeing journey.";
  }

  return `Specializes in ${specialties.slice(0, 3).join(", ")}. Here to listen.`;
}

function toSummaryText(triageSummary: MatchRow["triage_summary"]): string {
  if (!triageSummary) {
    return "Initial triage details are being prepared.";
  }

  return triageSummary.summary?.trim() || "Initial triage details are being prepared.";
}

function toSymptomChips(triageSummary: MatchRow["triage_summary"]): string[] {
  if (!triageSummary?.symptoms || triageSummary.symptoms.length === 0) {
    return [];
  }

  return triageSummary.symptoms;
}

function encodeErrorToUrl(message: string): string {
  return encodeURIComponent(message);
}

function extractFirstError(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  if (firstIssue) {
    return firstIssue.message || "Validation failed";
  }
  return "Validation failed";
}

export async function concludeMatch(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const parsed = concludeMatchSchema.safeParse({
    matchId: formData.get("matchId") as string,
  });

  if (!parsed.success) {
    const errorMsg = extractFirstError(parsed.error);
    redirect(`/?toast=match-error&errorDetails=${encodeErrorToUrl(errorMsg)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?toast=match-error&errorDetails=Please%20sign%20in%20again");
  }

  const { data: roleRecord } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: string | null }>();

  if (roleRecord?.role !== "COUNSELOR") {
    redirect("/?toast=match-error&errorDetails=Only%20counselors%20can%20conclude%20a%20match");
  }

  const { data: updatedMatch, error: updateError } = await supabase
    .from("matches")
    .update({ status: "CLOSED" })
    .eq("id", parsed.data.matchId)
    .eq("counselor_id", user.id)
    .eq("status", "ACTIVE")
    .select("id")
    .maybeSingle();

  if (updateError || !updatedMatch) {
    redirect("/?toast=match-error&errorDetails=Failed%20to%20conclude%20the%20match");
  }

  revalidatePath("/", "layout");
  revalidatePath("/chat", "layout");
  redirect("/?toast=match-concluded");
}

export async function getPatientActiveMatch(patientId: string): Promise<PatientMatchCard | null> {
  const supabase = await createClient();

  const { data: matchRow, error: matchError } = await supabase
    .from("matches")
    .select("id, counselor_id")
    .eq("patient_id", patientId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (matchError || !matchRow) {
    return null;
  }

  const { data: counselor, error: counselorError } = await supabase
    .from("users")
    .select("id, fullname, specialties")
    .eq("id", matchRow.counselor_id)
    .maybeSingle<UserProfileRow>();

  if (counselorError || !counselor) {
    return null;
  }

  return {
    matchId: matchRow.id as string,
    counselorId: counselor.id,
    counselorName: counselor.fullname ?? "Assigned Counselor",
    counselorBio: toCounselorBio(counselor.specialties),
    isOnline: true,
  };
}

export async function getCounselorQueue(counselorId: string): Promise<CounselorQueueItem[]> {
  const supabase = await createClient()

  const { data: matchRows, error: matchesError } = await supabase
    .from("matches")
    .select("id, patient_id, counselor_id, triage_summary")
    .eq("counselor_id", counselorId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });

  if (matchesError || !matchRows || matchRows.length === 0) {
    return [];
  }

  const typedMatches = matchRows as MatchRow[];
  const patientIds = [...new Set(typedMatches.map((match) => match.patient_id))];

  const { data: patients, error: patientsError } = await supabase
    .from("users")
    .select("id, fullname")
    .in("id", patientIds);

  if (patientsError || !patients) {
    return [];
  }

  const patientById = new Map<string, { fullname: string | null }>();
  for (const patient of patients) {
    patientById.set(patient.id as string, {
      fullname: (patient.fullname as string | null) ?? null,
    });
  }

  return typedMatches.map((match) => {
    const patient = patientById.get(match.patient_id);
    const triageSummary = match.triage_summary;

    return {
      matchId: match.id,
      patientId: match.patient_id,
      alias: toPatientAlias(patient?.fullname ?? null),
      unread: 0,
      summary: toSummaryText(triageSummary),
      symptoms: toSymptomChips(triageSummary),
    };
  });
}
