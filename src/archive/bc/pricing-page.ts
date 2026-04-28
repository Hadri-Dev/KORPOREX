// Archived 2026-04-27 — original location: src/app/pricing/page.tsx
//
// BC pricing-page entries that were stripped when BC was removed. Restore by
// re-adding the literal `"bc"` to the page-local `Jurisdiction` union, the
// jurisdiction tab, and the BC pricing-card data.

// Tab entry that lived in the `jurisdictions` array.
export const archivedBcJurisdictionTab = {
  id: "bc",
  label: "British Columbia",
  subtitle: "BC Business Corporations Act",
};

// Pricing tier data for the `bc` key in `pricingData`.
export const archivedBcPricingTiers = [
  {
    name: "Basic",
    price: "$449",
    description: "Everything you need to get incorporated in British Columbia, including government fees.",
    features: [
      "Certificate and Articles of Incorporation",
      "BC Company registration number",
      "Corporate bylaws",
      "BC Business Registry filing",
      "Digital document delivery",
      "Digital document storage in your account",
    ],
  },
  {
    name: "Standard",
    price: "$649",
    description: "Complete incorporation package with your full corporate minute book.",
    features: [
      "Everything in Basic",
      "Corporate minute book",
      "Share certificates",
      "Organizational resolutions",
      "Banking resolution",
      "Post-filing support",
    ],
  },
  {
    name: "Premium",
    price: "$949",
    description: "Full-service incorporation with ongoing compliance support for year one.",
    features: [
      "Everything in Standard",
      "First annual report filing",
      "Priority 12-hour processing",
      "Dedicated account support",
      "Annual report reminder service",
    ],
  },
];

// Footnote that was rendered below the registered-office add-on card. It
// explained why the add-on was unavailable for BC.
export const archivedBcRegisteredOfficeFootnote =
  'Available for federal and Ontario incorporations. BC incorporations require a BC registered office — email contact@korporex.com for BC.';
