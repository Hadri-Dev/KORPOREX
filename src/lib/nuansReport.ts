// Standalone NUANS preliminary name-search report. Customers fill a table of
// one or more proposed corporate names (with the distinctive element and
// target jurisdiction) and pay a flat order fee — every name in the list is
// searched and consolidated into a single emailed PDF.
//
// Pricing is recomputed server-side from `NUANS_REPORT.price` in
// /api/nuans-report — never trust totals sent from the client.

import { z } from "zod";
import { addressSchema, billingSchema, contactSchema } from "./amendmentSchemas";

export { addressSchema, billingSchema };

// Jurisdictions accepted by the NUANS preliminary-search system. "Federal"
// covers CBCA names. The other entries are provincial / territorial registries
// that also reference the federal NUANS database during name approval.
// (Korporex deliberately omits the "Federal — with Pre-Approval" variant
// surfaced by some third-party portals; Korporex always orders the standard
// preliminary search.)
export const NUANS_JURISDICTIONS = [
  { value: "federal", label: "Federal" },
  { value: "alberta", label: "Alberta" },
  { value: "british_columbia", label: "British Columbia" },
  { value: "manitoba", label: "Manitoba" },
  { value: "new_brunswick", label: "New Brunswick" },
  { value: "newfoundland_labrador", label: "Newfoundland and Labrador" },
  { value: "nova_scotia", label: "Nova Scotia" },
  { value: "northwest_territories", label: "Northwest Territories" },
  { value: "nunavut", label: "Nunavut" },
  { value: "ontario", label: "Ontario" },
  { value: "prince_edward_island", label: "Prince Edward Island" },
  { value: "saskatchewan", label: "Saskatchewan" },
  { value: "yukon", label: "Yukon" },
] as const;

export type NuansJurisdiction = (typeof NUANS_JURISDICTIONS)[number]["value"];

const jurisdictionValues = NUANS_JURISDICTIONS.map((j) => j.value) as [
  NuansJurisdiction,
  ...NuansJurisdiction[],
];

export const nuansJurisdictionSchema = z.enum(jurisdictionValues, {
  message: "Select a jurisdiction",
});

export function getJurisdictionLabel(value: string): string {
  return NUANS_JURISDICTIONS.find((j) => j.value === value)?.label ?? value;
}

// ── Single search row ───────────────────────────────────────────────────────
//
// `proposedName` is the name as it would appear on the certificate of
// incorporation (for Ontario filings, include the legal ending; for federal
// filings, leave it off). `distinctiveTerm` is the unique element NUANS
// compares against the database — typically the first word(s) before any
// descriptive element. Examples:
//   "Maple Ridge Logistics Inc." → distinctive: "Maple Ridge"
//   "BlueArc Studio Ltd."        → distinctive: "BlueArc"
//
// The drafter uses the distinctive term as the primary input to the NUANS
// search; the full proposed name is recorded so the eventual incorporation
// filing matches what was searched.

export const nuansSearchRowSchema = z.object({
  proposedName: z
    .string()
    .trim()
    .min(2, "Required")
    .max(200, "Name too long"),
  distinctiveTerm: z
    .string()
    .trim()
    .min(2, "Required")
    .max(120, "Term too long"),
  jurisdiction: nuansJurisdictionSchema,
});

export type NuansSearchRow = z.infer<typeof nuansSearchRowSchema>;

// ── Full submission ─────────────────────────────────────────────────────────

export const nuansReportRequestSchema = z
  .object({
    rows: z
      .array(nuansSearchRowSchema)
      .min(1, "Add at least one proposed name")
      .max(10, "Maximum 10 names per order"),
    contact: contactSchema,
  })
  .merge(billingSchema);

export type NuansReportRequest = z.infer<typeof nuansReportRequestSchema>;

// ── Service constants ───────────────────────────────────────────────────────

export const NUANS_REPORT = {
  slug: "nuans-report" as const,
  label: "NUANS Report",
  longLabel: "NUANS Preliminary Name-Search Report",
  path: "/nuans-report",
  /** Base fee covering the first proposed name in the order. */
  basePrice: 40,
  /** Surcharge for every proposed name beyond the first. Each name in the
   *  table is a separate NUANS search; the extras cover the additional
   *  pass-through cost from the search house. */
  additionalPrice: 45,
  tagline:
    "Pre-screen one or more proposed Canadian corporation names against the NUANS database before you file.",
};

export type NuansReportMeta = typeof NUANS_REPORT;

/** Pre-tax subtotal for a NUANS report order with `rowCount` proposed names. */
export function nuansSubtotal(rowCount: number): number {
  const safeCount = Math.max(1, rowCount);
  return NUANS_REPORT.basePrice + NUANS_REPORT.additionalPrice * (safeCount - 1);
}
