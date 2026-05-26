// NUANS preliminary name-search report. Standalone service registry — parallel
// to registrationServices.ts, amendmentServices.ts, complianceServices.ts, and
// businessUpdateServices.ts. Only one service in this category for now; the
// registry shape is kept consistent so the confirmation page / Stripe webhook
// can resolve the slug uniformly with the other product types.
//
// Pricing is recomputed server-side from these constants in
// /api/nuans-request — never trust totals sent from the client.

export type NuansServiceSlug = "nuans-report";

export type NuansService = {
  slug: NuansServiceSlug;
  label: string;
  longLabel: string;
  price: number;
  /** Short pitch for marketing surfaces. */
  tagline: string;
  /** One-paragraph description shown on the wizard hero. */
  description: string;
  /** Path under /services/. */
  path: string;
};

export const NUANS_SERVICES: Record<NuansServiceSlug, NuansService> = {
  "nuans-report": {
    slug: "nuans-report",
    label: "NUANS Report",
    longLabel: "NUANS Preliminary Name-Search Report",
    price: 40,
    tagline: "Pre-screen a proposed corporate name against the NUANS database before you incorporate.",
    description:
      "A NUANS preliminary search compares your proposed corporate name against ~5 million registered Canadian corporate names, business names, and trademarks. The report lists approximately 20–30 similar existing names so you can assess registry-approval risk before you commit to filing. Reports are valid for 90 days.",
    path: "/services/nuans-report",
  },
};

export const NUANS_SLUGS = Object.keys(NUANS_SERVICES) as NuansServiceSlug[];

export function isNuansSlug(s: string): s is NuansServiceSlug {
  return s in NUANS_SERVICES;
}
