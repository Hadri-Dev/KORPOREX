import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/change-shareholder";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import ChangeShareholderBody from "./ChangeShareholderBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "changeShareholder", "/services/change-shareholder");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ChangeShareholderBody />
      <ServiceContentSection locale={locale} path="/services/change-shareholder" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/change-shareholder" />
    </>
  );
}
