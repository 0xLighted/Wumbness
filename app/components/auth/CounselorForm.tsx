"use client";
import { useState, useTransition } from "react";
import { SYMPTOMS } from "../triage/data";
import { login, signup } from "@/lib/supabase/action";
import { showLoadingToast } from "@/app/components/notifications/ToastHost";
import PasswordInput from "./PasswordInput";

export default function CounselorForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

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
            Work Email address
          </label>
          <input
            name="email"
            type="email"
            placeholder="Work Email address"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
            required
          />
        </div>
        <PasswordInput isSignup={!isLogin} />

        <input name="role" type="hidden" value="counselor" />
        {!isLogin && selectedSpecialties.map((symptom) => (
          <input key={symptom} name="specialties" type="hidden" value={symptom} />
        ))}

        {!isLogin && (
          <div className="mt-2">
            <label className="block text-sm font-bold text-charcoal mb-2">
              Select Your Specialties (Max 3)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 pb-2">
              {SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSpecialty(symptom)}
                  className={`text-left text-sm px-3 py-2 rounded-lg border transition-all ${selectedSpecialties.includes(symptom)
                    ? "bg-brown text-white border-brown shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-brown hover:text-charcoal"
                    }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
            {selectedSpecialties.length > 0 && (
              <p className="text-xs text-sage font-bold mt-2">
                {selectedSpecialties.length} selected
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full transform transition-all duration-200 bg-brown hover:bg-brown/80 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl mt-2 active:scale-[0.98]"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isLogin ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            isLogin ? "Sign In as Counselor" : "Apply as Counselor"
          )}
        </button>
      </form>

      <p className="text-center text-sm font-semibold text-gray-500 mt-4">
        {isLogin ? "Want to volunteer?" : "Already a volunteer?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-brown hover:underline focus:outline-none"
        >
          {isLogin ? "Apply here" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
