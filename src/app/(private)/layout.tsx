import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

// Shared root layout for the private (signed-in or signing-in) section:
// /login and /dashboard. Lives outside [locale]/ — single owner, English-only,
// not localized, and not indexed. Next.js multi-root layout setup: this is
// the root for everything in the (private) route group; [locale]/layout.tsx
// is the root for the public localized site.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Korporex",
  robots: { index: false, follow: false },
};

export default function PrivateRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-cream-50 text-gray-900 font-sans min-h-screen">{children}</body>
    </html>
  );
}
