"server-only";

import { InferenceClient } from "@huggingface/inference";
import { z } from "zod";

const EMBEDDING_MODEL = process.env.HUGGINGFACE_EMBEDDING_MODEL ?? "all-MiniLM-L6-v2";

const symptomSpecialtyArraySchema = z.array(z.string().trim().min(1)).min(1);

export type SymptomSpecialtyInput = z.infer<typeof symptomSpecialtyArraySchema>;

function ensureHuggingFaceApiKey() {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Missing HUGGINGFACE_API_KEY for embeddings.");
  }
}

function normalizeTerms(values: string[]): string[] {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function resolveEmbeddingModelId(modelId: string): string {
  const trimmed = modelId.trim();

  if (trimmed.includes("/")) {
    return trimmed;
  }

  return `sentence-transformers/${trimmed}`;
}

function extractEmbeddingVector(output: unknown): number[] {
  if (Array.isArray(output) && output.every((value) => typeof value === "number")) {
    return output as number[];
  }

  if (
    Array.isArray(output) &&
    output.length > 0 &&
    Array.isArray(output[0]) &&
    (output[0] as unknown[]).every((value) => typeof value === "number")
  ) {
    return output[0] as number[];
  }

  throw new Error("Unexpected Hugging Face embedding response shape.");
}

export function toEmbeddingInput(values: SymptomSpecialtyInput): string {
  const normalized = normalizeTerms(values);
  return normalized.join(", ");
}

export async function embedSymptomsAndSpecialties(values: SymptomSpecialtyInput): Promise<number[]> {
  const parsed = symptomSpecialtyArraySchema.safeParse(values);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid symptom/specialty input.");
  }

  ensureHuggingFaceApiKey();

  const input = toEmbeddingInput(parsed.data);
  const model = resolveEmbeddingModelId(EMBEDDING_MODEL);

  const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
  const output = await hf.featureExtraction({
    model,
    inputs: input,
  });

  return extractEmbeddingVector(output);
}
