import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE_URL, type Locale } from "../guides/articles";
import { socialMeta } from "@/lib/seoMeta";
import { faqPageSchema } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import FAQPageBody from "./FAQPageBody";

// Mirror of CATEGORY_KEYS in FAQPageBody — used here to flatten every category's
// {q,a} list into a single FAQPage schema for rich results.
const FAQ_CATEGORY_KEYS = ["general", "incorporation", "process", "pricing", "after"] as const;

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
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: faqUrl(locale),
      languages: {
        en: faqUrl("en"),
        fr: faqUrl("fr"),
        es: faqUrl("es"),
        "x-default": faqUrl("en"),
      },
    },
    ...socialMeta({ title, description, url: faqUrl(locale), locale }),
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Flatten every category's questions into one FAQPage schema (server-side, so
  // the structured data ships in the initial HTML even though the UI is a
  // client-side accordion).
  const t = await getTranslations({ locale, namespace: "faq" });
  const faqItems = FAQ_CATEGORY_KEYS.flatMap(
    (key) => t.raw(`categories.${key}.items`) as { q: string; a: string }[],
  );

  return (
    <>
      <JsonLd data={faqPageSchema(faqItems)} />
      <FAQPageBody />
    </>
  );
}
