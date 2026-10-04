import type { Article, ArticleInline, ArticleSection } from "../articles";

// Alberta NUANS report guide (en/fr/es). Targets the Alberta NUANS cluster
// ("nuans search alberta", "nuans report alberta", "alberta nuans report",
// "nuans name search alberta") and feeds relevance to /nuans. Facts are taken
// from alberta.ca: "Incorporate an Alberta corporation", "Register an
// out-of-province corporation", "Amend notices for a corporation, cooperative
// or non-profit" and "Incorporate a society". Verified 2026-10-04. Alberta's
// pages do not publish the government fee (they point to the registry agent
// product catalogue), so no fee figure is stated here on purpose.

// Paragraph with inline links; the plain `text` is derived from the parts.
function p(...parts: ArticleInline[]): ArticleSection {
  return {
    type: "paragraph",
    text: parts.map((x) => (typeof x === "string" ? x : x.text)).join(""),
    parts,
  };
}

const PUBLISHED_AT = "2026-10-06T10:00:00-04:00";
const UPDATED = "2026-10-04";

const en: Article = {
  slug: "nuans-report-alberta",
  locale: "en",
  group: "nuans-report-alberta",
  category: "Incorporation Guides",
  title: "NUANS Report Alberta: When You Need One and How to Get It",
  excerpt:
    "Alberta requires an Alberta NUANS report for a named corporation, and unlike Ontario it wants the full report handed in, less than 91 days old, through a registry agent. Here is which filings need one and how to order it.",
  metaTitle: "NUANS Report Alberta: When You Need One | Korporex",
  metaDescription:
    "Alberta requires an Alberta NUANS report to incorporate a named corporation or register one from another province. The 91-day rule and how to order.",
  readTime: "8 min read",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "If you are incorporating a named corporation in Alberta, you need an Alberta NUANS report. Alberta is one of the few provinces that makes you obtain the report yourself and hand it in, and it is specific about what it wants: a report run for Alberta, submitted in full with the filing, and less than 91 days old.",
    },
    {
      type: "paragraph",
      text: "This guide covers the Alberta version of the NUANS process: which Alberta filings need a report, how Alberta's rules differ from Ontario's and the federal process, how to order a report, and what happens if someone objects to your name later.",
    },
    { type: "heading", id: "what-it-is", text: "What an Alberta NUANS report is" },
    p(
      "NUANS (Newly Upgraded Automated Name Search) is a federal database of Canadian corporate names, business names and trademarks, administered by Innovation, Science and Economic Development Canada. A ",
      { text: "NUANS name search", href: "/guides/what-is-nuans-name-search" },
      " compares a proposed name against those records and returns a report listing the closest existing names.",
    ),
    {
      type: "paragraph",
      text: "Each report is run for a particular jurisdiction. For an Alberta filing, the report has to be an Alberta report. Alberta's guidance is that you \"need to get an Alberta NUANS report and review it to make sure there is no other corporation with an identical name or a name that is too similar to your proposed corporation name.\" Alberta's registry does not produce the report for you; it comes from a private search provider.",
    },
    { type: "heading", id: "which-filings", text: "Which Alberta filings need a NUANS report" },
    {
      type: "table",
      head: ["Alberta filing", "Alberta NUANS report required?", "Notes"],
      rows: [
        ["Incorporating an Alberta corporation", "Yes, for a named corporation", "Not needed for a number name assigned by Corporate Registry"],
        ["Changing a corporation's name", "Yes, for most name changes", "Not needed when changing to a number name, such as 9999999 Alberta Ltd."],
        ["Registering an out-of-province corporation", "Yes", "Not needed if it has a number name from its home jurisdiction, or was formed under the Canada Business Corporations Act"],
        ["Using an assumed name in Alberta", "Yes, a separate report", "For an out-of-province corporation whose name is too similar to an existing Alberta name"],
        ["Incorporating a society", "Yes, for a named society", "Societies use their own legal elements, such as Society, Association or Foundation"],
        ["Registering a trade name or partnership", "No", "Duplicate business names are allowed for these, though a quick search is still sensible"],
      ],
    },
    p(
      "The out-of-province row matters more than people expect. A corporation incorporated in another province that wants to ",
      { text: "carry on business in Alberta", href: "/services/extra-provincial" },
      " needs an Alberta NUANS report for its existing name, unless it is a federal (CBCA) corporation or has a number name. If the name is too close to one already in use in Alberta, it can register under an assumed name instead, which needs its own report.",
    ),
    { type: "heading", id: "how-alberta-differs", text: "How Alberta differs from Ontario and the federal process" },
    {
      type: "table",
      head: ["", "Alberta", "Ontario", "Federal (CBCA)"],
      rows: [
        ["Do you supply a NUANS report to incorporate?", "Yes, an Alberta report", "Yes, an Ontario-biased report", "No; the name search runs inside the online filing"],
        ["What you hand in", "The complete report", "Only the reference number, name searched and date", "Nothing separate"],
        ["Time limit", "Less than 91 days old", "Not dated more than 90 days before filing", "Built into the filing"],
        ["Who files", "A registry agent or authorized Alberta service provider", "Online through the Ontario Business Registry", "Online through Corporations Canada"],
      ],
    },
    p(
      "The practical difference is the paperwork. In ",
      { text: "Ontario", href: "/guides/nuans-report-ontario" },
      " you type three details from the report into the registry and keep the report yourself. In Alberta, the complete report goes in with the filing. If you are ordering for both provinces, order one report per province: a report run for one province is not a substitute for the other.",
    ),
    { type: "heading", id: "how-to-order", text: "How to get an Alberta NUANS report, step by step" },
    {
      type: "list",
      items: [
        "Settle the full name. Alberta corporate names have a distinctive element, a descriptive element and a legal element. Alberta's accepted legal elements include Limited, Ltd., Incorporated, Inc., Corporation, Corp., their French forms, and ULC or Unlimited Liability Corporation for an unlimited liability corporation.",
        "Identify the distinctive element. NUANS weights the distinctive part of the name, so in \"Bow Valley Logistics Ltd.\" the search is effectively a search on \"Bow Valley.\"",
        "Screen it for free. Check the Canadian Trademarks Database and run a quick pre-search to drop names with an obvious conflict before you pay for a report.",
        "Order an Alberta NUANS report. Ask for Alberta as the jurisdiction. Put two or three candidate names on one order so a conflict on the first choice does not cost you a second round.",
        "Review the report. Alberta expects you to read it, not just attach it. Look for identical names, which are not allowed for corporations, and for names close enough to invite an objection.",
        "File through a registry agent within the window. Take the complete report, the incorporation documents and valid ID to a registry agent or authorized Alberta service provider before the report is 91 days old.",
      ],
    },
    {
      type: "callout",
      title: "Documents that go in with an Alberta incorporation",
      text: "Alberta lists four documents for incorporating a corporation: Articles of Incorporation, Notice of Address, Notice of Directors and Notice of Agent for Service. A named corporation adds the Alberta NUANS report. The registry agent charges a government fee and a service fee, both listed in Alberta's registry agent product catalogue.",
    },
    { type: "heading", id: "ninety-one-days", text: "The 91-day rule" },
    {
      type: "paragraph",
      text: "Alberta's wording is that the report \"reserves the proposed name for 90 days\" and \"must be less than 91 days old\" when it is submitted. The clock starts on the date the report was generated, not the date you paid for it or opened the PDF. If the filing slips past that point, you need a new report.",
    },
    {
      type: "paragraph",
      text: "The usual cause of a missed window is ordering too early: the name gets searched the day the client mentions it, and the share structure, directors or financing take two months to settle. Order the report once the rest of the filing is ready, and diarise the expiry the day the report arrives.",
    },
    { type: "heading", id: "objections", text: "What happens if someone objects to your name" },
    {
      type: "paragraph",
      text: "Getting a name through the registry is not the end of the question. Alberta's guidance says that \"if another corporation feels your corporation's name is too similar to theirs, they can file an objection with the Registrar of Corporations.\" Alberta also states that, unlike business names, identically named corporations are not allowed.",
    },
    p(
      "This is why reviewing the report matters. A conflict that is visible in the report today becomes a name-change filing, a new report and rebranding costs later. Our guide on ",
      { text: "how to read a NUANS report", href: "/guides/how-to-read-a-nuans-report" },
      " explains how to separate a serious conflict from background noise, and our guide to a ",
      { text: "refused corporate name", href: "/guides/corporate-name-rejected-canada" },
      " covers the routes forward when a name runs into trouble.",
    ),
    { type: "heading", id: "numbered", text: "Number names skip the search" },
    p(
      "Alberta does not require a NUANS report for a number name assigned by Corporate Registry, such as 785843 Alberta Inc. The word \"Alberta\" always forms the second part of the name. If speed matters more than branding, incorporating with a ",
      { text: "numbered name", href: "/guides/named-vs-numbered-corporation" },
      " and registering a trade name to operate under is a common route, and trade names do not need a NUANS report.",
    ),
    { type: "heading", id: "free-search", text: "Is there a free NUANS search in Alberta?" },
    {
      type: "paragraph",
      text: "Not one you can file. The Canadian Trademarks Database is free and worth checking, and some providers offer a free pre-search for a quick look at obvious conflicts. Neither produces an Alberta NUANS report, and only the report itself can go in with an Alberta filing.",
    },
    { type: "heading", id: "other-provinces", text: "Filing somewhere other than Alberta?" },
    p(
      "Only a few jurisdictions make you supply a NUANS report. Ontario does, with its own rules covered in our ",
      { text: "Ontario NUANS report guide", href: "/guides/nuans-report-ontario" },
      ". Federally, the search is built into the online filing. Several provinces, including Saskatchewan and Manitoba, run their own name reservation and will not accept a NUANS report. Our breakdown of ",
      { text: "which provinces require NUANS", href: "/guides/which-provinces-require-nuans" },
      " covers every jurisdiction.",
    ),
    { type: "heading", id: "order", text: "Order your Alberta NUANS report" },
    p(
      "Korporex orders Alberta NUANS reports at a flat $39.99 plus HST per proposed name, with no account or membership, and several names can go on one order. ",
      { text: "Order a NUANS report", href: "/nuans" },
      ", choose Alberta as the jurisdiction, and the report comes back by email ready to take to your registry agent. Korporex does not file Alberta incorporations and is not a law firm; it does not advise on whether a name is safe to use, and questions about objections or conflicts should go to a lawyer.",
    ),
    {
      type: "paragraph",
      text: "Requirements described here reflect Alberta's published guidance as of October 2026. They change from time to time, so confirm current rules with a registry agent or Alberta Corporate Registry before you file. Nothing in this guide is legal advice.",
    },
  ],
  faq: [
    {
      q: "Do I need a NUANS report to incorporate in Alberta?",
      a: "Yes, if the corporation will have a word name. Alberta requires an Alberta NUANS report, submitted in full with the incorporation and less than 91 days old. A number name assigned by Corporate Registry does not need one.",
    },
    {
      q: "Can I use an Ontario or federal NUANS report in Alberta?",
      a: "No. Alberta asks for an Alberta NUANS report. Order a separate report for each province you file in.",
    },
    {
      q: "How long is an Alberta NUANS report valid?",
      a: "Alberta says the report reserves the proposed name for 90 days and must be less than 91 days old when it is submitted. After that, you need a new report.",
    },
    {
      q: "Where do I file an Alberta incorporation?",
      a: "Through a registry agent or an authorized Alberta service provider. You bring the incorporation documents, the Alberta NUANS report and valid ID, and the agent charges a government fee plus a service fee.",
    },
    {
      q: "Does an out-of-province corporation need an Alberta NUANS report?",
      a: "Usually, yes. A corporation from another province registering in Alberta needs an Alberta NUANS report unless it has a number name from its home jurisdiction or was formed under the Canada Business Corporations Act.",
    },
    {
      q: "Do I need a NUANS report for an Alberta trade name?",
      a: "No. Trade names and partnerships do not need a NUANS report in Alberta, because duplicate business names are allowed for them. A quick search is still worthwhile before you register.",
    },
    {
      q: "How much does an Alberta NUANS report cost?",
      a: "The price is set by the provider that runs the search. Korporex charges a flat $39.99 plus HST per proposed name. The registry agent's government and service fees for the filing itself are separate.",
    },
  ],
};

