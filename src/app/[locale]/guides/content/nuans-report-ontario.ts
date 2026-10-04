import type { Article, ArticleInline, ArticleSection } from "../articles";

// Ontario NUANS report guide (en/fr/es). Targets the Ontario NUANS cluster
// ("nuans report ontario", "nuans search ontario", "nuans name search
// ontario", "order nuans report") and feeds relevance to /nuans. Facts are
// taken from Ontario's own filing notices: BCA incorporation (effective
// 2025-02-01), amendment, amalgamation, reorganization and revival notices,
// the 5351E articles of incorporation instructions, and O. Reg. 401/21 under
// the Extra-Provincial Corporations Act. Verified 2026-10-04.

// Paragraph with inline links; the plain `text` is derived from the parts.
function p(...parts: ArticleInline[]): ArticleSection {
  return {
    type: "paragraph",
    text: parts.map((x) => (typeof x === "string" ? x : x.text)).join(""),
    parts,
  };
}

const PUBLISHED_AT = "2026-10-04T12:00:00-04:00";
const UPDATED = "2026-10-04";

const en: Article = {
  slug: "nuans-report-ontario",
  locale: "en",
  group: "nuans-report-ontario",
  category: "Incorporation Guides",
  title: "NUANS Report Ontario: How to Order One and File It",
  excerpt:
    "Ontario accepts only an Ontario-biased NUANS report, dated within 90 days, and the government never checks your name for you. Here is which filings need one, how to order it, and exactly what to enter on the Ontario Business Registry.",
  metaTitle: "NUANS Report Ontario: How to Order and File One | Korporex",
  metaDescription:
    "Ontario requires an Ontario-biased NUANS report to incorporate a named corporation. How to order one online, what to enter on the OBR, and the 90-day rule.",
  readTime: "11 min read",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "If you are incorporating a named corporation in Ontario, you need a NUANS report, and not just any NUANS report. Ontario accepts only an Ontario-biased report, dated no more than 90 days before the articles are filed, ordered from a private search provider. The province does not run the search for you, and it will not accept a federally biased report in its place.",
    },
    {
      type: "paragraph",
      text: "This guide is the Ontario-specific version of the NUANS process, written for founders incorporating their own company and for the law clerks and corporate assistants who order these reports every week. It covers which Ontario filings need a report, how to order one, what you actually enter on the Ontario Business Registry, and the timing rules that cause most re-orders.",
    },
    { type: "heading", id: "what-it-is", text: "What an Ontario NUANS report is" },
    p(
      "NUANS (Newly Upgraded Automated Name Search) is a federal database of Canadian corporate names, business names and trademarks, administered by Innovation, Science and Economic Development Canada. A ",
      { text: "NUANS name search", href: "/guides/what-is-nuans-name-search" },
      " compares your proposed name against those records and returns a report listing the closest existing names.",
    ),
    {
      type: "paragraph",
      text: "Every NUANS report draws on the same national data, but each one is run for a particular jurisdiction. An Ontario-biased (Ontario's notices also say \"weighted\") report gives priority to the names that matter most for an Ontario filing. Ontario's incorporation notice is blunt about the alternative: \"A Canada (federal) biased Nuans name search is not acceptable.\" If the report header does not say Ontario, it cannot support an Ontario filing.",
    },
    {
      type: "paragraph",
      text: "Ontario also does not sell the report. Its notice states that the report \"must be obtained from a private name search company\" and that \"the Ministry does not provide this search.\" In practice that means a registered NUANS search house, or a service such as Korporex that orders the report for you.",
    },
    { type: "heading", id: "no-name-review", text: "Ontario does not check your name for you" },
    {
      type: "paragraph",
      text: "This is the single most important difference between an Ontario and a federal incorporation, and it is the reason the report matters more in Ontario than anywhere else. Federally, a Corporations Canada examiner reviews the proposed name before it is granted. Ontario does not. In the province's own words: \"The Ministry does not review proposed corporate names for similarity to any other name.\"",
    },
    {
      type: "paragraph",
      text: "Responsibility sits with the incorporators. Ontario's notice says it is the applicant's responsibility to check the search report for similar or identical names and to obtain any consent that may be required, and that a corporation that acquires a name similar to another may be the subject of a names hearing under section 12 of the Business Corporations Act, or a lawsuit.",
    },
    {
      type: "callout",
      title: "What this means in practice",
      text: "In Ontario, a filing can go through with a name that conflicts with an existing business. Nobody at the registry will stop it. The NUANS report is your only systematic look at the conflicts before you file, so reading it properly is not optional. A clean filing is not the same as a safe name.",
    },
    p(
      "If you have never worked through one, our guide on ",
      { text: "how to read a NUANS report", href: "/guides/how-to-read-a-nuans-report" },
      " explains the ranked list, the source codes, and how to tell a serious conflict from background noise.",
    ),
    { type: "heading", id: "which-filings", text: "Which Ontario filings need a NUANS report" },
    {
      type: "paragraph",
      text: "Incorporation is the most common reason to order an Ontario report, but it is not the only one. Ontario's filing notices set out the following:",
    },
    {
      type: "table",
      head: ["Ontario filing", "NUANS report required?", "Notes"],
      rows: [
        ["Articles of incorporation (OBCA)", "Yes, for a named corporation", "Not required for a number name"],
        ["Articles of amendment changing the name", "Yes", "Not required if the new name is a number name"],
        ["Articles of amalgamation", "Yes, for a new name", "Not required for a number name or the name of one of the amalgamating corporations"],
        ["Articles of reorganization changing the name", "Yes", "Not required if the new name is a number name"],
        ["Articles of revival", "Only if dissolved 10 years or more", "Changing the name on revival needs articles of amendment afterwards, with a report"],
        ["Not-for-profit incorporation (ONCA)", "Yes, for a named corporation", "Same Ontario-biased, 90-day rules"],
        ["Extra-provincial licence (class 3)", "Yes", "For corporations incorporated outside Canada, under O. Reg. 401/21"],
        ["Business name registration (Business Names Act)", "No", "Registered through the Ontario Business Registry without a NUANS report"],
      ],
    },
    p(
      "Two of those are worth a second look. Changing the name of an existing corporation is a ",
      { text: "name change by articles of amendment", href: "/services/change-name" },
      ", and it needs a fresh report for the new name. A ",
      { text: "revival", href: "/services/revive-business" },
      " only needs a report when the corporation has been dissolved for 10 years or more, which catches out people who assume every revival needs one.",
    ),
    { type: "heading", id: "how-to-order", text: "How to order a NUANS report in Ontario, step by step" },
    {
      type: "list",
      items: [
        "Screen the name for free first. Search the Ontario Business Registry (Ontario.ca/BusinessRegistry), which Ontario itself suggests before you order a report, and the Canadian Trademarks Database. If an identical name in your industry turns up, you have saved the cost of a report.",
        "Settle the exact name, legal element included. Ontario requires the name on the articles to be identical to the name searched in NUANS and to contain a legal element: Limited, Limitée, Incorporated, Incorporée, Corporation, or the abbreviations Ltd., Ltée, Inc. or Corp.",
        "Identify the distinctive element. NUANS weights the distinctive part of the name, not the descriptive words. In \"Maple Ridge Logistics Inc.\" the search is effectively a search on \"Maple Ridge.\"",
        "Decide on English, French or both. Each form of the name needs its own search, unless the English and French forms are identical and only the legal element is translated.",
        "Order an Ontario-biased report. Ask for Ontario as the jurisdiction. Putting two or three candidate names on the same order costs far less time than discovering conflicts one at a time.",
        "Check the report header. Confirm the jurisdiction says Ontario, the name is spelled exactly as you will file it, and note the report date and reference number.",
        "File within 90 days. Enter the reference number, the name searched and the report date on the articles, and keep the report with the corporation's records.",
      ],
    },
    { type: "heading", id: "obr-fields", text: "What you enter on the Ontario Business Registry" },
    {
      type: "paragraph",
      text: "You do not upload the report. When you incorporate through the Ontario Business Registry, you are asked for three things: the NUANS report reference number, the proposed name searched, and the date of the search report. Ontario's notice states that \"the Ministry will retrieve the report directly\" using that information.",
    },
    {
      type: "paragraph",
      text: "The report itself stays with you. Ontario requires it to be kept at the corporation's registered office, and the instructions for the paper articles say plainly: \"Please do not send it with the form.\" Most firms file it in the minute book alongside the certificate and articles, which is where anyone reviewing the corporation's records later will look for it.",
    },
    {
      type: "callout",
      title: "The most common data-entry error",
      text: "The name searched must match the name on the articles exactly, including the legal element. If the report was run for \"Maple Ridge Logistics Inc.\" and the articles say \"Maple Ridge Logistics Ltd.\", fix one or the other before you file. Do not assume the registry will treat them as the same name.",
    },
    { type: "heading", id: "ninety-days", text: "The 90-day rule, and how it catches people out" },
    {
      type: "paragraph",
      text: "An Ontario NUANS report \"cannot be dated more than 90 days prior to the filing of the articles.\" Ontario's own example: articles received on November 28 could be supported by a report dated as early as August 30, but not earlier. The clock runs from the date printed on the report, not from the day you paid for it or downloaded it.",
    },
    {
      type: "paragraph",
      text: "Three details turn that simple rule into the most common reason for a second report:",
    },
    {
      type: "list",
      items: [
        "The report must still be valid when the articles are endorsed. Ontario warns that if the report expires before endorsement, a valid report must be obtained to complete the filing.",
        "A future effective date does not buy you time. You can ask for an effective date up to 30 calendar days ahead, but only as long as the NUANS report date is still valid.",
        "Saving a draft does not stop the clock. The Ontario Business Registry lets you save a draft, but Ontario says it is your responsibility to file time-sensitive documents such as NUANS reports before they expire.",
      ],
    },
    {
      type: "paragraph",
      text: "The practical habit is simple: order the report once the share structure, directors and registered office are settled, not when the client first mentions a name, and diarise the expiry the day the report arrives.",
    },
    { type: "heading", id: "english-french", text: "English and French names" },
    {
      type: "paragraph",
      text: "Ontario lets a corporation have an English name, a French name, a combined English and French name, or equivalent English and French names used separately. A NUANS search is required for each form of the name. The one exception: if the English and French forms are identical and the only difference is that the French form uses the French version of the legal element (Inc. and Incorporée, for example), one search covers both.",
    },
    { type: "heading", id: "identical-names", text: "Identical names and the legal opinion" },
    {
      type: "paragraph",
      text: "An identical name is not automatically fatal in Ontario. The Names and Filings Regulation allows a corporation to acquire an identical name in specific circumstances, but it must then rely on a legal opinion meeting the regulation's requirements, keep it at the registered office, and give the lawyer's contact information when it files. That is a lawyer's call, not a search provider's. Note also that adding or removing punctuation or symbols does not make a name different for these purposes.",
    },
    { type: "heading", id: "free-search", text: "Is there a free NUANS search in Ontario?" },
    {
      type: "paragraph",
      text: "Not one you can file. There are useful free checks, and they are worth running before you pay for anything:",
    },
    {
      type: "list",
      items: [
        "The Ontario Business Registry search, for corporations and business names on Ontario's own records.",
        "Canada's Business Registries search, for federal corporations and participating provinces.",
        "The Canadian Trademarks Database from the Canadian Intellectual Property Office, for registered and pending trademarks.",
        "Free \"pre-searches\" offered by some providers, which give a quick look at obvious conflicts.",
      ],
    },
    {
      type: "paragraph",
      text: "None of these produces a NUANS reference number, and none can be entered on Ontario articles. They are triage for shortlisting names. The filed document is always a paid, Ontario-biased NUANS report.",
    },
    { type: "heading", id: "cost", text: "What an Ontario NUANS report costs" },
    p(
      "There is no government fee for the report itself, because Ontario does not sell it. The price is set by whichever provider runs the search. Korporex charges a flat $39.99 plus HST per proposed name. Separately, Ontario charges $300 to file articles of incorporation. Our guide to the ",
      { text: "cost to incorporate in Ontario", href: "/guides/cost-to-incorporate-in-ontario" },
      " sets out the full picture, and a ",
      { text: "numbered corporation", href: "/guides/named-vs-numbered-corporation" },
      " avoids the name search entirely.",
    ),
    { type: "heading", id: "federal-or-ontario", text: "Ontario or federal: which report do you need?" },
    p(
      "The report follows the jurisdiction you incorporate in, not where you live or do business. An Ontario corporation needs an Ontario-biased report. A federal corporation does not need a separately ordered report to incorporate, because Corporations Canada runs the name search inside its online filing, although a federal report is still required for some filings such as a revival or amalgamation. If you have not chosen yet, compare ",
      { text: "federal and provincial incorporation", href: "/guides/federal-vs-provincial-incorporation" },
      " first, and see ",
      { text: "which provinces require NUANS", href: "/guides/which-provinces-require-nuans" },
      " if you are filing outside Ontario.",
    ),
    { type: "heading", id: "law-firms", text: "For law firms and law clerks" },
    p(
      "Ontario corporate practices order more Ontario-biased reports than anyone else, usually through the same integrated search platform the firm has used for years. A NUANS report is a self-contained PDF with a reference number, so it does not need to come from the same vendor as your minute books or corporate searches. Korporex takes multiple proposed names on one order at a flat per-name fee, captures the distinctive element as its own field, and returns the reports by email. Our ",
      { text: "NUANS procurement guide for law firms", href: "/guides/nuans-report-for-law-firms" },
      " covers what to compare when you price this out.",
    ),
    { type: "heading", id: "order", text: "Order your Ontario NUANS report" },
    p(
      "Korporex orders Ontario-biased NUANS reports for incorporations, name changes, amalgamations and every other Ontario filing that needs one, at $39.99 plus HST per name, with no account or membership. ",
      { text: "Order a NUANS report", href: "/nuans" },
      " for one name or several, and if the name clears, Korporex can also ",
      { text: "file your Ontario incorporation", href: "/incorporate" },
      ". Korporex is not a law firm and does not advise on whether a name is safe to use; questions about conflicts, consents or identical names should go to a lawyer.",
    ),
    {
      type: "paragraph",
      text: "Requirements described here reflect Ontario's published filing notices and regulations as of October 2026. They change from time to time, so confirm current rules with ServiceOntario before you file. Nothing in this guide is legal advice.",
    },
  ],
  faq: [
    {
      q: "Do I need a NUANS report to incorporate in Ontario?",
      a: "Yes, if the corporation will have a word name. Ontario requires an Ontario-biased NUANS report, dated no more than 90 days before filing, for articles of incorporation under the Business Corporations Act. A numbered corporation does not need one.",
    },
    {
      q: "Can I use a federal NUANS report for an Ontario incorporation?",
      a: "No. Ontario's filing notice states that a Canada (federal) biased NUANS name search is not acceptable. The report must be run for Ontario.",
    },
    {
      q: "How long is an Ontario NUANS report valid?",
      a: "90 days. The report cannot be dated more than 90 days before the articles are filed, and it must still be valid when the articles are endorsed. If it expires first, you need a new report.",
    },
    {
      q: "Do I upload the NUANS report to the Ontario Business Registry?",
      a: "No. You enter the report's reference number, the proposed name searched and the report date, and the Ministry retrieves the report directly. You keep the report at the corporation's registered office, usually in the minute book.",
    },
    {
      q: "Does the Ontario government check whether my name is available?",
      a: "No. Ontario states that the Ministry does not review proposed corporate names for similarity to any other name. Checking the NUANS report for conflicts is the applicant's responsibility, and a conflicting name can lead to a names hearing or a lawsuit.",
    },
    {
      q: "Is there a free NUANS search in Ontario?",
      a: "There is no free NUANS report you can file. The Ontario Business Registry search, Canada's Business Registries and the Canadian Trademarks Database are free and useful for screening names, but only a paid Ontario-biased NUANS report has the reference number Ontario asks for.",
    },
    {
      q: "Do I need a new NUANS report to change my Ontario corporation's name?",
      a: "Yes. Articles of amendment that change the name need an Ontario-biased NUANS report for the new name, unless the new name is a number name.",
    },
    {
      q: "How much does an Ontario NUANS report cost?",
      a: "Ontario charges no government fee for the report; the price is set by the provider. Korporex charges a flat $39.99 plus HST per proposed name. Ontario's fee to file articles of incorporation is $300.",
    },
  ],
};

