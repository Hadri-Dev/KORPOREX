// Local-only preview for CorporationNameSection. Not linked from anywhere.
// Removed before merge — see /known-issues.md.

import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import PreviewClient from "./PreviewClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "CorporationNameSection preview (dev)",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PreviewClient />;
}
