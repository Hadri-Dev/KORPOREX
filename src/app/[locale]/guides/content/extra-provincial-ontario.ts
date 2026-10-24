import type { Article, ArticleInline, ArticleSection } from "../articles";

// Extra-provincial registration in Ontario guide (en/fr/es). Targets
// "extra provincial registration ontario" (KD 2) and feeds relevance to
// /services/extra-provincial. Facts checked against e-Laws on 2026-10-24:
// Extra-Provincial Corporations Act ss. 1(2) (carrying on business), 2
// (classes 1-3), 4 (only class 3 needs a licence), 10 (name limits for
// classes 1 and 3), 19 (class 3 agent for service), 20-21 (offences, no
// contract actions for an unlicensed class 3); Corporations Information Act
// ss. 3 (Initial Return within 60 days, before any Business Names Act
// registration), 4 (Notice of Change within 15 days), 18 (no proceedings
// while in default without leave); O. Reg. 182 ss. 2 (Initial Return
// contents) and 6(2) (only Ontario and licensed class 3 corporations file the
// Ontario annual return). The $330 class 3 licence fee mirrors the verified
// service copy. Other provinces are described in general terms only.

// Paragraph with inline links; the plain `text` is derived from the parts.
function p(...parts: ArticleInline[]): ArticleSection {
  return {
    type: "paragraph",
    text: parts.map((x) => (typeof x === "string" ? x : x.text)).join(""),
    parts,
  };
}

const PUBLISHED_AT = "2026-10-24T10:00:00-04:00";
const UPDATED = "2026-10-24";

