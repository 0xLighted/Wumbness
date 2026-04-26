import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createCounselorMatch,
  MatchPersistenceError,
  NoCounselorAvailableError,
} from "@/lib/matcher/match";
import { getCurrentUser } from "@/lib/supabase/current-user";

const matchRequestSchema = z.object({
  symptoms: z.array(z.string().trim().min(1)).min(1),
  summary: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "patient") {
      return NextResponse.json({ error: "Only patients can request counselor matching" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = matchRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid match payload" }, { status: 400 });
    }

    const result = await createCounselorMatch({
      patientId: currentUser.id,
      symptoms: parsed.data.symptoms,
      summary: parsed.data.summary,
    });

    return NextResponse.json({
      status: "matched",
      matchId: result.matchId,
      counselorId: result.counselorId,
      score: result.score,
    });
  } catch (error) {
    if (error instanceof NoCounselorAvailableError) {
      return NextResponse.json(
        { error: "No counselor is available right now. Please try again shortly." },
        { status: 409 },
      );
    }

    if (error instanceof MatchPersistenceError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }
}
