// Corporate-restructuring filings — the fourth and final service family
// alongside registrations / amendments / compliance. Each entry drives one
// dedicated wizard. Pricing is recomputed server-side from these constants in
// /api/business-update-request — never trust totals sent from the client.

export type BusinessUpdateServiceSlug =
  | "dissolve-business"
  | "revive-business"
  | "amalgamation"
  | "continuance"
  | "initial-minute-book";

export type BusinessUpdateService = {
  slug: BusinessUpdateServiceSlug;
  label: string;
  longLabel: string;
  price: number;
  /** Short pitch shown on the services listing tile. */
  tagline: string;
  /** One-paragraph description shown on the wizard's hero. */
  description: string;
  /** Path under /services/. */
  path: string;
};

export const BUSINESS_UPDATE_SERVICES: Record<BusinessUpdateServiceSlug, BusinessUpdateService> = {
  "dissolve-business": {
    slug: "dissolve-business",
    label: "Dissolve a Business",
    longLabel: "Voluntary Dissolution",
    price: 199,
    tagline: "Voluntarily dissolve your corporation with the appropriate registry.",
    description:
      "File Articles of Dissolution to formally wind up your corporation. Required when the corporation has ceased operations or never commenced business. Korporex prepares and files the dissolution on your behalf; you confirm that debts have been settled and assets distributed.",
    path: "/services/dissolve-business",
  },
  "revive-business": {
    slug: "revive-business",
    label: "Revive a Business",
    longLabel: "Articles of Revival",
    price: 249,
    tagline: "Bring a dissolved corporation back into existence.",
    description:
      "File Articles of Revival to restore a corporation that was dissolved (voluntarily or by the registrar for default) back to active status. Revival restores the corporation's legal personality and the right to carry on business.",
    path: "/services/revive-business",
  },
  "amalgamation": {
    slug: "amalgamation",
    label: "Amalgamation",
    longLabel: "Articles of Amalgamation",
    price: 499,
    tagline: "Combine two or more corporations into a single amalgamated entity.",
    description:
      "File Articles of Amalgamation to merge two or more corporations into one continuing entity. Supports long-form (separate corporations with an amalgamation agreement) and short-form (parent-subsidiary or sister-corporation) amalgamations.",
    path: "/services/amalgamation",
  },
  "continuance": {
    slug: "continuance",
    label: "Continuance Between Jurisdictions",
    longLabel: "Articles of Continuance (Import / Export)",
    price: 349,
    tagline: "Move your corporation from one jurisdiction to another (e.g. Ontario to Federal).",
    description:
      "File Articles of Continuance to move your corporation from its home jurisdiction to a new one (e.g. continue an Ontario corporation as a CBCA corporation, or vice versa). Requires authorization from both the departing and the receiving registry.",
    path: "/services/continuance",
  },
  "initial-minute-book": {
    slug: "initial-minute-book",
    label: "Initial Minute Book",
    longLabel: "Initial Corporate Minute Book",
    price: 399,
    tagline: "Complete digital minute book for a corporation that incorporated without one.",
    description:
      "Both the CBCA and the OBCA require every corporation to maintain corporate records: by-laws, organizational resolutions, share certificates, and the registers of directors, officers, and shareholders. If you incorporated on your own and never organized the corporation, Korporex prepares a complete digital minute book ready for signature.",
    path: "/services/initial-minute-book",
  },
};

export const BUSINESS_UPDATE_SLUGS = Object.keys(BUSINESS_UPDATE_SERVICES) as BusinessUpdateServiceSlug[];

export function isBusinessUpdateSlug(s: string): s is BusinessUpdateServiceSlug {
  return s in BUSINESS_UPDATE_SERVICES;
}

// ── Initial Minute Book pricing ─────────────────────────────────────────────
// The $399 base price covers 1 class of shares, 1 shareholder, 1 director,
// and 1 officer. Each additional item bills at the per-unit rates below.
// Shared by the wizard's live order summary and the API route's server-side
// recomputation, so the two can never drift.

export const MINUTE_BOOK_PRICING = {
  extraShareClass: 75,
  extraShareholder: 50,
  extraDirector: 50,
  extraOfficer: 50,
} as const;

export type MinuteBookCounts = {
  shareClasses: number;
  shareholders: number;
  directors: number;
  officers: number;
};

export function computeMinuteBookSubtotal(counts: MinuteBookCounts): number {
  const extra = (n: number) => Math.max(0, n - 1);
  return (
    BUSINESS_UPDATE_SERVICES["initial-minute-book"].price +
    extra(counts.shareClasses) * MINUTE_BOOK_PRICING.extraShareClass +
    extra(counts.shareholders) * MINUTE_BOOK_PRICING.extraShareholder +
    extra(counts.directors) * MINUTE_BOOK_PRICING.extraDirector +
    extra(counts.officers) * MINUTE_BOOK_PRICING.extraOfficer
  );
}
