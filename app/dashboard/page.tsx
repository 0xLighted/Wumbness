"use client";
import { useState } from "react";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import CounselorDashboard from "../components/dashboard/CounselorDashboard";

export default function DashboardPage() {
  // Temporary state for the hackathon MVP until Supabase Auth is fully wired up
  // to toggle roles to demo the UI.
  const [role, setRole] = useState<"patient" | "counselor">("patient");

  return (
    <>
      <div className="flex justify-center mb-8 border-b border-gray-100 pb-6 w-full max-w-4xl mx-auto hidden sm:flex">
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
      
      {/* Mobile Demo Toggle */}
      <div className="sm:hidden fixed bottom-20 right-4 z-[100]">
         <button 
           onClick={() => setRole(role === "patient" ? "counselor" : "patient")}
           className="bg-charcoal text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg"
         >
           Switch to {role === "patient" ? "Counselor" : "Patient"}
         </button>
      </div>

      {role === "patient" ? <PatientDashboard /> : <CounselorDashboard />}
    </>
  );
}
