import { describe, expect, it } from "vitest";
import { embedSymptomsAndSpecialties, toEmbeddingInput, type SymptomSpecialtyInput } from "../../lib/matcher/embed";
import { SYMPTOMS } from "../../app/components/triage/data";

describe("embedding library - symptom & specialty vectorization", () => {
  const apiKeyAvailable = !!process.env.HUGGINGFACE_API_KEY;

  describe("toEmbeddingInput", () => {
    it("converts single symptom to comma-separated string", () => {
      const input: SymptomSpecialtyInput = ["Depression"];
      const result = toEmbeddingInput(input);
      expect(result).toBe("Depression");
    });

    it("converts multiple symptoms to comma-separated string", () => {
      const input: SymptomSpecialtyInput = ["Depression", "Anxiety", "Sleep Problems"];
      const result = toEmbeddingInput(input);
      expect(result).toBe("Depression, Anxiety, Sleep Problems");
    });

    it("trims whitespace from symptoms", () => {
      const input: SymptomSpecialtyInput = ["  Depression  ", "Anxiety"];
      const result = toEmbeddingInput(input);
      expect(result).toBe("Depression, Anxiety");
    });

    it("removes duplicate symptoms (case-insensitive)", () => {
      const input: SymptomSpecialtyInput = ["Depression", "depression", "Anxiety"];
      const result = toEmbeddingInput(input);
      expect(result).toBe("Depression, Anxiety");
    });

    it("preserves original case for first occurrence of symptom", () => {
      const input: SymptomSpecialtyInput = ["depression", "Depression"];
      const result = toEmbeddingInput(input);
      expect(result).toBe("depression");
    });

    it("handles all SYMPTOMS from data file", () => {
      const result = toEmbeddingInput(SYMPTOMS);
      expect(result).toContain("Depression");
      expect(result).toContain("Anxiety");
      expect(result).toContain("Substance Use");
      expect(result.split(", ").length).toBe(SYMPTOMS.length);
    });
  });

  describe("embedSymptomsAndSpecialties", () => {
    (apiKeyAvailable ? it : it.skip)(
      "generates embedding vector for single symptom",
      { timeout: 30000 },
      async () => {
        const input: SymptomSpecialtyInput = ["Depression"];
        const embedding = await embedSymptomsAndSpecialties(input);

        expect(Array.isArray(embedding)).toBe(true);
        expect(embedding.length).toBeGreaterThan(0);
        expect(embedding.every((v) => typeof v === "number")).toBe(true);
      },
    );

    (apiKeyAvailable ? it : it.skip)(
      "generates embedding vector for multiple symptoms",
      { timeout: 30000 },
      async () => {
        const input: SymptomSpecialtyInput = ["Depression", "Anxiety", "Sleep Problems"];
        const embedding = await embedSymptomsAndSpecialties(input);

        expect(Array.isArray(embedding)).toBe(true);
        expect(embedding.length).toBeGreaterThan(0);
        expect(embedding.every((v) => typeof v === "number")).toBe(true);
      },
    );

    (apiKeyAvailable ? it : it.skip)(
      "generates same embedding for duplicate symptoms (after normalization)",
      { timeout: 30000 },
      async () => {
        const input1: SymptomSpecialtyInput = ["Depression", "Anxiety"];
        const input2: SymptomSpecialtyInput = ["Depression", "Anxiety", "Depression"];

        const embedding1 = await embedSymptomsAndSpecialties(input1);
        const embedding2 = await embedSymptomsAndSpecialties(input2);

        expect(embedding1).toEqual(embedding2);
      },
    );

    (apiKeyAvailable ? it : it.skip)(
      "generates embedding for all SYMPTOMS",
      { timeout: 30000 },
      async () => {
        const embedding = await embedSymptomsAndSpecialties(SYMPTOMS);

        expect(Array.isArray(embedding)).toBe(true);
        expect(embedding.length).toBeGreaterThan(0);
        expect(embedding.every((v) => typeof v === "number")).toBe(true);
      },
    );

    it("throws error for empty array", async () => {
      const input: unknown[] = [];

      await expect(
        embedSymptomsAndSpecialties(input as SymptomSpecialtyInput),
      ).rejects.toThrow();
    });

    it("throws error for array with empty strings", async () => {
      const input: unknown[] = [""];

      await expect(
        embedSymptomsAndSpecialties(input as SymptomSpecialtyInput),
      ).rejects.toThrow();
    });

    it(
      "throws error when HUGGINGFACE_API_KEY is missing",
      { timeout: 10000 },
      async () => {
        const originalKey = process.env.HUGGINGFACE_API_KEY;
        process.env.HUGGINGFACE_API_KEY = undefined;

        try {
          await expect(
            embedSymptomsAndSpecialties(["Depression"]),
          ).rejects.toThrow("Failed to perform inference: Invalid username or password.");
        } finally {
          process.env.HUGGINGFACE_API_KEY = originalKey;
        }
      },
    );
  });
});
