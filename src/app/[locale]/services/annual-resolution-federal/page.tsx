import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/annual-resolution-federal";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import AnnualResolutionWizard from "@/components/wizard/AnnualResolutionWizard";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "annualResolutionFederal", "/services/annual-resolution-federal");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AnnualResolutionWizard jurisdiction="federal" />
      <ServiceContentSection locale={locale} path="/services/annual-resolution-federal" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/annual-resolution-federal" />
    </>
  );
}
