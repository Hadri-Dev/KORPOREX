"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarClock, ScaleIcon, ShieldAlert, FileText, ArrowRight, CheckCircle, Upload, X } from "lucide-react";
import {
  legalConsultSchema,
  LEGAL_CONSULT_TOPICS,
  LEGAL_CONSULT_INCORP_STATUS,
  LEGAL_CONSULT_MAX_FILES,
  LEGAL_CONSULT_MAX_FILE_BYTES,
  LEGAL_CONSULT_ACCEPTED_MIMES,
  CALENDLY_LAWYER_URL,
  type LegalConsultTopic,
  type LegalConsultIncorpStatus,
} from "@/lib/legalConsult";
import { getLegalConsultPricing } from "@/lib/pricing";

// Drop the calendly slot fields from the client form schema; those are
// captured separately when the Calendly embed fires `event_scheduled` and
// merged into the API payload at submit time.
const formSchema = legalConsultSchema.omit({
  calendlyEventUri: true,
  calendlyInviteeUri: true,
  calendlyStartTime: true,
});
type FormValues = z.infer<typeof formSchema>;

type CalendlySlot = {
  eventUri: string;
  inviteeUri: string;
  startTime: string;
};

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    h1: "Need legal advice for your corporation?",
    intro:
      "Book a 30-minute consultation with an independent licensed lawyer from our trusted referral network. Get personalized answers about incorporation strategy, shareholder agreements, compliance, restructuring, and more.",
    badgeDuration: "30-minute consultation",
    badgeLawyer: "Independent corporate lawyer",
    plusTax: "+ HST",
    cadTotal: "CAD total",
    disclaimerStrong: "Korporex is not a law firm and does not provide legal advice.",
    disclaimerBody:
      "The consultation is provided by an independent licensed lawyer from our trusted referral network. Korporex’s role is limited to facilitating the introduction. No solicitor-client relationship is created with Korporex. The lawyer’s services are subject to their own engagement terms; the $150 fee covers the 30-minute consultation only.",
    formH2: "Tell us about your situation",
    formIntro: "The lawyer reviews this before your call so they can come prepared.",
    fullName: "Full Name *",
    phone: "Phone *",
    email: "Email Address *",
    incorpStatus: "Incorporation status *",
    statusLabels: {
      "Already incorporated": "Already incorporated",
      "Planning to incorporate": "Planning to incorporate",
      "Not sure yet": "Not sure yet",
    } as Record<LegalConsultIncorpStatus, string>,
    existingCorpName: "Existing Corporation Name",
    existingCorpNamePh: 'e.g. "Acme Technologies Inc."',
    jurisdiction: "Jurisdiction",
    jurisdictionHint: "Federal, Ontario, or other province",
    jurisdictionPh: "e.g. Ontario",
    incorpThroughKorporex: "I incorporated through Korporex.",
    topics: "What topics would you like to discuss? *",
    topicsHint: "Pick all that apply.",
    topicLabels: {
      "Incorporation strategy (jurisdiction, entity type)": "Incorporation strategy (jurisdiction, entity type)",
      "Articles of Incorporation / amendments": "Articles of Incorporation / amendments",
      "Shareholder agreements": "Shareholder agreements",
      "Director or officer responsibilities": "Director or officer responsibilities",
      "Corporate minute book / record-keeping": "Corporate minute book / record-keeping",
      "Annual returns / compliance": "Annual returns / compliance",
      "Restructuring or dissolution": "Restructuring or dissolution",
      "Corporate tax structuring": "Corporate tax structuring",
      "Cross-border or international shareholders": "Cross-border or international shareholders",
      "Other (describe below)": "Other (describe below)",
    } as Record<LegalConsultTopic, string>,
    description: "Briefly describe your situation *",
    descriptionHint: "A sentence or two is fine. The lawyer will go deeper on the call.",
    descriptionPh:
      "e.g. We're three co-founders looking at a federal incorporation with a vesting schedule and want to understand share-class options.",
    urgent: "This matter is urgent.",
    willShareDocs: "I have documents I’d like the lawyer to review.",
    uploadTitle: "Upload Documents (optional)",
    uploadHint: (max: number, mb: number) =>
      `PDF, JPG, or PNG. Up to ${max} files, ${mb} MB total. Files are emailed directly to the lawyer with your questionnaire.`,
    chooseFiles: "Choose Files",
    remove: "Remove",
    onlyTypes: "only PDF, JPG, PNG accepted.",
    totalOver: (mb: number) => `Total upload over ${mb} MB.`,
    notes: "Anything else the lawyer should know? (optional)",
    continueBooking: "Continue to Booking",
    backToQuestionnaire: "← Back to questionnaire",
    pickTimeH2: "Pick a time",
    pickTimeIntro: "Choose any 30-minute slot that works for you. After selecting, you’ll be redirected to checkout.",
    slotReserved: "Slot reserved",
    bookingTime: "Booking time:",
    seeCalendly: "(see Calendly notification)",
    continueSecure: "Continue to secure payment to confirm your consultation.",
    continuePayment: "Continue to Payment:",
    redirectPre: "You’ll be redirected to ",
    redirectPost: " to complete payment securely.",
    redirecting: "Redirecting to Stripe…",
    somethingWrong: "Something went wrong.",
    genericError: "Something went wrong. Please try again or email contact@korporex.ca.",
    tryAgain: "Try Again",
    orEmail: "Or email",
    footerStrong: "Need general help that isn’t legal advice?",
    footerEmail: "Email",
    footerOrCheck: "or check our",
    faq: "FAQ",
    footerFine:
      "Korporex is not a law firm. Lawyers in our referral network are independent professionals; their fees beyond the consultation are between them and you.",
  },
  fr: {
    h1: "Besoin de conseils juridiques pour votre société?",
    intro:
      "Réservez une consultation de 30 minutes avec un avocat autorisé indépendant de notre réseau de référence de confiance. Obtenez des réponses personnalisées sur la stratégie de constitution, les conventions entre actionnaires, la conformité, la restructuration et plus encore.",
    badgeDuration: "Consultation de 30 minutes",
    badgeLawyer: "Avocat en droit des sociétés indépendant",
    plusTax: "+ TVH",
    cadTotal: "CAD au total",
    disclaimerStrong: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques.",
    disclaimerBody:
      "La consultation est fournie par un avocat autorisé indépendant de notre réseau de référence de confiance. Le rôle de Korporex se limite à faciliter la mise en relation. Aucune relation avocat-client n'est créée avec Korporex. Les services de l'avocat sont assujettis à ses propres conditions de mandat; les frais de 150 $ couvrent uniquement la consultation de 30 minutes.",
    formH2: "Parlez-nous de votre situation",
    formIntro: "L'avocat examine ces renseignements avant votre appel afin d'être bien préparé.",
    fullName: "Nom complet *",
    phone: "Téléphone *",
    email: "Adresse courriel *",
    incorpStatus: "Statut de constitution *",
    statusLabels: {
      "Already incorporated": "Déjà constituée en société",
      "Planning to incorporate": "Constitution prévue",
      "Not sure yet": "Pas encore certain",
    } as Record<LegalConsultIncorpStatus, string>,
    existingCorpName: "Dénomination de la société existante",
    existingCorpNamePh: "p. ex. « Technologies Acme Inc. »",
    jurisdiction: "Territoire de constitution",
    jurisdictionHint: "Fédéral, Ontario ou autre province",
    jurisdictionPh: "p. ex. Ontario",
    incorpThroughKorporex: "J'ai constitué ma société par l'entremise de Korporex.",
    topics: "Quels sujets souhaitez-vous aborder? *",
    topicsHint: "Cochez tout ce qui s'applique.",
    topicLabels: {
      "Incorporation strategy (jurisdiction, entity type)": "Stratégie de constitution (territoire, type d'entité)",
      "Articles of Incorporation / amendments": "Statuts constitutifs / modifications",
      "Shareholder agreements": "Conventions entre actionnaires",
      "Director or officer responsibilities": "Responsabilités des administrateurs ou dirigeants",
      "Corporate minute book / record-keeping": "Livre de procès-verbaux / tenue des registres",
      "Annual returns / compliance": "Déclarations annuelles / conformité",
      "Restructuring or dissolution": "Restructuration ou dissolution",
      "Corporate tax structuring": "Planification fiscale de la société",
      "Cross-border or international shareholders": "Actionnaires transfrontaliers ou étrangers",
      "Other (describe below)": "Autre (décrivez ci-dessous)",
    } as Record<LegalConsultTopic, string>,
    description: "Décrivez brièvement votre situation *",
    descriptionHint: "Une phrase ou deux suffisent. L'avocat approfondira lors de l'appel.",
    descriptionPh:
      "p. ex. Nous sommes trois cofondateurs qui envisagent une constitution fédérale avec un calendrier d'acquisition des actions et voulons comprendre les options de catégories d'actions.",
    urgent: "Cette question est urgente.",
    willShareDocs: "J'ai des documents que j'aimerais faire examiner par l'avocat.",
    uploadTitle: "Téléverser des documents (facultatif)",
    uploadHint: (max: number, mb: number) =>
      `PDF, JPG ou PNG. Jusqu'à ${max} fichiers, ${mb} Mo au total. Les fichiers sont envoyés par courriel directement à l'avocat avec votre questionnaire.`,
    chooseFiles: "Choisir des fichiers",
    remove: "Retirer",
    onlyTypes: "seuls les formats PDF, JPG et PNG sont acceptés.",
    totalOver: (mb: number) => `Le téléversement total dépasse ${mb} Mo.`,
    notes: "Autre chose que l'avocat devrait savoir? (facultatif)",
    continueBooking: "Continuer vers la réservation",
    backToQuestionnaire: "← Retour au questionnaire",
    pickTimeH2: "Choisissez une plage horaire",
    pickTimeIntro:
      "Choisissez une plage de 30 minutes qui vous convient. Après votre sélection, vous serez redirigé vers le paiement.",
    slotReserved: "Plage réservée",
    bookingTime: "Heure du rendez-vous :",
    seeCalendly: "(voir l'avis de Calendly)",
    continueSecure: "Passez au paiement sécurisé pour confirmer votre consultation.",
    continuePayment: "Continuer vers le paiement :",
    redirectPre: "Vous serez redirigé vers ",
    redirectPost: " pour effectuer le paiement en toute sécurité.",
    redirecting: "Redirection vers Stripe…",
    somethingWrong: "Une erreur s'est produite.",
    genericError: "Une erreur s'est produite. Veuillez réessayer ou écrire à contact@korporex.ca.",
    tryAgain: "Réessayer",
    orEmail: "Ou écrivez à",
    footerStrong: "Besoin d'aide générale qui ne constitue pas un conseil juridique?",
    footerEmail: "Écrivez à",
    footerOrCheck: "ou consultez notre",
    faq: "FAQ",
    footerFine:
      "Korporex n'est pas un cabinet d'avocats. Les avocats de notre réseau de référence sont des professionnels indépendants; leurs honoraires au-delà de la consultation sont convenus entre eux et vous.",
  },
  es: {
    h1: "¿Necesita asesoramiento legal para su sociedad?",
    intro:
      "Reserve una consulta de 30 minutos con un abogado autorizado independiente de nuestra red de referencias de confianza. Obtenga respuestas personalizadas sobre estrategia de constitución, acuerdos de accionistas, cumplimiento, reestructuración y más.",
    badgeDuration: "Consulta de 30 minutos",
    badgeLawyer: "Abogado corporativo independiente",
    plusTax: "+ HST",
    cadTotal: "CAD en total",
    disclaimerStrong: "Korporex no es un bufete de abogados y no ofrece asesoramiento legal.",
    disclaimerBody:
      "La consulta la presta un abogado autorizado independiente de nuestra red de referencias de confianza. La función de Korporex se limita a facilitar la presentación. No se crea ninguna relación abogado-cliente con Korporex. Los servicios del abogado están sujetos a sus propios términos de contratación; la tarifa de $150 cubre únicamente la consulta de 30 minutos.",
    formH2: "Cuéntenos su situación",
    formIntro: "El abogado revisa esta información antes de su llamada para llegar preparado.",
    fullName: "Nombre completo *",
    phone: "Teléfono *",
    email: "Correo electrónico *",
    incorpStatus: "Estado de constitución *",
    statusLabels: {
      "Already incorporated": "Ya constituida",
      "Planning to incorporate": "Planeo constituir una sociedad",
      "Not sure yet": "Aún no estoy seguro",
    } as Record<LegalConsultIncorpStatus, string>,
    existingCorpName: "Nombre de la sociedad existente",
    existingCorpNamePh: 'p. ej. "Acme Technologies Inc."',
    jurisdiction: "Jurisdicción",
    jurisdictionHint: "Federal, Ontario u otra provincia",
    jurisdictionPh: "p. ej. Ontario",
    incorpThroughKorporex: "Constituí mi sociedad a través de Korporex.",
    topics: "¿Qué temas desea tratar? *",
    topicsHint: "Seleccione todos los que correspondan.",
    topicLabels: {
      "Incorporation strategy (jurisdiction, entity type)": "Estrategia de constitución (jurisdicción, tipo de entidad)",
      "Articles of Incorporation / amendments": "Estatutos de constitución / modificaciones",
      "Shareholder agreements": "Acuerdos de accionistas",
      "Director or officer responsibilities": "Responsabilidades de directores o funcionarios",
      "Corporate minute book / record-keeping": "Libro de actas / mantenimiento de registros",
      "Annual returns / compliance": "Declaraciones anuales / cumplimiento",
      "Restructuring or dissolution": "Reestructuración o disolución",
      "Corporate tax structuring": "Estructuración fiscal de la sociedad",
      "Cross-border or international shareholders": "Accionistas transfronterizos o internacionales",
      "Other (describe below)": "Otro (descríbalo abajo)",
    } as Record<LegalConsultTopic, string>,
    description: "Describa brevemente su situación *",
    descriptionHint: "Basta con una o dos frases. El abogado profundizará durante la llamada.",
    descriptionPh:
      "p. ej. Somos tres cofundadores que evaluamos una constitución federal con un calendario de adquisición de acciones y queremos entender las opciones de clases de acciones.",
    urgent: "Este asunto es urgente.",
    willShareDocs: "Tengo documentos que me gustaría que el abogado revisara.",
    uploadTitle: "Subir documentos (opcional)",
    uploadHint: (max: number, mb: number) =>
      `PDF, JPG o PNG. Hasta ${max} archivos, ${mb} MB en total. Los archivos se envían por correo electrónico directamente al abogado junto con su cuestionario.`,
    chooseFiles: "Elegir archivos",
    remove: "Quitar",
    onlyTypes: "solo se aceptan PDF, JPG y PNG.",
    totalOver: (mb: number) => `La carga total supera ${mb} MB.`,
    notes: "¿Algo más que el abogado deba saber? (opcional)",
    continueBooking: "Continuar con la reserva",
    backToQuestionnaire: "← Volver al cuestionario",
    pickTimeH2: "Elija un horario",
    pickTimeIntro:
      "Elija cualquier franja de 30 minutos que le convenga. Después de seleccionarla, se le redirigirá al pago.",
    slotReserved: "Horario reservado",
    bookingTime: "Hora de la cita:",
    seeCalendly: "(consulte la notificación de Calendly)",
    continueSecure: "Continúe al pago seguro para confirmar su consulta.",
    continuePayment: "Continuar al pago:",
    redirectPre: "Se le redirigirá a ",
    redirectPost: " para completar el pago de forma segura.",
    redirecting: "Redirigiendo a Stripe…",
    somethingWrong: "Algo salió mal.",
    genericError: "Algo salió mal. Inténtelo de nuevo o escriba a contact@korporex.ca.",
    tryAgain: "Intentar de nuevo",
    orEmail: "O escriba a",
    footerStrong: "¿Necesita ayuda general que no sea asesoramiento legal?",
    footerEmail: "Escriba a",
    footerOrCheck: "o consulte nuestras",
    faq: "preguntas frecuentes",
    footerFine:
      "Korporex no es un bufete de abogados. Los abogados de nuestra red de referencias son profesionales independientes; sus honorarios más allá de la consulta se acuerdan entre ellos y usted.",
  },
};

