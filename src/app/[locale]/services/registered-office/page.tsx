import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/registered-office";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import RegisteredOfficeBody from "./RegisteredOfficeBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "registeredOffice", "/services/registered-office");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <RegisteredOfficeBody />
      <ServiceContentSection locale={locale} path="/services/registered-office" content={content} />
      <ServiceRelatedGuides locale={locale} path="/services/registered-office" />
    </>
  );
}
