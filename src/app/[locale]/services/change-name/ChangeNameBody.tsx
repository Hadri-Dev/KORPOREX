"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import {
  changeNameSchema,
  computeChangeNamePricing,
  CHANGE_NAME_PRICES,
  MINUTE_BOOK_ADDON_FEE,
  EXTRA_NUANS_FEE,
  type ChangeNameSubmission,
} from "@/lib/changeNameSchema";
import type { Jurisdiction } from "@/lib/pricing";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { Field, BackBtn, NextBtn, WizardStepper, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

type Lang = "en" | "fr" | "es";

const JURISDICTIONS: Array<{ value: Jurisdiction; govFee: string }> = [
  { value: "ontario", govFee: "$150" },
  { value: "federal", govFee: "$200" },
];

const COPY = {
  en: {
    h1: "Change of Business Name",
    label: "Change of Business Name",
    description:
      "Legally change your corporation's name in Ontario or federally in Canada. We prepare and file the Articles of Amendment, run the required NUANS name search, and issue your updated certificate. The government filing fee and one NUANS search are included in one flat price.",
    ontarioShort: "Ontario",
    federalShort: "Federal",
    heroTail: " + HST. Government filing fee and one NUANS search included. Filed within 1 to 2 business days.",
    requiredLabel: "Required by statute:",
    requiredPre: " a corporate name change must be authorized by a ",
    specialResolution: "special resolution",
    requiredPost:
      " of the shareholders (two-thirds of the votes cast). Korporex prepares and files the Articles of Amendment; the resolution must be passed before filing.",
    steps: ["Jurisdiction", "Corporation", "New name", "Contact", "Billing"],
    backToServices: "← Back to services",
    jurH2: "Choose your corporation type",
    jurIntro:
      "Your jurisdiction determines the registry, the statute, and the government fee, all included in your flat price.",
    jurisdictions: {
      ontario: {
        name: "Ontario Corporation",
        statute: "Articles of Amendment · OBCA s.168",
        registry: "Filed with the Ontario Business Registry. Government fee $150 plus Ontario NUANS, both included.",
      },
      federal: {
        name: "Federal Corporation",
        statute: "Articles of Amendment (Form 4) · CBCA s.173",
        registry: "Filed with Corporations Canada. Government fee $200 plus federal NUANS, both included.",
      },
    },
    jurLabels: { ontario: "Ontario", federal: "Federal (Canada)" },
    plusHst: "+ HST",
    includedTitle: "What's included in the flat price",
    included: [
      "Preparation of the Articles of Amendment (name change)",
      "Government filing fee included (ON $150 / Federal $200)",
      "One (1) NUANS name search report included",
      "Name pre-screening for availability and distinctiveness",
      "Updated Certificate and Articles of Amendment",
    ],
    extraNuansPre: "One NUANS name search is included. Each additional search (for a further name choice) is ",
    continue: "Continue",
    corpH2: "Your corporation",
    corpIntroFederal: "Tell us which federal corporation is changing its name.",
    corpIntroOntario: "Tell us which Ontario corporation is changing its name.",
    companyKey: "Company Key *",
    companyKeyHintFederal:
      "The confidential Corporate Key from Corporations Canada that authorizes online filings for your corporation.",
    companyKeyHintOntario:
      "The confidential Company Key issued by the Ontario Business Registry that authorizes online filings for your corporation.",
    companyKeyPlaceholder: "e.g. 1a2b3c4d5e",
    nameH2: "The new name",
    nameIntro: "This is the name we'll clear through NUANS and file on the Articles of Amendment.",
    newName: "New corporate name *",
    newNameHint: "The distinctive part of the name, without the legal ending.",
    newEnding: "New legal ending *",
    select: "Select…",
    nuansNotePre: "Your price includes ",
    nuansNoteStrong: "one NUANS name search",
    nuansNoteMid:
      ". If the name isn't available or is too similar to an existing name, we'll flag it and help you pick an alternative. Each additional NUANS search is ",
    effective: "Effective date *",
    effectiveHint: "When the name change should take effect (on or after the filing date).",
    resTitle: "Special resolution",
    resConfirmPre: "I confirm a ",
    resConfirmPost:
      " authorizing this name change has been passed by the shareholders entitled to vote (two-thirds majority).",
    resDate: "Resolution date *",
    resDateHint: "Date the special resolution was signed / passed.",
    addonTitle: "Optional add-on",
    addonLabel: "Update the minute book to reflect the new name",
    addonDesc:
      "We prepare the directors' and shareholders' resolutions and update your corporate records so everything matches the new name.",
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
    minuteBookLine: "Minute book update",
    tax: "Tax",
    yourProvince: "your province",
    total: "Total (CAD)",
    includedNote:
      "The government filing fee (ON $150 / Federal $200) and one NUANS name search are included in the price above. There are no separate pass-through charges for this service.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Changement de dénomination sociale",
    label: "Changement de nom d'entreprise",
    description:
      "Changez légalement la dénomination sociale de votre société en Ontario ou sous le régime fédéral au Canada. Nous préparons et déposons les clauses modificatrices, effectuons la recherche NUANS requise et vous remettons votre certificat mis à jour. Les droits de dépôt gouvernementaux et une recherche NUANS sont inclus dans un prix fixe unique.",
    ontarioShort: "Ontario",
    federalShort: "fédéral",
    heroTail: " + TVH. Droits de dépôt gouvernementaux et une recherche NUANS inclus. Déposé dans un délai de 1 à 2 jours ouvrables.",
    requiredLabel: "Exigé par la loi :",
    requiredPre: " un changement de dénomination sociale doit être autorisé par une ",
    specialResolution: "résolution spéciale",
    requiredPost:
      " des actionnaires (deux tiers des voix exprimées). Korporex prépare et dépose les clauses modificatrices; la résolution doit être adoptée avant le dépôt.",
    steps: ["Juridiction", "Société", "Nouveau nom", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    jurH2: "Choisissez le type de votre société",
    jurIntro:
      "Votre juridiction détermine le registre, la loi applicable et les droits gouvernementaux, tous inclus dans votre prix fixe.",
    jurisdictions: {
      ontario: {
        name: "Société ontarienne",
        statute: "Statuts de modification · LSAO art. 168",
        registry: "Déposé auprès du Registre des entreprises de l'Ontario. Droits gouvernementaux de 150 $ et rapport NUANS de l'Ontario, tous deux inclus.",
      },
      federal: {
        name: "Société fédérale",
        statute: "Clauses modificatrices (formulaire 4) · LCSA art. 173",
        registry: "Déposé auprès de Corporations Canada. Droits gouvernementaux de 200 $ et rapport NUANS fédéral, tous deux inclus.",
      },
    },
    jurLabels: { ontario: "Ontario", federal: "Fédéral (Canada)" },
    plusHst: "+ TVH",
    includedTitle: "Ce qui est inclus dans le prix fixe",
    included: [
      "Préparation des clauses modificatrices (changement de dénomination)",
      "Droits de dépôt gouvernementaux inclus (ON 150 $ / fédéral 200 $)",
      "Un (1) rapport de recherche NUANS inclus",
      "Vérification préalable de la disponibilité et du caractère distinctif du nom",
      "Certificat et statuts de modification mis à jour",
    ],
    extraNuansPre: "Une recherche NUANS est incluse. Chaque recherche supplémentaire (pour un autre choix de nom) coûte ",
    continue: "Continuer",
    corpH2: "Votre société",
    corpIntroFederal: "Indiquez-nous quelle société fédérale change de dénomination sociale.",
    corpIntroOntario: "Indiquez-nous quelle société ontarienne change de dénomination sociale.",
    companyKey: "Clé d'entreprise *",
    companyKeyHintFederal:
      "La clé d'entreprise confidentielle de Corporations Canada qui autorise les dépôts en ligne pour votre société.",
    companyKeyHintOntario:
      "La clé d'entreprise (Company Key) confidentielle délivrée par le Registre des entreprises de l'Ontario qui autorise les dépôts en ligne pour votre société.",
    companyKeyPlaceholder: "p. ex. 1a2b3c4d5e",
    nameH2: "La nouvelle dénomination",
    nameIntro: "Il s'agit du nom que nous vérifierons au moyen d'une recherche NUANS et que nous inscrirons dans les clauses modificatrices.",
    newName: "Nouvelle dénomination sociale *",
    newNameHint: "La partie distinctive du nom, sans l'élément juridique.",
    newEnding: "Nouvel élément juridique *",
    select: "Sélectionnez…",
    nuansNotePre: "Votre prix comprend ",
    nuansNoteStrong: "une recherche NUANS",
    nuansNoteMid:
      ". Si le nom n'est pas disponible ou s'il ressemble trop à un nom existant, nous vous le signalerons et vous aiderons à choisir une autre option. Chaque recherche NUANS supplémentaire coûte ",
    effective: "Date d'entrée en vigueur *",
    effectiveHint: "La date à laquelle le changement de dénomination prend effet (à la date du dépôt ou après).",
    resTitle: "Résolution spéciale",
    resConfirmPre: "Je confirme qu'une ",
    resConfirmPost:
      " autorisant ce changement de dénomination a été adoptée par les actionnaires habiles à voter (majorité des deux tiers).",
    resDate: "Date de la résolution *",
    resDateHint: "Date à laquelle la résolution spéciale a été signée ou adoptée.",
    addonTitle: "Option facultative",
    addonLabel: "Mettre à jour le registre des procès-verbaux pour refléter la nouvelle dénomination",
    addonDesc:
      "Nous préparons les résolutions des administrateurs et des actionnaires et mettons à jour vos registres de société afin que tout corresponde à la nouvelle dénomination.",
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
    minuteBookLine: "Mise à jour du registre des procès-verbaux",
    tax: "Taxe",
    yourProvince: "votre province",
    total: "Total (CAD)",
    includedNote:
      "Les droits de dépôt gouvernementaux (ON 150 $ / fédéral 200 $) et une recherche NUANS sont inclus dans le prix ci-dessus. Aucuns frais refacturés distincts ne s'appliquent à ce service.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Cambio de nombre de empresa",
    label: "Cambio de nombre de empresa",
    description:
      "Cambie legalmente la denominación social de su sociedad en Ontario o a nivel federal en Canadá. Preparamos y presentamos los estatutos modificatorios (Articles of Amendment), realizamos la búsqueda NUANS requerida y le entregamos su certificado actualizado. La tasa gubernamental de presentación y una búsqueda NUANS están incluidas en un único precio fijo.",
    ontarioShort: "Ontario",
    federalShort: "federal",
    heroTail: " + HST. Tasa gubernamental de presentación y una búsqueda NUANS incluidas. Presentado en un plazo de 1 a 2 días hábiles.",
    requiredLabel: "Exigido por ley:",
    requiredPre: " el cambio de denominación social debe ser autorizado mediante una ",
    specialResolution: "resolución especial",
    requiredPost:
      " de los accionistas (dos tercios de los votos emitidos). Korporex prepara y presenta los estatutos modificatorios; la resolución debe aprobarse antes de la presentación.",
    steps: ["Jurisdicción", "Sociedad", "Nuevo nombre", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    jurH2: "Elija el tipo de sociedad",
    jurIntro:
      "Su jurisdicción determina el registro, la ley aplicable y la tasa gubernamental, todo incluido en su precio fijo.",
    jurisdictions: {
      ontario: {
        name: "Sociedad de Ontario",
        statute: "Articles of Amendment · OBCA art. 168",
        registry: "Presentado ante el Ontario Business Registry. Tasa gubernamental de $150 más el informe NUANS de Ontario, ambos incluidos.",
      },
      federal: {
        name: "Sociedad federal",
        statute: "Articles of Amendment (Formulario 4) · CBCA art. 173",
        registry: "Presentado ante Corporations Canada. Tasa gubernamental de $200 más el informe NUANS federal, ambos incluidos.",
      },
    },
    jurLabels: { ontario: "Ontario", federal: "Federal (Canadá)" },
    plusHst: "+ HST",
    includedTitle: "Qué incluye el precio fijo",
    included: [
      "Preparación de los estatutos modificatorios (cambio de nombre)",
      "Tasa gubernamental de presentación incluida (ON $150 / federal $200)",
      "Un (1) informe NUANS incluido",
      "Revisión previa de la disponibilidad y el carácter distintivo del nombre",
      "Certificado y estatutos modificatorios actualizados",
    ],
    extraNuansPre: "Se incluye una búsqueda NUANS. Cada búsqueda adicional (para otra opción de nombre) cuesta ",
    continue: "Continuar",
    corpH2: "Su sociedad",
    corpIntroFederal: "Indíquenos qué sociedad federal cambia de nombre.",
    corpIntroOntario: "Indíquenos qué sociedad de Ontario cambia de nombre.",
    companyKey: "Clave de la empresa (Company Key) *",
    companyKeyHintFederal:
      "La clave corporativa confidencial (Corporate Key) de Corporations Canada que autoriza las presentaciones en línea de su sociedad.",
    companyKeyHintOntario:
      "La clave confidencial (Company Key) emitida por el Ontario Business Registry que autoriza las presentaciones en línea de su sociedad.",
    companyKeyPlaceholder: "p. ej. 1a2b3c4d5e",
    nameH2: "El nuevo nombre",
    nameIntro: "Es el nombre que verificaremos mediante NUANS y que presentaremos en los estatutos modificatorios.",
    newName: "Nueva denominación social *",
    newNameHint: "La parte distintiva del nombre, sin la terminación legal.",
    newEnding: "Nueva terminación legal *",
    select: "Seleccione…",
    nuansNotePre: "Su precio incluye ",
    nuansNoteStrong: "una búsqueda NUANS",
    nuansNoteMid:
      ". Si el nombre no está disponible o se parece demasiado a un nombre existente, se lo indicaremos y le ayudaremos a elegir una alternativa. Cada búsqueda NUANS adicional cuesta ",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo debe entrar en vigor el cambio de nombre (en la fecha de presentación o después).",
    resTitle: "Resolución especial",
    resConfirmPre: "Confirmo que una ",
    resConfirmPost:
      " que autoriza este cambio de nombre ha sido aprobada por los accionistas con derecho a voto (mayoría de dos tercios).",
    resDate: "Fecha de la resolución *",
    resDateHint: "Fecha en que se firmó o aprobó la resolución especial.",
    addonTitle: "Complemento opcional",
    addonLabel: "Actualizar el libro de actas para reflejar el nuevo nombre",
    addonDesc:
      "Preparamos las resoluciones de los directores y de los accionistas y actualizamos sus registros corporativos para que todo coincida con el nuevo nombre.",
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
    minuteBookLine: "Actualización del libro de actas",
    tax: "Impuesto",
    yourProvince: "su provincia",
    total: "Total (CAD)",
    includedNote:
      "La tasa gubernamental de presentación (ON $150 / federal $200) y una búsqueda NUANS están incluidas en el precio anterior. No hay cargos adicionales por separado para este servicio.",
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
    "New corporate name required": "La nouvelle dénomination sociale est obligatoire",
    "Select a legal ending": "Sélectionnez un élément juridique",
    "Required: a special resolution must have been passed": "Obligatoire : une résolution spéciale doit avoir été adoptée",
  },
  es: {
    "New corporate name required": "La nueva denominación social es obligatoria",
    "Select a legal ending": "Seleccione una terminación legal",
    "Required: a special resolution must have been passed": "Obligatorio: debe haberse aprobado una resolución especial",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

export default function ChangeNameBody() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<ChangeNameSubmission>({
    resolver: zodResolver(changeNameSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      companyKey: "",
      newCorpName: "",
      newLegalEnding: undefined,
      effectiveDate: "",
      specialResolutionPassed: false,
      specialResolutionDate: "",
      updateMinuteBook: false,
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
  const updateMinuteBook = watch("updateMinuteBook");
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";

  const pricing = computeChangeNamePricing({
    jurisdiction,
    updateMinuteBook: !!updateMinuteBook,
    billingCountry: country,
    billingRegion: region,
  });

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeNameSubmission | string>> = {
      1: ["corporation.jurisdiction"],
      2: ["corporation", "companyKey"],
      3: [
        "newCorpName",
        "newLegalEnding",
        "effectiveDate",
        "specialResolutionPassed",
        "specialResolutionDate",
      ],
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

  async function onFinalSubmit(data: ChangeNameSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/change-name-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-name", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? t.failed);
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.failed);
      setSubmitting(false);
    }
  }

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // If the final submit fails validation, jump to the earliest step whose
  // fields have an error (fields on other steps aren't visible otherwise).
  function onInvalid(errs: typeof errors) {
    if (errs.corporation?.jurisdiction) return goTo(1);
    if (errs.corporation || errs.companyKey) return goTo(2);
    if (
      errs.newCorpName ||
      errs.newLegalEnding ||
      errs.effectiveDate ||
      errs.specialResolutionPassed ||
      errs.specialResolutionDate
    )
      return goTo(3);
    if (errs.contact) return goTo(4);
    if (errs.billingName || errs.billingAddress) return goTo(5);
  }

  const taxRate = pricing.taxRate;

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">
            {t.h1}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">
              ${CHANGE_NAME_PRICES.ontario.toFixed(2)} ({t.ontarioShort}) / ${CHANGE_NAME_PRICES.federal.toFixed(2)} ({t.federalShort}) CAD
            </span>
            {t.heroTail}
          </p>
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>{t.requiredLabel}</strong>
            {t.requiredPre}
            <strong>{t.specialResolution}</strong>
            {t.requiredPost}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-xl mx-auto">
          <WizardStepper steps={[...t.steps]} current={step} onGo={goTo} />

          {/* STEP 1: Jurisdiction */}
          {step === 1 && (
            <div>
              <button
                type="button"
                onClick={() => router.push("/services")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors"
              >
                {t.backToServices}
              </button>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.jurH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.jurIntro}</p>

              <div className="space-y-4">
                {JURISDICTIONS.map((j) => {
                  const selected = jurisdiction === j.value;
                  const jc = t.jurisdictions[j.value];
                  return (
                    <button
                      key={j.value}
                      type="button"
                      onClick={() => setValue("corporation.jurisdiction", j.value, { shouldValidate: true })}
                      className={`w-full text-left border-2 rounded-lg p-5 transition-all ${
                        selected ? "border-navy-900 bg-cream-50 shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-xl font-semibold text-navy-900">{jc.name}</p>
                          <p className="text-xs font-medium text-gold-600 uppercase tracking-wide mt-0.5 mb-2">
                            {jc.statute}
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">{jc.registry}</p>
                        </div>
                        <span
                          className={`shrink-0 mt-1 w-5 h-5 rounded-full border-2 ${
                            selected ? "border-navy-900 bg-navy-900" : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-navy-900 mt-3">
                        ${CHANGE_NAME_PRICES[j.value].toFixed(2)} <span className="font-medium text-gray-500">{t.plusHst}</span>
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border border-gray-200 rounded-lg p-5 bg-cream-50/40">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">
                  {t.includedTitle}
                </p>
                <ul className="space-y-2">
                  {t.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={14} className="text-navy-900 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  {t.extraNuansPre}${EXTRA_NUANS_FEE.toFixed(2)} {t.plusHst}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => gotoStep(2)}
                className="w-full bg-navy-900 text-white font-medium py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors mt-6"
              >
                {t.continue}
              </button>
            </div>
          )}

          {/* STEP 2: Corporation */}
          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.corpH2}</h2>
              <p className="text-gray-500 text-sm mb-8">
                {jurisdiction === "federal" ? t.corpIntroFederal : t.corpIntroOntario}
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction={jurisdiction} />
                <Field
                  label={t.companyKey}
                  error={errors.companyKey?.message}
                  hint={jurisdiction === "federal" ? t.companyKeyHintFederal : t.companyKeyHintOntario}
                >
                  <input type="text" {...register("companyKey")} className={iCls} placeholder={t.companyKeyPlaceholder} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {/* STEP 3: New name */}
          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.nameH2}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.nameIntro}</p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-5">
                <Field
                  label={t.newName}
                  error={localizeError(lang, errors.newCorpName?.message)}
                  hint={t.newNameHint}
                >
                  <input type="text" {...register("newCorpName")} className={iCls} placeholder="Acme Holdings" />
                </Field>
                <Field label={t.newEnding} error={localizeError(lang, errors.newLegalEnding?.message)}>
                  <select {...register("newLegalEnding")} className={sCls}>
                    <option value="">{t.select}</option>
                    {LEGAL_ENDINGS.map((le) => (
                      <option key={le} value={le}>{le}</option>
                    ))}
                  </select>
                </Field>

                <div className="p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
                  {t.nuansNotePre}<strong>{t.nuansNoteStrong}</strong>{t.nuansNoteMid}
                  <strong>${EXTRA_NUANS_FEE.toFixed(2)} {t.plusHst}</strong>.
                </div>

                <Field
                  label={t.effective}
                  error={errors.effectiveDate?.message}
                  hint={t.effectiveHint}
                >
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.resTitle}</p>
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      {t.resConfirmPre}<strong>{t.specialResolution}</strong>{t.resConfirmPost}
                    </span>
                  </label>
                  {errors.specialResolutionPassed?.message && (
                    <p className="text-xs text-red-500">{localizeError(lang, errors.specialResolutionPassed.message)}</p>
                  )}
                  <Field
                    label={t.resDate}
                    error={errors.specialResolutionDate?.message}
                    hint={t.resDateHint}
                  >
                    <input type="date" {...register("specialResolutionDate")} className={iCls} />
                  </Field>
                </div>

                {/* Optional minute-book add-on */}
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">{t.addonTitle}</p>
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      updateMinuteBook ? "border-navy-900 bg-cream-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input type="checkbox" {...register("updateMinuteBook")} className="mt-1 accent-navy-900" />
                    <span className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">{t.addonLabel}</span>
                      <span className="text-xs text-gray-500">{t.addonDesc}</span>
                    </span>
                    <span className="text-sm font-semibold text-navy-900 whitespace-nowrap">
                      +${MINUTE_BOOK_ADDON_FEE} <span className="font-medium text-gray-500">{t.plusHst}</span>
                    </span>
                  </label>
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {/* STEP 4: Contact */}
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

          {/* STEP 5: Billing & review */}
          {step === 5 && (
            <div>
              <BackBtn onClick={() => setStep(4)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.billingH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.billingIntro}</p>
              <form onSubmit={handleSubmit(onFinalSubmit, onInvalid)} className="space-y-5">
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
                      <span className="text-gray-700">{t.label} ({t.jurLabels[jurisdiction]})</span>
                      <span className="text-gray-900">${pricing.base.toFixed(2)}</span>
                    </div>
                    {pricing.minuteBookFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">{t.minuteBookLine}</span>
                        <span className="text-gray-900">${pricing.minuteBookFee.toFixed(2)}</span>
                      </div>
                    )}
                    {pricing.tax > 0 && (
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>{t.tax} ({(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}% · {region || t.yourProvince})</span>
                        <span>${pricing.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-navy-900">{t.total}</span>
                      <span className="text-navy-900">${pricing.total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.includedNote}</p>
                  </div>
                </div>

                {submitError && (
                  <div className="border border-red-200 bg-red-50 text-red-900 text-sm rounded-md p-3">{submitError}</div>
                )}

                <NextBtn label={submitting ? t.submitting : t.submit} disabled={submitting} />
                <p className="text-xs text-gray-500 text-center mt-2">{t.stripe}</p>
              </form>
            </div>
          )}
        </div>
      </section>
    </FormProvider>
  );
}
