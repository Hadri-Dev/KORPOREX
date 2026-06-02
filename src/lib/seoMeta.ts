import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SITE_URL } from "@/app/[locale]/guides/articles";

// Absolute URL for a locale-less path, honoring next-intl's `as-needed`
// prefixing (English unprefixed; fr/es prefixed). `/` resolves to the origin.
export function localizedUrl(locale: Locale, path: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const clean = path === "/" ? "" : path;
  return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}

// Builds a page's metadata (unique localized title + description + canonical +
// hreflang alternates) from the `seo` message namespace. `key` selects the
// entry (`seo.<key>.title` / `seo.<key>.description`); `path` is the
// locale-less URL used for the canonical and language alternates.
//
// This is the single source of duplicate-title prevention: every page that
// would otherwise inherit the site-wide default title in [locale]/layout.tsx
// must export a `generateMetadata` that calls this.
export async function buildSeoMetadata(
  locale: Locale,
  key: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: {
        en: localizedUrl("en", path),
        fr: localizedUrl("fr", path),
        es: localizedUrl("es", path),
        "x-default": localizedUrl("en", path),
      },
    },
  };
}
