import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/corporation-profile-report";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import CorporationProfileReportBody from "./CorporationProfileReportBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "corporationProfileReport", "/services/corporation-profile-report");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <CorporationProfileReportBody />
      <ServiceContentSection locale={locale} path="/services/corporation-profile-report" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/corporation-profile-report" />
    </>
  );
}
