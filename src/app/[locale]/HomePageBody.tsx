"use client";

import { ArrowRight, Clock, Laptop, ShieldCheck, BadgeDollarSign, Star, CheckCircle, FileText, Edit3, ClipboardCheck, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import HeroContactForm from "@/components/HeroContactForm";
import RotatingWords from "@/components/RotatingWords";
import { Link } from "@/i18n/navigation";

const JURISDICTIONS = [
  { key: "federal", href: "/incorporate?jurisdiction=federal" },
  { key: "ontario", href: "/incorporate?jurisdiction=ontario" },
] as const;

const OTHER_SERVICES = [
  { key: "registrations", icon: FileText },
  { key: "amendments", icon: Edit3 },
  { key: "compliance", icon: ClipboardCheck },
  { key: "businessUpdates", icon: RefreshCw },
] as const;

const STEPS = ["1", "2", "3"] as const;

const WHY_US = [
  { key: "speed", icon: Clock },
  { key: "online", icon: Laptop },
  { key: "compliant", icon: ShieldCheck },
  { key: "transparent", icon: BadgeDollarSign },
] as const;

export default function HomePageBody() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  // Translation messages can include arrays/objects — pull rotating phrases,
  // testimonials, and other-service item lists as raw values for the JSX.
  // Hooks must be called at the top level, so we load all raw values here.
  const rotatingPhrases = t.raw("hero.rotating") as string[];
  const testimonials = t.raw("testimonials.items") as Array<{
    quote: string;
    name: string;
    location: string;
  }>;
  const otherServiceItems: Record<string, string[]> = {
    registrations: t.raw("otherServices.items.registrations.items") as string[],
    amendments: t.raw("otherServices.items.amendments.items") as string[],
    compliance: t.raw("otherServices.items.compliance.items") as string[],
    businessUpdates: t.raw("otherServices.items.businessUpdates.items") as string[],
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-12 md:py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              <span className="text-xs text-gray-300 tracking-widest uppercase font-medium">
                {tCommon("fastOnlineAffordable")}
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6">
              <RotatingWords phrases={rotatingPhrases} />
              <br />
              <span className="text-gold-400 whitespace-pre-line">{t("hero.tagline")}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">{t("hero.lead")}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/incorporate"
                className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors"
              >
                {tCommon("incorporateNow")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
              >
                {tCommon("viewPricing")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> {t("hero.trust.fees")}</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> {t("hero.trust.speed")}</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> {t("hero.trust.online")}</span>
            </div>
          </div>

          <div className="w-full">
            <HeroContactForm />
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              {t("jurisdictions.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              {t("jurisdictions.title")}
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              {t.rich("jurisdictions.lead", {
                faqLink: () => (
                  <Link href="/faq" className="text-navy-900 underline underline-offset-2">
                    {t("jurisdictions.faqLink")}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {JURISDICTIONS.map(({ key, href }) => (
              <div
                key={key}
                className="group flex flex-col p-8 border border-gray-200 rounded-lg transition-colors hover:bg-navy-900 hover:border-navy-900"
              >
                <p className="font-serif text-2xl font-bold text-navy-900 mb-1 transition-colors group-hover:text-white">
                  {t(`jurisdictions.items.${key}.title`)}
                </p>
                <p className="text-sm text-gray-500 mb-4 transition-colors group-hover:text-gray-400">
                  {t(`jurisdictions.items.${key}.subtitle`)}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 transition-colors group-hover:text-gray-300">
                  {t(`jurisdictions.items.${key}.description`)}
                </p>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 transition-colors group-hover:text-gray-400">
                      {t("starting")}
                    </p>
                    <p className="font-serif text-3xl font-bold text-navy-900 transition-colors group-hover:text-white">
                      {t(`jurisdictions.items.${key}.from`)}
                    </p>
                  </div>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 border border-navy-900 text-navy-900 text-sm font-medium px-5 py-2.5 transition-colors group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-white"
                  >
                    {t("jurisdictions.startCta")} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="bg-cream-50 py-14 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              {t("otherServices.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              {t("otherServices.title")}
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{t("otherServices.lead")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OTHER_SERVICES.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="group flex flex-col bg-white border border-gray-200 rounded-lg p-7 transition-colors hover:bg-navy-900 hover:border-navy-900"
              >
                <div className="w-11 h-11 bg-navy-50 flex items-center justify-center mb-5 transition-colors group-hover:bg-white/10">
                  <Icon size={20} className="text-navy-900 transition-colors group-hover:text-gold-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-2 transition-colors group-hover:text-white">
                  {t(`otherServices.items.${key}.title`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 transition-colors group-hover:text-gray-300">
                  {t(`otherServices.items.${key}.description`)}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {otherServiceItems[key].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-gray-700 transition-colors group-hover:text-gray-300"
                    >
                      <CheckCircle size={12} className="text-gold-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 transition-colors group-hover:border-white/20">
                  <p className="text-xs text-gray-500 transition-colors group-hover:text-gray-400">
                    {t(`otherServices.items.${key}.from`)}
                  </p>
                  <span className="text-xs font-medium text-navy-900 transition-colors group-hover:text-gold-400">
                    {t("learnMoreArrow")}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-navy-900 text-navy-900 font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-navy-900 hover:text-white transition-colors"
            >
              {t("otherServices.browseAllCta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream-50 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              {t("howItWorks.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((stepKey, idx) => (
              <div key={stepKey} className="relative">
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-px bg-gray-200" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-navy-900 text-white flex items-center justify-center font-serif font-bold text-lg mb-5 shrink-0">
                    {t(`howItWorks.steps.${stepKey}.number`)}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">
                    {t(`howItWorks.steps.${stepKey}.title`)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t(`howItWorks.steps.${stepKey}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/incorporate"
              className="inline-flex items-center gap-2 bg-navy-900 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-navy-800 transition-colors"
            >
              {t("howItWorks.startCta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Korporex */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              {t("whyUs.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              {t("whyUs.title")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map(({ key, icon: Icon }) => (
              <div key={key} className="text-center">
                <div className="w-12 h-12 bg-navy-50 flex items-center justify-center mx-auto mb-5">
                  <Icon size={22} className="text-navy-900" />
                </div>
                <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">
                  {t(`whyUs.items.${key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(`whyUs.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-50 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              {t("testimonials.eyebrow")}
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy-900">
              {t("testimonials.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, location }) => (
              <div key={name} className="bg-white rounded-lg p-8 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-14 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            {t("ctaBottom.title")}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            {t("ctaBottom.lead")}
          </p>
          <Link
            href="/incorporate"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            {t("ctaBottom.primary")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
