"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  continuanceSchema,
  type ContinuanceSubmission,
  type CurrentDirector,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import { CurrentDirectorsArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["continuance"];
const JURISDICTION_VALUES = ["federal", "ontario", "bc", "alberta", "quebec", "other"] as const;

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + government filing fees (pass-through, both jurisdictions). Filed within 5 business days.",
    twoFilingsStrong: "Two filings, one process:",
    twoFilingsPre: " a continuance requires ",
    twoFilingsEm: "authorization to depart",
    twoFilingsPost:
      " from the home jurisdiction and a parallel filing in the destination jurisdiction. Korporex coordinates both filings. The destination registry only issues the certificate of continuance after the departing registry confirms the corporation is in good standing.",
    steps: ["Direction", "Name", "Resolution", "Contact", "Billing"],
    backToServices: "← Back to services",
    dirH2: "Direction & Identity",
    dirIntro: "Which way the corporation is moving, and how to identify it today.",
    direction: "Direction *",
    directionHint: "Whether the corporation is moving INTO Federal/Ontario or OUT OF Federal/Ontario.",
    dirInto: "INTO Federal / Ontario (continuance import)",
    dirOut: "OUT OF Federal / Ontario (continuance export)",
    currentJur: "Current (home) jurisdiction *",
    destJur: "Destination jurisdiction *",
    jurisdictions: {
      federal: "Federal (CBCA)",
      ontario: "Ontario (OBCA)",
      bc: "British Columbia",
      alberta: "Alberta",
      quebec: "Quebec",
      other: "Other",
    },
    specifyCurrent: "Specify current jurisdiction *",
    specifyDest: "Specify destination jurisdiction *",
    otherPlaceholder: "e.g. Manitoba",
    corpName: "Current corporation legal name *",
    corpNameHint: "As it appears today in the home jurisdiction.",
    corpNumber: "Current corporation number *",
    bn: "CRA Business Number (BN)",
    nameH2: "Name & New Registered Office",
    nameIntroInto: "The new registered office must be in the destination jurisdiction.",
    nameIntroOut: "The new registered office must be in the destination jurisdiction (outside Federal / Ontario).",
    nameChangingPre: "The corporate name is ",
    nameChangingStrong: "changing",
    nameChangingPost:
      " as part of the continuance. (Some jurisdictions require it if the existing name conflicts with another in the destination registry.)",
    newName: "New corporate name *",
    legalEnding: "Legal ending *",
    select: "Select…",
    nuansNote:
      "A NUANS-type name search is typically required for the destination jurisdiction; the fee is billed as a pass-through.",
    newOffice: "New registered office (in the destination jurisdiction)",
    resH2: "Resolution & Directors",
    resIntoFederal:
      "Continuance INTO federal: CBCA s.187. The directors of the continued corporation must include at least 25% Canadian residents per CBCA s.105(3).",
    resOutFederal: "Continuance OUT of federal: CBCA s.188. Requires Director's authorization to depart.",
    resOntario: "Continuance under OBCA s.180 (into Ontario) or s.181 (out of Ontario).",
    reason: "Reason for continuance *",
    reasonHint: "e.g. moving to align with primary operations, accessing federal name protection, tax planning, restructuring.",
    specialRes: "Special resolution",
    specialResPre: "A ",
    specialResStrong: "special shareholder resolution",
    specialResPost: " authorizing the continuance has been passed (two-thirds majority).",
    resDate: "Resolution date *",
    effective: "Effective date *",
    effectiveHint: "When the continuance should take effect in the destination jurisdiction.",
    directorsHeading: "Directors of the continued corporation",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions about this filing.",
    first: "First name *",
    last: "Last name *",
    email: "Email *",
    phone: "Phone *",
    role: "Your role",
    billingH2: "Billing & Review",
    billingIntro: "Final step. We'll redirect you to Stripe to complete payment.",
    billingName: "Billing name *",
    billingNameHint: "Name on the credit/debit card.",
    billingAddress: "Billing address",
    summary: "Order summary",
    tax: "Tax",
    yourProvince: "your province",
    total: "Total (CAD)",
    feesPre: "Government filing fees from ",
    feesEm: "both",
    feesPost:
      " jurisdictions (typically $200-$300 each) and any NUANS report are billed separately as pass-through. Korporex coordinates both filings; the destination jurisdiction's certificate of continuance is the final step.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Prorogez votre société dans un nouveau ressort",
    label: "Prorogation entre ressorts",
    description:
      "Déposez des statuts de prorogation pour faire passer votre société de son ressort d'origine à un nouveau ressort (p. ex. proroger une société ontarienne sous le régime de la LCSA, ou l'inverse). Il faut l'autorisation du registre de départ et celle du registre d'accueil.",
    heroTail:
      " + taxes applicables + droits gouvernementaux de dépôt (refacturés au coût, dans les deux ressorts). Déposé dans un délai de 5 jours ouvrables.",
    twoFilingsStrong: "Deux dépôts, un seul processus :",
    twoFilingsPre: " une prorogation exige une ",
    twoFilingsEm: "autorisation de départ",
    twoFilingsPost:
      " de la juridiction d'origine et un dépôt parallèle dans le ressort de destination. Korporex coordonne les deux dépôts. Le registre d'accueil ne délivre le certificat de prorogation qu'après que le registre de départ a confirmé que la société est en règle.",
    steps: ["Sens", "Dénomination", "Résolution", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    dirH2: "Sens du transfert et identité",
    dirIntro: "Dans quel sens la société se déplace, et comment l'identifier aujourd'hui.",
    direction: "Sens du transfert *",
    directionHint: "Indiquez si la société passe SOUS le régime fédéral ou ontarien, ou si elle QUITTE le régime fédéral ou ontarien.",
    dirInto: "VERS le fédéral / l'Ontario (prorogation d'entrée)",
    dirOut: "HORS du fédéral / de l'Ontario (prorogation de sortie)",
    currentJur: "Ressort actuel (d'origine) *",
    destJur: "Ressort de destination *",
    jurisdictions: {
      federal: "Fédéral (LCSA)",
      ontario: "Ontario (LSAO)",
      bc: "Colombie-Britannique",
      alberta: "Alberta",
      quebec: "Québec",
      other: "Autre",
    },
    specifyCurrent: "Précisez le ressort actuel *",
    specifyDest: "Précisez le ressort de destination *",
    otherPlaceholder: "p. ex. Manitoba",
    corpName: "Dénomination sociale actuelle de la société *",
    corpNameHint: "Telle qu'elle figure aujourd'hui dans le ressort d'origine.",
    corpNumber: "Numéro de société actuel *",
    bn: "Numéro d'entreprise (NE) de l'ARC",
    nameH2: "Dénomination et nouveau siège social",
    nameIntroInto: "Le nouveau siège social doit se trouver dans le ressort de destination.",
    nameIntroOut: "Le nouveau siège social doit se trouver dans le ressort de destination (hors du fédéral / de l'Ontario).",
    nameChangingPre: "La dénomination sociale ",
    nameChangingStrong: "change",
    nameChangingPost:
      " dans le cadre de la prorogation. (Certains ressorts l'exigent si la dénomination existante entre en conflit avec une autre dans le registre de destination.)",
    newName: "Nouvelle dénomination sociale *",
    legalEnding: "Élément juridique *",
    select: "Sélectionnez…",
    nuansNote:
      "Une recherche de dénomination de type NUANS (rapport NUANS) est habituellement exigée pour le ressort de destination; les frais sont refacturés au coût.",
    newOffice: "Nouveau siège social (dans le ressort de destination)",
    resH2: "Résolution et administrateurs",
    resIntoFederal:
      "Prorogation VERS le fédéral : LCSA, art. 187. Au moins 25 % des administrateurs de la société prorogée doivent être des résidents canadiens, selon le paragraphe 105(3) de la LCSA.",
    resOutFederal: "Prorogation HORS du fédéral : LCSA, art. 188. Exige l'autorisation de départ du directeur.",
    resOntario: "Prorogation en vertu de la LSAO, art. 180 (vers l'Ontario) ou art. 181 (hors de l'Ontario).",
    reason: "Motif de la prorogation *",
    reasonHint:
      "p. ex. s'aligner sur le lieu principal des activités, obtenir la protection fédérale de la dénomination, planification fiscale, restructuration.",
    specialRes: "Résolution spéciale",
    specialResPre: "Une ",
    specialResStrong: "résolution spéciale des actionnaires",
    specialResPost: " autorisant la prorogation a été adoptée (majorité des deux tiers).",
    resDate: "Date de la résolution *",
    effective: "Date d'entrée en vigueur *",
    effectiveHint: "La date à laquelle la prorogation doit prendre effet dans le ressort de destination.",
    directorsHeading: "Administrateurs de la société prorogée",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions sur ce dépôt.",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel *",
    phone: "Téléphone *",
    role: "Votre rôle",
    billingH2: "Facturation et vérification",
    billingIntro: "Dernière étape. Nous vous redirigerons vers Stripe pour effectuer le paiement.",
    billingName: "Nom de facturation *",
    billingNameHint: "Nom figurant sur la carte de crédit ou de débit.",
    billingAddress: "Adresse de facturation",
    summary: "Résumé de la commande",
    tax: "Taxe",
    yourProvince: "votre province",
    total: "Total (CAD)",
    feesPre: "Les droits gouvernementaux de dépôt des ",
    feesEm: "deux",
    feesPost:
      " ressorts (habituellement de 200 $ à 300 $ chacun) et tout rapport NUANS sont facturés séparément, au coût. Korporex coordonne les deux dépôts; le certificat de prorogation du ressort de destination constitue la dernière étape.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Continúe su sociedad en una nueva jurisdicción",
    label: "Continuación entre jurisdicciones",
    description:
      "Presente estatutos de continuación (Articles of Continuance) para trasladar su sociedad de su jurisdicción de origen a una nueva (p. ej., continuar una sociedad de Ontario como sociedad de la CBCA, o a la inversa). Se requiere la autorización tanto del registro de salida como del registro de destino.",
    heroTail:
      " + impuestos aplicables + tasas gubernamentales de presentación (se trasladan al costo, en ambas jurisdicciones). Presentado en un plazo de 5 días hábiles.",
    twoFilingsStrong: "Dos presentaciones, un solo proceso:",
    twoFilingsPre: " una continuación requiere una ",
    twoFilingsEm: "autorización de salida",
    twoFilingsPost:
      " de la jurisdicción de origen y una presentación paralela en la jurisdicción de destino. Korporex coordina ambas presentaciones. El registro de destino solo emite el certificado de continuación después de que el registro de salida confirma que la sociedad está al día.",
    steps: ["Sentido", "Nombre", "Resolución", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    dirH2: "Sentido del traslado e identidad",
    dirIntro: "Hacia dónde se traslada la sociedad y cómo identificarla hoy.",
    direction: "Sentido del traslado *",
    directionHint: "Indique si la sociedad ENTRA a la jurisdicción federal/de Ontario o SALE de la jurisdicción federal/de Ontario.",
    dirInto: "HACIA la jurisdicción federal / Ontario (continuación de entrada)",
    dirOut: "FUERA de la jurisdicción federal / Ontario (continuación de salida)",
    currentJur: "Jurisdicción actual (de origen) *",
    destJur: "Jurisdicción de destino *",
    jurisdictions: {
      federal: "Federal (CBCA)",
      ontario: "Ontario (OBCA)",
      bc: "Columbia Británica",
      alberta: "Alberta",
      quebec: "Quebec",
      other: "Otra",
    },
    specifyCurrent: "Especifique la jurisdicción actual *",
    specifyDest: "Especifique la jurisdicción de destino *",
    otherPlaceholder: "p. ej., Manitoba",
    corpName: "Denominación legal actual de la sociedad *",
    corpNameHint: "Tal como figura hoy en la jurisdicción de origen.",
    corpNumber: "Número de sociedad actual *",
    bn: "Número de empresa (BN) de la CRA",
    nameH2: "Nombre y nuevo domicilio social",
    nameIntroInto: "El nuevo domicilio social debe estar en la jurisdicción de destino.",
    nameIntroOut: "El nuevo domicilio social debe estar en la jurisdicción de destino (fuera de la jurisdicción federal / Ontario).",
    nameChangingPre: "La denominación social ",
    nameChangingStrong: "cambia",
    nameChangingPost:
      " como parte de la continuación. (Algunas jurisdicciones lo exigen si la denominación existente entra en conflicto con otra en el registro de destino.)",
    newName: "Nueva denominación social *",
    legalEnding: "Terminación legal *",
    select: "Seleccione…",
    nuansNote:
      "Normalmente se requiere una búsqueda de nombre de tipo NUANS (informe NUANS) para la jurisdicción de destino; la tarifa se traslada al costo.",
    newOffice: "Nuevo domicilio social (en la jurisdicción de destino)",
    resH2: "Resolución y directores",
    resIntoFederal:
      "Continuación HACIA la jurisdicción federal: artículo 187 de la CBCA. Al menos el 25 % de los directores de la sociedad continuada deben ser residentes canadienses, según el artículo 105(3) de la CBCA.",
    resOutFederal: "Continuación FUERA de la jurisdicción federal: artículo 188 de la CBCA. Requiere la autorización de salida del Director.",
    resOntario: "Continuación conforme al artículo 180 (hacia Ontario) o al artículo 181 (fuera de Ontario) de la OBCA.",
    reason: "Motivo de la continuación *",
    reasonHint:
      "p. ej., alinearse con el lugar principal de operaciones, obtener la protección federal del nombre, planificación fiscal, reestructuración.",
    specialRes: "Resolución especial",
    specialResPre: "Se ha aprobado una ",
    specialResStrong: "resolución especial de los accionistas",
    specialResPost: " que autoriza la continuación (mayoría de dos tercios).",
    resDate: "Fecha de la resolución *",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo debe surtir efecto la continuación en la jurisdicción de destino.",
    directorsHeading: "Directores de la sociedad continuada",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas sobre esta presentación.",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    role: "Su función",
    billingH2: "Facturación y revisión",
    billingIntro: "Último paso. Lo redirigiremos a Stripe para completar el pago.",
    billingName: "Nombre de facturación *",
    billingNameHint: "Nombre que figura en la tarjeta de crédito o débito.",
    billingAddress: "Dirección de facturación",
    summary: "Resumen del pedido",
    tax: "Impuesto",
    yourProvince: "su provincia",
    total: "Total (CAD)",
    feesPre: "Las tasas gubernamentales de presentación de ",
    feesEm: "ambas",
    feesPost:
      " jurisdicciones (normalmente entre 200 $ y 300 $ cada una) y cualquier informe NUANS se facturan por separado, al costo. Korporex coordina ambas presentaciones; el certificado de continuación de la jurisdicción de destino es el último paso.",
    submitting: "Redirigiendo a Stripe…",
    submit: "Continuar al pago",
    stripe: "El pago se procesa de forma segura a través de Stripe. Los datos de su tarjeta nunca pasan por nuestro servidor.",
    failed: "No se pudo enviar la solicitud.",
  },
} as const;

// Schema messages rendered directly by this page, translated for display only.
// The schema itself is unchanged; unknown messages pass through.
const ERROR_TEXT: Record<Exclude<Lang, "en">, Record<string, string>> = {
  fr: {
    "Select the direction": "Sélectionnez le sens du transfert",
    "Select a jurisdiction": "Sélectionnez un ressort",
    "Please specify": "Veuillez préciser",
    "Destination must differ from the current jurisdiction": "Le ressort de destination doit être différent du ressort actuel",
    "New corporate name required": "La nouvelle dénomination sociale est obligatoire",
    "Select a legal ending": "Sélectionnez un élément juridique",
    "Please explain why you're continuing the corporation": "Veuillez expliquer pourquoi vous prorogez la société",
    "A special resolution authorizing the continuance is required": "Une résolution spéciale autorisant la prorogation est obligatoire",
    "At least one director required": "Au moins un administrateur est obligatoire",
  },
  es: {
    "Select the direction": "Seleccione el sentido del traslado",
    "Select a jurisdiction": "Seleccione una jurisdicción",
    "Please specify": "Especifique",
    "Destination must differ from the current jurisdiction": "La jurisdicción de destino debe ser distinta de la actual",
    "New corporate name required": "Se requiere la nueva denominación social",
    "Select a legal ending": "Seleccione una terminación legal",
    "Please explain why you're continuing the corporation": "Explique por qué continúa la sociedad",
    "A special resolution authorizing the continuance is required": "Se requiere una resolución especial que autorice la continuación",
    "At least one director required": "Se requiere al menos un director",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["direction", "currentJurisdiction", "currentJurisdictionOther", "destinationJurisdiction", "destinationJurisdictionOther", "currentCorpName", "currentCorpNumber", "businessNumber"],
  ["nameChanging", "newCorpName", "newLegalEnding", "newRegisteredOffice"],
  ["reasonForContinuance", "specialResolutionPassed", "specialResolutionDate", "effectiveDate", "directors"],
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

export default function ContinuancePage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<ContinuanceSubmission>({
    resolver: zodResolver(continuanceSchema),
    mode: "onTouched",
    defaultValues: {
      direction: "into",
      currentJurisdiction: "ontario",
      currentJurisdictionOther: "",
      destinationJurisdiction: "federal",
      destinationJurisdictionOther: "",
      currentCorpName: "",
      currentCorpNumber: "",
      businessNumber: "",
      nameChanging: false,
      newCorpName: "",
      newLegalEnding: undefined,
      newRegisteredOffice: { ...emptyAddress },
      reasonForContinuance: "",
      specialResolutionPassed: false,
      specialResolutionDate: "",
      effectiveDate: "",
      directors: [{ ...emptyDirector }],
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
  const currentJurisdiction = watch("currentJurisdiction");
  const destinationJurisdiction = watch("destinationJurisdiction");
  const nameChanging = watch("nameChanging");
  const direction = watch("direction");
  // Show federal Canadian-resident attestation when the destination is federal.
  const destinationIsFederal = destinationJurisdiction === "federal";

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ContinuanceSubmission | string>> = {
      1: [
        "direction",
        "currentJurisdiction",
        "currentJurisdictionOther",
        "destinationJurisdiction",
        "destinationJurisdictionOther",
        "currentCorpName",
        "currentCorpNumber",
        "businessNumber",
      ],
      2: ["nameChanging", "newCorpName", "newLegalEnding", "newRegisteredOffice"],
      3: ["reasonForContinuance", "specialResolutionPassed", "specialResolutionDate", "effectiveDate", "directors"],
      4: ["contact"],
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

  async function onFinalSubmit(data: ContinuanceSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "continuance", payload: data }),
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
            <strong>{t.twoFilingsStrong}</strong>{t.twoFilingsPre}<em>{t.twoFilingsEm}</em>{t.twoFilingsPost}
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.dirH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.dirIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label={t.direction} error={err(errors.direction?.message)} hint={t.directionHint}>
                  <select {...register("direction")} className={sCls}>
                    <option value="into">{t.dirInto}</option>
                    <option value="out_of">{t.dirOut}</option>
                  </select>
                </Field>

                <Field label={t.currentJur} error={err(errors.currentJurisdiction?.message)}>
                  <select {...register("currentJurisdiction")} className={sCls}>
                    {JURISDICTION_VALUES.map((v) => (
                      <option key={v} value={v}>{t.jurisdictions[v]}</option>
                    ))}
                  </select>
                </Field>
                {currentJurisdiction === "other" && (
                  <Field label={t.specifyCurrent} error={err(errors.currentJurisdictionOther?.message)}>
                    <input type="text" {...register("currentJurisdictionOther")} className={iCls} placeholder={t.otherPlaceholder} />
                  </Field>
                )}

                <Field label={t.destJur} error={err(errors.destinationJurisdiction?.message)}>
                  <select {...register("destinationJurisdiction")} className={sCls}>
                    {JURISDICTION_VALUES.map((v) => (
                      <option key={v} value={v}>{t.jurisdictions[v]}</option>
                    ))}
                  </select>
                </Field>
                {destinationJurisdiction === "other" && (
                  <Field label={t.specifyDest} error={err(errors.destinationJurisdictionOther?.message)}>
                    <input type="text" {...register("destinationJurisdictionOther")} className={iCls} placeholder={t.otherPlaceholder} />
                  </Field>
                )}

                <Field label={t.corpName} error={errors.currentCorpName?.message} hint={t.corpNameHint}>
                  <input type="text" {...register("currentCorpName")} className={iCls} />
                </Field>
                <Field label={t.corpNumber} error={errors.currentCorpNumber?.message}>
                  <input type="text" {...register("currentCorpNumber")} className={iCls} />
                </Field>
                <Field label={t.bn} error={errors.businessNumber?.message}>
                  <input type="text" {...register("businessNumber")} className={iCls} placeholder="123456789 RC0001" />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.nameH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {direction === "into" ? t.nameIntroInto : t.nameIntroOut}
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input type="checkbox" {...register("nameChanging")} className="mt-1 accent-navy-900" />
                  <span className="text-gray-700">
                    {t.nameChangingPre}<strong>{t.nameChangingStrong}</strong>{t.nameChangingPost}
                  </span>
                </label>

                {nameChanging && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <Field label={t.newName} error={err(errors.newCorpName?.message)}>
                      <input type="text" {...register("newCorpName")} className={iCls} placeholder="Acme Holdings" />
                    </Field>
                    <Field label={t.legalEnding} error={err(errors.newLegalEnding?.message)}>
                      <select {...register("newLegalEnding")} className={sCls}>
                        <option value="">{t.select}</option>
                        {LEGAL_ENDINGS.map((le) => (
                          <option key={le} value={le}>{le}</option>
                        ))}
                      </select>
                    </Field>
                    <p className="text-xs text-gray-500">
                      {t.nuansNote}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.newOffice} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="newRegisteredOffice" errors={errors.newRegisteredOffice} canadaOnly={false} />
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.resH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {destinationIsFederal
                  ? t.resIntoFederal
                  : currentJurisdiction === "federal"
                    ? t.resOutFederal
                    : t.resOntario}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-5">
                <Field label={t.reason} error={err(errors.reasonForContinuance?.message)} hint={t.reasonHint}>
                  <textarea {...register("reasonForContinuance")} rows={4} className={`${iCls} resize-none`} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-3">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.specialRes}</p>
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      {t.specialResPre}<strong>{t.specialResStrong}</strong>{t.specialResPost}
                    </span>
                  </label>
                  {errors.specialResolutionPassed?.message && (
                    <p className="text-xs text-red-500">{err(errors.specialResolutionPassed.message)}</p>
                  )}
                  <Field label={t.resDate} error={errors.specialResolutionDate?.message}>
                    <input type="date" {...register("specialResolutionDate")} className={iCls} />
                  </Field>
                </div>

                <Field label={t.effective} error={errors.effectiveDate?.message} hint={t.effectiveHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.directorsHeading}</p>
                  <CurrentDirectorsArray
                    name="directors"
                    showCanadianResident={destinationIsFederal}
                    topError={err(errors.directors?.message)}
                    errors={errors.directors}
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
                <Field label={t.role} error={errors.contact?.contactRole?.message}>
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
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {t.feesPre}<em>{t.feesEm}</em>{t.feesPost}
                    </p>
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
