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
  // next-intl otherwise sets a `Link: rel="alternate"` response header on every
  // page, mapping the *current pathname* into each locale (/x, /fr/x, /es/x).
  // That is a second hreflang cluster that contradicts the correct one we emit
  // in the HTML, and it is wrong twice over:
  //   • English-only pages emit no hreflang on purpose (see seoMeta.ts), but the
  //     header pointed at /fr/x and /es/x, which canonicalize to /x
  //     → "Hreflang to non-canonical".
  //   • Guides have localized slugs per locale, so the header's same-slug guess
  //     (/fr/<en-slug>) both duplicates the language and 308-redirects
  //     → "More than one page for same language" + "Hreflang to redirect".
  // Hreflang is owned entirely by the metadata layer + sitemap; keep it there.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  fr: { native: "Français", short: "FR" },
  es: { native: "Español", short: "ES" },
};
