interface RoomMessageProps {
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
  isRead?: boolean;
}

export default function RoomMessage({ content, timestamp, isOwnMessage, isRead }: RoomMessageProps) {
  return (
    <div className={`flex w-full mb-5 ${isOwnMessage ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"}`}>
        
        {/* Bubble */}
        <div
          className={`px-4 py-3 sm:px-5 sm:py-3 rounded-3xl relative shadow-sm ${
            isOwnMessage
              ? "bg-sage text-white rounded-tr-sm"
              : "bg-white text-charcoal border border-gray-100 rounded-tl-sm"
          }`}
        >
          <p className="whitespace-pre-wrap font-body text-[15px] leading-relaxed wrap-break-word">
            {content}
          </p>
        </div>

        {/* Metadata underneath bubble */}
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400">
            {timestamp}
          </span>
          
          {isOwnMessage && typeof isRead === "boolean" && (
            <span className={`text-[10px] sm:text-xs font-bold ml-1 ${isRead ? "text-sage" : "text-gray-300"}`}>
               {isRead ? "Read" : "Sent"}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