const en: Article = {
  slug: "extra-provincial-registration-ontario",
  locale: "en",
  group: "extra-provincial-ontario",
  category: "Compliance & Maintenance",
  title: "Extra-Provincial Registration in Ontario: How It Works",
  excerpt:
    "A corporation from another province, or a federal corporation, that carries on business in Ontario registers by filing an Initial Return within 60 days. Only corporations from outside Canada need a licence. Here is how Ontario's rules work.",
  metaTitle: "Extra-Provincial Registration in Ontario | Korporex",
  metaDescription:
    "Extra-provincial registration in Ontario: who must register, the 60-day Initial Return, when a $330 licence applies, agent for service rules and ongoing filings.",
  readTime: "7 min read",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Extra-provincial registration in Ontario applies to any corporation that was not incorporated under Ontario law but carries on business in the province. A British Columbia company opening a Toronto office, a federal corporation hiring staff in Ottawa, a Delaware company leasing a warehouse in Mississauga: each one has a filing to make in Ontario. What that filing is depends on where the corporation was incorporated.",
    },
    { type: "heading", id: "what-it-is", text: "What extra-provincial registration means" },
    {
      type: "paragraph",
      text: "An extra-provincial corporation is a corporation incorporated somewhere other than the province it is operating in. Registering extra-provincially does not move the corporation or create a new one. It stays incorporated in its home jurisdiction, keeps its existing corporation number there, and is added to Ontario's public record as a corporation carrying on business in Ontario. Moving a corporation to a new jurisdiction of incorporation is a different process, called a continuance.",
    },
    { type: "heading", id: "carrying-on-business", text: "When a corporation carries on business in Ontario" },
    {
      type: "paragraph",
      text: "Section 1(2) of Ontario's Extra-Provincial Corporations Act says an extra-provincial corporation carries on its business in Ontario if:",
    },
    {
      type: "list",
      items: [
        "it has a resident agent, representative, warehouse, office or place where it carries on its business in Ontario;",
        "it holds an interest in real property in Ontario, other than by way of security; or",
        "it otherwise carries on its business in Ontario.",
      ],
    },
    {
      type: "paragraph",
      text: "The last item is open-ended, so the first two are examples rather than a complete list. Whether a particular level of activity in Ontario counts is a question of fact for each corporation.",
    },
    { type: "heading", id: "three-classes", text: "Ontario's three classes of extra-provincial corporation" },
    {
      type: "paragraph",
      text: "Section 2 of the Act sorts extra-provincial corporations into three classes, and the class decides what the corporation has to file.",
    },
    {
      type: "table",
      head: ["Class", "Incorporated under", "Ontario licence needed?"],
      rows: [
        ["Class 1", "The laws of another Canadian province", "No"],
        ["Class 2", "Federal law (such as the CBCA) or the laws of a territory", "No"],
        ["Class 3", "The laws of a jurisdiction outside Canada", "Yes"],
      ],
    },
    { type: "heading", id: "class-1-and-2", text: "Class 1 and 2: register with an Initial Return" },
    {
      type: "paragraph",
      text: "Section 4(1) of the Act allows class 1 and class 2 corporations to carry on business in Ontario without a licence. They still have to register. Section 3 of the Corporations Information Act requires an extra-provincial corporation that begins to carry on business in Ontario to file an Initial Return within 60 days after it begins. There is no government fee for the Initial Return.",
    },
    {
      type: "paragraph",
      text: "Federal corporations can easily overlook this step. Incorporating under the Canada Business Corporations Act lets a corporation carry on business across Canada, but it does not take the place of registering in each province where it operates. A federal corporation with its head office in Ontario registers in Ontario like any other class 2 corporation.",
    },
    { type: "heading", id: "class-3", text: "Class 3: a licence and an agent for service" },
    {
      type: "paragraph",
      text: "A corporation incorporated outside Canada needs an extra-provincial licence before it carries on any of its business in Ontario (section 4(2)). The government fee for the licence is $330. Section 19 also requires a class 3 corporation to keep an agent for service in Ontario at all times: an individual aged 18 or older who is resident in Ontario, or a corporation with its head office or registered office in Ontario. Legal documents served on the agent are treated as served on the corporation.",
    },
    {
      type: "paragraph",
      text: "Under section 21, a class 3 corporation that has no licence when one is required, or has no agent for service, cannot bring an action in an Ontario court in respect of any contract it made. Contraventions of the Act are also offences, with fines of up to $25,000 for a corporation and up to $2,000 for individuals, including directors and officers who authorized or permitted the offence.",
    },
    { type: "heading", id: "what-you-need", text: "Information needed to register" },
    {
      type: "paragraph",
      text: "Ontario Regulation 182 sets out what an extra-provincial Initial Return contains. Gather this before filing:",
    },
    {
      type: "list",
      items: [
        "The corporation's exact name and its date of incorporation or amalgamation, whichever is the most recent.",
        "The jurisdiction it was incorporated, continued or amalgamated in.",
        "The address of its head or registered office in its home jurisdiction.",
        "The date it began activities in Ontario.",
        "The name and office address of its chief officer or manager in Ontario, if it has one, and the date that person took the position.",
        "The address of its principal office in Ontario, if it has one.",
        "For a corporation that must have an agent for service in Ontario, the agent's name and address.",
      ],
    },
    { type: "heading", id: "business-names", text: "Operating under a different name" },
    p(
      "A corporation that carries on business in Ontario under any name other than its exact corporate name registers that name under the Business Names Act. The Corporations Information Act requires the Initial Return to be filed first, before the name is registered. Section 10 of the Extra-Provincial Corporations Act also limits the names that class 1 and class 3 corporations can use in Ontario. For how name registration works, see our guide on ",
      { text: "registering a business in Ontario", href: "/guides/how-to-register-a-business-in-ontario" },
      "."
    ),
    { type: "heading", id: "after-registering", text: "Filings after registration" },
    {
      type: "paragraph",
      text: "Registration is not the end of the Ontario record. Section 4 of the Corporations Information Act requires a Notice of Change within 15 days after any change to the information filed, such as a new chief officer in Ontario or a new principal office address. There is no government fee for a Notice of Change.",
    },
    p(
      "The Ontario annual return is narrower. Under section 6(2) of Regulation 182, only Ontario corporations and licensed class 3 corporations file it. Class 1 and class 2 corporations do not file an Ontario annual return, although they still file the annual return their home jurisdiction requires, such as the federal annual return with Corporations Canada. Our guide to ",
      { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" },
      " covers those filings."
    ),
    {
      type: "paragraph",
      text: "Under section 18 of the Corporations Information Act, a corporation that is in default of a required return or notice cannot maintain a proceeding in an Ontario court about the business it carries on, except with the court's leave.",
    },
    { type: "heading", id: "outside-ontario", text: "Ontario corporations expanding to other provinces" },
    p(
      "The rules above are Ontario's. An Ontario corporation that starts carrying on business in Quebec, British Columbia, Alberta or any other province registers under that province's legislation, which sets its own forms, fees, deadlines and agent for service requirements. For Alberta, see our guide to ",
      { text: "Alberta extra-provincial registration", href: "/guides/extra-provincial-registration-alberta" },
      ". For the difference between incorporating federally and provincially in the first place, see ",
      { text: "federal vs provincial incorporation", href: "/guides/federal-vs-provincial-incorporation" },
      "."
    ),
    { type: "heading", id: "getting-it-done", text: "Getting it done" },
    p(
      "Korporex can prepare and file an ",
      { text: "extra-provincial registration", href: "/services/extra-provincial" },
      " for your corporation, in Ontario or in another province, from the information you provide. For Ontario corporations, the equivalent first filing is the ",
      { text: "Ontario Initial Return", href: "/guides/ontario-initial-return" },
      ", due within 60 days of incorporation."
    ),
    {
      type: "paragraph",
      text: "Korporex is not a law firm and this guide is general information, not legal advice. For questions about your corporation's specific situation, including whether it carries on business in Ontario, consult a lawyer or accountant.",
    },
  ],
  faq: [
    {
      q: "Does a federal corporation need to register in Ontario?",
      a: "Yes, if it carries on business in Ontario. A federal corporation is a class 2 extra-provincial corporation in Ontario. It does not need a licence, but it must file an Initial Return within 60 days after it begins carrying on business in the province.",
    },
    {
      q: "How much does extra-provincial registration in Ontario cost?",
      a: "For corporations from other provinces and federal corporations, there is no government fee: they register by filing an Initial Return, which costs $0. A corporation incorporated outside Canada needs an extra-provincial licence, which has a $330 government fee.",
    },
    {
      q: "What is the deadline for extra-provincial registration in Ontario?",
      a: "Section 3 of the Corporations Information Act requires the Initial Return within 60 days after the corporation begins to carry on business in Ontario. A corporation from outside Canada needs its licence before it carries on any business in Ontario.",
    },
    {
      q: "Does an extra-provincial corporation file an annual return in Ontario?",
      a: "Only if it is a licensed class 3 corporation, meaning one incorporated outside Canada. Under Ontario Regulation 182, class 1 and class 2 corporations are exempt from the Ontario annual return, though they still report changes through a Notice of Change within 15 days.",
    },
    {
      q: "Does a corporation from another province need an agent for service in Ontario?",
      a: "Section 19 of the Extra-Provincial Corporations Act requires an agent for service in Ontario for class 3 corporations, those incorporated outside Canada. It does not impose that requirement on class 1 or class 2 corporations.",
    },
  ],
};

