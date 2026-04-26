import AppNavigation from "./components/navigation/AppNavigation";
import PatientDashboard from "./components/dashboard/PatientDashboard";
import CounselorDashboard from "./components/dashboard/CounselorDashboard";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { getCounselorQueue, getPatientActiveMatch } from "@/lib/supabase/matches";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const firstName = user.firstName;

  if (user.role === "patient") {
    const activeMatch = await getPatientActiveMatch(user.id);

    return (
      <div className="min-h-screen bg-pearl">
        <AppNavigation />

        <main className="w-full flex-1 sm:pt-24 pb-20 p-4 sm:p-6">
          <PatientDashboard
            isFirstTime={!activeMatch}
            firstName={firstName}
            matchedCounselor={activeMatch}
          />
        </main>
      </div>
    );
  }

  const matchedPatients = await getCounselorQueue(user.id);

  return (
    <div className="min-h-screen bg-pearl">
      <AppNavigation />

      <main className="w-full flex-1 sm:pt-24 pb-20 p-4 sm:p-6">
        <CounselorDashboard firstName={firstName} matchedPatients={matchedPatients} />
      </main>
    </div>
  );
}
