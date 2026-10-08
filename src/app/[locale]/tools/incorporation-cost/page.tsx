import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata, localizedUrl } from "@/lib/seoMeta";
import { faqPageSchema, breadcrumbSchema } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import CostCalculatorBody from "./CostCalculatorBody";
import { costFaq, type CostLang } from "./costCopy";

const PATH = "/tools/incorporation-cost";

const CRUMBS: Record<CostLang, { home: string; page: string }> = {
  en: { home: "Home", page: "Cost to Incorporate in Canada" },
  fr: { home: "Accueil", page: "Coût de constitution au Canada" },
  es: { home: "Inicio", page: "Costo de constituir en Canadá" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "incorporationCost", PATH);
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang: CostLang = locale === "fr" || locale === "es" ? locale : "en";
  const crumbs = CRUMBS[lang];
  return (
    <>
      <JsonLd
        data={[
          faqPageSchema(costFaq(lang)),
          breadcrumbSchema([
            { name: crumbs.home, url: localizedUrl(locale, "/") },
            { name: crumbs.page, url: localizedUrl(locale, PATH) },
          ]),
        ]}
      />
      <CostCalculatorBody />
    </>
  );
}
