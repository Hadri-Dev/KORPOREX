import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import JsonLd from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/structuredData";
import { serviceJsonLd } from "@/lib/serviceSchema";
import { isBodyTranslated, localizedUrl } from "@/lib/seoMeta";
import type { ServiceContentByLocale } from "@/lib/serviceContent/types";

const CRUMBS: Record<Locale, [string, string]> = {
  en: ["Home", "Services"],
  fr: ["Accueil", "Services"],
  es: ["Inicio", "Servicios"],
};

// Crawlable service copy + FAQ rendered under an order form, in the visitor's
// locale. The visible FAQ mirrors the FAQPage structured data it emits; the
// Service + BreadcrumbList nodes come from the service registry entry for `path`.
export default function ServiceContentSection({
  locale,
  path,
  content,
}: {
  locale: Locale;
  path: string;
  content: ServiceContentByLocale;
}) {
  const c = content[locale] ?? content.en;
  // A translated fr/es page is its own canonical, so its Service and
  // breadcrumb nodes use the localized URL and names instead of English.
  const firstPara = c.blocks.find((b) => b.type === "p");
  const localized =
    locale !== "en" && isBodyTranslated(path) && content[locale]
      ? {
          url: localizedUrl(locale, path),
          name: c.title,
          description: firstPara && firstPara.type === "p"
            ? firstPara.parts.map((x) => (typeof x === "string" ? x : x.text)).join("")
            : c.title,
          crumbs: [
            { name: CRUMBS[locale][0], url: localizedUrl(locale, "/") },
            { name: CRUMBS[locale][1], url: localizedUrl(locale, "/services") },
          ],
        }
      : undefined;

  return (
    <section className="bg-white py-12 px-6 border-t border-gray-100">
      <JsonLd data={[faqPageSchema(c.faq), ...serviceJsonLd(path, localized)]} />
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
        <p className="mt-8 text-xs text-gray-500 leading-relaxed">{c.disclaimer}</p>
      </div>
    </section>
  );
}
