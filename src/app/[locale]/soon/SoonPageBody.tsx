"use client";

import { Building2, FileText, Edit3, ClipboardCheck, RefreshCw, Clock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import SoonContactForm from "@/components/SoonContactForm";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const CAPABILITIES = [
  { key: "incorporation", icon: Building2 },
  { key: "registrations", icon: FileText },
  { key: "amendments", icon: Edit3 },
  { key: "compliance", icon: ClipboardCheck },
  { key: "businessUpdates", icon: RefreshCw },
] as const;

export default function SoonPageBody() {
  const t = useTranslations("soon");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();
  const email = tCommon("contactEmail");

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Top contact strip */}
      <header className="bg-navy-900 py-5 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
          <LanguageSwitcher />
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 text-xs text-gray-300 hover:text-gold-400 transition-colors"
          >
            <Mail size={14} />
            {email}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-navy-900 via-navy-900 to-black/30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
              <span className="text-xs text-gray-200 tracking-[0.2em] uppercase font-medium">
                {t("launchingSoon")}
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8">
              {t("headline.before")} <span className="text-gold-400">{t("headline.highlight")}</span>
              <br className="hidden md:block" /> {t("headline.after")}
            </h1>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-10 max-w-lg">
              {t("lead1")}
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-10 max-w-lg">
              {t.rich("lead2", {
                incorporation: (c) => <span className="text-white font-medium">{c}</span>,
                registration: (c) => <span className="text-white font-medium">{c}</span>,
                amendment: (c) => <span className="text-white font-medium">{c}</span>,
                compliance: (c) => <span className="text-white font-medium">{c}</span>,
              })}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-9 h-9 bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-gold-400" />
              </div>
              <span>
                {t.rich("responseWindow", {
                  hours: () => <span className="text-white font-semibold">24</span>,
                })}
              </span>
            </div>
          </div>

          <div className="w-full">
            <SoonContactForm />
          </div>
        </div>
      </section>

      {/* Capabilities strip */}
      <section className="bg-white border-b border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-8">
            {t("capabilitiesEyebrow")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {CAPABILITIES.map(({ key, icon: Icon }) => (
              <div key={key} className="flex flex-col items-center text-center px-2">
                <div className="w-12 h-12 bg-navy-50 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-navy-900" />
                </div>
                <p className="font-serif text-sm font-bold text-navy-900 mb-0.5">
                  {t(`capabilities.${key}.label`)}
                </p>
                <p className="text-xs text-gray-500 leading-snug">
                  {t(`capabilities.${key}.sub`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-cream-50 py-10 px-6 mt-auto border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{t("footerCopyright", { year })}</p>
          <p className="text-xs text-gray-500">
            <a href={`mailto:${email}`} className="hover:text-navy-900 transition-colors">
              {email}
            </a>
          </p>
          <p className="text-xs text-gray-400 max-w-md sm:text-right">{t("footerDisclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}
