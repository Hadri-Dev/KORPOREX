"use client";

import { Check, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export const iCls =
  "w-full border-2 border-gold-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors";

export const sCls =
  "w-full border-2 border-gold-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 bg-white transition-colors appearance-none";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const required = label.endsWith(" *");
  const baseLabel = required ? label.slice(0, -2) : label;
  return (
    <div>
      <label className="block text-xs font-bold tracking-[0.1em] uppercase text-black mb-1.5">
        {baseLabel}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors"
    >
      <ChevronLeft size={16} /> Back
    </button>
  );
}

export function NextBtn({
  label = "Continue",
  disabled = false,
}: {
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full bg-navy-900 text-white font-medium py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-6"
    >
      {label}
    </button>
  );
}

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>
          Step {step} of {total}
        </span>
        <span>{Math.round((step / total) * 100)}% complete</span>
      </div>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-navy-900 transition-all"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Fully clickable step indicator. Every step navigates directly to itself via
// `onGo`, so customers can move back and forth to fix mistakes. Labels hide on
// small screens (circles + connectors remain). Pair with `firstErrorStep` on
// final submit so free navigation never lets a required field be silently
// skipped.
export function WizardStepper({
  steps,
  current,
  onGo,
}: {
  steps: string[];
  current: number;
  onGo: (n: number) => void;
}) {
  function go(n: number) {
    onGo(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <ol className="flex items-center mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const isCurrent = n === current;
        return (
          <li
            key={label}
            className={n < steps.length ? "flex items-center flex-1" : "flex items-center"}
          >
            <button
              type="button"
              onClick={() => go(n)}
              aria-current={isCurrent ? "step" : undefined}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 border-2 transition-colors ${
                  done
                    ? "bg-navy-900 border-navy-900 text-white"
                    : isCurrent
                      ? "bg-navy-900 border-gold-500 text-white ring-2 ring-gold-500/30"
                      : "bg-white border-gray-300 text-gray-400 hover:border-navy-900 hover:text-navy-900"
                }`}
              >
                {done ? <Check size={14} /> : n}
              </span>
              <span
                className={`hidden sm:inline text-xs font-semibold whitespace-nowrap transition-colors ${
                  isCurrent ? "text-navy-900" : done ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </button>
            {n < steps.length && (
              <span
                className={`mx-2 sm:mx-3 h-0.5 flex-1 rounded transition-colors ${
                  done ? "bg-navy-900" : "bg-gray-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// Given react-hook-form errors and a per-step list of top-level field keys,
// returns the 1-based index of the earliest step containing an error (or null).
// Used in each wizard's `handleSubmit(onValid, onInvalid)` so a failed submit
// jumps the user to the first step that needs attention.
export function firstErrorStep(errors: object, stepFields: string[][]): number | null {
  const e = errors as Record<string, unknown>;
  for (let i = 0; i < stepFields.length; i++) {
    if (stepFields[i].some((k) => e[k] != null)) return i + 1;
  }
  return null;
}