const fr: Article = {
  slug: "enregistrement-extraprovincial-ontario",
  locale: "fr",
  group: "extra-provincial-ontario",
  category: "Compliance & Maintenance",
  title: "Enregistrement extraprovincial en Ontario : comment ça fonctionne",
  excerpt:
    "Une société d'une autre province, ou une société fédérale, qui exerce ses activités en Ontario s'enregistre en déposant un rapport initial dans les 60 jours. Seules les sociétés constituées hors du Canada ont besoin d'un permis. Voici les règles ontariennes.",
  metaTitle: "Enregistrement extraprovincial en Ontario | Korporex",
  metaDescription:
    "Enregistrement extraprovincial en Ontario : qui doit s'enregistrer, le rapport initial de 60 jours, le permis de 330 $, le mandataire aux fins de signification et les dépôts continus.",
  readTime: "7 min de lecture",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "L'enregistrement extraprovincial en Ontario vise toute société qui n'a pas été constituée sous le régime des lois ontariennes, mais qui exerce ses activités dans la province. Une société de la Colombie-Britannique qui ouvre un bureau à Toronto, une société fédérale qui embauche du personnel à Ottawa, une société du Delaware qui loue un entrepôt à Mississauga : chacune a un dépôt à faire en Ontario. La nature de ce dépôt dépend du lieu de constitution de la société.",
    },
    { type: "heading", id: "what-it-is", text: "Ce que signifie l'enregistrement extraprovincial" },
    {
      type: "paragraph",
      text: "Une personne morale extraprovinciale est une société constituée ailleurs que dans la province où elle exerce ses activités. L'enregistrement extraprovincial ne déplace pas la société et n'en crée pas une nouvelle. Elle demeure constituée dans son territoire d'origine, conserve son numéro de société existant et est ajoutée au registre public de l'Ontario à titre de société exerçant des activités en Ontario. Le transfert d'une société vers un nouveau territoire de constitution est un processus distinct, appelé prorogation.",
    },
    { type: "heading", id: "carrying-on-business", text: "Quand une société exerce ses activités en Ontario" },
    {
      type: "paragraph",
      text: "Selon le paragraphe 1(2) de la Loi sur les personnes morales extraprovinciales de l'Ontario, une personne morale extraprovinciale exerce ses activités en Ontario dans les cas suivants :",
    },
    {
      type: "list",
      items: [
        "elle a en Ontario un mandataire résident, un représentant, un entrepôt, un bureau ou un établissement où elle exerce ses activités;",
        "elle détient un intérêt sur un bien immeuble situé en Ontario, autrement qu'à titre de sûreté;",
        "elle exerce par ailleurs ses activités en Ontario.",
      ],
    },
    {
      type: "paragraph",
      text: "Le dernier point est ouvert : les deux premiers sont donc des exemples plutôt qu'une liste complète. La question de savoir si un niveau d'activité donné en Ontario est visé est une question de fait propre à chaque société.",
    },
    { type: "heading", id: "three-classes", text: "Les trois catégories de personnes morales extraprovinciales" },
    {
      type: "paragraph",
      text: "L'article 2 de la Loi répartit les personnes morales extraprovinciales en trois catégories, et la catégorie détermine ce que la société doit déposer.",
    },
    {
      type: "table",
      head: ["Catégorie", "Constituée en vertu", "Permis ontarien requis?"],
      rows: [
        ["Catégorie 1", "Des lois d'une autre province canadienne", "Non"],
        ["Catégorie 2", "Des lois fédérales (comme la LCSA) ou des lois d'un territoire", "Non"],
        ["Catégorie 3", "Des lois d'un territoire situé hors du Canada", "Oui"],
      ],
    },
    { type: "heading", id: "class-1-and-2", text: "Catégories 1 et 2 : enregistrement par rapport initial" },
    {
      type: "paragraph",
      text: "Le paragraphe 4(1) de la Loi permet aux sociétés des catégories 1 et 2 d'exercer leurs activités en Ontario sans permis. Elles doivent tout de même s'enregistrer. L'article 3 de la Loi sur les renseignements exigés des personnes morales oblige la personne morale extraprovinciale qui commence à exercer ses activités en Ontario à déposer un rapport initial dans les 60 jours suivant ce début. Aucuns droits gouvernementaux ne s'appliquent au rapport initial.",
    },
    {
      type: "paragraph",
      text: "Les sociétés fédérales peuvent facilement négliger cette étape. La constitution en vertu de la Loi canadienne sur les sociétés par actions permet à une société d'exercer ses activités partout au Canada, mais elle ne remplace pas l'enregistrement dans chaque province où elle exerce ses activités. Une société fédérale dont le siège est en Ontario s'enregistre en Ontario comme toute autre société de catégorie 2.",
    },
    { type: "heading", id: "class-3", text: "Catégorie 3 : un permis et un mandataire aux fins de signification" },
    {
      type: "paragraph",
      text: "Une société constituée hors du Canada a besoin d'un permis extraprovincial avant d'exercer quelque activité que ce soit en Ontario (paragraphe 4(2)). Les droits gouvernementaux pour le permis sont de 330 $. L'article 19 oblige aussi la société de catégorie 3 à maintenir en tout temps un mandataire aux fins de signification en Ontario : un particulier âgé d'au moins 18 ans qui réside en Ontario, ou une société dont le siège social ou le bureau enregistré est en Ontario. Les documents juridiques signifiés au mandataire sont réputés signifiés à la société.",
    },
    {
      type: "paragraph",
      text: "En vertu de l'article 21, une société de catégorie 3 qui n'a pas de permis lorsqu'il est exigé, ou qui n'a pas de mandataire aux fins de signification, ne peut intenter d'action devant un tribunal ontarien relativement à un contrat qu'elle a conclu. Les contraventions à la Loi constituent aussi des infractions, passibles d'amendes maximales de 25 000 $ pour une société et de 2 000 $ pour les particuliers, y compris les administrateurs et dirigeants qui ont autorisé ou permis l'infraction.",
    },
    { type: "heading", id: "what-you-need", text: "Renseignements nécessaires pour s'enregistrer" },
    {
      type: "paragraph",
      text: "Le Règlement de l'Ontario 182 précise le contenu du rapport initial d'une personne morale extraprovinciale. Réunissez ces renseignements avant le dépôt :",
    },
    {
      type: "list",
      items: [
        "La dénomination exacte de la société et sa date de constitution ou de fusion, selon la plus récente.",
        "Le territoire où elle a été constituée, prorogée ou fusionnée.",
        "L'adresse de son siège social ou de son bureau enregistré dans son territoire d'origine.",
        "La date à laquelle elle a commencé ses activités en Ontario.",
        "Le nom et l'adresse du bureau de son dirigeant principal ou gérant en Ontario, le cas échéant, et la date de son entrée en fonction.",
        "L'adresse de son établissement principal en Ontario, le cas échéant.",
        "Pour une société tenue d'avoir un mandataire aux fins de signification en Ontario, le nom et l'adresse du mandataire.",
      ],
    },
    { type: "heading", id: "business-names", text: "Exercer sous un autre nom" },
    p(
      "Une société qui exerce ses activités en Ontario sous un nom autre que sa dénomination sociale exacte enregistre ce nom en vertu de la Loi sur les noms commerciaux. La Loi sur les renseignements exigés des personnes morales exige que le rapport initial soit déposé d'abord, avant l'enregistrement du nom. L'article 10 de la Loi sur les personnes morales extraprovinciales limite aussi les noms que les sociétés des catégories 1 et 3 peuvent utiliser en Ontario. Pour le fonctionnement de l'enregistrement d'un nom, consultez notre guide sur ",
      { text: "l'enregistrement d'une entreprise en Ontario", href: "/guides/comment-enregistrer-entreprise-ontario" },
      "."
    ),
    { type: "heading", id: "after-registering", text: "Les dépôts après l'enregistrement" },
    {
      type: "paragraph",
      text: "L'enregistrement n'est pas la fin du dossier ontarien. L'article 4 de la Loi sur les renseignements exigés des personnes morales exige un avis de modification dans les 15 jours suivant tout changement aux renseignements déposés, comme un nouveau dirigeant principal en Ontario ou une nouvelle adresse d'établissement principal. Aucuns droits gouvernementaux ne s'appliquent à l'avis de modification.",
    },
    p(
      "Le rapport annuel ontarien a une portée plus étroite. Selon le paragraphe 6(2) du Règlement 182, seules les sociétés ontariennes et les sociétés de catégorie 3 titulaires d'un permis le déposent. Les sociétés des catégories 1 et 2 ne déposent pas de rapport annuel ontarien, mais elles déposent toujours celui qu'exige leur territoire d'origine, comme le rapport annuel fédéral auprès de Corporations Canada. Notre guide sur les ",
      { text: "rapports annuels des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" },
      " traite de ces dépôts."
    ),
    {
      type: "paragraph",
      text: "Selon l'article 18 de la Loi sur les renseignements exigés des personnes morales, une société en défaut de déposer un rapport ou un avis exigé ne peut introduire d'instance devant un tribunal ontarien relativement aux activités qu'elle exerce, sauf avec l'autorisation du tribunal.",
    },
    { type: "heading", id: "outside-ontario", text: "Les sociétés ontariennes qui s'étendent dans d'autres provinces" },
    p(
      "Les règles ci-dessus sont celles de l'Ontario. Une société ontarienne qui commence à exercer ses activités au Québec, en Colombie-Britannique, en Alberta ou dans toute autre province s'enregistre en vertu de la législation de cette province, qui fixe ses propres formulaires, droits, délais et exigences relatives au mandataire aux fins de signification. Pour l'Alberta, consultez notre guide sur l'",
      { text: "enregistrement extraprovincial en Alberta", href: "/guides/enregistrement-extraprovincial-alberta" },
      ". Pour comparer la constitution fédérale et la constitution provinciale, consultez notre guide sur ",
      { text: "comment se constituer en société au Canada", href: "/guides/comment-se-constituer-societe-canada" },
      "."
    ),
    { type: "heading", id: "getting-it-done", text: "Passer à l'action" },
    p(
      "Korporex peut préparer et déposer un ",
      { text: "enregistrement extraprovincial", href: "/services/extra-provincial" },
      " pour votre société, en Ontario ou dans une autre province, à partir des renseignements que vous fournissez. Pour les sociétés ontariennes, le premier dépôt équivalent est le ",
      { text: "rapport initial ontarien", href: "/guides/declaration-initiale-ontario" },
      ", à déposer dans les 60 jours suivant la constitution."
    ),
    {
      type: "paragraph",
      text: "Korporex n'est pas un cabinet d'avocats et ce guide présente de l'information générale, et non des conseils juridiques. Pour toute question sur la situation particulière de votre société, notamment pour savoir si elle exerce ses activités en Ontario, consultez un avocat ou un comptable.",
    },
  ],
  faq: [
    {
      q: "Une société fédérale doit-elle s'enregistrer en Ontario?",
      a: "Oui, si elle exerce ses activités en Ontario. Une société fédérale est une personne morale extraprovinciale de catégorie 2 en Ontario. Elle n'a pas besoin de permis, mais elle doit déposer un rapport initial dans les 60 jours suivant le début de ses activités dans la province.",
    },
    {
      q: "Combien coûte l'enregistrement extraprovincial en Ontario?",
      a: "Pour les sociétés d'autres provinces et les sociétés fédérales, aucuns droits gouvernementaux ne s'appliquent : elles s'enregistrent en déposant un rapport initial, qui coûte 0 $. Une société constituée hors du Canada a besoin d'un permis extraprovincial, assorti de droits gouvernementaux de 330 $.",
    },
    {
      q: "Quel est le délai pour l'enregistrement extraprovincial en Ontario?",
      a: "L'article 3 de la Loi sur les renseignements exigés des personnes morales exige le rapport initial dans les 60 jours suivant le début des activités de la société en Ontario. Une société constituée hors du Canada doit obtenir son permis avant d'exercer quelque activité que ce soit en Ontario.",
    },
    {
      q: "Une personne morale extraprovinciale dépose-t-elle un rapport annuel en Ontario?",
      a: "Seulement s'il s'agit d'une société de catégorie 3 titulaire d'un permis, c'est-à-dire constituée hors du Canada. Selon le Règlement de l'Ontario 182, les sociétés des catégories 1 et 2 sont dispensées du rapport annuel ontarien, mais elles déclarent tout changement par un avis de modification dans les 15 jours.",
    },
    {
      q: "Une société d'une autre province a-t-elle besoin d'un mandataire aux fins de signification en Ontario?",
      a: "L'article 19 de la Loi sur les personnes morales extraprovinciales exige un mandataire aux fins de signification en Ontario pour les sociétés de catégorie 3, constituées hors du Canada. Il n'impose pas cette exigence aux sociétés des catégories 1 et 2.",
    },
  ],
};

