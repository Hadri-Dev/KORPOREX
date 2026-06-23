"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Jurisdiction quick-pick options. Names, acts, and prices are read from the
// shared `home.jurisdictions` namespace so the hero panel never drifts from the
// pricing shown in the jurisdictions section below it.
const JURISDICTIONS = [
  { key: "federal", href: "/incorporate?jurisdiction=federal" },
  { key: "ontario", href: "/incorporate?jurisdiction=ontario" },
] as const;

export default function HeroStartPanel() {
  const t = useTranslations("heroStart");
  const tHome = useTranslations("home");

  return (
    <div className="bg-white rounded-lg p-8">
      <div className="w-8 h-0.5 bg-gold-500 mb-5" />
      <p className="font-serif text-xl font-bold text-navy-900 mb-1">{t("title")}</p>
      <p className="text-xs text-gray-500 mb-6">{t("subtitle")}</p>

      <p className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-3">
        {t("chooseLabel")}
      </p>

      <div className="space-y-3">
        {JURISDICTIONS.map(({ key, href }) => (
          <Link
            key={key}
            href={href}
            className="group flex items-center justify-between gap-4 border border-gray-200 rounded-md px-4 py-3.5 transition-colors hover:bg-navy-900 hover:border-navy-900"
          >
            <span className="min-w-0">
              <span className="block font-serif text-lg font-bold text-navy-900 leading-tight transition-colors group-hover:text-white">
                {tHome(`jurisdictions.items.${key}.title`)}
              </span>
              <span className="block text-xs text-gray-500 leading-tight mt-0.5 transition-colors group-hover:text-gray-400">
                {tHome(`jurisdictions.items.${key}.subtitle`)}
              </span>
            </span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="text-right leading-tight">
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 transition-colors group-hover:text-gray-400">
                  {t("from")}
                </span>
                <span className="block font-serif text-lg font-bold text-navy-900 transition-colors group-hover:text-white">
                  {tHome(`jurisdictions.items.${key}.from`)}
                </span>
              </span>
              <ArrowRight
                size={16}
                className="text-gray-300 transition-colors group-hover:text-gold-400"
              />
            </span>
          </Link>
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-xs text-gray-600 list-none">
        <li className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-gold-500 shrink-0" /> {t("trust.fees")}
        </li>
        <li className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-gold-500 shrink-0" /> {t("trust.online")}
        </li>
      </ul>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {t("otherPrompt")}{" "}
          <Link
            href="/services"
            className="text-navy-900 font-medium underline underline-offset-2 hover:text-gold-600 transition-colors"
          >
            {t("otherLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
