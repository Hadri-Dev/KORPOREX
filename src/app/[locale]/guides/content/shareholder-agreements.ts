import type { ArticleInline, ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

// Builds a paragraph whose `text` is always the exact concatenation of its parts.
const p = (...parts: ArticleInline[]): ArticleSection => ({
  type: "paragraph",
  text: parts.map((part) => (typeof part === "string" ? part : part.text)).join(""),
  parts,
});

export const expanded: Record<"en" | "fr" | "es", ExpandedArticle> = {
  // ── English ──
  en: {
    readTime: "11 min read",
    content: [
      {
        type: "paragraph",
        text: "A shareholder agreement in Canada is a private written contract among some or all of a corporation's shareholders that sets out how the company will be owned and run, and what happens when an owner wants to leave, dies, becomes disabled or falls out with the others. It sits alongside the corporation's articles and by-laws. Canadian corporate statutes recognize two kinds: an ordinary shareholder agreement, which is simply a contract among the shareholders who sign it, and a unanimous shareholder agreement, which is signed by all the shareholders and can legally take powers away from the board of directors (section 146 of the Canada Business Corporations Act (CBCA) and section 108 of Ontario's Business Corporations Act (OBCA)).",
      },
      {
        type: "callout",
        title: "General information only",
        text: "This guide explains how shareholder agreements work under federal and Ontario corporate law. It is not legal advice. A shareholder agreement is drafted for a specific business and its owners, and a lawyer is the right person to prepare or review one.",
      },
      { type: "heading", id: "what-it-is", text: "What a shareholder agreement is" },
      {
        type: "paragraph",
        text: "A shareholder agreement is a contract among the owners of a corporation. It sets out how they will run the company together and, just as importantly, what happens when things change: someone wants out, someone dies, the owners disagree, or a buyer comes knocking. It sits alongside the corporation's articles, but it is a separate, private contract between the shareholders. It is not filed with Corporations Canada or the Ontario Business Registry, and it does not appear on the public record.",
      },
      {
        type: "paragraph",
        text: "When a corporation has more than one shareholder, this is the document that quietly prevents most of the disputes that tear small companies apart. It is easy to skip when everyone is getting along at the start, which is exactly why so many businesses regret not having one. The corporate statute supplies only a general framework: the shareholders elect the directors, the directors manage the business, and certain fundamental changes need a special resolution. A shareholder agreement fills in the specific, practical rules that the owners have agreed between themselves.",
      },
      { type: "heading", id: "ordinary-vs-unanimous", text: "Ordinary vs unanimous shareholder agreements" },
      {
        type: "paragraph",
        text: "Under both the CBCA and the OBCA, the directors manage, or supervise the management of, the business and affairs of the corporation, subject to any unanimous shareholder agreement (CBCA s. 102(1); OBCA s. 115(1)). That phrase, subject to any unanimous shareholder agreement, is what separates the two kinds of agreement.",
      },
      {
        type: "paragraph",
        text: "An ordinary shareholder agreement can be signed by only some of the shareholders. A common example is a voting or pooling agreement, under which two or more shareholders agree in writing to vote their shares in a particular way, for instance to elect each other as directors. Both statutes expressly allow this (CBCA s. 145.1; OBCA s. 108(1)). An ordinary agreement binds the people who sign it as a matter of contract, but it does not change the legal powers of the board.",
      },
      {
        type: "paragraph",
        text: "A unanimous shareholder agreement (often shortened to USA) is a written agreement among all the shareholders, or among all the shareholders and one or more people who are not shareholders, that restricts in whole or in part the powers of the directors to manage or supervise the management of the business and affairs of the corporation (CBCA s. 146(1); OBCA s. 108(2)). Most shareholder agreements for small private corporations with several owners are drafted as unanimous agreements, because that is the form that allows the owners to reserve important decisions for themselves.",
      },
      {
        type: "table",
        head: ["Feature", "Ordinary shareholder agreement", "Unanimous shareholder agreement"],
        rows: [
          ["Who signs", "Two or more shareholders, not necessarily all of them", "All the shareholders (and, if desired, other parties)"],
          ["Statutory basis", "Contract law; voting agreements recognized in CBCA s. 145.1 and OBCA s. 108(1)", "CBCA s. 146 and OBCA s. 108(2) to (10)"],
          ["Can it restrict the directors' powers?", "No", "Yes, in whole or in part"],
          ["Effect on directors' liabilities", "None", "Shifted to the shareholders who take over the restricted powers, to the same extent"],
          ["New shareholders", "Bound only if they sign", "A transferee of shares is deemed to be a party"],
          ["Minute book", "Usually kept with the corporate records as good practice", "A copy must be kept with the corporate records (CBCA s. 20(1); OBCA s. 140(1))"],
        ],
      },
      { type: "heading", id: "unanimous-rules", text: "How a unanimous shareholder agreement works" },
      {
        type: "paragraph",
        text: "Because a unanimous shareholder agreement can take decisions away from the board, the statutes attach specific consequences to it. The most important is the shift of responsibility. Under CBCA s. 146(5), to the extent a USA restricts the directors' powers, the parties who are given that power have all the rights, powers, duties and liabilities of a director, including any defences available to directors, and the directors are relieved of their rights, powers, duties and liabilities, including their liabilities under section 119 (such as unpaid employee wages), to the same extent. OBCA s. 108(5) is to the same effect for a shareholder who is a party to the agreement, and expressly refers to the liabilities under section 131. In other words, shareholders who take control of a decision also take on the legal exposure that comes with it.",
      },
      {
        type: "paragraph",
        text: "This is reflected in the general rule on shareholder liability. Section 45(1) of the CBCA says shareholders are not, as shareholders, liable for the corporation's liabilities, but lists section 146(5) among the exceptions. Owners who use a USA to manage the business directly are therefore stepping into the directors' shoes for those matters.",
      },
      {
        type: "list",
        items: [
          "Sole shareholder declaration. When one person holds all the issued shares, a written declaration by that person restricting the directors' powers is deemed to be a unanimous shareholder agreement (CBCA s. 146(2); OBCA s. 108(3)).",
          "New owners are bound. A purchaser or transferee of shares subject to a USA is deemed to be a party to it (CBCA s. 146(3); OBCA s. 108(4)), and under the OBCA so is a person to whom new shares are issued while a USA is in effect (OBCA s. 108(7)).",
          "Notice on the share certificate. Under CBCA s. 49(8), a unanimous shareholder agreement or a restriction on transfer is not effective against a transferee who has no actual knowledge of it unless it, or a reference to it, is noted conspicuously on the share certificate.",
          "Right to rescind. A federal purchaser who was not given notice may rescind the purchase within 30 days after becoming aware of the agreement (CBCA s. 146(4)). Under the OBCA, a purchaser for value without notice generally has 60 days after actually receiving a complete copy of the agreement (OBCA s. 108(7), (9) and (10)).",
          "Arbitration and amendments. The OBCA expressly allows a USA to set its own amendment procedure and to refer disagreements among the parties to arbitration (OBCA s. 108(6)).",
          "Professional corporations. In Ontario, a unanimous shareholder agreement for a professional corporation is void unless each shareholder is a member of the profession, subject to regulations for certain health profession corporations (OBCA s. 3.2(5) and (6)).",
        ],
      },
      { type: "heading", id: "what-it-covers", text: "What it covers: common clauses" },
      {
        type: "paragraph",
        text: "A good agreement answers the questions people do not want to think about on day one. No two agreements are identical, but most agreements for owner-managed Canadian corporations draw on the same set of building blocks.",
      },
      {
        type: "table",
        head: ["Clause", "What it does"],
        rows: [
          ["Management and reserved matters", "Lists decisions that need the approval of all the shareholders or a set percentage, such as issuing shares, borrowing above a threshold, selling the business or changing the share structure. Who may nominate directors is usually set out here too."],
          ["Share transfer restrictions", "Prohibits shareholders from selling, pledging or transferring their shares except as the agreement allows. These sit on top of the transfer restrictions that most private corporations already have in their articles."],
          ["Right of first refusal", "Before a shareholder sells to an outsider, the other shareholders get the right to buy the shares on the same terms."],
          ["Shotgun (buy-sell) clause", "One shareholder names a price per share. The other must either sell at that price or buy the offering shareholder's shares at that price. It is a way to separate owners who can no longer work together."],
          ["Drag-along", "If holders of a set majority accept an offer for the whole company, they can require the minority to sell on the same terms, so a buyer can acquire 100% of the shares."],
          ["Tag-along", "If a majority holder sells, minority holders have the right to join the sale on the same terms, so they are not left behind with a new controlling owner."],
          ["Deadlock", "Sets out what happens when the owners are evenly split: a mediation or arbitration step, a casting vote, or a trigger for a shotgun or buy-out."],
          ["Non-competition and non-solicitation", "Restricts owners, during their ownership and for a period afterward, from competing with the business or soliciting its clients or employees. Courts look closely at whether these restrictions are reasonable."],
          ["Death, disability and departure", "Requires or permits the corporation or the other shareholders to buy the shares of an owner who dies, becomes disabled, retires or stops working in the business. It is often paired with life or disability insurance to fund the purchase."],
          ["Valuation", "Sets the method for pricing shares on a buy-out: a fixed price updated each year, a formula, or a valuation by an independent chartered business valuator."],
          ["Dispute resolution", "Requires negotiation, mediation or arbitration before litigation, and usually keeps disputes private."],
          ["Funding and dividends", "Covers whether owners must lend money to the company, how shareholder loans are repaid, and any policy on paying dividends."],
        ],
      },
      { type: "heading", id: "articles-and-bylaws", text: "How it relates to the articles and by-laws" },
      p(
        "A corporation's constating documents come in layers. The ",
        { text: "articles of incorporation", href: "/guides/what-are-articles-of-incorporation" },
        " are filed with the government and set out the name, the share classes and their rights, the number of directors and any restrictions on transferring shares (CBCA s. 6(1)). The by-laws are internal rules about meetings, officers, banking and signing authority. Under CBCA s. 103, the directors make, amend or repeal by-laws unless the articles, the by-laws or a unanimous shareholder agreement otherwise provide, and the shareholders then confirm, reject or amend them by ordinary resolution.",
      ),
      {
        type: "paragraph",
        text: "The shareholder agreement is the third layer and the most detailed. It cannot authorize something the statute prohibits, and it works best when it is consistent with the articles and by-laws. For example, an agreement that requires unanimous approval to issue new shares only has teeth if the share classes in the articles allow the structure the owners want. Changing the articles themselves requires a special resolution, meaning at least two-thirds of the votes cast or a resolution signed by all the voting shareholders, followed by articles of amendment filed with the government.",
      },
      { type: "heading", id: "why-it-matters", text: "Why it matters: what happens without one" },
      {
        type: "paragraph",
        text: "Without an agreement, you fall back on the default rules in the governing statute, which were not written with your specific business in mind. That is fine until there is real money or a real disagreement at stake. In practice, the statutory defaults look like this:",
      },
      {
        type: "list",
        items: [
          "The board manages the business, and directors are elected by ordinary resolution (a simple majority of the votes cast). A shareholder with more than 50% of the votes can generally control who sits on the board.",
          "There is no automatic right for an owner to be bought out when they leave, retire or are excluded from the business.",
          "There is no built-in mechanism to break a 50/50 deadlock.",
          "When a shareholder dies, the shares pass to their estate, and the remaining owners may find themselves in business with the deceased's heirs.",
          "There is no agreed formula for valuing shares, so any buy-out price has to be negotiated from scratch.",
        ],
      },
      {
        type: "paragraph",
        text: "When things go badly wrong, the main statutory safety valve is the oppression remedy (CBCA s. 241; OBCA s. 248). A security holder, creditor, director or officer can ask the court for relief where the corporation's conduct, or the way its business or the directors' powers have been exercised, is oppressive or unfairly prejudicial to, or unfairly disregards, their interests. Courts have wide powers under these sections, including ordering a purchase of shares, appointing directors, compensating an aggrieved person, creating or amending a unanimous shareholder agreement, or winding up the corporation. These are court proceedings, though, and they tend to be slow, costly and uncertain. A well-drafted agreement lets owners settle these questions in advance on their own terms.",
      },
      {
        type: "callout",
        text: "The time to put a shareholder agreement in place is while everyone is still friendly and aligned. Trying to negotiate one in the middle of a dispute is where partnerships go to die.",
      },
      { type: "heading", id: "do-you-need-one", text: "Do you need one?" },
      {
        type: "paragraph",
        text: "If you are the only shareholder, not usually. The moment there are two or more owners, it is worth considering. A shareholder agreement is a legal document tailored to your situation, so it is drafted by a lawyer, not generated from a template. That is separate from incorporating the company itself. Owners commonly put an agreement in place at these moments:",
      },
      {
        type: "list",
        items: [
          "At incorporation, when two or more founders are starting the business together.",
          "When a new shareholder comes in, such as a key employee, a family member or an investor.",
          "When a holding company becomes a shareholder of an operating company alongside other owners.",
          "Before raising money from outside investors, who often require one as a condition of investing.",
          "During estate or succession planning, when owners want to decide what happens to their shares on death or retirement.",
        ],
      },
      { type: "heading", id: "typical-process", text: "Putting one in place: a typical sequence" },
      {
        type: "list",
        items: [
          "Step 1. Incorporate the corporation and settle the share structure in the articles.",
          "Step 2. Issue the shares to each owner and record them in the securities register.",
          "Step 3. The owners discuss the key business points: control, exits, valuation, funding and restrictive covenants.",
          "Step 4. A lawyer drafts the agreement; owners often get independent legal advice on it, and an accountant reviews the tax side of buy-outs and insurance.",
          "Step 5. All parties sign, and the share certificates are endorsed with a reference to the agreement.",
          "Step 6. A signed copy goes into the minute book, and the agreement is reviewed when owners, values or plans change.",
        ],
      },
      { type: "heading", id: "minute-book", text: "Keeping it in the minute book" },
      p(
        "Both statutes require the corporation to keep a copy of any unanimous shareholder agreement with its corporate records: CBCA s. 20(1) lists it next to the articles and by-laws, and OBCA s. 140(1) requires a copy of any unanimous shareholder agreement known to the directors. Ordinary agreements are typically filed in the same place. Keeping the signed agreement in the ",
        { text: "corporate minute book", href: "/guides/corporate-minute-book" },
        " means the directors, new shareholders, lenders and buyers can see the rules that actually govern the company. Whenever shares change hands, the securities register, share certificates and any joinder signed by the incoming shareholder also belong there.",
      ),
      { type: "heading", id: "where-korporex-fits", text: "Where Korporex fits" },
      p(
        "Korporex is not a law firm and does not draft shareholder agreements or provide legal advice. What Korporex does is ",
        { text: "incorporate the company", href: "/incorporate" },
        " and set up the share structure that the agreement then builds on, so your ownership is properly established from the start.",
      ),
      p(
        "Korporex can also prepare an ",
        { text: "initial minute book", href: "/services/initial-minute-book" },
        " with the organizational resolutions, registers and share certificates the agreement sits alongside, and handle a ",
        { text: "change of shareholders", href: "/services/change-shareholder" },
        " when shares are issued or transferred. If the agreement calls for a different board, a ",
        { text: "change of directors", href: "/services/change-director" },
        " can be filed with the government. For structures involving a ",
        { text: "holding company", href: "/guides/holding-company-canada" },
        ", the agreement and the share structure are usually planned together with a lawyer and an accountant.",
      ),
    ],
    faq: [
      {
        q: "Is a shareholder agreement mandatory in Canada?",
        a: "No. Neither the Canada Business Corporations Act nor Ontario's Business Corporations Act requires a corporation to have one. Without an agreement, the corporation runs on the statute's default rules, its articles and its by-laws. Many corporations with two or more owners choose to sign one anyway, because those defaults do not address buy-outs, deadlocks, deaths or exits in any practical way.",
      },
      {
        q: "What is a unanimous shareholder agreement?",
        a: "It is a written agreement among all the shareholders, sometimes with non-shareholders, that restricts the directors' powers to manage the corporation (CBCA s. 146; OBCA s. 108). To the extent powers are restricted, the shareholders who take them over assume the directors' rights, duties and liabilities, and the directors are relieved to the same extent. A copy must be kept with the corporate records.",
      },
      {
        q: "Is a shareholder agreement filed with the government?",
        a: "No. A shareholder agreement is a private contract and is not filed with Corporations Canada or the Ontario Business Registry. The corporation keeps a copy of any unanimous shareholder agreement in its own records, usually the minute book. Changes that result from the agreement, such as new directors or amended articles, are filed separately on the public record.",
      },
      {
        q: "Does a new shareholder have to sign the existing agreement?",
        a: "A person who buys or receives shares subject to a unanimous shareholder agreement is deemed to be a party to it under both the CBCA and the OBCA. Even so, it is common practice to have the new shareholder sign a joinder confirming they are bound. A purchaser who had no notice of the agreement may have a statutory right to rescind the purchase within a limited time.",
      },
      {
        q: "What is a shotgun clause?",
        a: "A shotgun clause lets one shareholder name a price for the shares. The other shareholder must then either sell their shares at that price or buy the offering shareholder's shares at the same price. Because the offeror does not know which side they will end up on, the clause pushes toward a fair price. It works best when both sides can realistically finance a purchase.",
      },
    ],
  },

  // ── French ──
  fr: {
    readTime: "12 min de lecture",
    content: [
      {
        type: "paragraph",
        text: "Une convention d'actionnaires au Canada est un contrat écrit et privé entre certains ou l'ensemble des actionnaires d'une société, qui établit comment l'entreprise sera détenue et dirigée, et ce qui arrive lorsqu'un propriétaire veut partir, décède, devient invalide ou se brouille avec les autres. Elle accompagne les statuts et les règlements administratifs de la société. Les lois canadiennes sur les sociétés reconnaissent deux types de conventions : la convention d'actionnaires ordinaire, qui est simplement un contrat entre les actionnaires qui la signent, et la convention unanime des actionnaires, qui est signée par tous les actionnaires et peut légalement retirer des pouvoirs au conseil d'administration (article 146 de la Loi canadienne sur les sociétés par actions (LCSA) et article 108 de la Loi sur les sociétés par actions de l'Ontario (LSAO)).",
      },
      {
        type: "callout",
        title: "Information générale seulement",
        text: "Ce guide explique le fonctionnement des conventions d'actionnaires en droit fédéral et ontarien des sociétés. Il ne constitue pas un avis juridique. Une convention d'actionnaires est rédigée pour une entreprise et des propriétaires précis, et c'est un avocat qui est en mesure d'en préparer ou d'en réviser une.",
      },
      { type: "heading", id: "ce-que-cest", text: "Ce qu'est une convention d'actionnaires" },
      {
        type: "paragraph",
        text: "Une convention d'actionnaires est un contrat entre les propriétaires d'une société. Elle établit comment ils dirigeront l'entreprise ensemble et, tout aussi important, ce qui arrive quand les choses changent : quelqu'un veut partir, quelqu'un décède, les propriétaires ne s'entendent pas, ou un acheteur se présente. Elle accompagne les statuts de la société, mais c'est un contrat distinct et privé entre les actionnaires. Elle n'est pas déposée auprès de Corporations Canada ni du Registre des entreprises de l'Ontario, et elle ne figure pas au registre public.",
      },
      {
        type: "paragraph",
        text: "Lorsqu'une société compte plus d'un actionnaire, c'est le document qui prévient discrètement la plupart des différends qui déchirent les petites entreprises. Il est facile de la sauter quand tout le monde s'entend bien au départ, ce qui est précisément la raison pour laquelle tant d'entreprises regrettent de ne pas en avoir eu une. La loi ne fournit qu'un cadre général : les actionnaires élisent les administrateurs, les administrateurs gèrent l'entreprise, et certains changements fondamentaux exigent une résolution spéciale. La convention d'actionnaires ajoute les règles précises et pratiques dont les propriétaires ont convenu entre eux.",
      },
      { type: "heading", id: "ordinaire-ou-unanime", text: "Convention ordinaire ou convention unanime des actionnaires" },
      {
        type: "paragraph",
        text: "Selon la LCSA comme selon la LSAO, les administrateurs gèrent les activités commerciales et les affaires internes de la société, ou en surveillent la gestion, sous réserve de toute convention unanime des actionnaires (LCSA, par. 102(1); LSAO, par. 115(1)). Cette réserve, sous réserve de toute convention unanime des actionnaires, est ce qui distingue les deux types de conventions.",
      },
      {
        type: "paragraph",
        text: "Une convention d'actionnaires ordinaire peut n'être signée que par certains actionnaires. Un exemple courant est la convention de vote, par laquelle deux actionnaires ou plus conviennent par écrit d'exercer leurs droits de vote d'une manière donnée, par exemple pour s'élire mutuellement administrateurs. Les deux lois le permettent expressément (LCSA, art. 145.1; LSAO, par. 108(1)). Une convention ordinaire lie ses signataires sur le plan contractuel, mais elle ne modifie pas les pouvoirs légaux du conseil.",
      },
      {
        type: "paragraph",
        text: "Une convention unanime des actionnaires est une convention écrite conclue entre tous les actionnaires, ou entre tous les actionnaires et une ou plusieurs personnes qui ne sont pas actionnaires, qui restreint en tout ou en partie les pouvoirs des administrateurs de gérer les activités commerciales et les affaires internes de la société ou d'en surveiller la gestion (LCSA, par. 146(1); LSAO, par. 108(2)). La plupart des conventions d'actionnaires des petites sociétés fermées comptant plusieurs propriétaires sont rédigées sous forme de convention unanime, parce que c'est cette forme qui permet aux propriétaires de se réserver les décisions importantes.",
      },
      {
        type: "table",
        head: ["Caractéristique", "Convention d'actionnaires ordinaire", "Convention unanime des actionnaires"],
        rows: [
          ["Signataires", "Deux actionnaires ou plus, pas nécessairement tous", "Tous les actionnaires (et, au besoin, d'autres parties)"],
          ["Fondement légal", "Droit des contrats; conventions de vote reconnues à l'art. 145.1 de la LCSA et au par. 108(1) de la LSAO", "Art. 146 de la LCSA et par. 108(2) à (10) de la LSAO"],
          ["Peut-elle restreindre les pouvoirs des administrateurs?", "Non", "Oui, en tout ou en partie"],
          ["Effet sur la responsabilité des administrateurs", "Aucun", "Transférée, dans la même mesure, aux actionnaires qui exercent les pouvoirs restreints"],
          ["Nouveaux actionnaires", "Liés seulement s'ils la signent", "Le cessionnaire d'actions est réputé être partie à la convention"],
          ["Livre des procès-verbaux", "Habituellement conservée avec les registres de la société, par bonne pratique", "Une copie doit être conservée avec les registres de la société (LCSA, par. 20(1); LSAO, par. 140(1))"],
        ],
      },
      { type: "heading", id: "regles-convention-unanime", text: "Le fonctionnement d'une convention unanime des actionnaires" },
      {
        type: "paragraph",
        text: "Comme une convention unanime peut retirer des décisions au conseil, les lois y rattachent des conséquences précises. La plus importante est le transfert de responsabilité. Selon le par. 146(5) de la LCSA, dans la mesure où une convention unanime restreint les pouvoirs des administrateurs, les parties à qui ce pouvoir est conféré ont tous les droits, pouvoirs, obligations et responsabilités d'un administrateur, y compris les moyens de défense dont disposent les administrateurs, et les administrateurs sont libérés de leurs droits, pouvoirs, obligations et responsabilités, y compris leur responsabilité prévue à l'article 119 (comme les salaires impayés des employés), dans la même mesure. Le par. 108(5) de la LSAO prévoit le même effet pour l'actionnaire partie à la convention et renvoie expressément à la responsabilité prévue à l'article 131. Autrement dit, les actionnaires qui prennent le contrôle d'une décision assument aussi le risque juridique qui l'accompagne.",
      },
      {
        type: "paragraph",
        text: "Cela se reflète dans la règle générale sur la responsabilité des actionnaires. Le par. 45(1) de la LCSA prévoit que les actionnaires ne sont pas, en cette qualité, responsables des obligations de la société, mais il mentionne le par. 146(5) parmi les exceptions. Les propriétaires qui utilisent une convention unanime pour gérer directement l'entreprise se mettent donc à la place des administrateurs pour ces questions.",
      },
      {
        type: "list",
        items: [
          "Déclaration de l'actionnaire unique. Lorsqu'une seule personne détient toutes les actions émises, sa déclaration écrite restreignant les pouvoirs des administrateurs est réputée être une convention unanime des actionnaires (LCSA, par. 146(2); LSAO, par. 108(3)).",
          "Les nouveaux propriétaires sont liés. L'acquéreur ou le cessionnaire d'actions assujetties à une convention unanime est réputé y être partie (LCSA, par. 146(3); LSAO, par. 108(4)), et selon la LSAO, il en va de même de la personne à qui de nouvelles actions sont émises pendant qu'une convention unanime est en vigueur (LSAO, par. 108(7)).",
          "Mention sur le certificat d'actions. Selon le par. 49(8) de la LCSA, une convention unanime des actionnaires ou une restriction au transfert est inopposable au cessionnaire qui n'en a pas effectivement connaissance, à moins qu'elle ou un renvoi à celle-ci ne figure de façon ostensible sur le certificat d'actions.",
          "Droit d'annulation. L'acquéreur d'une société fédérale qui n'a pas été avisé peut annuler l'opération dans les 30 jours suivant le moment où il prend connaissance de la convention (LCSA, par. 146(4)). Selon la LSAO, l'acquéreur à titre onéreux sans connaissance de la convention dispose généralement de 60 jours après avoir effectivement reçu une copie complète de la convention (LSAO, par. 108(7), (9) et (10)).",
          "Arbitrage et modifications. La LSAO permet expressément à une convention unanime de prévoir sa propre procédure de modification et de soumettre les désaccords entre les parties à l'arbitrage (LSAO, par. 108(6)).",
          "Sociétés professionnelles. En Ontario, la convention unanime des actionnaires d'une société professionnelle est nulle à moins que chaque actionnaire ne soit membre de la profession, sous réserve des règlements visant certaines sociétés de professionnels de la santé (LSAO, par. 3.2(5) et (6)).",
        ],
      },
      { type: "heading", id: "ce-quelle-couvre", text: "Ce qu'elle couvre : les clauses courantes" },
      {
        type: "paragraph",
        text: "Une bonne convention répond aux questions auxquelles les gens ne veulent pas penser le premier jour. Il n'y a pas deux conventions identiques, mais la plupart des conventions des sociétés canadiennes dirigées par leurs propriétaires reposent sur les mêmes éléments de base.",
      },
      {
        type: "table",
        head: ["Clause", "Ce qu'elle fait"],
        rows: [
          ["Gestion et décisions réservées", "Énumère les décisions qui exigent l'approbation de tous les actionnaires ou d'un pourcentage déterminé, comme l'émission d'actions, un emprunt au-delà d'un seuil, la vente de l'entreprise ou la modification de la structure du capital. Le droit de proposer des administrateurs y est habituellement prévu aussi."],
          ["Restrictions au transfert d'actions", "Interdit aux actionnaires de vendre, de mettre en gage ou de transférer leurs actions sauf dans les cas prévus par la convention. Ces restrictions s'ajoutent à celles que la plupart des sociétés fermées prévoient déjà dans leurs statuts."],
          ["Droit de premier refus", "Avant qu'un actionnaire vende à un tiers, les autres actionnaires ont le droit d'acheter les actions aux mêmes conditions."],
          ["Clause shotgun (clause d'achat-vente)", "Un actionnaire propose un prix par action. L'autre doit soit vendre à ce prix, soit acheter à ce prix les actions de l'actionnaire qui a fait l'offre. C'est un moyen de séparer des propriétaires qui ne peuvent plus travailler ensemble."],
          ["Droit d'entraînement (drag-along)", "Si les détenteurs d'une majorité déterminée acceptent une offre visant toute la société, ils peuvent obliger la minorité à vendre aux mêmes conditions, afin qu'un acheteur puisse acquérir 100 % des actions."],
          ["Droit de sortie conjointe (tag-along)", "Si un actionnaire majoritaire vend, les actionnaires minoritaires ont le droit de se joindre à la vente aux mêmes conditions, pour ne pas se retrouver avec un nouveau propriétaire contrôlant."],
          ["Impasse", "Prévoit ce qui arrive lorsque les propriétaires sont divisés à parts égales : une étape de médiation ou d'arbitrage, une voix prépondérante, ou le déclenchement d'une clause shotgun ou d'un rachat."],
          ["Non-concurrence et non-sollicitation", "Empêche les propriétaires, pendant qu'ils détiennent des actions et pendant une période par la suite, de faire concurrence à l'entreprise ou de solliciter ses clients ou ses employés. Les tribunaux examinent de près le caractère raisonnable de ces restrictions."],
          ["Décès, invalidité et départ", "Oblige ou permet à la société ou aux autres actionnaires d'acheter les actions d'un propriétaire qui décède, devient invalide, prend sa retraite ou cesse de travailler dans l'entreprise. Elle est souvent jumelée à une assurance vie ou invalidité pour financer l'achat."],
          ["Évaluation", "Fixe la méthode d'établissement du prix des actions lors d'un rachat : un prix fixe mis à jour chaque année, une formule, ou une évaluation par un évaluateur d'entreprises indépendant (CBV)."],
          ["Règlement des différends", "Exige la négociation, la médiation ou l'arbitrage avant tout recours judiciaire, et garde habituellement les différends confidentiels."],
          ["Financement et dividendes", "Indique si les propriétaires doivent prêter de l'argent à la société, comment les prêts d'actionnaires sont remboursés, et toute politique de versement de dividendes."],
        ],
      },
      { type: "heading", id: "statuts-et-reglements", text: "Le lien avec les statuts et les règlements administratifs" },
      p(
        "Les documents constitutifs d'une société sont superposés. Les ",
        { text: "statuts constitutifs", href: "/guides/que-sont-les-statuts-constitutifs" },
        " sont déposés auprès du gouvernement et indiquent la dénomination, les catégories d'actions et leurs droits, le nombre d'administrateurs et toute restriction au transfert des actions (LCSA, par. 6(1)). Les règlements administratifs sont des règles internes sur les assemblées, les dirigeants, les opérations bancaires et le pouvoir de signature. Selon l'art. 103 de la LCSA, les administrateurs prennent, modifient ou révoquent les règlements administratifs, sauf disposition contraire des statuts, des règlements administratifs ou d'une convention unanime des actionnaires, et les actionnaires les confirment, les rejettent ou les modifient ensuite par résolution ordinaire.",
      ),
      {
        type: "paragraph",
        text: "La convention d'actionnaires est la troisième couche et la plus détaillée. Elle ne peut pas autoriser ce que la loi interdit, et elle fonctionne mieux lorsqu'elle est cohérente avec les statuts et les règlements administratifs. Par exemple, une convention qui exige l'approbation unanime pour émettre de nouvelles actions n'a de portée réelle que si les catégories d'actions prévues dans les statuts permettent la structure voulue par les propriétaires. La modification des statuts eux-mêmes exige une résolution spéciale, soit au moins les deux tiers des voix exprimées ou une résolution signée par tous les actionnaires habiles à voter, suivie du dépôt de clauses modificatrices auprès du gouvernement.",
      },
      { type: "heading", id: "pourquoi-elle-compte", text: "Pourquoi elle compte : ce qui arrive sans convention" },
      {
        type: "paragraph",
        text: "Sans convention, vous vous rabattez sur les règles par défaut de la loi applicable, qui n'ont pas été écrites en pensant à votre entreprise précise. C'est correct jusqu'à ce qu'il y ait de l'argent réel ou un vrai désaccord en jeu. En pratique, les règles par défaut de la loi ressemblent à ceci :",
      },
      {
        type: "list",
        items: [
          "Le conseil gère l'entreprise, et les administrateurs sont élus par résolution ordinaire (la majorité simple des voix exprimées). Un actionnaire qui détient plus de 50 % des voix peut généralement décider de la composition du conseil.",
          "Aucun droit automatique ne permet à un propriétaire de se faire racheter lorsqu'il part, prend sa retraite ou est écarté de l'entreprise.",
          "Aucun mécanisme intégré ne permet de dénouer une impasse à 50/50.",
          "Au décès d'un actionnaire, les actions passent à sa succession, et les autres propriétaires peuvent se retrouver en affaires avec ses héritiers.",
          "Aucune formule convenue ne permet d'évaluer les actions, de sorte que tout prix de rachat doit être négocié à partir de zéro.",
        ],
      },
      {
        type: "paragraph",
        text: "Lorsque les choses tournent mal, la principale soupape de sécurité prévue par la loi est le recours en cas d'abus (LCSA, art. 241; LSAO, art. 248). Un détenteur de valeurs mobilières, un créancier, un administrateur ou un dirigeant peut demander réparation au tribunal lorsque la conduite de la société, ou la manière dont ses affaires sont menées ou dont les pouvoirs des administrateurs sont exercés, est abusive ou injustement préjudiciable à ses intérêts, ou en fait abstraction de façon injuste. Les tribunaux disposent de pouvoirs étendus en vertu de ces articles, notamment ordonner l'achat d'actions, nommer des administrateurs, indemniser une personne lésée, créer ou modifier une convention unanime des actionnaires, ou liquider la société. Il s'agit toutefois de procédures judiciaires, qui ont tendance à être longues, coûteuses et incertaines. Une convention bien rédigée permet aux propriétaires de régler ces questions à l'avance, selon leurs propres conditions.",
      },
      {
        type: "callout",
        text: "Le moment de mettre en place une convention d'actionnaires, c'est pendant que tout le monde est encore en bons termes et aligné. Tenter d'en négocier une au milieu d'un différend, c'est là que les partenariats vont mourir.",
      },
      { type: "heading", id: "en-avez-vous-besoin", text: "En avez-vous besoin ?" },
      {
        type: "paragraph",
        text: "Si vous êtes le seul actionnaire, généralement pas. Dès qu'il y a deux propriétaires ou plus, la question mérite d'être examinée. Une convention d'actionnaires est un document juridique adapté à votre situation, elle est donc rédigée par un avocat, pas générée à partir d'un modèle. C'est distinct de la constitution de la société elle-même. Les propriétaires mettent couramment une convention en place à ces moments :",
      },
      {
        type: "list",
        items: [
          "À la constitution, lorsque deux fondateurs ou plus lancent l'entreprise ensemble.",
          "À l'arrivée d'un nouvel actionnaire, comme un employé clé, un membre de la famille ou un investisseur.",
          "Lorsqu'une société de portefeuille devient actionnaire d'une société d'exploitation aux côtés d'autres propriétaires.",
          "Avant de recueillir des fonds auprès d'investisseurs externes, qui en exigent souvent une comme condition de leur investissement.",
          "Lors de la planification successorale, lorsque les propriétaires veulent décider du sort de leurs actions à leur décès ou à leur retraite.",
        ],
      },
      { type: "heading", id: "etapes-typiques", text: "La mise en place : une séquence typique" },
      {
        type: "list",
        items: [
          "Étape 1. Constituer la société et fixer la structure du capital dans les statuts.",
          "Étape 2. Émettre les actions à chaque propriétaire et les inscrire au registre des valeurs mobilières.",
          "Étape 3. Les propriétaires discutent des points d'affaires clés : contrôle, sorties, évaluation, financement et clauses restrictives.",
          "Étape 4. Un avocat rédige la convention; les propriétaires obtiennent souvent un avis juridique indépendant, et un comptable examine l'aspect fiscal des rachats et des assurances.",
          "Étape 5. Toutes les parties signent, et les certificats d'actions portent un renvoi à la convention.",
          "Étape 6. Une copie signée est versée au livre des procès-verbaux, et la convention est révisée lorsque les propriétaires, les valeurs ou les plans changent.",
        ],
      },
      { type: "heading", id: "livre-des-proces-verbaux", text: "La conserver dans le livre des procès-verbaux" },
      p(
        "Les deux lois exigent que la société conserve une copie de toute convention unanime des actionnaires avec ses registres : le par. 20(1) de la LCSA la mentionne à côté des statuts et des règlements administratifs, et le par. 140(1) de la LSAO exige une copie de toute convention unanime des actionnaires dont les administrateurs ont connaissance. Les conventions ordinaires sont habituellement classées au même endroit. Conserver la convention signée dans le ",
        { text: "livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
        " permet aux administrateurs, aux nouveaux actionnaires, aux prêteurs et aux acheteurs de voir les règles qui régissent réellement la société. Chaque fois que des actions changent de mains, le registre des valeurs mobilières, les certificats d'actions et toute convention d'adhésion signée par le nouvel actionnaire y ont aussi leur place.",
      ),
      { type: "heading", id: "ou-korporex", text: "Où se situe Korporex" },
      p(
        "Korporex n'est pas un cabinet d'avocats et ne rédige pas de conventions d'actionnaires ni ne donne de conseils juridiques. Ce que Korporex fait, c'est ",
        { text: "constituer la société", href: "/incorporate" },
        " et mettre en place la structure d'actions sur laquelle la convention s'appuie ensuite, afin que votre propriété soit correctement établie dès le départ.",
      ),
      p(
        "Korporex peut aussi préparer un ",
        { text: "livre des procès-verbaux initial", href: "/services/initial-minute-book" },
        " contenant les résolutions d'organisation, les registres et les certificats d'actions qui accompagnent la convention, et s'occuper d'un ",
        { text: "changement d'actionnaires", href: "/services/change-shareholder" },
        " lorsque des actions sont émises ou transférées. Si la convention prévoit un conseil différent, un ",
        { text: "changement d'administrateurs", href: "/services/change-director" },
        " peut être déposé auprès du gouvernement. Pour les structures qui comprennent une ",
        { text: "société de portefeuille", href: "/guides/societe-de-portefeuille-canada" },
        ", la convention et la structure du capital sont habituellement planifiées ensemble avec un avocat et un comptable.",
      ),
    ],
    faq: [
      {
        q: "La convention d'actionnaires est-elle obligatoire au Canada?",
        a: "Non. Ni la Loi canadienne sur les sociétés par actions ni la Loi sur les sociétés par actions de l'Ontario n'exigent qu'une société en ait une. Sans convention, la société fonctionne selon les règles par défaut de la loi, ses statuts et ses règlements administratifs. Beaucoup de sociétés comptant deux propriétaires ou plus choisissent tout de même d'en signer une, car ces règles ne règlent pas concrètement les rachats, les impasses, les décès ou les départs.",
      },
      {
        q: "Qu'est-ce qu'une convention unanime des actionnaires?",
        a: "C'est une convention écrite entre tous les actionnaires, parfois avec des non-actionnaires, qui restreint les pouvoirs de gestion des administrateurs (LCSA, art. 146; LSAO, art. 108). Dans la mesure où des pouvoirs sont restreints, les actionnaires qui les exercent assument les droits, obligations et responsabilités des administrateurs, et ces derniers en sont libérés dans la même mesure. Une copie doit être conservée avec les registres de la société.",
      },
      {
        q: "La convention d'actionnaires est-elle déposée auprès du gouvernement?",
        a: "Non. La convention d'actionnaires est un contrat privé qui n'est pas déposé auprès de Corporations Canada ni du Registre des entreprises de l'Ontario. La société conserve une copie de toute convention unanime dans ses propres registres, habituellement le livre des procès-verbaux. Les changements qui découlent de la convention, comme de nouveaux administrateurs ou des statuts modifiés, sont déposés séparément au registre public.",
      },
      {
        q: "Un nouvel actionnaire doit-il signer la convention existante?",
        a: "Selon la LCSA et la LSAO, la personne qui achète ou reçoit des actions assujetties à une convention unanime des actionnaires est réputée y être partie. Il est néanmoins d'usage de faire signer au nouvel actionnaire une convention d'adhésion confirmant qu'il est lié. L'acquéreur qui n'avait pas connaissance de la convention peut disposer d'un droit légal d'annuler l'achat dans un délai limité.",
      },
      {
        q: "Qu'est-ce qu'une clause shotgun?",
        a: "Une clause shotgun permet à un actionnaire de proposer un prix pour les actions. L'autre actionnaire doit alors soit vendre ses actions à ce prix, soit acheter au même prix les actions de celui qui a fait l'offre. Comme l'offrant ignore de quel côté il se retrouvera, la clause favorise un prix juste. Elle fonctionne mieux lorsque les deux parties peuvent réalistement financer un achat.",
      },
    ],
  },

  // ── Spanish ──
  es: {
    readTime: "12 min de lectura",
    content: [
      {
        type: "paragraph",
        text: "Un convenio de accionistas en Canadá es un contrato escrito y privado entre algunos o todos los accionistas de una sociedad, que establece cómo se poseerá y dirigirá la empresa, y qué pasa cuando un propietario quiere salir, fallece, queda incapacitado o se enemista con los demás. Acompaña a los estatutos y a los reglamentos internos de la sociedad. Las leyes de sociedades canadienses reconocen dos tipos: el convenio de accionistas ordinario, que es simplemente un contrato entre los accionistas que lo firman, y el convenio unánime de accionistas, que firman todos los accionistas y que puede, legalmente, quitar facultades al consejo de administración (artículo 146 de la Ley de Sociedades por Acciones de Canadá (CBCA) y artículo 108 de la Ley de Sociedades por Acciones de Ontario (OBCA)).",
      },
      {
        type: "callout",
        title: "Solo información general",
        text: "Esta guía explica cómo funcionan los convenios de accionistas según el derecho de sociedades federal y de Ontario. No es asesoría legal. Un convenio de accionistas se redacta para una empresa y unos propietarios concretos, y es un abogado quien debe prepararlo o revisarlo.",
      },
      { type: "heading", id: "que-es", text: "Qué es un convenio de accionistas" },
      {
        type: "paragraph",
        text: "Un convenio de accionistas es un contrato entre los propietarios de una sociedad. Establece cómo van a llevar la empresa juntos y, tan importante como eso, qué pasa cuando las cosas cambian: alguien quiere salir, alguien fallece, los propietarios no se ponen de acuerdo, o aparece un comprador. Acompaña a los estatutos de la sociedad, pero es un contrato aparte y privado entre los accionistas. No se presenta ante Corporations Canada ni ante el Registro de Empresas de Ontario, y no aparece en el registro público.",
      },
      {
        type: "paragraph",
        text: "Cuando una sociedad tiene más de un accionista, este es el documento que evita en silencio la mayoría de los conflictos que destrozan a las pequeñas empresas. Es fácil de omitir cuando todos se llevan bien al principio, que es precisamente la razón por la que tantos negocios lamentan no haber tenido uno. La ley solo ofrece un marco general: los accionistas eligen a los directores, los directores administran el negocio y ciertos cambios fundamentales requieren una resolución especial. El convenio de accionistas completa ese marco con las reglas concretas y prácticas que los propietarios acordaron entre sí.",
      },
      { type: "heading", id: "ordinario-o-unanime", text: "Convenio ordinario o convenio unánime de accionistas" },
      {
        type: "paragraph",
        text: "Tanto según la CBCA como según la OBCA, los directores administran los negocios y asuntos de la sociedad, o supervisan su administración, con sujeción a cualquier convenio unánime de accionistas (CBCA art. 102(1); OBCA art. 115(1)). Esa salvedad, con sujeción a cualquier convenio unánime de accionistas, es lo que distingue los dos tipos de convenio.",
      },
      {
        type: "paragraph",
        text: "Un convenio de accionistas ordinario puede estar firmado solo por algunos de los accionistas. Un ejemplo común es el convenio de voto o de sindicación, por el que dos o más accionistas acuerdan por escrito votar sus acciones de una manera determinada, por ejemplo para elegirse mutuamente como directores. Ambas leyes lo permiten expresamente (CBCA art. 145.1; OBCA art. 108(1)). Un convenio ordinario obliga contractualmente a quienes lo firman, pero no cambia las facultades legales del consejo.",
      },
      {
        type: "paragraph",
        text: "Un convenio unánime de accionistas (también llamado acuerdo unánime de accionistas, o USA por sus siglas en inglés) es un acuerdo escrito entre todos los accionistas, o entre todos los accionistas y una o más personas que no son accionistas, que restringe total o parcialmente las facultades de los directores para administrar los negocios y asuntos de la sociedad o supervisar su administración (CBCA art. 146(1); OBCA art. 108(2)). La mayoría de los convenios de accionistas de pequeñas sociedades privadas con varios propietarios se redactan como convenios unánimes, porque esa es la forma que permite a los propietarios reservarse las decisiones importantes.",
      },
      {
        type: "table",
        head: ["Característica", "Convenio de accionistas ordinario", "Convenio unánime de accionistas"],
        rows: [
          ["Quién lo firma", "Dos o más accionistas, no necesariamente todos", "Todos los accionistas (y, si se desea, otras partes)"],
          ["Base legal", "Derecho de contratos; convenios de voto reconocidos en el art. 145.1 de la CBCA y el art. 108(1) de la OBCA", "Art. 146 de la CBCA y art. 108(2) a (10) de la OBCA"],
          ["¿Puede restringir las facultades de los directores?", "No", "Sí, total o parcialmente"],
          ["Efecto sobre la responsabilidad de los directores", "Ninguno", "Se traslada, en la misma medida, a los accionistas que asumen las facultades restringidas"],
          ["Nuevos accionistas", "Obligados solo si lo firman", "Quien adquiere acciones se considera parte del convenio"],
          ["Libro de actas", "Normalmente se guarda con los registros de la sociedad, como buena práctica", "Debe guardarse una copia con los registros de la sociedad (CBCA art. 20(1); OBCA art. 140(1))"],
        ],
      },
      { type: "heading", id: "reglas-convenio-unanime", text: "Cómo funciona un convenio unánime de accionistas" },
      {
        type: "paragraph",
        text: "Como un convenio unánime puede quitarle decisiones al consejo, las leyes le atribuyen consecuencias específicas. La más importante es el traslado de la responsabilidad. Según el art. 146(5) de la CBCA, en la medida en que un convenio unánime restrinja las facultades de los directores, las partes a quienes se otorga esa facultad tienen todos los derechos, facultades, deberes y responsabilidades de un director, incluidas las defensas de las que disponen los directores, y los directores quedan liberados de sus derechos, facultades, deberes y responsabilidades, incluida su responsabilidad según el artículo 119 (como los salarios impagos de los empleados), en la misma medida. El art. 108(5) de la OBCA tiene el mismo efecto para el accionista que es parte del convenio y menciona expresamente la responsabilidad según el artículo 131. Dicho de otro modo, los accionistas que toman el control de una decisión también asumen el riesgo legal que la acompaña.",
      },
      {
        type: "paragraph",
        text: "Esto se refleja en la regla general sobre la responsabilidad de los accionistas. El art. 45(1) de la CBCA dispone que los accionistas no son, en su calidad de accionistas, responsables de las obligaciones de la sociedad, pero incluye el art. 146(5) entre las excepciones. Por lo tanto, los propietarios que usan un convenio unánime para administrar directamente el negocio ocupan el lugar de los directores en esos asuntos.",
      },
      {
        type: "list",
        items: [
          "Declaración del accionista único. Cuando una sola persona tiene todas las acciones emitidas, su declaración escrita que restringe las facultades de los directores se considera un convenio unánime de accionistas (CBCA art. 146(2); OBCA art. 108(3)).",
          "Los nuevos propietarios quedan obligados. Quien compra o adquiere acciones sujetas a un convenio unánime se considera parte de él (CBCA art. 146(3); OBCA art. 108(4)), y según la OBCA también lo es la persona a quien se emiten nuevas acciones mientras un convenio unánime está vigente (OBCA art. 108(7)).",
          "Mención en el certificado de acciones. Según el art. 49(8) de la CBCA, un convenio unánime de accionistas o una restricción a la transferencia no es oponible a quien adquiere sin conocerlo realmente, salvo que el convenio o una referencia a él figure de forma visible en el certificado de acciones.",
          "Derecho de rescisión. El comprador de acciones de una sociedad federal que no fue notificado puede rescindir la compra dentro de los 30 días siguientes a enterarse del convenio (CBCA art. 146(4)). Según la OBCA, el comprador a título oneroso sin conocimiento del convenio dispone en general de 60 días desde que recibe efectivamente una copia completa del convenio (OBCA art. 108(7), (9) y (10)).",
          "Arbitraje y modificaciones. La OBCA permite expresamente que un convenio unánime fije su propio procedimiento de modificación y someta a arbitraje los desacuerdos entre las partes (OBCA art. 108(6)).",
          "Sociedades profesionales. En Ontario, el convenio unánime de accionistas de una sociedad profesional es nulo salvo que cada accionista sea miembro de la profesión, sujeto a los reglamentos sobre ciertas sociedades de profesionales de la salud (OBCA art. 3.2(5) y (6)).",
        ],
      },
      { type: "heading", id: "que-cubre", text: "Qué cubre: cláusulas habituales" },
      {
        type: "paragraph",
        text: "Un buen convenio responde las preguntas en las que la gente no quiere pensar el primer día. No hay dos convenios iguales, pero la mayoría de los convenios de sociedades canadienses dirigidas por sus propietarios se construyen con los mismos elementos básicos.",
      },
      {
        type: "table",
        head: ["Cláusula", "Qué hace"],
        rows: [
          ["Administración y decisiones reservadas", "Enumera las decisiones que requieren la aprobación de todos los accionistas o de un porcentaje determinado, como emitir acciones, endeudarse por encima de un límite, vender el negocio o cambiar la estructura de acciones. Normalmente también fija quién puede proponer directores."],
          ["Restricciones a la transferencia de acciones", "Prohíbe a los accionistas vender, pignorar o transferir sus acciones salvo en los casos que permite el convenio. Se suman a las restricciones de transferencia que la mayoría de las sociedades privadas ya tienen en sus estatutos."],
          ["Derecho de preferencia", "Antes de que un accionista venda a un tercero, los demás accionistas tienen derecho a comprar las acciones en las mismas condiciones."],
          ["Cláusula shotgun (de compraventa)", "Un accionista fija un precio por acción. El otro debe vender a ese precio o comprar a ese precio las acciones de quien hizo la oferta. Es una forma de separar a propietarios que ya no pueden trabajar juntos."],
          ["Derecho de arrastre (drag-along)", "Si los titulares de una mayoría determinada aceptan una oferta por toda la empresa, pueden obligar a la minoría a vender en las mismas condiciones, para que un comprador pueda adquirir el 100 % de las acciones."],
          ["Derecho de acompañamiento (tag-along)", "Si un accionista mayoritario vende, los minoritarios tienen derecho a sumarse a la venta en las mismas condiciones, para no quedar con un nuevo propietario que controla la sociedad."],
          ["Bloqueo", "Establece qué pasa cuando los propietarios están divididos en partes iguales: una etapa de mediación o arbitraje, un voto de calidad, o la activación de una cláusula shotgun o de una recompra."],
          ["No competencia y no captación", "Impide a los propietarios, mientras son accionistas y durante un período posterior, competir con el negocio o captar a sus clientes o empleados. Los tribunales examinan con atención si estas restricciones son razonables."],
          ["Fallecimiento, incapacidad y salida", "Obliga o permite a la sociedad o a los demás accionistas comprar las acciones de un propietario que fallece, queda incapacitado, se jubila o deja de trabajar en el negocio. Suele combinarse con un seguro de vida o de incapacidad para financiar la compra."],
          ["Valoración", "Fija el método para poner precio a las acciones en una recompra: un precio fijo actualizado cada año, una fórmula o una valoración por un valuador de empresas independiente (CBV)."],
          ["Resolución de conflictos", "Exige negociación, mediación o arbitraje antes de acudir a los tribunales, y normalmente mantiene los conflictos en privado."],
          ["Financiamiento y dividendos", "Indica si los propietarios deben prestar dinero a la sociedad, cómo se reembolsan los préstamos de accionistas y cualquier política de pago de dividendos."],
        ],
      },
      { type: "heading", id: "estatutos-y-reglamentos", text: "Relación con los estatutos y los reglamentos internos" },
      p(
        "Los documentos constitutivos de una sociedad funcionan por capas. Los ",
        { text: "estatutos de constitución", href: "/guides/que-son-los-estatutos-de-constitucion" },
        " se presentan ante el gobierno y establecen la denominación, las clases de acciones y sus derechos, el número de directores y cualquier restricción a la transferencia de acciones (CBCA art. 6(1)). Los reglamentos internos (by-laws) son reglas internas sobre asambleas, funcionarios, operaciones bancarias y facultades de firma. Según el art. 103 de la CBCA, los directores aprueban, modifican o derogan los reglamentos internos salvo que los estatutos, los reglamentos o un convenio unánime de accionistas dispongan otra cosa, y luego los accionistas los confirman, rechazan o modifican por resolución ordinaria.",
      ),
      {
        type: "paragraph",
        text: "El convenio de accionistas es la tercera capa y la más detallada. No puede autorizar lo que la ley prohíbe, y funciona mejor cuando es coherente con los estatutos y los reglamentos internos. Por ejemplo, un convenio que exige aprobación unánime para emitir nuevas acciones solo tiene efecto real si las clases de acciones de los estatutos permiten la estructura que quieren los propietarios. Modificar los propios estatutos requiere una resolución especial, es decir, al menos dos tercios de los votos emitidos o una resolución firmada por todos los accionistas con derecho a voto, seguida de la presentación de los artículos de modificación ante el gobierno.",
      },
      { type: "heading", id: "por-que-importa", text: "Por qué importa: qué pasa si no hay convenio" },
      {
        type: "paragraph",
        text: "Sin un convenio, se recurre a las reglas por defecto de la ley aplicable, que no se escribieron pensando en su negocio en particular. Eso está bien hasta que hay dinero real o un desacuerdo real en juego. En la práctica, las reglas por defecto de la ley son estas:",
      },
      {
        type: "list",
        items: [
          "El consejo administra el negocio, y los directores se eligen por resolución ordinaria (mayoría simple de los votos emitidos). Un accionista con más del 50 % de los votos generalmente puede decidir quién integra el consejo.",
          "No existe un derecho automático a que se le compren las acciones a un propietario que se va, se jubila o es excluido del negocio.",
          "No hay un mecanismo incorporado para resolver un bloqueo al 50/50.",
          "Cuando un accionista fallece, las acciones pasan a su sucesión, y los demás propietarios pueden quedar en negocios con sus herederos.",
          "No hay una fórmula acordada para valorar las acciones, así que cualquier precio de recompra debe negociarse desde cero.",
        ],
      },
      {
        type: "paragraph",
        text: "Cuando las cosas salen muy mal, la principal válvula de seguridad legal es el recurso por abuso u opresión (oppression remedy) (CBCA art. 241; OBCA art. 248). Un titular de valores, un acreedor, un director o un funcionario puede pedir al tribunal una reparación cuando la conducta de la sociedad, o la forma en que se llevan sus negocios o se ejercen las facultades de los directores, es opresiva o injustamente perjudicial para sus intereses, o los ignora de manera injusta. Los tribunales tienen amplias facultades según estos artículos, entre ellas ordenar la compra de acciones, nombrar directores, indemnizar a la persona perjudicada, crear o modificar un convenio unánime de accionistas, o liquidar la sociedad. Sin embargo, son procesos judiciales y tienden a ser lentos, costosos e inciertos. Un convenio bien redactado permite a los propietarios resolver estas cuestiones por adelantado y en sus propios términos.",
      },
      {
        type: "callout",
        text: "El momento de establecer un convenio de accionistas es mientras todos siguen en buenos términos y alineados. Intentar negociar uno en medio de un conflicto es donde mueren las sociedades.",
      },
      { type: "heading", id: "necesita", text: "¿Necesita uno?" },
      {
        type: "paragraph",
        text: "Si usted es el único accionista, normalmente no. En el momento en que hay dos o más propietarios, vale la pena considerarlo. Un convenio de accionistas es un documento legal adaptado a su situación, así que lo redacta un abogado, no se genera desde una plantilla. Eso es aparte de constituir la sociedad en sí. Los propietarios suelen establecer un convenio en estos momentos:",
      },
      {
        type: "list",
        items: [
          "Al constituir la sociedad, cuando dos o más fundadores inician juntos el negocio.",
          "Cuando entra un nuevo accionista, como un empleado clave, un familiar o un inversionista.",
          "Cuando una sociedad de cartera pasa a ser accionista de una sociedad operativa junto con otros propietarios.",
          "Antes de captar dinero de inversionistas externos, que a menudo lo exigen como condición para invertir.",
          "Durante la planificación patrimonial o de sucesión, cuando los propietarios quieren decidir qué pasa con sus acciones al fallecer o jubilarse.",
        ],
      },
      { type: "heading", id: "pasos-tipicos", text: "Cómo se establece: una secuencia típica" },
      {
        type: "list",
        items: [
          "Paso 1. Constituir la sociedad y definir la estructura de acciones en los estatutos.",
          "Paso 2. Emitir las acciones a cada propietario y anotarlas en el registro de valores.",
          "Paso 3. Los propietarios conversan los puntos de negocio clave: control, salidas, valoración, financiamiento y cláusulas restrictivas.",
          "Paso 4. Un abogado redacta el convenio; los propietarios suelen obtener asesoría legal independiente, y un contador revisa el aspecto tributario de las recompras y los seguros.",
          "Paso 5. Todas las partes firman, y los certificados de acciones llevan una referencia al convenio.",
          "Paso 6. Una copia firmada se incorpora al libro de actas, y el convenio se revisa cuando cambian los propietarios, los valores o los planes.",
        ],
      },
      { type: "heading", id: "libro-de-actas", text: "Guardarlo en el libro de actas" },
      p(
        "Ambas leyes exigen que la sociedad guarde una copia de cualquier convenio unánime de accionistas con sus registros: el art. 20(1) de la CBCA lo menciona junto a los estatutos y los reglamentos internos, y el art. 140(1) de la OBCA exige una copia de cualquier convenio unánime de accionistas que conozcan los directores. Los convenios ordinarios normalmente se archivan en el mismo lugar. Guardar el convenio firmado en el ",
        { text: "libro de actas", href: "/guides/que-es-un-libro-de-actas" },
        " permite que los directores, los nuevos accionistas, los prestamistas y los compradores vean las reglas que realmente rigen la sociedad. Cada vez que las acciones cambian de manos, el registro de valores, los certificados de acciones y cualquier acta de adhesión firmada por el nuevo accionista también van allí.",
      ),
      { type: "heading", id: "donde-korporex", text: "Dónde encaja Korporex" },
      p(
        "Korporex no es un bufete de abogados y no redacta convenios de accionistas ni brinda asesoría legal. Lo que Korporex hace es ",
        { text: "constituir la sociedad", href: "/incorporate" },
        " y montar la estructura de acciones sobre la que el convenio luego se apoya, para que su titularidad quede bien establecida desde el inicio.",
      ),
      p(
        "Korporex también puede preparar un ",
        { text: "libro de actas inicial", href: "/services/initial-minute-book" },
        " con las resoluciones de organización, los registros y los certificados de acciones que acompañan al convenio, y gestionar un ",
        { text: "cambio de accionistas", href: "/services/change-shareholder" },
        " cuando se emiten o transfieren acciones. Si el convenio prevé un consejo distinto, se puede presentar un ",
        { text: "cambio de directores", href: "/services/change-director" },
        " ante el gobierno. En las estructuras que incluyen una ",
        { text: "sociedad de cartera", href: "/guides/sociedad-de-cartera-canada" },
        ", el convenio y la estructura de acciones normalmente se planifican juntos con un abogado y un contador.",
      ),
    ],
    faq: [
      {
        q: "¿Es obligatorio un convenio de accionistas en Canadá?",
        a: "No. Ni la Ley de Sociedades por Acciones de Canadá ni la Ley de Sociedades por Acciones de Ontario exigen que una sociedad tenga uno. Sin convenio, la sociedad funciona con las reglas por defecto de la ley, sus estatutos y sus reglamentos internos. Muchas sociedades con dos o más propietarios optan igualmente por firmar uno, porque esas reglas no resuelven en la práctica las recompras, los bloqueos, los fallecimientos ni las salidas.",
      },
      {
        q: "¿Qué es un convenio unánime de accionistas?",
        a: "Es un acuerdo escrito entre todos los accionistas, a veces junto con personas que no son accionistas, que restringe las facultades de administración de los directores (CBCA art. 146; OBCA art. 108). En la medida en que se restringen facultades, los accionistas que las asumen adquieren los derechos, deberes y responsabilidades de los directores, que quedan liberados en la misma medida. Debe guardarse una copia con los registros de la sociedad.",
      },
      {
        q: "¿El convenio de accionistas se presenta ante el gobierno?",
        a: "No. El convenio de accionistas es un contrato privado y no se presenta ante Corporations Canada ni ante el Registro de Empresas de Ontario. La sociedad guarda una copia de cualquier convenio unánime en sus propios registros, normalmente el libro de actas. Los cambios que resultan del convenio, como nuevos directores o estatutos modificados, se presentan por separado en el registro público.",
      },
      {
        q: "¿Un nuevo accionista debe firmar el convenio existente?",
        a: "Según la CBCA y la OBCA, quien compra o recibe acciones sujetas a un convenio unánime de accionistas se considera parte de él. Aun así, es práctica habitual que el nuevo accionista firme un acta de adhesión que confirme que queda obligado. El comprador que no conocía el convenio puede tener un derecho legal a rescindir la compra dentro de un plazo limitado.",
      },
      {
        q: "¿Qué es una cláusula shotgun?",
        a: "Una cláusula shotgun permite que un accionista fije un precio por las acciones. El otro accionista debe entonces vender sus acciones a ese precio o comprar al mismo precio las acciones de quien hizo la oferta. Como el oferente no sabe de qué lado terminará, la cláusula empuja hacia un precio justo. Funciona mejor cuando ambas partes pueden financiar realistamente una compra.",
      },
    ],
  },
};
