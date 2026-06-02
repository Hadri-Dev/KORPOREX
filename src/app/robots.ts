import type { MetadataRoute } from "next";
import { SITE_URL } from "./[locale]/guides/articles";

// Served at /robots.txt. Points crawlers at the sitemap and keeps them out of
// the owner area, API routes, the launch page, and post-payment confirmation
// pages (which carry order data and have no SEO value). The `*/confirmation`
// and `*/soon` wildcards cover the locale-prefixed variants too.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/dashboard", "/soon", "*/soon", "*/confirmation"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
