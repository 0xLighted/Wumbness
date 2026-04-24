"use client";
import Link from "next/link";
import Image from "next/image";

export default function AppNavigation() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/WumbnessLogoNew.png"
          alt="Wumbness Logo"
          width={36}
          height={36}
          className="drop-shadow-sm"
        />
        <span className="font-heading font-black text-2xl text-sage">Wumbness</span>
      </Link>

      {/* Profile Icon */}
      <Link
        href="/profile"
        className="w-10 h-10 rounded-full bg-pearl flex items-center justify-center text-gray-400 hover:text-sage hover:bg-sage/10 transition-colors border border-gray-100"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </Link>
    </nav>
  );
}
