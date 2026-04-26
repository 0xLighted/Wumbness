import { z } from "zod";

import { embedSymptomsAndSpecialties } from "./embed";
import { createClient } from "../supabase/server";

const completedTriageSchema = z.object({
  patientId: z.uuid(),
  symptoms: z.array(z.string().trim().min(1)).min(1),
  summary: z.string().trim().min(1),
});

type CounselorCandidate = {
  id: string;
  embedding: string | number[] | null;
};

type RpcMatchResult = {
  counselor_id: string;
  score: number;
};

export type CompletedTriageInput = z.infer<typeof completedTriageSchema>;

export type MatchResult = {
  matchId: string;
  counselorId: string;
  score: number;
};

export class NoCounselorAvailableError extends Error {
  constructor(message = "No counselor is currently available for matching") {
    super(message);
    this.name = "NoCounselorAvailableError";
  }
}

export class MatchPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatchPersistenceError";
  }
}

export function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

export function parseVectorLiteral(vector: string | number[]): number[] {
  if (Array.isArray(vector)) {
    return vector;
  }

  const trimmed = vector.trim();
  const normalized = trimmed.startsWith("[") && trimmed.endsWith("]")
    ? trimmed.slice(1, -1)
    : trimmed;

  if (!normalized) {
    return [];
  }

  return normalized
    .split(",")
    .map((part) => Number.parseFloat(part.trim()))
    .filter((value) => Number.isFinite(value));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) {
    return -1;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (!denominator) {
    return -1;
  }

  return dot / denominator;
}

export function pickBestCounselor(
  candidates: CounselorCandidate[],
  patientEmbedding: number[],
): { counselorId: string; score: number } | null {
  let best: { counselorId: string; score: number } | null = null;

  for (const candidate of candidates) {
    if (!candidate.embedding) {
      continue;
    }

    const counselorEmbedding = parseVectorLiteral(candidate.embedding);
    const score = cosineSimilarity(patientEmbedding, counselorEmbedding);

    if (!Number.isFinite(score) || score < 0) {
      continue;
    }

    if (!best || score > best.score) {
      best = {
        counselorId: candidate.id,
        score,
      };
    }
  }

  return best;
}

async function getBestCounselorViaRpc(
  queryEmbedding: string,
): Promise<{ counselorId: string; score: number } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_counselor", {
    query_embedding: queryEmbedding,
    min_score: 0,
    limit_count: 1,
  });

  if (error || !data || data.length === 0) {
    return null;
  }

  const [match] = data as RpcMatchResult[];
  return {
    counselorId: match.counselor_id,
    score: match.score,
  };
}

async function getBestCounselorFallback(
  patientEmbedding: number[],
): Promise<{ counselorId: string; score: number } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, embedding")
    .eq("role", "COUNSELOR")
    .not("embedding", "is", null);

  if (error || !data || data.length === 0) {
    return null;
  }

  return pickBestCounselor(
    data.map((entry) => ({
      id: entry.id as string,
      embedding: entry.embedding as string | number[] | null,
    })),
    patientEmbedding,
  );
}

export async function createCounselorMatch(input: CompletedTriageInput): Promise<MatchResult> {
  const parsed = completedTriageSchema.safeParse(input);
  if (!parsed.success) {
    throw new MatchPersistenceError(parsed.error.issues[0]?.message ?? "Invalid triage payload");
  }

  const patientEmbedding = await embedSymptomsAndSpecialties(parsed.data.symptoms);
  const embeddingLiteral = toVectorLiteral(patientEmbedding);

  const supabase = await createClient();

  const { error: patientUpdateError } = await supabase
    .from("users")
    .update({ embedding: embeddingLiteral })
    .eq("id", parsed.data.patientId);

  if (patientUpdateError) {
    throw new MatchPersistenceError("Failed to save patient embedding");
  }

  const rpcMatch = await getBestCounselorViaRpc(embeddingLiteral);
  const fallbackMatch = rpcMatch ?? await getBestCounselorFallback(patientEmbedding);

  if (!fallbackMatch) {
    throw new NoCounselorAvailableError();
  }

  const triageSummary = {
    summary: parsed.data.summary,
    symptoms: parsed.data.symptoms,
    score: fallbackMatch.score,
    matchedAt: new Date().toISOString(),
  };

  const { data: matchRow, error: matchInsertError } = await supabase
    .from("matches")
    .insert({
      patient_id: parsed.data.patientId,
      counselor_id: fallbackMatch.counselorId,
      triage_summary: triageSummary,
      status: "ACTIVE",
    })
    .select("id")
    .single();

  if (matchInsertError || !matchRow) {
    throw new MatchPersistenceError("Failed to create counselor match record");
  }

  return {
    matchId: matchRow.id as string,
    counselorId: fallbackMatch.counselorId,
    score: fallbackMatch.score,
  };
}
