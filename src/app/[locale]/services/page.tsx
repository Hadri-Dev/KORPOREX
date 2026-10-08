import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Building2, FileText, Edit3, ClipboardCheck, RefreshCw, ScaleIcon, Check, Star, ShieldCheck } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import { EXTRA_NAME_SEARCH_FEE } from "@/lib/pricing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "services", "/services");
}

type Lang = "en" | "fr" | "es";

type Service = { name: string; from: string; href: string };
type Category = {
  icon: React.ElementType;
  title: string;
  description: string;
  services: Service[];
};

// Locale-independent structure: ids, prices and links. Visible text comes
// from COPY below, keyed by the same ids / hrefs.
const jurisdictionOptions = [
  { id: "federal", from: "$749", href: "/incorporate?jurisdiction=federal" },
  { id: "ontario", from: "$599", href: "/incorporate?jurisdiction=ontario" },
] as const;

const packageSummary = [
  { id: "basic", name: "Basic", pkg: "basic", price: "$599" },
  { id: "standard", name: "Standard", pkg: "standard", price: "$899", popular: true },
  { id: "premium", name: "Premium", pkg: "premium", price: "$1,199" },
] as const;

const categoryStructure = [
  {
    id: "registrations",
    icon: FileText,
    services: [
      { from: "$99", href: "/services/sole-proprietorship" },
      { from: "$79", href: "/services/business-name" },
      { from: "$99", href: "/services/business-number" },
      { from: "$199", href: "/services/extra-provincial" },
    ],
  },
  {
    id: "changes",
    icon: Edit3,
    services: [
      { from: "$399.99", href: "/services/change-name" },
      { from: "$149", href: "/services/change-director" },
      { from: "$149", href: "/services/change-shareholder" },
      { from: "$99", href: "/services/change-address" },
      { from: "$199", href: "/services/articles-amendment" },
    ],
  },
  {
    id: "compliance",
    icon: ClipboardCheck,
    services: [
      { from: "$99", href: "/services/initial-return-on" },
      { from: "$49.99", href: "/services/annual-return-on" },
      { from: "$49.99", href: "/services/annual-return-federal" },
      { from: "$199.99", href: "/services/annual-resolution-on" },
      { from: "$199.99", href: "/services/annual-resolution-federal" },
      { from: "$129", href: "/services/notice-of-change" },
    ],
  },
  {
    id: "updates",
    icon: RefreshCw,
    services: [
      { from: "$399", href: "/services/initial-minute-book" },
      { from: "$199", href: "/services/dissolve-business" },
      { from: "$249", href: "/services/revive-business" },
      { from: "$499", href: "/services/amalgamation" },
      { from: "$349", href: "/services/continuance" },
      { from: "$599.88/yr", href: "/services/registered-office" },
    ],
  },
] as const;

type CategoryId = (typeof categoryStructure)[number]["id"];
type JurisdictionId = (typeof jurisdictionOptions)[number]["id"];
type PackageId = (typeof packageSummary)[number]["id"];

type Copy = {
  heroLine1: string;
  heroLine2: string;
  heroIntro: string;
  incorpH2: string;
  incorpIntro: string;
  jurisdictions: Record<JurisdictionId, { name: string; statute: string; pitch: string }>;
  from: string;
  perYear: string;
  packagesH3: string;
  compare: string;
  mostPopular: string;
  startWith: string;
  packages: Record<PackageId, { audience: string; blurb: string; highlights: string[] }>;
  includedTitle: string;
  inclusions: string[];
  nuansPre: string;
  nuansOne: string;
  nuansMid: string;
  nuansPlusTax: string;
  nuansPost: string;
  nuansReport: string;
  categories: Record<CategoryId, { title: string; description: string }>;
  serviceNames: Record<string, string>;
  lawyerEyebrow: string;
  lawyerH2: string;
  lawyerBody: string;
  lawyerFee: string;
  lawyerCta: string;
  ctaH2: string;
  ctaBody: string;
  ctaIncorporate: string;
  ctaFaq: string;
};

