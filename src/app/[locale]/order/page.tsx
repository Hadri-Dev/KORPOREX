import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import JsonLd from "@/components/JsonLd";
import { incorporationServiceSchema } from "@/lib/structuredData";
import OrderBody from "./OrderBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "order", "/order");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {/* Service + AggregateOffer for the incorporation packages. The provider
          @id resolves to the site-wide Organization node in the layout. */}
      <JsonLd data={incorporationServiceSchema()} />
      <OrderBody />
    </>
  );
}
