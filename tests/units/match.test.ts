import { describe, expect, it } from "vitest";

import {
  cosineSimilarity,
  parseVectorLiteral,
  pickBestCounselor,
  toVectorLiteral,
} from "../../lib/matcher/match";

describe("matcher helpers", () => {
  it("serializes a vector into pgvector literal format", () => {
    expect(toVectorLiteral([0.1, 0.2, 0.3])).toBe("[0.1,0.2,0.3]");
  });

  it("parses vector literal into number array", () => {
    expect(parseVectorLiteral("[0.1, 0.2, 0.3]")).toEqual([0.1, 0.2, 0.3]);
  });

  it("returns negative when cosine vectors are incompatible", () => {
    expect(cosineSimilarity([1, 0], [1])).toBe(-1);
  });

  it("picks the counselor with the highest cosine score", () => {
    const best = pickBestCounselor(
      [
        { id: "a", embedding: "[1,0,0]" },
        { id: "b", embedding: "[0.9,0.1,0]" },
      ],
      [1, 0, 0],
    );

    expect(best).not.toBeNull();
    expect(best?.counselorId).toBe("a");
  });

  it("returns null when no counselor embedding is usable", () => {
    const best = pickBestCounselor(
      [{ id: "a", embedding: null }],
      [1, 0, 0],
    );

    expect(best).toBeNull();
  });
});
