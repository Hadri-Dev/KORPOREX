import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";
import IncorporateBody from "./IncorporateBody";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "incorporate", "/incorporate");
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {/* The wizard reads search params, so it renders client-side only and its
          per-step <h2>s are absent from the served HTML — the page shipped with
          no heading at all. A visually-hidden H1 here (server component) puts
          exactly one in the markup without touching the wizard's design.
          English-only, like the rest of this page: /incorporate is not in
          BODY_TRANSLATED_PATHS, so /fr and /es render the same English body. */}
      <h1 className="sr-only">Incorporate a Business in Canada</h1>
      <IncorporateBody />
    </>
  );
}
