"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  articlesAmendmentSchema,
  type ArticlesAmendmentSubmission,
  type AmendmentChangeType,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = AMENDMENT_SERVICES["articles-amendment"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + government filing fees (pass-through). Filed within 3 business days.",
    statuteStrong: "Required by statute:",
    statutePre: " Articles of Amendment must be authorized by a ",
    specialResolution: "special resolution",
    statutePost:
      " (two-thirds of the votes cast by shareholders entitled to vote). Korporex prepares and files the form; the resolution itself must be passed before filing.",
    steps: ["Corporation", "Amendment", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "Tell us which corporation's Articles you're amending.",
    amendmentH2: "The Amendment",
    filedAs: "Filed as ",
    federalForm: "Form 4: Articles of Amendment",
    federalPost: " under CBCA s.173.",
    ontarioForm: "Articles of Amendment",
    ontarioPost: " under OBCA s.168.",
    whatAmended: "What's being amended?",
    choices: {
      corporate_name: {
        label: "Corporate name",
        description: "Rename the corporation (the new name must clear a NUANS-type search if changing to a named form).",
      },
      share_structure: {
        label: "Share structure (authorized classes)",
        description: "Add, remove, or reorganize the classes of shares the corporation is authorized to issue.",
      },
      share_provisions: {
        label: "Rights / restrictions attached to shares",
        description: "Change voting, dividend, redemption, or other rights for one or more existing classes.",
      },
      number_of_directors: {
        label: "Minimum / maximum number of directors",
        description: "Change the fixed number, or the min/max range, of directors set out in the Articles.",
      },
      business_restrictions: {
        label: "Restrictions on the business",
        description: "Add or remove restrictions on the business the corporation may carry on.",
      },
      other_provisions: {
        label: "Other provisions in the Articles",
        description: "Anything else set out in the original Articles (described in the next step).",
      },
    },
    nameChange: "Corporate name change",
    newCorpName: "New corporate name *",
    newCorpNameHint: "The distinctive part of the name, without the legal ending.",
    newLegalEnding: "New legal ending *",
    select: "Select…",
    nameNotePre:
      "For named-to-named changes, a NUANS search may be required. For changes to a numbered corporation, the registry will assign the number. Leave the name blank and select ",
    numbered: "(numbered)",
    nameNotePost: " in the description.",
    directorsH: "Number of directors",
    directorsIntro: "Provide either a fixed number, or a minimum and maximum range. ",
    directorsFederal: "CBCA s.102: 1+ for non-distributing corps, 3+ if shares are publicly traded.",
    directorsOntario: "OBCA s.115: 1+ for non-offering corps, 3+ for offering corps.",
    fixedDirectors: "Fixed number of directors",
    fixedDirectorsHint: "Use this if the Articles will set a single fixed number.",
    minimum: "Minimum",
    maximum: "Maximum",
    description_: "Amendment description *",
    descriptionHint:
      "Describe the amendment(s) in plain English. The drafter will turn this into the formal amendment language for the form.",
    descriptionPlaceholder:
      "Example: Add a new Class D Special share class with the following rights:\n  - Non-voting\n  - Discretionary dividends\n  - Return of paid-up capital only on dissolution\n  - Redeemable at the option of the corporation",
    effective: "Effective date *",
    effectiveHint: "When the amendment should take effect (must be on or after the filing date).",
    resolutionH: "Special resolution",
    confirmPre: "I confirm a ",
    confirmPost:
      " authorizing this amendment has been passed by the shareholders entitled to vote (two-thirds majority).",
    resolutionDate: "Resolution date *",
    resolutionDateHint: "Date the special resolution was signed / passed at the meeting.",
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
    govFees:
      "Government filing fees (Corporations Canada $200 / Ontario $150) are billed separately as a pass-through after submission. NUANS reports (if required for a name change) are also billed as a pass-through.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Modifiez les statuts de votre société",
    label: "Statuts de modification",
    description:
      "Déposez des statuts de modification pour changer la dénomination sociale, la structure du capital-actions, les restrictions, le nombre d'administrateurs ou d'autres éléments prévus dans les statuts constitutifs initiaux de votre société.",
    heroTail: " + taxes applicables + droits gouvernementaux de dépôt (refacturés au coût). Déposé dans un délai de 3 jours ouvrables.",
    statuteStrong: "Exigence légale :",
    statutePre: " les statuts de modification doivent être autorisés par une ",
    specialResolution: "résolution spéciale",
    statutePost:
      " (les deux tiers des voix exprimées par les actionnaires habiles à voter). Korporex prépare et dépose le formulaire; la résolution elle-même doit être adoptée avant le dépôt.",
    steps: ["Société", "Modification", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "Indiquez-nous la société dont vous modifiez les statuts.",
    amendmentH2: "La modification",
    filedAs: "Déposé au moyen du ",
    federalForm: "formulaire 4 : Clauses modificatrices",
    federalPost: " en vertu de l'article 173 de la LCSA.",
    ontarioForm: "statuts de modification",
    ontarioPost: " en vertu de l'article 168 de la LSAO.",
    whatAmended: "Qu'est-ce qui est modifié?",
    choices: {
      corporate_name: {
        label: "Dénomination sociale",
        description:
          "Changer le nom de la société (la nouvelle dénomination doit franchir une recherche de type NUANS s'il s'agit d'adopter une dénomination nominative).",
      },
      share_structure: {
        label: "Structure du capital-actions (catégories autorisées)",
        description: "Ajouter, retirer ou réorganiser les catégories d'actions que la société est autorisée à émettre.",
      },
      share_provisions: {
        label: "Droits et restrictions rattachés aux actions",
        description: "Modifier les droits de vote, de dividende, de rachat ou d'autres droits d'une ou plusieurs catégories existantes.",
      },
      number_of_directors: {
        label: "Nombre minimal et maximal d'administrateurs",
        description: "Modifier le nombre fixe, ou les nombres minimal et maximal, d'administrateurs prévus dans les statuts.",
      },
      business_restrictions: {
        label: "Restrictions sur les activités",
        description: "Ajouter ou retirer des restrictions sur les activités que la société peut exercer.",
      },
      other_provisions: {
        label: "Autres dispositions des statuts",
        description: "Tout autre élément prévu dans les statuts initiaux (à décrire à l'étape suivante).",
      },
    },
    nameChange: "Changement de dénomination sociale",
    newCorpName: "Nouvelle dénomination sociale *",
    newCorpNameHint: "L'élément distinctif de la dénomination, sans l'élément juridique.",
    newLegalEnding: "Nouvel élément juridique *",
    select: "Sélectionner…",
    nameNotePre:
      "Pour passer d'une dénomination nominative à une autre, une recherche NUANS peut être requise. Pour adopter un numéro matricule comme dénomination, le registre attribuera le numéro. Laissez la dénomination vide et indiquez ",
    numbered: "(numéro matricule)",
    nameNotePost: " dans la description.",
    directorsH: "Nombre d'administrateurs",
    directorsIntro: "Indiquez soit un nombre fixe, soit un nombre minimal et un nombre maximal. ",
    directorsFederal:
      "Article 102 de la LCSA : au moins 1 pour une société n'ayant pas fait appel au public, au moins 3 si ses actions sont négociées sur le marché public.",
    directorsOntario:
      "Article 115 de la LSAO : au moins 1 pour une société ne faisant pas appel public à l'épargne, au moins 3 pour une société qui y fait appel.",
    fixedDirectors: "Nombre fixe d'administrateurs",
    fixedDirectorsHint: "Utilisez ce champ si les statuts prévoiront un seul nombre fixe.",
    minimum: "Minimum",
    maximum: "Maximum",
    description_: "Description de la modification *",
    descriptionHint:
      "Décrivez la ou les modifications en langage simple. Le rédacteur en tirera le libellé officiel de la modification pour le formulaire.",
    descriptionPlaceholder:
      "Exemple : Ajouter une nouvelle catégorie d'actions spéciales de catégorie D assorties des droits suivants :\n  - Sans droit de vote\n  - Dividendes discrétionnaires\n  - Remboursement du capital versé uniquement à la dissolution\n  - Rachetables au gré de la société",
    effective: "Date d'entrée en vigueur *",
    effectiveHint: "La date à laquelle la modification doit prendre effet (le jour du dépôt ou une date ultérieure).",
    resolutionH: "Résolution spéciale",
    confirmPre: "Je confirme qu'une ",
    confirmPost:
      " autorisant cette modification a été adoptée par les actionnaires habiles à voter (majorité des deux tiers).",
    resolutionDate: "Date de la résolution *",
    resolutionDateHint: "Date à laquelle la résolution spéciale a été signée ou adoptée en assemblée.",
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
    govFees:
      "Les droits gouvernementaux de dépôt (Corporations Canada 200 $ / Ontario 150 $) sont facturés séparément, au coût, après l'envoi. Les rapports NUANS (s'ils sont requis pour un changement de dénomination) sont aussi refacturés au coût.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Modifique los estatutos de su sociedad",
    label: "Artículos de modificación",
    description:
      "Presente artículos de modificación (Articles of Amendment) para cambiar la denominación social, la estructura accionaria, las restricciones, el número de directores u otros aspectos establecidos en los estatutos de constitución originales de su sociedad.",
    heroTail: " + impuestos aplicables + tasas gubernamentales de presentación (se trasladan al costo). Presentado en un plazo de 3 días hábiles.",
    statuteStrong: "Requisito legal:",
    statutePre: " los artículos de modificación deben autorizarse mediante una ",
    specialResolution: "resolución especial",
    statutePost:
      " (dos tercios de los votos emitidos por los accionistas con derecho a voto). Korporex prepara y presenta el formulario; la resolución en sí debe aprobarse antes de la presentación.",
    steps: ["Sociedad", "Modificación", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "Indíquenos de qué sociedad está modificando los estatutos.",
    amendmentH2: "La modificación",
    filedAs: "Se presenta como ",
    federalForm: "Formulario 4: Articles of Amendment",
    federalPost: " conforme al artículo 173 de la CBCA.",
    ontarioForm: "Articles of Amendment",
    ontarioPost: " conforme al artículo 168 de la OBCA.",
    whatAmended: "¿Qué se modifica?",
    choices: {
      corporate_name: {
        label: "Denominación social",
        description:
          "Cambiar el nombre de la sociedad (la nueva denominación debe superar una búsqueda tipo NUANS si se adopta una denominación con nombre).",
      },
      share_structure: {
        label: "Estructura accionaria (clases autorizadas)",
        description: "Agregar, eliminar o reorganizar las clases de acciones que la sociedad está autorizada a emitir.",
      },
      share_provisions: {
        label: "Derechos y restricciones de las acciones",
        description: "Cambiar los derechos de voto, dividendos, rescate u otros de una o más clases existentes.",
      },
      number_of_directors: {
        label: "Número mínimo y máximo de directores",
        description: "Cambiar el número fijo, o el número mínimo y máximo, de directores que establecen los estatutos.",
      },
      business_restrictions: {
        label: "Restricciones sobre la actividad",
        description: "Agregar o eliminar restricciones sobre la actividad que la sociedad puede ejercer.",
      },
      other_provisions: {
        label: "Otras disposiciones de los estatutos",
        description: "Cualquier otro aspecto establecido en los estatutos originales (descrito en el siguiente paso).",
      },
    },
    nameChange: "Cambio de denominación social",
    newCorpName: "Nueva denominación social *",
    newCorpNameHint: "La parte distintiva de la denominación, sin la terminación legal.",
    newLegalEnding: "Nueva terminación legal *",
    select: "Seleccione…",
    nameNotePre:
      "Para cambiar de una denominación con nombre a otra, puede requerirse una búsqueda NUANS. Para pasar a una sociedad numerada, el registro asignará el número. Deje la denominación en blanco e indique ",
    numbered: "(numerada)",
    nameNotePost: " en la descripción.",
    directorsH: "Número de directores",
    directorsIntro: "Indique un número fijo, o bien un número mínimo y uno máximo. ",
    directorsFederal:
      "Artículo 102 de la CBCA: al menos 1 para sociedades que no hacen oferta pública, al menos 3 si sus acciones cotizan en bolsa.",
    directorsOntario:
      "Artículo 115 de la OBCA: al menos 1 para sociedades que no hacen oferta pública, al menos 3 para sociedades que hacen oferta pública.",
    fixedDirectors: "Número fijo de directores",
    fixedDirectorsHint: "Use este campo si los estatutos establecerán un único número fijo.",
    minimum: "Mínimo",
    maximum: "Máximo",
    description_: "Descripción de la modificación *",
    descriptionHint:
      "Describa la o las modificaciones en lenguaje sencillo. El redactor las convertirá en el texto formal de la modificación para el formulario.",
    descriptionPlaceholder:
      "Ejemplo: Agregar una nueva clase de acciones especiales Clase D con los siguientes derechos:\n  - Sin derecho a voto\n  - Dividendos discrecionales\n  - Reembolso del capital pagado solo en la disolución\n  - Rescatables a opción de la sociedad",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo debe entrar en vigor la modificación (igual o posterior a la fecha de presentación).",
    resolutionH: "Resolución especial",
    confirmPre: "Confirmo que los accionistas con derecho a voto han aprobado una ",
    confirmPost: " que autoriza esta modificación (mayoría de dos tercios).",
    resolutionDate: "Fecha de la resolución *",
    resolutionDateHint: "Fecha en que la resolución especial se firmó o se aprobó en la asamblea.",
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
    govFees:
      "Las tasas gubernamentales de presentación (Corporations Canada 200 $ / Ontario 150 $) se facturan por separado, al costo, después del envío. Los informes NUANS (si se requieren para un cambio de denominación) también se trasladan al costo.",
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
    "Select at least one change": "Sélectionnez au moins une modification",
    "Select what you're amending": "Sélectionnez ce que vous modifiez",
    "Please describe the amendment(s) in detail (min 20 characters)":
      "Veuillez décrire la ou les modifications en détail (20 caractères minimum)",
    "Required: a special resolution must have been passed": "Obligatoire : une résolution spéciale doit avoir été adoptée",
    "New corporate name required": "La nouvelle dénomination sociale est obligatoire",
    "Select a legal ending": "Sélectionnez un élément juridique",
    "Provide either a fixed number or a min/max range": "Indiquez un nombre fixe ou un nombre minimal et maximal",
    "Maximum must be greater than or equal to minimum": "Le maximum doit être supérieur ou égal au minimum",
  },
  es: {
    "Select at least one change": "Seleccione al menos un cambio",
    "Select what you're amending": "Seleccione lo que está modificando",
    "Please describe the amendment(s) in detail (min 20 characters)":
      "Describa la o las modificaciones en detalle (mínimo 20 caracteres)",
    "Required: a special resolution must have been passed": "Obligatorio: debe haberse aprobado una resolución especial",
    "New corporate name required": "Se requiere la nueva denominación social",
    "Select a legal ending": "Seleccione una terminación legal",
    "Provide either a fixed number or a min/max range": "Indique un número fijo o un número mínimo y máximo",
    "Maximum must be greater than or equal to minimum": "El máximo debe ser mayor o igual que el mínimo",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["corporation"],
  [
    "changeTypes",
    "newCorpName",
    "newLegalEnding",
    "minDirectors",
    "maxDirectors",
    "fixedDirectors",
    "amendmentDescription",
    "effectiveDate",
    "specialResolutionPassed",
    "specialResolutionDate",
  ],
  ["contact"],
  ["billingName", "billingAddress"],
];

const AMENDMENT_VALUES: AmendmentChangeType[] = [
  "corporate_name",
  "share_structure",
  "share_provisions",
  "number_of_directors",
  "business_restrictions",
  "other_provisions",
];

export default function ArticlesAmendmentPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<ArticlesAmendmentSubmission>({
    resolver: zodResolver(articlesAmendmentSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changeTypes: [],
      newCorpName: "",
      newLegalEnding: undefined,
      minDirectors: undefined,
      maxDirectors: undefined,
      fixedDirectors: undefined,
      amendmentDescription: "",
      effectiveDate: "",
      specialResolutionPassed: false,
      specialResolutionDate: "",
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
  const jurisdiction = watch("corporation.jurisdiction");
  const changeTypes = watch("changeTypes") ?? [];

  function toggleChangeType(value: AmendmentChangeType, checked: boolean) {
    const next = checked
      ? Array.from(new Set([...changeTypes, value]))
      : changeTypes.filter((v) => v !== value);
    setValue("changeTypes", next, { shouldValidate: true });
  }

  const includesName = changeTypes.includes("corporate_name");
  const includesDirectors = changeTypes.includes("number_of_directors");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ArticlesAmendmentSubmission | string>> = {
      1: ["corporation"],
      2: [
        "changeTypes",
        "newCorpName",
        "newLegalEnding",
        "minDirectors",
        "maxDirectors",
        "fixedDirectors",
        "amendmentDescription",
        "effectiveDate",
        "specialResolutionPassed",
        "specialResolutionDate",
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

  async function onFinalSubmit(data: ArticlesAmendmentSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "articles-amendment", payload: data }),
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
            <strong>{t.statuteStrong}</strong>{t.statutePre}<strong>{t.specialResolution}</strong>{t.statutePost}
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.amendmentH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal" ? (
                  <>{t.filedAs}<strong>{t.federalForm}</strong>{t.federalPost}</>
                ) : (
                  <>{t.filedAs}<strong>{t.ontarioForm}</strong>{t.ontarioPost}</>
                )}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
                    {t.whatAmended} <span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-2">
                    {AMENDMENT_VALUES.map((value) => {
                      const checked = changeTypes.includes(value);
                      const c = t.choices[value];
                      return (
                        <label
                          key={value}
                          className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                            checked ? "border-navy-900 bg-cream-50" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => toggleChangeType(value, e.target.checked)}
                            className="mt-1 accent-navy-900"
                          />
                          <span>
                            <span className="text-sm font-medium text-gray-900 block">{c.label}</span>
                            <span className="text-xs text-gray-500">{c.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {typeof errors.changeTypes?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.changeTypes.message)}</p>
                  )}
                </div>

                {includesName && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.nameChange}</p>
                    <Field label={t.newCorpName} error={err(errors.newCorpName?.message)} hint={t.newCorpNameHint}>
                      <input type="text" {...register("newCorpName")} className={iCls} placeholder="Acme Holdings" />
                    </Field>
                    <Field label={t.newLegalEnding} error={err(errors.newLegalEnding?.message)}>
                      <select {...register("newLegalEnding")} className={sCls}>
                        <option value="">{t.select}</option>
                        {LEGAL_ENDINGS.map((le) => (
                          <option key={le} value={le}>{le}</option>
                        ))}
                      </select>
                    </Field>
                    <p className="text-xs text-gray-500">
                      {t.nameNotePre}<em>{t.numbered}</em>{t.nameNotePost}
                    </p>
                  </div>
                )}

                {includesDirectors && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.directorsH}</p>
                    <p className="text-xs text-gray-500">
                      {t.directorsIntro}{jurisdiction === "federal" ? t.directorsFederal : t.directorsOntario}
                    </p>
                    <Field label={t.fixedDirectors} error={err(errors.fixedDirectors?.message)} hint={t.fixedDirectorsHint}>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        {...register("fixedDirectors", { setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)) })}
                        className={iCls}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t.minimum} error={err(errors.minDirectors?.message)}>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          {...register("minDirectors", { setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)) })}
                          className={iCls}
                        />
                      </Field>
                      <Field label={t.maximum} error={err(errors.maxDirectors?.message)}>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          {...register("maxDirectors", { setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)) })}
                          className={iCls}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                <Field
                  label={t.description_}
                  error={err(errors.amendmentDescription?.message)}
                  hint={t.descriptionHint}
                >
                  <textarea
                    {...register("amendmentDescription")}
                    rows={6}
                    className={`${iCls} resize-none`}
                    placeholder={t.descriptionPlaceholder}
                  />
                </Field>

                <Field label={t.effective} error={errors.effectiveDate?.message} hint={t.effectiveHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.resolutionH}</p>
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      {t.confirmPre}<strong>{t.specialResolution}</strong>{t.confirmPost}
                    </span>
                  </label>
                  {errors.specialResolutionPassed?.message && (
                    <p className="text-xs text-red-500">{err(errors.specialResolutionPassed.message)}</p>
                  )}
                  <Field label={t.resolutionDate} error={errors.specialResolutionDate?.message} hint={t.resolutionDateHint}>
                    <input type="date" {...register("specialResolutionDate")} className={iCls} />
                  </Field>
                </div>

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
