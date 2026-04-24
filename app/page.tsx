"use client";
import { useState } from "react";
import AppNavigation from "./components/navigation/AppNavigation";
import PatientDashboard from "./components/dashboard/PatientDashboard";
import CounselorDashboard from "./components/dashboard/CounselorDashboard";

export default function HomePage() {
  // TODO: Replace with Supabase Auth session check.
  // If not authenticated, redirect to /auth.
  // const session = useSupabaseSession();
  // if (!session) redirect('/auth');

  // Temporary role toggle for hackathon demo
  const [role, setRole] = useState<"patient" | "counselor">("patient");

  // Temporary first-time flag for demo (toggle to see Start Now vs Resume Chat)
  const [isFirstTime, setIsFirstTime] = useState(true);

  return (
    <div className="min-h-screen bg-pearl">
      <AppNavigation />

      {/* Main Content — uniform padding: sm:pt-24 for desktop navbar, pb-20 for mobile tab bar */}
      <main className="w-full flex-1 sm:pt-24 pb-20 p-4 sm:p-6">

        {/* Desktop Role Toggle */}
        <div className="hidden sm:flex justify-center mb-8 border-b border-gray-100 pb-6 w-full max-w-2xl mx-auto">
          <div className="flex bg-gray-100 p-1 rounded-2xl w-64 shadow-inner">
            <button
              onClick={() => setRole("patient")}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${role === "patient" ? "bg-white text-charcoal shadow-sm" : "text-gray-500 hover:text-charcoal"}`}
            >
              Patient View
            </button>
            <button
              onClick={() => setRole("counselor")}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${role === "counselor" ? "bg-white text-charcoal shadow-sm" : "text-gray-500 hover:text-charcoal"}`}
            >
              Counselor View
            </button>
          </div>
        </div>

        {/* Mobile Demo Toggles */}
        <div className="sm:hidden fixed bottom-20 right-4 z-[100] flex flex-col gap-2">
          <button
            onClick={() => setRole(role === "patient" ? "counselor" : "patient")}
            className="bg-charcoal text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg"
          >
            Switch to {role === "patient" ? "Counselor" : "Patient"}
          </button>
          {role === "patient" && (
            <button
              onClick={() => setIsFirstTime(!isFirstTime)}
              className="bg-sage text-white font-bold text-xs py-2 px-3 rounded-full shadow-lg"
            >
              {isFirstTime ? "Show Returning" : "Show First-Time"}
            </button>
          )}
        </div>

        {/* Desktop first-time toggle (for patient demo only) */}
        {role === "patient" && (
          <div className="hidden sm:flex justify-center mb-4 max-w-2xl mx-auto">
            <button
              onClick={() => setIsFirstTime(!isFirstTime)}
              className="text-xs text-gray-400 hover:text-charcoal font-bold transition-colors"
            >
              Demo: {isFirstTime ? "Switch to Returning Patient →" : "Switch to First-Time Patient →"}
            </button>
          </div>
        )}

        {role === "patient" ? (
          <PatientDashboard isFirstTime={isFirstTime} />
        ) : (
          <CounselorDashboard />
        )}
      </main>
    </div>
  );
}
