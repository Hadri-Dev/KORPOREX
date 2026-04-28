// Archived 2026-04-27 — original location: src/app/resources/articles.ts
// Restore by pasting this object back into the `articles` array.

import type { Article } from "../../app/resources/articles";

export const bcIncorporationArticle: Article = {
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
};