const fr: Article = {
  slug: "rapport-nuans-alberta",
  locale: "fr",
  group: "nuans-report-alberta",
  category: "Incorporation Guides",
  title: "Rapport NUANS en Alberta : quand il est exigé et comment l'obtenir",
  excerpt:
    "L'Alberta exige un rapport NUANS albertain pour une société nominative et, contrairement à l'Ontario, veut le rapport complet, de moins de 91 jours, remis par un agent d'enregistrement. Voici les dépôts qui l'exigent et comment le commander.",
  metaTitle: "Rapport NUANS Alberta : quand il est exigé | Korporex",
  metaDescription:
    "L'Alberta exige un rapport NUANS albertain pour constituer une société nominative ou inscrire une société d'ailleurs. La règle des 91 jours et la commande.",
  readTime: "8 min de lecture",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Si vous constituez une société nominative en Alberta, il vous faut un rapport NUANS albertain. L'Alberta fait partie des rares provinces qui vous obligent à obtenir le rapport vous-même et à le remettre, et elle précise ce qu'elle attend : un rapport produit pour l'Alberta, remis au complet avec le dépôt et datant de moins de 91 jours.",
    },
    {
      type: "paragraph",
      text: "Ce guide présente la démarche NUANS propre à l'Alberta : les dépôts albertains qui exigent un rapport, les différences avec l'Ontario et le fédéral, la façon de commander un rapport et ce qui se passe si quelqu'un s'oppose plus tard à votre nom.",
    },
    { type: "heading", id: "definition", text: "Qu'est-ce qu'un rapport NUANS albertain ?" },
    p(
      "NUANS (Nouveau système automatisé de recherche de noms) est une base de données fédérale des dénominations sociales, noms commerciaux et marques de commerce au Canada, administrée par Innovation, Sciences et Développement économique Canada. Une ",
      { text: "recherche de nom NUANS", href: "/guides/recherche-de-nom-nuans" },
      " compare le nom proposé à ces données et produit un rapport des noms existants les plus proches.",
    ),
    {
      type: "paragraph",
      text: "Chaque rapport est produit pour une administration précise. Pour un dépôt en Alberta, il doit s'agir d'un rapport albertain. Selon l'Alberta, vous devez obtenir un rapport NUANS albertain et l'examiner pour vous assurer qu'aucune autre société ne porte un nom identique ou trop semblable au nom proposé. Le registre albertain ne produit pas le rapport; il provient d'un fournisseur privé de recherche.",
    },
    { type: "heading", id: "depots", text: "Les dépôts albertains qui exigent un rapport NUANS" },
    {
      type: "table",
      head: ["Dépôt en Alberta", "Rapport NUANS albertain exigé ?", "Remarques"],
      rows: [
        ["Constitution d'une société albertaine", "Oui, pour une société nominative", "Non exigé pour une dénomination numérique attribuée par le Corporate Registry"],
        ["Changement de nom d'une société", "Oui, pour la plupart des changements", "Non exigé pour passer à une dénomination numérique, comme 9999999 Alberta Ltd."],
        ["Enregistrement d'une société d'une autre province", "Oui", "Non exigé si elle porte une dénomination numérique de son administration d'origine ou a été constituée sous la Loi canadienne sur les sociétés par actions"],
        ["Utilisation d'un nom d'emprunt en Alberta", "Oui, un rapport distinct", "Pour une société extraprovinciale dont le nom est trop semblable à un nom albertain existant"],
        ["Constitution d'une société sans but lucratif (society)", "Oui, pour une society nominative", "Les societies ont leurs propres éléments juridiques, comme Society, Association ou Foundation"],
        ["Enregistrement d'un nom commercial ou d'une société de personnes", "Non", "Les noms en double sont permis dans ces cas, mais une recherche rapide reste prudente"],
      ],
    },
    p(
      "La ligne extraprovinciale compte plus qu'on ne le pense. Une société constituée dans une autre province qui veut ",
      { text: "exercer ses activités en Alberta", href: "/services/extra-provincial" },
      " doit obtenir un rapport NUANS albertain pour son nom actuel, sauf s'il s'agit d'une société fédérale (LCSA) ou d'une dénomination numérique. Si son nom est trop proche d'un nom déjà utilisé en Alberta, elle peut s'enregistrer sous un nom d'emprunt, qui exige son propre rapport.",
    ),
    { type: "heading", id: "differences", text: "Les différences avec l'Ontario et le fédéral" },
    {
      type: "table",
      head: ["", "Alberta", "Ontario", "Fédéral (LCSA)"],
      rows: [
        ["Fournissez-vous un rapport NUANS pour vous constituer ?", "Oui, un rapport albertain", "Oui, un rapport à pondération ontarienne", "Non; la recherche est intégrée au dépôt en ligne"],
        ["Ce que vous remettez", "Le rapport complet", "Seulement le numéro de référence, le nom recherché et la date", "Rien de distinct"],
        ["Délai", "Moins de 91 jours", "Daté d'au plus 90 jours avant le dépôt", "Intégré au dépôt"],
        ["Qui dépose", "Un agent d'enregistrement ou un fournisseur de services autorisé de l'Alberta", "En ligne au Registre des entreprises de l'Ontario", "En ligne auprès de Corporations Canada"],
      ],
    },
    p(
      "La différence pratique tient à la paperasse. En ",
      { text: "Ontario", href: "/guides/rapport-nuans-ontario" },
      ", vous inscrivez trois renseignements du rapport au registre et conservez le rapport vous-même. En Alberta, le rapport complet accompagne le dépôt. Si vous déposez dans les deux provinces, commandez un rapport par province : un rapport produit pour l'une ne remplace pas l'autre.",
    ),
    { type: "heading", id: "commander", text: "Obtenir un rapport NUANS albertain, étape par étape" },
    {
      type: "list",
      items: [
        "Arrêtez le nom complet. Un nom de société albertaine comporte un élément distinctif, un élément descriptif et un élément juridique. Les éléments juridiques acceptés en Alberta comprennent Limited, Ltd., Incorporated, Inc., Corporation, Corp., leurs formes françaises, et ULC ou Unlimited Liability Corporation pour une société à responsabilité illimitée.",
        "Repérez l'élément distinctif. NUANS pondère la partie distinctive du nom; pour « Bow Valley Logistics Ltd. », la recherche porte en fait sur « Bow Valley ».",
        "Faites un tri gratuit. Consultez la Base de données sur les marques de commerce canadiennes et faites une présélection rapide pour écarter les noms en conflit évident avant de payer un rapport.",
        "Commandez un rapport NUANS albertain. Précisez l'Alberta comme administration. Inscrivez deux ou trois noms candidats sur une même commande pour qu'un conflit sur le premier choix ne vous coûte pas un second tour.",
        "Examinez le rapport. L'Alberta s'attend à ce que vous le lisiez, pas seulement à ce que vous le joigniez. Cherchez les noms identiques, interdits pour les sociétés, et les noms assez proches pour susciter une opposition.",
        "Déposez par un agent d'enregistrement dans le délai. Apportez le rapport complet, les documents de constitution et une pièce d'identité valide à un agent d'enregistrement ou à un fournisseur de services autorisé de l'Alberta avant que le rapport ait 91 jours.",
      ],
    },
    {
      type: "callout",
      title: "Les documents d'une constitution en Alberta",
      text: "L'Alberta énumère quatre documents pour constituer une société : les statuts constitutifs (Articles of Incorporation), l'avis d'adresse, l'avis des administrateurs et l'avis de mandataire aux fins de signification. Une société nominative y ajoute le rapport NUANS albertain. L'agent d'enregistrement perçoit un droit gouvernemental et des frais de service, indiqués dans le catalogue des produits des agents d'enregistrement de l'Alberta.",
    },
    { type: "heading", id: "quatre-vingt-onze-jours", text: "La règle des 91 jours" },
    {
      type: "paragraph",
      text: "Selon l'Alberta, le rapport réserve le nom proposé pendant 90 jours et doit dater de moins de 91 jours au moment du dépôt. Le délai court à partir de la date de production du rapport, et non du jour où vous l'avez payé ou ouvert. Si le dépôt dépasse ce délai, un nouveau rapport est nécessaire.",
    },
    {
      type: "paragraph",
      text: "Le délai manqué vient d'ordinaire d'une commande trop hâtive : le nom est recherché dès que le client l'évoque, puis la structure du capital, les administrateurs ou le financement prennent deux mois à se régler. Commandez le rapport une fois le reste du dépôt prêt, et inscrivez l'échéance au dossier le jour même.",
    },
    { type: "heading", id: "oppositions", text: "Si quelqu'un s'oppose à votre nom" },
    {
      type: "paragraph",
      text: "Faire accepter un nom par le registre ne règle pas tout. Selon l'Alberta, une société qui estime que votre nom est trop semblable au sien peut déposer une opposition auprès du registraire des sociétés (Registrar of Corporations). L'Alberta précise aussi que, contrairement aux noms commerciaux, les sociétés portant des noms identiques ne sont pas permises.",
    },
    p(
      "C'est pourquoi l'examen du rapport compte. Un conflit visible dans le rapport aujourd'hui devient demain un changement de nom, un nouveau rapport et des frais de changement d'image. Notre guide sur ",
      { text: "la lecture d'un rapport NUANS", href: "/guides/comment-lire-un-rapport-nuans" },
      " explique comment distinguer un conflit sérieux du bruit de fond, et notre guide sur la ",
      { text: "dénomination sociale refusée", href: "/guides/denomination-sociale-refusee-canada" },
      " présente les solutions quand un nom pose problème.",
    ),
    { type: "heading", id: "matricule", text: "Les dénominations numériques évitent la recherche" },
    p(
      "L'Alberta n'exige aucun rapport NUANS pour une dénomination numérique attribuée par le Corporate Registry, comme 785843 Alberta Inc. Le mot « Alberta » forme toujours la deuxième partie du nom. Si la rapidité compte plus que l'image de marque, constituer une ",
      { text: "société à matricule", href: "/guides/societe-nominative-ou-a-matricule" },
      " et enregistrer un nom commercial pour exercer ses activités est une voie courante, et les noms commerciaux n'exigent pas de rapport NUANS.",
    ),
    { type: "heading", id: "recherche-gratuite", text: "Existe-t-il une recherche NUANS gratuite en Alberta ?" },
    {
      type: "paragraph",
      text: "Pas une que vous pouvez déposer. La Base de données sur les marques de commerce canadiennes est gratuite et mérite une vérification, et certains fournisseurs offrent une présélection gratuite pour repérer les conflits évidents. Aucune ne produit de rapport NUANS albertain, et seul le rapport lui-même peut accompagner un dépôt en Alberta.",
    },
    { type: "heading", id: "autres-provinces", text: "Vous déposez ailleurs qu'en Alberta ?" },
    p(
      "Peu d'administrations exigent que vous fournissiez un rapport NUANS. L'Ontario en exige un, selon ses propres règles décrites dans notre ",
      { text: "guide du rapport NUANS en Ontario", href: "/guides/rapport-nuans-ontario" },
      ". Au fédéral, la recherche est intégrée au dépôt en ligne. Plusieurs provinces, dont la Saskatchewan et le Manitoba, gèrent leur propre réservation de nom et n'acceptent pas de rapport NUANS. Notre tableau des ",
      { text: "provinces qui exigent un rapport NUANS", href: "/guides/quelles-provinces-exigent-un-rapport-nuans" },
      " couvre chaque administration.",
    ),
    { type: "heading", id: "commande", text: "Commandez votre rapport NUANS albertain" },
    p(
      "Korporex commande des rapports NUANS albertains à un tarif fixe de 39,99 $ plus TVH par nom proposé, sans compte ni adhésion, et plusieurs noms peuvent figurer sur une même commande. ",
      { text: "Commandez un rapport NUANS", href: "/nuans" },
      ", choisissez l'Alberta comme administration, et le rapport vous est transmis par courriel, prêt à remettre à votre agent d'enregistrement. Korporex ne dépose pas de constitutions en Alberta et n'est pas un cabinet d'avocats; il ne se prononce pas sur la sûreté d'un nom, et les questions d'opposition ou de conflit relèvent d'un avocat.",
    ),
    {
      type: "paragraph",
      text: "Les exigences décrites ici reflètent les indications publiées par l'Alberta en date d'octobre 2026. Elles changent de temps à autre; confirmez les règles en vigueur auprès d'un agent d'enregistrement ou du Corporate Registry de l'Alberta avant de déposer. Rien dans ce guide ne constitue un avis juridique.",
    },
  ],
  faq: [
    {
      q: "Faut-il un rapport NUANS pour se constituer en Alberta ?",
      a: "Oui, si la société aura un nom. L'Alberta exige un rapport NUANS albertain, remis au complet avec la constitution et datant de moins de 91 jours. Une dénomination numérique attribuée par le Corporate Registry n'en exige pas.",
    },
    {
      q: "Puis-je utiliser un rapport NUANS ontarien ou fédéral en Alberta ?",
      a: "Non. L'Alberta demande un rapport NUANS albertain. Commandez un rapport distinct pour chaque province où vous déposez.",
    },
    {
      q: "Combien de temps un rapport NUANS albertain est-il valide ?",
      a: "Selon l'Alberta, le rapport réserve le nom proposé pendant 90 jours et doit dater de moins de 91 jours lors du dépôt. Au-delà, un nouveau rapport est nécessaire.",
    },
    {
      q: "Où dépose-t-on une constitution en Alberta ?",
      a: "Auprès d'un agent d'enregistrement ou d'un fournisseur de services autorisé de l'Alberta. Vous apportez les documents de constitution, le rapport NUANS albertain et une pièce d'identité valide, et l'agent perçoit un droit gouvernemental et des frais de service.",
    },
    {
      q: "Une société d'une autre province a-t-elle besoin d'un rapport NUANS albertain ?",
      a: "Habituellement, oui. Une société d'une autre province qui s'enregistre en Alberta doit obtenir un rapport NUANS albertain, sauf si elle porte une dénomination numérique de son administration d'origine ou a été constituée sous la Loi canadienne sur les sociétés par actions.",
    },
    {
      q: "Faut-il un rapport NUANS pour un nom commercial en Alberta ?",
      a: "Non. Les noms commerciaux et les sociétés de personnes n'exigent pas de rapport NUANS en Alberta, car les noms en double sont permis dans ces cas. Une recherche rapide reste utile avant l'enregistrement.",
    },
    {
      q: "Combien coûte un rapport NUANS albertain ?",
      a: "Le prix est fixé par le fournisseur qui effectue la recherche. Korporex facture un tarif fixe de 39,99 $ plus TVH par nom proposé. Les droits gouvernementaux et frais de service de l'agent d'enregistrement pour le dépôt sont distincts.",
    },
  ],
};

