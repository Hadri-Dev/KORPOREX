import type { ArticleInline, ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

// Rates and rules verified on 2026-10-04 against:
//  - https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporation-tax-rates.html
//  - https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/whats-new-corporations.html
//    (2026: Newfoundland and Labrador lower rate 2.5% to 2.0% from January 1, 2026; Ontario lower rate 3.2% to 2.2% from July 1, 2026)
//  - https://www.ontario.ca/document/corporations-tax/corporate-income-tax
//  - https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/provincial-territorial-corporation-tax/ontario-provincial-corporation-tax/ontario-small-business-deduction.html
//  - https://www.alberta.ca/about-tax-levy-rates-prescribed-interest-rates
//  - https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4012/t2-corporation-income-tax-guide-chapter-4-page-4-t2-return.html
//  - https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4012/t2-corporation-income-tax-guide-before-you-start.html
//  - https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporation-payments/paying-your-balance-corporation-tax/balance-day.html
//  - https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporation-payments/paying-instalments/instalment-dates.html
//  - https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/type-corporation.html
// Quebec is omitted from the provincial table: its rates could not be confirmed on an official page at the time of writing.

// Builds a paragraph whose plain `text` is always the exact concatenation of
// its parts, so linked and unlinked renderings never drift apart.
function p(...parts: ArticleInline[]): ArticleSection {
  const text = parts.map((x) => (typeof x === "string" ? x : x.text)).join("");
  return parts.some((x) => typeof x !== "string") ? { type: "paragraph", text, parts } : { type: "paragraph", text };
}

export const expanded: Record<"en" | "fr" | "es", ExpandedArticle> = {
  en: {
    readTime: "9 min read",
    content: [
      p("In 2026, the federal corporate tax rate in Canada is 15 percent on general business income and 9 percent on the first $500,000 of active business income earned by a Canadian-controlled private corporation (CCPC) that claims the small business deduction. Each province and territory adds its own tax on top. In Ontario, the combined small business rate is 12.2 percent until June 30, 2026 and 11.2 percent from July 1, 2026, after Ontario cut its lower rate from 3.2 to 2.2 percent. The combined Ontario general rate is 26.5 percent."),
      p("The low small business rate is one of the most common reasons people incorporate. It is a real advantage, but it is also widely misunderstood as a simple way to pay less tax. This guide explains how the two corporate rates work, which corporations qualify for the lower one, what reduces the $500,000 business limit, the rates in every province and territory, and the filing and payment deadlines that come with a corporate tax return."),

      { type: "heading", id: "two-rates", text: "Corporations have two rates" },
      p("A Canadian corporation is taxed at two possible rates on its active business income: a general rate, and a lower small business rate. Which one applies depends on whether the income qualifies for the small business deduction. Both the federal government and the province or territory where the corporation earns its income charge tax, so each of those two rates has a federal piece and a provincial piece."),
      p("The federal rates are built up in layers. According to the Canada Revenue Agency (CRA), the basic federal rate is 38 percent of taxable income, which falls to 28 percent after the federal tax abatement for income earned in a province or territory. The general tax reduction then brings the net federal rate to 15 percent. For a CCPC claiming the small business deduction, the net federal rate is 9 percent."),
      {
        type: "table",
        head: ["Federal rate (2026)", "Rate"],
        rows: [
          ["Basic Part I rate", "38%"],
          ["After the federal tax abatement", "28%"],
          ["Net general rate, after the general tax reduction", "15%"],
          ["Net rate for a CCPC claiming the small business deduction", "9%"],
        ],
      },

      { type: "heading", id: "ccpc", text: "What is a Canadian-controlled private corporation?" },
      p("Only a Canadian-controlled private corporation can claim the small business deduction. The CRA's definition has several technical parts, but at a general level a corporation is a CCPC at the end of its tax year if all of the following are true:"),
      {
        type: "list",
        items: [
          "It is a private corporation.",
          "It is resident in Canada and was incorporated in Canada, or has been resident in Canada since June 18, 1971.",
          "It is not controlled, directly or indirectly, by non-resident persons, by public corporations, or by any combination of them.",
          "No class of its shares is listed on a designated stock exchange.",
        ],
      },
      p("A typical owner-managed corporation set up by Canadian residents, whether under the Canada Business Corporations Act or the Ontario Business Corporations Act, will usually meet this definition. The jurisdiction of incorporation does not change the federal rate. Ownership and control are what matter, and they can be tested in ways that are not obvious, such as through options or shareholder agreements. An accountant can confirm the status of a particular corporation.", " If you are still choosing a jurisdiction, our guide to ", { text: "federal vs provincial incorporation", href: "/guides/federal-vs-provincial-incorporation" }, " compares the two."),

      { type: "heading", id: "small-business-deduction", text: "The small business deduction" },
      p("The small business deduction lowers the federal tax rate to 9 percent on the first $500,000 of active business income earned by a CCPC. That $500,000 is called the business limit. Income above it is taxed at the higher general rate. Income that is not active business income, such as most investment income, does not qualify for the deduction at all, and income from a personal services business is also excluded."),
      p("The business limit belongs to a group, not to each company. Associated corporations, for example a holding company and the operating company it controls, share a single $500,000 limit. They allocate it among themselves each year on Schedule 23 of the T2 return, and the total allocated cannot exceed 100 percent.", " Our guide to ", { text: "holding companies in Canada", href: "/guides/holding-company-canada" }, " explains how these structures are commonly set up."),

      { type: "heading", id: "business-limit-reductions", text: "When the $500,000 business limit is reduced" },
      p("The $500,000 business limit is a maximum. Two federal rules can shrink it, and the larger of the two reductions applies:"),
      {
        type: "list",
        items: [
          "Passive investment income. If the corporation and its associated corporations together earn between $50,000 and $150,000 of adjusted aggregate investment income in the previous year, the business limit is reduced on a straight-line basis. Each dollar of that income above $50,000 reduces the limit by $5, so the limit reaches zero once passive income exceeds $150,000.",
          "Taxable capital. If the associated group's taxable capital employed in Canada in the previous year is between $10 million and $50 million, the business limit is reduced on a straight-line basis. At $50 million or more, the corporation cannot claim the small business deduction.",
        ],
      },
      p("These rules matter mostly for corporations that have accumulated large investment portfolios or substantial assets. Most new and small corporations are well below both thresholds. Note that Ontario does not follow the federal passive income rule: the CRA states that the Ontario small business limit is not subject to the federal passive income business limit reduction. The taxable capital reduction does apply in Ontario."),

      { type: "heading", id: "provincial-rates", text: "Provincial and territorial rates" },
      p("Each province and territory has a lower rate, which applies to income eligible for the small business deduction, and a higher rate for other income. Some provinces use the federal $500,000 business limit and others set their own. Where a province's limit is higher than $500,000, the federal 9 percent rate still applies only up to the federal limit. The CRA collects corporate tax for every province and territory except Quebec and Alberta, which administer their own corporate income tax."),
      {
        type: "table",
        head: ["Province or territory", "Lower rate", "Higher rate", "Business limit"],
        rows: [
          ["British Columbia", "2%", "12%", "$500,000"],
          ["Alberta", "2%", "8%", "$500,000"],
          ["Saskatchewan", "1%", "12%", "$600,000"],
          ["Manitoba", "0%", "12%", "$500,000"],
          ["Ontario", "3.2% to June 30, 2026; 2.2% from July 1, 2026", "11.5%", "$500,000"],
          ["New Brunswick", "2.5%", "14%", "$500,000"],
          ["Nova Scotia", "1.5%", "14%", "$700,000"],
          ["Prince Edward Island", "1%", "15%", "$600,000"],
          ["Newfoundland and Labrador", "2% (from January 1, 2026)", "15%", "$500,000"],
          ["Yukon", "0%", "12%", "$500,000"],
          ["Northwest Territories", "2%", "11.5%", "$500,000"],
          ["Nunavut", "3%", "12%", "$500,000"],
        ],
      },
      p("Sources: the CRA's corporation tax rates page and its list of what is new for corporations (2026 changes for Ontario and Newfoundland and Labrador), and the Government of Alberta for Alberta. Quebec has its own small business deduction with additional conditions and is not included here. Corporations carrying on business in Quebec can find current rates on the Revenu Québec website."),

      { type: "heading", id: "combined-rates", text: "Combined Ontario rates, 2026" },
      p("Because the federal government and the province both tax corporate income, the rate a corporation actually pays is the two added together. For an Ontario CCPC, the 2026 figures look like this."),
      {
        type: "table",
        head: ["Type of income", "Federal", "Ontario", "Combined"],
        rows: [
          ["Small business income, before July 1, 2026", "9%", "3.2%", "12.2%"],
          ["Small business income, from July 1, 2026", "9%", "2.2%", "11.2%"],
          ["General rate income", "15%", "11.5%", "26.5%"],
        ],
      },
      p("Ontario's reduction is prorated for a tax year that straddles July 1, 2026, so a corporation with a December 31, 2026 year-end will see a blended Ontario rate for that year. Ontario also offers a manufacturing and processing credit that can bring the Ontario rate on qualifying income down to 10 percent. Ontario corporate tax is reported on the same federal T2 return, using Ontario schedules, and the CRA collects it."),

      { type: "heading", id: "the-catch", text: "The catch: it is deferral, not a discount" },
      p("The low corporate rate is not free money. When you take earnings out of the corporation to spend personally, as salary or dividends, you pay personal tax on top. The Canadian system is designed around integration, which means that, roughly, you end up in a similar place whether you earn income personally or through a corporation and pull it all out. The real benefit is timing: money left in the corporation is taxed at the low rate and can be reinvested in the business until you need it."),
      p("That is why the decision of how to pay yourself matters so much, and why ", { text: "salary versus dividends", href: "/guides/salary-vs-dividends-canada" }, " is its own topic. It is also why incorporating tends to make the most financial sense once a business earns more than its owner needs to live on. Our comparison of a ", { text: "sole proprietorship vs a corporation", href: "/guides/sole-proprietorship-vs-corporation" }, " covers the other differences, such as limited liability and ongoing costs."),

      { type: "heading", id: "filing-deadlines", text: "T2 filing deadline and when the tax is due" },
      p("Every corporation resident in Canada must file a T2 corporation income tax return for every tax year, even if it owes no tax and even if it was inactive. The filing deadline and the payment deadline are different dates, and the payment date comes first."),
      {
        type: "list",
        items: [
          "Filing deadline. The T2 return is due within six months after the end of the tax year. For a year ending on the last day of a month, it is due by the last day of the sixth month after. A March 31 year-end means a September 30 deadline, and a June 30 year-end means a December 31 deadline.",
          "Balance due. Generally, any tax owing is due two months after the end of the tax year.",
          "Three-month balance due for some CCPCs. The balance is due three months after year-end if the corporation was a CCPC throughout the year, claimed the small business deduction for the current or previous year, and its taxable income for the previous year (combined with associated corporations, if any) did not exceed its business limit.",
        ],
      },
      p("Interest runs on any balance not paid by the balance-due date, even though the return itself is not yet late. Federal corporations and Ontario corporations also file a separate annual return under corporate law, which is a different filing from the T2. Our guide to ", { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" }, " explains the difference, and Korporex can file the ", { text: "Ontario annual return", href: "/services/annual-return-on" }, " or the ", { text: "federal annual return", href: "/services/annual-return-federal" }, " for you."),

      { type: "heading", id: "instalments", text: "Tax instalments" },
      p("Once a corporation owes more than a small amount of tax, it generally pays during the year rather than all at once after year-end. At a general level, the rules work like this:"),
      {
        type: "list",
        items: [
          "No instalments are required if the corporation's tax payable is $3,000 or less for either the current or the previous tax year.",
          "Otherwise, corporations generally pay monthly instalments, with the first one due one month less a day after the start of the tax year.",
          "An eligible small CCPC can pay quarterly instead. It must have a perfect compliance history and, together with associated corporations, taxable income of $500,000 or less and taxable capital employed in Canada of $10 million or less for the current or previous year.",
        ],
      },
      p("A newly incorporated business usually has no instalments in its first year, because it has no prior year of tax payable. How much to pay later, and which calculation method to use, is a question for the corporation's accountant."),

      { type: "heading", id: "steps", text: "Getting set up for corporate tax" },
      { type: "list", items: [
        "Incorporate, federally or in Ontario. The small business deduction is only available to a corporation.",
        "Obtain a Business Number. A federal or Ontario corporation receives one from the CRA, and it is the account number for the corporation's T2 filings.",
        "Choose a fiscal year-end. It sets the six-month filing deadline and the two- or three-month payment deadline.",
        "Keep corporate and personal money separate, usually with a dedicated business bank account.",
        "Engage an accountant to prepare the T2 return and advise on salary, dividends and instalments.",
      ] },
      p("For more on the second step, see our guide on ", { text: "how to get a CRA Business Number", href: "/guides/how-to-get-a-cra-business-number" }, ". Professionals such as doctors and lawyers can also access the small business rate through a regulated structure, covered in our guide to ", { text: "professional corporations in Canada", href: "/guides/professional-corporations-canada" }, "."),
      { type: "callout", text: "Tax rates and thresholds change with federal and provincial budgets. Treat the figures here as a 2026 snapshot, and confirm the current rates and how they apply to you with the CRA or a qualified accountant. This guide is general information, not tax advice." },

      { type: "heading", id: "where-korporex-fits", text: "Where Korporex fits" },
      p("The small business rate is only available to a corporation, so accessing it starts with incorporating. Korporex ", { text: "files your federal or Ontario incorporation online", href: "/incorporate" }, ", which is the step that makes the small business deduction available to your business. Korporex does not prepare tax returns or give tax advice; your accountant handles the T2. If you are deciding whether the move makes sense for you, our guide on ", { text: "how to incorporate yourself", href: "/guides/how-to-incorporate-yourself" }, " walks through the practical side."),
    ],
    faq: [
      { q: "What is the small business tax rate in Ontario?", a: "For a Canadian-controlled private corporation claiming the small business deduction, the combined federal and Ontario rate on the first $500,000 of active business income is 12.2 percent until June 30, 2026 and 11.2 percent from July 1, 2026. That is the federal 9 percent plus Ontario's lower rate, which fell from 3.2 to 2.2 percent on July 1, 2026." },
      { q: "What is the general corporate tax rate in Canada?", a: "The net federal general rate is 15 percent in 2026, after the federal abatement and the general tax reduction. Provinces and territories add their own higher rate, which ranges from 8 percent in Alberta to 15 percent in Prince Edward Island and Newfoundland and Labrador. In Ontario, the combined general rate is 26.5 percent." },
      { q: "Does every corporation get the small business rate?", a: "No. Only a Canadian-controlled private corporation can claim the small business deduction, and only on active business income up to its business limit. Investment income and income from a personal services business do not qualify. Associated corporations share one $500,000 limit, and the limit shrinks with high passive income or taxable capital over $10 million." },
      { q: "When is a corporate tax return due in Canada?", a: "The T2 return is due six months after the end of the corporation's tax year. Any tax owing is generally due earlier, two months after year-end. Some CCPCs that claimed the small business deduction and stayed within their business limit in the previous year have three months to pay. Interest applies to unpaid balances after the due date." },
      { q: "Does a new corporation have to pay tax instalments?", a: "Instalments are not required when tax payable is $3,000 or less for either the current or the previous year. A new corporation has no previous year, so instalments are usually not required in its first year. After that, corporations generally pay monthly, and an eligible small CCPC can pay quarterly instead." },
      { q: "Is the corporate tax rate different for a federal corporation in Ontario?", a: "No. A corporation incorporated federally and one incorporated under Ontario law pay the same rates on income earned in Ontario. Corporate tax depends on where the income is earned and whether the corporation is a CCPC, not on the statute it was incorporated under. The choice between federal and Ontario incorporation turns on other factors, such as name protection." },
    ],
  },

  fr: {
    readTime: "11 min de lecture",
    content: [
      p("En 2026, le taux d'impôt fédéral des sociétés au Canada est de 15 pour cent sur le revenu d'entreprise général et de 9 pour cent sur les premiers 500 000 $ de revenu tiré d'une entreprise exploitée activement gagné par une société privée sous contrôle canadien (SPCC) qui demande la déduction accordée aux petites entreprises. Chaque province et territoire ajoute son propre impôt. En Ontario, le taux combiné des petites entreprises est de 12,2 pour cent jusqu'au 30 juin 2026 et de 11,2 pour cent à compter du 1er juillet 2026, après la baisse du taux inférieur ontarien de 3,2 à 2,2 pour cent. Le taux général combiné en Ontario est de 26,5 pour cent."),
      p("Le faible taux des petites entreprises est l'une des raisons les plus courantes de se constituer en société. C'est un avantage réel, mais il est aussi largement mal compris comme une simple façon de payer moins d'impôt. Ce guide explique comment fonctionnent les deux taux, quelles sociétés ont droit au taux réduit, ce qui réduit le plafond des affaires de 500 000 $, les taux de chaque province et territoire, et les échéances de production et de paiement liées à la déclaration de revenus des sociétés."),

      { type: "heading", id: "deux-taux", text: "Les sociétés ont deux taux" },
      p("Une société canadienne est imposée à deux taux possibles sur son revenu tiré d'une entreprise exploitée activement : un taux général, et un taux réduit des petites entreprises. Lequel s'applique dépend de l'admissibilité du revenu à la déduction accordée aux petites entreprises. Le gouvernement fédéral et la province ou le territoire où la société gagne son revenu imposent tous deux ce revenu, de sorte que chacun de ces deux taux comporte une part fédérale et une part provinciale."),
      p("Les taux fédéraux se construisent par étapes. Selon l'Agence du revenu du Canada (ARC), le taux fédéral de base est de 38 pour cent du revenu imposable, qui passe à 28 pour cent après l'abattement d'impôt fédéral pour le revenu gagné dans une province ou un territoire. La réduction du taux général ramène ensuite le taux fédéral net à 15 pour cent. Pour une SPCC qui demande la déduction accordée aux petites entreprises, le taux fédéral net est de 9 pour cent."),
      {
        type: "table",
        head: ["Taux fédéral (2026)", "Taux"],
        rows: [
          ["Taux de base de la partie I", "38 %"],
          ["Après l'abattement d'impôt fédéral", "28 %"],
          ["Taux général net, après la réduction du taux général", "15 %"],
          ["Taux net d'une SPCC qui demande la déduction accordée aux petites entreprises", "9 %"],
        ],
      },

      { type: "heading", id: "spcc", text: "Qu'est-ce qu'une société privée sous contrôle canadien?" },
      p("Seule une société privée sous contrôle canadien peut demander la déduction accordée aux petites entreprises. La définition de l'ARC comporte plusieurs volets techniques, mais de façon générale, une société est une SPCC à la fin de son année d'imposition si toutes les conditions suivantes sont remplies :"),
      {
        type: "list",
        items: [
          "Elle est une société privée.",
          "Elle réside au Canada et y a été constituée, ou réside au Canada depuis le 18 juin 1971.",
          "Elle n'est pas contrôlée, directement ou indirectement, par des personnes non-résidentes, par des sociétés publiques, ou par une combinaison de celles-ci.",
          "Aucune catégorie de ses actions n'est cotée à une bourse de valeurs désignée.",
        ],
      },
      p("Une société typique dirigée par son propriétaire et constituée par des résidents canadiens, que ce soit sous le régime de la Loi canadienne sur les sociétés par actions ou de la Loi sur les sociétés par actions de l'Ontario, répond habituellement à cette définition. Le lieu de constitution ne change pas le taux fédéral. Ce sont la propriété et le contrôle qui comptent, et ils peuvent être évalués de façons qui ne sont pas évidentes, par exemple au moyen d'options ou de conventions entre actionnaires. Un comptable peut confirmer le statut d'une société donnée."),

      { type: "heading", id: "dpe", text: "La déduction accordée aux petites entreprises" },
      p("La déduction accordée aux petites entreprises abaisse le taux d'impôt fédéral à 9 pour cent sur les premiers 500 000 $ de revenu tiré d'une entreprise exploitée activement gagné par une SPCC. Ce montant de 500 000 $ s'appelle le plafond des affaires. Le revenu au-delà est imposé au taux général plus élevé. Le revenu qui n'est pas tiré d'une entreprise exploitée activement, comme la plupart des revenus de placement, n'est pas du tout admissible à la déduction, et le revenu d'une entreprise de prestation de services personnels en est également exclu."),
      p("Le plafond des affaires appartient à un groupe, et non à chaque société. Les sociétés associées, par exemple une société de portefeuille et la société d'exploitation qu'elle contrôle, partagent un seul plafond de 500 000 $. Elles le répartissent entre elles chaque année à l'annexe 23 de la déclaration T2, et le total réparti ne peut dépasser 100 pour cent.", " Notre guide sur les ", { text: "sociétés de portefeuille au Canada", href: "/guides/societe-de-portefeuille-canada" }, " explique comment ces structures sont couramment mises en place."),

      { type: "heading", id: "reduction-plafond", text: "Quand le plafond des affaires de 500 000 $ est réduit" },
      p("Le plafond des affaires de 500 000 $ est un maximum. Deux règles fédérales peuvent le réduire, et la plus importante des deux réductions s'applique :"),
      {
        type: "list",
        items: [
          "Revenu de placement passif. Si la société et ses sociétés associées gagnent ensemble entre 50 000 $ et 150 000 $ de revenu de placement total ajusté au cours de l'année précédente, le plafond des affaires est réduit de façon linéaire. Chaque dollar de ce revenu au-delà de 50 000 $ réduit le plafond de 5 $, de sorte que le plafond tombe à zéro lorsque le revenu passif dépasse 150 000 $.",
          "Capital imposable. Si le capital imposable utilisé au Canada du groupe associé au cours de l'année précédente se situe entre 10 millions et 50 millions de dollars, le plafond des affaires est réduit de façon linéaire. À 50 millions de dollars ou plus, la société ne peut pas demander la déduction accordée aux petites entreprises.",
        ],
      },
      p("Ces règles visent surtout les sociétés qui ont accumulé d'importants portefeuilles de placements ou des actifs considérables. La plupart des sociétés nouvelles et petites sont bien en deçà des deux seuils. À noter que l'Ontario ne suit pas la règle fédérale sur le revenu passif : l'ARC indique que le plafond des affaires de l'Ontario n'est pas assujetti à la réduction fédérale liée au revenu de placement passif. La réduction liée au capital imposable s'applique toutefois en Ontario."),

      { type: "heading", id: "taux-provinciaux", text: "Les taux provinciaux et territoriaux" },
      p("Chaque province et territoire a un taux inférieur, qui s'applique au revenu admissible à la déduction accordée aux petites entreprises, et un taux supérieur pour les autres revenus. Certaines provinces utilisent le plafond des affaires fédéral de 500 000 $ et d'autres fixent le leur. Lorsque le plafond d'une province dépasse 500 000 $, le taux fédéral de 9 pour cent ne s'applique quand même que jusqu'au plafond fédéral. L'ARC perçoit l'impôt des sociétés pour toutes les provinces et tous les territoires, sauf le Québec et l'Alberta, qui administrent leur propre impôt sur le revenu des sociétés."),
      {
        type: "table",
        head: ["Province ou territoire", "Taux inférieur", "Taux supérieur", "Plafond des affaires"],
        rows: [
          ["Colombie-Britannique", "2 %", "12 %", "500 000 $"],
          ["Alberta", "2 %", "8 %", "500 000 $"],
          ["Saskatchewan", "1 %", "12 %", "600 000 $"],
          ["Manitoba", "0 %", "12 %", "500 000 $"],
          ["Ontario", "3,2 % jusqu'au 30 juin 2026; 2,2 % à compter du 1er juillet 2026", "11,5 %", "500 000 $"],
          ["Nouveau-Brunswick", "2,5 %", "14 %", "500 000 $"],
          ["Nouvelle-Écosse", "1,5 %", "14 %", "700 000 $"],
          ["Île-du-Prince-Édouard", "1 %", "15 %", "600 000 $"],
          ["Terre-Neuve-et-Labrador", "2 % (à compter du 1er janvier 2026)", "15 %", "500 000 $"],
          ["Yukon", "0 %", "12 %", "500 000 $"],
          ["Territoires du Nord-Ouest", "2 %", "11,5 %", "500 000 $"],
          ["Nunavut", "3 %", "12 %", "500 000 $"],
        ],
      },
      p("Sources : la page de l'ARC sur les taux d'impôt des sociétés et sa liste des nouveautés pour les sociétés (changements de 2026 pour l'Ontario et Terre-Neuve-et-Labrador), et le gouvernement de l'Alberta pour l'Alberta. Le Québec a sa propre déduction pour petites entreprises, assortie de conditions supplémentaires, et n'est pas inclus ici. Les sociétés qui exploitent une entreprise au Québec peuvent consulter les taux en vigueur sur le site de Revenu Québec."),

      { type: "heading", id: "taux-combines", text: "Taux combinés en Ontario, 2026" },
      p("Comme le gouvernement fédéral et la province imposent tous deux le revenu des sociétés, le taux qu'une société paie réellement est la somme des deux. Pour une SPCC ontarienne, les chiffres de 2026 sont les suivants."),
      {
        type: "table",
        head: ["Type de revenu", "Fédéral", "Ontario", "Combiné"],
        rows: [
          ["Revenu de petite entreprise, avant le 1er juillet 2026", "9 %", "3,2 %", "12,2 %"],
          ["Revenu de petite entreprise, à compter du 1er juillet 2026", "9 %", "2,2 %", "11,2 %"],
          ["Revenu imposé au taux général", "15 %", "11,5 %", "26,5 %"],
        ],
      },
      p("La réduction ontarienne est calculée au prorata pour une année d'imposition qui chevauche le 1er juillet 2026, de sorte qu'une société dont l'exercice se termine le 31 décembre 2026 aura un taux ontarien mixte pour cette année. L'Ontario offre aussi un crédit pour la fabrication et la transformation qui peut ramener le taux ontarien sur le revenu admissible à 10 pour cent. L'impôt ontarien des sociétés est déclaré dans la même déclaration T2 fédérale, au moyen d'annexes ontariennes, et c'est l'ARC qui le perçoit."),

      { type: "heading", id: "le-hic", text: "Le hic : c'est un report, pas un rabais" },
      p("Le taux réduit des sociétés n'est pas de l'argent gratuit. Lorsque vous sortez des revenus de la société pour les dépenser personnellement, sous forme de salaire ou de dividendes, vous payez de l'impôt personnel par-dessus. Le système canadien repose sur le principe d'intégration : grosso modo, vous aboutissez à un endroit semblable que vous gagniez le revenu personnellement ou par l'entremise d'une société et le sortiez au complet. Le véritable avantage est le moment : l'argent laissé dans la société est imposé au taux réduit et peut être réinvesti dans l'entreprise jusqu'à ce que vous en ayez besoin."),
      p("C'est pourquoi la décision de comment vous verser une rémunération compte tant, et pourquoi ", { text: "le salaire par rapport aux dividendes", href: "/guides/salaire-ou-dividendes" }, " est un sujet à part entière. C'est aussi pourquoi la constitution en société tend à être la plus avantageuse financièrement lorsqu'une entreprise gagne plus que ce dont son propriétaire a besoin pour vivre. Notre comparaison entre l'", { text: "entreprise individuelle et la société", href: "/guides/entreprise-individuelle-ou-societe" }, " couvre les autres différences, comme la responsabilité limitée et les coûts continus."),

      { type: "heading", id: "echeances-t2", text: "Échéance de la déclaration T2 et date de paiement de l'impôt" },
      p("Toute société résidant au Canada doit produire une déclaration de revenus des sociétés T2 pour chaque année d'imposition, même si elle n'a aucun impôt à payer et même si elle a été inactive. L'échéance de production et l'échéance de paiement sont deux dates différentes, et la date de paiement arrive en premier."),
      {
        type: "list",
        items: [
          "Échéance de production. La déclaration T2 doit être produite dans les six mois suivant la fin de l'année d'imposition. Pour une année qui se termine le dernier jour d'un mois, elle est due au plus tard le dernier jour du sixième mois suivant. Une fin d'exercice au 31 mars donne une échéance au 30 septembre, et une fin d'exercice au 30 juin donne une échéance au 31 décembre.",
          "Date d'échéance du solde. En général, tout impôt à payer est exigible deux mois après la fin de l'année d'imposition.",
          "Solde exigible à trois mois pour certaines SPCC. Le solde est exigible trois mois après la fin de l'exercice si la société était une SPCC tout au long de l'année, a demandé la déduction accordée aux petites entreprises pour l'année en cours ou l'année précédente, et si son revenu imposable de l'année précédente (combiné avec celui des sociétés associées, le cas échéant) ne dépassait pas son plafond des affaires.",
        ],
      },
      p("Des intérêts courent sur tout solde impayé à la date d'échéance du solde, même si la déclaration elle-même n'est pas encore en retard. Les sociétés fédérales et ontariennes produisent aussi une déclaration annuelle distincte en vertu du droit des sociétés, qui n'est pas la T2. Notre guide sur les ", { text: "déclarations annuelles des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" }, " explique la différence, et Korporex peut déposer pour vous la ", { text: "déclaration annuelle de l'Ontario", href: "/services/annual-return-on" }, " ou la ", { text: "déclaration annuelle fédérale", href: "/services/annual-return-federal" }, "."),

      { type: "heading", id: "acomptes", text: "Les acomptes provisionnels" },
      p("Dès qu'une société doit plus qu'un petit montant d'impôt, elle paie généralement en cours d'année plutôt qu'en un seul versement après la fin de l'exercice. De façon générale, les règles fonctionnent ainsi :"),
      {
        type: "list",
        items: [
          "Aucun acompte provisionnel n'est exigé si l'impôt à payer de la société est de 3 000 $ ou moins pour l'année en cours ou pour l'année précédente.",
          "Autrement, les sociétés versent généralement des acomptes mensuels, le premier étant dû un mois moins un jour après le début de l'année d'imposition.",
          "Une petite SPCC admissible peut plutôt payer trimestriellement. Elle doit avoir des antécédents d'observation parfaits et, avec ses sociétés associées, un revenu imposable de 500 000 $ ou moins et un capital imposable utilisé au Canada de 10 millions de dollars ou moins pour l'année en cours ou l'année précédente.",
        ],
      },
      p("Une entreprise nouvellement constituée n'a habituellement aucun acompte à verser au cours de sa première année, puisqu'elle n'a aucune année antérieure d'impôt à payer. Le montant à verser par la suite, et la méthode de calcul à utiliser, sont des questions à poser au comptable de la société."),

      { type: "heading", id: "etapes", text: "Se préparer à l'impôt des sociétés" },
      { type: "list", items: [
        "Se constituer en société, au fédéral ou en Ontario. La déduction accordée aux petites entreprises n'est offerte qu'à une société.",
        "Obtenir un numéro d'entreprise. Une société fédérale ou ontarienne en reçoit un de l'ARC, et c'est le numéro de compte pour les déclarations T2 de la société.",
        "Choisir une fin d'exercice. Elle fixe l'échéance de production de six mois et l'échéance de paiement de deux ou trois mois.",
        "Séparer l'argent de la société et l'argent personnel, habituellement au moyen d'un compte bancaire d'entreprise distinct.",
        "Retenir les services d'un comptable pour préparer la déclaration T2 et conseiller sur le salaire, les dividendes et les acomptes.",
      ] },
      p("Pour en savoir plus sur la deuxième étape, consultez notre guide sur ", { text: "comment obtenir un numéro d'entreprise de l'ARC", href: "/guides/comment-obtenir-un-numero-dentreprise-arc" }, ". Les professionnels comme les médecins et les avocats peuvent aussi accéder au taux des petites entreprises au moyen d'une structure réglementée, présentée dans notre guide sur les ", { text: "sociétés professionnelles au Canada", href: "/guides/societe-professionnelle-canada" }, "."),
      { type: "callout", text: "Les taux d'imposition et les seuils changent avec les budgets fédéraux et provinciaux. Traitez les chiffres ici comme un instantané de 2026, et confirmez les taux actuels et leur application à votre situation auprès de l'ARC ou d'un comptable qualifié. Ce guide est de l'information générale, et non un conseil fiscal." },

      { type: "heading", id: "ou-korporex", text: "Où se situe Korporex" },
      p("Le taux des petites entreprises n'est offert qu'à une société, alors y accéder commence par la constitution. Korporex ", { text: "dépose votre constitution fédérale ou ontarienne en ligne", href: "/incorporate" }, ", l'étape qui rend la déduction accordée aux petites entreprises accessible à votre entreprise. Korporex ne prépare pas de déclarations de revenus et ne donne pas de conseils fiscaux; votre comptable s'occupe de la T2. Si vous évaluez si la démarche vous convient, notre guide sur ", { text: "comment vous constituer en société", href: "/guides/comment-vous-constituer-en-societe" }, " en présente l'aspect pratique."),
    ],
    faq: [
      { q: "Quel est le taux d'imposition des petites entreprises en Ontario?", a: "Pour une société privée sous contrôle canadien qui demande la déduction accordée aux petites entreprises, le taux combiné fédéral et ontarien sur les premiers 500 000 $ de revenu d'entreprise exploitée activement est de 12,2 pour cent jusqu'au 30 juin 2026 et de 11,2 pour cent à compter du 1er juillet 2026. C'est le taux fédéral de 9 pour cent plus le taux inférieur ontarien, passé de 3,2 à 2,2 pour cent." },
      { q: "Quel est le taux général d'imposition des sociétés au Canada?", a: "Le taux général fédéral net est de 15 pour cent en 2026, après l'abattement fédéral et la réduction du taux général. Les provinces et territoires ajoutent leur propre taux supérieur, qui va de 8 pour cent en Alberta à 15 pour cent à l'Île-du-Prince-Édouard et à Terre-Neuve-et-Labrador. En Ontario, le taux général combiné est de 26,5 pour cent." },
      { q: "Toutes les sociétés ont-elles droit au taux des petites entreprises?", a: "Non. Seule une société privée sous contrôle canadien peut demander la déduction accordée aux petites entreprises, et seulement sur le revenu tiré d'une entreprise exploitée activement jusqu'à son plafond des affaires. Le revenu de placement et celui d'une entreprise de prestation de services personnels ne sont pas admissibles. Les sociétés associées partagent un seul plafond de 500 000 $." },
      { q: "Quand la déclaration de revenus d'une société est-elle due au Canada?", a: "La déclaration T2 est due six mois après la fin de l'année d'imposition de la société. Tout impôt à payer est généralement exigible plus tôt, deux mois après la fin de l'exercice. Certaines SPCC qui ont demandé la déduction accordée aux petites entreprises et sont restées sous leur plafond des affaires l'année précédente ont trois mois pour payer. Des intérêts s'appliquent ensuite." },
      { q: "Une nouvelle société doit-elle verser des acomptes provisionnels?", a: "Les acomptes ne sont pas exigés lorsque l'impôt à payer est de 3 000 $ ou moins pour l'année en cours ou l'année précédente. Une nouvelle société n'a pas d'année précédente, donc les acomptes ne sont généralement pas exigés la première année. Par la suite, les sociétés paient généralement chaque mois, et une petite SPCC admissible peut payer chaque trimestre." },
      { q: "Le taux est-il différent pour une société fédérale en Ontario?", a: "Non. Une société constituée sous le régime fédéral et une société constituée en vertu de la loi ontarienne paient les mêmes taux sur le revenu gagné en Ontario. L'impôt des sociétés dépend de l'endroit où le revenu est gagné et du statut de SPCC, et non de la loi de constitution. Le choix entre le fédéral et l'Ontario repose sur d'autres facteurs, comme la protection du nom." },
    ],
  },

  es: {
    readTime: "11 min de lectura",
    content: [
      p("En 2026, la tasa federal del impuesto de sociedades en Canadá es del 15 por ciento sobre el ingreso empresarial general y del 9 por ciento sobre los primeros 500 000 $ de ingreso de un negocio activo ganado por una sociedad privada bajo control canadiense (CCPC) que solicita la deducción para pequeñas empresas. Cada provincia y territorio añade su propio impuesto. En Ontario, la tasa combinada para pequeñas empresas es del 12,2 por ciento hasta el 30 de junio de 2026 y del 11,2 por ciento a partir del 1 de julio de 2026, después de que Ontario bajara su tasa reducida del 3,2 al 2,2 por ciento. La tasa general combinada en Ontario es del 26,5 por ciento."),
      p("La baja tasa para pequeñas empresas es una de las razones más comunes para constituirse en sociedad. Es una ventaja real, pero también se malinterpreta ampliamente como una simple manera de pagar menos impuestos. Esta guía explica cómo funcionan las dos tasas, qué sociedades califican para la tasa reducida, qué reduce el límite de negocios de 500 000 $, las tasas de cada provincia y territorio, y los plazos de presentación y de pago que acompañan la declaración de impuestos de la sociedad."),

      { type: "heading", id: "dos-tasas", text: "Las sociedades tienen dos tasas" },
      p("Una sociedad canadiense se grava a dos tasas posibles sobre su ingreso de un negocio activo: una tasa general y una tasa reducida para pequeñas empresas. Cuál se aplica depende de si el ingreso califica para la deducción para pequeñas empresas. Tanto el gobierno federal como la provincia o territorio donde la sociedad gana su ingreso cobran impuesto, por lo que cada una de esas dos tasas tiene una parte federal y una parte provincial."),
      p("Las tasas federales se construyen por capas. Según la Agencia de Ingresos de Canadá (CRA), la tasa federal básica es del 38 por ciento del ingreso imponible, que baja al 28 por ciento después del abatimiento federal para el ingreso ganado en una provincia o territorio. La reducción de la tasa general lleva luego la tasa federal neta al 15 por ciento. Para una CCPC que solicita la deducción para pequeñas empresas, la tasa federal neta es del 9 por ciento."),
      {
        type: "table",
        head: ["Tasa federal (2026)", "Tasa"],
        rows: [
          ["Tasa básica de la parte I", "38 %"],
          ["Después del abatimiento federal", "28 %"],
          ["Tasa general neta, después de la reducción de la tasa general", "15 %"],
          ["Tasa neta de una CCPC que solicita la deducción para pequeñas empresas", "9 %"],
        ],
      },

      { type: "heading", id: "ccpc", text: "¿Qué es una sociedad privada bajo control canadiense?" },
      p("Solo una sociedad privada bajo control canadiense puede solicitar la deducción para pequeñas empresas. La definición de la CRA tiene varios elementos técnicos, pero en términos generales una sociedad es una CCPC al cierre de su año fiscal si se cumplen todas las condiciones siguientes:"),
      {
        type: "list",
        items: [
          "Es una sociedad privada.",
          "Reside en Canadá y fue constituida en Canadá, o reside en Canadá desde el 18 de junio de 1971.",
          "No está controlada, directa ni indirectamente, por personas no residentes, por sociedades públicas ni por una combinación de ellas.",
          "Ninguna clase de sus acciones cotiza en una bolsa de valores designada.",
        ],
      },
      p("Una sociedad típica administrada por su propietario y creada por residentes canadienses, ya sea conforme a la Ley de Sociedades por Acciones de Canadá o a la Ley de Sociedades por Acciones de Ontario, normalmente cumple esta definición. La jurisdicción de constitución no cambia la tasa federal. Lo que importa es la propiedad y el control, que pueden evaluarse de maneras poco evidentes, por ejemplo mediante opciones o convenios de accionistas. Un contador puede confirmar la situación de una sociedad concreta."),

      { type: "heading", id: "deduccion", text: "La deducción para pequeñas empresas" },
      p("La deducción para pequeñas empresas baja la tasa de impuesto federal al 9 por ciento sobre los primeros 500 000 $ de ingreso de un negocio activo ganado por una CCPC. Ese monto de 500 000 $ se llama el límite de negocios. El ingreso por encima se grava a la tasa general más alta. El ingreso que no proviene de un negocio activo, como la mayoría de los ingresos de inversión, no califica en absoluto para la deducción, y el ingreso de un negocio de servicios personales también queda excluido."),
      p("El límite de negocios pertenece a un grupo, no a cada sociedad. Las sociedades asociadas, por ejemplo una sociedad de cartera y la sociedad operativa que controla, comparten un único límite de 500 000 $. Lo reparten entre ellas cada año en el anexo 23 de la declaración T2, y el total repartido no puede superar el 100 por ciento.", " Nuestra guía sobre las ", { text: "sociedades de cartera en Canadá", href: "/guides/sociedad-de-cartera-canada" }, " explica cómo se suelen organizar estas estructuras."),

      { type: "heading", id: "reduccion-limite", text: "Cuándo se reduce el límite de negocios de 500 000 $" },
      p("El límite de negocios de 500 000 $ es un máximo. Dos reglas federales pueden reducirlo, y se aplica la mayor de las dos reducciones:"),
      {
        type: "list",
        items: [
          "Ingreso de inversión pasiva. Si la sociedad y sus sociedades asociadas ganan en conjunto entre 50 000 $ y 150 000 $ de ingreso de inversión total ajustado en el año anterior, el límite de negocios se reduce de forma lineal. Cada dólar de ese ingreso por encima de 50 000 $ reduce el límite en 5 $, de modo que el límite llega a cero cuando el ingreso pasivo supera 150 000 $.",
          "Capital imponible. Si el capital imponible empleado en Canadá del grupo asociado en el año anterior está entre 10 millones y 50 millones de dólares, el límite de negocios se reduce de forma lineal. Con 50 millones de dólares o más, la sociedad no puede solicitar la deducción para pequeñas empresas.",
        ],
      },
      p("Estas reglas importan sobre todo a las sociedades que han acumulado grandes carteras de inversión o activos considerables. La mayoría de las sociedades nuevas y pequeñas están muy por debajo de ambos umbrales. Cabe señalar que Ontario no sigue la regla federal sobre el ingreso pasivo: la CRA indica que el límite de negocios de Ontario no está sujeto a la reducción federal por ingreso de inversión pasiva. La reducción por capital imponible sí se aplica en Ontario."),

      { type: "heading", id: "tasas-provinciales", text: "Las tasas provinciales y territoriales" },
      p("Cada provincia y territorio tiene una tasa reducida, que se aplica al ingreso que califica para la deducción para pequeñas empresas, y una tasa más alta para los demás ingresos. Algunas provincias usan el límite de negocios federal de 500 000 $ y otras fijan el suyo. Cuando el límite de una provincia supera 500 000 $, la tasa federal del 9 por ciento sigue aplicándose solo hasta el límite federal. La CRA recauda el impuesto de sociedades de todas las provincias y territorios excepto Quebec y Alberta, que administran su propio impuesto sobre la renta de las sociedades."),
      {
        type: "table",
        head: ["Provincia o territorio", "Tasa reducida", "Tasa más alta", "Límite de negocios"],
        rows: [
          ["Columbia Británica", "2 %", "12 %", "500 000 $"],
          ["Alberta", "2 %", "8 %", "500 000 $"],
          ["Saskatchewan", "1 %", "12 %", "600 000 $"],
          ["Manitoba", "0 %", "12 %", "500 000 $"],
          ["Ontario", "3,2 % hasta el 30 de junio de 2026; 2,2 % desde el 1 de julio de 2026", "11,5 %", "500 000 $"],
          ["Nuevo Brunswick", "2,5 %", "14 %", "500 000 $"],
          ["Nueva Escocia", "1,5 %", "14 %", "700 000 $"],
          ["Isla del Príncipe Eduardo", "1 %", "15 %", "600 000 $"],
          ["Terranova y Labrador", "2 % (desde el 1 de enero de 2026)", "15 %", "500 000 $"],
          ["Yukón", "0 %", "12 %", "500 000 $"],
          ["Territorios del Noroeste", "2 %", "11,5 %", "500 000 $"],
          ["Nunavut", "3 %", "12 %", "500 000 $"],
        ],
      },
      p("Fuentes: la página de la CRA sobre las tasas del impuesto de sociedades y su lista de novedades para sociedades (cambios de 2026 para Ontario y Terranova y Labrador), y el gobierno de Alberta para Alberta. Quebec tiene su propia deducción para pequeñas empresas con condiciones adicionales y no se incluye aquí. Las sociedades que operan un negocio en Quebec pueden consultar las tasas vigentes en el sitio de Revenu Québec."),

      { type: "heading", id: "combinadas", text: "Tasas combinadas en Ontario, 2026" },
      p("Como tanto el gobierno federal como la provincia gravan el ingreso de las sociedades, la tasa que una sociedad realmente paga es la suma de ambas. Para una CCPC de Ontario, las cifras de 2026 son las siguientes."),
      {
        type: "table",
        head: ["Tipo de ingreso", "Federal", "Ontario", "Combinada"],
        rows: [
          ["Ingreso de pequeña empresa, antes del 1 de julio de 2026", "9 %", "3,2 %", "12,2 %"],
          ["Ingreso de pequeña empresa, desde el 1 de julio de 2026", "9 %", "2,2 %", "11,2 %"],
          ["Ingreso a la tasa general", "15 %", "11,5 %", "26,5 %"],
        ],
      },
      p("La reducción de Ontario se prorratea para un año fiscal que abarca el 1 de julio de 2026, de modo que una sociedad con cierre fiscal el 31 de diciembre de 2026 tendrá una tasa de Ontario mixta para ese año. Ontario también ofrece un crédito para manufactura y procesamiento que puede bajar la tasa de Ontario sobre el ingreso que califica al 10 por ciento. El impuesto de sociedades de Ontario se declara en la misma declaración T2 federal, con anexos de Ontario, y lo recauda la CRA."),

      { type: "heading", id: "el-truco", text: "El truco: es diferimiento, no un descuento" },
      p("La tasa reducida de sociedades no es dinero gratis. Cuando saca ingresos de la sociedad para gastarlos personalmente, como salario o dividendos, paga impuesto personal encima. El sistema canadiense se basa en la integración: a grandes rasgos, termina en un lugar parecido tanto si gana el ingreso personalmente como a través de una sociedad y lo saca todo. El verdadero beneficio es el momento: el dinero que deja en la sociedad se grava a la tasa reducida y puede reinvertirse en el negocio hasta que lo necesite."),
      p("Por eso importa tanto la decisión de cómo pagarse, y por eso ", { text: "el salario frente a los dividendos", href: "/guides/salario-o-dividendos" }, " es un tema propio. También por eso constituirse en sociedad suele tener más sentido financiero cuando un negocio gana más de lo que su propietario necesita para vivir. Nuestra comparación entre la ", { text: "empresa unipersonal y la sociedad", href: "/guides/empresa-unipersonal-o-sociedad" }, " cubre las demás diferencias, como la responsabilidad limitada y los costos continuos."),

      { type: "heading", id: "plazos-t2", text: "Plazo de la declaración T2 y cuándo se paga el impuesto" },
      p("Toda sociedad residente en Canadá debe presentar una declaración del impuesto de sociedades T2 por cada año fiscal, aunque no deba impuestos y aunque haya estado inactiva. El plazo de presentación y el plazo de pago son fechas distintas, y la fecha de pago llega primero."),
      {
        type: "list",
        items: [
          "Plazo de presentación. La declaración T2 vence dentro de los seis meses siguientes al cierre del año fiscal. Para un año que termina el último día de un mes, vence el último día del sexto mes siguiente. Un cierre al 31 de marzo significa un plazo al 30 de septiembre, y un cierre al 30 de junio significa un plazo al 31 de diciembre.",
          "Fecha de vencimiento del saldo. En general, cualquier impuesto adeudado vence dos meses después del cierre del año fiscal.",
          "Saldo a tres meses para algunas CCPC. El saldo vence tres meses después del cierre si la sociedad fue una CCPC durante todo el año, solicitó la deducción para pequeñas empresas en el año en curso o en el anterior, y su ingreso imponible del año anterior (combinado con el de sus sociedades asociadas, si las hay) no superó su límite de negocios.",
        ],
      },
      p("Se generan intereses sobre cualquier saldo no pagado en la fecha de vencimiento del saldo, aunque la declaración en sí todavía no esté atrasada. Las sociedades federales y de Ontario también presentan una declaración anual separada conforme al derecho de sociedades, que es distinta de la T2. Nuestra guía sobre las ", { text: "declaraciones anuales de sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" }, " explica la diferencia, y Korporex puede presentar por usted la ", { text: "declaración anual de Ontario", href: "/services/annual-return-on" }, " o la ", { text: "declaración anual federal", href: "/services/annual-return-federal" }, "."),

      { type: "heading", id: "pagos-a-cuenta", text: "Los pagos a cuenta" },
      p("Cuando una sociedad debe más que una pequeña cantidad de impuesto, por lo general paga durante el año en lugar de pagar todo después del cierre. En términos generales, las reglas funcionan así:"),
      {
        type: "list",
        items: [
          "No se exigen pagos a cuenta si el impuesto a pagar de la sociedad es de 3 000 $ o menos para el año en curso o para el año anterior.",
          "De lo contrario, las sociedades suelen hacer pagos a cuenta mensuales, y el primero vence un mes menos un día después del inicio del año fiscal.",
          "Una pequeña CCPC que califica puede pagar trimestralmente. Debe tener un historial de cumplimiento perfecto y, junto con sus sociedades asociadas, un ingreso imponible de 500 000 $ o menos y un capital imponible empleado en Canadá de 10 millones de dólares o menos para el año en curso o el anterior.",
        ],
      },
      p("Un negocio recién constituido normalmente no tiene pagos a cuenta en su primer año, porque no tiene un año anterior de impuesto a pagar. Cuánto pagar después, y qué método de cálculo usar, son preguntas para el contador de la sociedad."),

      { type: "heading", id: "pasos", text: "Prepararse para el impuesto de sociedades" },
      { type: "list", items: [
        "Constituirse en sociedad, a nivel federal o en Ontario. La deducción para pequeñas empresas solo está disponible para una sociedad.",
        "Obtener un número de negocio. Una sociedad federal o de Ontario recibe uno de la CRA, y es el número de cuenta para las declaraciones T2 de la sociedad.",
        "Elegir un cierre fiscal. Fija el plazo de presentación de seis meses y el plazo de pago de dos o tres meses.",
        "Mantener separado el dinero de la sociedad y el personal, normalmente con una cuenta bancaria empresarial propia.",
        "Contratar a un contador para preparar la declaración T2 y asesorar sobre salario, dividendos y pagos a cuenta.",
      ] },
      p("Para más información sobre el segundo paso, consulte nuestra guía sobre ", { text: "cómo obtener un número de negocio de la CRA", href: "/guides/como-obtener-un-numero-de-negocio-cra" }, ". Los profesionales como médicos y abogados también pueden acceder a la tasa para pequeñas empresas mediante una estructura regulada, que se explica en nuestra guía sobre las ", { text: "sociedades profesionales en Canadá", href: "/guides/sociedad-profesional-canada" }, "."),
      { type: "callout", text: "Las tasas de impuestos y los umbrales cambian con los presupuestos federales y provinciales. Tome las cifras aquí como una instantánea de 2026, y confirme las tasas actuales y cómo se aplican a su caso con la CRA o un contador calificado. Esta guía es información general, no asesoramiento fiscal." },

      { type: "heading", id: "donde-korporex", text: "Dónde encaja Korporex" },
      p("La tasa para pequeñas empresas solo está disponible para una sociedad, así que acceder a ella empieza por constituirse. Korporex ", { text: "presenta su constitución federal u ontariana en línea", href: "/incorporate" }, ", el paso que hace que la deducción para pequeñas empresas esté disponible para su negocio. Korporex no prepara declaraciones de impuestos ni da asesoramiento fiscal; su contador se encarga de la T2. Si está evaluando si el paso le conviene, nuestra guía sobre ", { text: "cómo constituirse en sociedad como autónomo", href: "/guides/como-constituirse-en-sociedad-autonomo" }, " explica el lado práctico."),
    ],
    faq: [
      { q: "¿Cuál es la tasa de impuesto para pequeñas empresas en Ontario?", a: "Para una sociedad privada bajo control canadiense que solicita la deducción para pequeñas empresas, la tasa combinada federal y de Ontario sobre los primeros 500 000 $ de ingreso de un negocio activo es del 12,2 por ciento hasta el 30 de junio de 2026 y del 11,2 por ciento desde el 1 de julio de 2026. Es el 9 por ciento federal más la tasa reducida de Ontario, que bajó del 3,2 al 2,2 por ciento." },
      { q: "¿Cuál es la tasa general del impuesto de sociedades en Canadá?", a: "La tasa general federal neta es del 15 por ciento en 2026, después del abatimiento federal y la reducción de la tasa general. Las provincias y territorios añaden su propia tasa más alta, que va del 8 por ciento en Alberta al 15 por ciento en la Isla del Príncipe Eduardo y en Terranova y Labrador. En Ontario, la tasa general combinada es del 26,5 por ciento." },
      { q: "¿Todas las sociedades obtienen la tasa para pequeñas empresas?", a: "No. Solo una sociedad privada bajo control canadiense puede solicitar la deducción para pequeñas empresas, y solo sobre el ingreso de un negocio activo hasta su límite de negocios. El ingreso de inversión y el de un negocio de servicios personales no califican. Las sociedades asociadas comparten un solo límite de 500 000 $, que se reduce con mucho ingreso pasivo o capital elevado." },
      { q: "¿Cuándo vence la declaración de impuestos de una sociedad en Canadá?", a: "La declaración T2 vence seis meses después del cierre del año fiscal de la sociedad. Cualquier impuesto adeudado suele vencer antes, dos meses después del cierre. Algunas CCPC que solicitaron la deducción para pequeñas empresas y se mantuvieron dentro de su límite de negocios el año anterior tienen tres meses para pagar. Después se aplican intereses sobre el saldo impago." },
      { q: "¿Una sociedad nueva debe hacer pagos a cuenta?", a: "No se exigen pagos a cuenta cuando el impuesto a pagar es de 3 000 $ o menos para el año en curso o el anterior. Una sociedad nueva no tiene año anterior, así que normalmente no se exigen pagos a cuenta en su primer año. Después, las sociedades suelen pagar cada mes, y una pequeña CCPC que califica puede pagar cada trimestre." },
      { q: "¿La tasa es distinta para una sociedad federal en Ontario?", a: "No. Una sociedad constituida a nivel federal y una constituida conforme a la ley de Ontario pagan las mismas tasas sobre el ingreso ganado en Ontario. El impuesto de sociedades depende de dónde se gana el ingreso y de si la sociedad es una CCPC, no de la ley de constitución. La elección entre federal y Ontario depende de otros factores, como la protección del nombre." },
    ],
  },
};
