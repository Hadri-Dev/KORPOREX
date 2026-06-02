import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL, type Locale } from "../guides/articles";
import FAQPageBody from "./FAQPageBody";

function faqUrl(locale: Locale): string {
  return `${SITE_URL}${locale === "en" ? "" : `/${locale}`}/faq`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: faqUrl(locale),
      languages: {
        en: faqUrl("en"),
        fr: faqUrl("fr"),
        es: faqUrl("es"),
        "x-default": faqUrl("en"),
      },
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FAQPageBody />;
}
