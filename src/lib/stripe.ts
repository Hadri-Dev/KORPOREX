import Stripe from "stripe";

// Server-side Stripe SDK singleton. Reads STRIPE_SECRET_KEY from env; returns
// null when the key is missing so local dev and preview deploys without Stripe
// credentials still render. API routes that need Stripe must null-check and
// fail gracefully (same pattern as /api/contact with BREVO_API_KEY).

const apiKey = process.env.STRIPE_SECRET_KEY;

export const stripe: Stripe | null = apiKey
  ? new Stripe(apiKey, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    })
  : null;

export function isStripeConfigured(): boolean {
  return stripe !== null;
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  // Vercel sets VERCEL_URL (no protocol) for preview/prod; fall back to localhost.
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
