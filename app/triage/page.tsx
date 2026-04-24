import ChatLayout from "../components/triage/ChatLayout";

export const metadata = {
  title: "Triage Chat",
};

export default function TriagePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center sm:p-4">
      <ChatLayout />
    </main>
  );
}
