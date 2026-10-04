import type { ArticleInline, ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

// Builds a paragraph whose `text` is always the exact concatenation of its parts.
const p = (...parts: ArticleInline[]): ArticleSection => ({
  type: "paragraph",
  text: parts.map((x) => (typeof x === "string" ? x : x.text)).join(""),
  parts,
});

export const expanded: Record<"en" | "fr" | "es", ExpandedArticle> = {
  // ── English ──
  en: {
    readTime: "9 min read",
    content: [
      {
        type: "paragraph",
        text: "In Canada, the owner of an incorporated business generally pays themselves in one of two ways: a salary or dividends. A salary is employment income. The corporation deducts it, runs payroll, withholds income tax and CPP, and reports it on a T4 slip, and it creates RRSP contribution room and CPP pension credits for you. A dividend is a distribution of after-tax profit to shareholders. The corporation cannot deduct it, there is no payroll and no CPP, it is reported on a T5 slip, and it is taxed personally through the gross-up and dividend tax credit. Many owners use a mix of the two.",
      },
      {
        type: "paragraph",
        text: "The starting point is that the corporation's money is not automatically your money. A corporation is a separate legal person, and to get paid you have to move money out of it deliberately. This guide explains how each method works, what each one means for the corporation and for you, and how the paperwork is handled, so that the conversation with your accountant starts from a solid footing.",
      },
      {
        type: "heading",
        id: "salary",
        text: "Paying yourself a salary",
      },
      {
        type: "paragraph",
        text: "When an owner takes a salary, the corporation is the employer and the owner is its employee. That means the corporation has the same payroll obligations it would have for any other employee. In practice, salary involves the following steps.",
      },
      {
        type: "list",
        items: [
          "Open a payroll program account. The corporation adds a payroll program account (an RP account) to its CRA business number before the first remittance is due.",
          "Withhold source deductions. Each time salary is paid, the corporation withholds income tax and the employee's CPP contributions from the gross pay.",
          "Pay the employer share. The corporation also pays its own employer CPP contribution, equal to the employee's contribution.",
          "Remit to the CRA. The amounts withheld and the employer share are sent to the CRA on the remittance schedule that applies to the corporation.",
          "Issue a T4 slip. After the calendar year ends, the corporation files T4 slips and a T4 Summary with the CRA and gives the employee a copy, by the last day of February.",
        ],
      },
      p(
        "If the corporation does not yet have a business number, that comes first, since the payroll account is added to it. See ",
        { text: "how to get a CRA business number", href: "/guides/how-to-get-a-cra-business-number" },
        ", or have it handled through the ",
        { text: "business number service", href: "/services/business-number" },
        ".",
      ),
      {
        type: "paragraph",
        text: "From the corporation's side, a salary is a business expense. Reasonable salary paid to an owner who works in the business is deducted in computing the corporation's income, which lowers its corporate tax. From your side, the salary is employment income taxed at your personal marginal rates, the same way any other employee's wages are taxed.",
      },
      {
        type: "heading",
        id: "cpp",
        text: "CPP contributions on salary",
      },
      {
        type: "paragraph",
        text: "Salary is pensionable earnings, so CPP contributions apply on both sides. For an owner-manager, both sides come out of the same pocket: the employee share is withheld from your pay and the employer share is paid by your corporation. For 2026, the CRA's published figures are as follows.",
      },
      {
        type: "table",
        head: ["2026 CPP figure", "Amount"],
        rows: [
          ["Year's maximum pensionable earnings (YMPE)", "$74,600"],
          ["Basic exemption", "$3,500"],
          ["Employee and employer contribution rate (each)", "5.95%"],
          ["Maximum employee contribution (same for employer)", "$4,230.45"],
          ["Year's additional maximum pensionable earnings (YAMPE)", "$85,000"],
          ["CPP2 rate on earnings between YMPE and YAMPE (each)", "4%"],
          ["Maximum CPP2 employee contribution (same for employer)", "$416"],
        ],
      },
      {
        type: "paragraph",
        text: "These figures change every January, so check the CRA's current tables before running payroll. The contributions are not lost money: they earn credits toward a CPP retirement pension and other CPP benefits, which are based on your contribution history. Dividends do not count as pensionable earnings, so years in which you are paid only by dividends add nothing to your CPP record.",
      },
      {
        type: "callout",
        title: "What about Employment Insurance?",
        text: "Under the Employment Insurance Act, employment is excluded from EI if the employee controls more than 40% of the voting shares of the corporation. Many owner-managers fall into that category, so their salary is often not insurable and no EI premiums are deducted. They can, however, register for EI special benefits on the same basis as self-employed people. Confirm your own status with the CRA or your accountant.",
      },
      {
        type: "heading",
        id: "rrsp",
        text: "RRSP room comes from salary, not dividends",
      },
      {
        type: "paragraph",
        text: "Your RRSP deduction limit for a year is based on 18% of your earned income for the previous year, up to an annual dollar limit, which the CRA has set at $33,810 for 2026. Earned income includes employment income such as salary. It does not include dividends. An owner who takes only dividends therefore builds no new RRSP contribution room from that income. This is one of the main reasons owners who want to save inside an RRSP choose to take at least some salary.",
      },
      {
        type: "heading",
        id: "dividends",
        text: "Paying yourself dividends",
      },
      {
        type: "paragraph",
        text: "A dividend is a distribution of the corporation's profits to its shareholders. It is paid out of income the corporation has already paid tax on, so the corporation does not deduct it. There is no payroll account, no source deductions and no CPP. After the end of the calendar year, the corporation reports the dividends on T5 slips and a T5 Summary, filed with the CRA and given to each recipient by the last day of February.",
      },
      {
        type: "paragraph",
        text: "Corporate law sets conditions on paying dividends. Under both the Canada Business Corporations Act (section 42) and Ontario's Business Corporations Act (subsection 38(3)), a dividend cannot be declared or paid if there are reasonable grounds for believing the corporation would be unable to pay its liabilities as they become due, or that the realizable value of its assets would fall below the total of its liabilities and the stated capital of all classes of shares. The directors declare the dividend, and the declaration is recorded in a resolution.",
      },
      p(
        "Dividends are paid on shares, so they depend on the corporation's share structure. Which classes of shares exist, and whether a class can receive dividends separately from the others, is set out in the ",
        { text: "articles of incorporation", href: "/guides/what-are-articles-of-incorporation" },
        ". Paying dividends to family members who hold shares raises additional rules, including the tax on split income (TOSI), which is a topic for an accountant.",
      ),
      {
        type: "heading",
        id: "dividend-tax",
        text: "How dividends are taxed: eligible and non-eligible",
      },
      {
        type: "paragraph",
        text: "Because the corporation has already paid tax on the profits it distributes, dividends are not taxed like salary. Instead, the shareholder reports a grossed-up amount and then claims a dividend tax credit. The gross-up approximates the pre-tax corporate income behind the dividend, and the credit approximates the tax the corporation already paid. There are two types of dividends, and each has its own gross-up.",
      },
      {
        type: "list",
        items: [
          "Eligible dividends: the taxable amount is 138% of the dividend actually received (a 38% gross-up). These are generally paid out of income taxed at the general corporate rate, and the corporation designates them as eligible when it pays them.",
          "Other than eligible (non-eligible) dividends: the taxable amount is 115% of the dividend received (a 15% gross-up). Dividends paid by a Canadian-controlled private corporation out of income taxed at the small business rate are generally non-eligible.",
          "Both types attract a federal dividend tax credit, and each province and territory has its own dividend tax credit as well.",
        ],
      },
      {
        type: "paragraph",
        text: "These are the gross-up rates the CRA applies on the current personal return (line 12000). The exact personal tax on a dividend depends on your province, your other income and the type of dividend, so the comparison with salary is always a calculation, never a rule of thumb.",
      },
      {
        type: "heading",
        id: "integration",
        text: "The idea behind integration",
      },
      p(
        "Canadian tax is designed around a principle called integration. In theory, a dollar of business income should bear roughly the same total tax whether you earn it personally or earn it through a corporation and pay it out to yourself. Salary achieves this by being deductible: the corporation pays no tax on it and you pay personal tax. Dividends achieve it through the gross-up and credit: the corporation pays ",
        { text: "corporate tax", href: "/guides/corporate-tax-rate-canada" },
        " first, and the credit offsets part of your personal tax.",
      ),
      {
        type: "paragraph",
        text: "Integration is not perfect. Depending on the province, the year and the type of income, salary and dividends can produce slightly different totals, which is part of why the decision is worth modelling. Integration also explains why the real advantage of a corporation is often timing: profit left inside the corporation is taxed only at the corporate rate until it is paid out.",
      },
      {
        type: "heading",
        id: "compared",
        text: "Salary vs dividends at a glance",
      },
      {
        type: "table",
        head: ["Factor", "Salary", "Dividends"],
        rows: [
          ["Deductible to the corporation", "Yes", "No"],
          ["CRA account needed", "Payroll program account (RP)", "None beyond the corporation's own accounts"],
          ["Source deductions", "Income tax and CPP withheld", "None"],
          ["CPP contributions", "Yes, employee and employer share", "No"],
          ["Builds CPP pension credits", "Yes", "No"],
          ["Creates RRSP contribution room", "Yes (earned income)", "No"],
          ["Year-end slip", "T4", "T5"],
          ["Personal tax treatment", "Employment income at marginal rates", "Gross-up and dividend tax credit"],
          ["Corporate law conditions", "Employment terms", "Solvency test; declared by directors"],
          ["Administration", "Regular payroll and remittances", "Resolution and annual T5 filing"],
        ],
      },
      {
        type: "heading",
        id: "which-is-better",
        text: "Which is better?",
      },
      {
        type: "paragraph",
        text: "There is no universal answer, which is why you see business owners do different things. The relevant factors include how much you need to take home each year, whether you want to build RRSP room and CPP credits, whether the corporation benefits from the deduction, how much profit you intend to leave in the corporation, your province, and your overall income level. Some owners value the CPP pension and the RRSP room that salary brings. Others prefer the simpler administration of dividends and plan for retirement in other ways.",
      },
      {
        type: "heading",
        id: "mixed",
        text: "Mixed strategies",
      },
      {
        type: "paragraph",
        text: "Many owners take a mix, often a salary set at a level chosen with their accountant, such as enough to reach a target amount of RRSP room or CPP earnings, and then dividends on top as cash flow and profits allow. Others change the mix from year to year as income rises or falls. A mixed approach means the corporation carries out both sets of formalities: payroll and T4 slips for the salary, and directors' resolutions and T5 slips for the dividends.",
      },
      {
        type: "callout",
        text: "This is a tax-planning decision, not a formula. The right split changes with your income and your goals, so it is worth running your actual numbers with a qualified accountant rather than copying what someone else does.",
      },
      {
        type: "heading",
        id: "shareholder-loans",
        text: "A note on shareholder loans",
      },
      {
        type: "paragraph",
        text: "Some owners simply take money out of the corporation's bank account without calling it salary or dividends. In the books, that usually becomes a loan to the shareholder, and the Income Tax Act has a specific rule for it. Under subsection 15(2), a loan from a corporation to a shareholder, or to a person connected with a shareholder, is generally included in the shareholder's income. Subsection 15(2.6) provides an exception where the loan is repaid within one year after the end of the corporation's taxation year in which it was made, and the repayment is not part of a series of loans and repayments.",
      },
      {
        type: "paragraph",
        text: "Other exceptions and related rules, including interest benefit rules, can also apply. A shareholder loan is therefore not a substitute for salary or dividends, and any balance owing to the corporation at year-end is something to review with your accountant before the deadline passes.",
      },
      {
        type: "heading",
        id: "minute-book",
        text: "Recording salary and dividends in the minute book",
      },
      p(
        "Dividends are declared by the directors, and that decision belongs in the corporation's ",
        { text: "minute book", href: "/guides/corporate-minute-book" },
        ". A dividend resolution typically states the class of shares, the amount per share or the total amount, the record date and the payment date. When the CRA reviews an owner-manager corporation, the minute book is one of the places it can look to confirm that dividends were properly authorized.",
      ),
      p(
        "Owner salaries and bonuses are also often approved by directors' resolution, particularly when the owner is also a director. Many corporations handle these approvals alongside their annual resolutions, which approve the financial statements and confirm the directors and officers. Korporex prepares ",
        { text: "Ontario annual resolutions", href: "/services/annual-resolution-on" },
        " and ",
        { text: "federal annual resolutions", href: "/services/annual-resolution-federal" },
        ", and can set up an ",
        { text: "initial minute book", href: "/services/initial-minute-book" },
        " for a corporation that does not have one yet.",
      ),
      {
        type: "heading",
        id: "where-korporex-fits",
        text: "Where Korporex fits",
      },
      p(
        "Paying yourself dividends is only possible because your corporation has a share structure that allows it. Korporex sets up that share structure when it ",
        { text: "files your incorporation", href: "/incorporate" },
        ", so the option is there from day one.",
      ),
      p(
        "Korporex is not an accounting firm and does not give tax advice. The choice between salary, dividends or a mix is one to make with a qualified accountant. For related structures, see ",
        { text: "holding companies in Canada", href: "/guides/holding-company-canada" },
        " and ",
        { text: "sole proprietorship vs corporation", href: "/guides/sole-proprietorship-vs-corporation" },
        ".",
      ),
    ],
    faq: [
      {
        q: "Is it better to take salary or dividends from my corporation in Canada?",
        a: "There is no single answer. Salary is deductible to the corporation and creates RRSP room and CPP credits, but it requires payroll and CPP contributions on both sides. Dividends are simpler to administer and are taxed through the gross-up and dividend tax credit, but they create no RRSP room or CPP credits. The right mix depends on your income, province and goals, so it is a question for your accountant.",
      },
      {
        q: "Do dividends create RRSP contribution room?",
        a: "No. RRSP contribution room is based on 18% of your earned income for the previous year, up to an annual dollar limit ($33,810 for 2026). Earned income includes employment income such as salary, but it does not include dividends. An owner paid only by dividends does not build new RRSP room from that income.",
      },
      {
        q: "Do I pay CPP on dividends from my corporation?",
        a: "No. CPP contributions apply to pensionable earnings such as salary, not to dividends. For 2026, salary attracts CPP at 5.95% from both the employee and the employer on earnings up to $74,600, after a $3,500 basic exemption, plus CPP2 at 4% each on earnings between $74,600 and $85,000. Dividends also add nothing to your CPP record.",
      },
      {
        q: "What is the difference between eligible and non-eligible dividends?",
        a: "Eligible dividends are generally paid out of income taxed at the general corporate rate and are grossed up by 38% on the personal return. Non-eligible dividends, typically paid by a Canadian-controlled private corporation out of income taxed at the small business rate, are grossed up by 15%. Each type has its own federal and provincial dividend tax credit.",
      },
      {
        q: "Can I just borrow money from my corporation instead?",
        a: "A shareholder loan is generally included in the shareholder's income under subsection 15(2) of the Income Tax Act. An exception applies if the loan is repaid within one year after the end of the corporation's taxation year in which it was made and the repayment is not part of a series of loans and repayments. Other rules can also apply, so review any balance with your accountant.",
      },
      {
        q: "Do dividends need to be recorded in the minute book?",
        a: "Dividends are declared by the directors, and that declaration is recorded in a resolution kept in the corporation's minute book. The resolution typically sets out the share class, the amount, the record date and the payment date. Corporate law also prohibits paying a dividend where the corporation would fail the solvency test, so the directors consider that test when they declare it.",
      },
    ],
  },

  // ── Français ──
  fr: {
    readTime: "10 min de lecture",
    content: [
      {
        type: "paragraph",
        text: "Au Canada, le propriétaire d'une entreprise constituée en société se rémunère généralement de l'une de deux façons : un salaire ou des dividendes. Un salaire est un revenu d'emploi. La société le déduit, gère la paie, retient l'impôt et le RPC et le déclare sur un feuillet T4, et il vous procure des droits de cotisation à un REER et des crédits de rente du RPC. Un dividende est une distribution des bénéfices après impôt aux actionnaires. La société ne peut pas le déduire, il n'y a ni paie ni RPC, il est déclaré sur un feuillet T5 et il est imposé personnellement au moyen de la majoration et du crédit d'impôt pour dividendes. Beaucoup de propriétaires combinent les deux.",
      },
      {
        type: "paragraph",
        text: "Le point de départ est que l'argent de la société n'est pas automatiquement le vôtre. Une société est une personne morale distincte, et pour être payé, vous devez en sortir l'argent de façon délibérée. Ce guide explique comment fonctionne chaque méthode, ce qu'elle signifie pour la société et pour vous, et comment la paperasse est gérée, afin que la discussion avec votre comptable parte sur de bonnes bases.",
      },
      {
        type: "heading",
        id: "salaire",
        text: "Vous verser un salaire",
      },
      {
        type: "paragraph",
        text: "Lorsqu'un propriétaire touche un salaire, la société est l'employeur et le propriétaire est son employé. La société a donc les mêmes obligations de paie que pour n'importe quel autre employé. En pratique, le salaire comporte les étapes suivantes.",
      },
      {
        type: "list",
        items: [
          "Ouvrir un compte de programme de retenues sur la paie. La société ajoute un compte de retenues sur la paie (compte RP) à son numéro d'entreprise de l'ARC avant la date du premier versement.",
          "Effectuer les retenues à la source. À chaque paie, la société retient l'impôt sur le revenu et les cotisations au RPC de l'employé sur le salaire brut.",
          "Payer la part de l'employeur. La société verse aussi sa propre cotisation d'employeur au RPC, égale à celle de l'employé.",
          "Verser les sommes à l'ARC. Les montants retenus et la part de l'employeur sont remis à l'ARC selon le calendrier de versement qui s'applique à la société.",
          "Produire un feuillet T4. Après la fin de l'année civile, la société produit les feuillets T4 et un Sommaire T4 auprès de l'ARC et remet une copie à l'employé, au plus tard le dernier jour de février.",
        ],
      },
      p(
        "Si la société n'a pas encore de numéro d'entreprise, il faut commencer par là, puisque le compte de retenues sur la paie s'y ajoute. Consultez ",
        { text: "comment obtenir un numéro d'entreprise de l'ARC", href: "/guides/comment-obtenir-un-numero-dentreprise-arc" },
        ", ou confiez la démarche au ",
        { text: "service de numéro d'entreprise", href: "/services/business-number" },
        ".",
      ),
      {
        type: "paragraph",
        text: "Du côté de la société, un salaire est une dépense d'entreprise. Un salaire raisonnable versé à un propriétaire qui travaille dans l'entreprise est déduit dans le calcul du revenu de la société, ce qui réduit son impôt. De votre côté, le salaire est un revenu d'emploi imposé à vos taux marginaux personnels, comme le salaire de n'importe quel autre employé.",
      },
      {
        type: "heading",
        id: "rpc",
        text: "Les cotisations au RPC sur le salaire",
      },
      {
        type: "paragraph",
        text: "Le salaire constitue des gains ouvrant droit à pension, de sorte que les cotisations au RPC s'appliquent des deux côtés. Pour un propriétaire-dirigeant, les deux parts sortent de la même poche : la part de l'employé est retenue sur votre paie et la part de l'employeur est payée par votre société. Pour 2026, les chiffres publiés par l'ARC sont les suivants.",
      },
      {
        type: "table",
        head: ["Donnée du RPC pour 2026", "Montant"],
        rows: [
          ["Maximum des gains annuels ouvrant droit à pension (MGAP)", "74 600 $"],
          ["Exemption de base", "3 500 $"],
          ["Taux de cotisation de l'employé et de l'employeur (chacun)", "5,95 %"],
          ["Cotisation maximale de l'employé (identique pour l'employeur)", "4 230,45 $"],
          ["Maximum supplémentaire des gains annuels ouvrant droit à pension (MSGAP)", "85 000 $"],
          ["Taux du RPC2 sur les gains entre le MGAP et le MSGAP (chacun)", "4 %"],
          ["Cotisation maximale au RPC2 de l'employé (identique pour l'employeur)", "416 $"],
        ],
      },
      {
        type: "paragraph",
        text: "Ces chiffres changent chaque mois de janvier; vérifiez donc les tables à jour de l'ARC avant de faire la paie. Les cotisations ne sont pas de l'argent perdu : elles donnent droit à des crédits pour une pension de retraite du RPC et à d'autres prestations du RPC, qui sont fondées sur votre historique de cotisations. Les dividendes ne sont pas des gains ouvrant droit à pension; les années où vous êtes payé uniquement en dividendes n'ajoutent donc rien à votre dossier du RPC.",
      },
      {
        type: "callout",
        title: "Et l'assurance-emploi?",
        text: "Selon la Loi sur l'assurance-emploi, l'emploi est exclu de l'AE si l'employé contrôle plus de 40 % des actions avec droit de vote de la société. Beaucoup de propriétaires-dirigeants entrent dans cette catégorie, de sorte que leur salaire n'est souvent pas assurable et qu'aucune cotisation d'AE n'est retenue. Ils peuvent toutefois s'inscrire aux prestations spéciales de l'AE au même titre que les travailleurs autonomes. Confirmez votre propre situation auprès de l'ARC ou de votre comptable.",
      },
      {
        type: "heading",
        id: "reer",
        text: "Les droits de REER viennent du salaire, pas des dividendes",
      },
      {
        type: "paragraph",
        text: "Votre maximum déductible au titre des REER pour une année est fondé sur 18 % de votre revenu gagné de l'année précédente, jusqu'à un plafond annuel en dollars, que l'ARC a fixé à 33 810 $ pour 2026. Le revenu gagné comprend le revenu d'emploi, comme le salaire. Il ne comprend pas les dividendes. Un propriétaire qui ne prend que des dividendes n'accumule donc aucun nouveau droit de cotisation à un REER grâce à ce revenu. C'est l'une des principales raisons pour lesquelles les propriétaires qui veulent épargner dans un REER choisissent de prendre au moins une partie en salaire.",
      },
      {
        type: "heading",
        id: "dividendes",
        text: "Vous verser des dividendes",
      },
      {
        type: "paragraph",
        text: "Un dividende est une distribution des bénéfices de la société à ses actionnaires. Il est versé à partir d'un revenu sur lequel la société a déjà payé l'impôt, la société ne le déduit donc pas. Il n'y a ni compte de retenues sur la paie, ni retenues à la source, ni RPC. Après la fin de l'année civile, la société déclare les dividendes sur des feuillets T5 et un Sommaire T5, produits auprès de l'ARC et remis à chaque bénéficiaire au plus tard le dernier jour de février.",
      },
      {
        type: "paragraph",
        text: "Le droit des sociétés impose des conditions au versement de dividendes. Selon la Loi canadienne sur les sociétés par actions (article 42) comme selon la Loi sur les sociétés par actions de l'Ontario (paragraphe 38(3)), un dividende ne peut être déclaré ni versé s'il existe des motifs raisonnables de croire que la société ne pourrait pas acquitter son passif à échéance, ou que la valeur de réalisation de son actif deviendrait inférieure au total de son passif et du capital déclaré de toutes les catégories d'actions. Les administrateurs déclarent le dividende, et la déclaration est consignée dans une résolution.",
      },
      p(
        "Les dividendes sont versés sur des actions; ils dépendent donc de la structure d'actions de la société. Les catégories d'actions qui existent, et la possibilité pour une catégorie de recevoir des dividendes séparément des autres, sont prévues dans les ",
        { text: "statuts constitutifs", href: "/guides/que-sont-les-statuts-constitutifs" },
        ". Verser des dividendes à des membres de la famille qui détiennent des actions fait intervenir des règles supplémentaires, dont l'impôt sur le revenu fractionné (IFR), un sujet à aborder avec un comptable.",
      ),
      {
        type: "heading",
        id: "imposition-dividendes",
        text: "L'imposition des dividendes : déterminés et autres que déterminés",
      },
      {
        type: "paragraph",
        text: "Comme la société a déjà payé l'impôt sur les bénéfices qu'elle distribue, les dividendes ne sont pas imposés comme un salaire. L'actionnaire déclare plutôt un montant majoré, puis demande un crédit d'impôt pour dividendes. La majoration représente approximativement le revenu de la société avant impôt derrière le dividende, et le crédit représente approximativement l'impôt que la société a déjà payé. Il existe deux types de dividendes, chacun avec sa propre majoration.",
      },
      {
        type: "list",
        items: [
          "Dividendes déterminés : le montant imposable est de 138 % du dividende réellement reçu (majoration de 38 %). Ils sont généralement versés à partir d'un revenu imposé au taux général des sociétés, et la société les désigne comme déterminés au moment de les verser.",
          "Dividendes autres que déterminés : le montant imposable est de 115 % du dividende reçu (majoration de 15 %). Les dividendes versés par une société privée sous contrôle canadien à partir d'un revenu imposé au taux des petites entreprises sont généralement autres que déterminés.",
          "Les deux types donnent droit à un crédit d'impôt fédéral pour dividendes, et chaque province et territoire a aussi son propre crédit d'impôt pour dividendes.",
        ],
      },
      {
        type: "paragraph",
        text: "Ce sont les taux de majoration que l'ARC applique dans la déclaration de revenus personnelle actuelle (ligne 12000). L'impôt personnel exact sur un dividende dépend de votre province, de vos autres revenus et du type de dividende; la comparaison avec le salaire est donc toujours un calcul, jamais une règle empirique.",
      },
      {
        type: "heading",
        id: "integration",
        text: "Le principe de l'intégration",
      },
      p(
        "Le régime fiscal canadien repose sur un principe appelé l'intégration. En théorie, un dollar de revenu d'entreprise devrait supporter à peu près le même impôt total, que vous le gagniez personnellement ou par l'entremise d'une société qui vous le verse ensuite. Le salaire y parvient parce qu'il est déductible : la société ne paie pas d'impôt sur ce montant et vous payez l'impôt personnel. Les dividendes y parviennent par la majoration et le crédit : la société paie d'abord l'",
        { text: "impôt des sociétés", href: "/guides/taux-imposition-societes-canada" },
        ", et le crédit compense une partie de votre impôt personnel.",
      ),
      {
        type: "paragraph",
        text: "L'intégration n'est pas parfaite. Selon la province, l'année et le type de revenu, le salaire et les dividendes peuvent produire des totaux légèrement différents, ce qui explique en partie pourquoi la décision mérite d'être modélisée. L'intégration explique aussi pourquoi l'avantage réel d'une société tient souvent au moment de l'imposition : les bénéfices laissés dans la société ne sont imposés qu'au taux des sociétés jusqu'à leur versement.",
      },
      {
        type: "heading",
        id: "comparaison",
        text: "Salaire ou dividendes, en un coup d'œil",
      },
      {
        type: "table",
        head: ["Facteur", "Salaire", "Dividendes"],
        rows: [
          ["Déductible pour la société", "Oui", "Non"],
          ["Compte de l'ARC requis", "Compte de retenues sur la paie (RP)", "Aucun au-delà des comptes de la société"],
          ["Retenues à la source", "Impôt et RPC retenus", "Aucune"],
          ["Cotisations au RPC", "Oui, part de l'employé et de l'employeur", "Non"],
          ["Crée des crédits de pension du RPC", "Oui", "Non"],
          ["Crée des droits de cotisation à un REER", "Oui (revenu gagné)", "Non"],
          ["Feuillet de fin d'année", "T4", "T5"],
          ["Traitement fiscal personnel", "Revenu d'emploi aux taux marginaux", "Majoration et crédit d'impôt pour dividendes"],
          ["Conditions du droit des sociétés", "Conditions d'emploi", "Critère de solvabilité; déclaré par les administrateurs"],
          ["Administration", "Paie et versements réguliers", "Résolution et production annuelle du T5"],
        ],
      },
      {
        type: "heading",
        id: "lequel-meilleur",
        text: "Lequel est le meilleur ?",
      },
      {
        type: "paragraph",
        text: "Il n'y a pas de réponse universelle, c'est pourquoi on voit des propriétaires d'entreprise faire des choses différentes. Les facteurs pertinents comprennent le montant dont vous avez besoin chaque année, votre désir de bâtir des droits de REER et des crédits du RPC, l'utilité de la déduction pour la société, la part des bénéfices que vous comptez laisser dans la société, votre province et votre niveau de revenu global. Certains propriétaires tiennent à la pension du RPC et aux droits de REER que procure le salaire. D'autres préfèrent l'administration plus simple des dividendes et planifient leur retraite autrement.",
      },
      {
        type: "heading",
        id: "strategies-mixtes",
        text: "Les stratégies mixtes",
      },
      {
        type: "paragraph",
        text: "Beaucoup de propriétaires prennent un mélange : souvent un salaire fixé à un niveau choisi avec leur comptable, par exemple pour atteindre un montant cible de droits de REER ou de gains au RPC, puis des dividendes par-dessus selon les liquidités et les bénéfices. D'autres modifient le dosage d'une année à l'autre à mesure que leur revenu monte ou baisse. Une approche mixte signifie que la société accomplit les deux séries de formalités : la paie et les feuillets T4 pour le salaire, et les résolutions des administrateurs et les feuillets T5 pour les dividendes.",
      },
      {
        type: "callout",
        text: "C'est une décision de planification fiscale, pas une formule. Le bon dosage change selon votre revenu et vos objectifs, alors il vaut la peine d'examiner vos chiffres réels avec un comptable qualifié plutôt que de copier ce que fait quelqu'un d'autre.",
      },
      {
        type: "heading",
        id: "prets-actionnaires",
        text: "Un mot sur les prêts aux actionnaires",
      },
      {
        type: "paragraph",
        text: "Certains propriétaires retirent simplement de l'argent du compte bancaire de la société sans l'appeler salaire ou dividende. Dans les livres, cela devient généralement un prêt à l'actionnaire, et la Loi de l'impôt sur le revenu prévoit une règle précise à ce sujet. Selon le paragraphe 15(2), un prêt consenti par une société à un actionnaire, ou à une personne rattachée à un actionnaire, est généralement inclus dans le revenu de l'actionnaire. Le paragraphe 15(2.6) prévoit une exception lorsque le prêt est remboursé dans l'année suivant la fin de l'année d'imposition de la société au cours de laquelle il a été consenti, et que le remboursement ne fait pas partie d'une série de prêts et de remboursements.",
      },
      {
        type: "paragraph",
        text: "D'autres exceptions et règles connexes, dont les règles sur les avantages liés aux intérêts, peuvent aussi s'appliquer. Un prêt à l'actionnaire ne remplace donc pas un salaire ou des dividendes, et tout solde dû à la société en fin d'exercice est à examiner avec votre comptable avant l'échéance.",
      },
      {
        type: "heading",
        id: "livre-proces-verbaux",
        text: "Consigner le salaire et les dividendes dans le livre des procès-verbaux",
      },
      p(
        "Les dividendes sont déclarés par les administrateurs, et cette décision a sa place dans le ",
        { text: "livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
        " de la société. Une résolution de dividende précise habituellement la catégorie d'actions, le montant par action ou le montant total, la date de référence et la date de versement. Lorsque l'ARC examine une société dirigée par son propriétaire, le livre des procès-verbaux est l'un des endroits où elle peut vérifier que les dividendes ont été dûment autorisés.",
      ),
      p(
        "Les salaires et les primes des propriétaires sont aussi souvent approuvés par résolution des administrateurs, en particulier lorsque le propriétaire est également administrateur. Beaucoup de sociétés traitent ces approbations en même temps que leurs résolutions annuelles, qui approuvent les états financiers et confirment les administrateurs et les dirigeants. Korporex prépare les ",
        { text: "résolutions annuelles de l'Ontario", href: "/services/annual-resolution-on" },
        " et les ",
        { text: "résolutions annuelles fédérales", href: "/services/annual-resolution-federal" },
        ", et peut monter un ",
        { text: "livre des procès-verbaux initial", href: "/services/initial-minute-book" },
        " pour une société qui n'en a pas encore.",
      ),
      {
        type: "heading",
        id: "ou-korporex",
        text: "Où se situe Korporex",
      },
      p(
        "Vous verser des dividendes n'est possible que parce que votre société a une structure d'actions qui le permet. Korporex met en place cette structure d'actions au moment où elle ",
        { text: "dépose votre constitution", href: "/incorporate" },
        ", de sorte que l'option est là dès le premier jour.",
      ),
      p(
        "Korporex n'est pas un cabinet comptable et ne donne pas de conseils fiscaux. Le choix entre salaire, dividendes ou un mélange se fait avec un comptable qualifié. Pour des structures connexes, consultez ",
        { text: "les sociétés de portefeuille au Canada", href: "/guides/societe-de-portefeuille-canada" },
        " et ",
        { text: "entreprise individuelle ou société", href: "/guides/entreprise-individuelle-ou-societe" },
        ".",
      ),
    ],
    faq: [
      {
        q: "Vaut-il mieux prendre un salaire ou des dividendes de ma société au Canada?",
        a: "Il n'y a pas de réponse unique. Le salaire est déductible pour la société et crée des droits de REER et des crédits du RPC, mais il exige une paie et des cotisations au RPC des deux côtés. Les dividendes sont plus simples à administrer et sont imposés par la majoration et le crédit d'impôt pour dividendes, mais ne créent ni droits de REER ni crédits du RPC. Le bon dosage est une question à examiner avec votre comptable.",
      },
      {
        q: "Les dividendes créent-ils des droits de cotisation à un REER?",
        a: "Non. Les droits de cotisation à un REER sont fondés sur 18 % de votre revenu gagné de l'année précédente, jusqu'à un plafond annuel en dollars (33 810 $ pour 2026). Le revenu gagné comprend le revenu d'emploi, comme le salaire, mais pas les dividendes. Un propriétaire payé uniquement en dividendes n'accumule pas de nouveaux droits de REER grâce à ce revenu.",
      },
      {
        q: "Est-ce que je paie le RPC sur les dividendes de ma société?",
        a: "Non. Les cotisations au RPC s'appliquent aux gains ouvrant droit à pension, comme le salaire, et non aux dividendes. Pour 2026, le salaire entraîne des cotisations au RPC de 5,95 % pour l'employé et pour l'employeur sur les gains jusqu'à 74 600 $, après une exemption de base de 3 500 $, plus le RPC2 de 4 % chacun sur les gains entre 74 600 $ et 85 000 $. Les dividendes n'ajoutent rien à votre dossier du RPC.",
      },
      {
        q: "Quelle est la différence entre les dividendes déterminés et autres que déterminés?",
        a: "Les dividendes déterminés sont généralement versés à partir d'un revenu imposé au taux général des sociétés et sont majorés de 38 % dans la déclaration personnelle. Les dividendes autres que déterminés, habituellement versés par une société privée sous contrôle canadien à partir d'un revenu imposé au taux des petites entreprises, sont majorés de 15 %. Chaque type a son propre crédit d'impôt fédéral et provincial pour dividendes.",
      },
      {
        q: "Puis-je simplement emprunter de l'argent à ma société?",
        a: "Un prêt à l'actionnaire est généralement inclus dans le revenu de l'actionnaire selon le paragraphe 15(2) de la Loi de l'impôt sur le revenu. Une exception s'applique si le prêt est remboursé dans l'année suivant la fin de l'année d'imposition de la société au cours de laquelle il a été consenti et que le remboursement ne fait pas partie d'une série de prêts et de remboursements. D'autres règles peuvent s'appliquer; examinez tout solde avec votre comptable.",
      },
      {
        q: "Les dividendes doivent-ils être consignés dans le livre des procès-verbaux?",
        a: "Les dividendes sont déclarés par les administrateurs, et cette déclaration est consignée dans une résolution conservée dans le livre des procès-verbaux de la société. La résolution précise habituellement la catégorie d'actions, le montant, la date de référence et la date de versement. Le droit des sociétés interdit aussi de verser un dividende si la société ne satisfait pas au critère de solvabilité; les administrateurs en tiennent compte au moment de le déclarer.",
      },
    ],
  },

  // ── Español ──
  es: {
    readTime: "10 min de lectura",
    content: [
      {
        type: "paragraph",
        text: "En Canadá, el dueño de un negocio constituido en sociedad generalmente se paga de una de dos maneras: un salario o dividendos. Un salario es ingreso de empleo. La sociedad lo deduce, maneja la nómina, retiene el impuesto y el CPP y lo declara en un comprobante T4, y le genera espacio de contribución al RRSP y créditos de pensión del CPP. Un dividendo es una distribución de ganancias después de impuestos a los accionistas. La sociedad no puede deducirlo, no hay nómina ni CPP, se declara en un comprobante T5 y se grava personalmente mediante el aumento (gross-up) y el crédito fiscal por dividendos. Muchos propietarios usan una mezcla de ambos.",
      },
      {
        type: "paragraph",
        text: "El punto de partida es que el dinero de la sociedad no es automáticamente su dinero. Una sociedad es una persona jurídica separada, y para cobrar tiene que sacar el dinero de forma deliberada. Esta guía explica cómo funciona cada método, qué significa para la sociedad y para usted, y cómo se maneja el papeleo, para que la conversación con su contador parta de una base sólida.",
      },
      {
        type: "heading",
        id: "salario",
        text: "Pagarse un salario",
      },
      {
        type: "paragraph",
        text: "Cuando un propietario toma un salario, la sociedad es el empleador y el propietario es su empleado. Eso significa que la sociedad tiene las mismas obligaciones de nómina que tendría con cualquier otro empleado. En la práctica, el salario implica los siguientes pasos.",
      },
      {
        type: "list",
        items: [
          "Abrir una cuenta del programa de nómina. La sociedad agrega una cuenta de nómina (cuenta RP) a su número de negocio de la CRA antes de la fecha del primer pago de retenciones.",
          "Hacer las retenciones en la fuente. Cada vez que paga el salario, la sociedad retiene el impuesto sobre la renta y los aportes del empleado al CPP del pago bruto.",
          "Pagar la parte del empleador. La sociedad también paga su propio aporte de empleador al CPP, igual al aporte del empleado.",
          "Remitir a la CRA. Los montos retenidos y la parte del empleador se envían a la CRA según el calendario de remisión que corresponda a la sociedad.",
          "Emitir un comprobante T4. Después de terminar el año calendario, la sociedad presenta los comprobantes T4 y un resumen T4 ante la CRA y entrega una copia al empleado, a más tardar el último día de febrero.",
        ],
      },
      p(
        "Si la sociedad aún no tiene número de negocio, eso va primero, ya que la cuenta de nómina se agrega a él. Consulte ",
        { text: "cómo obtener un número de negocio de la CRA", href: "/guides/como-obtener-un-numero-de-negocio-cra" },
        ", o encargue el trámite al ",
        { text: "servicio de número de negocio", href: "/services/business-number" },
        ".",
      ),
      {
        type: "paragraph",
        text: "Del lado de la sociedad, el salario es un gasto del negocio. Un salario razonable pagado a un propietario que trabaja en el negocio se deduce al calcular el ingreso de la sociedad, lo que reduce su impuesto. De su lado, el salario es ingreso de empleo gravado a sus tasas marginales personales, igual que el sueldo de cualquier otro empleado.",
      },
      {
        type: "heading",
        id: "cpp",
        text: "Aportes al CPP sobre el salario",
      },
      {
        type: "paragraph",
        text: "El salario es ingreso pensionable, así que los aportes al CPP se aplican de ambos lados. Para un propietario que dirige su sociedad, ambas partes salen del mismo bolsillo: la parte del empleado se retiene de su pago y la parte del empleador la paga su sociedad. Para 2026, las cifras publicadas por la CRA son las siguientes.",
      },
      {
        type: "table",
        head: ["Cifra del CPP para 2026", "Monto"],
        rows: [
          ["Máximo de ingresos pensionables del año (YMPE)", "$74,600"],
          ["Exención básica", "$3,500"],
          ["Tasa de aporte del empleado y del empleador (cada uno)", "5.95%"],
          ["Aporte máximo del empleado (igual para el empleador)", "$4,230.45"],
          ["Máximo adicional de ingresos pensionables del año (YAMPE)", "$85,000"],
          ["Tasa del CPP2 sobre ingresos entre el YMPE y el YAMPE (cada uno)", "4%"],
          ["Aporte máximo del empleado al CPP2 (igual para el empleador)", "$416"],
        ],
      },
      {
        type: "paragraph",
        text: "Estas cifras cambian cada enero, así que revise las tablas vigentes de la CRA antes de procesar la nómina. Los aportes no son dinero perdido: generan créditos para una pensión de jubilación del CPP y otros beneficios del CPP, que se basan en su historial de aportes. Los dividendos no cuentan como ingreso pensionable, así que los años en que se le paga solo con dividendos no suman nada a su registro del CPP.",
      },
      {
        type: "callout",
        title: "¿Y el seguro de empleo?",
        text: "Según la Employment Insurance Act, el empleo queda excluido del seguro de empleo (EI) si el empleado controla más del 40% de las acciones con derecho a voto de la sociedad. Muchos propietarios que dirigen su sociedad entran en esa categoría, así que su salario a menudo no es asegurable y no se retienen primas de EI. Sin embargo, pueden inscribirse en los beneficios especiales del EI en las mismas condiciones que los trabajadores autónomos. Confirme su propia situación con la CRA o su contador.",
      },
      {
        type: "heading",
        id: "rrsp",
        text: "El espacio de RRSP viene del salario, no de los dividendos",
      },
      {
        type: "paragraph",
        text: "Su límite de deducción del RRSP para un año se basa en el 18% de su ingreso ganado del año anterior, hasta un límite anual en dólares, que la CRA fijó en $33,810 para 2026. El ingreso ganado incluye el ingreso de empleo, como el salario. No incluye los dividendos. Un propietario que toma solo dividendos, por lo tanto, no genera nuevo espacio de contribución al RRSP con ese ingreso. Esta es una de las principales razones por las que los propietarios que quieren ahorrar dentro de un RRSP eligen tomar al menos una parte como salario.",
      },
      {
        type: "heading",
        id: "dividendos",
        text: "Pagarse dividendos",
      },
      {
        type: "paragraph",
        text: "Un dividendo es una distribución de las ganancias de la sociedad a sus accionistas. Se paga con ingresos sobre los que la sociedad ya pagó impuestos, así que la sociedad no lo deduce. No hay cuenta de nómina, ni retenciones en la fuente, ni CPP. Después de terminar el año calendario, la sociedad declara los dividendos en comprobantes T5 y un resumen T5, presentados ante la CRA y entregados a cada beneficiario a más tardar el último día de febrero.",
      },
      {
        type: "paragraph",
        text: "El derecho de sociedades impone condiciones al pago de dividendos. Tanto según la Canada Business Corporations Act (artículo 42) como según la Business Corporations Act de Ontario (subsección 38(3)), no puede declararse ni pagarse un dividendo si hay motivos razonables para creer que la sociedad no podría pagar sus pasivos a su vencimiento, o que el valor realizable de sus activos quedaría por debajo del total de sus pasivos y el capital declarado de todas las clases de acciones. Los directores declaran el dividendo, y la declaración se registra en una resolución.",
      },
      p(
        "Los dividendos se pagan sobre acciones, así que dependen de la estructura de acciones de la sociedad. Qué clases de acciones existen, y si una clase puede recibir dividendos por separado de las demás, se establece en los ",
        { text: "estatutos de constitución", href: "/guides/que-son-los-estatutos-de-constitucion" },
        ". Pagar dividendos a familiares que tienen acciones activa reglas adicionales, incluido el impuesto sobre la renta dividida (TOSI), un tema para tratar con un contador.",
      ),
      {
        type: "heading",
        id: "impuesto-dividendos",
        text: "Cómo se gravan los dividendos: elegibles y no elegibles",
      },
      {
        type: "paragraph",
        text: "Como la sociedad ya pagó impuestos sobre las ganancias que distribuye, los dividendos no se gravan como el salario. En su lugar, el accionista declara un monto aumentado y luego reclama un crédito fiscal por dividendos. El aumento aproxima el ingreso de la sociedad antes de impuestos detrás del dividendo, y el crédito aproxima el impuesto que la sociedad ya pagó. Hay dos tipos de dividendos, cada uno con su propio aumento.",
      },
      {
        type: "list",
        items: [
          "Dividendos elegibles (eligible dividends): el monto imponible es el 138% del dividendo realmente recibido (un aumento del 38%). Generalmente se pagan con ingresos gravados a la tasa general de sociedades, y la sociedad los designa como elegibles al pagarlos.",
          "Dividendos no elegibles (other than eligible): el monto imponible es el 115% del dividendo recibido (un aumento del 15%). Los dividendos que paga una sociedad privada bajo control canadiense con ingresos gravados a la tasa de pequeñas empresas generalmente son no elegibles.",
          "Ambos tipos dan derecho a un crédito fiscal federal por dividendos, y cada provincia y territorio tiene además su propio crédito fiscal por dividendos.",
        ],
      },
      {
        type: "paragraph",
        text: "Estas son las tasas de aumento que la CRA aplica en la declaración personal actual (línea 12000). El impuesto personal exacto sobre un dividendo depende de su provincia, de sus otros ingresos y del tipo de dividendo, así que la comparación con el salario es siempre un cálculo, nunca una regla general.",
      },
      {
        type: "heading",
        id: "integracion",
        text: "La idea detrás de la integración",
      },
      p(
        "El sistema tributario canadiense se basa en un principio llamado integración. En teoría, un dólar de ingreso empresarial debería soportar aproximadamente el mismo impuesto total, ya sea que usted lo gane personalmente o a través de una sociedad que luego se lo paga. El salario lo logra por ser deducible: la sociedad no paga impuesto sobre él y usted paga el impuesto personal. Los dividendos lo logran mediante el aumento y el crédito: la sociedad paga primero el ",
        { text: "impuesto de sociedades", href: "/guides/tasa-impuesto-sociedades-canada" },
        ", y el crédito compensa parte de su impuesto personal.",
      ),
      {
        type: "paragraph",
        text: "La integración no es perfecta. Según la provincia, el año y el tipo de ingreso, el salario y los dividendos pueden producir totales ligeramente distintos, lo que explica en parte por qué vale la pena modelar la decisión. La integración también explica por qué la ventaja real de una sociedad suele ser el momento: las ganancias que se dejan dentro de la sociedad solo se gravan a la tasa de sociedades hasta que se pagan.",
      },
      {
        type: "heading",
        id: "comparados",
        text: "Salario o dividendos, de un vistazo",
      },
      {
        type: "table",
        head: ["Factor", "Salario", "Dividendos"],
        rows: [
          ["Deducible para la sociedad", "Sí", "No"],
          ["Cuenta de la CRA necesaria", "Cuenta del programa de nómina (RP)", "Ninguna aparte de las cuentas de la sociedad"],
          ["Retenciones en la fuente", "Se retienen impuesto y CPP", "Ninguna"],
          ["Aportes al CPP", "Sí, parte del empleado y del empleador", "No"],
          ["Genera créditos de pensión del CPP", "Sí", "No"],
          ["Genera espacio de contribución al RRSP", "Sí (ingreso ganado)", "No"],
          ["Comprobante de fin de año", "T4", "T5"],
          ["Tratamiento fiscal personal", "Ingreso de empleo a tasas marginales", "Aumento y crédito fiscal por dividendos"],
          ["Condiciones del derecho de sociedades", "Condiciones de empleo", "Prueba de solvencia; declarado por los directores"],
          ["Administración", "Nómina y remisiones regulares", "Resolución y presentación anual del T5"],
        ],
      },
      {
        type: "heading",
        id: "cual-mejor",
        text: "¿Cuál es mejor?",
      },
      {
        type: "paragraph",
        text: "No hay una respuesta universal, por eso ve a los dueños de negocios hacer cosas diferentes. Los factores relevantes incluyen cuánto necesita llevar a casa cada año, si quiere generar espacio de RRSP y créditos del CPP, si a la sociedad le conviene la deducción, cuánta ganancia piensa dejar en la sociedad, su provincia y su nivel de ingreso general. Algunos propietarios valoran la pensión del CPP y el espacio de RRSP que da el salario. Otros prefieren la administración más simple de los dividendos y planifican su jubilación de otras maneras.",
      },
      {
        type: "heading",
        id: "estrategias-mixtas",
        text: "Estrategias mixtas",
      },
      {
        type: "paragraph",
        text: "Muchos propietarios toman una mezcla: a menudo un salario fijado en un nivel elegido con su contador, por ejemplo para alcanzar cierto espacio de RRSP o cierto ingreso pensionable del CPP, y luego dividendos encima según lo permitan el flujo de caja y las ganancias. Otros cambian la mezcla de un año a otro a medida que su ingreso sube o baja. Un enfoque mixto significa que la sociedad cumple ambos conjuntos de formalidades: nómina y comprobantes T4 para el salario, y resoluciones de los directores y comprobantes T5 para los dividendos.",
      },
      {
        type: "callout",
        text: "Es una decisión de planificación fiscal, no una fórmula. La proporción correcta cambia con su ingreso y sus objetivos, así que vale la pena revisar sus cifras reales con un contador calificado en lugar de copiar lo que hace otra persona.",
      },
      {
        type: "heading",
        id: "prestamos-accionistas",
        text: "Una nota sobre los préstamos a accionistas",
      },
      {
        type: "paragraph",
        text: "Algunos propietarios simplemente sacan dinero de la cuenta bancaria de la sociedad sin llamarlo salario ni dividendo. En los libros, eso suele convertirse en un préstamo al accionista, y la Income Tax Act tiene una regla específica para ello. Según la subsección 15(2), un préstamo de una sociedad a un accionista, o a una persona vinculada con un accionista, generalmente se incluye en el ingreso del accionista. La subsección 15(2.6) prevé una excepción cuando el préstamo se reembolsa dentro del año siguiente al cierre del año fiscal de la sociedad en que se otorgó, y el reembolso no forma parte de una serie de préstamos y reembolsos.",
      },
      {
        type: "paragraph",
        text: "También pueden aplicarse otras excepciones y reglas relacionadas, incluidas las reglas sobre beneficios por intereses. Un préstamo al accionista, por lo tanto, no sustituye al salario ni a los dividendos, y cualquier saldo adeudado a la sociedad al cierre del año es algo que conviene revisar con su contador antes de que venza el plazo.",
      },
      {
        type: "heading",
        id: "libro-de-actas",
        text: "Registrar el salario y los dividendos en el libro de actas",
      },
      p(
        "Los dividendos los declaran los directores, y esa decisión corresponde al ",
        { text: "libro de actas", href: "/guides/que-es-un-libro-de-actas" },
        " de la sociedad. Una resolución de dividendos suele indicar la clase de acciones, el monto por acción o el monto total, la fecha de registro y la fecha de pago. Cuando la CRA revisa una sociedad dirigida por su propietario, el libro de actas es uno de los lugares donde puede confirmar que los dividendos se autorizaron debidamente.",
      ),
      p(
        "Los salarios y bonos de los propietarios también suelen aprobarse por resolución de los directores, sobre todo cuando el propietario también es director. Muchas sociedades tramitan estas aprobaciones junto con sus resoluciones anuales, que aprueban los estados financieros y confirman a los directores y funcionarios. Korporex prepara las ",
        { text: "resoluciones anuales de Ontario", href: "/services/annual-resolution-on" },
        " y las ",
        { text: "resoluciones anuales federales", href: "/services/annual-resolution-federal" },
        ", y puede preparar un ",
        { text: "libro de actas inicial", href: "/services/initial-minute-book" },
        " para una sociedad que aún no lo tiene.",
      ),
      {
        type: "heading",
        id: "donde-korporex",
        text: "Dónde encaja Korporex",
      },
      p(
        "Pagarse dividendos solo es posible porque su sociedad tiene una estructura de acciones que lo permite. Korporex monta esa estructura de acciones cuando ",
        { text: "presenta su constitución", href: "/incorporate" },
        ", así que la opción está desde el primer día.",
      ),
      p(
        "Korporex no es una firma contable y no da asesoría fiscal. La elección entre salario, dividendos o una mezcla se hace con un contador calificado. Para estructuras relacionadas, consulte ",
        { text: "las sociedades de cartera en Canadá", href: "/guides/sociedad-de-cartera-canada" },
        " y ",
        { text: "empresa unipersonal o sociedad", href: "/guides/empresa-unipersonal-o-sociedad" },
        ".",
      ),
    ],
    faq: [
      {
        q: "¿Es mejor tomar salario o dividendos de mi sociedad en Canadá?",
        a: "No hay una sola respuesta. El salario es deducible para la sociedad y genera espacio de RRSP y créditos del CPP, pero exige nómina y aportes al CPP de ambos lados. Los dividendos son más simples de administrar y se gravan mediante el aumento y el crédito fiscal por dividendos, pero no generan espacio de RRSP ni créditos del CPP. La mezcla correcta depende de su ingreso, provincia y objetivos; es una pregunta para su contador.",
      },
      {
        q: "¿Los dividendos generan espacio de contribución al RRSP?",
        a: "No. El espacio de contribución al RRSP se basa en el 18% de su ingreso ganado del año anterior, hasta un límite anual en dólares ($33,810 para 2026). El ingreso ganado incluye el ingreso de empleo, como el salario, pero no los dividendos. Un propietario que se paga solo con dividendos no genera nuevo espacio de RRSP con ese ingreso.",
      },
      {
        q: "¿Pago CPP sobre los dividendos de mi sociedad?",
        a: "No. Los aportes al CPP se aplican al ingreso pensionable, como el salario, no a los dividendos. Para 2026, el salario genera aportes al CPP del 5.95% por parte del empleado y del empleador sobre ingresos de hasta $74,600, después de una exención básica de $3,500, más el CPP2 del 4% cada uno sobre ingresos entre $74,600 y $85,000. Los dividendos no suman nada a su registro del CPP.",
      },
      {
        q: "¿Cuál es la diferencia entre dividendos elegibles y no elegibles?",
        a: "Los dividendos elegibles generalmente se pagan con ingresos gravados a la tasa general de sociedades y se aumentan un 38% en la declaración personal. Los dividendos no elegibles, que normalmente paga una sociedad privada bajo control canadiense con ingresos gravados a la tasa de pequeñas empresas, se aumentan un 15%. Cada tipo tiene su propio crédito fiscal federal y provincial por dividendos.",
      },
      {
        q: "¿Puedo simplemente pedirle dinero prestado a mi sociedad?",
        a: "Un préstamo al accionista generalmente se incluye en el ingreso del accionista según la subsección 15(2) de la Income Tax Act. Se aplica una excepción si el préstamo se reembolsa dentro del año siguiente al cierre del año fiscal de la sociedad en que se otorgó y el reembolso no forma parte de una serie de préstamos y reembolsos. También pueden aplicarse otras reglas; revise cualquier saldo con su contador.",
      },
      {
        q: "¿Los dividendos deben registrarse en el libro de actas?",
        a: "Los dividendos los declaran los directores, y esa declaración se registra en una resolución que se guarda en el libro de actas de la sociedad. La resolución suele indicar la clase de acciones, el monto, la fecha de registro y la fecha de pago. El derecho de sociedades también prohíbe pagar un dividendo si la sociedad no supera la prueba de solvencia, así que los directores la consideran al declararlo.",
      },
    ],
  },
};
