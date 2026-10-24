import { z } from "zod";
import { isIsoDate } from "@/lib/officeRenewalLogic";

// Shared request shapes for the admin Office Renewals API.

const isoDate = z.string().refine(isIsoDate, "Use YYYY-MM-DD");
const optionalText = z
  .string()
  .trim()
  .max(2000)
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const CLIENT_FIELDS = z.object({
  businessName: z.string().trim().min(1).max(300),
  email: z.string().trim().email().max(320),
  contactName: optionalText,
  corpNumber: optionalText,
  location: z.enum(["korporex", "burlington"]),
  startedOn: isoDate,
  renewsOn: isoDate,
  billingRegion: optionalText,
  locale: z.enum(["en", "fr", "es"]).optional(),
  notes: optionalText,
});

export const CLIENT_PATCH = CLIENT_FIELDS.partial().extend({
  status: z.enum(["active", "paused", "moving", "closed"]).optional(),
});

export const SETTINGS_PATCH = z.object({
  d60: z.boolean().optional(),
  d30: z.boolean().optional(),
  d7: z.boolean().optional(),
  finalNotice: z.boolean().optional(),
  bccOwner: z.boolean().optional(),
  mondayDigest: z.boolean().optional(),
});
