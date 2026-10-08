"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  revivalSchema,
  type RevivalSubmission,
  type CurrentDirector,
  type CurrentOfficer,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { CurrentDirectorsArray, CurrentOfficersArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["revive-business"];

type Lang = "en" | "fr" | "es";

const REASON_VALUES = ["voluntary", "default_failure_to_file", "court_order", "other"] as const;
const RELATIONSHIP_VALUES = ["former_director", "former_shareholder", "creditor", "court_order", "other"] as const;

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + government filing fees (pass-through). Filed within 3 business days.",
    steps: ["Corporation", "Revival", "Structure", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Dissolved Corporation",
    corpIntro: "Tell us which corporation you're reviving and how it was dissolved.",
    dissolutionDate: "Dissolution date *",
    dissolutionDateHint: "Date the corporation was dissolved (per the certificate of dissolution).",
    reasonLabel: "Reason for original dissolution *",
    reasons: {
      voluntary: "Voluntary (Articles of Dissolution filed)",
      default_failure_to_file: "Default: dissolved by the registrar for failure to file",
      court_order: "Court order",
      other: "Other",
    },
    ontarioNotRevivable:
      "Under the Ontario Business Corporations Act (s.241(9)), Articles of Revival are only available for a corporation dissolved by the Director, for example for unfiled annual returns. A voluntary or court-ordered Ontario dissolution cannot be reversed by filing Articles of Revival, so Korporex cannot file this request. Korporex does not provide legal advice; a lawyer can tell you whether any other option applies to your situation.",
    reasonOther: "Describe the reason *",
    revivalH2: "Revival Details",
    federalIntro: "Articles of Revival are filed under CBCA s.209 (Form 15).",
    ontarioIntro: "Articles of Revival are filed under OBCA s.241(9).",
    filingsPre: "I confirm all ",
    filingsStrong: "outstanding annual returns and required filings",
    filingsPost: " have been (or will be) brought current with the registry.",
    filingsNote: "Default revivals require the corporation to be brought into good standing before the registrar will accept the revival.",
    relationshipLabel: "Your relationship to the dissolved corporation *",
    relationshipHint: "Both CBCA s.209(1) and OBCA s.241 allow an interested person to request revival.",
    relationships: {
      former_director: "Former director",
      former_shareholder: "Former shareholder",
      creditor: "Creditor",
      court_order: "Authorized by court order",
      other: "Other",
    },
    relationshipOther: "Describe your relationship *",
    reasonForRevival: "Reason for revival *",
    reasonForRevivalHint: "e.g. resuming operations, settling an outstanding claim, transferring assets to a new shareholder, completing a sale.",
    effective: "Effective date *",
    structureH2: "Post-Revival Structure",
    structureIntro: "The corporation's registered office, directors, and officers as the corporation continues after revival.",
    revivedOffice: "Registered office (post-revival)",
    directors: "Directors",
    officers: "Officers",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions.",
    first: "First name *",
    last: "Last name *",
    email: "Email *",
    phone: "Phone *",
    role: "Your role",
    roleHint: "Optional. E.g. former director, accountant, legal representative.",
    billingH2: "Billing & Review",
    billingIntro: "Final step. We'll redirect you to Stripe to complete payment.",
    billingName: "Billing name *",
    billingNameHint: "Name on the credit/debit card.",
    billingAddress: "Billing address",
    summary: "Order summary",
    tax: "Tax",
    yourProvince: "your province",
    total: "Total (CAD)",
    feesNote:
      "Government filing fees (Corporations Canada $250 / Ontario $330) and any back-filings (annual returns, returned for default) are billed separately as a pass-through.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Reconstituer une société dissoute",
    label: "Reconstitution d'une société",
    description:
      "Déposez des statuts de reconstitution pour rétablir une société dissoute. Une société fédérale peut être reconstituée, qu'elle ait été dissoute volontairement ou par le registre; une société ontarienne ne peut être reconstituée que si le directeur l'a dissoute, par exemple pour des rapports annuels non déposés. La reconstitution rétablit la personnalité juridique de la société et son droit d'exercer ses activités.",
    heroTail: " + taxes applicables + droits gouvernementaux (refacturés au coût). Déposé dans un délai de 3 jours ouvrables.",
    steps: ["Société", "Reconstitution", "Structure", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Société dissoute",
    corpIntro: "Indiquez-nous la société que vous reconstituez et la façon dont elle a été dissoute.",
    dissolutionDate: "Date de dissolution *",
    dissolutionDateHint: "La date de dissolution de la société (selon le certificat de dissolution).",
    reasonLabel: "Motif de la dissolution initiale *",
    reasons: {
      voluntary: "Volontaire (statuts de dissolution déposés)",
      default_failure_to_file: "Défaut : dissoute par le registre pour défaut de dépôt",
      court_order: "Ordonnance judiciaire",
      other: "Autre",
    },
    ontarioNotRevivable:
      "En vertu de la Loi sur les sociétés par actions de l'Ontario (LSAO, par. 241(9)), les statuts de reconstitution ne s'offrent qu'aux sociétés dissoutes par le directeur, par exemple pour des rapports annuels non déposés. Une dissolution ontarienne volontaire ou ordonnée par un tribunal ne peut être annulée par le dépôt de statuts de reconstitution; Korporex ne peut donc pas déposer cette demande. Korporex ne fournit pas de conseils juridiques; un avocat peut vous dire si une autre option s'applique à votre situation.",
    reasonOther: "Décrivez le motif *",
    revivalH2: "Détails de la reconstitution",
    federalIntro: "Les statuts de reconstitution sont déposés en vertu de l'article 209 de la LCSA (formulaire 15).",
    ontarioIntro: "Les statuts de reconstitution sont déposés en vertu du paragraphe 241(9) de la LSAO.",
    filingsPre: "Je confirme que tous les ",
    filingsStrong: "rapports annuels en retard et dépôts exigés",
    filingsPost: " ont été (ou seront) mis à jour auprès du registre.",
    filingsNote: "Pour une reconstitution après une dissolution pour défaut, la société doit être remise en règle avant que le registre accepte la reconstitution.",
    relationshipLabel: "Votre lien avec la société dissoute *",
    relationshipHint: "L'article 209(1) de la LCSA et l'article 241 de la LSAO permettent tous deux à un intéressé de demander la reconstitution.",
    relationships: {
      former_director: "Ancien administrateur",
      former_shareholder: "Ancien actionnaire",
      creditor: "Créancier",
      court_order: "Autorisé par ordonnance judiciaire",
      other: "Autre",
    },
    relationshipOther: "Décrivez votre lien *",
    reasonForRevival: "Motif de la reconstitution *",
    reasonForRevivalHint: "p. ex. reprise des activités, règlement d'une réclamation en cours, transfert de biens à un nouvel actionnaire, conclusion d'une vente.",
    effective: "Date d'entrée en vigueur *",
    structureH2: "Structure après la reconstitution",
    structureIntro: "Le siège social, les administrateurs et les dirigeants de la société pour la suite de ses activités après la reconstitution.",
    revivedOffice: "Siège social (après la reconstitution)",
    directors: "Administrateurs",
    officers: "Dirigeants",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions.",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel *",
    phone: "Téléphone *",
    role: "Votre rôle",
    roleHint: "Facultatif. p. ex. ancien administrateur, comptable, représentant juridique.",
    billingH2: "Facturation et vérification",
    billingIntro: "Dernière étape. Nous vous redirigerons vers Stripe pour effectuer le paiement.",
    billingName: "Nom de facturation *",
    billingNameHint: "Nom figurant sur la carte de crédit ou de débit.",
    billingAddress: "Adresse de facturation",
    summary: "Résumé de la commande",
    tax: "Taxe",
    yourProvince: "votre province",
    total: "Total (CAD)",
    feesNote:
      "Les droits gouvernementaux (Corporations Canada : 250 $ / Ontario : 330 $) et les dépôts en retard (rapports annuels, déclarations en défaut) sont facturés séparément au coût.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Reactive una sociedad disuelta",
    label: "Reactivación de una sociedad",
    description:
      "Presente los artículos de reactivación para restablecer una sociedad disuelta. Una sociedad federal puede reactivarse tanto si se disolvió voluntariamente como si la disolvió el registro; una sociedad de Ontario solo puede reactivarse si la disolvió el Director, por ejemplo por no presentar las declaraciones anuales. La reactivación restablece la personalidad jurídica de la sociedad y su derecho a operar.",
    heroTail: " + impuestos aplicables + tasas gubernamentales (se trasladan al costo). Presentado en un plazo de 3 días hábiles.",
    steps: ["Sociedad", "Reactivación", "Estructura", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Sociedad disuelta",
    corpIntro: "Indíquenos qué sociedad va a reactivar y cómo se disolvió.",
    dissolutionDate: "Fecha de disolución *",
    dissolutionDateHint: "Fecha en que se disolvió la sociedad (según el certificado de disolución).",
    reasonLabel: "Motivo de la disolución original *",
    reasons: {
      voluntary: "Voluntaria (se presentaron artículos de disolución)",
      default_failure_to_file: "Por incumplimiento: disuelta por el registro por no presentar documentos",
      court_order: "Orden judicial",
      other: "Otro",
    },
    ontarioNotRevivable:
      "Según la Ley de Sociedades por Acciones de Ontario (OBCA, apartado 241(9)), los artículos de reactivación solo están disponibles para una sociedad disuelta por el Director, por ejemplo por no presentar las declaraciones anuales. Una disolución voluntaria u ordenada por un tribunal en Ontario no puede revertirse presentando artículos de reactivación, por lo que Korporex no puede presentar esta solicitud. Korporex no brinda asesoramiento legal; un abogado puede indicarle si existe otra opción aplicable a su situación.",
    reasonOther: "Describa el motivo *",
    revivalH2: "Detalles de la reactivación",
    federalIntro: "Los artículos de reactivación se presentan conforme al artículo 209 de la CBCA (formulario 15).",
    ontarioIntro: "Los artículos de reactivación se presentan conforme al apartado 241(9) de la OBCA.",
    filingsPre: "Confirmo que todas las ",
    filingsStrong: "declaraciones anuales y presentaciones obligatorias pendientes",
    filingsPost: " se pusieron (o se pondrán) al día ante el registro.",
    filingsNote: "En las reactivaciones tras una disolución por incumplimiento, la sociedad debe regularizarse antes de que el registro acepte la reactivación.",
    relationshipLabel: "Su relación con la sociedad disuelta *",
    relationshipHint: "Tanto el artículo 209(1) de la CBCA como el artículo 241 de la OBCA permiten que un interesado solicite la reactivación.",
    relationships: {
      former_director: "Antiguo director",
      former_shareholder: "Antiguo accionista",
      creditor: "Acreedor",
      court_order: "Autorizado por orden judicial",
      other: "Otro",
    },
    relationshipOther: "Describa su relación *",
    reasonForRevival: "Motivo de la reactivación *",
    reasonForRevivalHint: "P. ej., reanudar operaciones, resolver un reclamo pendiente, transferir bienes a un nuevo accionista, concretar una venta.",
    effective: "Fecha de entrada en vigor *",
    structureH2: "Estructura después de la reactivación",
    structureIntro: "El domicilio social, los directores y los funcionarios de la sociedad a medida que continúa después de la reactivación.",
    revivedOffice: "Domicilio social (después de la reactivación)",
    directors: "Directores",
    officers: "Funcionarios",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas.",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    role: "Su función",
    roleHint: "Opcional. P. ej., antiguo director, contador, representante legal.",
    billingH2: "Facturación y revisión",
    billingIntro: "Último paso. Lo redirigiremos a Stripe para completar el pago.",
    billingName: "Nombre de facturación *",
    billingNameHint: "Nombre que figura en la tarjeta de crédito o débito.",
    billingAddress: "Dirección de facturación",
    summary: "Resumen del pedido",
    tax: "Impuesto",
    yourProvince: "su provincia",
    total: "Total (CAD)",
    feesNote:
      "Las tasas gubernamentales (Corporations Canada: 250 $ / Ontario: 330 $) y cualquier presentación atrasada (declaraciones anuales, declaraciones en incumplimiento) se facturan por separado al costo.",
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
    "Select the reason for the original dissolution": "Sélectionnez le motif de la dissolution initiale",
    "Please explain why the corporation is being revived": "Veuillez expliquer pourquoi la société est reconstituée",
    "At least one director required": "Au moins un administrateur est exigé",
    "At least one officer required": "Au moins un dirigeant est exigé",
    "Select your relationship to the dissolved corporation": "Sélectionnez votre lien avec la société dissoute",
    "Please describe the reason": "Veuillez décrire le motif",
    "Ontario Articles of Revival are only available for corporations dissolved by the Director (for example, for unfiled returns)":
      "En Ontario, les statuts de reconstitution ne s'offrent qu'aux sociétés dissoutes par le directeur (par exemple, pour des rapports non déposés)",
    "Please describe your relationship": "Veuillez décrire votre lien",
    "Default dissolutions require all outstanding returns to be filed before revival is approved":
      "Après une dissolution pour défaut, tous les rapports en retard doivent être déposés avant que la reconstitution soit approuvée",
  },
  es: {
    "Select the reason for the original dissolution": "Seleccione el motivo de la disolución original",
    "Please explain why the corporation is being revived": "Explique por qué se reactiva la sociedad",
    "At least one director required": "Se requiere al menos un director",
    "At least one officer required": "Se requiere al menos un funcionario",
    "Select your relationship to the dissolved corporation": "Seleccione su relación con la sociedad disuelta",
    "Please describe the reason": "Describa el motivo",
    "Ontario Articles of Revival are only available for corporations dissolved by the Director (for example, for unfiled returns)":
      "En Ontario, los artículos de reactivación solo están disponibles para sociedades disueltas por el Director (por ejemplo, por declaraciones no presentadas)",
    "Please describe your relationship": "Describa su relación",
    "Default dissolutions require all outstanding returns to be filed before revival is approved":
      "Tras una disolución por incumplimiento, todas las declaraciones pendientes deben presentarse antes de que se apruebe la reactivación",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["corporation", "dissolutionDate", "dissolutionReason", "dissolutionReasonOther"],
  ["outstandingFilingsBroughtCurrent", "reasonForRevival", "requestorRelationship", "requestorRelationshipOther", "effectiveDate"],
  ["revivedRegisteredOffice", "directors", "officers"],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };
const emptyDirector: CurrentDirector = {
  firstName: "",
  lastName: "",
  email: "",
  canadianResident: false,
  electedDate: "",
  address: { ...emptyAddress },
};
const emptyOfficer: CurrentOfficer = {
  firstName: "",
  lastName: "",
  position: "President",
  email: "",
  appointedDate: "",
  address: { ...emptyAddress },
};

export default function ReviveBusinessPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<RevivalSubmission>({
    resolver: zodResolver(revivalSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      dissolutionDate: "",
      dissolutionReason: "default_failure_to_file",
      dissolutionReasonOther: "",
      outstandingFilingsBroughtCurrent: false,
      reasonForRevival: "",
      revivedRegisteredOffice: { ...emptyAddress },
      directors: [{ ...emptyDirector }],
      officers: [{ ...emptyOfficer }],
      requestorRelationship: "former_director",
      requestorRelationshipOther: "",
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

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const dissolutionReason = watch("dissolutionReason");
  const requestorRelationship = watch("requestorRelationship");
  const wasDefault = dissolutionReason === "default_failure_to_file";
  const ontarioNotRevivable =
    jurisdiction === "ontario" && (dissolutionReason === "voluntary" || dissolutionReason === "court_order");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof RevivalSubmission | string>> = {
      1: ["corporation", "dissolutionDate", "dissolutionReason", "dissolutionReasonOther"],
      2: [
        "outstandingFilingsBroughtCurrent",
        "reasonForRevival",
        "requestorRelationship",
        "requestorRelationshipOther",
        "effectiveDate",
      ],
      3: ["revivedRegisteredOffice", "directors", "officers"],
      4: ["contact"],
    };
    // Not revivable in Ontario (OBCA s.241(9)); the notice under the select explains why.
    if (step === 1 && ontarioNotRevivable) return;
    const fields = fieldsByStep[step];
    if (fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: RevivalSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "revive-business", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? t.failed);
      window.location.href = json.url;
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : t.failed);
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
              <button type="button" onClick={() => router.push("/services")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors">
                {t.backToServices}
              </button>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.corpH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.corpIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />

                <Field label={t.dissolutionDate} error={errors.dissolutionDate?.message} hint={t.dissolutionDateHint}>
                  <input type="date" {...register("dissolutionDate")} className={iCls} />
                </Field>

                <Field label={t.reasonLabel} error={err(errors.dissolutionReason?.message)}>
                  <select {...register("dissolutionReason")} className={sCls}>
                    {REASON_VALUES.map((v) => (
                      <option key={v} value={v}>{t.reasons[v]}</option>
                    ))}
                  </select>
                </Field>
                {ontarioNotRevivable && (
                  <div className="border border-amber-300 bg-amber-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                    {t.ontarioNotRevivable}
                  </div>
                )}
                {dissolutionReason === "other" && (
                  <Field label={t.reasonOther} error={err(errors.dissolutionReasonOther?.message)}>
                    <input type="text" {...register("dissolutionReasonOther")} className={iCls} />
                  </Field>
                )}
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.revivalH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal" ? t.federalIntro : t.ontarioIntro}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                {wasDefault && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="checkbox" {...register("outstandingFilingsBroughtCurrent")} className="mt-1 accent-navy-900" />
                      <span className="text-gray-700">
                        {t.filingsPre}<strong>{t.filingsStrong}</strong>{t.filingsPost}
                      </span>
                    </label>
                    {errors.outstandingFilingsBroughtCurrent?.message && (
                      <p className="text-xs text-red-500 mt-2">{err(errors.outstandingFilingsBroughtCurrent.message)}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">{t.filingsNote}</p>
                  </div>
                )}

                <Field label={t.relationshipLabel} error={err(errors.requestorRelationship?.message)} hint={t.relationshipHint}>
                  <select {...register("requestorRelationship")} className={sCls}>
                    {RELATIONSHIP_VALUES.map((v) => (
                      <option key={v} value={v}>{t.relationships[v]}</option>
                    ))}
                  </select>
                </Field>
                {requestorRelationship === "other" && (
                  <Field label={t.relationshipOther} error={err(errors.requestorRelationshipOther?.message)}>
                    <input type="text" {...register("requestorRelationshipOther")} className={iCls} />
                  </Field>
                )}

                <Field label={t.reasonForRevival} error={err(errors.reasonForRevival?.message)} hint={t.reasonForRevivalHint}>
                  <textarea {...register("reasonForRevival")} rows={4} className={`${iCls} resize-none`} />
                </Field>

                <Field label={t.effective} error={errors.effectiveDate?.message}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.structureH2}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.structureIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-6">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.revivedOffice} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="revivedRegisteredOffice" errors={errors.revivedRegisteredOffice} />
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.directors}</p>
                  <CurrentDirectorsArray
                    name="directors"
                    showCanadianResident={jurisdiction === "federal"}
                    topError={err(errors.directors?.message)}
                    errors={errors.directors}
                  />
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.officers}</p>
                  <CurrentOfficersArray
                    name="officers"
                    topError={err(errors.officers?.message)}
                    errors={errors.officers}
                  />
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.contactH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.contactIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(5); }} className="space-y-5">
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

          {step === 5 && (
            <div>
              <BackBtn onClick={() => setStep(4)} />
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
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.feesNote}</p>
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
