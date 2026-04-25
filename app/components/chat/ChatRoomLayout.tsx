"use client";
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import RoomMessage from "./RoomMessage";
import RoomInput from "./RoomInput";

type RoomMessageData = {
  id: string;
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
  isRead: boolean;
};

export default function ChatRoomLayout() {
  // Temporary hardcoded profile data for demo
  const [messages, setMessages] = useState<RoomMessageData[]>([
    {
      id: "1",
      content: "Hi there. I'm Sarah, I've read your summary and I'm here to support you. How are you holding up right now?",
      timestamp: "10:42 AM",
      isOwnMessage: false,
      isRead: true,
    },
    {
      id: "2",
      content: "Hi Sarah. honestly I'm feeling super overwhelmed with my finals coming up. I can&apos;t sleep.",
      timestamp: "10:45 AM",
      isOwnMessage: true,
      isRead: true,
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    // 1. Add user message optimistic update
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: RoomMessageData = {
      id: Date.now().toString(),
      content: text,
      timestamp: timeString,
      isOwnMessage: true,
      isRead: false
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    // 2. Mock receiving a reply via Supabase Realtime later on
    setTimeout(() => {
      setIsTyping(false);
      const replyTime = new Date();
      const replyString = replyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newReplyMsg: RoomMessageData = {
        id: (Date.now() + 1).toString(),
        content: "That&apos;s completely understandable. The pressure of finals is a lot to carry on your own. Have you tried any breathing exercises before bed?",
        timestamp: replyString,
        isOwnMessage: false,
        isRead: true
      };

      // Mocking marking the previous messages as read
      setMessages((prev) => {
        const mapped = prev.map(m => m.isOwnMessage ? { ...m, isRead: true } : m);
        return [...mapped, newReplyMsg];
      });
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-pearl shadow-md relative overflow-hidden">
      <ChatHeader recipientName="Sarah Jenkins, LSW" isOnline={true} />

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
        <div className="flex flex-col flex-1 w-full relative">
          {messages.map((msg) => (
            <RoomMessage
              key={msg.id}
              content={msg.content}
              timestamp={msg.timestamp}
              isOwnMessage={msg.isOwnMessage}
              isRead={msg.isRead}
            />
          ))}

          {/* Typing Indicator — identical to triage */}
          {isTyping && (
            <div className="flex w-full mb-5 justify-start animate-in fade-in ml-1">
              <div className="px-4 py-3 bg-white border border-gray-100 rounded-3xl rounded-tl-sm flex items-center justify-center space-x-1 shadow-sm h-[44px]">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <RoomInput onSend={handleSend} disabled={false} />
    </div>
  );
}
