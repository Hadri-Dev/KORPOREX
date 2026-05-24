// Zod schemas for the four post-incorporation amendment services. Each schema
// captures the data the relevant government form requires, branched by
// jurisdiction (Federal/CBCA vs Ontario/OBCA) where the registries differ.
//
// Field-required references (for the operator reviewing the [PENDING] intake):
//
//   change-director  → Federal: Form 6 (Changes Regarding Directors), CBCA s.113;
//                      Ontario: Notice of Change of Director under the
//                      Corporations Information Act, OBR
//   change-address   → Federal: Form 3 (Change of Registered Office Address),
//                      CBCA s.19; Ontario: Notice of Change of Registered
//                      Office under the OBR
//   articles-amend.  → Federal: Form 4 (Articles of Amendment), CBCA s.173;
//                      Ontario: Articles of Amendment under OBCA s.168
//   change-share-    → Internal record-update only. Neither CBCA nor OBCA
//   holder             requires the government to be notified when shares
//                      change hands; this is an update to the corporate
//                      minute book (register of shareholders + share
//                      certificates).

import { z } from "zod";
import { addressSchema, billingSchema } from "./registrationSchemas";
import { LEGAL_ENDINGS, type LegalEnding } from "./legalEndings";
import { OFFICER_POSITIONS, type OfficerPosition } from "./officerPositions";

// Re-exported so amendmentSchemas is the single import the wizards need.
export { addressSchema, billingSchema };

// ── Shared sub-schemas ──────────────────────────────────────────────────────

export const amendmentJurisdictionSchema = z.enum(["federal", "ontario"], {
  message: "Select your corporation's jurisdiction",
});

export type AmendmentJurisdiction = z.infer<typeof amendmentJurisdictionSchema>;

/**
 * Corporation identity block. Asked at the top of every amendment wizard so
 * the operator can pull the file. Federal uses 7-digit Corporations Canada
 * numbers; Ontario uses the OCN (Ontario Corporation Number).
 */
export const corporationIdSchema = z.object({
  jurisdiction: amendmentJurisdictionSchema,
  corpName: z.string().trim().min(1, "Required").max(200),
  corpNumber: z.string().trim().min(1, "Required").max(50),
  businessNumber: z.string().trim().max(20).optional().or(z.literal("")),
});

export type CorporationId = z.infer<typeof corporationIdSchema>;

/** Person responsible for the filing — used as the reply-to on intake emails. */
export const contactSchema = z.object({
  contactFirstName: z.string().trim().min(1, "Required").max(100),
  contactLastName: z.string().trim().min(1, "Required").max(100),
  contactEmail: z.string().trim().email("Valid email required").max(320),
  contactPhone: z.string().trim().min(7, "Required").max(30),
  contactRole: z.string().trim().max(100).optional().or(z.literal("")),
});

export type ContactInfo = z.infer<typeof contactSchema>;

// ── 1. Change of Director / Officer ─────────────────────────────────────────
//
// Each Change row is either an addition, a removal, or an update. The form
// captures the same demographic fields the federal Form 6 and Ontario Notice
// of Change require: full legal name, residential address, position (for
// officers), Canadian residency (for federal directors — CBCA s.105(3)), and
// effective date.

export const directorOfficerChangeKindSchema = z.enum(
  ["add", "remove", "update"],
  { message: "Select the type of change" }
);

export const directorOfficerRoleSchema = z.enum(["director", "officer", "director_and_officer"], {
  message: "Select the role",
});

export const directorOfficerChangeSchema = z
  .object({
    changeKind: directorOfficerChangeKindSchema,
    role: directorOfficerRoleSchema,
    firstName: z.string().trim().min(1, "Required").max(100),
    lastName: z.string().trim().min(1, "Required").max(100),
    email: z.string().trim().email("Valid email required").max(320).optional().or(z.literal("")),
    /** Officer position — required when role includes "officer". */
    officerPosition: z
      .enum(OFFICER_POSITIONS as unknown as [OfficerPosition, ...OfficerPosition[]])
      .optional(),
    /** CBCA s.105(3) — at least 25% of federal directors must be Canadian residents. */
    canadianResident: z.boolean().optional(),
    address: addressSchema,
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.role === "officer" || data.role === "director_and_officer") {
      if (!data.officerPosition) {
        ctx.addIssue({
          path: ["officerPosition"],
          code: z.ZodIssueCode.custom,
          message: "Required for officers",
        });
      }
    }
  });

