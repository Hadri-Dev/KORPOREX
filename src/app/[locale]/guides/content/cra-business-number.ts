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
    readTime: "11 min read",
    content: [
      p("To get a CRA business number in Canada, most businesses register online through the Canada Revenue Agency's Business Registration Online (BRO) service, which issues the nine-digit business number (BN) and opens program accounts such as GST/HST and payroll in the same session. If BRO is not available to you, Form RC1 can be mailed to your tax centre instead. Corporations incorporated federally or in Ontario do not need to apply at all: the BN and the corporation income tax account are issued as part of the incorporation. A sole proprietor only needs a BN when registering for a CRA program account."),
      p("This guide covers what the business number is, how program accounts attach to it, who receives one automatically, how to register, what information the CRA asks for, and how to find a BN you have misplaced."),
      { type: "heading", id: "what-it-is", text: "What the business number is" },
      p("The CRA describes the business number as a standard identifier for a business or legal entity. It is nine digits long, and each business or legal entity has only one. Provincial, municipal and other federal programs also use the BN to identify you, so it ends up on far more than tax forms."),
      p("The BN on its own is just the root. When you register for a CRA program, the CRA adds a two-letter program identifier and a four-digit reference number to it. Together, those 15 characters form your program account number. A business that collects GST/HST and runs payroll might therefore have 123456789 as its BN, 123456789 RT 0001 as its GST/HST account, and 123456789 RP 0001 as its payroll account. The reference number lets a business hold more than one account of the same type, for example separate payroll accounts for separate divisions."),
      p("The BN is not the same thing as your ", L("corporation number", "/guides/business-number-vs-corporation-number"), ", which comes from the registry that incorporated you. The difference is explained further down."),
      { type: "heading", id: "program-accounts", text: "The main CRA program accounts" },
      p("These are the program accounts most small and mid-sized businesses deal with:"),
      {
        type: "table",
        head: ["Code", "Program account", "Who typically needs it"],
        rows: [
          ["RT", "GST/HST", "Businesses that must collect GST/HST, or that register voluntarily"],
          ["RP", "Payroll deductions", "Employers and other payers of salary, wages, bonuses, vacation pay or taxable benefits"],
          ["RC", "Corporation income tax", "Every corporation, to file its T2 return"],
          ["RZ", "Information returns", "Businesses filing information returns such as T5, T5018 or T5013"],
          ["RR", "Registered charity", "Organizations applying for charitable registration"],
        ],
      },
      p("Other, more specialized accounts exist as well, including excise duty (RD), excise tax and special levies (RE), insurance premium tax (RN), Luxury Tax (LT) and Underused Housing Tax (RU). Each program account has its own registration and reporting requirements, separate from the BN itself."),
      {
        type: "callout",
        title: "Import-export (RM) accounts moved to the CBSA",
        text: "As of October 21, 2024, the import-export (RM) program account is administered by the Canada Border Services Agency, not the CRA. New importers and exporters register for or update an RM account through the CBSA Assessment and Revenue Management (CARM) Client Portal. Depending on the type of business, the BN itself can be obtained either through CARM or through the CRA's Business Registration Online.",
      },
      { type: "heading", id: "when-you-need-one", text: "When you need a business number" },
      p("Not every business needs a BN. According to the CRA, a business needs one in two situations: when it needs a GST/HST, payroll or other CRA program account, and when it incorporates. In practice, that means you need a BN when:"),
      {
        type: "list",
        items: [
          "You register for GST/HST, whether because you are required to or because you register voluntarily.",
          "You hire employees, or otherwise pay amounts that require payroll deductions, and need a payroll account.",
          "You incorporate, federally or provincially, and the corporation has to file corporate income tax.",
          "You need to file certain information returns, such as T5 slips for dividends paid.",
          "You plan to bid on federal government contracts, since a CRA BN is required before registering for a Procurement Business Number.",
        ],
      },
      p("An unincorporated business, such as a sole proprietorship, only needs a BN when it registers for a CRA program account. A sole proprietor who operates below the GST/HST small supplier threshold, has no employees and has no other program account obligation may operate for some time without one. The proprietor's business income is reported on their personal T1 return using their Social Insurance Number. Registering a business name in Ontario does not create a BN either: the Ontario Business Identification Number (BIN) issued on a ", L("sole proprietorship registration", "/guides/how-to-register-a-sole-proprietorship-in-ontario"), " is a different number, and the CRA does not accept it in place of a BN."),
      { type: "heading", id: "automatic-bn", text: "Corporations that get a BN automatically" },
      p("For corporations, the BN usually arrives without a separate application. The CRA confirms that once a federal incorporation through Corporations Canada is approved, the corporation receives a business number and its corporation income tax (RC) program account. There is no separate CRA registration for the RC account."),
      p("The same is true for corporations incorporated in Ontario. The CRA lists eight provinces where registering or incorporating a business also produces a BN: Alberta, British Columbia, Manitoba, New Brunswick, Nova Scotia, Ontario, Prince Edward Island and Saskatchewan. A corporation incorporated in one of those provinces also receives its RC account as part of the process. Businesses registered in Newfoundland and Labrador, the Northwest Territories, Nunavut, Quebec or Yukon do not receive a BN from the provincial or territorial registry and must register for one separately with the CRA."),
      p("What incorporation does not do is open your other accounts. If the new corporation needs to collect GST/HST or run payroll, those accounts are added to the existing BN afterward, usually through Business Registration Online. If you are comparing the two incorporation routes, the ", L("federal vs provincial incorporation guide", "/guides/federal-vs-provincial-incorporation"), " sets out how they differ beyond the BN."),
      p("A corporation is a separate legal entity from its owner, so it is registered under its own BN. A sole proprietor who later incorporates does not carry their existing BN over to the corporation; the CRA lists changes to the legal ownership or the structure of a business among the situations that may require a new BN."),
      { type: "heading", id: "how-to-get", text: "How to register for a business number" },
      p("If you already have a BN, you do not register for a new one. The CRA allows only one BN per business or legal entity, and any new program accounts are added to the BN you already have. For everyone else, there are two routes for Canadian residents."),
      { type: "heading", id: "online-bro", text: "Online through Business Registration Online (BRO)" },
      p("The CRA describes BRO as the fastest and easiest way to get a BN. It lets you register for the BN and several program accounts at the same time, including GST/HST (outside Quebec), payroll deductions, corporation income tax, information returns and registered charity accounts. The steps are:"),
      {
        type: "list",
        items: [
          "Sign in to your CRA account. You need a CRA account to use BRO, and you cannot register for one if you have not filed your taxes or if enhanced protection is enabled on your account.",
          "From the Welcome page, add a business account and choose to register a business.",
          "Enter the owner and business information (see the checklist below) and select the program accounts you want to open.",
          "Save or print your BN and program account numbers at the end of the session. The CRA states that the BN will not be sent to you.",
        ],
      },
      p("A few practical limits apply. A BRO session times out after 10 minutes of inactivity and you cannot save a partial registration, so it helps to have everything ready first. BRO is available daily except between 3 am and 6 am Eastern time. It cannot be used to reactivate a closed program account, to register a business owned by another business (for example, a partnership with a corporate partner), to register a business whose owner or director has died, or to register a Canadian business with only non-resident owners. Ontario and Nova Scotia residents can transfer directly from BRO to the provincial registration site when they finish."),
      { type: "heading", id: "by-mail", text: "By mail with Form RC1" },
      p("If you cannot complete the registration online, the CRA requires you to mail a form. Form RC1, Request for a Business Number and Certain Program Accounts, lets you register for a BN together with GST/HST, payroll deductions, corporation income tax, registered charity and information returns accounts on one form. You complete the sections you need and send the form to your tax centre. RC1 cannot be used for the Underused Housing Tax or Luxury Tax accounts. Mail is slower than BRO, so most applicants use it only when BRO is not an option, for example when BRO does not accept their postal code."),
      {
        type: "callout",
        title: "Businesses located in Quebec",
        text: "If a business is physically located in Quebec, GST/HST is administered by Revenu Québec, not the CRA. GST/HST registration and returns for those businesses go through Revenu Québec, using its forms. The BN itself is still a CRA number.",
      },
      { type: "heading", id: "what-you-need", text: "Information to have ready" },
      p("The CRA publishes a checklist of what you may be asked for when registering. For most businesses it includes:"),
      {
        type: "list",
        items: [
          "The name, title and phone number of each owner, and each owner's Social Insurance Number.",
          "The legal name of the business and any operating name.",
          "The mailing address and the physical business address.",
          "The type of business: sole proprietorship, partnership, corporation, trust or another form.",
          "A description of the major business activity, and the main products or services with an estimated percentage of revenue for each.",
          "For a corporation, the incorporation date, jurisdiction and certificate number.",
          "Your existing BN, if you already have one.",
        ],
      },
      p("Each program account also has its own questions. A GST/HST registration may ask for annual worldwide and domestic taxable sales, the effective date of registration, the fiscal year-end and the reporting period. A payroll registration may ask for the number of employees, expected annual salaries, the date employees receive their first wages and the pay frequency."),
      { type: "heading", id: "gst-hst", text: "GST/HST and the $30,000 small supplier rule" },
      p("For most businesses, GST/HST is the account that first triggers the need for a BN. A business is a small supplier, and does not have to register, as long as its taxable supplies do not exceed $30,000 over four consecutive calendar quarters. Small suppliers can still choose to register voluntarily. Once the threshold is crossed, the timing depends on how it happens:"),
      {
        type: "list",
        items: [
          "If you exceed $30,000 in a single calendar quarter, you stop being a small supplier immediately. You must register, your effective date of registration is no later than the day of the supply that took you over $30,000, and you charge GST/HST on that supply.",
          "If you exceed $30,000 over the previous four (or fewer) consecutive calendar quarters, but not in a single quarter, you stop being a small supplier at the end of the month following the quarter in which you exceeded $30,000. Your effective date of registration is no later than the day of your first supply after that.",
        ],
      },
      p("Some businesses, including taxi and ride-sharing drivers, must register for GST/HST regardless of the threshold. The ", L("guide to getting a GST/HST number in Ontario", "/guides/how-to-get-gst-hst-number-ontario"), " walks through that registration in more detail, and the guide on ", L("how to confirm a GST/HST number", "/guides/how-to-confirm-a-gst-hst-number"), " covers checking a supplier's number."),
      { type: "heading", id: "payroll", text: "Payroll accounts when you hire" },
      p("An employer, including a corporation that pays a salary to its owner-manager, needs a payroll (RP) account. The CRA requires registration before the first remittance due date, which is generally the 15th day of the month following the month in which you began withholding deductions from an employee's pay. For example, if you hire someone on March 11 and pay them on March 25, the first remittance is due April 15. Registering late does not delay the obligation: deductions still have to be calculated and remitted by the due date, and penalties may be assessed if they are not. Owners deciding how to pay themselves often weigh this against dividends, which the ", L("salary vs dividends guide", "/guides/salary-vs-dividends-canada"), " compares; an accountant can advise on the right mix for a particular situation."),
      { type: "heading", id: "bn-vs-corporation-number", text: "Business number vs corporation numbers" },
      p("A corporation ends up with at least two numbers from two different governments, and they are not interchangeable:"),
      {
        type: "table",
        head: ["Number", "Issued by", "Used for"],
        rows: [
          ["Business number (BN)", "Canada Revenue Agency", "Federal tax accounts (GST/HST, payroll, corporate income tax) and many other government programs"],
          ["Federal corporation number", "Corporations Canada", "Identifying a CBCA corporation for annual returns, changes and certificates"],
          ["Ontario corporation number", "Ontario Business Registry", "Identifying an Ontario corporation for annual returns, notices of change and other OBR filings"],
          ["Ontario Business Identification Number (BIN)", "Ontario Business Registry", "Identifying a registered sole proprietorship, partnership or business name; not a CRA number"],
        ],
      },
      p("The corporation number appears on your certificate of incorporation and is what you use when filing ", L("annual returns", "/guides/corporate-annual-returns-canada"), " with the registry. The BN is what the CRA, your bank and your payroll provider will ask for. The full comparison is in ", L("business number vs corporation number", "/guides/business-number-vs-corporation-number"), "."),
      { type: "heading", id: "find-lost-bn", text: "How to find a lost business number" },
      p("If you know you have a BN but cannot locate it, the CRA suggests working through these options in order:"),
      {
        type: "list",
        items: [
          "Check your records: letters or notices from the CRA, and any confirmation you saved or printed at the end of a BRO session.",
          "Sign in to your CRA account. If My Business Account has been added, the BN appears on the Welcome page. If you registered through your province, the provincial online account may show it too.",
          "Search an online business registry. Corporations Canada shows BNs for federal corporations, the Ontario Business Registry covers Ontario businesses (information may take two business days to appear after registration, and fees may apply for some services), and Canada's Business Registries covers federal corporations and corporations in certain provinces.",
          "Call the CRA business enquiries line at 1-800-959-5525, Monday to Friday, 8 am to 8 pm Eastern time. You may need to confirm details you entered during registration.",
        ],
      },
      p("Note that a BN may also have been created if you started a BRO registration and the session timed out. Before registering again, it is worth checking whether that partial session left you with a number, since a business can only have one."),
      { type: "heading", id: "after-you-have-it", text: "After you have it" },
      p("Once you have your BN, put it on the documents that need it (GST/HST invoices, payroll remittances, corporate filings) and keep it somewhere easy to find. Banks usually ask for it when you ", L("open a business bank account", "/guides/how-to-open-a-business-bank-account-canada"), ", and you will use it every time you deal with the CRA. If the business later changes its legal ownership or structure, check with the CRA whether a new BN is needed."),
      { type: "heading", id: "korporex", text: "Getting a business number with Korporex" },
      p("When you ", L("incorporate with Korporex", "/incorporate"), ", federally or in Ontario, the business number is issued as part of the incorporation, and Korporex provides it to you once the incorporation is complete. That BN is the base for any GST/HST, payroll or other program accounts the corporation opens later. If you need a BN registered outside of an incorporation, for example for an existing ", L("sole proprietorship", "/services/sole-proprietorship"), ", see the ", L("business number registration service", "/services/business-number"), ". Korporex is not a law firm or accounting firm; for questions about which tax accounts your business needs, speak with an accountant or lawyer."),
    ],
    faq: [
      {
        q: "How long does it take to get a CRA business number?",
        a: "Registering through Business Registration Online produces the BN at the end of the session, and you must save or print it because the CRA does not send it to you. A mailed Form RC1 takes longer because it has to be processed by the tax centre. Corporations incorporated federally or in Ontario receive their BN through the incorporation itself.",
      },
      {
        q: "Is there a fee to get a business number?",
        a: "The CRA does not list a fee for registering a business number or program accounts through Business Registration Online or Form RC1. The cost of incorporating is separate: the government fee is $200 for a federal incorporation and $300 for Ontario Articles of Incorporation, and the BN is issued as part of that process.",
      },
      {
        q: "Does a sole proprietor need a business number?",
        a: "Only when registering for a CRA program account. An unincorporated business needs a BN once it registers for GST/HST, opens a payroll account or needs another program account. A sole proprietor below the $30,000 small supplier threshold with no employees may not need one yet. An Ontario business name registration gives a BIN, which is not a BN.",
      },
      {
        q: "Can I register for a business number by phone?",
        a: "The CRA's current registration page lists two methods for Canadian residents: Business Registration Online, and Form RC1 sent by mail to your tax centre when you cannot register online. The business enquiries line at 1-800-959-5525 can help you find an existing BN or resolve problems with a registration.",
      },
      {
        q: "Is my business number the same as my GST/HST number?",
        a: "Not exactly. The BN is the nine-digit root. Your GST/HST account number is the BN followed by RT and a four-digit reference number, such as 123456789 RT 0001. Payroll and corporate income tax accounts use the same nine digits with RP and RC instead. When someone asks for your GST/HST number, they need the full account number.",
      },
    ],
  },

  // ── French ──
  fr: {
    readTime: "13 min de lecture",
    content: [
      p("Pour obtenir un numéro d'entreprise de l'ARC au Canada, la plupart des entreprises s'inscrivent en ligne par le service d'Inscription en direct des entreprises (IDE) de l'Agence du revenu du Canada, qui attribue le numéro d'entreprise (NE) de neuf chiffres et ouvre, au cours de la même session, des comptes de programme comme ceux de la TPS/TVH et des retenues sur la paie. Si l'IDE ne vous est pas accessible, vous pouvez plutôt envoyer le formulaire RC1 par la poste à votre centre fiscal. Les sociétés constituées sous le régime fédéral ou en Ontario n'ont aucune demande à faire : le NE et le compte d'impôt sur le revenu des sociétés sont attribués dans le cadre de la constitution. Un entrepreneur individuel n'a besoin d'un NE que lorsqu'il s'inscrit à un compte de programme de l'ARC."),
      p("Ce guide explique ce qu'est le numéro d'entreprise, comment les comptes de programme s'y rattachent, qui le reçoit automatiquement, comment s'inscrire, quels renseignements l'ARC demande et comment retrouver un NE égaré."),
      { type: "heading", id: "ce-que-cest", text: "Ce qu'est le numéro d'entreprise" },
      p("L'ARC décrit le numéro d'entreprise comme un identifiant standard pour une entreprise ou une entité juridique. Il compte neuf chiffres, et chaque entreprise ou entité juridique n'en a qu'un. Les programmes provinciaux, municipaux et d'autres programmes fédéraux utilisent aussi le NE pour vous identifier, de sorte qu'il figure sur bien plus que des formulaires fiscaux."),
      p("Le NE n'est que la racine. Lorsque vous vous inscrivez à un programme de l'ARC, celle-ci y ajoute un identificateur de programme de deux lettres et un numéro de référence de quatre chiffres. Ensemble, ces 15 caractères forment votre numéro de compte de programme. Une entreprise qui perçoit la TPS/TVH et gère une paie pourrait donc avoir 123456789 comme NE, 123456789 RT 0001 comme compte de TPS/TVH et 123456789 RP 0001 comme compte de retenues sur la paie. Le numéro de référence permet à une entreprise de détenir plus d'un compte du même type, par exemple des comptes de paie distincts pour des divisions distinctes."),
      p("Le NE n'est pas la même chose que votre ", L("numéro de société", "/guides/numero-entreprise-ou-numero-societe"), ", qui provient du registre qui vous a constitué. La différence est expliquée plus bas."),
      { type: "heading", id: "comptes-de-programme", text: "Les principaux comptes de programme de l'ARC" },
      p("Voici les comptes de programme auxquels la plupart des petites et moyennes entreprises ont affaire :"),
      {
        type: "table",
        head: ["Code", "Compte de programme", "Qui en a généralement besoin"],
        rows: [
          ["RT", "TPS/TVH", "Les entreprises qui doivent percevoir la TPS/TVH, ou qui s'inscrivent volontairement"],
          ["RP", "Retenues sur la paie", "Les employeurs et autres payeurs de salaires, traitements, primes, indemnités de vacances ou avantages imposables"],
          ["RC", "Impôt sur le revenu des sociétés", "Toute société, pour produire sa déclaration T2"],
          ["RZ", "Déclarations de renseignements", "Les entreprises qui produisent des déclarations de renseignements comme les T5, T5018 ou T5013"],
          ["RR", "Organisme de bienfaisance enregistré", "Les organismes qui demandent l'enregistrement à titre d'organisme de bienfaisance"],
        ],
      },
      p("D'autres comptes plus spécialisés existent aussi, notamment les droits d'accise (RD), la taxe d'accise et les prélèvements spéciaux (RE), la taxe sur les primes d'assurance (RN), la taxe sur certains biens de luxe (LT) et la taxe sur les logements sous-utilisés (RU). Chaque compte de programme a ses propres exigences d'inscription et de déclaration, distinctes du NE lui-même."),
      {
        type: "callout",
        title: "Les comptes d'importation-exportation (RM) relèvent maintenant de l'ASFC",
        text: "Depuis le 21 octobre 2024, le compte de programme d'importation-exportation (RM) est administré par l'Agence des services frontaliers du Canada, et non par l'ARC. Les nouveaux importateurs et exportateurs s'inscrivent à un compte RM ou le modifient par le portail client de la Gestion des cotisations et des recettes de l'ASFC (GCRA). Selon le type d'entreprise, le NE lui-même peut être obtenu par la GCRA ou par l'Inscription en direct des entreprises de l'ARC.",
      },
      { type: "heading", id: "quand-il-faut", text: "Quand il vous faut un numéro d'entreprise" },
      p("Les entreprises n'ont pas toutes besoin d'un NE. Selon l'ARC, une entreprise en a besoin dans deux situations : lorsqu'il lui faut un compte de TPS/TVH, de retenues sur la paie ou un autre compte de programme de l'ARC, et lorsqu'elle se constitue en société. En pratique, il vous faut un NE lorsque :"),
      {
        type: "list",
        items: [
          "Vous vous inscrivez à la TPS/TVH, que ce soit par obligation ou volontairement.",
          "Vous embauchez des employés, ou versez autrement des sommes qui exigent des retenues sur la paie, et avez besoin d'un compte de paie.",
          "Vous vous constituez en société, sous le régime fédéral ou provincial, et la société doit produire sa déclaration d'impôt des sociétés.",
          "Vous devez produire certaines déclarations de renseignements, comme des feuillets T5 pour les dividendes versés.",
          "Vous comptez soumissionner pour des contrats du gouvernement fédéral, puisqu'un NE de l'ARC est exigé avant l'inscription à un numéro d'entreprise d'approvisionnement.",
        ],
      },
      p("Une entreprise non constituée en société, comme une entreprise individuelle, n'a besoin d'un NE que lorsqu'elle s'inscrit à un compte de programme de l'ARC. Un entrepreneur individuel qui exerce sous le seuil du petit fournisseur de la TPS/TVH, n'a pas d'employés et n'a aucune autre obligation de compte de programme peut exercer un certain temps sans NE. Le revenu d'entreprise du propriétaire est déclaré dans sa déclaration personnelle T1 au moyen de son numéro d'assurance sociale. L'enregistrement d'un nom commercial en Ontario ne crée pas non plus de NE : le numéro d'identification d'entreprise de l'Ontario (NIE) attribué lors de l'", L("enregistrement d'une entreprise individuelle", "/guides/comment-enregistrer-une-entreprise-individuelle-en-ontario"), " est un numéro différent, et l'ARC ne l'accepte pas à la place d'un NE."),
      { type: "heading", id: "ne-automatique", text: "Les sociétés qui reçoivent un NE automatiquement" },
      p("Pour les sociétés, le NE arrive habituellement sans demande distincte. L'ARC confirme qu'une fois la constitution fédérale approuvée par Corporations Canada, la société reçoit un numéro d'entreprise et son compte de programme d'impôt sur le revenu des sociétés (RC). Aucune inscription distincte auprès de l'ARC n'est nécessaire pour le compte RC."),
      p("Il en va de même pour les sociétés constituées en Ontario. L'ARC énumère huit provinces où l'enregistrement ou la constitution d'une entreprise produit aussi un NE : l'Alberta, la Colombie-Britannique, le Manitoba, le Nouveau-Brunswick, la Nouvelle-Écosse, l'Ontario, l'Île-du-Prince-Édouard et la Saskatchewan. Une société constituée dans l'une de ces provinces reçoit aussi son compte RC dans le cadre du processus. Les entreprises enregistrées à Terre-Neuve-et-Labrador, dans les Territoires du Nord-Ouest, au Nunavut, au Québec ou au Yukon ne reçoivent pas de NE du registre provincial ou territorial et doivent s'inscrire séparément auprès de l'ARC."),
      p("La constitution n'ouvre toutefois pas vos autres comptes. Si la nouvelle société doit percevoir la TPS/TVH ou gérer une paie, ces comptes sont ajoutés au NE existant par la suite, habituellement par l'Inscription en direct des entreprises. Si vous comparez les deux voies de constitution, le guide ", L("comment se constituer en société au Canada", "/guides/comment-se-constituer-societe-canada"), " explique leurs différences au-delà du NE."),
      p("Une société est une entité juridique distincte de son propriétaire, de sorte qu'elle est inscrite sous son propre NE. Un entrepreneur individuel qui se constitue en société par la suite ne transfère pas son NE existant à la société; l'ARC mentionne les changements de propriété légale ou de structure d'une entreprise parmi les situations qui peuvent exiger un nouveau NE."),
      { type: "heading", id: "comment-obtenir", text: "Comment s'inscrire pour obtenir un numéro d'entreprise" },
      p("Si vous avez déjà un NE, vous ne vous inscrivez pas pour en obtenir un nouveau. L'ARC ne permet qu'un seul NE par entreprise ou entité juridique, et tout nouveau compte de programme est ajouté au NE que vous avez déjà. Pour les autres, deux voies s'offrent aux résidents du Canada."),
      { type: "heading", id: "en-ligne-ide", text: "En ligne par l'Inscription en direct des entreprises (IDE)" },
      p("L'ARC décrit l'IDE comme le moyen le plus rapide et le plus facile d'obtenir un NE. Le service permet de s'inscrire au NE et à plusieurs comptes de programme en même temps, notamment la TPS/TVH (hors Québec), les retenues sur la paie, l'impôt sur le revenu des sociétés, les déclarations de renseignements et les organismes de bienfaisance enregistrés. Les étapes sont les suivantes :"),
      {
        type: "list",
        items: [
          "Connectez-vous à votre compte de l'ARC. Il faut un compte de l'ARC pour utiliser l'IDE, et vous ne pouvez pas vous inscrire à un tel compte si vous n'avez pas produit vos déclarations de revenus ou si des mesures de protection supplémentaires sont activées dans votre compte.",
          "À partir de la page d'accueil, ajoutez un compte d'entreprise et choisissez d'inscrire une entreprise.",
          "Saisissez les renseignements sur les propriétaires et l'entreprise (voir la liste ci-dessous) et sélectionnez les comptes de programme que vous voulez ouvrir.",
          "Enregistrez ou imprimez votre NE et vos numéros de compte de programme à la fin de la session. L'ARC précise que le NE ne vous sera pas envoyé.",
        ],
      },
      p("Quelques limites pratiques s'appliquent. Une session de l'IDE expire après 10 minutes d'inactivité et vous ne pouvez pas sauvegarder une inscription partielle; il est donc utile d'avoir tout en main au départ. L'IDE est accessible tous les jours, sauf entre 3 h et 6 h (heure de l'Est). Le service ne peut pas servir à réactiver un compte de programme fermé, à inscrire une entreprise appartenant à une autre entreprise (par exemple, une société de personnes dont un associé est une société), à inscrire une entreprise dont le propriétaire ou un administrateur est décédé, ni à inscrire une entreprise canadienne dont tous les propriétaires sont non-résidents. Les résidents de l'Ontario et de la Nouvelle-Écosse peuvent passer directement de l'IDE au site d'inscription provincial une fois terminé."),
      { type: "heading", id: "par-la-poste", text: "Par la poste avec le formulaire RC1" },
      p("Si vous ne pouvez pas terminer l'inscription en ligne, l'ARC exige que vous envoyiez un formulaire par la poste. Le formulaire RC1, Demande d'un numéro d'entreprise et inscription à certains comptes de programme, permet de s'inscrire au NE ainsi qu'aux comptes de TPS/TVH, de retenues sur la paie, d'impôt sur le revenu des sociétés, d'organisme de bienfaisance enregistré et de déclarations de renseignements sur un seul formulaire. Vous remplissez les sections nécessaires et envoyez le formulaire à votre centre fiscal. Le RC1 ne peut pas servir pour les comptes de la taxe sur les logements sous-utilisés ou de la taxe sur certains biens de luxe. La poste est plus lente que l'IDE, de sorte que la plupart des demandeurs n'y recourent que lorsque l'IDE n'est pas une option, par exemple lorsque l'IDE n'accepte pas leur code postal."),
      {
        type: "callout",
        title: "Entreprises situées au Québec",
        text: "Si une entreprise est physiquement située au Québec, la TPS/TVH est administrée par Revenu Québec, et non par l'ARC. L'inscription à la TPS/TVH et les déclarations de ces entreprises passent par Revenu Québec, au moyen de ses formulaires. Le NE lui-même demeure un numéro de l'ARC.",
      },
      { type: "heading", id: "renseignements", text: "Les renseignements à avoir en main" },
      p("L'ARC publie une liste des renseignements qui peuvent vous être demandés lors de l'inscription. Pour la plupart des entreprises, elle comprend :"),
      {
        type: "list",
        items: [
          "Le nom, le titre et le numéro de téléphone de chaque propriétaire, ainsi que le numéro d'assurance sociale de chacun.",
          "La dénomination légale de l'entreprise et tout nom commercial.",
          "L'adresse postale et l'adresse physique de l'entreprise.",
          "Le type d'entreprise : entreprise individuelle, société de personnes, société, fiducie ou autre forme.",
          "Une description de l'activité principale de l'entreprise, ainsi que les principaux produits ou services avec un pourcentage estimatif des revenus pour chacun.",
          "Pour une société, la date de constitution, le territoire de compétence et le numéro du certificat.",
          "Votre NE existant, si vous en avez déjà un.",
        ],
      },
      p("Chaque compte de programme comporte aussi ses propres questions. Une inscription à la TPS/TVH peut demander le montant annuel des ventes taxables mondiales et au Canada, la date d'entrée en vigueur de l'inscription, la fin de l'exercice et la période de déclaration. Une inscription aux retenues sur la paie peut demander le nombre d'employés, les salaires annuels prévus, la date à laquelle les employés reçoivent leur première paie et la fréquence de paie."),
      { type: "heading", id: "tps-tvh", text: "La TPS/TVH et la règle du petit fournisseur de 30 000 $" },
      p("Pour la plupart des entreprises, c'est le compte de TPS/TVH qui déclenche en premier le besoin d'un NE. Une entreprise est un petit fournisseur, et n'a pas à s'inscrire, tant que ses fournitures taxables ne dépassent pas 30 000 $ sur quatre trimestres civils consécutifs. Les petits fournisseurs peuvent tout de même choisir de s'inscrire volontairement. Une fois le seuil franchi, le moment dépend de la façon dont il l'est :"),
      {
        type: "list",
        items: [
          "Si vous dépassez 30 000 $ au cours d'un seul trimestre civil, vous cessez immédiatement d'être un petit fournisseur. Vous devez vous inscrire, la date d'entrée en vigueur de votre inscription est au plus tard le jour de la fourniture qui vous a fait dépasser 30 000 $, et vous percevez la TPS/TVH sur cette fourniture.",
          "Si vous dépassez 30 000 $ au cours des quatre (ou moins) derniers trimestres civils consécutifs, mais non au cours d'un seul trimestre, vous cessez d'être un petit fournisseur à la fin du mois suivant le trimestre au cours duquel vous avez dépassé 30 000 $. La date d'entrée en vigueur de votre inscription est au plus tard le jour de votre première fourniture après ce moment.",
        ],
      },
      p("Certaines entreprises, dont les chauffeurs de taxi et de covoiturage commercial, doivent s'inscrire à la TPS/TVH peu importe le seuil. Le ", L("guide pour obtenir un numéro de TPS/TVH en Ontario", "/guides/comment-obtenir-numero-tps-tvh-ontario"), " détaille cette inscription, et le guide sur la ", L("façon de vérifier un numéro de TPS/TVH", "/guides/comment-verifier-un-numero-tps-tvh"), " explique comment confirmer le numéro d'un fournisseur."),
      { type: "heading", id: "paie", text: "Le compte de paie lorsque vous embauchez" },
      p("Un employeur, y compris une société qui verse un salaire à son propriétaire-dirigeant, a besoin d'un compte de retenues sur la paie (RP). L'ARC exige l'inscription avant la date d'échéance du premier versement, qui est généralement le 15e jour du mois suivant celui au cours duquel vous avez commencé à faire des retenues sur la paie d'un employé. Par exemple, si vous embauchez une personne le 11 mars et la payez le 25 mars, le premier versement est dû le 15 avril. Une inscription tardive ne reporte pas l'obligation : les retenues doivent quand même être calculées et versées à la date d'échéance, sans quoi des pénalités peuvent être imposées. Les propriétaires qui choisissent comment se rémunérer comparent souvent le salaire aux dividendes, comme le fait le guide ", L("salaire ou dividendes", "/guides/salaire-ou-dividendes"), "; un comptable peut conseiller la bonne combinaison selon la situation."),
      { type: "heading", id: "ne-ou-numero-societe", text: "Numéro d'entreprise et numéros de société" },
      p("Une société se retrouve avec au moins deux numéros provenant de deux gouvernements différents, et ils ne sont pas interchangeables :"),
      {
        type: "table",
        head: ["Numéro", "Attribué par", "Utilisé pour"],
        rows: [
          ["Numéro d'entreprise (NE)", "Agence du revenu du Canada", "Les comptes fiscaux fédéraux (TPS/TVH, paie, impôt des sociétés) et de nombreux autres programmes gouvernementaux"],
          ["Numéro de société fédérale", "Corporations Canada", "Identifier une société régie par la LCSA pour les déclarations annuelles, les modifications et les certificats"],
          ["Numéro de société de l'Ontario", "Registre des entreprises de l'Ontario", "Identifier une société ontarienne pour les déclarations annuelles, les avis de modification et les autres dépôts au registre"],
          ["Numéro d'identification d'entreprise de l'Ontario (NIE)", "Registre des entreprises de l'Ontario", "Identifier une entreprise individuelle, une société de personnes ou un nom commercial enregistré; ce n'est pas un numéro de l'ARC"],
        ],
      },
      p("Le numéro de société figure sur votre certificat de constitution et c'est celui que vous utilisez pour produire vos ", L("déclarations annuelles", "/guides/declarations-annuelles-societes-canada"), " auprès du registre. Le NE est celui que l'ARC, votre banque et votre fournisseur de paie vous demanderont. La comparaison complète se trouve dans le guide ", L("numéro d'entreprise ou numéro de société", "/guides/numero-entreprise-ou-numero-societe"), "."),
      { type: "heading", id: "ne-perdu", text: "Comment retrouver un numéro d'entreprise perdu" },
      p("Si vous savez que vous avez un NE mais ne le retrouvez pas, l'ARC suggère d'essayer ces options dans l'ordre :"),
      {
        type: "list",
        items: [
          "Vérifiez vos dossiers : lettres ou avis de l'ARC, et toute confirmation enregistrée ou imprimée à la fin d'une session de l'IDE.",
          "Connectez-vous à votre compte de l'ARC. Si Mon dossier d'entreprise y a été ajouté, le NE apparaît sur la page d'accueil. Si vous vous êtes inscrit par votre province, votre compte provincial en ligne peut aussi l'afficher.",
          "Cherchez dans un registre d'entreprises en ligne. Corporations Canada affiche le NE des sociétés fédérales, le Registre des entreprises de l'Ontario couvre les entreprises ontariennes (l'information peut prendre deux jours ouvrables à apparaître après l'enregistrement, et des frais peuvent s'appliquer à certains services), et les Registres d'entreprises au Canada couvrent les sociétés fédérales et celles de certaines provinces.",
          "Appelez la ligne des demandes de renseignements des entreprises de l'ARC au 1-800-959-5525, du lundi au vendredi, de 8 h à 20 h (heure de l'Est). Il se peut que vous deviez confirmer des renseignements saisis lors de l'inscription.",
        ],
      },
      p("Notez qu'un NE peut aussi avoir été créé si vous avez commencé une inscription dans l'IDE et que la session a expiré. Avant de vous inscrire de nouveau, il vaut la peine de vérifier si cette session partielle vous a laissé un numéro, puisqu'une entreprise ne peut en avoir qu'un."),
      { type: "heading", id: "apres", text: "Une fois que vous l'avez" },
      p("Une fois votre NE obtenu, inscrivez-le sur les documents qui l'exigent (factures de TPS/TVH, versements de paie, déclarations des sociétés) et gardez-le à portée de main. Les banques le demandent habituellement lorsque vous ", L("ouvrez un compte bancaire d'entreprise", "/guides/compte-bancaire-entreprise-canada"), ", et vous l'utiliserez chaque fois que vous traiterez avec l'ARC. Si l'entreprise change plus tard de propriété légale ou de structure, vérifiez auprès de l'ARC si un nouveau NE est nécessaire."),
      { type: "heading", id: "korporex", text: "Obtenir un numéro d'entreprise avec Korporex" },
      p("Lorsque vous vous ", L("constituez en société avec Korporex", "/incorporate"), ", sous le régime fédéral ou en Ontario, le numéro d'entreprise est attribué dans le cadre de la constitution, et Korporex vous le transmet une fois la constitution terminée. Ce NE sert de base à tout compte de TPS/TVH, de paie ou autre compte de programme que la société ouvrira par la suite. Si vous avez besoin d'un NE en dehors d'une constitution, par exemple pour une ", L("entreprise individuelle", "/services/sole-proprietorship"), " existante, consultez le ", L("service d'inscription au numéro d'entreprise", "/services/business-number"), ". Korporex n'est pas un cabinet d'avocats ni un cabinet comptable; pour savoir quels comptes fiscaux votre entreprise nécessite, adressez-vous à un comptable ou à un avocat. Pour une vue d'ensemble de la constitution, consultez aussi le guide ", L("comment se constituer en société au Canada", "/guides/comment-se-constituer-societe-canada"), "."),
    ],
    faq: [
      {
        q: "Combien de temps faut-il pour obtenir un numéro d'entreprise de l'ARC ?",
        a: "L'inscription par l'Inscription en direct des entreprises produit le NE à la fin de la session, et vous devez l'enregistrer ou l'imprimer, car l'ARC ne vous l'envoie pas. Un formulaire RC1 envoyé par la poste prend plus de temps, puisqu'il doit être traité par le centre fiscal. Les sociétés constituées sous le régime fédéral ou en Ontario reçoivent leur NE par la constitution elle-même.",
      },
      {
        q: "Y a-t-il des frais pour obtenir un numéro d'entreprise ?",
        a: "L'ARC n'indique aucuns frais pour l'inscription à un numéro d'entreprise ou à des comptes de programme par l'IDE ou le formulaire RC1. Le coût de la constitution est distinct : les droits gouvernementaux sont de 200 $ pour une constitution fédérale et de 300 $ pour des statuts constitutifs en Ontario, et le NE est attribué dans le cadre de ce processus.",
      },
      {
        q: "Un entrepreneur individuel a-t-il besoin d'un numéro d'entreprise ?",
        a: "Seulement lorsqu'il s'inscrit à un compte de programme de l'ARC. Une entreprise non constituée a besoin d'un NE dès qu'elle s'inscrit à la TPS/TVH, ouvre un compte de paie ou a besoin d'un autre compte de programme. Un entrepreneur sous le seuil de 30 000 $ du petit fournisseur et sans employés n'en a peut-être pas encore besoin. Le NIE ontarien n'est pas un NE.",
      },
      {
        q: "Puis-je m'inscrire à un numéro d'entreprise par téléphone ?",
        a: "La page d'inscription actuelle de l'ARC présente deux méthodes pour les résidents du Canada : l'Inscription en direct des entreprises, et le formulaire RC1 envoyé par la poste à votre centre fiscal lorsque l'inscription en ligne est impossible. La ligne des demandes de renseignements des entreprises peut vous aider à retrouver un NE existant ou à régler un problème d'inscription.",
      },
      {
        q: "Mon numéro d'entreprise est-il le même que mon numéro de TPS/TVH ?",
        a: "Pas tout à fait. Le NE est la racine de neuf chiffres. Votre numéro de compte de TPS/TVH est le NE suivi de RT et d'un numéro de référence de quatre chiffres, comme 123456789 RT 0001. Les comptes de paie et d'impôt des sociétés utilisent les mêmes neuf chiffres avec RP et RC. Quand on vous demande votre numéro de TPS/TVH, il faut fournir le numéro de compte complet.",
      },
    ],
  },

  // ── Spanish ──
  es: {
    readTime: "12 min de lectura",
    content: [
      p("Para obtener un número de negocio de la CRA en Canadá, la mayoría de las empresas se registran en línea mediante Business Registration Online (BRO), el servicio de registro en línea de la Agencia de Ingresos de Canadá, que asigna el número de negocio (BN) de nueve dígitos y abre, en la misma sesión, cuentas de programa como las de GST/HST y nómina. Si BRO no está disponible para usted, puede enviar en su lugar el formulario RC1 por correo a su centro fiscal. Las sociedades constituidas a nivel federal o en Ontario no necesitan presentar ninguna solicitud: el BN y la cuenta del impuesto sobre la renta de sociedades se asignan como parte de la constitución. Un empresario unipersonal solo necesita un BN cuando se registra para una cuenta de programa de la CRA."),
      p("Esta guía explica qué es el número de negocio, cómo se vinculan a él las cuentas de programa, quién lo recibe automáticamente, cómo registrarse, qué información pide la CRA y cómo encontrar un BN extraviado."),
      { type: "heading", id: "que-es", text: "Qué es el número de negocio" },
      p("La CRA describe el número de negocio como un identificador estándar para una empresa o entidad legal. Tiene nueve dígitos, y cada empresa o entidad legal tiene solo uno. Los programas provinciales, municipales y otros programas federales también usan el BN para identificarlo, por lo que aparece en mucho más que formularios fiscales."),
      p("El BN por sí solo es solo la raíz. Cuando usted se registra en un programa de la CRA, esta le añade un identificador de programa de dos letras y un número de referencia de cuatro dígitos. Juntos, esos 15 caracteres forman su número de cuenta de programa. Una empresa que cobra GST/HST y maneja nómina podría tener 123456789 como BN, 123456789 RT 0001 como cuenta de GST/HST y 123456789 RP 0001 como cuenta de nómina. El número de referencia permite que una empresa tenga más de una cuenta del mismo tipo, por ejemplo cuentas de nómina separadas para divisiones separadas."),
      p("El BN no es lo mismo que su ", L("número de sociedad", "/guides/numero-negocio-o-numero-sociedad"), ", que proviene del registro que lo constituyó. La diferencia se explica más abajo."),
      { type: "heading", id: "cuentas-de-programa", text: "Las principales cuentas de programa de la CRA" },
      p("Estas son las cuentas de programa con las que trata la mayoría de las pequeñas y medianas empresas:"),
      {
        type: "table",
        head: ["Código", "Cuenta de programa", "Quién suele necesitarla"],
        rows: [
          ["RT", "GST/HST", "Las empresas que deben cobrar GST/HST, o que se registran voluntariamente"],
          ["RP", "Retenciones de nómina", "Los empleadores y otros pagadores de sueldos, salarios, bonificaciones, pago de vacaciones o beneficios gravables"],
          ["RC", "Impuesto sobre la renta de sociedades", "Toda sociedad, para presentar su declaración T2"],
          ["RZ", "Declaraciones informativas", "Las empresas que presentan declaraciones informativas como T5, T5018 o T5013"],
          ["RR", "Organización benéfica registrada", "Las organizaciones que solicitan el registro como organización benéfica"],
        ],
      },
      p("También existen otras cuentas más especializadas, entre ellas los derechos de impuestos especiales (RD), el impuesto especial y gravámenes especiales (RE), el impuesto sobre primas de seguros (RN), el impuesto sobre bienes de lujo (LT) y el impuesto sobre viviendas subutilizadas (RU). Cada cuenta de programa tiene sus propios requisitos de registro y declaración, separados del BN en sí."),
      {
        type: "callout",
        title: "Las cuentas de importación y exportación (RM) pasaron a la CBSA",
        text: "Desde el 21 de octubre de 2024, la cuenta de programa de importación y exportación (RM) la administra la Agencia de Servicios Fronterizos de Canadá (CBSA), no la CRA. Los nuevos importadores y exportadores se registran para una cuenta RM o la modifican a través del portal de clientes de CARM (CBSA Assessment and Revenue Management). Según el tipo de empresa, el BN en sí puede obtenerse mediante CARM o mediante Business Registration Online de la CRA.",
      },
      { type: "heading", id: "cuando-lo-necesita", text: "Cuándo necesita un número de negocio" },
      p("No todas las empresas necesitan un BN. Según la CRA, una empresa lo necesita en dos situaciones: cuando requiere una cuenta de GST/HST, de nómina u otra cuenta de programa de la CRA, y cuando se constituye en sociedad. En la práctica, usted necesita un BN cuando:"),
      {
        type: "list",
        items: [
          "Se registra para el GST/HST, ya sea por obligación o de forma voluntaria.",
          "Contrata empleados, o paga de otro modo montos que requieren retenciones de nómina, y necesita una cuenta de nómina.",
          "Se constituye en sociedad, a nivel federal o provincial, y la sociedad debe presentar el impuesto de sociedades.",
          "Debe presentar ciertas declaraciones informativas, como formularios T5 por dividendos pagados.",
          "Planea participar en licitaciones del gobierno federal, ya que se exige un BN de la CRA antes de registrarse para un Procurement Business Number.",
        ],
      },
      p("Una empresa no constituida en sociedad, como una empresa unipersonal, solo necesita un BN cuando se registra para una cuenta de programa de la CRA. Un empresario unipersonal que opera por debajo del umbral de pequeño proveedor del GST/HST, no tiene empleados y no tiene ninguna otra obligación de cuenta de programa puede operar un tiempo sin uno. El ingreso empresarial del propietario se declara en su declaración personal T1 con su número de seguro social. Registrar un nombre comercial en Ontario tampoco crea un BN: el Ontario Business Identification Number (BIN) que se asigna al ", L("registrar una empresa unipersonal", "/guides/como-registrar-una-empresa-unipersonal-en-ontario"), " es un número distinto, y la CRA no lo acepta en lugar de un BN."),
      { type: "heading", id: "bn-automatico", text: "Las sociedades que reciben un BN automáticamente" },
      p("En el caso de las sociedades, el BN suele llegar sin una solicitud separada. La CRA confirma que, una vez aprobada la constitución federal por Corporations Canada, la sociedad recibe un número de negocio y su cuenta de programa del impuesto sobre la renta de sociedades (RC). No se requiere un registro separado ante la CRA para la cuenta RC."),
      p("Lo mismo ocurre con las sociedades constituidas en Ontario. La CRA enumera ocho provincias donde registrar o constituir una empresa también produce un BN: Alberta, Columbia Británica, Manitoba, Nuevo Brunswick, Nueva Escocia, Ontario, Isla del Príncipe Eduardo y Saskatchewan. Una sociedad constituida en una de esas provincias también recibe su cuenta RC como parte del proceso. Las empresas registradas en Terranova y Labrador, los Territorios del Noroeste, Nunavut, Quebec o Yukón no reciben un BN del registro provincial o territorial y deben registrarse por separado ante la CRA."),
      p("Lo que la constitución no hace es abrir sus otras cuentas. Si la nueva sociedad debe cobrar GST/HST o manejar nómina, esas cuentas se añaden después al BN existente, normalmente mediante Business Registration Online. Si está comparando las dos vías de constitución, la guía ", L("cómo constituirse en sociedad en Canadá", "/guides/como-constituirse-sociedad-canada"), " explica en qué se diferencian más allá del BN."),
      p("Una sociedad es una entidad legal separada de su propietario, por lo que se registra con su propio BN. Un empresario unipersonal que luego se constituye en sociedad no traslada su BN existente a la sociedad; la CRA menciona los cambios en la propiedad legal o en la estructura de una empresa entre las situaciones que pueden requerir un nuevo BN."),
      { type: "heading", id: "como-obtener", text: "Cómo registrarse para obtener un número de negocio" },
      p("Si ya tiene un BN, no se registra para obtener uno nuevo. La CRA permite un solo BN por empresa o entidad legal, y cualquier nueva cuenta de programa se añade al BN que ya tiene. Para los demás, hay dos vías para los residentes de Canadá."),
      { type: "heading", id: "en-linea-bro", text: "En línea mediante Business Registration Online (BRO)" },
      p("La CRA describe BRO como la forma más rápida y sencilla de obtener un BN. Permite registrarse para el BN y varias cuentas de programa al mismo tiempo, entre ellas GST/HST (fuera de Quebec), retenciones de nómina, impuesto sobre la renta de sociedades, declaraciones informativas y organizaciones benéficas registradas. Los pasos son:"),
      {
        type: "list",
        items: [
          "Inicie sesión en su cuenta de la CRA. Necesita una cuenta de la CRA para usar BRO, y no puede registrarse para una si no ha presentado sus declaraciones de impuestos o si tiene activada la protección reforzada en su cuenta.",
          "Desde la página de bienvenida, añada una cuenta de empresa y elija registrar una empresa.",
          "Ingrese la información de los propietarios y de la empresa (vea la lista más abajo) y seleccione las cuentas de programa que quiere abrir.",
          "Guarde o imprima su BN y sus números de cuenta de programa al final de la sesión. La CRA indica que el BN no se le enviará.",
        ],
      },
      p("Se aplican algunos límites prácticos. Una sesión de BRO caduca tras 10 minutos de inactividad y no se puede guardar un registro parcial, por lo que conviene tener todo listo antes de empezar. BRO está disponible todos los días, excepto entre las 3 y las 6 de la mañana, hora del Este. No puede usarse para reactivar una cuenta de programa cerrada, registrar una empresa que pertenece a otra empresa (por ejemplo, una sociedad colectiva con un socio que es una sociedad), registrar una empresa cuyo propietario o director ha fallecido, ni registrar una empresa canadiense cuyos propietarios son todos no residentes. Los residentes de Ontario y Nueva Escocia pueden pasar directamente de BRO al sitio de registro provincial al terminar."),
      { type: "heading", id: "por-correo", text: "Por correo con el formulario RC1" },
      p("Si no puede completar el registro en línea, la CRA exige que envíe un formulario por correo. El formulario RC1, Request for a Business Number and Certain Program Accounts, permite registrarse para un BN junto con las cuentas de GST/HST, retenciones de nómina, impuesto sobre la renta de sociedades, organización benéfica registrada y declaraciones informativas en un solo formulario. Usted completa las secciones que necesita y envía el formulario a su centro fiscal. El RC1 no puede usarse para las cuentas del impuesto sobre viviendas subutilizadas ni del impuesto sobre bienes de lujo. El correo es más lento que BRO, por lo que la mayoría de los solicitantes solo lo usa cuando BRO no es una opción, por ejemplo cuando BRO no acepta su código postal."),
      {
        type: "callout",
        title: "Empresas ubicadas en Quebec",
        text: "Si una empresa está ubicada físicamente en Quebec, el GST/HST lo administra Revenu Québec, no la CRA. El registro del GST/HST y las declaraciones de esas empresas se hacen ante Revenu Québec, con sus formularios. El BN en sí sigue siendo un número de la CRA.",
      },
      { type: "heading", id: "informacion", text: "La información que debe tener lista" },
      p("La CRA publica una lista de lo que pueden pedirle al registrarse. Para la mayoría de las empresas incluye:"),
      {
        type: "list",
        items: [
          "El nombre, cargo y número de teléfono de cada propietario, y el número de seguro social de cada uno.",
          "El nombre legal de la empresa y cualquier nombre comercial.",
          "La dirección postal y la dirección física de la empresa.",
          "El tipo de empresa: empresa unipersonal, sociedad colectiva, sociedad, fideicomiso u otra forma.",
          "Una descripción de la actividad principal de la empresa, y los principales productos o servicios con un porcentaje estimado de ingresos para cada uno.",
          "Para una sociedad, la fecha de constitución, la jurisdicción y el número del certificado.",
          "Su BN existente, si ya tiene uno.",
        ],
      },
      p("Cada cuenta de programa tiene además sus propias preguntas. Un registro de GST/HST puede pedir las ventas gravables anuales mundiales y nacionales, la fecha de entrada en vigor del registro, el cierre del ejercicio y el período de declaración. Un registro de nómina puede pedir el número de empleados, los salarios anuales previstos, la fecha en que los empleados reciben su primer pago y la frecuencia de pago."),
      { type: "heading", id: "gst-hst", text: "El GST/HST y la regla del pequeño proveedor de 30 000 $" },
      p("Para la mayoría de las empresas, el GST/HST es la cuenta que primero genera la necesidad de un BN. Una empresa es un pequeño proveedor, y no tiene que registrarse, mientras sus suministros gravables no superen 30 000 $ en cuatro trimestres naturales consecutivos. Los pequeños proveedores pueden igualmente optar por registrarse de forma voluntaria. Una vez superado el umbral, el momento depende de cómo se supere:"),
      {
        type: "list",
        items: [
          "Si supera 30 000 $ en un solo trimestre natural, deja de ser pequeño proveedor de inmediato. Debe registrarse, la fecha de entrada en vigor de su registro es a más tardar el día del suministro que lo hizo superar 30 000 $, y cobra GST/HST sobre ese suministro.",
          "Si supera 30 000 $ en los cuatro (o menos) trimestres naturales consecutivos anteriores, pero no en un solo trimestre, deja de ser pequeño proveedor al final del mes siguiente al trimestre en que superó 30 000 $. La fecha de entrada en vigor de su registro es a más tardar el día de su primer suministro después de ese momento.",
        ],
      },
      p("Algunas empresas, como los conductores de taxi y de viajes compartidos, deben registrarse para el GST/HST sin importar el umbral. La ", L("guía para obtener un número de GST/HST en Ontario", "/guides/como-obtener-numero-gst-hst-ontario"), " explica ese registro con más detalle, y la guía sobre ", L("cómo verificar un número de GST/HST", "/guides/como-verificar-un-numero-gst-hst"), " explica cómo confirmar el número de un proveedor."),
      { type: "heading", id: "nomina", text: "La cuenta de nómina cuando contrata" },
      p("Un empleador, incluida una sociedad que paga un salario a su propietario-gerente, necesita una cuenta de retenciones de nómina (RP). La CRA exige el registro antes de la fecha de vencimiento de la primera remesa, que generalmente es el día 15 del mes siguiente a aquel en que comenzó a retener deducciones del pago de un empleado. Por ejemplo, si contrata a alguien el 11 de marzo y le paga el 25 de marzo, la primera remesa vence el 15 de abril. Registrarse tarde no aplaza la obligación: las deducciones deben calcularse y remitirse igualmente en la fecha de vencimiento, y pueden imponerse multas si no se hace. Los propietarios que deciden cómo pagarse suelen comparar el salario con los dividendos, como hace la guía ", L("salario o dividendos", "/guides/salario-o-dividendos"), "; un contador puede asesorar sobre la combinación adecuada para cada situación."),
      { type: "heading", id: "bn-o-numero-sociedad", text: "Número de negocio y números de sociedad" },
      p("Una sociedad termina con al menos dos números de dos gobiernos distintos, y no son intercambiables:"),
      {
        type: "table",
        head: ["Número", "Lo asigna", "Se usa para"],
        rows: [
          ["Número de negocio (BN)", "Agencia de Ingresos de Canadá", "Las cuentas fiscales federales (GST/HST, nómina, impuesto de sociedades) y muchos otros programas gubernamentales"],
          ["Número de sociedad federal", "Corporations Canada", "Identificar a una sociedad regida por la CBCA en declaraciones anuales, modificaciones y certificados"],
          ["Número de sociedad de Ontario", "Registro de Empresas de Ontario", "Identificar a una sociedad de Ontario en declaraciones anuales, avisos de cambio y otros trámites ante el registro"],
          ["Ontario Business Identification Number (BIN)", "Registro de Empresas de Ontario", "Identificar una empresa unipersonal, sociedad colectiva o nombre comercial registrado; no es un número de la CRA"],
        ],
      },
      p("El número de sociedad aparece en su certificado de constitución y es el que usa al presentar sus ", L("declaraciones anuales", "/guides/declaraciones-anuales-sociedades-canada"), " ante el registro. El BN es el que le pedirán la CRA, su banco y su proveedor de nómina. La comparación completa está en la guía ", L("número de negocio o número de sociedad", "/guides/numero-negocio-o-numero-sociedad"), "."),
      { type: "heading", id: "bn-perdido", text: "Cómo encontrar un número de negocio perdido" },
      p("Si sabe que tiene un BN pero no lo encuentra, la CRA sugiere probar estas opciones en orden:"),
      {
        type: "list",
        items: [
          "Revise sus registros: cartas o avisos de la CRA, y cualquier confirmación que haya guardado o impreso al final de una sesión de BRO.",
          "Inicie sesión en su cuenta de la CRA. Si ha añadido My Business Account, el BN aparece en la página de bienvenida. Si se registró a través de su provincia, la cuenta provincial en línea también puede mostrarlo.",
          "Busque en un registro de empresas en línea. Corporations Canada muestra el BN de las sociedades federales, el Registro de Empresas de Ontario cubre las empresas de Ontario (la información puede tardar dos días hábiles en aparecer después del registro, y algunos servicios pueden tener costo), y Canada's Business Registries cubre las sociedades federales y las de ciertas provincias.",
          "Llame a la línea de consultas de empresas de la CRA al 1-800-959-5525, de lunes a viernes, de 8 a. m. a 8 p. m., hora del Este. Es posible que deba confirmar datos que ingresó durante el registro.",
        ],
      },
      p("Tenga en cuenta que también puede haberse creado un BN si comenzó un registro en BRO y la sesión caducó. Antes de registrarse de nuevo, conviene verificar si esa sesión parcial le dejó un número, ya que una empresa solo puede tener uno."),
      { type: "heading", id: "despues", text: "Una vez que lo tiene" },
      p("Una vez que tiene su BN, póngalo en los documentos que lo requieren (facturas de GST/HST, remesas de nómina, declaraciones de sociedades) y guárdelo a la mano. Los bancos suelen pedirlo cuando usted ", L("abre una cuenta bancaria empresarial", "/guides/cuenta-bancaria-empresarial-canada"), ", y lo usará cada vez que trate con la CRA. Si más adelante la empresa cambia su propiedad legal o su estructura, consulte con la CRA si necesita un nuevo BN."),
      { type: "heading", id: "korporex", text: "Obtener un número de negocio con Korporex" },
      p("Cuando se ", L("constituye en sociedad con Korporex", "/incorporate"), ", a nivel federal o en Ontario, el número de negocio se asigna como parte de la constitución, y Korporex se lo entrega una vez completada la constitución. Ese BN es la base de cualquier cuenta de GST/HST, nómina u otra cuenta de programa que la sociedad abra después. Si necesita registrar un BN fuera de una constitución, por ejemplo para una ", L("empresa unipersonal", "/services/sole-proprietorship"), " existente, consulte el ", L("servicio de registro del número de negocio", "/services/business-number"), ". Korporex no es un despacho de abogados ni una firma contable; para saber qué cuentas fiscales necesita su empresa, consulte a un contador o abogado. Para una visión general del proceso, vea también la guía ", L("cómo constituirse en sociedad en Canadá", "/guides/como-constituirse-sociedad-canada"), "."),
    ],
    faq: [
      {
        q: "¿Cuánto tarda obtener un número de negocio de la CRA?",
        a: "El registro mediante Business Registration Online produce el BN al final de la sesión, y usted debe guardarlo o imprimirlo porque la CRA no se lo envía. Un formulario RC1 enviado por correo tarda más, ya que debe procesarlo el centro fiscal. Las sociedades constituidas a nivel federal o en Ontario reciben su BN a través de la propia constitución.",
      },
      {
        q: "¿Hay que pagar para obtener un número de negocio?",
        a: "La CRA no indica ninguna tarifa por registrar un número de negocio o cuentas de programa mediante BRO o el formulario RC1. El costo de constituirse es aparte: la tarifa gubernamental es de 200 $ para una constitución federal y de 300 $ para los estatutos de constitución de Ontario, y el BN se asigna como parte de ese proceso.",
      },
      {
        q: "¿Un empresario unipersonal necesita un número de negocio?",
        a: "Solo cuando se registra para una cuenta de programa de la CRA. Una empresa no constituida necesita un BN en cuanto se registra para el GST/HST, abre una cuenta de nómina o necesita otra cuenta de programa. Un empresario por debajo del umbral de pequeño proveedor de 30 000 $ y sin empleados quizá aún no lo necesite. El BIN de Ontario no es un BN.",
      },
      {
        q: "¿Puedo registrarme para un número de negocio por teléfono?",
        a: "La página de registro actual de la CRA presenta dos métodos para los residentes de Canadá: Business Registration Online, y el formulario RC1 enviado por correo a su centro fiscal cuando no puede registrarse en línea. La línea de consultas de empresas, al 1-800-959-5525, puede ayudarle a encontrar un BN existente o resolver problemas con un registro.",
      },
      {
        q: "¿Mi número de negocio es el mismo que mi número de GST/HST?",
        a: "No exactamente. El BN es la raíz de nueve dígitos. Su número de cuenta de GST/HST es el BN seguido de RT y un número de referencia de cuatro dígitos, como 123456789 RT 0001. Las cuentas de nómina e impuesto de sociedades usan los mismos nueve dígitos con RP y RC. Cuando le piden su número de GST/HST, se necesita el número de cuenta completo.",
      },
    ],
  },
};
