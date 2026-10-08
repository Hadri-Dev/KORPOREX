"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  initialReturnOntarioSchema,
  type InitialReturnOntarioSubmission,
  type CurrentDirector,
  type CurrentOfficer,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { getTaxRate } from "@/lib/pricing";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { POSITION_LABELS } from "@/components/wizard/CurrentPeopleSection";
import NaicsCombobox from "@/components/NaicsCombobox";

const SERVICE = COMPLIANCE_SERVICES["initial-return-on"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax. Filed within 2 business days.",
    deadlineStrong: "Statutory deadline:",
    deadlinePre: " the Initial Return must be filed within ",
    deadlineDays: "60 days",
    deadlineMid: " of incorporation under the Ontario ",
    deadlineAct: "Corporations Information Act",
    deadlinePost: ". Late filings risk default status with the registry.",
    steps: ["Corporation", "Office", "Directors", "Activity", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "The Ontario corporation you're filing the Initial Return for.",
    incDate: "Incorporation date *",
    incDateHint: "The date stamped on your Articles of Incorporation.",
    officeH2: "Registered Office",
    officeIntro: "The official address on record with the Ontario Business Registry.",
    officeAddress: "Registered office address",
    officeNote: "Must be a physical address located in Ontario.",
    mailingDifferent: "My mailing address is different from the registered office.",
    mailingAddress: "Mailing address",
    peopleH2: "Directors & Officers",
    peopleIntro: "The full slate of directors and officers as of today.",
    directors: "Directors",
    director: "Director",
    officers: "Officers",
    officer: "Officer",
    remove: "Remove",
    first: "First name *",
    last: "Last name *",
    emailOptional: "Email",
    electedDate: "Elected date",
    electedHint: "Optional. Usually the date of incorporation for the first directors.",
    residential: "Residential address",
    addDirector: "Add another director",
    position: "Position *",
    appointedDate: "Appointed date",
    addOfficer: "Add another officer",
    activityH2: "Activity & Contact",
    activityIntro: "The corporation's principal business activity, and who we can reach with questions.",
    naics: "Primary Activity (NAICS Code) *",
    naicsHint: "Search by code, activity, or sector.",
    principal: "Principal activity description *",
    principalHint: "A brief description of what the corporation does.",
    principalPlaceholder: "e.g. Consulting services for small and medium-sized businesses in the technology sector.",
    contact: "Contact",
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
    h1: "Déposez votre rapport initial de l'Ontario",
    label: "Rapport initial (Ontario)",
    description:
      "Toutes les sociétés de l'Ontario doivent déposer un rapport initial auprès du Registre des entreprises de l'Ontario dans les 60 jours suivant leur constitution, en vertu de la Loi sur les renseignements exigés des personnes morales. Korporex prépare et dépose le rapport en votre nom.",
    heroTail: " + taxes applicables. Déposé dans un délai de 2 jours ouvrables.",
    deadlineStrong: "Délai prévu par la loi :",
    deadlinePre: " le rapport initial doit être déposé dans les ",
    deadlineDays: "60 jours",
    deadlineMid: " suivant la constitution, en vertu de la ",
    deadlineAct: "Loi sur les renseignements exigés des personnes morales",
    deadlinePost: " de l'Ontario. Un dépôt tardif expose la société à un statut de défaut auprès du registre.",
    steps: ["Société", "Siège", "Administrateurs", "Activité", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "La société ontarienne pour laquelle vous déposez le rapport initial.",
    incDate: "Date de constitution *",
    incDateHint: "La date inscrite sur vos statuts constitutifs.",
    officeH2: "Siège social",
    officeIntro: "L'adresse officielle inscrite au Registre des entreprises de l'Ontario.",
    officeAddress: "Adresse du siège social",
    officeNote: "Doit être une adresse physique située en Ontario.",
    mailingDifferent: "Mon adresse postale est différente de celle du siège social.",
    mailingAddress: "Adresse postale",
    peopleH2: "Administrateurs et dirigeants",
    peopleIntro: "La liste complète des administrateurs et des dirigeants à ce jour.",
    directors: "Administrateurs",
    director: "Administrateur",
    officers: "Dirigeants",
    officer: "Dirigeant",
    remove: "Retirer",
    first: "Prénom *",
    last: "Nom de famille *",
    emailOptional: "Courriel",
    electedDate: "Date d'élection",
    electedHint: "Facultatif. Généralement la date de constitution pour les premiers administrateurs.",
    residential: "Adresse résidentielle",
    addDirector: "Ajouter un autre administrateur",
    position: "Poste *",
    appointedDate: "Date de nomination",
    addOfficer: "Ajouter un autre dirigeant",
    activityH2: "Activité et contact",
    activityIntro: "L'activité principale de la société et la personne à joindre si nous avons des questions.",
    naics: "Activité principale (code SCIAN) *",
    naicsHint: "Recherchez par code, activité ou secteur.",
    principal: "Description de l'activité principale *",
    principalHint: "Une brève description de ce que fait la société.",
    principalPlaceholder: "p. ex. Services de conseil aux petites et moyennes entreprises du secteur technologique.",
    contact: "Contact",
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
    h1: "Presente su declaración inicial de Ontario",
    label: "Declaración inicial (Ontario)",
    description:
      "Todas las sociedades de Ontario deben presentar una declaración inicial ante el Registro de Empresas de Ontario dentro de los 60 días posteriores a su constitución, en virtud de la Ley de Información de Sociedades (Corporations Information Act). Korporex prepara y presenta la declaración en su nombre.",
    heroTail: " + impuestos aplicables. Presentada en un plazo de 2 días hábiles.",
    deadlineStrong: "Plazo legal:",
    deadlinePre: " la declaración inicial debe presentarse dentro de los ",
    deadlineDays: "60 días",
    deadlineMid: " posteriores a la constitución, en virtud de la ",
    deadlineAct: "Corporations Information Act",
    deadlinePost: " de Ontario. Una presentación tardía expone a la sociedad a quedar en estado de incumplimiento ante el registro.",
    steps: ["Sociedad", "Domicilio", "Directores", "Actividad", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "La sociedad de Ontario para la que presenta la declaración inicial.",
    incDate: "Fecha de constitución *",
    incDateHint: "La fecha que figura en sus estatutos de constitución (Articles of Incorporation).",
    officeH2: "Domicilio social",
    officeIntro: "La dirección oficial que consta en el Registro de Empresas de Ontario.",
    officeAddress: "Dirección del domicilio social",
    officeNote: "Debe ser una dirección física ubicada en Ontario.",
    mailingDifferent: "Mi dirección postal es distinta del domicilio social.",
    mailingAddress: "Dirección postal",
    peopleH2: "Directores y funcionarios",
    peopleIntro: "La lista completa de directores y funcionarios a la fecha de hoy.",
    directors: "Directores",
    director: "Director",
    officers: "Funcionarios",
    officer: "Funcionario",
    remove: "Eliminar",
    first: "Nombre *",
    last: "Apellido *",
    emailOptional: "Correo electrónico",
    electedDate: "Fecha de elección",
    electedHint: "Opcional. Suele ser la fecha de constitución para los primeros directores.",
    residential: "Dirección residencial",
    addDirector: "Agregar otro director",
    position: "Cargo *",
    appointedDate: "Fecha de nombramiento",
    addOfficer: "Agregar otro funcionario",
    activityH2: "Actividad y contacto",
    activityIntro: "La actividad principal de la sociedad y la persona con quien podemos comunicarnos si tenemos preguntas.",
    naics: "Actividad principal (código SCIAN) *",
    naicsHint: "Busque por código, actividad o sector.",
    principal: "Descripción de la actividad principal *",
    principalHint: "Una breve descripción de lo que hace la sociedad.",
    principalPlaceholder: "P. ej., Servicios de consultoría para pequeñas y medianas empresas del sector tecnológico.",
    contact: "Contacto",
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
    "Please describe the principal activity (min 10 characters)":
      "Veuillez décrire l'activité principale (10 caractères minimum)",
  },
  es: {
    "At least one director is required": "Se requiere al menos un director",
    "At least one officer is required": "Se requiere al menos un funcionario",
    "Please describe the principal activity (min 10 characters)":
      "Describa la actividad principal (mínimo 10 caracteres)",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["corporation", "incorporationDate"],
  ["registeredOffice", "mailingAddressDifferent", "mailingAddress"],
  ["directors", "officers"],
  ["naicsCode", "principalActivity", "contact"],
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

export default function InitialReturnOntarioPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<InitialReturnOntarioSubmission>({
    resolver: zodResolver(initialReturnOntarioSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      incorporationDate: "",
      registeredOffice: { ...emptyAddress, region: "ON" },
      mailingAddressDifferent: false,
      mailingAddress: undefined,
      directors: [{ ...emptyDirector }],
      officers: [{ ...emptyOfficer }],
      naicsCode: "",
      principalActivity: "",
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
  const directorsFA = useFieldArray({ control, name: "directors" });
  const officersFA = useFieldArray({ control, name: "officers" });
  const mailingDifferent = watch("mailingAddressDifferent");

  function toggleMailing(next: boolean) {
    setValue("mailingAddressDifferent", next);
    setValue("mailingAddress", next ? { ...emptyAddress, region: "ON" } : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof InitialReturnOntarioSubmission | string>> = {
      1: ["corporation", "incorporationDate"],
      2: ["registeredOffice", "mailingAddressDifferent", "mailingAddress"],
      3: ["directors", "officers"],
      4: ["naicsCode", "principalActivity", "contact"],
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

  async function onFinalSubmit(data: InitialReturnOntarioSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "initial-return-on", payload: data }),
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
            <strong>{t.deadlineStrong}</strong>{t.deadlinePre}<strong>{t.deadlineDays}</strong>{t.deadlineMid}<em>{t.deadlineAct}</em>{t.deadlinePost}
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
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction="ontario" />
                <Field label={t.incDate} error={errors.incorporationDate?.message} hint={t.incDateHint}>
                  <input type="date" {...register("incorporationDate")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.officeH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.officeIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.officeAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="registeredOffice" errors={errors.registeredOffice} />
                  <p className="text-xs text-gray-500 mt-2">{t.officeNote}</p>
                </div>

                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mailingDifferent}
                    onChange={(e) => toggleMailing(e.target.checked)}
                    className="mt-1 accent-navy-900"
                  />
                  <span className="text-gray-700">{t.mailingDifferent}</span>
                </label>

                {mailingDifferent && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                      {t.mailingAddress} <span className="text-red-500">*</span>
                    </p>
                    <AddressFields name="mailingAddress" errors={errors.mailingAddress} canadaOnly={false} />
                  </div>
                )}

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.peopleH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.peopleIntro}</p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-8">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.directors}</p>
                  <div className="space-y-4">
                    {directorsFA.fields.map((field, idx) => {
                      const dErrors = errors.directors?.[idx];
                      return (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.director} {idx + 1}</p>
                            {directorsFA.fields.length > 1 && (
                              <button type="button" onClick={() => directorsFA.remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                                <Trash2 size={12} /> {t.remove}
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label={t.first} error={dErrors?.firstName?.message}>
                                <input type="text" {...register(`directors.${idx}.firstName`)} className={iCls} />
                              </Field>
                              <Field label={t.last} error={dErrors?.lastName?.message}>
                                <input type="text" {...register(`directors.${idx}.lastName`)} className={iCls} />
                              </Field>
                            </div>
                            <Field label={t.emailOptional} error={dErrors?.email?.message}>
                              <input type="email" {...register(`directors.${idx}.email`)} className={iCls} />
                            </Field>
                            <Field label={t.electedDate} error={dErrors?.electedDate?.message} hint={t.electedHint}>
                              <input type="date" {...register(`directors.${idx}.electedDate`)} className={iCls} />
                            </Field>
                            <div>
                              <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                                {t.residential} <span className="text-red-500">*</span>
                              </p>
                              <AddressFields name={`directors.${idx}.address`} errors={dErrors?.address} canadaOnly={false} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {directorsFA.fields.length < 20 && (
                    <button type="button" onClick={() => directorsFA.append({ ...emptyDirector })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
                      <Plus size={14} /> {t.addDirector}
                    </button>
                  )}
                  {typeof errors.directors?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.directors.message)}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.officers}</p>
                  <div className="space-y-4">
                    {officersFA.fields.map((field, idx) => {
                      const oErrors = errors.officers?.[idx];
                      return (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.officer} {idx + 1}</p>
                            {officersFA.fields.length > 1 && (
                              <button type="button" onClick={() => officersFA.remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                                <Trash2 size={12} /> {t.remove}
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label={t.first} error={oErrors?.firstName?.message}>
                                <input type="text" {...register(`officers.${idx}.firstName`)} className={iCls} />
                              </Field>
                              <Field label={t.last} error={oErrors?.lastName?.message}>
                                <input type="text" {...register(`officers.${idx}.lastName`)} className={iCls} />
                              </Field>
                            </div>
                            <Field label={t.position} error={oErrors?.position?.message}>
                              <select {...register(`officers.${idx}.position`)} className={sCls}>
                                {OFFICER_POSITIONS.map((p) => (
                                  <option key={p} value={p}>{lang === "en" ? p : POSITION_LABELS[lang][p]}</option>
                                ))}
                              </select>
                            </Field>
                            <Field label={t.emailOptional} error={oErrors?.email?.message}>
                              <input type="email" {...register(`officers.${idx}.email`)} className={iCls} />
                            </Field>
                            <Field label={t.appointedDate} error={oErrors?.appointedDate?.message}>
                              <input type="date" {...register(`officers.${idx}.appointedDate`)} className={iCls} />
                            </Field>
                            <div>
                              <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                                {t.residential} <span className="text-red-500">*</span>
                              </p>
                              <AddressFields name={`officers.${idx}.address`} errors={oErrors?.address} canadaOnly={false} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {officersFA.fields.length < 20 && (
                    <button type="button" onClick={() => officersFA.append({ ...emptyOfficer })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
                      <Plus size={14} /> {t.addOfficer}
                    </button>
                  )}
                  {typeof errors.officers?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{err(errors.officers.message)}</p>
                  )}
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.activityH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.activityIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(5); }} className="space-y-5">
                <Field label={t.naics} error={errors.naicsCode?.message} hint={t.naicsHint}>
                  <NaicsCombobox
                    value={watch("naicsCode")}
                    onChange={(code) => form.setValue("naicsCode", code, { shouldValidate: true })}
                    error={errors.naicsCode?.message}
                  />
                </Field>
                <Field label={t.principal} error={err(errors.principalActivity?.message)} hint={t.principalHint}>
                  <textarea {...register("principalActivity")} rows={3} className={`${iCls} resize-none`} placeholder={t.principalPlaceholder} />
                </Field>

                <div className="border-t border-gray-100 pt-5 space-y-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.contact}</p>
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
                </div>

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
