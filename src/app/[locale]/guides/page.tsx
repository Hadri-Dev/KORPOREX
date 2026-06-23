import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, FileText, HelpCircle } from "lucide-react";
import {
  CATEGORY_KEY,
  getArticlesByLocale,
  SITE_URL,
  type Locale,
} from "./articles";
import { socialMeta } from "@/lib/seoMeta";

type Params = {
  params: { locale: Locale };
  searchParams: { page?: string };
};

const PAGE_SIZE = 9;

// Re-render periodically so scheduled articles appear (and the pagination
// control shows once there are more than PAGE_SIZE published) without a redeploy.
export const revalidate = 300;

// Fixed category list for the overview cards. Titles/descriptions are pulled
// from the `guides` translation namespace so they localize per locale.
const CATEGORY_CARDS: { key: string; icon: React.ElementType }[] = [
  { key: "incorporation", icon: BookOpen },
  { key: "compliance", icon: FileText },
  { key: "jurisdiction", icon: HelpCircle },
];

function indexUrl(locale: Locale): string {
  return `${SITE_URL}${locale === "en" ? "" : `/${locale}`}/guides`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "guides" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: indexUrl(locale),
      languages: {
        en: indexUrl("en"),
        fr: indexUrl("fr"),
        es: indexUrl("es"),
        "x-default": indexUrl("en"),
      },
    },
    ...socialMeta({ title, description, url: indexUrl(locale), locale }),
  };
}

export default async function GuidesPage({ params, searchParams }: Params) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");

  const allArticles = getArticlesByLocale(locale);
  const totalPages = Math.max(1, Math.ceil(allArticles.length / PAGE_SIZE));

  // Clamp the requested page into the valid range.
  const requested = Number.parseInt(searchParams.page ?? "1", 10);
  const currentPage = Number.isNaN(requested)
    ? 1
    : Math.min(Math.max(requested, 1), totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const articles = allArticles.slice(start, start + PAGE_SIZE);

  // Page 1 has no query string so the canonical URL stays clean.
  const pageHref = (page: number) => (page <= 1 ? "/guides" : `/guides?page=${page}`);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Category overview */}
      <section className="bg-white py-10 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
          {CATEGORY_CARDS.map(({ key, icon: Icon }) => (
            <div key={key} className="flex gap-4 items-start p-6 bg-cream-50 border border-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-navy-900 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gold-500" />
              </div>
              <div>
                <p className="font-serif text-base font-bold text-navy-900 mb-1">
                  {t(`categories.${key}.label`)}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(`categories.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-2">
            {t("allArticles")}
          </p>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-10">
            {t("latestResources")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(({ slug, category, title, excerpt, readTime }) => (
              <Link
                key={slug}
                href={`/guides/${slug}`}
                className="group flex flex-col border border-gray-100 rounded-lg hover:border-navy-900 transition-colors bg-cream-50 hover:bg-white"
              >
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-semibold tracking-[0.1em] uppercase text-gold-500 mb-3">
                    {t(`categories.${CATEGORY_KEY[category]}.label`)}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-navy-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                    {excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{readTime}</span>
                    <ArrowRight size={14} className="text-gray-400 group-hover:text-navy-900 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination — green (navy-900 theme) active page */}
          {totalPages > 1 ? (
            <nav
              className="mt-12 flex items-center justify-center gap-2"
              aria-label={t("paginationLabel")}
            >
              {currentPage > 1 ? (
                <Link
                  href={pageHref(currentPage - 1)}
                  className="inline-flex items-center gap-1 px-3 h-10 text-xs font-semibold tracking-wide uppercase text-navy-900 border border-gray-200 rounded hover:border-navy-900 transition-colors"
                  rel="prev"
                >
                  <ChevronLeft size={14} /> {t("previous")}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 h-10 text-xs font-semibold tracking-wide uppercase text-gray-300 border border-gray-100 rounded cursor-default">
                  <ChevronLeft size={14} /> {t("previous")}
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                page === currentPage ? (
                  <span
                    key={page}
                    aria-current="page"
                    className="inline-flex items-center justify-center w-10 h-10 text-sm font-semibold text-white bg-navy-900 border border-navy-900 rounded"
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={pageHref(page)}
                    className="inline-flex items-center justify-center w-10 h-10 text-sm font-semibold text-navy-900 border border-gray-200 rounded hover:border-navy-900 transition-colors"
                  >
                    {page}
                  </Link>
                ),
              )}

              {currentPage < totalPages ? (
                <Link
                  href={pageHref(currentPage + 1)}
                  className="inline-flex items-center gap-1 px-3 h-10 text-xs font-semibold tracking-wide uppercase text-navy-900 border border-gray-200 rounded hover:border-navy-900 transition-colors"
                  rel="next"
                >
                  {t("next")} <ChevronRight size={14} />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 h-10 text-xs font-semibold tracking-wide uppercase text-gray-300 border border-gray-100 rounded cursor-default">
                  {t("next")} <ChevronRight size={14} />
                </span>
              )}
            </nav>
          ) : null}

          <div className="mt-12 border border-dashed border-gray-200 rounded-lg p-8 text-center">
            <p className="font-serif text-lg font-bold text-navy-900 mb-2">{t("moreComingTitle")}</p>
            <p className="text-sm text-gray-600">{t("moreComingText")}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-12 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-gray-300 mb-8">{t("ctaText")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/incorporate"
              className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
            >
              {t("getStarted")} <ArrowRight size={16} />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
            >
              {t("browseFaq")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
