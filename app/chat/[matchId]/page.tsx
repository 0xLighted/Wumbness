import { notFound } from "next/navigation";

import ChatRoomLayout from "@/app/components/chat/ChatRoomLayout";
import { getChatSession } from "@/lib/supabase/chat";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Chat Room",
};

export default async function ChatMatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const session = await getChatSession(matchId);

  if (!session) {
    notFound();
  }

  return (
    <main className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
      <ChatRoomLayout
        matchId={session.context.matchId}
        currentUserId={session.context.currentUserId}
        peerName={session.context.peerName}
        status={session.context.status}
        initialMessages={session.messages}
      />
    </main>
  );
}
