import { SITE_URL } from "@/app/[locale]/guides/articles";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { breadcrumbSchema } from "@/lib/structuredData";

type ServiceMeta = { longLabel: string; description: string; price: number; path: string };

// Every order-form service, keyed by its page path.
const BY_PATH: Record<string, ServiceMeta> = Object.fromEntries(
  [
    ...Object.values(AMENDMENT_SERVICES),
    ...Object.values(BUSINESS_UPDATE_SERVICES),
    ...Object.values(COMPLIANCE_SERVICES),
    ...Object.values(REGISTRATION_SERVICES),
  ].map((s) => [s.path, s]),
);

// Localized name/description/URL for a fr/es page whose body is translated
// (see BODY_TRANSLATED_PATHS), so its structured data matches its own canonical.
export type ServiceJsonLdLocalized = { url: string; name: string; description: string; crumbs: { name: string; url: string }[] };

// Service + BreadcrumbList structured data for a service page, or [] when the
// path is not a registry service. Without `localized`, names and URLs are the
// English ones, matching the English canonical of untranslated pages.
export function serviceJsonLd(path: string, localized?: ServiceJsonLdLocalized): object[] {
  const s = BY_PATH[path];
  if (!s) return [];
  const url = localized?.url ?? `${SITE_URL}${s.path}`;
  const name = localized?.name ?? s.longLabel;
  const crumbs = localized?.crumbs ?? [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
  ];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      serviceType: name,
      description: localized?.description ?? s.description,
      url,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "CA",
      offers: {
        "@type": "Offer",
        price: s.price.toFixed(2),
        priceCurrency: "CAD",
        url,
      },
    },
    breadcrumbSchema([
      ...crumbs,
      { name, url },
    ]),
  ];
}
