import RoomMessageSkeleton from "@/app/components/chat/RoomMessageSkeleton";
export default function Loading() {
  return (
    <main className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-transparent shadow-md relative overflow-hidden">
        <div className="flex items-center px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
          <div className="ml-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-pearl border border-sage/20 animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-28 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3 w-16 rounded-full bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
          <div className="flex flex-col flex-1 w-full relative">
            <RoomMessageSkeleton isOwnMessage={false} widthClassName="w-52 sm:w-64" />
            <RoomMessageSkeleton isOwnMessage={true} widthClassName="w-40 sm:w-52" />
            <RoomMessageSkeleton isOwnMessage={false} widthClassName="w-60 sm:w-72" />
            <RoomMessageSkeleton isOwnMessage={true} widthClassName="w-36 sm:w-44" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 relative z-50 w-full">
          <div className="flex gap-2 items-end max-w-2xl mx-auto w-full">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-pearl animate-pulse shrink-0" />
            <div className="flex-1 h-11 sm:h-12 rounded-3xl bg-gray-100 border border-gray-200 animate-pulse" />
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-sage/40 animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    </main>
  );
}
