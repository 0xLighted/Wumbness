"use client";
import Link from "next/link";
import Image from "next/image";
import { Download, LogOut } from 'lucide-react';
import { useEffect, useState } from "react";
import { signOut } from "@/lib/supabase/action";
import { showLoadingToast } from "@/app/components/notifications/ToastHost";
import type { CurrentUser } from "@/lib/supabase/current-user";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function AppNavigation({ user }: { user: CurrentUser | null }) {

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm fixed z-50 top-0 left-0 right-0">

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

      {user && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInstall}
            disabled={!installPrompt}
            className="p-3 rounded-lg bg-sage text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8CA26E] transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <form
            action={signOut}
            onSubmit={() => {
              showLoadingToast("signout");
            }}
          >
            <button
              type="submit"
              className="p-3 rounded-lg bg-pearl text-charcoal text-sm font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
