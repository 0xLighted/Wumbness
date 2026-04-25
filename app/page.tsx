import PatientDashboard from "./components/dashboard/PatientDashboard";
import CounselorDashboard from "./components/dashboard/CounselorDashboard";
import { getCurrentUser } from "@/lib/supabase/current-user";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const role = user.role;
  const firstName = user.firstName;
  const isFirstTime = true;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <main className="w-full min-h-full p-4 sm:p-6 pb-20">
        {role === "patient" ? (
          <PatientDashboard isFirstTime={isFirstTime} firstName={firstName} />
        ) : (
          <CounselorDashboard firstName={firstName} />
        )}
      </main>
    </div>
  );
}
