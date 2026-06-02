import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // beforeFiles: these run before filesystem AND dynamic-route resolution.
    // Required for `/llms.txt` — as a single URL segment it would otherwise be
    // captured by the `[locale]` dynamic route and 404, instead of reaching the
    // API route. (The two-segment `.well-known` variant never collides, but we
    // keep it here for consistency.)
    return {
      beforeFiles: [
        // Serve dynamic LLMs.txt content from the Supabase-backed API route.
        // Editable from /dashboard/seo/llms-txt; falls back to a static default
        // when no row exists yet.
        // `/llms.txt` is the canonical root location per the llmstxt.org spec —
        // it's what AI crawlers and SEO audits (SEMRUSH) probe. The `.well-known`
        // alias is kept so the dashboard's existing link keeps working.
        { source: "/llms.txt", destination: "/api/llms-txt" },
        { source: "/.well-known/llms.txt", destination: "/api/llms-txt" },
      ],
    };
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