const es: Article = {
  slug: "informe-nuans-alberta",
  locale: "es",
  group: "nuans-report-alberta",
  category: "Incorporation Guides",
  title: "Informe NUANS en Alberta: cuándo se exige y cómo obtenerlo",
  excerpt:
    "Alberta exige un informe NUANS de Alberta para una sociedad con nombre y, a diferencia de Ontario, pide el informe completo, con menos de 91 días, entregado por un agente de registro. Estos son los trámites que lo exigen y cómo pedirlo.",
  metaTitle: "Informe NUANS en Alberta: cuándo se exige | Korporex",
  metaDescription:
    "Alberta exige un informe NUANS de Alberta para constituir una sociedad con nombre o registrar una de otra provincia. La regla de 91 días y cómo pedirlo.",
  readTime: "8 min de lectura",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Si va a constituir una sociedad con nombre en Alberta, necesita un informe NUANS de Alberta. Alberta es una de las pocas provincias que le obliga a obtener el informe usted mismo y entregarlo, y es concreta sobre lo que pide: un informe generado para Alberta, entregado completo con el trámite y con menos de 91 días de antigüedad.",
    },
    {
      type: "paragraph",
      text: "Esta guía explica el proceso NUANS propio de Alberta: qué trámites lo exigen, en qué se diferencia de Ontario y del proceso federal, cómo pedir un informe y qué pasa si alguien se opone después a su nombre.",
    },
    { type: "heading", id: "que-es", text: "Qué es un informe NUANS de Alberta" },
    p(
      "NUANS (Newly Upgraded Automated Name Search) es una base de datos federal de denominaciones sociales, nombres comerciales y marcas registradas en Canadá, administrada por Innovación, Ciencia y Desarrollo Económico de Canadá. Una ",
      { text: "búsqueda de nombre NUANS", href: "/guides/busqueda-de-nombre-nuans" },
      " compara el nombre propuesto con esos registros y genera un informe con los nombres existentes más parecidos.",
    ),
    {
      type: "paragraph",
      text: "Cada informe se genera para una jurisdicción concreta. Para un trámite en Alberta, debe ser un informe de Alberta. Según Alberta, debe obtener un informe NUANS de Alberta y revisarlo para asegurarse de que ninguna otra sociedad tenga un nombre idéntico o demasiado parecido al propuesto. El registro de Alberta no genera el informe; lo emite un proveedor privado de búsquedas.",
    },
    { type: "heading", id: "tramites", text: "Qué trámites en Alberta exigen un informe NUANS" },
    {
      type: "table",
      head: ["Trámite en Alberta", "¿Exige informe NUANS de Alberta?", "Notas"],
      rows: [
        ["Constituir una sociedad de Alberta", "Sí, para una sociedad con nombre", "No se exige para un nombre numérico asignado por Corporate Registry"],
        ["Cambiar el nombre de una sociedad", "Sí, en la mayoría de los cambios", "No se exige al pasar a un nombre numérico, como 9999999 Alberta Ltd."],
        ["Registrar una sociedad de otra provincia", "Sí", "No se exige si tiene un nombre numérico de su jurisdicción de origen o se constituyó bajo la Canada Business Corporations Act"],
        ["Usar un nombre asumido en Alberta", "Sí, un informe aparte", "Para una sociedad extraprovincial cuyo nombre se parece demasiado a uno existente en Alberta"],
        ["Constituir una society (sin fines de lucro)", "Sí, para una society con nombre", "Las societies usan sus propios elementos legales, como Society, Association o Foundation"],
        ["Registrar un nombre comercial o una sociedad colectiva", "No", "Se permiten nombres duplicados en estos casos, aunque conviene hacer una búsqueda rápida"],
      ],
    },
    p(
      "La fila extraprovincial importa más de lo que parece. Una sociedad constituida en otra provincia que quiera ",
      { text: "operar en Alberta", href: "/services/extra-provincial" },
      " necesita un informe NUANS de Alberta para su nombre actual, salvo que sea una sociedad federal (CBCA) o tenga un nombre numérico. Si su nombre se parece demasiado a uno ya usado en Alberta, puede registrarse con un nombre asumido, que requiere su propio informe.",
    ),
    { type: "heading", id: "diferencias", text: "En qué se diferencia Alberta de Ontario y del proceso federal" },
    {
      type: "table",
      head: ["", "Alberta", "Ontario", "Federal (CBCA)"],
      rows: [
        ["¿Aporta usted un informe NUANS para constituirse?", "Sí, un informe de Alberta", "Sí, un informe con ponderación ontariana", "No; la búsqueda está integrada en el trámite en línea"],
        ["Qué se entrega", "El informe completo", "Solo el número de referencia, el nombre buscado y la fecha", "Nada aparte"],
        ["Plazo", "Menos de 91 días", "Fechado como máximo 90 días antes de presentar", "Integrado en el trámite"],
        ["Quién presenta", "Un agente de registro o proveedor de servicios autorizado de Alberta", "En línea por el Ontario Business Registry", "En línea ante Corporations Canada"],
      ],
    },
    p(
      "La diferencia práctica está en el papeleo. En ",
      { text: "Ontario", href: "/guides/informe-nuans-ontario" },
      " se ingresan tres datos del informe en el registro y usted conserva el informe. En Alberta, el informe completo acompaña el trámite. Si presenta en ambas provincias, pida un informe por provincia: el de una no sustituye al de la otra.",
    ),
    { type: "heading", id: "como-obtener", text: "Cómo obtener un informe NUANS de Alberta, paso a paso" },
    {
      type: "list",
      items: [
        "Defina el nombre completo. Los nombres de sociedades de Alberta tienen un elemento distintivo, uno descriptivo y uno legal. Los elementos legales aceptados en Alberta incluyen Limited, Ltd., Incorporated, Inc., Corporation, Corp., sus formas francesas, y ULC o Unlimited Liability Corporation para una sociedad de responsabilidad ilimitada.",
        "Identifique el elemento distintivo. NUANS pondera la parte distintiva del nombre; en \"Bow Valley Logistics Ltd.\" la búsqueda es, en la práctica, sobre \"Bow Valley\".",
        "Haga un filtro gratuito. Revise la Base de Datos de Marcas Canadienses y haga una prebúsqueda rápida para descartar nombres con conflictos evidentes antes de pagar un informe.",
        "Pida un informe NUANS de Alberta. Indique Alberta como jurisdicción. Incluya dos o tres nombres candidatos en un mismo pedido para que un conflicto con la primera opción no le cueste otra ronda.",
        "Revise el informe. Alberta espera que lo lea, no solo que lo adjunte. Busque nombres idénticos, que no se permiten para sociedades, y nombres lo bastante parecidos como para provocar una oposición.",
        "Presente por un agente de registro dentro del plazo. Lleve el informe completo, los documentos de constitución y una identificación válida a un agente de registro o proveedor de servicios autorizado de Alberta antes de que el informe cumpla 91 días.",
      ],
    },
    {
      type: "callout",
      title: "Documentos de una constitución en Alberta",
      text: "Alberta enumera cuatro documentos para constituir una sociedad: Articles of Incorporation, Notice of Address, Notice of Directors y Notice of Agent for Service. Una sociedad con nombre añade el informe NUANS de Alberta. El agente de registro cobra una tasa gubernamental y una tarifa de servicio, ambas publicadas en el catálogo de productos de los agentes de registro de Alberta.",
    },
    { type: "heading", id: "noventa-y-un-dias", text: "La regla de los 91 días" },
    {
      type: "paragraph",
      text: "Según Alberta, el informe reserva el nombre propuesto durante 90 días y debe tener menos de 91 días al presentarse. El plazo corre desde la fecha en que se generó el informe, no desde el día en que lo pagó o abrió el PDF. Si el trámite se retrasa más allá, necesita un informe nuevo.",
    },
    {
      type: "paragraph",
      text: "El plazo suele perderse por pedir demasiado pronto: el nombre se busca el día en que el cliente lo menciona y la estructura de acciones, los administradores o la financiación tardan dos meses en definirse. Pida el informe cuando el resto del trámite esté listo y anote el vencimiento ese mismo día.",
    },
    { type: "heading", id: "oposiciones", text: "Qué pasa si alguien se opone a su nombre" },
    {
      type: "paragraph",
      text: "Que el registro acepte un nombre no cierra la cuestión. Según Alberta, si otra sociedad considera que su nombre se parece demasiado al suyo, puede presentar una oposición ante el Registrar of Corporations. Alberta también indica que, a diferencia de los nombres comerciales, no se permiten sociedades con nombres idénticos.",
    },
    p(
      "Por eso importa revisar el informe. Un conflicto visible hoy en el informe se convierte mañana en un cambio de nombre, un informe nuevo y costos de cambio de marca. Nuestra guía sobre ",
      { text: "cómo leer un informe NUANS", href: "/guides/como-leer-un-informe-nuans" },
      " explica cómo distinguir un conflicto serio del ruido de fondo, y nuestra guía sobre la ",
      { text: "denominación social rechazada", href: "/guides/denominacion-social-rechazada-canada" },
      " recoge las salidas cuando un nombre tiene problemas.",
    ),
    { type: "heading", id: "numerada", text: "Los nombres numéricos evitan la búsqueda" },
    p(
      "Alberta no exige informe NUANS para un nombre numérico asignado por Corporate Registry, como 785843 Alberta Inc. La palabra \"Alberta\" siempre forma la segunda parte del nombre. Si la rapidez importa más que la marca, constituir una ",
      { text: "sociedad numerada", href: "/guides/sociedad-con-nombre-o-numerada" },
      " y registrar un nombre comercial para operar es una vía habitual, y los nombres comerciales no requieren informe NUANS.",
    ),
    { type: "heading", id: "busqueda-gratuita", text: "¿Existe una búsqueda NUANS gratuita en Alberta?" },
    {
      type: "paragraph",
      text: "No una que se pueda presentar. La Base de Datos de Marcas Canadienses es gratuita y vale la pena consultarla, y algunos proveedores ofrecen una prebúsqueda gratuita para ver conflictos evidentes. Ninguna genera un informe NUANS de Alberta, y solo el informe en sí puede acompañar un trámite en Alberta.",
    },
    { type: "heading", id: "otras-provincias", text: "¿Presenta fuera de Alberta?" },
    p(
      "Pocas jurisdicciones exigen que usted aporte un informe NUANS. Ontario lo exige, con reglas propias que explicamos en nuestra ",
      { text: "guía del informe NUANS en Ontario", href: "/guides/informe-nuans-ontario" },
      ". A nivel federal, la búsqueda está integrada en el trámite en línea. Varias provincias, como Saskatchewan y Manitoba, gestionan su propia reserva de nombres y no aceptan informes NUANS. Nuestro desglose de ",
      { text: "qué provincias exigen un informe NUANS", href: "/guides/que-provincias-exigen-un-informe-nuans" },
      " cubre todas las jurisdicciones.",
    ),
    { type: "heading", id: "pedido", text: "Pida su informe NUANS de Alberta" },
    p(
      "Korporex pide informes NUANS de Alberta por una tarifa fija de 39,99 $ más HST por nombre propuesto, sin cuenta ni membresía, y puede incluir varios nombres en un mismo pedido. ",
      { text: "Pida un informe NUANS", href: "/nuans" },
      ", elija Alberta como jurisdicción y recibirá el informe por correo electrónico, listo para llevar a su agente de registro. Korporex no presenta constituciones en Alberta y no es un despacho de abogados; no opina sobre si un nombre es seguro, y las dudas sobre oposiciones o conflictos corresponden a un abogado.",
    ),
    {
      type: "paragraph",
      text: "Los requisitos descritos reflejan las indicaciones publicadas por Alberta a octubre de 2026. Cambian de vez en cuando; confirme las reglas vigentes con un agente de registro o con Alberta Corporate Registry antes de presentar. Nada en esta guía constituye asesoramiento legal.",
    },
  ],
  faq: [
    {
      q: "¿Necesito un informe NUANS para constituirme en Alberta?",
      a: "Sí, si la sociedad tendrá un nombre. Alberta exige un informe NUANS de Alberta, entregado completo con la constitución y con menos de 91 días. Un nombre numérico asignado por Corporate Registry no lo necesita.",
    },
    {
      q: "¿Puedo usar un informe NUANS de Ontario o federal en Alberta?",
      a: "No. Alberta pide un informe NUANS de Alberta. Pida un informe distinto para cada provincia en la que presente.",
    },
    {
      q: "¿Cuánto tiempo es válido un informe NUANS de Alberta?",
      a: "Según Alberta, el informe reserva el nombre propuesto durante 90 días y debe tener menos de 91 días al presentarse. Después, necesita un informe nuevo.",
    },
    {
      q: "¿Dónde se presenta una constitución en Alberta?",
      a: "Ante un agente de registro o un proveedor de servicios autorizado de Alberta. Lleva los documentos de constitución, el informe NUANS de Alberta y una identificación válida, y el agente cobra una tasa gubernamental más una tarifa de servicio.",
    },
    {
      q: "¿Una sociedad de otra provincia necesita un informe NUANS de Alberta?",
      a: "Normalmente, sí. Una sociedad de otra provincia que se registra en Alberta necesita un informe NUANS de Alberta, salvo que tenga un nombre numérico de su jurisdicción de origen o se haya constituido bajo la Canada Business Corporations Act.",
    },
    {
      q: "¿Necesito un informe NUANS para un nombre comercial en Alberta?",
      a: "No. Los nombres comerciales y las sociedades colectivas no requieren informe NUANS en Alberta, porque en esos casos se permiten nombres duplicados. Aun así, conviene hacer una búsqueda rápida antes de registrarlo.",
    },
    {
      q: "¿Cuánto cuesta un informe NUANS de Alberta?",
      a: "El precio lo fija el proveedor que hace la búsqueda. Korporex cobra una tarifa fija de 39,99 $ más HST por nombre propuesto. Las tasas gubernamentales y la tarifa de servicio del agente de registro por el trámite son aparte.",
    },
  ],
};

export const nuansReportAlberta: Article[] = [en, fr, es];
