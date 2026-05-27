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
      // Route renamed 2026-05-27 — preserve any external links / bookmarks.
      { source: "/nuans-report", destination: "/nuans", permanent: true },
      { source: "/nuans-report/:path*", destination: "/nuans/:path*", permanent: true },
      { source: "/:locale(fr|es)/nuans-report", destination: "/:locale/nuans", permanent: true },
      { source: "/:locale(fr|es)/nuans-report/:path*", destination: "/:locale/nuans/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
