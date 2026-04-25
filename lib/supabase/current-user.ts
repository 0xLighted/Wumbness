import { createClient } from "@/lib/supabase/server";

export type AppRole = "patient" | "counselor";

export type CurrentUser = {
  id: string;
  email: string | null;
  role: AppRole;
  fullName: string | null;
  firstName: string | null;
};

type UserRow = {
  role: string | null;
  fullname: string | null;
};

function normalizeRole(value: string | null | undefined): AppRole {
  if (!value) {
    return "patient";
  }

  const normalized = value.toLowerCase();
  return normalized === "counselor" ? "counselor" : "patient";
}

function getFirstName(fullName: string | null | undefined): string | null {
  if (!fullName) {
    return null;
  }

  const trimmed = fullName.trim();
  if (!trimmed) {
    return null;
  }

  const firstName = trimmed.split(/\s+/)[0];
  return firstName || null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, fullname")
    .eq("id", user.id)
    .maybeSingle<UserRow>();

  const metadataRole = typeof user.user_metadata?.role === "string"
    ? user.user_metadata.role
    : null;
  const metadataName = typeof user.user_metadata?.fullName === "string"
    ? user.user_metadata.fullName
    : null;

  const role = normalizeRole(profile?.role ?? metadataRole);
  const fullName = profile?.fullname ?? metadataName ?? null;

  return {
    id: user.id,
    email: user.email ?? null,
    role,
    fullName,
    firstName: getFirstName(fullName),
  };
}