export const changeDirectorSchema = z
  .object({
    corporation: corporationIdSchema,
    changes: z
      .array(directorOfficerChangeSchema)
      .min(1, "Add at least one change")
      .max(20, "Maximum 20 changes per filing"),
  })
  .merge(z.object({ contact: contactSchema }))
  .merge(billingSchema);

export type ChangeDirectorSubmission = z.infer<typeof changeDirectorSchema>;

// ── 2. Change of Shareholder ────────────────────────────────────────────────
//
// Internal-records update only. Captures the type of transaction (issuance,
// transfer, redemption, cancellation), the parties involved, the share class,
// the number of shares, the consideration, and the effective date.

export const shareholderChangeTypeSchema = z.enum(
  ["issuance", "transfer", "redemption", "cancellation"],
  { message: "Select the type of share change" }
);

export const shareholderPartyTypeSchema = z.enum(["individual", "corporation"], {
  message: "Select party type",
});

export const shareholderPartySchema = z
  .object({
    partyType: shareholderPartyTypeSchema,
    // Individual fields
    firstName: z.string().trim().max(100).optional().or(z.literal("")),
    lastName: z.string().trim().max(100).optional().or(z.literal("")),
    // Corporation fields
    corpName: z.string().trim().max(200).optional().or(z.literal("")),
    corpNumber: z.string().trim().max(50).optional().or(z.literal("")),
    email: z.string().trim().email("Valid email required").max(320).optional().or(z.literal("")),
    address: addressSchema,
  })
  .superRefine((data, ctx) => {
    if (data.partyType === "individual") {
      if (!data.firstName) {
        ctx.addIssue({ path: ["firstName"], code: z.ZodIssueCode.custom, message: "Required" });
      }
      if (!data.lastName) {
        ctx.addIssue({ path: ["lastName"], code: z.ZodIssueCode.custom, message: "Required" });
      }
    } else if (data.partyType === "corporation") {
      if (!data.corpName) {
        ctx.addIssue({ path: ["corpName"], code: z.ZodIssueCode.custom, message: "Required" });
      }
    }
  });

export const changeShareholderSchema = z
  .object({
    corporation: corporationIdSchema,
    changeType: shareholderChangeTypeSchema,
    shareClass: z.string().trim().min(1, "Required").max(50),
    numberOfShares: z
      .number({ message: "Required" })
      .int("Whole number")
      .positive("Must be positive")
      .max(1_000_000_000),
    consideration: z
      .string()
      .trim()
      .max(200)
      .optional()
      .or(z.literal("")),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    /** Required for transfers + redemptions + cancellations. */
    fromParty: shareholderPartySchema.optional(),
    /** Required for issuances + transfers. */
    toParty: shareholderPartySchema.optional(),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    const needsFrom =
      data.changeType === "transfer" ||
      data.changeType === "redemption" ||
      data.changeType === "cancellation";
    const needsTo = data.changeType === "issuance" || data.changeType === "transfer";
    if (needsFrom && !data.fromParty) {
      ctx.addIssue({ path: ["fromParty"], code: z.ZodIssueCode.custom, message: "Required" });
    }
    if (needsTo && !data.toParty) {
      ctx.addIssue({ path: ["toParty"], code: z.ZodIssueCode.custom, message: "Required" });
    }
  });

export type ChangeShareholderSubmission = z.infer<typeof changeShareholderSchema>;

// ── 3. Corporation Address Change ───────────────────────────────────────────
//
// Federal (Form 3) requires the new registered office address to be in the
// province specified in the Articles. Ontario allows separate registered
// office + mailing address.

export const changeAddressSchema = z
  .object({
    corporation: corporationIdSchema,
    /** What's being changed. */
    changeRegisteredOffice: z.boolean(),
    changeMailingAddress: z.boolean(),
    /** New registered office — required if changeRegisteredOffice is true. */
    newRegisteredOffice: addressSchema.optional(),
    /** New mailing address — required if changeMailingAddress is true (Ontario only). */
    newMailingAddress: addressSchema.optional(),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (!data.changeRegisteredOffice && !data.changeMailingAddress) {
      ctx.addIssue({
        path: ["changeRegisteredOffice"],
        code: z.ZodIssueCode.custom,
        message: "Select at least one address to change",
      });
    }
    if (data.changeRegisteredOffice && !data.newRegisteredOffice) {
      ctx.addIssue({
        path: ["newRegisteredOffice"],
        code: z.ZodIssueCode.custom,
        message: "New registered office required",
      });
    }
    if (data.changeMailingAddress && !data.newMailingAddress) {
      ctx.addIssue({
        path: ["newMailingAddress"],
        code: z.ZodIssueCode.custom,
        message: "New mailing address required",
      });
    }
  });

