// Constants, types, and shared schemas for the lawyer-consultation flow.
//
// The consultation is provided by an INDEPENDENT licensed lawyer from
// Korporex's referral network (currently Hadri Law). Korporex is not a law
// firm and does not provide legal advice — see the disclaimers on
// `/legal-consultation`. Korporex's role is referral facilitation only.

import { z } from "zod";

// File-upload limits. Brevo's transactional email API caps attachments at
// roughly 10 MB total (after base64 encoding inflates the payload by ~33%),
// so we keep raw upload at 5 MB total across up to 3 files.
export const LEGAL_CONSULT_MAX_FILES = 3;
export const LEGAL_CONSULT_MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB total raw
export const LEGAL_CONSULT_ACCEPTED_MIMES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

// Topic categories — multi-select on the questionnaire so the lawyer can
// see at a glance what subject area to prepare for. "Other" gets a free-text
// follow-up.
export const LEGAL_CONSULT_TOPICS = [
  "Incorporation strategy (jurisdiction, entity type)",
  "Articles of Incorporation / amendments",
  "Shareholder agreements",
  "Director or officer responsibilities",
  "Corporate minute book / record-keeping",
  "Annual returns / compliance",
  "Restructuring or dissolution",
  "Corporate tax structuring",
  "Cross-border or international shareholders",
  "Other (describe below)",
] as const;
export type LegalConsultTopic = (typeof LEGAL_CONSULT_TOPICS)[number];

export const LEGAL_CONSULT_INCORP_STATUS = [
  "Already incorporated",
  "Planning to incorporate",
  "Not sure yet",
] as const;
export type LegalConsultIncorpStatus = (typeof LEGAL_CONSULT_INCORP_STATUS)[number];

// Shared questionnaire schema, used by both the wizard form (client) and
// the API route (server) so the validation rules don't drift.
export const legalConsultSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(40),
  incorpStatus: z.enum(
    LEGAL_CONSULT_INCORP_STATUS as unknown as [LegalConsultIncorpStatus, ...LegalConsultIncorpStatus[]]
  ),
  // Only meaningful when `incorpStatus === "Already incorporated"`. Both
  // optional at the schema level — the UI conditions visibility on status.
  existingCorpName: z.string().trim().max(200).optional().or(z.literal("")),
  existingJurisdiction: z.string().trim().max(80).optional().or(z.literal("")),
  incorpThroughKorporex: z.boolean(),
  topics: z
    .array(
      z.enum(
        LEGAL_CONSULT_TOPICS as unknown as [LegalConsultTopic, ...LegalConsultTopic[]]
      )
    )
    .min(1, "Pick at least one topic"),
  description: z.string().trim().min(20, "Please describe your situation in a sentence or two").max(2000),
  isUrgent: z.boolean(),
  willShareDocuments: z.boolean(),
  additionalNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  // Calendly slot details posted from the embed's `event_scheduled` payload.
  // The customer cannot proceed to checkout without these set.
  calendlyEventUri: z.string().trim().min(1, "Pick a slot first").max(500),
  calendlyInviteeUri: z.string().trim().min(1).max(500),
  calendlyStartTime: z.string().trim().min(1).max(60),
});

export type LegalConsultInput = z.infer<typeof legalConsultSchema>;

// Calendly inline-embed URL. Hadri Law's dedicated Korporex consultation
// event. The `NEXT_PUBLIC_CALENDLY_LAWYER_URL` env var still overrides this
// at build time if it's ever set on Vercel — useful for swapping to a
// different referral lawyer or test event later without a code change.
export const CALENDLY_LAWYER_URL =
  process.env.NEXT_PUBLIC_CALENDLY_LAWYER_URL ??
  "https://calendly.com/hadrilaw/consultation-korporex";

// Recipient list for the [PENDING] / [PAID] consultation emails. The
// trusted-network lawyer is currently Hadri Law (`contact@hadrilaw.com`);
// Korporex's `contact@korporex.com` is also CC'd for operational visibility.
export const LEGAL_CONSULT_RECIPIENTS = [
  { email: "contact@korporex.com", name: "Korporex" },
  { email: "contact@hadrilaw.com", name: "Hadri Law" },
] as const;
