import Link from "next/link";
import NotFoundBeacon from "./NotFoundBeacon";

// Renders for any unmatched route inside the [locale] segment. The beacon
// child fires a client-side POST to /api/seo/not-found-log/capture so the
// admin SEO Dashboard can aggregate hits by path.
//
// English-only by design — consistent with the rest of the deeper site (FR/ES
// translations are tracked as a separate known-issue and don't block this).
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-sm uppercase tracking-wider text-gray-500">404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-navy-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-base text-gray-600">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-navy-800"
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
  );
}
