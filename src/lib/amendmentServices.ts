// Post-incorporation amendment services. Parallel to registrationServices.ts
// but covers ongoing changes (director/officer turnover, share transfers,
// registered-office moves, Articles amendments) rather than initial setup.
//
// Each service applies to either Federal (CBCA) or Ontario (OBCA) corporations;
// the per-jurisdiction differences are encoded in the wizard / schema, not here.
// Pricing is recomputed server-side from these constants in
// /api/amendment-request — never trust totals sent from the client.

export type AmendmentServiceSlug =
  | "change-director"
  | "change-shareholder"
  | "change-address"
  | "articles-amendment";

export type AmendmentService = {
  slug: AmendmentServiceSlug;
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

export const AMENDMENT_SERVICES: Record<AmendmentServiceSlug, AmendmentService> = {
  "change-director": {
    slug: "change-director",
    label: "Change of Director / Officer",
    longLabel: "Change of Director / Officer",
    price: 149,
    tagline: "Add, remove, or update a director or officer of your corporation.",
    description:
      "File a Notice of Change with the appropriate registry to add a new director or officer, record a resignation, or update existing details. Required by both federal and Ontario law within 15 days of the change.",
    path: "/services/change-director",
  },
  "change-shareholder": {
    slug: "change-shareholder",
    label: "Change of Shareholder",
    longLabel: "Change of Shareholder",
    price: 149,
    tagline: "Record a share transfer or new issuance in your corporate records.",
    description:
      "Update your corporation's shareholder register and issue a new share certificate when shares are transferred, redeemed, or newly issued. This is an internal corporate-records update, not a government filing.",
    path: "/services/change-shareholder",
  },
  "change-address": {
    slug: "change-address",
    label: "Corporation Address Change",
    longLabel: "Corporation Address Change",
    price: 99,
    tagline: "Change your corporation's registered office address.",
    description:
      "File the appropriate Notice of Change to move your corporation's registered office address. Required to be filed with the registry within 15 days of the change.",
    path: "/services/change-address",
  },
  "articles-amendment": {
    slug: "articles-amendment",
    label: "Articles of Amendment",
    longLabel: "Articles of Amendment",
    price: 199,
    tagline: "Amend the Articles of your corporation.",
    description:
      "File Articles of Amendment to change your corporation's legal name, share structure, restrictions, number of directors, or other matters set out in the original Articles of Incorporation.",
    path: "/services/articles-amendment",
  },
};

export const AMENDMENT_SLUGS = Object.keys(AMENDMENT_SERVICES) as AmendmentServiceSlug[];

export function isAmendmentSlug(s: string): s is AmendmentServiceSlug {
  return s in AMENDMENT_SERVICES;
}
