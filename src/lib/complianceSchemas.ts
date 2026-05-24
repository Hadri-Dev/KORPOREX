// Zod schemas for the four recurring compliance filings. Each captures the
// data the relevant government form requires; jurisdiction is fixed for the
// per-jurisdiction services (Initial Return Ontario, Annual Return Ontario,
// Annual Return Federal) and bi-jurisdictional for the Notice of Change.
//
// Statutory references (for the operator reviewing the [PENDING] intake):
//
//   initial-return-on      → Ontario Corporations Information Act s.2 — within
//                            60 days of incorporation
//   annual-return-on       → Ontario CIA s.3.1, filed via the Ontario Business
//                            Registry; annual on the incorporation anniversary
//   annual-return-federal  → CBCA s.263 (Form 22), within 60 days of the
//                            anniversary of incorporation
//   notice-of-change       → Federal: Form 3 (Reg. office), Form 6 (Directors).
//                            Ontario: CIA Notice of Change. Single bundled
//                            filing covering multiple change types.

import { z } from "zod";
import {
  addressSchema,
  billingSchema,
  corporationIdSchema,
  contactSchema,
  directorOfficerChangeSchema,
  type AmendmentJurisdiction,
} from "./amendmentSchemas";
import { OFFICER_POSITIONS, type OfficerPosition } from "./officerPositions";

export { addressSchema, billingSchema };

// ── Shared person sub-schemas (current directors/officers for returns) ──────

/**
 * A current director on a return. Used by Initial Return + Annual Returns to
 * confirm the current slate of directors as of the filing date.
 */
export const currentDirectorSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Valid email required").max(320).optional().or(z.literal("")),
  /** CBCA s.105(3) — at least 25% of federal directors must be Canadian residents. */
  canadianResident: z.boolean().optional(),
  electedDate: z.string().trim().max(20).optional().or(z.literal("")),
  address: addressSchema,
});

export type CurrentDirector = z.infer<typeof currentDirectorSchema>;

export const currentOfficerSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  position: z.enum(OFFICER_POSITIONS as unknown as [OfficerPosition, ...OfficerPosition[]], {
    message: "Select a position",
  }),
  email: z.string().trim().email("Valid email required").max(320).optional().or(z.literal("")),
  appointedDate: z.string().trim().max(20).optional().or(z.literal("")),
  address: addressSchema,
});

export type CurrentOfficer = z.infer<typeof currentOfficerSchema>;

// ── 1. Initial Return (Ontario) ─────────────────────────────────────────────
//
// Required of all Ontario corporations within 60 days of incorporation under
// the Corporations Information Act. Captures the registered office, directors,
// and officers as of the date of incorporation (or any subsequent changes that
// have happened before this filing).

export const initialReturnOntarioSchema = z
  .object({
    corporation: corporationIdSchema,
    incorporationDate: z.string().trim().min(8, "Required").max(20),
    registeredOffice: addressSchema,
    mailingAddressDifferent: z.boolean(),
    mailingAddress: addressSchema.optional(),
    directors: z
      .array(currentDirectorSchema)
      .min(1, "At least one director is required")
      .max(20),
    officers: z
      .array(currentOfficerSchema)
      .min(1, "At least one officer is required")
      .max(20),
    naicsCode: z.string().trim().min(4, "Required").max(10),
    principalActivity: z
      .string()
      .trim()
      .min(10, "Please describe the principal activity (min 10 characters)")
      .max(2000),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.mailingAddressDifferent && !data.mailingAddress) {
      ctx.addIssue({
        path: ["mailingAddress"],
        code: z.ZodIssueCode.custom,
        message: "Mailing address required",
      });
    }
    if (data.corporation.jurisdiction !== "ontario") {
      ctx.addIssue({
        path: ["corporation", "jurisdiction"],
        code: z.ZodIssueCode.custom,
        message: "Initial Return is an Ontario filing",
      });
    }
  });

export type InitialReturnOntarioSubmission = z.infer<typeof initialReturnOntarioSchema>;

// ── 2. Annual Return — Ontario ──────────────────────────────────────────────
//
// Filed annually via the Ontario Business Registry. Confirms whether the
// corporation's information remains current; if anything has changed since
// the last filing, the updated information is captured inline.

export const annualReturnOntarioSchema = z
  .object({
    corporation: corporationIdSchema,
    fiscalYearEnd: z.string().trim().min(8, "Required").max(20),
    anniversaryDate: z.string().trim().min(8, "Required").max(20),
    /** Did anything change since the prior return? */
    informationCurrent: z.boolean(),
    /** Updated registered office — required when informationCurrent === false and the office changed. */
    registeredOfficeChanged: z.boolean(),
    newRegisteredOffice: addressSchema.optional(),
    directorsChanged: z.boolean(),
    /** Current slate of directors — required when directorsChanged === true. */
    directors: z.array(currentDirectorSchema).max(20).optional(),
    officersChanged: z.boolean(),
    officers: z.array(currentOfficerSchema).max(20).optional(),
    naicsCode: z.string().trim().max(10).optional().or(z.literal("")),
    principalActivity: z.string().trim().max(2000).optional().or(z.literal("")),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.corporation.jurisdiction !== "ontario") {
      ctx.addIssue({
        path: ["corporation", "jurisdiction"],
        code: z.ZodIssueCode.custom,
        message: "Annual Return (Ontario) is an Ontario filing",
      });
    }
    if (data.registeredOfficeChanged && !data.newRegisteredOffice) {
      ctx.addIssue({
        path: ["newRegisteredOffice"],
        code: z.ZodIssueCode.custom,
        message: "New registered office required when changed",
      });
    }
    if (data.directorsChanged && (!data.directors || data.directors.length === 0)) {
      ctx.addIssue({
        path: ["directors"],
        code: z.ZodIssueCode.custom,
        message: "Provide the current slate of directors",
      });
    }
    if (data.officersChanged && (!data.officers || data.officers.length === 0)) {
      ctx.addIssue({
        path: ["officers"],
        code: z.ZodIssueCode.custom,
        message: "Provide the current slate of officers",
      });
    }
  });

