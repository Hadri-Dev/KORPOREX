"use client";

import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ArrowRight } from "lucide-react";

type FAQ = { q: string; a: string };

// Category keys map to the `faq.categories.<key>` message objects. Order here
// is the display order; each has a localized title + an `items` array of {q,a}.
const CATEGORY_KEYS = ["general", "incorporation", "process", "pricing", "after"] as const;

function AccordionItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-serif text-base font-bold text-navy-900 leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="text-sm text-gray-600 leading-relaxed pb-5 pr-8">{a}</p>}
    </div>
  );
}

export default function FAQPageBody() {
  const t = useTranslations("faq");
  const [activeCategory, setActiveCategory] = useState(0);

  const activeKey = CATEGORY_KEYS[activeCategory];
  const activeItems = t.raw(`categories.${activeKey}.items`) as FAQ[];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            {t("heroSubtitlePrefix")}
            <Link href="/contact" className="text-white underline underline-offset-2 hover:text-gold-500 transition-colors">
              {t("heroSubtitleLink")}
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-12">
          {/* Category nav */}
          <div className="md:col-span-1">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">
              {t("categoriesLabel")}
            </p>
            <nav className="space-y-1">
              {CATEGORY_KEYS.map((key, idx) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(idx)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    activeCategory === idx
                      ? "bg-navy-50 text-navy-900 border-l-2 border-navy-900"
                      : "text-gray-600 hover:text-navy-900"
                  }`}
                >
                  {t(`categories.${key}.title`)}
                </button>
              ))}
            </nav>
          </div>

          {/* Questions */}
          <div className="md:col-span-3">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6 pb-4 border-b border-gray-200">
              {t(`categories.${activeKey}.title`)}
            </h2>
            <div>
              {activeItems.map((item) => (
                <AccordionItem key={item.q} {...item} />
              ))}
            </div>
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
            {t("getStarted")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
