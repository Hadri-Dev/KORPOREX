"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, LOCALE_LABELS, type Locale } from "@/i18n/routing";

// Top-right language picker. Uses next-intl's locale-aware router so the
// current pathname is preserved when switching languages — i.e. switching to
// French on /pricing lands on /fr/pricing, not on /fr.
export default function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  // usePathname from next-intl returns the locale-stripped path with dynamic
  // segments already substituted (e.g. `/resources/foo-bar`), so passing it
  // directly to `router.replace` preserves the current location when
  // switching languages.
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-semibold text-black hover:text-gold-500 transition-colors"
      >
        <Globe size={14} />
        {LOCALE_LABELS[locale].short}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden"
        >
          {routing.locales.map((code) => {
            const isCurrent = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => switchTo(code)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm text-left transition-colors ${
                    isCurrent ? "bg-cream-50 text-navy-900 font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-navy-900"
                  }`}
                >
                  <span>{LOCALE_LABELS[code].native}</span>
                  {isCurrent && <Check size={14} className="text-gold-500" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
