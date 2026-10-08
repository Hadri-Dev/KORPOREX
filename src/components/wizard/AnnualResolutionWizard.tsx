"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  annualResolutionOntarioSchema,
  annualResolutionFederalSchema,
  type AnnualResolutionSubmission,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { POSITION_LABELS } from "@/components/wizard/CurrentPeopleSection";

// Shared wizard for both Annual Resolution services. The Ontario and federal
// flows differ only in the locked jurisdiction, the schema's jurisdiction
// guard, and the statute cited in the copy, so unlike the two Annual Return
// wizards (which capture different government-form fields), this one is a
// single component rendered by both service pages.

type Jurisdiction = "ontario" | "federal";
type Lang = "en" | "fr" | "es";

const STEP_FIELDS: string[][] = [
  ["corporation", "financialYearEnd", "resolutionDate", "lastAnnualMeetingDate"],
  [
    "financialStatementsAvailable",
    "auditorTreatment",
    "auditorName",
    "directors",
    "officers",
    "shareholders",
    "allShareholdersWillSign",
    "additionalMatters",
  ],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

const SLUGS: Record<Jurisdiction, "annual-resolution-on" | "annual-resolution-federal"> = {
  ontario: "annual-resolution-on",
  federal: "annual-resolution-federal",
};

// Jurisdiction-specific copy. English h1/label/description come from the
// service registry so the listing and the page stay in sync.
type JurisdictionCopy = {
  h1?: string;
  label?: string;
  description?: string;
  registry: string;
  meetingRule: string;
  auditRule: string;
};

const JURISDICTION_COPY: Record<Jurisdiction, Record<Lang, JurisdictionCopy>> = {
  ontario: {
    en: {
      registry: "Ontario corporation",
      meetingRule:
        "OBCA s.94 requires an annual meeting of shareholders within 15 months of the last one. Written resolutions signed by all voting shareholders (OBCA s.104) satisfy the requirement without holding a meeting.",
      auditRule:
        "A non-offering Ontario corporation may dispense with the audit for the year by unanimous written consent of all shareholders, voting and non-voting (OBCA s.148).",
    },
    fr: {
      h1: "Résolutions annuelles pour votre société ontarienne",
      label: "Résolutions annuelles (Ontario)",
      description:
        "Les sociétés de l'Ontario doivent tenir une assemblée annuelle des actionnaires dans les 15 mois suivant la précédente (article 94 de la LSAO), ou adopter à la place des résolutions écrites signées par tous les actionnaires (article 104 de la LSAO). Korporex prépare les résolutions annuelles des administrateurs et des actionnaires qui approuvent les états financiers, élisent les administrateurs, nomment les dirigeants et dispensent la société de la vérification ou nomment un vérificateur, prêtes à signer et à classer dans votre registre des procès-verbaux.",
      registry: "société ontarienne",
      meetingRule:
        "L'article 94 de la LSAO exige la tenue d'une assemblée annuelle des actionnaires dans les 15 mois suivant la précédente. Des résolutions écrites signées par tous les actionnaires habiles à voter (article 104 de la LSAO) satisfont à cette exigence sans qu'une assemblée soit tenue.",
      auditRule:
        "Une société ontarienne qui ne fait pas appel public à l'épargne peut être dispensée de la vérification pour l'exercice avec le consentement écrit unanime de tous les actionnaires, avec ou sans droit de vote (article 148 de la LSAO).",
    },
    es: {
      h1: "Resoluciones anuales para su sociedad de Ontario",
      label: "Resoluciones anuales (Ontario)",
      description:
        "Las sociedades de Ontario deben celebrar una asamblea anual de accionistas dentro de los 15 meses posteriores a la anterior (artículo 94 de la OBCA), o aprobar en su lugar resoluciones escritas firmadas por todos los accionistas (artículo 104 de la OBCA). Korporex prepara las resoluciones anuales de directores y accionistas que aprueban los estados financieros, eligen a los directores, nombran a los funcionarios y dispensan la auditoría o nombran a un auditor, listas para firmar y archivar en su libro de actas.",
      registry: "sociedad de Ontario",
      meetingRule:
        "El artículo 94 de la OBCA exige celebrar una asamblea anual de accionistas dentro de los 15 meses posteriores a la anterior. Las resoluciones escritas firmadas por todos los accionistas con derecho a voto (artículo 104 de la OBCA) cumplen este requisito sin necesidad de celebrar una asamblea.",
      auditRule:
        "Una sociedad de Ontario que no hace oferta pública (non-offering) puede dispensar la auditoría del ejercicio con el consentimiento escrito unánime de todos los accionistas, con o sin derecho a voto (artículo 148 de la OBCA).",
    },
  },
  federal: {
    en: {
      registry: "CBCA corporation",
      meetingRule:
        "CBCA s.133 requires an annual meeting of shareholders no later than 15 months after the last one and within 6 months of the financial year-end. Written resolutions signed by all voting shareholders (CBCA s.142) satisfy the requirement without holding a meeting.",
      auditRule:
        "A non-distributing CBCA corporation may dispense with the appointment of an auditor by unanimous resolution of all shareholders, voting and non-voting (CBCA s.163). The resolution is valid until the next annual meeting.",
    },
    fr: {
      h1: "Résolutions annuelles pour votre société fédérale",
      label: "Résolutions annuelles (fédérales)",
      description:
        "Les sociétés régies par la LCSA doivent convoquer une assemblée annuelle des actionnaires au plus tard 15 mois après la précédente et dans les 6 mois suivant la fin de l'exercice (article 133 de la LCSA), ou adopter à la place des résolutions écrites signées par tous les actionnaires (article 142 de la LCSA). Korporex prépare les résolutions annuelles des administrateurs et des actionnaires qui approuvent les états financiers, élisent les administrateurs, nomment les dirigeants et dispensent la société de la nomination d'un vérificateur ou en nomment un, prêtes à signer et à classer dans votre registre des procès-verbaux.",
      registry: "société régie par la LCSA",
      meetingRule:
        "L'article 133 de la LCSA exige la tenue d'une assemblée annuelle des actionnaires au plus tard 15 mois après la précédente et dans les 6 mois suivant la fin de l'exercice. Des résolutions écrites signées par tous les actionnaires habiles à voter (article 142 de la LCSA) satisfont à cette exigence sans qu'une assemblée soit tenue.",
      auditRule:
        "Une société régie par la LCSA n'ayant pas fait appel au public peut être dispensée de nommer un vérificateur par résolution unanime de tous les actionnaires, avec ou sans droit de vote (article 163 de la LCSA). La résolution est valide jusqu'à l'assemblée annuelle suivante.",
    },
    es: {
      h1: "Resoluciones anuales para su sociedad federal",
      label: "Resoluciones anuales (federal)",
      description:
        "Las sociedades regidas por la CBCA deben convocar una asamblea anual de accionistas a más tardar 15 meses después de la anterior y dentro de los 6 meses posteriores al cierre del ejercicio (artículo 133 de la CBCA), o aprobar en su lugar resoluciones escritas firmadas por todos los accionistas (artículo 142 de la CBCA). Korporex prepara las resoluciones anuales de directores y accionistas que aprueban los estados financieros, eligen a los directores, nombran a los funcionarios y dispensan el nombramiento de un auditor o lo nombran, listas para firmar y archivar en su libro de actas.",
      registry: "sociedad regida por la CBCA",
      meetingRule:
        "El artículo 133 de la CBCA exige celebrar una asamblea anual de accionistas a más tardar 15 meses después de la anterior y dentro de los 6 meses posteriores al cierre del ejercicio. Las resoluciones escritas firmadas por todos los accionistas con derecho a voto (artículo 142 de la CBCA) cumplen este requisito sin necesidad de celebrar una asamblea.",
      auditRule:
        "Una sociedad CBCA que no hace oferta pública (non-distributing) puede dispensar el nombramiento de un auditor mediante resolución unánime de todos los accionistas, con o sin derecho a voto (artículo 163 de la CBCA). La resolución es válida hasta la siguiente asamblea anual.",
    },
  },
};

const COPY = {
  en: {
    heroTail: " + applicable tax. Drafted and emailed to you within 2 business days.",
    steps: ["Corporation", "Resolutions", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntroPre: "The ",
    corpIntroPost: " the resolutions are for.",
    fye: "Financial year-end *",
    fyeHint: "The year-end the resolutions cover.",
    resDate: "Date of the resolutions *",
    resDateHint: "The date the resolutions will be signed.",
    lastMeeting: "Last annual meeting / resolutions",
    lastMeetingHint: "Optional. Leave blank if this is the corporation's first annual resolution.",
    resH2: "Annual Resolutions",
    resIntro:
      "What the resolutions need to record: the financial statements, the directors elected, the officers appointed, and how the audit requirement is handled.",
    fsStrong: "Financial statements for the year are prepared",
    fsPost: " and will be presented to the shareholders for approval.",
    fsNote: "Leave unchecked if they aren't ready yet. We'll follow up before dating the resolutions.",
    audit: "Audit",
    auditQ: "How is the audit requirement handled? *",
    auditDispense: "Dispense with the audit by unanimous shareholder consent",
    auditAuditor: "Appoint an auditor",
    auditAccountant: "Appoint an accountant (review / compilation)",
    auditorName: "Name of the auditor / accountant *",
    auditorNameHint: "Firm or individual name, as it should appear in the resolution.",
    directorsH: "Directors elected",
    directorsIntro: "The directors elected (or re-elected) for the coming year.",
    first: "First name *",
    last: "Last name *",
    removeDirector: "Remove director",
    addDirector: "Add another director",
    officersH: "Officers appointed",
    officersIntro: "Appointed by the directors' resolution for the coming year.",
    officer: "Officer",
    remove: "Remove",
    position: "Position *",
    addOfficer: "Add another officer",
    shareholdersH: "Shareholders",
    shareholdersIntro:
      "Everyone who will sign the shareholder resolution. A shareholder may be an individual or a corporation.",
    shareholder: "Shareholder",
    name: "Name *",
    type: "Type *",
    individual: "Individual",
    corporation: "Corporation",
    shareClass: "Share class",
    optional: "Optional.",
    shareClassPlaceholder: "Class A Common",
    addShareholder: "Add another shareholder",
    signPre: "I confirm that ",
    signStrong: "all shareholders entitled to vote",
    signPost: " will sign the written resolutions.",
    additional: "Anything else the resolutions should cover?",
    additionalHint: "Optional. E.g. approving a dividend, ratifying an act of the directors, changing the year-end.",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions.",
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
    heroTail: " + taxes applicables. Rédigées et envoyées par courriel dans un délai de 2 jours ouvrables.",
    steps: ["Société", "Résolutions", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntroPre: "La ",
    corpIntroPost: " visée par les résolutions.",
    fye: "Fin de l'exercice *",
    fyeHint: "La fin d'exercice visée par les résolutions.",
    resDate: "Date des résolutions *",
    resDateHint: "La date à laquelle les résolutions seront signées.",
    lastMeeting: "Dernière assemblée annuelle ou résolutions annuelles",
    lastMeetingHint: "Facultatif. Laissez vide s'il s'agit des premières résolutions annuelles de la société.",
    resH2: "Résolutions annuelles",
    resIntro:
      "Ce que les résolutions doivent consigner : les états financiers, les administrateurs élus, les dirigeants nommés et le traitement de l'exigence de vérification.",
    fsStrong: "Les états financiers de l'exercice sont préparés",
    fsPost: " et seront présentés aux actionnaires pour approbation.",
    fsNote: "Laissez la case décochée s'ils ne sont pas encore prêts. Nous ferons un suivi avant de dater les résolutions.",
    audit: "Vérification",
    auditQ: "Comment l'exigence de vérification est-elle traitée? *",
    auditDispense: "Dispense de vérification avec le consentement unanime des actionnaires",
    auditAuditor: "Nommer un vérificateur",
    auditAccountant: "Nommer un comptable (mission d'examen ou de compilation)",
    auditorName: "Nom du vérificateur ou du comptable *",
    auditorNameHint: "Nom du cabinet ou de la personne, tel qu'il doit figurer dans la résolution.",
    directorsH: "Administrateurs élus",
    directorsIntro: "Les administrateurs élus (ou réélus) pour l'année à venir.",
    first: "Prénom *",
    last: "Nom de famille *",
    removeDirector: "Retirer l'administrateur",
    addDirector: "Ajouter un autre administrateur",
    officersH: "Dirigeants nommés",
    officersIntro: "Nommés par résolution des administrateurs pour l'année à venir.",
    officer: "Dirigeant",
    remove: "Retirer",
    position: "Poste *",
    addOfficer: "Ajouter un autre dirigeant",
    shareholdersH: "Actionnaires",
    shareholdersIntro:
      "Toutes les personnes qui signeront la résolution des actionnaires. Un actionnaire peut être un particulier ou une société.",
    shareholder: "Actionnaire",
    name: "Nom *",
    type: "Type *",
    individual: "Particulier",
    corporation: "Société",
    shareClass: "Catégorie d'actions",
    optional: "Facultatif.",
    shareClassPlaceholder: "Actions ordinaires de catégorie A",
    addShareholder: "Ajouter un autre actionnaire",
    signPre: "Je confirme que ",
    signStrong: "tous les actionnaires habiles à voter",
    signPost: " signeront les résolutions écrites.",
    additional: "Les résolutions doivent-elles porter sur autre chose?",
    additionalHint:
      "Facultatif. p. ex. déclarer un dividende, ratifier un acte des administrateurs, changer la fin d'exercice.",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions.",
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
    heroTail: " + impuestos aplicables. Redactadas y enviadas por correo electrónico en un plazo de 2 días hábiles.",
    steps: ["Sociedad", "Resoluciones", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntroPre: "La ",
    corpIntroPost: " a la que corresponden las resoluciones.",
    fye: "Cierre del ejercicio fiscal *",
    fyeHint: "El cierre de ejercicio que cubren las resoluciones.",
    resDate: "Fecha de las resoluciones *",
    resDateHint: "La fecha en que se firmarán las resoluciones.",
    lastMeeting: "Última asamblea anual o resoluciones anuales",
    lastMeetingHint: "Opcional. Déjelo en blanco si son las primeras resoluciones anuales de la sociedad.",
    resH2: "Resoluciones anuales",
    resIntro:
      "Lo que deben recoger las resoluciones: los estados financieros, los directores elegidos, los funcionarios nombrados y cómo se atiende el requisito de auditoría.",
    fsStrong: "Los estados financieros del ejercicio están preparados",
    fsPost: " y se presentarán a los accionistas para su aprobación.",
    fsNote: "Deje la casilla sin marcar si aún no están listos. Le contactaremos antes de fechar las resoluciones.",
    audit: "Auditoría",
    auditQ: "¿Cómo se atiende el requisito de auditoría? *",
    auditDispense: "Dispensar la auditoría con el consentimiento unánime de los accionistas",
    auditAuditor: "Nombrar a un auditor",
    auditAccountant: "Nombrar a un contador (revisión o compilación)",
    auditorName: "Nombre del auditor o contador *",
    auditorNameHint: "Nombre de la firma o de la persona, tal como debe figurar en la resolución.",
    directorsH: "Directores elegidos",
    directorsIntro: "Los directores elegidos (o reelegidos) para el próximo año.",
    first: "Nombre *",
    last: "Apellido *",
    removeDirector: "Eliminar director",
    addDirector: "Agregar otro director",
    officersH: "Funcionarios nombrados",
    officersIntro: "Nombrados por resolución de los directores para el próximo año.",
    officer: "Funcionario",
    remove: "Eliminar",
    position: "Cargo *",
    addOfficer: "Agregar otro funcionario",
    shareholdersH: "Accionistas",
    shareholdersIntro:
      "Todas las personas que firmarán la resolución de accionistas. Un accionista puede ser una persona física o una sociedad.",
    shareholder: "Accionista",
    name: "Nombre *",
    type: "Tipo *",
    individual: "Persona física",
    corporation: "Sociedad",
    shareClass: "Clase de acciones",
    optional: "Opcional.",
    shareClassPlaceholder: "Acciones ordinarias clase A",
    addShareholder: "Agregar otro accionista",
    signPre: "Confirmo que ",
    signStrong: "todos los accionistas con derecho a voto",
    signPost: " firmarán las resoluciones escritas.",
    additional: "¿Algo más que deban cubrir las resoluciones?",
    additionalHint:
      "Opcional. P. ej., aprobar un dividendo, ratificar un acto de los directores, cambiar el cierre del ejercicio.",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas.",
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
  fr: {
    "At least one director is required": "Au moins un administrateur est requis",
    "At least one officer is required": "Au moins un dirigeant est requis",
    "At least one shareholder is required": "Au moins un actionnaire est requis",
    "Written resolutions must be signed by all voting shareholders":
      "Les résolutions écrites doivent être signées par tous les actionnaires habiles à voter",
    "Name of the auditor or accountant is required": "Le nom du vérificateur ou du comptable est requis",
    "Select how the audit requirement is handled": "Indiquez comment l'exigence de vérification est traitée",
  },
  es: {
    "At least one director is required": "Se requiere al menos un director",
    "At least one officer is required": "Se requiere al menos un funcionario",
    "At least one shareholder is required": "Se requiere al menos un accionista",
    "Written resolutions must be signed by all voting shareholders":
      "Las resoluciones escritas deben estar firmadas por todos los accionistas con derecho a voto",
    "Name of the auditor or accountant is required": "Se requiere el nombre del auditor o contador",
    "Select how the audit requirement is handled": "Indique cómo se atiende el requisito de auditoría",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

export default function AnnualResolutionWizard({ jurisdiction }: { jurisdiction: Jurisdiction }) {
  const slug = SLUGS[jurisdiction];
  const SERVICE = COMPLIANCE_SERVICES[slug];
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const jc = JURISDICTION_COPY[jurisdiction][lang];
  const h1 = jc.h1 ?? SERVICE.h1 ?? SERVICE.label;
  const label = jc.label ?? SERVICE.label;
  const description = jc.description ?? SERVICE.description;
  const err = (message: unknown) => localizeError(lang, message);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AnnualResolutionSubmission>({
    resolver: zodResolver(
      jurisdiction === "ontario" ? annualResolutionOntarioSchema : annualResolutionFederalSchema
    ),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction, corpName: "", corpNumber: "", businessNumber: "" },
      financialYearEnd: "",
      resolutionDate: "",
      lastAnnualMeetingDate: "",
      financialStatementsAvailable: true,
      auditorTreatment: "dispense",
      auditorName: "",
      directors: [{ firstName: "", lastName: "" }],
      officers: [{ firstName: "", lastName: "", position: "President" }],
      shareholders: [{ name: "", partyType: "individual", shareClass: "" }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allShareholdersWillSign: false as any,
      additionalMatters: "",
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
  const auditorTreatment = watch("auditorTreatment");

  const directors = useFieldArray({ control: form.control, name: "directors" });
  const officers = useFieldArray({ control: form.control, name: "officers" });
  const shareholders = useFieldArray({ control: form.control, name: "shareholders" });

  async function gotoStep(next: number) {
    const fields = STEP_FIELDS[step - 1];
    if (fields && step < 4) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: AnnualResolutionSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: slug, payload: data }),
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
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{h1}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price.toFixed(2)} CAD</span>{t.heroTail}
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
              <p className="text-gray-500 text-sm mb-8">{t.corpIntroPre}{jc.registry}{t.corpIntroPost}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction={jurisdiction} />
                <Field label={t.fye} error={errors.financialYearEnd?.message} hint={t.fyeHint}>
                  <input type="date" {...register("financialYearEnd")} className={iCls} />
                </Field>
                <Field label={t.resDate} error={errors.resolutionDate?.message} hint={t.resDateHint}>
                  <input type="date" {...register("resolutionDate")} className={iCls} />
                </Field>
                <Field label={t.lastMeeting} error={errors.lastAnnualMeetingDate?.message} hint={t.lastMeetingHint}>
                  <input type="date" {...register("lastAnnualMeetingDate")} className={iCls} />
                </Field>
                <div className="border border-gray-200 rounded-lg p-4 bg-cream-50/40 text-xs text-gray-600 leading-relaxed">
                  {jc.meetingRule}
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.resH2}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.resIntro}</p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div className="border border-gray-200 rounded-lg p-5">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("financialStatementsAvailable")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-800">
                      <strong>{t.fsStrong}</strong>{t.fsPost}{" "}
                      <span className="text-gray-500">{t.fsNote}</span>
                    </span>
                  </label>
                </div>

                <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.audit}</p>
                  <Field label={t.auditQ} error={err(errors.auditorTreatment?.message)}>
                    <select {...register("auditorTreatment")} className={sCls}>
                      <option value="dispense">{t.auditDispense}</option>
                      <option value="appoint_auditor">{t.auditAuditor}</option>
                      <option value="appoint_accountant">{t.auditAccountant}</option>
                    </select>
                  </Field>
                  {auditorTreatment !== "dispense" && (
                    <Field label={t.auditorName} error={err(errors.auditorName?.message)} hint={t.auditorNameHint}>
                      <input type="text" {...register("auditorName")} className={iCls} />
                    </Field>
                  )}
                  <p className="text-xs text-gray-500 leading-relaxed">{jc.auditRule}</p>
                </div>

                {/* Directors elected */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-1">{t.directorsH}</p>
                  <p className="text-xs text-gray-500 mb-4">{t.directorsIntro}</p>
                  <div className="space-y-3">
                    {directors.fields.map((field, idx) => (
                      <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start">
                        <Field label={idx === 0 ? t.first : ""} error={errors.directors?.[idx]?.firstName?.message}>
                          <input type="text" {...register(`directors.${idx}.firstName`)} className={iCls} />
                        </Field>
                        <Field label={idx === 0 ? t.last : ""} error={errors.directors?.[idx]?.lastName?.message}>
                          <input type="text" {...register(`directors.${idx}.lastName`)} className={iCls} />
                        </Field>
                        {directors.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => directors.remove(idx)}
                            className={`text-red-600 hover:text-red-700 p-2 ${idx === 0 ? "mt-6" : ""}`}
                            aria-label={t.removeDirector}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {typeof errors.directors?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.directors.message)}</p>
                  )}
                  {directors.fields.length < 20 && (
                    <button
                      type="button"
                      onClick={() => directors.append({ firstName: "", lastName: "" })}
                      className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-2.5 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> {t.addDirector}
                    </button>
                  )}
                </div>

                {/* Officers appointed */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-1">{t.officersH}</p>
                  <p className="text-xs text-gray-500 mb-4">{t.officersIntro}</p>
                  <div className="space-y-4">
                    {officers.fields.map((field, idx) => (
                      <div key={field.id} className="border border-gray-100 rounded-md p-4 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-gray-600">{t.officer} {idx + 1}</p>
                          {officers.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => officers.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> {t.remove}
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label={t.first} error={errors.officers?.[idx]?.firstName?.message}>
                            <input type="text" {...register(`officers.${idx}.firstName`)} className={iCls} />
                          </Field>
                          <Field label={t.last} error={errors.officers?.[idx]?.lastName?.message}>
                            <input type="text" {...register(`officers.${idx}.lastName`)} className={iCls} />
                          </Field>
                        </div>
                        <div className="mt-3">
                          <Field label={t.position} error={errors.officers?.[idx]?.position?.message}>
                            <select {...register(`officers.${idx}.position`)} className={sCls}>
                              {OFFICER_POSITIONS.map((p) => (
                                <option key={p} value={p}>{lang === "en" ? p : POSITION_LABELS[lang][p]}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                  {typeof errors.officers?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.officers.message)}</p>
                  )}
                  {officers.fields.length < 20 && (
                    <button
                      type="button"
                      onClick={() => officers.append({ firstName: "", lastName: "", position: "President" })}
                      className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-2.5 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> {t.addOfficer}
                    </button>
                  )}
                </div>

                {/* Shareholders signing */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-1">{t.shareholdersH}</p>
                  <p className="text-xs text-gray-500 mb-4">{t.shareholdersIntro}</p>
                  <div className="space-y-4">
                    {shareholders.fields.map((field, idx) => (
                      <div key={field.id} className="border border-gray-100 rounded-md p-4 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-gray-600">{t.shareholder} {idx + 1}</p>
                          {shareholders.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => shareholders.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> {t.remove}
                            </button>
                          )}
                        </div>
                        <Field label={t.name} error={errors.shareholders?.[idx]?.name?.message}>
                          <input type="text" {...register(`shareholders.${idx}.name`)} className={iCls} />
                        </Field>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <Field label={t.type} error={errors.shareholders?.[idx]?.partyType?.message}>
                            <select {...register(`shareholders.${idx}.partyType`)} className={sCls}>
                              <option value="individual">{t.individual}</option>
                              <option value="corporation">{t.corporation}</option>
                            </select>
                          </Field>
                          <Field
                            label={t.shareClass}
                            error={errors.shareholders?.[idx]?.shareClass?.message}
                            hint={t.optional}
                          >
                            <input type="text" {...register(`shareholders.${idx}.shareClass`)} className={iCls} placeholder={t.shareClassPlaceholder} />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                  {typeof errors.shareholders?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.shareholders.message)}</p>
                  )}
                  {shareholders.fields.length < 20 && (
                    <button
                      type="button"
                      onClick={() => shareholders.append({ name: "", partyType: "individual", shareClass: "" })}
                      className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-2.5 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> {t.addShareholder}
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("allShareholdersWillSign")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-800">
                      {t.signPre}<strong>{t.signStrong}</strong>{t.signPost} <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.allShareholdersWillSign?.message && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.allShareholdersWillSign.message)}</p>
                  )}
                </div>

                <Field label={t.additional} error={errors.additionalMatters?.message} hint={t.additionalHint}>
                  <textarea {...register("additionalMatters")} rows={3} className={`${iCls} resize-none`} />
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
                      <span className="text-gray-700">{label}</span>
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
