import type { ArticleInline, ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

// Facts verified 2026-10-04 against:
//  - Business Corporations Act, R.S.O. 1990, c. B.16 (ss. 4, 5, 8, 10, 12, 14, 115-119, 140, 140.2, 141, 148),
//    https://www.ontario.ca/laws/docs/90b16_e.doc (s. 118(3) residency rule repealed 2020, c. 34, Sched. 1, s. 5, in force 05/07/2021)
//  - Corporations Information Act, R.S.O. 1990, c. C.39 (ss. 2, 3, 4), https://www.ontario.ca/laws/docs/90c39_e.doc
//  - CBCA s. 105(3), https://laws-lois.justice.gc.ca/eng/acts/c-44/page-11.html
//  - CRA automatic BN, https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business/corporation-income-tax-program-account.html
//  - GST/HST small supplier, https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-charge
//  - Ontario annual return / Notice of Change / company key, https://www.ontario.ca/page/start-dissolve-and-change-corporation
// Government fees: keep in sync with src/lib/govFees.ts.

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
  en: {
    readTime: "12 min read",
    content: [
      p("To incorporate in Ontario, you choose a name (or accept a numbered name), file Articles of Incorporation through the Ontario Business Registry with the $300 government fee, and then organize the new corporation with by-laws, organizational resolutions, a share issuance and a minute book. A named corporation needs an Ontario-biased NUANS report dated no more than 90 days before filing. Filed online, the articles are processed immediately. Within 60 days of incorporation, the corporation files an Initial Return, which has no government fee."),
      p("Ontario corporations are governed by the Business Corporations Act (OBCA), and their public information filings, such as the Initial Return, the annual return and notices of change, fall under the Corporations Information Act. Both are administered through the Ontario Business Registry (OBR), the province's online registry, which launched in October 2021. This guide walks through each step in order, what the law requires at each one, and how an Ontario corporation compares with a federal one."),

      { type: "heading", id: "whats-required", text: "What is required to incorporate in Ontario" },
      { type: "list", items: [
        "A corporate name: either a proposed name supported by an Ontario-biased NUANS report, or a number name assigned by the registry.",
        "Articles of Incorporation setting out the share classes, any restrictions on share transfers or business activities, the number of directors, the first directors and the registered office address.",
        "One or more incorporators. An incorporator can be an individual or a corporation. An individual must be at least 18, must not have been found incapable of managing property, and must not have the status of bankrupt (OBCA s. 4).",
        "At least one director, who must be an individual. Ontario has no Canadian residency requirement for directors.",
        "A registered office at a physical address in Ontario. A P.O. box alone is not acceptable.",
        "A signed consent to act from each first director who is not an incorporator, kept at the registered office (OBCA s. 5).",
      ] },

      { type: "heading", id: "steps", text: "How to incorporate in Ontario, step by step" },
      { type: "list", items: [
        "Step 1. Decide between a named corporation and a numbered corporation.",
        "Step 2. For a named corporation, order an Ontario-biased NUANS report and check the name against Ontario's naming rules.",
        "Step 3. Settle the share structure, the number of directors, the first directors and the registered office address.",
        "Step 4. File Articles of Incorporation on the Ontario Business Registry and pay the $300 government fee.",
        "Step 5. Receive the Certificate of Incorporation and the Ontario corporation number.",
        "Step 6. Organize the corporation: by-laws, organizational resolutions, share issuance, officers and the minute book.",
        "Step 7. File the Initial Return within 60 days of incorporation.",
        "Step 8. Set up the tax accounts the business needs with the CRA, using the Business Number assigned on incorporation.",
      ] },
      p("The sections below cover each step in more detail."),

      { type: "heading", id: "named-vs-numbered", text: "Named or numbered corporation" },
      p("A named corporation carries a name its founders choose, such as \"Maplewind Consulting Inc.\" Under section 10 of the OBCA, the name must include one of the legal elements Limited, Limitée, Incorporated, Incorporée or Corporation, or the abbreviations Ltd., Ltée, Inc. or Corp. The name also has to be distinctive enough not to be confused with an existing name, which is what the NUANS report is for."),
      p("If no name is set out in the articles, the registry assigns the corporation a number name based on its Ontario corporation number, for example 1234567 Ontario Inc. (OBCA s. 8). A numbered corporation needs no NUANS report, so it is quicker and cheaper to set up. To trade under a brand, it can register an ", L("operating name", "/services/business-name"), " under the Business Names Act for $60, renewed every five years, or later change its corporate name by ", L("Articles of Amendment", "/services/articles-amendment"), ". Our guide to ", L("named vs numbered corporations", "/guides/named-vs-numbered-corporation"), " covers the trade-offs."),

      { type: "heading", id: "nuans", text: "The NUANS report" },
      p("A named Ontario corporation needs an ", L("Ontario-biased NUANS report", "/nuans"), ". NUANS compares the proposed name against existing corporate names, business names and trademarks across Canada, and the report lists the closest matches. The report must be dated no more than 90 days before the articles are filed, and a federally biased report is not accepted for an Ontario filing. The Ontario government does not sell NUANS reports; they are ordered from a private search house, which sets its own price."),
      p("The registry does not examine the name for you before it accepts the articles. If a corporation ends up with a name that does not comply with the OBCA, the Director can later change it by issuing a certificate of amendment, after giving the corporation an opportunity to be heard (OBCA s. 12). Reading the report before filing is how most applicants reduce that risk. For how the search works and what to do if a name is refused, see our guide to ", L("NUANS name searches", "/guides/what-is-nuans-name-search"), "."),

      { type: "heading", id: "directors", text: "Directors and officers" },
      p("A corporation that is not an offering corporation must have at least one director, and an offering corporation needs at least three (OBCA s. 115). The articles set either a fixed number of directors or a minimum and a maximum. Most small private corporations use a range, which leaves room to add directors later."),
      p("A director must be an individual who is at least 18, has not been found incapable of managing property, and does not have the status of bankrupt (OBCA s. 118). Unless the articles say otherwise, a director does not need to hold shares. Ontario used to require that at least 25 per cent of directors be resident Canadians. That requirement was repealed effective July 5, 2021, so an Ontario corporation can now have a board made up entirely of non-residents. A federal corporation still needs at least 25 per cent resident Canadian directors, or at least one if it has fewer than four directors (CBCA s. 105)."),
      p("The first directors named in the articles hold office from incorporation until the first meeting of shareholders (OBCA s. 119). Officers, such as a president and a secretary, are not named in the articles; the directors appoint them after incorporation. Any later ", L("change of directors", "/services/change-director"), " or officers is reported to the registry with a ", L("Notice of Change", "/services/notice-of-change"), " within 15 days."),

      { type: "heading", id: "registered-office", text: "Registered office" },
      p("An Ontario corporation must have a registered office in Ontario at all times (OBCA s. 14). The address must be a physical location; a P.O. box alone is not accepted. The registered office address appears on the public record, and the corporation's records are kept there unless the directors designate another place in Ontario. The directors can move the office within the same municipality by resolution, while a move to another municipality needs a special resolution of the shareholders. In either case the ", L("change of address", "/services/change-address"), " is reported to the registry."),
      p("Because the address is public, many home-based owners use a ", L("registered office service", "/services/registered-office"), " so their home address stays off the record."),

      { type: "heading", id: "share-structure", text: "Share structure" },
      p("The articles set out the classes of shares the corporation may issue, any maximum number of shares in each class, and the rights, privileges, restrictions and conditions attached to each class. The simplest structure is a single class of common shares that carry votes and a right to dividends. Many owner-managed corporations authorize several classes instead, for example voting and non-voting shares or classes that can receive dividends separately, to leave room for family members, partners or a future holding company."),
      p("Private corporations usually restrict share transfers in their articles, typically by requiring the directors' approval. Restrictions of this kind are part of what lets a private corporation rely on the private issuer exemption under securities law when it issues shares to founders, family and close associates."),
      p("Because the share classes affect control, dividends and tax planning, many owners review the structure with an accountant or lawyer before filing, since changing it later requires Articles of Amendment. Where there is more than one shareholder, a ", L("shareholder agreement", "/guides/shareholder-agreements-canada"), " usually sits alongside the articles. Our guide to ", L("Articles of Incorporation", "/guides/what-are-articles-of-incorporation"), " explains each part of the document."),

      { type: "heading", id: "filing", text: "Filing on the Ontario Business Registry" },
      p("Articles of Incorporation are filed on the OBR, either directly or through an intermediary such as a lawyer or an incorporation service. The government fee is $300 whichever method is used. Filed online, the incorporation is processed immediately; filed by mail, ServiceOntario lists a processing time of about 15 business days. The articles are signed by the incorporators, and a NUANS report must still be within its 90-day window on the filing date. On approval, the registry issues the Certificate of Incorporation, and the corporation exists from the date shown on it."),

      { type: "heading", id: "costs", text: "Costs" },
      { type: "table", head: ["Item", "Government fee", "Notes"], rows: [
        ["Articles of Incorporation", "$300", "Same fee online or by mail"],
        ["Ontario-biased NUANS report", "Not a government fee", "Named corporations only; the price is set by the private search house"],
        ["Initial Return", "$0", "Within 60 days of incorporation"],
        ["Annual return", "$0", "Every year, within six months after fiscal year-end"],
        ["Business name registration", "$60", "Only to operate under another name; renewed every five years"],
        ["Minute book", "No government fee", "Records the OBCA requires; prepared by the corporation or a provider"],
      ] },
      p("Professional or service fees come on top of the government fees, and HST applies to those fees, not to the $300 the government collects. For a full breakdown, including one-time and ongoing costs and the items people forget to budget for, see our guide to the ", L("cost to incorporate in Ontario", "/guides/cost-to-incorporate-in-ontario"), "."),

      { type: "heading", id: "timeline", text: "Timeline" },
      p("For a straightforward Ontario incorporation, the typical timeline is:"),
      { type: "list", items: [
        "Name: a NUANS report is usually generated the same day it is ordered. A numbered corporation skips this step.",
        "Articles of Incorporation: prepared once the name, share structure, directors and registered office are settled.",
        "Filing: processed immediately when filed online, or in about 15 business days by mail.",
        "Business Number: assigned automatically by the CRA after incorporation.",
        "Organizational resolutions and minute book: usually completed right after incorporation, since banks ask for them when the account is opened.",
        "Initial Return: due within 60 days of incorporation.",
      ] },

      { type: "heading", id: "what-you-receive", text: "What you receive after filing" },
      { type: "list", items: [
        "A Certificate of Incorporation showing the date of incorporation and the Ontario corporation number.",
        "The Articles of Incorporation as filed.",
        "Access to the corporation's record on the Ontario Business Registry. Later filings use the corporation's company key, a nine-digit code unique to the business that is meant to be kept private.",
        "A Business Number and a corporation income tax program account from the CRA, assigned automatically after incorporation.",
      ] },

      { type: "heading", id: "organizing", text: "Organizing the corporation: by-laws, resolutions and the minute book" },
      p("Filing the articles creates the corporation, but it does not issue any shares or appoint any officers. Section 117 of the OBCA provides for a meeting of the directors after incorporation, at which they may make by-laws, adopt forms of share certificates and corporate records, authorize the issue of shares, appoint officers, appoint an auditor until the first shareholders' meeting, and make banking arrangements. The same matters can be dealt with by a written resolution signed by all of the directors, which is how most private corporations handle them."),
      p("By-laws set the internal rules: how directors and shareholders meet, who signs documents, and how the corporation banks. By-laws made by the directors are submitted to the shareholders at their next meeting for confirmation (OBCA s. 116). A corporation that is not an offering corporation can also be exempt from appointing an auditor for a financial year if all of its shareholders consent in writing (OBCA s. 148)."),
      p("All of this goes in the minute book. The OBCA requires every corporation to keep, at its registered office or another place in Ontario designated by the directors, its articles and by-laws, minutes and resolutions of shareholders and directors, a register of directors, a securities register and adequate accounting records (OBCA ss. 140 and 141). Since January 1, 2023, Ontario corporations must also keep a register of individuals with significant control, which covers, among others, individuals who hold or control 25 per cent or more of the votes or of the fair market value of the shares (OBCA s. 140.2)."),
      p("Banks, buyers, lenders and the CRA can all ask to see the minute book. An ", L("initial minute book", "/services/initial-minute-book"), " prepared at incorporation puts these documents in place from day one, and our ", L("minute book guide", "/guides/corporate-minute-book"), " explains what goes in it."),

      { type: "heading", id: "initial-return", text: "The Initial Return: due within 60 days" },
      p("Under section 2 of the Corporations Information Act, every Ontario corporation must file an ", L("Initial Return", "/services/initial-return-on"), " within 60 days after the date of incorporation. It confirms the corporation's directors, officers and registered office on the public record. There is no government fee. The Initial Return is easy to overlook because the articles have only just been filed, but it is a separate legal requirement."),
      p("After that, the corporation reports changes with a Notice of Change within 15 days after the change (Corporations Information Act s. 4), and files an ", L("Ontario annual return", "/services/annual-return-on"), " through the OBR every year within six months after its fiscal year-end. The annual return also has no government fee, but a corporation that stops filing can eventually be dissolved. Our guide to ", L("corporate annual returns", "/guides/corporate-annual-returns-canada"), " explains the yearly cycle."),

      { type: "heading", id: "business-number", text: "CRA Business Number and tax accounts" },
      p("When a corporation is incorporated in Ontario, the Canada Revenue Agency automatically assigns it a ", L("Business Number", "/services/business-number"), " (BN) and a corporation income tax program account. The corporation files a T2 corporate income tax return every year, whether or not it earns income, and the CRA administers Ontario corporate income tax, so a single T2 covers both."),
      p("Other program accounts are opened as needed. A GST/HST account is required once the corporation stops being a small supplier, which happens when its taxable revenues exceed $30,000 in a single calendar quarter or over four consecutive calendar quarters; registering voluntarily before then is allowed. A payroll program account is needed when the corporation pays salaries or wages, including to its owner. Our guides on ", L("getting a CRA Business Number", "/guides/how-to-get-a-cra-business-number"), " and ", L("getting a GST/HST number in Ontario", "/guides/how-to-get-gst-hst-number-ontario"), " walk through registration."),

      { type: "heading", id: "ontario-vs-federal", text: "Ontario vs federal incorporation" },
      p("A business based in Ontario can incorporate under the OBCA or federally under the Canada Business Corporations Act (CBCA). Either one can carry on business in Ontario. The main differences are summarized below."),
      { type: "table", head: ["", "Ontario (OBCA)", "Federal (CBCA)"], rows: [
        ["Registry", "Ontario Business Registry", "Corporations Canada"],
        ["Government filing fee", "$300", "$200"],
        ["Name search", "Ontario-biased NUANS report for a named corporation", "No separate NUANS report; the name search is part of the federal process"],
        ["Director residency", "No requirement", "At least 25% resident Canadians (at least one if fewer than four directors)"],
        ["Name protection", "Ontario", "Across Canada"],
        ["Annual return", "$0, within six months after fiscal year-end", "$12, within 60 days after the anniversary date"],
        ["Operating in Ontario", "Nothing more to register", "Ontario Initial Return within 60 days of beginning business in Ontario"],
        ["Operating in other provinces", "Extra-provincial registration in each province", "Extra-provincial registration in each province"],
      ] },
      p("A business that will operate mainly in Ontario deals with a single registry as an Ontario corporation. A federal corporation suits businesses that expect to operate in several provinces or want national name protection, but it files with both Corporations Canada and Ontario, and with any other province where it carries on business through ", L("extra-provincial registration", "/services/extra-provincial"), ". Our guide to ", L("federal vs provincial incorporation", "/guides/federal-vs-provincial-incorporation"), " covers the comparison in depth."),

      { type: "heading", id: "after-incorporation", text: "After incorporation" },
      p("Once the corporation exists and is organized, a few practical steps remain:"),
      { type: "list", items: [
        "Issue the initial shares to the founders and record them in the securities register, with share certificates if the corporation uses them.",
        "Open a corporate bank account. Banks typically ask for the Certificate and Articles of Incorporation, a banking resolution and identification for the signing officers.",
        "Register for GST/HST, payroll and any other CRA accounts the business needs.",
        "Register any operating name that differs from the corporate name.",
        "Check whether the business needs municipal licences or industry permits.",
        "Calendar the recurring deadlines: the Ontario annual return, the T2 return, and the annual resolutions of directors and shareholders.",
      ] },
      p("Annual resolutions are not filed with the government, but they keep the minute book current, and an ", L("annual resolution service", "/services/annual-resolution-on"), " can prepare them each year. Our guide to ", L("opening a business bank account in Canada", "/guides/how-to-open-a-business-bank-account-canada"), " covers what banks ask for."),
      { type: "callout", title: "One common oversight", text: "The Initial Return is due within 60 days of incorporation and confirms the directors, officers and registered office on the public record. It has no government fee and is a short online filing, but it is separate from the articles and easy to forget in the weeks after incorporating." },
      p("Korporex incorporates Ontario corporations online, with the NUANS report, the filing, the share structure and the initial minute book handled together. You can ", L("start your Ontario incorporation", "/incorporate"), " online, or read our guide to ", L("registering a business in Ontario", "/guides/how-to-register-a-business-in-ontario"), " to compare a corporation with a sole proprietorship or partnership."),
    ],
    faq: [
      { q: "How long does it take to incorporate in Ontario?", a: "Filed online through the Ontario Business Registry, Articles of Incorporation are processed immediately, so a corporation can exist the same day its documents are ready. A NUANS report for a named corporation is usually generated the same day it is ordered. Filing by mail takes about 15 business days. The Initial Return then follows within 60 days of incorporation." },
      { q: "Can a non-resident be a director of an Ontario corporation?", a: "Yes. Ontario repealed its requirement that at least 25 per cent of directors be resident Canadians, effective July 5, 2021. An Ontario corporation can now have a board made up entirely of non-residents, as long as each director is an individual who is at least 18, not bankrupt and not found incapable. A federal corporation still has a resident Canadian director requirement." },
      { q: "Do I need a NUANS report to incorporate in Ontario?", a: "Only for a named corporation. A named Ontario corporation needs an Ontario-biased NUANS report dated no more than 90 days before the articles are filed, and a federally biased report is not accepted. A numbered corporation, which takes a number name assigned by the registry, needs no NUANS report at all." },
      { q: "What is the Initial Return and when is it due?", a: "The Initial Return is a filing under Ontario's Corporations Information Act that confirms the corporation's directors, officers and registered office on the public record. Every Ontario corporation must file it within 60 days after the date of incorporation. There is no government fee, and it is filed on the Ontario Business Registry." },
      { q: "Do I need a lawyer to incorporate in Ontario?", a: "No. Ontario law does not require a lawyer to file Articles of Incorporation, and they can be filed directly on the Ontario Business Registry. Many owners use a lawyer when the setup is not standard, for example several founders, outside investors, a holding company or a professional corporation, and an online incorporation service for a straightforward corporation." },
      { q: "Does an Ontario corporation automatically get a CRA Business Number?", a: "Yes. When a corporation is incorporated in Ontario, the Canada Revenue Agency automatically assigns it a Business Number and a corporation income tax program account. Other accounts, such as GST/HST and payroll, are opened separately when the business needs them. The corporation files a T2 return each year, which also covers Ontario corporate income tax." },
    ],
  },

  fr: {
    readTime: "14 min de lecture",
    content: [
      p("Pour vous constituer en société en Ontario, vous choisissez un nom (ou acceptez un nom à matricule), déposez des statuts constitutifs au Registre des entreprises de l'Ontario en payant les frais gouvernementaux de 300 $, puis organisez la nouvelle société au moyen de règlements administratifs, de résolutions d'organisation, d'une émission d'actions et d'un livre des procès-verbaux. Une société nominative exige un rapport NUANS à pondération ontarienne daté d'au plus 90 jours avant le dépôt. Déposés en ligne, les statuts sont traités immédiatement. Dans les 60 jours suivant la constitution, la société dépose une déclaration initiale, pour laquelle il n'y a aucuns frais gouvernementaux."),
      p("Les sociétés ontariennes sont régies par la Loi sur les sociétés par actions de l'Ontario (LSAO), et leurs dépôts d'information publique, comme la déclaration initiale, la déclaration annuelle et les avis de modification, relèvent de la Loi sur les renseignements exigés des personnes morales. Les deux sont administrées par le Registre des entreprises de l'Ontario (REO), le registre en ligne de la province lancé en octobre 2021. Ce guide passe en revue chaque étape dans l'ordre, ce que la loi exige à chacune et la comparaison entre une société ontarienne et une société fédérale."),

      { type: "heading", id: "ce-qui-est-requis", text: "Ce qui est requis pour se constituer en Ontario" },
      { type: "list", items: [
        "Une dénomination sociale : soit un nom proposé appuyé par un rapport NUANS à pondération ontarienne, soit un nom à matricule attribué par le registre.",
        "Des statuts constitutifs indiquant les catégories d'actions, toute restriction au transfert d'actions ou aux activités, le nombre d'administrateurs, les premiers administrateurs et l'adresse du siège social.",
        "Un ou plusieurs fondateurs. Un fondateur peut être un particulier ou une société. Un particulier doit avoir au moins 18 ans, ne pas avoir été déclaré incapable de gérer des biens et ne pas avoir le statut de failli (LSAO, art. 4).",
        "Au moins un administrateur, qui doit être un particulier. L'Ontario n'impose aucune exigence de résidence canadienne aux administrateurs.",
        "Un siège social situé à une adresse physique en Ontario. Une simple case postale n'est pas acceptable.",
        "Le consentement signé de chaque premier administrateur qui n'est pas fondateur, conservé au siège social (LSAO, art. 5).",
      ] },

      { type: "heading", id: "etapes", text: "Se constituer en Ontario, étape par étape" },
      { type: "list", items: [
        "Étape 1. Choisir entre une société nominative et une société à matricule.",
        "Étape 2. Pour une société nominative, commander un rapport NUANS à pondération ontarienne et vérifier le nom au regard des règles ontariennes.",
        "Étape 3. Arrêter la structure d'actions, le nombre d'administrateurs, les premiers administrateurs et l'adresse du siège social.",
        "Étape 4. Déposer les statuts constitutifs au Registre des entreprises de l'Ontario et payer les frais gouvernementaux de 300 $.",
        "Étape 5. Recevoir le certificat de constitution et le numéro de société de l'Ontario.",
        "Étape 6. Organiser la société : règlements administratifs, résolutions d'organisation, émission d'actions, dirigeants et livre des procès-verbaux.",
        "Étape 7. Déposer la déclaration initiale dans les 60 jours suivant la constitution.",
        "Étape 8. Ouvrir auprès de l'ARC les comptes fiscaux dont l'entreprise a besoin, à l'aide du numéro d'entreprise attribué à la constitution.",
      ] },
      p("Les sections qui suivent détaillent chaque étape."),

      { type: "heading", id: "nominative-ou-matricule", text: "Société nominative ou société à matricule" },
      p("Une société nominative porte un nom choisi par ses fondateurs, par exemple « Maplewind Consulting Inc. ». Selon l'article 10 de la LSAO, le nom doit comporter l'un des éléments juridiques Limited, Limitée, Incorporated, Incorporée ou Corporation, ou les abréviations Ltd., Ltée, Inc. ou Corp. Le nom doit aussi être assez distinctif pour ne pas prêter à confusion avec un nom existant, ce que le rapport NUANS sert à établir."),
      p("Si les statuts n'indiquent aucun nom, le registre attribue à la société un nom à matricule fondé sur son numéro de société de l'Ontario, par exemple 1234567 Ontario Inc. (LSAO, art. 8). Une société à matricule n'a pas besoin de rapport NUANS, ce qui la rend plus rapide et moins coûteuse à constituer. Pour faire affaire sous une marque, elle peut enregistrer un ", L("nom commercial", "/services/business-name"), " en vertu de la Loi sur les noms commerciaux pour 60 $, renouvelable tous les cinq ans, ou changer plus tard sa dénomination par des ", L("statuts de modification", "/services/articles-amendment"), ". Notre guide sur la ", L("société nominative ou à matricule", "/guides/societe-nominative-ou-a-matricule"), " examine les avantages et inconvénients."),

      { type: "heading", id: "nuans", text: "Le rapport NUANS" },
      p("Une société ontarienne nominative exige un ", L("rapport NUANS à pondération ontarienne", "/nuans"), ". NUANS compare le nom proposé aux dénominations sociales, noms commerciaux et marques de commerce existants partout au Canada, et le rapport énumère les correspondances les plus proches. Le rapport doit être daté d'au plus 90 jours avant le dépôt des statuts, et un rapport à pondération fédérale n'est pas accepté pour un dépôt ontarien. Le gouvernement de l'Ontario ne vend pas de rapports NUANS; on les commande auprès d'une maison de recherche privée, qui fixe son propre prix."),
      p("Le registre n'examine pas le nom à votre place avant d'accepter les statuts. Si une société se retrouve avec un nom non conforme à la LSAO, le directeur peut le modifier plus tard en délivrant un certificat de modification, après avoir donné à la société l'occasion d'être entendue (LSAO, art. 12). La plupart des demandeurs réduisent ce risque en lisant le rapport avant le dépôt. Pour comprendre le fonctionnement de la recherche et la marche à suivre en cas de refus, consultez notre guide sur la ", L("recherche de nom NUANS", "/guides/recherche-de-nom-nuans"), "."),

      { type: "heading", id: "administrateurs", text: "Administrateurs et dirigeants" },
      p("Une société qui ne fait pas appel public à l'épargne doit compter au moins un administrateur, et une société qui fait appel public à l'épargne en exige au moins trois (LSAO, art. 115). Les statuts prévoient soit un nombre fixe d'administrateurs, soit un minimum et un maximum. La plupart des petites sociétés fermées retiennent une fourchette, ce qui permet d'ajouter des administrateurs plus tard."),
      p("Un administrateur doit être un particulier âgé d'au moins 18 ans, qui n'a pas été déclaré incapable de gérer des biens et qui n'a pas le statut de failli (LSAO, art. 118). Sauf disposition contraire des statuts, un administrateur n'a pas à détenir d'actions. L'Ontario exigeait auparavant qu'au moins 25 % des administrateurs soient des résidents canadiens. Cette exigence a été abrogée le 5 juillet 2021, de sorte qu'une société ontarienne peut désormais avoir un conseil composé entièrement de non-résidents. Une société fédérale doit toujours compter au moins 25 % d'administrateurs résidents canadiens, ou au moins un si elle a moins de quatre administrateurs (LCSA, art. 105)."),
      p("Les premiers administrateurs nommés dans les statuts occupent leur poste depuis la constitution jusqu'à la première assemblée des actionnaires (LSAO, art. 119). Les dirigeants, comme le président et le secrétaire, ne figurent pas dans les statuts; les administrateurs les nomment après la constitution. Tout ", L("changement d'administrateurs", "/services/change-director"), " ou de dirigeants est ensuite déclaré au registre par un ", L("avis de modification", "/services/notice-of-change"), " dans les 15 jours."),

      { type: "heading", id: "siege-social", text: "Siège social" },
      p("Une société ontarienne doit avoir en tout temps un siège social en Ontario (LSAO, art. 14). L'adresse doit être un lieu physique; une simple case postale n'est pas acceptée. L'adresse du siège social figure au registre public, et les registres de la société y sont conservés, à moins que les administrateurs ne désignent un autre lieu en Ontario. Les administrateurs peuvent déplacer le siège dans la même municipalité par résolution, tandis qu'un déménagement dans une autre municipalité exige une résolution spéciale des actionnaires. Dans les deux cas, le ", L("changement d'adresse", "/services/change-address"), " est déclaré au registre."),
      p("Comme l'adresse est publique, de nombreux propriétaires qui travaillent à domicile font appel à un ", L("service de siège social", "/services/registered-office"), " afin que leur adresse personnelle n'apparaisse pas au registre."),

      { type: "heading", id: "structure-actions", text: "Structure d'actions" },
      p("Les statuts indiquent les catégories d'actions que la société peut émettre, tout nombre maximal d'actions de chaque catégorie, ainsi que les droits, privilèges, restrictions et conditions rattachés à chacune. La structure la plus simple comporte une seule catégorie d'actions ordinaires donnant droit de vote et droit aux dividendes. De nombreuses sociétés dirigées par leur propriétaire autorisent plutôt plusieurs catégories, par exemple des actions avec et sans droit de vote ou des catégories pouvant recevoir des dividendes séparément, afin de laisser de la place à des membres de la famille, à des associés ou à une future société de portefeuille."),
      p("Les sociétés fermées restreignent habituellement le transfert de leurs actions dans leurs statuts, généralement en exigeant l'approbation des administrateurs. Ce type de restriction fait partie de ce qui permet à une société fermée de se prévaloir de la dispense pour émetteur fermé prévue par la législation en valeurs mobilières lorsqu'elle émet des actions à ses fondateurs, à des membres de la famille et à des proches."),
      p("Comme les catégories d'actions influent sur le contrôle, les dividendes et la planification fiscale, de nombreux propriétaires font examiner la structure par un comptable ou un avocat avant le dépôt, puisque la modifier plus tard exige des statuts de modification. Lorsqu'il y a plus d'un actionnaire, une ", L("convention entre actionnaires", "/guides/convention-actionnaires-canada"), " accompagne habituellement les statuts. Notre guide sur les ", L("statuts constitutifs", "/guides/que-sont-les-statuts-constitutifs"), " explique chaque partie du document."),

      { type: "heading", id: "depot", text: "Le dépôt au Registre des entreprises de l'Ontario" },
      p("Les statuts constitutifs se déposent au REO, directement ou par l'entremise d'un intermédiaire comme un avocat ou un service de constitution. Les frais gouvernementaux sont de 300 $, quel que soit le mode de dépôt. Déposée en ligne, la constitution est traitée immédiatement; par la poste, ServiceOntario indique un délai de traitement d'environ 15 jours ouvrables. Les statuts sont signés par les fondateurs, et le rapport NUANS doit encore être dans sa période de 90 jours à la date du dépôt. Une fois les statuts approuvés, le registre délivre le certificat de constitution, et la société existe à compter de la date qui y figure."),

      { type: "heading", id: "couts", text: "Coûts" },
      { type: "table", head: ["Élément", "Frais gouvernementaux", "Remarques"], rows: [
        ["Statuts constitutifs", "300 $", "Mêmes frais en ligne ou par la poste"],
        ["Rapport NUANS à pondération ontarienne", "Pas des frais gouvernementaux", "Sociétés nominatives seulement; le prix est fixé par la maison de recherche privée"],
        ["Déclaration initiale", "0 $", "Dans les 60 jours suivant la constitution"],
        ["Déclaration annuelle", "0 $", "Chaque année, dans les six mois suivant la fin de l'exercice"],
        ["Enregistrement d'un nom commercial", "60 $", "Seulement pour faire affaire sous un autre nom; renouvelable tous les cinq ans"],
        ["Livre des procès-verbaux", "Aucuns frais gouvernementaux", "Registres exigés par la LSAO; préparés par la société ou un fournisseur"],
      ] },
      p("Les honoraires professionnels ou frais de service s'ajoutent aux frais gouvernementaux, et la TVH s'applique à ces honoraires, non aux 300 $ perçus par le gouvernement. Pour une ventilation complète, y compris les coûts ponctuels et récurrents et les postes souvent oubliés, consultez notre guide sur le ", L("coût pour constituer une société en Ontario", "/guides/cout-pour-constituer-une-societe-en-ontario"), "."),

      { type: "heading", id: "delais", text: "Délais" },
      p("Pour une constitution ontarienne simple, le calendrier type est le suivant :"),
      { type: "list", items: [
        "Nom : un rapport NUANS est habituellement produit le jour même de la commande. Une société à matricule saute cette étape.",
        "Statuts constitutifs : préparés une fois le nom, la structure d'actions, les administrateurs et le siège social arrêtés.",
        "Dépôt : traité immédiatement en ligne, ou en environ 15 jours ouvrables par la poste.",
        "Numéro d'entreprise : attribué automatiquement par l'ARC après la constitution.",
        "Résolutions d'organisation et livre des procès-verbaux : habituellement réalisés tout de suite après la constitution, puisque les banques les demandent à l'ouverture du compte.",
        "Déclaration initiale : exigible dans les 60 jours suivant la constitution.",
      ] },

      { type: "heading", id: "ce-que-vous-recevez", text: "Ce que vous recevez après le dépôt" },
      { type: "list", items: [
        "Un certificat de constitution indiquant la date de constitution et le numéro de société de l'Ontario.",
        "Les statuts constitutifs tels que déposés.",
        "L'accès au dossier de la société au Registre des entreprises de l'Ontario. Les dépôts ultérieurs se font avec la clé d'entreprise de la société, un code de 9 chiffres propre à l'entreprise qui doit demeurer confidentiel.",
        "Un numéro d'entreprise et un compte de programme d'impôt sur le revenu des sociétés de l'ARC, attribués automatiquement après la constitution.",
      ] },

      { type: "heading", id: "organisation", text: "Organiser la société : règlements administratifs, résolutions et livre des procès-verbaux" },
      p("Le dépôt des statuts crée la société, mais il n'émet aucune action et ne nomme aucun dirigeant. L'article 117 de la LSAO prévoit une réunion des administrateurs après la constitution, au cours de laquelle ils peuvent adopter des règlements administratifs, adopter des modèles de certificats d'actions et de registres, autoriser l'émission d'actions, nommer les dirigeants, nommer un vérificateur jusqu'à la première assemblée des actionnaires et prendre des arrangements bancaires. Ces questions peuvent aussi être réglées par une résolution écrite signée par tous les administrateurs, ce que font la plupart des sociétés fermées."),
      p("Les règlements administratifs fixent les règles internes : la tenue des réunions des administrateurs et des actionnaires, les signataires autorisés et les modalités bancaires de la société. Les règlements adoptés par les administrateurs sont soumis aux actionnaires pour confirmation à leur prochaine assemblée (LSAO, art. 116). Une société qui ne fait pas appel public à l'épargne peut aussi être dispensée de nommer un vérificateur pour un exercice si tous ses actionnaires y consentent par écrit (LSAO, art. 148)."),
      p("Tout cela est consigné au livre des procès-verbaux. La LSAO oblige chaque société à tenir, à son siège social ou en un autre lieu de l'Ontario désigné par les administrateurs, ses statuts et règlements administratifs, les procès-verbaux et résolutions des actionnaires et des administrateurs, un registre des administrateurs, un registre des valeurs mobilières et des documents comptables adéquats (LSAO, art. 140 et 141). Depuis le 1er janvier 2023, les sociétés ontariennes doivent aussi tenir un registre des particuliers ayant un contrôle important, qui vise notamment les particuliers détenant ou contrôlant 25 % ou plus des droits de vote ou de la juste valeur marchande des actions (LSAO, art. 140.2)."),
      p("Les banques, les acheteurs, les prêteurs et l'ARC peuvent tous demander à consulter le livre des procès-verbaux. Un ", L("livre des procès-verbaux initial", "/services/initial-minute-book"), " préparé à la constitution met ces documents en place dès le premier jour, et notre ", L("guide sur le livre des procès-verbaux", "/guides/quest-ce-quun-livre-des-proces-verbaux"), " explique ce qu'il contient."),

      { type: "heading", id: "declaration-initiale", text: "La déclaration initiale : exigible dans les 60 jours" },
      p("Selon l'article 2 de la Loi sur les renseignements exigés des personnes morales, chaque société ontarienne doit déposer une ", L("déclaration initiale", "/services/initial-return-on"), " dans les 60 jours suivant la date de sa constitution. Elle confirme au registre public les administrateurs, les dirigeants et le siège social de la société. Il n'y a aucuns frais gouvernementaux. La déclaration initiale est facile à oublier parce que les statuts viennent tout juste d'être déposés, mais il s'agit d'une obligation légale distincte."),
      p("Par la suite, la société déclare les changements par un avis de modification dans les 15 jours suivant le changement (Loi sur les renseignements exigés des personnes morales, art. 4) et dépose une ", L("déclaration annuelle ontarienne", "/services/annual-return-on"), " au REO chaque année, dans les six mois suivant la fin de son exercice. La déclaration annuelle n'entraîne pas non plus de frais gouvernementaux, mais une société qui cesse de la produire peut finir par être dissoute. Notre guide sur les ", L("déclarations annuelles des sociétés", "/guides/declarations-annuelles-societes-canada"), " explique le cycle annuel."),

      { type: "heading", id: "numero-entreprise", text: "Numéro d'entreprise de l'ARC et comptes fiscaux" },
      p("Lorsqu'une société est constituée en Ontario, l'Agence du revenu du Canada lui attribue automatiquement un ", L("numéro d'entreprise", "/services/business-number"), " (NE) et un compte de programme d'impôt sur le revenu des sociétés. La société produit chaque année une déclaration de revenus des sociétés T2, qu'elle ait gagné un revenu ou non, et l'ARC administre l'impôt des sociétés de l'Ontario, de sorte qu'une seule T2 couvre les deux."),
      p("Les autres comptes de programme sont ouverts au besoin. Un compte de TPS/TVH est exigé dès que la société cesse d'être un petit fournisseur, ce qui se produit lorsque ses revenus taxables dépassent 30 000 $ au cours d'un seul trimestre civil ou de quatre trimestres civils consécutifs; l'inscription volontaire avant ce seuil est permise. Un compte de programme de retenues sur la paie est nécessaire lorsque la société verse des salaires, y compris à son propriétaire. Nos guides pour ", L("obtenir un numéro d'entreprise de l'ARC", "/guides/comment-obtenir-un-numero-dentreprise-arc"), " et ", L("obtenir un numéro de TPS/TVH en Ontario", "/guides/comment-obtenir-numero-tps-tvh-ontario"), " expliquent l'inscription."),

      { type: "heading", id: "ontario-ou-federal", text: "Constitution ontarienne ou fédérale" },
      p("Une entreprise établie en Ontario peut se constituer sous le régime de la LSAO ou au fédéral sous le régime de la Loi canadienne sur les sociétés par actions (LCSA). L'une comme l'autre peut exercer ses activités en Ontario. Voici les principales différences."),
      { type: "table", head: ["", "Ontario (LSAO)", "Fédéral (LCSA)"], rows: [
        ["Registre", "Registre des entreprises de l'Ontario", "Corporations Canada"],
        ["Frais de dépôt gouvernementaux", "300 $", "200 $"],
        ["Recherche de nom", "Rapport NUANS à pondération ontarienne pour une société nominative", "Aucun rapport NUANS distinct; la recherche de nom fait partie du processus fédéral"],
        ["Résidence des administrateurs", "Aucune exigence", "Au moins 25 % de résidents canadiens (au moins un s'il y a moins de quatre administrateurs)"],
        ["Protection du nom", "Ontario", "Partout au Canada"],
        ["Déclaration annuelle", "0 $, dans les six mois suivant la fin de l'exercice", "12 $, dans les 60 jours suivant la date anniversaire"],
        ["Activités en Ontario", "Rien de plus à enregistrer", "Déclaration initiale ontarienne dans les 60 jours suivant le début des activités en Ontario"],
        ["Activités dans d'autres provinces", "Enregistrement extraprovincial dans chaque province", "Enregistrement extraprovincial dans chaque province"],
      ] },
      p("Une entreprise qui exercera surtout ses activités en Ontario ne traite qu'avec un seul registre en tant que société ontarienne. Une société fédérale convient aux entreprises qui prévoient exercer leurs activités dans plusieurs provinces ou qui veulent une protection nationale du nom, mais elle produit des dépôts auprès de Corporations Canada et de l'Ontario, ainsi que de toute autre province où elle exerce ses activités au moyen d'un ", L("enregistrement extraprovincial", "/services/extra-provincial"), ". Notre guide sur la ", L("constitution fédérale ou provinciale", "/guides/comment-se-constituer-societe-canada"), " approfondit la comparaison."),

      { type: "heading", id: "apres-constitution", text: "Après la constitution" },
      p("Une fois la société constituée et organisée, il reste quelques étapes pratiques :"),
      { type: "list", items: [
        "Émettre les actions initiales aux fondateurs et les inscrire au registre des valeurs mobilières, avec des certificats d'actions si la société en utilise.",
        "Ouvrir un compte bancaire d'entreprise. Les banques demandent généralement le certificat et les statuts constitutifs, une résolution bancaire et une pièce d'identité des dirigeants signataires.",
        "S'inscrire à la TPS/TVH, aux retenues sur la paie et à tout autre compte de l'ARC dont l'entreprise a besoin.",
        "Enregistrer tout nom commercial différent de la dénomination sociale.",
        "Vérifier si l'entreprise a besoin de permis municipaux ou sectoriels.",
        "Inscrire au calendrier les échéances récurrentes : la déclaration annuelle ontarienne, la déclaration T2 et les résolutions annuelles des administrateurs et des actionnaires.",
      ] },
      p("Les résolutions annuelles ne sont pas déposées auprès du gouvernement, mais elles tiennent le livre des procès-verbaux à jour, et un ", L("service de résolutions annuelles", "/services/annual-resolution-on"), " peut les préparer chaque année. Notre guide sur l'", L("ouverture d'un compte bancaire d'entreprise au Canada", "/guides/compte-bancaire-entreprise-canada"), " décrit ce que demandent les banques."),
      { type: "callout", title: "Un oubli fréquent", text: "La déclaration initiale est exigible dans les 60 jours suivant la constitution et confirme au registre public les administrateurs, les dirigeants et le siège social. Elle n'entraîne aucuns frais gouvernementaux et se produit rapidement en ligne, mais elle est distincte des statuts et facile à oublier dans les semaines qui suivent la constitution." },
      p("Korporex constitue des sociétés ontariennes en ligne, en prenant en charge ensemble le rapport NUANS, le dépôt, la structure d'actions et le livre des procès-verbaux initial. Vous pouvez ", L("lancer votre constitution en Ontario", "/incorporate"), " en ligne, ou lire notre guide pour ", L("enregistrer une entreprise en Ontario", "/guides/comment-enregistrer-entreprise-ontario"), " afin de comparer une société avec une entreprise individuelle ou une société de personnes."),
    ],
    faq: [
      { q: "Combien de temps faut-il pour se constituer en société en Ontario?", a: "Déposés en ligne au Registre des entreprises de l'Ontario, les statuts constitutifs sont traités immédiatement, de sorte qu'une société peut exister le jour même où ses documents sont prêts. Un rapport NUANS pour une société nominative est habituellement produit le jour de la commande. Par la poste, le dépôt prend environ 15 jours ouvrables. La déclaration initiale suit dans les 60 jours." },
      { q: "Un non-résident peut-il être administrateur d'une société ontarienne?", a: "Oui. L'Ontario a abrogé, le 5 juillet 2021, l'exigence selon laquelle au moins 25 % des administrateurs devaient être des résidents canadiens. Une société ontarienne peut désormais avoir un conseil composé entièrement de non-résidents, pourvu que chaque administrateur soit un particulier d'au moins 18 ans, non failli et non déclaré incapable. Une société fédérale reste soumise à une exigence de résidence." },
      { q: "Faut-il un rapport NUANS pour se constituer en Ontario?", a: "Seulement pour une société nominative. Une société ontarienne nominative exige un rapport NUANS à pondération ontarienne daté d'au plus 90 jours avant le dépôt des statuts, et un rapport à pondération fédérale n'est pas accepté. Une société à matricule, qui reçoit un nom à matricule attribué par le registre, n'a besoin d'aucun rapport NUANS." },
      { q: "Qu'est-ce que la déclaration initiale et quand est-elle exigible?", a: "La déclaration initiale est un dépôt prévu par la Loi sur les renseignements exigés des personnes morales de l'Ontario qui confirme au registre public les administrateurs, les dirigeants et le siège social de la société. Chaque société ontarienne doit la déposer dans les 60 jours suivant sa constitution. Elle n'entraîne aucuns frais gouvernementaux et se dépose au Registre des entreprises de l'Ontario." },
      { q: "Faut-il un avocat pour se constituer en société en Ontario?", a: "Non. La loi ontarienne n'exige pas d'avocat pour déposer des statuts constitutifs, qui peuvent être déposés directement au Registre des entreprises de l'Ontario. De nombreux propriétaires font appel à un avocat lorsque la situation sort de l'ordinaire, par exemple plusieurs fondateurs, des investisseurs externes, une société de portefeuille ou une société professionnelle, et à un service en ligne pour une société simple." },
      { q: "Une société ontarienne obtient-elle automatiquement un numéro d'entreprise de l'ARC?", a: "Oui. Lorsqu'une société est constituée en Ontario, l'Agence du revenu du Canada lui attribue automatiquement un numéro d'entreprise et un compte de programme d'impôt sur le revenu des sociétés. Les autres comptes, comme la TPS/TVH et les retenues sur la paie, s'ouvrent séparément au besoin. La société produit chaque année une T2, qui couvre aussi l'impôt des sociétés de l'Ontario." },
    ],
  },

  es: {
    readTime: "14 min de lectura",
    content: [
      p("Para constituirse en sociedad en Ontario, usted elige un nombre (o acepta un nombre numérico), presenta los estatutos de constitución ante el Registro de Empresas de Ontario con la tarifa gubernamental de 300 $ y luego organiza la nueva sociedad con estatutos internos, resoluciones de organización, una emisión de acciones y un libro de actas. Una sociedad con nombre necesita un informe NUANS orientado a Ontario con fecha de 90 días o menos antes de la presentación. Presentados en línea, los estatutos se tramitan de inmediato. Dentro de los 60 días siguientes a la constitución, la sociedad presenta una declaración inicial, que no tiene tarifa gubernamental."),
      p("Las sociedades de Ontario se rigen por la Ley de Sociedades por Acciones de Ontario (OBCA), y sus presentaciones de información pública, como la declaración inicial, la declaración anual y los avisos de cambio, se rigen por la Corporations Information Act (Ley de Información de Sociedades). Ambas se administran a través del Registro de Empresas de Ontario (OBR), el registro en línea de la provincia, que se lanzó en octubre de 2021. Esta guía recorre cada paso en orden, lo que exige la ley en cada uno y cómo se compara una sociedad de Ontario con una federal."),

      { type: "heading", id: "que-se-requiere", text: "Qué se requiere para constituirse en Ontario" },
      { type: "list", items: [
        "Un nombre de sociedad: ya sea un nombre propuesto respaldado por un informe NUANS orientado a Ontario, o un nombre numérico asignado por el registro.",
        "Estatutos de constitución que indiquen las clases de acciones, cualquier restricción a la transferencia de acciones o a las actividades, el número de directores, los primeros directores y la dirección del domicilio social.",
        "Uno o más constituyentes. Un constituyente puede ser una persona física o una sociedad. Una persona física debe tener al menos 18 años, no haber sido declarada incapaz de administrar bienes y no tener la condición de quebrada (OBCA, art. 4).",
        "Al menos un director, que debe ser una persona física. Ontario no impone ningún requisito de residencia canadiense a los directores.",
        "Un domicilio social en una dirección física en Ontario. Una simple casilla de correo no es aceptable.",
        "El consentimiento firmado de cada primer director que no sea constituyente, conservado en el domicilio social (OBCA, art. 5).",
      ] },

      { type: "heading", id: "pasos", text: "Cómo constituirse en Ontario, paso a paso" },
      { type: "list", items: [
        "Paso 1. Decidir entre una sociedad con nombre y una sociedad numérica.",
        "Paso 2. Para una sociedad con nombre, encargar un informe NUANS orientado a Ontario y verificar el nombre frente a las reglas de Ontario.",
        "Paso 3. Definir la estructura de acciones, el número de directores, los primeros directores y la dirección del domicilio social.",
        "Paso 4. Presentar los estatutos de constitución ante el Registro de Empresas de Ontario y pagar la tarifa gubernamental de 300 $.",
        "Paso 5. Recibir el certificado de constitución y el número de sociedad de Ontario.",
        "Paso 6. Organizar la sociedad: estatutos internos, resoluciones de organización, emisión de acciones, funcionarios y libro de actas.",
        "Paso 7. Presentar la declaración inicial dentro de los 60 días siguientes a la constitución.",
        "Paso 8. Abrir ante la CRA las cuentas fiscales que necesite el negocio, con el número de negocio asignado al constituirse.",
      ] },
      p("Las secciones siguientes explican cada paso con más detalle."),

      { type: "heading", id: "con-nombre-o-numerica", text: "Sociedad con nombre o sociedad numérica" },
      p("Una sociedad con nombre lleva un nombre elegido por sus fundadores, por ejemplo «Maplewind Consulting Inc.». Según el artículo 10 de la OBCA, el nombre debe incluir uno de los elementos legales Limited, Limitée, Incorporated, Incorporée o Corporation, o las abreviaturas Ltd., Ltée, Inc. o Corp. El nombre también debe ser lo bastante distintivo para no confundirse con un nombre existente, que es para lo que sirve el informe NUANS."),
      p("Si los estatutos no indican ningún nombre, el registro asigna a la sociedad un nombre numérico basado en su número de sociedad de Ontario, por ejemplo 1234567 Ontario Inc. (OBCA, art. 8). Una sociedad numérica no necesita informe NUANS, por lo que se constituye de forma más rápida y económica. Para operar bajo una marca, puede registrar un ", L("nombre comercial", "/services/business-name"), " conforme a la Business Names Act por 60 $, renovable cada cinco años, o cambiar más adelante su denominación mediante ", L("estatutos de modificación", "/services/articles-amendment"), ". Nuestra guía sobre la ", L("sociedad con nombre o numerada", "/guides/sociedad-con-nombre-o-numerada"), " analiza las ventajas y desventajas."),

      { type: "heading", id: "nuans", text: "El informe NUANS" },
      p("Una sociedad de Ontario con nombre necesita un ", L("informe NUANS orientado a Ontario", "/nuans"), ". NUANS compara el nombre propuesto con las denominaciones sociales, nombres comerciales y marcas existentes en todo Canadá, y el informe enumera las coincidencias más cercanas. El informe debe tener fecha de 90 días o menos antes de la presentación de los estatutos, y un informe orientado al ámbito federal no se acepta para una presentación en Ontario. El gobierno de Ontario no vende informes NUANS; se encargan a una casa de búsqueda privada, que fija su propio precio."),
      p("El registro no examina el nombre por usted antes de aceptar los estatutos. Si una sociedad termina con un nombre que no cumple con la OBCA, el Director puede cambiarlo más adelante emitiendo un certificado de modificación, después de dar a la sociedad la oportunidad de ser oída (OBCA, art. 12). La mayoría de los solicitantes reducen ese riesgo leyendo el informe antes de presentar. Para saber cómo funciona la búsqueda y qué hacer si se rechaza un nombre, consulte nuestra guía sobre la ", L("búsqueda de nombre NUANS", "/guides/busqueda-de-nombre-nuans"), "."),

      { type: "heading", id: "directores", text: "Directores y funcionarios" },
      p("Una sociedad que no hace oferta pública debe tener al menos un director, y una sociedad que hace oferta pública necesita al menos tres (OBCA, art. 115). Los estatutos fijan un número determinado de directores o bien un mínimo y un máximo. La mayoría de las pequeñas sociedades cerradas usan un rango, lo que deja margen para agregar directores más adelante."),
      p("Un director debe ser una persona física de al menos 18 años, que no haya sido declarada incapaz de administrar bienes y que no tenga la condición de quebrada (OBCA, art. 118). Salvo que los estatutos digan otra cosa, un director no necesita ser accionista. Ontario exigía antes que al menos el 25 % de los directores fueran residentes canadienses. Ese requisito se derogó con efecto el 5 de julio de 2021, por lo que una sociedad de Ontario puede tener hoy un consejo formado totalmente por no residentes. Una sociedad federal sigue necesitando al menos un 25 % de directores residentes canadienses, o al menos uno si tiene menos de cuatro directores (CBCA, art. 105)."),
      p("Los primeros directores nombrados en los estatutos ejercen el cargo desde la constitución hasta la primera asamblea de accionistas (OBCA, art. 119). Los funcionarios, como el presidente y el secretario, no figuran en los estatutos; los directores los nombran después de la constitución. Cualquier ", L("cambio de directores", "/services/change-director"), " o funcionarios posterior se informa al registro mediante un ", L("aviso de cambio", "/services/notice-of-change"), " dentro de los 15 días."),

      { type: "heading", id: "domicilio-social", text: "Domicilio social" },
      p("Una sociedad de Ontario debe tener en todo momento un domicilio social en Ontario (OBCA, art. 14). La dirección debe ser un lugar físico; una simple casilla de correo no se acepta. La dirección del domicilio social figura en el registro público, y los registros de la sociedad se conservan allí, salvo que los directores designen otro lugar en Ontario. Los directores pueden trasladar el domicilio dentro del mismo municipio por resolución, mientras que un traslado a otro municipio exige una resolución especial de los accionistas. En ambos casos, el ", L("cambio de dirección", "/services/change-address"), " se informa al registro."),
      p("Como la dirección es pública, muchos propietarios que trabajan desde casa usan un ", L("servicio de domicilio social", "/services/registered-office"), " para que su dirección personal no aparezca en el registro."),

      { type: "heading", id: "estructura-de-acciones", text: "Estructura de acciones" },
      p("Los estatutos indican las clases de acciones que la sociedad puede emitir, cualquier número máximo de acciones de cada clase y los derechos, privilegios, restricciones y condiciones de cada una. La estructura más simple es una sola clase de acciones ordinarias con derecho a voto y a dividendos. Muchas sociedades dirigidas por su propietario autorizan en cambio varias clases, por ejemplo acciones con y sin derecho a voto o clases que pueden recibir dividendos por separado, para dejar lugar a familiares, socios o una futura sociedad de cartera."),
      p("Las sociedades cerradas suelen restringir la transferencia de acciones en sus estatutos, normalmente exigiendo la aprobación de los directores. Este tipo de restricción forma parte de lo que permite a una sociedad cerrada acogerse a la exención de emisor privado prevista en la legislación de valores cuando emite acciones a fundadores, familiares y allegados."),
      p("Como las clases de acciones influyen en el control, los dividendos y la planificación fiscal, muchos propietarios revisan la estructura con un contador o abogado antes de presentar, ya que cambiarla después exige estatutos de modificación. Cuando hay más de un accionista, un ", L("convenio de accionistas", "/guides/convenio-de-accionistas-canada"), " suele acompañar a los estatutos. Nuestra guía sobre los ", L("estatutos de constitución", "/guides/que-son-los-estatutos-de-constitucion"), " explica cada parte del documento."),

      { type: "heading", id: "presentacion", text: "La presentación ante el Registro de Empresas de Ontario" },
      p("Los estatutos de constitución se presentan en el OBR, directamente o a través de un intermediario como un abogado o un servicio de constitución. La tarifa gubernamental es de 300 $ con cualquier método. Presentada en línea, la constitución se tramita de inmediato; por correo, ServiceOntario indica un plazo de unos 15 días hábiles. Los estatutos los firman los constituyentes, y el informe NUANS debe seguir dentro de su plazo de 90 días en la fecha de presentación. Una vez aprobados, el registro emite el certificado de constitución, y la sociedad existe desde la fecha que figura en él."),

      { type: "heading", id: "costos", text: "Costos" },
      { type: "table", head: ["Concepto", "Tarifa gubernamental", "Notas"], rows: [
        ["Estatutos de constitución", "300 $", "Misma tarifa en línea o por correo"],
        ["Informe NUANS orientado a Ontario", "No es una tarifa gubernamental", "Solo sociedades con nombre; el precio lo fija la casa de búsqueda privada"],
        ["Declaración inicial", "0 $", "Dentro de los 60 días siguientes a la constitución"],
        ["Declaración anual", "0 $", "Cada año, dentro de los seis meses posteriores al cierre del ejercicio"],
        ["Registro de nombre comercial", "60 $", "Solo para operar bajo otro nombre; se renueva cada cinco años"],
        ["Libro de actas", "Sin tarifa gubernamental", "Registros que exige la OBCA; los prepara la sociedad o un proveedor"],
      ] },
      p("Los honorarios profesionales o de servicio se suman a las tarifas gubernamentales, y el HST se aplica a esos honorarios, no a los 300 $ que cobra el gobierno. Para un desglose completo, incluidos los costos únicos y recurrentes y los gastos que suelen olvidarse, consulte nuestra guía sobre el ", L("costo para constituirse en sociedad en Ontario", "/guides/costo-para-constituirse-en-sociedad-en-ontario"), "."),

      { type: "heading", id: "plazos", text: "Plazos" },
      p("Para una constitución sencilla en Ontario, el calendario típico es:"),
      { type: "list", items: [
        "Nombre: un informe NUANS suele generarse el mismo día en que se encarga. Una sociedad numérica se salta este paso.",
        "Estatutos de constitución: se preparan una vez definidos el nombre, la estructura de acciones, los directores y el domicilio social.",
        "Presentación: se tramita de inmediato en línea, o en unos 15 días hábiles por correo.",
        "Número de negocio: la CRA lo asigna automáticamente después de la constitución.",
        "Resoluciones de organización y libro de actas: suelen completarse justo después de la constitución, ya que los bancos los piden al abrir la cuenta.",
        "Declaración inicial: vence dentro de los 60 días siguientes a la constitución.",
      ] },

      { type: "heading", id: "que-recibe", text: "Qué recibe después de presentar" },
      { type: "list", items: [
        "Un certificado de constitución con la fecha de constitución y el número de sociedad de Ontario.",
        "Los estatutos de constitución tal como se presentaron.",
        "Acceso al expediente de la sociedad en el Registro de Empresas de Ontario. Las presentaciones posteriores usan la clave de empresa (company key) de la sociedad, un código de 9 dígitos exclusivo de la empresa que debe mantenerse en reserva.",
        "Un número de negocio y una cuenta del programa de impuesto sobre la renta de sociedades de la CRA, asignados automáticamente después de la constitución.",
      ] },

      { type: "heading", id: "organizacion", text: "Organizar la sociedad: estatutos internos, resoluciones y libro de actas" },
      p("Presentar los estatutos crea la sociedad, pero no emite acciones ni nombra funcionarios. El artículo 117 de la OBCA prevé una reunión de los directores después de la constitución, en la que pueden adoptar estatutos internos, adoptar modelos de certificados de acciones y de registros, autorizar la emisión de acciones, nombrar funcionarios, nombrar un auditor hasta la primera asamblea de accionistas y hacer arreglos bancarios. Estos asuntos también pueden resolverse mediante una resolución escrita firmada por todos los directores, que es como lo hace la mayoría de las sociedades cerradas."),
      p("Los estatutos internos fijan las reglas internas: cómo se reúnen los directores y los accionistas, quién firma los documentos y cómo opera la sociedad con su banco. Los estatutos internos adoptados por los directores se someten a los accionistas para su confirmación en su próxima asamblea (OBCA, art. 116). Una sociedad que no hace oferta pública también puede quedar exenta de nombrar un auditor para un ejercicio si todos sus accionistas lo consienten por escrito (OBCA, art. 148)."),
      p("Todo esto se registra en el libro de actas. La OBCA obliga a toda sociedad a llevar, en su domicilio social o en otro lugar de Ontario designado por los directores, sus estatutos y estatutos internos, las actas y resoluciones de accionistas y directores, un registro de directores, un registro de valores y registros contables adecuados (OBCA, arts. 140 y 141). Desde el 1 de enero de 2023, las sociedades de Ontario también deben llevar un registro de personas con control significativo, que abarca, entre otras, a las personas que poseen o controlan el 25 % o más de los votos o del valor justo de mercado de las acciones (OBCA, art. 140.2)."),
      p("Los bancos, compradores, prestamistas y la CRA pueden pedir ver el libro de actas. Un ", L("libro de actas inicial", "/services/initial-minute-book"), " preparado al constituirse deja estos documentos en orden desde el primer día, y nuestra ", L("guía sobre el libro de actas", "/guides/que-es-un-libro-de-actas"), " explica lo que contiene."),

      { type: "heading", id: "declaracion-inicial", text: "La declaración inicial: vence dentro de los 60 días" },
      p("Según el artículo 2 de la Corporations Information Act, toda sociedad de Ontario debe presentar una ", L("declaración inicial", "/services/initial-return-on"), " dentro de los 60 días siguientes a la fecha de constitución. Esta confirma en el registro público los directores, los funcionarios y el domicilio social de la sociedad. No hay tarifa gubernamental. La declaración inicial es fácil de pasar por alto porque los estatutos se acaban de presentar, pero es una obligación legal aparte."),
      p("Después, la sociedad informa los cambios mediante un aviso de cambio dentro de los 15 días siguientes al cambio (Corporations Information Act, art. 4) y presenta una ", L("declaración anual de Ontario", "/services/annual-return-on"), " en el OBR cada año, dentro de los seis meses posteriores al cierre de su ejercicio. La declaración anual tampoco tiene tarifa gubernamental, pero una sociedad que deja de presentarla puede terminar disuelta. Nuestra guía sobre las ", L("declaraciones anuales de sociedades", "/guides/declaraciones-anuales-sociedades-canada"), " explica el ciclo anual."),

      { type: "heading", id: "numero-de-negocio", text: "Número de negocio de la CRA y cuentas fiscales" },
      p("Cuando una sociedad se constituye en Ontario, la Agencia de Ingresos de Canadá (CRA) le asigna automáticamente un ", L("número de negocio", "/services/business-number"), " (BN) y una cuenta del programa de impuesto sobre la renta de sociedades. La sociedad presenta cada año una declaración del impuesto de sociedades T2, haya obtenido ingresos o no, y la CRA administra el impuesto de sociedades de Ontario, por lo que una sola T2 cubre ambos."),
      p("Las demás cuentas de programa se abren según se necesiten. Se exige una cuenta de GST/HST cuando la sociedad deja de ser un pequeño proveedor, lo que ocurre cuando sus ingresos gravables superan 30 000 $ en un solo trimestre calendario o en cuatro trimestres calendario consecutivos; inscribirse voluntariamente antes está permitido. Se necesita una cuenta de nómina cuando la sociedad paga sueldos o salarios, incluso a su propietario. Nuestras guías para ", L("obtener un número de negocio de la CRA", "/guides/como-obtener-un-numero-de-negocio-cra"), " y ", L("obtener un número de GST/HST en Ontario", "/guides/como-obtener-numero-gst-hst-ontario"), " explican la inscripción."),

      { type: "heading", id: "ontario-o-federal", text: "Constitución en Ontario o federal" },
      p("Un negocio con sede en Ontario puede constituirse bajo la OBCA o a nivel federal bajo la Ley de Sociedades por Acciones de Canadá (CBCA). Cualquiera de las dos puede operar en Ontario. Las principales diferencias se resumen a continuación."),
      { type: "table", head: ["", "Ontario (OBCA)", "Federal (CBCA)"], rows: [
        ["Registro", "Registro de Empresas de Ontario", "Corporations Canada"],
        ["Tarifa gubernamental de presentación", "300 $", "200 $"],
        ["Búsqueda de nombre", "Informe NUANS orientado a Ontario para una sociedad con nombre", "Sin informe NUANS aparte; la búsqueda de nombre forma parte del proceso federal"],
        ["Residencia de los directores", "Sin requisito", "Al menos 25 % de residentes canadienses (al menos uno si hay menos de cuatro directores)"],
        ["Protección del nombre", "Ontario", "Todo Canadá"],
        ["Declaración anual", "0 $, dentro de los seis meses posteriores al cierre del ejercicio", "12 $, dentro de los 60 días siguientes a la fecha de aniversario"],
        ["Operar en Ontario", "Nada más que registrar", "Declaración inicial de Ontario dentro de los 60 días de comenzar a operar en Ontario"],
        ["Operar en otras provincias", "Registro extraprovincial en cada provincia", "Registro extraprovincial en cada provincia"],
      ] },
      p("Un negocio que operará principalmente en Ontario trata con un solo registro como sociedad de Ontario. Una sociedad federal conviene a los negocios que prevén operar en varias provincias o que quieren protección nacional del nombre, pero presenta documentos ante Corporations Canada y ante Ontario, además de cualquier otra provincia donde opere mediante un ", L("registro extraprovincial", "/services/extra-provincial"), ". Nuestra guía sobre la ", L("constitución federal o provincial", "/guides/como-constituirse-sociedad-canada"), " profundiza en la comparación."),

      { type: "heading", id: "despues-de-constituir", text: "Después de la constitución" },
      p("Una vez que la sociedad existe y está organizada, quedan algunos pasos prácticos:"),
      { type: "list", items: [
        "Emitir las acciones iniciales a los fundadores e inscribirlas en el registro de valores, con certificados de acciones si la sociedad los usa.",
        "Abrir una cuenta bancaria empresarial. Los bancos suelen pedir el certificado y los estatutos de constitución, una resolución bancaria y una identificación de los funcionarios firmantes.",
        "Inscribirse en GST/HST, nómina y cualquier otra cuenta de la CRA que necesite el negocio.",
        "Registrar cualquier nombre comercial distinto de la denominación social.",
        "Verificar si el negocio necesita licencias municipales o permisos del sector.",
        "Agendar los plazos recurrentes: la declaración anual de Ontario, la declaración T2 y las resoluciones anuales de directores y accionistas.",
      ] },
      p("Las resoluciones anuales no se presentan ante el gobierno, pero mantienen al día el libro de actas, y un ", L("servicio de resoluciones anuales", "/services/annual-resolution-on"), " puede prepararlas cada año. Nuestra guía para ", L("abrir una cuenta bancaria empresarial en Canadá", "/guides/cuenta-bancaria-empresarial-canada"), " explica lo que piden los bancos."),
      { type: "callout", title: "Un descuido común", text: "La declaración inicial vence dentro de los 60 días siguientes a la constitución y confirma en el registro público los directores, los funcionarios y el domicilio social. No tiene tarifa gubernamental y es una presentación en línea breve, pero es independiente de los estatutos y fácil de olvidar en las semanas posteriores a la constitución." },
      p("Korporex constituye sociedades de Ontario en línea, y se encarga en conjunto del informe NUANS, la presentación, la estructura de acciones y el libro de actas inicial. Puede ", L("iniciar su constitución en Ontario", "/incorporate"), " en línea, o leer nuestra guía para ", L("registrar un negocio en Ontario", "/guides/como-registrar-negocio-ontario"), " y comparar una sociedad con una empresa unipersonal o una sociedad colectiva."),
    ],
    faq: [
      { q: "¿Cuánto tiempo toma constituirse en sociedad en Ontario?", a: "Presentados en línea en el Registro de Empresas de Ontario, los estatutos de constitución se tramitan de inmediato, por lo que una sociedad puede existir el mismo día en que sus documentos están listos. Un informe NUANS para una sociedad con nombre suele generarse el mismo día en que se encarga. Por correo, la presentación toma unos 15 días hábiles. La declaración inicial sigue dentro de los 60 días." },
      { q: "¿Puede un no residente ser director de una sociedad de Ontario?", a: "Sí. Ontario derogó, con efecto el 5 de julio de 2021, el requisito de que al menos el 25 % de los directores fueran residentes canadienses. Una sociedad de Ontario puede tener hoy un consejo formado totalmente por no residentes, siempre que cada director sea una persona física de al menos 18 años, no quebrada y no declarada incapaz. Una sociedad federal sigue teniendo un requisito de residencia." },
      { q: "¿Necesito un informe NUANS para constituirme en Ontario?", a: "Solo para una sociedad con nombre. Una sociedad de Ontario con nombre necesita un informe NUANS orientado a Ontario con fecha de 90 días o menos antes de presentar los estatutos, y no se acepta un informe orientado al ámbito federal. Una sociedad numérica, que recibe un nombre numérico asignado por el registro, no necesita ningún informe NUANS." },
      { q: "¿Qué es la declaración inicial y cuándo vence?", a: "La declaración inicial es una presentación prevista en la Corporations Information Act de Ontario que confirma en el registro público los directores, los funcionarios y el domicilio social de la sociedad. Toda sociedad de Ontario debe presentarla dentro de los 60 días siguientes a la fecha de constitución. No tiene tarifa gubernamental y se presenta en el Registro de Empresas de Ontario." },
      { q: "¿Necesito un abogado para constituirme en sociedad en Ontario?", a: "No. La ley de Ontario no exige un abogado para presentar los estatutos de constitución, que pueden presentarse directamente en el Registro de Empresas de Ontario. Muchos propietarios recurren a un abogado cuando la situación no es estándar, por ejemplo varios fundadores, inversionistas externos, una sociedad de cartera o una sociedad profesional, y a un servicio en línea para una sociedad sencilla." },
      { q: "¿Una sociedad de Ontario obtiene automáticamente un número de negocio de la CRA?", a: "Sí. Cuando una sociedad se constituye en Ontario, la Agencia de Ingresos de Canadá le asigna automáticamente un número de negocio y una cuenta del programa de impuesto sobre la renta de sociedades. Las demás cuentas, como GST/HST y nómina, se abren por separado cuando el negocio las necesita. La sociedad presenta cada año una T2, que también cubre el impuesto de sociedades de Ontario." },
    ],
  },
};
