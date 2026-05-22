// Registration services offered alongside incorporation. Each entry drives both
// the marketing surface (services page) and the per-service wizard. Pricing is
// recomputed server-side from these constants in /api/service-request — never
// trust totals sent from the client.

export type RegistrationServiceSlug =
  | "sole-prop-on"
  | "business-name-on"
  | "business-number"
  | "extra-provincial";

export type RegistrationService = {
  slug: RegistrationServiceSlug;
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

export const REGISTRATION_SERVICES: Record<RegistrationServiceSlug, RegistrationService> = {
  "sole-prop-on": {
    slug: "sole-prop-on",
    label: "Sole Proprietorship Registration",
    longLabel: "Sole Proprietorship Registration — Ontario",
    price: 99,
    tagline: "Register a sole proprietorship in Ontario.",
    description:
      "Register your sole proprietorship and business name with the Ontario Business Registry. Required if you're operating under any name other than your own legal name.",
    path: "/services/sole-proprietorship",
  },
  "business-name-on": {
    slug: "business-name-on",
    label: "Business Name Registration",
    longLabel: "Business Name Registration — Ontario",
    price: 79,
    tagline: "Register a trade name (DBA) in Ontario.",
    description:
      "Register a business (trade) name with the Ontario Business Registry, either as an individual operator or for an existing corporation that wants to operate under an additional name.",
    path: "/services/business-name",
  },
  "business-number": {
    slug: "business-number",
    label: "Business Number Registration",
    longLabel: "Business Number Registration — CRA",
    price: 99,
    tagline: "Register your business with the CRA for a 9-digit Business Number.",
    description:
      "Register with the Canada Revenue Agency for a 9-digit Business Number (BN), with optional GST/HST, payroll, and import/export program accounts.",
    path: "/services/business-number",
  },
  "extra-provincial": {
    slug: "extra-provincial",
    label: "Extra-Provincial Registration",
    longLabel: "Extra-Provincial Registration",
    price: 199,
    tagline: "Register your existing corporation in another province.",
    description:
      "Register your corporation to legally operate in another Canadian province while keeping its home-jurisdiction incorporation.",
    path: "/services/extra-provincial",
  },
};

export const REGISTRATION_SLUGS = Object.keys(REGISTRATION_SERVICES) as RegistrationServiceSlug[];

export function isRegistrationSlug(s: string): s is RegistrationServiceSlug {
  return s in REGISTRATION_SERVICES;
}
