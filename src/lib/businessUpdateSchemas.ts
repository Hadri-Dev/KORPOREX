// Zod schemas for the four corporate-restructuring filings (the Business
// Updates category on /services). Each schema captures the data the relevant
// statute and government form require; jurisdiction is collected up front
// (Federal/CBCA vs Ontario/OBCA) and steers the per-jurisdiction validation.
//
// Statutory references (for the operator reviewing the [PENDING] intake):
//
//   dissolve-business    → CBCA s.210-211 (Articles of Dissolution, Form 17/19)
//                          OBCA s.237 (Articles of Dissolution)
//   revive-business      → CBCA s.209 (Articles of Revival, Form 15)
//                          OBCA s.241 (Articles of Revival)
//   amalgamation         → CBCA s.181-186 (Articles of Amalgamation, Form 9)
//                          OBCA s.174-179
//   continuance          → CBCA s.187 (continuance INTO federal) / s.188 (OUT)
//                          OBCA s.180 (continuance INTO Ontario) / s.181 (OUT)

import { z } from "zod";
import {
  addressSchema,
  billingSchema,
  corporationIdSchema,
  contactSchema,
  amendmentJurisdictionSchema,
  type AmendmentJurisdiction,
} from "./amendmentSchemas";
import {
  currentDirectorSchema,
  currentOfficerSchema,
  type CurrentDirector,
  type CurrentOfficer,
} from "./complianceSchemas";
import { LEGAL_ENDINGS, type LegalEnding } from "./legalEndings";

export { addressSchema, billingSchema };
export type { CurrentDirector, CurrentOfficer };

// ── 1. Dissolve a Business ──────────────────────────────────────────────────
//
// Voluntary dissolution. Both CBCA and OBCA require the special resolution to
// authorize dissolution, plus a statement that the corporation has no debts /
// has paid all debts / its creditors have consented, and that any remaining
// assets have been distributed to shareholders.

export const dissolutionPathSchema = z.enum(
  ["never_commenced", "no_property_no_liabilities", "wound_up_with_assets"],
  { message: "Select the dissolution pathway" }
);

export type DissolutionPath = z.infer<typeof dissolutionPathSchema>;

export const dissolutionSchema = z
  .object({
    corporation: corporationIdSchema,
    dissolutionPath: dissolutionPathSchema,
    /** Date the corporation last carried on business / ceased operations. */
    cessationDate: z.string().trim().min(8, "Required").max(20),
    /** Statement re: debts. */
    debtsStatement: z.enum(["no_debts", "all_debts_paid", "creditors_consent"], {
      message: "Confirm the corporation's debt status",
    }),
    /** Statement re: assets. */
    assetsStatement: z.enum(["no_property", "distributed_to_shareholders"], {
      message: "Confirm the corporation's asset status",
    }),
    /** Special resolution required by both statutes (except where there are no
     *  shareholders — covered by the dissolutionPath choice). */
    specialResolutionPassed: z.boolean(),
    specialResolutionDate: z.string().trim().max(20).optional().or(z.literal("")),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    /** Acknowledgement that final tax / payroll / GST returns are filed. */
    finalReturnsFiled: z
      .boolean()
      .refine((v) => v === true, {
        message: "Final tax / GST / payroll returns must be filed before dissolution",
      }),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    // Shareholder special resolution is required unless the corporation never
    // commenced business (no shareholders).
    if (data.dissolutionPath !== "never_commenced") {
      if (!data.specialResolutionPassed) {
        ctx.addIssue({
          path: ["specialResolutionPassed"],
          code: z.ZodIssueCode.custom,
          message: "A special shareholder resolution authorizing the dissolution is required",
        });
      }
      if (!data.specialResolutionDate) {
        ctx.addIssue({
          path: ["specialResolutionDate"],
          code: z.ZodIssueCode.custom,
          message: "Resolution date required",
        });
      }
    }
  });

export type DissolutionSubmission = z.infer<typeof dissolutionSchema>;

// ── 2. Revive a Business ────────────────────────────────────────────────────
//
// Articles of Revival restore a dissolved corporation. The form asks for the
// reason for revival, current directors / officers / registered office, and —
// if dissolution was by default of the registrar — for confirmation that any
// outstanding returns / filings have been brought current.

export const dissolutionReasonSchema = z.enum(
  ["voluntary", "default_failure_to_file", "court_order", "other"],
  { message: "Select the reason for the original dissolution" }
);

export type DissolutionReason = z.infer<typeof dissolutionReasonSchema>;

