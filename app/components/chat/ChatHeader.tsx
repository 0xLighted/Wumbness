"use client";
import Link from "next/link";

interface ChatHeaderProps {
  recipientName: string;
  isOnline?: boolean;
}

export default function ChatHeader({ recipientName, isOnline }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-charcoal flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Recipient Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-pearl rounded-xl flex items-center justify-center font-heading font-black text-lg text-sage border border-sage/20 shrink-0">
            {recipientName[0]}
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="font-heading font-bold text-charcoal text-base leading-tight">
              {recipientName}
            </h2>
            <span className="text-xs font-bold text-gray-400">
              {isOnline ? "Active now" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* SOS Button */}
      <button className="bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-red-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        SOS / Crisis
      </button>

    </div>
  );
}