// Schema messages from legalConsultSchema (custom ones) plus zod defaults
// that can surface on this form.
const ERROR_TEXT: Record<Exclude<Lang, "en">, Record<string, string>> = {
  fr: {
    "Pick at least one topic": "Choisissez au moins un sujet",
    "Please describe your situation in a sentence or two": "Veuillez décrire votre situation en une phrase ou deux",
    "Invalid email": "Adresse courriel invalide",
    "Invalid email address": "Adresse courriel invalide",
    Required: "Champ obligatoire",
  },
  es: {
    "Pick at least one topic": "Elija al menos un tema",
    "Please describe your situation in a sentence or two": "Describa su situación en una o dos frases",
    "Invalid email": "Correo electrónico no válido",
    "Invalid email address": "Correo electrónico no válido",
    Required: "Campo obligatorio",
  },
};

const GENERIC_FIELD_ERROR: Record<Exclude<Lang, "en">, string> = {
  fr: "Ce champ est obligatoire ou invalide",
  es: "Este campo es obligatorio o no es válido",
};

function localizeError(lang: Lang, message: unknown): string | undefined {
  if (typeof message !== "string") return undefined;
  if (lang === "en") return message;
  return ERROR_TEXT[lang][message] ?? GENERIC_FIELD_ERROR[lang];
}


