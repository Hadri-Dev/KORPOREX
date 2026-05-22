import { z } from "zod";

// Shared sub-schemas
export const addressSchema = z.object({
  street: z.string().trim().min(1, "Required").max(200),
  city: z.string().trim().min(1, "Required").max(100),
  region: z.string().trim().min(1, "Required").max(100),
  postalCode: z.string().trim().min(3, "Required").max(12),
  country: z.string().trim().min(2, "Required").max(60),
});

export const billingSchema = z.object({
  billingName: z.string().trim().min(1, "Required").max(200),
  billingAddress: addressSchema,
});

// ── Sole Proprietorship Registration (Ontario) ──────────────────────────────
export const soleProprietorshipSchema = z
  .object({
    businessName: z.string().trim().min(1, "Required").max(200),
    businessActivity: z.string().trim().min(10, "Please describe the business activity").max(2000),
    naicsCode: z.string().trim().min(4, "Required").max(10),
    businessAddress: addressSchema,
    ownerFirstName: z.string().trim().min(1, "Required").max(100),
    ownerLastName: z.string().trim().min(1, "Required").max(100),
    ownerEmail: z.string().trim().email("Valid email required").max(320),
    ownerPhone: z.string().trim().min(7, "Required").max(30),
    ownerDob: z.string().trim().min(8, "Required").max(20),
    ownerAddress: addressSchema,
    effectiveDate: z.string().trim().min(8, "Required").max(20),
  })
  .merge(billingSchema);

export type SoleProprietorshipSubmission = z.infer<typeof soleProprietorshipSchema>;

// ── Business Name Registration (Ontario) ────────────────────────────────────
export const businessNameRegistrationSchema = z
  .object({
    businessName: z.string().trim().min(1, "Required").max(200),
    businessActivity: z.string().trim().min(10, "Please describe the business activity").max(2000),
    naicsCode: z.string().trim().min(4, "Required").max(10),
    businessAddress: addressSchema,
    entityType: z.enum(["individual", "corporation"], { message: "Select an entity type" }),
    // Individual fields (used when entityType === "individual")
    ownerFirstName: z.string().trim().max(100).optional().or(z.literal("")),
    ownerLastName: z.string().trim().max(100).optional().or(z.literal("")),
    ownerDob: z.string().trim().max(20).optional().or(z.literal("")),
    // Corporation fields (used when entityType === "corporation")
    corpName: z.string().trim().max(200).optional().or(z.literal("")),
    corpNumber: z.string().trim().max(50).optional().or(z.literal("")),
    contactEmail: z.string().trim().email("Valid email required").max(320),
    contactPhone: z.string().trim().min(7, "Required").max(30),
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    if (data.entityType === "individual") {
      if (!data.ownerFirstName) {
        ctx.addIssue({
          path: ["ownerFirstName"],
          code: z.ZodIssueCode.custom,
          message: "Required",
        });
      }
      if (!data.ownerLastName) {
        ctx.addIssue({
          path: ["ownerLastName"],
          code: z.ZodIssueCode.custom,
          message: "Required",
        });
      }
      if (!data.ownerDob) {
        ctx.addIssue({
          path: ["ownerDob"],
          code: z.ZodIssueCode.custom,
          message: "Required",
        });
      }
    } else if (data.entityType === "corporation") {
      if (!data.corpName) {
        ctx.addIssue({
          path: ["corpName"],
          code: z.ZodIssueCode.custom,
          message: "Required",
        });
      }
      if (!data.corpNumber) {
        ctx.addIssue({
          path: ["corpNumber"],
          code: z.ZodIssueCode.custom,
          message: "Required",
        });
      }
    }
  });

export type BusinessNameRegistrationSubmission = z.infer<typeof businessNameRegistrationSchema>;

// ── Business Number Registration (CRA) ──────────────────────────────────────
export const businessNumberSchema = z
  .object({
    legalName: z.string().trim().min(1, "Required").max(200),
    entityType: z.enum(["individual", "sole_prop", "partnership", "corporation"], {
      message: "Select an entity type",
    }),
    entityAddress: addressSchema,
    contactFirstName: z.string().trim().min(1, "Required").max(100),
    contactLastName: z.string().trim().min(1, "Required").max(100),
    contactEmail: z.string().trim().email("Valid email required").max(320),
    contactPhone: z.string().trim().min(7, "Required").max(30),
    programGst: z.boolean(),
    programPayroll: z.boolean(),
    programImportExport: z.boolean(),
    programCorporateIncomeTax: z.boolean(),
    expectedRevenue: z.enum(["under_30k", "over_30k"], {
      message: "Select your expected gross revenue",
    }),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
  })
  .merge(billingSchema);

export type BusinessNumberSubmission = z.infer<typeof businessNumberSchema>;

// ── Extra-Provincial Registration ───────────────────────────────────────────
export const extraProvincialSchema = z
  .object({
    homeJurisdiction: z.enum(["federal", "ontario", "bc", "alberta", "quebec", "other"], {
      message: "Select your home jurisdiction",
    }),
    homeJurisdictionOther: z.string().trim().max(100).optional().or(z.literal("")),
    corpName: z.string().trim().min(1, "Required").max(200),
    corpNumber: z.string().trim().min(1, "Required").max(50),
    targetProvince: z.enum(
      ["ontario", "quebec", "bc", "alberta", "manitoba", "saskatchewan", "nb", "ns", "pei", "nl"],
      { message: "Select a target province" }
    ),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    corpRegisteredOffice: addressSchema,
    agentName: z.string().trim().min(1, "Required").max(200),
    agentAddress: addressSchema,
    contactEmail: z.string().trim().email("Valid email required").max(320),
    contactPhone: z.string().trim().min(7, "Required").max(30),
  })
  .merge(billingSchema);

export type ExtraProvincialSubmission = z.infer<typeof extraProvincialSchema>;

// ── Discriminated union for the API route ───────────────────────────────────
// The API accepts a `service` discriminator + a `payload` matching one of the
// per-service schemas. Each branch is validated separately so error messages
// align with the right field paths.
export const registrationRequestSchema = z.discriminatedUnion("service", [
  z.object({ service: z.literal("sole-prop-on"), payload: soleProprietorshipSchema }),
  z.object({ service: z.literal("business-name-on"), payload: businessNameRegistrationSchema }),
  z.object({ service: z.literal("business-number"), payload: businessNumberSchema }),
  z.object({ service: z.literal("extra-provincial"), payload: extraProvincialSchema }),
]);

export type RegistrationRequest = z.infer<typeof registrationRequestSchema>;
