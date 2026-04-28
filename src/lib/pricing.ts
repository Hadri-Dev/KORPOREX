// Pricing constants and tax logic shared between the incorporation wizard UI
// (`src/app/incorporate/page.tsx`) and the intake API route
// (`src/app/api/incorporate/route.ts`).
//
// Server-side recalculation is what makes the emailed summary trustworthy —
// the API re-derives price/tax from the same constants rather than trusting
// anything the client sends.

// BC ("british columbia") was archived 2026-04-27 — see src/archive/bc/ for
// preserved code and the restore procedure. To restore, re-add `"bc"` to this
// union and follow the README in that folder.
export type Jurisdiction = "federal" | "ontario";
export type Pkg = "basic" | "standard" | "premium";
export type RegOfficeAddon = "none" | "korporex";

// Registered office address add-on. Single tier: Korporex provides a
// registered office address in the Greater Toronto Area, billed annually in
// advance. Annual fee is non-refundable, even if the customer obtains their
// own registered office address before the term ends.
//
// Available for all currently supported jurisdictions (Federal + Ontario).
//
// The actual street/city of the GTA address is selected by Korporex at the
// time of filing and is intentionally NOT advertised on the marketing or
// wizard surfaces — customers commit to "Greater Toronto Area, assigned by
// Korporex". The placeholder address values below are sentinel strings that
// flow into the wizard's `regOffice` fields when this add-on is selected, so
// the operator (cross-referencing the [PENDING]/[PAID] emails) knows the real
// address is to be filled in before the Articles of Incorporation are filed.
export const REG_OFFICE_ADDON = {
  annual: 1199.88, // 99.99 × 12
  monthly: 99.99,
  label: "Korporex Registered Office",
  locationLabel: "Greater Toronto Area",
  // Sentinel values — replaced with the real, Korporex-controlled address
  // before each customer's Articles of Incorporation are filed.
  address: {
    street: "Assigned by Korporex at filing",
    city: "Greater Toronto Area",
    region: "ON",
    postalCode: "TBD",
    country: "CA",
  },
} as const;

export function regOfficeAddonAvailable(jurisdiction: Jurisdiction): boolean {
  return jurisdiction === "federal" || jurisdiction === "ontario";
}

export const PRICES: Record<Jurisdiction, Record<Pkg, number>> = {
  federal: { basic: 499, standard: 699, premium: 999 },
  ontario: { basic: 399, standard: 599, premium: 899 },
};

// Lawyer consultation fee. Flat-rated 30-minute session with an independent
// lawyer from Korporex's referral network. HST is computed at 13% (Ontario)
// because the lawyer is Ontario-based — Canadian place-of-supply for legal
// services follows the lawyer's province.
export const LEGAL_CONSULT_FEE = 150;
export const LEGAL_CONSULT_TAX_RATE = 0.13;

export type LegalConsultPricing = {
  fee: number;
  tax: number;
  total: number;
};

export function getLegalConsultPricing(): LegalConsultPricing {
  const fee = LEGAL_CONSULT_FEE;
  const tax = Math.round(fee * LEGAL_CONSULT_TAX_RATE * 100) / 100;
  const total = Math.round((fee + tax) * 100) / 100;
  return { fee, tax, total };
}

// Name-search pass-through fees. Federal uses Corporations Canada's NUANS
// preliminary search; Ontario uses an Ontario-Biz-style name search. The two
// are billed at different rates reflecting the different government pass-
// through and handling costs.
export const NUANS_FEES: Record<Jurisdiction, number> = {
  federal: 20,
  ontario: 60,
};

export function getNuansFee(jurisdiction: Jurisdiction): number {
  return NUANS_FEES[jurisdiction] ?? 0;
}

// Canadian sales-tax rates (GST/HST only — PST registrations not currently held).
export const CA_TAX_RATES: Record<string, number> = {
  ON: 0.13,
  NB: 0.15,
  NS: 0.15,
  PE: 0.15,
  NL: 0.15,
  BC: 0.05,
  AB: 0.05,
  MB: 0.05,
  SK: 0.05,
  NT: 0.05,
  YT: 0.05,
  NU: 0.05,
  QC: 0.14975,
};

export function getTaxRate(country: string, region: string): number {
  if (country !== "CA") return 0;
  return CA_TAX_RATES[region] ?? 0;
}

export const JURISDICTION_LABELS: Record<Jurisdiction, string> = {
  federal: "Federal (Canada)",
  ontario: "Ontario",
};

export const PKG_LABELS: Record<Pkg, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

export function nuansApplies(jurisdiction: Jurisdiction, corpNameType: "named" | "numbered"): boolean {
  return (jurisdiction === "federal" || jurisdiction === "ontario") && corpNameType === "named";
}

export type PriceBreakdown = {
  price: number;
  nuansFee: number;
  regOfficeFee: number;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
};

export function computePricing(args: {
  jurisdiction: Jurisdiction;
  pkg: Pkg;
  corpNameType: "named" | "numbered";
  billingCountry: string;
  billingRegion: string;
  regOfficeAddon?: RegOfficeAddon;
}): PriceBreakdown {
  const price = PRICES[args.jurisdiction][args.pkg];
  const nuansFee = nuansApplies(args.jurisdiction, args.corpNameType)
    ? getNuansFee(args.jurisdiction)
    : 0;
  const addon = args.regOfficeAddon ?? "none";
  const regOfficeFee =
    addon === "korporex" && regOfficeAddonAvailable(args.jurisdiction)
      ? REG_OFFICE_ADDON.annual
      : 0;
  const subtotal = Math.round((price + nuansFee + regOfficeFee) * 100) / 100;
  const taxRate = getTaxRate(args.billingCountry, args.billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { price, nuansFee, regOfficeFee, subtotal, taxRate, tax, total };
}
