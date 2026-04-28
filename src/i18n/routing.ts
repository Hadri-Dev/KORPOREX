import { defineRouting } from "next-intl/routing";

// All supported locales for the site. Default is English.
//
// Adding a new locale: add the code here, add a matching messages/<code>.json
// file (mirroring messages/en.json's structure), and add a label entry in
// LOCALE_LABELS below for the language switcher.
export const routing = defineRouting({
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  // English (default) is served at the root with no prefix (/about, /pricing).
  // French and Spanish use a locale prefix (/fr/about, /es/pricing). Visiting
  // /en/* redirects to the unprefixed equivalent.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  fr: { native: "Français", short: "FR" },
  es: { native: "Español", short: "ES" },
};
