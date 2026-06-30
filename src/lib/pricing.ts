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
// Registered office add-on selection. "korporex" = a Downtown Toronto address
// (assigned by Korporex at filing); "burlington" = a fixed real Burlington
// address. Neither street is advertised to the customer — both surfaces show
// city/area only. The value "korporex" is kept (rather than renamed to
// "toronto") for backward compatibility with Stripe session metadata on orders
// placed before the Burlington tier was added.
export type RegOfficeAddon = "none" | "korporex" | "burlington";
export type RegOfficeLocation = Exclude<RegOfficeAddon, "none">;

// Registered office address add-on. Korporex provides a registered office
// address, billed annually in advance. The annual fee is non-refundable, even
// if the customer obtains their own registered office address before the term
// ends. Available for all currently supported jurisdictions (Federal + Ontario).
//
// The specific street address is NEVER advertised to the customer for either
// location — the wizard, /order page, and Stripe line item all describe the
// service by city/area only ("Downtown Toronto" / "Burlington"). The two
// tiers differ only operationally, captured by `addressAssignedAtFiling`:
//  - korporex (GTA): the street is selected by Korporex at filing time. The
//    stored `address` is a sentinel that flows into the wizard's `regOffice`
//    fields so the operator (cross-referencing the [PENDING]/[PAID] emails)
//    knows to fill in a real address before the Articles are filed.
//  - burlington: a fixed, real address (901 Guelph Line) — already on file, so
//    it flows straight onto the Articles with no operator action. It is simply
//    not shown to the customer (city only), same as the GTA tier.
export type RegOfficeOption = {
  monthly: number;
  annual: number;
  label: string;
  locationLabel: string;
  // True when the stored `address` is a placeholder the operator must replace
  // before filing (GTA tier); false when it is a fixed real address (Burlington).
  // Customer-facing surfaces show city only regardless of this flag.
  addressAssignedAtFiling: boolean;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
};

export const REG_OFFICE_OPTIONS: Record<RegOfficeLocation, RegOfficeOption> = {
  korporex: {
    annual: 1199.88, // 99.99 × 12
    monthly: 99.99,
    label: "Korporex Registered Office",
    locationLabel: "Downtown Toronto",
    addressAssignedAtFiling: true,
    // Sentinel values — replaced with the real, Korporex-controlled address
    // before each customer's Articles of Incorporation are filed.
    address: {
      street: "Assigned by Korporex at filing",
      city: "Downtown Toronto",
      region: "ON",
      postalCode: "TBD",
      country: "CA",
    },
  },
  burlington: {
    annual: 599.88, // 49.99 × 12
    monthly: 49.99,
    label: "Korporex Registered Office",
    locationLabel: "Burlington",
    addressAssignedAtFiling: false,
    // Real, fixed address (flows onto the Articles). Not advertised to the
    // customer — the wizard shows "Burlington" only.
    address: {
      street: "901 Guelph Line",
      city: "Burlington",
      region: "ON",
      postalCode: "L7R 3N8",
      country: "CA",
    },
  },
};

// Back-compat alias: the original single-tier export pointed at the GTA option.
// Surfaces that still reference only the Toronto tier (e.g. the legacy default)
// keep working through this alias.
export const REG_OFFICE_ADDON = REG_OFFICE_OPTIONS.korporex;

export function regOfficeAddonAvailable(jurisdiction: Jurisdiction): boolean {
  return jurisdiction === "federal" || jurisdiction === "ontario";
}

export const PRICES: Record<Jurisdiction, Record<Pkg, number>> = {
  federal: { basic: 749, standard: 1049, premium: 1349 },
  ontario: { basic: 599, standard: 899, premium: 1199 },
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

// NUANS is bundled into Standard and Premium packages (the feature list says
// "NUANS included"). Basic is numbered-only via the wizard, so the named
// branch effectively never fires for Basic either. The fee-applies check
// therefore only ever returns true if someone bypasses the wizard and sends
// a (pkg=basic, corpNameType=named) combination via the API — kept as a
// defensive fallback rather than because it's a customer-reachable path.
export function nuansApplies(
  jurisdiction: Jurisdiction,
  corpNameType: "named" | "numbered",
  pkg: Pkg
): boolean {
  if (pkg !== "basic") return false;
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
  const nuansFee = nuansApplies(args.jurisdiction, args.corpNameType, args.pkg)
    ? getNuansFee(args.jurisdiction)
    : 0;
  const addon = args.regOfficeAddon ?? "none";
  const regOfficeFee =
    addon !== "none" && regOfficeAddonAvailable(args.jurisdiction)
      ? REG_OFFICE_OPTIONS[addon].annual
      : 0;
  const subtotal = Math.round((price + nuansFee + regOfficeFee) * 100) / 100;
  const taxRate = getTaxRate(args.billingCountry, args.billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { price, nuansFee, regOfficeFee, subtotal, taxRate, tax, total };
}
