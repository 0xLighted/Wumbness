import ChatLayout from "../components/triage/ChatLayout";
import { getCurrentUser } from "@/lib/supabase/current-user";

export const metadata = {
  title: "Triage Chat",
};

export default async function TriagePage() {
  const user = await getCurrentUser();

  return (
    <main className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
      <ChatLayout firstName={user?.firstName ?? null} />
    </main>
  );
}
