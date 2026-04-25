"use client";
import { useState, useTransition } from "react";
import { login, signup } from "@/lib/supabase/action";
import { showLoadingToast } from "@/app/components/notifications/ToastHost";
import PasswordInput from "./PasswordInput";

export default function PatientForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    showLoadingToast(isLogin ? "login" : "signup");

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (isLogin) {
        await login(formData);
      } else {
        await signup(formData);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
            <label className="block text-xs font-semibold text-gray-600">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
              required
            />
          </div>
        )}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-600">
            Email address
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
            required
          />
        </div>
        <PasswordInput isSignup={!isLogin} />

        <input name="role" type="hidden" value="patient" />

        <button
          type="submit"
          disabled={isPending}
          className="w-full transform transition-all duration-200 bg-sage hover:bg-[#8CA26E] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl mt-2 active:scale-[0.98]"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isLogin ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            isLogin ? "Welcome Back" : "Start Your Journey"
          )}
        </button>
      </form>

      <p className="text-center text-sm font-semibold text-gray-500 mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sage hover:underline focus:outline-none"
        >
          {isLogin ? "Start here" : "Log in"}
        </button>
      </p>
    </div>
  );
}
