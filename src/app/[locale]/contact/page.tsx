import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL, type Locale } from "../guides/articles";
import { socialMeta } from "@/lib/seoMeta";
import ContactPageBody from "./ContactPageBody";

function contactUrl(locale: Locale): string {
  return `${SITE_URL}${locale === "en" ? "" : `/${locale}`}/contact`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: contactUrl(locale),
      languages: {
        en: contactUrl("en"),
        fr: contactUrl("fr"),
        es: contactUrl("es"),
        "x-default": contactUrl("en"),
      },
    },
    ...socialMeta({ title, description, url: contactUrl(locale), locale }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageBody />;
}
