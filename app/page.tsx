"use client";
import { useState } from "react";
import AuthCard from "./components/auth/AuthCard";

export default function Home() {
  const [role, setRole] = useState<"patient" | "counselor">("patient");

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="flex flex-col items-center mb-8 gap-2">
        {/* Placeholder Logo / Brand */}
        <div className="w-16 h-16 bg-sage rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <span className="text-white text-3xl font-bold font-heading">W</span>
        </div>
        <h1 className="font-heading text-4xl text-sage font-black tracking-tight">Wumbness</h1>
      </div>
      
      <AuthCard role={role} onRoleChange={setRole} />
    </main>
  );
}
