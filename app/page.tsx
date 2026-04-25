import AppNavigation from "./components/navigation/AppNavigation";
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
    <div className="min-h-screen bg-pearl">
      <AppNavigation />

      <main className="w-full flex-1 sm:pt-24 pb-20 p-4 sm:p-6">
        {role === "patient" ? (
          <PatientDashboard isFirstTime={isFirstTime} firstName={firstName} />
        ) : (
          <CounselorDashboard firstName={firstName} />
        )}
      </main>
    </div>
  );
}