export const revivalSchema = z
  .object({
    corporation: corporationIdSchema,
    dissolutionDate: z.string().trim().min(8, "Required").max(20),
    dissolutionReason: dissolutionReasonSchema,
    dissolutionReasonOther: z.string().trim().max(500).optional().or(z.literal("")),
    /** Required if the dissolution was for default — confirms all outstanding
     *  returns / annual filings have been brought current. */
    outstandingFilingsBroughtCurrent: z.boolean(),
    reasonForRevival: z
      .string()
      .trim()
      .min(10, "Please explain why the corporation is being revived")
      .max(2000),
    revivedRegisteredOffice: addressSchema,
    directors: z.array(currentDirectorSchema).min(1, "At least one director required").max(20),
    officers: z.array(currentOfficerSchema).min(1, "At least one officer required").max(20),
    /** A creditor / claimant requesting revival sometimes has standing
     *  separately from the corporation. CBCA s.209(1) allows "an interested
     *  person". Captures the requestor's relationship to the corp. */
    requestorRelationship: z.enum(
      ["former_director", "former_shareholder", "creditor", "court_order", "other"],
      { message: "Select your relationship to the dissolved corporation" }
    ),
    requestorRelationshipOther: z.string().trim().max(500).optional().or(z.literal("")),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.dissolutionReason === "other" && !data.dissolutionReasonOther) {
      ctx.addIssue({
        path: ["dissolutionReasonOther"],
        code: z.ZodIssueCode.custom,
        message: "Please describe the reason",
      });
    }
    if (data.requestorRelationship === "other" && !data.requestorRelationshipOther) {
      ctx.addIssue({
        path: ["requestorRelationshipOther"],
        code: z.ZodIssueCode.custom,
        message: "Please describe your relationship",
      });
    }
    if (
      data.dissolutionReason === "default_failure_to_file" &&
      !data.outstandingFilingsBroughtCurrent
    ) {
      ctx.addIssue({
        path: ["outstandingFilingsBroughtCurrent"],
        code: z.ZodIssueCode.custom,
        message:
          "Default dissolutions require all outstanding returns to be filed before revival is approved",
      });
    }
  });

export type RevivalSubmission = z.infer<typeof revivalSchema>;

// ── 3. Amalgamation ─────────────────────────────────────────────────────────
//
// Combine two or more corporations into one. Three flavours: long-form
// (separate corporations, requires amalgamation agreement + special
// resolutions by each predecessor), short-form vertical (parent-subsidiary,
// directors' resolution only), short-form horizontal (sister corporations
// fully owned by the same parent, directors' resolutions only).
//
// All predecessor corporations must be in the same jurisdiction as the
// amalgamated corporation. Cross-jurisdiction amalgamations require one of
// the parties to continue into the other's jurisdiction first.

export const amalgamationTypeSchema = z.enum(
  ["long_form", "short_form_vertical", "short_form_horizontal"],
  { message: "Select the amalgamation type" }
);

export type AmalgamationType = z.infer<typeof amalgamationTypeSchema>;

export const corpNameTypeSchema = z.enum(["named", "numbered"], {
  message: "Select named or numbered",
});

/** Predecessor corporation row. Each row captures the legal name + corp
 *  number of one of the amalgamating entities. Jurisdiction is shared across
 *  all rows (top-level on the schema), so it's not repeated per row. */
export const predecessorCorporationSchema = z.object({
  corpName: z.string().trim().min(1, "Required").max(200),
  corpNumber: z.string().trim().min(1, "Required").max(50),
  businessNumber: z.string().trim().max(20).optional().or(z.literal("")),
});

export const amalgamationSchema = z
  .object({
    /** Jurisdiction of the new amalgamated corporation. All predecessors must
     *  be in this same jurisdiction. */
    newJurisdiction: amendmentJurisdictionSchema,
    amalgamationType: amalgamationTypeSchema,
    /** 2+ predecessor corporations. */
    predecessors: z
      .array(predecessorCorporationSchema)
      .min(2, "At least two predecessor corporations required")
      .max(10),
    /** Name choice for the amalgamated entity. */
    newCorpNameType: corpNameTypeSchema,
    newCorpName: z.string().trim().max(200).optional().or(z.literal("")),
    newLegalEnding: z
      .enum(LEGAL_ENDINGS as unknown as [LegalEnding, ...LegalEnding[]])
      .optional(),
    /** Registered office of the amalgamated corporation. */
    registeredOffice: addressSchema,
    /** Directors of the amalgamated corporation. */
    directors: z
      .array(currentDirectorSchema)
      .min(1, "At least one director required")
      .max(20),
    /** Date the amalgamation agreement / directors' resolution was signed. */
    agreementDate: z.string().trim().min(8, "Required").max(20),
    /** Date each predecessor passed its special resolution (long-form only). */
    specialResolutionsDate: z.string().trim().max(20).optional().or(z.literal("")),
    /** Effective date for the amalgamation. */
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    /** Plain-English description of share-structure design. The drafter
     *  formalizes this into the Articles. */
    shareStructureNotes: z
      .string()
      .trim()
      .min(20, "Describe the share structure of the amalgamated corporation (min 20 characters)")
      .max(3000),
    notes: z.string().trim().max(3000).optional().or(z.literal("")),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.newCorpNameType === "named") {
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
    if (data.amalgamationType === "long_form" && !data.specialResolutionsDate) {
      ctx.addIssue({
        path: ["specialResolutionsDate"],
        code: z.ZodIssueCode.custom,
        message:
          "Long-form amalgamations require special resolutions of the shareholders of each predecessor",
      });
    }
  });

