// Pricing constants and tax logic shared between the incorporation wizard UI
// (`src/app/incorporate/page.tsx`) and the intake API route
// (`src/app/api/incorporate/route.ts`).
//
// Server-side recalculation is what makes the emailed summary trustworthy —
// the API re-derives price/tax from the same constants rather than trusting
// anything the client sends.

export type Jurisdiction = "federal" | "ontario" | "bc";
export type Pkg = "basic" | "standard" | "premium";
export type RegOfficeAddon = "none" | "basic" | "premium";

// Registered office address add-on (annual prepay; price shown as monthly
// equivalent in UI). Only legally valid for Federal and Ontario incorporations
// — BC requires a BC registered office, so we gate the add-on out for BC.
//
// TODO(before-launch): Replace placeholder `address` fields below with the
// actual addresses we control. These strings appear in the filed Articles of
// Incorporation and on the customer's public corporate record — they must be
// real, current, and under our control.
export const REG_OFFICE_ADDON = {
  basic: {
    annual: 599.88, // 49.99 × 12
    monthly: 49.99,
    label: "Basic",
    locationLabel: "Ontario",
    address: {
      street: "100 Queen Street West",
      city: "Mississauga",
      region: "ON",
      postalCode: "L5B 2S4",
      country: "CA",
    },
  },
  premium: {
    annual: 1199.88, // 99.99 × 12
    monthly: 99.99,
    label: "Premium",
    locationLabel: "Toronto — Financial District",
    address: {
      street: "181 Bay Street, Suite 4400",
      city: "Toronto",
      region: "ON",
      postalCode: "M5J 2T3",
      country: "CA",
    },
  },
} as const;

export function regOfficeAddonAvailable(jurisdiction: Jurisdiction): boolean {
  // Our registered office service uses Ontario addresses; BC incorporations
  // must have a BC registered office by statute.
  return jurisdiction === "federal" || jurisdiction === "ontario";
}

export const PRICES: Record<Jurisdiction, Record<Pkg, number>> = {
  federal: { basic: 499, standard: 699, premium: 999 },
  ontario: { basic: 399, standard: 599, premium: 899 },
  bc: { basic: 449, standard: 649, premium: 949 },
};

// NUANS / name-search pass-through fee. Applies to federal and Ontario named
// corporations; BC uses a separate Name Approval process not billed here.
// Adjust when actual NUANS pass-through pricing is finalized.
export const NUANS_FEE = 45;

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
  bc: "British Columbia",
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
  const nuansFee = nuansApplies(args.jurisdiction, args.corpNameType) ? NUANS_FEE : 0;
  const addon = args.regOfficeAddon ?? "none";
  const regOfficeFee =
    addon !== "none" && regOfficeAddonAvailable(args.jurisdiction)
      ? REG_OFFICE_ADDON[addon].annual
      : 0;
  const subtotal = Math.round((price + nuansFee + regOfficeFee) * 100) / 100;
  const taxRate = getTaxRate(args.billingCountry, args.billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { price, nuansFee, regOfficeFee, subtotal, taxRate, tax, total };
}
