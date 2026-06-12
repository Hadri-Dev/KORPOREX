import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import {
  articles,
  guideUrl,
  isPublished,
  SITE_URL,
  type Locale,
} from "./[locale]/guides/articles";
import { isBodyTranslated } from "@/lib/seoMeta";

// Regenerate hourly so guide articles scheduled with a future `publishedAt`
// enter the sitemap shortly after they go live, without a redeploy.
export const revalidate = 3600;

// Customer-facing, indexable paths that exist in every locale (the same URL
// segment is served for en/fr/es). Excluded on purpose: /soon (launch page),
// every */confirmation page (post-payment, noindex), and the owner area
// (/admin, /dashboard) which lives outside [locale] and is not localized.
const STATIC_PATHS = [
  "", // home
  "/about",
  "/services",
  "/order",
  "/incorporate",
  "/nuans",
  "/legal-consultation",
  "/guides",
  "/faq",
  "/contact",
  "/terms-of-service",
  "/privacy-policy",
  // Individual service pages
  "/services/amalgamation",
  "/services/annual-return-federal",
  "/services/annual-return-on",
  "/services/articles-amendment",
  "/services/business-name",
  "/services/business-number",
  "/services/change-address",
  "/services/change-director",
  "/services/change-shareholder",
  "/services/continuance",
  "/services/dissolve-business",
  "/services/extra-provincial",
  "/services/initial-return-on",
  "/services/notice-of-change",
  "/services/revive-business",
  "/services/sole-proprietorship",
];

// Absolute URL for a static path in a locale (English is served unprefixed).
function localeUrl(locale: Locale, path: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

// hreflang alternates map for a set of per-locale URLs, with x-default → en.
function languagesOf(urls: Partial<Record<Locale, string>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of routing.locales) {
    if (urls[locale]) out[locale] = urls[locale]!;
  }
  if (urls.en) out["x-default"] = urls.en;
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages. Pages whose body is translated emit one entry per locale URL,
  // each carrying the full hreflang set so every language version references its
  // alternates (and itself). Pages still rendering English under /fr and /es are
  // duplicates of the English URL — they emit only the English entry with no
  // hreflang, matching the page-level canonical (which consolidates fr/es → en).
  // This keeps the sitemap from re-advertising the duplicate locale URLs that
  // Google flags as "Duplicate without user-selected canonical". When a page is
  // translated (added to BODY_TRANSLATED_PATHS in seoMeta), it regains its
  // per-locale entries here automatically.
  for (const path of STATIC_PATHS) {
    const changeFrequency = path === "" || path === "/guides" ? "weekly" : "monthly";
    const priority = path === "" ? 1 : path.startsWith("/services/") ? 0.6 : 0.8;

    if (!isBodyTranslated(path)) {
      entries.push({
        url: localeUrl("en", path),
        changeFrequency,
        priority,
      });
      continue;
    }

    const urls: Partial<Record<Locale, string>> = {};
    for (const locale of routing.locales) urls[locale] = localeUrl(locale, path);
    const languages = languagesOf(urls);
    for (const locale of routing.locales) {
      entries.push({
        url: urls[locale]!,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  // Guide articles — slugs differ per locale, so group each article's published
  // language versions and emit hreflang alternates from their localized URLs.
  const groups = new Map<
    string,
    Partial<Record<Locale, { slug: string; updated: string }>>
  >();
  for (const a of articles) {
    if (!isPublished(a)) continue;
    const versions = groups.get(a.group) ?? {};
    versions[a.locale] = { slug: a.slug, updated: a.updated };
    groups.set(a.group, versions);
  }
  for (const versions of Array.from(groups.values())) {
    const urls: Partial<Record<Locale, string>> = {};
    for (const locale of routing.locales) {
      const v = versions[locale];
      if (v) urls[locale] = guideUrl(locale, v.slug);
    }
    const languages = languagesOf(urls);
    for (const locale of routing.locales) {
      const v = versions[locale];
      if (!v) continue;
      entries.push({
        url: urls[locale]!,
        lastModified: v.updated,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
