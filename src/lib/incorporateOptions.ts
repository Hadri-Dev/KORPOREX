// Structured choices added to the incorporation wizard that both the client
// (IncorporateBody) and the API route need to agree on. Kept here so the Zod
// enums and the human-readable labels have exactly one source.

import { z } from "zod";

// ─── Authorized signing officers ─────────────────────────────────────────────
// Who may sign contracts, instruments and documents on behalf of the
// corporation. Recorded in the organizational resolutions.

export const SIGNING_AUTHORITY_OPTIONS = [
  { value: "all_directors", label: "All of the directors" },
  { value: "any_director_or_officer", label: "Any director or officer" },
  { value: "president_alone", label: "President alone" },
] as const;

export type SigningAuthority = (typeof SIGNING_AUTHORITY_OPTIONS)[number]["value"];

export const signingAuthoritySchema = z.enum(
  SIGNING_AUTHORITY_OPTIONS.map((o) => o.value) as unknown as [SigningAuthority, ...SigningAuthority[]],
  { message: "Select who may sign for the corporation" }
);

// ─── Banking signing authority ───────────────────────────────────────────────
// Who may sign cheques and operate the corporation's bank accounts. Banks ask
// for this when the account is opened; it comes from the banking resolution.

export const BANKING_AUTHORITY_OPTIONS = [
  { value: "president_alone", label: "President alone" },
  { value: "president_and_secretary", label: "President and Secretary together" },
  { value: "president_and_director", label: "President and a Director together" },
] as const;

export type BankingAuthority = (typeof BANKING_AUTHORITY_OPTIONS)[number]["value"];

export const bankingAuthoritySchema = z.enum(
  BANKING_AUTHORITY_OPTIONS.map((o) => o.value) as unknown as [BankingAuthority, ...BankingAuthority[]],
  { message: "Select who may sign on the bank account" }
);

// ─── Number of directors ─────────────────────────────────────────────────────
// The Articles either fix the number of directors or set a minimum/maximum
// range. Both CBCA and OBCA allow either form.

export type DirectorCountType = "fixed" | "range";

export const directorCountTypeSchema = z.enum(["fixed", "range"], {
  message: "Select how the number of directors is set",
});

export function signingAuthorityLabel(v: string): string {
  return SIGNING_AUTHORITY_OPTIONS.find((o) => o.value === v)?.label ?? v;
}

export function bankingAuthorityLabel(v: string): string {
  return BANKING_AUTHORITY_OPTIONS.find((o) => o.value === v)?.label ?? v;
}
