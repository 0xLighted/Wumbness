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

      {/* <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-bold uppercase">Or use email</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div> */}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
              required
            />
          </div>
        )}
        <div>
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

      {/* <div className="flex flex-col gap-3 mt-2">
        <button className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-100 hover:bg-gray-50 text-charcoal font-bold py-3 px-4 rounded-xl transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          Continue with Google
        </button>
        <button className="flex items-center justify-center gap-3 w-full bg-charcoal hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-all">
          <svg width="20" height="20" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
          Continue with Apple
        </button>
      </div> */}

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
