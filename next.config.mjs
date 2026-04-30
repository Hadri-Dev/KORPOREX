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
};

export default withNextIntl(nextConfig);
