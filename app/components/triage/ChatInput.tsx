"use client";
import { useState } from "react";

const QUICK_REPLIES = [
  "School stress",
  "Family issues",
  "Just feeling down",
  "Anxiety",
  "Relationships",
];

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleQuickReply = (reply: string) => {
    if (!disabled) {
      onSend(reply);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border-t border-gray-100 pt-2 pb-4 px-4 bg-opacity-90 backdrop-blur-md">
      {/* Quick Replies */}
      <div className="flex overflow-x-auto gap-2 pb-3 no-scrollbar scroll-smooth">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => handleQuickReply(reply)}
            disabled={disabled}
            className="whitespace-nowrap px-4 py-2 bg-pearl text-charcoal text-sm font-bold border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder="Type your message..."
          className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all block w-full text-sm"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="w-12 h-12 rounded-full bg-charcoal hover:bg-black text-white flex justify-center items-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
