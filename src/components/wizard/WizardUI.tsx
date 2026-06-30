"use client";

import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export const iCls =
  "w-full border-2 border-gold-500 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors";

export const sCls =
  "w-full border-2 border-gold-500 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 bg-white transition-colors appearance-none";

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
