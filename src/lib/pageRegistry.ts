// Static registry of all customer-facing pages on korporex.ca. Used by Link
// Health (Page Analysis tab) to compute orphan pages and inbound/outbound
// link counts, and as the dropdown of valid target pages for internal-link
// keywords.
//
// Populate by hand for now. When/if the site grows we can derive this from
// the Next.js route tree at build time.

export type PageType = "money" | "service" | "resource" | "legal" | "marketing" | "other";

export interface RegistryPage {
  path: string;            // canonical path, no locale prefix
  title: string;
  type: PageType;
}

export const PAGE_REGISTRY: RegistryPage[] = [
  // Money pages — the high-value destinations the linking engine should bias toward
  { path: "/", title: "Home", type: "marketing" },
  { path: "/incorporate", title: "Incorporate (overview)", type: "money" },
  { path: "/incorporate?jurisdiction=federal", title: "Federal incorporation", type: "money" },
  { path: "/incorporate?jurisdiction=ontario", title: "Ontario incorporation", type: "money" },
  { path: "/pricing", title: "Pricing", type: "money" },
  { path: "/services", title: "Services", type: "service" },
  { path: "/legal-consultation", title: "Talk to a Lawyer", type: "service" },
  // Resources
  { path: "/resources", title: "Resources (index)", type: "resource" },
  { path: "/resources/federal-vs-provincial-incorporation", title: "Federal vs provincial incorporation", type: "resource" },
  { path: "/resources/what-is-nuans-name-search", title: "What is a NUANS name search", type: "resource" },
  { path: "/resources/corporate-annual-returns-canada", title: "Corporate annual returns in Canada", type: "resource" },
  // Legal / static
  { path: "/about", title: "About", type: "marketing" },
  { path: "/contact", title: "Contact", type: "marketing" },
  { path: "/faq", title: "FAQ", type: "marketing" },
  { path: "/terms", title: "Terms of Service", type: "legal" },
  { path: "/privacy", title: "Privacy Policy", type: "legal" },
];

export const PAGE_TYPE_LABELS: Record<PageType, string> = {
  money: "Money page",
  service: "Service",
  resource: "Resource",
  legal: "Legal",
  marketing: "Marketing",
  other: "Other",
};