export type AnnualReturnOntarioSubmission = z.infer<typeof annualReturnOntarioSchema>;

// ── 3. Annual Return — Federal (CBCA Form 22) ───────────────────────────────
//
// Filed with Corporations Canada under CBCA s.263 within 60 days of the
// anniversary of incorporation. Confirms distributing/non-distributing status,
// the number of shareholders, that the financial year-end date is current,
// and that director/officer/address info remains current (with updates if not).

export const distributingStatusSchema = z.enum(["distributing", "non_distributing"], {
  message: "Select distributing status",
});

export const annualReturnFederalSchema = z
  .object({
    corporation: corporationIdSchema,
    anniversaryDate: z.string().trim().min(8, "Required").max(20),
    fiscalYearEnd: z.string().trim().min(8, "Required").max(20),
    distributingStatus: distributingStatusSchema,
    numberOfShareholders: z.number().int().min(1).max(1_000_000),
    /** Did anything change since the prior return? */
    informationCurrent: z.boolean(),
    registeredOfficeChanged: z.boolean(),
    newRegisteredOffice: addressSchema.optional(),
    directorsChanged: z.boolean(),
    directors: z.array(currentDirectorSchema).max(20).optional(),
    officersChanged: z.boolean(),
    officers: z.array(currentOfficerSchema).max(20).optional(),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.corporation.jurisdiction !== "federal") {
      ctx.addIssue({
        path: ["corporation", "jurisdiction"],
        code: z.ZodIssueCode.custom,
        message: "Annual Return (Federal) is a CBCA filing",
      });
    }
    if (data.registeredOfficeChanged && !data.newRegisteredOffice) {
      ctx.addIssue({
        path: ["newRegisteredOffice"],
        code: z.ZodIssueCode.custom,
        message: "New registered office required when changed",
      });
    }
    if (data.directorsChanged && (!data.directors || data.directors.length === 0)) {
      ctx.addIssue({
        path: ["directors"],
        code: z.ZodIssueCode.custom,
        message: "Provide the current slate of directors",
      });
    }
    if (data.officersChanged && (!data.officers || data.officers.length === 0)) {
      ctx.addIssue({
        path: ["officers"],
        code: z.ZodIssueCode.custom,
        message: "Provide the current slate of officers",
      });
    }
  });

export type AnnualReturnFederalSubmission = z.infer<typeof annualReturnFederalSchema>;

// ── 4. Notice of Change (bi-jurisdictional, bundled) ────────────────────────
//
// A single filing that bundles multiple change types. Cheaper than filing each
// change as a separate amendment. Customer picks what's changing; the wizard
// surfaces sub-forms for each. Reuses the directorOfficerChangeSchema from
// amendmentSchemas so the per-change row UI is identical to Change of Director
// / Officer.

export const noticeChangeTypeSchema = z.enum(
  ["registered_office", "mailing_address", "directors_officers"],
  { message: "Select at least one change type" }
);

export type NoticeChangeType = z.infer<typeof noticeChangeTypeSchema>;

export const noticeOfChangeSchema = z
  .object({
    corporation: corporationIdSchema,
    /** What's being changed — multi-select. */
    changeTypes: z
      .array(noticeChangeTypeSchema)
      .min(1, "Select at least one change")
      .max(3),
    /** Registered office — required when changeTypes includes registered_office. */
    newRegisteredOffice: addressSchema.optional(),
    /** Mailing address — required when changeTypes includes mailing_address. */
    newMailingAddress: addressSchema.optional(),
    /** Director / officer changes — required when changeTypes includes directors_officers. */
    directorOfficerChanges: z
      .array(directorOfficerChangeSchema)
      .max(20)
      .optional(),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    contact: contactSchema,
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.changeTypes.includes("registered_office") && !data.newRegisteredOffice) {
      ctx.addIssue({
        path: ["newRegisteredOffice"],
        code: z.ZodIssueCode.custom,
        message: "New registered office required",
      });
    }
    if (data.changeTypes.includes("mailing_address") && !data.newMailingAddress) {
      ctx.addIssue({
        path: ["newMailingAddress"],
        code: z.ZodIssueCode.custom,
        message: "New mailing address required",
      });
    }
    if (
      data.changeTypes.includes("directors_officers") &&
      (!data.directorOfficerChanges || data.directorOfficerChanges.length === 0)
    ) {
      ctx.addIssue({
        path: ["directorOfficerChanges"],
        code: z.ZodIssueCode.custom,
        message: "Add at least one director or officer change",
      });
    }
  });

export type NoticeOfChangeSubmission = z.infer<typeof noticeOfChangeSchema>;

// ── Discriminated union for the API route ───────────────────────────────────

export const complianceRequestSchema = z.discriminatedUnion("service", [
  z.object({ service: z.literal("initial-return-on"), payload: initialReturnOntarioSchema }),
  z.object({ service: z.literal("annual-return-on"), payload: annualReturnOntarioSchema }),
  z.object({ service: z.literal("annual-return-federal"), payload: annualReturnFederalSchema }),
  z.object({ service: z.literal("notice-of-change"), payload: noticeOfChangeSchema }),
]);

export type ComplianceRequest = z.infer<typeof complianceRequestSchema>;

// Re-exported for the API route's typing convenience.
export type { AmendmentJurisdiction };