export type ChangeAddressSubmission = z.infer<typeof changeAddressSchema>;

// ── 4. Articles of Amendment ────────────────────────────────────────────────
//
// CBCA s.173 / OBCA s.168 — Articles can be amended to change the corporate
// name, share structure, restrictions on issuing shares, number of directors,
// restrictions on the business, or any other provision in the Articles. The
// wizard captures which provisions are being changed and the text of the
// amendment.

export const amendmentChangeTypeSchema = z.enum(
  [
    "corporate_name",
    "share_structure",
    "share_provisions",
    "number_of_directors",
    "business_restrictions",
    "other_provisions",
  ],
  { message: "Select what you're amending" }
);

export type AmendmentChangeType = z.infer<typeof amendmentChangeTypeSchema>;

export const articlesAmendmentSchema = z
  .object({
    corporation: corporationIdSchema,
    /** Multi-select — at least one must be checked. */
    changeTypes: z
      .array(amendmentChangeTypeSchema)
      .min(1, "Select at least one change")
      .max(6),
    // Corporate name change
    newCorpName: z.string().trim().max(200).optional().or(z.literal("")),
    newLegalEnding: z
      .enum(LEGAL_ENDINGS as unknown as [LegalEnding, ...LegalEnding[]])
      .optional(),
    // Number-of-directors change (CBCA s.106(1) / OBCA s.115(1))
    minDirectors: z.number().int().min(1).max(50).optional(),
    maxDirectors: z.number().int().min(1).max(50).optional(),
    fixedDirectors: z.number().int().min(1).max(50).optional(),
    /** Free-text description of the amendments. The drafter writes the
     *  formal amendment language; this captures the customer's intent in
     *  plain English so the drafter understands what to file. */
    amendmentDescription: z
      .string()
      .trim()
      .min(20, "Please describe the amendment(s) in detail (min 20 characters)")
      .max(5000),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    /** Special-resolution attestation — required by both statutes. */
    specialResolutionPassed: z
      .boolean()
      .refine((v) => v === true, { message: "Required: a special resolution must have been passed" }),
    specialResolutionDate: z.string().trim().min(8, "Required").max(20),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.changeTypes.includes("corporate_name")) {
      if (!data.newCorpName) {
        ctx.addIssue({
          path: ["newCorpName"],
          code: z.ZodIssueCode.custom,
          message: "New corporate name required",
        });
      }
      if (!data.newLegalEnding) {
        ctx.addIssue({
          path: ["newLegalEnding"],
          code: z.ZodIssueCode.custom,
          message: "Select a legal ending",
        });
      }
    }
    if (data.changeTypes.includes("number_of_directors")) {
      const hasMinMax = data.minDirectors != null && data.maxDirectors != null;
      const hasFixed = data.fixedDirectors != null;
      if (!hasMinMax && !hasFixed) {
        ctx.addIssue({
          path: ["fixedDirectors"],
          code: z.ZodIssueCode.custom,
          message: "Provide either a fixed number or a min/max range",
        });
      }
      if (hasMinMax && data.minDirectors! > data.maxDirectors!) {
        ctx.addIssue({
          path: ["maxDirectors"],
          code: z.ZodIssueCode.custom,
          message: "Maximum must be greater than or equal to minimum",
        });
      }
    }
  });

export type ArticlesAmendmentSubmission = z.infer<typeof articlesAmendmentSchema>;

// ── Discriminated union for the API route ───────────────────────────────────

export const amendmentRequestSchema = z.discriminatedUnion("service", [
  z.object({ service: z.literal("change-director"), payload: changeDirectorSchema }),
  z.object({ service: z.literal("change-shareholder"), payload: changeShareholderSchema }),
  z.object({ service: z.literal("change-address"), payload: changeAddressSchema }),
  z.object({ service: z.literal("articles-amendment"), payload: articlesAmendmentSchema }),
]);

export type AmendmentRequest = z.infer<typeof amendmentRequestSchema>;