const COPY: Record<Lang, Copy> = {
  en: {
    heroLine1: "Everything Your Business",
    heroLine2: "Needs to Stay Compliant",
    heroIntro:
      "From your first incorporation to ongoing compliance filings, Korporex handles every government filing your business needs: fast, online, and at a fixed price.",
    incorpH2: "Incorporation",
    incorpIntro:
      "Incorporate federally or in Ontario, fully online, in 24 hours. Pick your jurisdiction below, then choose the package that fits your business.",
    jurisdictions: {
      federal: {
        name: "Federal Incorporation",
        statute: "Canada Business Corporations Act (CBCA)",
        pitch: "Operate across Canada under one corporate name.",
      },
      ontario: {
        name: "Ontario Incorporation",
        statute: "Ontario Business Corporations Act (OBCA)",
        pitch: "Operate as an Ontario corporation, with lower government filing fees.",
      },
    },
    from: "From",
    perYear: "/yr",
    packagesH3: "Three packages, one transparent price",
    compare: "Compare full features",
    mostPopular: "Most Popular",
    startWith: "Start with",
    packages: {
      basic: {
        audience: "For solo founders",
        blurb: "Consultants, freelancers, and single-owner holding companies.",
        highlights: ["Numbered corporation", "1 director, 1 shareholder, 1 officer", "1 class of shares"],
      },
      standard: {
        audience: "For founding teams",
        blurb:
          "Co-founders, spouses incorporating together, and small partnerships ready to operate under a business name.",
        highlights: [
          "Named or numbered (one NUANS name search included)",
          "Up to 3 directors, 3 shareholders, 3 officers",
          "Up to 3 classes of shares",
        ],
      },
      premium: {
        audience: "For multi-stakeholder businesses",
        blurb: "Multiple founders, advisors, or family members with a layered share structure.",
        highlights: [
          "Named or numbered (one NUANS name search included)",
          "Up to 5 directors, 5 shareholders, 5 officers",
          "Up to 5 classes of shares",
        ],
      },
    },
    includedTitle: "Included in every package",
    inclusions: [
      "Articles of Incorporation filing",
      "Certificate of Incorporation",
      "Company key",
      "Standard Digital Minute Book",
      "All mandatory post-incorporation filings",
      "24-hour turnaround",
    ],
    nuansPre: "Standard and Premium include ",
    nuansOne: "one NUANS name search",
    nuansMid: " for the name you file. Each additional search is ",
    nuansPlusTax: " + HST",
    nuansPost: " and is ordered separately as a ",
    nuansReport: "NUANS report",
    categories: {
      registrations: {
        title: "Registrations",
        description:
          "Register a sole proprietorship, business name, business number, or expand your existing corporation to operate in a new province.",
      },
      changes: {
        title: "Changes & Amendments",
        description: "Update your corporation's directors, officers, address, name, or articles after incorporation.",
      },
      compliance: {
        title: "Compliance Filings",
        description:
          "Stay in good standing with the required government filings and annual minute-book resolutions for Ontario and federal corporations.",
      },
      updates: {
        title: "Business Updates",
        description:
          "Dissolve, revive, amalgamate, or continue your corporation between jurisdictions. Get the minute book your corporation is missing, or use a Korporex office as your registered office.",
      },
    },
    serviceNames: {
      "/services/sole-proprietorship": "Sole Proprietorship Registration - Ontario",
      "/services/business-name": "Business Name Registration - Ontario",
      "/services/business-number": "Business Number Registration - CRA",
      "/services/extra-provincial": "Extra-Provincial Registration",
      "/services/change-name": "Change of Business Name",
      "/services/change-director": "Change of Director / Officer",
      "/services/change-shareholder": "Change of Shareholder",
      "/services/change-address": "Corporation Address Change",
      "/services/articles-amendment": "Articles of Amendment",
      "/services/initial-return-on": "Initial Return (Ontario)",
      "/services/annual-return-on": "Annual Return - Ontario",
      "/services/annual-return-federal": "Annual Return - Federal",
      "/services/annual-resolution-on": "Annual Resolution - Ontario",
      "/services/annual-resolution-federal": "Annual Resolution - Federal",
      "/services/notice-of-change": "Notice of Change",
      "/services/initial-minute-book": "Initial Minute Book",
      "/services/dissolve-business": "Dissolve a Business",
      "/services/revive-business": "Revive a Business",
      "/services/amalgamation": "Amalgamation",
      "/services/continuance": "Continuance Between Jurisdictions",
      "/services/registered-office": "Registered Office",
    },
    lawyerEyebrow: "Need Personalized Legal Advice?",
    lawyerH2: "Talk to a Trusted Corporate Lawyer",
    lawyerBody:
      "Korporex isn’t a law firm, but if you need personalized legal advice on incorporation strategy, shareholder agreements, restructuring, or anything else corporate-law related, we can connect you with an independent corporate lawyer from our trusted referral network. Book a 30-minute consultation for ",
    lawyerFee: "$150 + HST",
    lawyerCta: "Book a Consultation",
    ctaH2: "Not Sure Where to Start?",
    ctaBody:
      "Most businesses start with a federal or provincial incorporation. If you're unsure which is right for you, check our FAQ or start the incorporation flow and we'll guide you.",
    ctaIncorporate: "Incorporate Now",
    ctaFaq: "Read the FAQ",
  },
  fr: {
    heroLine1: "Tout ce dont votre entreprise",
    heroLine2: "a besoin pour rester conforme",
    heroIntro:
      "De votre première constitution aux dépôts de conformité continus, Korporex s'occupe de tous les dépôts gouvernementaux dont votre entreprise a besoin : rapidement, en ligne et à prix fixe.",
    incorpH2: "Constitution",
    incorpIntro:
      "Constituez votre société sous le régime fédéral ou en Ontario, entièrement en ligne, en 24 heures. Choisissez votre territoire ci-dessous, puis le forfait adapté à votre entreprise.",
    jurisdictions: {
      federal: {
        name: "Constitution fédérale",
        statute: "Loi canadienne sur les sociétés par actions (LCSA)",
        pitch: "Exercez vos activités partout au Canada sous une seule dénomination sociale.",
      },
      ontario: {
        name: "Constitution en Ontario",
        statute: "Loi sur les sociétés par actions de l'Ontario (LSAO)",
        pitch: "Exercez vos activités en tant que société ontarienne, avec des droits de dépôt gouvernementaux moins élevés.",
      },
    },
    from: "À partir de",
    perYear: "/an",
    packagesH3: "Trois forfaits, un prix transparent",
    compare: "Comparer toutes les fonctionnalités",
    mostPopular: "Le plus populaire",
    startWith: "Commencer avec",
    packages: {
      basic: {
        audience: "Pour les fondateurs seuls",
        blurb: "Consultants, travailleurs autonomes et sociétés de portefeuille à propriétaire unique.",
        highlights: ["Société à dénomination numérique", "1 administrateur, 1 actionnaire, 1 dirigeant", "1 catégorie d'actions"],
      },
      standard: {
        audience: "Pour les équipes fondatrices",
        blurb:
          "Cofondateurs, conjoints qui se constituent en société ensemble et petites associations prêtes à exercer leurs activités sous une dénomination.",
        highlights: [
          "Dénomination nominative ou numérique (une recherche de nom NUANS incluse)",
          "Jusqu'à 3 administrateurs, 3 actionnaires, 3 dirigeants",
          "Jusqu'à 3 catégories d'actions",
        ],
      },
      premium: {
        audience: "Pour les entreprises à multiples parties prenantes",
        blurb: "Plusieurs fondateurs, conseillers ou membres de la famille avec une structure d'actions à plusieurs niveaux.",
        highlights: [
          "Dénomination nominative ou numérique (une recherche de nom NUANS incluse)",
          "Jusqu'à 5 administrateurs, 5 actionnaires, 5 dirigeants",
          "Jusqu'à 5 catégories d'actions",
        ],
      },
    },
    includedTitle: "Inclus dans chaque forfait",
    inclusions: [
      "Dépôt des statuts constitutifs",
      "Certificat de constitution",
      "Clé d'entreprise",
      "Livre de procès-verbaux numérique standard",
      "Tous les dépôts obligatoires postérieurs à la constitution",
      "Traitement en 24 heures",
    ],
    nuansPre: "Les forfaits Standard et Premium comprennent ",
    nuansOne: "une recherche de nom NUANS",
    nuansMid: " pour la dénomination que vous déposez. Chaque recherche supplémentaire coûte ",
    nuansPlusTax: " + TVH",
    nuansPost: " et se commande séparément sous forme de ",
    nuansReport: "rapport NUANS",
    categories: {
      registrations: {
        title: "Enregistrements",
        description:
          "Enregistrez une entreprise individuelle, un nom commercial ou un numéro d'entreprise, ou étendez les activités de votre société existante à une nouvelle province.",
      },
      changes: {
        title: "Changements et modifications",
        description:
          "Mettez à jour les administrateurs, les dirigeants, l'adresse, la dénomination ou les statuts de votre société après sa constitution.",
      },
      compliance: {
        title: "Dépôts de conformité",
        description:
          "Restez en règle grâce aux dépôts gouvernementaux requis et aux résolutions annuelles du livre de procès-verbaux pour les sociétés ontariennes et fédérales.",
      },
      updates: {
        title: "Mises à jour de l'entreprise",
        description:
          "Dissolvez, reconstituez, fusionnez ou prorogez votre société d'un territoire à un autre. Obtenez le livre de procès-verbaux qui manque à votre société, ou utilisez un bureau Korporex comme siège social.",
      },
    },
    serviceNames: {
      "/services/sole-proprietorship": "Enregistrement d'une entreprise individuelle (Ontario)",
      "/services/business-name": "Enregistrement d'un nom commercial (Ontario)",
      "/services/business-number": "Inscription au numéro d'entreprise (ARC)",
      "/services/extra-provincial": "Enregistrement extraprovincial",
      "/services/change-name": "Changement de nom d'entreprise",
      "/services/change-director": "Changement d'administrateur ou de dirigeant",
      "/services/change-shareholder": "Changement d'actionnaire",
      "/services/change-address": "Changement d'adresse de la société",
      "/services/articles-amendment": "Statuts de modification",
      "/services/initial-return-on": "Rapport initial (Ontario)",
      "/services/annual-return-on": "Déclaration annuelle (Ontario)",
      "/services/annual-return-federal": "Rapport annuel (fédéral)",
      "/services/annual-resolution-on": "Résolutions annuelles (Ontario)",
      "/services/annual-resolution-federal": "Résolutions annuelles (fédéral)",
      "/services/notice-of-change": "Avis de modification",
      "/services/initial-minute-book": "Livre de procès-verbaux initial",
      "/services/dissolve-business": "Dissoudre une société",
      "/services/revive-business": "Reconstituer une société",
      "/services/amalgamation": "Fusion",
      "/services/continuance": "Prorogation entre territoires",
      "/services/registered-office": "Siège social",
    },
    lawyerEyebrow: "Besoin de conseils juridiques personnalisés?",
    lawyerH2: "Parlez à un avocat en droit des sociétés de confiance",
    lawyerBody:
      "Korporex n'est pas un cabinet d'avocats, mais si vous avez besoin de conseils juridiques personnalisés sur la stratégie de constitution, les conventions entre actionnaires, la restructuration ou toute autre question de droit des sociétés, nous pouvons vous mettre en relation avec un avocat en droit des sociétés indépendant de notre réseau de référence de confiance. Réservez une consultation de 30 minutes pour ",
    lawyerFee: "$150 + TVH",
    lawyerCta: "Réserver une consultation",
    ctaH2: "Vous ne savez pas par où commencer?",
    ctaBody:
      "La plupart des entreprises commencent par une constitution fédérale ou provinciale. Si vous ne savez pas laquelle vous convient, consultez notre FAQ ou lancez le processus de constitution et nous vous guiderons.",
    ctaIncorporate: "Constituer maintenant",
    ctaFaq: "Lire la FAQ",
  },
  es: {
    heroLine1: "Todo lo que su empresa",
    heroLine2: "necesita para mantenerse en regla",
    heroIntro:
      "Desde su primera constitución hasta los trámites de cumplimiento continuos, Korporex se encarga de todos los trámites gubernamentales que su empresa necesita: de forma rápida, en línea y a precio fijo.",
    incorpH2: "Constitución",
    incorpIntro:
      "Constituya su sociedad a nivel federal o en Ontario, totalmente en línea, en 24 horas. Elija su jurisdicción a continuación y luego el paquete que mejor se adapte a su empresa.",
    jurisdictions: {
      federal: {
        name: "Constitución federal",
        statute: "Canada Business Corporations Act (CBCA)",
        pitch: "Opere en todo Canadá bajo una sola denominación social.",
      },
      ontario: {
        name: "Constitución en Ontario",
        statute: "Ontario Business Corporations Act (OBCA)",
        pitch: "Opere como sociedad de Ontario, con tasas gubernamentales de presentación más bajas.",
      },
    },
    from: "Desde",
    perYear: "/año",
    packagesH3: "Tres paquetes, un precio transparente",
    compare: "Comparar todas las funciones",
    mostPopular: "Más popular",
    startWith: "Empezar con",
    packages: {
      basic: {
        audience: "Para fundadores individuales",
        blurb: "Consultores, profesionales independientes y sociedades de cartera con un solo propietario.",
        highlights: ["Sociedad numerada", "1 director, 1 accionista, 1 funcionario", "1 clase de acciones"],
      },
      standard: {
        audience: "Para equipos fundadores",
        blurb:
          "Cofundadores, cónyuges que se constituyen juntos y pequeñas asociaciones listas para operar bajo un nombre comercial.",
        highlights: [
          "Con nombre o numerada (incluye una búsqueda de nombre NUANS)",
          "Hasta 3 directores, 3 accionistas, 3 funcionarios",
          "Hasta 3 clases de acciones",
        ],
      },
      premium: {
        audience: "Para empresas con múltiples partes interesadas",
        blurb: "Varios fundadores, asesores o familiares con una estructura de acciones en varios niveles.",
        highlights: [
          "Con nombre o numerada (incluye una búsqueda de nombre NUANS)",
          "Hasta 5 directores, 5 accionistas, 5 funcionarios",
          "Hasta 5 clases de acciones",
        ],
      },
    },
    includedTitle: "Incluido en todos los paquetes",
    inclusions: [
      "Presentación de los estatutos de constitución",
      "Certificado de constitución",
      "Clave de la empresa (company key)",
      "Libro de actas digital estándar",
      "Todos los trámites obligatorios posteriores a la constitución",
      "Tramitación en 24 horas",
    ],
    nuansPre: "Los paquetes Standard y Premium incluyen ",
    nuansOne: "una búsqueda de nombre NUANS",
    nuansMid: " para el nombre que presente. Cada búsqueda adicional cuesta ",
    nuansPlusTax: " + HST",
    nuansPost: " y se solicita por separado como ",
    nuansReport: "informe NUANS",
    categories: {
      registrations: {
        title: "Registros",
        description:
          "Registre una empresa individual, un nombre comercial o un número de empresa, o amplíe su sociedad existente para operar en una nueva provincia.",
      },
      changes: {
        title: "Cambios y modificaciones",
        description:
          "Actualice los directores, funcionarios, domicilio, nombre o estatutos de su sociedad después de la constitución.",
      },
      compliance: {
        title: "Trámites de cumplimiento",
        description:
          "Mantenga su sociedad en regla con los trámites gubernamentales obligatorios y las resoluciones anuales del libro de actas para sociedades de Ontario y federales.",
      },
      updates: {
        title: "Actualizaciones de la empresa",
        description:
          "Disuelva, reactive, fusione o continúe su sociedad entre jurisdicciones. Obtenga el libro de actas que le falta a su sociedad, o utilice una oficina de Korporex como domicilio social.",
      },
    },
    serviceNames: {
      "/services/sole-proprietorship": "Registro de empresa individual (Ontario)",
      "/services/business-name": "Registro de nombre comercial (Ontario)",
      "/services/business-number": "Registro de número de empresa (CRA)",
      "/services/extra-provincial": "Registro extraprovincial",
      "/services/change-name": "Cambio de nombre de empresa",
      "/services/change-director": "Cambio de director o funcionario",
      "/services/change-shareholder": "Cambio de accionista",
      "/services/change-address": "Cambio de domicilio social",
      "/services/articles-amendment": "Estatutos de modificación",
      "/services/initial-return-on": "Declaración inicial (Ontario)",
      "/services/annual-return-on": "Declaración anual (Ontario)",
      "/services/annual-return-federal": "Declaración anual (federal)",
      "/services/annual-resolution-on": "Resoluciones anuales (Ontario)",
      "/services/annual-resolution-federal": "Resoluciones anuales (federal)",
      "/services/notice-of-change": "Aviso de cambio",
      "/services/initial-minute-book": "Libro de actas inicial",
      "/services/dissolve-business": "Disolver una sociedad",
      "/services/revive-business": "Reactivar una sociedad",
      "/services/amalgamation": "Fusión",
      "/services/continuance": "Continuación entre jurisdicciones",
      "/services/registered-office": "Domicilio social",
    },
    lawyerEyebrow: "¿Necesita asesoramiento legal personalizado?",
    lawyerH2: "Hable con un abogado corporativo de confianza",
    lawyerBody:
      "Korporex no es un bufete de abogados, pero si necesita asesoramiento legal personalizado sobre estrategia de constitución, acuerdos de accionistas, reestructuración o cualquier otro asunto de derecho corporativo, podemos ponerle en contacto con un abogado corporativo independiente de nuestra red de referencias de confianza. Reserve una consulta de 30 minutos por ",
    lawyerFee: "$150 + HST",
    lawyerCta: "Reservar una consulta",
    ctaH2: "¿No sabe por dónde empezar?",
    ctaBody:
      "La mayoría de las empresas comienzan con una constitución federal o provincial. Si no está seguro de cuál le conviene, consulte nuestras preguntas frecuentes o inicie el proceso de constitución y le guiaremos.",
    ctaIncorporate: "Constituir ahora",
    ctaFaq: "Leer las preguntas frecuentes",
  },
};

