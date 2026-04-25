import ChatRoomLayout from "../components/chat/ChatRoomLayout";

export const metadata = {
  title: "Chat Room",
};

export default function ChatPage() {
  return (
    <main className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
      <ChatRoomLayout />
    </main>
  );
}
