"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  extraProvincialSchema,
  type ExtraProvincialSubmission,
} from "@/lib/registrationSchemas";
import { EXTRA_PROVINCIAL_DOC_LIMITS, REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import FileUpload from "@/components/wizard/FileUpload";

const SERVICE = REGISTRATION_SERVICES["extra-provincial"];

type Lang = "en" | "fr" | "es";

// Ontario is the only target province offered, so it is not a home jurisdiction.
const HOME_JURISDICTIONS = ["federal", "bc", "alberta", "quebec", "other"] as const;
const DOCS_MAX_MB = EXTRA_PROVINCIAL_DOC_LIMITS.maxTotalBytes / 1024 / 1024;

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + provincial filing fees. Filed within 2–3 business days.",
    steps: ["Corporation", "Target & Agent", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "The corporation that wants to register in Ontario.",
    homeJurisdiction: "Home jurisdiction *",
    homeJurisdictionHint: "Where this corporation is currently incorporated.",
    homeOptions: {
      federal: "Federal (Canada)",
      bc: "British Columbia",
      alberta: "Alberta",
      quebec: "Quebec",
      other: "Other",
    },
    specifyJurisdiction: "Specify jurisdiction *",
    specifyPlaceholder: "e.g. Manitoba",
    corpName: "Corporation legal name *",
    corpNumber: "Corporation number *",
    corpNumberHint: "The corporation number from your home jurisdiction.",
    registeredOffice: "Registered office (home jurisdiction)",
    effective: "Effective date *",
    effectiveHint: "When extra-provincial registration should take effect.",
    incorporationDate: "Incorporation / amalgamation date *",
    incorporationDateHint: "The date on the corporation's certificate of incorporation or amalgamation.",
    naics: "Primary activity (NAICS code) *",
    naicsHintBefore: "Find the code that matches your business in the ",
    naicsLink: "Statistics Canada NAICS list",
    naicsHintAfter: " and enter it here.",
    naicsUrl: "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1369825",
    docsTitle: "Incorporating documents *",
    docsHint: (max: number, mb: number) =>
      `Upload the incorporating document and any amendments (Articles of Incorporation, Certificate of Incorporation, Articles of Amendment, etc.). PDF only, up to ${max} files, ${mb} MB total.`,
    docsRequired: "Upload at least one PDF.",
    targetH2: "Target Province & Agent",
    targetIntro: "We currently file extra-provincial registrations in Ontario. Tell us who represents the corporation there.",
    targetProvince: "Target province",
    targetOntario: "Ontario",
    agentName: "Agent for service (full name) *",
    agentNameHint:
      "A person or firm resident in Ontario who can accept legal documents on the corporation's behalf.",
    agentAddress: "Agent address (in Ontario)",
    officerQuestion: "Does the corporation have a chief officer or manager in Ontario? *",
    yes: "Yes",
    no: "No",
    officerFirstName: "Officer first name *",
    officerLastName: "Officer last name *",
    officerAddress: "Officer's address for service (in Ontario)",
    certify: "The individual named above has certified that all information set out in this filing is true, correct and complete.",
    authorize: "I authorize Korporex to file this registration on the corporation's behalf.",
    contactEmail: "Contact email *",
    contactPhone: "Contact phone *",
    required: "Required",
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
      "Ontario government filing fees, where they apply, are invoiced separately as a pass-through after submission.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Enregistrement extraprovincial de votre société",
    label: "Enregistrement extraprovincial",
    description:
      "Enregistrez votre société pour exercer légalement ses activités dans une autre province canadienne tout en conservant sa constitution dans son territoire d'origine.",
    heroTail: " + taxes applicables + droits de dépôt provinciaux. Déposé dans un délai de 2 à 3 jours ouvrables.",
    steps: ["Société", "Province et mandataire", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "La société qui souhaite s'enregistrer en Ontario.",
    homeJurisdiction: "Territoire de constitution *",
    homeJurisdictionHint: "Le territoire où cette société est actuellement constituée.",
    homeOptions: {
      federal: "Fédéral (Canada)",
      bc: "Colombie-Britannique",
      alberta: "Alberta",
      quebec: "Québec",
      other: "Autre",
    },
    specifyJurisdiction: "Précisez le territoire *",
    specifyPlaceholder: "p. ex. Manitoba",
    corpName: "Dénomination sociale de la société *",
    corpNumber: "Numéro de la société *",
    corpNumberHint: "Le numéro de société attribué dans votre territoire de constitution.",
    registeredOffice: "Siège social (territoire de constitution)",
    effective: "Date de prise d'effet *",
    effectiveHint: "La date à laquelle l'enregistrement extraprovincial doit prendre effet.",
    incorporationDate: "Date de constitution ou de fusion *",
    incorporationDateHint: "La date figurant sur le certificat de constitution ou de fusion de la société.",
    naics: "Activité principale (code SCIAN) *",
    naicsHintBefore: "Trouvez le code qui correspond à votre entreprise dans la ",
    naicsLink: "liste du SCIAN de Statistique Canada",
    naicsHintAfter: " et inscrivez-le ici.",
    naicsUrl: "https://www23.statcan.gc.ca/imdb/p3VD_f.pl?Function=getVD&TVD=1369825",
    docsTitle: "Documents constitutifs *",
    docsHint: (max: number, mb: number) =>
      `Téléversez le document constitutif et ses modifications (statuts constitutifs, certificat de constitution, statuts de modification, etc.). PDF seulement, jusqu'à ${max} fichiers, ${mb} Mo au total.`,
    docsRequired: "Téléversez au moins un fichier PDF.",
    targetH2: "Province visée et mandataire",
    targetIntro:
      "Nous déposons actuellement les enregistrements extraprovinciaux en Ontario. Indiquez qui représente la société dans cette province.",
    targetProvince: "Province visée",
    targetOntario: "Ontario",
    agentName: "Mandataire aux fins de signification (nom complet) *",
    agentNameHint:
      "Une personne ou un cabinet résidant en Ontario qui peut accepter des documents juridiques au nom de la société.",
    agentAddress: "Adresse du mandataire (en Ontario)",
    officerQuestion: "La société a-t-elle un dirigeant principal ou un gestionnaire en Ontario? *",
    yes: "Oui",
    no: "Non",
    officerFirstName: "Prénom du dirigeant *",
    officerLastName: "Nom du dirigeant *",
    officerAddress: "Adresse aux fins de signification du dirigeant (en Ontario)",
    certify: "La personne nommée ci-dessus a attesté que tous les renseignements figurant dans ce dépôt sont véridiques, exacts et complets.",
    authorize: "J'autorise Korporex à déposer cet enregistrement au nom de la société.",
    contactEmail: "Courriel de la personne-ressource *",
    contactPhone: "Téléphone de la personne-ressource *",
    required: "Obligatoire",
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
      "Les droits de dépôt du gouvernement de l'Ontario, s'il y a lieu, sont facturés séparément, au prix coûtant, après l'envoi de la demande.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Registro extraprovincial de su sociedad",
    label: "Registro extraprovincial",
    description:
      "Registre su sociedad para operar legalmente en otra provincia canadiense, conservando su constitución en su jurisdicción de origen.",
    heroTail: " + impuestos aplicables + tasas provinciales de presentación. Presentado en un plazo de 2 a 3 días hábiles.",
    steps: ["Sociedad", "Provincia y agente", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "La sociedad que desea registrarse en Ontario.",
    homeJurisdiction: "Jurisdicción de origen *",
    homeJurisdictionHint: "Donde está constituida actualmente esta sociedad.",
    homeOptions: {
      federal: "Federal (Canadá)",
      bc: "Columbia Británica",
      alberta: "Alberta",
      quebec: "Quebec",
      other: "Otra",
    },
    specifyJurisdiction: "Especifique la jurisdicción *",
    specifyPlaceholder: "p. ej., Manitoba",
    corpName: "Denominación legal de la sociedad *",
    corpNumber: "Número de sociedad *",
    corpNumberHint: "El número de sociedad asignado en su jurisdicción de origen.",
    registeredOffice: "Domicilio social (jurisdicción de origen)",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo debe entrar en vigor el registro extraprovincial.",
    incorporationDate: "Fecha de constitución o fusión *",
    incorporationDateHint: "La fecha que figura en el certificado de constitución o de fusión de la sociedad.",
    naics: "Actividad principal (código NAICS) *",
    naicsHintBefore: "Busque el código que corresponde a su empresa en la ",
    naicsLink: "lista NAICS de Statistics Canada",
    naicsHintAfter: " e introdúzcalo aquí.",
    naicsUrl: "https://www23.statcan.gc.ca/imdb/p3VD.pl?Function=getVD&TVD=1369825",
    docsTitle: "Documentos constitutivos *",
    docsHint: (max: number, mb: number) =>
      `Suba el documento constitutivo y sus modificaciones (Articles of Incorporation, Certificate of Incorporation, Articles of Amendment, etc.). Solo PDF, hasta ${max} archivos, ${mb} MB en total.`,
    docsRequired: "Suba al menos un archivo PDF.",
    targetH2: "Provincia de destino y agente",
    targetIntro:
      "Actualmente presentamos registros extraprovinciales en Ontario. Indique quién representa a la sociedad allí.",
    targetProvince: "Provincia de destino",
    targetOntario: "Ontario",
    agentName: "Agente para notificaciones (nombre completo) *",
    agentNameHint:
      "Una persona o firma residente en Ontario que puede aceptar documentos legales en nombre de la sociedad.",
    agentAddress: "Dirección del agente (en Ontario)",
    officerQuestion: "¿La sociedad tiene un director general o gerente en Ontario? *",
    yes: "Sí",
    no: "No",
    officerFirstName: "Nombre del directivo *",
    officerLastName: "Apellido del directivo *",
    officerAddress: "Dirección para notificaciones del directivo (en Ontario)",
    certify: "La persona indicada anteriormente ha certificado que toda la información contenida en esta presentación es verdadera, correcta y completa.",
    authorize: "Autorizo a Korporex a presentar este registro en nombre de la sociedad.",
    contactEmail: "Correo electrónico de contacto *",
    contactPhone: "Teléfono de contacto *",
    required: "Obligatorio",
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
      "Las tasas gubernamentales de Ontario, cuando correspondan, se facturan por separado, al costo, después del envío.",
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
    "Select your home jurisdiction": "Sélectionnez votre territoire de constitution",
    "Select yes or no": "Sélectionnez oui ou non",
    "Date cannot be in the future": "La date ne peut pas être dans le futur",
    "Enter a NAICS code of 2 to 6 digits": "Entrez un code SCIAN de 2 à 6 chiffres",
  },
  es: {
    "Select your home jurisdiction": "Seleccione su jurisdicción de origen",
    "Select yes or no": "Seleccione sí o no",
    "Date cannot be in the future": "La fecha no puede ser futura",
    "Enter a NAICS code of 2 to 6 digits": "Introduzca un código NAICS de 2 a 6 dígitos",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: Array<Array<keyof ExtraProvincialSubmission>> = [
  [
    "homeJurisdiction",
    "homeJurisdictionOther",
    "corpName",
    "corpNumber",
    "incorporationDate",
    "naicsCode",
    "corpRegisteredOffice",
    "effectiveDate",
  ],
  [
    "targetProvince",
    "agentName",
    "agentAddress",
    "hasOntarioOfficer",
    "officerFirstName",
    "officerLastName",
    "officerAddress",
    "contactEmail",
    "contactPhone",
    "certifiedAccurate",
    "authorizedToFile",
  ],
  ["billingName", "billingAddress"],
];

export default function ExtraProvincialRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentsMissing, setDocumentsMissing] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<ExtraProvincialSubmission>({
    resolver: zodResolver(extraProvincialSchema),
    mode: "onTouched",
    defaultValues: {
      homeJurisdiction: "federal",
      homeJurisdictionOther: "",
      corpName: "",
      corpNumber: "",
      incorporationDate: "",
      naicsCode: "",
      targetProvince: "ontario",
      effectiveDate: "",
      corpRegisteredOffice: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      agentName: "",
      agentAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      hasOntarioOfficer: "",
      officerFirstName: "",
      officerLastName: "",
      officerAddress: { street: "", city: "", region: "ON", postalCode: "", country: "CA" },
      contactEmail: "",
      contactPhone: "",
      certifiedAccurate: false,
      authorizedToFile: false,
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const homeJurisdiction = watch("homeJurisdiction");
  const hasOntarioOfficer = watch("hasOntarioOfficer");
  // Radios and checkboxes re-validate as soon as they change. With the form's
  // onTouched mode their error would otherwise clear on blur, i.e. on the
  // mousedown of the customer's next click, and the resulting layout shift
  // makes that click miss its target.
  const revalidateOnChange = (name: "hasOntarioOfficer" | "certifiedAccurate" | "authorizedToFile") => ({
    onChange: () => void trigger(name),
  });
  const today = new Date().toISOString().slice(0, 10);

  async function gotoStep(next: number) {
    const valid = await trigger(STEP_FIELDS[step - 1]);
    // Uploads live outside react-hook-form, so step 1 checks them separately.
    const missingDocs = step === 1 && documents.length === 0;
    if (missingDocs) setDocumentsMissing(true);
    if (!valid || missingDocs) return;
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: ExtraProvincialSubmission) {
    // The stepper allows jumping ahead, so re-check the uploads here.
    if (documents.length === 0) {
      setDocumentsMissing(true);
      setStep(1);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const body = new FormData();
      body.set("service", "extra-provincial");
      body.set("payload", JSON.stringify(data));
      for (const f of documents) body.append("documents", f);
      const res = await fetch("/api/service-request", { method: "POST", body });
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
                <Field label={t.homeJurisdiction} error={localizeError(lang, errors.homeJurisdiction?.message)} hint={t.homeJurisdictionHint}>
                  <select {...register("homeJurisdiction")} className={sCls}>
                    {HOME_JURISDICTIONS.map((v) => (
                      <option key={v} value={v}>{t.homeOptions[v]}</option>
                    ))}
                  </select>
                </Field>

                {homeJurisdiction === "other" && (
                  <Field label={t.specifyJurisdiction} error={errors.homeJurisdictionOther?.message}>
                    <input type="text" {...register("homeJurisdictionOther")} className={iCls} placeholder={t.specifyPlaceholder} />
                  </Field>
                )}

                <Field label={t.corpName} error={errors.corpName?.message}>
                  <input type="text" {...register("corpName")} className={iCls} placeholder="ACME Holdings Inc." />
                </Field>

                <Field label={t.corpNumber} error={errors.corpNumber?.message} hint={t.corpNumberHint}>
                  <input type="text" {...register("corpNumber")} className={iCls} placeholder="1234567" />
                </Field>

                <Field
                  label={t.incorporationDate}
                  error={localizeError(lang, errors.incorporationDate?.message)}
                  hint={t.incorporationDateHint}
                >
                  <input type="date" max={today} {...register("incorporationDate")} className={iCls} />
                </Field>

                <div>
                  <Field label={t.naics} error={localizeError(lang, errors.naicsCode?.message)}>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      {...register("naicsCode")}
                      className={iCls}
                      placeholder="541611"
                    />
                  </Field>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.naicsHintBefore}
                    <a
                      href={t.naicsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-900 underline hover:text-gold-600"
                    >
                      {t.naicsLink}
                    </a>
                    {t.naicsHintAfter}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.registeredOffice} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="corpRegisteredOffice" errors={errors.corpRegisteredOffice} />
                </div>

                <Field label={t.effective} error={errors.effectiveDate?.message} hint={t.effectiveHint}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <FileUpload
                  files={documents}
                  onChange={(files) => {
                    setDocuments(files);
                    if (files.length > 0) setDocumentsMissing(false);
                  }}
                  title={t.docsTitle}
                  hint={t.docsHint(EXTRA_PROVINCIAL_DOC_LIMITS.maxFiles, DOCS_MAX_MB)}
                  maxFiles={EXTRA_PROVINCIAL_DOC_LIMITS.maxFiles}
                  maxTotalBytes={EXTRA_PROVINCIAL_DOC_LIMITS.maxTotalBytes}
                  acceptedMimes={EXTRA_PROVINCIAL_DOC_LIMITS.acceptedMimes}
                  error={documentsMissing ? t.docsRequired : undefined}
                />

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.targetH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.targetIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label={t.targetProvince}>
                  <input type="text" value={t.targetOntario} readOnly className={`${iCls} bg-gray-50 text-gray-600`} />
                </Field>

                <Field label={t.agentName} error={errors.agentName?.message} hint={t.agentNameHint}>
                  <input type="text" {...register("agentName")} className={iCls} />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.agentAddress} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="agentAddress" errors={errors.agentAddress} />
                </div>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                  <Field label={t.officerQuestion} error={localizeError(lang, errors.hasOntarioOfficer?.message)}>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                        <input type="radio" value="yes" {...register("hasOntarioOfficer", revalidateOnChange("hasOntarioOfficer"))} className="accent-navy-900" />
                        {t.yes}
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                        <input type="radio" value="no" {...register("hasOntarioOfficer", revalidateOnChange("hasOntarioOfficer"))} className="accent-navy-900" />
                        {t.no}
                      </label>
                    </div>
                  </Field>

                  {hasOntarioOfficer === "yes" && (
                    <div className="space-y-5 mt-5">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label={t.officerFirstName} error={errors.officerFirstName?.message}>
                          <input type="text" autoComplete="off" {...register("officerFirstName")} className={iCls} />
                        </Field>
                        <Field label={t.officerLastName} error={errors.officerLastName?.message}>
                          <input type="text" autoComplete="off" {...register("officerLastName")} className={iCls} />
                        </Field>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                          {t.officerAddress} <span className="text-red-500">*</span>
                        </p>
                        <AddressFields name="officerAddress" errors={errors.officerAddress} />
                      </div>
                    </div>
                  )}
                </div>

                <Field label={t.contactEmail} error={errors.contactEmail?.message}>
                  <input type="email" autoComplete="email" {...register("contactEmail")} className={iCls} />
                </Field>
                <Field label={t.contactPhone} error={errors.contactPhone?.message}>
                  <input type="tel" autoComplete="tel" {...register("contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
                </Field>

                <div className="space-y-3 pt-2">
                  {(["certifiedAccurate", "authorizedToFile"] as const).map((name) => (
                    <div key={name}>
                      <label className="flex items-start gap-3 text-sm text-gray-800 cursor-pointer">
                        <input type="checkbox" {...register(name, revalidateOnChange(name))} className="mt-1 shrink-0 accent-navy-900" />
                        <span>
                          {name === "certifiedAccurate" ? t.certify : t.authorize}
                          <span className="text-red-500 ml-0.5">*</span>
                        </span>
                      </label>
                      {errors[name] && <p className="text-xs text-red-500 mt-1 ml-7">{t.required}</p>}
                    </div>
                  ))}
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
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
