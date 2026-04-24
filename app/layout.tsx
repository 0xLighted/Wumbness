import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/app/components/service-worker-register";

export const metadata: Metadata = {
  title: {
    default: "Wumbo Wellness",
    template: "%s | Wumbo Wellness",
  },
  description: "AI-powered youth wellbeing triage and counselor matching platform.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wumbo Wellness",
  },
};

export const viewport: Viewport = {
  themeColor: "#9AB17A",
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
        {children}
      </body>
    </html>
  );
}
