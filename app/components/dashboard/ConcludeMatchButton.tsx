"use client";

import { useState, useTransition } from "react";
import { concludeMatch } from "@/lib/supabase/matches";
import { showLoadingToast } from "@/app/components/notifications/ToastHost";
import { X } from "lucide-react";

type ConcludeMatchButtonProps = {
  matchId: string;
};

export default function ConcludeMatchButton({ matchId }: ConcludeMatchButtonProps) {
  const [isPending] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-xl border border-none bg-red-100 px-3 text-[11px] font-bold text-red-700 hover:bg-red-200 transition-colors"
        aria-label="Conclude chat"
      >
        <X />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-heading text-xl font-bold text-charcoal">Conclude this chat?</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              This will close the active match and move it out of the counselor queue.
            </p>

            <form
              action={concludeMatch}
              onSubmit={() => {
                showLoadingToast("match-conclude");
                setIsOpen(false);
              }}
              className="mt-6 flex gap-3"
            >
              <input type="hidden" name="matchId" value={matchId} />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-charcoal hover:bg-gray-50 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Yes, conclude
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
