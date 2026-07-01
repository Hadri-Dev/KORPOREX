import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, incorporationServiceSchema } from "@/lib/structuredData";
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
      {/* Service + AggregateOffer for the incorporation packages. Organization is
          emitted alongside so the offer's provider @id resolves on this page. */}
      <JsonLd data={[organizationSchema(), incorporationServiceSchema()]} />
      <OrderBody />
    </>
  );
}
