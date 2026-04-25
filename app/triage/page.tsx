import ChatLayout from "../components/triage/ChatLayout";
import { getCurrentUser } from "@/lib/supabase/current-user";

export const metadata = {
  title: "Triage Chat",
};

export default async function TriagePage() {
  const user = await getCurrentUser();

  return (
    <main className="h-dvh w-full bg-pearl flex items-center justify-center overflow-hidden overscroll-none">
      <ChatLayout firstName={user?.firstName ?? null} />
    </main>
  );
}
