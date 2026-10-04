import type { ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

export const expanded: Record<"en" | "fr" | "es", ExpandedArticle> = {
  // ── English ──
  en: {
    readTime: "10 min read",
    content: [
      {
        type: "paragraph",
        text: "A corporate annual return is a short yearly filing that confirms a corporation's basic information with the registry that governs it. In Canada, federal corporations file with Corporations Canada within 60 days after the anniversary of their incorporation, for a $12 online fee. Ontario corporations file with the Ontario Business Registry within six months after the end of their fiscal year, and there is no government fee. The return is mandatory every year, even for a corporation with no activity, and failing to file can eventually lead to the corporation being dissolved.",
      },
      {
        type: "callout",
        title: "Not to be confused with",
        text: "An annual return is a corporate filing that confirms the corporation's information with the registry. It is not a tax return. The T2 Corporation Income Tax Return is filed separately with the Canada Revenue Agency. The two have different deadlines, different recipients, and different consequences for being missed.",
      },
      {
        type: "heading",
        id: "what-is-annual-return",
        text: "What an annual return is, and what it is not",
      },
      {
        type: "paragraph",
        text: "An annual return confirms that the information on file about the corporation (registered office address, directors, officers, and in some provinces shareholders) is still accurate. It is a corporate law obligation, not a tax one. For a federal corporation, the obligation comes from the Canada Business Corporations Act (CBCA). For an Ontario corporation, it comes from the Corporations Information Act. Every active corporation must file one each year, including a holding company that only holds investments and a corporation that earned no revenue at all.",
      },
      {
        type: "paragraph",
        text: "The annual return is not the T2 Corporation Income Tax Return. The T2 reports the corporation's income and calculates its tax, and it goes to the Canada Revenue Agency, generally within six months after the end of the tax year. The annual return goes to the corporate registry and says nothing about income. Filing one does not satisfy the other. A corporation can be fully up to date with the CRA and still be at risk of dissolution because its annual returns are overdue, and the reverse is also true.",
      },
      {
        type: "paragraph",
        text: "The annual return is also not the same thing as your annual resolutions. The return tells the government that the corporation still exists and that its public information is correct. Annual resolutions are internal decisions of the directors and shareholders, such as approving the financial statements and electing directors, and they are kept in the corporate minute book rather than filed with the registry. A well-maintained corporation does both every year.",
        parts: [
          "The annual return is also not the same thing as your annual resolutions. The return tells the government that the corporation still exists and that its public information is correct. Annual resolutions are internal decisions of the directors and shareholders, such as approving the financial statements and electing directors, and they are kept in the ",
          { text: "corporate minute book", href: "/guides/corporate-minute-book" },
          " rather than filed with the registry. A well-maintained corporation does both every year.",
        ],
      },
      {
        type: "heading",
        id: "federal",
        text: "Federal corporations: the CBCA annual return",
      },
      {
        type: "paragraph",
        text: "A corporation incorporated under the CBCA files its annual return with Corporations Canada, online through the Online Filing Centre. The return is due within the 60 days following the corporation's anniversary date. The anniversary date is the month and day on which the corporation was incorporated, amalgamated or continued under the CBCA. For example, a corporation incorporated on March 10 files each year in the 60 days that follow March 10, so its window closes in early May.",
      },
      {
        type: "list",
        items: [
          "Filed with: Corporations Canada, through the Online Filing Centre.",
          "Due: within 60 days following the anniversary of incorporation, amalgamation or continuance.",
          "Government fee: $12 when filed online.",
          "Filed at the same time: information on the corporation's individuals with significant control (ISC).",
          "Access: the person filing needs access to the corporation's online account, usually through its corporation key.",
        ],
      },
      {
        type: "paragraph",
        text: "You cannot file the federal return early. Corporations Canada requires the information to reflect the corporation's situation on its anniversary date, so the filing window opens on the anniversary itself. Before you start, have two facts ready: the date of the corporation's last annual meeting of shareholders (or the written resolutions signed in place of a meeting) and whether the corporation is distributing or non-distributing. Almost every small private corporation is non-distributing.",
      },
      {
        type: "paragraph",
        text: "Since January 22, 2024, CBCA corporations must also file information about their individuals with significant control at the same time as the annual return. This information comes from the register of individuals with significant control that federal corporations are already required to keep, so an up-to-date register makes the filing quick.",
      },
      {
        type: "paragraph",
        text: "The annual return is not the place to report a new director or a move. A change in the board of directors, or in a director's address, must be reported to Corporations Canada within 15 days (Form 6), and a change of registered office address must also be reported within 15 days (Form 3). If those notices are current, the annual return is usually a matter of confirming what is already on file. You can file the federal annual return yourself or have Korporex prepare and submit your federal annual return for you.",
        parts: [
          "The annual return is not the place to report a new director or a move. A change in the board of directors, or in a director's address, must be reported to Corporations Canada within 15 days (Form 6), and a change of registered office address must also be reported within 15 days (Form 3). If those notices are current, the annual return is usually a matter of confirming what is already on file. You can file the federal annual return yourself or have Korporex ",
          { text: "prepare and submit your federal annual return", href: "/services/annual-return-federal" },
          " for you.",
        ],
      },
      {
        type: "heading",
        id: "ontario",
        text: "Ontario corporations: the Corporations Information Act annual return",
      },
      {
        type: "paragraph",
        text: "Corporations incorporated under the Ontario Business Corporations Act file an annual return under the Corporations Information Act. Since October 2021, the return is filed directly with the ministry through the Ontario Business Registry. Before that, most Ontario corporations filed it together with their T2 through the CRA. The CRA stopped accepting Ontario annual returns for returns due after October 18, 2021, so filing your T2 no longer takes care of it. This is the single most common reason Ontario corporations fall behind: owners who relied on their accountant's tax filing assume the annual return is still included, and it is not.",
      },
      {
        type: "list",
        items: [
          "Filed with: the Ontario ministry, through the Ontario Business Registry.",
          "Due: within six months after the end of the corporation's fiscal year.",
          "Government fee: none. The return is free to file, but it is still mandatory.",
          "Access: every filing in the Ontario Business Registry requires the corporation's company key, a 9-digit code unique to the business.",
          "Non-filing can lead to cancellation of the corporation's certificate of incorporation, which dissolves the corporation.",
        ],
      },
      {
        type: "paragraph",
        text: "Because the Ontario deadline runs from the fiscal year-end rather than the incorporation anniversary, a corporation with a December 31 year-end has until June 30 of the following year. The return confirms the corporation's information on the public record, such as its registered office address and its directors and officers. Keep the official email address on the registry current as well, since that is where the ministry sends its notices. As with federal corporations, changes are meant to be reported as they happen: in Ontario, a notice of change is due within 15 days of the change.",
        parts: [
          "Because the Ontario deadline runs from the fiscal year-end rather than the incorporation anniversary, a corporation with a December 31 year-end has until June 30 of the following year. The return confirms the corporation's information on the public record, such as its registered office address and its directors and officers. Keep the official email address on the registry current as well, since that is where the ministry sends its notices. As with federal corporations, changes are meant to be reported as they happen: in Ontario, a ",
          { text: "notice of change", href: "/services/notice-of-change" },
          " is due within 15 days of the change.",
        ],
      },
      {
        type: "paragraph",
        text: "The annual return is separate from the initial return that a new Ontario corporation files within 60 days after incorporating. If you incorporated recently, file the Ontario initial return first, and the annual return follows after your first fiscal year-end. Korporex can file your Ontario annual return through the Ontario Business Registry. For the full picture of starting a corporation in the province, see our guide to incorporating in Ontario.",
        parts: [
          "The annual return is separate from the initial return that a new Ontario corporation files within 60 days after incorporating. If you incorporated recently, file the ",
          { text: "Ontario initial return", href: "/services/initial-return-on" },
          " first, and the annual return follows after your first fiscal year-end. Korporex can file your ",
          { text: "Ontario annual return", href: "/services/annual-return-on" },
          " through the Ontario Business Registry. For the full picture of starting a corporation in the province, see our guide to ",
          { text: "incorporating in Ontario", href: "/guides/incorporating-in-ontario" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "federal-vs-ontario",
        text: "Federal and Ontario annual returns compared",
      },
      {
        type: "table",
        head: ["", "Federal (CBCA)", "Ontario (OBCA)"],
        rows: [
          ["Law requiring it", "Canada Business Corporations Act", "Corporations Information Act"],
          ["Filed with", "Corporations Canada, Online Filing Centre", "Ontario Business Registry"],
          ["Deadline", "Within 60 days after the anniversary date", "Within six months after the fiscal year-end"],
          ["Deadline based on", "Date of incorporation, amalgamation or continuance", "The corporation's fiscal year-end"],
          ["Government fee (online)", "$12", "No fee"],
          ["Filed with it", "Individuals with significant control information", "Not applicable"],
          ["Credential needed", "Corporation key", "Company key"],
          ["If it is not filed", "Status shows as overdue; dissolution possible after a final notice", "Notice of default, then cancellation and dissolution"],
        ],
      },
      {
        type: "paragraph",
        text: "Whether a corporation is federal or provincial is decided at incorporation, and it determines which of these two regimes applies for the life of the corporation. If you are still choosing, our guide to federal versus provincial incorporation compares the two routes. Your corporation number, which you use to look up and file for the corporation, is also different from the business number the CRA assigns.",
        parts: [
          "Whether a corporation is federal or provincial is decided at incorporation, and it determines which of these two regimes applies for the life of the corporation. If you are still choosing, our guide to ",
          { text: "federal versus provincial incorporation", href: "/guides/federal-vs-provincial-incorporation" },
          " compares the two routes. Your corporation number, which you use to look up and file for the corporation, is also different from the ",
          { text: "business number the CRA assigns", href: "/guides/business-number-vs-corporation-number" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "other-provinces",
        text: "Other provinces in brief",
      },
      {
        type: "paragraph",
        text: "Every province has its own version of the annual filing, with its own name and deadline. A few examples:",
      },
      {
        type: "list",
        items: [
          "British Columbia: a BC company files an annual report within two months after its anniversary date. The registrar may dissolve a company that fails to file in each of two consecutive years.",
          "Alberta: a corporation files an annual return with the Corporate Registry no later than the last day of the month after its anniversary month. A corporation that does not file may be dissolved.",
          "Quebec: every registered enterprise files an annual updating declaration with the Registraire des entreprises, whether or not anything has changed. Failing to file two consecutive declarations can lead to the registration being cancelled.",
        ],
      },
      {
        type: "paragraph",
        text: "If your corporation is registered extra-provincially in another province, check that province's rules too. Some provinces require an annual filing from extra-provincial corporations as well as from their own. British Columbia, for instance, has a separate annual report for extraprovincial companies.",
      },
      {
        type: "heading",
        id: "consequences",
        text: "What happens if you miss a filing",
      },
      {
        type: "paragraph",
        text: "Federally, the consequences build in stages. As soon as the 60-day window passes, the corporation's annual filings show as overdue in Corporations Canada's public database, which anyone can search. While the filings are overdue, the corporation cannot obtain a certificate of compliance, the document banks, lenders and buyers often ask for. The CBCA allows Corporations Canada to dissolve a corporation after one year of non-filing. Its current policy is to dissolve only after two years without a return, and before doing so it sends a final notice that gives the corporation an additional 120 days to file.",
      },
      {
        type: "paragraph",
        text: "In Ontario, section 241 of the Business Corporations Act allows a corporation to be dissolved when it fails to comply with a filing requirement under the Corporations Information Act. Notices go to the registered office address on the public record, and a notice of default may be published in The Ontario Gazette. If the corporation does not come into compliance, its certificate of incorporation is cancelled and the corporation is dissolved.",
      },
      {
        type: "paragraph",
        text: "Dissolution is serious. A dissolved corporation no longer exists as a legal entity. Its name can become available to others, its contracts and property rights enter a legal grey zone, and the people who keep doing business in its name can face personal exposure. A voluntary dissolution is a separate, deliberate process, described in our guide on how to dissolve a corporation in Ontario; dissolution for default is the result of missed filings, even ones that are free or cost $12.",
        parts: [
          "Dissolution is serious. A dissolved corporation no longer exists as a legal entity. Its name can become available to others, its contracts and property rights enter a legal grey zone, and the people who keep doing business in its name can face personal exposure. A voluntary dissolution is a separate, deliberate process, described in our guide on ",
          { text: "how to dissolve a corporation in Ontario", href: "/guides/how-to-dissolve-a-corporation-in-ontario" },
          "; dissolution for default is the result of missed filings, even ones that are free or cost $12.",
        ],
      },
      {
        type: "heading",
        id: "how-to-fix",
        text: "How to fix a missed annual return",
      },
      {
        type: "paragraph",
        text: "If the corporation has not yet been dissolved, the fix is simple: file every overdue return as soon as possible. Federally, each overdue year is filed with its own fee, and the status returns to normal once the filings are complete. In Ontario, the overdue returns are filed through the Ontario Business Registry. If you have received a notice warning of dissolution, act within the period it gives you, and do not assume a missed notice means no deadline: notices go to the address on the public record, which is one more reason to keep that address current.",
      },
      {
        type: "paragraph",
        text: "If the corporation has already been dissolved, it can usually be revived. Federally, any interested person, such as a shareholder, director or creditor, may apply for revival by filing Articles of Revival (Form 15) with a non-refundable government fee. Once revived, the corporation must file its annual returns for the two most current years, and its rights and obligations are restored as if it had not been dissolved. In Ontario, a corporation dissolved under section 241 may be revived on the application of any interested person, as long as no more than 20 years have passed since the dissolution, and the outstanding filings must be brought up to date. Korporex can prepare and file a revival with either registry.",
        parts: [
          "If the corporation has already been dissolved, it can usually be revived. Federally, any interested person, such as a shareholder, director or creditor, may apply for revival by filing Articles of Revival (Form 15) with a non-refundable government fee. Once revived, the corporation must file its annual returns for the two most current years, and its rights and obligations are restored as if it had not been dissolved. In Ontario, a corporation dissolved under section 241 may be revived on the application of any interested person, as long as no more than 20 years have passed since the dissolution, and the outstanding filings must be brought up to date. Korporex can ",
          { text: "prepare and file a revival", href: "/services/revive-business" },
          " with either registry.",
        ],
      },
      {
        type: "heading",
        id: "annual-resolutions",
        text: "The annual return and your minute book",
      },
      {
        type: "paragraph",
        text: "The annual return is the public half of yearly compliance. The private half is the annual business of the corporation, recorded in its minute book. Under the CBCA, the directors must call an annual meeting of shareholders no later than 15 months after the last one and no later than six months after the end of the financial year. Ontario corporations also hold an annual meeting each year. In a closely held corporation, the meeting is usually replaced by written resolutions signed by all shareholders entitled to vote, which have the same effect.",
      },
      {
        type: "paragraph",
        text: "Those annual resolutions typically approve the financial statements, elect or confirm the directors, deal with the appointment of an auditor or the shareholders' consent to waive one, and confirm the officers. The date of that meeting or those resolutions is one of the facts the federal annual return asks for, so preparing the annual resolutions first makes the return easier. Korporex prepares federal annual resolutions and Ontario annual resolutions for the minute book.",
        parts: [
          "Those annual resolutions typically approve the financial statements, elect or confirm the directors, deal with the appointment of an auditor or the shareholders' consent to waive one, and confirm the officers. The date of that meeting or those resolutions is one of the facts the federal annual return asks for, so preparing the annual resolutions first makes the return easier. Korporex prepares ",
          { text: "federal annual resolutions", href: "/services/annual-resolution-federal" },
          " and ",
          { text: "Ontario annual resolutions", href: "/services/annual-resolution-on" },
          " for the minute book.",
        ],
      },
      {
        type: "heading",
        id: "stay-on-top",
        text: "Staying on top of it: a yearly compliance calendar",
      },
      {
        type: "paragraph",
        text: "The most reliable approach is to put every recurring deadline in a calendar with a reminder 30 days in advance, and to keep a short checklist of whose information might have changed during the year: directors, officers, registered office, and for federal corporations, individuals with significant control. Filing the return itself usually takes less than ten minutes once you have those details in hand.",
      },
      {
        type: "list",
        items: [
          "Within 60 days after incorporation (Ontario corporations): file the initial return.",
          "Every year, within 60 days after the anniversary date (federal corporations): file the annual return and ISC information with Corporations Canada.",
          "Every year, within six months after the fiscal year-end (Ontario corporations): file the annual return through the Ontario Business Registry.",
          "Every year, generally within six months after the tax year-end: file the T2 with the CRA, separately from the annual return.",
          "Every year: hold the annual meeting or sign annual resolutions, and add them to the minute book.",
          "Within 15 days of any change: report new or departing directors, director address changes and registered office moves to the registry.",
          "Throughout the year (federal corporations): keep the register of individuals with significant control up to date.",
        ],
      },
      {
        type: "paragraph",
        text: "If a deadline does slip, file the overdue return as soon as you notice. A late return filed before the registry starts the dissolution process is a minor administrative matter. A return that stays missing for years is what turns a routine filing into a revival application.",
      },
    ],
    faq: [
      {
        q: "Is a corporate annual return the same as a corporate tax return?",
        a: "No. The annual return is a corporate law filing that confirms the corporation's information with its registry: Corporations Canada for federal corporations, the Ontario Business Registry for Ontario corporations. The T2 Corporation Income Tax Return is a separate filing with the Canada Revenue Agency. Filing your T2 does not file your annual return, and since October 2021 that is also true in Ontario.",
      },
      {
        q: "Does my corporation need to file an annual return if it had no activity?",
        a: "Yes. The obligation applies to every active corporation, whether or not it earned revenue, had employees, or changed anything during the year. A dormant holding company or a corporation that has not started operating still files. The only way to end the obligation is to dissolve the corporation properly, which is itself a formal filing with the registry.",
      },
      {
        q: "How much does it cost to file an annual return in Canada?",
        a: "The federal government fee for a CBCA annual return is $12 when filed online with Corporations Canada. Ontario charges no government fee for the Corporations Information Act annual return filed through the Ontario Business Registry. Other provinces set their own fees. If a service provider files for you, its service fee is charged on top of any government fee.",
      },
      {
        q: "Can I file my federal annual return before the anniversary date?",
        a: "No. Corporations Canada requires the information on the annual return to reflect the corporation's situation on its anniversary date, so the filing window opens on the anniversary of incorporation, amalgamation or continuance and stays open for the 60 days that follow. If you try to file earlier, the return for that year is not yet available.",
      },
      {
        q: "What should I do if I have missed several years of annual returns?",
        a: "Check the corporation's status on the public registry first. If it is still active, file every overdue return right away. If it has been dissolved, it will need to be revived: federally through Articles of Revival followed by the two most current annual returns, and in Ontario through an application for revival with the outstanding filings brought up to date.",
      },
      {
        q: "Where do I find my anniversary date or fiscal year-end?",
        a: "The anniversary date is the date on your certificate of incorporation, amalgamation or continuance, and it also appears when you search the corporation in Corporations Canada's federal corporation database. The fiscal year-end is chosen by the corporation and appears on its financial statements and its T2 filings. Your accountant can confirm it if you are unsure.",
      },
    ],
  },

  // ── French ──
  fr: {
    readTime: "11 min de lecture",
    content: [
      {
        type: "paragraph",
        text: "La déclaration annuelle d'une société est un court dépôt annuel qui confirme les renseignements de base de la société auprès du registre qui la régit. Au Canada, les sociétés fédérales produisent leur déclaration auprès de Corporations Canada dans les 60 jours suivant l'anniversaire de leur constitution, moyennant des frais de 12 $ en ligne. Les sociétés ontariennes la produisent par l'entremise du Registre des entreprises de l'Ontario dans les six mois suivant la fin de leur exercice, sans frais gouvernementaux. La déclaration est obligatoire chaque année, même pour une société sans activité, et le défaut de la produire peut finir par entraîner la dissolution de la société.",
      },
      {
        type: "callout",
        title: "À ne pas confondre avec",
        text: "Une déclaration annuelle est un dépôt qui confirme les renseignements de la société auprès du registre. Ce n'est pas une déclaration de revenus. La déclaration de revenus des sociétés T2 se produit séparément auprès de l'Agence du revenu du Canada. Les deux ont des échéances différentes, des destinataires différents et des conséquences différentes en cas de défaut.",
      },
      {
        type: "heading",
        id: "ce-quest",
        text: "Ce qu'est une déclaration annuelle, et ce qu'elle n'est pas",
      },
      {
        type: "paragraph",
        text: "Une déclaration annuelle confirme que les renseignements au dossier de la société (adresse du siège social, administrateurs, dirigeants et, dans certaines provinces, actionnaires) sont toujours exacts. Il s'agit d'une obligation de droit des sociétés, et non d'une obligation fiscale. Pour une société fédérale, elle découle de la Loi canadienne sur les sociétés par actions (LCSA). Pour une société ontarienne, elle découle de la Loi sur les renseignements exigés des personnes morales. Toute société active doit en produire une chaque année, y compris une société de portefeuille qui ne fait que détenir des placements et une société qui n'a gagné aucun revenu.",
      },
      {
        type: "paragraph",
        text: "La déclaration annuelle n'est pas la déclaration de revenus des sociétés T2. La T2 déclare le revenu de la société et calcule son impôt; elle est transmise à l'Agence du revenu du Canada, généralement dans les six mois suivant la fin de l'année d'imposition. La déclaration annuelle est transmise au registre des sociétés et ne dit rien du revenu. Produire l'une ne remplace pas l'autre. Une société peut être parfaitement à jour auprès de l'ARC et risquer quand même la dissolution parce que ses déclarations annuelles sont en retard, et l'inverse est aussi vrai.",
      },
      {
        type: "paragraph",
        text: "La déclaration annuelle n'est pas non plus la même chose que vos résolutions annuelles. La déclaration informe le gouvernement que la société existe toujours et que ses renseignements publics sont exacts. Les résolutions annuelles sont des décisions internes des administrateurs et des actionnaires, comme l'approbation des états financiers et l'élection des administrateurs; elles sont conservées dans le livre des procès-verbaux plutôt que déposées au registre. Une société bien tenue fait les deux chaque année.",
        parts: [
          "La déclaration annuelle n'est pas non plus la même chose que vos résolutions annuelles. La déclaration informe le gouvernement que la société existe toujours et que ses renseignements publics sont exacts. Les résolutions annuelles sont des décisions internes des administrateurs et des actionnaires, comme l'approbation des états financiers et l'élection des administrateurs; elles sont conservées dans le ",
          { text: "livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
          " plutôt que déposées au registre. Une société bien tenue fait les deux chaque année.",
        ],
      },
      {
        type: "heading",
        id: "federal",
        text: "Les sociétés fédérales : la déclaration annuelle sous la LCSA",
      },
      {
        type: "paragraph",
        text: "Une société constituée sous la LCSA produit sa déclaration annuelle auprès de Corporations Canada, en ligne par le Centre de dépôt en ligne. La déclaration est exigible dans les 60 jours suivant la date anniversaire de la société, soit le mois et le jour où elle a été constituée, fusionnée ou prorogée sous le régime de la LCSA. Par exemple, une société constituée le 10 mars produit sa déclaration chaque année dans les 60 jours qui suivent le 10 mars; son délai se termine donc au début de mai.",
      },
      {
        type: "list",
        items: [
          "Produite auprès de : Corporations Canada, par le Centre de dépôt en ligne.",
          "Échéance : dans les 60 jours suivant l'anniversaire de la constitution, de la fusion ou de la prorogation.",
          "Frais gouvernementaux : 12 $ en ligne.",
          "Produits en même temps : les renseignements sur les particuliers ayant un contrôle important (PCI) de la société.",
          "Accès : la personne qui produit la déclaration doit avoir accès au compte en ligne de la société, habituellement au moyen de sa clé de société.",
        ],
      },
      {
        type: "paragraph",
        text: "Vous ne pouvez pas produire la déclaration fédérale à l'avance. Corporations Canada exige que les renseignements reflètent la situation de la société à sa date anniversaire; la période de dépôt s'ouvre donc le jour même de l'anniversaire. Avant de commencer, ayez deux renseignements en main : la date de la dernière assemblée annuelle des actionnaires (ou des résolutions écrites signées au lieu d'une assemblée) et le fait que la société soit ou non une société ayant fait appel au public. La quasi-totalité des petites sociétés fermées n'ont pas fait appel au public.",
      },
      {
        type: "paragraph",
        text: "Depuis le 22 janvier 2024, les sociétés régies par la LCSA doivent aussi déposer les renseignements sur leurs particuliers ayant un contrôle important en même temps que la déclaration annuelle. Ces renseignements proviennent du registre des particuliers ayant un contrôle important que les sociétés fédérales sont déjà tenues de tenir; un registre à jour rend donc le dépôt rapide.",
      },
      {
        type: "paragraph",
        text: "La déclaration annuelle n'est pas l'endroit pour signaler un nouvel administrateur ou un déménagement. Un changement au conseil d'administration, ou à l'adresse d'un administrateur, doit être signalé à Corporations Canada dans les 15 jours (formulaire 6), et un changement d'adresse du siège social doit aussi être signalé dans les 15 jours (formulaire 3). Si ces avis sont à jour, la déclaration annuelle consiste habituellement à confirmer ce qui figure déjà au dossier. Vous pouvez produire la déclaration annuelle fédérale vous-même ou confier à Korporex le soin de préparer et déposer votre déclaration annuelle fédérale.",
        parts: [
          "La déclaration annuelle n'est pas l'endroit pour signaler un nouvel administrateur ou un déménagement. Un changement au conseil d'administration, ou à l'adresse d'un administrateur, doit être signalé à Corporations Canada dans les 15 jours (formulaire 6), et un changement d'adresse du siège social doit aussi être signalé dans les 15 jours (formulaire 3). Si ces avis sont à jour, la déclaration annuelle consiste habituellement à confirmer ce qui figure déjà au dossier. Vous pouvez produire la déclaration annuelle fédérale vous-même ou confier à Korporex le soin de ",
          { text: "préparer et déposer votre déclaration annuelle fédérale", href: "/services/annual-return-federal" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "ontario",
        text: "Les sociétés ontariennes : la déclaration annuelle sous la Loi sur les renseignements exigés des personnes morales",
      },
      {
        type: "paragraph",
        text: "Les sociétés constituées sous la Loi sur les sociétés par actions de l'Ontario produisent une déclaration annuelle en vertu de la Loi sur les renseignements exigés des personnes morales. Depuis octobre 2021, la déclaration se produit directement auprès du ministère par l'entremise du Registre des entreprises de l'Ontario. Auparavant, la plupart des sociétés ontariennes la produisaient avec leur T2 par l'intermédiaire de l'ARC. L'ARC a cessé d'accepter les déclarations annuelles ontariennes pour celles exigibles après le 18 octobre 2021; produire votre T2 ne règle donc plus la question. C'est la raison la plus fréquente pour laquelle les sociétés ontariennes prennent du retard : les propriétaires qui comptaient sur la déclaration fiscale de leur comptable croient que la déclaration annuelle y est toujours incluse, alors qu'elle ne l'est plus.",
      },
      {
        type: "list",
        items: [
          "Produite auprès de : le ministère ontarien, par l'entremise du Registre des entreprises de l'Ontario.",
          "Échéance : dans les six mois suivant la fin de l'exercice de la société.",
          "Frais gouvernementaux : aucuns. Le dépôt est gratuit, mais il demeure obligatoire.",
          "Accès : toute opération au Registre des entreprises de l'Ontario exige la clé d'entreprise de la société, un code de 9 chiffres propre à l'entreprise.",
          "Le défaut de produire peut entraîner l'annulation du certificat de constitution de la société, ce qui la dissout.",
        ],
      },
      {
        type: "paragraph",
        text: "Comme l'échéance ontarienne court à partir de la fin de l'exercice plutôt que de l'anniversaire de constitution, une société dont l'exercice se termine le 31 décembre a jusqu'au 30 juin de l'année suivante. La déclaration confirme les renseignements de la société au dossier public, comme l'adresse de son siège social, ses administrateurs et ses dirigeants. Gardez aussi à jour l'adresse courriel officielle inscrite au registre, puisque c'est là que le ministère envoie ses avis. Comme pour les sociétés fédérales, les changements doivent être signalés au fur et à mesure : en Ontario, un avis de modification est exigible dans les 15 jours suivant le changement.",
        parts: [
          "Comme l'échéance ontarienne court à partir de la fin de l'exercice plutôt que de l'anniversaire de constitution, une société dont l'exercice se termine le 31 décembre a jusqu'au 30 juin de l'année suivante. La déclaration confirme les renseignements de la société au dossier public, comme l'adresse de son siège social, ses administrateurs et ses dirigeants. Gardez aussi à jour l'adresse courriel officielle inscrite au registre, puisque c'est là que le ministère envoie ses avis. Comme pour les sociétés fédérales, les changements doivent être signalés au fur et à mesure : en Ontario, un ",
          { text: "avis de modification", href: "/services/notice-of-change" },
          " est exigible dans les 15 jours suivant le changement.",
        ],
      },
      {
        type: "paragraph",
        text: "La déclaration annuelle est distincte de la déclaration initiale qu'une nouvelle société ontarienne produit dans les 60 jours suivant sa constitution. Si vous venez de vous constituer, produisez d'abord la déclaration initiale de l'Ontario; la déclaration annuelle suivra après la fin de votre premier exercice. Korporex peut produire votre déclaration annuelle de l'Ontario par l'entremise du Registre des entreprises de l'Ontario. Pour le portrait complet du démarrage d'une société dans la province, consultez notre guide sur la constitution en société en Ontario.",
        parts: [
          "La déclaration annuelle est distincte de la déclaration initiale qu'une nouvelle société ontarienne produit dans les 60 jours suivant sa constitution. Si vous venez de vous constituer, produisez d'abord la ",
          { text: "déclaration initiale de l'Ontario", href: "/services/initial-return-on" },
          "; la déclaration annuelle suivra après la fin de votre premier exercice. Korporex peut produire votre ",
          { text: "déclaration annuelle de l'Ontario", href: "/services/annual-return-on" },
          " par l'entremise du Registre des entreprises de l'Ontario. Pour le portrait complet du démarrage d'une société dans la province, consultez notre guide sur la ",
          { text: "constitution en société en Ontario", href: "/guides/se-constituer-en-societe-en-ontario" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "federal-ou-ontario",
        text: "Les déclarations annuelles fédérale et ontarienne comparées",
      },
      {
        type: "table",
        head: ["", "Fédéral (LCSA)", "Ontario (LSAO)"],
        rows: [
          ["Loi applicable", "Loi canadienne sur les sociétés par actions", "Loi sur les renseignements exigés des personnes morales"],
          ["Produite auprès de", "Corporations Canada, Centre de dépôt en ligne", "Registre des entreprises de l'Ontario"],
          ["Échéance", "Dans les 60 jours suivant la date anniversaire", "Dans les six mois suivant la fin de l'exercice"],
          ["Échéance fondée sur", "La date de constitution, de fusion ou de prorogation", "La fin de l'exercice de la société"],
          ["Frais gouvernementaux (en ligne)", "12 $", "Aucuns frais"],
          ["Produits avec la déclaration", "Renseignements sur les particuliers ayant un contrôle important", "Sans objet"],
          ["Identifiant requis", "Clé de société", "Clé d'entreprise"],
          ["En cas de défaut", "Statut « en retard »; dissolution possible après un dernier avis", "Avis de défaut, puis annulation et dissolution"],
        ],
      },
      {
        type: "paragraph",
        text: "Le choix entre une société fédérale ou provinciale se fait à la constitution, et il détermine lequel de ces deux régimes s'applique pendant toute la vie de la société. Votre numéro de société, qui sert à rechercher la société et à faire ses dépôts, est par ailleurs différent du numéro d'entreprise attribué par l'ARC.",
        parts: [
          "Le choix entre une société fédérale ou provinciale se fait à la constitution, et il détermine lequel de ces deux régimes s'applique pendant toute la vie de la société. Votre numéro de société, qui sert à rechercher la société et à faire ses dépôts, est par ailleurs différent du ",
          { text: "numéro d'entreprise attribué par l'ARC", href: "/guides/numero-entreprise-ou-numero-societe" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "autres-provinces",
        text: "Les autres provinces en bref",
      },
      {
        type: "paragraph",
        text: "Chaque province a sa propre version du dépôt annuel, avec son propre nom et sa propre échéance. Quelques exemples :",
      },
      {
        type: "list",
        items: [
          "Colombie-Britannique : une société de la Colombie-Britannique produit un rapport annuel dans les deux mois suivant sa date anniversaire. Le registraire peut dissoudre une société qui omet de le produire deux années consécutives.",
          "Alberta : une société produit une déclaration annuelle auprès du Corporate Registry au plus tard le dernier jour du mois qui suit son mois anniversaire. Une société qui ne la produit pas peut être dissoute.",
          "Québec : toute entreprise immatriculée produit une déclaration de mise à jour annuelle auprès du Registraire des entreprises, qu'il y ait eu des changements ou non. L'omission de produire deux déclarations consécutives peut entraîner la radiation de l'immatriculation.",
        ],
      },
      {
        type: "paragraph",
        text: "Si votre société est enregistrée à titre extraprovincial dans une autre province, vérifiez aussi les règles de cette province. Certaines provinces exigent un dépôt annuel des sociétés extraprovinciales en plus des leurs. La Colombie-Britannique, par exemple, prévoit un rapport annuel distinct pour les sociétés extraprovinciales.",
      },
      {
        type: "heading",
        id: "consequences",
        text: "Ce qui arrive en cas de défaut",
      },
      {
        type: "paragraph",
        text: "Au fédéral, les conséquences s'accumulent par étapes. Dès que le délai de 60 jours est écoulé, les dépôts annuels de la société apparaissent « en retard » dans la base de données publique de Corporations Canada, que tout le monde peut consulter. Tant que les dépôts sont en retard, la société ne peut pas obtenir de certificat de conformité, document que les banques, les prêteurs et les acheteurs demandent souvent. La LCSA permet à Corporations Canada de dissoudre une société après un an sans dépôt. Sa politique actuelle est de ne dissoudre qu'après deux ans sans déclaration, et elle envoie auparavant un dernier avis qui accorde à la société 120 jours supplémentaires pour produire ses déclarations.",
      },
      {
        type: "paragraph",
        text: "En Ontario, l'article 241 de la Loi sur les sociétés par actions permet de dissoudre une société qui ne se conforme pas à une exigence de dépôt prévue par la Loi sur les renseignements exigés des personnes morales. Les avis sont envoyés à l'adresse du siège social inscrite au dossier public, et un avis de défaut peut être publié dans la Gazette de l'Ontario. Si la société ne se met pas en conformité, son certificat de constitution est annulé et la société est dissoute.",
      },
      {
        type: "paragraph",
        text: "La dissolution est grave. Une société dissoute n'existe plus comme entité juridique. Son nom peut redevenir disponible pour d'autres, ses contrats et droits de propriété entrent dans une zone grise juridique, et les personnes qui continuent de faire affaire en son nom peuvent s'exposer personnellement. La dissolution volontaire est un processus distinct et délibéré, décrit dans notre guide sur la façon de dissoudre une société en Ontario; la dissolution pour défaut résulte de dépôts manqués, même gratuits ou à 12 $.",
        parts: [
          "La dissolution est grave. Une société dissoute n'existe plus comme entité juridique. Son nom peut redevenir disponible pour d'autres, ses contrats et droits de propriété entrent dans une zone grise juridique, et les personnes qui continuent de faire affaire en son nom peuvent s'exposer personnellement. La dissolution volontaire est un processus distinct et délibéré, décrit dans notre guide sur la façon de ",
          { text: "dissoudre une société en Ontario", href: "/guides/comment-dissoudre-une-societe-en-ontario" },
          "; la dissolution pour défaut résulte de dépôts manqués, même gratuits ou à 12 $.",
        ],
      },
      {
        type: "heading",
        id: "corriger-un-defaut",
        text: "Comment corriger une déclaration annuelle manquée",
      },
      {
        type: "paragraph",
        text: "Si la société n'a pas encore été dissoute, la solution est simple : produisez toutes les déclarations en retard le plus tôt possible. Au fédéral, chaque année en retard se produit avec ses propres frais, et le statut redevient normal une fois les dépôts terminés. En Ontario, les déclarations en retard se produisent par l'entremise du Registre des entreprises de l'Ontario. Si vous avez reçu un avis vous prévenant d'une dissolution, agissez dans le délai qu'il indique, et ne présumez pas qu'un avis non reçu signifie l'absence d'échéance : les avis sont envoyés à l'adresse inscrite au dossier public, une raison de plus de la garder à jour.",
      },
      {
        type: "paragraph",
        text: "Si la société a déjà été dissoute, elle peut habituellement être reconstituée. Au fédéral, tout intéressé, comme un actionnaire, un administrateur ou un créancier, peut demander la reconstitution en déposant des clauses de reconstitution (formulaire 15) avec des frais gouvernementaux non remboursables. Une fois reconstituée, la société doit produire ses déclarations annuelles pour les deux années les plus récentes, et ses droits et obligations sont rétablis comme si elle n'avait pas été dissoute. En Ontario, une société dissoute en vertu de l'article 241 peut être reconstituée à la demande de tout intéressé, pourvu que 20 ans au plus se soient écoulés depuis la dissolution, et les dépôts en souffrance doivent être mis à jour. Korporex peut préparer et déposer une reconstitution auprès de l'un ou l'autre registre.",
        parts: [
          "Si la société a déjà été dissoute, elle peut habituellement être reconstituée. Au fédéral, tout intéressé, comme un actionnaire, un administrateur ou un créancier, peut demander la reconstitution en déposant des clauses de reconstitution (formulaire 15) avec des frais gouvernementaux non remboursables. Une fois reconstituée, la société doit produire ses déclarations annuelles pour les deux années les plus récentes, et ses droits et obligations sont rétablis comme si elle n'avait pas été dissoute. En Ontario, une société dissoute en vertu de l'article 241 peut être reconstituée à la demande de tout intéressé, pourvu que 20 ans au plus se soient écoulés depuis la dissolution, et les dépôts en souffrance doivent être mis à jour. Korporex peut ",
          { text: "préparer et déposer une reconstitution", href: "/services/revive-business" },
          " auprès de l'un ou l'autre registre.",
        ],
      },
      {
        type: "heading",
        id: "resolutions-annuelles",
        text: "La déclaration annuelle et votre livre des procès-verbaux",
      },
      {
        type: "paragraph",
        text: "La déclaration annuelle est le volet public de la conformité annuelle. Le volet privé, ce sont les affaires annuelles de la société, consignées dans son livre des procès-verbaux. Sous la LCSA, les administrateurs doivent convoquer l'assemblée annuelle des actionnaires au plus tard 15 mois après la précédente et au plus tard six mois après la fin de l'exercice. Les sociétés ontariennes tiennent aussi une assemblée annuelle chaque année. Dans une société fermée, l'assemblée est habituellement remplacée par des résolutions écrites signées par tous les actionnaires habiles à voter, qui ont le même effet.",
      },
      {
        type: "paragraph",
        text: "Ces résolutions annuelles approuvent habituellement les états financiers, élisent ou confirment les administrateurs, traitent de la nomination d'un vérificateur ou du consentement des actionnaires à s'en dispenser, et confirment les dirigeants. La date de cette assemblée ou de ces résolutions est l'un des renseignements demandés dans la déclaration annuelle fédérale; préparer d'abord les résolutions annuelles facilite donc la déclaration. Korporex prépare les résolutions annuelles fédérales et les résolutions annuelles de l'Ontario pour le livre des procès-verbaux.",
        parts: [
          "Ces résolutions annuelles approuvent habituellement les états financiers, élisent ou confirment les administrateurs, traitent de la nomination d'un vérificateur ou du consentement des actionnaires à s'en dispenser, et confirment les dirigeants. La date de cette assemblée ou de ces résolutions est l'un des renseignements demandés dans la déclaration annuelle fédérale; préparer d'abord les résolutions annuelles facilite donc la déclaration. Korporex prépare les ",
          { text: "résolutions annuelles fédérales", href: "/services/annual-resolution-federal" },
          " et les ",
          { text: "résolutions annuelles de l'Ontario", href: "/services/annual-resolution-on" },
          " pour le livre des procès-verbaux.",
        ],
      },
      {
        type: "heading",
        id: "rester-a-jour",
        text: "Rester à jour : un calendrier de conformité annuel",
      },
      {
        type: "paragraph",
        text: "L'approche la plus fiable consiste à inscrire chaque échéance récurrente à un calendrier avec un rappel 30 jours à l'avance, et à tenir une courte liste de vérification des personnes dont les renseignements ont pu changer durant l'année : administrateurs, dirigeants, siège social et, pour les sociétés fédérales, particuliers ayant un contrôle important. La production de la déclaration elle-même prend habituellement moins de dix minutes une fois ces renseignements en main.",
      },
      {
        type: "list",
        items: [
          "Dans les 60 jours suivant la constitution (sociétés ontariennes) : produire la déclaration initiale.",
          "Chaque année, dans les 60 jours suivant la date anniversaire (sociétés fédérales) : produire la déclaration annuelle et les renseignements sur les PCI auprès de Corporations Canada.",
          "Chaque année, dans les six mois suivant la fin de l'exercice (sociétés ontariennes) : produire la déclaration annuelle par l'entremise du Registre des entreprises de l'Ontario.",
          "Chaque année, généralement dans les six mois suivant la fin de l'année d'imposition : produire la T2 auprès de l'ARC, séparément de la déclaration annuelle.",
          "Chaque année : tenir l'assemblée annuelle ou signer les résolutions annuelles, et les verser au livre des procès-verbaux.",
          "Dans les 15 jours de tout changement : signaler au registre les administrateurs nouveaux ou sortants, les changements d'adresse des administrateurs et les déménagements du siège social.",
          "Tout au long de l'année (sociétés fédérales) : tenir à jour le registre des particuliers ayant un contrôle important.",
        ],
      },
      {
        type: "paragraph",
        text: "Si une échéance vous échappe, produisez la déclaration en retard dès que vous vous en rendez compte. Une déclaration tardive produite avant que le registre n'entame le processus de dissolution est une affaire administrative mineure. C'est une déclaration qui reste manquante pendant des années qui transforme un dépôt de routine en demande de reconstitution.",
      },
    ],
    faq: [
      {
        q: "La déclaration annuelle d'une société est-elle la même chose que sa déclaration de revenus?",
        a: "Non. La déclaration annuelle est un dépôt de droit des sociétés qui confirme les renseignements de la société auprès de son registre : Corporations Canada pour les sociétés fédérales, le Registre des entreprises de l'Ontario pour les sociétés ontariennes. La déclaration de revenus des sociétés T2 est un dépôt distinct auprès de l'Agence du revenu du Canada. Produire votre T2 ne produit pas votre déclaration annuelle, et c'est aussi vrai en Ontario depuis octobre 2021.",
      },
      {
        q: "Ma société doit-elle produire une déclaration annuelle si elle n'a eu aucune activité?",
        a: "Oui. L'obligation s'applique à toute société active, qu'elle ait gagné un revenu ou non, qu'elle ait eu des employés ou non, et qu'elle ait changé quoi que ce soit ou non durant l'année. Une société de portefeuille inactive ou une société qui n'a pas encore commencé ses activités produit quand même sa déclaration. La seule façon de mettre fin à l'obligation est de dissoudre la société en bonne et due forme.",
      },
      {
        q: "Combien coûte la production d'une déclaration annuelle au Canada?",
        a: "Les frais gouvernementaux fédéraux pour la déclaration annuelle d'une société régie par la LCSA sont de 12 $ lorsqu'elle est produite en ligne auprès de Corporations Canada. L'Ontario n'exige aucuns frais gouvernementaux pour la déclaration annuelle produite par l'entremise du Registre des entreprises de l'Ontario. Les autres provinces fixent leurs propres frais. Si un fournisseur produit la déclaration pour vous, ses honoraires s'ajoutent aux frais gouvernementaux.",
      },
      {
        q: "Puis-je produire ma déclaration annuelle fédérale avant la date anniversaire?",
        a: "Non. Corporations Canada exige que les renseignements de la déclaration annuelle reflètent la situation de la société à sa date anniversaire. La période de dépôt s'ouvre donc à l'anniversaire de la constitution, de la fusion ou de la prorogation et reste ouverte pendant les 60 jours qui suivent. Si vous tentez de la produire plus tôt, la déclaration de cette année n'est pas encore disponible.",
      },
      {
        q: "Que faire si j'ai manqué plusieurs années de déclarations annuelles?",
        a: "Vérifiez d'abord le statut de la société au registre public. Si elle est toujours active, produisez sans délai toutes les déclarations en retard. Si elle a été dissoute, elle devra être reconstituée : au fédéral, par des clauses de reconstitution suivies des deux déclarations annuelles les plus récentes, et en Ontario, par une demande de reconstitution accompagnée de la mise à jour des dépôts en souffrance.",
      },
      {
        q: "Où trouver ma date anniversaire ou la fin de mon exercice?",
        a: "La date anniversaire est la date qui figure sur votre certificat de constitution, de fusion ou de prorogation; elle apparaît aussi lorsque vous recherchez la société dans la base de données des sociétés fédérales de Corporations Canada. La fin de l'exercice est choisie par la société et figure sur ses états financiers et ses déclarations T2. Votre comptable peut la confirmer en cas de doute.",
      },
    ],
  },

  // ── Spanish ──
  es: {
    readTime: "11 min de lectura",
    content: [
      {
        type: "paragraph",
        text: "La declaración anual de una sociedad es una breve presentación anual que confirma la información básica de la sociedad ante el registro que la rige. En Canadá, las sociedades federales la presentan ante Corporations Canada dentro de los 60 días siguientes al aniversario de su constitución, con una tarifa de 12 $ en línea. Las sociedades de Ontario la presentan a través del Registro de Empresas de Ontario dentro de los seis meses posteriores al cierre de su ejercicio, sin tarifa gubernamental. La declaración es obligatoria cada año, incluso para una sociedad sin actividad, y no presentarla puede terminar provocando la disolución de la sociedad.",
      },
      {
        type: "callout",
        title: "No confundir con",
        text: "Una declaración anual es una presentación que confirma la información de la sociedad ante el registro. No es una declaración de impuestos. La declaración del impuesto de sociedades T2 se presenta por separado ante la Agencia de Ingresos de Canadá (CRA). Las dos tienen plazos distintos, destinatarios distintos y consecuencias distintas si se omiten.",
      },
      {
        type: "heading",
        id: "que-es",
        text: "Qué es una declaración anual, y qué no es",
      },
      {
        type: "paragraph",
        text: "Una declaración anual confirma que la información en el expediente de la sociedad (domicilio social, directores, funcionarios y, en algunas provincias, accionistas) sigue siendo exacta. Es una obligación de derecho societario, no tributaria. Para una sociedad federal, la obligación proviene de la Ley de Sociedades por Acciones de Canadá (CBCA). Para una sociedad de Ontario, proviene de la Ley de Información de Sociedades (Corporations Information Act). Toda sociedad activa debe presentar una cada año, incluida una sociedad de cartera que solo tiene inversiones y una sociedad que no obtuvo ningún ingreso.",
      },
      {
        type: "paragraph",
        text: "La declaración anual no es la declaración del impuesto de sociedades T2. La T2 declara los ingresos de la sociedad y calcula su impuesto; se envía a la Agencia de Ingresos de Canadá, por lo general dentro de los seis meses posteriores al cierre del año fiscal. La declaración anual se envía al registro de sociedades y no dice nada sobre los ingresos. Presentar una no sustituye a la otra. Una sociedad puede estar totalmente al día con la CRA y aun así correr el riesgo de disolución porque sus declaraciones anuales están atrasadas, y lo contrario también es cierto.",
      },
      {
        type: "paragraph",
        text: "La declaración anual tampoco es lo mismo que sus resoluciones anuales. La declaración informa al gobierno que la sociedad sigue existiendo y que su información pública es correcta. Las resoluciones anuales son decisiones internas de los directores y accionistas, como la aprobación de los estados financieros y la elección de los directores, y se conservan en el libro de actas en lugar de presentarse ante el registro. Una sociedad bien llevada hace ambas cosas cada año.",
        parts: [
          "La declaración anual tampoco es lo mismo que sus resoluciones anuales. La declaración informa al gobierno que la sociedad sigue existiendo y que su información pública es correcta. Las resoluciones anuales son decisiones internas de los directores y accionistas, como la aprobación de los estados financieros y la elección de los directores, y se conservan en el ",
          { text: "libro de actas", href: "/guides/que-es-un-libro-de-actas" },
          " en lugar de presentarse ante el registro. Una sociedad bien llevada hace ambas cosas cada año.",
        ],
      },
      {
        type: "heading",
        id: "federal",
        text: "Las sociedades federales: la declaración anual bajo la CBCA",
      },
      {
        type: "paragraph",
        text: "Una sociedad constituida bajo la CBCA presenta su declaración anual ante Corporations Canada, en línea a través del Centro de Presentación en Línea (Online Filing Centre). La declaración vence dentro de los 60 días siguientes a la fecha de aniversario de la sociedad, es decir, el mes y el día en que se constituyó, se fusionó o se continuó bajo la CBCA. Por ejemplo, una sociedad constituida el 10 de marzo presenta su declaración cada año dentro de los 60 días que siguen al 10 de marzo, por lo que su plazo vence a principios de mayo.",
      },
      {
        type: "list",
        items: [
          "Se presenta ante: Corporations Canada, a través del Centro de Presentación en Línea.",
          "Vence: dentro de los 60 días siguientes al aniversario de la constitución, fusión o continuación.",
          "Tarifa gubernamental: 12 $ en línea.",
          "Se presenta al mismo tiempo: la información sobre las personas con control significativo (ISC) de la sociedad.",
          "Acceso: quien presenta necesita acceso a la cuenta en línea de la sociedad, por lo general mediante su clave de sociedad.",
        ],
      },
      {
        type: "paragraph",
        text: "No puede presentar la declaración federal por adelantado. Corporations Canada exige que la información refleje la situación de la sociedad en su fecha de aniversario, así que el plazo de presentación se abre el mismo día del aniversario. Antes de empezar, tenga a mano dos datos: la fecha de la última asamblea anual de accionistas (o de las resoluciones escritas firmadas en lugar de una asamblea) y si la sociedad es emisora (distributing) o no emisora. Casi todas las pequeñas sociedades privadas son no emisoras.",
      },
      {
        type: "paragraph",
        text: "Desde el 22 de enero de 2024, las sociedades regidas por la CBCA también deben presentar la información sobre sus personas con control significativo al mismo tiempo que la declaración anual. Esa información proviene del registro de personas con control significativo que las sociedades federales ya están obligadas a llevar, por lo que un registro al día hace que la presentación sea rápida.",
      },
      {
        type: "paragraph",
        text: "La declaración anual no es el lugar para informar un nuevo director o una mudanza. Un cambio en el consejo de administración, o en la dirección de un director, debe comunicarse a Corporations Canada dentro de los 15 días (Formulario 6), y un cambio de domicilio social también debe comunicarse dentro de los 15 días (Formulario 3). Si esos avisos están al día, la declaración anual suele consistir en confirmar lo que ya consta en el expediente. Puede presentar la declaración anual federal usted mismo o encargar a Korporex que prepare y presente su declaración anual federal.",
        parts: [
          "La declaración anual no es el lugar para informar un nuevo director o una mudanza. Un cambio en el consejo de administración, o en la dirección de un director, debe comunicarse a Corporations Canada dentro de los 15 días (Formulario 6), y un cambio de domicilio social también debe comunicarse dentro de los 15 días (Formulario 3). Si esos avisos están al día, la declaración anual suele consistir en confirmar lo que ya consta en el expediente. Puede presentar la declaración anual federal usted mismo o encargar a Korporex que ",
          { text: "prepare y presente su declaración anual federal", href: "/services/annual-return-federal" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "ontario",
        text: "Las sociedades de Ontario: la declaración anual bajo la Corporations Information Act",
      },
      {
        type: "paragraph",
        text: "Las sociedades constituidas bajo la Ley de Sociedades por Acciones de Ontario (OBCA) presentan una declaración anual en virtud de la Corporations Information Act. Desde octubre de 2021, la declaración se presenta directamente ante el ministerio a través del Registro de Empresas de Ontario. Antes, la mayoría de las sociedades de Ontario la presentaban junto con su T2 mediante la CRA. La CRA dejó de aceptar las declaraciones anuales de Ontario para las que vencían después del 18 de octubre de 2021, así que presentar su T2 ya no la cubre. Este es el motivo más común por el que las sociedades de Ontario se atrasan: los propietarios que confiaban en la declaración de impuestos de su contador creen que la declaración anual sigue incluida, y ya no lo está.",
      },
      {
        type: "list",
        items: [
          "Se presenta ante: el ministerio de Ontario, a través del Registro de Empresas de Ontario.",
          "Vence: dentro de los seis meses posteriores al cierre del ejercicio de la sociedad.",
          "Tarifa gubernamental: ninguna. Presentarla es gratuito, pero sigue siendo obligatorio.",
          "Acceso: toda presentación en el Registro de Empresas de Ontario exige la clave de empresa (company key) de la sociedad, un código de 9 dígitos exclusivo de la empresa.",
          "No presentarla puede provocar la cancelación del certificado de constitución de la sociedad, lo que la disuelve.",
        ],
      },
      {
        type: "paragraph",
        text: "Como el plazo de Ontario corre desde el cierre del ejercicio y no desde el aniversario de constitución, una sociedad cuyo ejercicio cierra el 31 de diciembre tiene hasta el 30 de junio del año siguiente. La declaración confirma la información de la sociedad en el registro público, como su domicilio social y sus directores y funcionarios. Mantenga también al día la dirección de correo electrónico oficial que figura en el registro, ya que es allí donde el ministerio envía sus avisos. Al igual que con las sociedades federales, los cambios deben comunicarse a medida que ocurren: en Ontario, un aviso de cambio vence dentro de los 15 días siguientes al cambio.",
        parts: [
          "Como el plazo de Ontario corre desde el cierre del ejercicio y no desde el aniversario de constitución, una sociedad cuyo ejercicio cierra el 31 de diciembre tiene hasta el 30 de junio del año siguiente. La declaración confirma la información de la sociedad en el registro público, como su domicilio social y sus directores y funcionarios. Mantenga también al día la dirección de correo electrónico oficial que figura en el registro, ya que es allí donde el ministerio envía sus avisos. Al igual que con las sociedades federales, los cambios deben comunicarse a medida que ocurren: en Ontario, un ",
          { text: "aviso de cambio", href: "/services/notice-of-change" },
          " vence dentro de los 15 días siguientes al cambio.",
        ],
      },
      {
        type: "paragraph",
        text: "La declaración anual es distinta de la declaración inicial que una nueva sociedad de Ontario presenta dentro de los 60 días siguientes a su constitución. Si se constituyó hace poco, presente primero la declaración inicial de Ontario; la declaración anual vendrá después del cierre de su primer ejercicio. Korporex puede presentar su declaración anual de Ontario a través del Registro de Empresas de Ontario. Para el panorama completo de cómo iniciar una sociedad en la provincia, consulte nuestra guía para constituirse en sociedad en Ontario.",
        parts: [
          "La declaración anual es distinta de la declaración inicial que una nueva sociedad de Ontario presenta dentro de los 60 días siguientes a su constitución. Si se constituyó hace poco, presente primero la ",
          { text: "declaración inicial de Ontario", href: "/services/initial-return-on" },
          "; la declaración anual vendrá después del cierre de su primer ejercicio. Korporex puede presentar su ",
          { text: "declaración anual de Ontario", href: "/services/annual-return-on" },
          " a través del Registro de Empresas de Ontario. Para el panorama completo de cómo iniciar una sociedad en la provincia, consulte nuestra guía para ",
          { text: "constituirse en sociedad en Ontario", href: "/guides/constituirse-en-sociedad-en-ontario" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "federal-u-ontario",
        text: "Comparación de las declaraciones anuales federal y de Ontario",
      },
      {
        type: "table",
        head: ["", "Federal (CBCA)", "Ontario (OBCA)"],
        rows: [
          ["Ley que la exige", "Ley de Sociedades por Acciones de Canadá", "Corporations Information Act"],
          ["Se presenta ante", "Corporations Canada, Centro de Presentación en Línea", "Registro de Empresas de Ontario"],
          ["Plazo", "Dentro de los 60 días siguientes a la fecha de aniversario", "Dentro de los seis meses posteriores al cierre del ejercicio"],
          ["Plazo basado en", "La fecha de constitución, fusión o continuación", "El cierre del ejercicio de la sociedad"],
          ["Tarifa gubernamental (en línea)", "12 $", "Sin tarifa"],
          ["Se presenta junto con", "Información sobre personas con control significativo", "No aplica"],
          ["Credencial necesaria", "Clave de sociedad", "Clave de empresa"],
          ["Si no se presenta", "Estado «atrasado»; posible disolución tras un aviso final", "Aviso de incumplimiento, luego cancelación y disolución"],
        ],
      },
      {
        type: "paragraph",
        text: "La elección entre sociedad federal o provincial se hace al constituirse, y determina cuál de estos dos regímenes se aplica durante toda la vida de la sociedad. Además, su número de sociedad, que sirve para buscar la sociedad y hacer sus presentaciones, es distinto del número de negocio que asigna la CRA.",
        parts: [
          "La elección entre sociedad federal o provincial se hace al constituirse, y determina cuál de estos dos regímenes se aplica durante toda la vida de la sociedad. Además, su número de sociedad, que sirve para buscar la sociedad y hacer sus presentaciones, es distinto del ",
          { text: "número de negocio que asigna la CRA", href: "/guides/numero-negocio-o-numero-sociedad" },
          ".",
        ],
      },
      {
        type: "heading",
        id: "otras-provincias",
        text: "Las demás provincias en resumen",
      },
      {
        type: "paragraph",
        text: "Cada provincia tiene su propia versión de la presentación anual, con su propio nombre y su propio plazo. Algunos ejemplos:",
      },
      {
        type: "list",
        items: [
          "Columbia Británica: una sociedad de Columbia Británica presenta un informe anual (annual report) dentro de los dos meses siguientes a su fecha de aniversario. El registrador puede disolver una sociedad que no lo presente en dos años consecutivos.",
          "Alberta: una sociedad presenta una declaración anual ante el Corporate Registry a más tardar el último día del mes siguiente a su mes de aniversario. Una sociedad que no la presenta puede ser disuelta.",
          "Quebec: toda empresa inscrita presenta una declaración de actualización anual ante el Registraire des entreprises, haya habido cambios o no. No presentar dos declaraciones consecutivas puede provocar la cancelación de la inscripción.",
        ],
      },
      {
        type: "paragraph",
        text: "Si su sociedad está registrada como extraprovincial en otra provincia, revise también las normas de esa provincia. Algunas provincias exigen una presentación anual a las sociedades extraprovinciales además de a las propias. Columbia Británica, por ejemplo, tiene un informe anual aparte para las sociedades extraprovinciales.",
      },
      {
        type: "heading",
        id: "consecuencias",
        text: "Qué pasa si omite una presentación",
      },
      {
        type: "paragraph",
        text: "A nivel federal, las consecuencias se acumulan por etapas. En cuanto vence el plazo de 60 días, las presentaciones anuales de la sociedad aparecen como «atrasadas» en la base de datos pública de Corporations Canada, que cualquiera puede consultar. Mientras las presentaciones estén atrasadas, la sociedad no puede obtener un certificado de cumplimiento, un documento que bancos, prestamistas y compradores suelen pedir. La CBCA permite a Corporations Canada disolver una sociedad tras un año sin presentar. Su política actual es disolver solo después de dos años sin declaración, y antes envía un aviso final que da a la sociedad 120 días adicionales para presentar.",
      },
      {
        type: "paragraph",
        text: "En Ontario, el artículo 241 de la Ley de Sociedades por Acciones permite disolver una sociedad que incumple un requisito de presentación de la Corporations Information Act. Los avisos se envían al domicilio social que consta en el registro público, y puede publicarse un aviso de incumplimiento en The Ontario Gazette. Si la sociedad no se pone al día, se cancela su certificado de constitución y la sociedad queda disuelta.",
      },
      {
        type: "paragraph",
        text: "La disolución es grave. Una sociedad disuelta deja de existir como entidad legal. Su nombre puede quedar disponible para otros, sus contratos y derechos de propiedad entran en una zona gris legal, y las personas que siguen haciendo negocios en su nombre pueden quedar expuestas personalmente. La disolución voluntaria es un proceso distinto y deliberado, descrito en nuestra guía sobre cómo disolver una sociedad en Ontario; la disolución por incumplimiento es el resultado de presentaciones omitidas, incluso gratuitas o de 12 $.",
        parts: [
          "La disolución es grave. Una sociedad disuelta deja de existir como entidad legal. Su nombre puede quedar disponible para otros, sus contratos y derechos de propiedad entran en una zona gris legal, y las personas que siguen haciendo negocios en su nombre pueden quedar expuestas personalmente. La disolución voluntaria es un proceso distinto y deliberado, descrito en nuestra guía sobre cómo ",
          { text: "disolver una sociedad en Ontario", href: "/guides/como-disolver-una-sociedad-en-ontario" },
          "; la disolución por incumplimiento es el resultado de presentaciones omitidas, incluso gratuitas o de 12 $.",
        ],
      },
      {
        type: "heading",
        id: "como-corregir",
        text: "Cómo corregir una declaración anual omitida",
      },
      {
        type: "paragraph",
        text: "Si la sociedad todavía no ha sido disuelta, la solución es sencilla: presente todas las declaraciones atrasadas lo antes posible. A nivel federal, cada año atrasado se presenta con su propia tarifa, y el estado vuelve a la normalidad una vez completadas las presentaciones. En Ontario, las declaraciones atrasadas se presentan a través del Registro de Empresas de Ontario. Si recibió un aviso de disolución, actúe dentro del plazo que indica, y no suponga que un aviso no recibido significa que no hay plazo: los avisos se envían a la dirección que consta en el registro público, otra razón para mantenerla al día.",
      },
      {
        type: "paragraph",
        text: "Si la sociedad ya fue disuelta, por lo general puede revivirse. A nivel federal, cualquier persona interesada, como un accionista, un director o un acreedor, puede solicitar la reactivación presentando los Estatutos de Reactivación (Formulario 15) con una tarifa gubernamental no reembolsable. Una vez reactivada, la sociedad debe presentar sus declaraciones anuales de los dos años más recientes, y sus derechos y obligaciones se restablecen como si no hubiera sido disuelta. En Ontario, una sociedad disuelta en virtud del artículo 241 puede revivirse a solicitud de cualquier persona interesada, siempre que no hayan transcurrido más de 20 años desde la disolución, y las presentaciones pendientes deben ponerse al día. Korporex puede preparar y presentar una reactivación ante cualquiera de los dos registros.",
        parts: [
          "Si la sociedad ya fue disuelta, por lo general puede revivirse. A nivel federal, cualquier persona interesada, como un accionista, un director o un acreedor, puede solicitar la reactivación presentando los Estatutos de Reactivación (Formulario 15) con una tarifa gubernamental no reembolsable. Una vez reactivada, la sociedad debe presentar sus declaraciones anuales de los dos años más recientes, y sus derechos y obligaciones se restablecen como si no hubiera sido disuelta. En Ontario, una sociedad disuelta en virtud del artículo 241 puede revivirse a solicitud de cualquier persona interesada, siempre que no hayan transcurrido más de 20 años desde la disolución, y las presentaciones pendientes deben ponerse al día. Korporex puede ",
          { text: "preparar y presentar una reactivación", href: "/services/revive-business" },
          " ante cualquiera de los dos registros.",
        ],
      },
      {
        type: "heading",
        id: "resoluciones-anuales",
        text: "La declaración anual y su libro de actas",
      },
      {
        type: "paragraph",
        text: "La declaración anual es la mitad pública del cumplimiento anual. La mitad privada son los asuntos anuales de la sociedad, registrados en su libro de actas. Bajo la CBCA, los directores deben convocar la asamblea anual de accionistas a más tardar 15 meses después de la anterior y a más tardar seis meses después del cierre del ejercicio. Las sociedades de Ontario también celebran una asamblea anual cada año. En una sociedad cerrada, la asamblea suele sustituirse por resoluciones escritas firmadas por todos los accionistas con derecho a voto, que tienen el mismo efecto.",
      },
      {
        type: "paragraph",
        text: "Esas resoluciones anuales suelen aprobar los estados financieros, elegir o confirmar a los directores, tratar el nombramiento de un auditor o el consentimiento de los accionistas para prescindir de él, y confirmar a los funcionarios. La fecha de esa asamblea o de esas resoluciones es uno de los datos que pide la declaración anual federal, así que preparar primero las resoluciones anuales facilita la declaración. Korporex prepara las resoluciones anuales federales y las resoluciones anuales de Ontario para el libro de actas.",
        parts: [
          "Esas resoluciones anuales suelen aprobar los estados financieros, elegir o confirmar a los directores, tratar el nombramiento de un auditor o el consentimiento de los accionistas para prescindir de él, y confirmar a los funcionarios. La fecha de esa asamblea o de esas resoluciones es uno de los datos que pide la declaración anual federal, así que preparar primero las resoluciones anuales facilita la declaración. Korporex prepara las ",
          { text: "resoluciones anuales federales", href: "/services/annual-resolution-federal" },
          " y las ",
          { text: "resoluciones anuales de Ontario", href: "/services/annual-resolution-on" },
          " para el libro de actas.",
        ],
      },
      {
        type: "heading",
        id: "mantenerse-al-dia",
        text: "Mantenerse al día: un calendario anual de cumplimiento",
      },
      {
        type: "paragraph",
        text: "El enfoque más confiable es agregar cada plazo recurrente a un calendario con un recordatorio 30 días antes, y llevar una breve lista de quién pudo haber cambiado su información durante el año: directores, funcionarios, domicilio social y, en las sociedades federales, personas con control significativo. Presentar la declaración en sí suele tomar menos de diez minutos una vez que tiene esos datos a mano.",
      },
      {
        type: "list",
        items: [
          "Dentro de los 60 días siguientes a la constitución (sociedades de Ontario): presentar la declaración inicial.",
          "Cada año, dentro de los 60 días siguientes a la fecha de aniversario (sociedades federales): presentar la declaración anual y la información sobre ISC ante Corporations Canada.",
          "Cada año, dentro de los seis meses posteriores al cierre del ejercicio (sociedades de Ontario): presentar la declaración anual a través del Registro de Empresas de Ontario.",
          "Cada año, por lo general dentro de los seis meses posteriores al cierre del año fiscal: presentar la T2 ante la CRA, por separado de la declaración anual.",
          "Cada año: celebrar la asamblea anual o firmar las resoluciones anuales, y archivarlas en el libro de actas.",
          "Dentro de los 15 días de cualquier cambio: comunicar al registro los directores nuevos o salientes, los cambios de dirección de los directores y los traslados del domicilio social.",
          "Durante todo el año (sociedades federales): mantener al día el registro de personas con control significativo.",
        ],
      },
      {
        type: "paragraph",
        text: "Si se le pasa un plazo, presente la declaración atrasada en cuanto lo note. Una declaración tardía presentada antes de que el registro inicie el proceso de disolución es un asunto administrativo menor. Lo que convierte una presentación rutinaria en una solicitud de reactivación es una declaración que sigue sin presentarse durante años.",
      },
    ],
    faq: [
      {
        q: "¿La declaración anual de una sociedad es lo mismo que su declaración de impuestos?",
        a: "No. La declaración anual es una presentación de derecho societario que confirma la información de la sociedad ante su registro: Corporations Canada para las sociedades federales y el Registro de Empresas de Ontario para las sociedades de Ontario. La declaración del impuesto de sociedades T2 es una presentación distinta ante la Agencia de Ingresos de Canadá. Presentar su T2 no presenta su declaración anual, y desde octubre de 2021 eso también ocurre en Ontario.",
      },
      {
        q: "¿Mi sociedad debe presentar una declaración anual si no tuvo actividad?",
        a: "Sí. La obligación se aplica a toda sociedad activa, haya obtenido ingresos o no, haya tenido empleados o no, y haya cambiado algo o no durante el año. Una sociedad de cartera inactiva o una sociedad que todavía no ha comenzado a operar también la presenta. La única forma de poner fin a la obligación es disolver la sociedad debidamente, lo que en sí es una presentación formal ante el registro.",
      },
      {
        q: "¿Cuánto cuesta presentar una declaración anual en Canadá?",
        a: "La tarifa gubernamental federal de la declaración anual de una sociedad regida por la CBCA es de 12 $ cuando se presenta en línea ante Corporations Canada. Ontario no cobra tarifa gubernamental por la declaración anual presentada a través del Registro de Empresas de Ontario. Las demás provincias fijan sus propias tarifas. Si un proveedor la presenta por usted, sus honorarios se suman a cualquier tarifa gubernamental.",
      },
      {
        q: "¿Puedo presentar mi declaración anual federal antes de la fecha de aniversario?",
        a: "No. Corporations Canada exige que la información de la declaración anual refleje la situación de la sociedad en su fecha de aniversario. Por eso el plazo de presentación se abre en el aniversario de la constitución, fusión o continuación y permanece abierto durante los 60 días siguientes. Si intenta presentarla antes, la declaración de ese año todavía no está disponible.",
      },
      {
        q: "¿Qué debo hacer si omití varios años de declaraciones anuales?",
        a: "Primero verifique el estado de la sociedad en el registro público. Si sigue activa, presente de inmediato todas las declaraciones atrasadas. Si fue disuelta, habrá que reactivarla: a nivel federal, mediante los Estatutos de Reactivación seguidos de las dos declaraciones anuales más recientes, y en Ontario, mediante una solicitud de reactivación con las presentaciones pendientes puestas al día.",
      },
      {
        q: "¿Dónde encuentro mi fecha de aniversario o el cierre de mi ejercicio?",
        a: "La fecha de aniversario es la que figura en su certificado de constitución, fusión o continuación, y también aparece al buscar la sociedad en la base de datos de sociedades federales de Corporations Canada. El cierre del ejercicio lo elige la sociedad y figura en sus estados financieros y en sus declaraciones T2. Su contador puede confirmarlo si tiene dudas.",
      },
    ],
  },
};
