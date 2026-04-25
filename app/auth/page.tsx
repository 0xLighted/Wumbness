"use client";
import { useState } from "react";
import Image from "next/image";
import AuthCard from "../components/auth/AuthCard";

export default function Home() {
  const [role, setRole] = useState<"patient" | "counselor">("patient");

  return (
    <main className="flex-1 min-h-0 flex flex-col p-4 overflow-y-auto w-full">
      <div className="flex flex-col items-center w-full max-w-md m-auto pb-10">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Image
            src="/WumbnessLogoNew.png"
            alt="Wumbness Logo"
            width={120}
            height={120}
            className="drop-shadow-lg"
            priority
          />
          <h1 className="font-heading text-4xl text-sage font-black tracking-tight">Wumbness</h1>
        </div>

        <AuthCard role={role} onRoleChange={setRole} />
      </div>
    </main>
  );
}
