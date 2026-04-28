import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Composes two middlewares:
//
//  1. next-intl locale middleware — handles `/en/*`, `/fr/*`, `/es/*` URLs
//     and redirects `/` to the appropriate locale prefix. Required for
//     next-intl App Router routing.
//
//  2. Launch-mode gate — when a request hits the production apex/www
//     hostnames, rewrite every public route to `/<locale>/soon` so the
//     coming-soon page renders in the visitor's language. The full WIP site
//     stays reachable on `*.vercel.app` (and localhost). When ready to ship,
//     remove the LAUNCH_MODE_HOSTS check below (or empty the set) — the
//     locale middleware should remain.
//
// Order matters: the launch-mode rewrite must run AFTER locale resolution
// so we know which `/<locale>/soon` to point at.
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

  // 2. Launch-mode rewrite. Resolve the locale from the URL — after the
  //    intl middleware has run, the URL will be one of `/en/...`, `/fr/...`,
  //    or `/es/...`. Pull the prefix and rewrite to `/<locale>/soon`.
  const { pathname } = req.nextUrl;

  // Skip the rewrite if we're already at a /soon route or a non-locale path.
  if (
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/")
  ) {
    return intlResponse;
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = (routing.locales as readonly string[]).includes(segments[0] ?? "")
    ? segments[0]
    : routing.defaultLocale;

  // Already on the soon page for this locale — let it through.
  if (segments[0] === locale && segments[1] === "soon" && segments.length === 2) {
    return intlResponse;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}/soon`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Match everything except API, Next internals, and static assets.
  // Static asset extensions excluded so middleware doesn't run on them.
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
