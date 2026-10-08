"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  extraProvincialSchema,
  type ExtraProvincialSubmission,
} from "@/lib/registrationSchemas";
import { REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";

const SERVICE = REGISTRATION_SERVICES["extra-provincial"];

type Lang = "en" | "fr" | "es";

const HOME_JURISDICTIONS = ["federal", "ontario", "bc", "alberta", "quebec", "other"] as const;
const TARGET_PROVINCES = [
  "ontario",
  "quebec",
  "bc",
  "alberta",
  "manitoba",
  "saskatchewan",
  "nb",
  "ns",
  "pei",
  "nl",
] as const;

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + provincial filing fees. Filed within 2–3 business days.",
    steps: ["Corporation", "Target & Agent", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "The corporation that wants to register in another province.",
    homeJurisdiction: "Home jurisdiction *",
    homeJurisdictionHint: "Where this corporation is currently incorporated.",
    homeOptions: {
      federal: "Federal (Canada)",
      ontario: "Ontario",
      bc: "British Columbia",
      alberta: "Alberta",
      quebec: "Quebec",
      other: "Other",
    },
    specifyJurisdiction: "Specify jurisdiction *",
    specifyPlaceholder: "e.g. Manitoba",
    corpName: "Corporation legal name *",
    corpNumber: "Corporation number *",
    corpNumberHint: "The corporation number from your home jurisdiction.",
    registeredOffice: "Registered office (home jurisdiction)",
    effective: "Effective date *",
    effectiveHint: "When extra-provincial registration should take effect.",
    targetH2: "Target Province & Agent",
    targetIntro: "Where you want to register, plus the local agent for service required in that province.",
    targetProvince: "Target province *",
    provinces: {
      ontario: "Ontario",
      quebec: "Quebec",
      bc: "British Columbia",
      alberta: "Alberta",
      manitoba: "Manitoba",
      saskatchewan: "Saskatchewan",
      nb: "New Brunswick",
      ns: "Nova Scotia",
      pei: "Prince Edward Island",
      nl: "Newfoundland and Labrador",
    },
    agentName: "Agent for service (full name) *",
    agentNameHint:
      "A person or firm resident in the target province who can accept legal documents on the corporation's behalf.",
    agentAddress: "Agent address (in target province)",
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
    govFees:
      "Provincial government filing fees vary by province and are invoiced separately as a pass-through after submission.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Enregistrement extraprovincial de votre société",
    label: "Enregistrement extraprovincial",
    description:
      "Enregistrez votre société pour exercer légalement ses activités dans une autre province canadienne tout en conservant sa constitution dans son territoire d'origine.",
    heroTail: " + taxes applicables + droits de dépôt provinciaux. Déposé dans un délai de 2 à 3 jours ouvrables.",
    steps: ["Société", "Province et mandataire", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "La société qui souhaite s'enregistrer dans une autre province.",
    homeJurisdiction: "Territoire de constitution *",
    homeJurisdictionHint: "Le territoire où cette société est actuellement constituée.",
    homeOptions: {
      federal: "Fédéral (Canada)",
      ontario: "Ontario",
      bc: "Colombie-Britannique",
      alberta: "Alberta",
      quebec: "Québec",
      other: "Autre",
    },
    specifyJurisdiction: "Précisez le territoire *",
    specifyPlaceholder: "p. ex. Manitoba",
    corpName: "Dénomination sociale de la société *",
    corpNumber: "Numéro de la société *",
    corpNumberHint: "Le numéro de société attribué dans votre territoire de constitution.",
    registeredOffice: "Siège social (territoire de constitution)",
    effective: "Date de prise d'effet *",
    effectiveHint: "La date à laquelle l'enregistrement extraprovincial doit prendre effet.",
    targetH2: "Province visée et mandataire",
    targetIntro:
      "La province où vous souhaitez vous enregistrer, ainsi que le mandataire aux fins de signification exigé dans cette province.",
    targetProvince: "Province visée *",
    provinces: {
      ontario: "Ontario",
      quebec: "Québec",
      bc: "Colombie-Britannique",
      alberta: "Alberta",
      manitoba: "Manitoba",
      saskatchewan: "Saskatchewan",
      nb: "Nouveau-Brunswick",
      ns: "Nouvelle-Écosse",
      pei: "Île-du-Prince-Édouard",
      nl: "Terre-Neuve-et-Labrador",
    },
    agentName: "Mandataire aux fins de signification (nom complet) *",
    agentNameHint:
      "Une personne ou un cabinet résidant dans la province visée qui peut accepter des documents juridiques au nom de la société.",
    agentAddress: "Adresse du mandataire (dans la province visée)",
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
    govFees:
      "Les droits de dépôt gouvernementaux varient selon la province et sont facturés séparément, au prix coûtant, après l'envoi de la demande.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Registro extraprovincial de su sociedad",
    label: "Registro extraprovincial",
    description:
      "Registre su sociedad para operar legalmente en otra provincia canadiense, conservando su constitución en su jurisdicción de origen.",
    heroTail: " + impuestos aplicables + tasas provinciales de presentación. Presentado en un plazo de 2 a 3 días hábiles.",
    steps: ["Sociedad", "Provincia y agente", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "La sociedad que desea registrarse en otra provincia.",
    homeJurisdiction: "Jurisdicción de origen *",
    homeJurisdictionHint: "Donde está constituida actualmente esta sociedad.",
    homeOptions: {
      federal: "Federal (Canadá)",
      ontario: "Ontario",
      bc: "Columbia Británica",
      alberta: "Alberta",
      quebec: "Quebec",
      other: "Otra",
    },
    specifyJurisdiction: "Especifique la jurisdicción *",
    specifyPlaceholder: "p. ej., Manitoba",
    corpName: "Denominación legal de la sociedad *",
    corpNumber: "Número de sociedad *",
    corpNumberHint: "El número de sociedad asignado en su jurisdicción de origen.",
    registeredOffice: "Domicilio social (jurisdicción de origen)",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo debe entrar en vigor el registro extraprovincial.",
    targetH2: "Provincia de destino y agente",
    targetIntro:
      "Dónde desea registrarse y el agente local para notificaciones que se exige en esa provincia.",
    targetProvince: "Provincia de destino *",
    provinces: {
      ontario: "Ontario",
      quebec: "Quebec",
      bc: "Columbia Británica",
      alberta: "Alberta",
      manitoba: "Manitoba",
      saskatchewan: "Saskatchewan",
      nb: "Nuevo Brunswick",
      ns: "Nueva Escocia",
      pei: "Isla del Príncipe Eduardo",
      nl: "Terranova y Labrador",
    },
    agentName: "Agente para notificaciones (nombre completo) *",
    agentNameHint:
      "Una persona o firma residente en la provincia de destino que puede aceptar documentos legales en nombre de la sociedad.",
    agentAddress: "Dirección del agente (en la provincia de destino)",
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
    govFees:
      "Las tasas gubernamentales de presentación varían según la provincia y se facturan por separado, al costo, después del envío.",
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
    "Select your home jurisdiction": "Sélectionnez votre territoire de constitution",
    "Select a target province": "Sélectionnez une province visée",
  },
  es: {
    "Select your home jurisdiction": "Seleccione su jurisdicción de origen",
    "Select a target province": "Seleccione una provincia de destino",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["homeJurisdiction", "homeJurisdictionOther", "corpName", "corpNumber", "corpRegisteredOffice", "effectiveDate"],
  ["targetProvince", "agentName", "agentAddress", "contactEmail", "contactPhone"],
  ["billingName", "billingAddress"],
];

export default function ExtraProvincialRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<ExtraProvincialSubmission>({
    resolver: zodResolver(extraProvincialSchema),
    mode: "onTouched",
    defaultValues: {
      homeJurisdiction: "ontario",
      homeJurisdictionOther: "",
      corpName: "",
      corpNumber: "",
      targetProvince: "ontario",
      effectiveDate: "",
      corpRegisteredOffice: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      agentName: "",
      agentAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      contactEmail: "",
      contactPhone: "",
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const homeJurisdiction = watch("homeJurisdiction");

  async function gotoStep(next: number) {
    const baseStep1: Array<keyof ExtraProvincialSubmission> = [
      "homeJurisdiction",
      "corpName",
      "corpNumber",
      "corpRegisteredOffice",
      "effectiveDate",
    ];
    if (homeJurisdiction === "other") baseStep1.push("homeJurisdictionOther");
    const fieldsByStep: Record<number, Array<keyof ExtraProvincialSubmission>> = {
      1: baseStep1,
      2: ["targetProvince", "agentName", "agentAddress", "contactEmail", "contactPhone"],
    };
    const fields = fieldsByStep[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: ExtraProvincialSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "extra-provincial", payload: data }),
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.corpH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.corpIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label={t.homeJurisdiction} error={localizeError(lang, errors.homeJurisdiction?.message)} hint={t.homeJurisdictionHint}>
                  <select {...register("homeJurisdiction")} className={sCls}>
                    {HOME_JURISDICTIONS.map((v) => (
                      <option key={v} value={v}>{t.homeOptions[v]}</option>
                    ))}
                  </select>
                </Field>

                {homeJurisdiction === "other" && (
                  <Field label={t.specifyJurisdiction} error={errors.homeJurisdictionOther?.message}>
                    <input type="text" {...register("homeJurisdictionOther")} className={iCls} placeholder={t.specifyPlaceholder} />
                  </Field>
                )}

                <Field label={t.corpName} error={errors.corpName?.message}>
                  <input type="text" {...register("corpName")} className={iCls} placeholder="ACME Holdings Inc." />
                </Field>

                <Field label={t.corpNumber} error={errors.corpNumber?.message} hint={t.corpNumberHint}>
                  <input type="text" {...register("corpNumber")} className={iCls} placeholder="1234567" />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.registeredOffice} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="corpRegisteredOffice" errors={errors.corpRegisteredOffice} />
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.targetH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.targetIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label={t.targetProvince} error={localizeError(lang, errors.targetProvince?.message)}>
                  <select {...register("targetProvince")} className={sCls}>
                    {TARGET_PROVINCES.map((v) => (
                      <option key={v} value={v}>{t.provinces[v]}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t.agentName} error={errors.agentName?.message} hint={t.agentNameHint}>
                  <input type="text" {...register("agentName")} className={iCls} />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.agentAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="agentAddress" errors={errors.agentAddress} />
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
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.govFees}</p>
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
