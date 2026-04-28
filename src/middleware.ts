import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Composes two middlewares:
//
//  1. next-intl locale middleware — handles `/`, `/fr/*`, `/es/*` URLs
//     (English is served unprefixed; French and Spanish are prefixed).
//     Required for next-intl App Router routing with `localePrefix: "as-needed"`.
//
//  2. Launch-mode gate — when a request hits the production apex/www
//     hostnames, rewrite every public route to the locale's /soon page so
//     the coming-soon page renders in the visitor's language. The full WIP
//     site stays reachable on `*.vercel.app` (and localhost). When ready to
//     ship, remove the LAUNCH_MODE_HOSTS check below (or empty the set) —
//     the locale middleware should remain.
//
// Order matters: the launch-mode rewrite must run AFTER locale resolution
// so we know which /soon to point at.
//
// Excluded from both middlewares:
//   - /api/*          — contact form and webhooks must keep working at /api
//   - /_next/*        — framework assets
//   - /favicon.ico    — browser probe

const LAUNCH_MODE_HOSTS = new Set([
  "korporex.com",
  "www.korporex.com",
]);

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(req: NextRequest): NextResponse {
  // 1. Let next-intl handle locale routing (redirects / negotiates / rewrites).
  const intlResponse = intlMiddleware(req);

  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  if (!LAUNCH_MODE_HOSTS.has(host)) {
    return intlResponse;
  }

  // 2. Launch-mode rewrite. With `localePrefix: "as-needed"`, English is
  //    served unprefixed (rewrite target: /soon), and FR/ES are prefixed
  //    (rewrite target: /fr/soon or /es/soon). Resolve the locale from the
  //    URL's first segment; if it's not one of the non-default locales, fall
  //    back to the default locale (English) which uses the unprefixed path.
  const { pathname } = req.nextUrl;

  if (
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/")
  ) {
    return intlResponse;
  }

  const segments = pathname.split("/").filter(Boolean);
  const prefixedLocales = routing.locales.filter((l) => l !== routing.defaultLocale);
  const matchedLocale = prefixedLocales.find((l) => segments[0] === l);
  const targetSoonPath = matchedLocale ? `/${matchedLocale}/soon` : "/soon";

  // Already on the correct /soon route for this locale — let it through.
  if (pathname === targetSoonPath) {
    return intlResponse;
  }

  const url = req.nextUrl.clone();
  url.pathname = targetSoonPath;
  return NextResponse.rewrite(url);
}

export const config = {
  // Match everything except API, Next internals, and static assets.
  // Static asset extensions excluded so middleware doesn't run on them.
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
