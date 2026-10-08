"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  noticeOfChangeSchema,
  type NoticeOfChangeSubmission,
  type NoticeChangeType,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { getTaxRate } from "@/lib/pricing";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { POSITION_LABELS } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = COMPLIANCE_SERVICES["notice-of-change"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax. Filed within 2 business days.",
    whenStrong: "When to use this form:",
    whenPre:
      " file multiple corporate changes at once (e.g. a new director + an officer resignation + an address change) in a single bundle. For a single change, the dedicated services are cheaper: ",
    changeDirector: "Change of Director / Officer",
    or: " or ",
    changeAddress: "Corporation Address Change",
    steps: ["Corporation", "Changes", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "Tell us which corporation the notice is for.",
    changesH2: "What's Changing",
    federalIntro:
      "Federal corporations bundle changes via the appropriate CBCA forms (Form 3 for the registered office, Form 6 for directors).",
    ontarioIntro:
      "Ontario corporations file a Notice of Change under the Corporations Information Act covering all the items below.",
    deadlinePre: " Notice must be filed within ",
    deadlineDays: "15 days",
    deadlinePost: " of the change.",
    selectChanging: "Select what's changing",
    choices: {
      registered_office: {
        label: "Registered office address",
        description: "Move the corporation's official registered office.",
      },
      mailing_address: {
        label: "Mailing address (Ontario)",
        description: "Update the mailing address separately from the registered office. Ontario corporations only.",
      },
      directors_officers: {
        label: "Directors / officers",
        description: "Add, remove, or update any number of directors or officers in one filing.",
      },
    },
    federalMailingNote: " Federal corporations use a single combined registered-office address.",
    newOffice: "New registered office",
    officeProvinceNote:
      "Must be in the same province as the one stated in your Articles. Moving the office to a different province requires Articles of Amendment instead.",
    newMailing: "New mailing address",
    docH: "Director / officer changes",
    change: "Change",
    remove: "Remove",
    changeKind: "Type of change *",
    kindAdd: "Add (new appointment)",
    kindRemove: "Remove (resignation / ceasing)",
    kindUpdate: "Update (existing person)",
    role: "Role *",
    roleDirector: "Director",
    roleOfficer: "Officer",
    roleBoth: "Director and Officer",
    officerPosition: "Officer position *",
    select: "Select…",
    first: "First name *",
    last: "Last name *",
    emailOptional: "Email",
    residential: "Residential address",
    residentPre: "This person is a ",
    residentStrong: "Canadian resident",
    residentPost: " within the meaning of CBCA s.2(1).",
    residentNote: "At least 25% of a federal corporation's directors must be Canadian residents.",
    effective: "Effective date *",
    notes: "Notes",
    addChange: "Add another change",
    filingEffective: "Filing effective date *",
    filingEffectiveHint:
      "The overall effective date for the bundled changes. Individual director changes also have their own effective date above.",
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
    h1: "Déposez un avis de modification pour votre société",
    label: "Avis de modification",
    description:
      "Déposez un avis de modification combiné auprès du registre approprié lorsque vous avez plusieurs mises à jour à déclarer en même temps (p. ex. un changement d'administrateur, la nomination d'un dirigeant et une nouvelle adresse postale). C'est moins cher que de déposer chaque modification séparément.",
    heroTail: " + taxes applicables. Déposé dans un délai de 2 jours ouvrables.",
    whenStrong: "Quand utiliser ce formulaire :",
    whenPre:
      " pour déposer plusieurs modifications en une seule fois (p. ex. un nouvel administrateur, la démission d'un dirigeant et un changement d'adresse). Pour une seule modification, les services dédiés coûtent moins cher : ",
    changeDirector: "Changement d'administrateur ou de dirigeant",
    or: " ou ",
    changeAddress: "Changement d'adresse de la société",
    steps: ["Société", "Modifications", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "Indiquez-nous la société visée par l'avis.",
    changesH2: "Ce qui change",
    federalIntro:
      "Les sociétés fédérales regroupent les modifications au moyen des formulaires de la LCSA appropriés (formulaire 3 pour le siège social, formulaire 6 pour les administrateurs).",
    ontarioIntro:
      "Les sociétés de l'Ontario déposent un avis de modification en vertu de la Loi sur les renseignements exigés des personnes morales, qui couvre tous les éléments ci-dessous.",
    deadlinePre: " L'avis doit être déposé dans les ",
    deadlineDays: "15 jours",
    deadlinePost: " suivant la modification.",
    selectChanging: "Sélectionnez ce qui change",
    choices: {
      registered_office: {
        label: "Adresse du siège social",
        description: "Déménager le siège social officiel de la société.",
      },
      mailing_address: {
        label: "Adresse postale (Ontario)",
        description: "Mettre à jour l'adresse postale indépendamment du siège social. Sociétés de l'Ontario seulement.",
      },
      directors_officers: {
        label: "Administrateurs et dirigeants",
        description: "Ajouter, retirer ou mettre à jour autant d'administrateurs ou de dirigeants que nécessaire en un seul dépôt.",
      },
    },
    federalMailingNote: " Les sociétés fédérales utilisent une seule adresse, celle du siège social.",
    newOffice: "Nouveau siège social",
    officeProvinceNote:
      "Le siège social doit demeurer dans la province indiquée dans vos statuts. Pour le déplacer dans une autre province, il faut plutôt déposer des clauses modificatrices.",
    newMailing: "Nouvelle adresse postale",
    docH: "Modifications des administrateurs et dirigeants",
    change: "Modification",
    remove: "Retirer",
    changeKind: "Type de modification *",
    kindAdd: "Ajout (nouvelle nomination)",
    kindRemove: "Retrait (démission ou fin de mandat)",
    kindUpdate: "Mise à jour (personne existante)",
    role: "Rôle *",
    roleDirector: "Administrateur",
    roleOfficer: "Dirigeant",
    roleBoth: "Administrateur et dirigeant",
    officerPosition: "Poste de dirigeant *",
    select: "Sélectionner…",
    first: "Prénom *",
    last: "Nom de famille *",
    emailOptional: "Courriel",
    residential: "Adresse résidentielle",
    residentPre: "Cette personne est un ",
    residentStrong: "résident canadien",
    residentPost: " au sens du paragraphe 2(1) de la LCSA.",
    residentNote: "Au moins 25 % des administrateurs d'une société fédérale doivent être des résidents canadiens.",
    effective: "Date d'entrée en vigueur *",
    notes: "Remarques",
    addChange: "Ajouter une autre modification",
    filingEffective: "Date d'entrée en vigueur du dépôt *",
    filingEffectiveHint:
      "La date d'entrée en vigueur globale des modifications regroupées. Chaque modification d'administrateur a aussi sa propre date ci-dessus.",
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
    h1: "Presente un aviso de cambio para su sociedad",
    label: "Aviso de cambio",
    description:
      "Presente un aviso de cambio combinado ante el registro correspondiente cuando tenga varias actualizaciones que declarar a la vez (p. ej., un cambio de director, el nombramiento de un funcionario y una nueva dirección postal). Cuesta menos que presentar cada cambio por separado.",
    heroTail: " + impuestos aplicables. Presentado en un plazo de 2 días hábiles.",
    whenStrong: "Cuándo usar este formulario:",
    whenPre:
      " para presentar varios cambios a la vez (p. ej., un nuevo director, la renuncia de un funcionario y un cambio de dirección) en un solo trámite. Para un único cambio, los servicios específicos cuestan menos: ",
    changeDirector: "Cambio de director o funcionario",
    or: " o ",
    changeAddress: "Cambio de dirección de la sociedad",
    steps: ["Sociedad", "Cambios", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "Indíquenos a qué sociedad corresponde el aviso.",
    changesH2: "Qué cambia",
    federalIntro:
      "Las sociedades federales agrupan los cambios mediante los formularios de la CBCA correspondientes (Formulario 3 para el domicilio social, Formulario 6 para los directores).",
    ontarioIntro:
      "Las sociedades de Ontario presentan un aviso de cambio (Notice of Change) en virtud de la Ley de Información de Sociedades (Corporations Information Act) que abarca todos los elementos siguientes.",
    deadlinePre: " El aviso debe presentarse dentro de los ",
    deadlineDays: "15 días",
    deadlinePost: " posteriores al cambio.",
    selectChanging: "Seleccione qué cambia",
    choices: {
      registered_office: {
        label: "Domicilio social",
        description: "Trasladar el domicilio social oficial de la sociedad.",
      },
      mailing_address: {
        label: "Dirección postal (Ontario)",
        description: "Actualizar la dirección postal por separado del domicilio social. Solo sociedades de Ontario.",
      },
      directors_officers: {
        label: "Directores y funcionarios",
        description: "Agregar, retirar o actualizar cualquier número de directores o funcionarios en una sola presentación.",
      },
    },
    federalMailingNote: " Las sociedades federales usan una única dirección, la del domicilio social.",
    newOffice: "Nuevo domicilio social",
    officeProvinceNote:
      "Debe estar en la misma provincia indicada en sus estatutos (Articles). Para trasladar el domicilio a otra provincia se requieren estatutos modificatorios (Articles of Amendment).",
    newMailing: "Nueva dirección postal",
    docH: "Cambios de directores y funcionarios",
    change: "Cambio",
    remove: "Eliminar",
    changeKind: "Tipo de cambio *",
    kindAdd: "Alta (nuevo nombramiento)",
    kindRemove: "Baja (renuncia o cese)",
    kindUpdate: "Actualización (persona existente)",
    role: "Función *",
    roleDirector: "Director",
    roleOfficer: "Funcionario",
    roleBoth: "Director y funcionario",
    officerPosition: "Cargo del funcionario *",
    select: "Seleccionar…",
    first: "Nombre *",
    last: "Apellido *",
    emailOptional: "Correo electrónico",
    residential: "Dirección residencial",
    residentPre: "Esta persona es ",
    residentStrong: "residente canadiense",
    residentPost: " en el sentido del artículo 2(1) de la CBCA.",
    residentNote: "Al menos el 25 % de los directores de una sociedad federal deben ser residentes canadienses.",
    effective: "Fecha de entrada en vigor *",
    notes: "Notas",
    addChange: "Agregar otro cambio",
    filingEffective: "Fecha de entrada en vigor de la presentación *",
    filingEffectiveHint:
      "La fecha de entrada en vigor general de los cambios agrupados. Cada cambio de director también tiene su propia fecha arriba.",
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
    "Select at least one change": "Sélectionnez au moins une modification",
    "Select at least one change type": "Sélectionnez au moins un type de modification",
    "Add at least one director or officer change": "Ajoutez au moins une modification d'administrateur ou de dirigeant",
    "Required for officers": "Obligatoire pour les dirigeants",
  },
  es: {
    "Select at least one change": "Seleccione al menos un cambio",
    "Select at least one change type": "Seleccione al menos un tipo de cambio",
    "Add at least one director or officer change": "Agregue al menos un cambio de director o funcionario",
    "Required for officers": "Obligatorio para funcionarios",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["corporation"],
  ["changeTypes", "newRegisteredOffice", "newMailingAddress", "directorOfficerChanges", "effectiveDate"],
  ["contact"],
  ["billingName", "billingAddress"],
];

const CHANGE_VALUES: NoticeChangeType[] = ["registered_office", "mailing_address", "directors_officers"];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

const emptyDirectorOfficerChange: NonNullable<NoticeOfChangeSubmission["directorOfficerChanges"]>[number] = {
  changeKind: "add",
  role: "director",
  firstName: "",
  lastName: "",
  email: "",
  officerPosition: undefined,
  canadianResident: false,
  address: { ...emptyAddress },
  effectiveDate: "",
  notes: "",
};

export default function NoticeOfChangePage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<NoticeOfChangeSubmission>({
    resolver: zodResolver(noticeOfChangeSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changeTypes: [],
      newRegisteredOffice: undefined,
      newMailingAddress: undefined,
      directorOfficerChanges: undefined,
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

  const { handleSubmit, trigger, watch, register, control, setValue, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const changeTypes = watch("changeTypes") ?? [];
  const includesRegisteredOffice = changeTypes.includes("registered_office");
  const includesMailing = changeTypes.includes("mailing_address");
  const includesDirectorsOfficers = changeTypes.includes("directors_officers");

  const docFA = useFieldArray({ control, name: "directorOfficerChanges" });

  function toggleChangeType(value: NoticeChangeType, checked: boolean) {
    const next = checked
      ? Array.from(new Set([...changeTypes, value]))
      : changeTypes.filter((v) => v !== value);
    setValue("changeTypes", next, { shouldValidate: true });
    if (value === "registered_office") {
      setValue("newRegisteredOffice", checked ? { ...emptyAddress } : undefined);
    }
    if (value === "mailing_address") {
      setValue("newMailingAddress", checked ? { ...emptyAddress } : undefined);
    }
    if (value === "directors_officers") {
      if (checked) {
        setValue("directorOfficerChanges", [{ ...emptyDirectorOfficerChange }]);
      } else {
        setValue("directorOfficerChanges", undefined);
      }
    }
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof NoticeOfChangeSubmission | string>> = {
      1: ["corporation"],
      2: [
        "changeTypes",
        "newRegisteredOffice",
        "newMailingAddress",
        "directorOfficerChanges",
        "effectiveDate",
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

  async function onFinalSubmit(data: NoticeOfChangeSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "notice-of-change", payload: data }),
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
            <strong>{t.whenStrong}</strong>{t.whenPre}
            <Link className="underline" href="/services/change-director">{t.changeDirector}</Link> ($149){t.or}
            <Link className="underline" href="/services/change-address">{t.changeAddress}</Link> ($99).
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.changesH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal" ? t.federalIntro : t.ontarioIntro}
                {t.deadlinePre}<strong>{t.deadlineDays}</strong>{t.deadlinePost}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
                    {t.selectChanging} <span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-2">
                    {CHANGE_VALUES.map((value) => {
                      const c = t.choices[value];
                      const checked = changeTypes.includes(value);
                      const disabled = value === "mailing_address" && jurisdiction === "federal";
                      return (
                        <label
                          key={value}
                          className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${
                            disabled ? "opacity-50 cursor-not-allowed border-gray-100" : checked ? "border-navy-900 bg-cream-50 cursor-pointer" : "border-gray-200 hover:border-gray-300 cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(e) => toggleChangeType(value, e.target.checked)}
                            className="mt-1 accent-navy-900"
                          />
                          <span>
                            <span className="text-sm font-medium text-gray-900 block">{c.label}</span>
                            <span className="text-xs text-gray-500">
                              {c.description}
                              {disabled && t.federalMailingNote}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {typeof errors.changeTypes?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.changeTypes.message)}</p>
                  )}
                </div>

                {includesRegisteredOffice && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-3">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.newOffice}</p>
                    <AddressFields name="newRegisteredOffice" errors={errors.newRegisteredOffice} />
                    {jurisdiction === "federal" && (
                      <p className="text-xs text-gray-500">{t.officeProvinceNote}</p>
                    )}
                  </div>
                )}

                {includesMailing && jurisdiction === "ontario" && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-3">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.newMailing}</p>
                    <AddressFields name="newMailingAddress" errors={errors.newMailingAddress} canadaOnly={false} />
                  </div>
                )}

                {includesDirectorsOfficers && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.docH}</p>
                    {typeof errors.directorOfficerChanges?.message === "string" && (
                      <p className="text-xs text-red-500">{err(errors.directorOfficerChanges.message)}</p>
                    )}
                    {docFA.fields.map((field, idx) => {
                      const role = watch(`directorOfficerChanges.${idx}.role`);
                      const showOfficerPosition = role === "officer" || role === "director_and_officer";
                      const isDirector = role === "director" || role === "director_and_officer";
                      const cErrors = errors.directorOfficerChanges?.[idx];
                      return (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.change} {idx + 1}</p>
                            {docFA.fields.length > 1 && (
                              <button type="button" onClick={() => docFA.remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                                <Trash2 size={12} /> {t.remove}
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label={t.changeKind} error={cErrors?.changeKind?.message}>
                                <select {...register(`directorOfficerChanges.${idx}.changeKind`)} className={sCls}>
                                  <option value="add">{t.kindAdd}</option>
                                  <option value="remove">{t.kindRemove}</option>
                                  <option value="update">{t.kindUpdate}</option>
                                </select>
                              </Field>
                              <Field label={t.role} error={cErrors?.role?.message}>
                                <select {...register(`directorOfficerChanges.${idx}.role`)} className={sCls}>
                                  <option value="director">{t.roleDirector}</option>
                                  <option value="officer">{t.roleOfficer}</option>
                                  <option value="director_and_officer">{t.roleBoth}</option>
                                </select>
                              </Field>
                            </div>
                            {showOfficerPosition && (
                              <Field label={t.officerPosition} error={err(cErrors?.officerPosition?.message)}>
                                <select {...register(`directorOfficerChanges.${idx}.officerPosition`)} className={sCls}>
                                  <option value="">{t.select}</option>
                                  {OFFICER_POSITIONS.map((p) => (
                                    <option key={p} value={p}>{lang === "en" ? p : POSITION_LABELS[lang][p]}</option>
                                  ))}
                                </select>
                              </Field>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              <Field label={t.first} error={cErrors?.firstName?.message}>
                                <input type="text" {...register(`directorOfficerChanges.${idx}.firstName`)} className={iCls} />
                              </Field>
                              <Field label={t.last} error={cErrors?.lastName?.message}>
                                <input type="text" {...register(`directorOfficerChanges.${idx}.lastName`)} className={iCls} />
                              </Field>
                            </div>
                            <Field label={t.emailOptional} error={cErrors?.email?.message}>
                              <input type="email" {...register(`directorOfficerChanges.${idx}.email`)} className={iCls} />
                            </Field>
                            <div>
                              <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                                {t.residential} <span className="text-red-500">*</span>
                              </p>
                              <AddressFields name={`directorOfficerChanges.${idx}.address`} errors={cErrors?.address} canadaOnly={false} />
                            </div>
                            {jurisdiction === "federal" && isDirector && (
                              <label className="flex items-start gap-3 text-sm cursor-pointer">
                                <input type="checkbox" {...register(`directorOfficerChanges.${idx}.canadianResident`)} className="mt-1 accent-navy-900" />
                                <span className="text-gray-700">
                                  {t.residentPre}<strong>{t.residentStrong}</strong>{t.residentPost}{" "}
                                  <span className="text-gray-500">{t.residentNote}</span>
                                </span>
                              </label>
                            )}
                            <Field label={t.effective} error={cErrors?.effectiveDate?.message}>
                              <input type="date" {...register(`directorOfficerChanges.${idx}.effectiveDate`)} className={iCls} />
                            </Field>
                            <Field label={t.notes} error={cErrors?.notes?.message}>
                              <textarea {...register(`directorOfficerChanges.${idx}.notes`)} rows={2} className={`${iCls} resize-none`} />
                            </Field>
                          </div>
                        </div>
                      );
                    })}
                    {docFA.fields.length < 20 && (
                      <button type="button" onClick={() => docFA.append({ ...emptyDirectorOfficerChange })} className="w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
                        <Plus size={14} /> {t.addChange}
                      </button>
                    )}
                  </div>
                )}

                <Field label={t.filingEffective} error={errors.effectiveDate?.message} hint={t.filingEffectiveHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
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
