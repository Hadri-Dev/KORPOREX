// Archived 2026-04-27 — original location: src/lib/pricing.ts
//
// BC entries that were stripped from the pricing module when BC was removed
// from the live site. Restore by re-adding the literal `"bc"` to the
// `Jurisdiction` union and pasting these values into the matching maps.

import type { Jurisdiction, Pkg } from "../../lib/pricing";

// PRICES.bc — package prices for BC incorporation (CAD).
export const BC_PRICES: Record<Pkg, number> = {
  basic: 449,
  standard: 649,
  premium: 949,
};

// NUANS_FEES.bc — BC does not use NUANS; it has its own Name Request system
// that is handled inline (and priced separately as part of the package), so
// the per-jurisdiction NUANS fee for BC was 0.
export const BC_NUANS_FEE = 0;

// JURISDICTION_LABELS.bc
export const BC_JURISDICTION_LABEL = "British Columbia";

// regOfficeAddonAvailable() — the Korporex registered-office add-on is GTA-
// based and so was never available for BC (BC requires a BC registered
// office). When restoring BC, ensure the helper continues to exclude BC, e.g.:
//
//   export function regOfficeAddonAvailable(jurisdiction: Jurisdiction): boolean {
//     return jurisdiction === "federal" || jurisdiction === "ontario";
//   }
//
// (No change needed to the helper — but the comment above the helper that
// referenced BC was also stripped; restore the comment if useful.)

// Reference cast so this file fails to compile if `Jurisdiction` ever stops
// containing BC after a future restore. Remove this line after restoring.
const _bcAvailable: Jurisdiction = "bc" as Jurisdiction;
void _bcAvailable;
