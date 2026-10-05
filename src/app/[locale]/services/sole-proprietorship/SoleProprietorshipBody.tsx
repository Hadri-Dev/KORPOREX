"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { soleProprietorshipSchema, type SoleProprietorshipSubmission } from "@/lib/registrationSchemas";
import { REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import NaicsCombobox from "@/components/NaicsCombobox";

const SERVICE = REGISTRATION_SERVICES["sole-prop-on"];
type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    plusTax: "+ applicable tax. Filed within 1–2 business days.",
    steps: ["Business", "Owner", "Billing"],
    backToServices: "← Back to services",
    businessH2: "Business Details",
    businessIntro: "The business you're registering as a sole proprietorship.",
    businessName: "Business name *",
    businessNameHint: 'e.g. "Maple Ridge Consulting"',
    naics: "Primary Activity (NAICS Code) *",
    naicsHint: "Search by code, activity, or sector.",
    activity: "Business activity description *",
    activityHint: "A brief description of what the business will do.",
    activityPlaceholder: "e.g. Freelance graphic design and brand consulting for small businesses.",
    businessAddress: "Business address",
    effectiveDate: "Effective date *",
    effectiveDateHint: "When the business will start operating (or today if already active).",
    ownerH2: "Owner Details",
    ownerIntro: "Personal information for the sole proprietor.",
    first: "First name *",
    last: "Last name *",
    email: "Email *",
    phone: "Phone *",
    dob: "Date of birth *",
    homeAddress: "Home address",
    billingH2: "Billing & Review",
    billingIntro: "Final step. We'll redirect you to Stripe to complete payment.",
    billingName: "Billing name *",
    billingNameHint: "Name on the credit/debit card.",
    billingAddress: "Billing address",
    summary: "Order summary",
    tax: "Tax",
    yourProvince: "your province",
    total: "Total (CAD)",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Enregistrer une entreprise individuelle en Ontario",
    label: "Enregistrement d'une entreprise individuelle",
    description:
      "Enregistrez votre entreprise individuelle et votre nom commercial auprès du Registre des entreprises de l'Ontario. Requis si vous exercez vos activités sous un nom autre que votre nom légal.",
    plusTax: "+ taxes applicables. Dépôt dans un délai de 1 à 2 jours ouvrables.",
    steps: ["Entreprise", "Propriétaire", "Facturation"],
    backToServices: "← Retour aux services",
    businessH2: "Renseignements sur l'entreprise",
    businessIntro: "L'entreprise que vous enregistrez à titre d'entreprise individuelle.",
    businessName: "Nom commercial *",
    businessNameHint: "p. ex. « Conseils Maple Ridge »",
    naics: "Activité principale (code SCIAN) *",
    naicsHint: "Recherchez par code, activité ou secteur.",
    activity: "Description de l'activité de l'entreprise *",
    activityHint: "Une brève description de ce que fera l'entreprise.",
    activityPlaceholder: "p. ex. Conception graphique à la pige et conseils en image de marque pour les petites entreprises.",
    businessAddress: "Adresse de l'entreprise",
    effectiveDate: "Date d'entrée en vigueur *",
    effectiveDateHint: "Date à laquelle l'entreprise commencera ses activités (ou aujourd'hui si elle est déjà active).",
    ownerH2: "Renseignements sur le propriétaire",
    ownerIntro: "Renseignements personnels du propriétaire unique.",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel *",
    phone: "Téléphone *",
    dob: "Date de naissance *",
    homeAddress: "Adresse du domicile",
    billingH2: "Facturation et vérification",
    billingIntro: "Dernière étape. Nous vous redirigerons vers Stripe pour effectuer le paiement.",
    billingName: "Nom de facturation *",
    billingNameHint: "Nom figurant sur la carte de crédit ou de débit.",
    billingAddress: "Adresse de facturation",
    summary: "Résumé de la commande",
    tax: "Taxe",
    yourProvince: "votre province",
    total: "Total (CAD)",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Registre una empresa unipersonal en Ontario",
    label: "Registro de empresa unipersonal",
    description:
      "Registre su empresa unipersonal y su nombre comercial ante el Registro de Empresas de Ontario. Es obligatorio si opera bajo un nombre distinto de su nombre legal.",
    plusTax: "+ impuestos aplicables. Presentación en 1 a 2 días hábiles.",
    steps: ["Empresa", "Propietario", "Facturación"],
    backToServices: "← Volver a los servicios",
    businessH2: "Datos de la empresa",
    businessIntro: "La empresa que registra como empresa unipersonal.",
    businessName: "Nombre comercial *",
    businessNameHint: 'p. ej., "Maple Ridge Consulting"',
    naics: "Actividad principal (código NAICS) *",
    naicsHint: "Busque por código, actividad o sector.",
    activity: "Descripción de la actividad de la empresa *",
    activityHint: "Una breve descripción de lo que hará la empresa.",
    activityPlaceholder: "p. ej., Diseño gráfico independiente y asesoría de marca para pequeñas empresas.",
    businessAddress: "Dirección de la empresa",
    effectiveDate: "Fecha de inicio *",
    effectiveDateHint: "Cuándo comenzará a operar la empresa (o la fecha de hoy si ya está activa).",
    ownerH2: "Datos del propietario",
    ownerIntro: "Información personal del propietario único.",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    dob: "Fecha de nacimiento *",
    homeAddress: "Dirección particular",
    billingH2: "Facturación y revisión",
    billingIntro: "Último paso. Lo redirigiremos a Stripe para completar el pago.",
    billingName: "Nombre de facturación *",
    billingNameHint: "Nombre que figura en la tarjeta de crédito o débito.",
    billingAddress: "Dirección de facturación",
    summary: "Resumen del pedido",
    tax: "Impuesto",
    yourProvince: "su provincia",
    total: "Total (CAD)",
    submitting: "Redirigiendo a Stripe…",
    submit: "Continuar al pago",
    stripe: "El pago se procesa de forma segura a través de Stripe. Los datos de su tarjeta nunca pasan por nuestro servidor.",
    failed: "No se pudo enviar la solicitud.",
  },
} as const;

