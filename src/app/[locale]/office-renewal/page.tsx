import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "../guides/articles";
import { annualFee, getClient, locationLabel } from "@/lib/officeRenewals";
import { addYears } from "@/lib/officeRenewalLogic";
import { verifyRenewalToken } from "@/lib/officeRenewalToken";
import { CA_TAX_RATES, normalizeCaRegion } from "@/lib/pricing";
import OfficeRenewalBody, { type RenewalView } from "./OfficeRenewalBody";

// Private client page behind the link in each Registered Office renewal email
// (/office-renewal?t=<token>). Not linked from the site, not in the sitemap,
// noindex. The client either renews (Stripe Checkout via /api/office-renewal)
// or tells us they are moving their registered office.

export const dynamic = "force-dynamic";

type SearchParams = { t?: string | string[]; choice?: string | string[]; paid?: string | string[] };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "officeRenewal" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

function utcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export default async function OfficeRenewalPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const token = first(sp.t) ?? "";
  const format = await getFormatter();
  const longDate = (iso: string) => format.dateTime(utcDate(iso), { timeZone: "UTC", dateStyle: "long" });

  const view = await resolveView();
  return <OfficeRenewalBody view={view} token={token} locale={locale} />;

  async function resolveView(): Promise<RenewalView> {
    const parsed = token ? verifyRenewalToken(token) : null;
    if (!parsed) return { kind: "invalid" };
    if (first(sp.paid) === "1") return { kind: "paid" };
    const client = await getClient(parsed.clientId);
    if (!client || client.status === "closed") return { kind: "invalid" };
    if (client.renewsOn !== parsed.renewsOn) return { kind: "expired" };
    if (client.status === "moving") return { kind: "movingDone", businessName: client.businessName };
    const region = client.billingRegion ? normalizeCaRegion(client.billingRegion) : "";
    return {
      kind: "form",
      businessName: client.businessName,
      office: locationLabel(client.location),
      termEnds: longDate(client.renewsOn),
      nextTermEnds: longDate(addYears(client.renewsOn, 1)),
      fee: format.number(annualFee(client.location), { style: "currency", currency: "CAD" }),
      defaultRegion: region === "OUTSIDE" || region in CA_TAX_RATES ? region : "ON",
      initialChoice: first(sp.choice) === "moving" ? "moving" : "renew",
    };
  }
}
