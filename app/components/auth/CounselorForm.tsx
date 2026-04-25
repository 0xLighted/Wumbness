"use client";
import { useState } from "react";
import { SYMPTOMS } from "../triage/data";
import { login, signup } from "@/lib/supabase/action";

export default function CounselorForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" action={isLogin ? login : signup}>
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
            placeholder="Work Email address"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
            required
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
            required
          />
        </div>

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
          className="w-full transform transition-all duration-200 bg-brown hover:bg-[#907563] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl mt-2 active:scale-[0.98]"
        >
          {isLogin ? "Sign In as Counselor" : "Apply as Counselor"}
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
