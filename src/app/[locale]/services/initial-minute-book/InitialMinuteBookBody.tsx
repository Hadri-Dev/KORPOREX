"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  initialMinuteBookSchema,
  type InitialMinuteBookSubmission,
} from "@/lib/businessUpdateSchemas";
import {
  BUSINESS_UPDATE_SERVICES,
  MINUTE_BOOK_PRICING,
  computeMinuteBookSubtotal,
} from "@/lib/businessUpdateServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { CurrentDirectorsArray, CurrentOfficersArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["initial-minute-book"];

type Lang = "en" | "fr" | "es";

const P = MINUTE_BOOK_PRICING;

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    longLabel: SERVICE.longLabel,
    description: SERVICE.description,
    heroTail:
      " + applicable tax. Includes 1 class of shares, 1 shareholder, 1 director, and 1 officer. Delivered within 3 to 5 business days.",
    heroAddons: `Each additional class of shares $${P.extraShareClass}; each additional shareholder, director, or officer $${P.extraShareholder} (+ applicable tax).`,
    englishOnly: "",
    steps: ["Corporation", "Shares", "Directors", "Officers", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro:
      "Tell us about the corporation the minute book is for. Copy the details from your Certificate and Articles of Incorporation.",
    incDate: "Date of incorporation *",
    incDateHint: "Shown on your Certificate of Incorporation.",
    registeredOffice: "Registered office address",
    sharesH2: "Share Structure",
    sharesIntro: `Enter each class of shares exactly as it appears in your Articles of Incorporation, then list who holds shares in each class. The first class and the first shareholder are included in the base price; each additional class adds $${P.extraShareClass} and each additional shareholder adds $${P.extraShareholder} (+ applicable tax).`,
    shareClassN: "Share class",
    remove: "Remove",
    className: "Class name *",
    classNameHint: "Pick the class as it appears in your Articles of Incorporation.",
    select: "Select…",
    otherClass: "Other (type the exact class name)",
    exactClassName: "Exact class name *",
    exactClassNameHint: 'As written in your Articles, e.g. "Class F Special Shares".',
    rights: "Rights and restrictions",
    rightsHint: "Optional. Voting, dividends, redemption. We transcribe the definitive text from your Articles.",
    addClass: `Add another share class ($${P.extraShareClass} + applicable tax)`,
    shareholderN: "Shareholder",
    first: "First name *",
    last: "Last name *",
    shareClass: "Share class *",
    shareClassHint: "Pick from the classes entered above.",
    numberOfShares: "Number of shares *",
    pricePerShare: "Price per share *",
    issueDate: "Issue date",
    issueDateHint: "Optional. When the shares were (or will be) issued. Defaults to the incorporation date.",
    address: "Address",
    addShareholder: `Add another shareholder ($${P.extraShareholder} + applicable tax)`,
    directorsH2: "Directors",
    directorsIntro: `The corporation's current directors, as they should appear in the register of directors. The first director is included in the base price; each additional director adds $${P.extraDirector} (+ applicable tax).`,
    officersH2: "Officers",
    officersIntro: `The corporation's current officers, as they should appear in the register of officers. A director can also be an officer; enter them in both steps. The first officer is included in the base price; each additional officer adds $${P.extraOfficer} (+ applicable tax).`,
    notes: "Notes",
    notesHint: "Optional. Anything else the drafter should know about the corporation.",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions about this order.",
    email: "Email *",
    phone: "Phone *",
    role: "Your role",
    roleHint: "Optional. E.g. director, shareholder, accountant.",
    billingH2: "Billing & Review",
    billingIntro: "Final step. We'll redirect you to Stripe to complete payment.",
    billingName: "Billing name *",
    billingNameHint: "Name on the credit/debit card.",
    billingAddress: "Billing address",
    summary: "Order summary",
    includes: "Includes 1 share class, 1 shareholder, 1 director, 1 officer",
    addonClasses: "Additional share classes",
    addonShareholders: "Additional shareholders",
    addonDirectors: "Additional directors",
    addonOfficers: "Additional officers",
    subtotal: "Subtotal",
    tax: "Tax",
    yourProvince: "your province",
    total: "Total (CAD)",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
    classLabels: {
      "Common Shares": "Common Shares",
      "Class A Common Shares": "Class A Common Shares",
      "Class B Common Shares (non-voting)": "Class B Common Shares (non-voting)",
      "Class C Preferred Shares": "Class C Preferred Shares",
      "Class D Special Shares": "Class D Special Shares",
      "Class E Redeemable Preferred Shares": "Class E Redeemable Preferred Shares",
    },
  },
  fr: {
    h1: "Obtenez un livre des procès-verbaux pour votre société",
    label: "Livre des procès-verbaux initial",
    longLabel: "Livre des procès-verbaux initial de la société",
    description:
      "La LCSA et la LSAO exigent que chaque société tienne des registres : règlements administratifs, résolutions d'organisation, certificats d'actions et registres des administrateurs, des dirigeants et des actionnaires. Si vous vous êtes constitué vous-même et n'avez jamais organisé la société, Korporex prépare un livre des procès-verbaux numérique complet, prêt à signer.",
    heroTail:
      " + taxes applicables. Comprend 1 catégorie d'actions, 1 actionnaire, 1 administrateur et 1 dirigeant. Livré dans un délai de 3 à 5 jours ouvrables.",
    heroAddons: `Chaque catégorie d'actions supplémentaire ${P.extraShareClass} $; chaque actionnaire, administrateur ou dirigeant supplémentaire ${P.extraShareholder} $ (+ taxes applicables).`,
    englishOnly: "Les documents du livre des procès-verbaux sont préparés en anglais.",
    steps: ["Société", "Actions", "Administrateurs", "Dirigeants", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro:
      "Parlez-nous de la société visée par le livre des procès-verbaux. Reprenez les renseignements de votre certificat et de vos statuts constitutifs.",
    incDate: "Date de constitution *",
    incDateHint: "Indiquée sur votre certificat de constitution.",
    registeredOffice: "Adresse du siège social",
    sharesH2: "Structure du capital",
    sharesIntro: `Inscrivez chaque catégorie d'actions exactement comme elle figure dans vos statuts constitutifs, puis indiquez qui détient des actions de chaque catégorie. La première catégorie et le premier actionnaire sont compris dans le prix de base; chaque catégorie supplémentaire ajoute ${P.extraShareClass} $ et chaque actionnaire supplémentaire ajoute ${P.extraShareholder} $ (+ taxes applicables).`,
    shareClassN: "Catégorie d'actions",
    remove: "Retirer",
    className: "Nom de la catégorie *",
    classNameHint: "Choisissez la catégorie telle qu'elle figure dans vos statuts constitutifs.",
    select: "Sélectionner…",
    otherClass: "Autre (inscrivez le nom exact de la catégorie)",
    exactClassName: "Nom exact de la catégorie *",
    exactClassNameHint:
      "Tel qu'il est rédigé dans vos statuts, p. ex. « Class F Special Shares ».",
    rights: "Droits et restrictions",
    rightsHint:
      "Facultatif. Droit de vote, dividendes, rachat. Nous transcrivons le texte définitif à partir de vos statuts.",
    addClass: `Ajouter une catégorie d'actions (${P.extraShareClass} $ + taxes applicables)`,
    shareholderN: "Actionnaire",
    first: "Prénom *",
    last: "Nom de famille *",
    shareClass: "Catégorie d'actions *",
    shareClassHint: "Choisissez parmi les catégories inscrites ci-dessus.",
    numberOfShares: "Nombre d'actions *",
    pricePerShare: "Prix par action *",
    issueDate: "Date d'émission",
    issueDateHint:
      "Facultatif. La date à laquelle les actions ont été (ou seront) émises. Par défaut, la date de constitution.",
    address: "Adresse",
    addShareholder: `Ajouter un actionnaire (${P.extraShareholder} $ + taxes applicables)`,
    directorsH2: "Administrateurs",
    directorsIntro: `Les administrateurs actuels de la société, tels qu'ils doivent figurer au registre des administrateurs. Le premier administrateur est compris dans le prix de base; chaque administrateur supplémentaire ajoute ${P.extraDirector} $ (+ taxes applicables).`,
    officersH2: "Dirigeants",
    officersIntro: `Les dirigeants actuels de la société, tels qu'ils doivent figurer au registre des dirigeants. Un administrateur peut aussi être un dirigeant; inscrivez-le alors aux deux étapes. Le premier dirigeant est compris dans le prix de base; chaque dirigeant supplémentaire ajoute ${P.extraOfficer} $ (+ taxes applicables).`,
    notes: "Remarques",
    notesHint: "Facultatif. Tout autre renseignement utile au rédacteur au sujet de la société.",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions sur cette commande.",
    email: "Courriel *",
    phone: "Téléphone *",
    role: "Votre rôle",
    roleHint: "Facultatif. p. ex. administrateur, actionnaire, comptable.",
    billingH2: "Facturation et vérification",
    billingIntro: "Dernière étape. Nous vous redirigerons vers Stripe pour effectuer le paiement.",
    billingName: "Nom de facturation *",
    billingNameHint: "Nom figurant sur la carte de crédit ou de débit.",
    billingAddress: "Adresse de facturation",
    summary: "Résumé de la commande",
    includes: "Comprend 1 catégorie d'actions, 1 actionnaire, 1 administrateur, 1 dirigeant",
    addonClasses: "Catégories d'actions supplémentaires",
    addonShareholders: "Actionnaires supplémentaires",
    addonDirectors: "Administrateurs supplémentaires",
    addonOfficers: "Dirigeants supplémentaires",
    subtotal: "Sous-total",
    tax: "Taxe",
    yourProvince: "votre province",
    total: "Total (CAD)",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe:
      "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
    classLabels: {
      "Common Shares": "Actions ordinaires (Common Shares)",
      "Class A Common Shares": "Actions ordinaires de catégorie A (Class A Common Shares)",
      "Class B Common Shares (non-voting)": "Actions ordinaires de catégorie B sans droit de vote (Class B Common Shares)",
      "Class C Preferred Shares": "Actions privilégiées de catégorie C (Class C Preferred Shares)",
      "Class D Special Shares": "Actions spéciales de catégorie D (Class D Special Shares)",
      "Class E Redeemable Preferred Shares":
        "Actions privilégiées rachetables de catégorie E (Class E Redeemable Preferred Shares)",
    },
  },
  es: {
    h1: "Obtenga un libro de actas para su sociedad",
    label: "Libro de actas inicial",
    longLabel: "Libro de actas inicial de la sociedad",
    description:
      "Tanto la CBCA como la OBCA exigen que toda sociedad conserve registros corporativos: estatutos internos, resoluciones de organización, certificados de acciones y los registros de directores, funcionarios y accionistas. Si usted se constituyó por su cuenta y nunca organizó la sociedad, Korporex prepara un libro de actas digital completo, listo para firmar.",
    heroTail:
      " + impuestos aplicables. Incluye 1 clase de acciones, 1 accionista, 1 director y 1 funcionario. Entrega en un plazo de 3 a 5 días hábiles.",
    heroAddons: `Cada clase de acciones adicional $${P.extraShareClass}; cada accionista, director o funcionario adicional $${P.extraShareholder} (+ impuestos aplicables).`,
    englishOnly: "Los documentos del libro de actas se preparan en inglés.",
    steps: ["Sociedad", "Acciones", "Directores", "Funcionarios", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro:
      "Cuéntenos sobre la sociedad para la que se prepara el libro de actas. Copie los datos de su certificado y sus estatutos de constitución (Articles of Incorporation).",
    incDate: "Fecha de constitución *",
    incDateHint: "Figura en su certificado de constitución.",
    registeredOffice: "Domicilio social",
    sharesH2: "Estructura accionaria",
    sharesIntro: `Ingrese cada clase de acciones exactamente como aparece en sus estatutos de constitución y luego indique quién posee acciones de cada clase. La primera clase y el primer accionista están incluidos en el precio base; cada clase adicional suma $${P.extraShareClass} y cada accionista adicional suma $${P.extraShareholder} (+ impuestos aplicables).`,
    shareClassN: "Clase de acciones",
    remove: "Eliminar",
    className: "Nombre de la clase *",
    classNameHint: "Elija la clase tal como aparece en sus estatutos de constitución.",
    select: "Seleccione…",
    otherClass: "Otra (escriba el nombre exacto de la clase)",
    exactClassName: "Nombre exacto de la clase *",
    exactClassNameHint:
      "Tal como figura en sus estatutos, p. ej. \"Class F Special Shares\".",
    rights: "Derechos y restricciones",
    rightsHint:
      "Opcional. Voto, dividendos, rescate. Transcribimos el texto definitivo a partir de sus estatutos.",
    addClass: `Agregar otra clase de acciones ($${P.extraShareClass} + impuestos aplicables)`,
    shareholderN: "Accionista",
    first: "Nombre *",
    last: "Apellido *",
    shareClass: "Clase de acciones *",
    shareClassHint: "Elija entre las clases ingresadas arriba.",
    numberOfShares: "Número de acciones *",
    pricePerShare: "Precio por acción *",
    issueDate: "Fecha de emisión",
    issueDateHint:
      "Opcional. Cuándo se emitieron (o se emitirán) las acciones. Por defecto, la fecha de constitución.",
    address: "Dirección",
    addShareholder: `Agregar otro accionista ($${P.extraShareholder} + impuestos aplicables)`,
    directorsH2: "Directores",
    directorsIntro: `Los directores actuales de la sociedad, tal como deben figurar en el registro de directores. El primer director está incluido en el precio base; cada director adicional suma $${P.extraDirector} (+ impuestos aplicables).`,
    officersH2: "Funcionarios",
    officersIntro: `Los funcionarios actuales de la sociedad, tal como deben figurar en el registro de funcionarios. Un director también puede ser funcionario; en ese caso, ingréselo en ambos pasos. El primer funcionario está incluido en el precio base; cada funcionario adicional suma $${P.extraOfficer} (+ impuestos aplicables).`,
    notes: "Notas",
    notesHint: "Opcional. Cualquier otra información sobre la sociedad que deba conocer quien redacta los documentos.",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas sobre este pedido.",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    role: "Su función",
    roleHint: "Opcional. P. ej., director, accionista, contador.",
    billingH2: "Facturación y revisión",
    billingIntro: "Último paso. Lo redirigiremos a Stripe para completar el pago.",
    billingName: "Nombre de facturación *",
    billingNameHint: "Nombre que figura en la tarjeta de crédito o débito.",
    billingAddress: "Dirección de facturación",
    summary: "Resumen del pedido",
    includes: "Incluye 1 clase de acciones, 1 accionista, 1 director, 1 funcionario",
    addonClasses: "Clases de acciones adicionales",
    addonShareholders: "Accionistas adicionales",
    addonDirectors: "Directores adicionales",
    addonOfficers: "Funcionarios adicionales",
    subtotal: "Subtotal",
    tax: "Impuesto",
    yourProvince: "su provincia",
    total: "Total (CAD)",
    submitting: "Redirigiendo a Stripe…",
    submit: "Continuar al pago",
    stripe:
      "El pago se procesa de forma segura a través de Stripe. Los datos de su tarjeta nunca pasan por nuestro servidor.",
    failed: "No se pudo enviar la solicitud.",
    classLabels: {
      "Common Shares": "Acciones ordinarias (Common Shares)",
      "Class A Common Shares": "Acciones ordinarias clase A (Class A Common Shares)",
      "Class B Common Shares (non-voting)": "Acciones ordinarias clase B sin derecho a voto (Class B Common Shares)",
      "Class C Preferred Shares": "Acciones preferentes clase C (Class C Preferred Shares)",
      "Class D Special Shares": "Acciones especiales clase D (Class D Special Shares)",
      "Class E Redeemable Preferred Shares":
        "Acciones preferentes rescatables clase E (Class E Redeemable Preferred Shares)",
    },
  },
} as const;

type Copy = (typeof COPY)[Lang];

// Schema messages for the fields specific to this wizard, translated for
// display only. The schema itself is unchanged; unknown messages pass through.
const ERROR_TEXT: Record<Exclude<Lang, "en">, Record<string, string>> = {
  fr: {
    "Select a share class": "Sélectionnez une catégorie d'actions",
    "Enter a whole number of shares": "Inscrivez un nombre entier d'actions",
    "Enter a positive amount": "Inscrivez un montant positif",
    "Each class name must be unique": "Chaque nom de catégorie doit être unique",
    "Must match one of the share classes entered above":
      "Doit correspondre à l'une des catégories d'actions inscrites ci-dessus",
    "At least one class of shares is required": "Au moins une catégorie d'actions est requise",
    "At least one shareholder is required": "Au moins un actionnaire est requis",
    "At least one director is required": "Au moins un administrateur est requis",
    "At least one officer is required": "Au moins un dirigeant est requis",
  },
  es: {
    "Select a share class": "Seleccione una clase de acciones",
    "Enter a whole number of shares": "Ingrese un número entero de acciones",
    "Enter a positive amount": "Ingrese un monto positivo",
    "Each class name must be unique": "Cada nombre de clase debe ser único",
    "Must match one of the share classes entered above":
      "Debe coincidir con una de las clases de acciones ingresadas arriba",
    "At least one class of shares is required": "Se requiere al menos una clase de acciones",
    "At least one shareholder is required": "Se requiere al menos un accionista",
    "At least one director is required": "Se requiere al menos un director",
    "At least one officer is required": "Se requiere al menos un funcionario",
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
  ["corporation", "incorporationDate", "registeredOffice"],
  ["shareClasses", "shareholders"],
  ["directors"],
  ["officers", "notes"],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

// Standard class names customers can pick from. Labels mirror the incorporation
// wizard's SHARE_CLASS_OPTIONS so both flows describe the same structures; the
// Other option keeps arbitrary Articles wording possible. The stored value is
// always the English class name; only the displayed label is localized.
const SHARE_CLASS_NAME_OPTIONS = [
  "Common Shares",
  "Class A Common Shares",
  "Class B Common Shares (non-voting)",
  "Class C Preferred Shares",
  "Class D Special Shares",
  "Class E Redeemable Preferred Shares",
] as const;
const OTHER_CLASS = "__other__";

function classLabel(t: Copy, name: string): string {
  return (t.classLabels as Record<string, string>)[name] ?? name;
}

function isStandardClass(v: string): boolean {
  return (SHARE_CLASS_NAME_OPTIONS as readonly string[]).includes(v);
}

function ShareClassNameField({ idx, error }: { idx: number; error?: string }) {
  const lang = useLang();
  const t = COPY[lang];
  const { register, setValue, watch } = useFormContext<InitialMinuteBookSubmission>();
  const value = watch(`shareClasses.${idx}.className`) ?? "";
  const [custom, setCustom] = useState(() => value !== "" && !isStandardClass(value));
  const selectValue = custom ? OTHER_CLASS : isStandardClass(value) ? value : "";
  return (
    <div className="space-y-4">
      <Field
        label={t.className}
        error={custom ? undefined : error}
        hint={custom ? undefined : t.classNameHint}
      >
        <select
          value={selectValue}
          onChange={(e) => {
            if (e.target.value === OTHER_CLASS) {
              setCustom(true);
              setValue(`shareClasses.${idx}.className`, "", { shouldValidate: false });
            } else {
              setCustom(false);
              setValue(`shareClasses.${idx}.className`, e.target.value, { shouldValidate: true });
            }
          }}
          className={sCls}
        >
          <option value="">{t.select}</option>
          {SHARE_CLASS_NAME_OPTIONS.map((n) => (
            <option key={n} value={n}>{classLabel(t, n)}</option>
          ))}
          <option value={OTHER_CLASS}>{t.otherClass}</option>
        </select>
      </Field>
      {custom && (
        <Field label={t.exactClassName} error={error} hint={t.exactClassNameHint}>
          <input
            type="text"
            {...register(`shareClasses.${idx}.className`)}
            className={iCls}
            placeholder="Class F Special Shares"
          />
        </Field>
      )}
    </div>
  );
}

const emptyShareClass: InitialMinuteBookSubmission["shareClasses"][number] = {
  className: "",
  rightsNotes: "",
};

const emptyShareholder: InitialMinuteBookSubmission["shareholders"][number] = {
  firstName: "",
  lastName: "",
  shareClass: "",
  numberOfShares: "100",
  pricePerShare: "1.00",
  issueDate: "",
  address: { ...emptyAddress },
};

export default function InitialMinuteBookPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const lang = useLang();
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<InitialMinuteBookSubmission>({
    resolver: zodResolver(initialMinuteBookSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      incorporationDate: "",
      registeredOffice: { ...emptyAddress },
      shareClasses: [{ ...emptyShareClass }],
      shareholders: [{ ...emptyShareholder }],
      directors: [
        { firstName: "", lastName: "", email: "", canadianResident: false, electedDate: "", address: { ...emptyAddress } },
      ],
      officers: [
        { firstName: "", lastName: "", position: "President", email: "", appointedDate: "", address: { ...emptyAddress } },
      ],
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
  const classFA = useFieldArray({ control, name: "shareClasses" });
  const holderFA = useFieldArray({ control, name: "shareholders" });
  const jurisdiction = watch("corporation.jurisdiction");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof InitialMinuteBookSubmission | string>> = {
      1: ["corporation", "incorporationDate", "registeredOffice"],
      2: ["shareClasses", "shareholders"],
      3: ["directors"],
      4: ["officers", "notes"],
      5: ["contact"],
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

  async function onFinalSubmit(data: InitialMinuteBookSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "initial-minute-book", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? t.failed);
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.failed);
      setSubmitting(false);
    }
  }

  const classNames = (watch("shareClasses") ?? [])
    .map((c) => c.className.trim())
    .filter(Boolean);

  const counts = {
    shareClasses: (watch("shareClasses") ?? []).length || 1,
    shareholders: (watch("shareholders") ?? []).length || 1,
    directors: (watch("directors") ?? []).length || 1,
    officers: (watch("officers") ?? []).length || 1,
  };
  const subtotal = computeMinuteBookSubtotal(counts);
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const addonLine = (label: string, count: number, unit: number) => {
    const extra = Math.max(0, count - 1);
    if (extra === 0) return null;
    return (
      <div key={label} className="flex justify-between">
        <span className="text-gray-700">
          {label} × {extra}
        </span>
        <span className="text-gray-900">${(extra * unit).toFixed(2)}</span>
      </div>
    );
  };
  const addonLines = [
    addonLine(t.addonClasses, counts.shareClasses, MINUTE_BOOK_PRICING.extraShareClass),
    addonLine(t.addonShareholders, counts.shareholders, MINUTE_BOOK_PRICING.extraShareholder),
    addonLine(t.addonDirectors, counts.directors, MINUTE_BOOK_PRICING.extraDirector),
    addonLine(t.addonOfficers, counts.officers, MINUTE_BOOK_PRICING.extraOfficer),
  ].filter(Boolean);

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{t.h1}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span>{t.heroTail}
          </p>
          <p className="mt-1 text-xs text-gray-500">{t.heroAddons}</p>
          {t.englishOnly && <p className="mt-1 text-xs text-gray-500">{t.englishOnly}</p>}
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
                <Field label={t.incDate} error={errors.incorporationDate?.message} hint={t.incDateHint}>
                  <input type="date" {...register("incorporationDate")} className={iCls} />
                </Field>
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

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.sharesH2}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.sharesIntro}</p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-6">
                <div className="space-y-4">
                  {classFA.fields.map((field, idx) => {
                    const e = errors.shareClasses?.[idx];
                    return (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">
                            {t.shareClassN} {idx + 1}
                          </p>
                          {classFA.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => classFA.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> {t.remove}
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <ShareClassNameField idx={idx} error={err(e?.className?.message)} />
                          <Field label={t.rights} error={e?.rightsNotes?.message} hint={t.rightsHint}>
                            <textarea {...register(`shareClasses.${idx}.rightsNotes`)} rows={2} className={`${iCls} resize-none`} />
                          </Field>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {classFA.fields.length < 10 && (
                  <button
                    type="button"
                    onClick={() => classFA.append({ ...emptyShareClass })}
                    className="w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={14} /> {t.addClass}
                  </button>
                )}
                {typeof errors.shareClasses?.message === "string" && (
                  <p className="text-xs text-red-500">{err(errors.shareClasses.message)}</p>
                )}

                <div className="space-y-4">
                  {holderFA.fields.map((field, idx) => {
                    const e = errors.shareholders?.[idx];
                    return (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">
                            {t.shareholderN} {idx + 1}
                          </p>
                          {holderFA.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => holderFA.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> {t.remove}
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <Field label={t.first} error={e?.firstName?.message}>
                              <input type="text" {...register(`shareholders.${idx}.firstName`)} className={iCls} />
                            </Field>
                            <Field label={t.last} error={e?.lastName?.message}>
                              <input type="text" {...register(`shareholders.${idx}.lastName`)} className={iCls} />
                            </Field>
                          </div>
                          <Field label={t.shareClass} error={err(e?.shareClass?.message)} hint={t.shareClassHint}>
                            <select {...register(`shareholders.${idx}.shareClass`)} className={sCls}>
                              <option value="">{t.select}</option>
                              {classNames.map((n) => (
                                <option key={n} value={n}>{classLabel(t, n)}</option>
                              ))}
                            </select>
                          </Field>
                          <div className="grid grid-cols-2 gap-3">
                            <Field label={t.numberOfShares} error={err(e?.numberOfShares?.message)}>
                              <input type="number" min={1} {...register(`shareholders.${idx}.numberOfShares`)} className={iCls} />
                            </Field>
                            <Field label={t.pricePerShare} error={err(e?.pricePerShare?.message)}>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                                <input
                                  type="number"
                                  min={0.01}
                                  step={0.01}
                                  {...register(`shareholders.${idx}.pricePerShare`)}
                                  className={`${iCls} pl-8`}
                                />
                              </div>
                            </Field>
                          </div>
                          <Field label={t.issueDate} error={e?.issueDate?.message} hint={t.issueDateHint}>
                            <input type="date" {...register(`shareholders.${idx}.issueDate`)} className={iCls} />
                          </Field>
                          <div>
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                              {t.address} <span className="text-red-500">*</span>
                            </p>
                            <AddressFields name={`shareholders.${idx}.address`} errors={e?.address} canadaOnly={false} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {holderFA.fields.length < 20 && (
                  <button
                    type="button"
                    onClick={() => holderFA.append({ ...emptyShareholder })}
                    className="w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={14} /> {t.addShareholder}
                  </button>
                )}
                {typeof errors.shareholders?.message === "string" && (
                  <p className="text-xs text-red-500">{err(errors.shareholders.message)}</p>
                )}

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.directorsH2}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.directorsIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-6">
                <CurrentDirectorsArray
                  name="directors"
                  showCanadianResident={jurisdiction === "federal"}
                  topError={typeof errors.directors?.message === "string" ? err(errors.directors.message) : undefined}
                  errors={errors.directors}
                />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.officersH2}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.officersIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(5); }} className="space-y-6">
                <CurrentOfficersArray
                  name="officers"
                  topError={typeof errors.officers?.message === "string" ? err(errors.officers.message) : undefined}
                  errors={errors.officers}
                />
                <Field label={t.notes} error={errors.notes?.message} hint={t.notesHint}>
                  <textarea {...register("notes")} rows={3} maxLength={2000} className={`${iCls} resize-none`} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 5 && (
            <div>
              <BackBtn onClick={() => setStep(4)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.contactH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.contactIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(6); }} className="space-y-5">
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
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
                </Field>
                <Field label={t.role} error={errors.contact?.contactRole?.message} hint={t.roleHint}>
                  <input type="text" {...register("contact.contactRole")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 6 && (
            <div>
              <BackBtn onClick={() => setStep(5)} />
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
                      <span className="text-gray-700">{t.longLabel}</span>
                      <span className="text-gray-900">${SERVICE.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500">{t.includes}</p>
                    {addonLines}
                    {addonLines.length > 0 && (
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-gray-700">
                        <span>{t.subtotal}</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    )}
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
                <p className="text-xs text-gray-500 text-center mt-2">{t.stripe}</p>
              </form>
            </div>
          )}
        </div>
      </section>
    </FormProvider>
  );
}
