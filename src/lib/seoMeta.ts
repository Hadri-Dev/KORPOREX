import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/app/[locale]/guides/articles";
import { OG_IMAGE_PATH, ORG_SHORT } from "@/lib/structuredData";

const DEFAULT_LOCALE = routing.defaultLocale;

// og:locale uses an underscore region tag. Spanish has no single country here,
// so es maps to the generic es_ES form most platforms accept.
const OG_LOCALE: Record<Locale, string> = {
  en: "en_CA",
  fr: "fr_CA",
  es: "es_ES",
};

// Builds Open Graph + Twitter card metadata for a page. Each page passes its own
// resolved title/description/url so the social preview matches the page (not a
// site-wide default). The image is the shared 1200x630 branded card; the
// metadataBase set in the root layout resolves the relative path to an absolute
// URL. `type` is "website" for normal pages, "article" for guide posts.
export function socialMeta(opts: {
  title: string;
  description: string;
  url: string;
  locale: Locale;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = { url: OG_IMAGE_PATH, width: 1200, height: 630, alt: opts.title };
  return {
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.url,
      siteName: ORG_SHORT,
      locale: OG_LOCALE[opts.locale],
      type: opts.type ?? "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [OG_IMAGE_PATH],
    },
  };
}

// Absolute URL for a locale-less path, honoring next-intl's `as-needed`
// prefixing (English unprefixed; fr/es prefixed). `/` resolves to the origin.
export function localizedUrl(locale: Locale, path: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}

// Locale-less paths whose page BODY is genuinely translated into every
// non-default locale — not just the title/description.
//
// Only these paths emit a self-referencing canonical plus a full hreflang
// cluster (and appear once per locale in the sitemap). Every other page still
// renders English copy under /fr and /es, so those URLs are byte-for-byte
// duplicates of the English page. Google flags them as "Duplicate without
// user-selected canonical" and ignores a self-canonical (the content is
// identical to the English URL), so we instead consolidate them to the English
// canonical and emit no hreflang. See `buildAlternates` and `sitemap.ts`.
//
// SELF-HEALING: when a page's fr/es body translation actually ships, add its
// path here. It then automatically switches to self-canonical + hreflang and
// gains its per-locale sitemap entries — no other file needs to change. (A page
// is "translated" when its body renders localized strings in every locale, i.e.
// it no longer shows English under /fr and /es.)
const BODY_TRANSLATED_PATHS = new Set<string>([
  "/", // home
  "/about",
  "/contact",
  "/faq",
  "/guides", // guides index (individual articles are handled per-locale in sitemap.ts)
]);

// Whether a locale-less path's page body is fully translated. `""` (used by the
// sitemap for home) and `"/"` (used by metadata) are treated as the same path.
export function isBodyTranslated(path: string): boolean {
  return BODY_TRANSLATED_PATHS.has(path === "" ? "/" : path);
}

// Builds canonical + hreflang alternates for `path`, honoring whether the page
// body is genuinely translated:
//   • translated  → self-referencing canonical + full hreflang cluster.
//   • English-only → the non-default locales are duplicates of the English page,
//     so every locale's canonical points at the English URL and no hreflang is
//     emitted (a single-language page does not need hreflang). This is what
//     prevents the "Duplicate without user-selected canonical" report.
export function buildAlternates(
  locale: Locale,
  path: string,
  bodyTranslated: boolean,
): NonNullable<Metadata["alternates"]> {
  if (!bodyTranslated) {
    return { canonical: localizedUrl(DEFAULT_LOCALE, path) };
  }
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localizedUrl(l, path);
  }
  languages["x-default"] = localizedUrl(DEFAULT_LOCALE, path);
  return { canonical: localizedUrl(locale, path), languages };
}

// Builds a page's metadata (unique localized title + description + canonical +
// hreflang alternates) from the `seo` message namespace. `key` selects the
// entry (`seo.<key>.title` / `seo.<key>.description`); `path` is the
// locale-less URL used for the canonical and language alternates.
//
// This is the single source of duplicate-title prevention: every page that
// would otherwise inherit the site-wide default title in [locale]/layout.tsx
// must export a `generateMetadata` that calls this. The localized title and
// description are kept in every locale (good for a visitor who lands on the
// page directly); only the canonical/hreflang signals change when a page's body
// is not yet translated — see `BODY_TRANSLATED_KEYS` / `buildAlternates`.
export async function buildSeoMetadata(
  locale: Locale,
  key: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  return {
    title,
    description,
    alternates: buildAlternates(locale, path, isBodyTranslated(path)),
    ...socialMeta({ title, description, url: localizedUrl(locale, path), locale }),
  };
}
