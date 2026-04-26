import Link from "next/link";
import type { CounselorPastMatchItem, CounselorQueueItem } from "@/lib/supabase/matches";
import ConcludeMatchButton from "./ConcludeMatchButton";

interface CounselorDashboardProps {
  firstName?: string | null;
  matchedPatients: CounselorQueueItem[];
  pastMatches?: CounselorPastMatchItem[];
}

function formatClosedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Previous match";
  }

  return `Closed ${date.toLocaleDateString()}`;
}

export default function CounselorDashboard({
  firstName,
  matchedPatients,
  pastMatches = [],
}: CounselorDashboardProps) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-2">
        <h1 className="font-heading text-3xl font-bold text-charcoal">
          {firstName ? `Hello, ${firstName}` : "Hello there,"}
        </h1>
        <p className="text-gray-500 font-sub text-2xl leading-none">Your safe space awaits.</p>
      </div>
      
      {/* Matched Patients Queue */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">Your Patient Queue ({matchedPatients.length})</h2>
        {matchedPatients.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 text-gray-500 text-sm">
            No active patient matches yet. New matches will appear here after triage completion.
          </div>
        ) : (
        <div className="flex flex-col gap-4">
          {matchedPatients.map((patient) => (
            <div key={patient.matchId} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative overflow-hidden">
              {patient.unread > 0 && (
                <div className="absolute top-0 right-0 bg-sage text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                  {patient.unread} new messages
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pearl rounded-full flex items-center justify-center font-heading font-black text-xl text-sage border border-sage/20">
                    {patient.alias.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-lg leading-tight">{patient.alias}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-pearl/50 rounded-2xl p-4 mb-4">
                <h4 className="text-xs font-bold text-charcoal mb-2 uppercase tracking-wide">AI Triage Summary</h4>
                <p className="text-sm text-gray-600 font-body leading-relaxed">{patient.summary}</p>
                {patient.symptoms.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {patient.symptoms.map((symptom) => (
                      <span
                        key={`${patient.matchId}-${symptom}`}
                        className="inline-flex items-center rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold text-sage"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/chat/${patient.matchId}`}
                  className="flex-1 bg-brown hover:bg-brown/80 text-white font-bold py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] text-center"
                >
                  Enter Chat
                </Link>
                <ConcludeMatchButton matchId={patient.matchId} />
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {pastMatches.length > 0 && (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
          <h2 className="font-heading text-xl font-bold text-charcoal mb-4">Past Chats</h2>
          <div className="flex flex-col gap-3">
            {pastMatches.map((match) => (
              <Link
                key={match.matchId}
                href={`/chat/${match.matchId}`}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-pearl/40 px-4 py-3 hover:bg-pearl/70 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-charcoal">{match.alias}</p>
                  <p className="text-xs font-medium text-gray-500">{formatClosedAt(match.closedAt)}</p>
                </div>
                <span className="text-xs font-bold text-sage">View</span>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
