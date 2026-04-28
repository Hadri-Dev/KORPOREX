import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/adminAuth";

// Composes three concerns:
//
//  1. Owner gate — `/admin` and `/dashboard/*` are single-owner, English-only,
//     and outside the localized site. They bypass next-intl entirely.
//     `/admin` is always reachable; `/dashboard/*` requires a valid session
//     cookie or redirects to `/admin`.
//
//  2. next-intl locale middleware — handles `/`, `/fr/*`, `/es/*` URLs
//     (English unprefixed; French and Spanish prefixed). Required for
//     next-intl App Router routing with `localePrefix: "as-needed"`.
//
//  3. Launch-mode gate — when a request hits the production apex/www
//     hostnames, rewrite every public route to the locale's /soon page so
//     the coming-soon page renders in the visitor's language. The full WIP
//     site stays reachable on `*.vercel.app` (and localhost). The owner
//     surface (/admin, /dashboard) is deliberately exempt so the owner can
//     still reach it in launch mode.
//
// Excluded from all three:
//   - /api/*          — API routes (auth API guards itself)
//   - /_next/*        — framework assets
//   - /favicon.ico    — browser probe

const LAUNCH_MODE_HOSTS = new Set([
  "korporex.com",
  "www.korporex.com",
]);

const intlMiddleware = createIntlMiddleware(routing);

function isOwnerPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  );
}

export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // 1. Owner gate. Non-localized; never goes through next-intl or the
  //    launch-mode rewrite.
  if (isOwnerPath(pathname)) {
    if (pathname === "/admin") {
      return NextResponse.next();
    }
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const valid = await verifyAdminSession(token);
    if (!valid) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // 2. Let next-intl handle locale routing (redirects / negotiates / rewrites).
  const intlResponse = intlMiddleware(req);

  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  if (!LAUNCH_MODE_HOSTS.has(host)) {
    return intlResponse;
  }

  // 3. Launch-mode rewrite. With `localePrefix: "as-needed"`, English is
  //    served unprefixed (rewrite target: /soon), and FR/ES are prefixed
  //    (rewrite target: /fr/soon or /es/soon). Resolve the locale from the
  //    URL's first segment; if it's not one of the non-default locales, fall
  //    back to the default locale (English) which uses the unprefixed path.

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
