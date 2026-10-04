import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/annual-return-on";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import AnnualReturnOnBody from "./AnnualReturnOnBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "annualReturnOn", "/services/annual-return-on");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AnnualReturnOnBody />
      <ServiceContentSection locale={locale} path="/services/annual-return-on" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/annual-return-on" />
    </>
  );
}
