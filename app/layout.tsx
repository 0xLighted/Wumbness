import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/app/components/service-worker-register";
import ToastHost from "@/app/components/notifications/ToastHost";
import AppNavigation from "./components/navigation/AppNavigation";
import { getCurrentUser } from "@/lib/supabase/current-user";

export const metadata: Metadata = {
  title: {
    default: "Wumbness",
    template: "%s | Wumbness",
  },
  description: "AI-powered youth wellbeing triage and counselor matching platform.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wumbness",
  },
};

export const viewport: Viewport = {
  themeColor: "#98BC88",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="h-svh w-full bg-pearl antialiased">
      <body className="h-svh w-full flex flex-col pt-[61px] overflow-hidden overscroll-none">
        <AppNavigation user={user} />
        <ServiceWorkerRegister />
        <Suspense fallback={null}>
          <ToastHost />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
