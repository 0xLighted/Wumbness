interface ChatMessageProps {
  role: "ai" | "user";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isAI = role === "ai";

  return (
    <div
      className={`flex w-full mb-4 ${
        isAI ? "justify-start" : "justify-end"
      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {isAI && (
        <div className="w-10 h-10 rounded-full bg-sage flex-shrink-0 flex items-center justify-center mr-3 mt-1 shadow-sm">
          {/* Abstract SVG Blob for Avatar */}
          <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
            <path d="M41 9C55-5 83 2 92 19c9 16 3 39-10 49-14 11-37 17-53 6C13 63-1 43 0 25 1 6 25 24 41 9z" />
          </svg>
        </div>
      )}

      <div
        className={`max-w-[75%] px-5 py-3 rounded-3xl ${
          isAI
            ? "bg-white border border-gray-100 text-charcoal shadow-sm rounded-tl-sm"
            : "bg-sage text-white shadow-md rounded-tr-sm"
        }`}
      >
        <p className="whitespace-pre-wrap font-body text-sm leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
