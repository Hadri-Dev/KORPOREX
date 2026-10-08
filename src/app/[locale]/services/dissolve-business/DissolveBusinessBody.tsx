"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  dissolutionSchema,
  type DissolutionSubmission,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["dissolve-business"];

type Lang = "en" | "fr" | "es";

const PATH_VALUES = ["never_commenced", "no_property_no_liabilities", "wound_up_with_assets"] as const;
const DEBT_VALUES = ["no_debts", "all_debts_paid", "creditors_consent"] as const;
const ASSET_VALUES = ["no_property", "distributed_to_shareholders"] as const;

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + government filing fees (pass-through). Filed within 3 business days.",
    requiredBeforeStrong: "Required before dissolution:",
    requiredBefore:
      " file the corporation's final T2, GST/HST and payroll returns with the CRA, close all payroll, GST and corporate program accounts, and either pay all creditors or obtain their consent. Korporex will not submit the dissolution until you confirm this is done.",
    steps: ["Corporation", "Details", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "Tell us which corporation you're dissolving.",
    detailsH2: "Dissolution Details",
    federalIntro: "Federal dissolutions are filed under CBCA s.210-211 (Articles of Dissolution, Form 17 or 19).",
    ontarioIntro: "Ontario dissolutions are filed under OBCA s.237 (Articles of Dissolution).",
    pathLabel: "Dissolution pathway *",
    pathHint: "Which scenario best describes the corporation.",
    paths: {
      never_commenced: "Never commenced business / no shareholders (simplest)",
      no_property_no_liabilities: "Active corp: no property and no liabilities",
      wound_up_with_assets: "Active corp: wound up after distributing assets",
    },
    cessation: "Cessation / final operations date *",
    cessationHint: "When the corporation last carried on business.",
    debtsLabel: "Debts statement *",
    debts: {
      no_debts: "The corporation has no outstanding debts",
      all_debts_paid: "All debts have been paid in full",
      creditors_consent: "All creditors have consented to the dissolution",
    },
    assetsLabel: "Assets statement *",
    assets: {
      no_property: "The corporation has no remaining property",
      distributed_to_shareholders: "All remaining property has been distributed to shareholders",
    },
    specialResH: "Special resolution",
    specialResPre: "A ",
    specialResStrong: "special shareholder resolution",
    specialResPost: " authorizing the dissolution has been passed (two-thirds majority).",
    resDate: "Resolution date *",
    effective: "Effective date *",
    effectiveHint: "The date you want the dissolution to take effect.",
    finalPre: "I confirm the corporation's ",
    finalStrong: "final tax, GST and payroll returns have been filed",
    finalPost: " with the CRA and all related program accounts will be closed.",
    notes: "Notes",
    notesHint: "Anything else relevant (e.g. court-ordered timing, creditor disputes, related restructuring).",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions.",
    first: "First name *",
    last: "Last name *",
    email: "Email *",
    phone: "Phone *",
    role: "Your role",
    roleHint: "Optional. E.g. sole director, corporate secretary, accountant.",
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
      "Government filing fees (Corporations Canada $0 (free), or Ontario $25) are pass-through. Final tax and GST closure is handled by you or your accountant.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Dissoudre une société en Ontario ou au fédéral",
    label: "Dissolution d'une société",
    description:
      "Déposez des statuts de dissolution pour liquider officiellement votre société. Cette démarche s'applique lorsque la société a cessé ses activités ou ne les a jamais commencées. Korporex prépare et dépose la dissolution en votre nom; vous confirmez que les dettes ont été réglées et les biens distribués.",
    heroTail: " + taxes applicables + droits gouvernementaux (refacturés au coût). Déposé dans un délai de 3 jours ouvrables.",
    requiredBeforeStrong: "Exigé avant la dissolution :",
    requiredBefore:
      " produire auprès de l'ARC les dernières déclarations T2, de TPS/TVH et de retenues sur la paie de la société, fermer tous les comptes de programme (paie, TPS et société), et soit payer tous les créanciers, soit obtenir leur consentement. Korporex ne soumettra pas la dissolution tant que vous n'aurez pas confirmé que c'est fait.",
    steps: ["Société", "Détails", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "Indiquez-nous la société que vous dissolvez.",
    detailsH2: "Détails de la dissolution",
    federalIntro:
      "Les dissolutions fédérales sont déposées en vertu des articles 210 et 211 de la LCSA (statuts de dissolution, formulaire 17 ou 19).",
    ontarioIntro: "Les dissolutions ontariennes sont déposées en vertu de l'article 237 de la LSAO (statuts de dissolution).",
    pathLabel: "Type de dissolution *",
    pathHint: "Le scénario qui décrit le mieux la société.",
    paths: {
      never_commenced: "N'a jamais commencé ses activités / aucun actionnaire (le plus simple)",
      no_property_no_liabilities: "Société active : aucun bien et aucune dette",
      wound_up_with_assets: "Société active : liquidée après distribution des biens",
    },
    cessation: "Date de cessation des activités *",
    cessationHint: "La date à laquelle la société a exercé ses activités pour la dernière fois.",
    debtsLabel: "Déclaration relative aux dettes *",
    debts: {
      no_debts: "La société n'a aucune dette impayée",
      all_debts_paid: "Toutes les dettes ont été payées intégralement",
      creditors_consent: "Tous les créanciers ont consenti à la dissolution",
    },
    assetsLabel: "Déclaration relative aux biens *",
    assets: {
      no_property: "La société n'a plus aucun bien",
      distributed_to_shareholders: "Tous les biens restants ont été distribués aux actionnaires",
    },
    specialResH: "Résolution spéciale",
    specialResPre: "Une ",
    specialResStrong: "résolution spéciale des actionnaires",
    specialResPost: " autorisant la dissolution a été adoptée (majorité des deux tiers).",
    resDate: "Date de la résolution *",
    effective: "Date d'entrée en vigueur *",
    effectiveHint: "La date à laquelle vous souhaitez que la dissolution prenne effet.",
    finalPre: "Je confirme que les ",
    finalStrong: "dernières déclarations de revenus, de TPS et de retenues sur la paie de la société ont été produites",
    finalPost: " auprès de l'ARC et que tous les comptes de programme connexes seront fermés.",
    notes: "Remarques",
    notesHint: "Tout autre renseignement utile (p. ex. échéance fixée par un tribunal, différends avec des créanciers, restructuration connexe).",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions.",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel *",
    phone: "Téléphone *",
    role: "Votre rôle",
    roleHint: "Facultatif. p. ex. administrateur unique, secrétaire de la société, comptable.",
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
      "Les droits gouvernementaux (Corporations Canada : 0 $ (gratuit), ou Ontario : 25 $) sont refacturés au coût. La fermeture des comptes fiscaux et de TPS se fait par vous ou votre comptable.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Disuelva una sociedad en Ontario o a nivel federal",
    label: "Disolución de una sociedad",
    description:
      "Presente los artículos de disolución para liquidar formalmente su sociedad. Corresponde cuando la sociedad dejó de operar o nunca comenzó a operar. Korporex prepara y presenta la disolución en su nombre; usted confirma que las deudas se saldaron y los bienes se distribuyeron.",
    heroTail: " + impuestos aplicables + tasas gubernamentales (se trasladan al costo). Presentado en un plazo de 3 días hábiles.",
    requiredBeforeStrong: "Requisito previo a la disolución:",
    requiredBefore:
      " presentar ante la CRA las últimas declaraciones T2, de GST/HST y de nómina de la sociedad, cerrar todas las cuentas de programa (nómina, GST y sociedad), y pagar a todos los acreedores u obtener su consentimiento. Korporex no presentará la disolución hasta que usted confirme que esto se ha hecho.",
    steps: ["Sociedad", "Detalles", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "Indíquenos qué sociedad va a disolver.",
    detailsH2: "Detalles de la disolución",
    federalIntro:
      "Las disoluciones federales se presentan conforme a los artículos 210 y 211 de la CBCA (artículos de disolución, formulario 17 o 19).",
    ontarioIntro: "Las disoluciones de Ontario se presentan conforme al artículo 237 de la OBCA (artículos de disolución).",
    pathLabel: "Tipo de disolución *",
    pathHint: "El escenario que mejor describe a la sociedad.",
    paths: {
      never_commenced: "Nunca comenzó a operar / sin accionistas (lo más sencillo)",
      no_property_no_liabilities: "Sociedad activa: sin bienes y sin deudas",
      wound_up_with_assets: "Sociedad activa: liquidada tras distribuir los bienes",
    },
    cessation: "Fecha de cese de operaciones *",
    cessationHint: "Cuándo operó la sociedad por última vez.",
    debtsLabel: "Declaración sobre las deudas *",
    debts: {
      no_debts: "La sociedad no tiene deudas pendientes",
      all_debts_paid: "Todas las deudas se pagaron en su totalidad",
      creditors_consent: "Todos los acreedores consintieron la disolución",
    },
    assetsLabel: "Declaración sobre los bienes *",
    assets: {
      no_property: "La sociedad no tiene bienes restantes",
      distributed_to_shareholders: "Todos los bienes restantes se distribuyeron entre los accionistas",
    },
    specialResH: "Resolución especial",
    specialResPre: "Se aprobó una ",
    specialResStrong: "resolución especial de los accionistas",
    specialResPost: " que autoriza la disolución (mayoría de dos tercios).",
    resDate: "Fecha de la resolución *",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "La fecha en que desea que la disolución surta efecto.",
    finalPre: "Confirmo que las ",
    finalStrong: "últimas declaraciones de impuestos, de GST y de nómina de la sociedad se presentaron",
    finalPost: " ante la CRA y que todas las cuentas de programa relacionadas se cerrarán.",
    notes: "Notas",
    notesHint: "Cualquier otro dato relevante (p. ej., plazos fijados por un tribunal, disputas con acreedores, reestructuración relacionada).",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas.",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    role: "Su función",
    roleHint: "Opcional. P. ej., director único, secretario corporativo, contador.",
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
      "Las tasas gubernamentales (Corporations Canada: 0 $ (gratis), u Ontario: 25 $) se trasladan al costo. El cierre de las cuentas fiscales y de GST lo gestiona usted o su contador.",
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
    "Select the dissolution pathway": "Sélectionnez le type de dissolution",
    "Confirm the corporation's debt status": "Confirmez la situation de la société quant à ses dettes",
    "Confirm the corporation's asset status": "Confirmez la situation de la société quant à ses biens",
    "Final tax / GST / payroll returns must be filed before dissolution":
      "Les dernières déclarations de revenus, de TPS et de retenues sur la paie doivent être produites avant la dissolution",
    "A special shareholder resolution authorizing the dissolution is required":
      "Une résolution spéciale des actionnaires autorisant la dissolution est exigée",
    "Resolution date required": "La date de la résolution est obligatoire",
  },
  es: {
    "Select the dissolution pathway": "Seleccione el tipo de disolución",
    "Confirm the corporation's debt status": "Confirme la situación de la sociedad respecto de sus deudas",
    "Confirm the corporation's asset status": "Confirme la situación de la sociedad respecto de sus bienes",
    "Final tax / GST / payroll returns must be filed before dissolution":
      "Las últimas declaraciones de impuestos, de GST y de nómina deben presentarse antes de la disolución",
    "A special shareholder resolution authorizing the dissolution is required":
      "Se requiere una resolución especial de los accionistas que autorice la disolución",
    "Resolution date required": "La fecha de la resolución es obligatoria",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["corporation"],
  [
    "dissolutionPath",
    "cessationDate",
    "debtsStatement",
    "assetsStatement",
    "specialResolutionPassed",
    "specialResolutionDate",
    "effectiveDate",
    "finalReturnsFiled",
    "notes",
  ],
  ["contact"],
  ["billingName", "billingAddress"],
];

export default function DissolveBusinessPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<DissolutionSubmission>({
    resolver: zodResolver(dissolutionSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      dissolutionPath: "wound_up_with_assets",
      cessationDate: "",
      debtsStatement: "no_debts",
      assetsStatement: "no_property",
      specialResolutionPassed: false,
      specialResolutionDate: "",
      effectiveDate: "",
      finalReturnsFiled: false,
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

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const dissolutionPath = watch("dissolutionPath");
  const needsSpecialResolution = dissolutionPath !== "never_commenced";

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof DissolutionSubmission | string>> = {
      1: ["corporation"],
      2: [
        "dissolutionPath",
        "cessationDate",
        "debtsStatement",
        "assetsStatement",
        "specialResolutionPassed",
        "specialResolutionDate",
        "effectiveDate",
        "finalReturnsFiled",
        "notes",
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

  async function onFinalSubmit(data: DissolutionSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "dissolve-business", payload: data }),
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
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>{t.requiredBeforeStrong}</strong>{t.requiredBefore}
          </div>
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
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.detailsH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal" ? t.federalIntro : t.ontarioIntro}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label={t.pathLabel} error={err(errors.dissolutionPath?.message)} hint={t.pathHint}>
                  <select {...register("dissolutionPath")} className={sCls}>
                    {PATH_VALUES.map((v) => (
                      <option key={v} value={v}>{t.paths[v]}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t.cessation} error={errors.cessationDate?.message} hint={t.cessationHint}>
                  <input type="date" {...register("cessationDate")} className={iCls} />
                </Field>

                <Field label={t.debtsLabel} error={err(errors.debtsStatement?.message)}>
                  <select {...register("debtsStatement")} className={sCls}>
                    {DEBT_VALUES.map((v) => (
                      <option key={v} value={v}>{t.debts[v]}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t.assetsLabel} error={err(errors.assetsStatement?.message)}>
                  <select {...register("assetsStatement")} className={sCls}>
                    {ASSET_VALUES.map((v) => (
                      <option key={v} value={v}>{t.assets[v]}</option>
                    ))}
                  </select>
                </Field>

                {needsSpecialResolution && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.specialResH}</p>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                      <span className="text-gray-700">
                        {t.specialResPre}<strong>{t.specialResStrong}</strong>{t.specialResPost}
                      </span>
                    </label>
                    {errors.specialResolutionPassed?.message && (
                      <p className="text-xs text-red-500">{err(errors.specialResolutionPassed.message)}</p>
                    )}
                    <Field label={t.resDate} error={err(errors.specialResolutionDate?.message)}>
                      <input type="date" {...register("specialResolutionDate")} className={iCls} />
                    </Field>
                  </div>
                )}

                <Field label={t.effective} error={errors.effectiveDate?.message} hint={t.effectiveHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("finalReturnsFiled")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      {t.finalPre}<strong>{t.finalStrong}</strong>{t.finalPost}
                    </span>
                  </label>
                  {errors.finalReturnsFiled?.message && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.finalReturnsFiled.message)}</p>
                  )}
                </div>

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
