"use client";
import { useState } from "react";
import AuthCard from "../components/auth/AuthCard";

export default function Home() {
  const [role, setRole] = useState<"patient" | "counselor">("patient");

  return (
    <main className="flex-1 min-h-0 flex flex-col p-4 overflow-y-auto w-full">
      <div className="flex flex-col items-center w-full max-w-md m-auto pb-10">
        <AuthCard role={role} onRoleChange={setRole} />
      </div>
    </main>
  );
}
