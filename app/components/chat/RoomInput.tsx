"use client";
import { useState } from "react";

interface RoomInputProps {
  onSend: (message: string) => void | Promise<void>;
  disabled?: boolean;
}

export default function RoomInput({ onSend, disabled }: RoomInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      try {
        await onSend(text.trim());
        setText("");
      } catch {
        // Parent handles send errors and user feedback.
      }
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 relative z-50 w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-2xl mx-auto w-full">
        {/* Attachment Stub */}
        <button
          type="button"
          disabled={disabled}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-pearl text-gray-400 hover:text-sage hover:bg-sage/10 flex justify-center items-center shrink-0 disabled:opacity-50 transition-colors"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
            onKeyDown={async (e) => {
             if (e.key === 'Enter' && !e.shiftKey) {
               e.preventDefault();
               await handleSubmit(e);
             }
          }}
          disabled={disabled}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 px-4 py-3 sm:px-5 sm:py-3 bg-gray-50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all text-[15px] resize-none max-h-32 min-h-11 sm:min-h-12"
          style={{ fieldSizing: "content" } as any} // Requires modern browser or polyfill, fine for typical tailwind use cases if supported, or rely on rows.
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-sage hover:bg-[#84a874] text-white flex justify-center items-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <svg
            className="w-5 h-5"
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
