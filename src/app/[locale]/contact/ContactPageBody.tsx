"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Field, iCls } from "@/components/wizard/WizardUI";

export default function ContactPageBody() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-page", locale }),
      });
      if (!res.ok) throw new Error("Send failed");
      setSubmitted(true);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-navy-900 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">{t("heroSubtitle")}</p>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-16">
          <div className="md:col-span-3">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-8">
              {t("formTitle")}
            </h2>
            {submitted ? (
              <div className="bg-cream-50 border border-gray-200 rounded-lg p-8">
                <div className="w-8 h-0.5 bg-gold-500 mb-6" />
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">{t("thankYouTitle")}</h3>
                <p className="text-gray-600">{t("thankYouBody")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label={`${t("name")} *`}>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                      placeholder={t("namePlaceholder")} className={iCls} />
                  </Field>
                  <Field label={`${t("email")} *`}>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                      placeholder={t("emailPlaceholder")} className={iCls} />
                  </Field>
                </div>
                <Field label={t("company")}>
                  <input id="company" name="company" type="text" value={form.company} onChange={handleChange}
                    placeholder={t("companyPlaceholder")} className={iCls} />
                </Field>
                <Field label={`${t("message")} *`}>
                  <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange}
                    placeholder={t("messagePlaceholder")} className={`${iCls} resize-none`} />
                </Field>
                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-3" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit"
                  disabled={submitting}
                  className="bg-navy-900 text-white font-medium px-8 py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? t("sending") : t("send")}
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">
                {t("infoTitle")}
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <Mail size={18} className="text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-1">{t("emailLabel")}</p>
                    <a href="mailto:contact@korporex.ca" className="text-sm text-gray-700 hover:text-navy-900">
                      contact@korporex.ca
                    </a>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t("emailNote")}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-1">{t("addressLabel")}</p>
                    <address className="not-italic text-sm text-gray-700 leading-relaxed">
                      {t("addressLine1")}
                      <br />
                      {t("addressLine2")}
                    </address>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-cream-50 border border-gray-100 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare size={18} className="text-gold-500" />
                <h3 className="font-serif text-lg font-bold text-navy-900">
                  {t("faqTitle")}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{t("faqBody")}</p>
              <Link href="/faq"
                className="inline-block border border-navy-900 text-navy-900 text-sm font-medium px-5 py-2.5 tracking-wide hover:bg-navy-900 hover:text-white transition-colors">
                {t("faqCta")}
              </Link>
            </div>

            <div className="border-l-4 border-gold-500 pl-5">
              <p className="text-sm text-gray-600 italic leading-relaxed">
                &ldquo;{t("quote")}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
