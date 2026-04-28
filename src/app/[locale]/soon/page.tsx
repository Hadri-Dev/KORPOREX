import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SoonPageBody from "./SoonPageBody";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "soon" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function SoonPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SoonPageBody />;
}
