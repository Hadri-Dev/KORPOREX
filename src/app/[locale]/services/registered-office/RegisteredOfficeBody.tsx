"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  registeredOfficeSchema,
  type RegisteredOfficeSubmission,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES, computeRegisteredOfficeSubtotal } from "@/lib/businessUpdateServices";
import { getTaxRate, REG_OFFICE_OPTIONS, type RegOfficeLocation } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["registered-office"];

type Lang = "en" | "fr" | "es";

type LocationText = { title: string; subtitle: string; locationLabel: string; officeLabel: string; addressNote: string };

const COPY = {
  en: {
    h1: SERVICE.h1 ?? SERVICE.label,
    label: SERVICE.label,
    description: SERVICE.description,
    perYear: "/yr",
    or: "or",
    heroTail: ", billed annually in advance + applicable tax. Filing the change of registered office is included.",
    billedAnnually: "billed annually in advance + HST",
    steps: ["Office", "Corporation", "Contact", "Billing"],
    backToServices: "← Back to services",
    officeH2: "Choose an Office",
    officeIntro: "Pick the Korporex office that will serve as your corporation's registered office address.",
    locations: {
      korporex: {
        title: "Toronto",
        subtitle: "Downtown Toronto address chosen by Korporex. Mail scans emailed to you monthly.",
        locationLabel: REG_OFFICE_OPTIONS.korporex.locationLabel,
        officeLabel: REG_OFFICE_OPTIONS.korporex.label,
        addressNote:
          "Korporex selects and assigns the registered office address in downtown Toronto, at our discretion, before we file the change. The street address is not disclosed in advance.",
      },
      burlington: {
        title: "Burlington",
        subtitle: "Burlington, Ontario address chosen by Korporex. Mail scans emailed to you monthly.",
        locationLabel: REG_OFFICE_OPTIONS.burlington.locationLabel,
        officeLabel: REG_OFFICE_OPTIONS.burlington.label,
        addressNote: `Korporex provides a registered office address in ${REG_OFFICE_OPTIONS.burlington.locationLabel}, Ontario, chosen by Korporex. The specific street address is not disclosed in advance.`,
      },
    } satisfies Record<RegOfficeLocation, LocationText>,
    bulletResolution:
      "We prepare the resolution the move requires (a directors' resolution, or a special resolution of the shareholders when the office moves to a different municipality) and file the change of registered office with the registry.",
    bulletMail: "Monthly scanned copy of mail received at the address, emailed to you.",
    bulletPublic: "The Korporex address appears on the public corporate registry.",
    bulletFeePre: " CAD billed annually in advance, plus HST. ",
    nonRefundable: "Non-refundable",
    bulletFeePost: ", including if you move your registered office elsewhere before the term ends.",
    corpH2: "Your Corporation",
    corpIntro:
      "Tell us which corporation is moving its registered office. Copy the details from your Certificate and Articles of Incorporation.",
    federalConfirmPre: "I confirm my Articles of Incorporation name ",
    ontario: "Ontario",
    federalConfirmPost: " as the province of the registered office.",
    federalNote:
      "A federal corporation's registered office must be in the province named in its articles. If your articles name another province, an Articles of Amendment filing is needed first.",
    currentOffice: "Current registered office address",
    notes: "Notes",
    notesHint: "Optional. E.g. a preferred start date for the new address.",
    contactH2: "Contact",
    contactIntro: "Who should we reach out to about this order. Monthly mail scans are emailed to this address.",
    first: "First name *",
    last: "Last name *",
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
    summaryLinePre: "Registered office: ",
    summaryLinePost: " (12 months)",
    summaryNote: "12-month term, billed annually in advance. Includes filing the change of registered office.",
    tax: "Tax",
    yourProvince: "your province",
    total: "Total (CAD)",
    acceptPre: "I understand the annual fee is billed in advance for a 12-month term and is ",
    acceptNonRefundable: "non-refundable",
    acceptPost: ", and I authorize Korporex to file the change of registered office.",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe: "Payment is processed securely by Stripe. Card details never touch our server.",
    failed: "Submission failed.",
    errLocation: "Select an office location",
    errFederal:
      "A Korporex address can only be used if your articles name Ontario as the province of your registered office",
    errAccept: "Please confirm to continue",
  },
  fr: {
    h1: "Adresse du siège social à Toronto ou à Burlington",
    label: "Siège social",
    description:
      "Utilisez un bureau de Korporex au centre-ville de Toronto ou à Burlington comme adresse du siège social de votre société. Nous déposons le changement d'adresse du siège social auprès du registre et vous envoyons chaque mois par courriel une copie numérisée du courrier reçu à cette adresse. Facturé annuellement à l'avance.",
    perYear: "/an",
    or: "ou",
    heroTail: ", facturé annuellement à l'avance + taxes applicables. Le dépôt du changement d'adresse du siège social est inclus.",
    billedAnnually: "facturé annuellement à l'avance + TVH",
    steps: ["Bureau", "Société", "Contact", "Facturation"],
    backToServices: "← Retour aux services",
    officeH2: "Choisissez un bureau",
    officeIntro: "Choisissez le bureau de Korporex qui servira d'adresse du siège social de votre société.",
    locations: {
      korporex: {
        title: "Toronto",
        subtitle: "Adresse au centre-ville de Toronto choisie par Korporex. Numérisations du courrier envoyées par courriel chaque mois.",
        locationLabel: "Centre-ville de Toronto",
        officeLabel: "Siège social Korporex",
        addressNote:
          "Korporex choisit et attribue l'adresse du siège social au centre-ville de Toronto, à sa discrétion, avant de déposer le changement. L'adresse municipale n'est pas communiquée à l'avance.",
      },
      burlington: {
        title: "Burlington",
        subtitle: "Adresse à Burlington (Ontario) choisie par Korporex. Numérisations du courrier envoyées par courriel chaque mois.",
        locationLabel: "Burlington",
        officeLabel: "Siège social Korporex",
        addressNote:
          "Korporex fournit une adresse de siège social à Burlington (Ontario), choisie par Korporex. L'adresse municipale précise n'est pas communiquée à l'avance.",
      },
    } satisfies Record<RegOfficeLocation, LocationText>,
    bulletResolution:
      "Nous préparons la résolution qu'exige le déménagement (une résolution des administrateurs, ou une résolution spéciale des actionnaires lorsque le siège social déménage dans une autre municipalité) et déposons le changement d'adresse du siège social auprès du registre.",
    bulletMail: "Copie numérisée mensuelle du courrier reçu à l'adresse, envoyée par courriel.",
    bulletPublic: "L'adresse de Korporex figure au registre public des sociétés.",
    bulletFeePre: " CAD facturés annuellement à l'avance, plus la TVH. ",
    nonRefundable: "Non remboursable",
    bulletFeePost: ", y compris si vous déménagez votre siège social ailleurs avant la fin de la période.",
    corpH2: "Votre société",
    corpIntro:
      "Indiquez-nous quelle société déménage son siège social. Reprenez les renseignements figurant sur votre certificat et vos statuts constitutifs.",
    federalConfirmPre: "Je confirme que mes statuts constitutifs désignent l'",
    ontario: "Ontario",
    federalConfirmPost: " comme province du siège social.",
    federalNote:
      "En vertu de la Loi canadienne sur les sociétés par actions, le siège social d'une société fédérale doit se trouver dans la province indiquée dans ses statuts. Si vos statuts désignent une autre province, des statuts de modification sont d'abord nécessaires.",
    currentOffice: "Adresse actuelle du siège social",
    notes: "Remarques",
    notesHint: "Facultatif. p. ex. une date de début souhaitée pour la nouvelle adresse.",
    contactH2: "Contact",
    contactIntro: "La personne à joindre au sujet de cette commande. Les numérisations mensuelles du courrier sont envoyées à cette adresse courriel.",
    first: "Prénom *",
    last: "Nom de famille *",
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
    summaryLinePre: "Siège social : ",
    summaryLinePost: " (12 mois)",
    summaryNote: "Période de 12 mois, facturée annuellement à l'avance. Comprend le dépôt du changement d'adresse du siège social.",
    tax: "Taxe",
    yourProvince: "votre province",
    total: "Total (CAD)",
    acceptPre: "Je comprends que les frais annuels sont facturés à l'avance pour une période de 12 mois et sont ",
    acceptNonRefundable: "non remboursables",
    acceptPost: ", et j'autorise Korporex à déposer le changement d'adresse du siège social.",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe: "Le paiement est traité de façon sécurisée par Stripe. Les données de votre carte ne transitent jamais par notre serveur.",
    failed: "L'envoi a échoué.",
    errLocation: "Sélectionnez un bureau",
    errFederal:
      "Une adresse de Korporex ne peut être utilisée que si vos statuts désignent l'Ontario comme province de votre siège social",
    errAccept: "Veuillez confirmer pour continuer",
  },
  es: {
    h1: "Domicilio social en Toronto o Burlington",
    label: "Domicilio social",
    description:
      "Utilice una oficina de Korporex en el centro de Toronto o en Burlington como domicilio social de su corporación. Presentamos el cambio de domicilio social ante el registro y le enviamos cada mes por correo electrónico una copia escaneada de la correspondencia recibida en esa dirección. Se factura anualmente por adelantado.",
    perYear: "/año",
    or: "o",
    heroTail: ", facturado anualmente por adelantado + impuestos aplicables. Incluye la presentación del cambio de domicilio social.",
    billedAnnually: "facturado anualmente por adelantado + HST",
    steps: ["Oficina", "Corporación", "Contacto", "Facturación"],
    backToServices: "← Volver a los servicios",
    officeH2: "Elija una oficina",
    officeIntro: "Elija la oficina de Korporex que servirá como domicilio social de su corporación.",
    locations: {
      korporex: {
        title: "Toronto",
        subtitle: "Dirección en el centro de Toronto elegida por Korporex. Correspondencia escaneada enviada por correo electrónico cada mes.",
        locationLabel: "Centro de Toronto",
        officeLabel: "Domicilio social Korporex",
        addressNote:
          "Korporex elige y asigna el domicilio social en el centro de Toronto, a su criterio, antes de presentar el cambio. La dirección exacta no se informa por adelantado.",
      },
      burlington: {
        title: "Burlington",
        subtitle: "Dirección en Burlington, Ontario, elegida por Korporex. Correspondencia escaneada enviada por correo electrónico cada mes.",
        locationLabel: "Burlington",
        officeLabel: "Domicilio social Korporex",
        addressNote:
          "Korporex proporciona un domicilio social en Burlington, Ontario, elegido por Korporex. La dirección exacta no se informa por adelantado.",
      },
    } satisfies Record<RegOfficeLocation, LocationText>,
    bulletResolution:
      "Preparamos la resolución que requiere el traslado (una resolución de los directores, o una resolución especial de los accionistas cuando el domicilio se traslada a otro municipio) y presentamos el cambio de domicilio social ante el registro.",
    bulletMail: "Copia escaneada mensual de la correspondencia recibida en la dirección, enviada por correo electrónico.",
    bulletPublic: "La dirección de Korporex figura en el registro público de corporaciones.",
    bulletFeePre: " CAD facturados anualmente por adelantado, más HST. ",
    nonRefundable: "No reembolsable",
    bulletFeePost: ", incluso si traslada su domicilio social a otro lugar antes de que finalice el plazo.",
    corpH2: "Su corporación",
    corpIntro:
      "Indíquenos qué corporación traslada su domicilio social. Copie los datos de su certificado y de sus estatutos de constitución.",
    federalConfirmPre: "Confirmo que mis estatutos de constitución designan ",
    ontario: "Ontario",
    federalConfirmPost: " como la provincia del domicilio social.",
    federalNote:
      "El domicilio social de una corporación federal debe estar en la provincia indicada en sus estatutos. Si sus estatutos indican otra provincia, primero es necesario presentar estatutos de modificación.",
    currentOffice: "Domicilio social actual",
    notes: "Notas",
    notesHint: "Opcional. P. ej., una fecha de inicio preferida para la nueva dirección.",
    contactH2: "Contacto",
    contactIntro: "La persona con quien debemos comunicarnos sobre este pedido. La correspondencia escaneada mensual se envía a este correo electrónico.",
    first: "Nombre *",
    last: "Apellido *",
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
    summaryLinePre: "Domicilio social: ",
    summaryLinePost: " (12 meses)",
    summaryNote: "Plazo de 12 meses, facturado anualmente por adelantado. Incluye la presentación del cambio de domicilio social.",
    tax: "Impuesto",
    yourProvince: "su provincia",
    total: "Total (CAD)",
    acceptPre: "Entiendo que la tarifa anual se factura por adelantado por un plazo de 12 meses y que es ",
    acceptNonRefundable: "no reembolsable",
    acceptPost: ", y autorizo a Korporex a presentar el cambio de domicilio social.",
    submitting: "Redirigiendo a Stripe…",
    submit: "Continuar al pago",
    stripe: "El pago se procesa de forma segura a través de Stripe. Los datos de su tarjeta nunca pasan por nuestro servidor.",
    failed: "No se pudo enviar la solicitud.",
    errLocation: "Seleccione una oficina",
    errFederal:
      "Solo se puede usar una dirección de Korporex si sus estatutos designan Ontario como la provincia de su domicilio social",
    errAccept: "Confirme para continuar",
  },
} as const;

