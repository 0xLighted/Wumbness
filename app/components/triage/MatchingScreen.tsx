"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const SEARCH_MESSAGES = [
  "Analyzing your responses...",
  "Searching for the best match...",
  "Almost there...",
];

export default function MatchingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle through search messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SEARCH_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-full animate-in fade-in duration-700 bg-pearl z-50 absolute inset-0">

      {/* Mascot with animated rings */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        {/* Outer scanning ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-sage/30 animate-ping"
          style={{ animationDuration: "3s" }}
        />
        {/* Inner pulsing glow */}
        <div
          className="absolute inset-4 rounded-full bg-sage/10 animate-pulse"
          style={{ animationDuration: "2s" }}
        />
        {/* Orbiting dot */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "4s" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-sage rounded-full shadow-md" />
        </div>

        {/* Mascot — gentle floating bounce */}
        <div className="relative animate-bounce" style={{ animationDuration: "2.5s" }}>
          <Image
            src="/WumboMascot.png"
            alt="Wumbo searching for your counselor"
            width={120}
            height={120}
            className="drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-heading font-bold text-charcoal text-center mb-3">
        Finding the best counselor for you{dots}
      </h2>

      {/* Cycling status message */}
      <p
        key={messageIndex}
        className="text-center text-gray-500 font-body text-sm max-w-xs leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-300"
      >
        {SEARCH_MESSAGES[messageIndex]}
      </p>
    </div>
  );
}
