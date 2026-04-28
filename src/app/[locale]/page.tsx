import { setRequestLocale } from "next-intl/server";
import HomePageBody from "./HomePageBody";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePageBody />;
}
