import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HomePageBody from "./HomePageBody";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structuredData";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "home", "/");
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <HomePageBody />
    </>
  );
}
