"use client";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import MatchingScreen from "./MatchingScreen";

type Message = {
  id: string;
  role: "ai" | "user";
  content: string;
};

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      content: "Hello! Wumbo here to help you find the absolute best counselor for your needs. We just need to go through a few quick questions to understand how you&apos;re feeling right now. What brings you here today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    // 1. Add user message
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    // 2. Mock API logic
    // In production, this would make a POST to /api/triage
    setTimeout(() => {
      setIsTyping(false);

      const newCount = questionCount + 1;
      setQuestionCount(newCount);

      if (newCount >= 3) {
        // Triage completed, trigger match logic stub
        setIsMatching(true);
        // The /api/triage would return the JSON and we'd proceed to dashboard
        // Stubbing out exit:
        setTimeout(() => {
          // e.g. router.push('/patient/dashboard')
          console.log("Mock routing to matched dashboard...")
        }, 5000);
      } else {
        // AI reply stub
        const aiReplies = [
          "I hear you. That sounds really tough. Can you tell me a little bit more about how this is affecting your daily life?",
          "Thank you for sharing that with me. Have you been experiencing these feelings for a long time?",
        ];

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: aiReplies[newCount - 1] || "Thanks for letting me know.",
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    }, 1500); // Wait 1.5s to mockup typing/inference
  };

  if (isMatching) {
    return <MatchingScreen />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto bg-pearl shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center p-4 bg-white/80 backdrop-blur-md shadow-sm z-10">
        <h1 className="font-heading font-bold text-xl text-sage">Wumbness Triage</h1>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 scoll-smooth">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}

        {/* Typing Bubble */}
        {isTyping && (
          <div className="flex w-full mb-4 justify-start animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-sage flex-shrink-0 flex items-center justify-center mr-3 mt-1 shadow-sm opacity-50 pulse">
              <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
                <path d="M41 9C55-5 83 2 92 19c9 16 3 39-10 49-14 11-37 17-53 6C13 63-1 43 0 25 1 6 25 24 41 9z" />
              </svg>
            </div>
            <div className="px-5 py-4 bg-white border border-gray-100 rounded-3xl rounded-tl-sm flex items-center justify-center space-x-1 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
