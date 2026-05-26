// NUANS preliminary name-search report. Standalone service (not bundled into
// an incorporation), available to customers who want to:
//   - vet a proposed corporate name before committing to incorporate
//   - screen a name for a future amalgamation / continuance
//   - establish similarity-with-existing-names evidence ahead of a trademark
//     filing or rebrand
//
// The NUANS database is operated under contract with Corporations Canada and
// returns ~20-30 similar registered names within minutes. Reports are valid
// for 90 days from generation.

import { z } from "zod";
import { addressSchema, billingSchema, contactSchema } from "./amendmentSchemas";

export { addressSchema, billingSchema };

// Federal NUANS is the same database whether the eventual filing is federal
// or provincial-named; Ontario corporations also reference the federal NUANS
// system at filing time, but Korporex distinguishes here so the operator
// knows which downstream pass-through fee to expect.
export const nuansJurisdictionSchema = z.enum(["federal", "ontario"], {
  message: "Select the jurisdiction for the proposed corporation",
});

export type NuansJurisdiction = z.infer<typeof nuansJurisdictionSchema>;

export const nuansIntendedUseSchema = z.enum(
  ["new_incorporation", "name_change", "amalgamation", "trademark_screening", "other"],
  { message: "Select the intended use" }
);

export type NuansIntendedUse = z.infer<typeof nuansIntendedUseSchema>;

// The wizard captures a primary proposed name plus up to two backups. The
// search house runs the primary first; if the primary is unlikely to be
// approved by the registry examiner, the operator follows up with the
// customer to confirm whether to also run the alternatives (each alternative
// is a separate NUANS search and would be a separate report).
export const nuansReportSchema = z
  .object({
    jurisdiction: nuansJurisdictionSchema,
    /** Primary proposed name — the one we run the NUANS search against. */
    proposedName: z
      .string()
      .trim()
      .min(2, "Proposed name is required")
      .max(200, "Name too long"),
    /** Optional alternative name 1 — kept on file so the operator can run it
     *  as a follow-up if the primary is rejected by the examiner. */
    alternativeName1: z.string().trim().max(200).optional().or(z.literal("")),
    alternativeName2: z.string().trim().max(200).optional().or(z.literal("")),
    intendedUse: nuansIntendedUseSchema,
    /** Free-text context — what the business does, distinguishing elements,
     *  prior brand history, etc. Helps the search-house operator decide
     *  whether to flag near-matches as significant. */
    businessDescription: z
      .string()
      .trim()
      .min(10, "Please describe the business (min 10 characters)")
      .max(2000),
    contact: contactSchema,
  })
  .merge(billingSchema);

export type NuansReportSubmission = z.infer<typeof nuansReportSchema>;

export const nuansRequestSchema = z.object({
  service: z.literal("nuans-report"),
  payload: nuansReportSchema,
});

export type NuansRequest = z.infer<typeof nuansRequestSchema>;
