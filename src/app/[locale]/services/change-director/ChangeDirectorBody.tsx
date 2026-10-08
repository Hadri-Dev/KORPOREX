"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  changeDirectorSchema,
  type ChangeDirectorSubmission,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { getTaxRate } from "@/lib/pricing";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { POSITION_LABELS } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = AMENDMENT_SERVICES["change-director"];

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    heroTail: " + applicable tax. Filed within 2 business days.",
    steps: ["Corporation", "Changes", "Contact", "Billing"],
    backToServices: "← Back to services",
    corpH2: "Your Corporation",
    corpIntro: "Tell us which corporation you're updating.",
    changesH2: "The Change(s)",
    changesIntro: "Add one entry per person being added, removed, or updated.",
    federalPre: "Under CBCA s.113 you must notify Corporations Canada within ",
    ontarioPre: "Under the Ontario ",
    ontarioAct: "Corporations Information Act",
    ontarioMid: ", you must notify the registry within ",
    days: "15 days",
    deadlinePost: " of the change.",
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
    personEmail: "Email",
    personEmailHint: "Optional. Used by the operator if there are questions about this person.",
    residential: "Residential address",
    residentPre: "This person is a ",
    residentStrong: "Canadian resident",
    residentPost: " within the meaning of CBCA s.2(1).",
    residentNote: "At least 25% of a federal corporation's directors must be Canadian residents.",
    effective: "Effective date *",
    effectiveHint: "When the appointment, resignation or change takes effect.",
    notes: "Notes",
    notesHint: "Anything else the drafter should know about this change.",
    addChange: "Add another change",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to with questions about this filing.",
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
    h1: "Changez un administrateur ou un dirigeant de votre société",
    label: "Changement d'administrateur ou de dirigeant",
    description:
      "Déposez un avis de modification auprès du registre approprié pour ajouter un nouvel administrateur ou dirigeant, consigner une démission ou mettre à jour des renseignements existants. Exigé par les lois fédérale et ontarienne dans les 15 jours suivant le changement.",
    heroTail: " + taxes applicables. Déposé dans un délai de 2 jours ouvrables.",
    steps: ["Société", "Modifications", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    corpH2: "Votre société",
    corpIntro: "Indiquez-nous la société que vous mettez à jour.",
    changesH2: "Les modifications",
    changesIntro: "Ajoutez une entrée par personne ajoutée, retirée ou mise à jour.",
    federalPre: "En vertu de l'article 113 de la LCSA, vous devez aviser Corporations Canada dans les ",
    ontarioPre: "En vertu de la ",
    ontarioAct: "Loi sur les renseignements exigés des personnes morales",
    ontarioMid: " de l'Ontario, vous devez aviser le registre dans les ",
    days: "15 jours",
    deadlinePost: " suivant le changement.",
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
    personEmail: "Courriel",
    personEmailHint: "Facultatif. Utilisé par notre équipe si nous avons des questions au sujet de cette personne.",
    residential: "Adresse résidentielle",
    residentPre: "Cette personne est un ",
    residentStrong: "résident canadien",
    residentPost: " au sens du paragraphe 2(1) de la LCSA.",
    residentNote: "Au moins 25 % des administrateurs d'une société fédérale doivent être des résidents canadiens.",
    effective: "Date d'entrée en vigueur *",
    effectiveHint: "La date à laquelle la nomination, la démission ou la modification prend effet.",
    notes: "Remarques",
    notesHint: "Tout autre renseignement utile à la préparation de cette modification.",
    addChange: "Ajouter une autre modification",
    contactH2: "Contact",
    contactIntro: "La personne à joindre si nous avons des questions sur ce dépôt.",
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
    h1: "Cambie un director o funcionario de su sociedad",
    label: "Cambio de director o funcionario",
    description:
      "Presente un aviso de cambio ante el registro correspondiente para agregar un nuevo director o funcionario, registrar una renuncia o actualizar datos existentes. Lo exigen la legislación federal y la de Ontario dentro de los 15 días posteriores al cambio.",
    heroTail: " + impuestos aplicables. Presentado en un plazo de 2 días hábiles.",
    steps: ["Sociedad", "Cambios", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    corpH2: "Su sociedad",
    corpIntro: "Indíquenos qué sociedad está actualizando.",
    changesH2: "Los cambios",
    changesIntro: "Agregue una entrada por cada persona que se agrega, retira o actualiza.",
    federalPre: "Conforme al artículo 113 de la CBCA, debe notificar a Corporations Canada dentro de los ",
    ontarioPre: "Conforme a la ",
    ontarioAct: "Corporations Information Act",
    ontarioMid: " de Ontario, debe notificar al registro dentro de los ",
    days: "15 días",
    deadlinePost: " posteriores al cambio.",
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
    personEmail: "Correo electrónico",
    personEmailHint: "Opcional. Lo usa nuestro equipo si tiene preguntas sobre esta persona.",
    residential: "Dirección residencial",
    residentPre: "Esta persona es ",
    residentStrong: "residente canadiense",
    residentPost: " en el sentido del artículo 2(1) de la CBCA.",
    residentNote: "Al menos el 25 % de los directores de una sociedad federal deben ser residentes canadienses.",
    effective: "Fecha de entrada en vigor *",
    effectiveHint: "Cuándo entra en vigor el nombramiento, la renuncia o el cambio.",
    notes: "Notas",
    notesHint: "Cualquier otro dato que debamos conocer para preparar este cambio.",
    addChange: "Agregar otro cambio",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos si tenemos preguntas sobre esta presentación.",
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
    "Add at least one change": "Ajoutez au moins une modification",
    "Maximum 20 changes per filing": "Maximum de 20 modifications par dépôt",
    "Required for officers": "Obligatoire pour les dirigeants",
    "Select the type of change": "Sélectionnez le type de modification",
    "Select the role": "Sélectionnez le rôle",
  },
  es: {
    "Add at least one change": "Agregue al menos un cambio",
    "Maximum 20 changes per filing": "Máximo de 20 cambios por presentación",
    "Required for officers": "Obligatorio para funcionarios",
    "Select the type of change": "Seleccione el tipo de cambio",
    "Select the role": "Seleccione la función",
  },
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  return lang === "en" ? message : (ERROR_TEXT[lang][message] ?? message);
}

