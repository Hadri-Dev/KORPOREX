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
  // Always default to English. Without this, next-intl negotiates the locale
  // from the visitor's `Accept-Language` header, so a French/Spanish browser
  // hitting `/` would be redirected to `/fr` or `/es`. Disabling detection
  // pins the unprefixed root to the default locale (en); visitors opt into
  // FR/ES explicitly via the language switcher.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  fr: { native: "Français", short: "FR" },
  es: { native: "Español", short: "ES" },
};
