import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateTriageResponse,
  type TriageMessage,
} from "@/lib/groq/triage";

const triageRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        parts: z.array(
          z.union([
            z.object({ type: z.literal("text"), text: z.string() }),
            z.object({ type: z.string() }).passthrough(),
          ]),
        ),
      }),
    )
    .min(1),
});

function extractText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join(" ")
    .trim();
}

function toTriageMessages(messages: Array<{ role: "user" | "assistant"; parts: Array<{ type: string; text?: string }> }>): TriageMessage[] {
  return messages
    .map<TriageMessage | null>((message) => {
      const content = extractText(message.parts);
      if (!content) {
        return null;
      }

      return {
        role: message.role === "assistant" ? "ai" : "user",
        content,
      };
    })
    .filter((message): message is TriageMessage => message !== null);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = triageRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid triage request payload" }, { status: 400 });
    }

    const messages = toTriageMessages(parsed.data.messages);
    const triageResponse = await generateTriageResponse(messages);
    return NextResponse.json(triageResponse);
  } catch {
    return NextResponse.json({ error: "Failed to generate triage response" }, { status: 500 });
  }
}
