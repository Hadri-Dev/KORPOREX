export type ArticleCategory =
  | "Incorporation Guides"
  | "Compliance & Maintenance"
  | "Jurisdiction Comparisons";

export type ArticleSection =
  | { type: "heading"; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type Article = {
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  readTime: string;
  updated: string;
  content: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: "federal-vs-provincial-incorporation",
    category: "Incorporation Guides",
    title: "Federal vs. Provincial Incorporation: Which Is Right for Your Business?",
    excerpt:
      "Choosing between a federal and provincial corporation is one of the first decisions you'll make. We break down the key differences, costs, and trade-offs so you can choose with confidence.",
    readTime: "6 min read",
    updated: "2026-04-21",
    content: [
      {
        type: "paragraph",
        text: "Every new Canadian corporation is created under one of two kinds of statute: the federal Canada Business Corporations Act (CBCA), or one of the provincial or territorial business corporations acts. Both produce a valid, separate legal entity that can sign contracts, own property, and limit shareholder liability. The practical differences show up in name protection, where you can operate, how much paperwork you file each year, and how much the whole thing costs.",
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
        text: "Federal incorporation does not, however, exempt the corporation from provincial rules. If a federal corporation carries on business in a province — has an office, employees, or a physical presence there — it must register extra-provincially in that province and pay the associated fee. A federal corporation operating in Ontario, Alberta, and BC effectively maintains four registrations: one federal plus one in each province.",
      },
      {
        type: "heading",
        id: "what-is-provincial",
        text: "What provincial incorporation gives you",
      },
      {
        type: "paragraph",
        text: "A provincial corporation is created under the business corporations act of a specific province (e.g., Ontario's OBCA, BC's BCA, Alberta's ABCA). The corporation is automatically authorized to carry on business throughout that province. Name protection, however, is limited to that province — a business in another province could, in principle, register a similar name there.",
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
          ["NUANS name search", "Mandatory", "Required in ON/BC/AB; optional or province-specific elsewhere"],
          ["Government filing fee", "Approximately $200 online", "Roughly $300–$360 depending on province"],
          [
            "Operating in multiple provinces",
            "Needs extra-provincial registration in each province",
            "Needs extra-provincial registration in each province",
          ],
          ["Annual return", "Filed with Corporations Canada every year", "Filed with the province every year"],
          ["Director residency", "No Canadian-resident director requirement (as of 2022)", "Varies; Ontario removed its requirement in 2021, BC has none"],
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
        id: "next-step",
        text: "Your next step",
      },
      {
        type: "paragraph",
        text: "Once you've decided on the jurisdiction, the rest of the incorporation process is largely the same: choose a name (or opt for a numbered corporation), draft articles, appoint directors, file, and receive your certificate of incorporation. Korporex handles the entire filing online for federal, Ontario, and BC jurisdictions.",
      },
    ],
  },
  {
    slug: "what-is-nuans-name-search",
    category: "Incorporation Guides",
    title: "What Is a NUANS Name Search — and Do You Need One?",
    excerpt:
      "If you're incorporating federally or in certain provinces, a NUANS search is mandatory. Learn what it is, how it works, and what happens if your first-choice name is unavailable.",
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
          "Federal incorporation under the CBCA — always required if you're registering a named corporation.",
          "Ontario incorporation under the OBCA — required for named corporations.",
          "British Columbia — BC uses its own Name Request system through BC Registries, not NUANS.",
          "Alberta, Saskatchewan, Manitoba, New Brunswick, Nova Scotia, Newfoundland and Labrador, PEI — all use NUANS for named corporations.",
          "Quebec and the territories — use separate name systems, not NUANS.",
          "Numbered corporations (e.g., 1234567 Canada Inc.) — no NUANS search required in any jurisdiction.",
        ],
      },
      {
        type: "heading",
        id: "how-it-works",
        text: "How a NUANS search works",
      },
      {
        type: "paragraph",
        text: "A NUANS report is ordered through an authorized NUANS search house. You submit the proposed corporate name, the search house runs it against the database, and you receive a report — usually within minutes — listing approximately 20 to 30 similar names already in use. A NUANS report is valid for 90 days from the date it is generated. The filing must be completed within that window or the report expires and a new one is required.",
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
          "Distinctive element — a unique or coined word (e.g., \"Maplewind\").",
          "Descriptive element — describes the business activity (e.g., \"Consulting\").",
          "Legal element — indicates limited liability: Inc., Incorporated, Corp., Corporation, Ltd., Limited, Limitée, or Ltée.",
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
        text: "A NUANS report does not grant a trademark. If your name is central to your brand, you should also consider a trademark registration through the Canadian Intellectual Property Office — that is a separate process from incorporation.",
      },
    ],
  },
  {
    slug: "corporate-annual-returns-canada",
    category: "Compliance & Maintenance",
    title: "Corporate Annual Returns in Canada: A Complete Guide",
    excerpt:
      "Every Canadian corporation must file an annual return. Deadlines, fees, and consequences of missing a filing differ by jurisdiction. Here's everything you need to know.",
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
        text: "An annual return confirms that the information on file about the corporation — registered office address, directors, officers, and (in some provinces) shareholders — is still accurate. If anything has changed during the year, the annual return is where those changes are reported. Every active Canadian corporation is required by statute to file one every year.",
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
        text: "Since October 2021, Ontario annual returns are filed directly through the Ontario Business Registry. Before that date, most corporations filed the return together with their T2 through the CRA — that route was discontinued. Ontario annual returns are due within six months after the end of the corporation's fiscal year.",
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
        id: "british-columbia",
        text: "British Columbia corporations",
      },
      {
        type: "list",
        items: [
          "Filed with BC Registries and Online Services.",
          "Due within two months after the anniversary of the date of recognition (usually the incorporation date).",
          "Filing fee: $43.39 online.",
          "Missing two consecutive annual reports can trigger administrative dissolution.",
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
        text: "The most reliable approach is to add the corporation's incorporation anniversary to a calendar with a reminder 30 days in advance, and to keep a short checklist of whose information might have changed during the year — directors, officers, registered office. Filing the return itself usually takes less than ten minutes once you have those details in hand.",
      },
    ],
  },
  {
    slug: "corporate-minute-book",
    category: "Compliance & Maintenance",
    title: "What Is a Corporate Minute Book and Why Does Your Corporation Need One?",
    excerpt:
      "Canadian corporations are legally required to maintain a minute book. We explain what goes in it, who is responsible for keeping it, and what happens if you don't have one.",
    readTime: "4 min read",
    updated: "2026-04-21",
    content: [
      {
        type: "paragraph",
        text: "A corporate minute book is the official record of a corporation's existence and governance. Despite the name, it is not a log of conversations — it is a complete, organized archive of every document and decision that affects the corporation's legal status, ownership, and internal rules. Every Canadian corporation is required by statute to maintain one from the day it is incorporated.",
      },
      {
        type: "heading",
        id: "legal-basis",
        text: "The legal requirement",
      },
      {
        type: "paragraph",
        text: "Section 20 of the Canada Business Corporations Act requires federal corporations to maintain specified records at their registered office. Parallel provisions exist in every provincial business corporations act. The statute is specific about what must be kept and who can inspect it — typically directors, shareholders, and in some circumstances creditors or the public.",
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
          "Register of directors — names, addresses, and dates each director joined or left.",
          "Register of officers — current officers and their positions.",
          "Register of shareholders — names, addresses, and share holdings.",
          "Securities register — every issuance, transfer, and cancellation of shares.",
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
        text: "Legal responsibility rests with the directors of the corporation. In practice, the minute book is usually maintained at the corporation's registered office, or by a third party retained to act as the corporation's record keeper. Whether it lives in a physical binder or as a cloud-based digital record doesn't matter — what matters is that it is complete, current, and accessible when it needs to be inspected.",
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
        text: "Reconstructing a minute book years after the fact is expensive and sometimes impossible — directors may no longer be available to sign backdated resolutions, share issuances may not be cleanly documented, and the corporation's legal history effectively has gaps. In the worst cases, those gaps can derail a transaction or reduce the purchase price.",
      },
      {
        type: "callout",
        title: "A simple discipline",
        text: "Every time the corporation does something meaningful — issues shares, appoints a new director, changes its fiscal year-end, passes a by-law — a corresponding resolution should be added to the minute book within a few weeks. A minute book that is kept current is almost effortless; one that is kept \"when we get around to it\" tends to stay unfinished.",
      },
    ],
  },
  {
    slug: "incorporating-in-ontario",
    category: "Jurisdiction Comparisons",
    title: "Incorporating in Ontario: Everything You Need to Know",
    excerpt:
      "Ontario is home to the majority of Canadian small businesses. This guide walks through the Ontario Business Corporations Act, costs, timelines, and what you'll receive after filing.",
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
          "One or more incorporators — can be individuals or corporations.",
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
          "Adopt by-laws — the general rules governing the corporation's internal affairs.",
          "Register for a CRA Business Number and any relevant tax accounts (HST, payroll, corporate income tax).",
          "Open a corporate bank account — banks will require the Articles, the Certificate, and a recent corporate profile.",
          "Set up the minute book and record the organizational resolutions in it.",
          "Calendar the annual return deadline (due within six months after fiscal year-end).",
        ],
      },
      {
        type: "callout",
        title: "One common oversight",
        text: "Ontario requires an Initial Return within 60 days of incorporation, confirming the directors and registered office that were named on the Articles. Missing this filing puts the corporation out of compliance almost immediately. It is a quick online filing — do it the same week you incorporate.",
      },
    ],
  },
  {
    slug: "incorporating-in-bc",
    category: "Jurisdiction Comparisons",
    title: "Incorporating in BC: A Step-by-Step Overview",
    excerpt:
      "British Columbia uses the BC Business Corporations Act and the BC Business Registry. Learn what makes BC incorporation unique and whether it's the right choice for your business.",
    readTime: "6 min read",
    updated: "2026-04-21",
    content: [
      {
        type: "paragraph",
        text: "British Columbia incorporations are governed by the BC Business Corporations Act (BCA) and processed through BC Registries and Online Services. BC's process differs from Ontario's and the federal process in two meaningful ways: name approval is a separate upstream step, and BC corporations receive a pair of governance documents — a Notice of Articles and a set of Articles — rather than a single Articles of Incorporation document.",
      },
      {
        type: "heading",
        id: "two-documents",
        text: "Notice of Articles vs. Articles",
      },
      {
        type: "paragraph",
        text: "BC splits corporate governance documentation into two pieces. The Notice of Articles is the public-facing document filed with the registry — it lists the corporate name, directors, registered office, records office, and authorized share structure. The Articles are the corporation's internal rule book — they govern how shares are issued and transferred, how directors and shareholders meet, and how decisions are made. The Articles are signed by the incorporators but not filed with the registry.",
      },
      {
        type: "heading",
        id: "name-approval",
        text: "Step 1 — Name approval (for named corporations)",
      },
      {
        type: "paragraph",
        text: "Before filing incorporation documents, a named corporation must submit a Name Request (NR) through BC Registries. BC uses its own name search system rather than NUANS. Standard processing takes roughly 1–2 weeks; priority processing (for an additional fee) cuts that to around 1–2 business days. Once approved, the name is reserved for 56 days — the incorporation must be filed within that window.",
      },
      {
        type: "paragraph",
        text: "A BC numbered corporation (e.g., 1234567 B.C. Ltd.) skips the Name Request step entirely and can be incorporated immediately.",
      },
      {
        type: "heading",
        id: "whats-required",
        text: "What is required",
      },
      {
        type: "list",
        items: [
          "Approved name (from the Name Request step) or election to incorporate as a numbered company.",
          "Incorporation Application, including the Notice of Articles.",
          "Articles of the corporation — signed by each incorporator (can be customized or adopted from a standard template).",
          "One or more incorporators — may be individuals or corporations.",
          "At least one director. BC has no Canadian-resident director requirement.",
          "A BC registered office and records office address. They can be the same address.",
        ],
      },
      {
        type: "heading",
        id: "costs",
        text: "Costs",
      },
      {
        type: "table",
        head: ["Item", "Cost (BC)"],
        rows: [
          ["Name Request — standard", "$30"],
          ["Name Request — priority", "$100"],
          ["Incorporation filing fee", "$350"],
          ["Numbered corporation (no Name Request required)", "$350 incorporation fee only"],
        ],
      },
      {
        type: "heading",
        id: "timeline",
        text: "Timeline",
      },
      {
        type: "list",
        items: [
          "Name Request: 1–2 weeks standard, or 1–2 business days with priority.",
          "Articles drafting: same day.",
          "Incorporation filing: usually processed immediately or within a few hours.",
          "Total: a numbered BC corporation can be incorporated same-day. A named BC corporation typically takes 1–3 weeks unless priority name approval is used.",
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
          "Certificate of Incorporation with incorporation date and BC Incorporation Number.",
          "Certified Notice of Articles.",
          "Corporate summary from BC Registries.",
          "Access credentials for BC Registries Online Services for future filings.",
        ],
      },
      {
        type: "heading",
        id: "after-incorporation",
        text: "After incorporation",
      },
      {
        type: "list",
        items: [
          "Hold the organizational meeting (or pass written resolutions) to issue shares, appoint officers, and adopt the Articles.",
          "Register for a CRA Business Number and relevant tax accounts.",
          "Open a corporate bank account.",
          "Set up the minute book — for BC corporations it must be maintained at the records office.",
          "Calendar the annual report deadline (due within two months after the anniversary of incorporation).",
        ],
      },
      {
        type: "callout",
        title: "One BC-specific thing to remember",
        text: "BC requires a records office in addition to a registered office. They can share an address, but both must be shown on the Notice of Articles, and both must be kept current if either changes.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const source = getArticleBySlug(slug);
  if (!source) return [];
  const sameCategory = articles.filter(
    (a) => a.slug !== slug && a.category === source.category,
  );
  const others = articles.filter(
    (a) => a.slug !== slug && a.category !== source.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