const iCls =
  "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors";
const sCls =
  "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 bg-white transition-colors appearance-none";

export default function LegalConsultationPage() {
  const [stage, setStage] = useState<"form" | "calendly" | "ready" | "submitting" | "error">("form");
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [calendlySlot, setCalendlySlot] = useState<CalendlySlot | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const calendlyContainerRef = useRef<HTMLDivElement | null>(null);
  const pricing = getLegalConsultPricing();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      incorpStatus: "Planning to incorporate",
      existingCorpName: "",
      existingJurisdiction: "",
      incorpThroughKorporex: false,
      topics: [],
      description: "",
      isUrgent: false,
      willShareDocuments: false,
      additionalNotes: "",
    },
  });

  const incorpStatus = watch("incorpStatus");
  const willShareDocuments = watch("willShareDocuments");

  // Listen for Calendly's `event_scheduled` postMessage when the embed is
  // mounted. Calendly emits `event.data.event === "calendly.event_scheduled"`
  // with `{ event, invitee }` URIs we can store and forward to the API.
  useEffect(() => {
    if (stage !== "calendly") return;
    function handleMessage(e: MessageEvent) {
      // Calendly only posts from `https://calendly.com`.
      if (typeof e.data !== "object" || !e.data?.event) return;
      if (e.data.event !== "calendly.event_scheduled") return;
      const payload = e.data.payload as
        | { event?: { uri?: string }; invitee?: { uri?: string } }
        | undefined;
      const eventUri = payload?.event?.uri ?? "";
      const inviteeUri = payload?.invitee?.uri ?? "";
      // Calendly's postMessage doesn't include the start time directly.
      // We mark the slot reserved here; Calendly will email the customer
      // (and us, via Calendly's notifications) with the full slot details.
      // The API stores `calendlyStartTime` as the human-readable label the
      // customer sees in the embed. We capture it from a polling read
      // below if the data carries it; otherwise fall back to "(see Calendly)".
      const startTime =
        (payload as { event?: { start_time?: string } } | undefined)?.event?.start_time ?? "(see Calendly notification)";
      setCalendlySlot({ eventUri, inviteeUri, startTime });
      setStage("ready");
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [stage]);

  // Initialize the Calendly inline widget when the script + container are
  // both ready. Calendly.js exposes `Calendly.initInlineWidget`.
  useEffect(() => {
    if (stage !== "calendly") return;
    const init = () => {
      const w = window as unknown as {
        Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement; prefill?: Record<string, string> }) => void };
      };
      if (!w.Calendly || !calendlyContainerRef.current || !formData) return;
      // Empty the container in case React re-mounts it during HMR.
      calendlyContainerRef.current.innerHTML = "";
      // Append Calendly's white-label flags so the host's avatar / firm name
      // / GDPR banner are hidden; customers should experience the booking
      // as a Korporex flow rather than a Hadri Law one. The event title
      // (`Consultation - KORPOREX`) stays visible.
      const url = new URL(CALENDLY_LAWYER_URL);
      url.searchParams.set("hide_landing_page_details", "1");
      url.searchParams.set("hide_gdpr_banner", "1");
      w.Calendly.initInlineWidget({
        url: url.toString(),
        parentElement: calendlyContainerRef.current,
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
      });
    };
    // The widget script may load after this effect runs the first time.
    // Re-try on a short timer until Calendly.initInlineWidget is available.
    const id = window.setInterval(() => {
      if ((window as unknown as { Calendly?: unknown }).Calendly) {
        window.clearInterval(id);
        init();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [stage, formData]);

  function onFilesPicked(picked: FileList | null) {
    if (!picked) return;
    const next = [...files];
    let total = files.reduce((sum, f) => sum + f.size, 0);
    for (let i = 0; i < picked.length; i++) {
      const f = picked[i];
      if (next.length >= LEGAL_CONSULT_MAX_FILES) break;
      if (!(LEGAL_CONSULT_ACCEPTED_MIMES as readonly string[]).includes(f.type)) {
        setSubmitError(`${f.name}: ${t.onlyTypes}`);
        continue;
      }
      if (total + f.size > LEGAL_CONSULT_MAX_FILE_BYTES) {
        setSubmitError(t.totalOver(LEGAL_CONSULT_MAX_FILE_BYTES / 1024 / 1024));
        break;
      }
      next.push(f);
      total += f.size;
    }
    setFiles(next);
  }

  function removeFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  const onValid = (d: FormValues) => {
    setSubmitError(null);
    setFormData(d);
    setStage("calendly");
  };

  async function submitToApi() {
    if (!formData || !calendlySlot) return;
    setSubmitError(null);
    setStage("submitting");
    try {
      const fd = new FormData();
      fd.set("fullName", formData.fullName);
      fd.set("email", formData.email);
      fd.set("phone", formData.phone);
      fd.set("incorpStatus", formData.incorpStatus);
      fd.set("existingCorpName", formData.existingCorpName ?? "");
      fd.set("existingJurisdiction", formData.existingJurisdiction ?? "");
      fd.set("incorpThroughKorporex", String(formData.incorpThroughKorporex));
      for (const t of formData.topics) fd.append("topics", t);
      fd.set("description", formData.description);
      fd.set("isUrgent", String(formData.isUrgent));
      fd.set("willShareDocuments", String(formData.willShareDocuments));
      fd.set("additionalNotes", formData.additionalNotes ?? "");
      fd.set("calendlyEventUri", calendlySlot.eventUri);
      fd.set("calendlyInviteeUri", calendlySlot.inviteeUri);
      fd.set("calendlyStartTime", calendlySlot.startTime);
      for (const f of files) fd.append("documents", f);

      const res = await fetch("/api/legal-consult", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Submission failed");
      }
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error("Checkout session did not return a URL");
      window.location.href = url;
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : t.genericError
      );
      setStage("error");
    }
  }

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />

      {/* Hero */}
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-5">
            {t.h1}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl">
            {t.intro}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CalendarClock size={16} className="text-navy-900" />
              {t.badgeDuration}
            </div>
            <div className="flex items-center gap-2">
              <ScaleIcon size={16} className="text-navy-900" />
              {t.badgeLawyer}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-navy-900 text-base">${pricing.fee.toFixed(2)}</span>
              <span>{t.plusTax} · ${pricing.total.toFixed(2)} {t.cadTotal}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-start gap-3">
          <ShieldAlert size={18} className="text-gold-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-navy-900">{t.disclaimerStrong}</strong>{" "}
            {t.disclaimerBody}
          </p>
        </div>
      </section>

      {/* Body: staged content. Width varies by stage: the questionnaire
          and confirmation panels sit in a 2xl column for readability, while
          the Calendly embed widens to a 4xl column so the calendar grid
          and time-slot list aren't cramped. */}
      <section className="bg-white py-12 px-6 min-h-[60vh]">
        <div className={stage === "calendly" ? "max-w-4xl mx-auto" : "max-w-2xl mx-auto"}>
          {stage === "form" && (
            <form onSubmit={handleSubmit(onValid)} className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-1">{t.formH2}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {t.formIntro}
              </p>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <Field label={t.fullName} error={localizeError(lang, errors.fullName?.message)}>
                  <input {...register("fullName")} className={iCls} />
                </Field>
                <Field label={t.phone} error={localizeError(lang, errors.phone?.message)}>
                  <input type="tel" autoComplete="tel" {...register("phone")} className={iCls} />
                </Field>
              </div>
              <Field label={t.email} error={localizeError(lang, errors.email?.message)}>
                <input type="email" autoComplete="email" {...register("email")} className={iCls} />
              </Field>

              {/* Incorp status */}
              <Field label={t.incorpStatus} error={localizeError(lang, errors.incorpStatus?.message)}>
                <select {...register("incorpStatus")} className={sCls}>
                  {LEGAL_CONSULT_INCORP_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {t.statusLabels[s]}
                    </option>
                  ))}
                </select>
              </Field>

              {incorpStatus === "Already incorporated" && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label={t.existingCorpName} error={localizeError(lang, errors.existingCorpName?.message)}>
                    <input {...register("existingCorpName")} placeholder={t.existingCorpNamePh} className={iCls} />
                  </Field>
                  <Field
                    label={t.jurisdiction}
                    error={localizeError(lang, errors.existingJurisdiction?.message)}
                    hint={t.jurisdictionHint}
                  >
                    <input {...register("existingJurisdiction")} placeholder={t.jurisdictionPh} className={iCls} />
                  </Field>
                </div>
              )}

              <label htmlFor="korporex-client" className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                <input id="korporex-client" type="checkbox" className="shrink-0 accent-navy-900" {...register("incorpThroughKorporex")} />
                {t.incorpThroughKorporex}
              </label>

              {/* Topics */}
              <Field
                label={t.topics}
                error={localizeError(lang, errors.topics?.message)}
                hint={t.topicsHint}
              >
                <div className="grid sm:grid-cols-2 gap-2 mt-1">
                  {LEGAL_CONSULT_TOPICS.map((topic) => (
                    <label
                      key={topic}
                      className="flex items-start gap-2 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:border-navy-900 transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={topic}
                        {...register("topics")}
                        className="mt-0.5 accent-navy-900"
                      />
                      <span>{t.topicLabels[topic]}</span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* Description */}
              <Field
                label={t.description}
                error={localizeError(lang, errors.description?.message)}
                hint={t.descriptionHint}
              >
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder={t.descriptionPh}
                  className={`${iCls} resize-none`}
                />
              </Field>

              {/* Urgency */}
              <label htmlFor="is-urgent" className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                <input id="is-urgent" type="checkbox" className="shrink-0 accent-navy-900" {...register("isUrgent")} />
                {t.urgent}
              </label>

              {/* Documents */}
              <label htmlFor="will-share-docs" className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                <input id="will-share-docs" type="checkbox" className="shrink-0 accent-navy-900" {...register("willShareDocuments")} />
                {t.willShareDocs}
              </label>

              {willShareDocuments && (
                <div className="border border-dashed border-gray-300 p-4 bg-cream-50">
                  <p className="text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-3">
                    {t.uploadTitle}
                  </p>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    {t.uploadHint(LEGAL_CONSULT_MAX_FILES, LEGAL_CONSULT_MAX_FILE_BYTES / 1024 / 1024)}
                  </p>
                  <label className="inline-flex items-center gap-2 border border-navy-900 px-4 py-2.5 text-sm text-navy-900 cursor-pointer hover:bg-navy-50 transition-colors">
                    <Upload size={14} /> {t.chooseFiles}
                    <input
                      type="file"
                      multiple
                      accept={LEGAL_CONSULT_ACCEPTED_MIMES.join(",")}
                      onChange={(e) => onFilesPicked(e.target.files)}
                      className="hidden"
                    />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <li
                          key={`${f.name}-${i}`}
                          className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-md px-3 py-2"
                        >
                          <span className="flex items-center gap-2 text-gray-700">
                            <FileText size={14} className="text-navy-900" />
                            {f.name}
                            <span className="text-xs text-gray-500">
                              · {(f.size / 1024).toFixed(0)} KB
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label={`${t.remove} ${f.name}`}
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Notes */}
              <Field label={t.notes} error={localizeError(lang, errors.additionalNotes?.message)}>
                <textarea {...register("additionalNotes")} rows={3} className={`${iCls} resize-none`} />
              </Field>

              {submitError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-navy-900 text-white font-medium py-4 text-sm tracking-wide hover:bg-navy-800 transition-colors mt-2 inline-flex items-center justify-center gap-2"
              >
                {t.continueBooking} <ArrowRight size={14} />
              </button>
            </form>
          )}

          {stage === "calendly" && (
            <>
              <button
                type="button"
                onClick={() => setStage("form")}
                className="text-sm text-gray-500 hover:text-navy-900 mb-6"
              >
                {t.backToQuestionnaire}
              </button>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-1">{t.pickTimeH2}</h2>
              <p className="text-gray-500 text-sm mb-6">
                {t.pickTimeIntro}
              </p>
              {/*
                Calendly's inline widget renders an iframe at 100% of this
                container. A fixed h-[1100px] gives the calendar grid + slot
                picker enough room without internal scrollbars. The previous
                `min-h-[700px]` was too short and made Calendly scroll
                internally with arrow controls, which looked broken.
              */}
              <div ref={calendlyContainerRef} className="h-[1100px] border border-gray-100 rounded-lg overflow-hidden" />
            </>
          )}

          {stage === "ready" && calendlySlot && (
            <div className="text-center py-12">
              <CheckCircle size={32} className="text-gold-500 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">{t.slotReserved}</h2>
              <p className="text-gray-600 mb-2">
                {t.bookingTime}{" "}
                <span className="font-semibold text-navy-900">
                  {formatSlotTime(calendlySlot.startTime, lang, t.seeCalendly)}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-8">
                {t.continueSecure}
              </p>
              <button
                type="button"
                onClick={submitToApi}
                className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors"
              >
                {t.continuePayment} ${pricing.total.toFixed(2)} CAD <ArrowRight size={14} />
              </button>
              <p className="text-xs text-gray-500 mt-4">
                {t.redirectPre}<span className="font-semibold">Stripe</span>{t.redirectPost}
              </p>
              {submitError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-4" role="alert">
                  {submitError}
                </p>
              )}
            </div>
          )}

          {stage === "submitting" && (
            <div className="text-center py-12">
              <p className="text-gray-600">{t.redirecting}</p>
            </div>
          )}

          {stage === "error" && (
            <div className="text-center py-12">
              <p className="text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-3 mb-4" role="alert">
                {submitError ?? t.somethingWrong}
              </p>
              <button
                type="button"
                onClick={submitToApi}
                className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-6 py-3 text-sm tracking-wide hover:bg-gold-600 transition-colors"
              >
                {t.tryAgain} <ArrowRight size={14} />
              </button>
              <p className="text-xs text-gray-500 mt-4">
                {t.orEmail}{" "}
                <a className="underline" href="mailto:contact@korporex.ca">
                  contact@korporex.ca
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer fine print */}
      <section className="bg-cream-50 py-12 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center text-xs text-gray-500 leading-relaxed">
          <p className="mb-2">
            <strong className="text-navy-900">{t.footerStrong}</strong>{" "}
            {t.footerEmail} <a className="underline" href="mailto:contact@korporex.ca">contact@korporex.ca</a> {t.footerOrCheck}{" "}
            <Link className="underline" href="/faq">{t.faq}</Link>.
          </p>
          <p>
            {t.footerFine}
          </p>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const required = label.endsWith(" *");
  const baseLabel = required ? label.slice(0, -2) : label;
  return (
    <div>
      <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
        {baseLabel}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Calendly's `event_scheduled` payload may include an ISO `start_time` or
// the `(see Calendly notification)` fallback. Format whichever we got into
// a friendly local string.
function formatSlotTime(s: string, lang: Lang, seeCalendly: string) {
  if (!s) return s;
  if (s === "(see Calendly notification)") return seeCalendly;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString(lang === "fr" ? "fr-CA" : lang === "es" ? "es" : undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
