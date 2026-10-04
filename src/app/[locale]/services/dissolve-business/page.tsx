import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import { faqPageSchema } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import DissolveBusinessBody from "./DissolveBusinessBody";
import { DISSOLVE_CONTENT } from "./content";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "dissolveBusiness", "/services/dissolve-business");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = DISSOLVE_CONTENT[locale] ?? DISSOLVE_CONTENT.en;

  return (
    <>
      <JsonLd data={[faqPageSchema(c.faq)]} />
      <DissolveBusinessBody />

      {/* Crawlable service copy + FAQ (mirrors the FAQPage structured data). */}
      <section className="bg-white py-12 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-6">{c.title}</h2>
          {c.blocks.map((b, i) =>
            b.type === "h3" ? (
              <h3 key={i} className="font-serif text-xl font-bold text-navy-900 mt-8 mb-3">
                {b.text}
              </h3>
            ) : b.type === "list" ? (
              <ul key={i} className="list-disc pl-6 mb-5 space-y-2 text-gray-700 leading-relaxed marker:text-gold-500">
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className="text-gray-700 leading-relaxed mb-5">
                {b.parts.map((part, j) =>
                  typeof part === "string" ? (
                    <span key={j}>{part}</span>
                  ) : (
                    <Link
                      key={j}
                      href={part.href}
                      className="text-navy-900 underline underline-offset-2 hover:text-gold-500 transition-colors"
                    >
                      {part.text}
                    </Link>
                  ),
                )}
              </p>
            ),
          )}

          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mt-12 mb-6">{c.faqTitle}</h2>
          <div className="space-y-3">
            {c.faq.map(({ q, a }) => (
              <details key={q} className="group bg-cream-50 border border-gray-200 rounded-lg px-5 py-1">
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

      <ServiceRelatedGuides locale={locale} path="/services/dissolve-business" />
    </>
  );
}
