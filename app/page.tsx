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
      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="w-full min-h-full p-4 sm:p-6 pb-20">
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
    <div className="flex-1 min-h-0 overflow-y-auto">
      <main className="w-full min-h-full p-4 sm:p-6 pb-20">
        <CounselorDashboard firstName={firstName} matchedPatients={matchedPatients} />
      </main>
    </div>
  );
}
