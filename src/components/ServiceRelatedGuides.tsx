import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { CATEGORY_KEY } from "@/app/[locale]/guides/articles";
import { getServiceGuides } from "@/lib/serviceGuides";

// "Related guides" band rendered under a service/order page. Server component,
// so the links ship in the static HTML for crawlers.
export default async function ServiceRelatedGuides({
  locale,
  path,
}: {
  locale: Locale;
  path: string;
}) {
  const guides = getServiceGuides(locale, path);
  if (guides.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "guides" });

  return (
    <section className="bg-cream-50 py-12 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-2">
          {t("serviceGuidesEyebrow")}
        </p>
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-10">
          {t("serviceGuidesTitle")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex flex-col border border-gray-100 hover:border-navy-900 transition-colors bg-white"
            >
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-semibold tracking-[0.1em] uppercase text-gold-500 mb-3">
                  {t(`categories.${CATEGORY_KEY[g.category]}.label`)}
                </p>
                <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-navy-700 transition-colors">
                  {g.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">{g.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{g.readTime}</span>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-navy-900 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
