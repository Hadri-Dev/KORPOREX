// Recurring compliance filings. Parallel to registrationServices.ts and
// amendmentServices.ts; covers periodic government filings (initial return,
// annual returns) and bundled notice-of-change filings that don't fit cleanly
// into the per-change amendment categories.
//
// Pricing is recomputed server-side from these constants in
// /api/compliance-request — never trust totals sent from the client.

export type ComplianceServiceSlug =
  | "initial-return-on"
  | "annual-return-on"
  | "annual-return-federal"
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
    price: 149,
    tagline: "File your annual corporate information return with the Ontario Business Registry.",
    description:
      "Ontario corporations must file an Annual Return under the Corporations Information Act to confirm directors, officers, and registered office information remain current. Filed via the Ontario Business Registry; due each year on the anniversary of incorporation.",
    path: "/services/annual-return-on",
  },
  "annual-return-federal": {
    slug: "annual-return-federal",
    label: "Annual Return - Federal",
    longLabel: "Annual Return - Federal (Form 22)",
    price: 149,
    tagline: "File the CBCA Annual Return (Form 22) with Corporations Canada.",
    description:
      "Every CBCA corporation must file an Annual Return (Form 22) with Corporations Canada within 60 days of the anniversary of incorporation under CBCA s.263. Confirms whether the corporation is distributing, the number of shareholders, and that the corporate information remains current.",
    path: "/services/annual-return-federal",
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
