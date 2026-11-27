import { z } from "zod";
import { isKnownTaxRegion } from "./pricing";

// Shared sub-schemas
export const addressSchema = z.object({
  street: z.string().trim().min(1, "Required").max(200),
  city: z.string().trim().min(1, "Required").max(100),
  region: z.string().trim().min(1, "Required").max(100),
  postalCode: z.string().trim().min(3, "Required").max(12),
  country: z.string().trim().min(2, "Required").max(60),
});

export const billingAddressSchema = addressSchema.refine(
  (a) => isKnownTaxRegion(a.country, a.region),
  { message: "Select a Canadian province or territory", path: ["region"] }
);

export const billingSchema = z.object({
  billingName: z.string().trim().min(1, "Required").max(200),
  billingAddress: billingAddressSchema,
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
// Ontario is the only target province offered, so an Ontario corporation is not
// a valid home jurisdiction here.
// Blank until answered. An empty string (not undefined) keeps the object-level
// checks below running while the customer is still on an earlier wizard step:
// Zod skips superRefine when a field fails with a type-level error.
const yesNoSchema = z.enum(["yes", "no", ""]);

// Validated in superRefine: only required when the corporation has an Ontario
// chief officer or manager.
const optionalAddressSchema = z.object({
  street: z.string().trim().max(200),
  city: z.string().trim().max(100),
  region: z.string().trim().max(100),
  postalCode: z.string().trim().max(12),
  country: z.string().trim().max(60),
});

export const extraProvincialSchema = z
  .object({
    homeJurisdiction: z.enum(["federal", "bc", "alberta", "quebec", "other"], {
      message: "Select your home jurisdiction",
    }),
    homeJurisdictionOther: z.string().trim().max(100).optional().or(z.literal("")),
    corpName: z.string().trim().min(1, "Required").max(200),
    corpNumber: z.string().trim().min(1, "Required").max(50),
    incorporationDate: z.string().trim().min(8, "Required").max(20),
    // The Ontario registry accepts a NAICS code at any level from sector
    // (2 digits) to national industry (6 digits).
    naicsCode: z.string().trim().regex(/^\d{2,6}$/, "Enter a NAICS code of 2 to 6 digits"),
    targetProvince: z.literal("ontario"),
    effectiveDate: z.string().trim().min(8, "Required").max(20),
    corpRegisteredOffice: addressSchema,
    agentName: z.string().trim().min(1, "Required").max(200),
    agentAddress: addressSchema,
    hasOntarioOfficer: yesNoSchema,
    officerFirstName: z.string().trim().max(100).optional().or(z.literal("")),
    officerLastName: z.string().trim().max(100).optional().or(z.literal("")),
    officerAddress: optionalAddressSchema,
    contactEmail: z.string().trim().email("Valid email required").max(320),
    contactPhone: z.string().trim().min(7, "Required").max(30),
    // Both must be true; enforced in superRefine so an unchecked box does not
    // stop the other object-level checks from running.
    certifiedAccurate: z.boolean(),
    authorizedToFile: z.boolean(),
  })
  .merge(billingSchema)
  .superRefine((data, ctx) => {
    const require = (path: (string | number)[], message = "Required") =>
      ctx.addIssue({ path, code: z.ZodIssueCode.custom, message });

    if (data.homeJurisdiction === "other" && !data.homeJurisdictionOther) {
      require(["homeJurisdictionOther"]);
    }
    // ISO dates compare correctly as strings.
    if (data.incorporationDate > new Date().toISOString().slice(0, 10)) {
      require(["incorporationDate"], "Date cannot be in the future");
    }
    if (data.hasOntarioOfficer === "") {
      require(["hasOntarioOfficer"], "Select yes or no");
    } else if (data.hasOntarioOfficer === "yes") {
      if (!data.officerFirstName) require(["officerFirstName"]);
      if (!data.officerLastName) require(["officerLastName"]);
      const a = data.officerAddress;
      if (!a.street) require(["officerAddress", "street"]);
      if (!a.city) require(["officerAddress", "city"]);
      if (a.region !== "ON") require(["officerAddress", "region"], "Address must be in Ontario");
      if (a.postalCode.length < 3) require(["officerAddress", "postalCode"]);
    }
    if (!data.certifiedAccurate) require(["certifiedAccurate"]);
    if (!data.authorizedToFile) require(["authorizedToFile"]);
  });

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
