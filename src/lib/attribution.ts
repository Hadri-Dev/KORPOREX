// First-touch marketing attribution for order Stripe metadata.
//
// Captured once per visitor (client-side, via AttributionCapture) into a
// first-party cookie on first landing. Every checkout route then reads that
// cookie off the incoming request and merges it into the Stripe Checkout
// session metadata, so the admin order detail page — which already renders
// every Stripe metadata key generically — shows where each specific paid
// order came from, not just aggregate site traffic.

const COOKIE_NAME = "kpx_attr";
const COOKIE_MAX_AGE_DAYS = 90;

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  /** ISO date (YYYY-MM-DD) of the visit that set the cookie. */
  firstSeen?: string;
}

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

// ── Client ───────────────────────────────────────────────────────────────

/**
 * Reads UTM params + referrer on the current page load and writes them to a
 * first-touch cookie, if one isn't already set. Call once from a client
 * component mounted near the root (AttributionCapture).
 */
export function captureAttributionOnLoad(): void {
  if (typeof document === "undefined") return;
  if (document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`))) return;

  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer || "";
  const isInternalReferrer = referrer && new URL(referrer).hostname === window.location.hostname;

  // The cookie is written even when there is no UTM tag and no outside
  // referrer, so a direct visit is recorded as direct instead of leaving the
  // order with no attribution fields at all.
  const attribution: Attribution = {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
    referrer: !isInternalReferrer ? truncate(referrer, 300) : undefined,
    landingPage: truncate(window.location.pathname, 200),
    firstSeen: new Date().toISOString().slice(0, 10),
  };

  const value = encodeURIComponent(JSON.stringify(attribution));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

// ── Server ───────────────────────────────────────────────────────────────

/** Parses the attribution cookie off an incoming request's `cookie` header. */
export function getAttributionFromCookies(cookieHeader: string | null): Attribution {
  if (!cookieHeader) return {};
  const match = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1))) as Attribution;
  } catch {
    return {};
  }
}

/**
 * One-line answer to "where did this order come from". Always returns a value
 * so an order never has a blank source: a tagged link wins, then the outside
 * site, then an explicit direct / unknown.
 */
export function describeTrafficSource(attribution: Attribution): string {
  if (attribution.utmSource) {
    return attribution.utmMedium
      ? `${attribution.utmSource} / ${attribution.utmMedium}`
      : attribution.utmSource;
  }
  if (attribution.referrer) {
    try {
      return new URL(attribution.referrer).hostname.replace(/^www\./, "");
    } catch {
      return attribution.referrer;
    }
  }
  if (attribution.landingPage) return "direct (typed address, bookmark, email or app link)";
  return "unknown (no tracking cookie)";
}

/**
 * Attribution as Stripe metadata (string values only). `trafficSource` is
 * always present; the other fields only when captured.
 */
export function attributionStripeMetadata(attribution: Attribution): Record<string, string> {
  const metadata: Record<string, string> = {
    trafficSource: truncate(describeTrafficSource(attribution), 200),
  };
  if (attribution.firstSeen) metadata.firstSeen = attribution.firstSeen;
  if (attribution.utmSource) metadata.utmSource = attribution.utmSource;
  if (attribution.utmMedium) metadata.utmMedium = attribution.utmMedium;
  if (attribution.utmCampaign) metadata.utmCampaign = attribution.utmCampaign;
  if (attribution.utmTerm) metadata.utmTerm = attribution.utmTerm;
  if (attribution.utmContent) metadata.utmContent = attribution.utmContent;
  if (attribution.referrer) metadata.referrer = attribution.referrer;
  if (attribution.landingPage) metadata.landingPage = attribution.landingPage;
  return metadata;
}
