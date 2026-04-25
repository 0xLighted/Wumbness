"use client";

import { useState } from "react";

interface PasswordInputProps {
  isSignup?: boolean;
  required?: boolean;
}

export default function PasswordInput({ isSignup = false, required = true }: PasswordInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600">
        Password
        {isSignup && (
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(!showTooltip);
            }}
            className="ml-1 text-xs text-sage hover:text-sage/80 cursor-help font-bold align-super"
            title="Password requirements"
          >
            (i)
          </button>
        )}
      </label>
      <div className="relative">
        <input
          name="password"
          type="password"
          placeholder={isSignup ? "Min 8 characters" : "Password"}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
          required={required}
        />
        {isSignup && showTooltip && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-charcoal text-white text-xs p-3 rounded-lg shadow-lg z-10 space-y-1">
            <p className="font-semibold mb-2">Password must have:</p>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>At least 8 characters</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Lowercase letters (a-z)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Uppercase letters (A-Z)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>At least one digit (0-9)</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
