import { generateText, Output } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
// import { SYMPTOMS } from "@/app/components/triage/data";
import { SYMPTOMS } from "../../app/components/triage/data";

export type TriageRole = "user" | "ai";

export type TriageMessage = {
	role: TriageRole;
	content: string;
};

const triageSymptomSchema = z.enum(SYMPTOMS);
export const triageStatusSchema = z.enum(["continue", "complete"]);

export const triageResponseSchema = z.object({
	response: z.string().min(1),
	status: triageStatusSchema,
	summary: z.union([z.string(), z.null()]),
	symptoms: z.array(triageSymptomSchema),
}).superRefine((value, context) => {
	if (value.status === "complete" && !value.summary) {
		context.addIssue({
			code: 'custom',
			path: ["summary"],
			message: "summary is required when status is complete",
		});
	}

	if (value.status !== "complete" && value.summary !== null) {
		context.addIssue({
			code: 'custom',
			path: ["summary"],
			message: "summary must be null unless status is complete",
		});
	}

	if (value.status === "complete" && value.symptoms.length < 1) {
		context.addIssue({
			code: 'custom',
			path: ["symptoms"],
			message: "at least one symptom is required when status is complete",
		});
	}

	if (value.status !== "complete" && value.symptoms.length > 0) {
		context.addIssue({
			code: 'custom',
			path: ["symptoms"],
			message: "symptoms must be empty unless status is complete",
		});
	}
});

export type TriageResponse = z.infer<typeof triageResponseSchema>;

const TRIAGE_SYSTEM_PROMPT = `
**Role & Purpose:**
You are Wumbo, a warm, empathetic triage assistant for a youth mental wellbeing platform. Your goal is to gently collect as much information as possible about the user's emotional state to brief a human counselor. You are a supportive guide, not a therapist or doctor.

**Core Guidelines:**
1. **Tone & Empathy:** Validate feelings without judgment. Use simple, friendly language. Do not shame, argue, or use clinical jargon.
2. **Assessment:** Loosely base questions on the DSM-5 Cross-Cutting Symptom Measure, but humanize them for youth individuals.
3. **Pacing:** Ask EXACTLY ONE gentle follow-up question per response. Never overwhelm the user with multiple questions or techniques.
4. **No Diagnosing:** Never label the user (e.g., "you have depression"). Use phrases like "this sounds similar to..." Provide NO medical or legal advice. 
5. **Safety:** If the user indicates self-harm, abuse, or severe crisis, gently acknowledge their pain and instruct them to contact local emergency services or a crisis line immediately.

**Response Format:**
Every standard response must strictly contain:
1. Empathetic reflection of their feelings.
2. A gentle interpretation of their experience.
3. One follow-up question.

**Stopping Rule & Handoff (CRITICAL):**
When sufficient information is gathered, the user has fully vented, or they begin repeating the same issues:
1. Gently explain that you have enough information to connect them with professional help and end the conversation.
2. Set status to complete.
3. Provide a concise summary in the summary field.
4. Provide at least one symptom in the symptoms array using ONLY these exact values: ${SYMPTOMS.join(", ")}.

When status is continue:
- summary must be null
- symptoms must be an empty array
`;

const TRIAGE_MODEL = process.env.GROQ_TRIAGE_MODEL ?? "meta-llama/llama-4-scout-17b-16e-instruct";

function normalizeRole(role: TriageRole): "user" | "assistant" {
  return role === "user" ? "user" : "assistant";
}

function normalizeMessages(messages: TriageMessage[]): Array<{ role: "user" | "assistant"; content: string }> {
  return messages
    .filter((message) => message.content.trim().length > 0)
    .map((message) => ({
      role: normalizeRole(message.role),
      content: normalizeContent(message.content),
    }));
}

function normalizeContent(content: string): string {
	const collapsed = content.trim().replace(/\s+/g, " ");
	if (collapsed.length === 0) {
		return collapsed;
	}

	const capitalized = collapsed.charAt(0).toUpperCase() + collapsed.slice(1);
	if (/[.!?]$/.test(capitalized)) {
		return capitalized;
	}

	return `${capitalized}.`;
}

export async function generateTriageResponse(messages: TriageMessage[]): Promise<TriageResponse> {
	const conversation = normalizeMessages(messages);

	const result = await generateText({
		model: groq(TRIAGE_MODEL),
		output: Output.object({
			schema: triageResponseSchema,
		}),
		system: TRIAGE_SYSTEM_PROMPT,
		messages: conversation,
		temperature: 0.4,
	});

	return result.output;
}

export function shouldContinueTriage(response: TriageResponse) {
	return response.status === "continue";
}

export function isTriageComplete(response: TriageResponse) {
	return response.status === "complete";
}