const fr: Article = {
  slug: "rapport-nuans-ontario",
  locale: "fr",
  group: "nuans-report-ontario",
  category: "Incorporation Guides",
  title: "Rapport NUANS en Ontario : comment le commander et le déposer",
  excerpt:
    "L'Ontario n'accepte qu'un rapport NUANS à pondération ontarienne, daté de moins de 90 jours, et le gouvernement ne vérifie jamais votre nom à votre place. Voici les dépôts qui l'exigent, comment le commander et quoi inscrire au Registre des entreprises de l'Ontario.",
  metaTitle: "Rapport NUANS Ontario : commander et déposer | Korporex",
  metaDescription:
    "L'Ontario exige un rapport NUANS ontarien pour constituer une société nominative. Comment le commander, quoi inscrire au Registre et la règle des 90 jours.",
  readTime: "11 min de lecture",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Si vous constituez une société nominative en Ontario, il vous faut un rapport NUANS, et pas n'importe lequel. L'Ontario n'accepte qu'un rapport à pondération ontarienne, daté d'au plus 90 jours avant le dépôt des statuts, obtenu auprès d'un fournisseur privé de recherche. La province n'effectue pas la recherche pour vous et n'accepte pas un rapport à pondération fédérale à la place.",
    },
    {
      type: "paragraph",
      text: "Ce guide présente la démarche NUANS propre à l'Ontario. Il s'adresse aux fondateurs qui constituent leur propre société comme aux techniciens juridiques et adjoints qui commandent ces rapports chaque semaine. Il couvre les dépôts ontariens qui exigent un rapport, la façon de le commander, ce que vous inscrivez réellement au Registre des entreprises de l'Ontario et les règles de délai à l'origine de la plupart des nouvelles commandes.",
    },
    { type: "heading", id: "definition", text: "Qu'est-ce qu'un rapport NUANS ontarien ?" },
    p(
      "NUANS (Nouveau système automatisé de recherche de noms) est une base de données fédérale des dénominations sociales, noms commerciaux et marques de commerce au Canada, administrée par Innovation, Sciences et Développement économique Canada. Une ",
      { text: "recherche de nom NUANS", href: "/guides/recherche-de-nom-nuans" },
      " compare le nom proposé à ces données et produit un rapport des noms existants les plus proches.",
    ),
    {
      type: "paragraph",
      text: "Tous les rapports NUANS puisent dans les mêmes données nationales, mais chacun est produit pour une administration précise. Un rapport à pondération ontarienne accorde la priorité aux noms qui comptent le plus pour un dépôt en Ontario. L'avis ontarien sur la constitution est clair : une recherche NUANS à pondération fédérale (Canada) n'est pas acceptée. Si l'en-tête du rapport n'indique pas l'Ontario, il ne peut pas appuyer un dépôt ontarien.",
    },
    {
      type: "paragraph",
      text: "L'Ontario ne vend pas non plus le rapport. Son avis précise que le rapport doit être obtenu auprès d'une entreprise privée de recherche de noms et que le ministère n'offre pas cette recherche. En pratique, on passe par une maison de recherche inscrite à NUANS, ou par un service comme Korporex qui commande le rapport pour vous.",
    },
    { type: "heading", id: "aucun-examen", text: "L'Ontario ne vérifie pas votre nom" },
    {
      type: "paragraph",
      text: "C'est la différence la plus importante entre une constitution ontarienne et une constitution fédérale, et c'est pourquoi le rapport compte davantage en Ontario qu'ailleurs. Au fédéral, un examinateur de Corporations Canada étudie le nom proposé avant de l'accorder. En Ontario, non : selon la province, le ministère n'examine pas les dénominations proposées pour déterminer leur similitude avec d'autres noms.",
    },
    {
      type: "paragraph",
      text: "La responsabilité revient aux fondateurs. L'avis ontarien indique qu'il incombe au demandeur de vérifier le rapport pour repérer les noms semblables ou identiques et d'obtenir tout consentement nécessaire, et qu'une société qui adopte un nom semblable à celui d'une autre peut faire l'objet d'une audience sur les dénominations en vertu de l'article 12 de la Loi sur les sociétés par actions, ou d'une poursuite.",
    },
    {
      type: "callout",
      title: "Ce que cela signifie en pratique",
      text: "En Ontario, un dépôt peut être accepté avec un nom qui entre en conflit avec une entreprise existante. Personne au registre ne l'arrêtera. Le rapport NUANS est votre seul examen systématique des conflits avant le dépôt; le lire correctement n'est donc pas facultatif. Un dépôt accepté n'est pas synonyme d'un nom sûr.",
    },
    p(
      "Si vous n'en avez jamais analysé, notre guide sur ",
      { text: "la lecture d'un rapport NUANS", href: "/guides/comment-lire-un-rapport-nuans" },
      " explique la liste classée, les codes de source et comment distinguer un conflit sérieux du simple bruit de fond.",
    ),
    { type: "heading", id: "depots", text: "Les dépôts ontariens qui exigent un rapport NUANS" },
    {
      type: "paragraph",
      text: "La constitution est la raison la plus courante de commander un rapport ontarien, mais pas la seule. Les avis de dépôt de l'Ontario prévoient ce qui suit :",
    },
    {
      type: "table",
      head: ["Dépôt en Ontario", "Rapport NUANS exigé ?", "Remarques"],
      rows: [
        ["Statuts constitutifs (LSAO)", "Oui, pour une société nominative", "Non exigé pour une dénomination numérique"],
        ["Statuts de modification changeant le nom", "Oui", "Non exigé si le nouveau nom est numérique"],
        ["Statuts de fusion", "Oui, pour un nouveau nom", "Non exigé pour un nom numérique ou le nom d'une des sociétés fusionnantes"],
        ["Statuts de réorganisation changeant le nom", "Oui", "Non exigé si le nouveau nom est numérique"],
        ["Statuts de reconstitution", "Seulement si dissoute depuis 10 ans ou plus", "Changer le nom lors de la reconstitution exige ensuite des statuts de modification, avec un rapport"],
        ["Constitution d'un organisme sans but lucratif (LOSBL)", "Oui, pour une personne morale nominative", "Mêmes règles : pondération ontarienne et 90 jours"],
        ["Permis extraprovincial (catégorie 3)", "Oui", "Pour les sociétés constituées hors du Canada, selon le Règl. de l'Ont. 401/21"],
        ["Enregistrement d'un nom commercial (Loi sur les noms commerciaux)", "Non", "Enregistré au Registre des entreprises de l'Ontario sans rapport NUANS"],
      ],
    },
    p(
      "Deux de ces cas méritent qu'on s'y arrête. Changer le nom d'une société existante passe par un ",
      { text: "changement de nom par statuts de modification", href: "/services/change-name" },
      ", qui exige un nouveau rapport pour le nouveau nom. Une ",
      { text: "reconstitution", href: "/services/revive-business" },
      " n'exige un rapport que si la société est dissoute depuis 10 ans ou plus, ce qui surprend ceux qui croient que toute reconstitution en exige un.",
    ),
    { type: "heading", id: "commander", text: "Commander un rapport NUANS en Ontario, étape par étape" },
    {
      type: "list",
      items: [
        "Faites d'abord un tri gratuit. Cherchez le nom dans le Registre des entreprises de l'Ontario (Ontario.ca/BusinessRegistry), ce que l'Ontario recommande lui-même avant de commander un rapport, et dans la Base de données sur les marques de commerce canadiennes. Si un nom identique apparaît dans votre secteur, vous économisez le coût d'un rapport.",
        "Arrêtez le nom exact, élément juridique compris. L'Ontario exige que le nom des statuts soit identique au nom recherché dans NUANS et qu'il contienne un élément juridique : Limitée, Limited, Incorporée, Incorporated, Corporation, ou les abréviations Ltée, Ltd., Inc. ou Corp.",
        "Repérez l'élément distinctif. NUANS pondère la partie distinctive du nom, pas les mots descriptifs. Pour « Logistique Maple Ridge Inc. », la recherche porte en fait sur « Maple Ridge ».",
        "Choisissez anglais, français ou les deux. Chaque forme du nom exige sa propre recherche, sauf si les formes anglaise et française sont identiques et que seul l'élément juridique est traduit.",
        "Commandez un rapport à pondération ontarienne. Précisez l'Ontario comme administration. Inscrire deux ou trois noms candidats sur la même commande fait gagner beaucoup plus de temps que de découvrir les conflits un à un.",
        "Vérifiez l'en-tête du rapport. Confirmez que l'administration indiquée est l'Ontario, que le nom est écrit exactement comme vous le déposerez, et notez la date et le numéro de référence.",
        "Déposez dans les 90 jours. Inscrivez le numéro de référence, le nom recherché et la date du rapport dans les statuts, et conservez le rapport avec les registres de la société.",
      ],
    },
    { type: "heading", id: "registre", text: "Ce que vous inscrivez au Registre des entreprises de l'Ontario" },
    {
      type: "paragraph",
      text: "Vous ne téléversez pas le rapport. Lors d'une constitution au Registre des entreprises de l'Ontario, on vous demande trois renseignements : le numéro de référence du rapport NUANS, le nom proposé qui a été recherché et la date du rapport. L'avis ontarien précise que le ministère récupère le rapport directement à l'aide de ces renseignements.",
    },
    {
      type: "paragraph",
      text: "Le rapport reste chez vous. L'Ontario exige qu'il soit conservé au siège social de la société, et les instructions des statuts papier demandent expressément de ne pas l'envoyer avec le formulaire. La plupart des cabinets le classent dans le livre des procès-verbaux avec le certificat et les statuts, là où toute personne qui examinera plus tard les registres de la société le cherchera.",
    },
    {
      type: "callout",
      title: "L'erreur de saisie la plus fréquente",
      text: "Le nom recherché doit correspondre exactement au nom des statuts, élément juridique compris. Si le rapport porte sur « Logistique Maple Ridge Inc. » et que les statuts indiquent « Logistique Maple Ridge Ltée », corrigez l'un ou l'autre avant de déposer. Ne présumez pas que le registre les traitera comme le même nom.",
    },
    { type: "heading", id: "quatre-vingt-dix-jours", text: "La règle des 90 jours, et ses pièges" },
    {
      type: "paragraph",
      text: "Un rapport NUANS ontarien ne peut être daté de plus de 90 jours avant le dépôt des statuts. L'exemple de l'Ontario : des statuts reçus le 28 novembre pourraient être appuyés par un rapport daté au plus tôt du 30 août, mais pas avant. Le délai court à partir de la date imprimée sur le rapport, et non du jour où vous l'avez payé ou téléchargé.",
    },
    {
      type: "paragraph",
      text: "Trois détails font de cette règle simple la cause la plus fréquente d'un second rapport :",
    },
    {
      type: "list",
      items: [
        "Le rapport doit encore être valide au moment de l'endossement des statuts. L'Ontario prévient que s'il expire avant, un rapport valide doit être obtenu pour terminer le dépôt.",
        "Une date d'effet future ne vous donne pas de délai supplémentaire. Vous pouvez demander une date d'effet jusqu'à 30 jours civils plus tard, mais seulement si la date du rapport NUANS est encore valide.",
        "Enregistrer une ébauche n'arrête pas le compteur. Le Registre permet d'enregistrer une ébauche, mais l'Ontario précise qu'il vous revient de déposer les documents à échéance, comme les rapports NUANS, avant leur expiration.",
      ],
    },
    {
      type: "paragraph",
      text: "La bonne habitude est simple : commandez le rapport une fois la structure du capital, les administrateurs et le siège social arrêtés, et non dès que le client évoque un nom, puis inscrivez l'échéance au dossier le jour même où le rapport arrive.",
    },
    { type: "heading", id: "anglais-francais", text: "Noms anglais et français" },
    {
      type: "paragraph",
      text: "En Ontario, une société peut avoir un nom anglais, un nom français, un nom combinant l'anglais et le français, ou des noms anglais et français équivalents utilisés séparément. Une recherche NUANS est exigée pour chaque forme du nom. Une exception : si les formes anglaise et française sont identiques et que seule la version française de l'élément juridique diffère (Inc. et Incorporée, par exemple), une seule recherche couvre les deux.",
    },
    { type: "heading", id: "noms-identiques", text: "Noms identiques et avis juridique" },
    {
      type: "paragraph",
      text: "Un nom identique n'est pas automatiquement exclu en Ontario. Le règlement sur les noms et les dépôts permet, dans des circonstances précises, d'adopter un nom identique, mais la société doit alors s'appuyer sur un avis juridique conforme au règlement, le conserver au siège social et fournir les coordonnées de l'avocat lors du dépôt. C'est une question pour un avocat, pas pour un fournisseur de recherche. Notez aussi que l'ajout ou la suppression de ponctuation ou de symboles ne rend pas un nom différent à ces fins.",
    },
    { type: "heading", id: "recherche-gratuite", text: "Existe-t-il une recherche NUANS gratuite en Ontario ?" },
    {
      type: "paragraph",
      text: "Pas une que vous pouvez déposer. Il existe des vérifications gratuites utiles, qui valent la peine d'être faites avant de payer quoi que ce soit :",
    },
    {
      type: "list",
      items: [
        "La recherche du Registre des entreprises de l'Ontario, pour les sociétés et noms commerciaux inscrits en Ontario.",
        "La recherche des Registres d'entreprises canadiens, pour les sociétés fédérales et les provinces participantes.",
        "La Base de données sur les marques de commerce canadiennes de l'Office de la propriété intellectuelle du Canada, pour les marques enregistrées et en attente.",
        "Les « présélections » gratuites offertes par certains fournisseurs, qui donnent un aperçu rapide des conflits évidents.",
      ],
    },
    {
      type: "paragraph",
      text: "Aucune ne produit de numéro de référence NUANS, et aucune ne peut être inscrite dans des statuts ontariens. Elles servent à présélectionner des noms. Le document déposé est toujours un rapport NUANS payant à pondération ontarienne.",
    },
    { type: "heading", id: "cout", text: "Combien coûte un rapport NUANS en Ontario ?" },
    p(
      "Aucun droit gouvernemental ne s'applique au rapport lui-même, puisque l'Ontario ne le vend pas. Le prix est fixé par le fournisseur qui effectue la recherche. Korporex facture un tarif fixe de 39,99 $ plus TVH par nom proposé. Par ailleurs, l'Ontario perçoit 300 $ pour le dépôt des statuts constitutifs. Notre guide sur le ",
      { text: "coût pour constituer une société en Ontario", href: "/guides/cout-pour-constituer-une-societe-en-ontario" },
      " présente l'ensemble des frais, et une ",
      { text: "société à matricule", href: "/guides/societe-nominative-ou-a-matricule" },
      " évite complètement la recherche de nom.",
    ),
    { type: "heading", id: "ontario-ou-federal", text: "Ontario ou fédéral : quel rapport vous faut-il ?" },
    p(
      "Le rapport suit l'administration où vous vous constituez, et non l'endroit où vous vivez ou exercez vos activités. Une société ontarienne exige un rapport à pondération ontarienne. Une société fédérale n'a pas besoin d'un rapport commandé séparément pour se constituer, car Corporations Canada effectue la recherche dans son dépôt en ligne, même si un rapport fédéral demeure exigé pour certains dépôts comme une reconstitution ou une fusion. Si vous n'avez pas encore choisi, consultez notre guide sur ",
      { text: "la constitution au Canada", href: "/guides/comment-se-constituer-societe-canada" },
      ", et voyez ",
      { text: "quelles provinces exigent un rapport NUANS", href: "/guides/quelles-provinces-exigent-un-rapport-nuans" },
      " si vous déposez hors de l'Ontario.",
    ),
    { type: "heading", id: "cabinets", text: "Pour les cabinets d'avocats et les techniciens juridiques" },
    p(
      "Les cabinets de droit des sociétés de l'Ontario commandent plus de rapports à pondération ontarienne que quiconque, généralement par la même plateforme intégrée depuis des années. Un rapport NUANS est un PDF autonome muni d'un numéro de référence; il n'a pas à provenir du même fournisseur que vos livres des procès-verbaux ou vos recherches corporatives. Korporex accepte plusieurs noms proposés sur une seule commande à un tarif fixe par nom, saisit l'élément distinctif dans un champ distinct et transmet les rapports par courriel. Notre ",
      { text: "guide d'approvisionnement NUANS pour les cabinets", href: "/guides/rapport-nuans-pour-cabinets-davocats" },
      " présente les points à comparer.",
    ),
    { type: "heading", id: "commande", text: "Commandez votre rapport NUANS ontarien" },
    p(
      "Korporex commande des rapports NUANS à pondération ontarienne pour les constitutions, changements de nom, fusions et tout autre dépôt ontarien qui en exige un, à 39,99 $ plus TVH par nom, sans compte ni adhésion. ",
      { text: "Commandez un rapport NUANS", href: "/nuans" },
      " pour un ou plusieurs noms et, si le nom est libre, Korporex peut aussi ",
      { text: "déposer votre constitution en Ontario", href: "/incorporate" },
      ". Korporex n'est pas un cabinet d'avocats et ne se prononce pas sur la sûreté d'un nom; les questions de conflits, de consentements ou de noms identiques relèvent d'un avocat.",
    ),
    {
      type: "paragraph",
      text: "Les exigences décrites ici reflètent les avis de dépôt et règlements publiés par l'Ontario en date d'octobre 2026. Elles changent de temps à autre; confirmez les règles en vigueur auprès de ServiceOntario avant de déposer. Rien dans ce guide ne constitue un avis juridique.",
    },
  ],
  faq: [
    {
      q: "Faut-il un rapport NUANS pour se constituer en Ontario ?",
      a: "Oui, si la société aura un nom. L'Ontario exige un rapport NUANS à pondération ontarienne, daté d'au plus 90 jours avant le dépôt, pour les statuts constitutifs en vertu de la Loi sur les sociétés par actions. Une société à matricule n'en a pas besoin.",
    },
    {
      q: "Puis-je utiliser un rapport NUANS fédéral pour une constitution en Ontario ?",
      a: "Non. L'avis de dépôt ontarien précise qu'une recherche NUANS à pondération fédérale n'est pas acceptée. Le rapport doit être produit pour l'Ontario.",
    },
    {
      q: "Combien de temps un rapport NUANS ontarien est-il valide ?",
      a: "90 jours. Le rapport ne peut être daté de plus de 90 jours avant le dépôt des statuts, et il doit encore être valide lors de leur endossement. S'il expire avant, un nouveau rapport est nécessaire.",
    },
    {
      q: "Dois-je téléverser le rapport NUANS au Registre des entreprises de l'Ontario ?",
      a: "Non. Vous inscrivez le numéro de référence, le nom proposé recherché et la date du rapport, et le ministère récupère le rapport directement. Vous conservez le rapport au siège social, habituellement dans le livre des procès-verbaux.",
    },
    {
      q: "Le gouvernement de l'Ontario vérifie-t-il si mon nom est disponible ?",
      a: "Non. L'Ontario précise que le ministère n'examine pas les dénominations proposées pour déterminer leur similitude avec d'autres noms. Il incombe au demandeur de vérifier le rapport NUANS, et un nom conflictuel peut mener à une audience sur les dénominations ou à une poursuite.",
    },
    {
      q: "Existe-t-il une recherche NUANS gratuite en Ontario ?",
      a: "Il n'existe aucun rapport NUANS gratuit que l'on peut déposer. Le Registre des entreprises de l'Ontario, les Registres d'entreprises canadiens et la Base de données sur les marques de commerce canadiennes sont gratuits et utiles pour présélectionner des noms, mais seul un rapport NUANS payant à pondération ontarienne comporte le numéro de référence exigé.",
    },
    {
      q: "Faut-il un nouveau rapport NUANS pour changer le nom de ma société ontarienne ?",
      a: "Oui. Des statuts de modification qui changent le nom exigent un rapport NUANS à pondération ontarienne pour le nouveau nom, sauf si celui-ci est numérique.",
    },
    {
      q: "Combien coûte un rapport NUANS en Ontario ?",
      a: "L'Ontario ne perçoit aucun droit pour le rapport; le prix est fixé par le fournisseur. Korporex facture un tarif fixe de 39,99 $ plus TVH par nom proposé. Le droit ontarien pour déposer des statuts constitutifs est de 300 $.",
    },
  ],
};

