import ChatRoomLayout from "../components/chat/ChatRoomLayout";

export const metadata = {
  title: "Chat Room",
};

export default function ChatPage() {
  return (
    <main className="h-[100dvh] w-full bg-pearl flex items-center justify-center overflow-hidden overscroll-none">
      <ChatRoomLayout />
    </main>
  );
}
