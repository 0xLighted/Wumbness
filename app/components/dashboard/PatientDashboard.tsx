"use client";
import Link from "next/link";
import type { PatientMatchCard, PatientPastMatchCard } from "@/lib/supabase/matches";

interface PatientDashboardProps {
  isFirstTime?: boolean;
  firstName?: string | null;
  matchedCounselor?: PatientMatchCard | null;
  pastMatches?: PatientPastMatchCard[];
}

function formatClosedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Previous match";
  }

  return `Closed ${date.toLocaleDateString()}`;
}

export default function PatientDashboard({
  isFirstTime = false,
  firstName,
  matchedCounselor,
  pastMatches = [],
}: PatientDashboardProps) {

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="mb-2">
        <h1 className="font-heading text-3xl font-bold text-charcoal">
          {firstName ? `Hello, ${firstName}` : "Hello there,"}
        </h1>
        <p className="text-gray-500 font-sub text-2xl leading-none">Your safe space awaits.</p>
      </div>

      {/* Conditional: First-Time Start Now vs Returning Counselor Card */}
      {isFirstTime ? (
        /* Start Now — First-Time Patient CTA */
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-20 h-20 rounded-full bg-sage/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-charcoal mb-1">Find Your Counselor</h2>
              <p className="text-sm font-body text-gray-500 leading-relaxed max-w-xs mx-auto">
                Answer a few quick questions so we can match you with the perfect counselor for your needs.
              </p>
            </div>
            <Link
              href="/triage"
              className="w-full bg-sage hover:bg-[#84a874] text-white font-bold py-4 rounded-2xl shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2 mt-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Start Now
            </Link>
          </div>
        </div>
      ) : (
        /* Returning Patient — Counselor Match Card */
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-brown flex items-center justify-center shadow-md">
                <svg viewBox="0 0 100 100" className="w-10 h-10 fill-white">
                  <path d="M50 8C27 8 8 27 8 50s19 42 42 42 42-19 42-42S73 8 50 8zm0 76c-19 0-34-15-34-34S31 16 50 16s34 15 34 34-15 34-34 34z" />
                  <path d="M35 45c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5zm30 0c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5zm-15 15c-10 0-18 6-22 15h44c-4-9-12-15-22-15z" />
                </svg>
              </div>
              {matchedCounselor?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-bold text-xl text-charcoal">
                {matchedCounselor?.counselorName ?? "Assigned Counselor"}
              </h2>
              <p className="text-sm font-body text-gray-500 mt-1 leading-relaxed">
                {matchedCounselor?.counselorBio ?? "Your counselor match is ready."}
              </p>
            </div>
          </div>

          <Link
            href={matchedCounselor ? `/chat/${matchedCounselor.matchId}` : "/"}
            className="mt-5 w-full bg-sage hover:bg-[#84a874] text-white font-bold py-4 rounded-2xl shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Resume Chat
          </Link>
        </div>
      )}

      {pastMatches.length > 0 && (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
          <h2 className="font-heading font-bold text-xl text-charcoal mb-4">Past Chats</h2>
          <div className="flex flex-col gap-3">
            {pastMatches.map((match) => (
              <Link
                key={match.matchId}
                href={`/chat/${match.matchId}`}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-pearl/40 px-4 py-3 hover:bg-pearl/70 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-charcoal">{match.counselorName}</p>
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
