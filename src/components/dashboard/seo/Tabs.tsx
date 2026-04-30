"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface TabsProps<T extends string> {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  paramName?: string;
  onChange?: (id: T) => void;
}

// URL-aware tab strip. Reads `?tab=<id>` from the current URL via the
// paramName, falls back to `active` prop default. onChange optional;
// when omitted, navigates via router.replace so the URL becomes the
// source of truth (which means deep links + browser back work).
export default function Tabs<T extends string>({
  tabs,
  active,
  paramName = "tab",
  onChange,
}: TabsProps<T>) {
  const router = useRouter();
  const search = useSearchParams();

  function handleClick(id: T) {
    if (onChange) onChange(id);
    const params = new URLSearchParams(search.toString());
    if (id === tabs[0]?.id) params.delete(paramName);
    else params.set(paramName, id);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleClick(tab.id)}
              className={`whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-navy-900 text-navy-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {typeof tab.count === "number" ? (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-navy-100 text-navy-900"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count.toLocaleString("en-CA")}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
