import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/sole-proprietorship";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import SoleProprietorshipBody from "./SoleProprietorshipBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "soleProprietorship", "/services/sole-proprietorship");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <SoleProprietorshipBody />
      <ServiceContentSection locale={locale} path="/services/sole-proprietorship" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/sole-proprietorship" />
    </>
  );
}
