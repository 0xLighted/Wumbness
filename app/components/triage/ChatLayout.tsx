"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ChatInput from "./ChatInput";
import MatchingScreen from "./MatchingScreen";

const AI_QUESTIONS = [
  "Hello! I\u0027m Wumbo, and I\u0027m here to help find the perfect counselor for you. What brings you here today?",
  "I hear you. That sounds really tough. Can you tell me a bit more about how this is affecting your daily life?",
  "Thank you for sharing that with me. Have you been experiencing these feelings for a long time?",
];

type UserMessage = {
  id: string;
  content: string;
};

export default function ChatLayout() {
  const [currentQuestion, setCurrentQuestion] = useState(AI_QUESTIONS[0]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  // Key to force re-mount of the dialogue bubble for animation
  const [bubbleKey, setBubbleKey] = useState(0);

  // Subtle idle bounce on mascot
  const [mascotBounce, setMascotBounce] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setMascotBounce(true);
      setTimeout(() => setMascotBounce(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = (text: string) => {
    const newMsg: UserMessage = { id: Date.now().toString(), content: text };
    setUserMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    // Mock API — in production POST to /api/triage
    setTimeout(() => {
      setIsTyping(false);
      const nextIndex = questionIndex + 1;

      if (nextIndex >= AI_QUESTIONS.length) {
        setIsMatching(true);
        setTimeout(() => {
          console.log("Mock routing to matched dashboard...");
        }, 5000);
      } else {
        setQuestionIndex(nextIndex);
        setCurrentQuestion(AI_QUESTIONS[nextIndex]);
        setBubbleKey((k) => k + 1);
      }
    }, 1500);
  };

  if (isMatching) {
    return <MatchingScreen />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto bg-pearl shadow-md relative overflow-hidden">
      {/* Header */}
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

      {/* ===== UPPER CONTAINER: Mascot + Dialogue Bubble ===== */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Mascot */}
        <div
          className={`relative transition-transform duration-500 ease-out ${
            mascotBounce ? "-translate-y-1" : "translate-y-0"
          }`}
        >
          <Image
            src="/WumboMascot.png"
            alt="Wumbo Mascot"
            width={140}
            height={140}
            className="drop-shadow-xl"
            priority
          />
        </div>

        {/* Dialogue Bubble — RPG style, replaces each question */}
        <div className="w-full max-w-sm mt-4 relative">
          {isTyping ? (
            /* Typing indicator inside dialogue bubble */
            <div className="bg-white rounded-3xl rounded-t-3xl px-6 py-5 shadow-sm border border-gray-100 relative animate-in fade-in duration-200">
              {/* Triangle pointer */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />
              <div className="flex items-center justify-center space-x-1.5 py-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            /* Current question */
            <div
              key={bubbleKey}
              className="bg-white rounded-3xl px-6 py-5 shadow-sm border border-gray-100 relative animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {/* Triangle pointer pointing up towards mascot */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />
              <p className="font-body text-[15px] text-charcoal leading-relaxed text-center relative z-10">
                {currentQuestion}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== LOWER CONTAINER: User Messages + Input ===== */}
      <div className="flex flex-col border-t-2 border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] bg-white/50">
        {/* Scrollable user messages */}
        {userMessages.length > 0 && (
          <div className="max-h-32 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {userMessages.map((msg) => (
              <div key={msg.id} className="flex w-full justify-end animate-in fade-in slide-in-from-bottom-1 duration-300">
                <div className="max-w-[75%] px-4 py-3 sm:px-5 sm:py-3 rounded-3xl rounded-tr-sm bg-sage text-white shadow-sm">
                  <p className="font-body text-[15px] leading-relaxed break-words">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
