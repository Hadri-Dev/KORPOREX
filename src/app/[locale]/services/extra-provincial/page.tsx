import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/extra-provincial";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import ExtraProvincialBody from "./ExtraProvincialBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "extraProvincial", "/services/extra-provincial");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ExtraProvincialBody />
      <ServiceContentSection locale={locale} path="/services/extra-provincial" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/extra-provincial" />
    </>
  );
}
