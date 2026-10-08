"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  annualReturnFederalSchema,
  type AnnualReturnFederalSubmission,
  type CurrentDirector,
  type CurrentOfficer,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { CurrentDirectorsArray, CurrentOfficersArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = COMPLIANCE_SERVICES["annual-return-federal"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax + Corporations Canada filing fee. Filed within 2 business days.",
    deadlineStrong: "Statutory deadline:",
    deadlinePre: " CBCA s.263 requires the Annual Return (Form 22) to be filed within ",
    deadlineDays: "60 days",
    deadlinePost: " of the anniversary of incorporation. Continued non-filing can lead to dissolution by Corporations Canada.",
    steps: ["Corporation", "Confirm", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "The federal corporation filing the Annual Return.",
    anniversary: "Anniversary date *",
    anniversaryHint: "The date of incorporation. The Annual Return is due each year within 60 days after this date.",
    fiscalYearEnd: "Fiscal year-end *",
    distributing: "Distributing status *",
    distributingHint: "A distributing corporation is one that has issued securities to the public (publicly traded or reporting issuer).",
    nonDistributingOpt: "Non-distributing (private corporation)",
    distributingOpt: "Distributing (publicly traded / reporting issuer)",
    shareholders: "Number of shareholders *",
    shareholdersHint: "Approximate count as of the anniversary date.",
    confirmH2: "Confirm Current Information",
    confirmIntro: "If anything has changed since the prior return, tell us what so we can update Corporations Canada.",
    status: "Status",
    currentPre: "All information on file with Corporations Canada is ",
    currentStrong: "current",
    currentPost: ": no changes since the prior filing.",
    changedPre: "Some information has ",
    changedStrong: "changed",
    changedPost: ". I'll provide the updates below.",
    officeStrong: "Registered office address",
    officePost: " has changed.",
    newOffice: "New registered office",
    officeProvinceNote: "Must be in the same province as the one stated in your Articles. Moving the office to a different province requires Articles of Amendment instead.",
    directorsStrong: "Directors",
    directorsPost: " have changed. Provide the current slate below (CBCA s.105(3) Canadian-resident attestation required per director).",
    officersStrong: "Officers",
    officersPost: " have changed. Provide the current slate below.",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions.",
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
    govFee: "Corporations Canada charges a $12 filing fee (online), billed separately as a pass-through.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
    errDirectors: "Provide the current slate of directors",
    errOfficers: "Provide the current slate of officers",
  },
  fr: {
    h1: "Produisez votre déclaration annuelle fédérale (LCSA)",
    label: "Déclaration annuelle (fédérale)",
    description:
      "Toute société régie par la Loi canadienne sur les sociétés par actions (LCSA) doit produire une déclaration annuelle (formulaire 22) auprès de Corporations Canada dans les 60 jours suivant l'anniversaire de sa constitution, en vertu de l'article 263 de la LCSA. La déclaration indique si la société a fait appel au public et combien elle compte d'actionnaires, et confirme que les renseignements sur la société sont toujours à jour.",
    heroTail: " + taxes applicables + droits de dépôt de Corporations Canada. Déposée dans un délai de 2 jours ouvrables.",
    deadlineStrong: "Délai prévu par la loi :",
    deadlinePre: " l'article 263 de la LCSA exige que la déclaration annuelle (formulaire 22) soit produite dans les ",
    deadlineDays: "60 jours",
    deadlinePost: " suivant l'anniversaire de la constitution. Un défaut de dépôt prolongé peut entraîner la dissolution de la société par Corporations Canada.",
    steps: ["Société", "Confirmation", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "La société fédérale qui produit la déclaration annuelle.",
    anniversary: "Date anniversaire *",
    anniversaryHint: "La date de constitution. La déclaration annuelle doit être produite chaque année dans les 60 jours suivant cette date.",
    fiscalYearEnd: "Fin de l'exercice *",
    distributing: "Appel au public *",
    distributingHint: "Une société ayant fait appel au public est une société qui a émis des valeurs mobilières au public (cotée en bourse ou émetteur assujetti).",
    nonDistributingOpt: "N'ayant pas fait appel au public (société fermée)",
    distributingOpt: "Ayant fait appel au public (cotée en bourse / émetteur assujetti)",
    shareholders: "Nombre d'actionnaires *",
    shareholdersHint: "Nombre approximatif à la date anniversaire.",
    confirmH2: "Confirmez les renseignements actuels",
    confirmIntro: "Si quelque chose a changé depuis la déclaration précédente, indiquez-nous quoi afin que nous puissions mettre le dossier à jour auprès de Corporations Canada.",
    status: "Statut",
    currentPre: "Tous les renseignements au dossier de Corporations Canada sont ",
    currentStrong: "à jour",
    currentPost: " : aucun changement depuis le dépôt précédent.",
    changedPre: "Certains renseignements ont ",
    changedStrong: "changé",
    changedPost: ". Je fournis les mises à jour ci-dessous.",
    officeStrong: "L'adresse du siège social",
    officePost: " a changé.",
    newOffice: "Nouveau siège social",
    officeProvinceNote: "Le siège social doit demeurer dans la province indiquée dans vos statuts. Pour le déplacer dans une autre province, il faut plutôt déposer des clauses modificatrices.",
    directorsStrong: "Les administrateurs",
    directorsPost: " ont changé. Indiquez la liste actuelle ci-dessous (attestation de résidence canadienne requise pour chaque administrateur, paragraphe 105(3) de la LCSA).",
    officersStrong: "Les dirigeants",
    officersPost: " ont changé. Indiquez la liste actuelle ci-dessous.",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions.",
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
    govFee: "Corporations Canada perçoit des droits de dépôt de 12 $ (en ligne), facturés séparément au prix coûtant.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
    errDirectors: "Indiquez la liste actuelle des administrateurs",
    errOfficers: "Indiquez la liste actuelle des dirigeants",
  },
  es: {
    h1: "Presente su declaración anual federal (CBCA)",
    label: "Declaración anual (federal)",
    description:
      "Toda sociedad regida por la Ley de Sociedades por Acciones de Canadá (CBCA) debe presentar una declaración anual (Formulario 22) ante Corporations Canada dentro de los 60 días posteriores al aniversario de su constitución, conforme al artículo 263 de la CBCA. La declaración indica si la sociedad hace oferta pública de valores y cuántos accionistas tiene, y confirma que la información de la sociedad sigue vigente.",
    heroTail: " + impuestos aplicables + tasa de presentación de Corporations Canada. Presentada en un plazo de 2 días hábiles.",
    deadlineStrong: "Plazo legal:",
    deadlinePre: " el artículo 263 de la CBCA exige que la declaración anual (Formulario 22) se presente dentro de los ",
    deadlineDays: "60 días",
    deadlinePost: " posteriores al aniversario de la constitución. La falta reiterada de presentación puede llevar a la disolución de la sociedad por parte de Corporations Canada.",
    steps: ["Sociedad", "Confirmación", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "La sociedad federal que presenta la declaración anual.",
    anniversary: "Fecha de aniversario *",
    anniversaryHint: "La fecha de constitución. La declaración anual vence cada año dentro de los 60 días posteriores a esta fecha.",
    fiscalYearEnd: "Cierre del ejercicio fiscal *",
    distributing: "Oferta pública *",
    distributingHint: "Una sociedad de oferta pública (distributing corporation) es la que ha emitido valores al público (cotiza en bolsa o es emisor declarante).",
    nonDistributingOpt: "Sin oferta pública (sociedad privada)",
    distributingOpt: "De oferta pública (cotiza en bolsa / emisor declarante)",
    shareholders: "Número de accionistas *",
    shareholdersHint: "Cantidad aproximada a la fecha de aniversario.",
    confirmH2: "Confirme la información actual",
    confirmIntro: "Si algo cambió desde la declaración anterior, indíquenos qué para que podamos actualizarlo ante Corporations Canada.",
    status: "Estado",
    currentPre: "Toda la información registrada ante Corporations Canada está ",
    currentStrong: "vigente",
    currentPost: ": sin cambios desde la presentación anterior.",
    changedPre: "Parte de la información ha ",
    changedStrong: "cambiado",
    changedPost: ". Indicaré las actualizaciones a continuación.",
    officeStrong: "El domicilio social",
    officePost: " ha cambiado.",
    newOffice: "Nuevo domicilio social",
    officeProvinceNote: "Debe estar en la misma provincia indicada en sus estatutos (Articles). Para trasladar el domicilio a otra provincia se requieren estatutos modificatorios (Articles of Amendment).",
    directorsStrong: "Los directores",
    directorsPost: " han cambiado. Indique la lista actual a continuación (se requiere declaración de residencia canadiense por director, artículo 105(3) de la CBCA).",
    officersStrong: "Los funcionarios",
    officersPost: " han cambiado. Indique la lista actual a continuación.",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas.",
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
    govFee: "Corporations Canada cobra una tasa de presentación de $12 (en línea), facturada por separado sin recargo.",
    submitting: "Redirigiendo a Stripe…",
    submit: "Continuar al pago",
    stripe: "El pago se procesa de forma segura a través de Stripe. Los datos de su tarjeta nunca pasan por nuestro servidor.",
    failed: "No se pudo enviar la solicitud.",
    errDirectors: "Indique la lista actual de directores",
    errOfficers: "Indique la lista actual de funcionarios",
  },
} as const;

type Copy = (typeof COPY)[Lang];

// Schema messages for the fields rendered directly on this page, translated for
// display only. The schema itself is unchanged; unknown messages pass through.
function localizeError(t: Copy, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  if (message === COPY.en.errDirectors) return t.errDirectors;
  if (message === COPY.en.errOfficers) return t.errOfficers;
  return message;
}

const STEP_FIELDS: string[][] = [
  ["corporation", "anniversaryDate", "fiscalYearEnd", "distributingStatus", "numberOfShareholders"],
  ["informationCurrent", "registeredOfficeChanged", "newRegisteredOffice", "directorsChanged", "directors", "officersChanged", "officers"],
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
const emptyOfficer: CurrentOfficer = {
  firstName: "",
  lastName: "",
  position: "President",
  email: "",
  appointedDate: "",
  address: { ...emptyAddress },
};

export default function AnnualReturnFederalPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<AnnualReturnFederalSubmission>({
    resolver: zodResolver(annualReturnFederalSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      anniversaryDate: "",
      fiscalYearEnd: "",
      distributingStatus: "non_distributing",
      numberOfShareholders: 1,
      informationCurrent: true,
      registeredOfficeChanged: false,
      newRegisteredOffice: undefined,
      directorsChanged: false,
      directors: undefined,
      officersChanged: false,
      officers: undefined,
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

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const informationCurrent = watch("informationCurrent");
  const registeredOfficeChanged = watch("registeredOfficeChanged");
  const directorsChanged = watch("directorsChanged");
  const officersChanged = watch("officersChanged");

  function toggleInformationCurrent(next: boolean) {
    setValue("informationCurrent", next);
    if (next) {
      setValue("registeredOfficeChanged", false);
      setValue("newRegisteredOffice", undefined);
      setValue("directorsChanged", false);
      setValue("directors", undefined);
      setValue("officersChanged", false);
      setValue("officers", undefined);
    }
  }

  function toggleRegisteredOfficeChanged(next: boolean) {
    setValue("registeredOfficeChanged", next);
    setValue("newRegisteredOffice", next ? { ...emptyAddress } : undefined);
  }

  function toggleDirectorsChanged(next: boolean) {
    setValue("directorsChanged", next);
    setValue("directors", next ? [{ ...emptyDirector }] : undefined);
  }

  function toggleOfficersChanged(next: boolean) {
    setValue("officersChanged", next);
    setValue("officers", next ? [{ ...emptyOfficer }] : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof AnnualReturnFederalSubmission | string>> = {
      1: ["corporation", "anniversaryDate", "fiscalYearEnd", "distributingStatus", "numberOfShareholders"],
      2: [
        "informationCurrent",
        "registeredOfficeChanged",
        "newRegisteredOffice",
        "directorsChanged",
        "directors",
        "officersChanged",
        "officers",
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

  async function onFinalSubmit(data: AnnualReturnFederalSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "annual-return-federal", payload: data }),
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
            <strong>{t.deadlineStrong}</strong>{t.deadlinePre}<strong>{t.deadlineDays}</strong>{t.deadlinePost}
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
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction="federal" />
                <Field label={t.anniversary} error={errors.anniversaryDate?.message} hint={t.anniversaryHint}>
                  <input type="date" {...register("anniversaryDate")} className={iCls} />
                </Field>
                <Field label={t.fiscalYearEnd} error={errors.fiscalYearEnd?.message}>
                  <input type="date" {...register("fiscalYearEnd")} className={iCls} />
                </Field>
                <Field label={t.distributing} error={errors.distributingStatus?.message} hint={t.distributingHint}>
                  <select {...register("distributingStatus")} className={sCls}>
                    <option value="non_distributing">{t.nonDistributingOpt}</option>
                    <option value="distributing">{t.distributingOpt}</option>
                  </select>
                </Field>
                <Field label={t.shareholders} error={errors.numberOfShareholders?.message} hint={t.shareholdersHint}>
                  <input type="number" min={1} {...register("numberOfShareholders", { valueAsNumber: true })} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.confirmH2}</h2>
              <p className="text-gray-500 text-sm mb-6">{t.confirmIntro}</p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.status}</p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="radio" checked={informationCurrent} onChange={() => toggleInformationCurrent(true)} className="mt-1 accent-navy-900" />
                      <span className="text-gray-800">{t.currentPre}<strong>{t.currentStrong}</strong>{t.currentPost}</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="radio" checked={!informationCurrent} onChange={() => toggleInformationCurrent(false)} className="mt-1 accent-navy-900" />
                      <span className="text-gray-800">{t.changedPre}<strong>{t.changedStrong}</strong>{t.changedPost}</span>
                    </label>
                  </div>
                </div>

                {!informationCurrent && (
                  <div className="space-y-5">
                    <div className="border border-gray-200 rounded-lg p-5">
                      <label className="flex items-start gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={registeredOfficeChanged} onChange={(e) => toggleRegisteredOfficeChanged(e.target.checked)} className="mt-1 accent-navy-900" />
                        <span className="text-gray-800"><strong>{t.officeStrong}</strong>{t.officePost}</span>
                      </label>
                      {registeredOfficeChanged && (
                        <div className="mt-4">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                            {t.newOffice} <span className="text-red-500">*</span>
                          </p>
                          <AddressFields name="newRegisteredOffice" errors={errors.newRegisteredOffice} />
                          <p className="text-xs text-gray-500 mt-2">{t.officeProvinceNote}</p>
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                      <label className="flex items-start gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={directorsChanged} onChange={(e) => toggleDirectorsChanged(e.target.checked)} className="mt-1 accent-navy-900" />
                        <span className="text-gray-800"><strong>{t.directorsStrong}</strong>{t.directorsPost}</span>
                      </label>
                      {directorsChanged && (
                        <div className="mt-4">
                          <CurrentDirectorsArray name="directors" showCanadianResident topError={localizeError(t, errors.directors?.message)} errors={errors.directors} />
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                      <label className="flex items-start gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={officersChanged} onChange={(e) => toggleOfficersChanged(e.target.checked)} className="mt-1 accent-navy-900" />
                        <span className="text-gray-800"><strong>{t.officersStrong}</strong>{t.officersPost}</span>
                      </label>
                      {officersChanged && (
                        <div className="mt-4">
                          <CurrentOfficersArray name="officers" topError={localizeError(t, errors.officers?.message)} errors={errors.officers} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.govFee}</p>
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