type Copy = (typeof COPY)[Lang];

// Schema messages for the fields rendered directly on this page, translated for
// display only. The schema itself is unchanged; unknown messages pass through.
function localizeError(t: Copy, message: string | undefined): string | undefined {
  if (!message) return message;
  if (message === COPY.en.errLocation) return t.errLocation;
  if (message === COPY.en.errFederal) return t.errFederal;
  if (message === COPY.en.errAccept) return t.errAccept;
  return message;
}

const STEP_FIELDS: string[][] = [
  ["location"],
  ["corporation", "currentRegisteredOffice", "federalArticlesOntario", "notes"],
  ["contact"],
  ["billingName", "billingAddress", "acceptTerms"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

const LOCATIONS: RegOfficeLocation[] = ["korporex", "burlington"];

function LocationOption({ selected, onSelect, location, t }: {
  selected: boolean;
  onSelect: () => void;
  location: RegOfficeLocation;
  t: Copy;
}) {
  const opt = REG_OFFICE_OPTIONS[location];
  const copy = t.locations[location];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left border-2 p-4 transition-colors ${
        selected ? "border-navy-900 bg-navy-50" : "border-gold-200 bg-white hover:border-navy-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`font-medium text-sm ${selected ? "text-navy-900" : "text-gray-900"}`}>{copy.title}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{copy.subtitle}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-sm font-semibold ${selected ? "text-navy-900" : "text-gray-900"}`}>
            ${opt.annual.toFixed(2)}{t.perYear}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">{t.billedAnnually}</p>
        </div>
      </div>
    </button>
  );
}

export default function RegisteredOfficeBody() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const form = useForm<RegisteredOfficeSubmission>({
    resolver: zodResolver(registeredOfficeSchema),
    mode: "onTouched",
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      location: undefined as any,
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      currentRegisteredOffice: { ...emptyAddress },
      federalArticlesOntario: false,
      notes: "",
      contact: {
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        contactRole: "",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acceptTerms: false as any,
      billingName: "",
      billingAddress: { ...emptyAddress },
    },
  });

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const location = watch("location");
  const jurisdiction = watch("corporation.jurisdiction");

  async function gotoStep(next: number) {
    const fields = STEP_FIELDS[step - 1];
    if (fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: RegisteredOfficeSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "registered-office", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? t.failed);
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.failed);
      setSubmitting(false);
    }
  }

  const opt = location ? REG_OFFICE_OPTIONS[location] : null;
  const locText = location ? t.locations[location] : null;
  const subtotal = location ? computeRegisteredOfficeSubtotal(location) : 0;
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const locationError = localizeError(t, errors.location?.message);
  const federalError = localizeError(t, errors.federalArticlesOntario?.message);
  const acceptError = localizeError(t, errors.acceptTerms?.message);

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{t.h1}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">
              Burlington ${REG_OFFICE_OPTIONS.burlington.annual.toFixed(2)}{t.perYear}
            </span>{" "}
            {t.or}{" "}
            <span className="font-semibold text-navy-900">
              Toronto ${REG_OFFICE_OPTIONS.korporex.annual.toFixed(2)}{t.perYear}
            </span>
            {t.heroTail}
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.officeH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.officeIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <div className="space-y-3">
                  {LOCATIONS.map((loc) => (
                    <LocationOption
                      key={loc}
                      location={loc}
                      t={t}
                      selected={location === loc}
                      onSelect={() => setValue("location", loc, { shouldValidate: true })}
                    />
                  ))}
                  {locationError && <p className="text-xs text-red-500">{locationError}</p>}
                </div>

                {opt && locText && (
                  <div className="bg-navy-50 border border-navy-900 rounded-lg p-4 text-sm text-navy-900 leading-relaxed">
                    <p className="font-semibold mb-1">
                      {locText.officeLabel} - {locText.locationLabel}
                    </p>
                    <p className="text-gray-700">{locText.addressNote}</p>
                    <ul className="text-xs text-gray-700 mt-3 space-y-1.5 list-disc pl-5">
                      <li>{t.bulletResolution}</li>
                      <li>{t.bulletMail}</li>
                      <li>{t.bulletPublic}</li>
                      <li>
                        ${opt.annual.toFixed(2)}{t.bulletFeePre}<strong>{t.nonRefundable}</strong>{t.bulletFeePost}
                      </li>
                    </ul>
                  </div>
                )}
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.corpH2}</h2>
              <p className="text-gray-500 text-sm mb-8">{t.corpIntro}</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                {jurisdiction === "federal" && (
                  <div className="border border-gray-200 rounded-lg p-5">
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="checkbox" {...register("federalArticlesOntario")} className="mt-1 accent-navy-900" />
                      <span className="text-gray-800">
                        {t.federalConfirmPre}<strong>{t.ontario}</strong>{t.federalConfirmPost}{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.federalNote}</p>
                    {federalError && <p className="text-xs text-red-500 mt-2">{federalError}</p>}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.currentOffice} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="currentRegisteredOffice" errors={errors.currentRegisteredOffice} />
                </div>
                <Field label={t.notes} error={errors.notes?.message} hint={t.notesHint}>
                  <textarea {...register("notes")} rows={3} maxLength={2000} className={`${iCls} resize-none`} />
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
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
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

                {opt && locText && (
                  <div className="border border-gray-200 rounded-lg bg-cream-50 p-5 mt-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.summary}</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">{t.summaryLinePre}{locText.locationLabel}{t.summaryLinePost}</span>
                        <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500">{t.summaryNote}</p>
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
                )}

                <div className="border border-gray-200 rounded-lg p-5">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("acceptTerms")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-800">
                      {t.acceptPre}<strong>{t.acceptNonRefundable}</strong>{t.acceptPost}{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {acceptError && <p className="text-xs text-red-500 mt-2">{acceptError}</p>}
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
