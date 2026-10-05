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
    readTime: "9 min read",
    content: [
      p("To incorporate yourself in Canada, a freelancer, consultant or contractor forms a corporation, becomes its shareholder and director, and then has the corporation, rather than the individual, contract with clients and receive payment. The corporation is a separate legal entity and a separate taxpayer. Its active business income can qualify for the small business deduction, which brings the federal rate down to 9 percent on the first $500,000. One rule in the Income Tax Act decides whether that rate is available at all: the personal services business rule."),
      p("This guide explains what incorporating yourself means, how the personal services business rule works and what it costs when it applies, how the CRA looks at employee versus self-employed status, how owners are paid at a high level, and the steps to incorporate."),
      { type: "heading", id: "what-it-means", text: "What it means to incorporate yourself in Canada" },
      p("A sole proprietor and the business are the same person in law. The owner reports net business income on a personal T1 return and is personally responsible for the debts of the business. When a freelancer incorporates, a new legal person appears: the corporation. It signs the client contracts, issues the invoices, collects the fees and files its own T2 corporation income tax return. The individual is then paid by the corporation, as an employee through salary, as a shareholder through dividends, or both."),
      p("The legal and practical change is real. Contracts, the bank account and, where required, GST/HST registration belong to the corporation. The corporation also has its own record-keeping and filing obligations, including an annual return and a minute book. The ", L("sole proprietorship vs corporation guide", "/guides/sole-proprietorship-vs-corporation"), " covers the broader trade-offs between the two structures."),
      {
        type: "table",
        head: ["Feature", "Sole proprietor", "Own corporation"],
        rows: [
          ["Legal status", "Not separate from the owner", "Separate legal entity"],
          ["Who contracts with clients", "The individual", "The corporation"],
          ["Tax return for business income", "Personal T1 return", "Corporate T2 return"],
          ["Federal rate on active business income", "Owner's personal marginal rates", "9% on the first $500,000 for a CCPC claiming the small business deduction; 15% above"],
          ["Federal rate if the business is a personal services business", "Not applicable", "33% (no small business deduction, no general rate reduction, plus 5% additional tax)"],
          ["How the owner is paid", "Takes the profit directly", "Salary, dividends or both"],
          ["Ongoing obligations", "Personal return; business name registration if not using own name", "T2 return, annual return, minute book"],
        ],
      },
      { type: "heading", id: "small-business-deduction", text: "The small business deduction" },
      p("A Canadian-controlled private corporation (CCPC) earning active business income can claim the small business deduction. The federal basic rate of 38 percent falls to 28 percent after the federal tax abatement, to 15 percent after the general rate reduction, and to 9 percent on income eligible for the small business deduction. The deduction applies to the first $500,000 of active business income, a figure called the business limit, which associated corporations share. Each province and territory adds its own lower and higher rates. The ", L("corporate tax rate guide", "/guides/corporate-tax-rate-canada"), " sets out the current provincial rates and the rules that reduce the business limit."),
      p("When the corporation earns more than the owner needs to live on, the profit left in the corporation is taxed at the corporate rate, and personal tax applies only when the money is later paid out. That timing difference, often called tax deferral, is one of the main reasons consultants consider incorporating. It depends entirely on the income being active business income that qualifies for the small business deduction."),
      { type: "heading", id: "personal-services-business", text: "The personal services business rule for incorporated contractors" },
      p("Subsection 125(7) of the Income Tax Act defines a personal services business as a business of providing services where the individual who performs the services on behalf of the corporation, called the incorporated employee, or a person related to that individual, is a specified shareholder of the corporation, and the incorporated employee would reasonably be regarded as an officer or employee of the client but for the existence of the corporation."),
      p("In plain terms, the question is whether the relationship with the client would be employment if the corporation were removed from the picture. If it would, the corporation's income from that work is personal services business income, no matter how the contract is worded."),
      p("The definition has two exceptions. A business is not a personal services business if:"),
      {
        type: "list",
        items: [
          "the corporation employs in the business throughout the year more than five full-time employees, or",
          "the amount paid or payable to the corporation for the services is received or receivable from a corporation with which it was associated in the year.",
        ],
      },
      { type: "heading", id: "psb-consequences", text: "What happens when the rule applies" },
      p("Three provisions combine to remove most of the tax advantage of incorporating:"),
      {
        type: "list",
        items: [
          "No small business deduction. Income from a personal services business is excluded from the active business income eligible for the 9 percent federal rate.",
          "No general rate reduction. Section 123.4 excludes personal services business income from full rate taxable income, so the 13 percent general rate reduction does not apply either.",
          "An additional 5 percent tax. Section 123.5 adds a tax equal to 5 percent of the corporation's taxable income from a personal services business.",
        ],
      },
      p("Together, those rules bring the federal rate on personal services business income to 33 percent: the 38 percent basic rate, less the 10 percent federal abatement, plus the 5 percent additional tax. The provincial or territorial rate is added on top."),
      p("Deductions are also restricted. Under paragraph 18(1)(p), a corporation earning personal services business income can generally deduct only salary, wages or other remuneration paid to the incorporated employee, the cost of benefits or allowances provided to that individual, certain expenses for selling property or negotiating contracts that an employee could have deducted, and legal expenses incurred to collect amounts owed to the corporation. Ordinary business expenses that a sole proprietor or an active business corporation would deduct are largely unavailable."),
      { type: "callout", text: "Whether the personal services business rule applies depends on the facts of each working relationship, not on the wording of the contract. That assessment is a question for a qualified accountant or lawyer." },
      { type: "heading", id: "employee-or-self-employed", text: "How the CRA looks at employee or self-employed status" },
      p("Because the rule turns on whether the individual would be an employee of the client, the factors the CRA uses to decide employment status are the relevant ones. CRA guide RC4110, Employee or Self-employed?, describes a two-step approach for provinces and territories other than Quebec. The first step looks at what the parties intended: a contract of service, which is employment, or a contract for services, which is a business relationship. The second step tests that intent against the facts."),
      p("The factors the CRA examines include:"),
      {
        type: "list",
        items: [
          "Control: the right of the payer to control the work, whether or not the payer actually exercises it.",
          "Tools and equipment: self-employed individuals often supply their own; employees usually receive them from the employer.",
          "Subcontracting and hiring helpers: a self-employed individual does not have to perform the services personally and can hire someone to do or help with the work.",
          "Financial risk: employees generally have their expenses reimbursed, while self-employed individuals usually carry unreimbursed costs.",
          "Investment and management: a significant investment is evidence that a business relationship may exist.",
          "Opportunity for profit: employees normally have no chance of profit and no risk of loss.",
        ],
      },
      p("The CRA states that the facts of the working relationship as a whole decide the status, not the label the parties choose. A contractor with a single long-term client, fixed hours, the client's equipment and day-to-day supervision presents a very different set of facts from a consultant with several clients, their own tools and the freedom to subcontract."),
      { type: "heading", id: "paying-yourself", text: "Salary vs dividends at a high level" },
      p("Once incorporated, the owner is paid by the corporation in one of two main ways, or a mix of both:"),
      {
        type: "table",
        head: ["", "Salary", "Dividends"],
        rows: [
          ["Deductible to the corporation", "Yes", "No; paid from after-tax profit"],
          ["Payroll account and source deductions", "Required", "Not required"],
          ["CPP contributions", "Yes", "No"],
          ["Creates RRSP contribution room", "Yes, as earned income", "No"],
          ["Slip issued to the owner", "T4", "T5"],
        ],
      },
      p("The right mix depends on income, personal needs and the province, and it is usually settled with an accountant. The ", L("salary vs dividends guide", "/guides/salary-vs-dividends-canada"), " explains how each option is taxed. Paying dividends also requires a share structure that allows them, which is set at incorporation."),
      { type: "heading", id: "steps", text: "How to incorporate yourself in Canada: the steps" },
      {
        type: "list",
        items: [
          "Step 1. Choose the jurisdiction: a federal corporation under the Canada Business Corporations Act, or a provincial one, such as an Ontario corporation under the Business Corporations Act.",
          "Step 2. Choose a named or a numbered corporation. A named Ontario corporation needs a NUANS name search report before filing. For a named federal corporation, the name search is built into the Corporations Canada online application, so no separate report is required. A numbered corporation needs neither.",
          "Step 3. Decide the share structure, the first director (usually you) and the registered office address.",
          "Step 4. File the articles of incorporation with Corporations Canada or the provincial registry and pay the government fee.",
          "Step 5. Organize the corporation: adopt by-laws, pass organizational resolutions, issue shares to yourself, and set up the minute book and registers.",
          "Step 6. Receive the CRA business number, which is issued after incorporation, and register any program accounts the corporation needs, such as GST/HST or payroll.",
          "Step 7. Open a business bank account in the corporation's name and move client contracts and invoicing to the corporation.",
        ],
      },
      p("The ", L("named vs numbered corporation guide", "/guides/named-vs-numbered-corporation"), " covers step 2 in detail, and the ", L("corporate minute book guide", "/guides/corporate-minute-book"), " explains what the minute book must contain under federal and Ontario law. Some owners later add a second corporation to hold surplus funds; the ", L("holding company guide", "/guides/holding-company-canada"), " explains how that structure works and how associated corporations share the business limit."),
      { type: "heading", id: "professionals", text: "Regulated professionals" },
      p("Physicians, dentists, lawyers, accountants and other regulated professionals can incorporate only where their governing body allows it, and usually as a professional corporation with additional conditions on ownership and name. A professional corporation is still a corporation, and the same tax rules, including the personal services business rule, apply to it. The ", L("professional corporations guide", "/guides/professional-corporations-canada"), " sets out the requirements."),
      { type: "heading", id: "korporex", text: "Incorporating with Korporex" },
      p("You can ", L("incorporate with Korporex", "/incorporate"), " federally or in Ontario online. Every package includes a minute book, and the CRA business number is issued after the incorporation is complete. Korporex is a document-preparation service, not a law firm or an accounting firm."),
    ],
    faq: [
      {
        q: "Can I incorporate myself as a freelancer in Canada?",
        a: "Yes. A freelancer, consultant or contractor can form a corporation, federally or provincially, and be its sole shareholder and director. The corporation then contracts with clients and is taxed as its own taxpayer.",
      },
      {
        q: "What is a personal services business?",
        a: "Under subsection 125(7) of the Income Tax Act, it is a business of providing services where the individual performing them, or a related person, is a specified shareholder of the corporation and that individual would reasonably be regarded as an officer or employee of the client if the corporation did not exist. It excludes corporations with more than five full-time employees throughout the year and services provided to an associated corporation.",
      },
      {
        q: "How is personal services business income taxed?",
        a: "It does not qualify for the small business deduction or the general rate reduction, and section 123.5 adds a 5 percent tax. The federal rate is 33 percent, before the provincial or territorial rate. Deductions are limited by paragraph 18(1)(p) to items such as the incorporated employee's salary and benefits.",
      },
      {
        q: "How does the CRA decide whether I would be an employee?",
        a: "CRA guide RC4110 describes a two-step approach outside Quebec: the intent of the parties, then factors such as control, tools and equipment, subcontracting, financial risk, investment and management, and opportunity for profit. The facts of the relationship as a whole decide the status. Whether the rule applies in a given case is a question for a qualified accountant or lawyer.",
      },
      {
        q: "When do I get a business number after incorporating?",
        a: "For federal and Ontario corporations, the CRA business number is issued as part of the incorporation, after the articles are filed. Program accounts such as GST/HST and payroll are registered separately as needed.",
      },
    ],
  },

  // ── Français ──
  fr: {
    readTime: "10 min de lecture",
    content: [
      p("Pour vous constituer en société au Canada, en tant que travailleur autonome, consultant ou entrepreneur, vous formez une société par actions, vous en devenez l'actionnaire et l'administrateur, puis c'est la société, et non vous personnellement, qui conclut les contrats avec les clients et reçoit les paiements. La société est une entité juridique distincte et un contribuable distinct. Son revenu tiré d'une entreprise exploitée activement peut donner droit à la déduction accordée aux petites entreprises (DPE), qui ramène le taux fédéral à 9 pour cent sur les premiers 500 000 $. Une règle de la Loi de l'impôt sur le revenu décide si ce taux est accessible : celle de l'entreprise de prestation de services personnels."),
      p("Ce guide explique ce que signifie se constituer en société, comment fonctionne la règle de l'entreprise de prestation de services personnels et ce qu'elle coûte lorsqu'elle s'applique, comment l'Agence du revenu du Canada (ARC) distingue l'employé du travailleur autonome, comment le propriétaire est rémunéré dans les grandes lignes, et les étapes de la constitution."),
      { type: "heading", id: "what-it-means", text: "Ce que signifie vous constituer en société au Canada" },
      p("En droit, le propriétaire d'une entreprise individuelle et l'entreprise sont une seule et même personne. Le propriétaire déclare le revenu net d'entreprise dans sa déclaration T1 et répond personnellement des dettes de l'entreprise. Lorsqu'un travailleur autonome se constitue en société, une nouvelle personne morale apparaît : la société. Elle signe les contrats, émet les factures, encaisse les honoraires et produit sa propre déclaration de revenus des sociétés T2. Le particulier est ensuite rémunéré par la société, à titre d'employé par un salaire, à titre d'actionnaire par des dividendes, ou les deux."),
      p("Le changement juridique et pratique est réel. Les contrats, le compte bancaire et, s'il y a lieu, l'inscription aux fins de la TPS/TVH appartiennent à la société. Celle-ci a aussi ses propres obligations de tenue de registres et de dépôt, dont la déclaration annuelle et le livre des procès-verbaux. Le guide ", L("entreprise individuelle ou société", "/guides/entreprise-individuelle-ou-societe"), " présente les compromis plus généraux entre les deux structures."),
      {
        type: "table",
        head: ["Caractéristique", "Entreprise individuelle", "Votre propre société"],
        rows: [
          ["Statut juridique", "Non distincte du propriétaire", "Entité juridique distincte"],
          ["Qui contracte avec les clients", "Le particulier", "La société"],
          ["Déclaration du revenu d'entreprise", "Déclaration personnelle T1", "Déclaration des sociétés T2"],
          ["Taux fédéral sur le revenu d'entreprise exploitée activement", "Taux marginaux personnels du propriétaire", "9 % sur les premiers 500 000 $ pour une SPCC qui demande la DPE; 15 % au-delà"],
          ["Taux fédéral s'il s'agit d'une entreprise de prestation de services personnels", "Sans objet", "33 % (aucune DPE, aucune réduction du taux général, plus un impôt supplémentaire de 5 %)"],
          ["Rémunération du propriétaire", "Il prend directement le bénéfice", "Salaire, dividendes ou les deux"],
          ["Obligations continues", "Déclaration personnelle; enregistrement du nom commercial si le nom du propriétaire n'est pas utilisé", "Déclaration T2, déclaration annuelle, livre des procès-verbaux"],
        ],
      },
      { type: "heading", id: "small-business-deduction", text: "La déduction accordée aux petites entreprises" },
      p("Une société privée sous contrôle canadien (SPCC) qui gagne un revenu tiré d'une entreprise exploitée activement peut demander la DPE. Le taux de base fédéral de 38 pour cent passe à 28 pour cent après l'abattement fédéral, à 15 pour cent après la réduction du taux général, et à 9 pour cent sur le revenu admissible à la DPE. La déduction s'applique aux premiers 500 000 $ de revenu d'entreprise exploitée activement, montant appelé plafond des affaires, que les sociétés associées se partagent. Chaque province et territoire ajoute ses propres taux inférieur et supérieur. Le guide sur le ", L("taux d'imposition des sociétés au Canada", "/guides/taux-imposition-societes-canada"), " présente les taux provinciaux actuels et les règles qui réduisent le plafond des affaires."),
      p("Lorsque la société gagne plus que ce dont le propriétaire a besoin pour vivre, le bénéfice laissé dans la société est imposé au taux des sociétés, et l'impôt personnel ne s'applique qu'au moment où l'argent est versé. Cet écart dans le temps, souvent appelé report d'impôt, est l'une des principales raisons pour lesquelles les consultants envisagent de se constituer en société. Il dépend entièrement du fait que le revenu soit un revenu d'entreprise exploitée activement admissible à la DPE."),
      { type: "heading", id: "personal-services-business", text: "La règle de l'entreprise de prestation de services personnels pour l'entrepreneur constitué en société" },
      p("Le paragraphe 125(7) de la Loi de l'impôt sur le revenu définit l'entreprise de prestation de services personnels comme une entreprise de prestation de services dans le cadre de laquelle le particulier qui fournit les services pour le compte de la société, appelé employé constitué en société, ou une personne liée à ce particulier, est un actionnaire déterminé de la société, et où l'employé constitué en société serait raisonnablement considéré comme un cadre ou un employé du client, n'eût été l'existence de la société."),
      p("Concrètement, la question est de savoir si la relation avec le client serait un emploi si la société était retirée du portrait. Si c'est le cas, le revenu que la société tire de ce travail est un revenu d'entreprise de prestation de services personnels, quelle que soit la formulation du contrat."),
      p("La définition comporte deux exceptions. Il ne s'agit pas d'une entreprise de prestation de services personnels si :"),
      {
        type: "list",
        items: [
          "la société emploie dans l'entreprise, tout au long de l'année, plus de cinq employés à temps plein, ou",
          "la somme payée ou payable à la société pour les services est reçue ou à recevoir d'une société à laquelle elle était associée au cours de l'année.",
        ],
      },
      { type: "heading", id: "psb-consequences", text: "Ce qui se passe lorsque la règle s'applique" },
      p("Trois dispositions se combinent pour retirer l'essentiel de l'avantage fiscal de la constitution en société :"),
      {
        type: "list",
        items: [
          "Aucune DPE. Le revenu tiré d'une entreprise de prestation de services personnels est exclu du revenu d'entreprise exploitée activement admissible au taux fédéral de 9 pour cent.",
          "Aucune réduction du taux général. L'article 123.4 exclut ce revenu du revenu imposable au taux complet, de sorte que la réduction du taux général de 13 pour cent ne s'applique pas non plus.",
          "Un impôt supplémentaire de 5 pour cent. L'article 123.5 ajoute un impôt égal à 5 pour cent du revenu imposable de la société tiré d'une entreprise de prestation de services personnels.",
        ],
      },
      p("Ensemble, ces règles portent le taux fédéral sur ce revenu à 33 pour cent : le taux de base de 38 pour cent, moins l'abattement fédéral de 10 pour cent, plus l'impôt supplémentaire de 5 pour cent. Le taux provincial ou territorial s'ajoute."),
      p("Les déductions sont aussi restreintes. Selon l'alinéa 18(1)p), une société qui tire un revenu d'une entreprise de prestation de services personnels peut généralement déduire seulement le salaire, le traitement ou toute autre rémunération versé à l'employé constitué en société, le coût des avantages ou allocations qui lui sont accordés, certaines dépenses liées à la vente de biens ou à la négociation de contrats qu'un employé aurait pu déduire, et les frais juridiques engagés pour recouvrer des sommes dues à la société. Les dépenses d'entreprise ordinaires qu'un propriétaire unique ou une société exploitant activement une entreprise déduirait sont en grande partie exclues."),
      { type: "callout", text: "L'application de la règle de l'entreprise de prestation de services personnels dépend des faits propres à chaque relation de travail, et non de la formulation du contrat. Cette évaluation relève d'un comptable ou d'un avocat qualifié." },
      { type: "heading", id: "employee-or-self-employed", text: "Comment l'ARC distingue l'employé du travailleur autonome" },
      p("Comme la règle dépend de la question de savoir si le particulier serait un employé du client, les facteurs que l'ARC utilise pour établir le statut d'emploi sont ceux qui comptent. Le guide RC4110 de l'ARC, Employé ou travailleur autonome?, décrit une approche en deux étapes pour les provinces et territoires autres que le Québec. La première étape porte sur l'intention des parties : un contrat de louage de services, c'est-à-dire un emploi, ou un contrat d'entreprise, c'est-à-dire une relation d'affaires. La deuxième étape vérifie cette intention au regard des faits."),
      p("Les facteurs examinés par l'ARC comprennent :"),
      {
        type: "list",
        items: [
          "Le contrôle : le droit du payeur de contrôler le travail, qu'il l'exerce ou non.",
          "Les outils et l'équipement : le travailleur autonome fournit souvent les siens; l'employé les reçoit habituellement de l'employeur.",
          "La sous-traitance et l'embauche d'aides : le travailleur autonome n'a pas à fournir les services personnellement et peut engager quelqu'un pour faire le travail ou l'aider.",
          "Le risque financier : l'employé se fait généralement rembourser ses dépenses, alors que le travailleur autonome assume habituellement des frais non remboursés.",
          "L'investissement et la gestion : un investissement important indique qu'une relation d'affaires peut exister.",
          "La possibilité de profit : l'employé n'a normalement ni possibilité de profit ni risque de perte.",
        ],
      },
      p("L'ARC précise que ce sont les faits de la relation de travail dans son ensemble qui déterminent le statut, et non l'étiquette choisie par les parties. Un entrepreneur qui a un seul client à long terme, des heures fixes, l'équipement du client et une supervision quotidienne présente des faits très différents de ceux d'un consultant qui a plusieurs clients, ses propres outils et la liberté de sous-traiter."),
      { type: "heading", id: "paying-yourself", text: "Salaire ou dividendes : vue d'ensemble" },
      p("Une fois la société constituée, le propriétaire est rémunéré par la société de deux façons principales, ou d'une combinaison des deux :"),
      {
        type: "table",
        head: ["", "Salaire", "Dividendes"],
        rows: [
          ["Déductible pour la société", "Oui", "Non; versés à partir du bénéfice après impôt"],
          ["Compte de paie et retenues à la source", "Requis", "Non requis"],
          ["Cotisations au RPC", "Oui", "Non"],
          ["Crée des droits de cotisation à un REER", "Oui, à titre de revenu gagné", "Non"],
          ["Feuillet remis au propriétaire", "T4", "T5"],
        ],
      },
      p("La bonne combinaison dépend du revenu, des besoins personnels et de la province, et elle est habituellement établie avec un comptable. Le guide ", L("salaire ou dividendes", "/guides/salaire-ou-dividendes"), " explique l'imposition de chaque option. Le versement de dividendes exige aussi une structure du capital-actions qui le permet, établie à la constitution."),
      { type: "heading", id: "steps", text: "Comment vous constituer en société au Canada : les étapes" },
      {
        type: "list",
        items: [
          "Étape 1. Choisir le régime : une société fédérale sous le régime de la Loi canadienne sur les sociétés par actions, ou une société provinciale, comme une société ontarienne sous le régime de la Loi sur les sociétés par actions.",
          "Étape 2. Choisir une société à dénomination ou à matricule. Une société ontarienne à dénomination exige un rapport de recherche NUANS avant le dépôt. Pour une société fédérale à dénomination, la recherche de nom est intégrée à la demande en ligne de Corporations Canada, de sorte qu'aucun rapport distinct n'est exigé. Une société à matricule n'a besoin ni de l'un ni de l'autre.",
          "Étape 3. Établir la structure du capital-actions, le premier administrateur (habituellement vous) et l'adresse du siège social.",
          "Étape 4. Déposer les statuts constitutifs auprès de Corporations Canada ou du registre provincial et payer les droits gouvernementaux.",
          "Étape 5. Organiser la société : adopter les règlements administratifs, adopter les résolutions d'organisation, vous émettre des actions, et mettre en place le livre des procès-verbaux et les registres.",
          "Étape 6. Recevoir le numéro d'entreprise de l'ARC, qui est attribué après la constitution, et inscrire la société aux comptes de programme nécessaires, comme la TPS/TVH ou la paie.",
          "Étape 7. Ouvrir un compte bancaire d'entreprise au nom de la société et transférer à la société les contrats avec les clients et la facturation.",
        ],
      },
      p("Le guide ", L("société nominative ou à matricule", "/guides/societe-nominative-ou-a-matricule"), " traite de l'étape 2 en détail, et le guide ", L("qu'est-ce qu'un livre des procès-verbaux", "/guides/quest-ce-quun-livre-des-proces-verbaux"), " explique ce que le livre doit contenir selon les lois fédérale et ontarienne. Certains propriétaires ajoutent plus tard une deuxième société pour détenir les fonds excédentaires; le guide sur la ", L("société de portefeuille", "/guides/societe-de-portefeuille-canada"), " explique cette structure et le partage du plafond des affaires entre sociétés associées."),
      { type: "heading", id: "professionals", text: "Les professionnels réglementés" },
      p("Les médecins, dentistes, avocats, comptables et autres professionnels réglementés ne peuvent se constituer en société que si leur ordre professionnel le permet, habituellement sous forme de société professionnelle assortie de conditions additionnelles sur l'actionnariat et la dénomination. Une société professionnelle demeure une société par actions, et les mêmes règles fiscales, y compris celle de l'entreprise de prestation de services personnels, s'y appliquent. Le guide sur la ", L("société professionnelle", "/guides/societe-professionnelle-canada"), " présente les exigences."),
      { type: "heading", id: "korporex", text: "Se constituer en société avec Korporex" },
      p("Vous pouvez ", L("vous constituer en société avec Korporex", "/incorporate"), " au fédéral ou en Ontario, en ligne. Chaque forfait comprend un livre des procès-verbaux, et le numéro d'entreprise de l'ARC est attribué une fois la constitution terminée. Korporex est un service de préparation de documents, et non un cabinet d'avocats ou de comptables."),
    ],
    faq: [
      {
        q: "Un travailleur autonome peut-il se constituer en société au Canada?",
        a: "Oui. Un travailleur autonome, un consultant ou un entrepreneur peut former une société par actions, au fédéral ou au provincial, et en être l'unique actionnaire et administrateur. La société conclut alors les contrats avec les clients et est imposée comme un contribuable distinct.",
      },
      {
        q: "Qu'est-ce qu'une entreprise de prestation de services personnels?",
        a: "Selon le paragraphe 125(7) de la Loi de l'impôt sur le revenu, c'est une entreprise de prestation de services dans le cadre de laquelle le particulier qui fournit les services, ou une personne liée, est un actionnaire déterminé de la société, et où ce particulier serait raisonnablement considéré comme un cadre ou un employé du client si la société n'existait pas. Sont exclues les sociétés qui emploient plus de cinq employés à temps plein tout au long de l'année et les services fournis à une société associée.",
      },
      {
        q: "Comment le revenu d'une entreprise de prestation de services personnels est-il imposé?",
        a: "Il n'est admissible ni à la DPE ni à la réduction du taux général, et l'article 123.5 ajoute un impôt de 5 pour cent. Le taux fédéral est de 33 pour cent, avant le taux provincial ou territorial. L'alinéa 18(1)p) limite les déductions à des éléments comme le salaire et les avantages de l'employé constitué en société.",
      },
      {
        q: "Comment l'ARC décide-t-elle si je serais un employé?",
        a: "Le guide RC4110 de l'ARC décrit une approche en deux étapes hors Québec : l'intention des parties, puis des facteurs comme le contrôle, les outils et l'équipement, la sous-traitance, le risque financier, l'investissement et la gestion, et la possibilité de profit. Les faits de la relation dans son ensemble déterminent le statut. L'application de la règle dans un cas donné relève d'un comptable ou d'un avocat qualifié.",
      },
      {
        q: "Quand reçoit-on le numéro d'entreprise après la constitution?",
        a: "Pour les sociétés fédérales et ontariennes, le numéro d'entreprise de l'ARC est attribué dans le cadre de la constitution, après le dépôt des statuts. Les comptes de programme comme la TPS/TVH et la paie sont ouverts séparément au besoin.",
      },
    ],
  },

  // ── Español ──
  es: {
    readTime: "10 min de lectura",
    content: [
      p("Para constituirse en sociedad como autónomo en Canadá, un trabajador independiente, consultor o contratista forma una sociedad, pasa a ser su accionista y director, y a partir de entonces es la sociedad, y no la persona, la que firma los contratos con los clientes y recibe los pagos. La sociedad es una entidad jurídica separada y un contribuyente separado. Sus ingresos de un negocio activo pueden acogerse a la deducción para pequeñas empresas (small business deduction), que reduce la tasa federal al 9 por ciento sobre los primeros $500,000. Una regla de la Income Tax Act decide si esa tasa está disponible: la regla del negocio de servicios personales (personal services business)."),
      p("Esta guía explica qué significa constituirse en sociedad, cómo funciona la regla del negocio de servicios personales y lo que cuesta cuando se aplica, cómo distingue la Agencia de Ingresos de Canadá (CRA) entre empleado y trabajador independiente, cómo se paga el propietario a grandes rasgos y cuáles son los pasos para constituirse."),
      { type: "heading", id: "what-it-means", text: "Qué significa constituirse en sociedad como autónomo en Canadá" },
      p("En derecho, el propietario de una empresa unipersonal y el negocio son la misma persona. El propietario declara el ingreso neto del negocio en su declaración personal T1 y responde personalmente de las deudas del negocio. Cuando un autónomo se constituye en sociedad, aparece una nueva persona jurídica: la sociedad. Esta firma los contratos, emite las facturas, cobra los honorarios y presenta su propia declaración de impuestos de sociedades T2. La persona recibe luego su pago de la sociedad, como empleado mediante un sueldo, como accionista mediante dividendos, o ambos."),
      p("El cambio jurídico y práctico es real. Los contratos, la cuenta bancaria y, cuando corresponde, el registro del GST/HST pertenecen a la sociedad. Esta también tiene sus propias obligaciones de registros y presentaciones, como la declaración anual y el libro de actas. La guía ", L("empresa unipersonal o sociedad", "/guides/empresa-unipersonal-o-sociedad"), " explica las diferencias generales entre ambas estructuras."),
      {
        type: "table",
        head: ["Característica", "Empresa unipersonal", "Su propia sociedad"],
        rows: [
          ["Situación jurídica", "No separada del propietario", "Entidad jurídica separada"],
          ["Quién contrata con los clientes", "La persona", "La sociedad"],
          ["Declaración del ingreso del negocio", "Declaración personal T1", "Declaración de sociedades T2"],
          ["Tasa federal sobre ingresos de un negocio activo", "Tasas marginales personales del propietario", "9% sobre los primeros $500,000 para una CCPC que solicita la deducción para pequeñas empresas; 15% por encima"],
          ["Tasa federal si es un negocio de servicios personales", "No aplica", "33% (sin deducción para pequeñas empresas, sin reducción de la tasa general, más un impuesto adicional del 5%)"],
          ["Cómo se paga el propietario", "Toma directamente la ganancia", "Sueldo, dividendos o ambos"],
          ["Obligaciones continuas", "Declaración personal; registro del nombre comercial si no usa su propio nombre", "Declaración T2, declaración anual, libro de actas"],
        ],
      },
      { type: "heading", id: "small-business-deduction", text: "La deducción para pequeñas empresas" },
      p("Una sociedad privada bajo control canadiense (CCPC) que obtiene ingresos de un negocio activo puede solicitar la deducción para pequeñas empresas. La tasa federal básica del 38 por ciento baja al 28 por ciento después del abatimiento federal, al 15 por ciento después de la reducción de la tasa general y al 9 por ciento sobre los ingresos que califican para la deducción. La deducción se aplica a los primeros $500,000 de ingresos de un negocio activo, cifra llamada límite comercial (business limit), que las sociedades asociadas comparten. Cada provincia y territorio añade sus propias tasas reducida y general. La guía sobre la ", L("tasa del impuesto de sociedades en Canadá", "/guides/tasa-impuesto-sociedades-canada"), " presenta las tasas provinciales vigentes y las reglas que reducen el límite comercial."),
      p("Cuando la sociedad gana más de lo que el propietario necesita para vivir, la ganancia que queda en la sociedad tributa a la tasa de sociedades, y el impuesto personal solo se aplica cuando el dinero se retira más adelante. Esa diferencia en el tiempo, que suele llamarse diferimiento de impuestos, es una de las principales razones por las que los consultores consideran constituirse en sociedad. Depende por completo de que el ingreso sea de un negocio activo que califique para la deducción."),
      { type: "heading", id: "personal-services-business", text: "La regla del negocio de servicios personales para contratistas constituidos en sociedad" },
      p("El inciso 125(7) de la Income Tax Act define el negocio de servicios personales como un negocio de prestación de servicios en el que la persona que presta los servicios en nombre de la sociedad, llamada empleado constituido en sociedad (incorporated employee), o una persona vinculada a ella, es un accionista determinado (specified shareholder) de la sociedad, y en el que el empleado constituido en sociedad sería considerado razonablemente un directivo o empleado del cliente de no existir la sociedad."),
      p("En términos sencillos, la pregunta es si la relación con el cliente sería un empleo si se quitara la sociedad de la ecuación. Si lo sería, el ingreso que la sociedad obtiene de ese trabajo es ingreso de un negocio de servicios personales, sin importar cómo esté redactado el contrato."),
      p("La definición tiene dos excepciones. No se trata de un negocio de servicios personales si:"),
      {
        type: "list",
        items: [
          "la sociedad emplea en el negocio, durante todo el año, a más de cinco empleados a tiempo completo, o",
          "el monto pagado o pagadero a la sociedad por los servicios se recibe o es por recibir de una sociedad con la que estuvo asociada en el año.",
        ],
      },
      { type: "heading", id: "psb-consequences", text: "Qué ocurre cuando se aplica la regla" },
      p("Tres disposiciones se combinan para eliminar la mayor parte de la ventaja fiscal de constituirse en sociedad:"),
      {
        type: "list",
        items: [
          "Sin deducción para pequeñas empresas. El ingreso de un negocio de servicios personales queda excluido de los ingresos de negocio activo que califican para la tasa federal del 9 por ciento.",
          "Sin reducción de la tasa general. El artículo 123.4 excluye ese ingreso del ingreso gravable a tasa completa, por lo que tampoco se aplica la reducción de la tasa general del 13 por ciento.",
          "Un impuesto adicional del 5 por ciento. El artículo 123.5 añade un impuesto igual al 5 por ciento del ingreso gravable de la sociedad proveniente de un negocio de servicios personales.",
        ],
      },
      p("En conjunto, esas reglas llevan la tasa federal sobre ese ingreso al 33 por ciento: la tasa básica del 38 por ciento, menos el abatimiento federal del 10 por ciento, más el impuesto adicional del 5 por ciento. La tasa provincial o territorial se suma a esa cifra."),
      p("Las deducciones también se restringen. Según el párrafo 18(1)(p), una sociedad con ingresos de un negocio de servicios personales generalmente solo puede deducir el sueldo, salario u otra remuneración pagada al empleado constituido en sociedad, el costo de los beneficios o asignaciones que se le otorgan, ciertos gastos de venta de bienes o negociación de contratos que un empleado habría podido deducir, y los gastos legales para cobrar montos adeudados a la sociedad. Los gastos ordinarios del negocio que deduciría un propietario único o una sociedad con un negocio activo quedan en gran parte excluidos."),
      { type: "callout", text: "Que se aplique o no la regla del negocio de servicios personales depende de los hechos de cada relación de trabajo, no de la redacción del contrato. Esa evaluación corresponde a un contador o abogado calificado." },
      { type: "heading", id: "employee-or-self-employed", text: "Cómo distingue la CRA entre empleado y trabajador independiente" },
      p("Como la regla depende de si la persona sería empleada del cliente, los factores que la CRA usa para determinar la situación laboral son los pertinentes. La guía RC4110 de la CRA, Employee or Self-employed?, describe un enfoque en dos pasos para las provincias y territorios distintos de Quebec. El primer paso examina la intención de las partes: un contrato de servicio (contract of service), es decir, un empleo, o un contrato por servicios (contract for services), es decir, una relación comercial. El segundo paso contrasta esa intención con los hechos."),
      p("Los factores que examina la CRA incluyen:"),
      {
        type: "list",
        items: [
          "Control: el derecho del pagador a controlar el trabajo, lo ejerza o no.",
          "Herramientas y equipo: el trabajador independiente suele aportar los suyos; el empleado normalmente los recibe del empleador.",
          "Subcontratación y contratación de ayudantes: el trabajador independiente no tiene que prestar los servicios personalmente y puede contratar a alguien para hacer el trabajo o ayudar.",
          "Riesgo financiero: al empleado generalmente se le reembolsan los gastos, mientras que el trabajador independiente suele asumir costos no reembolsados.",
          "Inversión y gestión: una inversión significativa indica que puede existir una relación comercial.",
          "Oportunidad de ganancia: el empleado normalmente no tiene posibilidad de ganancia ni riesgo de pérdida.",
        ],
      },
      p("La CRA indica que son los hechos de la relación de trabajo en su conjunto los que determinan la situación, no la etiqueta que eligen las partes. Un contratista con un solo cliente a largo plazo, horario fijo, el equipo del cliente y supervisión diaria presenta hechos muy distintos a los de un consultor con varios clientes, sus propias herramientas y libertad para subcontratar."),
      { type: "heading", id: "paying-yourself", text: "Sueldo o dividendos a grandes rasgos" },
      p("Una vez constituida la sociedad, el propietario recibe su pago de dos maneras principales, o de una combinación de ambas:"),
      {
        type: "table",
        head: ["", "Sueldo", "Dividendos"],
        rows: [
          ["Deducible para la sociedad", "Sí", "No; se pagan de la ganancia después de impuestos"],
          ["Cuenta de nómina y retenciones en la fuente", "Obligatorias", "No obligatorias"],
          ["Contribuciones al CPP", "Sí", "No"],
          ["Genera espacio de contribución RRSP", "Sí, como ingreso ganado", "No"],
          ["Comprobante que recibe el propietario", "T4", "T5"],
        ],
      },
      p("La combinación adecuada depende de los ingresos, las necesidades personales y la provincia, y suele definirse con un contador. La guía ", L("salario o dividendos", "/guides/salario-o-dividendos"), " explica cómo tributa cada opción. Pagar dividendos también requiere una estructura de acciones que lo permita, que se fija en la constitución."),
      { type: "heading", id: "steps", text: "Cómo constituirse en sociedad como autónomo en Canadá: los pasos" },
      {
        type: "list",
        items: [
          "Paso 1. Elegir la jurisdicción: una sociedad federal bajo la Canada Business Corporations Act o una provincial, como una sociedad de Ontario bajo la Business Corporations Act.",
          "Paso 2. Elegir una sociedad con nombre o numerada. Una sociedad con nombre en Ontario necesita un informe de búsqueda NUANS antes de presentar la solicitud. En una sociedad federal con nombre, la búsqueda de nombre está integrada en la solicitud en línea de Corporations Canada, por lo que no se exige un informe aparte. Una sociedad numerada no necesita ninguno de los dos.",
          "Paso 3. Definir la estructura de acciones, el primer director (normalmente usted) y la dirección del domicilio social.",
          "Paso 4. Presentar los estatutos de constitución ante Corporations Canada o el registro provincial y pagar la tarifa gubernamental.",
          "Paso 5. Organizar la sociedad: adoptar los reglamentos internos, aprobar las resoluciones de organización, emitirse acciones y preparar el libro de actas y los registros.",
          "Paso 6. Recibir el número de negocio de la CRA, que se asigna después de la constitución, y registrar las cuentas de programa que la sociedad necesite, como GST/HST o nómina.",
          "Paso 7. Abrir una cuenta bancaria empresarial a nombre de la sociedad y trasladar a la sociedad los contratos con clientes y la facturación.",
        ],
      },
      p("La guía ", L("sociedad con nombre o numerada", "/guides/sociedad-con-nombre-o-numerada"), " trata el paso 2 en detalle, y la guía ", L("qué es un libro de actas", "/guides/que-es-un-libro-de-actas"), " explica lo que debe contener según la ley federal y la de Ontario. Algunos propietarios añaden más adelante una segunda sociedad para mantener los fondos excedentes; la guía sobre la ", L("sociedad de cartera", "/guides/sociedad-de-cartera-canada"), " explica esa estructura y cómo las sociedades asociadas comparten el límite comercial."),
      { type: "heading", id: "professionals", text: "Profesionales regulados" },
      p("Los médicos, dentistas, abogados, contadores y otros profesionales regulados solo pueden constituirse en sociedad cuando su colegio profesional lo permite, normalmente como sociedad profesional con condiciones adicionales sobre la titularidad y el nombre. Una sociedad profesional sigue siendo una sociedad, y se le aplican las mismas reglas fiscales, incluida la del negocio de servicios personales. La guía sobre la ", L("sociedad profesional", "/guides/sociedad-profesional-canada"), " presenta los requisitos."),
      { type: "heading", id: "korporex", text: "Constituirse en sociedad con Korporex" },
      p("Usted puede ", L("constituir su sociedad con Korporex", "/incorporate"), " a nivel federal o en Ontario, en línea. Todos los paquetes incluyen un libro de actas, y el número de negocio de la CRA se asigna una vez completada la constitución. Korporex es un servicio de preparación de documentos, no un despacho de abogados ni de contadores."),
    ],
    faq: [
      {
        q: "¿Puede un autónomo constituirse en sociedad en Canadá?",
        a: "Sí. Un trabajador independiente, consultor o contratista puede formar una sociedad, a nivel federal o provincial, y ser su único accionista y director. La sociedad firma entonces los contratos con los clientes y tributa como contribuyente propio.",
      },
      {
        q: "¿Qué es un negocio de servicios personales?",
        a: "Según el inciso 125(7) de la Income Tax Act, es un negocio de prestación de servicios en el que la persona que los presta, o una persona vinculada, es accionista determinado de la sociedad y esa persona sería considerada razonablemente directiva o empleada del cliente si la sociedad no existiera. Quedan excluidas las sociedades con más de cinco empleados a tiempo completo durante todo el año y los servicios prestados a una sociedad asociada.",
      },
      {
        q: "¿Cómo tributa el ingreso de un negocio de servicios personales?",
        a: "No califica para la deducción para pequeñas empresas ni para la reducción de la tasa general, y el artículo 123.5 añade un impuesto del 5 por ciento. La tasa federal es del 33 por ciento, antes de la tasa provincial o territorial. El párrafo 18(1)(p) limita las deducciones a conceptos como el sueldo y los beneficios del empleado constituido en sociedad.",
      },
      {
        q: "¿Cómo decide la CRA si yo sería un empleado?",
        a: "La guía RC4110 de la CRA describe un enfoque en dos pasos fuera de Quebec: la intención de las partes y luego factores como el control, las herramientas y el equipo, la subcontratación, el riesgo financiero, la inversión y la gestión, y la oportunidad de ganancia. Los hechos de la relación en su conjunto determinan la situación. Si la regla se aplica en un caso concreto es una cuestión para un contador o abogado calificado.",
      },
      {
        q: "¿Cuándo se recibe el número de negocio después de constituirse?",
        a: "Para las sociedades federales y de Ontario, el número de negocio de la CRA se asigna como parte de la constitución, después de presentar los estatutos. Las cuentas de programa como GST/HST y nómina se registran por separado según se necesiten.",
      },
    ],
  },
};
