// Copy for the /tools/incorporation-cost calculator, in every site locale.
// Amounts are never typed here: they come from govFees.ts (government fees)
// and pricing.ts (Korporex prices) so the page, its FAQ and its JSON-LD can
// never disagree with each other.

import { GOV_FEES } from "@/lib/govFees";
import { NUANS_FEES } from "@/lib/pricing";

export type CostLang = "en" | "fr" | "es";

const FED_INC = GOV_FEES.federal.incorporation.amount ?? 0;
const FED_EXPRESS = GOV_FEES.federal.express?.amount ?? 0;
const FED_ANNUAL = GOV_FEES.federal.annualReturn.amount ?? 0;
const ON_INC = GOV_FEES.ontario.incorporation.amount ?? 0;
const NUANS = NUANS_FEES.ontario;

function enMoney(n: number) {
  return `$${Number.isInteger(n) ? n.toLocaleString("en-CA") : n.toFixed(2)}`;
}
function frMoney(n: number) {
  const s = Number.isInteger(n) ? n.toLocaleString("fr-CA") : n.toFixed(2).replace(".", ",");
  return `${s} $`;
}
const esMoney = enMoney;

const DATE_LOCALE: Record<CostLang, string> = { en: "en-CA", fr: "fr-CA", es: "es" };
function fmtDate(lang: CostLang, iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(DATE_LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const PAGE_URL: Record<CostLang, string> = {
  en: "https://korporex.ca/tools/incorporation-cost",
  fr: "https://korporex.ca/fr/tools/incorporation-cost",
  es: "https://korporex.ca/es/tools/incorporation-cost",
};

export function costFaq(lang: CostLang): { q: string; a: string }[] {
  if (lang === "fr") {
    const m = frMoney;
    return [
      {
        q: "Combien coûte la constitution d'une société fédérale au Canada?",
        a: `Corporations Canada perçoit ${m(FED_INC)} pour déposer des statuts constitutifs en ligne. Le traitement accéléré est une option de ${m(FED_EXPRESS)}. Aucun rapport NUANS distinct n'est requis pour constituer une société en ligne avec un nom composé de mots. Une déclaration annuelle de ${m(FED_ANNUAL)} s'ajoute chaque année.`,
      },
      {
        q: "Combien coûte la constitution d'une société en Ontario?",
        a: `Le Registre des entreprises de l'Ontario perçoit ${m(ON_INC)} pour déposer des statuts constitutifs. Une société ontarienne nommée a aussi besoin d'un rapport de recherche de nom NUANS, fourni par une maison de recherche privée et non par le gouvernement. Korporex le facture ${m(NUANS)} + TVH. Une société à numéro n'en a pas besoin.`,
      },
      {
        q: "Y a-t-il des droits gouvernementaux annuels après la constitution?",
        a: `Une société fédérale paie ${m(FED_ANNUAL)} chaque année pour déposer sa déclaration annuelle en ligne. L'Ontario ne perçoit aucun droit pour sa déclaration annuelle, mais son dépôt demeure obligatoire.`,
      },
      {
        q: "Une société à numéro coûte-t-elle moins cher?",
        a: "En Ontario, oui : une société à numéro n'a pas besoin de la recherche de nom NUANS. Au fédéral, le droit de constitution est le même dans les deux cas.",
      },
      {
        q: "Les droits gouvernementaux incluent-ils la TVH?",
        a: "Non. Les droits de dépôt gouvernementaux ne sont pas assujettis à la TPS/TVH. La taxe s'applique seulement aux frais de service facturés en plus.",
      },
    ];
  }
  if (lang === "es") {
    const m = esMoney;
    return [
      {
        q: "¿Cuánto cuesta constituir una sociedad federal en Canadá?",
        a: `Corporations Canada cobra ${m(FED_INC)} por presentar los estatutos de constitución en línea. El trámite exprés es opcional y cuesta ${m(FED_EXPRESS)}. No se requiere un informe NUANS por separado para constituir en línea con un nombre de palabras. Cada año se suma una declaración anual de ${m(FED_ANNUAL)}.`,
      },
      {
        q: "¿Cuánto cuesta constituir una sociedad en Ontario?",
        a: `El Registro de Empresas de Ontario cobra ${m(ON_INC)} por presentar los estatutos de constitución. Una sociedad de Ontario con nombre también necesita un informe de búsqueda de nombre NUANS, que proviene de una empresa privada de búsquedas y no del gobierno. Korporex lo cobra a ${m(NUANS)} + HST. Una sociedad numerada no lo necesita.`,
      },
      {
        q: "¿Hay tasas gubernamentales anuales después de constituir?",
        a: `Una sociedad federal paga ${m(FED_ANNUAL)} cada año para presentar su declaración anual en línea. Ontario no cobra tasa por su declaración anual, pero presentarla sigue siendo obligatorio.`,
      },
      {
        q: "¿Es más barata una sociedad numerada?",
        a: "En Ontario, sí: una sociedad numerada no necesita la búsqueda de nombre NUANS. A nivel federal, la tasa de constitución es la misma en ambos casos.",
      },
      {
        q: "¿Las tasas gubernamentales incluyen HST?",
        a: "No. Las tasas gubernamentales de presentación no están sujetas a GST/HST. El impuesto se aplica solo a los cargos por servicio que se cobran además de ellas.",
      },
    ];
  }
  const m = enMoney;
  return [
    {
      q: "How much does it cost to incorporate federally in Canada?",
      a: `Corporations Canada charges ${m(FED_INC)} to file Articles of Incorporation online. Express processing is an optional ${m(FED_EXPRESS)}. A separate NUANS report is not required to incorporate online with a word name. A ${m(FED_ANNUAL)} annual return is added every year.`,
    },
    {
      q: "How much does it cost to incorporate in Ontario?",
      a: `The Ontario Business Registry charges ${m(ON_INC)} to file Articles of Incorporation. A named Ontario corporation also needs a NUANS name search report, which comes from a private search house rather than the government. Korporex charges ${m(NUANS)} + HST for it. A numbered corporation does not need one.`,
    },
    {
      q: "Are there yearly government fees after incorporating?",
      a: `A federal corporation pays ${m(FED_ANNUAL)} each year to file its annual return online. Ontario charges no government fee for its annual return, but filing it is still mandatory.`,
    },
    {
      q: "Is a numbered corporation cheaper?",
      a: "For Ontario, yes: a numbered corporation does not need the NUANS name search. Federally, the incorporation fee is the same either way.",
    },
    {
      q: "Do government filing fees include HST?",
      a: "No. Government filing fees are not subject to GST/HST. Tax applies only to service fees charged on top of them.",
    },
  ];
}

const en = {
  money: enMoney,
  date: (iso: string) => fmtDate("en", iso),
  h1: "How Much Does It Cost to Incorporate in Canada?",
  lede: "The government fees to incorporate a federal (CBCA) or Ontario (OBCA) corporation, line by line, with a link to the official source for every number. Pick your options below to see your total.",
  verifiedPre: "Fees verified against official government sources on ",
  jurisdiction: "Jurisdiction",
  jurLabel: { federal: "Federal", ontario: "Ontario" },
  jurSub: { federal: "CBCA, all of Canada", ontario: "OBCA, provincial" },
  corpName: "Corporate name",
  nameLabel: { named: "Named", numbered: "Numbered" },
  namedEg: "e.g. Maple Ridge Inc.",
  numberedEg: (w: string) => `e.g. 1234567 ${w} Inc.`,
  expressLabel: "Add express processing",
  expressHint: "Federal only. Four business hours instead of one day.",
  firstYearLabel: "Include first-year annual filing",
  firstYearHint: "Shows the yearly cost of staying in good standing.",
  totalLabel: "Government fees",
  totalSplit: (once: string, year: string) => `${once} to incorporate + ${year} first-year filing.`,
  totalOnce: "One-time cost to incorporate.",
  tableTitle: { federal: "Federal (CBCA) government fees", ontario: "Ontario (OBCA) government fees" },
  tableSub: {
    federal: "Filed with Corporations Canada under the Canada Business Corporations Act.",
    ontario: "Filed with the Ontario Business Registry under the Business Corporations Act (Ontario).",
  },
  colFiling: "Filing",
  colFee: "Fee",
  tagOnce: "One-time",
  tagYearly: "Yearly",
  tagOptional: "Optional",
  rows: {
    incorporation: "Articles of Incorporation",
    express: "Express service",
    nuans: "Name search (NUANS)",
    annual: "Annual return",
    initialReturn: "Initial Return",
    annualOn: "Annual return (Corporations Information Act)",
  },
  notes: {
    fedIncorporation: "Filed online. One business day standard processing.",
    fedExpress: "Optional. Reduces processing to four business hours.",
    fedNuans: "No separate NUANS report is required to incorporate online with a word name. The name search is part of the federal process.",
    fedAnnual: "Filed online every year. Separate from your corporate tax return.",
    onIncorporation: "Immediate when filed online; about 15 business days by mail. Same fee either way.",
    onNuansNamed: "Required for a named corporation. Sold by private search houses, not the government.",
    onNuansNumbered: "Not needed for a numbered corporation.",
    onInitial: "No government fee. Due within 60 days of incorporation.",
    onAnnual: "No government fee. Still mandatory: a corporation can be dissolved for failing to file.",
  },
  notRequired: "Not required",
  notSelected: (amt: string) => `${amt} (not selected)`,
  sourcePre: "Source: ",
  sourceLabel: {
    federal: "Corporations Canada, Services, fees and processing times",
    ontario: "Ontario.ca, Cost and time required to register, change or search",
  },
  sourcePost: ". Amounts in CAD. Government filing fees are not subject to GST/HST.",
  nuansFootnote: `The NUANS report is not a government fee. The amount shown is Korporex's price (${enMoney(NUANS)} + HST).`,
  compareH2: "Do it yourself vs. Korporex",
  compareIntro: "Filing yourself costs only the government fee. Here is what each route includes.",
  diy: "File it yourself",
  pkgName: { basic: "Basic", standard: "Standard" },
  kxPkg: (p: string) => `Korporex ${p}`,
  cmpPrice: "Price",
  govOnly: (amt: string) => `${amt} government fees`,
  plusTax: " + tax",
  cmpRows: [
    ["Articles of Incorporation prepared and filed", "You prepare them"],
    ["Name search handled", "You order it"],
    ["Digital minute book (by-laws, resolutions, registers)", null],
    ["Mandatory post-incorporation filings", "You file them"],
  ] as [string, string | null][],
  cmpTurnaround: "Turnaround",
  dependsOnYou: "Depends on you",
  hours24: "24 hours",
  compareNote: "Korporex package prices include the government filing fee. Basic is for numbered corporations; Standard includes one NUANS name search.",
  ctaH: "Ready to incorporate?",
  ctaP: "Korporex prepares and files your incorporation online, minute book included.",
  ctaBtn: "Start your incorporation",
  faqH2: "Common questions",
  faqIntro: "Short, factual answers. Each fee links to its official source above.",
  faq: costFaq("en"),
  citeH: "Cite this table",
  citeP: "Writers and accountants are welcome to reference this fee table. Suggested link:",
  citeUrl: PAGE_URL.en,
  citeAnchor: "Cost to incorporate in Canada (Korporex)",
  disclaimer: "Korporex is not a law firm and this page is general information, not legal or tax advice. Fees are taken from the official government pages linked above and may change; the date at the top shows when they were last checked.",
};

type CostCopy = typeof en;

const fr: CostCopy = {
  money: frMoney,
  date: (iso: string) => fmtDate("fr", iso),
  h1: "Combien coûte la constitution d'une société au Canada?",
  lede: "Les droits gouvernementaux pour constituer une société fédérale (LCSA) ou ontarienne (LSAO), poste par poste, avec un lien vers la source officielle de chaque montant. Choisissez vos options ci-dessous pour voir votre total.",
  verifiedPre: "Droits vérifiés auprès des sources gouvernementales officielles le ",
  jurisdiction: "Ressort",
  jurLabel: { federal: "Fédéral", ontario: "Ontario" },
  jurSub: { federal: "LCSA, tout le Canada", ontario: "LSAO, provincial" },
  corpName: "Dénomination sociale",
  nameLabel: { named: "Nommée", numbered: "À numéro" },
  namedEg: "p. ex. Maple Ridge Inc.",
  numberedEg: (w: string) => `p. ex. 1234567 ${w} Inc.`,
  expressLabel: "Ajouter le traitement accéléré",
  expressHint: "Fédéral seulement. Quatre heures ouvrables au lieu d'une journée.",
  firstYearLabel: "Inclure le dépôt annuel de la première année",
  firstYearHint: "Montre le coût annuel pour demeurer en règle.",
  totalLabel: "Droits gouvernementaux",
  totalSplit: (once: string, year: string) => `${once} pour la constitution + ${year} de dépôt la première année.`,
  totalOnce: "Coût unique de constitution.",
  tableTitle: { federal: "Droits gouvernementaux fédéraux (LCSA)", ontario: "Droits gouvernementaux de l'Ontario (LSAO)" },
  tableSub: {
    federal: "Déposés auprès de Corporations Canada en vertu de la Loi canadienne sur les sociétés par actions.",
    ontario: "Déposés auprès du Registre des entreprises de l'Ontario en vertu de la Loi sur les sociétés par actions (Ontario).",
  },
  colFiling: "Dépôt",
  colFee: "Droit",
  tagOnce: "Unique",
  tagYearly: "Annuel",
  tagOptional: "Facultatif",
  rows: {
    incorporation: "Statuts constitutifs",
    express: "Service accéléré",
    nuans: "Recherche de nom (NUANS)",
    annual: "Déclaration annuelle",
    initialReturn: "Rapport initial",
    annualOn: "Déclaration annuelle (Loi sur les renseignements exigés des personnes morales)",
  },
  notes: {
    fedIncorporation: "Déposés en ligne. Traitement standard en un jour ouvrable.",
    fedExpress: "Facultatif. Réduit le traitement à quatre heures ouvrables.",
    fedNuans: "Aucun rapport NUANS distinct n'est requis pour constituer une société en ligne avec un nom composé de mots. La recherche de nom fait partie du processus fédéral.",
    fedAnnual: "Déposée en ligne chaque année. Distincte de votre déclaration de revenus de société.",
    onIncorporation: "Immédiat en ligne; environ 15 jours ouvrables par la poste. Même droit dans les deux cas.",
    onNuansNamed: "Requise pour une société nommée. Vendue par des maisons de recherche privées, non par le gouvernement.",
    onNuansNumbered: "Non requise pour une société à numéro.",
    onInitial: "Aucun droit gouvernemental. À déposer dans les 60 jours suivant la constitution.",
    onAnnual: "Aucun droit gouvernemental. Toujours obligatoire : une société peut être dissoute si elle ne la dépose pas.",
  },
  notRequired: "Non requis",
  notSelected: (amt: string) => `${amt} (non sélectionné)`,
  sourcePre: "Source : ",
  sourceLabel: {
    federal: "Corporations Canada, Services, droits et délais de traitement",
    ontario: "Ontario.ca, Coûts et délais pour enregistrer, modifier ou rechercher",
  },
  sourcePost: ". Montants en dollars canadiens. Les droits de dépôt gouvernementaux ne sont pas assujettis à la TPS/TVH.",
  nuansFootnote: `Le rapport NUANS n'est pas un droit gouvernemental. Le montant indiqué est le prix de Korporex (${frMoney(NUANS)} + TVH).`,
  compareH2: "Le faire soi-même ou passer par Korporex",
  compareIntro: "Le faire soi-même ne coûte que le droit gouvernemental. Voici ce que comprend chaque option.",
  diy: "Le faire soi-même",
  pkgName: { basic: "Basique", standard: "Standard" },
  kxPkg: (p: string) => `Korporex ${p}`,
  cmpPrice: "Prix",
  govOnly: (amt: string) => `${amt} de droits gouvernementaux`,
  plusTax: " + taxes",
  cmpRows: [
    ["Statuts constitutifs préparés et déposés", "Vous les préparez"],
    ["Recherche de nom prise en charge", "Vous la commandez"],
    ["Livre des procès-verbaux numérique (règlements, résolutions, registres)", null],
    ["Dépôts obligatoires après la constitution", "Vous les déposez"],
  ] as [string, string | null][],
  cmpTurnaround: "Délai",
  dependsOnYou: "Dépend de vous",
  hours24: "24 heures",
  compareNote: "Les prix des forfaits Korporex incluent le droit de dépôt gouvernemental. Basique est pour les sociétés à numéro; Standard comprend une recherche de nom NUANS.",
  ctaH: "Prêt à constituer votre société?",
  ctaP: "Korporex prépare et dépose votre constitution en ligne, livre des procès-verbaux inclus (documents en anglais).",
  ctaBtn: "Commencer la constitution",
  faqH2: "Questions fréquentes",
  faqIntro: "Des réponses courtes et factuelles. Chaque droit renvoie à sa source officielle ci-dessus.",
  faq: costFaq("fr"),
  citeH: "Citer ce tableau",
  citeP: "Rédacteurs et comptables peuvent citer ce tableau des droits. Lien suggéré :",
  citeUrl: PAGE_URL.fr,
  citeAnchor: "Coût de constitution d'une société au Canada (Korporex)",
  disclaimer: "Korporex n'est pas un cabinet d'avocats et cette page est de l'information générale, et non un avis juridique ou fiscal. Les droits proviennent des pages gouvernementales officielles indiquées ci-dessus et peuvent changer; la date en haut indique leur dernière vérification.",
};

const es: CostCopy = {
  money: esMoney,
  date: (iso: string) => fmtDate("es", iso),
  h1: "¿Cuánto cuesta constituir una sociedad en Canadá?",
  lede: "Las tasas gubernamentales para constituir una sociedad federal (CBCA) o de Ontario (OBCA), partida por partida, con un enlace a la fuente oficial de cada cifra. Elija sus opciones abajo para ver su total.",
  verifiedPre: "Tasas verificadas con fuentes gubernamentales oficiales el ",
  jurisdiction: "Jurisdicción",
  jurLabel: { federal: "Federal", ontario: "Ontario" },
  jurSub: { federal: "CBCA, todo Canadá", ontario: "OBCA, provincial" },
  corpName: "Nombre de la sociedad",
  nameLabel: { named: "Con nombre", numbered: "Numerada" },
  namedEg: "p. ej., Maple Ridge Inc.",
  numberedEg: (w: string) => `p. ej., 1234567 ${w} Inc.`,
  expressLabel: "Agregar trámite exprés",
  expressHint: "Solo federal. Cuatro horas hábiles en lugar de un día.",
  firstYearLabel: "Incluir la presentación anual del primer año",
  firstYearHint: "Muestra el costo anual de mantenerse al día.",
  totalLabel: "Tasas gubernamentales",
  totalSplit: (once: string, year: string) => `${once} para constituir + ${year} de presentación el primer año.`,
  totalOnce: "Costo único de constitución.",
  tableTitle: { federal: "Tasas gubernamentales federales (CBCA)", ontario: "Tasas gubernamentales de Ontario (OBCA)" },
  tableSub: {
    federal: "Se presentan ante Corporations Canada conforme a la Ley de Sociedades por Acciones de Canadá (CBCA).",
    ontario: "Se presentan ante el Registro de Empresas de Ontario conforme a la Business Corporations Act (Ontario).",
  },
  colFiling: "Trámite",
  colFee: "Tasa",
  tagOnce: "Única",
  tagYearly: "Anual",
  tagOptional: "Opcional",
  rows: {
    incorporation: "Estatutos de constitución",
    express: "Servicio exprés",
    nuans: "Búsqueda de nombre (NUANS)",
    annual: "Declaración anual",
    initialReturn: "Declaración inicial",
    annualOn: "Declaración anual (Corporations Information Act)",
  },
  notes: {
    fedIncorporation: "Se presentan en línea. Trámite estándar de un día hábil.",
    fedExpress: "Opcional. Reduce el trámite a cuatro horas hábiles.",
    fedNuans: "No se requiere un informe NUANS por separado para constituir en línea con un nombre de palabras. La búsqueda de nombre forma parte del proceso federal.",
    fedAnnual: "Se presenta en línea cada año. Es distinta de la declaración de impuestos de la sociedad.",
    onIncorporation: "Inmediato en línea; unos 15 días hábiles por correo. La misma tasa en ambos casos.",
    onNuansNamed: "Requerida para una sociedad con nombre. La venden empresas privadas de búsqueda, no el gobierno.",
    onNuansNumbered: "No se requiere para una sociedad numerada.",
    onInitial: "Sin tasa gubernamental. Vence dentro de los 60 días posteriores a la constitución.",
    onAnnual: "Sin tasa gubernamental. Sigue siendo obligatoria: una sociedad puede ser disuelta si no la presenta.",
  },
  notRequired: "No se requiere",
  notSelected: (amt: string) => `${amt} (no seleccionado)`,
  sourcePre: "Fuente: ",
  sourceLabel: {
    federal: "Corporations Canada, Services, fees and processing times",
    ontario: "Ontario.ca, Cost and time required to register, change or search",
  },
  sourcePost: ". Importes en dólares canadienses. Las tasas gubernamentales de presentación no están sujetas a GST/HST.",
  nuansFootnote: `El informe NUANS no es una tasa gubernamental. El importe indicado es el precio de Korporex (${esMoney(NUANS)} + HST).`,
  compareH2: "Hacerlo usted mismo o con Korporex",
  compareIntro: "Hacerlo usted mismo solo cuesta la tasa gubernamental. Esto es lo que incluye cada opción.",
  diy: "Hacerlo usted mismo",
  pkgName: { basic: "Básico", standard: "Estándar" },
  kxPkg: (p: string) => `Korporex ${p}`,
  cmpPrice: "Precio",
  govOnly: (amt: string) => `${amt} en tasas gubernamentales`,
  plusTax: " + impuestos",
  cmpRows: [
    ["Estatutos de constitución preparados y presentados", "Usted los prepara"],
    ["Búsqueda de nombre gestionada", "Usted la solicita"],
    ["Libro de actas digital (estatutos internos, resoluciones, registros)", null],
    ["Presentaciones obligatorias posteriores a la constitución", "Usted las presenta"],
  ] as [string, string | null][],
  cmpTurnaround: "Plazo",
  dependsOnYou: "Depende de usted",
  hours24: "24 horas",
  compareNote: "Los precios de los paquetes Korporex incluyen la tasa gubernamental de presentación. Básico es para sociedades numeradas; Estándar incluye una búsqueda de nombre NUANS.",
  ctaH: "¿Listo para constituir su sociedad?",
  ctaP: "Korporex prepara y presenta su constitución en línea, con libro de actas incluido (documentos en inglés).",
  ctaBtn: "Comenzar la constitución",
  faqH2: "Preguntas frecuentes",
  faqIntro: "Respuestas breves y objetivas. Cada tasa enlaza a su fuente oficial arriba.",
  faq: costFaq("es"),
  citeH: "Citar esta tabla",
  citeP: "Redactores y contadores pueden citar esta tabla de tasas. Enlace sugerido:",
  citeUrl: PAGE_URL.es,
  citeAnchor: "Costo de constituir una sociedad en Canadá (Korporex)",
  disclaimer: "Korporex no es un bufete de abogados y esta página es información general, no asesoramiento legal ni fiscal. Las tasas provienen de las páginas gubernamentales oficiales enlazadas arriba y pueden cambiar; la fecha de arriba indica cuándo se verificaron por última vez.",
};

export const COST_COPY: Record<CostLang, CostCopy> = { en, fr, es };
