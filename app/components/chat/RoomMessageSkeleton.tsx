type RoomMessageSkeletonProps = {
  isOwnMessage?: boolean;
  widthClassName?: string;
};

export default function RoomMessageSkeleton({
  isOwnMessage = false,
  widthClassName = "w-44 sm:w-56",
}: RoomMessageSkeletonProps) {
  return (
    <div className={`flex w-full mb-5 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"}`}>
        <div
          className={`h-12 sm:h-14 ${widthClassName} rounded-3xl animate-pulse ${
            isOwnMessage ? "bg-sage/30 rounded-tr-sm" : "bg-white/90 border border-gray-100 rounded-tl-sm"
          }`}
        />
        <div className="mt-2 h-3 w-14 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
