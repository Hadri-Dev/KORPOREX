// Legal endings (legal elements) accepted by Canadian corporate registries.
// Required on every incorporation regardless of jurisdiction or whether the
// customer chose a named or numbered corporation. Appears at the end of the
// filed corporate name — e.g. "Acme Technologies INC." for a named federal
// corporation, or "1234567 Canada INC." for a numbered one.

import { z } from "zod";

export const LEGAL_ENDINGS = [
  "CORP.",
  "CORPORATION",
  "INC.",
  "INCORPORATED",
  "INCORPORÉE",
  "LIMITED",
  "LIMITÉE",
  "LTD.",
  "LTÉE",
] as const;

export type LegalEnding = (typeof LEGAL_ENDINGS)[number];

// Zod schema. The cast to a non-empty tuple is needed because z.enum's typing
// requires `[string, ...string[]]` rather than a generic readonly array.
export const legalEndingSchema = z.enum(
  LEGAL_ENDINGS as unknown as [LegalEnding, ...LegalEnding[]],
  { message: "Select a legal ending" }
);
