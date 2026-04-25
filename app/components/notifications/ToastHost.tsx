"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const TOAST_MESSAGES: Record<string, { type: "success" | "error"; message: string }> = {
  "login-success": {
    type: "success",
    message: "You’re signed in.",
  },
  "login-error": {
    type: "error",
    message: "Sign in failed. Please check your email and password.",
  },
  "signup-success": {
    type: "success",
    message: "Your account was created successfully.",
  },
  "signup-error": {
    type: "error",
    message: "Registration failed. Please review your details and try again.",
  },
};

export default function ToastHost() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    if (!toastKey) {
      return;
    }

    const config = TOAST_MESSAGES[toastKey];
    if (config) {
      toast.dismiss();
      toast[config.type](config.message);
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("toast");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "16px",
          padding: "14px 16px",
          fontSize: "14px",
          fontWeight: 600,
          background: "#fff",
          color: "#2b2b2b",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
        },
        success: {
          iconTheme: {
            primary: "#7d9b6b",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#b45b5b",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}