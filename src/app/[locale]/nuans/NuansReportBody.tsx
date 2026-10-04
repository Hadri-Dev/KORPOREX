"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, HelpCircle, ShieldCheck, Mail, Clock, FileCheck, ArrowDown } from "lucide-react";
import {
  nuansReportRequestSchema,
  type NuansReportRequest,
  type NuansJurisdiction,
  NUANS_JURISDICTIONS,
  NUANS_REPORT,
  nuansSubtotal,
} from "@/lib/nuansReport";
import { Field, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import { getTaxRate } from "@/lib/pricing";

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

// Ontario is the default: it is where most orders are filed. Customers can use
// the "Add another name" button to append more rows.
const initialRow = {
  proposedName: "",
  distinctiveTerm: "",
  jurisdiction: "ontario" as NuansJurisdiction,
};

// The jurisdictions that actually ask for a supplied report come first, then
// the rest alphabetically.
const PRIORITY: NuansJurisdiction[] = ["ontario", "alberta", "federal", "new_brunswick"];
const ORDERED_JURISDICTIONS = [
  ...PRIORITY.map((v) => NUANS_JURISDICTIONS.find((j) => j.value === v)!),
  ...NUANS_JURISDICTIONS.filter((j) => !PRIORITY.includes(j.value)),
];

type Lang = "en" | "fr" | "es";

const JURISDICTION_LABELS: Record<Exclude<Lang, "en">, Partial<Record<NuansJurisdiction, string>>> = {
  fr: {
    federal: "Fédéral",
    british_columbia: "Colombie-Britannique",
    new_brunswick: "Nouveau-Brunswick",
    newfoundland_labrador: "Terre-Neuve-et-Labrador",
    nova_scotia: "Nouvelle-Écosse",
    northwest_territories: "Territoires du Nord-Ouest",
    prince_edward_island: "Île-du-Prince-Édouard",
  },
  es: {
    federal: "Federal",
    british_columbia: "Columbia Británica",
    new_brunswick: "Nuevo Brunswick",
    newfoundland_labrador: "Terranova y Labrador",
    nova_scotia: "Nueva Escocia",
    northwest_territories: "Territorios del Noroeste",
    prince_edward_island: "Isla del Príncipe Eduardo",
  },
};

const COPY = {
  en: {
    h1: "Order a NUANS Report Online",
    intro:
      "Official NUANS reports for Ontario, Alberta and federal filings, run by our team and emailed to you as a PDF within a few hours. Ontario, Alberta and New Brunswick require a NUANS report to incorporate a named corporation, and Corporations Canada requires one for federal revivals and amalgamations. For a new federal incorporation the name search is built into the online application, so a report there is an optional check before you commit to a name.",
    perName: "+ HST per proposed name",
    noAccount: "No account or membership. Several names per order, ideal for law firms and accountants.",
    start: "Start your order",
    trust: ["Official, fileable NUANS report", "Reference number on every report", "Delivered within a few hours", "PDF emailed to you"],
    guideH2: "How to enter your proposed name",
    guideIntro:
      "Type the name exactly as you intend to file it, then pick the jurisdiction the corporation will be filed in. Each report is weighted for the jurisdiction you choose, so an Ontario incorporation needs Ontario selected, and an Alberta incorporation needs Alberta.",
    provH3: "Ontario, Alberta and other provincial filings",
    provBody:
      "Enter the name exactly as it will appear on the certificate of incorporation, including the legal ending. Abbreviated endings such as Inc., Ltd. or Corp. end with a period. Ontario requires the name on your articles to be identical to the name searched.",
    fedH3: "Federal filings (CBCA)",
    fedBody:
      "Leave the legal ending off your search term. NUANS compares only the distinctive element of a federal name; including the suffix dilutes the match score and can cause valid names to be flagged.",
    endingsH3: "Acceptable legal endings",
    endingsBody:
      "Corp., Corporation, Inc., Incorporated, Incorporée, Ltd., Ltée, Limited, Limitée, plus their French-language equivalents where the jurisdiction permits French wording.",
    namesH2: "Your proposed names",
    namesBody:
      "List one proposed corporate name per row, at $39.99 + HST each. Each name gets its own official NUANS report with its own reference number, and all the reports arrive together in a single PDF sent straight to your inbox.",
    colName: "Proposed Name",
    colTerm: "Distinctive Term",
    colJur: "Jurisdiction",
    termHelp:
      "The distinctive element is the unique part of your name (for example, in 'Maple Ridge Logistics Inc.' the distinctive element is 'Maple Ridge'). NUANS compares this against the database.",
    remove: "Remove row",
    nameN: "Name",
    labelName: "Proposed name",
    labelTerm: "Distinctive term",
    phName: "e.g. Maple Ridge Logistics Inc.",
    phTerm: "e.g. Maple Ridge",
    add: "Add another name",
    max: "Maximum of 10 names per order.",
    contactH2: "Contact information",
    contactBody: "The PDF report is emailed to the address below within a few hours of payment.",
    first: "First name *",
    last: "Last name *",
    email: "Email *",
    phone: "Phone *",
    role: "Your role",
    roleHint: "Optional. For example: founder, lawyer, law clerk, accountant.",
    billingH2: "Billing",
    billingBody: "Tax is calculated based on the billing province.",
    billingName: "Billing name *",
    billingNameHint: "Name on the credit or debit card.",
    billingAddr: "Billing address",
    summary: "Order summary",
    firstName: "(first name)",
    additional: "Additional names",
    subtotal: "Subtotal",
    tax: "Tax",
    yourProvince: "your province",
    total: "Total (CAD)",
    submitting: "Redirecting to Stripe…",
    submit: "Continue to Payment",
    stripe:
      "Payment is processed securely by Stripe. Card details never touch our server. After payment you'll receive a Stripe receipt and the PDF report by email within a few hours.",
    notAdviceLead: "Not legal advice.",
    notAdvice:
      "A NUANS report is a database search, not an opinion on whether your name will be accepted or whether it infringes a trademark. Korporex is a document preparation and filing service, not a law firm.",
    failed: "Submission failed.",
  },
  fr: {
    h1: "Commander un rapport NUANS en ligne",
    intro:
      "Des rapports NUANS officiels pour les dépôts en Ontario, en Alberta et au fédéral, produits par notre équipe et envoyés en PDF par courriel en quelques heures. L'Ontario, l'Alberta et le Nouveau-Brunswick exigent un rapport NUANS pour constituer une société nominative, et Corporations Canada en exige un pour les reconstitutions et fusions fédérales. Pour une nouvelle constitution fédérale, la recherche de nom est intégrée à la demande en ligne; un rapport y est donc une vérification facultative avant de choisir un nom.",
    perName: "+ TVH par nom proposé",
    noAccount: "Sans compte ni adhésion. Plusieurs noms par commande, idéal pour les cabinets d'avocats et les comptables.",
    start: "Commencer ma commande",
    trust: ["Rapport NUANS officiel, prêt à déposer", "Numéro de référence sur chaque rapport", "Livré en quelques heures", "PDF envoyé par courriel"],
    guideH2: "Comment inscrire le nom proposé",
    guideIntro:
      "Inscrivez le nom exactement comme vous comptez le déposer, puis choisissez le territoire où la société sera constituée. Chaque rapport est pondéré pour le territoire choisi : une constitution en Ontario exige de sélectionner l'Ontario, et une constitution en Alberta, l'Alberta.",
    provH3: "Dépôts en Ontario, en Alberta et dans les autres provinces",
    provBody:
      "Inscrivez le nom exactement tel qu'il figurera sur le certificat de constitution, élément juridique compris. Les abréviations comme Inc., Ltée ou Corp. se terminent par un point. L'Ontario exige que le nom des statuts soit identique au nom recherché.",
    fedH3: "Dépôts fédéraux (LCSA)",
    fedBody:
      "N'incluez pas l'élément juridique dans le terme recherché. NUANS ne compare que l'élément distinctif d'un nom fédéral; ajouter le suffixe dilue le résultat et peut signaler à tort des noms valides.",
    endingsH3: "Éléments juridiques acceptés",
    endingsBody:
      "Corp., Corporation, Inc., Incorporated, Incorporée, Ltd., Ltée, Limited, Limitée, ainsi que leurs équivalents français lorsque le territoire permet un libellé en français.",
    namesH2: "Vos noms proposés",
    namesBody:
      "Inscrivez un nom proposé par ligne, à 39,99 $ + TVH chacun. Chaque nom obtient son propre rapport NUANS officiel avec son propre numéro de référence, et tous les rapports vous parviennent ensemble dans un seul PDF envoyé par courriel.",
    colName: "Nom proposé",
    colTerm: "Élément distinctif",
    colJur: "Territoire",
    termHelp:
      "L'élément distinctif est la partie unique du nom (par exemple, dans « Logistique Maple Ridge Inc. », c'est « Maple Ridge »). NUANS compare cet élément à la base de données.",
    remove: "Retirer la ligne",
    nameN: "Nom",
    labelName: "Nom proposé",
    labelTerm: "Élément distinctif",
    phName: "ex. Logistique Maple Ridge Inc.",
    phTerm: "ex. Maple Ridge",
    add: "Ajouter un autre nom",
    max: "Maximum de 10 noms par commande.",
    contactH2: "Coordonnées",
    contactBody: "Le rapport PDF est envoyé à l'adresse ci-dessous dans les quelques heures suivant le paiement.",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel *",
    phone: "Téléphone *",
    role: "Votre rôle",
    roleHint: "Facultatif. Par exemple : fondateur, avocat, technicien juridique, comptable.",
    billingH2: "Facturation",
    billingBody: "La taxe est calculée selon la province de facturation.",
    billingName: "Nom de facturation *",
    billingNameHint: "Nom figurant sur la carte de crédit ou de débit.",
    billingAddr: "Adresse de facturation",
    summary: "Résumé de la commande",
    firstName: "(premier nom)",
    additional: "Noms supplémentaires",
    subtotal: "Sous-total",
    tax: "Taxe",
    yourProvince: "votre province",
    total: "Total (CAD)",
    submitting: "Redirection vers Stripe…",
    submit: "Passer au paiement",
    stripe:
      "Le paiement est traité en toute sécurité par Stripe. Les données de carte ne transitent jamais par notre serveur. Après le paiement, vous recevrez un reçu Stripe et le rapport PDF par courriel en quelques heures.",
    notAdviceLead: "Ceci n'est pas un avis juridique.",
    notAdvice:
      "Un rapport NUANS est une recherche dans une base de données, et non une opinion sur l'acceptation de votre nom ou sur la contrefaçon d'une marque de commerce. Korporex est un service de préparation et de dépôt de documents, et non un cabinet d'avocats.",
    failed: "L'envoi a échoué.",
  },
  es: {
    h1: "Pida un informe NUANS en línea",
    intro:
      "Informes NUANS oficiales para trámites en Ontario, Alberta y a nivel federal, generados por nuestro equipo y enviados en PDF por correo electrónico en pocas horas. Ontario, Alberta y Nuevo Brunswick exigen un informe NUANS para constituir una sociedad con nombre, y Corporations Canada lo exige para reactivaciones y fusiones federales. Para una nueva constitución federal, la búsqueda de nombre está integrada en la solicitud en línea, así que allí el informe es una comprobación opcional antes de elegir un nombre.",
    perName: "+ HST por nombre propuesto",
    noAccount: "Sin cuenta ni membresía. Varios nombres por pedido, ideal para despachos de abogados y contadores.",
    start: "Empezar mi pedido",
    trust: ["Informe NUANS oficial, listo para presentar", "Número de referencia en cada informe", "Entrega en pocas horas", "PDF enviado por correo"],
    guideH2: "Cómo escribir el nombre propuesto",
    guideIntro:
      "Escriba el nombre exactamente como piensa presentarlo y elija la jurisdicción donde se constituirá la sociedad. Cada informe se pondera para la jurisdicción elegida: una constitución en Ontario requiere seleccionar Ontario, y una en Alberta, Alberta.",
    provH3: "Trámites en Ontario, Alberta y otras provincias",
    provBody:
      "Escriba el nombre exactamente como aparecerá en el certificado de constitución, incluido el elemento legal. Las abreviaturas como Inc., Ltd. o Corp. terminan en punto. Ontario exige que el nombre de los estatutos sea idéntico al nombre buscado.",
    fedH3: "Trámites federales (CBCA)",
    fedBody:
      "No incluya el elemento legal en el término de búsqueda. NUANS compara solo el elemento distintivo de un nombre federal; añadir el sufijo diluye el resultado y puede marcar por error nombres válidos.",
    endingsH3: "Elementos legales aceptados",
    endingsBody:
      "Corp., Corporation, Inc., Incorporated, Incorporée, Ltd., Ltée, Limited, Limitée, además de sus equivalentes en francés cuando la jurisdicción lo permite.",
    namesH2: "Sus nombres propuestos",
    namesBody:
      "Indique un nombre propuesto por fila, a 39,99 $ + HST cada uno. Cada nombre recibe su propio informe NUANS oficial con su propio número de referencia, y todos los informes llegan juntos en un solo PDF enviado a su correo.",
    colName: "Nombre propuesto",
    colTerm: "Elemento distintivo",
    colJur: "Jurisdicción",
    termHelp:
      "El elemento distintivo es la parte única del nombre (por ejemplo, en 'Maple Ridge Logistics Inc.' es 'Maple Ridge'). NUANS lo compara con la base de datos.",
    remove: "Quitar fila",
    nameN: "Nombre",
    labelName: "Nombre propuesto",
    labelTerm: "Elemento distintivo",
    phName: "p. ej. Maple Ridge Logistics Inc.",
    phTerm: "p. ej. Maple Ridge",
    add: "Añadir otro nombre",
    max: "Máximo de 10 nombres por pedido.",
    contactH2: "Datos de contacto",
    contactBody: "El informe en PDF se envía a la dirección indicada en pocas horas tras el pago.",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico *",
    phone: "Teléfono *",
    role: "Su función",
    roleHint: "Opcional. Por ejemplo: fundador, abogado, asistente jurídico, contador.",
    billingH2: "Facturación",
    billingBody: "El impuesto se calcula según la provincia de facturación.",
    billingName: "Nombre de facturación *",
    billingNameHint: "Nombre que figura en la tarjeta de crédito o débito.",
    billingAddr: "Dirección de facturación",
    summary: "Resumen del pedido",
    firstName: "(primer nombre)",
    additional: "Nombres adicionales",
    subtotal: "Subtotal",
    tax: "Impuesto",
    yourProvince: "su provincia",
    total: "Total (CAD)",
    submitting: "Redirigiendo a Stripe…",
    submit: "Continuar al pago",
    stripe:
      "El pago se procesa de forma segura con Stripe. Los datos de la tarjeta nunca pasan por nuestro servidor. Tras el pago recibirá un recibo de Stripe y el informe en PDF por correo en pocas horas.",
    notAdviceLead: "No es asesoramiento legal.",
    notAdvice:
      "Un informe NUANS es una búsqueda en una base de datos, no una opinión sobre si su nombre será aceptado o si infringe una marca. Korporex es un servicio de preparación y presentación de documentos, no un despacho de abogados.",
    failed: "No se pudo enviar.",
  },
} as const;

export default function NuansReportBody() {
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const jurisdictionLabel = (value: NuansJurisdiction, label: string) =>
    lang === "en" ? label : (JURISDICTION_LABELS[lang][value] ?? label);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<NuansReportRequest>({
    resolver: zodResolver(nuansReportRequestSchema),
    mode: "onTouched",
    defaultValues: {
      rows: [{ ...initialRow }],
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

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "rows" });

  async function onSubmit(data: NuansReportRequest) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/nuans-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
  const rowCount = fields.length;
  const additionalCount = Math.max(0, rowCount - 1);
  const additionalTotal = NUANS_REPORT.additionalPrice * additionalCount;
  const subtotal = nuansSubtotal(rowCount);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const trustIcons = [ShieldCheck, FileCheck, Clock, Mail];

  return (
    <FormProvider {...form}>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-5">{t.h1}</h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">{t.intro}</p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-serif text-3xl md:text-4xl font-bold text-gold-500">
              ${NUANS_REPORT.basePrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-300">{t.perName}</span>
          </div>
          <p className="mt-2 text-sm text-gray-300">{t.noAccount}</p>
          <a
            href="#order"
            className="mt-6 inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-semibold py-3 px-6 text-sm tracking-wide hover:bg-gold-400 transition-colors"
          >
            {t.start} <ArrowDown size={16} />
          </a>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-300">
            {t.trust.map((label, i) => {
              const Icon = trustIcons[i];
              return (
                <span key={label} className="flex items-center gap-2">
                  <Icon size={16} className="text-gold-500" />
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guidance */}
      <section className="bg-cream-50 border-b border-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">{t.guideH2}</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">{t.guideIntro}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h3 className="font-serif text-base font-bold text-navy-900 mb-2">{t.provH3}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{t.provBody}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h3 className="font-serif text-base font-bold text-navy-900 mb-2">{t.fedH3}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{t.fedBody}</p>
            </div>
          </div>
          <div className="mt-5 bg-white border border-gray-200 rounded-md p-5">
            <h3 className="font-serif text-base font-bold text-navy-900 mb-2">{t.endingsH3}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{t.endingsBody}</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* ── Names table ────────────────────────────────────────────── */}
            {/* Visually elevated card so the "proposed names" step reads as
                the headline action on the page. Cream bg + thick gold-500
                left stripe + subtle shadow + slightly larger title. */}
            <div
              id="order"
              className="scroll-mt-24 relative bg-cream-50 border border-gray-200 border-l-4 border-l-gold-500 rounded-lg shadow-sm p-5 md:p-8"
            >
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2">{t.namesH2}</h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{t.namesBody}</p>

              {/* Single responsive layout: stacked card on mobile, table-style
                  grid on md+. Rendered ONCE so every form path is registered
                  with react-hook-form exactly once per row. White inner bg
                  keeps the inputs legible against the cream card. */}
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                {/* Column headers (md+ only) */}
                <div className="hidden md:grid grid-cols-[1.6fr_1.4fr_1.4fr_44px] gap-3 bg-navy-900 px-4 py-3 text-xs font-bold tracking-[0.08em] uppercase text-white">
                  <div>
                    {t.colName}
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>
                      {t.colTerm}
                      <span className="text-red-500 ml-0.5">*</span>
                    </span>
                    <span title={t.termHelp} className="cursor-help text-gray-400">
                      <HelpCircle size={13} />
                    </span>
                  </div>
                  <div>
                    {t.colJur}
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="sr-only">{t.remove}</div>
                </div>

                {fields.map((field, i) => {
                  const rowErr = errors.rows?.[i];
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-[1.6fr_1.4fr_1.4fr_44px] gap-x-3 gap-y-3 px-4 py-4 md:py-3 border-t border-gray-100 md:items-start first:border-t-0 md:first:border-t"
                    >
                      {/* Row label on mobile only */}
                      <div className="md:hidden flex items-center justify-between -mb-1">
                        <span className="text-xs font-bold tracking-[0.08em] uppercase text-navy-900">
                          {t.nameN} #{i + 1}
                        </span>
                      </div>

                      {/* Proposed Name */}
                      <div>
                        <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                          {t.labelName}
                          <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          {...register(`rows.${i}.proposedName`)}
                          className={iCls}
                          placeholder={t.phName}
                        />
                        {rowErr?.proposedName?.message && (
                          <p className="text-xs text-red-500 mt-1">{rowErr.proposedName.message}</p>
                        )}
                      </div>

                      {/* Distinctive Term */}
                      <div>
                        <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                          {t.labelTerm}
                          <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          {...register(`rows.${i}.distinctiveTerm`)}
                          className={iCls}
                          placeholder={t.phTerm}
                        />
                        {rowErr?.distinctiveTerm?.message && (
                          <p className="text-xs text-red-500 mt-1">{rowErr.distinctiveTerm.message}</p>
                        )}
                      </div>

                      {/* Jurisdiction */}
                      <div>
                        <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                          {t.colJur}
                          <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <select {...register(`rows.${i}.jurisdiction`)} className={sCls}>
                          {ORDERED_JURISDICTIONS.map((j) => (
                            <option key={j.value} value={j.value}>
                              {jurisdictionLabel(j.value, j.label)}
                            </option>
                          ))}
                        </select>
                        {rowErr?.jurisdiction?.message && (
                          <p className="text-xs text-red-500 mt-1">{rowErr.jurisdiction.message}</p>
                        )}
                      </div>

                      {/* Remove-row button */}
                      <div className="flex md:block justify-end">
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          disabled={fields.length === 1}
                          aria-label={`${t.remove} ${i + 1}`}
                          className="md:self-center text-gray-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:hover:text-gray-400 disabled:cursor-not-allowed p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {typeof errors.rows?.message === "string" && (
                <p className="text-xs text-red-500 mt-3">{errors.rows.message}</p>
              )}

              <button
                type="button"
                onClick={() => append({ ...initialRow })}
                disabled={fields.length >= 10}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 bg-white border-2 border-dashed border-navy-900/30 hover:border-gold-500 hover:text-gold-600 hover:bg-gold-500/5 transition-colors px-5 py-3 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} /> {t.add}
              </button>
              {fields.length >= 10 && <p className="text-xs text-gray-500 mt-2">{t.max}</p>}
            </div>

            {/* ── Contact ────────────────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-10">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">{t.contactH2}</h2>
              <p className="text-sm text-gray-500 mb-6">{t.contactBody}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={t.first} error={errors.contact?.contactFirstName?.message}>
                  <input type="text" {...register("contact.contactFirstName")} className={iCls} />
                </Field>
                <Field label={t.last} error={errors.contact?.contactLastName?.message}>
                  <input type="text" {...register("contact.contactLastName")} className={iCls} />
                </Field>
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
            </div>

            {/* ── Billing ────────────────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-10">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">{t.billingH2}</h2>
              <p className="text-sm text-gray-500 mb-6">{t.billingBody}</p>
              <Field label={t.billingName} error={errors.billingName?.message} hint={t.billingNameHint}>
                <input type="text" {...register("billingName")} className={iCls} />
              </Field>
              <div className="mt-4">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                  {t.billingAddr} <span className="text-red-500">*</span>
                </p>
                <AddressFields name="billingAddress" errors={errors.billingAddress} canadaOnly={false} />
              </div>
            </div>

            {/* ── Summary + submit ───────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-10">
              <div className="border border-gray-200 rounded-lg bg-cream-50 p-5">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">{t.summary}</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {NUANS_REPORT.label} {t.firstName}
                    </span>
                    <span className="text-gray-900">${NUANS_REPORT.basePrice.toFixed(2)}</span>
                  </div>
                  {additionalCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {t.additional} ({additionalCount} × ${NUANS_REPORT.additionalPrice.toFixed(2)})
                      </span>
                      <span className="text-gray-900">${additionalTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 text-xs pt-1">
                    <span>{t.subtotal}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>
                        {t.tax} ({(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}% · {region || t.yourProvince})
                      </span>
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
                <div className="mt-4 border border-red-200 bg-red-50 text-red-900 text-sm rounded-md p-3">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto md:px-12 mt-6 inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? t.submitting : t.submit}
              </button>
              <p className="text-xs text-gray-500 mt-3 max-w-md">{t.stripe}</p>
              <p className="text-xs text-gray-500 mt-2 max-w-md">
                <strong className="text-navy-900">{t.notAdviceLead}</strong> {t.notAdvice}
              </p>
            </div>
          </form>
        </div>
      </section>
    </FormProvider>
  );
}
