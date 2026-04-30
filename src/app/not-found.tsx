import Link from "next/link";
import NotFoundBeacon from "./[locale]/NotFoundBeacon";

// Root-level not-found. Next.js App Router falls back to this whenever a URL
// doesn't match any route (the [locale]/not-found.tsx only fires on explicit
// notFound() calls from server components). Self-contained — no chrome from
// the [locale] layout, since this is rendered outside the locale tree.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="font-mono text-sm uppercase tracking-wider text-gray-500">404</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#0a1f44] sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 text-base text-gray-600">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-[#0a1f44] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#162a55]"
            >
              Go to homepage
            </Link>
            <Link
              href="/services"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              See services
            </Link>
          </div>
          <NotFoundBeacon />
        </main>
      </body>
    </html>
  );
}
