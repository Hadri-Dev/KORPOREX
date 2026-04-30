import { notFound } from "next/navigation";

// Catch-all that fires for any unmatched URL inside a locale segment.
// Calling notFound() makes Next.js render the closest not-found.tsx —
// which is [locale]/not-found.tsx — instead of the framework's default
// 404 page. This is the only reliable way to trigger that custom page
// for "URL doesn't match any route" cases in the App Router.
export default function CatchAll() {
  notFound();
}

// dynamic = "force-static" — the page itself is unreachable (always 404s),
// but Next.js still needs a build directive.
export const dynamic = "force-static";
