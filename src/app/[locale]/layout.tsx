import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/app/[locale]/guides/articles";
import { localizedUrl, socialMeta } from "@/lib/seoMeta";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");
  return {
    // metadataBase resolves the relative og:image path to an absolute URL and
    // is the base for any relative canonical/alternate links.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    // Site-wide default social cards. Pages that export their own
    // generateMetadata (via buildSeoMetadata / socialMeta) override these with
    // page-specific title, description, and URL.
    ...socialMeta({ title, description, url: localizedUrl(locale, "/"), locale }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // Reject locales that aren't in the routing config (next-intl middleware
  // already filters most cases, but a direct hit on /xx/... could slip
  // through if matchers misbehave).
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for static rendering with next-intl — must be called before
  // any translation hook in this layout's tree.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="bg-white text-gray-900 font-sans">
        <NextIntlClientProvider>
          <SiteChrome>{children}</SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