const STEP_FIELDS: string[][] = [
  ["corporation"],
  ["changes"],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyChange: ChangeDirectorSubmission["changes"][number] = {
  changeKind: "add",
  role: "director",
  firstName: "",
  lastName: "",
  email: "",
  officerPosition: undefined,
  canadianResident: false,
  address: { street: "", city: "", region: "", postalCode: "", country: "CA" },
  effectiveDate: "",
  notes: "",
};

export default function ChangeDirectorPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const err = (message: unknown) => localizeError(lang, message);

  const form = useForm<ChangeDirectorSubmission>({
    resolver: zodResolver(changeDirectorSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changes: [{ ...emptyChange }],
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

  const { handleSubmit, trigger, watch, register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "changes" });
  const jurisdiction = watch("corporation.jurisdiction");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeDirectorSubmission | string>> = {
      1: ["corporation"],
      2: ["changes"],
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

  async function onFinalSubmit(data: ChangeDirectorSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-director", payload: data }),
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
                {t.changesIntro}{" "}
                {jurisdiction === "federal" ? (
                  <>{t.federalPre}<strong>{t.days}</strong>{t.deadlinePost}</>
                ) : (
                  <>{t.ontarioPre}<em>{t.ontarioAct}</em>{t.ontarioMid}<strong>{t.days}</strong>{t.deadlinePost}</>
                )}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-6">
                {fields.map((field, idx) => {
                  const role = watch(`changes.${idx}.role`);
                  const showOfficerPosition = role === "officer" || role === "director_and_officer";
                  const isDirector = role === "director" || role === "director_and_officer";
                  const changeErrors = errors.changes?.[idx];
                  return (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">
                          {t.change} {idx + 1}
                        </p>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={12} /> {t.remove}
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label={t.changeKind} error={err(changeErrors?.changeKind?.message)}>
                            <select {...register(`changes.${idx}.changeKind`)} className={sCls}>
                              <option value="add">{t.kindAdd}</option>
                              <option value="remove">{t.kindRemove}</option>
                              <option value="update">{t.kindUpdate}</option>
                            </select>
                          </Field>
                          <Field label={t.role} error={err(changeErrors?.role?.message)}>
                            <select {...register(`changes.${idx}.role`)} className={sCls}>
                              <option value="director">{t.roleDirector}</option>
                              <option value="officer">{t.roleOfficer}</option>
                              <option value="director_and_officer">{t.roleBoth}</option>
                            </select>
                          </Field>
                        </div>

                        {showOfficerPosition && (
                          <Field label={t.officerPosition} error={err(changeErrors?.officerPosition?.message)}>
                            <select {...register(`changes.${idx}.officerPosition`)} className={sCls}>
                              <option value="">{t.select}</option>
                              {OFFICER_POSITIONS.map((p) => (
                                <option key={p} value={p}>{lang === "en" ? p : POSITION_LABELS[lang][p]}</option>
                              ))}
                            </select>
                          </Field>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <Field label={t.first} error={changeErrors?.firstName?.message}>
                            <input type="text" {...register(`changes.${idx}.firstName`)} className={iCls} />
                          </Field>
                          <Field label={t.last} error={changeErrors?.lastName?.message}>
                            <input type="text" {...register(`changes.${idx}.lastName`)} className={iCls} />
                          </Field>
                        </div>

                        <Field label={t.personEmail} error={changeErrors?.email?.message} hint={t.personEmailHint}>
                          <input type="email" {...register(`changes.${idx}.email`)} className={iCls} />
                        </Field>

                        <div>
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                            {t.residential} <span className="text-red-500">*</span>
                          </p>
                          <AddressFields name={`changes.${idx}.address`} errors={changeErrors?.address} canadaOnly={false} />
                        </div>

                        {jurisdiction === "federal" && isDirector && (
                          <label className="flex items-start gap-3 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              {...register(`changes.${idx}.canadianResident`)}
                              className="mt-1 accent-navy-900"
                            />
                            <span className="text-gray-700">
                              {t.residentPre}<strong>{t.residentStrong}</strong>{t.residentPost}
                              {" "}
                              <span className="text-gray-500">{t.residentNote}</span>
                            </span>
                          </label>
                        )}

                        <Field label={t.effective} error={changeErrors?.effectiveDate?.message} hint={t.effectiveHint}>
                          <input type="date" {...register(`changes.${idx}.effectiveDate`)} className={iCls} />
                        </Field>

                        <Field label={t.notes} error={changeErrors?.notes?.message} hint={t.notesHint}>
                          <textarea {...register(`changes.${idx}.notes`)} rows={2} className={`${iCls} resize-none`} />
                        </Field>
                      </div>
                    </div>
                  );
                })}

                {fields.length < 20 && (
                  <button
                    type="button"
                    onClick={() => append({ ...emptyChange })}
                    className="w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={14} /> {t.addChange}
                  </button>
                )}

                {typeof errors.changes?.message === "string" && (
                  <p className="text-xs text-red-500">{err(errors.changes.message)}</p>
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
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
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
