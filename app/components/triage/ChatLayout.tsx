"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import MatchingScreen from "./MatchingScreen";
import { triageResponseSchema, type TriageResponse } from "@/lib/groq/triage";

const INITIAL_PROMPT =
  `I'm Wumbo, and I'm here to listen and help you feel heard. It takes a lot of courage to reach out for support, and I'm here to help you get connected with someone who can.

How are you feeling right now?`;

type TriageUIMessage = UIMessage<TriageResponse>;

type RenderMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

function getTextFromParts(parts: TriageUIMessage["parts"]) {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim();
}

export default function ChatLayout() {
  const [isMatching, setIsMatching] = useState(false);

  const { messages, sendMessage, status, error } = useChat<TriageUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/triage" }),
    messageMetadataSchema: triageResponseSchema,
  });

  const assistantMessages = useMemo(
    () => messages.filter((message) => message.role === "assistant"),
    [messages],
  );

  const chatMessages = useMemo<RenderMessage[]>(() => {
    return messages
      .map<RenderMessage>((message) => ({
        id: message.id,
        role: message.role === "assistant" ? "ai" : "user",
        content: getTextFromParts(message.parts),
      }))
      .filter((message) => message.content.length > 0);
  }, [messages]);

  const displayedMessages = useMemo<RenderMessage[]>(() => {
    const initialMessage: RenderMessage = {
      id: "initial-triage-prompt",
      role: "ai",
      content: INITIAL_PROMPT,
    };

    if (chatMessages.length === 0) {
      return [];
    }

    const lastMessage = chatMessages[chatMessages.length - 1];
    const historyWithoutCurrentQuestion =
      lastMessage.role === "ai" ? chatMessages.slice(0, -1) : chatMessages;

    const hasUserResponded = historyWithoutCurrentQuestion.some(
      (message) => message.role === "user",
    );

    return hasUserResponded
      ? [initialMessage, ...historyWithoutCurrentQuestion]
      : historyWithoutCurrentQuestion;
  }, [chatMessages]);

  const currentQuestion = useMemo(() => {
    const lastAssistant = assistantMessages[assistantMessages.length - 1];
    return lastAssistant ? getTextFromParts(lastAssistant.parts) : INITIAL_PROMPT;
  }, [assistantMessages]);

  useEffect(() => {
    const lastAssistant = assistantMessages[assistantMessages.length - 1];
    if (lastAssistant?.metadata?.status === "complete") {
      setIsMatching(true);
    }
  }, [assistantMessages]);

  const handleSend = (text: string) => {
    sendMessage({ text });
  };

  const isTyping = status === "submitted" || status === "streaming";

  if (isMatching) {
    return <MatchingScreen />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto bg-pearl shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-charcoal flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-heading font-bold text-xl text-sage">Wumbness Triage</h1>
        <div className="w-9" />
      </div>

      {error && (
        <div className="mx-4 mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again.
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="shrink-0 flex flex-col items-center justify-center px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
          <div className="relative animate-bounce" style={{ animationDuration: "2.5s" }}>
            <Image
              src="/WumboMascot.png"
              alt="Wumbo searching for your counselor"
              width={120}
              height={120}
              className="drop-shadow-xl"
              priority
            />
          </div>

          <div className="w-full max-w-sm mt-4 relative">
            {isTyping ? (
              <div className="bg-white rounded-3xl rounded-t-3xl px-6 py-5 shadow-sm border border-gray-100 relative animate-in fade-in duration-200">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />
                <div className="flex items-center justify-center space-x-1.5 py-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl px-6 py-5 shadow-sm border border-gray-100 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />
                <p className="font-body text-[15px] text-charcoal leading-relaxed text-center relative z-10">
                  {currentQuestion}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 border-t-2 border-gray-200 bg-white/35">
          <div className="h-full overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
            {displayedMessages.map((message) => (
              <ChatMessage key={message.id} role={message.role} content={message.content} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col border-t-2 border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] bg-white/50">
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
