"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider, useFormContext, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  changeShareholderSchema,
  type ChangeShareholderSubmission,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = AMENDMENT_SERVICES["change-shareholder"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax. Updated within 2 business days.",
    noteStrong: "Note:",
    notePre: " Shareholder changes are ",
    noteNot: "not",
    notePost:
      " filed with the government. Korporex updates your corporation's internal records (register of shareholders and share certificates). For complex transactions, restrictions, or unanimous shareholder agreements, speak with a lawyer.",
    steps: ["Corporation", "Shares", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "Tell us which corporation's shareholder register is being updated.",
    sharesH2: "The Share Change",
    sharesIntro: "What's changing in the share register.",
    changeType: "Type of change *",
    typeIssuance: "New issuance (corporation issues new shares)",
    typeTransfer: "Transfer (one shareholder to another)",
    typeRedemption: "Redemption (corporation buys back shares)",
    typeCancellation: "Cancellation",
    shareClass: "Share class *",
    shareClassHint: "As named in the Articles.",
    numberOfShares: "Number of shares *",
    consideration: "Consideration / price",
    considerationHint: "Optional. E.g. '$1.00/share', 'nil', 'gift'. Recorded in the minute book.",
    considerationPlaceholder: "$1.00 per share",
    effective: "Effective date *",
    fromTransferor: "From (transferor)",
    fromRedeemed: "Shareholder being redeemed / cancelled",
    toTransferee: "To (transferee)",
    toNew: "New shareholder",
    notes: "Notes",
    notesHint: "Anything else relevant to this transaction.",
    partyType: "Party type *",
    individual: "Individual",
    corporation: "Corporation",
    first: "First name *",
    last: "Last name *",
    corpName: "Corporation legal name *",
    corpNumber: "Corporation number",
    corpNumberHint: "Optional but recommended for the share certificate.",
    partyEmail: "Email",
    partyEmailHint: "Optional. Used to send the share certificate.",
    address: "Address",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions.",
    email: "Email *",
    phone: "Phone *",
    yourRole: "Your role",
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
    h1: "Consignez un changement d'actionnaire dans les registres de votre société",
    label: "Changement d'actionnaire",
    description:
      "Mettez à jour le registre des actionnaires de votre société et émettez un nouveau certificat d'actions lorsque des actions sont transférées, rachetées ou nouvellement émises. Il s'agit d'une mise à jour des registres internes de la société, et non d'un dépôt gouvernemental.",
    heroTail: " + taxes applicables. Mis à jour dans un délai de 2 jours ouvrables.",
    noteStrong: "Remarque :",
    notePre: " Les changements d'actionnaires ne sont ",
    noteNot: "pas",
    notePost:
      " déposés auprès du gouvernement. Korporex met à jour les registres internes de votre société (registre des actionnaires et certificats d'actions). Pour les opérations complexes, les restrictions ou les conventions unanimes des actionnaires, consultez un avocat.",
    steps: ["Société", "Actions", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "Indiquez-nous la société dont le registre des actionnaires est mis à jour.",
    sharesH2: "Le changement d'actions",
    sharesIntro: "Ce qui change dans le registre des actionnaires.",
    changeType: "Type de changement *",
    typeIssuance: "Nouvelle émission (la société émet de nouvelles actions)",
    typeTransfer: "Transfert (d'un actionnaire à un autre)",
    typeRedemption: "Rachat (la société rachète des actions)",
    typeCancellation: "Annulation",
    shareClass: "Catégorie d'actions *",
    shareClassHint: "Telle qu'elle est désignée dans les statuts.",
    numberOfShares: "Nombre d'actions *",
    consideration: "Contrepartie ou prix",
    considerationHint: "Facultatif. p. ex. « 1,00 $ par action », « nulle », « don ». Consigné dans le livre des procès-verbaux.",
    considerationPlaceholder: "1,00 $ par action",
    effective: "Date de prise d'effet *",
    fromTransferor: "De (cédant)",
    fromRedeemed: "Actionnaire dont les actions sont rachetées ou annulées",
    toTransferee: "À (cessionnaire)",
    toNew: "Nouvel actionnaire",
    notes: "Remarques",
    notesHint: "Tout autre renseignement utile concernant cette opération.",
    partyType: "Type de partie *",
    individual: "Particulier",
    corporation: "Société",
    first: "Prénom *",
    last: "Nom de famille *",
    corpName: "Dénomination sociale de la société *",
    corpNumber: "Numéro de société",
    corpNumberHint: "Facultatif, mais recommandé pour le certificat d'actions.",
    partyEmail: "Courriel",
    partyEmailHint: "Facultatif. Utilisé pour envoyer le certificat d'actions.",
    address: "Adresse",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions.",
    email: "Courriel *",
    phone: "Téléphone *",
    yourRole: "Votre rôle",
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
    h1: "Registre un cambio de accionista en los registros de su sociedad",
    label: "Cambio de accionista",
    description:
      "Actualice el registro de accionistas de su sociedad y emita un nuevo certificado de acciones cuando se transfieran, rescaten o emitan nuevas acciones. Se trata de una actualización de los registros internos de la sociedad, no de una presentación ante el gobierno.",
    heroTail: " + impuestos aplicables. Actualizado en un plazo de 2 días hábiles.",
    noteStrong: "Nota:",
    notePre: " Los cambios de accionistas ",
    noteNot: "no",
    notePost:
      " se presentan ante el gobierno. Korporex actualiza los registros internos de su sociedad (registro de accionistas y certificados de acciones). Para operaciones complejas, restricciones o convenios unánimes de accionistas, consulte a un abogado.",
    steps: ["Sociedad", "Acciones", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "Indíquenos qué sociedad actualiza su registro de accionistas.",
    sharesH2: "El cambio de acciones",
    sharesIntro: "Qué cambia en el registro de accionistas.",
    changeType: "Tipo de cambio *",
    typeIssuance: "Nueva emisión (la sociedad emite nuevas acciones)",
    typeTransfer: "Transferencia (de un accionista a otro)",
    typeRedemption: "Rescate (la sociedad recompra acciones)",
    typeCancellation: "Cancelación",
    shareClass: "Clase de acciones *",
    shareClassHint: "Tal como figura en los estatutos (Articles).",
    numberOfShares: "Número de acciones *",
    consideration: "Contraprestación o precio",
    considerationHint: "Opcional. P. ej., \"$1.00 por acción\", \"ninguna\", \"donación\". Se registra en el libro de actas.",
    considerationPlaceholder: "$1.00 por acción",
    effective: "Fecha de entrada en vigor *",
    fromTransferor: "De (cedente)",
    fromRedeemed: "Accionista cuyas acciones se rescatan o cancelan",
    toTransferee: "A (cesionario)",
    toNew: "Nuevo accionista",
    notes: "Notas",
    notesHint: "Cualquier otro dato relevante sobre esta operación.",
    partyType: "Tipo de parte *",
    individual: "Persona física",
    corporation: "Sociedad",
    first: "Nombre *",
    last: "Apellido *",
    corpName: "Denominación legal de la sociedad *",
    corpNumber: "Número de sociedad",
    corpNumberHint: "Opcional, pero recomendado para el certificado de acciones.",
    partyEmail: "Correo electrónico",
    partyEmailHint: "Opcional. Se usa para enviar el certificado de acciones.",
    address: "Dirección",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas.",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    yourRole: "Su función",
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
  fr: {
    "Select the type of share change": "Sélectionnez le type de changement d'actions",
    "Select party type": "Sélectionnez le type de partie",
    "Whole number": "Nombre entier requis",
    "Must be positive": "Doit être un nombre positif",
  },
  es: {
    "Select the type of share change": "Seleccione el tipo de cambio de acciones",
    "Select party type": "Seleccione el tipo de parte",
    "Whole number": "Debe ser un número entero",
    "Must be positive": "Debe ser un número positivo",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

function useLang(): Lang {
  const locale = useLocale();
  return locale === "fr" || locale === "es" ? locale : "en";
}

const STEP_FIELDS: string[][] = [
  ["corporation"],
  ["changeType", "shareClass", "numberOfShares", "effectiveDate", "fromParty", "toParty", "notes"],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyParty: NonNullable<ChangeShareholderSubmission["fromParty"]> = {
  partyType: "individual",
  firstName: "",
  lastName: "",
  corpName: "",
  corpNumber: "",
  email: "",
  address: { street: "", city: "", region: "", postalCode: "", country: "CA" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PartySubForm({ name, errors }: { name: "fromParty" | "toParty"; errors?: any }) {
  const { register, watch } = useFormContext<ChangeShareholderSubmission>();
  const lang = useLang();
  const t = COPY[lang];
  const partyType = watch(`${name}.partyType`);
  const e = (errors ?? {}) as FieldErrors<NonNullable<ChangeShareholderSubmission["fromParty"]>>;
  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-5 bg-cream-50/30">
      <Field label={t.partyType} error={localizeError(lang, e.partyType?.message)}>
        <select {...register(`${name}.partyType`)} className={sCls}>
          <option value="individual">{t.individual}</option>
          <option value="corporation">{t.corporation}</option>
        </select>
      </Field>

      {partyType === "individual" ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.first} error={e.firstName?.message}>
            <input type="text" {...register(`${name}.firstName`)} className={iCls} />
          </Field>
          <Field label={t.last} error={e.lastName?.message}>
            <input type="text" {...register(`${name}.lastName`)} className={iCls} />
          </Field>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label={t.corpName} error={e.corpName?.message}>
            <input type="text" {...register(`${name}.corpName`)} className={iCls} placeholder="Holdco Inc." />
          </Field>
          <Field label={t.corpNumber} error={e.corpNumber?.message} hint={t.corpNumberHint}>
            <input type="text" {...register(`${name}.corpNumber`)} className={iCls} />
          </Field>
        </div>
      )}

      <Field label={t.partyEmail} error={e.email?.message} hint={t.partyEmailHint}>
        <input type="email" {...register(`${name}.email`)} className={iCls} />
      </Field>

      <div>
        <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
          {t.address} <span className="text-red-500">*</span>
        </p>
        <AddressFields name={`${name}.address`} errors={e.address} canadaOnly={false} />
      </div>
    </div>
  );
}

export default function ChangeShareholderPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const lang = useLang();
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<ChangeShareholderSubmission>({
    resolver: zodResolver(changeShareholderSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changeType: "issuance",
      shareClass: "Class A Common",
      numberOfShares: 0,
      consideration: "",
      effectiveDate: "",
      fromParty: undefined,
      toParty: { ...emptyParty },
      notes: "",
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

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const changeType = watch("changeType");
  const needsFrom = changeType === "transfer" || changeType === "redemption" || changeType === "cancellation";
  const needsTo = changeType === "issuance" || changeType === "transfer";

  function syncPartyVisibility(next: ChangeShareholderSubmission["changeType"]) {
    const wantsFrom = next === "transfer" || next === "redemption" || next === "cancellation";
    const wantsTo = next === "issuance" || next === "transfer";
    setValue("fromParty", wantsFrom ? { ...emptyParty } : undefined);
    setValue("toParty", wantsTo ? { ...emptyParty } : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeShareholderSubmission | string>> = {
      1: ["corporation"],
      2: ["changeType", "shareClass", "numberOfShares", "effectiveDate", "fromParty", "toParty", "notes"],
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

  async function onFinalSubmit(data: ChangeShareholderSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-shareholder", payload: data }),
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
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>{t.noteStrong}</strong>{t.notePre}<em>{t.noteNot}</em>{t.notePost}
          </div>
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.sharesH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.sharesIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label={t.changeType} error={err(errors.changeType?.message)}>
                  <select
                    {...register("changeType", {
                      onChange: (e) => syncPartyVisibility(e.target.value as ChangeShareholderSubmission["changeType"]),
                    })}
                    className={sCls}
                  >
                    <option value="issuance">{t.typeIssuance}</option>
                    <option value="transfer">{t.typeTransfer}</option>
                    <option value="redemption">{t.typeRedemption}</option>
                    <option value="cancellation">{t.typeCancellation}</option>
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.shareClass} error={errors.shareClass?.message} hint={t.shareClassHint}>
                    <input type="text" {...register("shareClass")} className={iCls} placeholder="Class A Common" />
                  </Field>
                  <Field label={t.numberOfShares} error={err(errors.numberOfShares?.message)}>
                    <input type="number" min={1} {...register("numberOfShares", { valueAsNumber: true })} className={iCls} />
                  </Field>
                </div>

                <Field label={t.consideration} error={errors.consideration?.message} hint={t.considerationHint}>
                  <input type="text" {...register("consideration")} className={iCls} placeholder={t.considerationPlaceholder} />
                </Field>

                <Field label={t.effective} error={errors.effectiveDate?.message}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                {needsFrom && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-2">
                      {changeType === "transfer" ? t.fromTransferor : t.fromRedeemed}
                    </p>
                    <PartySubForm name="fromParty" errors={errors.fromParty} />
                  </div>
                )}

                {needsTo && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-2">
                      {changeType === "transfer" ? t.toTransferee : t.toNew}
                    </p>
                    <PartySubForm name="toParty" errors={errors.toParty} />
                  </div>
                )}

                <Field label={t.notes} error={errors.notes?.message} hint={t.notesHint}>
                  <textarea {...register("notes")} rows={3} className={`${iCls} resize-none`} />
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
                <Field label={t.yourRole} error={errors.contact?.contactRole?.message} hint={t.roleHint}>
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