const es: Article = {
  slug: "registro-extraprovincial-ontario",
  locale: "es",
  group: "extra-provincial-ontario",
  category: "Compliance & Maintenance",
  title: "Registro extraprovincial en Ontario: cómo funciona",
  excerpt:
    "Una sociedad de otra provincia, o una sociedad federal, que realiza actividades comerciales en Ontario se registra presentando una declaración inicial dentro de los 60 días. Solo las sociedades constituidas fuera de Canadá necesitan una licencia. Así funcionan las reglas de Ontario.",
  metaTitle: "Registro extraprovincial en Ontario | Korporex",
  metaDescription:
    "Registro extraprovincial en Ontario: quién debe registrarse, la declaración inicial de 60 días, la licencia de $330, el agente para notificaciones y las presentaciones posteriores.",
  readTime: "7 min de lectura",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "El registro extraprovincial en Ontario se aplica a toda sociedad que no fue constituida conforme a la ley de Ontario pero que realiza actividades comerciales en la provincia. Una sociedad de Columbia Británica que abre una oficina en Toronto, una sociedad federal que contrata personal en Ottawa, una sociedad de Delaware que alquila un almacén en Mississauga: cada una tiene una presentación que hacer en Ontario. Cuál es esa presentación depende de dónde se constituyó la sociedad.",
    },
    { type: "heading", id: "what-it-is", text: "Qué significa el registro extraprovincial" },
    {
      type: "paragraph",
      text: "Una sociedad extraprovincial es una sociedad constituida en un lugar distinto de la provincia donde opera. El registro extraprovincial no traslada la sociedad ni crea una nueva. La sociedad sigue constituida en su jurisdicción de origen, conserva allí su número de sociedad y se incorpora al registro público de Ontario como sociedad que realiza actividades en Ontario. Trasladar una sociedad a una nueva jurisdicción de constitución es un proceso distinto, llamado continuación.",
    },
    { type: "heading", id: "carrying-on-business", text: "Cuándo una sociedad realiza actividades comerciales en Ontario" },
    {
      type: "paragraph",
      text: "El artículo 1(2) de la Extra-Provincial Corporations Act (Ley de Sociedades Extraprovinciales) de Ontario establece que una sociedad extraprovincial realiza sus actividades en Ontario si:",
    },
    {
      type: "list",
      items: [
        "tiene en Ontario un agente residente, un representante, un almacén, una oficina o un lugar donde realiza sus actividades;",
        "posee un derecho sobre un bien inmueble situado en Ontario, salvo a título de garantía; o",
        "realiza sus actividades en Ontario de cualquier otra forma.",
      ],
    },
    {
      type: "paragraph",
      text: "El último punto es abierto, por lo que los dos primeros son ejemplos y no una lista completa. Si un determinado nivel de actividad en Ontario cuenta o no es una cuestión de hecho propia de cada sociedad.",
    },
    { type: "heading", id: "three-classes", text: "Las tres clases de sociedad extraprovincial en Ontario" },
    {
      type: "paragraph",
      text: "El artículo 2 de la Ley clasifica las sociedades extraprovinciales en tres clases, y la clase determina lo que la sociedad debe presentar.",
    },
    {
      type: "table",
      head: ["Clase", "Constituida conforme a", "¿Necesita licencia en Ontario?"],
      rows: [
        ["Clase 1", "Las leyes de otra provincia canadiense", "No"],
        ["Clase 2", "La ley federal (como la CBCA) o las leyes de un territorio", "No"],
        ["Clase 3", "Las leyes de una jurisdicción fuera de Canadá", "Sí"],
      ],
    },
    { type: "heading", id: "class-1-and-2", text: "Clases 1 y 2: registro mediante una declaración inicial" },
    {
      type: "paragraph",
      text: "El artículo 4(1) de la Ley permite a las sociedades de las clases 1 y 2 realizar actividades en Ontario sin licencia. Aun así, deben registrarse. El artículo 3 de la Corporations Information Act (Ley de Información de Sociedades) exige que la sociedad extraprovincial que comienza a realizar actividades en Ontario presente una declaración inicial dentro de los 60 días siguientes a ese inicio. La declaración inicial no tiene tasa gubernamental.",
    },
    {
      type: "paragraph",
      text: "Las sociedades federales pueden pasar por alto este paso con facilidad. Constituirse conforme a la Canada Business Corporations Act permite a una sociedad operar en todo Canadá, pero no sustituye el registro en cada provincia donde opera. Una sociedad federal con sede en Ontario se registra en Ontario como cualquier otra sociedad de clase 2.",
    },
    { type: "heading", id: "class-3", text: "Clase 3: una licencia y un agente para notificaciones" },
    {
      type: "paragraph",
      text: "Una sociedad constituida fuera de Canadá necesita una licencia extraprovincial antes de realizar cualquier actividad en Ontario (artículo 4(2)). La tasa gubernamental de la licencia es de $330. El artículo 19 también exige que la sociedad de clase 3 mantenga en todo momento un agente para notificaciones en Ontario: una persona de 18 años o más residente en Ontario, o una sociedad con su sede o domicilio social en Ontario. Los documentos legales notificados al agente se consideran notificados a la sociedad.",
    },
    {
      type: "paragraph",
      text: "Según el artículo 21, una sociedad de clase 3 que no tiene licencia cuando se exige, o que no tiene agente para notificaciones, no puede entablar acciones ante un tribunal de Ontario respecto de ningún contrato que haya celebrado. Las infracciones a la Ley también son delitos, con multas de hasta $25,000 para una sociedad y de hasta $2,000 para las personas físicas, incluidos los administradores y directivos que autorizaron o permitieron la infracción.",
    },
    { type: "heading", id: "what-you-need", text: "Información necesaria para registrarse" },
    {
      type: "paragraph",
      text: "El Reglamento 182 de Ontario establece el contenido de la declaración inicial de una sociedad extraprovincial. Reúna estos datos antes de presentarla:",
    },
    {
      type: "list",
      items: [
        "El nombre exacto de la sociedad y su fecha de constitución o fusión, la más reciente.",
        "La jurisdicción donde fue constituida, continuada o fusionada.",
        "La dirección de su sede o domicilio social en su jurisdicción de origen.",
        "La fecha en que comenzó sus actividades en Ontario.",
        "El nombre y la dirección de oficina de su directivo principal o gerente en Ontario, si lo tiene, y la fecha en que asumió el cargo.",
        "La dirección de su oficina principal en Ontario, si la tiene.",
        "Para una sociedad obligada a tener un agente para notificaciones en Ontario, el nombre y la dirección del agente.",
      ],
    },
    { type: "heading", id: "business-names", text: "Operar con otro nombre" },
    p(
      "Una sociedad que realiza actividades en Ontario con un nombre distinto de su denominación social exacta registra ese nombre conforme a la Business Names Act (Ley de Nombres Comerciales). La Corporations Information Act exige presentar primero la declaración inicial, antes de registrar el nombre. El artículo 10 de la Extra-Provincial Corporations Act también limita los nombres que las sociedades de las clases 1 y 3 pueden usar en Ontario. Para saber cómo funciona el registro de nombres, consulte nuestra guía sobre ",
      { text: "cómo registrar un negocio en Ontario", href: "/guides/como-registrar-negocio-ontario" },
      "."
    ),
    { type: "heading", id: "after-registering", text: "Presentaciones después del registro" },
    {
      type: "paragraph",
      text: "El registro no cierra el expediente de Ontario. El artículo 4 de la Corporations Information Act exige un aviso de cambio dentro de los 15 días siguientes a cualquier cambio en la información presentada, como un nuevo directivo principal en Ontario o una nueva dirección de oficina principal. El aviso de cambio no tiene tasa gubernamental.",
    },
    p(
      "La declaración anual de Ontario tiene un alcance más limitado. Según el artículo 6(2) del Reglamento 182, solo la presentan las sociedades de Ontario y las sociedades de clase 3 con licencia. Las sociedades de las clases 1 y 2 no presentan la declaración anual de Ontario, aunque siguen presentando la que exige su jurisdicción de origen, como la declaración anual federal ante Corporations Canada. Nuestra guía sobre ",
      { text: "declaraciones anuales de sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" },
      " explica esas presentaciones."
    ),
    {
      type: "paragraph",
      text: "Según el artículo 18 de la Corporations Information Act, una sociedad que no ha presentado una declaración o un aviso obligatorio no puede mantener un procedimiento ante un tribunal de Ontario relacionado con las actividades que realiza, salvo con autorización del tribunal.",
    },
    { type: "heading", id: "outside-ontario", text: "Sociedades de Ontario que se expanden a otras provincias" },
    p(
      "Las reglas anteriores son las de Ontario. Una sociedad de Ontario que comienza a operar en Quebec, Columbia Británica, Alberta o cualquier otra provincia se registra conforme a la legislación de esa provincia, que fija sus propios formularios, tasas, plazos y requisitos sobre el agente para notificaciones. Para Alberta, consulte nuestra guía sobre el ",
      { text: "registro extraprovincial en Alberta", href: "/guides/registro-extraprovincial-alberta" },
      ". Para comparar la constitución federal y la provincial, consulte nuestra guía sobre ",
      { text: "cómo constituirse en sociedad en Canadá", href: "/guides/como-constituirse-sociedad-canada" },
      "."
    ),
    { type: "heading", id: "getting-it-done", text: "Cómo hacerlo" },
    p(
      "Korporex puede preparar y presentar un ",
      { text: "registro extraprovincial", href: "/services/extra-provincial" },
      " para su sociedad, en Ontario o en otra provincia, a partir de la información que usted proporcione. Para las sociedades de Ontario, la primera presentación equivalente es la ",
      { text: "declaración inicial de Ontario", href: "/guides/declaracion-inicial-ontario" },
      ", que vence dentro de los 60 días siguientes a la constitución."
    ),
    {
      type: "paragraph",
      text: "Korporex no es un despacho de abogados y esta guía es información general, no asesoramiento legal. Para preguntas sobre la situación concreta de su sociedad, incluido si realiza actividades en Ontario, consulte a un abogado o contador.",
    },
  ],
  faq: [
    {
      q: "¿Una sociedad federal debe registrarse en Ontario?",
      a: "Sí, si realiza actividades comerciales en Ontario. Una sociedad federal es una sociedad extraprovincial de clase 2 en Ontario. No necesita licencia, pero debe presentar una declaración inicial dentro de los 60 días siguientes al inicio de sus actividades en la provincia.",
    },
    {
      q: "¿Cuánto cuesta el registro extraprovincial en Ontario?",
      a: "Para las sociedades de otras provincias y las sociedades federales no hay tasa gubernamental: se registran presentando una declaración inicial, que cuesta $0. Una sociedad constituida fuera de Canadá necesita una licencia extraprovincial, con una tasa gubernamental de $330.",
    },
    {
      q: "¿Cuál es el plazo para el registro extraprovincial en Ontario?",
      a: "El artículo 3 de la Corporations Information Act exige la declaración inicial dentro de los 60 días siguientes al inicio de las actividades de la sociedad en Ontario. Una sociedad constituida fuera de Canadá necesita su licencia antes de realizar cualquier actividad en Ontario.",
    },
    {
      q: "¿Una sociedad extraprovincial presenta una declaración anual en Ontario?",
      a: "Solo si es una sociedad de clase 3 con licencia, es decir, constituida fuera de Canadá. Según el Reglamento 182 de Ontario, las sociedades de las clases 1 y 2 están exentas de la declaración anual de Ontario, aunque informan los cambios mediante un aviso de cambio dentro de los 15 días.",
    },
    {
      q: "¿Una sociedad de otra provincia necesita un agente para notificaciones en Ontario?",
      a: "El artículo 19 de la Extra-Provincial Corporations Act exige un agente para notificaciones en Ontario a las sociedades de clase 3, constituidas fuera de Canadá. No impone ese requisito a las sociedades de las clases 1 y 2.",
    },
  ],
};

export const extraProvincialOntario: Article[] = [en, fr, es];
