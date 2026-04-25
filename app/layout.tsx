import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/app/components/service-worker-register";
import ToastHost from "@/app/components/notifications/ToastHost";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        <Suspense fallback={null}>
          <ToastHost />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