export type AmalgamationSubmission = z.infer<typeof amalgamationSchema>;

// ── 4. Continuance Between Jurisdictions ────────────────────────────────────
//
// A continuance is the legal mechanism for a corporation to move from one
// jurisdiction to another while preserving its corporate existence. Two
// parallel filings are required: authorization to depart from the home
// jurisdiction, and acceptance into the new jurisdiction (which becomes the
// corporation's new home).

export const continuanceDirectionSchema = z.enum(["into", "out_of"], {
  message: "Select the direction",
});

export type ContinuanceDirection = z.infer<typeof continuanceDirectionSchema>;

/** Korporex services Federal + Ontario directly; other Canadian and foreign
 *  jurisdictions are captured as free-text so the operator can coordinate. */
export const continuanceJurisdictionSchema = z.enum(
  ["federal", "ontario", "bc", "alberta", "quebec", "other"],
  { message: "Select a jurisdiction" }
);

export type ContinuanceJurisdiction = z.infer<typeof continuanceJurisdictionSchema>;

export const continuanceSchema = z
  .object({
    /** Which side is Korporex coordinating: into Federal/ON, or out of Federal/ON. */
    direction: continuanceDirectionSchema,
    /** Current home jurisdiction. */
    currentJurisdiction: continuanceJurisdictionSchema,
    currentJurisdictionOther: z.string().trim().max(100).optional().or(z.literal("")),
    /** Destination jurisdiction. */
    destinationJurisdiction: continuanceJurisdictionSchema,
    destinationJurisdictionOther: z.string().trim().max(100).optional().or(z.literal("")),
    /** Current legal name + corp number (in the current jurisdiction). */
    currentCorpName: z.string().trim().min(1, "Required").max(200),
    currentCorpNumber: z.string().trim().min(1, "Required").max(50),
    businessNumber: z.string().trim().max(20).optional().or(z.literal("")),
    /** Whether the corporate name is changing as part of the continuance. */
    nameChanging: z.boolean(),
    newCorpName: z.string().trim().max(200).optional().or(z.literal("")),
    newLegalEnding: z
      .enum(LEGAL_ENDINGS as unknown as [LegalEnding, ...LegalEnding[]])
      .optional(),
    /** New registered office in the destination jurisdiction. */
    newRegisteredOffice: addressSchema,
    /** Plain-English explanation. Operationally useful for routing. */
    reasonForContinuance: z
      .string()
      .trim()
      .min(10, "Please explain why you're continuing the corporation")
      .max(2000),
    /** Special resolution required by both CBCA and OBCA. */
    specialResolutionPassed: z
      .boolean()
      .refine((v) => v === true, {
        message: "A special resolution authorizing the continuance is required",
      }),
    specialResolutionDate: z.string().trim().min(8, "Required").max(20),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    /** Directors of the corporation as continued. */
    directors: z
      .array(currentDirectorSchema)
      .min(1, "At least one director required")
      .max(20),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.currentJurisdiction === "other" && !data.currentJurisdictionOther) {
      ctx.addIssue({
        path: ["currentJurisdictionOther"],
        code: z.ZodIssueCode.custom,
        message: "Please specify",
      });
    }
    if (data.destinationJurisdiction === "other" && !data.destinationJurisdictionOther) {
      ctx.addIssue({
        path: ["destinationJurisdictionOther"],
        code: z.ZodIssueCode.custom,
        message: "Please specify",
      });
    }
    if (data.currentJurisdiction === data.destinationJurisdiction && data.currentJurisdiction !== "other") {
      ctx.addIssue({
        path: ["destinationJurisdiction"],
        code: z.ZodIssueCode.custom,
        message: "Destination must differ from the current jurisdiction",
      });
    }
    if (data.nameChanging) {
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
  });

export type ContinuanceSubmission = z.infer<typeof continuanceSchema>;

// ── Discriminated union for the API route ───────────────────────────────────

export const businessUpdateRequestSchema = z.discriminatedUnion("service", [
  z.object({ service: z.literal("dissolve-business"), payload: dissolutionSchema }),
  z.object({ service: z.literal("revive-business"), payload: revivalSchema }),
  z.object({ service: z.literal("amalgamation"), payload: amalgamationSchema }),
  z.object({ service: z.literal("continuance"), payload: continuanceSchema }),
]);

export type BusinessUpdateRequest = z.infer<typeof businessUpdateRequestSchema>;

// Re-exported for the API route's typing convenience.
export type { AmendmentJurisdiction };
