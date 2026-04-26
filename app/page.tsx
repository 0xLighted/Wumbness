import AppNavigation from "./components/navigation/AppNavigation";
import PatientDashboard from "./components/dashboard/PatientDashboard";
import CounselorDashboard from "./components/dashboard/CounselorDashboard";
import { getCurrentUser } from "@/lib/supabase/current-user";
import {
  getCounselorClosedQueue,
  getCounselorQueue,
  getPatientActiveMatch,
  getPatientClosedMatches,
} from "@/lib/supabase/matches";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const firstName = user.firstName;

  if (user.role === "patient") {
    const [activeMatch, pastMatches] = await Promise.all([
      getPatientActiveMatch(user.id),
      getPatientClosedMatches(user.id),
    ]);

    return (
      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="w-full min-h-full p-4 sm:p-6 pb-20">
          <PatientDashboard
            isFirstTime={!activeMatch}
            firstName={firstName}
            matchedCounselor={activeMatch}
            pastMatches={pastMatches}
          />
        </main>
      </div>
    );
  }

  const [matchedPatients, pastMatches] = await Promise.all([
    getCounselorQueue(user.id),
    getCounselorClosedQueue(user.id),
  ]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <main className="w-full min-h-full p-4 sm:p-6 pb-20">
        <CounselorDashboard
          firstName={firstName}
          matchedPatients={matchedPatients}
          pastMatches={pastMatches}
        />
      </main>
    </div>
  );
}
