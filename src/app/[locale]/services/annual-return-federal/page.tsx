import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/annual-return-federal";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import AnnualReturnFederalBody from "./AnnualReturnFederalBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "annualReturnFederal", "/services/annual-return-federal");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AnnualReturnFederalBody />
      <ServiceContentSection locale={locale} path="/services/annual-return-federal" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/annual-return-federal" />
    </>
  );
}
