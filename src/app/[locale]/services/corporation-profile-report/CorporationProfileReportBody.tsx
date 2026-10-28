"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  corporationProfileReportSchema,
  type CorporationProfileReportSubmission,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";

const SERVICE = COMPLIANCE_SERVICES["corporation-profile-report"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " flat, no tax added. Government fee included. Emailed within 1 business day.",
    steps: ["Corporation", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Which Corporation?",
    corpIntro: "The corporation you want the report for. It does not have to be your own: profile reports are public records.",
    jurisdiction: "Jurisdiction *",
    jurisdictionHint: "For a federal corporation, the Ontario report shows only the basic information filed in Ontario: it does not list directors or officers, and its status refers you to Corporations Canada.",
    select: "Select…",
    optOntario: "Ontario corporation (OBCA)",
    optFederal: "Federal corporation (CBCA) active in Ontario",
    jurisdictionError: "Select the corporation's jurisdiction",
    corpName: "Corporation legal name *",
    corpNameHint: 'Include the legal ending (e.g. "Acme Holdings Inc."). For a numbered company, enter the number name (e.g. "1234567 Ontario Inc.").',
    numberOntario: "Ontario Corporation Number (OCN)",
    numberFederal: "Corporation number",
    numberHint: "Optional, but it lets us find the exact corporation when several have similar names.",
    bn: "CRA Business Number (BN)",
    bnHint: "Optional.",
    purpose: "What is the report for?",
    purposeHint: "Optional. E.g. bank account, loan, lease, due diligence.",
    contactH2: "Contact & Delivery",
    contactIntro: "We email the report to this address.",
    first: "First name *",
    last: "Last name *",
    email: "Email (report delivered here) *",
    phone: "Phone *",
    role: "Your role",
    roleHint: "Optional. E.g. director, accountant, lender.",
    billingH2: "Billing & Review",
    billingIntro: "Final step. We'll redirect you to Stripe to complete payment.",
    billingName: "Billing name *",
    billingNameHint: "Name on the credit/debit card.",
    billingAddress: "Billing address",
    summary: "Order summary",
    tax: "Tax",
    noTax: "None",
    total: "Total (CAD)",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Commandez un rapport de profil de société",
    label: "Rapport de profil de société",
    description:
      "Le rapport de profil de société est le dossier officiel que le Registre des entreprises de l'Ontario détient sur une société : sa dénomination, son numéro, son statut, sa date de constitution, les adresses de son siège social et de correspondance et, pour les sociétés ontariennes, les administrateurs et dirigeants inscrits. Les banques, les prêteurs, les locateurs et les acheteurs en demandent souvent un. Korporex commande le rapport et vous l'envoie par courriel.",
    heroTail: " forfaitaire, aucune taxe ajoutée. Droits gouvernementaux inclus. Envoyé par courriel dans un délai de 1 jour ouvrable.",
    steps: ["Société", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Quelle société?",
    corpIntro: "La société visée par le rapport. Il n'est pas nécessaire que ce soit la vôtre : les rapports de profil sont des documents publics.",
    jurisdiction: "Compétence *",
    jurisdictionHint: "Pour une société fédérale, le rapport de l'Ontario ne contient que les renseignements de base déposés en Ontario : il n'énumère pas les administrateurs ni les dirigeants, et son statut renvoie à Corporations Canada.",
    select: "Sélectionnez…",
    optOntario: "Société ontarienne (LSAO)",
    optFederal: "Société fédérale (LCSA) active en Ontario",
    jurisdictionError: "Sélectionnez la compétence de la société",
    corpName: "Dénomination sociale de la société *",
    corpNameHint: "Incluez l'élément juridique (p. ex. « Acme Holdings Inc. »). Pour une société à numéro, indiquez la dénomination numérique (p. ex. « 1234567 Ontario Inc. »).",
    numberOntario: "Numéro de société de l'Ontario (NSO)",
    numberFederal: "Numéro de la société",
    numberHint: "Facultatif, mais il nous permet de trouver la bonne société lorsque plusieurs portent des noms semblables.",
    bn: "Numéro d'entreprise de l'ARC (NE)",
    bnHint: "Facultatif.",
    purpose: "À quoi servira le rapport?",
    purposeHint: "Facultatif. P. ex. compte bancaire, prêt, bail, vérification diligente.",
    contactH2: "Contact et livraison",
    contactIntro: "Nous envoyons le rapport à cette adresse courriel.",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel (le rapport y sera envoyé) *",
    phone: "Téléphone *",
    role: "Votre rôle",
    roleHint: "Facultatif. P. ex. administrateur, comptable, prêteur.",
    billingH2: "Facturation et vérification",
    billingIntro: "Dernière étape. Nous vous redirigerons vers Stripe pour effectuer le paiement.",
    billingName: "Nom de facturation *",
    billingNameHint: "Nom figurant sur la carte de crédit ou de débit.",
    billingAddress: "Adresse de facturation",
    summary: "Résumé de la commande",
    tax: "Taxe",
    noTax: "Aucune",
    total: "Total (CAD)",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Solicite un informe de perfil corporativo",
    label: "Informe de perfil corporativo",
    description:
      "El informe de perfil corporativo (Corporation Profile Report) es el registro oficial que el Registro de Empresas de Ontario mantiene sobre una corporación: su nombre, número, estado, fecha de constitución, domicilio social, su dirección postal y, en el caso de las corporaciones de Ontario, los directores y funcionarios registrados. Los bancos, prestamistas, arrendadores y compradores suelen pedirlo. Korporex solicita el informe y se lo envía por correo electrónico.",
    heroTail: " tarifa fija, sin impuestos añadidos. Tasa gubernamental incluida. Enviado por correo electrónico en 1 día hábil.",
    steps: ["Corporación", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "¿Qué corporación?",
    corpIntro: "La corporación sobre la que desea el informe. No tiene que ser la suya: los informes de perfil son registros públicos.",
    jurisdiction: "Jurisdicción *",
    jurisdictionHint: "Para una corporación federal, el informe de Ontario solo muestra la información básica presentada en Ontario: no enumera directores ni funcionarios, y su estado remite a Corporations Canada.",
    select: "Seleccione…",
    optOntario: "Corporación de Ontario (OBCA)",
    optFederal: "Corporación federal (CBCA) activa en Ontario",
    jurisdictionError: "Seleccione la jurisdicción de la corporación",
    corpName: "Nombre legal de la corporación *",
    corpNameHint: 'Incluya la terminación legal (p. ej., "Acme Holdings Inc."). Para una corporación numerada, indique el nombre numérico (p. ej., "1234567 Ontario Inc.").',
    numberOntario: "Número de corporación de Ontario (OCN)",
    numberFederal: "Número de corporación",
    numberHint: "Opcional, pero nos permite encontrar la corporación exacta cuando varias tienen nombres parecidos.",
    bn: "Número de empresa de la CRA (BN)",
    bnHint: "Opcional.",
    purpose: "¿Para qué es el informe?",
    purposeHint: "Opcional. P. ej., cuenta bancaria, préstamo, arrendamiento, diligencia debida.",
    contactH2: "Contacto y entrega",
    contactIntro: "Enviamos el informe a este correo electrónico.",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico (recibirá aquí el informe) *",
    phone: "Teléfono *",
    role: "Su función",
    roleHint: "Opcional. P. ej., director, contador, prestamista.",
    billingH2: "Facturación y revisión",
    billingIntro: "Último paso. Lo redirigiremos a Stripe para completar el pago.",
    billingName: "Nombre de facturación *",
    billingNameHint: "Nombre que figura en la tarjeta de crédito o débito.",
    billingAddress: "Dirección de facturación",
    summary: "Resumen del pedido",
    tax: "Impuesto",
    noTax: "Ninguno",
    total: "Total (CAD)",
    submitting: "Redirigiendo a Stripe…",
    submit: "Continuar al pago",
    stripe: "El pago se procesa de forma segura a través de Stripe. Los datos de su tarjeta nunca pasan por nuestro servidor.",
    failed: "No se pudo enviar la solicitud.",
  },
} as const;

const STEP_FIELDS: string[][] = [
  ["corporation", "purpose"],
  ["contact"],
  ["billingName", "billingAddress"],
];

export default function CorporationProfileReportBody() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<CorporationProfileReportSubmission>({
    resolver: zodResolver(corporationProfileReportSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      purpose: "",
      contact: {
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        contactRole: "",
      },
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const jurisdictionError =
    errors.corporation?.jurisdiction?.message ? t.jurisdictionError : undefined;

  async function gotoStep(next: number) {
    const fields = STEP_FIELDS[step - 1];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valid = await trigger(fields as any);
    if (!valid) return;
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: CorporationProfileReportSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "corporation-profile-report", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? t.failed);
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.failed);
      setSubmitting(false);
    }
  }

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
                <Field label={t.jurisdiction} error={jurisdictionError} hint={t.jurisdictionHint}>
                  <select {...register("corporation.jurisdiction")} className={sCls}>
                    <option value="ontario">{t.optOntario}</option>
                    <option value="federal">{t.optFederal}</option>
                  </select>
                </Field>
                <Field label={t.corpName} error={errors.corporation?.corpName?.message} hint={t.corpNameHint}>
                  <input type="text" {...register("corporation.corpName")} className={iCls} placeholder="Acme Holdings Inc." />
                </Field>
                <Field
                  label={jurisdiction === "federal" ? t.numberFederal : t.numberOntario}
                  error={errors.corporation?.corpNumber?.message}
                  hint={t.numberHint}
                >
                  <input type="text" {...register("corporation.corpNumber")} className={iCls} placeholder="1234567" />
                </Field>
                <Field label={t.bn} error={errors.corporation?.businessNumber?.message} hint={t.bnHint}>
                  <input type="text" {...register("corporation.businessNumber")} className={iCls} />
                </Field>
                <Field label={t.purpose} error={errors.purpose?.message} hint={t.purposeHint}>
                  <input type="text" {...register("purpose")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.contactH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.contactIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
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
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>{t.tax}</span>
                      <span>{t.noTax}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-navy-900">{t.total}</span>
                      <span className="text-navy-900">${SERVICE.price.toFixed(2)}</span>
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
