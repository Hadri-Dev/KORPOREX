import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import ServiceContentSection from "@/components/ServiceContentSection";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import { content } from "@/lib/serviceContent/dissolve-business";
import DissolveBusinessBody from "./DissolveBusinessBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "dissolveBusiness", "/services/dissolve-business");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <DissolveBusinessBody />
      <ServiceContentSection locale={locale} path="/services/dissolve-business" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/dissolve-business" />
    </>
  );
}
