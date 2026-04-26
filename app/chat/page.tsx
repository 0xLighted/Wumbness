import { redirect } from "next/navigation";

import { getDefaultChatMatchId } from "@/lib/supabase/chat";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Chat Room",
};

export default async function ChatPage() {
  const defaultMatchId = await getDefaultChatMatchId();
  if (!defaultMatchId) {
    redirect("/");
  }

  redirect(`/chat/${defaultMatchId}`);
}
