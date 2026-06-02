import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import {
  CATEGORY_KEY,
  getArticle,
  getArticlesByLocale,
  getAlternateSlugs,
  getRelatedArticles,
  guideUrl,
  isPublished,
  type ArticleSection,
  type Locale,
} from "../articles";

type Params = { params: { locale: Locale; slug: string } };

// Re-render periodically so a scheduled article (publishedAt in the future)
// flips from 404 to live shortly after its publish time, without a redeploy.
export const revalidate = 300;

// One static page per (locale, slug). The [locale] parent provides the locale,
// so each language only prerenders its own slugs (fr/es get their own URLs).
export function generateStaticParams({
  params,
}: {
  params: { locale: Locale };
}) {
  return getArticlesByLocale(params.locale).map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = params;
  const article = getArticle(locale, slug);
  if (!article || !isPublished(article)) return { title: "Article not found | Korporex" };

  // hreflang: link every language version of this article so Google treats
  // them as translations, not duplicate content. x-default points to English.
  const alternates = getAlternateSlugs(article.group);
  const languages: Record<string, string> = {};
  (Object.keys(alternates) as Locale[]).forEach((loc) => {
    const altSlug = alternates[loc];
    if (altSlug) languages[loc] = guideUrl(loc, altSlug);
  });
  if (alternates.en) languages["x-default"] = guideUrl("en", alternates.en);

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: guideUrl(locale, slug),
      languages,
    },
  };
}

const DATE_LOCALE: Record<Locale, string> = {
  en: "en-CA",
  fr: "fr-CA",
  es: "es",
};

function formatDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString(DATE_LOCALE[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function renderSection(section: ArticleSection, index: number) {
  switch (section.type) {
    case "heading":
      return (
        <h2
          key={index}
          id={section.id}
          className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mt-12 mb-4 scroll-mt-24"
        >
          {section.text}
        </h2>
      );
    case "paragraph":
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-5">
          {section.parts
            ? section.parts.map((part, i) =>
                typeof part === "string" ? (
                  <span key={i}>{part}</span>
                ) : (
                  <Link
                    key={i}
                    href={part.href}
                    className="text-navy-900 underline underline-offset-2 hover:text-gold-500 transition-colors"
                  >
                    {part.text}
                  </Link>
                ),
              )
            : section.text}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="list-disc pl-6 mb-6 space-y-2 text-gray-700 leading-relaxed marker:text-gold-500">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside
          key={index}
          className="my-8 border-l-4 border-gold-500 bg-cream-50 px-6 py-5"
        >
          {section.title ? (
            <p className="font-serif text-base font-bold text-navy-900 mb-2">
              {section.title}
            </p>
          ) : null}
          <p className="text-gray-700 leading-relaxed text-sm">{section.text}</p>
        </aside>
      );
    case "table":
      return (
        <div key={index} className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-navy-900 text-white">
                {section.head.map((h, i) => (
                  <th
                    key={i}
                    className="text-left font-semibold px-4 py-3 border border-navy-900"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 border border-gray-200 text-gray-700 align-top"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArticlePage({ params }: Params) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const article = getArticle(locale, slug);
  if (!article || !isPublished(article)) notFound();

  const t = await getTranslations("guides");

  const headings = article.content.filter(
    (s): s is Extract<ArticleSection, { type: "heading" }> => s.type === "heading",
  );
  const related = getRelatedArticles(locale, slug);

  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-16 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 hover:text-navy-900 transition-colors mb-8"
          >
            <ArrowLeft size={14} /> {t("backToGuides")}
          </Link>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            {t(`categories.${CATEGORY_KEY[article.category]}.label`)}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed mb-8">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <Clock size={14} /> {article.readTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} /> {t("updated", { date: formatDate(article.updated, locale) })}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_240px] gap-12">
          <article className="min-w-0">
            {article.content.map((section, i) => renderSection(section, i))}

            <div className="mt-16 pt-8 border-t border-gray-100 text-xs text-gray-500 leading-relaxed">
              {t("disclaimer")}
            </div>
          </article>

          {headings.length > 1 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold-500 mb-4">
                  {t("onThisPage")}
                </p>
                <ul className="space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-gray-600 hover:text-navy-900 leading-snug block"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="bg-cream-50 py-16 px-6 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-2">
              {t("keepReading")}
            </p>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-10">
              {t("relatedArticles")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/guides/${r.slug}`}
                  className="group flex flex-col border border-gray-100 hover:border-navy-900 transition-colors bg-white"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs font-semibold tracking-[0.1em] uppercase text-gold-500 mb-3">
                      {t(`categories.${CATEGORY_KEY[r.category]}.label`)}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-navy-700 transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                      {r.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{r.readTime}</span>
                      <ArrowRight
                        size={14}
                        className="text-gray-400 group-hover:text-navy-900 transition-colors"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
              href="/nuans"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
            >
              {t("nuansReport")}
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
            >
              {t("order")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