const STEP_FIELDS: string[][] = [
  ["businessName", "businessActivity", "naicsCode", "businessAddress", "effectiveDate"],
  ["ownerFirstName", "ownerLastName", "ownerEmail", "ownerPhone", "ownerDob", "ownerAddress"],
  ["billingName", "billingAddress"],
];

export default function SolePropPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<SoleProprietorshipSubmission>({
    resolver: zodResolver(soleProprietorshipSchema),
    mode: "onTouched",
    defaultValues: {
      businessName: "",
      businessActivity: "",
      naicsCode: "",
      businessAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      ownerFirstName: "",
      ownerLastName: "",
      ownerEmail: "",
      ownerPhone: "",
      ownerDob: "",
      ownerAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      effectiveDate: "",
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof SoleProprietorshipSubmission>> = {
      1: ["businessName", "businessActivity", "naicsCode", "businessAddress", "effectiveDate"],
      2: ["ownerFirstName", "ownerLastName", "ownerEmail", "ownerPhone", "ownerDob", "ownerAddress"],
    };
    const fields = fieldsByStep[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: SoleProprietorshipSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "sole-prop-on", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? t.failed);
      }
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.failed);
      setSubmitting(false);
    }
  }

  // Pricing preview (server still recomputes from constants)
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(SERVICE.price * taxRate * 100) / 100;
  const total = Math.round((SERVICE.price + tax) * 100) / 100;

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">
            {t.h1}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> {t.plusTax}
          </p>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-xl mx-auto">
          <WizardStepper steps={[...t.steps]} current={step} onGo={setStep} />

          {step === 1 && (
            <div>
              <button
                type="button"
                onClick={() => router.push("/services")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors"
              >
                {t.backToServices}
              </button>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.businessH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.businessIntro}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  gotoStep(2);
                }}
                className="space-y-5"
              >
                <Field label={t.businessName} error={errors.businessName?.message} hint={t.businessNameHint}>
                  <input type="text" {...register("businessName")} className={iCls} />
                </Field>

                <Field label={t.naics} error={errors.naicsCode?.message} hint={t.naicsHint}>
                  <NaicsCombobox
                    value={watch("naicsCode")}
                    onChange={(code) => form.setValue("naicsCode", code, { shouldValidate: true })}
                    error={errors.naicsCode?.message}
                  />
                </Field>

                <Field label={t.activity} error={errors.businessActivity?.message} hint={t.activityHint}>
                  <textarea
                    {...register("businessActivity")}
                    rows={3}
                    placeholder={t.activityPlaceholder}
                    className={`${iCls} resize-none`}
                  />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.businessAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="businessAddress" errors={errors.businessAddress} />
                </div>

                <Field label={t.effectiveDate} error={errors.effectiveDate?.message} hint={t.effectiveDateHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.ownerH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.ownerIntro}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  gotoStep(3);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.first} error={errors.ownerFirstName?.message}>
                    <input type="text" {...register("ownerFirstName")} className={iCls} />
                  </Field>
                  <Field label={t.last} error={errors.ownerLastName?.message}>
                    <input type="text" {...register("ownerLastName")} className={iCls} />
                  </Field>
                </div>

                <Field label={t.email} error={errors.ownerEmail?.message}>
                  <input type="email" autoComplete="email" {...register("ownerEmail")} className={iCls} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.phone} error={errors.ownerPhone?.message}>
                    <input type="tel" autoComplete="tel" {...register("ownerPhone")} className={iCls} placeholder="+1 416 555 0100" />
                  </Field>
                  <Field label={t.dob} error={errors.ownerDob?.message}>
                    <input type="date" {...register("ownerDob")} className={iCls} />
                  </Field>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.homeAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="ownerAddress" errors={errors.ownerAddress} />
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.billingH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.billingIntro}</p>
              <form onSubmit={handleSubmit(onFinalSubmit, (errs) => { const s = firstErrorStep(errs, STEP_FIELDS); if (s) setStep(s); })} className="space-y-5">
                <Field label={t.billingName} error={errors.billingName?.message} hint={t.billingNameHint}>
                  <input type="text" {...register("billingName")} className={iCls} />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.billingAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="billingAddress" errors={errors.billingAddress} canadaOnly={false} />
                </div>

                <div className="border border-gray-200 rounded-lg bg-cream-50 p-5 mt-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">
                    {t.summary}
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{t.label}</span>
                      <span className="text-gray-900">${SERVICE.price.toFixed(2)}</span>
                    </div>
                    {tax > 0 && (
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>
                          {t.tax} ({(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}% · {region || t.yourProvince})
                        </span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-navy-900">{t.total}</span>
                      <span className="text-navy-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="border border-red-200 bg-red-50 text-red-900 text-sm rounded-md p-3">
                    {submitError}
                  </div>
                )}

                <NextBtn label={submitting ? t.submitting : t.submit} disabled={submitting} />

                <p className="text-xs text-gray-500 text-center mt-2">
                  {t.stripe}
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </FormProvider>
  );
}
