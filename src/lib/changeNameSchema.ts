// Change of Business Name — a corporate name change filed as Articles of
// Amendment (CBCA s.173 / OBCA s.168). Unlike the general Articles-of-Amendment
// service (flat fee + pass-through government/NUANS fees), this is a
// name-change-only product with a jurisdiction-based flat price that BUNDLES the
// government filing fee and one NUANS name search:
//
//   Ontario (OBCA)  → $399.99 + HST  (incl. $150 gov fee + 1 NUANS)
//   Federal (CBCA)  → $449.99 + HST  (incl. $200 gov fee + 1 NUANS)
//
// Optional add-on: update the minute book to reflect the new name (+$199 + HST).
//
// Server-side recalculation (see computeChangeNamePricing, re-run in the API
// route) is what makes the emailed summary + Stripe charge trustworthy — the
// price is derived from the jurisdiction + add-on flag, never trusted from the
// client.

import { z } from "zod";
import { billingSchema } from "./registrationSchemas";
import { corporationIdSchema, contactSchema } from "./amendmentSchemas";
import { legalEndingSchema } from "./legalEndings";
import { getTaxRate, type Jurisdiction } from "./pricing";

// ── Pricing (single source of truth for the wizard UI + the API route) ───────

/** Korporex flat fee by jurisdiction. Includes the government filing fee
 *  (ON $150 / Federal $200) and one NUANS name search. */
export const CHANGE_NAME_PRICES: Record<Jurisdiction, number> = {
  ontario: 399.99,
  federal: 449.99,
};

/** Optional add-on: prepare resolutions + update the minute book to the new name. */
export const MINUTE_BOOK_ADDON_FEE = 199;

/** NUANS searches bundled into the price. */
export const NUANS_INCLUDED_COUNT = 1;

/** Each additional NUANS search (for a further name choice), billed separately + HST. */
export const EXTRA_NUANS_FEE = 39.99;

export type ChangeNamePricing = {
  base: number;
  minuteBookFee: number;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
};

export function computeChangeNamePricing(args: {
  jurisdiction: Jurisdiction;
  updateMinuteBook: boolean;
  billingCountry: string;
  billingRegion: string;
}): ChangeNamePricing {
  const base = CHANGE_NAME_PRICES[args.jurisdiction];
  const minuteBookFee = args.updateMinuteBook ? MINUTE_BOOK_ADDON_FEE : 0;
  const subtotal = Math.round((base + minuteBookFee) * 100) / 100;
  const taxRate = getTaxRate(args.billingCountry, args.billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { base, minuteBookFee, subtotal, taxRate, tax, total };
}

// ── Submission schema ────────────────────────────────────────────────────────

export const changeNameSchema = z
  .object({
    // Corporation identity + jurisdiction (jurisdiction drives the price).
    corporation: corporationIdSchema,
    // The new name to be filed on the Articles of Amendment.
    newCorpName: z.string().trim().min(1, "New corporate name required").max(200),
    newLegalEnding: legalEndingSchema,
    // When the amendment should take effect (on or after the filing date).
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    // Statutory attestation — a name change requires a special resolution
    // (CBCA s.173 / OBCA s.168) passed by two-thirds of the votes cast.
    specialResolutionPassed: z
      .boolean()
      .refine((v) => v === true, { message: "Required: a special resolution must have been passed" }),
    specialResolutionDate: z.string().trim().min(8, "Required").max(20),
    // Optional add-on.
    updateMinuteBook: z.boolean(),
    contact: contactSchema,
  })
  .merge(billingSchema);

export type ChangeNameSubmission = z.infer<typeof changeNameSchema>;

/** API envelope: `{ service: "change-name", payload }`. */
export const changeNameRequestSchema = z.object({
  service: z.literal("change-name"),
  payload: changeNameSchema,
});

export type ChangeNameRequest = z.infer<typeof changeNameRequestSchema>;
