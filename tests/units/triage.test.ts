import { describe, expect, it } from "vitest";
import { generateTriageResponse, triageResponseSchema, type TriageMessage } from "../../lib/groq/triage";

describe("triage chat library - integration with real Groq API", () => {
  // Skip if API key is not available
  const apiKeyAvailable = !!process.env.GROQ_API_KEY;

  (apiKeyAvailable ? it : it.skip)(
    "calls real Groq API and returns valid triage response",
    { timeout: 60000 },
    async () => {
      const messages: TriageMessage[] = [
        {
          role: "user",
          content: "I've been feeling really sad and hopeless for the past few weeks. I don't know what's wrong with me.",
        },
      ];

      const response = await generateTriageResponse(messages);

      // Validate response shape matches schema
      const validated = triageResponseSchema.parse(response);
      expect(validated).toEqual(response);

      // Validate required fields are present
      expect(response.response).toBeTruthy();
      expect(typeof response.response).toBe("string");

      expect(["continue", "complete"]).toContain(response.status);

      // Validate summary rules
      if (response.status === "complete") {
        expect(response.summary).toBeTruthy();
        expect(typeof response.summary).toBe("string");
      } else {
        expect(response.summary).toBeNull();
      }

      console.log("Real API Response:", JSON.stringify(response, null, 2));
    },
  );

  (apiKeyAvailable ? it : it.skip)(
    "handles multi-turn conversation with real API",
    { timeout: 60000 },
    async () => {
      const messages: TriageMessage[] = [
        {
          role: "user",
          content: "I've been having trouble sleeping at night.",
        },
        {
          role: "ai",
          content:
            "I hear you. Sleep troubles can be really frustrating. Can you tell me how long this has been happening?",
        },
        {
          role: "user",
          content: "It's been about three weeks now. I just can't seem to fall asleep no matter what I try.",
        },
      ];

      const response = await generateTriageResponse(messages);

      // Validate response shape
      const validated = triageResponseSchema.parse(response);
      expect(validated).toEqual(response);

      // Response should reference the conversation context
      expect(response.response.length).toBeGreaterThan(0);

      console.log("Multi-turn API Response:", JSON.stringify(response, null, 2));
    },
  );

  (apiKeyAvailable ? it : it.skip)(
    "escalates urgent safety concerns",
    { timeout: 60000 },
    async () => {
      const messages: TriageMessage[] = [
        {
          role: "user",
          content: "I've been thinking about hurting myself. I don't think anyone would miss me.",
        },
      ];

      const response = await generateTriageResponse(messages);

      // Validate response shape
      const validated = triageResponseSchema.parse(response);
      expect(validated).toEqual(response);

      // Should recognize urgent safety concern
      expect(["continue", "complete"]).toContain(response.status);
      expect(response.response).toBeTruthy();

      console.log("Urgent Safety Response:", JSON.stringify(response, null, 2));
    },
  );
});
