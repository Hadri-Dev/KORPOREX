import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import { SITE_URL } from "@/app/[locale]/guides/articles";
import { faqPageSchema, breadcrumbSchema } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import { CHANGE_NAME_PRICES } from "@/lib/changeNameSchema";
import ChangeNameBody from "./ChangeNameBody";

const PATH = "/services/change-name";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "changeName", PATH);
}

// Q&A used for BOTH the FAQPage structured data and the visible FAQ accordion —
// kept in one place so they never drift.
const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I legally change my corporation's name in Canada?",
    a: "You file Articles of Amendment with your registry: the Ontario Business Registry for OBCA corporations, or Corporations Canada for CBCA (federal) corporations. The change must first be approved by a special resolution of the shareholders (two-thirds of votes cast), and a NUANS name search confirms the new name is available. Korporex prepares the amendment, runs the search, and files it for you.",
  },
  {
    q: "How much does it cost to change a business name in Ontario or federally?",
    a: `Korporex charges a flat $${CHANGE_NAME_PRICES.ontario.toFixed(2)} + HST for an Ontario corporation and $${CHANGE_NAME_PRICES.federal.toFixed(2)} + HST for a federal corporation. The government filing fee (Ontario $150 or federal $200) and one NUANS name search are already included, so there are no separate government or NUANS charges.`,
  },
  {
    q: "Do I need a NUANS report to change my corporate name?",
    a: "Yes. Changing to a new named corporation requires a NUANS name search to confirm the name is distinctive and available. One NUANS search is included in your price. If you want to test additional name choices, each further search is $39.99 + HST.",
  },
  {
    q: "How long does a corporate name change take?",
    a: "Once we have your chosen name cleared and your special resolution, the Articles of Amendment are typically filed and processed within 1 to 2 business days. You then receive an updated Certificate and Articles of Amendment reflecting the new name.",
  },
  {
    q: "Do I need to update my minute book after a name change?",
    a: "Your corporate records should reflect the new legal name. For an optional $199 + HST, Korporex prepares the directors' and shareholders' resolutions and updates your minute book so your internal records match the amended articles.",
  },
];

function serviceSchema() {
  const url = `${SITE_URL}${PATH}`;
  const offer = (jurLabel: string, price: number) => ({
    "@type": "Offer",
    name: `Change of Business Name (${jurLabel})`,
    price: price.toFixed(2),
    priceCurrency: "CAD",
    url,
    availability: "https://schema.org/InStock",
  });
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: "Change of Business Name",
    serviceType: "Corporate name change (Articles of Amendment)",
    description:
      "Legally change an Ontario (OBCA) or federal (CBCA) corporation's name. Korporex prepares and files the Articles of Amendment and runs the required NUANS name search for a flat fee, with the government filing fee and one NUANS search included.",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "CA",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: CHANGE_NAME_PRICES.ontario.toFixed(2),
      highPrice: CHANGE_NAME_PRICES.federal.toFixed(2),
      offerCount: 2,
      offers: [offer("Ontario", CHANGE_NAME_PRICES.ontario), offer("Federal", CHANGE_NAME_PRICES.federal)],
    },
  };
}

function breadcrumb() {
  return breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: "Change of Business Name", url: `${SITE_URL}${PATH}` },
  ]);
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={[serviceSchema(), faqPageSchema(FAQ), breadcrumb()]} />
      <ChangeNameBody />

      {/* FAQ — visible on-page content that mirrors the FAQPage structured data. */}
      <section className="bg-cream-50 py-12 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2">
            Change of business name: common questions
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            The questions people search most about changing an Ontario or federal corporation&apos;s name.
          </p>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group bg-white border border-gray-200 rounded-lg px-5 py-1">
                <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4 font-semibold text-navy-900 text-[15px]">
                  {q}
                  <span className="text-gold-600 text-xl leading-none group-open:hidden">+</span>
                  <span className="text-gold-600 text-xl leading-none hidden group-open:inline">–</span>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed pb-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
