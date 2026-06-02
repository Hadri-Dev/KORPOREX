import type { Locale } from "@/i18n/routing";

export type { Locale };

export type ArticleCategory =
  | "Incorporation Guides"
  | "Compliance & Maintenance"
  | "Jurisdiction Comparisons";

// Stable key per category so the display label can be localized while the
// English enum value above is what links an Article to its category.
export const CATEGORY_KEY: Record<ArticleCategory, string> = {
  "Incorporation Guides": "incorporation",
  "Compliance & Maintenance": "compliance",
  "Jurisdiction Comparisons": "jurisdiction",
};

export type ArticleLink = { text: string; href: string };
export type ArticleInline = string | ArticleLink;

export type ArticleSection =
  | { type: "heading"; id: string; text: string }
  | { type: "paragraph"; text: string; parts?: ArticleInline[] }
  | { type: "list"; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type Article = {
  slug: string;
  // Language this article is written in. The site serves en unprefixed and
  // fr/es under a locale prefix, so each language version has its own URL.
  locale: Locale;
  // Shared id linking the language versions of the same article. Used to emit
  // hreflang alternates so Google treats them as translations, not duplicates.
  group: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  // SEO meta — metaTitle ~50-60 chars, metaDescription ~150-160 chars.
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  updated: string;
  content: ArticleSection[];
};

// Absolute origin for building hreflang/canonical URLs.
export const SITE_URL = "https://korporex.ca";

// Build the absolute URL for a guide article in a given locale. English (the
// default locale) is served without a prefix; fr/es are prefixed.
export function guideUrl(locale: Locale, slug: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}/guides/${slug}`;
}

export const articles: Article[] = [
  {
    slug: "federal-vs-provincial-incorporation",
    locale: "en",
    group: "incorporate-canada",
    category: "Jurisdiction Comparisons",
    title: "How to Incorporate in Canada: Federal vs. Provincial",
    excerpt:
      "The first real decision when you incorporate in Canada is federal or provincial. We break down the differences, costs, and steps so you can incorporate with confidence.",
    metaTitle: "How to Incorporate in Canada: Federal vs Provincial | Korporex",
    metaDescription:
      "How to incorporate in Canada, step by step. Compare federal vs provincial incorporation, name protection, costs, and filings so you choose the right route for your business.",
    readTime: "7 min read",
    updated: "2026-06-01",
    content: [
      {
        type: "paragraph",
        text: "Deciding how to incorporate in Canada is mostly one early choice: federal or provincial. Every new Canadian corporation is created under one of two kinds of statute, the federal Canada Business Corporations Act (CBCA) or one of the provincial or territorial business corporations acts. Both produce a valid, separate legal entity that can sign contracts, own property, and limit shareholder liability. The practical differences show up in name protection, where you can operate, how much paperwork you file each year, and how much the whole thing costs.",
      },
      {
        type: "heading",
        id: "what-is-federal",
        text: "What federal incorporation actually gives you",
      },
      {
        type: "paragraph",
        text: "A federal corporation is created under the CBCA and administered by Corporations Canada. Its most distinctive feature is national name protection: the proposed name is checked across every province and territory through a NUANS search, and once approved, no other federal corporation can use a confusingly similar name anywhere in the country.",
      },
      {
        type: "paragraph",
        text: "Federal incorporation does not, however, exempt the corporation from provincial rules. If a federal corporation carries on business in a province (has an office, employees, or a physical presence there), it must register extra-provincially in that province and pay the associated fee. A federal corporation operating in three provinces effectively maintains four registrations: one federal plus one in each province.",
      },
      {
        type: "heading",
        id: "what-is-provincial",
        text: "What provincial incorporation gives you",
      },
      {
        type: "paragraph",
        text: "A provincial corporation is created under the business corporations act of a specific province (e.g., Ontario's OBCA, Alberta's ABCA). The corporation is automatically authorized to carry on business throughout that province. Name protection, however, is limited to that province; a business in another province could, in principle, register a similar name there.",
      },
      {
        type: "paragraph",
        text: "If a provincial corporation later expands into other provinces, it registers extra-provincially in each one, similar to how a federal corporation would. The difference is that it lacks the country-wide name reservation a federal corporation enjoys from day one.",
      },
      {
        type: "heading",
        id: "side-by-side",
        text: "Side-by-side comparison",
      },
      {
        type: "table",
        head: ["", "Federal (CBCA)", "Provincial"],
        rows: [
          ["Name protection", "Nationwide", "Within the incorporating province"],
          ["NUANS name search", "Mandatory", "Required in ON/AB; optional or province-specific elsewhere"],
          ["Government filing fee", "Approximately $200 online", "Roughly $300–$360 depending on province"],
          [
            "Operating in multiple provinces",
            "Needs extra-provincial registration in each province",
            "Needs extra-provincial registration in each province",
          ],
          ["Annual return", "Filed with Corporations Canada every year", "Filed with the province every year"],
          ["Director residency", "No Canadian-resident director requirement (as of 2022)", "Varies; Ontario removed its requirement in 2021"],
        ],
      },
      {
        type: "heading",
        id: "how-to-choose",
        text: "How to choose",
      },
      {
        type: "paragraph",
        text: "The decision usually comes down to three questions. First, how unique is your business name, and how important is nationwide protection? If the name is core to your brand and you expect to operate in more than one province, federal incorporation buys you certainty. Second, where will you actually carry on business? If the answer is \"one province, probably forever,\" the simpler provincial route may be enough. Third, how much ongoing administration are you willing to absorb? A federal corporation that operates in three provinces files four annual returns.",
      },
      {
        type: "callout",
        title: "Rule of thumb",
        text: "If you only plan to operate in one province and your name isn't particularly distinctive, provincial incorporation is usually simpler. If you plan to scale across provinces or your brand name matters, federal is usually the better fit.",
      },
      {
        type: "heading",
        id: "how-to-incorporate",
        text: "How to incorporate, step by step",
      },
      {
        type: "paragraph",
        text: "Whichever jurisdiction you choose, the mechanics of how to incorporate in Canada are similar:",
      },
      {
        type: "list",
        items: [
          "Choose your name, or take a numbered corporation to skip the name search. A named corporation needs a NUANS report to confirm the name is available and not confusingly similar to an existing one.",
          "File your articles of incorporation. These set out your corporation's basic structure, including its share classes.",
          "Set your share structure. This is more important than it looks: it determines who owns what, how profits can be paid out, and how you can bring in partners or investors later.",
          "Name your directors and set your registered office address.",
          "Get your CRA business number and open the tax accounts you need (corporate income tax, GST/HST, payroll).",
          "Start your minute book, the corporation's ongoing legal record of its decisions.",
        ],
      },
      {
        type: "callout",
        title: "The part people underestimate",
        text: "Share structure is where do-it-yourself incorporation most often goes wrong. A cheap online filing usually gives everyone the same simple share setup, which works fine until you want to add a co-founder, pay family members through dividends, or sell part of the business. Fixing it later costs far more than setting it up correctly at the start.",
      },
      {
        type: "heading",
        id: "next-step",
        text: "Your next step",
      },
      {
        type: "paragraph",
        text: "Once you've decided on the jurisdiction, the rest of incorporating is largely the same: choose a name (or opt for a numbered corporation), draft articles, set your share structure, appoint directors, file, and receive your certificate of incorporation. Korporex files both federal and Ontario incorporations online, including the NUANS name search, the articles, and the share structure setup, and delivers your documents within 24 hours.",
        parts: [
          "Once you've decided on the jurisdiction, the rest of incorporating is largely the same: choose a name (or opt for a numbered corporation), draft articles, set your share structure, appoint directors, file, and receive your certificate of incorporation. Korporex files both federal and Ontario incorporations online, including the ",
          { text: "NUANS name search", href: "/nuans" },
          ", the articles, and the share structure setup, and delivers your documents within 24 hours.",
        ],
      },
    ],
  },
  {
    slug: "what-is-nuans-name-search",
    locale: "en",
    group: "nuans-name-search",
    category: "Incorporation Guides",
    title: "What Is a NUANS Name Search, and Do You Need One?",
    excerpt:
      "If you're incorporating federally or in certain provinces, a NUANS search is mandatory. Learn what it is, how it works, and what happens if your first-choice name is unavailable.",
    metaTitle: "What Is a NUANS Name Search, and Do You Need One? | Korporex",
    metaDescription:
      "A NUANS name search checks your proposed corporate name against names across Canada. Learn when it is required, how it works, and what to do if your first choice is taken.",
    readTime: "4 min read",
    updated: "2026-04-21",
    content: [
      {
        type: "paragraph",
        text: "NUANS stands for Newly Upgraded Automated Name Search. It is a database operated under contract with the federal government that contains corporate names, business names, and trademarks registered across Canada. A NUANS report compares a proposed corporate name against that database and produces a list of similar existing names so the government can decide whether yours is distinct enough to register.",
      },
      {
        type: "heading",
        id: "when-required",
        text: "When a NUANS report is required",
      },
      {
        type: "list",
        items: [
          "Federal incorporation under the CBCA: always required if you're registering a named corporation.",
          "Ontario incorporation under the OBCA: required for named corporations.",
          "Alberta, Saskatchewan, Manitoba, New Brunswick, Nova Scotia, Newfoundland and Labrador, PEI: all use NUANS for named corporations.",
          "Quebec, British Columbia, and the territories: use separate name systems, not NUANS.",
          "Numbered corporations (e.g., 1234567 Canada Inc.): no NUANS search required in any jurisdiction.",
        ],
      },
      {
        type: "heading",
        id: "how-it-works",
        text: "How a NUANS search works",
      },
      {
        type: "paragraph",
        text: "A NUANS report is ordered through an authorized NUANS search house. You submit the proposed corporate name, the search house runs it against the database, and you receive a report (usually within minutes) listing approximately 20 to 30 similar names already in use. A NUANS report is valid for 90 days from the date it is generated. The filing must be completed within that window or the report expires and a new one is required.",
        parts: [
          "A ",
          { text: "NUANS report", href: "/nuans" },
          " is ordered through an authorized NUANS search house. You submit the proposed corporate name, the search house runs it against the database, and you receive a report (usually within minutes) listing approximately 20 to 30 similar names already in use. A NUANS report is valid for 90 days from the date it is generated. The filing must be completed within that window or the report expires and a new one is required.",
        ],
      },
      {
        type: "paragraph",
        text: "The government does not make the final decision based solely on the report. A corporate examiner (federal or provincial) reviews the report and the proposed name, weighs distinctiveness and potential confusion with existing names, and either approves or rejects the name.",
      },
      {
        type: "heading",
        id: "anatomy-of-a-name",
        text: "The anatomy of a corporate name",
      },
      {
        type: "paragraph",
        text: "A compliant Canadian corporate name has three parts:",
      },
      {
        type: "list",
        items: [
          "Distinctive element: a unique or coined word (e.g., \"Maplewind\").",
          "Descriptive element: describes the business activity (e.g., \"Consulting\").",
          "Legal element: indicates limited liability: Inc., Incorporated, Corp., Corporation, Ltd., Limited, Limitée, or Ltée.",
        ],
      },
      {
        type: "paragraph",
        text: "A name that is only descriptive (\"Canadian Consulting Inc.\") will almost always be rejected. A name that is distinctive but very close to an existing registered name (\"Maplewind Consulting Inc.\" vs. an existing \"MapleWynd Consulting Ltd.\") may also be rejected on confusion grounds.",
      },
      {
        type: "heading",
        id: "if-unavailable",
        text: "What if your first choice is unavailable",
      },
      {
        type: "paragraph",
        text: "There are three common fallbacks. You can propose a variation with a more distinctive element; you can add a geographic or descriptive modifier that creates meaningful separation; or you can incorporate as a numbered corporation now (for example, 1234567 Canada Inc.) and adopt an operating name later through a business-name registration. The numbered route is the fastest path when speed matters more than branding.",
      },
      {
        type: "callout",
        text: "A NUANS report does not grant a trademark. If your name is central to your brand, you should also consider a trademark registration through the Canadian Intellectual Property Office. That is a separate process from incorporation.",
      },
    ],
  },
  {
    slug: "corporate-annual-returns-canada",
    locale: "en",
    group: "annual-returns",
    category: "Compliance & Maintenance",
    title: "Corporate Annual Returns in Canada: A Complete Guide",
    excerpt:
      "Every Canadian corporation must file an annual return. Deadlines, fees, and consequences of missing a filing differ by jurisdiction. Here's everything you need to know.",
    metaTitle: "Corporate Annual Returns in Canada: A Complete Guide | Korporex",
    metaDescription:
      "Every Canadian corporation must file an annual return each year. Learn the federal and Ontario deadlines, fees, and what happens if you miss a filing.",
    readTime: "5 min read",
    updated: "2026-04-21",
    content: [
      {
        type: "callout",
        title: "Not to be confused with",
        text: "An annual return is a corporate filing that confirms the corporation's information with the registry. It is not a tax return. The T2 Corporation Income Tax Return is filed separately with the Canada Revenue Agency. The two have different deadlines, different recipients, and different consequences for being missed.",
      },
      {
        type: "heading",
        id: "what-is-annual-return",
        text: "What an annual return is",
      },
      {
        type: "paragraph",
        text: "An annual return confirms that the information on file about the corporation (registered office address, directors, officers, and in some provinces shareholders) is still accurate. If anything has changed during the year, the annual return is where those changes are reported. Every active Canadian corporation is required by statute to file one every year.",
      },
      {
        type: "heading",
        id: "federal",
        text: "Federal corporations",
      },
      {
        type: "list",
        items: [
          "Filed with Corporations Canada.",
          "Due within 60 days of the anniversary of incorporation or amalgamation.",
          "Online filing fee: $12.",
          "Missing two consecutive annual returns can result in dissolution of the corporation.",
        ],
      },
      {
        type: "heading",
        id: "ontario",
        text: "Ontario corporations",
      },
      {
        type: "paragraph",
        text: "Since October 2021, Ontario annual returns are filed directly through the Ontario Business Registry. Before that date, most corporations filed the return together with their T2 through the CRA; that route was discontinued. Ontario annual returns are due within six months after the end of the corporation's fiscal year.",
      },
      {
        type: "list",
        items: [
          "Filed through the Ontario Business Registry.",
          "Due within six months after the corporation's fiscal year-end.",
          "Filing fee: currently no fee for the annual return itself in Ontario.",
          "Non-filing may result in cancellation of the corporation's registration.",
        ],
      },
      {
        type: "heading",
        id: "consequences",
        text: "What happens if you miss a filing",
      },
      {
        type: "paragraph",
        text: "The pattern is similar across jurisdictions. One missed return typically generates a reminder. Two consecutive missed returns can put the corporation into a \"not in compliance\" or \"not in good standing\" status, which becomes visible on any search of the public registry. Continued non-filing leads to administrative dissolution, at which point the corporation ceases to exist as a legal entity. Its name becomes available to others, its contracts and property rights enter a legal grey zone, and its directors may face personal exposure for obligations entered into while it was dissolved.",
      },
      {
        type: "paragraph",
        text: "Reviving a dissolved corporation is possible in most jurisdictions but involves a separate application, fees, and typically payment of any outstanding filings. It is always cheaper and simpler to file on time.",
      },
      {
        type: "heading",
        id: "stay-on-top",
        text: "Staying on top of it",
      },
      {
        type: "paragraph",
        text: "The most reliable approach is to add the corporation's incorporation anniversary to a calendar with a reminder 30 days in advance, and to keep a short checklist of whose information might have changed during the year: directors, officers, registered office. Filing the return itself usually takes less than ten minutes once you have those details in hand.",
      },
    ],
  },
  {
    slug: "corporate-minute-book",
    locale: "en",
    group: "minute-book",
    category: "Compliance & Maintenance",
    title: "What Is a Minute Book, and Why Does Your Corporation Need One?",
    excerpt:
      "Canadian corporations are legally required to maintain a corporate minute book. We explain what goes in it, who is responsible for keeping it, and what happens if you don't have one.",
    metaTitle: "What Is a Minute Book and Why You Need One | Korporex",
    metaDescription:
      "A corporate minute book is the legal record of your corporation's existence and decisions. Learn what goes in a minute book, why it's required, and the cost of neglecting it.",
    readTime: "4 min read",
    updated: "2026-06-01",
    content: [
      {
        type: "paragraph",
        text: "A corporate minute book is the official record of a corporation's existence and governance. Despite the name, it is not a log of conversations; it is a complete, organized archive of every document and decision that affects the corporation's legal status, ownership, and internal rules. Every Canadian corporation is required by statute to maintain one from the day it is incorporated.",
      },
      {
        type: "heading",
        id: "legal-basis",
        text: "The legal requirement",
      },
      {
        type: "paragraph",
        text: "Section 20 of the Canada Business Corporations Act requires federal corporations to maintain specified records at their registered office. Parallel provisions exist in every provincial business corporations act. The statute is specific about what must be kept and who can inspect it: typically directors, shareholders, and in some circumstances creditors or the public.",
      },
      {
        type: "heading",
        id: "whats-inside",
        text: "What goes inside",
      },
      {
        type: "list",
        items: [
          "Articles of incorporation and any articles of amendment.",
          "By-laws and any amendments to the by-laws.",
          "Minutes of meetings and written resolutions of directors.",
          "Minutes of meetings and written resolutions of shareholders.",
          "Register of directors: names, addresses, and dates each director joined or left.",
          "Register of officers: current officers and their positions.",
          "Register of shareholders: names, addresses, and share holdings.",
          "Securities register: every issuance, transfer, and cancellation of shares.",
          "Copies of unanimous shareholder agreements, if any.",
          "Notices filed with the registry (changes of directors, registered office, etc.).",
        ],
      },
      {
        type: "heading",
        id: "whose-job",
        text: "Whose job is it to keep it",
      },
      {
        type: "paragraph",
        text: "Legal responsibility rests with the directors of the corporation. In practice, the minute book is usually maintained at the corporation's registered office, or by a third party retained to act as the corporation's record keeper. Whether it lives in a physical binder or as a cloud-based digital record doesn't matter; what matters is that it is complete, current, and accessible when it needs to be inspected.",
      },
      {
        type: "heading",
        id: "consequences",
        text: "What happens if there isn't one",
      },
      {
        type: "paragraph",
        text: "A missing or incomplete minute book rarely causes a problem day-to-day. The problem shows up at inflection points: selling the business, raising financing, onboarding a new shareholder, or responding to a CRA audit. At each of these moments, the other side will ask for the minute book and will not proceed until it is in order.",
      },
      {
        type: "paragraph",
        text: "Reconstructing a minute book years after the fact is expensive and sometimes impossible: directors may no longer be available to sign backdated resolutions, share issuances may not be cleanly documented, and the corporation's legal history effectively has gaps. In the worst cases, those gaps can derail a transaction or reduce the purchase price.",
      },
      {
        type: "callout",
        title: "A simple discipline",
        text: "Every time the corporation does something meaningful (issues shares, appoints a new director, changes its fiscal year-end, passes a by-law), a corresponding resolution should be added to the minute book within a few weeks. A minute book that is kept current is almost effortless; one that is kept \"when we get around to it\" tends to stay unfinished.",
      },
    ],
  },
  {
    slug: "incorporating-in-ontario",
    locale: "en",
    group: "incorporating-ontario",
    category: "Jurisdiction Comparisons",
    title: "Incorporating in Ontario: Everything You Need to Know",
    excerpt:
      "Ontario is home to the majority of Canadian small businesses. This guide walks through the Ontario Business Corporations Act, costs, timelines, and what you'll receive after filing.",
    metaTitle: "Incorporating in Ontario: Everything You Need to Know | Korporex",
    metaDescription:
      "A complete guide to incorporating in Ontario under the OBCA: what's required, costs, timelines, and what you receive after filing with the Ontario Business Registry.",
    readTime: "7 min read",
    updated: "2026-04-21",
    content: [
      {
        type: "paragraph",
        text: "Ontario incorporations are governed by the Ontario Business Corporations Act (OBCA) and processed through the Ontario Business Registry (OBR), which launched in October 2021. The OBR replaced a paper-heavy process with a fully online system, and most incorporations are now completed in minutes rather than weeks.",
      },
      {
        type: "heading",
        id: "whats-required",
        text: "What is required to incorporate in Ontario",
      },
      {
        type: "list",
        items: [
          "A corporate name (either a named corporation with a NUANS report, or a numbered corporation).",
          "Articles of Incorporation describing share structure and any restrictions on share transfers or business activities.",
          "One or more incorporators (can be individuals or corporations).",
          "At least one director. Ontario removed its 25% Canadian-resident director requirement in July 2021.",
          "An Ontario registered office address. A P.O. box alone is not acceptable; a civic address is required.",
          "Names and addresses of directors and officers for the first notice.",
        ],
      },
      {
        type: "heading",
        id: "costs",
        text: "Costs",
      },
      {
        type: "table",
        head: ["Item", "Cost (Ontario)"],
        rows: [
          ["Government filing fee (online)", "$300"],
          ["NUANS report (if using a named corporation)", "Approximately $8–$40 depending on the search house"],
          ["Name pre-search (optional, reduces NUANS rejection risk)", "Varies"],
          ["Minute book setup (optional but recommended)", "Varies by provider"],
        ],
      },
      {
        type: "paragraph",
        text: "Numbered corporations skip the NUANS step entirely, which is both faster and cheaper. The trade-off is that the corporation will need to register a separate operating name if it wants to do business under a branded name rather than \"1234567 Ontario Inc.\"",
      },
      {
        type: "heading",
        id: "timeline",
        text: "Timeline",
      },
      {
        type: "paragraph",
        text: "For a straightforward Ontario incorporation, the typical timeline is:",
      },
      {
        type: "list",
        items: [
          "Name selection and NUANS report: same day (a report is generated in minutes).",
          "Articles of Incorporation drafting: same day.",
          "Filing with the Ontario Business Registry: usually processed immediately or within 24 hours.",
          "Initial Return (Form 1) confirming directors and registered office: due within 60 days of incorporation.",
        ],
      },
      {
        type: "heading",
        id: "what-you-receive",
        text: "What you receive after filing",
      },
      {
        type: "list",
        items: [
          "Certificate of Incorporation with your incorporation date and Ontario Corporation Number (OCN).",
          "Stamped Articles of Incorporation.",
          "Corporation profile showing current directors, officers, and registered office.",
          "Access credentials for the Ontario Business Registry.",
        ],
      },
      {
        type: "heading",
        id: "after-incorporation",
        text: "After incorporation",
      },
      {
        type: "paragraph",
        text: "A new Ontario corporation typically has a few immediate follow-up tasks:",
      },
      {
        type: "list",
        items: [
          "Pass an organizational resolution issuing the initial shares and appointing officers.",
          "Adopt by-laws (the general rules governing the corporation's internal affairs).",
          "Register for a CRA Business Number and any relevant tax accounts (HST, payroll, corporate income tax).",
          "Open a corporate bank account (banks will require the Articles, the Certificate, and a recent corporate profile).",
          "Set up the minute book and record the organizational resolutions in it.",
          "Calendar the annual return deadline (due within six months after fiscal year-end).",
        ],
      },
      {
        type: "callout",
        title: "One common oversight",
        text: "Ontario requires an Initial Return within 60 days of incorporation, confirming the directors and registered office that were named on the Articles. Missing this filing puts the corporation out of compliance almost immediately. It is a quick online filing; do it the same week you incorporate.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // New English articles (batch 1)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "how-to-get-gst-hst-number-ontario",
    locale: "en",
    group: "gst-hst-ontario",
    category: "Compliance & Maintenance",
    title: "How to Get a GST/HST Number in Ontario",
    excerpt:
      "Who needs a GST/HST number, when registration becomes mandatory, and how to register with the CRA without overcomplicating it.",
    metaTitle: "How to Get a GST/HST Number in Ontario | Korporex",
    metaDescription:
      "How to get a GST/HST number in Ontario: who needs one, the $30,000 small-supplier threshold, and how to register with the CRA online, by phone, or by mail.",
    readTime: "5 min read",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "If you are starting a business in Ontario, sooner or later you will run into the GST/HST number question. Maybe a client asked for it before they would pay an invoice. Maybe your accountant mentioned it. Maybe you just read that you are supposed to have one and now you are not sure if that is true for you." },
      { type: "paragraph", text: "Here is the plain version of how to get a GST/HST number in Ontario: how it works, who actually needs one, and how to register without overcomplicating it." },
      { type: "heading", id: "what-it-is", text: "What a GST/HST number actually is" },
      { type: "paragraph", text: "GST is the federal Goods and Services Tax. HST is the Harmonized Sales Tax, which is what Ontario uses because the province combined its sales tax with the federal GST into a single 13% rate. When people say \"GST/HST number,\" they are talking about the same thing: an account with the Canada Revenue Agency that lets you collect this tax from your customers and send it to the government." },
      { type: "paragraph", text: "The number itself is tied to your CRA business number. It usually looks like your nine-digit business number followed by \"RT0001.\"", parts: ["The number itself is tied to your CRA ", { text: "business number", href: "/guides/business-number-vs-corporation-number" }, ". It usually looks like your nine-digit business number followed by \"RT0001.\""] },
      { type: "heading", id: "do-you-need-one", text: "Do you even need one?" },
      { type: "paragraph", text: "This is the part most people get wrong, so it is worth slowing down." },
      { type: "paragraph", text: "You are required to register once your business earns more than $30,000 in revenue over four consecutive calendar quarters. The CRA calls this the small supplier threshold. Stay under it and registration is optional. Cross it and you have 29 days to register from the day you go over." },
      { type: "list", items: ["The $30,000 is based on total worldwide revenue from taxable sales, not your profit.", "It is measured on a rolling basis, not per calendar year. Four quarters in a row.", "Some businesses register voluntarily even while small, because being registered lets them claim back the GST/HST they pay on their own expenses (these are called input tax credits). For a business with real startup costs, that can be worth more than the hassle of filing."] },
      { type: "paragraph", text: "If you are a taxi or ride-share driver, the threshold does not apply to you. You have to register from your first dollar." },
      { type: "heading", id: "how-to-register", text: "How to register for a GST/HST number" },
      { type: "paragraph", text: "There are three ways to register, and they are not equally painless." },
      { type: "list", items: ["Online through CRA My Business Account. This is the standard route. You will need your business number first. If you do not have one yet, the registration process can create one for you at the same time.", "By phone. You can call the CRA business line and register over the phone if you would rather talk to a person.", "By mail or fax using Form RC1. This is the slow option and there is rarely a good reason to choose it."] },
      { type: "paragraph", text: "When you register, the CRA will ask for your business start date, your estimated annual revenue, your reporting period, and your fiscal year-end. Most small businesses are assigned an annual reporting period by default, which means you file once a year. You can ask for quarterly or monthly if it suits your cash flow better." },
      { type: "heading", id: "after-you-register", text: "What happens after you register" },
      { type: "paragraph", text: "Once you have the number, three things change. You start charging 13% HST on your taxable sales in Ontario. You put your GST/HST number on your invoices, because clients who are themselves registered will want it to claim their own credits. And you file a return on whatever schedule you were assigned, reporting what you collected and subtracting what you paid out." },
      { type: "callout", text: "The tax you collect is not your money. Set it aside as it comes in, or you will feel it at filing time." },
      { type: "heading", id: "getting-it-set-up", text: "Getting it set up at the right time" },
      { type: "paragraph", text: "Registration itself is administrative and you can do it yourself. The decisions around it are where it gets less obvious: whether to register voluntarily, how the timing lines up with incorporating, and how the tax flows once you have employees or sell across provinces. Those are worth a short conversation with a qualified accountant before you commit." },
      { type: "paragraph", text: "If you are incorporating in Ontario, Korporex sets up your CRA business number and GST/HST registration as part of the online filing, so your tax accounts are in place from day one.", parts: ["If you are ", { text: "incorporating in Ontario", href: "/guides/how-to-register-a-business-in-ontario" }, ", Korporex sets up your CRA business number and GST/HST registration as part of the online filing, so your tax accounts are in place from day one."] },
    ],
  },
  {
    slug: "how-to-register-a-business-in-ontario",
    locale: "en",
    group: "register-business-ontario",
    category: "Incorporation Guides",
    title: "How to Register a Business in Ontario",
    excerpt:
      "Registering a business in Ontario is mostly paperwork. The harder part is choosing your structure first. Here is the whole path, start to finish.",
    metaTitle: "How to Register a Business in Ontario | Korporex",
    metaDescription:
      "How to register a business in Ontario: choose your structure, register a sole proprietorship or partnership through ServiceOntario, or incorporate. The full path, start to finish.",
    readTime: "6 min read",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Registering a business in Ontario is one of those tasks that sounds intimidating and turns out to be mostly paperwork. The harder part is the decision you make before the paperwork: what kind of business you are registering in the first place. Get that right and the rest follows." },
      { type: "paragraph", text: "Here is the whole path to register a business in Ontario, start to finish." },
      { type: "heading", id: "pick-your-structure", text: "First, pick your structure" },
      { type: "paragraph", text: "Before you register anything, you need to know what you are registering. In Ontario, most new businesses fall into one of three buckets." },
      { type: "paragraph", text: "A sole proprietorship is you, operating as a business, under a name that is not your own legal name. It is the simplest and cheapest to set up. The catch is that there is no legal separation between you and the business, so the business's debts are your debts." },
      { type: "paragraph", text: "A partnership is two or more people doing the same thing together. Same simplicity, same lack of separation, plus the added wrinkle that you can be on the hook for what your partner does." },
      { type: "paragraph", text: "A corporation is a separate legal entity. It costs more and takes more upkeep, but it puts a wall between your personal assets and the business, and it can be more tax-efficient once you are earning real money." },
      { type: "paragraph", text: "If you are not sure which one fits, that choice deserves more thought than the registration itself. We cover it in a separate guide on sole proprietorship versus incorporation.", parts: ["If you are not sure which one fits, that choice deserves more thought than the registration itself. We cover it in a separate guide on ", { text: "sole proprietorship versus incorporation", href: "/guides/sole-proprietorship-vs-corporation" }, "."] },
      { type: "heading", id: "sole-prop-partnership", text: "Registering a sole proprietorship or partnership" },
      { type: "paragraph", text: "If you are going with a sole proprietorship or partnership operating under a business name, you register that name through ServiceOntario. This is the Business Name Registration, and it used to be called a Master Business Licence." },
      { type: "paragraph", text: "You can do it online. You will need the business name you want, your contact details, and a description of what the business does. The registration is valid for five years and then you renew it." },
      { type: "callout", text: "One step people skip: search the name first. Ontario does not stop you from registering a name someone else is already using, which means you can register something that gets you into a trademark fight later. A quick search before you commit is cheap insurance." },
      { type: "heading", id: "registering-a-corporation", text: "Registering a corporation" },
      { type: "paragraph", text: "Incorporating is a bigger step. You choose first whether to incorporate provincially in Ontario or federally under the Canada Business Corporations Act. Provincial is usually simpler if you plan to operate mainly in Ontario. Federal gives you name protection across the country.", parts: ["Incorporating is a bigger step. You choose first whether to incorporate provincially in Ontario or ", { text: "federally under the Canada Business Corporations Act", href: "/guides/federal-vs-provincial-incorporation" }, ". Provincial is usually simpler if you plan to operate mainly in Ontario. Federal gives you name protection across the country."] },
      { type: "paragraph", text: "Either way, incorporation involves filing articles of incorporation, choosing your corporation's name (or taking a numbered name), setting up your share structure, and naming your directors. You will also need a NUANS name search if you want a named corporation rather than a numbered one." },
      { type: "paragraph", text: "This is the stage where doing it yourself can quietly cost you. The share structure and the articles are not just forms. They shape how you can bring in partners, pay yourself, and sell the business later. People often incorporate cheaply online, then pay more a year later to fix a structure that did not anticipate where the business went." },
      { type: "heading", id: "after-you-register", text: "After you register" },
      { type: "paragraph", text: "Whichever route you took, a few things usually come next." },
      { type: "list", items: ["You get a CRA business number if you do not already have one.", "You register for GST/HST if you expect to cross the $30,000 threshold.", "If you are hiring, you set up a payroll account.", "And if you incorporated, you start keeping a minute book, the corporation's required record of its own decisions."] },
      { type: "paragraph", text: "None of these are urgent on day one, but they pile up if you ignore them, and some carry penalties when missed." },
      { type: "heading", id: "where-korporex-fits", text: "Where Korporex fits" },
      { type: "paragraph", text: "You can register a sole proprietorship yourself in an afternoon through ServiceOntario. To incorporate, Korporex handles Ontario and federal incorporation filings online, including the NUANS name search, the share structure, and the minute book, so you can register and incorporate in one place and have your documents within 24 hours.", parts: ["You can register a sole proprietorship yourself in an afternoon through ServiceOntario. To incorporate, Korporex handles Ontario and federal incorporation filings online, including the ", { text: "NUANS name search", href: "/nuans" }, ", the share structure, and the minute book, so you can register and incorporate in one place and have your documents within 24 hours."] },
    ],
  },
  {
    slug: "sole-proprietorship-vs-corporation",
    locale: "en",
    group: "sole-prop-vs-corp",
    category: "Incorporation Guides",
    title: "Sole Proprietorship vs Corporation in Canada: Which Is Right for You?",
    excerpt:
      "The decision almost every new business owner faces. Here is how to think through sole proprietorship vs corporation based on where your business is going.",
    metaTitle: "Sole Proprietorship vs Corporation in Canada | Korporex",
    metaDescription:
      "Sole proprietorship vs corporation in Canada: how they differ on liability, tax, and cost, plus a simple way to decide which structure fits your business right now.",
    readTime: "6 min read",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Sole proprietorship vs corporation is the decision almost every new business owner faces, and it is the one people most often get wrong by defaulting to whatever was easiest to set up. The honest answer is that it depends on where your business is going, not just where it is today." },
      { type: "paragraph", text: "Here is how to think it through." },
      { type: "heading", id: "core-difference", text: "The core difference" },
      { type: "paragraph", text: "A sole proprietorship is not separate from you. Legally, you and the business are the same person. You report the business income on your personal tax return, and if the business owes money or gets sued, that liability is yours personally. Your house and your savings are theoretically on the table." },
      { type: "paragraph", text: "A corporation is a separate legal person. It owns its own assets, signs its own contracts, and is responsible for its own debts. You own shares in it, but you are generally not personally responsible for what the corporation owes. That separation is the whole point. Everything else flows from that one distinction." },
      { type: "heading", id: "where-sole-prop-wins", text: "Where the sole proprietorship wins" },
      { type: "paragraph", text: "Simplicity and cost. You can register one for a small fee, your taxes are filed with your personal return, and there is very little ongoing administration. No annual corporate filings, no minute book, no separate tax return." },
      { type: "paragraph", text: "If you are testing an idea, freelancing on the side, or running something small with low liability risk, a sole proprietorship is often the sensible starting point. There is no prize for incorporating before you need to. It also means your early losses can offset your other personal income, which can be useful in the lean first year." },
      { type: "heading", id: "where-corporation-wins", text: "Where the corporation wins" },
      { type: "paragraph", text: "Three things, mainly." },
      { type: "list", items: ["Liability protection. If your business carries real risk, signing leases, taking on debt, doing work where something could go wrong, the corporate wall matters. Creditors and claimants generally come after the corporation, not you.", "Tax flexibility. Once your business earns more than you need to live on, a corporation lets you leave money in the company taxed at the lower small business rate, and decide when to pay yourself. A sole proprietor is taxed on everything the business earns, whether they took it home or not.", "Credibility and continuity. Some clients, lenders, and investors simply take a corporation more seriously. And a corporation can outlive you, be sold, or bring in shareholders in a way a sole proprietorship cannot."] },
      { type: "heading", id: "trade-offs", text: "The honest trade-offs of incorporating" },
      { type: "paragraph", text: "It is not free and it is not effortless. You will pay to set it up, file a separate corporate tax return every year, keep a minute book, and handle more administration generally. If the business is small and low-risk, that overhead may not be worth it yet.", parts: ["It is not free and it is not effortless. You will pay to set it up, file a separate corporate tax return every year, keep a ", { text: "minute book", href: "/guides/corporate-minute-book" }, ", and handle more administration generally. If the business is small and low-risk, that overhead may not be worth it yet."] },
      { type: "paragraph", text: "There is also a timing question. Incorporating too early means paying for structure you are not using. Incorporating too late, after the business has grown, can mean missing tax planning you could have captured earlier. There is a window, and it is different for everyone." },
      { type: "heading", id: "how-to-decide", text: "A simple way to decide" },
      { type: "paragraph", text: "Ask yourself three questions. Does my business expose me to real liability? Am I earning more than I need to take home and live on? Do I plan to grow, raise money, or eventually sell?" },
      { type: "paragraph", text: "If you answer yes to any of those, incorporation is probably worth a serious look. If it is no across the board, a sole proprietorship is likely fine for now, and you can incorporate later when the answers change. The mistake is treating this as permanent. It is not. Plenty of businesses start as sole proprietorships and incorporate once they grow into it. The structure should match the stage." },
      { type: "heading", id: "getting-the-timing-right", text: "Getting the timing right" },
      { type: "paragraph", text: "Because the right answer shifts as your business changes, this is worth a short conversation with a qualified accountant or lawyer who can look at your actual numbers. When you decide incorporation is the right move, Korporex files your federal or Ontario incorporation online in about 10 minutes, with the share structure and minute book set up for you.", parts: ["Because the right answer shifts as your business changes, this is worth a short conversation with a qualified accountant or lawyer who can look at your actual numbers. When you decide incorporation is the right move, Korporex files your ", { text: "federal or Ontario incorporation", href: "/guides/federal-vs-provincial-incorporation" }, " online in about 10 minutes, with the share structure and minute book set up for you."] },
    ],
  },
  {
    slug: "business-number-vs-corporation-number",
    locale: "en",
    group: "business-vs-corporation-number",
    category: "Compliance & Maintenance",
    title: "Business Number vs Corporation Number: What's the Difference?",
    excerpt:
      "These two numbers get mixed up constantly, partly because a corporation has both. Here is the difference between a business number and a corporation number, in plain terms.",
    metaTitle: "Business Number vs Corporation Number | Korporex",
    metaDescription:
      "Business number vs corporation number: what each one is, why a corporation has both, where they come from, and how to find each. A plain-language Canadian guide.",
    readTime: "5 min read",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Business number vs corporation number: these two get mixed up constantly, partly because they sound alike and partly because a corporation has both. If you have ever stared at a government letter wondering which number they actually want, this is for you." },
      { type: "heading", id: "short-version", text: "The short version" },
      { type: "paragraph", text: "A corporation number identifies your corporation with the body that incorporated it. It is about your company's existence as a legal entity. A business number identifies your business with the Canada Revenue Agency for tax purposes. It is about how you deal with the CRA." },
      { type: "paragraph", text: "They come from different places, they do different jobs, and a corporation ends up with both. A sole proprietorship, by contrast, has no corporation number at all, because it is not a corporation." },
      { type: "heading", id: "corporation-number", text: "The corporation number" },
      { type: "paragraph", text: "When you incorporate, the government that registers you, either Corporations Canada federally or a provincial registry like Ontario's, assigns your corporation a number. This is your corporation number." },
      { type: "paragraph", text: "If you incorporated federally, it is typically a seven-digit number. Provincial corporation numbers vary in format. You will see this number on your certificate of incorporation and your articles. You use it when you file your annual return with that registry, make changes to your corporation, or need to prove the company exists and is in good standing." },
      { type: "heading", id: "business-number", text: "The business number" },
      { type: "paragraph", text: "The business number, or BN, comes from the CRA. It is a nine-digit number that acts as the single identifier for all your dealings with the federal tax system. What makes the BN slightly confusing is that it is the root of several different program accounts. The nine digits are your core BN, and then the CRA tacks on a two-letter code and four digits for each type of account you open:" },
      { type: "list", items: ["RT for GST/HST", "RP for payroll", "RC for corporate income tax", "RM for import/export"] },
      { type: "paragraph", text: "So one business number might have several accounts hanging off it, each with the same nine-digit base. When the CRA asks for your business number, they usually mean those core nine digits." },
      { type: "heading", id: "why-both", text: "Why a corporation has both" },
      { type: "paragraph", text: "When you incorporate, you get a corporation number from the registry. Separately, you get a business number from the CRA so you can pay corporate tax, collect GST/HST, and run payroll. They are not interchangeable. The registry does not care about your BN. The CRA does not care about your corporation number. Each wants its own.", parts: ["When you incorporate, you get a corporation number from the registry. Separately, you get a business number from the CRA so you can pay corporate tax, ", { text: "collect GST/HST", href: "/guides/how-to-get-gst-hst-number-ontario" }, ", and run payroll. They are not interchangeable. The registry does not care about your BN. The CRA does not care about your corporation number. Each wants its own."] },
      { type: "paragraph", text: "A sole proprietor skips the corporation number entirely. They are not incorporated, so there is nothing for a registry to number. But they will still get a business number from the CRA the moment they register for GST/HST or payroll." },
      { type: "heading", id: "how-to-find", text: "How to find each one" },
      { type: "paragraph", text: "Your corporation number is on your certificate of incorporation and your articles. If you have lost them, you can find it through the registry that incorporated you, federal or provincial, using your corporation's name. Your business number is on most CRA correspondence, in your CRA My Business Account, and on your GST/HST and payroll documents. If you genuinely cannot find it, the CRA can give it to you over the phone after they confirm your identity." },
      { type: "heading", id: "when-it-matters", text: "When it matters" },
      { type: "paragraph", text: "For day-to-day operating, you rarely think about either one. They matter at specific moments: filing annual returns, dealing with the CRA, opening a business bank account, applying for financing, or proving your corporation is real and in good standing." },
      { type: "paragraph", text: "When you incorporate with Korporex, your articles, CRA business number, and minute book are set up together, so your corporation number and business number are both in place from the start." },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // French (batch 1)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "comment-obtenir-numero-tps-tvh-ontario",
    locale: "fr",
    group: "gst-hst-ontario",
    category: "Compliance & Maintenance",
    title: "Comment obtenir un numéro de TPS/TVH en Ontario",
    excerpt:
      "Qui a réellement besoin d'un numéro de TPS/TVH, quand l'inscription devient obligatoire, et comment s'inscrire auprès de l'ARC sans se compliquer la vie.",
    metaTitle: "Comment obtenir un numéro de TPS/TVH en Ontario | Korporex",
    metaDescription:
      "Comment obtenir un numéro de TPS/TVH en Ontario : qui en a besoin, le seuil de petit fournisseur de 30 000 $, et comment s'inscrire auprès de l'ARC en ligne, par téléphone ou par la poste.",
    readTime: "5 min de lecture",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Si vous démarrez une entreprise en Ontario, vous finirez tôt ou tard par vous heurter à la question du numéro de TPS/TVH. Peut-être qu'un client l'a réclamé avant de payer une facture. Peut-être que votre comptable en a parlé. Peut-être avez-vous simplement lu que vous êtes censé en avoir un, sans savoir si cela s'applique vraiment à vous." },
      { type: "paragraph", text: "Voici l'explication simple de comment obtenir un numéro de TPS/TVH en Ontario : comment ça fonctionne, qui en a réellement besoin, et comment s'inscrire sans se compliquer la vie." },
      { type: "heading", id: "ce-que-cest", text: "Ce qu'est réellement un numéro de TPS/TVH" },
      { type: "paragraph", text: "La TPS est la taxe fédérale sur les produits et services. La TVH est la taxe de vente harmonisée, celle qu'utilise l'Ontario, parce que la province a fusionné sa taxe de vente avec la TPS fédérale en un seul taux de 13 %. Quand les gens parlent de « numéro de TPS/TVH », ils désignent la même chose : un compte auprès de l'Agence du revenu du Canada qui vous permet de percevoir cette taxe auprès de vos clients et de la remettre au gouvernement." },
      { type: "paragraph", text: "Le numéro lui-même est rattaché à votre numéro d'entreprise de l'ARC. Il ressemble généralement à votre numéro d'entreprise de neuf chiffres suivi de « RT0001 ».", parts: ["Le numéro lui-même est rattaché à votre ", { text: "numéro d'entreprise de l'ARC", href: "/guides/numero-entreprise-ou-numero-societe" }, ". Il ressemble généralement à votre numéro d'entreprise de neuf chiffres suivi de « RT0001 »."] },
      { type: "heading", id: "en-avez-vous-besoin", text: "En avez-vous seulement besoin ?" },
      { type: "paragraph", text: "C'est la partie que la plupart des gens comprennent mal, alors prenons le temps de bien la saisir." },
      { type: "paragraph", text: "Vous êtes tenu de vous inscrire dès que votre entreprise génère plus de 30 000 $ de revenus sur quatre trimestres civils consécutifs. L'ARC appelle cela le seuil de petit fournisseur. Restez en dessous et l'inscription est facultative. Dépassez-le et vous avez 29 jours pour vous inscrire à compter du jour du dépassement." },
      { type: "list", items: ["Le seuil de 30 000 $ repose sur le revenu mondial total des ventes taxables, pas sur votre profit.", "Il se calcule de façon continue, pas par année civile. Quatre trimestres d'affilée.", "Certaines entreprises s'inscrivent volontairement même lorsqu'elles sont petites, parce qu'être inscrit permet de récupérer la TPS/TVH payée sur ses propres dépenses (ce sont les crédits de taxe sur les intrants). Pour une entreprise ayant de vrais frais de démarrage, cela peut valoir plus que le tracas des déclarations."] },
      { type: "paragraph", text: "Si vous êtes chauffeur de taxi ou de covoiturage, le seuil ne s'applique pas à vous. Vous devez vous inscrire dès le premier dollar." },
      { type: "heading", id: "comment-sinscrire", text: "Comment s'inscrire" },
      { type: "paragraph", text: "Il existe trois façons de faire, et elles ne se valent pas en termes de simplicité." },
      { type: "list", items: ["En ligne, par l'entremise de Mon dossier d'entreprise de l'ARC. C'est la voie habituelle. Vous aurez d'abord besoin de votre numéro d'entreprise. Si vous n'en avez pas encore, le processus d'inscription peut en créer un pour vous en même temps.", "Par téléphone. Vous pouvez appeler la ligne des entreprises de l'ARC et vous inscrire de vive voix si vous préférez parler à une personne.", "Par la poste ou par télécopieur, à l'aide du formulaire RC1. C'est l'option lente, et il y a rarement une bonne raison de la choisir."] },
      { type: "paragraph", text: "Lors de l'inscription, l'ARC vous demandera la date de début de votre entreprise, votre revenu annuel estimé, votre période de déclaration et la fin de votre exercice financier. La plupart des petites entreprises se voient attribuer une période de déclaration annuelle par défaut, ce qui signifie une déclaration par an. Vous pouvez demander une fréquence trimestrielle ou mensuelle si cela convient mieux à votre trésorerie." },
      { type: "heading", id: "apres-inscription", text: "Ce qui se passe après l'inscription" },
      { type: "paragraph", text: "Une fois le numéro obtenu, trois choses changent. Vous commencez à facturer 13 % de TVH sur vos ventes taxables en Ontario. Vous inscrivez votre numéro de TPS/TVH sur vos factures, parce que les clients eux-mêmes inscrits voudront l'avoir pour réclamer leurs propres crédits. Et vous produisez une déclaration selon la fréquence qui vous a été attribuée, en déclarant ce que vous avez perçu et en soustrayant ce que vous avez payé." },
      { type: "callout", text: "La taxe que vous percevez n'est pas votre argent. Mettez-la de côté au fur et à mesure, sinon vous la ressentirez au moment de la déclaration." },
      { type: "heading", id: "bon-moment", text: "Bien choisir le moment" },
      { type: "paragraph", text: "L'inscription en soi est administrative et vous pouvez la faire vous-même. Là où cela devient moins évident, ce sont les décisions qui l'entourent : faut-il s'inscrire volontairement, comment le moment choisi s'arrime à la constitution en société, et comment la taxe circule une fois que vous avez des employés ou que vous vendez dans plusieurs provinces. Cela vaut une courte conversation avec un comptable qualifié avant de vous engager." },
      { type: "paragraph", text: "Si vous constituez une société en Ontario, Korporex met en place votre numéro d'entreprise de l'ARC et votre inscription à la TPS/TVH dans le cadre du dépôt en ligne, pour que vos comptes fiscaux soient prêts dès le premier jour.", parts: ["Si vous ", { text: "constituez une société en Ontario", href: "/guides/comment-enregistrer-entreprise-ontario" }, ", Korporex met en place votre numéro d'entreprise de l'ARC et votre inscription à la TPS/TVH dans le cadre du dépôt en ligne, pour que vos comptes fiscaux soient prêts dès le premier jour."] },
    ],
  },
  {
    slug: "comment-enregistrer-entreprise-ontario",
    locale: "fr",
    group: "register-business-ontario",
    category: "Incorporation Guides",
    title: "Comment enregistrer une entreprise en Ontario",
    excerpt:
      "Enregistrer une entreprise en Ontario, c'est surtout de la paperasse. Le plus difficile, c'est de choisir votre structure d'abord. Voici tout le parcours, du début à la fin.",
    metaTitle: "Comment enregistrer une entreprise en Ontario | Korporex",
    metaDescription:
      "Comment enregistrer une entreprise en Ontario : choisir votre structure, enregistrer une entreprise individuelle ou une société de personnes via ServiceOntario, ou vous constituer en société.",
    readTime: "6 min de lecture",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Enregistrer une entreprise en Ontario fait partie de ces tâches qui paraissent intimidantes et qui se révèlent surtout administratives. Le plus difficile, c'est la décision que vous prenez avant la paperasse : quel type d'entreprise vous enregistrez au juste. Réglez cette question correctement et le reste suit." },
      { type: "paragraph", text: "Voici tout le parcours pour enregistrer une entreprise en Ontario, du début à la fin." },
      { type: "heading", id: "choisir-structure", text: "D'abord, choisissez votre structure" },
      { type: "paragraph", text: "Avant d'enregistrer quoi que ce soit, vous devez savoir ce que vous enregistrez. En Ontario, la plupart des nouvelles entreprises se classent dans l'une de trois catégories." },
      { type: "paragraph", text: "Une entreprise individuelle, c'est vous, exploitant une entreprise sous un nom qui n'est pas votre nom légal. C'est la formule la plus simple et la moins coûteuse à mettre en place. Le hic, c'est qu'il n'y a aucune séparation juridique entre vous et l'entreprise, de sorte que les dettes de l'entreprise sont vos dettes." },
      { type: "paragraph", text: "Une société de personnes, c'est deux personnes ou plus qui font la même chose ensemble. Même simplicité, même absence de séparation, avec en prime le fait que vous pouvez être tenu responsable de ce que fait votre associé." },
      { type: "paragraph", text: "Une société par actions est une entité juridique distincte. Elle coûte plus cher et exige plus d'entretien, mais elle érige un mur entre vos biens personnels et l'entreprise, et elle peut être plus avantageuse sur le plan fiscal une fois que vous gagnez de vrais revenus." },
      { type: "paragraph", text: "Si vous ne savez pas laquelle vous convient, ce choix mérite plus de réflexion que l'enregistrement lui-même. Nous l'abordons dans un guide distinct sur l'entreprise individuelle par rapport à la constitution en société.", parts: ["Si vous ne savez pas laquelle vous convient, ce choix mérite plus de réflexion que l'enregistrement lui-même. Nous l'abordons dans un guide distinct sur ", { text: "l'entreprise individuelle par rapport à la constitution en société", href: "/guides/entreprise-individuelle-ou-societe" }, "."] },
      { type: "heading", id: "individuelle-personnes", text: "Enregistrer une entreprise individuelle ou une société de personnes" },
      { type: "paragraph", text: "Si vous optez pour une entreprise individuelle ou une société de personnes exploitée sous un nom commercial, vous enregistrez ce nom par l'entremise de ServiceOntario. C'est l'enregistrement du nom commercial, autrefois appelé Master Business Licence." },
      { type: "paragraph", text: "Vous pouvez le faire en ligne. Il vous faudra le nom commercial souhaité, vos coordonnées et une description de l'activité de l'entreprise. L'enregistrement est valide pour cinq ans, puis vous le renouvelez." },
      { type: "callout", text: "Une étape que les gens sautent : vérifiez d'abord le nom. L'Ontario ne vous empêche pas d'enregistrer un nom déjà utilisé par quelqu'un d'autre, ce qui veut dire que vous pourriez enregistrer quelque chose qui vous attire un litige de marque de commerce plus tard. Une recherche rapide avant de vous engager est une assurance peu coûteuse." },
      { type: "heading", id: "enregistrer-societe", text: "Enregistrer une société par actions" },
      { type: "paragraph", text: "La constitution en société est une étape plus importante. Vous choisissez d'abord de vous constituer à l'échelle provinciale, en Ontario, ou à l'échelle fédérale, en vertu de la Loi canadienne sur les sociétés par actions. Le provincial est habituellement plus simple si vous comptez exercer surtout en Ontario. Le fédéral vous donne une protection du nom partout au pays.", parts: ["La constitution en société est une étape plus importante. Vous choisissez d'abord de vous constituer à l'échelle provinciale, en Ontario, ou ", { text: "à l'échelle fédérale, en vertu de la Loi canadienne sur les sociétés par actions", href: "/guides/comment-se-constituer-societe-canada" }, ". Le provincial est habituellement plus simple si vous comptez exercer surtout en Ontario. Le fédéral vous donne une protection du nom partout au pays."] },
      { type: "paragraph", text: "Dans un cas comme dans l'autre, la constitution suppose le dépôt de statuts constitutifs, le choix du nom de votre société (ou l'adoption d'un nom à matricule), la mise en place de votre structure d'actions et la nomination de vos administrateurs. Il vous faudra aussi une recherche de nom NUANS si vous voulez une société avec un nom plutôt qu'une société à matricule." },
      { type: "paragraph", text: "C'est à cette étape que le faire soi-même peut coûter cher en silence. La structure d'actions et les statuts ne sont pas que des formulaires. Ils déterminent comment vous pourrez accueillir des associés, vous verser une rémunération et vendre l'entreprise plus tard. Les gens se constituent souvent en société à bas prix en ligne, puis paient plus cher un an plus tard pour corriger une structure qui n'avait pas anticipé l'évolution de l'entreprise." },
      { type: "heading", id: "apres-enregistrement", text: "Après l'enregistrement" },
      { type: "paragraph", text: "Quelle que soit la voie choisie, quelques étapes suivent habituellement." },
      { type: "list", items: ["Vous obtenez un numéro d'entreprise de l'ARC si vous n'en avez pas déjà un.", "Vous vous inscrivez à la TPS/TVH si vous prévoyez dépasser le seuil de 30 000 $.", "Si vous embauchez, vous ouvrez un compte de paie.", "Et si vous vous êtes constitué en société, vous commencez à tenir un livre des procès-verbaux, le registre obligatoire des décisions de la société."] },
      { type: "paragraph", text: "Aucune de ces étapes n'est urgente le premier jour, mais elles s'accumulent si on les néglige, et certaines entraînent des pénalités lorsqu'on les oublie." },
      { type: "heading", id: "ou-korporex", text: "Où se situe Korporex" },
      { type: "paragraph", text: "Vous pouvez enregistrer une entreprise individuelle vous-même en un après-midi par l'entremise de ServiceOntario. Pour la constitution en société, Korporex prend en charge les dépôts de constitution ontariens et fédéraux en ligne, y compris la recherche de nom NUANS, la structure d'actions et le livre des procès-verbaux, pour que vous puissiez tout faire au même endroit et recevoir vos documents en 24 heures.", parts: ["Vous pouvez enregistrer une entreprise individuelle vous-même en un après-midi par l'entremise de ServiceOntario. Pour la constitution en société, Korporex prend en charge les dépôts de constitution ontariens et fédéraux en ligne, y compris la ", { text: "recherche de nom NUANS", href: "/nuans" }, ", la structure d'actions et le livre des procès-verbaux, pour que vous puissiez tout faire au même endroit et recevoir vos documents en 24 heures."] },
    ],
  },
  {
    slug: "entreprise-individuelle-ou-societe",
    locale: "fr",
    group: "sole-prop-vs-corp",
    category: "Incorporation Guides",
    title: "Entreprise individuelle ou société par actions au Canada : laquelle vous convient ?",
    excerpt:
      "La décision que presque tout nouvel entrepreneur doit prendre. Voici comment réfléchir à l'entreprise individuelle ou la société selon l'évolution de votre entreprise.",
    metaTitle: "Entreprise individuelle ou société par actions au Canada | Korporex",
    metaDescription:
      "Entreprise individuelle ou société par actions au Canada : leurs différences sur la responsabilité, l'impôt et le coût, plus une façon simple de décider laquelle vous convient.",
    readTime: "6 min de lecture",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Entreprise individuelle ou société par actions : c'est la décision que presque tout nouvel entrepreneur doit prendre, et celle qu'on rate le plus souvent en optant par défaut pour ce qui était le plus simple à mettre en place. La réponse honnête, c'est que tout dépend d'où va votre entreprise, pas seulement d'où elle se trouve aujourd'hui." },
      { type: "paragraph", text: "Voici comment y réfléchir." },
      { type: "heading", id: "difference-fondamentale", text: "La différence fondamentale" },
      { type: "paragraph", text: "Une entreprise individuelle n'est pas distincte de vous. Sur le plan juridique, vous et l'entreprise êtes la même personne. Vous déclarez le revenu de l'entreprise dans votre déclaration de revenus personnelle, et si l'entreprise doit de l'argent ou est poursuivie, cette responsabilité est la vôtre personnellement. Votre maison et vos économies sont, en théorie, en jeu." },
      { type: "paragraph", text: "Une société par actions est une personne morale distincte. Elle possède ses propres biens, signe ses propres contrats et répond de ses propres dettes. Vous détenez des actions, mais vous n'êtes généralement pas personnellement responsable de ce que la société doit. Cette séparation, c'est tout l'intérêt de la chose. Tout le reste découle de cette seule distinction." },
      { type: "heading", id: "individuelle-emporte", text: "Là où l'entreprise individuelle l'emporte" },
      { type: "paragraph", text: "La simplicité et le coût. Vous pouvez en enregistrer une pour des frais modestes, vos impôts se déclarent avec votre déclaration personnelle, et l'administration courante est très légère. Pas de déclaration annuelle de société, pas de livre des procès-verbaux, pas de déclaration de revenus distincte." },
      { type: "paragraph", text: "Si vous testez une idée, travaillez en pige à temps partiel ou exploitez quelque chose de petit avec peu de risque de responsabilité, l'entreprise individuelle est souvent le point de départ sensé. Il n'y a aucun prix à se constituer en société avant d'en avoir besoin. Cela signifie aussi que vos pertes des débuts peuvent compenser vos autres revenus personnels, ce qui peut être utile durant la maigre première année." },
      { type: "heading", id: "societe-emporte", text: "Là où la société par actions l'emporte" },
      { type: "paragraph", text: "Trois choses, surtout." },
      { type: "list", items: ["La protection contre la responsabilité. Si votre entreprise comporte un vrai risque, comme signer des baux, contracter des dettes ou faire un travail où quelque chose pourrait mal tourner, le mur que constitue la société compte. Les créanciers et les réclamants s'en prennent généralement à la société, pas à vous.", "La souplesse fiscale. Une fois que votre entreprise gagne plus que ce dont vous avez besoin pour vivre, la société vous permet de laisser de l'argent dans l'entreprise, imposé au taux réduit des petites entreprises, et de choisir quand vous verser une rémunération. L'entrepreneur individuel est imposé sur tout ce que l'entreprise gagne, qu'il l'ait rapporté chez lui ou non.", "La crédibilité et la continuité. Certains clients, prêteurs et investisseurs prennent tout simplement une société plus au sérieux. Et une société peut vous survivre, être vendue ou accueillir des actionnaires, ce qu'une entreprise individuelle ne peut pas faire."] },
      { type: "heading", id: "compromis", text: "Les compromis bien réels de la constitution en société" },
      { type: "paragraph", text: "Ce n'est ni gratuit ni sans effort. Vous paierez pour la mettre en place, produirez une déclaration de revenus de société distincte chaque année, tiendrez un livre des procès-verbaux et gérerez plus d'administration en général. Si l'entreprise est petite et à faible risque, ces frais généraux ne valent peut-être pas encore la peine.", parts: ["Ce n'est ni gratuit ni sans effort. Vous paierez pour la mettre en place, produirez une déclaration de revenus de société distincte chaque année, tiendrez un ", { text: "livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" }, " et gérerez plus d'administration en général. Si l'entreprise est petite et à faible risque, ces frais généraux ne valent peut-être pas encore la peine."] },
      { type: "paragraph", text: "Il y a aussi une question de moment. Se constituer en société trop tôt, c'est payer pour une structure que l'on n'utilise pas. Se constituer trop tard, après la croissance de l'entreprise, peut faire rater une planification fiscale que l'on aurait pu saisir plus tôt. Il y a une fenêtre, et elle est différente pour chacun." },
      { type: "heading", id: "facon-de-decider", text: "Une façon simple de décider" },
      { type: "paragraph", text: "Posez-vous trois questions. Mon entreprise m'expose-t-elle à un vrai risque de responsabilité ? Est-ce que je gagne plus que ce dont j'ai besoin pour vivre ? Est-ce que je compte croître, mobiliser des fonds ou éventuellement vendre ?" },
      { type: "paragraph", text: "Si vous répondez oui à l'une de ces questions, la constitution en société vaut probablement un examen sérieux. Si c'est non sur toute la ligne, l'entreprise individuelle convient sans doute pour l'instant, et vous pourrez vous constituer en société plus tard, quand les réponses changeront. L'erreur est de traiter cela comme permanent. Ce ne l'est pas. Bien des entreprises commencent comme entreprises individuelles et se constituent en société une fois qu'elles ont grandi. La structure doit correspondre à l'étape." },
      { type: "heading", id: "bon-moment", text: "Bien choisir le moment" },
      { type: "paragraph", text: "Comme la bonne réponse évolue avec votre entreprise, cela mérite une courte conversation avec un comptable ou un avocat qualifié qui peut examiner vos chiffres réels. Lorsque vous décidez que la constitution en société est la bonne décision, Korporex dépose votre constitution fédérale ou ontarienne en ligne en une dizaine de minutes, avec la structure d'actions et le livre des procès-verbaux montés pour vous.", parts: ["Comme la bonne réponse évolue avec votre entreprise, cela mérite une courte conversation avec un comptable ou un avocat qualifié qui peut examiner vos chiffres réels. Lorsque vous décidez que la constitution en société est la bonne décision, Korporex dépose votre ", { text: "constitution fédérale ou ontarienne", href: "/guides/comment-se-constituer-societe-canada" }, " en ligne en une dizaine de minutes, avec la structure d'actions et le livre des procès-verbaux montés pour vous."] },
    ],
  },
  {
    slug: "numero-entreprise-ou-numero-societe",
    locale: "fr",
    group: "business-vs-corporation-number",
    category: "Compliance & Maintenance",
    title: "Numéro d'entreprise ou numéro de société : quelle est la différence ?",
    excerpt:
      "Ces deux numéros sont sans cesse confondus, en partie parce qu'une société possède les deux. Voici la différence entre un numéro d'entreprise et un numéro de société, en termes simples.",
    metaTitle: "Numéro d'entreprise ou numéro de société | Korporex",
    metaDescription:
      "Numéro d'entreprise ou numéro de société : ce qu'est chacun, pourquoi une société possède les deux, d'où ils viennent et comment les trouver. Un guide canadien en langage clair.",
    readTime: "5 min de lecture",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Numéro d'entreprise ou numéro de société : ces deux numéros sont sans cesse confondus, en partie parce qu'ils se ressemblent et en partie parce qu'une société possède les deux. Si vous avez déjà fixé une lettre du gouvernement en vous demandant lequel ils veulent au juste, ceci est pour vous." },
      { type: "heading", id: "version-courte", text: "La version courte" },
      { type: "paragraph", text: "Un numéro de société identifie votre société auprès de l'organisme qui l'a constituée. Il concerne l'existence de votre entreprise en tant qu'entité juridique. Un numéro d'entreprise identifie votre entreprise auprès de l'Agence du revenu du Canada à des fins fiscales. Il concerne vos rapports avec l'ARC." },
      { type: "paragraph", text: "Ils proviennent d'endroits différents, remplissent des fonctions différentes, et une société finit par avoir les deux. Une entreprise individuelle, en revanche, n'a aucun numéro de société, parce qu'elle n'est pas une société." },
      { type: "heading", id: "numero-societe", text: "Le numéro de société" },
      { type: "paragraph", text: "Lorsque vous vous constituez en société, le gouvernement qui vous enregistre, soit Corporations Canada à l'échelle fédérale, soit un registre provincial comme celui de l'Ontario, attribue un numéro à votre société. C'est votre numéro de société." },
      { type: "paragraph", text: "Si vous vous êtes constitué à l'échelle fédérale, il s'agit généralement d'un numéro de sept chiffres. Les numéros de société provinciaux ont des formats variables. Vous verrez ce numéro sur votre certificat de constitution et vos statuts. Vous l'utilisez lorsque vous produisez votre déclaration annuelle auprès de ce registre, apportez des changements à votre société ou devez prouver que l'entreprise existe et est en règle." },
      { type: "heading", id: "numero-entreprise", text: "Le numéro d'entreprise" },
      { type: "paragraph", text: "Le numéro d'entreprise, ou NE, provient de l'ARC. C'est un numéro de neuf chiffres qui sert d'identifiant unique pour tous vos rapports avec le système fiscal fédéral. Ce qui rend le NE un peu déroutant, c'est qu'il est la racine de plusieurs comptes de programme différents. Les neuf chiffres constituent votre NE de base, puis l'ARC y ajoute un code de deux lettres et quatre chiffres pour chaque type de compte que vous ouvrez :" },
      { type: "list", items: ["RT pour la TPS/TVH", "RP pour la paie", "RC pour l'impôt sur le revenu des sociétés", "RM pour l'import-export"] },
      { type: "paragraph", text: "Un même numéro d'entreprise peut donc avoir plusieurs comptes rattachés, chacun partageant la même base de neuf chiffres. Quand l'ARC demande votre numéro d'entreprise, elle veut habituellement ces neuf chiffres de base." },
      { type: "heading", id: "pourquoi-les-deux", text: "Pourquoi une société a les deux" },
      { type: "paragraph", text: "Lorsque vous vous constituez en société, vous obtenez un numéro de société du registre. Séparément, vous obtenez un numéro d'entreprise de l'ARC pour pouvoir payer l'impôt des sociétés, percevoir la TPS/TVH et gérer la paie. Ils ne sont pas interchangeables. Le registre ne se soucie pas de votre NE. L'ARC ne se soucie pas de votre numéro de société. Chacun veut le sien.", parts: ["Lorsque vous vous constituez en société, vous obtenez un numéro de société du registre. Séparément, vous obtenez un numéro d'entreprise de l'ARC pour pouvoir payer l'impôt des sociétés, ", { text: "percevoir la TPS/TVH", href: "/guides/comment-obtenir-numero-tps-tvh-ontario" }, " et gérer la paie. Ils ne sont pas interchangeables. Le registre ne se soucie pas de votre NE. L'ARC ne se soucie pas de votre numéro de société. Chacun veut le sien."] },
      { type: "paragraph", text: "L'entrepreneur individuel n'a aucun numéro de société. Il n'est pas constitué en société, alors il n'y a rien à numéroter pour un registre. Mais il obtiendra tout de même un numéro d'entreprise de l'ARC dès qu'il s'inscrira à la TPS/TVH ou à la paie." },
      { type: "heading", id: "comment-trouver", text: "Comment trouver chacun d'eux" },
      { type: "paragraph", text: "Votre numéro de société figure sur votre certificat de constitution et vos statuts. Si vous les avez perdus, vous pouvez le retrouver auprès du registre qui vous a constitué, fédéral ou provincial, à l'aide du nom de votre société. Votre numéro d'entreprise figure sur la plupart des correspondances de l'ARC, dans votre dossier Mon dossier d'entreprise, ainsi que sur vos documents de TPS/TVH et de paie. Si vous ne le trouvez vraiment pas, l'ARC peut vous le communiquer par téléphone après avoir confirmé votre identité." },
      { type: "heading", id: "quand-cela-importe", text: "Quand cela importe" },
      { type: "paragraph", text: "Pour l'exploitation au quotidien, vous pensez rarement à l'un ou à l'autre. Ils comptent à des moments précis : la production des déclarations annuelles, vos rapports avec l'ARC, l'ouverture d'un compte bancaire d'entreprise, une demande de financement, ou la preuve que votre société est réelle et en règle." },
      { type: "paragraph", text: "Lorsque vous vous constituez en société avec Korporex, vos statuts, votre numéro d'entreprise de l'ARC et votre livre des procès-verbaux sont mis en place ensemble, de sorte que votre numéro de société et votre numéro d'entreprise sont tous deux prêts dès le départ." },
    ],
  },
  {
    slug: "comment-se-constituer-societe-canada",
    locale: "fr",
    group: "incorporate-canada",
    category: "Jurisdiction Comparisons",
    title: "Comment se constituer en société au Canada : fédéral ou provincial",
    excerpt:
      "La première vraie bifurcation quand vous vous constituez en société au Canada, c'est fédéral ou provincial. Voici les différences, les coûts et les étapes.",
    metaTitle: "Se constituer en société au Canada : fédéral ou provincial | Korporex",
    metaDescription:
      "Comment se constituer en société au Canada, étape par étape. Comparez la constitution fédérale et provinciale, la protection du nom, les coûts et les dépôts pour choisir la bonne voie.",
    readTime: "7 min de lecture",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Décider de se constituer en société, c'est la partie facile. La première vraie bifurcation, c'est de savoir s'il faut se constituer à l'échelle fédérale ou provinciale, et un nombre étonnant de gens font ce choix en fonction de l'option qu'un site Web leur a montrée en premier. Cela mérite quelques minutes de réelle réflexion, car les deux sont vraiment différents." },
      { type: "heading", id: "ce-que-la-constitution-apporte", text: "Ce que la constitution vous apporte, dans les deux cas" },
      { type: "paragraph", text: "Avant la question du fédéral ou du provincial, il est utile de se rappeler ce que vous achetez. La constitution en société crée une entité juridique distincte qui peut posséder des biens, signer des contrats et porter ses propres responsabilités. Elle sépare l'entreprise de vous personnellement et ouvre une planification fiscale qui n'est pas offerte à l'entrepreneur individuel. Cela est vrai, que vous alliez au fédéral ou au provincial. La différence porte sur l'endroit où votre société est reconnue et sur la manière dont son nom est protégé." },
      { type: "heading", id: "constitution-federale", text: "La constitution fédérale" },
      { type: "paragraph", text: "La constitution fédérale se fait en vertu de la Loi canadienne sur les sociétés par actions, par l'entremise de Corporations Canada. Le principal avantage est la protection du nom partout au pays. Lorsque vous vous constituez à l'échelle fédérale, votre nom est vérifié à l'échelle nationale et protégé à l'échelle nationale. Personne dans une autre province ne peut enregistrer une société portant un nom prêtant à confusion avec le vôtre." },
      { type: "paragraph", text: "La constitution fédérale a aussi un certain poids. Si vous comptez exercer dans plus d'une province, mobiliser des fonds ou bâtir une marque qui traverse les frontières provinciales, le fédéral est souvent le meilleur choix. Les compromis : il y a plus d'administration. Une société constituée à l'échelle fédérale doit tout de même s'enregistrer de façon extraprovinciale dans chaque province où elle exerce réellement ses activités, ce qui suppose des dépôts additionnels." },
      { type: "heading", id: "constitution-provinciale", text: "La constitution provinciale" },
      { type: "paragraph", text: "Se constituer en société en Ontario (ou dans toute autre province) se fait par le registre de cette province. Si votre entreprise exerce surtout à l'intérieur d'une seule province, c'est habituellement la voie la plus simple et la plus économique." },
      { type: "paragraph", text: "Votre protection du nom se limite à cette province, ce qui convient si vous n'avez aucun projet d'expansion ailleurs. L'administration courante est généralement plus légère, et vous traitez avec un seul gouvernement plutôt que potentiellement plusieurs. Pour un très grand nombre de petites et moyennes entreprises de l'Ontario, la constitution provinciale couvre tout ce dont elles ont besoin, sans les couches supplémentaires." },
      { type: "heading", id: "comment-se-constituer", text: "Comment se constituer concrètement" },
      { type: "paragraph", text: "Quel que soit votre choix, la mécanique est semblable :" },
      { type: "list", items: ["Choisissez votre nom (ou prenez une société à matricule, ce qui évite la recherche de nom). Une société avec un nom exige une recherche de nom NUANS pour confirmer que le nom est disponible et pas trop semblable aux noms existants.", "Déposez vos statuts constitutifs. Ils énoncent la structure de base de votre société, y compris ses catégories d'actions.", "Établissez votre structure d'actions. Elle détermine qui possède quoi, comment les profits peuvent être distribués et comment vous pourrez accueillir des associés ou des investisseurs plus tard.", "Nommez vos administrateurs et établissez votre siège social.", "Obtenez votre numéro d'entreprise de l'ARC et ouvrez les comptes fiscaux dont vous avez besoin (impôt des sociétés, TPS/TVH, paie).", "Commencez votre livre des procès-verbaux, le registre juridique continu de la société."] },
      { type: "callout", title: "Ce que les gens sous-estiment", text: "La structure d'actions est l'endroit où la constitution faite soi-même tourne le plus souvent mal. Une constitution en ligne bon marché donne généralement à tout le monde la même configuration d'actions simple, ce qui fonctionne très bien jusqu'à ce que vous vouliez accueillir un cofondateur, verser des dividendes à des membres de la famille ou vendre une partie de l'entreprise. La corriger coûte alors bien plus cher que de l'avoir bien montée au départ." },
      { type: "heading", id: "lequel-choisir", text: "Lequel choisir ?" },
      { type: "paragraph", text: "Si vous exercez surtout dans une seule province et n'avez aucun projet immédiat d'expansion, la constitution provinciale suffit habituellement. Si vous travaillerez dans plusieurs provinces, voulez une protection du nom à l'échelle nationale ou bâtissez quelque chose que vous comptez faire croître ou financer, le fédéral vaut l'administration supplémentaire. Aucun n'est universellement le bon. Tout dépend d'où va l'entreprise." },
      { type: "paragraph", text: "Korporex dépose les constitutions fédérales et ontariennes en ligne, y compris la recherche de nom NUANS, les statuts et la mise en place de la structure d'actions, et livre vos documents en 24 heures.", parts: ["Korporex dépose les constitutions fédérales et ontariennes en ligne, y compris la ", { text: "recherche de nom NUANS", href: "/nuans" }, ", les statuts et la mise en place de la structure d'actions, et livre vos documents en 24 heures."] },
    ],
  },
  {
    slug: "quest-ce-quun-livre-des-proces-verbaux",
    locale: "fr",
    group: "minute-book",
    category: "Compliance & Maintenance",
    title: "Qu'est-ce qu'un livre des procès-verbaux et pourquoi votre société en a-t-elle besoin ?",
    excerpt:
      "Si vous vous êtes constitué en société, vous devez tenir un livre des procès-verbaux. Voici ce que c'est réellement, pourquoi ce n'est pas facultatif et ce qui arrive si vous l'ignorez.",
    metaTitle: "Qu'est-ce qu'un livre des procès-verbaux ? | Korporex",
    metaDescription:
      "Un livre des procès-verbaux est le registre légal de l'existence et des décisions de votre société. Voyez ce qu'il contient, pourquoi il est obligatoire et le coût de le négliger.",
    readTime: "4 min de lecture",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Si vous vous êtes constitué en société, quelqu'un vous a probablement dit que vous deviez tenir un livre des procès-verbaux. Et si vous êtes comme la plupart des nouveaux entrepreneurs, vous avez hoché la tête, classé cela dans la catégorie « à régler plus tard », et vous n'y avez plus repensé depuis." },
      { type: "paragraph", text: "Voici le guide qui explique ce que c'est réellement, pourquoi ce n'est pas facultatif et ce qui arrive si vous l'ignorez." },
      { type: "heading", id: "ce-que-cest", text: "Ce qu'est un livre des procès-verbaux" },
      { type: "paragraph", text: "Un livre des procès-verbaux est le registre officiel de l'existence de votre société et de ses décisions. Malgré son nom, il ne porte pas que sur les procès-verbaux de réunions. C'est le dossier central qui contient les documents prouvant que votre société est réelle, qui la détient, qui la dirige et quelles décisions importantes elle a prises. Il peut s'agir d'un classeur physique ou, de plus en plus, d'un fichier numérique. Le format importe peu. Ce qui compte, c'est que les registres existent et soient tenus à jour." },
      { type: "heading", id: "ce-quon-y-trouve", text: "Ce qu'on y trouve" },
      { type: "paragraph", text: "Un livre des procès-verbaux complet comprend généralement :" },
      { type: "list", items: ["Vos statuts constitutifs et votre certificat de constitution", "Les règlements administratifs de la société", "Le registre des administrateurs, indiquant qui a siégé et quand", "Le registre des actionnaires, indiquant qui détient des actions et combien", "Les certificats d'actions et le registre des transferts d'actions", "Les procès-verbaux des réunions et, plus souvent pour les petites sociétés, les résolutions écrites qui tiennent lieu de réunions", "Les dossiers annuels, dont l'approbation des états financiers et la nomination des administrateurs et dirigeants"] },
      { type: "heading", id: "pas-facultatif", text: "Pourquoi ce n'est pas facultatif" },
      { type: "paragraph", text: "Le droit canadien des sociétés exige des sociétés qu'elles tiennent ces registres. C'est une obligation légale, pas une bonne pratique que l'on peut laisser de côté. Les lois sur les sociétés, tant fédérales que provinciales, précisent ce qui doit être conservé. Mais la loi n'est que la moitié de la raison. L'autre moitié, c'est que le livre des procès-verbaux devient essentiel précisément aux moments qui comptent le plus :" },
      { type: "list", items: ["Au moment de vendre l'entreprise. L'avocat de tout acheteur sérieux réclamera le livre des procès-verbaux lors de la vérification diligente. Un livre manquant ou en désordre ralentit la transaction et fait parfois échouer l'affaire.", "Au moment de mobiliser des fonds ou d'emprunter. Les investisseurs et les prêteurs veulent voir des registres clairs indiquant qui détient quoi.", "En cas de différend. Si des actionnaires sont en désaccord, le livre des procès-verbaux est souvent ce qui tranche qui a droit à quoi.", "Au moment des impôts et lors d'une vérification. L'ARC peut vouloir constater que les dividendes, les salaires et les autres décisions ont été dûment autorisés."] },
      { type: "heading", id: "si-vous-negligez", text: "Ce qui arrive si vous le négligez" },
      { type: "paragraph", text: "Rien, au début. C'est là le piège. Un livre des procès-verbaux qui n'a pas été mis à jour depuis trois ans ne cause aucun problème immédiat, alors il est facile de continuer à l'ignorer." },
      { type: "paragraph", text: "Le coût arrive d'un seul coup, généralement quand vous tentez de faire quelque chose qui presse : conclure une vente, signer avec un investisseur, satisfaire un prêteur. Soudain, il vous faut des années de résolutions jamais rédigées, des registres d'actionnaires jamais mis à jour et des approbations qui n'ont jamais eu lieu sur papier. Les avocats peuvent reconstituer un livre négligé, mais c'est plus lent et plus coûteux que de l'avoir tenu à jour, et parfois les lacunes ne peuvent pas être proprement corrigées après coup." },
      { type: "heading", id: "le-tenir-a-jour", text: "Le tenir à jour" },
      { type: "paragraph", text: "Pour une petite société, tenir un livre des procès-verbaux n'est pas une tâche lourde. La principale tâche récurrente est la paperasse annuelle : approuver les états financiers, confirmer les administrateurs et les dirigeants, et consigner toute décision importante comme la déclaration de dividendes ou l'émission d'actions." },
      { type: "paragraph", text: "Si vous vous êtes constitué en société et n'êtes pas certain que votre livre des procès-verbaux est complet ou à jour, il vaut la peine de le vérifier avant d'en avoir besoin plutôt qu'après. Korporex monte un livre des procès-verbaux complet au moment de la constitution, et peut en préparer un pour une société existante, pour que les registres soient là et corrects le jour où quelqu'un les demande." },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Spanish (batch 1)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "como-obtener-numero-gst-hst-ontario",
    locale: "es",
    group: "gst-hst-ontario",
    category: "Compliance & Maintenance",
    title: "Cómo obtener un número de GST/HST en Ontario",
    excerpt:
      "Quién necesita realmente un número de GST/HST, cuándo el registro es obligatorio y cómo registrarse ante la CRA sin complicarse la vida.",
    metaTitle: "Cómo obtener un número de GST/HST en Ontario | Korporex",
    metaDescription:
      "Cómo obtener un número de GST/HST en Ontario: quién lo necesita, el umbral de pequeño proveedor de 30 000 $, y cómo registrarse ante la CRA en línea, por teléfono o por correo.",
    readTime: "5 min de lectura",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Si está iniciando un negocio en Ontario, tarde o temprano se topará con la cuestión del número de GST/HST. Quizá un cliente se lo pidió antes de pagar una factura. Quizá su contador lo mencionó. Quizá simplemente leyó que se supone que debe tener uno y ahora no sabe si eso aplica a su caso." },
      { type: "paragraph", text: "Aquí está la versión sencilla de cómo obtener un número de GST/HST en Ontario: cómo funciona, quién lo necesita realmente y cómo registrarse sin complicarse la vida." },
      { type: "heading", id: "que-es", text: "Qué es realmente un número de GST/HST" },
      { type: "paragraph", text: "El GST es el impuesto federal sobre bienes y servicios. El HST es el impuesto de venta armonizado, que es el que usa Ontario, porque la provincia combinó su impuesto de venta con el GST federal en una sola tasa del 13 %. Cuando la gente habla del «número de GST/HST», se refiere a lo mismo: una cuenta ante la Agencia de Ingresos de Canadá que le permite cobrar este impuesto a sus clientes y entregarlo al gobierno." },
      { type: "paragraph", text: "El número en sí está vinculado a su número de negocio de la CRA. Por lo general se ve como su número de negocio de nueve dígitos seguido de «RT0001».", parts: ["El número en sí está vinculado a su ", { text: "número de negocio de la CRA", href: "/guides/numero-negocio-o-numero-sociedad" }, ". Por lo general se ve como su número de negocio de nueve dígitos seguido de «RT0001»."] },
      { type: "heading", id: "lo-necesita", text: "¿De verdad lo necesita?" },
      { type: "paragraph", text: "Esta es la parte que la mayoría malinterpreta, así que vale la pena ir despacio." },
      { type: "paragraph", text: "Está obligado a registrarse en cuanto su negocio genere más de 30 000 $ en ingresos durante cuatro trimestres calendario consecutivos. La CRA llama a esto el umbral de pequeño proveedor. Si se mantiene por debajo, el registro es opcional. Si lo supera, tiene 29 días para registrarse a partir del día en que lo rebasa." },
      { type: "list", items: ["Los 30 000 $ se basan en el ingreso mundial total de ventas gravables, no en su ganancia.", "Se mide de forma continua, no por año calendario. Cuatro trimestres seguidos.", "Algunos negocios se registran de forma voluntaria aun siendo pequeños, porque estar registrado permite recuperar el GST/HST que pagan en sus propios gastos (son los créditos por impuesto soportado). Para un negocio con verdaderos costos de arranque, eso puede valer más que la molestia de presentar declaraciones."] },
      { type: "paragraph", text: "Si usted es conductor de taxi o de aplicaciones de transporte, el umbral no le aplica. Debe registrarse desde el primer dólar." },
      { type: "heading", id: "como-registrarse", text: "Cómo registrarse" },
      { type: "paragraph", text: "Hay tres maneras, y no son igual de cómodas." },
      { type: "list", items: ["En línea, a través de Mi cuenta de empresa de la CRA. Es la vía habitual. Primero necesitará su número de negocio. Si todavía no lo tiene, el proceso de registro puede generarlo al mismo tiempo.", "Por teléfono. Puede llamar a la línea de empresas de la CRA y registrarse por teléfono si prefiere hablar con una persona.", "Por correo o fax, con el formulario RC1. Es la opción lenta y rara vez hay una buena razón para elegirla."] },
      { type: "paragraph", text: "Al registrarse, la CRA le pedirá la fecha de inicio de su negocio, su ingreso anual estimado, su período de declaración y el cierre de su ejercicio fiscal. A la mayoría de los pequeños negocios se les asigna por defecto un período de declaración anual, lo que significa presentar una declaración al año. Puede solicitar una frecuencia trimestral o mensual si se ajusta mejor a su flujo de caja." },
      { type: "heading", id: "despues-de-registrarse", text: "Qué pasa después de registrarse" },
      { type: "paragraph", text: "Una vez que tiene el número, tres cosas cambian. Empieza a cobrar el 13 % de HST sobre sus ventas gravables en Ontario. Pone su número de GST/HST en sus facturas, porque los clientes que también están registrados querrán tenerlo para reclamar sus propios créditos. Y presenta una declaración según la frecuencia que le asignaron, informando lo que cobró y restando lo que pagó." },
      { type: "callout", text: "El impuesto que cobra no es su dinero. Sepárelo a medida que entra, o lo sentirá al momento de declarar." },
      { type: "heading", id: "momento-adecuado", text: "Hacerlo en el momento adecuado" },
      { type: "paragraph", text: "El registro en sí es administrativo y puede hacerlo usted mismo. Donde se vuelve menos evidente es en las decisiones que lo rodean: si conviene registrarse de forma voluntaria, cómo se relaciona el momento con la constitución de una sociedad, y cómo fluye el impuesto una vez que tiene empleados o vende en varias provincias. Eso merece una breve conversación con un contador calificado antes de comprometerse." },
      { type: "paragraph", text: "Si está constituyendo una sociedad en Ontario, Korporex configura su número de negocio de la CRA y su registro de GST/HST como parte del trámite en línea, para que sus cuentas fiscales estén listas desde el primer día.", parts: ["Si está ", { text: "constituyendo una sociedad en Ontario", href: "/guides/como-registrar-negocio-ontario" }, ", Korporex configura su número de negocio de la CRA y su registro de GST/HST como parte del trámite en línea, para que sus cuentas fiscales estén listas desde el primer día."] },
    ],
  },
  {
    slug: "como-registrar-negocio-ontario",
    locale: "es",
    group: "register-business-ontario",
    category: "Incorporation Guides",
    title: "Cómo registrar un negocio en Ontario",
    excerpt:
      "Registrar un negocio en Ontario es sobre todo papeleo. Lo difícil es elegir primero su estructura. Aquí está todo el recorrido, de principio a fin.",
    metaTitle: "Cómo registrar un negocio en Ontario | Korporex",
    metaDescription:
      "Cómo registrar un negocio en Ontario: elija su estructura, registre una empresa unipersonal o sociedad de personas por ServiceOntario, o constitúyase en sociedad. El recorrido completo.",
    readTime: "6 min de lectura",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Registrar un negocio en Ontario es una de esas tareas que suenan intimidantes y resultan ser, sobre todo, papeleo. Lo difícil es la decisión que toma antes del papeleo: qué tipo de negocio está registrando en realidad. Acierte en eso y lo demás viene solo." },
      { type: "paragraph", text: "Aquí está todo el recorrido para registrar un negocio en Ontario, de principio a fin." },
      { type: "heading", id: "elija-estructura", text: "Primero, elija su estructura" },
      { type: "paragraph", text: "Antes de registrar nada, necesita saber qué está registrando. En Ontario, la mayoría de los negocios nuevos cae en una de tres categorías." },
      { type: "paragraph", text: "Una empresa unipersonal es usted, operando como negocio, bajo un nombre que no es su nombre legal. Es la más sencilla y económica de montar. El inconveniente es que no hay separación legal entre usted y el negocio, así que las deudas del negocio son sus deudas." },
      { type: "paragraph", text: "Una sociedad de personas son dos o más personas haciendo lo mismo juntas. Misma sencillez, misma falta de separación, más el detalle adicional de que puede responder por lo que haga su socio." },
      { type: "paragraph", text: "Una sociedad por acciones es una entidad legal independiente. Cuesta más y exige más mantenimiento, pero levanta un muro entre sus bienes personales y el negocio, y puede ser más eficiente desde el punto de vista fiscal una vez que gana dinero de verdad." },
      { type: "paragraph", text: "Si no está seguro de cuál le conviene, esa elección merece más reflexión que el registro en sí. La abordamos en una guía aparte sobre empresa unipersonal frente a constituirse en sociedad.", parts: ["Si no está seguro de cuál le conviene, esa elección merece más reflexión que el registro en sí. La abordamos en una guía aparte sobre ", { text: "empresa unipersonal frente a constituirse en sociedad", href: "/guides/empresa-unipersonal-o-sociedad" }, "."] },
      { type: "heading", id: "unipersonal-personas", text: "Registrar una empresa unipersonal o una sociedad de personas" },
      { type: "paragraph", text: "Si opta por una empresa unipersonal o una sociedad de personas que opera bajo un nombre comercial, registra ese nombre a través de ServiceOntario. Es el Registro de Nombre Comercial, antes llamado Master Business Licence." },
      { type: "paragraph", text: "Puede hacerlo en línea. Necesitará el nombre comercial que desea, sus datos de contacto y una descripción de lo que hace el negocio. El registro es válido por cinco años y luego se renueva." },
      { type: "callout", text: "Un paso que la gente se salta: busque primero el nombre. Ontario no le impide registrar un nombre que otra persona ya usa, lo que significa que podría registrar algo que después lo meta en un conflicto de marca. Una búsqueda rápida antes de comprometerse es un seguro barato." },
      { type: "heading", id: "registrar-sociedad", text: "Registrar una sociedad por acciones" },
      { type: "paragraph", text: "Constituirse en sociedad es un paso mayor. Primero elige si se constituye a nivel provincial, en Ontario, o a nivel federal, bajo la Ley Canadiense de Sociedades por Acciones. Lo provincial suele ser más sencillo si piensa operar principalmente en Ontario. Lo federal le da protección del nombre en todo el país.", parts: ["Constituirse en sociedad es un paso mayor. Primero elige si se constituye a nivel provincial, en Ontario, o ", { text: "a nivel federal, bajo la Ley Canadiense de Sociedades por Acciones", href: "/guides/como-constituirse-sociedad-canada" }, ". Lo provincial suele ser más sencillo si piensa operar principalmente en Ontario. Lo federal le da protección del nombre en todo el país."] },
      { type: "paragraph", text: "En cualquier caso, la constitución implica presentar los estatutos de constitución, elegir el nombre de su sociedad (o tomar un nombre numérico), establecer su estructura de acciones y nombrar a sus directores. También necesitará una búsqueda de nombre NUANS si quiere una sociedad con nombre en lugar de una numérica." },
      { type: "paragraph", text: "Esta es la etapa en la que hacerlo por su cuenta puede costarle caro en silencio. La estructura de acciones y los estatutos no son solo formularios. Determinan cómo podrá incorporar socios, pagarse a usted mismo y vender el negocio más adelante. La gente suele constituirse en sociedad de forma barata en línea y luego paga más un año después para corregir una estructura que no anticipó hacia dónde fue el negocio." },
      { type: "heading", id: "despues-de-registrarse", text: "Después de registrarse" },
      { type: "paragraph", text: "Sea cual sea la vía que tomó, suelen seguir algunos pasos." },
      { type: "list", items: ["Obtiene un número de negocio de la CRA si no lo tiene ya.", "Se registra para el GST/HST si espera superar el umbral de 30 000 $.", "Si va a contratar, abre una cuenta de nómina.", "Y si se constituyó en sociedad, comienza a llevar un libro de actas, el registro obligatorio de las decisiones de la sociedad."] },
      { type: "paragraph", text: "Ninguno de estos pasos es urgente el primer día, pero se acumulan si los ignora, y algunos conllevan multas cuando se omiten." },
      { type: "heading", id: "donde-korporex", text: "Dónde encaja Korporex" },
      { type: "paragraph", text: "Puede registrar una empresa unipersonal usted mismo en una tarde a través de ServiceOntario. Para constituirse en sociedad, Korporex maneja los trámites de constitución de Ontario y federales en línea, incluida la búsqueda de nombre NUANS, la estructura de acciones y el libro de actas, para que pueda hacerlo todo en un solo lugar y reciba sus documentos en 24 horas.", parts: ["Puede registrar una empresa unipersonal usted mismo en una tarde a través de ServiceOntario. Para constituirse en sociedad, Korporex maneja los trámites de constitución de Ontario y federales en línea, incluida la ", { text: "búsqueda de nombre NUANS", href: "/nuans" }, ", la estructura de acciones y el libro de actas, para que pueda hacerlo todo en un solo lugar y reciba sus documentos en 24 horas."] },
    ],
  },
  {
    slug: "empresa-unipersonal-o-sociedad",
    locale: "es",
    group: "sole-prop-vs-corp",
    category: "Incorporation Guides",
    title: "Empresa unipersonal o sociedad por acciones en Canadá: ¿cuál le conviene?",
    excerpt:
      "La decisión que casi todo nuevo emprendedor enfrenta. Así puede pensar a fondo entre empresa unipersonal o sociedad según hacia dónde va su negocio.",
    metaTitle: "Empresa unipersonal o sociedad por acciones en Canadá | Korporex",
    metaDescription:
      "Empresa unipersonal o sociedad por acciones en Canadá: sus diferencias en responsabilidad, impuestos y costo, más una forma sencilla de decidir cuál le conviene ahora.",
    readTime: "6 min de lectura",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Empresa unipersonal o sociedad por acciones: es la decisión que casi todo nuevo emprendedor enfrenta, y la que más a menudo se equivoca al optar por defecto por lo que fue más fácil de montar. La respuesta honesta es que depende de hacia dónde va su negocio, no solo de dónde está hoy." },
      { type: "paragraph", text: "Así puede pensarlo a fondo." },
      { type: "heading", id: "diferencia-esencial", text: "La diferencia esencial" },
      { type: "paragraph", text: "Una empresa unipersonal no está separada de usted. Legalmente, usted y el negocio son la misma persona. Declara los ingresos del negocio en su declaración de impuestos personal, y si el negocio debe dinero o lo demandan, esa responsabilidad es suya en lo personal. Su casa y sus ahorros están, en teoría, en juego." },
      { type: "paragraph", text: "Una sociedad por acciones es una persona jurídica independiente. Posee sus propios bienes, firma sus propios contratos y responde por sus propias deudas. Usted posee acciones en ella, pero por lo general no responde personalmente por lo que la sociedad debe. Esa separación es justamente el punto. Todo lo demás se desprende de esa única distinción." },
      { type: "heading", id: "unipersonal-gana", text: "Dónde gana la empresa unipersonal" },
      { type: "paragraph", text: "La sencillez y el costo. Puede registrar una por una tarifa modesta, sus impuestos se presentan junto con su declaración personal y la administración corriente es muy ligera. Sin declaración anual de sociedad, sin libro de actas, sin declaración de impuestos aparte." },
      { type: "paragraph", text: "Si está probando una idea, trabajando de forma independiente a tiempo parcial o llevando algo pequeño con poco riesgo de responsabilidad, la empresa unipersonal suele ser el punto de partida sensato. No hay premio por constituirse en sociedad antes de necesitarlo. También significa que sus pérdidas iniciales pueden compensar sus otros ingresos personales, lo que puede ser útil en el flaco primer año." },
      { type: "heading", id: "sociedad-gana", text: "Dónde gana la sociedad por acciones" },
      { type: "paragraph", text: "Tres cosas, principalmente." },
      { type: "list", items: ["Protección frente a la responsabilidad. Si su negocio conlleva un riesgo real, como firmar arrendamientos, asumir deudas o hacer un trabajo donde algo podría salir mal, el muro de la sociedad importa. Los acreedores y demandantes por lo general van contra la sociedad, no contra usted.", "Flexibilidad fiscal. Una vez que su negocio gana más de lo que necesita para vivir, la sociedad le permite dejar dinero dentro de la empresa, gravado a la tasa reducida para pequeñas empresas, y decidir cuándo pagarse. Al empresario unipersonal se le grava sobre todo lo que el negocio gana, lo haya llevado a casa o no.", "Credibilidad y continuidad. Algunos clientes, prestamistas e inversionistas simplemente toman más en serio a una sociedad. Y una sociedad puede sobrevivirle, venderse o incorporar accionistas de un modo que una empresa unipersonal no puede."] },
      { type: "heading", id: "concesiones", text: "Las concesiones reales de constituirse en sociedad" },
      { type: "paragraph", text: "No es gratis ni libre de esfuerzo. Pagará por montarla, presentará una declaración de impuestos de sociedad aparte cada año, llevará un libro de actas y manejará más administración en general. Si el negocio es pequeño y de bajo riesgo, esa carga quizá no valga la pena todavía.", parts: ["No es gratis ni libre de esfuerzo. Pagará por montarla, presentará una declaración de impuestos de sociedad aparte cada año, llevará un ", { text: "libro de actas", href: "/guides/que-es-un-libro-de-actas" }, " y manejará más administración en general. Si el negocio es pequeño y de bajo riesgo, esa carga quizá no valga la pena todavía."] },
      { type: "paragraph", text: "También hay una cuestión de momento. Constituirse demasiado pronto es pagar por una estructura que no usa. Constituirse demasiado tarde, después de que el negocio creció, puede hacerle perder una planificación fiscal que podría haber aprovechado antes. Hay una ventana, y es distinta para cada quien." },
      { type: "heading", id: "forma-de-decidir", text: "Una forma sencilla de decidir" },
      { type: "paragraph", text: "Hágase tres preguntas. ¿Mi negocio me expone a un riesgo real de responsabilidad? ¿Gano más de lo que necesito para llevar a casa y vivir? ¿Planeo crecer, conseguir financiamiento o eventualmente vender?" },
      { type: "paragraph", text: "Si responde que sí a alguna, constituirse en sociedad probablemente merece un análisis serio. Si es no en todas, la empresa unipersonal seguramente está bien por ahora, y podrá constituirse después, cuando las respuestas cambien. El error es tratar esto como permanente. No lo es. Muchos negocios empiezan como empresas unipersonales y se constituyen en sociedad una vez que crecen lo suficiente. La estructura debe corresponder a la etapa." },
      { type: "heading", id: "momento-adecuado", text: "Acertar con el momento" },
      { type: "paragraph", text: "Como la respuesta correcta cambia a medida que su negocio cambia, esto merece una breve conversación con un contador o abogado calificado que pueda ver sus cifras reales. Cuando decide que constituirse en sociedad es lo correcto, Korporex presenta su constitución federal u ontariana en línea en unos 10 minutos, con la estructura de acciones y el libro de actas montados por usted.", parts: ["Como la respuesta correcta cambia a medida que su negocio cambia, esto merece una breve conversación con un contador o abogado calificado que pueda ver sus cifras reales. Cuando decide que constituirse en sociedad es lo correcto, Korporex presenta su ", { text: "constitución federal u ontariana", href: "/guides/como-constituirse-sociedad-canada" }, " en línea en unos 10 minutos, con la estructura de acciones y el libro de actas montados por usted."] },
    ],
  },
  {
    slug: "numero-negocio-o-numero-sociedad",
    locale: "es",
    group: "business-vs-corporation-number",
    category: "Compliance & Maintenance",
    title: "Número de negocio o número de sociedad: ¿cuál es la diferencia?",
    excerpt:
      "Estos dos números se confunden constantemente, en parte porque una sociedad tiene ambos. Aquí está la diferencia entre un número de negocio y un número de sociedad, en términos sencillos.",
    metaTitle: "Número de negocio o número de sociedad | Korporex",
    metaDescription:
      "Número de negocio o número de sociedad: qué es cada uno, por qué una sociedad tiene ambos, de dónde vienen y cómo encontrar cada uno. Una guía canadiense en lenguaje claro.",
    readTime: "5 min de lectura",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Número de negocio o número de sociedad: estos dos se confunden constantemente, en parte porque suenan parecido y en parte porque una sociedad tiene ambos. Si alguna vez se quedó mirando una carta del gobierno preguntándose cuál número quieren en realidad, esto es para usted." },
      { type: "heading", id: "version-corta", text: "La versión corta" },
      { type: "paragraph", text: "Un número de sociedad identifica a su sociedad ante el organismo que la constituyó. Tiene que ver con la existencia de su empresa como entidad legal. Un número de negocio identifica a su negocio ante la Agencia de Ingresos de Canadá para fines fiscales. Tiene que ver con su trato con la CRA." },
      { type: "paragraph", text: "Provienen de lugares distintos, cumplen funciones distintas, y una sociedad termina teniendo ambos. Una empresa unipersonal, en cambio, no tiene número de sociedad, porque no es una sociedad." },
      { type: "heading", id: "numero-sociedad", text: "El número de sociedad" },
      { type: "paragraph", text: "Cuando se constituye en sociedad, el gobierno que lo registra, ya sea Corporations Canada a nivel federal o un registro provincial como el de Ontario, le asigna un número a su sociedad. Ese es su número de sociedad." },
      { type: "paragraph", text: "Si se constituyó a nivel federal, suele ser un número de siete dígitos. Los números de sociedad provinciales varían en formato. Verá este número en su certificado de constitución y en sus estatutos. Lo usa cuando presenta su declaración anual ante ese registro, hace cambios a su sociedad o necesita probar que la empresa existe y está en regla." },
      { type: "heading", id: "numero-negocio", text: "El número de negocio" },
      { type: "paragraph", text: "El número de negocio, o BN, proviene de la CRA. Es un número de nueve dígitos que funciona como el identificador único para todos sus tratos con el sistema fiscal federal. Lo que hace que el BN resulte algo confuso es que es la raíz de varias cuentas de programa distintas. Los nueve dígitos son su BN base, y luego la CRA le añade un código de dos letras y cuatro dígitos por cada tipo de cuenta que abre:" },
      { type: "list", items: ["RT para el GST/HST", "RP para la nómina", "RC para el impuesto sobre la renta de sociedades", "RM para importación y exportación"] },
      { type: "paragraph", text: "Así que un mismo número de negocio puede tener varias cuentas colgando de él, cada una con la misma base de nueve dígitos. Cuando la CRA pide su número de negocio, suele referirse a esos nueve dígitos base." },
      { type: "heading", id: "por-que-ambos", text: "Por qué una sociedad tiene ambos" },
      { type: "paragraph", text: "Cuando se constituye en sociedad, obtiene un número de sociedad del registro. Por separado, obtiene un número de negocio de la CRA para poder pagar el impuesto de sociedades, cobrar el GST/HST y manejar la nómina. No son intercambiables. Al registro no le importa su BN. A la CRA no le importa su número de sociedad. Cada uno quiere el suyo.", parts: ["Cuando se constituye en sociedad, obtiene un número de sociedad del registro. Por separado, obtiene un número de negocio de la CRA para poder pagar el impuesto de sociedades, ", { text: "cobrar el GST/HST", href: "/guides/como-obtener-numero-gst-hst-ontario" }, " y manejar la nómina. No son intercambiables. Al registro no le importa su BN. A la CRA no le importa su número de sociedad. Cada uno quiere el suyo."] },
      { type: "paragraph", text: "El empresario unipersonal se salta el número de sociedad por completo. No está constituido en sociedad, así que no hay nada que un registro deba numerar. Pero igual obtendrá un número de negocio de la CRA en cuanto se registre para el GST/HST o la nómina." },
      { type: "heading", id: "como-encontrar", text: "Cómo encontrar cada uno" },
      { type: "paragraph", text: "Su número de sociedad está en su certificado de constitución y en sus estatutos. Si los perdió, puede encontrarlo a través del registro que lo constituyó, federal o provincial, usando el nombre de su sociedad. Su número de negocio está en la mayoría de la correspondencia de la CRA, en su Mi cuenta de empresa y en sus documentos de GST/HST y nómina. Si de verdad no lo encuentra, la CRA puede dárselo por teléfono después de confirmar su identidad." },
      { type: "heading", id: "cuando-importa", text: "Cuándo importa" },
      { type: "paragraph", text: "Para la operación del día a día, rara vez piensa en alguno de los dos. Importan en momentos concretos: presentar declaraciones anuales, tratar con la CRA, abrir una cuenta bancaria de empresa, solicitar financiamiento o probar que su sociedad es real y está en regla." },
      { type: "paragraph", text: "Cuando se constituye en sociedad con Korporex, sus estatutos, su número de negocio de la CRA y su libro de actas se configuran juntos, de modo que su número de sociedad y su número de negocio están ambos listos desde el inicio." },
    ],
  },
  {
    slug: "como-constituirse-sociedad-canada",
    locale: "es",
    group: "incorporate-canada",
    category: "Jurisdiction Comparisons",
    title: "Cómo constituirse en sociedad en Canadá: federal o provincial",
    excerpt:
      "La primera bifurcación real cuando se constituye en sociedad en Canadá es federal o provincial. Aquí están las diferencias, los costos y los pasos.",
    metaTitle: "Constituirse en sociedad en Canadá: federal o provincial | Korporex",
    metaDescription:
      "Cómo constituirse en sociedad en Canadá, paso a paso. Compare la constitución federal y provincial, la protección del nombre, los costos y los trámites para elegir la vía correcta.",
    readTime: "7 min de lectura",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Decidir constituirse en sociedad es la parte fácil. La primera bifurcación real del camino es si conviene hacerlo a nivel federal o provincial, y un número sorprendente de personas toma esa decisión según la opción que un sitio web les mostró primero. Vale unos minutos de verdadera reflexión, porque las dos son realmente distintas." },
      { type: "heading", id: "lo-que-da", text: "Lo que le da la constitución, en cualquier caso" },
      { type: "paragraph", text: "Antes de la cuestión federal frente a provincial, conviene recordar qué está comprando. Constituirse en sociedad crea una entidad legal independiente que puede poseer bienes, firmar contratos y cargar con sus propias responsabilidades. Separa el negocio de usted en lo personal y abre una planificación fiscal que no está al alcance del empresario unipersonal. Eso es cierto, vaya a lo federal o a lo provincial. La diferencia tiene que ver con dónde se reconoce su sociedad y cómo se protege su nombre." },
      { type: "heading", id: "constitucion-federal", text: "La constitución federal" },
      { type: "paragraph", text: "La constitución federal se hace bajo la Ley Canadiense de Sociedades por Acciones, a través de Corporations Canada. La principal ventaja es la protección del nombre en todo el país. Cuando se constituye a nivel federal, su nombre se coteja a nivel nacional y se protege a nivel nacional. Nadie en otra provincia puede registrar una sociedad con un nombre que se confunda con el suyo." },
      { type: "paragraph", text: "La constitución federal también tiene cierto peso. Si piensa operar en más de una provincia, conseguir financiamiento o construir una marca que cruce fronteras provinciales, lo federal suele encajar mejor. Las concesiones: hay más administración. Una sociedad constituida a nivel federal igual tiene que registrarse de forma extraprovincial en cada provincia donde realmente hace negocios, lo que implica presentaciones adicionales." },
      { type: "heading", id: "constitucion-provincial", text: "La constitución provincial" },
      { type: "paragraph", text: "Constituirse en sociedad en Ontario (o en cualquier provincia) se hace a través del registro de esa provincia. Si su negocio operará principalmente dentro de una sola provincia, suele ser la vía más sencilla y económica." },
      { type: "paragraph", text: "Su protección del nombre se limita a esa provincia, lo cual está bien si no tiene planes de expandirse a otro lado. La administración corriente es por lo general más ligera, y trata con un solo gobierno en lugar de potencialmente varios. Para una gran cantidad de pequeñas y medianas empresas de Ontario, la constitución provincial cubre todo lo que necesitan, sin las capas adicionales." },
      { type: "heading", id: "como-constituirse", text: "Cómo constituirse en la práctica" },
      { type: "paragraph", text: "Sea cual sea su elección, la mecánica es similar:" },
      { type: "list", items: ["Elija su nombre (o tome una sociedad numérica, que evita la búsqueda de nombre). Una sociedad con nombre necesita una búsqueda de nombre NUANS para confirmar que el nombre está disponible y no se parece demasiado a los existentes.", "Presente sus estatutos de constitución. Establecen la estructura básica de su sociedad, incluidas sus clases de acciones.", "Defina su estructura de acciones. Determina quién posee qué, cómo pueden distribuirse las ganancias y cómo podrá incorporar socios o inversionistas más adelante.", "Nombre a sus directores y establezca su domicilio social.", "Obtenga su número de negocio de la CRA y abra las cuentas fiscales que necesite (impuesto de sociedades, GST/HST, nómina).", "Inicie su libro de actas, el registro legal continuo de la sociedad."] },
      { type: "callout", title: "Lo que la gente subestima", text: "La estructura de acciones es donde más a menudo sale mal la constitución hecha por cuenta propia. Una constitución barata en línea suele dar a todos la misma configuración de acciones simple, que funciona bien hasta que usted quiere incorporar a un cofundador, pagar dividendos a familiares o vender parte del negocio. Corregirla cuesta mucho más que haberla montado bien desde el inicio." },
      { type: "heading", id: "cual-elegir", text: "¿Cuál elegir?" },
      { type: "paragraph", text: "Si opera principalmente en una sola provincia y no tiene planes inmediatos de expansión, la constitución provincial suele bastar. Si trabajará en varias provincias, quiere protección del nombre a nivel nacional o está construyendo algo que piensa hacer crecer o financiar, lo federal vale la administración adicional. Ninguno es universalmente el correcto. Depende de hacia dónde va el negocio." },
      { type: "paragraph", text: "Korporex presenta las constituciones federales y de Ontario en línea, incluida la búsqueda de nombre NUANS, los estatutos y la configuración de la estructura de acciones, y entrega sus documentos en 24 horas.", parts: ["Korporex presenta las constituciones federales y de Ontario en línea, incluida la ", { text: "búsqueda de nombre NUANS", href: "/nuans" }, ", los estatutos y la configuración de la estructura de acciones, y entrega sus documentos en 24 horas."] },
    ],
  },
  {
    slug: "que-es-un-libro-de-actas",
    locale: "es",
    group: "minute-book",
    category: "Compliance & Maintenance",
    title: "¿Qué es un libro de actas y por qué lo necesita su sociedad?",
    excerpt:
      "Si se constituyó en sociedad, necesita llevar un libro de actas. Aquí explicamos qué es realmente, por qué no es opcional y qué pasa si lo ignora.",
    metaTitle: "¿Qué es un libro de actas y por qué lo necesita? | Korporex",
    metaDescription:
      "Un libro de actas es el registro legal de la existencia y las decisiones de su sociedad. Vea qué contiene, por qué es obligatorio y el costo de descuidarlo.",
    readTime: "4 min de lectura",
    updated: "2026-06-01",
    content: [
      { type: "paragraph", text: "Si se constituyó en sociedad, alguien probablemente le dijo que necesita llevar un libro de actas. Y si es como la mayoría de los nuevos dueños de negocios, asintió, archivó eso como «lo veo después» y no ha vuelto a pensarlo desde entonces." },
      { type: "paragraph", text: "Esta es la guía que explica qué es realmente, por qué no es opcional y qué pasa si lo ignora." },
      { type: "heading", id: "que-es", text: "Qué es un libro de actas" },
      { type: "paragraph", text: "Un libro de actas es el registro oficial de la existencia de su sociedad y de sus decisiones. A pesar del nombre, no se trata solo de actas de reuniones. Es el archivo central que contiene los documentos que prueban que su sociedad es real, quién la posee, quién la dirige y qué decisiones importantes ha tomado. Puede ser una carpeta física o, cada vez más, un archivo digital. El formato no importa. Lo que importa es que los registros existan y se mantengan al día." },
      { type: "heading", id: "que-contiene", text: "Qué contiene" },
      { type: "paragraph", text: "Un libro de actas completo suele incluir:" },
      { type: "list", items: ["Sus estatutos de constitución y su certificado de constitución", "Los reglamentos internos de la sociedad", "El registro de directores, que muestra quién ha servido y cuándo", "El registro de accionistas, que muestra quién posee acciones y cuántas", "Los certificados de acciones y el registro de transferencias de acciones", "Las actas de reuniones y, más a menudo en las sociedades pequeñas, las resoluciones escritas que sustituyen a las reuniones", "Los registros anuales, incluida la aprobación de los estados financieros y el nombramiento de directores y funcionarios"] },
      { type: "heading", id: "no-es-opcional", text: "Por qué no es opcional" },
      { type: "paragraph", text: "El derecho societario canadiense exige a las sociedades llevar estos registros. Es una obligación legal, no una buena práctica que pueda omitir. Las leyes de sociedades, tanto federales como provinciales, precisan lo que debe conservarse. Pero la ley es solo la mitad de la razón. La otra mitad es que el libro de actas se vuelve esencial justamente en los momentos que más importan:" },
      { type: "list", items: ["Cuando vende el negocio. El abogado de cualquier comprador serio pedirá el libro de actas durante la debida diligencia. Uno faltante o desordenado retrasa la operación y a veces hace caer el trato.", "Cuando consigue financiamiento o pide prestado. Los inversionistas y prestamistas quieren ver registros claros de quién posee qué.", "Cuando hay una disputa. Si los accionistas no están de acuerdo, el libro de actas es a menudo lo que define quién tiene derecho a qué.", "A la hora de impuestos y en una auditoría. La CRA puede querer comprobar que los dividendos, los salarios y otras decisiones se autorizaron debidamente."] },
      { type: "heading", id: "si-lo-descuida", text: "Qué pasa si lo descuida" },
      { type: "paragraph", text: "Nada, al principio. Esa es la trampa. Un libro de actas que no se ha actualizado en tres años no causa ningún problema inmediato, así que es fácil seguir ignorándolo." },
      { type: "paragraph", text: "El costo llega de golpe, normalmente cuando intenta hacer algo urgente: cerrar una venta, firmar con un inversionista, satisfacer a un prestamista. De pronto necesita años de resoluciones que nunca se redactaron, registros de accionistas que nunca se actualizaron y aprobaciones que nunca ocurrieron en papel. Los abogados pueden reconstruir un libro descuidado, pero es más lento y más caro que haberlo mantenido al día, y a veces los vacíos no se pueden corregir con limpieza después de los hechos." },
      { type: "heading", id: "mantenerlo-al-dia", text: "Mantenerlo al día" },
      { type: "paragraph", text: "Para una sociedad pequeña, llevar un libro de actas no es una tarea pesada. La principal labor recurrente es el papeleo anual: aprobar los estados financieros, confirmar a los directores y funcionarios, y dejar constancia de cualquier decisión importante, como declarar dividendos o emitir acciones." },
      { type: "paragraph", text: "Si se constituyó en sociedad y no está seguro de si su libro de actas está completo o al día, vale la pena revisarlo antes de necesitarlo y no después. Korporex monta un libro de actas completo al momento de la constitución, y puede preparar uno para una sociedad existente, para que los registros estén ahí y correctos el día en que alguien los pida." },
    ],
  },
];

const ARTICLES_BY_LOCALE: Record<Locale, Article[]> = {
  en: articles.filter((a) => a.locale === "en"),
  fr: articles.filter((a) => a.locale === "fr"),
  es: articles.filter((a) => a.locale === "es"),
};

export function getArticlesByLocale(locale: Locale): Article[] {
  return ARTICLES_BY_LOCALE[locale] ?? [];
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  return getArticlesByLocale(locale).find((a) => a.slug === slug);
}

export function getRelatedArticles(
  locale: Locale,
  slug: string,
  limit = 3,
): Article[] {
  const source = getArticle(locale, slug);
  if (!source) return [];
  const pool = getArticlesByLocale(locale);
  const sameCategory = pool.filter(
    (a) => a.slug !== slug && a.category === source.category,
  );
  const others = pool.filter(
    (a) => a.slug !== slug && a.category !== source.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

// Map of locale -> slug for every language version of an article group. Used to
// build hreflang alternates so Google treats the versions as translations.
export function getAlternateSlugs(group: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const a of articles) {
    if (a.group === group) out[a.locale] = a.slug;
  }
  return out;
}