const es: Article = {
  slug: "informe-nuans-ontario",
  locale: "es",
  group: "nuans-report-ontario",
  category: "Incorporation Guides",
  title: "Informe NUANS en Ontario: cómo pedirlo y presentarlo",
  excerpt:
    "Ontario solo acepta un informe NUANS con ponderación ontariana, con menos de 90 días, y el gobierno nunca revisa su nombre por usted. Estos son los trámites que lo exigen, cómo pedirlo y qué ingresar exactamente en el Ontario Business Registry.",
  metaTitle: "Informe NUANS en Ontario: cómo pedirlo | Korporex",
  metaDescription:
    "Ontario exige un informe NUANS ontariano para constituir una sociedad con nombre. Cómo pedirlo en línea, qué ingresar en el registro y la regla de 90 días.",
  readTime: "11 min de lectura",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Si va a constituir una sociedad con nombre en Ontario, necesita un informe NUANS, y no cualquiera. Ontario solo acepta un informe con ponderación ontariana, fechado como máximo 90 días antes de presentar los estatutos y obtenido de un proveedor privado de búsquedas. La provincia no hace la búsqueda por usted y no acepta en su lugar un informe con ponderación federal.",
    },
    {
      type: "paragraph",
      text: "Esta guía explica el proceso NUANS propio de Ontario, pensada tanto para fundadores que constituyen su propia empresa como para los asistentes jurídicos que piden estos informes cada semana. Cubre qué trámites en Ontario exigen un informe, cómo pedirlo, qué se ingresa realmente en el Ontario Business Registry y las reglas de plazo que causan la mayoría de los pedidos repetidos.",
    },
    { type: "heading", id: "que-es", text: "Qué es un informe NUANS de Ontario" },
    p(
      "NUANS (Newly Upgraded Automated Name Search) es una base de datos federal de denominaciones sociales, nombres comerciales y marcas registradas en Canadá, administrada por Innovación, Ciencia y Desarrollo Económico de Canadá. Una ",
      { text: "búsqueda de nombre NUANS", href: "/guides/busqueda-de-nombre-nuans" },
      " compara el nombre propuesto con esos registros y genera un informe con los nombres existentes más parecidos.",
    ),
    {
      type: "paragraph",
      text: "Todos los informes NUANS usan los mismos datos nacionales, pero cada uno se genera para una jurisdicción concreta. Un informe con ponderación ontariana da prioridad a los nombres que más importan para un trámite en Ontario. El aviso de constitución de Ontario es tajante: una búsqueda NUANS con ponderación federal (Canadá) no es aceptable. Si el encabezado del informe no dice Ontario, no sirve para un trámite ontariano.",
    },
    {
      type: "paragraph",
      text: "Ontario tampoco vende el informe. Su aviso indica que debe obtenerse de una empresa privada de búsqueda de nombres y que el Ministerio no ofrece esta búsqueda. En la práctica, se recurre a una casa de búsqueda registrada en NUANS o a un servicio como Korporex que pide el informe por usted.",
    },
    { type: "heading", id: "sin-revision", text: "Ontario no revisa su nombre" },
    {
      type: "paragraph",
      text: "Esta es la diferencia más importante entre constituirse en Ontario y a nivel federal, y es la razón por la que el informe importa más en Ontario que en cualquier otro lugar. A nivel federal, un examinador de Corporations Canada revisa el nombre propuesto antes de concederlo. Ontario no: según la propia provincia, el Ministerio no revisa los nombres propuestos para determinar su similitud con otros nombres.",
    },
    {
      type: "paragraph",
      text: "La responsabilidad recae en los fundadores. El aviso de Ontario señala que corresponde al solicitante revisar el informe en busca de nombres similares o idénticos y obtener cualquier consentimiento necesario, y que una sociedad que adopte un nombre similar al de otra puede ser objeto de una audiencia sobre nombres conforme al artículo 12 de la Business Corporations Act, o de una demanda.",
    },
    {
      type: "callout",
      title: "Qué significa en la práctica",
      text: "En Ontario, un trámite puede aceptarse con un nombre que choca con una empresa existente. Nadie en el registro lo detendrá. El informe NUANS es su única revisión sistemática de conflictos antes de presentar, así que leerlo bien no es opcional. Un trámite aceptado no equivale a un nombre seguro.",
    },
    p(
      "Si nunca ha analizado uno, nuestra guía sobre ",
      { text: "cómo leer un informe NUANS", href: "/guides/como-leer-un-informe-nuans" },
      " explica la lista ordenada, los códigos de origen y cómo distinguir un conflicto serio del simple ruido de fondo.",
    ),
    { type: "heading", id: "tramites", text: "Qué trámites en Ontario exigen un informe NUANS" },
    {
      type: "paragraph",
      text: "La constitución es el motivo más común para pedir un informe ontariano, pero no el único. Los avisos de Ontario establecen lo siguiente:",
    },
    {
      type: "table",
      head: ["Trámite en Ontario", "¿Exige informe NUANS?", "Notas"],
      rows: [
        ["Estatutos de constitución (OBCA)", "Sí, para una sociedad con nombre", "No se exige para un nombre numérico"],
        ["Estatutos de modificación que cambian el nombre", "Sí", "No se exige si el nuevo nombre es numérico"],
        ["Estatutos de fusión", "Sí, para un nombre nuevo", "No se exige para un nombre numérico o el nombre de una de las sociedades que se fusionan"],
        ["Estatutos de reorganización que cambian el nombre", "Sí", "No se exige si el nuevo nombre es numérico"],
        ["Estatutos de reactivación", "Solo si lleva disuelta 10 años o más", "Cambiar el nombre al reactivar exige después estatutos de modificación, con informe"],
        ["Constitución sin fines de lucro (ONCA)", "Sí, para una entidad con nombre", "Mismas reglas: ponderación ontariana y 90 días"],
        ["Licencia extraprovincial (clase 3)", "Sí", "Para sociedades constituidas fuera de Canadá, según O. Reg. 401/21"],
        ["Registro de nombre comercial (Business Names Act)", "No", "Se registra en el Ontario Business Registry sin informe NUANS"],
      ],
    },
    p(
      "Dos de estos casos merecen atención. Cambiar el nombre de una sociedad existente es un ",
      { text: "cambio de nombre mediante estatutos de modificación", href: "/services/change-name" },
      ", y exige un informe nuevo para el nuevo nombre. Una ",
      { text: "reactivación", href: "/services/revive-business" },
      " solo exige informe si la sociedad lleva disuelta 10 años o más, algo que sorprende a quienes suponen que toda reactivación lo necesita.",
    ),
    { type: "heading", id: "como-pedir", text: "Cómo pedir un informe NUANS en Ontario, paso a paso" },
    {
      type: "list",
      items: [
        "Haga primero un filtro gratuito. Busque en el Ontario Business Registry (Ontario.ca/BusinessRegistry), como sugiere la propia provincia antes de pedir un informe, y en la Base de Datos de Marcas Canadienses. Si aparece un nombre idéntico en su sector, se ahorra el costo de un informe.",
        "Defina el nombre exacto, con elemento legal incluido. Ontario exige que el nombre de los estatutos sea idéntico al nombre buscado en NUANS y que contenga un elemento legal: Limited, Limitée, Incorporated, Incorporée, Corporation, o las abreviaturas Ltd., Ltée, Inc. o Corp.",
        "Identifique el elemento distintivo. NUANS pondera la parte distintiva del nombre, no las palabras descriptivas. En \"Maple Ridge Logistics Inc.\" la búsqueda es, en la práctica, sobre \"Maple Ridge\".",
        "Decida entre inglés, francés o ambos. Cada forma del nombre requiere su propia búsqueda, salvo que las formas inglesa y francesa sean idénticas y solo se traduzca el elemento legal.",
        "Pida un informe con ponderación ontariana. Indique Ontario como jurisdicción. Incluir dos o tres nombres candidatos en el mismo pedido ahorra mucho más tiempo que descubrir los conflictos uno por uno.",
        "Revise el encabezado del informe. Confirme que la jurisdicción dice Ontario, que el nombre está escrito exactamente como lo presentará, y anote la fecha y el número de referencia.",
        "Presente dentro de los 90 días. Ingrese el número de referencia, el nombre buscado y la fecha del informe en los estatutos, y conserve el informe con los registros de la sociedad.",
      ],
    },
    { type: "heading", id: "registro", text: "Qué se ingresa en el Ontario Business Registry" },
    {
      type: "paragraph",
      text: "No se sube el informe. Al constituirse por el Ontario Business Registry se le piden tres datos: el número de referencia del informe NUANS, el nombre propuesto que se buscó y la fecha del informe. El aviso de Ontario indica que el Ministerio obtiene el informe directamente con esos datos.",
    },
    {
      type: "paragraph",
      text: "El informe se queda con usted. Ontario exige conservarlo en el domicilio social de la sociedad, y las instrucciones de los estatutos en papel piden expresamente no enviarlo con el formulario. La mayoría de los despachos lo archivan en el libro de actas junto al certificado y los estatutos, que es donde cualquiera que revise después los registros de la sociedad lo buscará.",
    },
    {
      type: "callout",
      title: "El error de captura más común",
      text: "El nombre buscado debe coincidir exactamente con el de los estatutos, incluido el elemento legal. Si el informe se hizo para \"Maple Ridge Logistics Inc.\" y los estatutos dicen \"Maple Ridge Logistics Ltd.\", corrija uno u otro antes de presentar. No suponga que el registro los tratará como el mismo nombre.",
    },
    { type: "heading", id: "noventa-dias", text: "La regla de los 90 días y sus trampas" },
    {
      type: "paragraph",
      text: "Un informe NUANS ontariano no puede tener fecha de más de 90 días antes de la presentación de los estatutos. El ejemplo de Ontario: unos estatutos recibidos el 28 de noviembre podrían apoyarse en un informe fechado como muy pronto el 30 de agosto, pero no antes. El plazo corre desde la fecha impresa en el informe, no desde el día en que lo pagó o lo descargó.",
    },
    {
      type: "paragraph",
      text: "Tres detalles convierten esta regla sencilla en la causa más común de un segundo informe:",
    },
    {
      type: "list",
      items: [
        "El informe debe seguir vigente cuando se endosan los estatutos. Ontario advierte que si vence antes, hay que obtener un informe válido para completar el trámite.",
        "Una fecha de efecto futura no le da más tiempo. Puede pedir una fecha de efecto hasta 30 días naturales después, pero solo mientras la fecha del informe NUANS siga siendo válida.",
        "Guardar un borrador no detiene el reloj. El registro permite guardar borradores, pero Ontario aclara que es responsabilidad suya presentar los documentos con plazo, como los informes NUANS, antes de que venzan.",
      ],
    },
    {
      type: "paragraph",
      text: "El hábito práctico es sencillo: pida el informe cuando la estructura de acciones, los administradores y el domicilio social estén definidos, no cuando el cliente menciona un nombre por primera vez, y anote el vencimiento el mismo día en que llega el informe.",
    },
    { type: "heading", id: "ingles-frances", text: "Nombres en inglés y en francés" },
    {
      type: "paragraph",
      text: "En Ontario, una sociedad puede tener un nombre en inglés, en francés, uno que combine inglés y francés, o nombres equivalentes en inglés y francés usados por separado. Se exige una búsqueda NUANS para cada forma del nombre. La excepción: si las formas inglesa y francesa son idénticas y la única diferencia es la versión francesa del elemento legal (Inc. e Incorporée, por ejemplo), una sola búsqueda cubre ambas.",
    },
    { type: "heading", id: "nombres-identicos", text: "Nombres idénticos y la opinión legal" },
    {
      type: "paragraph",
      text: "Un nombre idéntico no queda descartado automáticamente en Ontario. El reglamento de nombres y presentaciones permite, en circunstancias concretas, adoptar un nombre idéntico, pero la sociedad debe apoyarse entonces en una opinión legal que cumpla el reglamento, conservarla en el domicilio social y dar los datos del abogado al presentar. Es una decisión para un abogado, no para un proveedor de búsquedas. Tenga en cuenta también que añadir o quitar signos de puntuación o símbolos no hace que un nombre sea distinto a estos efectos.",
    },
    { type: "heading", id: "busqueda-gratuita", text: "¿Existe una búsqueda NUANS gratuita en Ontario?" },
    {
      type: "paragraph",
      text: "No una que se pueda presentar. Hay comprobaciones gratuitas útiles, que vale la pena hacer antes de pagar nada:",
    },
    {
      type: "list",
      items: [
        "La búsqueda del Ontario Business Registry, para sociedades y nombres comerciales inscritos en Ontario.",
        "La búsqueda de Canada's Business Registries, para sociedades federales y provincias participantes.",
        "La Base de Datos de Marcas Canadienses de la Oficina de Propiedad Intelectual de Canadá, para marcas registradas y en trámite.",
        "Las \"prebúsquedas\" gratuitas de algunos proveedores, que dan un vistazo rápido a los conflictos evidentes.",
      ],
    },
    {
      type: "paragraph",
      text: "Ninguna genera un número de referencia NUANS, y ninguna puede ingresarse en estatutos ontarianos. Sirven para preseleccionar nombres. El documento que se presenta es siempre un informe NUANS de pago con ponderación ontariana.",
    },
    { type: "heading", id: "costo", text: "Cuánto cuesta un informe NUANS en Ontario" },
    p(
      "No hay tasa gubernamental por el informe en sí, porque Ontario no lo vende. El precio lo fija el proveedor que hace la búsqueda. Korporex cobra una tarifa fija de 39,99 $ más HST por nombre propuesto. Aparte, Ontario cobra 300 $ por presentar los estatutos de constitución. Nuestra guía sobre el ",
      { text: "costo para constituirse en sociedad en Ontario", href: "/guides/costo-para-constituirse-en-sociedad-en-ontario" },
      " muestra el panorama completo, y una ",
      { text: "sociedad numerada", href: "/guides/sociedad-con-nombre-o-numerada" },
      " evita por completo la búsqueda de nombre.",
    ),
    { type: "heading", id: "ontario-o-federal", text: "Ontario o federal: qué informe necesita" },
    p(
      "El informe sigue a la jurisdicción donde se constituye, no a donde vive u opera. Una sociedad de Ontario necesita un informe con ponderación ontariana. Una sociedad federal no necesita un informe pedido por separado para constituirse, porque Corporations Canada hace la búsqueda dentro de su trámite en línea, aunque sigue exigiéndose un informe federal para algunos trámites como una reactivación o una fusión. Si aún no ha elegido, consulte nuestra guía sobre ",
      { text: "cómo constituirse en Canadá", href: "/guides/como-constituirse-sociedad-canada" },
      ", y vea ",
      { text: "qué provincias exigen un informe NUANS", href: "/guides/que-provincias-exigen-un-informe-nuans" },
      " si presenta fuera de Ontario.",
    ),
    { type: "heading", id: "despachos", text: "Para despachos de abogados y asistentes jurídicos" },
    p(
      "Los despachos corporativos de Ontario piden más informes con ponderación ontariana que nadie, normalmente por la misma plataforma integrada que usan desde hace años. Un informe NUANS es un PDF autónomo con número de referencia, así que no tiene por qué venir del mismo proveedor que sus libros de actas o búsquedas corporativas. Korporex acepta varios nombres propuestos en un solo pedido con tarifa fija por nombre, recoge el elemento distintivo en un campo propio y entrega los informes por correo electrónico. Nuestra ",
      { text: "guía de compras NUANS para despachos", href: "/guides/informe-nuans-para-despachos-de-abogados" },
      " explica qué comparar.",
    ),
    { type: "heading", id: "pedido", text: "Pida su informe NUANS de Ontario" },
    p(
      "Korporex pide informes NUANS con ponderación ontariana para constituciones, cambios de nombre, fusiones y cualquier otro trámite ontariano que lo exija, por 39,99 $ más HST por nombre, sin cuenta ni membresía. ",
      { text: "Pida un informe NUANS", href: "/nuans" },
      " para uno o varios nombres y, si el nombre está libre, Korporex también puede ",
      { text: "presentar su constitución en Ontario", href: "/incorporate" },
      ". Korporex no es un despacho de abogados y no opina sobre si un nombre es seguro; las dudas sobre conflictos, consentimientos o nombres idénticos corresponden a un abogado.",
    ),
    {
      type: "paragraph",
      text: "Los requisitos descritos reflejan los avisos y reglamentos publicados por Ontario a octubre de 2026. Cambian de vez en cuando; confirme las reglas vigentes con ServiceOntario antes de presentar. Nada en esta guía constituye asesoramiento legal.",
    },
  ],
  faq: [
    {
      q: "¿Necesito un informe NUANS para constituirme en Ontario?",
      a: "Sí, si la sociedad tendrá un nombre. Ontario exige un informe NUANS con ponderación ontariana, fechado como máximo 90 días antes de la presentación, para los estatutos de constitución según la Business Corporations Act. Una sociedad numerada no lo necesita.",
    },
    {
      q: "¿Puedo usar un informe NUANS federal para constituirme en Ontario?",
      a: "No. El aviso de Ontario indica que una búsqueda NUANS con ponderación federal no es aceptable. El informe debe generarse para Ontario.",
    },
    {
      q: "¿Cuánto tiempo es válido un informe NUANS de Ontario?",
      a: "90 días. El informe no puede tener fecha de más de 90 días antes de presentar los estatutos y debe seguir vigente cuando se endosan. Si vence antes, necesita un informe nuevo.",
    },
    {
      q: "¿Tengo que subir el informe NUANS al Ontario Business Registry?",
      a: "No. Ingresa el número de referencia, el nombre propuesto buscado y la fecha del informe, y el Ministerio obtiene el informe directamente. Usted lo conserva en el domicilio social, normalmente en el libro de actas.",
    },
    {
      q: "¿El gobierno de Ontario comprueba si mi nombre está disponible?",
      a: "No. Ontario indica que el Ministerio no revisa los nombres propuestos para determinar su similitud con otros. Revisar el informe NUANS es responsabilidad del solicitante, y un nombre en conflicto puede llevar a una audiencia sobre nombres o a una demanda.",
    },
    {
      q: "¿Existe una búsqueda NUANS gratuita en Ontario?",
      a: "No existe un informe NUANS gratuito que se pueda presentar. El Ontario Business Registry, Canada's Business Registries y la Base de Datos de Marcas Canadienses son gratuitos y útiles para preseleccionar nombres, pero solo un informe NUANS de pago con ponderación ontariana tiene el número de referencia que pide Ontario.",
    },
    {
      q: "¿Necesito un informe NUANS nuevo para cambiar el nombre de mi sociedad en Ontario?",
      a: "Sí. Los estatutos de modificación que cambian el nombre exigen un informe NUANS con ponderación ontariana para el nuevo nombre, salvo que este sea numérico.",
    },
    {
      q: "¿Cuánto cuesta un informe NUANS en Ontario?",
      a: "Ontario no cobra tasa por el informe; el precio lo fija el proveedor. Korporex cobra una tarifa fija de 39,99 $ más HST por nombre propuesto. La tasa de Ontario por presentar los estatutos de constitución es de 300 $.",
    },
  ],
};

export const nuansReportOntario: Article[] = [en, fr, es];