// Price strings carry an English "/yr" suffix for recurring services;
// swap it for the localized suffix at render time.
function localizePrice(from: string, t: Copy): string {
  return from.endsWith("/yr") ? from.slice(0, -3) + t.perYear : from;
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  const categories: Category[] = categoryStructure.map(({ id, icon, services }) => ({
    icon,
    title: t.categories[id].title,
    description: t.categories[id].description,
    services: services.map(({ from, href }) => ({
      name: t.serviceNames[href] ?? COPY.en.serviceNames[href] ?? href,
      from: localizePrice(from, t),
      href,
    })),
  }));

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t.heroLine1}
            <br />
            {t.heroLine2}
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">{t.heroIntro}</p>
        </div>
      </section>

      {/* Service Categories: each in an elevated cream card with gold stripe,
          matching the /nuans 'Your proposed names' card treatment. */}
      <section className="bg-white pt-12 pb-6 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Incorporation: custom block, styled to match the category cards below */}
          <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Green header band with inset gold underline */}
            <div className="relative flex items-start gap-4 bg-navy-900 text-white px-6 py-5">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight">{t.incorpH2}</h2>
                <p className="text-xs text-gray-300 leading-snug mt-1 max-w-2xl">{t.incorpIntro}</p>
              </div>
              <span className="absolute left-6 right-6 bottom-0 h-0.5 bg-gold-500" />
            </div>

            <div className="p-6 md:p-8">
              {/* Jurisdiction picker: fills green on hover, matching the service rows */}
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {jurisdictionOptions.map(({ id, from, href }) => {
                  const { name, statute, pitch } = t.jurisdictions[id];
                  return (
                    <Link
                      key={id}
                      href={href}
                      className="group block bg-white border border-gray-200 rounded-xl p-6 transition-all hover:bg-navy-900 hover:border-navy-900 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-serif text-xl font-semibold text-navy-900 transition-colors group-hover:text-white">{name}</h3>
                        <ArrowRight
                          size={18}
                          className="text-gray-400 group-hover:text-gold-500 shrink-0 mt-1 transition-colors"
                        />
                      </div>
                      <p className="text-xs font-medium text-gold-600 tracking-wide mb-3 transition-colors group-hover:text-gold-500">{statute}</p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 transition-colors group-hover:text-gray-200">{pitch}</p>
                      <p className="text-sm font-semibold text-navy-900 transition-colors group-hover:text-white">
                        {t.from} {from}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {/* Package summary: secondary, informational */}
              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-3 mb-5">
                  <h3 className="font-serif text-lg font-semibold text-navy-900">{t.packagesH3}</h3>
                  <Link
                    href="/order"
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-900 hover:text-navy-700 inline-flex items-center gap-1"
                  >
                    {t.compare}
                    <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {packageSummary.map((p) => {
                    const { id, name, pkg, price } = p;
                    const popular = "popular" in p && p.popular;
                    const { audience, blurb, highlights } = t.packages[id];
                    return (
                      <Link
                        key={name}
                        href={`/incorporate?package=${pkg}`}
                        className={`group relative flex flex-col bg-white rounded-lg p-6 border transition-all hover:bg-navy-900 hover:border-navy-900 hover:shadow-md ${
                          popular ? "border-navy-900 shadow-sm" : "border-gray-200"
                        }`}
                      >
                        {popular && (
                          <div className="absolute -top-3 left-6 bg-navy-900 text-white text-[0.65rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm inline-flex items-center gap-1 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                            <Star size={10} className="fill-gold-500 text-gold-500 transition-colors group-hover:fill-navy-900 group-hover:text-navy-900" />
                            {t.mostPopular}
                          </div>
                        )}
                        <div className="flex items-baseline gap-2 mb-1">
                          <h4 className="font-serif text-xl font-bold text-navy-900 transition-colors group-hover:text-white">{name}</h4>
                          <span className="text-sm font-semibold text-gray-500 transition-colors group-hover:text-gray-300">{price}</span>
                        </div>
                        <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-3 transition-colors group-hover:text-gold-500">
                          {audience}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 transition-colors group-hover:text-gray-200">{blurb}</p>
                        <ul className="space-y-2">
                          {highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-sm text-gray-700 transition-colors group-hover:text-gray-200">
                              <Check size={14} className="text-navy-900 shrink-0 mt-0.5 transition-colors group-hover:text-gold-500" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                        <span className="mt-5 pt-4 border-t border-gray-100 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-navy-900 transition-all group-hover:gap-2.5 group-hover:border-white/20 group-hover:text-white">
                          {t.startWith} {name}
                          <ArrowRight size={13} className="text-gold-600 transition-colors group-hover:text-gold-500" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
                {/* What every package includes, pulled out of the fine print */}
                <div className="mt-6 rounded-xl border border-gold-200 bg-cream-50 shadow-sm overflow-hidden">
                  <div className="border-l-4 border-gold-500 px-5 py-5 md:px-6">
                    <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-navy-900 mb-4">
                      <ShieldCheck size={15} className="text-gold-600" />
                      {t.includedTitle}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                      {t.inclusions.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm font-medium text-navy-900">
                          <Check size={15} className="text-gold-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-600 leading-relaxed mt-4 pt-4 border-t border-gold-200">
                      {t.nuansPre}
                      <span className="font-semibold text-navy-900">{t.nuansOne}</span>
                      {t.nuansMid}
                      <span className="font-semibold text-navy-900">
                        ${EXTRA_NAME_SEARCH_FEE.toFixed(2)}
                        {t.nuansPlusTax}
                      </span>
                      {t.nuansPost}
                      <Link
                        href="/nuans"
                        className="font-semibold text-navy-900 underline underline-offset-2 hover:text-gold-600"
                      >
                        {t.nuansReport}
                      </Link>
                      .
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      <Link href="/tools/incorporation-cost" className="font-semibold text-navy-900 underline underline-offset-2 hover:text-gold-600">
                        {lang === "fr" ? "Voir le détail des droits gouvernementaux" : lang === "es" ? "Ver el desglose de las tasas gubernamentales" : "See the full government fee breakdown"}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service categories: green header band + service list (Version 2) */}
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map(({ icon: Icon, title, description, services }) => (
              <div
                key={title}
                className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Green header band with inset gold underline */}
                <div className="relative flex items-start gap-4 bg-navy-900 text-white px-6 py-5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight">{title}</h2>
                    <p className="text-xs text-gray-300 leading-snug mt-1">{description}</p>
                  </div>
                  <span className="absolute left-6 right-6 bottom-0 h-0.5 bg-gold-500" />
                </div>

                {/* Service list: each row fills solid green on hover */}
                <div className="p-3 sm:p-4">
                  {services.map(({ name, from, href }, i) => (
                    <Link
                      key={href}
                      href={href}
                      className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-navy-900 hover:border-transparent ${
                        i > 0 ? "border-t border-gray-100" : ""
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-800 group-hover:text-white transition-colors">
                        {name}
                      </span>
                      <span className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-semibold text-gray-500 group-hover:text-gold-500 whitespace-nowrap transition-colors">
                          {t.from} {from}
                        </span>
                        <ArrowRight
                          size={15}
                          className="text-gray-300 opacity-0 transition-all group-hover:opacity-100 group-hover:text-gold-500"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyer-referral callout */}
      <section className="bg-cream-50 py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0">
              <ScaleIcon size={22} className="text-gold-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">{t.lawyerEyebrow}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-3">{t.lawyerH2}</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                {t.lawyerBody}
                <span className="font-semibold text-navy-900">{t.lawyerFee}</span>.
              </p>
              <Link
                href="/legal-consultation"
                className="inline-flex items-center gap-2 bg-navy-900 text-white font-medium px-6 py-3 text-sm tracking-wide hover:bg-navy-800 transition-colors"
              >
                {t.lawyerCta} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-12 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">{t.ctaH2}</h2>
          <p className="text-gray-300 mb-8">{t.ctaBody}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/incorporate"
              className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
            >
              {t.ctaIncorporate}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
            >
              {t.ctaFaq}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
