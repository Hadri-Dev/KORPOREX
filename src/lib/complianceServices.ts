// Recurring compliance filings. Parallel to registrationServices.ts and
// amendmentServices.ts; covers periodic government filings (initial return,
// annual returns) and bundled notice-of-change filings that don't fit cleanly
// into the per-change amendment categories.
//
// The two annual-resolution services are the exception: they are minute-book
// documents (annual director + shareholder resolutions), not registry filings.
// They live here because customers buy them alongside the annual return.
//
// Pricing is recomputed server-side from these constants in
// /api/compliance-request — never trust totals sent from the client.

export type ComplianceServiceSlug =
  | "initial-return-on"
  | "annual-return-on"
  | "annual-return-federal"
  | "annual-resolution-on"
  | "annual-resolution-federal"
  | "notice-of-change";

export type ComplianceService = {
  slug: ComplianceServiceSlug;
  label: string;
  longLabel: string;
  price: number;
  /** Short pitch shown on the services listing tile. */
  tagline: string;
  /** One-paragraph description shown on the wizard's hero. */
  description: string;
  /** Path under /services/. */
  path: string;
};

export const COMPLIANCE_SERVICES: Record<ComplianceServiceSlug, ComplianceService> = {
  "initial-return-on": {
    slug: "initial-return-on",
    label: "Initial Return (Ontario)",
    longLabel: "Initial Return (Ontario)",
    price: 99,
    tagline: "File the mandatory Initial Return within 60 days of incorporation.",
    description:
      "All Ontario corporations must file an Initial Return with the Ministry of Public and Business Service Delivery within 60 days of incorporation, under the Corporations Information Act. Korporex prepares and files the return on your behalf.",
    path: "/services/initial-return-on",
  },
  "annual-return-on": {
    slug: "annual-return-on",
    label: "Annual Return - Ontario",
    longLabel: "Annual Return - Ontario",
    price: 49.99,
    tagline: "File your annual corporate information return with the Ontario Business Registry.",
    description:
      "Ontario corporations must file an Annual Return under the Corporations Information Act to confirm directors, officers, and registered office information remain current. Filed via the Ontario Business Registry; due each year on the anniversary of incorporation.",
    path: "/services/annual-return-on",
  },
  "annual-return-federal": {
    slug: "annual-return-federal",
    label: "Annual Return - Federal",
    longLabel: "Annual Return - Federal (Form 22)",
    price: 49.99,
    tagline: "File the CBCA Annual Return (Form 22) with Corporations Canada.",
    description:
      "Every CBCA corporation must file an Annual Return (Form 22) with Corporations Canada within 60 days of the anniversary of incorporation under CBCA s.263. Confirms whether the corporation is distributing, the number of shareholders, and that the corporate information remains current.",
    path: "/services/annual-return-federal",
  },
  "annual-resolution-on": {
    slug: "annual-resolution-on",
    label: "Annual Resolution - Ontario",
    longLabel: "Annual Resolutions - Ontario (OBCA)",
    price: 199.99,
    tagline: "Annual director and shareholder resolutions for your Ontario corporation's minute book.",
    description:
      "Ontario corporations must hold an annual meeting of shareholders within 15 months of the last one (OBCA s.94), or pass written resolutions signed by all shareholders in its place (OBCA s.104). Korporex prepares the annual director and shareholder resolutions — approving the financial statements, electing directors, appointing officers, and dispensing with or appointing an auditor — ready to sign and file in your minute book.",
    path: "/services/annual-resolution-on",
  },
  "annual-resolution-federal": {
    slug: "annual-resolution-federal",
    label: "Annual Resolution - Federal",
    longLabel: "Annual Resolutions - Federal (CBCA)",
    price: 199.99,
    tagline: "Annual director and shareholder resolutions for your CBCA corporation's minute book.",
    description:
      "CBCA corporations must call an annual meeting of shareholders no later than 15 months after the last one and within 6 months of the financial year-end (CBCA s.133), or pass written resolutions signed by all shareholders in its place (CBCA s.142). Korporex prepares the annual director and shareholder resolutions — approving the financial statements, electing directors, appointing officers, and dispensing with or appointing an auditor — ready to sign and file in your minute book.",
    path: "/services/annual-resolution-federal",
  },
  "notice-of-change": {
    slug: "notice-of-change",
    label: "Notice of Change",
    longLabel: "Notice of Change",
    price: 129,
    tagline: "File multiple corporate changes in a single combined filing.",
    description:
      "File a combined Notice of Change with the appropriate registry when you have several updates to report at once (e.g., a director change + an officer appointment + a new mailing address). Cheaper than filing each change separately.",
    path: "/services/notice-of-change",
  },
};

export const COMPLIANCE_SLUGS = Object.keys(COMPLIANCE_SERVICES) as ComplianceServiceSlug[];

export function isComplianceSlug(s: string): s is ComplianceServiceSlug {
  return s in COMPLIANCE_SERVICES;
}
