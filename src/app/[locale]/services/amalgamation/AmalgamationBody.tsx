"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  amalgamationSchema,
  type AmalgamationSubmission,
  type CurrentDirector,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import { CurrentDirectorsArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["amalgamation"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + government filing fees (pass-through). Filed within 5 business days.",
    sameJurTitle: "Same-jurisdiction requirement:",
    sameJurPre:
      " all predecessor corporations must be in the same jurisdiction as the amalgamated corporation. Cross-jurisdiction amalgamations require one corporation to be ",
    continuedLink: "continued",
    sameJurPost: " into the other's jurisdiction first.",
    steps: ["Setup", "Name & Office", "Directors", "Contact", "Billing"],
    backToServices: "← Back to services",
    setupH2: "Amalgamation Setup",
    setupIntro: "Jurisdiction, type, and the predecessor corporations being combined.",
    jurisdiction: "Jurisdiction of the amalgamated corporation *",
    jurisdictionOptions: {
      federal: "Federal (CBCA, Corporations Canada)",
      ontario: "Ontario (OBCA, Ontario Business Registry)",
    },
    type: "Amalgamation type *",
    typeOptions: {
      long_form: "Long-form: separate corporations, amalgamation agreement + special resolutions",
      short_form_vertical: "Short-form vertical: parent + wholly-owned subsidiary",
      short_form_horizontal: "Short-form horizontal: wholly-owned sister corporations",
    },
    predecessorsHeading: "Amalgamating (predecessor) corporations",
    predecessor: "Predecessor",
    remove: "Remove",
    corpName: "Corporation legal name *",
    ocn: "OCN (Ontario Corporation Number) *",
    corpNumber: "Corporation number *",
    bn: "CRA Business Number (BN)",
    addPredecessor: "Add another predecessor",
    nameH2: "Name & Registered Office",
    nameIntro: "The amalgamated corporation's name and registered office.",
    nameChoice: "Name choice *",
    nameOptions: {
      named: "Named corporation",
      numbered: "Numbered corporation (assigned by registrar)",
    },
    newName: "New corporate name *",
    newNameHint: "The distinctive part, without the legal ending.",
    legalEnding: "Legal ending *",
    select: "Select…",
    registeredOffice: "Registered office of amalgamated corporation",
    directorsH2: "Directors, Share Structure & Dates",
    federalIntro: "Federal amalgamations are filed under CBCA s.181-186 (Form 9: Articles of Amalgamation).",
    ontarioIntro: "Ontario amalgamations are filed under OBCA s.174-179.",
    directorsHeading: "Directors of the amalgamated corporation",
    shareStructure: "Share structure (plain English) *",
    shareStructureHint:
      "Describe the classes of shares the amalgamated corporation will have, their rights, and how the predecessor shares are being converted. The drafter formalizes this into the Articles.",
    shareStructurePlaceholder:
      "Example: One class of common shares (voting, dividends, participation on dissolution). Each predecessor common share converts 1-for-1 into amalgamated common shares.",
    agreementDate: "Amalgamation agreement / directors' resolution date *",
    specialResolutionsDate: "Predecessor special resolutions date *",
    specialResolutionsHint:
      "Date the shareholders of each predecessor passed the special resolution approving the amalgamation agreement.",
    effective: "Effective date *",
    notes: "Notes",
    notesHint: "Anything else relevant: related restructuring, tax considerations, cross-references.",
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
    feesNote:
      "Government filing fees (Corporations Canada $200 / Ontario $330) and NUANS reports (if named) are billed separately as pass-through. Complex amalgamations may require additional drafting time. We'll flag this before incurring it.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Fusionnez des sociétés en Ontario ou au fédéral",
    label: "Fusion",
    description:
      "Déposez des statuts de fusion pour réunir deux sociétés ou plus en une seule société issue de la fusion. Prend en charge la fusion ordinaire (sociétés distinctes, avec une convention de fusion) et la fusion simplifiée (société mère et filiale, ou sociétés sœurs).",
    heroTail: " + taxes applicables + droits gouvernementaux (refacturés au coût). Déposé dans un délai de 5 jours ouvrables.",
    sameJurTitle: "Exigence de même ressort :",
    sameJurPre:
      " toutes les sociétés fusionnantes doivent relever du même ressort que la société issue de la fusion. Pour une fusion entre ressorts différents, l'une des sociétés doit d'abord être ",
    continuedLink: "prorogée",
    sameJurPost: " dans le ressort de l'autre.",
    steps: ["Configuration", "Dénomination et siège", "Administrateurs", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    setupH2: "Configuration de la fusion",
    setupIntro: "Ressort, type de fusion et sociétés fusionnantes à réunir.",
    jurisdiction: "Ressort de la société issue de la fusion *",
    jurisdictionOptions: {
      federal: "Fédéral (LCSA, Corporations Canada)",
      ontario: "Ontario (LSAO, Registre des entreprises de l'Ontario)",
    },
    type: "Type de fusion *",
    typeOptions: {
      long_form: "Fusion ordinaire : sociétés distinctes, convention de fusion + résolutions spéciales",
      short_form_vertical: "Fusion simplifiée verticale : société mère + filiale en propriété exclusive",
      short_form_horizontal: "Fusion simplifiée horizontale : filiales sœurs en propriété exclusive",
    },
    predecessorsHeading: "Sociétés fusionnantes",
    predecessor: "Société fusionnante",
    remove: "Retirer",
    corpName: "Dénomination légale de la société *",
    ocn: "NSO (numéro de société de l'Ontario) *",
    corpNumber: "Numéro de société *",
    bn: "Numéro d'entreprise de l'ARC (NE)",
    addPredecessor: "Ajouter une autre société fusionnante",
    nameH2: "Dénomination et siège social",
    nameIntro: "La dénomination et le siège social de la société issue de la fusion.",
    nameChoice: "Choix de la dénomination *",
    nameOptions: {
      named: "Société à dénomination nominative",
      numbered: "Société à matricule (attribué par le registraire)",
    },
    newName: "Nouvelle dénomination sociale *",
    newNameHint: "La partie distinctive, sans l'élément juridique.",
    legalEnding: "Élément juridique *",
    select: "Sélectionnez…",
    registeredOffice: "Siège social de la société issue de la fusion",
    directorsH2: "Administrateurs, capital-actions et dates",
    federalIntro: "Les fusions fédérales sont déposées en vertu des articles 181 à 186 de la LCSA (formulaire 9 : statuts de fusion).",
    ontarioIntro: "Les fusions ontariennes sont déposées en vertu des articles 174 à 179 de la LSAO.",
    directorsHeading: "Administrateurs de la société issue de la fusion",
    shareStructure: "Structure du capital-actions (en langage simple) *",
    shareStructureHint:
      "Décrivez les catégories d'actions qu'aura la société issue de la fusion, les droits qui y sont rattachés et la façon dont les actions des sociétés fusionnantes sont converties. Le rédacteur intègre ces éléments dans les statuts.",
    shareStructurePlaceholder:
      "Exemple : une seule catégorie d'actions ordinaires (droit de vote, dividendes, participation au reliquat à la dissolution). Chaque action ordinaire d'une société fusionnante est convertie à raison de 1 pour 1 en actions ordinaires de la société issue de la fusion.",
    agreementDate: "Date de la convention de fusion ou de la résolution des administrateurs *",
    specialResolutionsDate: "Date des résolutions spéciales des sociétés fusionnantes *",
    specialResolutionsHint:
      "Date à laquelle les actionnaires de chaque société fusionnante ont adopté la résolution spéciale approuvant la convention de fusion.",
    effective: "Date d'effet *",
    notes: "Remarques",
    notesHint: "Toute autre information pertinente : restructuration connexe, considérations fiscales, renvois.",
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
    feesNote:
      "Les droits gouvernementaux (Corporations Canada 200 $ / Ontario 330 $) et les rapports NUANS (pour une dénomination nominative) sont facturés séparément, au coût. Une fusion complexe peut exiger du temps de rédaction supplémentaire. Nous vous en aviserons avant d'engager ces frais.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Fusione sociedades en Ontario o a nivel federal",
    label: "Fusión",
    description:
      "Presente los artículos de fusión (Articles of Amalgamation) para unir dos o más sociedades en una sola sociedad fusionada. Admite la fusión ordinaria (sociedades independientes con un acuerdo de fusión) y la fusión abreviada (sociedad matriz y subsidiaria, o sociedades hermanas).",
    heroTail: " + impuestos aplicables + tasas gubernamentales (se trasladan al costo). Presentado en un plazo de 5 días hábiles.",
    sameJurTitle: "Requisito de misma jurisdicción:",
    sameJurPre:
      " todas las sociedades que se fusionan deben estar en la misma jurisdicción que la sociedad fusionada. Para una fusión entre jurisdicciones distintas, primero una de las sociedades debe ",
    continuedLink: "continuarse",
    sameJurPost: " en la jurisdicción de la otra.",
    steps: ["Configuración", "Denominación y domicilio", "Directores", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    setupH2: "Configuración de la fusión",
    setupIntro: "Jurisdicción, tipo de fusión y sociedades que se fusionan.",
    jurisdiction: "Jurisdicción de la sociedad fusionada *",
    jurisdictionOptions: {
      federal: "Federal (CBCA, Corporations Canada)",
      ontario: "Ontario (OBCA, Registro de Empresas de Ontario)",
    },
    type: "Tipo de fusión *",
    typeOptions: {
      long_form: "Fusión ordinaria: sociedades independientes, acuerdo de fusión + resoluciones especiales",
      short_form_vertical: "Fusión abreviada vertical: sociedad matriz + subsidiaria de propiedad total",
      short_form_horizontal: "Fusión abreviada horizontal: sociedades hermanas de propiedad total",
    },
    predecessorsHeading: "Sociedades que se fusionan",
    predecessor: "Sociedad que se fusiona",
    remove: "Eliminar",
    corpName: "Denominación legal de la sociedad *",
    ocn: "OCN (número de sociedad de Ontario) *",
    corpNumber: "Número de sociedad *",
    bn: "Número de empresa de la CRA (BN)",
    addPredecessor: "Agregar otra sociedad que se fusiona",
    nameH2: "Denominación y domicilio social",
    nameIntro: "La denominación y el domicilio social de la sociedad fusionada.",
    nameChoice: "Tipo de denominación *",
    nameOptions: {
      named: "Sociedad con denominación nominativa",
      numbered: "Sociedad con denominación numerada (asignada por el registro)",
    },
    newName: "Nueva denominación social *",
    newNameHint: "La parte distintiva, sin el elemento legal.",
    legalEnding: "Elemento legal *",
    select: "Seleccione…",
    registeredOffice: "Domicilio social de la sociedad fusionada",
    directorsH2: "Directores, estructura accionaria y fechas",
    federalIntro: "Las fusiones federales se presentan conforme a los artículos 181 a 186 de la CBCA (formulario 9: artículos de fusión).",
    ontarioIntro: "Las fusiones de Ontario se presentan conforme a los artículos 174 a 179 de la OBCA.",
    directorsHeading: "Directores de la sociedad fusionada",
    shareStructure: "Estructura accionaria (en lenguaje sencillo) *",
    shareStructureHint:
      "Describa las clases de acciones que tendrá la sociedad fusionada, sus derechos y cómo se convierten las acciones de las sociedades que se fusionan. El redactor lo formaliza en los artículos.",
    shareStructurePlaceholder:
      "Ejemplo: una sola clase de acciones ordinarias (voto, dividendos, participación en la disolución). Cada acción ordinaria de una sociedad que se fusiona se convierte 1 por 1 en acciones ordinarias de la sociedad fusionada.",
    agreementDate: "Fecha del acuerdo de fusión o de la resolución de los directores *",
    specialResolutionsDate: "Fecha de las resoluciones especiales de las sociedades que se fusionan *",
    specialResolutionsHint:
      "Fecha en que los accionistas de cada sociedad que se fusiona aprobaron la resolución especial que aprueba el acuerdo de fusión.",
    effective: "Fecha de entrada en vigor *",
    notes: "Notas",
    notesHint: "Cualquier otro dato pertinente: reestructuración relacionada, consideraciones fiscales, referencias cruzadas.",
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
    feesNote:
      "Las tasas gubernamentales (Corporations Canada 200 $ / Ontario 330 $) y los informes NUANS (si la denominación es nominativa) se facturan por separado, al costo. Una fusión compleja puede requerir tiempo de redacción adicional. Se lo indicaremos antes de incurrir en él.",
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
    "At least two predecessor corporations required": "Au moins deux sociétés fusionnantes sont requises",
    "At least one director required": "Au moins un administrateur est requis",
    "Describe the share structure of the amalgamated corporation (min 20 characters)":
      "Décrivez la structure du capital-actions de la société issue de la fusion (20 caractères minimum)",
    "New corporate name required": "La nouvelle dénomination sociale est requise",
    "Select a legal ending": "Sélectionnez un élément juridique",
    "Long-form amalgamations require special resolutions of the shareholders of each predecessor":
      "La fusion ordinaire exige une résolution spéciale des actionnaires de chaque société fusionnante",
  },
  es: {
    "At least two predecessor corporations required": "Se requieren al menos dos sociedades que se fusionan",
    "At least one director required": "Se requiere al menos un director",
    "Describe the share structure of the amalgamated corporation (min 20 characters)":
      "Describa la estructura accionaria de la sociedad fusionada (mínimo 20 caracteres)",
    "New corporate name required": "Se requiere la nueva denominación social",
    "Select a legal ending": "Seleccione un elemento legal",
    "Long-form amalgamations require special resolutions of the shareholders of each predecessor":
      "La fusión ordinaria requiere resoluciones especiales de los accionistas de cada sociedad que se fusiona",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const JURISDICTION_VALUES = ["federal", "ontario"] as const;
const TYPE_VALUES = ["long_form", "short_form_vertical", "short_form_horizontal"] as const;
const NAME_TYPE_VALUES = ["named", "numbered"] as const;

const STEP_FIELDS: string[][] = [
  ["newJurisdiction", "amalgamationType", "predecessors"],
  ["newCorpNameType", "newCorpName", "newLegalEnding", "registeredOffice"],
  ["directors", "shareStructureNotes", "agreementDate", "specialResolutionsDate", "effectiveDate", "notes"],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };
const emptyPredecessor = { corpName: "", corpNumber: "", businessNumber: "" };
const emptyDirector: CurrentDirector = {
  firstName: "",
  lastName: "",
  email: "",
  canadianResident: false,
  electedDate: "",
  address: { ...emptyAddress },
};

export default function AmalgamationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<AmalgamationSubmission>({
    resolver: zodResolver(amalgamationSchema),
    mode: "onTouched",
    defaultValues: {
      newJurisdiction: "federal",
      amalgamationType: "long_form",
      predecessors: [{ ...emptyPredecessor }, { ...emptyPredecessor }],
      newCorpNameType: "named",
      newCorpName: "",
      newLegalEnding: undefined,
      registeredOffice: { ...emptyAddress },
      directors: [{ ...emptyDirector }],
      agreementDate: "",
      specialResolutionsDate: "",
      effectiveDate: "",
      shareStructureNotes: "",
      notes: "",
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

  const { handleSubmit, trigger, watch, register, control, formState: { errors } } = form;
  const predecessorsFA = useFieldArray({ control, name: "predecessors" });
  const amalgamationType = watch("amalgamationType");
  const newCorpNameType = watch("newCorpNameType");
  const newJurisdiction = watch("newJurisdiction");
  const isLongForm = amalgamationType === "long_form";

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof AmalgamationSubmission | string>> = {
      1: ["newJurisdiction", "amalgamationType", "predecessors"],
      2: ["newCorpNameType", "newCorpName", "newLegalEnding", "registeredOffice"],
      3: ["directors", "shareStructureNotes", "agreementDate", "specialResolutionsDate", "effectiveDate", "notes"],
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

  async function onFinalSubmit(data: AmalgamationSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "amalgamation", payload: data }),
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
            <strong>{t.sameJurTitle}</strong>{t.sameJurPre}<Link className="underline" href="/services/continuance">{t.continuedLink}</Link>{t.sameJurPost}
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.setupH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.setupIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label={t.jurisdiction} error={errors.newJurisdiction?.message}>
                  <select {...register("newJurisdiction")} className={sCls}>
                    {JURISDICTION_VALUES.map((v) => (
                      <option key={v} value={v}>{t.jurisdictionOptions[v]}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t.type} error={errors.amalgamationType?.message}>
                  <select {...register("amalgamationType")} className={sCls}>
                    {TYPE_VALUES.map((v) => (
                      <option key={v} value={v}>{t.typeOptions[v]}</option>
                    ))}
                  </select>
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
                    {t.predecessorsHeading} <span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-4">
                    {predecessorsFA.fields.map((field, idx) => {
                      const pErrors = errors.predecessors?.[idx];
                      return (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.predecessor} {idx + 1}</p>
                            {predecessorsFA.fields.length > 2 && (
                              <button type="button" onClick={() => predecessorsFA.remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                                <Trash2 size={12} /> {t.remove}
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <Field label={t.corpName} error={pErrors?.corpName?.message}>
                              <input type="text" {...register(`predecessors.${idx}.corpName`)} className={iCls} />
                            </Field>
                            <Field label={newJurisdiction === "ontario" ? t.ocn : t.corpNumber} error={pErrors?.corpNumber?.message}>
                              <input type="text" {...register(`predecessors.${idx}.corpNumber`)} className={iCls} />
                            </Field>
                            <Field label={t.bn} error={pErrors?.businessNumber?.message}>
                              <input type="text" {...register(`predecessors.${idx}.businessNumber`)} className={iCls} placeholder="123456789 RC0001" />
                            </Field>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {predecessorsFA.fields.length < 10 && (
                    <button type="button" onClick={() => predecessorsFA.append({ ...emptyPredecessor })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
                      <Plus size={14} /> {t.addPredecessor}
                    </button>
                  )}
                  {typeof errors.predecessors?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.predecessors.message)}</p>
                  )}
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.nameH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.nameIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label={t.nameChoice} error={errors.newCorpNameType?.message}>
                  <select {...register("newCorpNameType")} className={sCls}>
                    {NAME_TYPE_VALUES.map((v) => (
                      <option key={v} value={v}>{t.nameOptions[v]}</option>
                    ))}
                  </select>
                </Field>
                {newCorpNameType === "named" && (
                  <>
                    <Field label={t.newName} error={err(errors.newCorpName?.message)} hint={t.newNameHint}>
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
                  </>
                )}

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.registeredOffice} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="registeredOffice" errors={errors.registeredOffice} />
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.directorsH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {newJurisdiction === "federal" ? t.federalIntro : t.ontarioIntro}
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-6">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.directorsHeading}</p>
                  <CurrentDirectorsArray
                    name="directors"
                    showCanadianResident={newJurisdiction === "federal"}
                    topError={typeof errors.directors?.message === "string" ? err(errors.directors.message) : undefined}
                    errors={errors.directors}
                  />
                </div>

                <Field
                  label={t.shareStructure}
                  error={err(errors.shareStructureNotes?.message)}
                  hint={t.shareStructureHint}
                >
                  <textarea {...register("shareStructureNotes")} rows={6} className={`${iCls} resize-none`} placeholder={t.shareStructurePlaceholder} />
                </Field>

                <Field label={t.agreementDate} error={errors.agreementDate?.message}>
                  <input type="date" {...register("agreementDate")} className={iCls} />
                </Field>

                {isLongForm && (
                  <Field
                    label={t.specialResolutionsDate}
                    error={err(errors.specialResolutionsDate?.message)}
                    hint={t.specialResolutionsHint}
                  >
                    <input type="date" {...register("specialResolutionsDate")} className={iCls} />
                  </Field>
                )}

                <Field label={t.effective} error={errors.effectiveDate?.message}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <Field label={t.notes} error={errors.notes?.message} hint={t.notesHint}>
                  <textarea {...register("notes")} rows={3} className={`${iCls} resize-none`} />
                </Field>

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
                      {t.feesNote}
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
