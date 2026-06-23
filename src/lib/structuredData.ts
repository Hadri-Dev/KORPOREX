import { SITE_URL } from "@/app/[locale]/guides/articles";

// ─── Shared organization identity ─────────────────────────────────────────────
// Korporex is a document-preparation / filing platform, NOT a law firm — the
// schema deliberately uses generic Organization, never LegalService, to avoid
// implying legal services (see CLAUDE.md content rules).

export const ORG_NAME = "Korporex Business Solutions Inc.";
export const ORG_SHORT = "Korporex";
export const OG_IMAGE_PATH = "/og-image.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

const SAME_AS = [
  "https://www.linkedin.com/company/korporex/",
  "https://x.com/korporex",
  "https://www.facebook.com/profile.php?id=61564594212222",
  "https://www.instagram.com/korporex/",
];

// Organization node — appears on the home page. Cross-references the logo,
// contact email, registered address, and verified social profiles so Google can
// build a consistent entity for the brand.
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG_NAME,
    alternateName: ORG_SHORT,
    url: SITE_URL,
    logo: OG_IMAGE_URL,
    image: OG_IMAGE_URL,
    description:
      "Korporex is an online business-incorporation and corporate-filing platform for Canadian entrepreneurs, handling federal (CBCA) and Ontario (OBCA) filings.",
    email: "contact@korporex.ca",
    address: {
      "@type": "PostalAddress",
      streetAddress: "901 Guelph Line",
      addressLocality: "Burlington",
      addressRegion: "ON",
      postalCode: "L7R 3N8",
      addressCountry: "CA",
    },
    areaServed: "CA",
    sameAs: SAME_AS,
  };
}

// WebSite node — names the site and its publisher for the home page.
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_SHORT,
    inLanguage: ["en-CA", "fr-CA", "es"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

// FAQPage node — powers FAQ rich results. `items` is the flattened {q,a} list.
export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// Article node for a guide. `author`/`publisher` resolve to the Organization.
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  inLanguage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    image: OG_IMAGE_URL,
    inLanguage: opts.inLanguage,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    author: { "@type": "Organization", name: ORG_SHORT, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: ORG_SHORT,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: OG_IMAGE_URL },
    },
  };
}

// BreadcrumbList — the trail shown in search results (Home › Guides › Article).
export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
