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
    readTime: "12 min read",
    content: [
      {
        type: "paragraph",
        text: "A corporate minute book is the set of records that a Canadian corporation is legally required to keep about its own existence, ownership and decisions. It holds the articles and by-laws, the minutes and written resolutions of directors and shareholders, the registers of directors and securities, and the register of individuals with significant control. For a federal corporation the core list is in section 20 of the Canada Business Corporations Act (CBCA); for an Ontario corporation it is in section 140 of the Business Corporations Act (OBCA). The obligation starts the day the corporation is incorporated and lasts for as long as it exists.",
      },
      {
        type: "callout",
        title: "Not filed with the government",
        text: "The minute book is kept by the corporation itself, not by Corporations Canada or the Ontario Business Registry. The registry holds public filings such as articles, annual returns and notices of change. The minute book holds the internal records that prove those filings, and every other corporate decision, were properly made.",
      },
      {
        type: "heading",
        id: "what-is-a-minute-book",
        text: "What a minute book is",
      },
      {
        type: "paragraph",
        text: "Despite the name, a minute book is not only a collection of meeting minutes. It is the organized archive of every document that establishes the corporation's legal status, who owns its shares, who sits on its board, and what its directors and shareholders have decided. Small private corporations rarely hold formal meetings; most of their decisions are made by written resolutions signed by all the directors or all the shareholders, and both statutes treat those resolutions as being as valid as a resolution passed at a meeting (CBCA ss. 117 and 142; OBCA ss. 129 and 104). Those signed resolutions are what fill most minute books.",
      },
      {
        type: "paragraph",
        text: "The term minute book is not itself used in either statute. The CBCA and the OBCA speak of records and registers that a corporation must prepare and maintain. In practice, lawyers, accountants, banks and buyers all use minute book to mean that complete set of records, whether it is kept in a physical binder or in a digital system.",
      },
      {
        type: "heading",
        id: "legal-basis",
        text: "The legal requirement: CBCA section 20 and OBCA section 140",
      },
      {
        type: "paragraph",
        text: "Section 20(1) of the CBCA requires a federal corporation to prepare and maintain records containing its articles and by-laws and all amendments, a copy of any unanimous shareholder agreement, the minutes of meetings and resolutions of shareholders, copies of the notices of directors and notices of change of directors it has sent to Corporations Canada, and a securities register that complies with section 50. Section 20(2) adds adequate accounting records and the minutes and resolutions of the directors and any committee of directors. Section 21.1 separately requires a register of individuals with significant control.",
      },
      {
        type: "paragraph",
        text: "Section 140(1) of the OBCA requires an Ontario corporation to prepare and maintain its articles, by-laws and amendments, a copy of any unanimous shareholder agreement known to the directors, the minutes and resolutions of shareholders, a register of directors, a securities register complying with section 141, a register of ownership interests in land in Ontario, and a register of individuals with significant control. Section 140(2) adds adequate accounting records and the minutes and resolutions of directors and their committees. Section 141(2) also requires a register of transfers recording every transfer of the corporation's registered securities.",
      },
      {
        type: "paragraph",
        text: "Both statutes allow the accounting records to be discarded after six years, subject to any longer retention period required by tax law or another statute (CBCA s. 20(2.1); OBCA s. 140(2)). The corporate records themselves, such as the articles, by-laws, minutes and registers, are kept for the life of the corporation.",
      },
      {
        type: "heading",
        id: "whats-inside",
        text: "What goes inside: the required records",
      },
      {
        type: "paragraph",
        text: "The table below sets out the records each statute requires and the section that requires them. The two lists are similar but not identical: the OBCA requires a register of directors and a register of land in Ontario, while the CBCA instead requires copies of the director notices filed with Corporations Canada.",
      },
      {
        type: "table",
        head: ["Record", "Federal (CBCA)", "Ontario (OBCA)"],
        rows: [
          ["Articles, by-laws and all amendments", "s. 20(1)(a)", "s. 140(1)(a)"],
          ["Copy of any unanimous shareholder agreement", "s. 20(1)(a)", "s. 140(1)(a), if known to the directors"],
          ["Minutes and resolutions of shareholders", "s. 20(1)(b)", "s. 140(1)(b)"],
          ["Minutes and resolutions of directors and committees", "s. 20(2)", "s. 140(2)(b)"],
          ["Directors", "Copies of notices of directors and of changes of directors, s. 20(1)(c)", "Register of directors with addresses and start and end dates, s. 140(1)(c)"],
          ["Securities register: holders, holdings, issues and transfers", "ss. 20(1)(d) and 50", "ss. 140(1)(d) and 141, plus a register of transfers, s. 141(2)"],
          ["Register of individuals with significant control", "s. 21.1, since June 13, 2019", "ss. 140(1)(f) and 140.2, since January 1, 2023"],
          ["Register of ownership interests in land in Ontario", "Not required", "ss. 140(1)(e) and 140.1"],
          ["Adequate accounting records", "s. 20(2), kept six years", "s. 140(2)(a), kept six years"],
        ],
      },
      {
        type: "paragraph",
        text: "Most minute books also contain documents that neither statute lists by name but that the corporation will be asked for: the certificate and articles of incorporation, a register of officers, share certificates or a share ledger, consents of directors to act, copies of annual returns and other filings, consents to dispense with an auditor, and any shareholder agreement that is not unanimous. Neither the CBCA nor the OBCA requires a register of officers, but keeping one is common practice because banks and buyers routinely ask who the officers are.",
        parts: [
          "Most minute books also contain documents that neither statute lists by name but that the corporation will be asked for: the ",
          { text: "certificate and articles of incorporation", href: "/guides/what-are-articles-of-incorporation" },
          ", a register of officers, share certificates or a share ledger, consents of directors to act, copies of annual returns and other filings, consents to dispense with an auditor, and any ",
          { text: "shareholder agreement", href: "/guides/shareholder-agreements-canada" },
          " that is not unanimous. Neither the CBCA nor the OBCA requires a register of officers, but keeping one is common practice because banks and buyers routinely ask who the officers are.",
        ],
      },
      {
        type: "heading",
        id: "isc-register",
        text: "The register of individuals with significant control",
      },
      {
        type: "paragraph",
        text: "The newest required record is the register of individuals with significant control (often called the ISC register or transparency register). Federal corporations have had to keep one since June 13, 2019. Ontario corporations have had to keep one since January 1, 2023. Corporations that are reporting issuers or listed on a designated stock exchange are exempt under both statutes, so the requirement falls almost entirely on private corporations.",
      },
      {
        type: "paragraph",
        text: "Under both statutes, an individual has significant control if they are the registered holder or beneficial owner of, or have direct or indirect control or direction over, a significant number of shares, meaning shares carrying 25% or more of the votes or equal to 25% or more of all outstanding shares measured by fair market value. An individual whose influence would result in control in fact of the corporation also qualifies, even without a 25% holding (CBCA s. 2.1; OBCA s. 1.1).",
      },
      {
        type: "list",
        items: [
          "Contents: each individual's name, date of birth and address, their jurisdiction of residence for tax purposes, the date they became or ceased to be an individual with significant control, a description of how they have significant control, and a description of the steps the corporation took to keep the register current. The federal register must also record citizenship.",
          "Annual review: at least once in each financial year, the corporation must take reasonable steps to confirm it has identified every individual with significant control and that the register is accurate and complete (CBCA s. 21.1(2); OBCA s. 140.2(3)).",
          "Updates: new information must be recorded in the register within 15 days of the corporation becoming aware of it.",
          "Shareholders' duty: a shareholder asked for the information must reply accurately and completely, to the best of their knowledge.",
          "Disposal: personal information about a former individual with significant control must be disposed of within one year after the sixth anniversary of the day they ceased to have significant control.",
        ],
      },
      p(
        "The two regimes differ on who receives the information. Since January 22, 2024, a federal corporation must send information from its register to Corporations Canada every year, at the same time as its ",
        { text: "annual return", href: "/guides/corporate-annual-returns-canada" },
        ". The CBCA also requires it to send changes within 15 days after recording them in the register (CBCA s. 21.21). Corporations Canada makes some of that information public, such as each individual's name and an address, subject to limited exceptions. An Ontario corporation does not file its register with the government; it must provide it on request to police, tax officials and certain regulators (OBCA s. 140.3), and shareholders and creditors have no right to inspect it (OBCA s. 145(1)).",
      ),
      {
        type: "paragraph",
        text: "The penalties are significant. A federal corporation that fails to keep the register without reasonable cause is liable to a fine of up to $100,000, and a director or officer who knowingly permits a contravention or records false information faces a fine of up to $200,000 and up to two years' imprisonment on summary conviction, or up to $1,000,000 and five years on indictment (CBCA ss. 21.1(6) and 21.4). In Ontario, the corporation is liable to a fine of up to $5,000, and a director or officer who knowingly permits a contravention faces a fine of up to $200,000, up to six months' imprisonment, or both (OBCA s. 258.1).",
      },
      {
        type: "heading",
        id: "whose-job",
        text: "Where the records are kept, and who can see them",
      },
      {
        type: "paragraph",
        text: "The records must be kept at the corporation's registered office or at another place designated by the directors. For a federal corporation that other place must be in Canada; for an Ontario corporation it must be in Ontario. Both statutes allow records to be kept elsewhere (for a federal corporation, even outside Canada) as long as they can be inspected at the registered office by electronic means during regular office hours (CBCA s. 20(5.1); OBCA s. 144(3)). Ontario's register of land interests is the one exception: it must stay at the registered office.",
        parts: [
          "The records must be kept at the corporation's ",
          { text: "registered office", href: "/services/registered-office" },
          " or at another place designated by the directors. For a federal corporation that other place must be in Canada; for an Ontario corporation it must be in Ontario. Both statutes allow records to be kept elsewhere (for a federal corporation, even outside Canada) as long as they can be inspected at the registered office by electronic means during regular office hours (CBCA s. 20(5.1); OBCA s. 144(3)). Ontario's register of land interests is the one exception: it must stay at the registered office.",
        ],
      },
      {
        type: "paragraph",
        text: "Legal responsibility for the records rests with the corporation and, in practice, with its directors, who decide where the records are kept and who maintains them. Many corporations keep the minute book themselves; others have their lawyer or a corporate service provider maintain it. Either way, the directors remain accountable for it.",
      },
      {
        type: "list",
        items: [
          "Directors may examine the minutes of directors' meetings and the accounting records (CBCA s. 20(4)); under the OBCA, every record in sections 140 and 141 is open to any director during normal business hours (OBCA s. 144(1)).",
          "Shareholders and creditors, and their agents or legal representatives, may examine the records in CBCA s. 20(1) or OBCA s. 140(1) during usual business hours and take extracts free of charge. The OBCA extends this right to beneficial owners of shares.",
          "That right does not extend to the minutes and resolutions of directors or to the accounting records, which are not on either list.",
          "A shareholder of a federal corporation is entitled on request, without charge, to one copy of the articles, the by-laws and any unanimous shareholder agreement (CBCA s. 21(2)).",
        ],
      },
      {
        type: "heading",
        id: "paper-or-digital",
        text: "Paper or digital",
      },
      {
        type: "paragraph",
        text: "Neither statute requires a physical binder. The CBCA allows registers and records to be kept in bound or loose-leaf form, on film, or in any electronic system capable of reproducing the information in intelligible written form within a reasonable time (CBCA s. 22(1)). Since October 1, 2023, the OBCA states simply that a required record may be kept in any form (OBCA s. 139(1)).",
      },
      {
        type: "paragraph",
        text: "Whatever the format, the corporation must take reasonable precautions against loss, destruction and falsification of its records and be able to produce them in an accurate and intelligible form within a reasonable time to anyone entitled to see them (CBCA s. 22(2); OBCA s. 139(2)). A digital minute book usually means scanned or electronically signed documents, organized registers, and backups. A paper minute book usually means a dedicated binder with tabs for each register. Both are lawful; what matters is that the records are complete, current and retrievable.",
      },
      {
        type: "heading",
        id: "consequences",
        text: "What happens when records are missing",
      },
      {
        type: "paragraph",
        text: "A missing or incomplete minute book rarely causes a problem day to day. The problem surfaces at the moments that matter, when someone outside the corporation needs proof of who owns it and what it has decided:",
      },
      {
        type: "list",
        items: [
          "Sale of the business or its shares. A buyer's lawyer reviews the minute book during due diligence to confirm that every share was validly issued and transferred and that directors were properly elected. Gaps delay closing and can lead to price adjustments, special indemnities, or a deal that does not close.",
          "Bank accounts and financing. Banks and lenders commonly ask for the articles, the by-laws or resolutions authorizing signing officers, and confirmation of the directors, officers and individuals with significant control before opening accounts or advancing funds.",
          "CRA reviews. The Income Tax Regulations (s. 5800) require a corporation to keep the minutes of directors' and shareholders' meetings and its records of share ownership and transfers until two years after the corporation is dissolved. In an audit, the CRA may ask for the resolutions declaring dividends or approving other payments to shareholders.",
          "Shareholder disputes. When owners disagree about who holds what, the securities register and the resolutions are the starting evidence. Under the OBCA, information in a required record is admissible as proof of the facts it states, in the absence of evidence to the contrary (OBCA s. 139(3)).",
          "Offences. A federal corporation that fails without reasonable cause to keep the records in section 20 is liable to a fine of up to $5,000 (CBCA s. 20(6)), in addition to the register penalties above.",
        ],
      },
      {
        type: "paragraph",
        text: "Rebuilding a minute book years later is slower and costlier than keeping it current. Former directors may be unavailable to sign, the dates and terms of past share issuances may be undocumented, and some gaps can only be addressed by ratifying resolutions or, in difficult cases, a court application. A corporate lawyer is the right person to assess what can be corrected in a particular case.",
      },
      {
        type: "heading",
        id: "annual-maintenance",
        text: "Annual maintenance",
      },
      {
        type: "paragraph",
        text: "For most small corporations, keeping the minute book current comes down to one annual package of resolutions plus updates whenever something changes. A typical year looks like this:",
      },
      {
        type: "list",
        items: [
          "Hold the annual shareholders' meeting, or have all voting shareholders sign written resolutions in its place. The first must take place within 18 months of incorporation and each later one within 15 months of the last (CBCA s. 133; OBCA s. 94). A federal corporation must also hold it no later than six months after the end of its preceding financial year.",
          "Place the financial statements before the shareholders (CBCA s. 155; OBCA s. 154) and record their approval by the directors.",
          "Elect or confirm the directors, and either appoint an auditor or record the consent of all shareholders to dispense with one, which is available only to corporations that do not offer securities to the public (CBCA s. 163; OBCA s. 148).",
          "Pass the directors' resolutions for the year, such as appointing officers and, where applicable, declaring dividends.",
          "Review the register of individuals with significant control, as both statutes require at least once each financial year, and record the steps taken.",
          "File the annual return: federal corporations within 60 days after their anniversary date ($12 online); Ontario corporations within six months after the end of their fiscal year (no government fee).",
        ],
      },
      p(
        "Changes during the year are recorded as they happen. When a director joins or leaves, the minute book records the resolution and consent, the registers are updated, and a notice is filed with the registry; a federal corporation must send its notice of change of directors within 15 days (CBCA s. 113). When shares are issued or transferred, the securities register, the register of transfers and the ISC register are updated together. Korporex handles ",
        { text: "director changes", href: "/services/change-director" },
        " and ",
        { text: "shareholder changes", href: "/services/change-shareholder" },
        " online, along with the annual package for ",
        { text: "federal corporations", href: "/services/annual-resolution-federal" },
        " and ",
        { text: "Ontario corporations", href: "/services/annual-resolution-on" },
        ".",
      ),
      {
        type: "callout",
        title: "A simple discipline",
        text: "Many owners add the corresponding resolution to the minute book within a few weeks every time the corporation does something meaningful: issuing shares, appointing a director, changing its fiscal year-end, passing a by-law or paying a dividend. A minute book kept current takes minutes a year. One kept when there is time tends to stay unfinished until a buyer or a bank asks for it.",
      },
      {
        type: "heading",
        id: "getting-started",
        text: "Setting up a minute book",
      },
      p(
        "A minute book is normally organized right after incorporation with a set of organizational documents: the general by-law, the directors' resolutions adopting it and issuing the first shares, the subscriptions for those shares, consents of directors to act, the first registers, and the shareholders' resolutions confirming the by-law and electing directors. When you ",
        { text: "incorporate with Korporex", href: "/incorporate" },
        ", the minute book is set up as part of the filing. For an existing corporation that never had one, or whose records stopped years ago, Korporex prepares an ",
        { text: "initial minute book", href: "/services/initial-minute-book" },
        " built from the corporation's articles and current ownership. Where past transactions are disputed or undocumented, a corporate lawyer can advise on what is needed to regularize them.",
      ),
    ],
    faq: [
      {
        q: "Is a minute book legally required in Canada?",
        a: "Yes. Federal corporations must keep the records listed in section 20 of the Canada Business Corporations Act and a register of individuals with significant control under section 21.1. Ontario corporations must keep the records listed in section 140 of the Business Corporations Act, including the significant control register under section 140.2. Together, those records are what people call the minute book.",
      },
      {
        q: "Can a minute book be kept digitally?",
        a: "Yes. The CBCA allows records to be kept in any electronic system that can reproduce them in intelligible written form within a reasonable time, and the OBCA allows required records to be kept in any form. In either case, the corporation must take reasonable precautions against loss and falsification and be able to produce the records promptly to anyone entitled to inspect them.",
      },
      {
        q: "Where does the minute book have to be kept?",
        a: "At the registered office or another place the directors designate, in Canada for a federal corporation and in Ontario for an Ontario corporation. Both statutes also allow records to be kept elsewhere if they can be inspected at the registered office by electronic means during regular office hours. Ontario's register of land interests must stay at the registered office.",
      },
      {
        q: "Can shareholders see the minute book?",
        a: "Shareholders and creditors may examine the articles, by-laws, unanimous shareholder agreements, shareholder minutes and resolutions, and the securities and director records, free of charge, during usual business hours. They have no statutory right to the directors' minutes or the accounting records. In Ontario, they also cannot inspect the register of individuals with significant control.",
      },
      {
        q: "What happens if my corporation never set up a minute book?",
        a: "Nothing happens immediately, which is why gaps go unnoticed. The problem appears when a buyer, lender, bank or the CRA asks for proof of ownership and decisions. Missing records can usually be prepared from the articles and current ownership, while undocumented past transactions may need ratifying resolutions. A corporate lawyer can assess gaps that cannot simply be documented now.",
      },
      {
        q: "How long must minute book records be kept?",
        a: "The articles, by-laws, minutes, resolutions and registers are kept for the life of the corporation. Accounting records may be discarded after six years, subject to longer tax retention rules. Under the Income Tax Regulations, the minutes of directors and shareholders and the share ownership records must be kept until two years after the corporation is dissolved.",
      },
    ],
  },

  // ── French ──
  fr: {
    readTime: "13 min de lecture",
    content: [
      {
        type: "paragraph",
        text: "Le livre des procès-verbaux est l'ensemble des registres qu'une société canadienne est légalement tenue de conserver sur sa propre existence, sa propriété et ses décisions. Il contient les statuts et les règlements administratifs, les procès-verbaux et les résolutions écrites des administrateurs et des actionnaires, les registres des administrateurs et des valeurs mobilières, ainsi que le registre des particuliers ayant un contrôle important. Pour une société fédérale, la liste de base figure à l'article 20 de la Loi canadienne sur les sociétés par actions (LCSA); pour une société ontarienne, à l'article 140 de la Loi sur les sociétés par actions de l'Ontario (LSAO). L'obligation commence le jour de la constitution et dure aussi longtemps que la société existe.",
      },
      {
        type: "callout",
        title: "Il n'est pas déposé auprès du gouvernement",
        text: "Le livre des procès-verbaux est tenu par la société elle-même, et non par Corporations Canada ou le Registre des entreprises de l'Ontario. Le registre public conserve les documents déposés, comme les statuts, les déclarations annuelles et les avis de modification. Le livre des procès-verbaux contient les documents internes qui prouvent que ces dépôts, et toutes les autres décisions de la société, ont été dûment autorisés.",
      },
      {
        type: "heading",
        id: "ce-que-cest",
        text: "Ce qu'est un livre des procès-verbaux",
      },
      {
        type: "paragraph",
        text: "Malgré son nom, le livre des procès-verbaux n'est pas seulement un recueil de procès-verbaux de réunions. C'est l'archive organisée de tous les documents qui établissent le statut juridique de la société, qui détient ses actions, qui siège à son conseil et ce que ses administrateurs et actionnaires ont décidé. Les petites sociétés fermées tiennent rarement des réunions formelles; la plupart de leurs décisions sont prises par résolutions écrites signées par tous les administrateurs ou tous les actionnaires, et les deux lois reconnaissent à ces résolutions la même validité qu'une résolution adoptée en réunion (LCSA, art. 117 et 142; LSAO, art. 129 et 104). Ces résolutions signées remplissent l'essentiel de la plupart des livres.",
      },
      {
        type: "paragraph",
        text: "L'expression livre des procès-verbaux ne figure dans aucune des deux lois. La LCSA et la LSAO parlent de livres et de registres que la société doit préparer et tenir. En pratique, avocats, comptables, banques et acheteurs utilisent tous cette expression pour désigner l'ensemble complet de ces documents, qu'il soit conservé dans un classeur physique ou dans un système numérique.",
      },
      {
        type: "heading",
        id: "fondement-legal",
        text: "L'obligation légale : l'article 20 de la LCSA et l'article 140 de la LSAO",
      },
      {
        type: "paragraph",
        text: "Le paragraphe 20(1) de la LCSA oblige la société fédérale à préparer et à tenir des livres contenant ses statuts et ses règlements administratifs ainsi que leurs modifications, une copie de toute convention unanime des actionnaires, les procès-verbaux des assemblées et les résolutions des actionnaires, des copies des listes des administrateurs et des avis de changement d'administrateurs envoyés à Corporations Canada, et un registre des valeurs mobilières conforme à l'article 50. Le paragraphe 20(2) ajoute une comptabilité adéquate ainsi que les procès-verbaux des réunions et les résolutions des administrateurs et de tout comité. L'article 21.1 exige en outre un registre des particuliers ayant un contrôle important.",
      },
      {
        type: "paragraph",
        text: "Le paragraphe 140(1) de la LSAO oblige la société ontarienne à préparer et à tenir ses statuts, ses règlements administratifs et leurs modifications, une copie de toute convention unanime des actionnaires dont les administrateurs ont connaissance, les procès-verbaux et les résolutions des actionnaires, un registre des administrateurs, un registre des valeurs mobilières conforme à l'article 141, un registre des droits de propriété sur des biens-fonds situés en Ontario et un registre des particuliers ayant un contrôle important. Le paragraphe 140(2) ajoute une comptabilité adéquate ainsi que les procès-verbaux et les résolutions des administrateurs et de leurs comités. Le paragraphe 141(2) exige aussi un registre des transferts consignant chaque transfert des valeurs mobilières nominatives de la société.",
      },
      {
        type: "paragraph",
        text: "Les deux lois permettent de se défaire des documents comptables après six ans, sous réserve de toute période de conservation plus longue exigée par le droit fiscal ou une autre loi (LCSA, par. 20(2.1); LSAO, par. 140(2)). Les documents sociaux eux-mêmes, comme les statuts, les règlements, les procès-verbaux et les registres, sont conservés pendant toute la vie de la société.",
      },
      {
        type: "heading",
        id: "ce-quon-y-trouve",
        text: "Ce qu'on y trouve : les registres obligatoires",
      },
      {
        type: "paragraph",
        text: "Le tableau ci-dessous présente les documents exigés par chaque loi et la disposition qui les exige. Les deux listes se ressemblent sans être identiques : la LSAO exige un registre des administrateurs et un registre des biens-fonds en Ontario, tandis que la LCSA exige plutôt des copies des avis relatifs aux administrateurs déposés auprès de Corporations Canada.",
      },
      {
        type: "table",
        head: ["Document", "Fédéral (LCSA)", "Ontario (LSAO)"],
        rows: [
          ["Statuts, règlements administratifs et leurs modifications", "al. 20(1)a)", "al. 140(1)a)"],
          ["Copie de toute convention unanime des actionnaires", "al. 20(1)a)", "al. 140(1)a), si les administrateurs en ont connaissance"],
          ["Procès-verbaux et résolutions des actionnaires", "al. 20(1)b)", "al. 140(1)b)"],
          ["Procès-verbaux et résolutions des administrateurs et des comités", "par. 20(2)", "al. 140(2)b)"],
          ["Administrateurs", "Copies des listes des administrateurs et des avis de changement, al. 20(1)c)", "Registre des administrateurs, avec adresses et dates d'entrée et de sortie, al. 140(1)c)"],
          ["Registre des valeurs mobilières : détenteurs, avoirs, émissions et transferts", "al. 20(1)d) et art. 50", "al. 140(1)d) et art. 141, plus un registre des transferts, par. 141(2)"],
          ["Registre des particuliers ayant un contrôle important", "art. 21.1, depuis le 13 juin 2019", "al. 140(1)f) et art. 140.2, depuis le 1er janvier 2023"],
          ["Registre des droits de propriété sur des biens-fonds en Ontario", "Non exigé", "al. 140(1)e) et art. 140.1"],
          ["Comptabilité adéquate", "par. 20(2), conservée six ans", "al. 140(2)a), conservée six ans"],
        ],
      },
      {
        type: "paragraph",
        text: "La plupart des livres contiennent aussi des documents qu'aucune des deux lois ne nomme, mais que l'on demandera à la société : le certificat et les statuts constitutifs, un registre des dirigeants, les certificats d'actions ou un grand livre des actions, les consentements des administrateurs à agir, les copies des déclarations annuelles et autres dépôts, les consentements à se dispenser de vérificateur et toute convention d'actionnaires qui n'est pas unanime. Ni la LCSA ni la LSAO n'exigent de registre des dirigeants, mais il est d'usage d'en tenir un, car les banques et les acheteurs demandent systématiquement qui sont les dirigeants.",
        parts: [
          "La plupart des livres contiennent aussi des documents qu'aucune des deux lois ne nomme, mais que l'on demandera à la société : le ",
          { text: "certificat et les statuts constitutifs", href: "/guides/que-sont-les-statuts-constitutifs" },
          ", un registre des dirigeants, les certificats d'actions ou un grand livre des actions, les consentements des administrateurs à agir, les copies des déclarations annuelles et autres dépôts, les consentements à se dispenser de vérificateur et toute ",
          { text: "convention d'actionnaires", href: "/guides/convention-actionnaires-canada" },
          " qui n'est pas unanime. Ni la LCSA ni la LSAO n'exigent de registre des dirigeants, mais il est d'usage d'en tenir un, car les banques et les acheteurs demandent systématiquement qui sont les dirigeants.",
        ],
      },
      {
        type: "heading",
        id: "registre-pci",
        text: "Le registre des particuliers ayant un contrôle important",
      },
      {
        type: "paragraph",
        text: "Le document obligatoire le plus récent est le registre des particuliers ayant un contrôle important (souvent appelé registre des PCI ou registre de transparence). Les sociétés fédérales doivent en tenir un depuis le 13 juin 2019, et les sociétés ontariennes depuis le 1er janvier 2023. Les deux lois exemptent les émetteurs assujettis et les sociétés inscrites à une bourse de valeurs désignée, de sorte que l'obligation vise presque exclusivement les sociétés fermées.",
      },
      {
        type: "paragraph",
        text: "Selon les deux lois, un particulier a un contrôle important s'il est le détenteur inscrit ou le véritable propriétaire d'un nombre important d'actions, ou s'il exerce directement ou indirectement un contrôle ou une emprise sur celles-ci. Un nombre important d'actions s'entend d'actions conférant 25 % ou plus des droits de vote, ou correspondant à 25 % ou plus de toutes les actions en circulation selon leur juste valeur marchande. Un particulier dont l'influence, si elle était exercée, entraînerait le contrôle de fait de la société est aussi visé, même sans détenir 25 % (LCSA, art. 2.1; LSAO, art. 1.1).",
      },
      {
        type: "list",
        items: [
          "Contenu : le nom, la date de naissance et l'adresse de chaque particulier, son territoire de résidence aux fins fiscales, la date à laquelle il est devenu ou a cessé d'être un particulier ayant un contrôle important, une description de la manière dont il exerce ce contrôle, et une description des mesures prises par la société pour tenir le registre à jour. Le registre fédéral doit aussi indiquer la citoyenneté.",
          "Revue annuelle : au moins une fois par exercice, la société doit prendre des mesures raisonnables pour s'assurer d'avoir identifié tous les particuliers ayant un contrôle important et que le registre est exact et complet (LCSA, par. 21.1(2); LSAO, par. 140.2(3)).",
          "Mises à jour : tout nouveau renseignement doit être inscrit au registre dans les 15 jours suivant le moment où la société en prend connaissance.",
          "Obligation des actionnaires : l'actionnaire à qui la société demande ces renseignements doit répondre de façon exacte et complète, au mieux de sa connaissance.",
          "Destruction : les renseignements personnels d'un ancien particulier ayant un contrôle important doivent être détruits dans l'année suivant le sixième anniversaire du jour où il a cessé d'avoir ce contrôle.",
        ],
      },
      p(
        "Les deux régimes diffèrent quant au destinataire des renseignements. Depuis le 22 janvier 2024, la société fédérale doit transmettre chaque année des renseignements tirés de son registre à Corporations Canada, en même temps que sa ",
        { text: "déclaration annuelle", href: "/guides/declarations-annuelles-societes-canada" },
        ". La LCSA l'oblige aussi à transmettre les changements dans les 15 jours suivant leur inscription au registre (LCSA, art. 21.21). Corporations Canada rend publique une partie de ces renseignements, comme le nom et une adresse de chaque particulier, sous réserve d'exceptions limitées. La société ontarienne ne dépose pas son registre auprès du gouvernement; elle doit le fournir sur demande à la police, aux fonctionnaires fiscaux et à certains organismes de réglementation (LSAO, art. 140.3), et les actionnaires et créanciers n'ont aucun droit de le consulter (LSAO, par. 145(1)).",
      ),
      {
        type: "paragraph",
        text: "Les sanctions sont importantes. La société fédérale qui, sans motif raisonnable, ne tient pas le registre est passible d'une amende maximale de 100 000 $, et l'administrateur ou le dirigeant qui, sciemment, autorise une contravention ou inscrit de faux renseignements encourt une amende maximale de 200 000 $ et un emprisonnement maximal de deux ans sur déclaration de culpabilité par procédure sommaire, ou une amende maximale de 1 000 000 $ et cinq ans de prison sur mise en accusation (LCSA, par. 21.1(6) et art. 21.4). En Ontario, la société est passible d'une amende maximale de 5 000 $, et l'administrateur ou le dirigeant qui autorise sciemment une contravention encourt une amende maximale de 200 000 $, un emprisonnement maximal de six mois, ou les deux (LSAO, art. 258.1).",
      },
      {
        type: "heading",
        id: "ou-et-qui",
        text: "Où les registres sont conservés et qui peut les consulter",
      },
      {
        type: "paragraph",
        text: "Les registres doivent être conservés au siège social de la société ou en un autre lieu désigné par les administrateurs. Pour une société fédérale, cet autre lieu doit être au Canada; pour une société ontarienne, en Ontario. Les deux lois permettent de conserver les registres ailleurs (pour une société fédérale, même à l'extérieur du Canada), à condition qu'ils puissent être consultés au siège social par des moyens électroniques pendant les heures normales de bureau (LCSA, par. 20(5.1); LSAO, par. 144(3)). Le registre ontarien des biens-fonds fait exception : il doit demeurer au siège social.",
        parts: [
          "Les registres doivent être conservés au ",
          { text: "siège social", href: "/services/registered-office" },
          " de la société ou en un autre lieu désigné par les administrateurs. Pour une société fédérale, cet autre lieu doit être au Canada; pour une société ontarienne, en Ontario. Les deux lois permettent de conserver les registres ailleurs (pour une société fédérale, même à l'extérieur du Canada), à condition qu'ils puissent être consultés au siège social par des moyens électroniques pendant les heures normales de bureau (LCSA, par. 20(5.1); LSAO, par. 144(3)). Le registre ontarien des biens-fonds fait exception : il doit demeurer au siège social.",
        ],
      },
      {
        type: "paragraph",
        text: "La responsabilité juridique des registres incombe à la société et, en pratique, à ses administrateurs, qui décident où ils sont conservés et qui les tient. Beaucoup de sociétés tiennent elles-mêmes leur livre des procès-verbaux; d'autres le confient à leur avocat ou à un fournisseur de services aux entreprises. Dans un cas comme dans l'autre, les administrateurs en demeurent responsables.",
      },
      {
        type: "list",
        items: [
          "Les administrateurs peuvent consulter les procès-verbaux des réunions du conseil et la comptabilité (LCSA, par. 20(4)); selon la LSAO, tous les documents visés aux articles 140 et 141 sont accessibles à tout administrateur pendant les heures normales d'ouverture (LSAO, par. 144(1)).",
          "Les actionnaires et les créanciers, ainsi que leurs mandataires ou représentants légaux, peuvent consulter gratuitement les documents visés au par. 20(1) de la LCSA ou au par. 140(1) de la LSAO pendant les heures normales d'ouverture et en tirer des extraits. La LSAO étend ce droit aux véritables propriétaires d'actions.",
          "Ce droit ne s'étend pas aux procès-verbaux et résolutions des administrateurs ni à la comptabilité, qui ne figurent sur aucune des deux listes.",
          "L'actionnaire d'une société fédérale a droit, sur demande et sans frais, à un exemplaire des statuts, des règlements administratifs et de toute convention unanime des actionnaires (LCSA, par. 21(2)).",
        ],
      },
      {
        type: "heading",
        id: "papier-ou-numerique",
        text: "Papier ou numérique",
      },
      {
        type: "paragraph",
        text: "Aucune des deux lois n'exige de classeur physique. La LCSA permet de tenir les registres et livres sous forme reliée ou à feuilles mobiles, sur film, ou au moyen de tout système électronique capable de reproduire les renseignements sous une forme écrite compréhensible dans un délai raisonnable (LCSA, par. 22(1)). Depuis le 1er octobre 2023, la LSAO prévoit simplement qu'un document exigé peut être tenu sous n'importe quelle forme (LSAO, par. 139(1)).",
      },
      {
        type: "paragraph",
        text: "Quel que soit le format, la société doit prendre des précautions raisonnables contre la perte, la destruction et la falsification de ses registres, et pouvoir les produire sous une forme exacte et compréhensible dans un délai raisonnable à toute personne qui a le droit de les consulter (LCSA, par. 22(2); LSAO, par. 139(2)). Un livre numérique signifie généralement des documents numérisés ou signés électroniquement, des registres organisés et des sauvegardes. Un livre papier signifie généralement un classeur dédié, avec un onglet pour chaque registre. Les deux sont légaux; ce qui compte, c'est que les registres soient complets, à jour et accessibles.",
      },
      {
        type: "heading",
        id: "si-vous-negligez",
        text: "Ce qui arrive quand des registres manquent",
      },
      {
        type: "paragraph",
        text: "Un livre des procès-verbaux manquant ou incomplet cause rarement un problème au quotidien. Le problème surgit aux moments qui comptent, lorsqu'une personne extérieure à la société a besoin de la preuve de qui la détient et de ce qu'elle a décidé :",
      },
      {
        type: "list",
        items: [
          "Vente de l'entreprise ou de ses actions. L'avocat de l'acheteur examine le livre des procès-verbaux lors de la vérification diligente pour confirmer que chaque action a été validement émise et transférée et que les administrateurs ont été dûment élus. Les lacunes retardent la clôture et peuvent entraîner des rajustements de prix, des indemnités particulières ou l'échec de la transaction.",
          "Comptes bancaires et financement. Les banques et les prêteurs demandent couramment les statuts, les règlements ou les résolutions autorisant les signataires, et la confirmation des administrateurs, des dirigeants et des particuliers ayant un contrôle important avant d'ouvrir un compte ou d'avancer des fonds.",
          "Examens de l'ARC. Le Règlement de l'impôt sur le revenu (art. 5800) oblige la société à conserver les procès-verbaux des réunions des administrateurs et des assemblées des actionnaires, ainsi que les registres de propriété et de transfert d'actions, jusqu'à deux ans après sa dissolution. Lors d'une vérification, l'ARC peut demander les résolutions déclarant des dividendes ou approuvant d'autres paiements aux actionnaires.",
          "Différends entre actionnaires. Lorsque les propriétaires ne s'entendent pas sur qui détient quoi, le registre des valeurs mobilières et les résolutions sont la preuve de départ. Selon la LSAO, les renseignements consignés dans un document exigé sont admissibles en preuve des faits qui y sont énoncés, en l'absence de preuve contraire (LSAO, par. 139(3)).",
          "Infractions. La société fédérale qui, sans motif raisonnable, ne tient pas les documents prévus à l'article 20 est passible d'une amende maximale de 5 000 $ (LCSA, par. 20(6)), en plus des sanctions liées au registre décrites ci-dessus.",
        ],
      },
      {
        type: "paragraph",
        text: "Reconstituer un livre des procès-verbaux des années plus tard est plus lent et plus coûteux que de le tenir à jour. D'anciens administrateurs peuvent ne plus être disponibles pour signer, les dates et modalités d'émissions d'actions passées peuvent n'être documentées nulle part, et certaines lacunes ne peuvent être corrigées que par des résolutions de ratification ou, dans les cas difficiles, par une demande au tribunal. Un avocat en droit des sociétés est la bonne personne pour évaluer ce qui peut être corrigé dans un cas précis.",
      },
      {
        type: "heading",
        id: "le-tenir-a-jour",
        text: "Le tenir à jour chaque année",
      },
      {
        type: "paragraph",
        text: "Pour la plupart des petites sociétés, tenir le livre à jour se résume à un ensemble annuel de résolutions, plus des mises à jour chaque fois que quelque chose change. Une année type se présente ainsi :",
      },
      {
        type: "list",
        items: [
          "Tenir l'assemblée annuelle des actionnaires, ou faire signer par tous les actionnaires votants des résolutions écrites qui en tiennent lieu. La première doit avoir lieu dans les 18 mois suivant la constitution et chacune des suivantes dans les 15 mois suivant la précédente (LCSA, art. 133; LSAO, art. 94). La société fédérale doit aussi la tenir au plus tard six mois après la fin de son exercice précédent.",
          "Présenter les états financiers aux actionnaires (LCSA, art. 155; LSAO, art. 154) et consigner leur approbation par les administrateurs.",
          "Élire ou confirmer les administrateurs, et soit nommer un vérificateur, soit consigner le consentement de tous les actionnaires à s'en dispenser, possibilité réservée aux sociétés qui ne font pas appel public à l'épargne (LCSA, art. 163; LSAO, art. 148).",
          "Adopter les résolutions des administrateurs pour l'année, comme la nomination des dirigeants et, s'il y a lieu, la déclaration de dividendes.",
          "Revoir le registre des particuliers ayant un contrôle important, comme les deux lois l'exigent au moins une fois par exercice, et consigner les mesures prises.",
          "Produire la déclaration annuelle : les sociétés fédérales dans les 60 jours suivant leur date anniversaire (12 $ en ligne); les sociétés ontariennes dans les six mois suivant la fin de leur exercice (aucuns droits gouvernementaux).",
        ],
      },
      p(
        "Les changements survenus en cours d'année sont consignés au fur et à mesure. Quand un administrateur arrive ou part, le livre consigne la résolution et le consentement, les registres sont mis à jour et un avis est déposé auprès du registre; la société fédérale doit envoyer son avis de changement d'administrateurs dans les 15 jours (LCSA, art. 113). Quand des actions sont émises ou transférées, le registre des valeurs mobilières, le registre des transferts et le registre des PCI sont mis à jour ensemble. Korporex traite en ligne les ",
        { text: "changements d'administrateurs", href: "/services/change-director" },
        " et les ",
        { text: "changements d'actionnaires", href: "/services/change-shareholder" },
        ", ainsi que l'ensemble annuel de résolutions pour les ",
        { text: "sociétés fédérales", href: "/services/annual-resolution-federal" },
        " et les ",
        { text: "sociétés ontariennes", href: "/services/annual-resolution-on" },
        ".",
      ),
      {
        type: "callout",
        title: "Une discipline simple",
        text: "Beaucoup de propriétaires ajoutent la résolution correspondante au livre dans les semaines qui suivent chaque fois que la société pose un geste important : émettre des actions, nommer un administrateur, changer la fin de son exercice, adopter un règlement ou verser un dividende. Un livre tenu à jour demande quelques minutes par année. Un livre tenu « quand on aura le temps » reste généralement inachevé jusqu'à ce qu'un acheteur ou une banque le demande.",
      },
      {
        type: "heading",
        id: "mise-en-place",
        text: "Mettre en place un livre des procès-verbaux",
      },
      p(
        "Le livre des procès-verbaux est normalement organisé juste après la constitution avec un ensemble de documents d'organisation : le règlement administratif général, les résolutions des administrateurs qui l'adoptent et émettent les premières actions, les souscriptions de ces actions, les consentements des administrateurs à agir, les premiers registres, et les résolutions des actionnaires qui ratifient le règlement et élisent les administrateurs. Lorsque vous ",
        { text: "vous constituez en société avec Korporex", href: "/incorporate" },
        ", le livre est mis en place dans le cadre du dépôt. Pour une société existante qui n'en a jamais eu, ou dont les registres se sont arrêtés il y a des années, Korporex prépare un ",
        { text: "livre des procès-verbaux initial", href: "/services/initial-minute-book" },
        " établi à partir des statuts et de l'actionnariat actuel. Lorsque des opérations passées sont contestées ou non documentées, un avocat en droit des sociétés peut indiquer ce qu'il faut pour les régulariser.",
      ),
    ],
    faq: [
      {
        q: "Le livre des procès-verbaux est-il obligatoire au Canada ?",
        a: "Oui. Les sociétés fédérales doivent tenir les documents énumérés à l'article 20 de la Loi canadienne sur les sociétés par actions et un registre des particuliers ayant un contrôle important en vertu de l'article 21.1. Les sociétés ontariennes doivent tenir les documents énumérés à l'article 140 de la Loi sur les sociétés par actions, y compris le registre prévu à l'article 140.2. Ensemble, ces documents forment le livre des procès-verbaux.",
      },
      {
        q: "Peut-on tenir le livre des procès-verbaux en format numérique ?",
        a: "Oui. La LCSA permet de tenir les registres au moyen de tout système électronique capable de les reproduire sous une forme écrite compréhensible dans un délai raisonnable, et la LSAO permet de tenir les documents exigés sous n'importe quelle forme. Dans les deux cas, la société doit prendre des précautions raisonnables contre la perte et la falsification et pouvoir produire rapidement les registres à toute personne qui a le droit de les consulter.",
      },
      {
        q: "Où le livre des procès-verbaux doit-il être conservé ?",
        a: "Au siège social ou en un autre lieu désigné par les administrateurs, au Canada pour une société fédérale et en Ontario pour une société ontarienne. Les deux lois permettent aussi de conserver les registres ailleurs s'ils peuvent être consultés au siège social par des moyens électroniques pendant les heures normales de bureau. Le registre ontarien des biens-fonds doit demeurer au siège social.",
      },
      {
        q: "Les actionnaires peuvent-ils consulter le livre des procès-verbaux ?",
        a: "Les actionnaires et les créanciers peuvent consulter gratuitement, pendant les heures normales d'ouverture, les statuts, les règlements, les conventions unanimes, les procès-verbaux et résolutions des actionnaires, ainsi que les registres des valeurs mobilières et des administrateurs. La loi ne leur donne aucun droit sur les procès-verbaux du conseil ni sur la comptabilité. En Ontario, ils ne peuvent pas non plus consulter le registre des particuliers ayant un contrôle important.",
      },
      {
        q: "Que se passe-t-il si ma société n'a jamais eu de livre des procès-verbaux ?",
        a: "Rien dans l'immédiat, et c'est pourquoi les lacunes passent inaperçues. Le problème apparaît quand un acheteur, un prêteur, une banque ou l'ARC demande une preuve de la propriété et des décisions. Les documents manquants peuvent généralement être préparés à partir des statuts et de l'actionnariat actuel, tandis que les opérations passées non documentées peuvent exiger des résolutions de ratification. Un avocat peut évaluer les autres lacunes.",
      },
      {
        q: "Combien de temps faut-il conserver les documents du livre ?",
        a: "Les statuts, règlements, procès-verbaux, résolutions et registres sont conservés pendant toute la vie de la société. La comptabilité peut être détruite après six ans, sous réserve de règles fiscales plus longues. Selon le Règlement de l'impôt sur le revenu, les procès-verbaux des administrateurs et des actionnaires et les registres de propriété des actions doivent être conservés jusqu'à deux ans après la dissolution de la société.",
      },
    ],
  },

  // ── Spanish ──
  es: {
    readTime: "13 min de lectura",
    content: [
      {
        type: "paragraph",
        text: "El libro de actas es el conjunto de registros que una sociedad canadiense está legalmente obligada a llevar sobre su propia existencia, su propiedad y sus decisiones. Contiene los estatutos y los reglamentos internos, las actas y las resoluciones escritas de los directores y de los accionistas, los registros de directores y de valores, y el registro de personas con control significativo. Para una sociedad federal, la lista básica está en el artículo 20 de la Ley de Sociedades por Acciones de Canadá (CBCA); para una sociedad de Ontario, en el artículo 140 de la Ley de Sociedades por Acciones de Ontario (OBCA). La obligación empieza el día de la constitución y dura mientras la sociedad exista.",
      },
      {
        type: "callout",
        title: "No se presenta ante el gobierno",
        text: "El libro de actas lo lleva la propia sociedad, no Corporations Canada ni el Registro de Empresas de Ontario. El registro público guarda los documentos presentados, como los estatutos, las declaraciones anuales y los avisos de cambio. El libro de actas contiene los documentos internos que prueban que esas presentaciones, y todas las demás decisiones de la sociedad, se autorizaron debidamente.",
      },
      {
        type: "heading",
        id: "que-es",
        text: "Qué es un libro de actas",
      },
      {
        type: "paragraph",
        text: "A pesar del nombre, el libro de actas no es solo una colección de actas de reuniones. Es el archivo organizado de todos los documentos que establecen la situación jurídica de la sociedad, quién posee sus acciones, quién integra su consejo y qué han decidido sus directores y accionistas. Las sociedades privadas pequeñas rara vez celebran reuniones formales; la mayoría de sus decisiones se toman mediante resoluciones escritas firmadas por todos los directores o todos los accionistas, y ambas leyes reconocen a esas resoluciones la misma validez que a una resolución aprobada en reunión (CBCA, arts. 117 y 142; OBCA, arts. 129 y 104). Esas resoluciones firmadas llenan la mayor parte de los libros.",
      },
      {
        type: "paragraph",
        text: "La expresión libro de actas no aparece en ninguna de las dos leyes. La CBCA y la OBCA hablan de registros que la sociedad debe preparar y mantener. En la práctica, abogados, contadores, bancos y compradores usan la expresión para referirse a ese conjunto completo de registros, ya sea que se guarde en una carpeta física o en un sistema digital.",
      },
      {
        type: "heading",
        id: "base-legal",
        text: "La obligación legal: el artículo 20 de la CBCA y el artículo 140 de la OBCA",
      },
      {
        type: "paragraph",
        text: "El artículo 20(1) de la CBCA obliga a la sociedad federal a preparar y mantener registros que contengan sus estatutos y reglamentos internos y todas sus modificaciones, una copia de cualquier acuerdo unánime de accionistas, las actas de las asambleas y las resoluciones de los accionistas, copias de los avisos de directores y de cambio de directores enviados a Corporations Canada, y un registro de valores conforme al artículo 50. El artículo 20(2) añade una contabilidad adecuada y las actas y resoluciones de los directores y de cualquier comité. El artículo 21.1 exige además un registro de personas con control significativo.",
      },
      {
        type: "paragraph",
        text: "El artículo 140(1) de la OBCA obliga a la sociedad de Ontario a preparar y mantener sus estatutos, reglamentos internos y modificaciones, una copia de cualquier acuerdo unánime de accionistas que conozcan los directores, las actas y resoluciones de los accionistas, un registro de directores, un registro de valores conforme al artículo 141, un registro de derechos de propiedad sobre inmuebles en Ontario y un registro de personas con control significativo. El artículo 140(2) añade una contabilidad adecuada y las actas y resoluciones de los directores y sus comités. El artículo 141(2) exige también un registro de transferencias que consigne cada transferencia de los valores nominativos de la sociedad.",
      },
      {
        type: "paragraph",
        text: "Ambas leyes permiten desechar los registros contables después de seis años, sujeto a cualquier plazo de conservación más largo que exija la ley tributaria u otra ley (CBCA, art. 20(2.1); OBCA, art. 140(2)). Los registros societarios en sí, como los estatutos, los reglamentos, las actas y los registros, se conservan durante toda la vida de la sociedad.",
      },
      {
        type: "heading",
        id: "que-contiene",
        text: "Qué contiene: los registros obligatorios",
      },
      {
        type: "paragraph",
        text: "La tabla siguiente muestra los registros que exige cada ley y la disposición que los exige. Las dos listas se parecen, pero no son idénticas: la OBCA exige un registro de directores y un registro de inmuebles en Ontario, mientras que la CBCA exige en su lugar copias de los avisos sobre directores presentados ante Corporations Canada.",
      },
      {
        type: "table",
        head: ["Registro", "Federal (CBCA)", "Ontario (OBCA)"],
        rows: [
          ["Estatutos, reglamentos internos y todas sus modificaciones", "art. 20(1)(a)", "art. 140(1)(a)"],
          ["Copia de cualquier acuerdo unánime de accionistas", "art. 20(1)(a)", "art. 140(1)(a), si lo conocen los directores"],
          ["Actas y resoluciones de los accionistas", "art. 20(1)(b)", "art. 140(1)(b)"],
          ["Actas y resoluciones de los directores y de los comités", "art. 20(2)", "art. 140(2)(b)"],
          ["Directores", "Copias de los avisos de directores y de cambio de directores, art. 20(1)(c)", "Registro de directores con domicilios y fechas de inicio y cese, art. 140(1)(c)"],
          ["Registro de valores: titulares, tenencias, emisiones y transferencias", "arts. 20(1)(d) y 50", "arts. 140(1)(d) y 141, más un registro de transferencias, art. 141(2)"],
          ["Registro de personas con control significativo", "art. 21.1, desde el 13 de junio de 2019", "arts. 140(1)(f) y 140.2, desde el 1 de enero de 2023"],
          ["Registro de derechos de propiedad sobre inmuebles en Ontario", "No exigido", "arts. 140(1)(e) y 140.1"],
          ["Contabilidad adecuada", "art. 20(2), conservada seis años", "art. 140(2)(a), conservada seis años"],
        ],
      },
      {
        type: "paragraph",
        text: "La mayoría de los libros contienen además documentos que ninguna de las dos leyes nombra, pero que se le pedirán a la sociedad: el certificado y los estatutos de constitución, un registro de funcionarios, los certificados de acciones o un libro mayor de acciones, los consentimientos de los directores para actuar, las copias de las declaraciones anuales y otras presentaciones, los consentimientos para prescindir de auditor y cualquier convenio de accionistas que no sea unánime. Ni la CBCA ni la OBCA exigen un registro de funcionarios, pero es práctica común llevarlo, porque los bancos y los compradores preguntan sistemáticamente quiénes son los funcionarios.",
        parts: [
          "La mayoría de los libros contienen además documentos que ninguna de las dos leyes nombra, pero que se le pedirán a la sociedad: el ",
          { text: "certificado y los estatutos de constitución", href: "/guides/que-son-los-estatutos-de-constitucion" },
          ", un registro de funcionarios, los certificados de acciones o un libro mayor de acciones, los consentimientos de los directores para actuar, las copias de las declaraciones anuales y otras presentaciones, los consentimientos para prescindir de auditor y cualquier ",
          { text: "convenio de accionistas", href: "/guides/convenio-de-accionistas-canada" },
          " que no sea unánime. Ni la CBCA ni la OBCA exigen un registro de funcionarios, pero es práctica común llevarlo, porque los bancos y los compradores preguntan sistemáticamente quiénes son los funcionarios.",
        ],
      },
      {
        type: "heading",
        id: "registro-isc",
        text: "El registro de personas con control significativo",
      },
      {
        type: "paragraph",
        text: "El registro obligatorio más reciente es el registro de personas con control significativo (a menudo llamado registro ISC o registro de transparencia). Las sociedades federales deben llevarlo desde el 13 de junio de 2019, y las sociedades de Ontario desde el 1 de enero de 2023. Ambas leyes eximen a los emisores sujetos a la regulación de valores y a las sociedades cotizadas en una bolsa de valores designada, de modo que la obligación recae casi por completo en las sociedades privadas.",
      },
      {
        type: "paragraph",
        text: "Según ambas leyes, una persona tiene control significativo si es titular registrada o propietaria beneficiaria de un número significativo de acciones, o si ejerce control o dirección, directa o indirectamente, sobre ellas. Un número significativo de acciones significa acciones con el 25 % o más de los derechos de voto, o equivalentes al 25 % o más de todas las acciones en circulación según su valor justo de mercado. También califica la persona cuya influencia, si se ejerciera, daría lugar al control de hecho de la sociedad, aunque no tenga el 25 % (CBCA, art. 2.1; OBCA, art. 1.1).",
      },
      {
        type: "list",
        items: [
          "Contenido: el nombre, la fecha de nacimiento y el domicilio de cada persona, su jurisdicción de residencia a efectos fiscales, la fecha en que pasó a tener o dejó de tener control significativo, una descripción de cómo ejerce ese control, y una descripción de las medidas que tomó la sociedad para mantener el registro al día. El registro federal también debe indicar la ciudadanía.",
          "Revisión anual: al menos una vez en cada ejercicio, la sociedad debe tomar medidas razonables para asegurarse de haber identificado a todas las personas con control significativo y de que el registro sea exacto y completo (CBCA, art. 21.1(2); OBCA, art. 140.2(3)).",
          "Actualizaciones: toda información nueva debe inscribirse en el registro dentro de los 15 días siguientes a que la sociedad tenga conocimiento de ella.",
          "Deber de los accionistas: el accionista al que se le pide esa información debe responder de forma exacta y completa, según su leal saber.",
          "Eliminación: la información personal de una antigua persona con control significativo debe eliminarse dentro del año siguiente al sexto aniversario del día en que dejó de tener ese control.",
        ],
      },
      p(
        "Los dos regímenes difieren en quién recibe la información. Desde el 22 de enero de 2024, la sociedad federal debe enviar cada año información de su registro a Corporations Canada, al mismo tiempo que su ",
        { text: "declaración anual", href: "/guides/declaraciones-anuales-sociedades-canada" },
        ". La CBCA también le exige enviar los cambios dentro de los 15 días siguientes a su inscripción en el registro (CBCA, art. 21.21). Corporations Canada hace pública parte de esa información, como el nombre y un domicilio de cada persona, con excepciones limitadas. La sociedad de Ontario no presenta su registro ante el gobierno; debe entregarlo a solicitud de la policía, de funcionarios tributarios y de ciertos organismos reguladores (OBCA, art. 140.3), y los accionistas y acreedores no tienen derecho a consultarlo (OBCA, art. 145(1)).",
      ),
      {
        type: "paragraph",
        text: "Las sanciones son considerables. La sociedad federal que, sin causa razonable, no lleve el registro se expone a una multa de hasta 100 000 $, y el director o funcionario que a sabiendas permita una infracción o inscriba información falsa se expone a una multa de hasta 200 000 $ y hasta dos años de prisión en procedimiento sumario, o hasta 1 000 000 $ y cinco años en procedimiento por acusación formal (CBCA, arts. 21.1(6) y 21.4). En Ontario, la sociedad se expone a una multa de hasta 5 000 $, y el director o funcionario que a sabiendas permita una infracción se expone a una multa de hasta 200 000 $, hasta seis meses de prisión, o ambas (OBCA, art. 258.1).",
      },
      {
        type: "heading",
        id: "donde-y-quien",
        text: "Dónde se guardan los registros y quién puede verlos",
      },
      {
        type: "paragraph",
        text: "Los registros deben guardarse en el domicilio social de la sociedad o en otro lugar designado por los directores. Para una sociedad federal, ese otro lugar debe estar en Canadá; para una sociedad de Ontario, en Ontario. Ambas leyes permiten guardar los registros en otro lugar (para una sociedad federal, incluso fuera de Canadá), siempre que puedan consultarse en el domicilio social por medios electrónicos durante el horario normal de oficina (CBCA, art. 20(5.1); OBCA, art. 144(3)). El registro de inmuebles de Ontario es la excepción: debe permanecer en el domicilio social.",
        parts: [
          "Los registros deben guardarse en el ",
          { text: "domicilio social", href: "/services/registered-office" },
          " de la sociedad o en otro lugar designado por los directores. Para una sociedad federal, ese otro lugar debe estar en Canadá; para una sociedad de Ontario, en Ontario. Ambas leyes permiten guardar los registros en otro lugar (para una sociedad federal, incluso fuera de Canadá), siempre que puedan consultarse en el domicilio social por medios electrónicos durante el horario normal de oficina (CBCA, art. 20(5.1); OBCA, art. 144(3)). El registro de inmuebles de Ontario es la excepción: debe permanecer en el domicilio social.",
        ],
      },
      {
        type: "paragraph",
        text: "La responsabilidad legal de los registros recae en la sociedad y, en la práctica, en sus directores, que deciden dónde se guardan y quién los lleva. Muchas sociedades llevan su propio libro de actas; otras lo encargan a su abogado o a un proveedor de servicios societarios. En cualquier caso, los directores siguen siendo responsables.",
      },
      {
        type: "list",
        items: [
          "Los directores pueden examinar las actas de las reuniones del consejo y la contabilidad (CBCA, art. 20(4)); según la OBCA, todos los registros de los artículos 140 y 141 están abiertos a cualquier director durante el horario habitual (OBCA, art. 144(1)).",
          "Los accionistas y los acreedores, así como sus agentes o representantes legales, pueden examinar gratuitamente los registros del art. 20(1) de la CBCA o del art. 140(1) de la OBCA durante el horario habitual y tomar extractos. La OBCA extiende este derecho a los propietarios beneficiarios de acciones.",
          "Ese derecho no se extiende a las actas y resoluciones de los directores ni a la contabilidad, que no figuran en ninguna de las dos listas.",
          "El accionista de una sociedad federal tiene derecho, a solicitud y sin costo, a una copia de los estatutos, los reglamentos internos y cualquier acuerdo unánime de accionistas (CBCA, art. 21(2)).",
        ],
      },
      {
        type: "heading",
        id: "papel-o-digital",
        text: "Papel o digital",
      },
      {
        type: "paragraph",
        text: "Ninguna de las dos leyes exige una carpeta física. La CBCA permite llevar los registros en forma encuadernada o de hojas sueltas, en película, o en cualquier sistema electrónico capaz de reproducir la información en forma escrita inteligible dentro de un plazo razonable (CBCA, art. 22(1)). Desde el 1 de octubre de 2023, la OBCA dispone simplemente que un registro exigido puede llevarse en cualquier forma (OBCA, art. 139(1)).",
      },
      {
        type: "paragraph",
        text: "Sea cual sea el formato, la sociedad debe tomar precauciones razonables contra la pérdida, la destrucción y la falsificación de sus registros, y poder presentarlos en forma exacta e inteligible dentro de un plazo razonable a cualquier persona con derecho a verlos (CBCA, art. 22(2); OBCA, art. 139(2)). Un libro digital suele significar documentos escaneados o firmados electrónicamente, registros organizados y copias de seguridad. Un libro en papel suele significar una carpeta dedicada con una pestaña para cada registro. Ambos son legales; lo que importa es que los registros estén completos, al día y accesibles.",
      },
      {
        type: "heading",
        id: "si-lo-descuida",
        text: "Qué pasa cuando faltan registros",
      },
      {
        type: "paragraph",
        text: "Un libro de actas faltante o incompleto rara vez causa problemas en el día a día. El problema surge en los momentos que importan, cuando alguien ajeno a la sociedad necesita pruebas de quién la posee y de lo que ha decidido:",
      },
      {
        type: "list",
        items: [
          "Venta del negocio o de sus acciones. El abogado del comprador revisa el libro de actas durante la debida diligencia para confirmar que cada acción se emitió y transfirió válidamente y que los directores fueron debidamente elegidos. Los vacíos retrasan el cierre y pueden llevar a ajustes de precio, indemnizaciones especiales o una operación que no se concreta.",
          "Cuentas bancarias y financiamiento. Los bancos y prestamistas suelen pedir los estatutos, los reglamentos o las resoluciones que autorizan a los firmantes, y la confirmación de los directores, funcionarios y personas con control significativo antes de abrir cuentas o desembolsar fondos.",
          "Revisiones de la CRA. El Reglamento del Impuesto sobre la Renta (art. 5800) obliga a la sociedad a conservar las actas de las reuniones de directores y de accionistas, así como los registros de propiedad y transferencia de acciones, hasta dos años después de su disolución. En una auditoría, la CRA puede pedir las resoluciones que declararon dividendos o aprobaron otros pagos a los accionistas.",
          "Disputas entre accionistas. Cuando los dueños no están de acuerdo sobre quién posee qué, el registro de valores y las resoluciones son la prueba de partida. Según la OBCA, la información de un registro exigido es admisible como prueba de los hechos que consigna, salvo prueba en contrario (OBCA, art. 139(3)).",
          "Infracciones. La sociedad federal que, sin causa razonable, no lleve los registros del artículo 20 se expone a una multa de hasta 5 000 $ (CBCA, art. 20(6)), además de las sanciones relativas al registro indicadas arriba.",
        ],
      },
      {
        type: "paragraph",
        text: "Reconstruir un libro de actas años después es más lento y más caro que mantenerlo al día. Los antiguos directores pueden no estar disponibles para firmar, las fechas y condiciones de emisiones de acciones pasadas pueden no estar documentadas, y algunos vacíos solo pueden subsanarse con resoluciones de ratificación o, en casos difíciles, con una solicitud ante el tribunal. Un abogado societario es la persona indicada para evaluar qué puede corregirse en un caso concreto.",
      },
      {
        type: "heading",
        id: "mantenerlo-al-dia",
        text: "Mantenerlo al día cada año",
      },
      {
        type: "paragraph",
        text: "Para la mayoría de las sociedades pequeñas, mantener el libro al día se reduce a un paquete anual de resoluciones, más actualizaciones cada vez que algo cambia. Un año típico se ve así:",
      },
      {
        type: "list",
        items: [
          "Celebrar la asamblea anual de accionistas, o hacer que todos los accionistas con derecho a voto firmen resoluciones escritas en su lugar. La primera debe celebrarse dentro de los 18 meses siguientes a la constitución y cada una de las siguientes dentro de los 15 meses posteriores a la anterior (CBCA, art. 133; OBCA, art. 94). La sociedad federal también debe celebrarla a más tardar seis meses después del cierre de su ejercicio anterior.",
          "Presentar los estados financieros a los accionistas (CBCA, art. 155; OBCA, art. 154) y dejar constancia de su aprobación por los directores.",
          "Elegir o confirmar a los directores, y nombrar un auditor o dejar constancia del consentimiento de todos los accionistas para prescindir de él, opción reservada a las sociedades que no ofrecen valores al público (CBCA, art. 163; OBCA, art. 148).",
          "Aprobar las resoluciones de los directores del año, como el nombramiento de funcionarios y, cuando corresponda, la declaración de dividendos.",
          "Revisar el registro de personas con control significativo, como exigen ambas leyes al menos una vez por ejercicio, y dejar constancia de las medidas tomadas.",
          "Presentar la declaración anual: las sociedades federales dentro de los 60 días siguientes a su fecha de aniversario (12 $ en línea); las sociedades de Ontario dentro de los seis meses siguientes al cierre de su ejercicio (sin tarifa gubernamental).",
        ],
      },
      p(
        "Los cambios durante el año se registran a medida que ocurren. Cuando un director entra o sale, el libro consigna la resolución y el consentimiento, los registros se actualizan y se presenta un aviso ante el registro; la sociedad federal debe enviar su aviso de cambio de directores dentro de los 15 días (CBCA, art. 113). Cuando se emiten o transfieren acciones, el registro de valores, el registro de transferencias y el registro ISC se actualizan juntos. Korporex gestiona en línea los ",
        { text: "cambios de directores", href: "/services/change-director" },
        " y los ",
        { text: "cambios de accionistas", href: "/services/change-shareholder" },
        ", así como el paquete anual de resoluciones para ",
        { text: "sociedades federales", href: "/services/annual-resolution-federal" },
        " y ",
        { text: "sociedades de Ontario", href: "/services/annual-resolution-on" },
        ".",
      ),
      {
        type: "callout",
        title: "Una disciplina sencilla",
        text: "Muchos dueños añaden la resolución correspondiente al libro en las semanas siguientes cada vez que la sociedad hace algo importante: emitir acciones, nombrar a un director, cambiar el cierre de su ejercicio, aprobar un reglamento o pagar un dividendo. Un libro al día requiere unos minutos al año. Uno que se lleva «cuando haya tiempo» suele quedar inconcluso hasta que un comprador o un banco lo pide.",
      },
      {
        type: "heading",
        id: "como-empezar",
        text: "Cómo poner en marcha un libro de actas",
      },
      p(
        "El libro de actas se organiza normalmente justo después de la constitución con un conjunto de documentos de organización: el reglamento interno general, las resoluciones de los directores que lo adoptan y emiten las primeras acciones, las suscripciones de esas acciones, los consentimientos de los directores para actuar, los primeros registros y las resoluciones de los accionistas que confirman el reglamento y eligen a los directores. Cuando se ",
        { text: "constituye en sociedad con Korporex", href: "/incorporate" },
        ", el libro se prepara como parte del trámite. Para una sociedad existente que nunca tuvo uno, o cuyos registros se interrumpieron hace años, Korporex prepara un ",
        { text: "libro de actas inicial", href: "/services/initial-minute-book" },
        " a partir de los estatutos y de la titularidad actual de las acciones. Cuando hay operaciones pasadas disputadas o sin documentar, un abogado societario puede indicar lo que se necesita para regularizarlas.",
      ),
    ],
    faq: [
      {
        q: "¿El libro de actas es obligatorio en Canadá?",
        a: "Sí. Las sociedades federales deben llevar los registros enumerados en el artículo 20 de la Ley de Sociedades por Acciones de Canadá y un registro de personas con control significativo según el artículo 21.1. Las sociedades de Ontario deben llevar los registros enumerados en el artículo 140 de la Ley de Sociedades por Acciones, incluido el registro del artículo 140.2. En conjunto, esos registros forman el libro de actas.",
      },
      {
        q: "¿Se puede llevar el libro de actas en formato digital?",
        a: "Sí. La CBCA permite llevar los registros en cualquier sistema electrónico capaz de reproducirlos en forma escrita inteligible dentro de un plazo razonable, y la OBCA permite llevar los registros exigidos en cualquier forma. En ambos casos, la sociedad debe tomar precauciones razonables contra la pérdida y la falsificación y poder presentar los registros con prontitud a quien tenga derecho a consultarlos.",
      },
      {
        q: "¿Dónde debe guardarse el libro de actas?",
        a: "En el domicilio social o en otro lugar designado por los directores, en Canadá para una sociedad federal y en Ontario para una sociedad de Ontario. Ambas leyes también permiten guardar los registros en otro lugar si pueden consultarse en el domicilio social por medios electrónicos durante el horario normal de oficina. El registro de inmuebles de Ontario debe permanecer en el domicilio social.",
      },
      {
        q: "¿Pueden los accionistas ver el libro de actas?",
        a: "Los accionistas y los acreedores pueden examinar gratuitamente, durante el horario habitual, los estatutos, los reglamentos, los acuerdos unánimes, las actas y resoluciones de los accionistas, y los registros de valores y de directores. La ley no les da derecho a las actas del consejo ni a la contabilidad. En Ontario, tampoco pueden consultar el registro de personas con control significativo.",
      },
      {
        q: "¿Qué pasa si mi sociedad nunca tuvo un libro de actas?",
        a: "Nada de inmediato, y por eso los vacíos pasan inadvertidos. El problema aparece cuando un comprador, un prestamista, un banco o la CRA pide pruebas de la propiedad y de las decisiones. Los registros faltantes suelen poder prepararse a partir de los estatutos y de la titularidad actual, mientras que las operaciones pasadas sin documentar pueden requerir resoluciones de ratificación. Un abogado puede evaluar los demás vacíos.",
      },
      {
        q: "¿Cuánto tiempo deben conservarse los registros del libro?",
        a: "Los estatutos, reglamentos, actas, resoluciones y registros se conservan durante toda la vida de la sociedad. La contabilidad puede desecharse después de seis años, sujeto a reglas tributarias más largas. Según el Reglamento del Impuesto sobre la Renta, las actas de directores y accionistas y los registros de propiedad de acciones deben conservarse hasta dos años después de la disolución de la sociedad.",
      },
    ],
  },
};
