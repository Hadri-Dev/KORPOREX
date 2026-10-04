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

// Service + BreadcrumbList structured data for a service page, or [] when the
// path is not a registry service. URLs use the English path, matching the
// canonical of these (English-bodied) pages.
export function serviceJsonLd(path: string): object[] {
  const s = BY_PATH[path];
  if (!s) return [];
  const url = `${SITE_URL}${s.path}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.longLabel,
      serviceType: s.longLabel,
      description: s.description,
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
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` },
      { name: s.longLabel, url },
    ]),
  ];
}
