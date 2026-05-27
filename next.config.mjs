import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Serve dynamic LLMs.txt content from the Supabase-backed API route.
      // Editable from /dashboard/seo/llms-txt; falls back to a static default
      // when no row exists yet.
      { source: "/.well-known/llms.txt", destination: "/api/llms-txt" },
    ];
  },
  async redirects() {
    return [
      // Routes renamed 2026-05-27 — preserve any external links / bookmarks.
      // /nuans-report -> /nuans
      { source: "/nuans-report", destination: "/nuans", permanent: true },
      { source: "/nuans-report/:path*", destination: "/nuans/:path*", permanent: true },
      { source: "/:locale(fr|es)/nuans-report", destination: "/:locale/nuans", permanent: true },
      { source: "/:locale(fr|es)/nuans-report/:path*", destination: "/:locale/nuans/:path*", permanent: true },
      // /pricing -> /order
      { source: "/pricing", destination: "/order", permanent: true },
      { source: "/:locale(fr|es)/pricing", destination: "/:locale/order", permanent: true },
      // /resources -> /guides (root + article slugs)
      { source: "/resources", destination: "/guides", permanent: true },
      { source: "/resources/:path*", destination: "/guides/:path*", permanent: true },
      { source: "/:locale(fr|es)/resources", destination: "/:locale/guides", permanent: true },
      { source: "/:locale(fr|es)/resources/:path*", destination: "/:locale/guides/:path*", permanent: true },
      // /terms -> /terms-of-service
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      { source: "/:locale(fr|es)/terms", destination: "/:locale/terms-of-service", permanent: true },
      // /privacy -> /privacy-policy
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/:locale(fr|es)/privacy", destination: "/:locale/privacy-policy", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
