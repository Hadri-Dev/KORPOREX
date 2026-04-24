import { NextResponse, type NextRequest } from "next/server";

// Launch-mode gate: when a request hits the production apex/www hostnames,
// serve the /soon landing page for every public route. The full site stays
// reachable on `*.vercel.app` (and localhost) for ongoing dev. When ready to
// ship, delete this middleware (or add more hosts to OPEN_HOSTS).
//
// Excluded from the gate:
//   - /api/*          — contact form and webhooks must keep working
//   - /_next/*        — framework assets
//   - /favicon.ico    — browser probe
//   - /soon itself    — the destination page
//
// Matcher below also excludes /_next/static and /_next/image to avoid
// unnecessary middleware invocations on static assets.

const LAUNCH_MODE_HOSTS = new Set([
  "korporex.com",
  "www.korporex.com",
]);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];

  if (!LAUNCH_MODE_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  if (pathname === "/soon" || pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/soon";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
