// Government filing fees for Canadian incorporation, used by the
// /tools/incorporation-cost calculator.
//
// This file is the point of the calculator. Korporex's own prices live in
// pricing.ts and nobody links to a vendor's price list — what other sites cite
// is a maintained, sourced table of what the *government* charges. So every
// number here carries the official page it came from and the date it was last
// checked against that page.
//
// RULES FOR EDITING
//  1. Never add a jurisdiction whose fees have not been read off an official
//     government page. A wrong number on the one page whose value is being
//     citable is worse than a page that covers less ground.
//  2. When you verify a fee, update `lastVerified` even if the amount did not
//     change — the date is what tells a reader the table is maintained.
//  3. Amounts are CAD, exclusive of tax. Government filing fees are not
//     subject to GST/HST; only the service fee charged on top of them is.

export type JurisdictionCode = "federal" | "ontario";

export type GovFee = {
  /** What the government calls the filing. */
  label: string;
  /** CAD, tax-exclusive. `null` means the government charges nothing. */
  amount: number | null;
  /** Shown under the amount — turnaround, conditions, or what is bundled in. */
  note?: string;
};

export type GovJurisdiction = {
  code: JurisdictionCode;
  name: string;
  /** The statute the incorporation is filed under. */
  statute: string;
  registry: string;
  /** Official page the fees below were read from. Rendered as the citation. */
  sourceUrl: string;
  sourceLabel: string;
  /** ISO date the fees were last checked against `sourceUrl`. */
  lastVerified: string;
  incorporation: GovFee;
  /** Optional paid expedite on top of the incorporation fee. */
  express?: GovFee;
  nameSearch: GovFee;
  annualReturn: GovFee;
  /** Ontario's Initial Return has no federal equivalent, hence optional. */
  initialReturn?: GovFee;
  amendment?: GovFee;
};

export const GOV_FEES: Record<JurisdictionCode, GovJurisdiction> = {
  federal: {
    code: "federal",
    name: "Federal (Canada)",
    statute: "Canada Business Corporations Act (CBCA)",
    registry: "Corporations Canada",
    sourceUrl:
      "https://ised-isde.canada.ca/site/corporations-canada/en/services-fees-and-processing-times",
    sourceLabel: "Corporations Canada — Services, fees and processing times",
    lastVerified: "2026-08-02",
    incorporation: {
      label: "Articles of Incorporation",
      amount: 200,
      note: "Filed online. One business day standard processing.",
    },
    express: {
      label: "Express service",
      amount: 100,
      note: "Optional. Reduces processing to four business hours.",
    },
    nameSearch: {
      label: "Name search (NUANS)",
      amount: null,
      note: "No separate NUANS report is required to incorporate online with a word name — the corporate name search is now part of the federal incorporation process.",
    },
    annualReturn: {
      label: "Annual return",
      amount: 12,
      note: "Filed online, every year. Separate from your corporate tax return.",
    },
    amendment: {
      label: "Articles of Amendment",
      amount: 200,
      note: "Filed online. Some amendments, such as adding an English or French version of the name, are free.",
    },
  },

  ontario: {
    code: "ontario",
    name: "Ontario",
    statute: "Business Corporations Act (OBCA)",
    registry: "Ontario Business Registry",
    sourceUrl:
      "https://www.ontario.ca/page/cost-time-required-to-register-change-search-for-business-name-corporation-not-for-profit",
    sourceLabel: "Ontario.ca — Cost and time required to register, change or search",
    lastVerified: "2026-08-02",
    incorporation: {
      label: "Articles of Incorporation",
      amount: 300,
      note: "Immediate when filed online; about 15 business days by mail. Same fee either way.",
    },
    nameSearch: {
      label: "Ontario name search (NUANS)",
      amount: 60,
      note: "Required for a named corporation. ServiceOntario does not sell the report itself — it comes from a private search house, which is why the fee is not on the government fee schedule. $60 is what Korporex charges for it.",
    },
    annualReturn: {
      label: "Annual return (Corporations Information Act)",
      amount: null,
      note: "No government fee. Still mandatory — a corporation can be dissolved for failing to file.",
    },
    initialReturn: {
      label: "Initial Return",
      amount: null,
      note: "No government fee. Due within 60 days of incorporation.",
    },
  },
};

export const GOV_JURISDICTIONS: GovJurisdiction[] = [
  GOV_FEES.federal,
  GOV_FEES.ontario,
];

/**
 * Minimum unavoidable government cost to get a corporation registered —
 * incorporation plus, for a named corporation, the required name search.
 * Excludes express service and post-incorporation filings.
 */
export function minimumGovernmentCost(
  code: JurisdictionCode,
  corpNameType: "named" | "numbered",
): number {
  const j = GOV_FEES[code];
  const incorporation = j.incorporation.amount ?? 0;
  const search = corpNameType === "named" ? j.nameSearch.amount ?? 0 : 0;
  return incorporation + search;
}

/** Most recent `lastVerified` across all jurisdictions — the page's freshness stamp. */
export function feesLastVerified(): string {
  return GOV_JURISDICTIONS.map((j) => j.lastVerified).sort().reverse()[0];
}
