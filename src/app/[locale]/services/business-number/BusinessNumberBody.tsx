"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  businessNumberSchema,
  type BusinessNumberSubmission,
} from "@/lib/registrationSchemas";
import { REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";

const SERVICE = REGISTRATION_SERVICES["business-number"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax. Filed within 1–2 business days.",
    steps: ["Entity", "Programs", "Billing"],
    backToServices: "← Back to services",
    entityH2: "Entity Details",
    entityIntro: "Who or what is being registered for the BN.",
    legalName: "Legal name *",
    legalNameHint: "Individual's legal name or corporate legal name.",
    entityType: "Entity type *",
    entityTypes: {
      individual: "Individual",
      sole_prop: "Sole proprietorship",
      partnership: "Partnership",
      corporation: "Corporation",
    },
    entityAddress: "Entity address",
    effective: "Effective date *",
    effectiveHint: "When the BN should take effect.",
    programsH2: "Programs & Contact",
    programsIntro: "Which CRA program accounts do you need, and who should we contact about this file.",
    revenue: "Expected gross revenue *",
    revenueHint: "Businesses earning over $30,000/yr must register for GST/HST.",
    revenueOptions: {
      under_30k: "Under $30,000/yr",
      over_30k: "Over $30,000/yr",
    },
    programsLabel: "Program accounts you need",
    gstTitle: "GST/HST account",
    gstDesc: "For collecting/remitting sales tax. Required over $30k/yr.",
    payrollTitle: "Payroll account",
    payrollDesc: "For remitting employee deductions and CPP/EI.",
    importTitle: "Import/Export account",
    importDesc: "For importing or exporting commercial goods across the border.",
    citTitle: "Corporate income tax account",
    citDesc: "Required for incorporated businesses to file T2 returns.",
    contactFirst: "Contact first name *",
    contactLast: "Contact last name *",
    contactEmail: "Contact email *",
    contactPhone: "Contact phone *",
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
    h1: "Obtenez un numéro d'entreprise de l'ARC",
    label: "Inscription au numéro d'entreprise",
    description:
      "Inscrivez-vous auprès de l'Agence du revenu du Canada pour obtenir un numéro d'entreprise (NE) à 9 chiffres, avec des comptes de programme facultatifs de TPS/TVH, de retenues sur la paie et d'importation-exportation.",
    heroTail: " + taxes applicables. Déposé dans un délai de 1 à 2 jours ouvrables.",
    steps: ["Entité", "Programmes", "Facturation"],
    backToServices: "← Retour aux services",
    entityH2: "Renseignements sur l'entité",
    entityIntro: "La personne ou l'entité inscrite pour le NE.",
    legalName: "Nom légal *",
    legalNameHint: "Nom légal du particulier ou dénomination sociale de la société.",
    entityType: "Type d'entité *",
    entityTypes: {
      individual: "Particulier",
      sole_prop: "Entreprise individuelle",
      partnership: "Société de personnes",
      corporation: "Société par actions",
    },
    entityAddress: "Adresse de l'entité",
    effective: "Date de prise d'effet *",
    effectiveHint: "La date à laquelle le NE doit prendre effet.",
    programsH2: "Programmes et contact",
    programsIntro: "Les comptes de programme de l'ARC dont vous avez besoin, et la personne à joindre au sujet de ce dossier.",
    revenue: "Revenu brut prévu *",
    revenueHint: "Les entreprises dont le revenu dépasse 30 000 $ par année doivent s'inscrire à la TPS/TVH.",
    revenueOptions: {
      under_30k: "Moins de 30 000 $ par année",
      over_30k: "Plus de 30 000 $ par année",
    },
    programsLabel: "Comptes de programme requis",
    gstTitle: "Compte de TPS/TVH",
    gstDesc: "Pour percevoir et verser la taxe de vente. Obligatoire au-delà de 30 000 $ par année.",
    payrollTitle: "Compte de retenues sur la paie",
    payrollDesc: "Pour verser les retenues sur la paie des employés, y compris le RPC et l'AE.",
    importTitle: "Compte d'importation-exportation",
    importDesc: "Pour importer ou exporter des marchandises commerciales à la frontière.",
    citTitle: "Compte d'impôt des sociétés",
    citDesc: "Obligatoire pour que les entreprises constituées en société produisent leurs déclarations T2.",
    contactFirst: "Prénom de la personne-ressource *",
    contactLast: "Nom de famille de la personne-ressource *",
    contactEmail: "Courriel de la personne-ressource *",
    contactPhone: "Téléphone de la personne-ressource *",
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
    h1: "Obtenga un número de negocio de la CRA",
    label: "Registro del número de negocio",
    description:
      "Regístrese ante la Agencia de Ingresos de Canadá (CRA) para obtener un número de negocio (BN) de 9 dígitos, con cuentas de programa opcionales de GST/HST, nómina e importación y exportación.",
    heroTail: " + impuestos aplicables. Presentado en un plazo de 1 a 2 días hábiles.",
    steps: ["Entidad", "Programas", "Facturación"],
    backToServices: "← Volver a los servicios",
    entityH2: "Datos de la entidad",
    entityIntro: "La persona o entidad que se registra para el BN.",
    legalName: "Nombre legal *",
    legalNameHint: "Nombre legal de la persona física o denominación legal de la sociedad.",
    entityType: "Tipo de entidad *",
    entityTypes: {
      individual: "Persona física",
      sole_prop: "Empresa unipersonal (sole proprietorship)",
      partnership: "Sociedad de personas (partnership)",
      corporation: "Sociedad por acciones",
    },
    entityAddress: "Dirección de la entidad",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo debe entrar en vigor el BN.",
    programsH2: "Programas y contacto",
    programsIntro: "Las cuentas de programa de la CRA que necesita y la persona con quien debemos comunicarnos sobre este expediente.",
    revenue: "Ingresos brutos previstos *",
    revenueHint: "Los negocios con ingresos superiores a $30,000 al año deben registrarse para el GST/HST.",
    revenueOptions: {
      under_30k: "Menos de $30,000 al año",
      over_30k: "Más de $30,000 al año",
    },
    programsLabel: "Cuentas de programa que necesita",
    gstTitle: "Cuenta de GST/HST",
    gstDesc: "Para cobrar y remitir el impuesto sobre las ventas. Obligatoria por encima de $30,000 al año.",
    payrollTitle: "Cuenta de nómina",
    payrollDesc: "Para remitir las retenciones de los empleados y las cotizaciones al CPP y al EI.",
    importTitle: "Cuenta de importación y exportación",
    importDesc: "Para importar o exportar mercancías comerciales a través de la frontera.",
    citTitle: "Cuenta del impuesto sobre la renta de sociedades",
    citDesc: "Obligatoria para que los negocios constituidos en sociedad presenten sus declaraciones T2.",
    contactFirst: "Nombre de la persona de contacto *",
    contactLast: "Apellido de la persona de contacto *",
    contactEmail: "Correo electrónico de contacto *",
    contactPhone: "Teléfono de contacto *",
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

// Schema messages for the fields specific to this wizard, translated for
// display only. The schema itself is unchanged; unknown messages pass through.
const ERROR_TEXT: Record<Exclude<Lang, "en">, Record<string, string>> = {
  fr: {
    "Select an entity type": "Sélectionnez un type d'entité",
    "Select your expected gross revenue": "Sélectionnez votre revenu brut prévu",
  },
  es: {
    "Select an entity type": "Seleccione un tipo de entidad",
    "Select your expected gross revenue": "Seleccione sus ingresos brutos previstos",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["legalName", "entityType", "entityAddress", "effectiveDate"],
  [
    "expectedRevenue",
    "programGst",
    "programPayroll",
    "programImportExport",
    "programCorporateIncomeTax",
    "contactFirstName",
    "contactLastName",
    "contactEmail",
    "contactPhone",
  ],
  ["billingName", "billingAddress"],
];

export default function BusinessNumberRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<BusinessNumberSubmission>({
    resolver: zodResolver(businessNumberSchema),
    mode: "onTouched",
    defaultValues: {
      legalName: "",
      entityType: "sole_prop",
      entityAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactPhone: "",
      programGst: false,
      programPayroll: false,
      programImportExport: false,
      programCorporateIncomeTax: false,
      expectedRevenue: "under_30k",
      effectiveDate: "",
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof BusinessNumberSubmission>> = {
      1: ["legalName", "entityType", "entityAddress", "effectiveDate"],
      2: [
        "expectedRevenue",
        "programGst",
        "programPayroll",
        "programImportExport",
        "programCorporateIncomeTax",
        "contactFirstName",
        "contactLastName",
        "contactEmail",
        "contactPhone",
      ],
    };
    const fields = fieldsByStep[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: BusinessNumberSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "business-number", payload: data }),
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
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span>{t.heroTail}
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.entityH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.entityIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label={t.legalName} error={errors.legalName?.message} hint={t.legalNameHint}>
                  <input type="text" {...register("legalName")} className={iCls} />
                </Field>

                <Field label={t.entityType} error={localizeError(lang, errors.entityType?.message)}>
                  <select {...register("entityType")} className={sCls}>
                    <option value="individual">{t.entityTypes.individual}</option>
                    <option value="sole_prop">{t.entityTypes.sole_prop}</option>
                    <option value="partnership">{t.entityTypes.partnership}</option>
                    <option value="corporation">{t.entityTypes.corporation}</option>
                  </select>
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.entityAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="entityAddress" errors={errors.entityAddress} />
                </div>

                <Field label={t.effective} error={errors.effectiveDate?.message} hint={t.effectiveHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.programsH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.programsIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label={t.revenue} error={localizeError(lang, errors.expectedRevenue?.message)} hint={t.revenueHint}>
                  <select {...register("expectedRevenue")} className={sCls}>
                    <option value="under_30k">{t.revenueOptions.under_30k}</option>
                    <option value="over_30k">{t.revenueOptions.over_30k}</option>
                  </select>
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
                    {t.programsLabel}
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programGst")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">{t.gstTitle}</p>
                        <p className="text-xs text-gray-500">{t.gstDesc}</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programPayroll")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">{t.payrollTitle}</p>
                        <p className="text-xs text-gray-500">{t.payrollDesc}</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programImportExport")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">{t.importTitle}</p>
                        <p className="text-xs text-gray-500">{t.importDesc}</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programCorporateIncomeTax")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">{t.citTitle}</p>
                        <p className="text-xs text-gray-500">{t.citDesc}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.contactFirst} error={errors.contactFirstName?.message}>
                    <input type="text" {...register("contactFirstName")} className={iCls} />
                  </Field>
                  <Field label={t.contactLast} error={errors.contactLastName?.message}>
                    <input type="text" {...register("contactLastName")} className={iCls} />
                  </Field>
                </div>
                <Field label={t.contactEmail} error={errors.contactEmail?.message}>
                  <input type="email" autoComplete="email" {...register("contactEmail")} className={iCls} />
                </Field>
                <Field label={t.contactPhone} error={errors.contactPhone?.message}>
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
