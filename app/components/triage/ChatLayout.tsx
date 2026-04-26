"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import MatchingScreen from "./MatchingScreen";
import { type TriageResponse } from "@/lib/groq/triage";
import { dismissToast, showLoadingToast } from "@/app/components/notifications/ToastHost";

const INITIAL_PROMPT =
  `I'm Wumbo, and I'm here to listen and help you feel heard. It takes a lot of courage to reach out for support, and I'm here to help you get connected with someone who can.

How are you feeling right now?`;

type RenderMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
};

type MatchPhase = "searching" | "success" | "failed";

type ChatLayoutProps = {
  firstName?: string | null;
};

function getInitialPrompt(firstName?: string | null): string {
  if (!firstName) {
    return INITIAL_PROMPT;
  }

  return `I'm Wumbo, and I'm here to listen and help you feel heard. It takes a lot of courage to reach out for support, ${firstName}, and I'm here to help you get connected with someone who can.
How are you feeling right now?`;
}

export default function ChatLayout({ firstName }: ChatLayoutProps) {
  const router = useRouter();
  const initialPrompt = useMemo(() => getInitialPrompt(firstName), [firstName]);
  const [messages, setMessages] = useState<RenderMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchPhase, setMatchPhase] = useState<MatchPhase>("searching");
  const [matchError, setMatchError] = useState<string | null>(null);
  const [pendingMatchPayload, setPendingMatchPayload] = useState<{ symptoms: string[]; summary: string } | null>(null);

  // Ref for the scrollable chat history container
  const historyRef = useRef<HTMLDivElement>(null);

  const chatMessages = useMemo<RenderMessage[]>(() => {
    return messages.filter((message) => message.content.length > 0);
  }, [messages]);

  const displayedMessages = useMemo<RenderMessage[]>(() => {
    return chatMessages.filter(m => m.role === "user");
  }, [chatMessages]);

  const currentQuestion = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((message) => message.role === "ai");
    return lastAssistant ? lastAssistant.content : initialPrompt;
  }, [messages, initialPrompt]);

  const runMatching = async (payload: { symptoms: string[]; summary: string }) => {
    setIsMatching(true);
    setMatchPhase("searching");
    setMatchError(null);
    setPendingMatchPayload(payload);

    const toastId = showLoadingToast("match-search");

    const response = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      dismissToast(toastId);
      const body = await response.json().catch(() => null) as { error?: string } | null;
      throw new Error(body?.error ?? "Failed to find a counselor match");
    }

    setMatchPhase("success");
    router.replace("/?toast=match-found");
  };

  const retryMatching = async () => {
    if (!pendingMatchPayload) {
      return;
    }

    try {
      await runMatching(pendingMatchPayload);
    } catch (matchErr) {
      setMatchPhase("failed");
      setMatchError(matchErr instanceof Error ? matchErr.message : "Failed to find a counselor match");
    }
  };

  const handleSend = async (text: string) => {
    const userMessage: RenderMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          messages: nextMessages.map((message) => ({
            role: message.role === "ai" ? "assistant" : "user",
            parts: [{ type: "text", text: message.content }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch triage response");
      }

      const triageResponse: TriageResponse = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content: triageResponse.response,
        },
      ]);

      if (triageResponse.status === "complete") {
        const payload = {
          symptoms: triageResponse.symptoms,
          summary: triageResponse.summary ?? "Triage completed",
        };

        try {
          await runMatching(payload);
        } catch (matchErr) {
          setIsMatching(true);
          setMatchPhase("failed");
          setMatchError(matchErr instanceof Error ? matchErr.message : "Failed to find a counselor match");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to absolute bottom when displayedMessages changes
  useEffect(() => {
    const scrollToBottom = () => {
      if (historyRef.current) {
        // Force the container to scroll to its maximum absolute height
        historyRef.current.scrollTo({
          top: historyRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Run immediately, and also after a delay to account for CSS slide-in animations
    scrollToBottom();
    const timeout = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timeout);
  }, [displayedMessages]);

  if (isMatching) {
    return <MatchingScreen phase={matchPhase} errorMessage={matchError} onRetry={retryMatching} />;
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-transparent shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <Link
          href="/"
          className="p-2 ml-2 rounded-full hover:bg-gray-100 transition-colors text-charcoal shrink-0"
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
        <div className="shrink-0 flex flex-col items-center justify-center px-4 pt-2 pb-2 sm:pt-4 sm:pb-3 max-h-[50%] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="relative animate-bounce-light shrink-0" style={{ animationDuration: "2.5s" }}>
            {chatMessages.length < 1 && (<Image
              src="/wumbos/HiBubble.png"
              alt="Chat bubble"
              width={40}
              height={40}
              className="pointer-events-none absolute -top-2 -left-4 z-10 drop-shadow-lg"
              aria-hidden="true"
            />)}
            <Image
              src="/wumbos/WumboHappi.png"
              alt="Wumbo searching for your counselor"
              width={100}
              height={100}
              className="drop-shadow-xl"
              priority
              key={"new wumbo"}
            />
          </div>

          {/* AI Dialogue Bubble */}
          <div className="w-full mt-3 sm:mt-4 px-1 relative shrink-0">
            <div className="bg-white rounded-[20px] sm:rounded-3xl p-4 sm:p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border-2 border-sage/40 relative animate-in fade-in duration-300">
              {/* Triangular Speech Node */}
              <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-l-2 border-t-2 border-sage/40 rotate-45 rounded-tl-sm" />

              {isLoading ? (
                <div className="flex items-center justify-center space-x-1.5 py-3 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-sage animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-sage animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-sage animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <p className="font-body text-[12px] sm:text-[14px] text-charcoal font-medium leading-relaxed text-center relative z-10 whitespace-pre-wrap">
                  {currentQuestion}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 border-t-2 border-gray-200 bg-white/35">
          <div
            ref={historyRef}
            className="h-full overflow-y-auto px-4 py-3 sm:px-6 sm:py-4"
          >
            {displayedMessages.map((message) => (
              <ChatMessage key={message.id} role={message.role} content={message.content} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col border-t-2 border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] bg-white/50">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
