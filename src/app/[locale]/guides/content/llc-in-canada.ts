import type { ArticleInline, ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

// Builds a paragraph whose plain `text` is always the exact concatenation of
// its parts, so linked and unlinked renderings never drift apart.
function p(...parts: ArticleInline[]): ArticleSection {
  const text = parts.map((x) => (typeof x === "string" ? x : x.text)).join("");
  return parts.some((x) => typeof x !== "string") ? { type: "paragraph", text, parts } : { type: "paragraph", text };
}

function L(text: string, href: string): ArticleInline {
  return { text, href };
}

export const expanded: Record<"en" | "fr" | "es", ExpandedArticle> = {
  // ── English ──
  en: {
    readTime: "8 min read",
    content: [
      p("There is no LLC in Canada. The limited liability company is a creature of United States state law, and no Canadian statute, federal or provincial, creates a business entity by that name. Anyone searching for how to form an LLC in Canada is usually looking for one of two things: protection from the debts of the business, or a simple structure for running it. Canada offers both, through different forms: the corporation, the partnership in its general, limited and limited liability versions, and the sole proprietorship."),
      p("This guide explains what an LLC is, why it has no direct Canadian counterpart, how the Canadian structures compare feature by feature, and what the Canada Revenue Agency (CRA) has said about how a US LLC is classified for Canadian tax purposes."),
      { type: "heading", id: "what-is-an-llc", text: "What an LLC is, and why there is no LLC in Canada" },
      p("In the United States, an LLC is formed under the law of a particular state. It combines two features that Canadian law keeps in separate structures: its owners (called members) are generally not personally liable for the company's debts, and for US federal tax purposes it can often be treated as a pass-through entity, so that profits are taxed in the members' hands rather than at the company level."),
      p("Canadian business law never adopted that hybrid. Limited liability for business owners comes mainly from incorporation, under the Canada Business Corporations Act or a provincial statute such as Ontario's Business Corporations Act. Flow-through taxation comes mainly from partnerships, which are not taxed as separate entities. A Canadian business can have one feature or the other through a single structure, but no single Canadian form is designed to deliver both the way a US LLC does."),
      p("So when a Canadian bank, client or software platform refers to an LLC, it is either speaking loosely about a corporation or referring to the US entity itself."),
      { type: "heading", id: "canadian-equivalents", text: "The Canadian equivalents of an LLC" },
      p("Each Canadian structure answers part of what an LLC offers. The CRA describes the basic forms as follows."),
      {
        type: "list",
        items: [
          "Corporation: the CRA describes a corporation as a separate legal entity that can enter into contracts and own property in its own name, separately and distinctly from its owners. Shareholders have limited liability, which means they are not responsible for the corporation's debts.",
          "Sole proprietorship: an unincorporated business owned by one individual, which the CRA calls the simplest kind of business structure. The owner assumes all the risks of the business, and those risks extend to personal property and assets.",
          "Partnership: an association or relationship between two or more individuals, corporations, trusts or partnerships that join together to carry on a trade or business. The CRA notes that a simple verbal agreement is enough to form one.",
          "Limited partnership: a partnership with at least one general partner, who is liable for the debts of the firm, and one or more limited partners, whose liability is generally limited to what they contribute or agree to contribute.",
          "Limited liability partnership (LLP): in Ontario, a form available only to professionals whose governing legislation allows them to practise through an LLP, such as lawyers and accountants.",
        ],
      },
      p("For a business owner who wants what an LLC is best known for, a liability shield around the business, the Canadian structure that provides it is the corporation."),
      { type: "heading", id: "comparison", text: "LLC vs Canadian business structures: a comparison" },
      p("The table below compares the main features of a US LLC with the Canadian structures that come closest. It is a general overview; the details depend on the governing statute and on the facts of each business."),
      {
        type: "table",
        head: ["Feature", "US LLC", "Canadian corporation", "Partnership (general)", "Limited partnership", "Sole proprietorship"],
        rows: [
          ["Available in Canada", "No", "Yes, federally or provincially", "Yes", "Yes", "Yes"],
          ["Separate legal entity", "Yes, under US state law", "Yes", "No", "No", "No"],
          ["Owners' liability for business debts", "Generally limited", "Shareholders generally not liable", "Partners liable", "General partner liable; limited partners generally limited to their contribution", "Owner fully liable, including personal assets"],
          ["How profits are taxed in Canada", "CRA position: classified as a corporation (see below)", "Corporation files its own T2 return", "No partnership return of income; each partner reports a share", "Each partner reports a share", "Owner reports net business income on a personal T1 return"],
          ["Formation", "Filed with a US state", "Articles of incorporation filed federally or provincially", "Can be formed by agreement, including a verbal one", "Registered under provincial limited partnership legislation", "No filing needed if operating under the owner's own name"],
        ],
      },
      { type: "heading", id: "corporation", text: "The corporation: the closest Canadian match" },
      p("A Canadian corporation can be formed federally, under the Canada Business Corporations Act, or under the corporate statute of a province or territory. The ", L("guide to federal vs provincial incorporation", "/guides/federal-vs-provincial-incorporation"), " sets out how the two routes differ, including name protection and where the corporation can operate under its name."),
      p("Unlike an LLC, a corporation is taxed as its own taxpayer. The CRA states that a corporation has to file a T2 Corporation Income Tax Return no later than six months after the end of every tax year, even if it does not owe tax. Owners are paid through salary, dividends or both, and those amounts are then taxed in their own hands. The rates that apply to corporate income are covered in the ", L("guide to the corporate tax rate in Canada", "/guides/corporate-tax-rate-canada"), "."),
      p("Some owners add a second corporation to hold investments or shares of an operating company. The ", L("holding company guide", "/guides/holding-company-canada"), " explains how that structure works."),
      { type: "heading", id: "ccpc", text: "Canadian-controlled private corporations (CCPCs)" },
      p("Many small Canadian corporations are Canadian-controlled private corporations, or CCPCs, a tax category that affects how certain calculations on the corporation's return are made. According to the CRA, a corporation is a CCPC if, at the end of the tax year, it meets all of the following conditions, among others:"),
      {
        type: "list",
        items: [
          "It is a private corporation.",
          "It was resident in Canada and was either incorporated in Canada or resident in Canada from June 18, 1971, to the end of the tax year.",
          "It is not controlled directly or indirectly by one or more non-resident persons.",
          "It is not controlled directly or indirectly by one or more public corporations, subject to limited exceptions.",
          "No class of its shares is listed on a designated stock exchange.",
        ],
      },
      p("The CRA's full definition also includes rules about control by combinations of these persons. Whether a particular corporation qualifies depends on who controls it, which is one reason the ownership of a new corporation is worth setting out clearly at the start."),
      { type: "heading", id: "partnerships", text: "Partnerships, limited partnerships and LLPs" },
      p("A partnership is the Canadian structure whose tax treatment most resembles a pass-through. The CRA explains that a partnership does not file an income tax return of its own; instead, each partner includes a share of the partnership income or loss on a personal, corporate or trust return. Some partnerships must also file an information return (Form T5013) when they meet certain thresholds."),
      p("What a general partnership does not provide is limited liability: the partners remain responsible for the debts of the business. A limited partnership changes that only for its limited partners, and it still needs at least one general partner whose liability is not limited."),
      p("The LLP is narrower still. In Ontario, it is restricted to professions whose governing legislation permits practice through an LLP, and its name must include \"limited liability partnership\", \"LLP\" or a permitted equivalent such as \"s.r.l.\". Professionals who want to practise through a corporation instead can, where their governing body allows it, use a ", L("professional corporation", "/guides/professional-corporations-canada"), ", which is an ordinary corporation with additional conditions set by statute and by the profession."),
      { type: "heading", id: "us-llc-canada-tax", text: "How the CRA classifies a US LLC" },
      p("Some Canadians consider forming a US LLC instead, often because of US clients or a US platform. The CRA has addressed how such an entity is classified. In Income Tax Technical News No. 38 (September 2008), the CRA stated that it had considered the characteristics of US LLCs, among other foreign entities, and concluded that they are corporations for Canadian tax purposes. That publication is now archived, but it is the CRA's published statement on the point."),
      p("The practical consequence is a mismatch: an entity that may be treated as a pass-through in the United States can be treated as a corporation in Canada. How that plays out depends on residence, the Canada-United States tax treaty and the facts of each case. Cross-border structures involve both countries' rules and are a matter for a qualified accountant or lawyer familiar with both systems."),
      { type: "heading", id: "choosing", text: "Matching the goal to a Canadian structure" },
      {
        type: "table",
        head: ["What the LLC was meant to provide", "Canadian structure that provides it"],
        rows: [
          ["Limited liability and a separate legal entity", "A corporation, federal or provincial"],
          ["A simple, low-cost setup for one owner", "A sole proprietorship, without limited liability"],
          ["Two or more owners sharing profits directly", "A general partnership, without limited liability"],
          ["Passive investors with capped liability", "A limited partnership, with at least one general partner"],
          ["Liability protection for multiple owners", "A corporation with more than one shareholder"],
        ],
      },
      p("For those comparing the two most common options for a single owner, the ", L("sole proprietorship vs corporation guide", "/guides/sole-proprietorship-vs-corporation"), " covers liability, tax and cost side by side."),
      { type: "heading", id: "korporex", text: "Forming a Canadian corporation" },
      p("When the goal behind the LLC search is limited liability, a Canadian corporation is the form that provides it. You can ", L("incorporate with Korporex", "/incorporate"), " federally or in Ontario online, with the articles, share structure and minute book prepared together. Korporex is a document-preparation service, not a law firm or an accounting firm."),
    ],
    faq: [
      {
        q: "Can I form an LLC in Canada?",
        a: "No. The limited liability company is a US form created under state law, and no Canadian federal or provincial statute provides for it. In Canada, limited liability for business owners comes mainly from incorporating a corporation.",
      },
      {
        q: "What is the Canadian equivalent of an LLC?",
        a: "For limited liability, the closest equivalent is a corporation, formed federally or provincially. For flow-through taxation, the closest equivalent is a partnership, but a general partnership does not limit the partners' liability. No single Canadian form combines both features the way a US LLC does.",
      },
      {
        q: "How does the CRA treat a US LLC?",
        a: "In Income Tax Technical News No. 38 (2008, now archived), the CRA stated that US LLCs are corporations for Canadian tax purposes. The consequences in a particular case depend on residence, the Canada-United States tax treaty and the facts, which is a question for a qualified cross-border accountant or lawyer.",
      },
      {
        q: "Is an LLP the same as an LLC?",
        a: "No. An LLP is a limited liability partnership. In Ontario it is available only to professionals whose governing legislation permits it, and it remains a partnership rather than a corporation.",
      },
      {
        q: "What is a CCPC?",
        a: "A Canadian-controlled private corporation is a tax category defined by the CRA. In general terms, it is a private corporation resident in Canada that is not controlled by non-residents or public corporations and has no shares listed on a designated stock exchange. Many small Canadian corporations fall into this category.",
      },
    ],
  },

  // ── Français ──
  fr: {
    readTime: "9 min de lecture",
    content: [
      p("La LLC (limited liability company) n'existe pas au Canada. Il s'agit d'une forme d'entreprise créée par le droit des États américains, et aucune loi canadienne, fédérale ou provinciale, ne prévoit une entité portant ce nom. Une personne qui cherche à former une LLC au Canada veut habituellement l'une de deux choses : se protéger des dettes de l'entreprise, ou exploiter son entreprise au moyen d'une structure simple. Le Canada offre les deux, par d'autres formes : la société par actions, la société de personnes (en nom collectif, en commandite ou à responsabilité limitée) et l'entreprise individuelle."),
      p("Ce guide explique ce qu'est une LLC, pourquoi elle n'a pas d'équivalent direct au Canada, comment les structures canadiennes se comparent, et ce que l'Agence du revenu du Canada (ARC) a publié sur la façon de classer une LLC américaine aux fins de l'impôt canadien."),
      { type: "heading", id: "what-is-an-llc", text: "Ce qu'est une LLC, et pourquoi la LLC n'existe pas au Canada" },
      p("Aux États-Unis, une LLC est constituée sous le régime du droit d'un État. Elle réunit deux caractéristiques que le droit canadien attribue à des structures distinctes : ses propriétaires (appelés membres) ne sont généralement pas personnellement responsables des dettes de l'entreprise et, aux fins de l'impôt fédéral américain, elle peut souvent être traitée comme une entité transparente, de sorte que les bénéfices sont imposés entre les mains des membres plutôt qu'au niveau de l'entreprise. En Europe, la forme comparable est souvent appelée SRL ou SARL, mais elle n'existe pas non plus en droit canadien."),
      p("Le droit canadien des affaires n'a jamais adopté ce modèle hybride. La responsabilité limitée des propriétaires découle principalement de la constitution en société par actions, sous le régime de la Loi canadienne sur les sociétés par actions ou d'une loi provinciale comme la Loi sur les sociétés par actions de l'Ontario. La transparence fiscale découle principalement des sociétés de personnes, qui ne sont pas imposées comme des entités distinctes. Une entreprise canadienne peut obtenir l'une ou l'autre caractéristique au moyen d'une seule structure, mais aucune forme canadienne n'est conçue pour offrir les deux comme le fait une LLC américaine."),
      p("Ainsi, lorsqu'une banque, un client ou une plateforme logicielle au Canada parle de LLC, il s'agit soit d'une façon approximative de désigner une société par actions, soit de l'entité américaine elle-même."),
      { type: "heading", id: "canadian-equivalents", text: "Les équivalents canadiens de la LLC" },
      p("Chaque structure canadienne répond à une partie de ce qu'offre une LLC. L'ARC décrit les formes de base comme suit."),
      {
        type: "list",
        items: [
          "Société par actions : l'ARC la décrit comme une entité juridique distincte qui peut conclure des contrats et posséder des biens en son propre nom, de façon séparée et distincte de ses propriétaires. Les actionnaires bénéficient d'une responsabilité limitée, c'est-à-dire qu'ils ne sont pas responsables des dettes de la société.",
          "Entreprise individuelle : une entreprise non constituée en société qui appartient à une seule personne, que l'ARC qualifie de structure d'entreprise la plus simple. Le propriétaire assume tous les risques de l'entreprise, et ces risques s'étendent à ses biens personnels.",
          "Société de personnes : une association ou une relation entre deux ou plusieurs particuliers, sociétés, fiducies ou sociétés de personnes qui s'unissent pour exploiter une entreprise. L'ARC précise qu'une simple entente verbale suffit pour en former une.",
          "Société en commandite : une société de personnes comptant au moins un commandité, responsable des dettes de la société, et un ou plusieurs commanditaires, dont la responsabilité est généralement limitée à leur apport ou à l'apport qu'ils se sont engagés à faire.",
          "Société à responsabilité limitée (s.r.l. ou LLP) : en Ontario, une forme offerte seulement aux professionnels dont la loi qui régit la profession permet l'exercice au sein d'une telle société, comme les avocats et les comptables.",
        ],
      },
      p("Pour la personne qui recherche ce qui fait la réputation de la LLC, soit un bouclier entre l'entreprise et ses biens personnels, la structure canadienne qui l'offre est la société par actions."),
      { type: "heading", id: "comparison", text: "LLC et structures canadiennes : tableau comparatif" },
      p("Le tableau ci-dessous compare les principales caractéristiques d'une LLC américaine avec celles des structures canadiennes les plus proches. Il s'agit d'un aperçu général; les détails dépendent de la loi applicable et des faits propres à chaque entreprise."),
      {
        type: "table",
        head: ["Caractéristique", "LLC américaine", "Société par actions canadienne", "Société en nom collectif", "Société en commandite", "Entreprise individuelle"],
        rows: [
          ["Offerte au Canada", "Non", "Oui, au fédéral ou au provincial", "Oui", "Oui", "Oui"],
          ["Entité juridique distincte", "Oui, selon le droit de l'État américain", "Oui", "Non", "Non", "Non"],
          ["Responsabilité des propriétaires pour les dettes", "Généralement limitée", "Les actionnaires ne sont généralement pas responsables", "Les associés sont responsables", "Commandité responsable; commanditaires généralement limités à leur apport", "Propriétaire entièrement responsable, y compris sur ses biens personnels"],
          ["Imposition des bénéfices au Canada", "Position de l'ARC : classée comme société (voir plus bas)", "La société produit sa propre déclaration T2", "Aucune déclaration de revenus de la société de personnes; chaque associé déclare sa part", "Chaque associé déclare sa part", "Le propriétaire déclare le revenu net d'entreprise dans sa déclaration T1"],
          ["Formation", "Dépôt auprès d'un État américain", "Statuts constitutifs déposés au fédéral ou au provincial", "Peut être formée par entente, même verbale", "Enregistrée selon la loi provinciale sur les sociétés en commandite", "Aucun dépôt si l'entreprise utilise le nom du propriétaire"],
        ],
      },
      { type: "heading", id: "corporation", text: "La société par actions : l'équivalent canadien le plus proche" },
      p("Une société par actions canadienne peut être constituée au fédéral, sous le régime de la Loi canadienne sur les sociétés par actions, ou sous le régime de la loi d'une province ou d'un territoire. Le guide ", L("comment constituer une entreprise au Canada", "/guides/comment-constituer-une-entreprise-au-canada"), " présente les étapes et les différences entre les deux voies."),
      p("Contrairement à une LLC, la société par actions est imposée comme un contribuable distinct. L'ARC précise qu'une société doit produire une déclaration de revenus des sociétés T2 au plus tard six mois après la fin de chaque année d'imposition, même si elle n'a pas d'impôt à payer. Les propriétaires sont rémunérés par salaire, par dividendes ou par une combinaison des deux, et ces montants sont ensuite imposés entre leurs mains. Les taux applicables au revenu des sociétés sont expliqués dans le guide sur le ", L("taux d'imposition des sociétés au Canada", "/guides/taux-imposition-societes-canada"), "."),
      p("Certains propriétaires ajoutent une deuxième société pour détenir des placements ou les actions d'une société d'exploitation. Le guide sur la ", L("société de portefeuille", "/guides/societe-de-portefeuille-canada"), " explique le fonctionnement de cette structure."),
      { type: "heading", id: "ccpc", text: "La société privée sous contrôle canadien (SPCC)" },
      p("Beaucoup de petites sociétés canadiennes sont des sociétés privées sous contrôle canadien, ou SPCC, une catégorie fiscale qui influe sur certains calculs de la déclaration de la société. Selon l'ARC, une société est une SPCC si, à la fin de l'année d'imposition, elle remplit notamment toutes les conditions suivantes :"),
      {
        type: "list",
        items: [
          "Elle est une société privée.",
          "Elle résidait au Canada et a été constituée au Canada, ou elle a résidé au Canada du 18 juin 1971 jusqu'à la fin de l'année d'imposition.",
          "Elle n'est pas contrôlée, directement ou indirectement, par une ou plusieurs personnes non-résidentes.",
          "Elle n'est pas contrôlée, directement ou indirectement, par une ou plusieurs sociétés publiques, sous réserve d'exceptions limitées.",
          "Aucune catégorie de ses actions n'est cotée à une bourse de valeurs désignée.",
        ],
      },
      p("La définition complète de l'ARC comprend aussi des règles sur le contrôle exercé par une combinaison de ces personnes. L'admissibilité d'une société dépend de qui la contrôle, d'où l'intérêt de bien établir l'actionnariat d'une nouvelle société dès le départ."),
      { type: "heading", id: "partnerships", text: "Sociétés de personnes, sociétés en commandite et s.r.l." },
      p("La société de personnes est la structure canadienne dont le traitement fiscal ressemble le plus à la transparence fiscale. L'ARC explique qu'une société de personnes ne produit pas de déclaration de revenus; chaque associé inclut plutôt sa part du revenu ou de la perte dans sa déclaration de particulier, de société ou de fiducie. Certaines sociétés de personnes doivent aussi produire une déclaration de renseignements (formulaire T5013) lorsqu'elles atteignent certains seuils."),
      p("La société en nom collectif n'offre toutefois pas de responsabilité limitée : les associés demeurent responsables des dettes de l'entreprise. La société en commandite ne change cela que pour les commanditaires, et elle doit compter au moins un commandité dont la responsabilité n'est pas limitée."),
      p("La société à responsabilité limitée de l'Ontario est encore plus restreinte. Elle est réservée aux professions dont la loi habilitante permet l'exercice en s.r.l., et sa dénomination doit comprendre « société à responsabilité limitée », « s.r.l. » ou un équivalent permis comme « LLP ». Les professionnels qui préfèrent exercer au sein d'une société par actions peuvent, lorsque leur ordre professionnel le permet, recourir à une ", L("société professionnelle", "/guides/societe-professionnelle-canada"), ", soit une société par actions ordinaire assortie de conditions additionnelles prévues par la loi et par la profession."),
      { type: "heading", id: "us-llc-canada-tax", text: "Comment l'ARC classe une LLC américaine" },
      p("Certains Canadiens envisagent plutôt de former une LLC aux États-Unis, souvent en raison de clients américains ou d'une plateforme américaine. L'ARC s'est prononcée sur le classement d'une telle entité. Dans les Nouvelles techniques de l'impôt no 38 (septembre 2008), l'ARC a indiqué avoir examiné les caractéristiques des LLC américaines, entre autres entités étrangères, et a conclu qu'il s'agit de sociétés aux fins de l'impôt canadien. Cette publication est maintenant archivée, mais elle constitue l'énoncé publié de l'ARC sur la question."),
      p("La conséquence pratique est un décalage : une entité qui peut être traitée comme transparente aux États-Unis peut être traitée comme une société au Canada. Les effets dépendent de la résidence, de la convention fiscale entre le Canada et les États-Unis et des faits de chaque situation. Les structures transfrontalières font intervenir les règles des deux pays et relèvent d'un comptable ou d'un avocat qualifié qui connaît les deux régimes."),
      { type: "heading", id: "choosing", text: "Associer l'objectif à une structure canadienne" },
      {
        type: "table",
        head: ["Ce que la LLC devait offrir", "Structure canadienne qui l'offre"],
        rows: [
          ["Responsabilité limitée et entité juridique distincte", "Une société par actions, fédérale ou provinciale"],
          ["Une structure simple et peu coûteuse pour un seul propriétaire", "Une entreprise individuelle, sans responsabilité limitée"],
          ["Deux propriétaires ou plus qui se partagent directement les bénéfices", "Une société en nom collectif, sans responsabilité limitée"],
          ["Des investisseurs passifs à responsabilité plafonnée", "Une société en commandite, avec au moins un commandité"],
          ["Une protection de la responsabilité pour plusieurs propriétaires", "Une société par actions comptant plus d'un actionnaire"],
        ],
      },
      p("Pour comparer les deux options les plus courantes pour un seul propriétaire, le guide ", L("entreprise individuelle ou société", "/guides/entreprise-individuelle-ou-societe"), " présente côte à côte la responsabilité, l'impôt et les coûts."),
      { type: "heading", id: "korporex", text: "Constituer une société par actions canadienne" },
      p("Lorsque la recherche d'une LLC vise d'abord la responsabilité limitée, la société par actions canadienne est la forme qui l'offre. Vous pouvez ", L("vous constituer en société avec Korporex", "/incorporate"), " au fédéral ou en Ontario, en ligne, avec les statuts, la structure du capital-actions et le livre des procès-verbaux préparés ensemble. Korporex est un service de préparation de documents, et non un cabinet d'avocats ou de comptables."),
    ],
    faq: [
      {
        q: "Peut-on former une LLC au Canada?",
        a: "Non. La limited liability company est une forme américaine créée par le droit des États, et aucune loi canadienne, fédérale ou provinciale, ne la prévoit. Au Canada, la responsabilité limitée des propriétaires d'entreprise découle principalement de la constitution d'une société par actions.",
      },
      {
        q: "Quel est l'équivalent canadien d'une LLC?",
        a: "Pour la responsabilité limitée, l'équivalent le plus proche est la société par actions, constituée au fédéral ou au provincial. Pour la transparence fiscale, l'équivalent le plus proche est la société de personnes, mais la société en nom collectif ne limite pas la responsabilité des associés. Aucune forme canadienne ne réunit les deux caractéristiques comme le fait une LLC américaine.",
      },
      {
        q: "Comment l'ARC traite-t-elle une LLC américaine?",
        a: "Dans les Nouvelles techniques de l'impôt no 38 (2008, maintenant archivées), l'ARC a indiqué que les LLC américaines sont des sociétés aux fins de l'impôt canadien. Les conséquences dans un cas donné dépendent de la résidence, de la convention fiscale entre le Canada et les États-Unis et des faits, une question qui relève d'un comptable ou d'un avocat qualifié en matière transfrontalière.",
      },
      {
        q: "Une s.r.l. (LLP) est-elle la même chose qu'une LLC?",
        a: "Non. En Ontario, la société à responsabilité limitée (LLP) est une société de personnes offerte seulement aux professionnels dont la loi habilitante le permet. Elle demeure une société de personnes et non une société par actions.",
      },
      {
        q: "Qu'est-ce qu'une SPCC?",
        a: "La société privée sous contrôle canadien est une catégorie fiscale définie par l'ARC. De façon générale, il s'agit d'une société privée résidant au Canada qui n'est pas contrôlée par des non-résidents ou des sociétés publiques et dont aucune action n'est cotée à une bourse de valeurs désignée. Beaucoup de petites sociétés canadiennes en font partie.",
      },
    ],
  },

  // ── Español ──
  es: {
    readTime: "9 min de lectura",
    content: [
      p("La LLC (limited liability company) no existe en Canadá. Es una forma de empresa creada por la ley de los estados de Estados Unidos, y ninguna ley canadiense, federal ni provincial, prevé una entidad con ese nombre. Quien busca cómo formar una LLC en Canadá suele querer una de dos cosas: protegerse de las deudas del negocio o contar con una estructura sencilla para operarlo. Canadá ofrece ambas cosas mediante otras formas: la sociedad (corporation), la sociedad de personas en sus versiones general, comanditaria y de responsabilidad limitada, y la empresa unipersonal."),
      p("Esta guía explica qué es una LLC, por qué no tiene un equivalente directo en Canadá, cómo se comparan las estructuras canadienses y qué ha publicado la Agencia de Ingresos de Canadá (CRA) sobre cómo se clasifica una LLC estadounidense a efectos fiscales canadienses."),
      { type: "heading", id: "what-is-an-llc", text: "Qué es una LLC y por qué no existe la LLC en Canadá" },
      p("En Estados Unidos, una LLC se forma bajo la ley de un estado en particular. Combina dos características que el derecho canadiense reparte entre estructuras distintas: sus propietarios (llamados miembros) generalmente no son responsables personalmente de las deudas de la empresa y, a efectos del impuesto federal estadounidense, a menudo puede tratarse como una entidad transparente, de modo que las ganancias se gravan en manos de los miembros y no a nivel de la empresa."),
      p("El derecho empresarial canadiense nunca adoptó ese modelo híbrido. La responsabilidad limitada de los propietarios proviene principalmente de la constitución de una sociedad, bajo la Ley de Sociedades Comerciales de Canadá (Canada Business Corporations Act) o una ley provincial como la Business Corporations Act de Ontario. La transparencia fiscal proviene principalmente de las sociedades de personas, que no tributan como entidades separadas. Un negocio canadiense puede obtener una u otra característica con una sola estructura, pero ninguna forma canadiense está diseñada para ofrecer ambas como lo hace una LLC estadounidense."),
      p("Por eso, cuando un banco, un cliente o una plataforma de software en Canadá habla de una LLC, o se refiere de manera imprecisa a una sociedad, o se refiere a la entidad estadounidense en sí."),
      { type: "heading", id: "canadian-equivalents", text: "Los equivalentes canadienses de la LLC" },
      p("Cada estructura canadiense cubre una parte de lo que ofrece una LLC. La CRA describe las formas básicas de la siguiente manera."),
      {
        type: "list",
        items: [
          "Sociedad: la CRA la describe como una entidad jurídica separada que puede celebrar contratos y poseer bienes a su propio nombre, de forma separada y distinta de sus propietarios. Los accionistas tienen responsabilidad limitada, es decir, no son responsables de las deudas de la sociedad.",
          "Empresa unipersonal: un negocio no constituido en sociedad que pertenece a una sola persona, al que la CRA llama la estructura empresarial más sencilla. El propietario asume todos los riesgos del negocio, y esos riesgos se extienden a sus bienes personales.",
          "Sociedad de personas (partnership): una asociación o relación entre dos o más personas físicas, sociedades, fideicomisos u otras sociedades de personas que se unen para llevar a cabo un negocio. La CRA señala que basta un simple acuerdo verbal para formarla.",
          "Sociedad comanditaria (limited partnership): una sociedad de personas con al menos un socio general, responsable de las deudas de la firma, y uno o más socios comanditarios, cuya responsabilidad generalmente se limita a lo que aportan o se comprometen a aportar.",
          "Sociedad de responsabilidad limitada (LLP): en Ontario, una forma disponible solo para profesionales cuya legislación profesional les permite ejercer mediante una LLP, como abogados y contadores.",
        ],
      },
      p("Para quien busca aquello por lo que la LLC es más conocida, una protección entre el negocio y los bienes personales, la estructura canadiense que la ofrece es la sociedad."),
      { type: "heading", id: "comparison", text: "LLC frente a las estructuras canadienses: comparación" },
      p("La tabla siguiente compara las principales características de una LLC estadounidense con las estructuras canadienses más cercanas. Es un panorama general; los detalles dependen de la ley aplicable y de los hechos de cada negocio."),
      {
        type: "table",
        head: ["Característica", "LLC estadounidense", "Sociedad canadiense", "Sociedad de personas general", "Sociedad comanditaria", "Empresa unipersonal"],
        rows: [
          ["Disponible en Canadá", "No", "Sí, a nivel federal o provincial", "Sí", "Sí", "Sí"],
          ["Entidad jurídica separada", "Sí, según la ley estatal de EE. UU.", "Sí", "No", "No", "No"],
          ["Responsabilidad de los propietarios por las deudas", "Generalmente limitada", "Los accionistas generalmente no son responsables", "Los socios son responsables", "Socio general responsable; comanditarios generalmente limitados a su aporte", "Propietario plenamente responsable, incluidos sus bienes personales"],
          ["Tributación de las ganancias en Canadá", "Posición de la CRA: se clasifica como sociedad (ver más abajo)", "La sociedad presenta su propia declaración T2", "La sociedad de personas no presenta declaración de impuestos; cada socio declara su parte", "Cada socio declara su parte", "El propietario declara el ingreso neto del negocio en su declaración personal T1"],
          ["Formación", "Presentación ante un estado de EE. UU.", "Estatutos de constitución presentados a nivel federal o provincial", "Puede formarse por acuerdo, incluso verbal", "Se registra según la ley provincial de sociedades comanditarias", "No requiere presentación si opera con el nombre del propietario"],
        ],
      },
      { type: "heading", id: "corporation", text: "La sociedad: el equivalente canadiense más cercano" },
      p("Una sociedad canadiense puede constituirse a nivel federal, bajo la Canada Business Corporations Act, o bajo la ley de sociedades de una provincia o territorio. La guía ", L("cómo constituir una empresa en Canadá", "/guides/como-constituir-una-empresa-en-canada"), " explica los pasos y las diferencias entre ambas vías."),
      p("A diferencia de una LLC, la sociedad tributa como contribuyente propio. La CRA indica que una sociedad debe presentar una declaración de impuestos de sociedades T2 a más tardar seis meses después del cierre de cada ejercicio fiscal, aunque no adeude impuestos. Los propietarios reciben sueldo, dividendos o ambos, y esos montos se gravan luego en sus propias manos. Las tasas que se aplican a los ingresos de la sociedad se explican en la guía sobre la ", L("tasa del impuesto de sociedades en Canadá", "/guides/tasa-impuesto-sociedades-canada"), "."),
      p("Algunos propietarios añaden una segunda sociedad para mantener inversiones o las acciones de una sociedad operativa. La guía sobre la ", L("sociedad de cartera", "/guides/sociedad-de-cartera-canada"), " explica cómo funciona esa estructura."),
      { type: "heading", id: "ccpc", text: "La sociedad privada bajo control canadiense (CCPC)" },
      p("Muchas pequeñas sociedades canadienses son sociedades privadas bajo control canadiense (Canadian-controlled private corporations, o CCPC), una categoría fiscal que influye en ciertos cálculos de la declaración de la sociedad. Según la CRA, una sociedad es una CCPC si, al cierre del ejercicio fiscal, cumple, entre otras, todas las condiciones siguientes:"),
      {
        type: "list",
        items: [
          "Es una sociedad privada.",
          "Era residente en Canadá y fue constituida en Canadá, o fue residente en Canadá desde el 18 de junio de 1971 hasta el cierre del ejercicio fiscal.",
          "No está controlada, directa ni indirectamente, por una o más personas no residentes.",
          "No está controlada, directa ni indirectamente, por una o más sociedades públicas, salvo excepciones limitadas.",
          "Ninguna clase de sus acciones cotiza en una bolsa de valores designada.",
        ],
      },
      p("La definición completa de la CRA también incluye reglas sobre el control ejercido por combinaciones de estas personas. Que una sociedad califique o no depende de quién la controla, por lo que conviene dejar clara la titularidad de una nueva sociedad desde el inicio."),
      { type: "heading", id: "partnerships", text: "Sociedades de personas, sociedades comanditarias y LLP" },
      p("La sociedad de personas es la estructura canadiense cuyo tratamiento fiscal más se parece a la transparencia fiscal. La CRA explica que una sociedad de personas no presenta su propia declaración de impuestos; en cambio, cada socio incluye su parte del ingreso o la pérdida en su declaración personal, de sociedad o de fideicomiso. Algunas sociedades de personas también deben presentar una declaración informativa (formulario T5013) cuando alcanzan ciertos umbrales."),
      p("Lo que una sociedad de personas general no ofrece es responsabilidad limitada: los socios siguen siendo responsables de las deudas del negocio. Una sociedad comanditaria cambia esto solo para los socios comanditarios, y sigue necesitando al menos un socio general cuya responsabilidad no está limitada."),
      p("La LLP es aún más restringida. En Ontario, está reservada a las profesiones cuya legislación permite ejercer mediante una LLP, y su nombre debe incluir \"limited liability partnership\", \"LLP\" o un equivalente permitido como \"s.r.l.\". Los profesionales que prefieren ejercer mediante una sociedad pueden, cuando su colegio profesional lo permite, usar una ", L("sociedad profesional", "/guides/sociedad-profesional-canada"), ", que es una sociedad ordinaria con condiciones adicionales fijadas por la ley y por la profesión."),
      { type: "heading", id: "us-llc-canada-tax", text: "Cómo clasifica la CRA una LLC estadounidense" },
      p("Algunos canadienses consideran formar una LLC en Estados Unidos, a menudo por tener clientes estadounidenses o por sugerencia de una plataforma estadounidense. La CRA se ha pronunciado sobre cómo se clasifica esa entidad. En el boletín Income Tax Technical News No. 38 (septiembre de 2008), la CRA indicó que había examinado las características de las LLC estadounidenses, entre otras entidades extranjeras, y concluyó que son sociedades a efectos fiscales canadienses. Esa publicación está archivada, pero es la declaración publicada de la CRA sobre el tema."),
      p("La consecuencia práctica es un desajuste: una entidad que puede tratarse como transparente en Estados Unidos puede tratarse como sociedad en Canadá. Los efectos dependen de la residencia, del convenio fiscal entre Canadá y Estados Unidos y de los hechos de cada caso. Las estructuras transfronterizas involucran las normas de ambos países y son un asunto para un contador o abogado calificado que conozca los dos sistemas."),
      { type: "heading", id: "choosing", text: "Cómo asociar el objetivo con una estructura canadiense" },
      {
        type: "table",
        head: ["Lo que la LLC debía ofrecer", "Estructura canadiense que lo ofrece"],
        rows: [
          ["Responsabilidad limitada y entidad jurídica separada", "Una sociedad, federal o provincial"],
          ["Una estructura sencilla y económica para un solo propietario", "Una empresa unipersonal, sin responsabilidad limitada"],
          ["Dos o más propietarios que comparten directamente las ganancias", "Una sociedad de personas general, sin responsabilidad limitada"],
          ["Inversionistas pasivos con responsabilidad limitada", "Una sociedad comanditaria, con al menos un socio general"],
          ["Protección de responsabilidad para varios propietarios", "Una sociedad con más de un accionista"],
        ],
      },
      p("Para comparar las dos opciones más comunes para un solo propietario, la guía ", L("empresa unipersonal o sociedad", "/guides/empresa-unipersonal-o-sociedad"), " presenta lado a lado la responsabilidad, los impuestos y los costos."),
      { type: "heading", id: "korporex", text: "Constituir una sociedad canadiense" },
      p("Cuando lo que se busca con una LLC es la responsabilidad limitada, la sociedad canadiense es la forma que la ofrece. Usted puede ", L("constituir su sociedad con Korporex", "/incorporate"), " a nivel federal o en Ontario, en línea, con los estatutos, la estructura de acciones y el libro de actas preparados en conjunto. Korporex es un servicio de preparación de documentos, no un despacho de abogados ni de contadores."),
    ],
    faq: [
      {
        q: "¿Se puede formar una LLC en Canadá?",
        a: "No. La limited liability company es una forma estadounidense creada por la ley estatal, y ninguna ley canadiense, federal ni provincial, la prevé. En Canadá, la responsabilidad limitada de los propietarios de un negocio proviene principalmente de constituir una sociedad.",
      },
      {
        q: "¿Cuál es el equivalente canadiense de una LLC?",
        a: "Para la responsabilidad limitada, el equivalente más cercano es la sociedad, constituida a nivel federal o provincial. Para la transparencia fiscal, el equivalente más cercano es la sociedad de personas, pero la sociedad de personas general no limita la responsabilidad de los socios. Ninguna forma canadiense reúne ambas características como lo hace una LLC estadounidense.",
      },
      {
        q: "¿Cómo trata la CRA una LLC estadounidense?",
        a: "En Income Tax Technical News No. 38 (2008, ahora archivado), la CRA indicó que las LLC estadounidenses son sociedades a efectos fiscales canadienses. Las consecuencias en un caso concreto dependen de la residencia, del convenio fiscal entre Canadá y Estados Unidos y de los hechos, una cuestión para un contador o abogado calificado en asuntos transfronterizos.",
      },
      {
        q: "¿Una LLP es lo mismo que una LLC?",
        a: "No. Una LLP es una sociedad de personas de responsabilidad limitada. En Ontario solo está disponible para profesionales cuya legislación lo permite, y sigue siendo una sociedad de personas, no una sociedad.",
      },
      {
        q: "¿Qué es una CCPC?",
        a: "La sociedad privada bajo control canadiense es una categoría fiscal definida por la CRA. En términos generales, es una sociedad privada residente en Canadá que no está controlada por no residentes ni por sociedades públicas y que no tiene acciones cotizadas en una bolsa de valores designada. Muchas pequeñas sociedades canadienses pertenecen a esta categoría.",
      },
    ],
  },
};
