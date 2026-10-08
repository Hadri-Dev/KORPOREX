"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  changeAddressSchema,
  type ChangeAddressSubmission,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = AMENDMENT_SERVICES["change-address"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax. Filed within 2 business days.",
    steps: ["Corporation", "Address", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "Tell us which corporation's address is changing.",
    addressH2: "New Address",
    federalIntro:
      "Federal corporations file Form 3 to change the registered office address under CBCA s.19. The new address must be in the same province as the one stated in the Articles. Notice is required within ",
    ontarioIntroPre: "Ontario corporations file a Notice of Change under the ",
    ontarioAct: "Corporations Information Act",
    ontarioIntroPost:
      ". You can update either the registered office, the mailing address, or both. Notice is required within ",
    days: "15 days",
    changeOffice: "Change the registered office address.",
    changeMailing: "Change the mailing address.",
    mailingNote: "(Ontario only. Federal corporations use one address for both.)",
    newOffice: "New registered office address",
    officeProvinceNote:
      "Must be in the same province as the one stated in your Articles. Moving the registered office to a different province requires Articles of Amendment instead.",
    newMailing: "New mailing address",
    effective: "Effective date *",
    effectiveHint: "When the new address takes effect.",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions about this filing.",
    first: "First name *",
    last: "Last name *",
    email: "Email *",
    phone: "Phone *",
    role: "Your role",
    roleHint: "Optional. E.g. director, corporate secretary, accountant.",
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
    h1: "Changez l'adresse du siège social de votre société",
    label: "Changement d'adresse de la société",
    description:
      "Déposez l'avis de modification approprié pour déménager le siège social de votre société. L'avis doit être déposé auprès du registre dans les 15 jours suivant le changement.",
    heroTail: " + taxes applicables. Déposé dans un délai de 2 jours ouvrables.",
    steps: ["Société", "Adresse", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "Indiquez-nous la société dont l'adresse change.",
    addressH2: "Nouvelle adresse",
    federalIntro:
      "Les sociétés fédérales déposent le formulaire 3 pour changer l'adresse du siège social en vertu de l'article 19 de la LCSA. La nouvelle adresse doit se trouver dans la province indiquée dans les statuts. L'avis doit être déposé dans les ",
    ontarioIntroPre: "Les sociétés de l'Ontario déposent un avis de modification en vertu de la ",
    ontarioAct: "Loi sur les renseignements exigés des personnes morales",
    ontarioIntroPost:
      ". Vous pouvez mettre à jour le siège social, l'adresse postale, ou les deux. L'avis doit être déposé dans les ",
    days: "15 jours",
    changeOffice: "Changer l'adresse du siège social.",
    changeMailing: "Changer l'adresse postale.",
    mailingNote: "(Ontario seulement. Les sociétés fédérales utilisent une seule adresse pour les deux.)",
    newOffice: "Nouvelle adresse du siège social",
    officeProvinceNote:
      "Le siège social doit demeurer dans la province indiquée dans vos statuts. Pour le déplacer dans une autre province, il faut plutôt déposer des clauses modificatrices.",
    newMailing: "Nouvelle adresse postale",
    effective: "Date d'entrée en vigueur *",
    effectiveHint: "La date à laquelle la nouvelle adresse prend effet.",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions sur ce dépôt.",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel *",
    phone: "Téléphone *",
    role: "Votre rôle",
    roleHint: "Facultatif. p. ex. administrateur, secrétaire de la société, comptable.",
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
    h1: "Cambie el domicilio social de su sociedad",
    label: "Cambio de dirección de la sociedad",
    description:
      "Presente el aviso de cambio correspondiente para trasladar el domicilio social de su sociedad. Debe presentarse ante el registro dentro de los 15 días posteriores al cambio.",
    heroTail: " + impuestos aplicables. Presentado en un plazo de 2 días hábiles.",
    steps: ["Sociedad", "Dirección", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "Indíquenos de qué sociedad cambia la dirección.",
    addressH2: "Nueva dirección",
    federalIntro:
      "Las sociedades federales presentan el Formulario 3 para cambiar el domicilio social conforme al artículo 19 de la CBCA. La nueva dirección debe estar en la misma provincia indicada en los estatutos (Articles). El aviso debe presentarse dentro de los ",
    ontarioIntroPre: "Las sociedades de Ontario presentan un aviso de cambio (Notice of Change) en virtud de la ",
    ontarioAct: "Corporations Information Act",
    ontarioIntroPost:
      ". Puede actualizar el domicilio social, la dirección postal o ambos. El aviso debe presentarse dentro de los ",
    days: "15 días",
    changeOffice: "Cambiar el domicilio social.",
    changeMailing: "Cambiar la dirección postal.",
    mailingNote: "(Solo Ontario. Las sociedades federales usan una sola dirección para ambos fines.)",
    newOffice: "Nuevo domicilio social",
    officeProvinceNote:
      "Debe estar en la misma provincia indicada en sus estatutos (Articles). Para trasladar el domicilio social a otra provincia se requieren estatutos modificatorios (Articles of Amendment).",
    newMailing: "Nueva dirección postal",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo entra en vigor la nueva dirección.",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas sobre esta presentación.",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    role: "Su función",
    roleHint: "Opcional. P. ej., director, secretario corporativo, contador.",
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
  fr: { "Select at least one address to change": "Sélectionnez au moins une adresse à changer" },
  es: { "Select at least one address to change": "Seleccione al menos una dirección para cambiar" },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["corporation"],
  [
    "changeRegisteredOffice",
    "changeMailingAddress",
    "newRegisteredOffice",
    "newMailingAddress",
    "effectiveDate",
  ],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

export default function ChangeAddressPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<ChangeAddressSubmission>({
    resolver: zodResolver(changeAddressSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changeRegisteredOffice: true,
      changeMailingAddress: false,
      newRegisteredOffice: { ...emptyAddress },
      newMailingAddress: undefined,
      effectiveDate: "",
      contact: {
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        contactRole: "",
      },
      billingName: "",
      billingAddress: { ...emptyAddress },
    },
  });

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const changeRegisteredOffice = watch("changeRegisteredOffice");
  const changeMailingAddress = watch("changeMailingAddress");

  function toggleMailing(next: boolean) {
    setValue("changeMailingAddress", next);
    setValue("newMailingAddress", next ? { ...emptyAddress } : undefined);
  }

  function toggleRegistered(next: boolean) {
    setValue("changeRegisteredOffice", next);
    setValue("newRegisteredOffice", next ? { ...emptyAddress } : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeAddressSubmission | string>> = {
      1: ["corporation"],
      2: [
        "changeRegisteredOffice",
        "changeMailingAddress",
        "newRegisteredOffice",
        "newMailingAddress",
        "effectiveDate",
      ],
      3: ["contact"],
    };
    const fields = fieldsByStep[step];
    if (fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: ChangeAddressSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-address", payload: data }),
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
                <CorporationIdSection errors={errors.corporation} />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.addressH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal" ? (
                  <>{t.federalIntro}<strong>{t.days}</strong>.</>
                ) : (
                  <>{t.ontarioIntroPre}<em>{t.ontarioAct}</em>{t.ontarioIntroPost}<strong>{t.days}</strong>.</>
                )}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div className="space-y-3">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changeRegisteredOffice}
                      onChange={(e) => toggleRegistered(e.target.checked)}
                      className="mt-1 accent-navy-900"
                    />
                    <span className="text-gray-800"><strong>{t.changeOffice}</strong></span>
                  </label>

                  {jurisdiction === "ontario" && (
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={changeMailingAddress}
                        onChange={(e) => toggleMailing(e.target.checked)}
                        className="mt-1 accent-navy-900"
                      />
                      <span className="text-gray-800">
                        <strong>{t.changeMailing}</strong>{" "}
                        <span className="text-gray-500">{t.mailingNote}</span>
                      </span>
                    </label>
                  )}

                  {typeof errors.changeRegisteredOffice?.message === "string" && (
                    <p className="text-xs text-red-500">{localizeError(lang, errors.changeRegisteredOffice.message)}</p>
                  )}
                </div>

                {changeRegisteredOffice && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                      {t.newOffice} <span className="text-red-500">*</span>
                    </p>
                    <AddressFields name="newRegisteredOffice" errors={errors.newRegisteredOffice} />
                    {jurisdiction === "federal" && (
                      <p className="text-xs text-gray-500 mt-2">{t.officeProvinceNote}</p>
                    )}
                  </div>
                )}

                {changeMailingAddress && jurisdiction === "ontario" && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                      {t.newMailing} <span className="text-red-500">*</span>
                    </p>
                    <AddressFields name="newMailingAddress" errors={errors.newMailingAddress} />
                  </div>
                )}

                <Field label={t.effective} error={errors.effectiveDate?.message} hint={t.effectiveHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.contactH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.contactIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.first} error={errors.contact?.contactFirstName?.message}>
                    <input type="text" {...register("contact.contactFirstName")} className={iCls} />
                  </Field>
                  <Field label={t.last} error={errors.contact?.contactLastName?.message}>
                    <input type="text" {...register("contact.contactLastName")} className={iCls} />
                  </Field>
                </div>
                <Field label={t.email} error={errors.contact?.contactEmail?.message}>
                  <input type="email" autoComplete="email" {...register("contact.contactEmail")} className={iCls} />
                </Field>
                <Field label={t.phone} error={errors.contact?.contactPhone?.message}>
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} />
                </Field>
                <Field label={t.role} error={errors.contact?.contactRole?.message} hint={t.roleHint}>
                  <input type="text" {...register("contact.contactRole")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
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
