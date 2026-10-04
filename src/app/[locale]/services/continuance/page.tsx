import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/continuance";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import ContinuanceBody from "./ContinuanceBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "continuance", "/services/continuance");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ContinuanceBody />
      <ServiceContentSection locale={locale} path="/services/continuance" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/continuance" />
    </>
  );
}
