import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Zap, Eye, ShieldCheck, Globe } from "lucide-react";
import { SITE_URL, type Locale } from "../guides/articles";
import { socialMeta } from "@/lib/seoMeta";

// Value cards: icon is structural (stays in code), title/description are localized.
const VALUES: { key: string; icon: React.ElementType }[] = [
  { key: "speed", icon: Zap },
  { key: "transparency", icon: Eye },
  { key: "reliability", icon: ShieldCheck },
  { key: "accessibility", icon: Globe },
];
const STAT_KEYS = ["incorporated", "turnaround", "accuracy", "jurisdictions"] as const;

function aboutUrl(locale: Locale): string {
  return `${SITE_URL}${locale === "en" ? "" : `/${locale}`}/about`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: {
      canonical: aboutUrl(locale),
      languages: {
        en: aboutUrl("en"),
        fr: aboutUrl("fr"),
        es: aboutUrl("es"),
        "x-default": aboutUrl("en"),
      },
    },
    ...socialMeta({ title, description, url: aboutUrl(locale), locale }),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

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
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-5 text-gray-700 leading-relaxed">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">{t("storyTitle")}</h2>
            <p>{t("story1")}</p>
            <p>{t("story2")}</p>
            <p>{t("story3")}</p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-navy-900 text-white p-8">
              {STAT_KEYS.map((key) => (
                <div key={key} className="mb-6 last:mb-0">
                  <p className="font-serif text-4xl font-bold text-gold-400 mb-0.5">
                    {t(`stats.${key}.value`)}
                  </p>
                  <p className="text-sm text-gray-400">{t(`stats.${key}.label`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              {t("valuesEyebrow")}
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy-900">{t("valuesTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-white rounded-lg p-7 border border-gray-100">
                <div className="w-10 h-10 bg-navy-50 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-navy-900" />
                </div>
                <h3 className="font-serif text-lg font-bold text-navy-900 mb-3">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(`values.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-cream-50 border border-gray-200 rounded-lg px-8 py-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-800">{t("disclaimerLabel")}</strong> {t("disclaimerBody")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-12 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-gray-300 mb-8">{t("ctaText")}</p>
          <Link
            href="/incorporate"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            {t("getStarted")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
