"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  businessNameRegistrationSchema,
  type BusinessNameRegistrationSubmission,
} from "@/lib/registrationSchemas";
import { REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import NaicsCombobox from "@/components/NaicsCombobox";

const SERVICE = REGISTRATION_SERVICES["business-name-on"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    plusTax: "+ applicable tax. Filed within 1–2 business days.",
    steps: ["Business", "Registrant", "Billing"],
    backToServices: "← Back to services",
    businessH2: "Business Details",
    businessIntro: "The trade name you want to register, and what the business does.",
    tradeName: "Trade name to register *",
    tradeNameHint: 'The DBA / operating name. e.g. "Maple Ridge Consulting"',
    naics: "Primary Activity (NAICS Code) *",
    naicsHint: "Search by code, activity, or sector.",
    activity: "Business activity description *",
    activityHint: "A brief description of what the business will do.",
    activityPlaceholder: "e.g. Freelance graphic design and brand consulting.",
    businessAddress: "Business address",
    registrantH2: "Who is Registering?",
    registrantIntro: "Are you registering this name as an individual operator, or for an existing corporation?",
    registeringAs: "Registering as *",
    optIndividual: "Individual (sole proprietorship)",
    optCorporation: "Existing corporation",
    first: "First name *",
    last: "Last name *",
    dob: "Date of birth *",
    corpName: "Corporation legal name *",
    corpNumber: "Corporation number *",
    corpNumberHint: "Federal or Ontario corporation number.",
    email: "Contact email *",
    phone: "Contact phone *",
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
    h1: "Enregistrer un nom commercial en Ontario",
    label: "Enregistrement d'un nom commercial",
    description:
      "Enregistrez un nom commercial auprès du Registre des entreprises de l'Ontario, à titre de particulier ou pour une société existante qui souhaite exercer ses activités sous un nom additionnel.",
    plusTax: "+ taxes applicables. Dépôt dans un délai de 1 à 2 jours ouvrables.",
    steps: ["Entreprise", "Déclarant", "Facturation"],
    backToServices: "← Retour aux services",
    businessH2: "Renseignements sur l'entreprise",
    businessIntro: "Le nom commercial que vous souhaitez enregistrer et les activités de l'entreprise.",
    tradeName: "Nom commercial à enregistrer *",
    tradeNameHint: "Le nom sous lequel l'entreprise exerce ses activités. p. ex. « Conseils Maple Ridge »",
    naics: "Activité principale (code SCIAN) *",
    naicsHint: "Recherchez par code, activité ou secteur.",
    activity: "Description de l'activité de l'entreprise *",
    activityHint: "Une brève description de ce que fera l'entreprise.",
    activityPlaceholder: "p. ex. Conception graphique à la pige et conseils en image de marque.",
    businessAddress: "Adresse de l'entreprise",
    registrantH2: "Qui fait l'enregistrement?",
    registrantIntro: "Enregistrez-vous ce nom à titre de particulier ou pour une société existante?",
    registeringAs: "Enregistrement à titre de *",
    optIndividual: "Particulier (entreprise individuelle)",
    optCorporation: "Société existante",
    first: "Prénom *",
    last: "Nom de famille *",
    dob: "Date de naissance *",
    corpName: "Dénomination sociale de la société *",
    corpNumber: "Numéro de la société *",
    corpNumberHint: "Numéro de société fédérale ou de l'Ontario.",
    email: "Courriel de contact *",
    phone: "Téléphone de contact *",
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
    h1: "Registre un nombre comercial en Ontario",
    label: "Registro de nombre comercial",
    description:
      "Registre un nombre comercial ante el Registro de Empresas de Ontario, ya sea como persona física o para una corporación existente que desee operar bajo un nombre adicional.",
    plusTax: "+ impuestos aplicables. Presentación en 1 a 2 días hábiles.",
    steps: ["Empresa", "Solicitante", "Facturación"],
    backToServices: "← Volver a los servicios",
    businessH2: "Datos de la empresa",
    businessIntro: "El nombre comercial que desea registrar y la actividad de la empresa.",
    tradeName: "Nombre comercial a registrar *",
    tradeNameHint: 'El nombre con el que opera la empresa. p. ej., "Maple Ridge Consulting"',
    naics: "Actividad principal (código NAICS) *",
    naicsHint: "Busque por código, actividad o sector.",
    activity: "Descripción de la actividad de la empresa *",
    activityHint: "Una breve descripción de lo que hará la empresa.",
    activityPlaceholder: "p. ej., Diseño gráfico independiente y asesoría de marca.",
    businessAddress: "Dirección de la empresa",
    registrantH2: "¿Quién realiza el registro?",
    registrantIntro: "¿Registra este nombre como persona física o para una corporación existente?",
    registeringAs: "Registro como *",
    optIndividual: "Persona física (empresa unipersonal)",
    optCorporation: "Corporación existente",
    first: "Nombre *",
    last: "Apellido *",
    dob: "Fecha de nacimiento *",
    corpName: "Nombre legal de la corporación *",
    corpNumber: "Número de corporación *",
    corpNumberHint: "Número de corporación federal o de Ontario.",
    email: "Correo electrónico de contacto *",
    phone: "Teléfono de contacto *",
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
  ["businessName", "businessActivity", "naicsCode", "businessAddress"],
  ["entityType", "ownerFirstName", "ownerLastName", "ownerDob", "contactEmail", "contactPhone", "corpName", "corpNumber"],
  ["billingName", "billingAddress"],
];

export default function BusinessNameRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<BusinessNameRegistrationSubmission>({
    resolver: zodResolver(businessNameRegistrationSchema),
    mode: "onTouched",
    defaultValues: {
      businessName: "",
      businessActivity: "",
      naicsCode: "",
      businessAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      entityType: "individual",
      ownerFirstName: "",
      ownerLastName: "",
      ownerDob: "",
      corpName: "",
      corpNumber: "",
      contactEmail: "",
      contactPhone: "",
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const entityType = watch("entityType");

  async function gotoStep(next: number) {
    const baseFields1: Array<keyof BusinessNameRegistrationSubmission> = [
      "businessName",
      "businessActivity",
      "naicsCode",
      "businessAddress",
    ];
    const baseFields2: Array<keyof BusinessNameRegistrationSubmission> =
      entityType === "individual"
        ? ["entityType", "ownerFirstName", "ownerLastName", "ownerDob", "contactEmail", "contactPhone"]
        : ["entityType", "corpName", "corpNumber", "contactEmail", "contactPhone"];
    const fieldsByStep: Record<number, Array<keyof BusinessNameRegistrationSubmission>> = {
      1: baseFields1,
      2: baseFields2,
    };
    const fields = fieldsByStep[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: BusinessNameRegistrationSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "business-name-on", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? t.failed);
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.failed);
      setSubmitting(false);
    }
  }

  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(SERVICE.price * taxRate * 100) / 100;
  const total = Math.round((SERVICE.price + tax) * 100) / 100;

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{t.h1}</h1>
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
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label={t.tradeName} error={errors.businessName?.message} hint={t.tradeNameHint}>
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
                  <textarea {...register("businessActivity")} rows={3} placeholder={t.activityPlaceholder} className={`${iCls} resize-none`} />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.businessAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="businessAddress" errors={errors.businessAddress} />
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.registrantH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.registrantIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label={t.registeringAs} error={errors.entityType?.message}>
                  <select {...register("entityType")} className={sCls}>
                    <option value="individual">{t.optIndividual}</option>
                    <option value="corporation">{t.optCorporation}</option>
                  </select>
                </Field>

                {entityType === "individual" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t.first} error={errors.ownerFirstName?.message}>
                        <input type="text" {...register("ownerFirstName")} className={iCls} />
                      </Field>
                      <Field label={t.last} error={errors.ownerLastName?.message}>
                        <input type="text" {...register("ownerLastName")} className={iCls} />
                      </Field>
                    </div>
                    <Field label={t.dob} error={errors.ownerDob?.message}>
                      <input type="date" {...register("ownerDob")} className={iCls} />
                    </Field>
                  </>
                )}

                {entityType === "corporation" && (
                  <>
                    <Field label={t.corpName} error={errors.corpName?.message}>
                      <input type="text" {...register("corpName")} className={iCls} placeholder="ACME Holdings Inc." />
                    </Field>
                    <Field label={t.corpNumber} error={errors.corpNumber?.message} hint={t.corpNumberHint}>
                      <input type="text" {...register("corpNumber")} className={iCls} placeholder="1234567" />
                    </Field>
                  </>
                )}

                <Field label={t.email} error={errors.contactEmail?.message}>
                  <input type="email" autoComplete="email" {...register("contactEmail")} className={iCls} />
                </Field>
                <Field label={t.phone} error={errors.contactPhone?.message}>
                  <input type="tel" autoComplete="tel" {...register("contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
                </Field>

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
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.summary}</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">{t.label}</span>
                      <span className="text-gray-900">${SERVICE.price.toFixed(2)}</span>
                    </div>
                    {tax > 0 && (
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>{t.tax} ({(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}% · {region || t.yourProvince})</span>
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
                  <div className="border border-red-200 bg-red-50 text-red-900 text-sm rounded-md p-3">{submitError}</div>
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
