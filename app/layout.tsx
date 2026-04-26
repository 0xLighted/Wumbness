import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/app/components/service-worker-register";
import ToastHost from "@/app/components/notifications/ToastHost";
import AppNavigation from "./components/navigation/AppNavigation";
import { getCurrentUser } from "@/lib/supabase/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: "Wumbness",
    template: "%s | Wumbness",
  },
  description: "AI-powered youth wellbeing triage and counselor matching platform. Connect with professional counselors through intelligent matching.",
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
      <body className="h-svh w-full overflow-hidden overscroll-none relative">
        {/* Background Wumbo Pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="wumbo-pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
                <image href="/wumbos/WumboHappi.png" x="40" y="40" width="90" height="90" transform="rotate(-15 85 85)" />
                <image href="/wumbos/WumboDetective.png" x="240" y="60" width="90" height="90" transform="rotate(10 285 105)" />
                <image href="/wumbos/WumboSad.png" x="80" y="240" width="90" height="90" transform="rotate(12 125 285)" />
                <image href="/wumbos/WumboIdea.png" x="260" y="260" width="90" height="90" transform="rotate(-8 305 305)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wumbo-pattern)" />
          </svg>
        </div>

        {/* App Content */}
        <div className="relative z-10 flex flex-col h-full w-full pt-[61px]">
          <AppNavigation user={user} />
          <ServiceWorkerRegister />
          <Suspense fallback={null}>
            <ToastHost />
          </Suspense>
          {children}
        </div>
      </body>
    </html>
  );
}
