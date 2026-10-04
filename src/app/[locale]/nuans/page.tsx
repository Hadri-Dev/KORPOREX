import ServiceContentSection from "@/components/ServiceContentSection";
import { content } from "@/lib/serviceContent/nuans";
import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, socialMeta } from "@/lib/seoMeta";
import type { Locale } from "@/i18n/routing";
import NuansReportBody from "./NuansReportBody";

type PageProps = { params: Promise<{ locale: string }> };

function nuansUrl(locale: string): string {
  return `https://korporex.ca${locale === "en" ? "" : `/${locale}`}/nuans`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  const isEs = locale === "es";

  if (isFr) {
    const title = "Rapport NUANS en ligne | Ontario et Canada | Korporex";
    const description =
      "Commandez un rapport NUANS officiel pour une constitution en Ontario, en Alberta ou au fédéral. 39,99 $ + TVH par nom, livré par courriel en quelques heures.";
    return {
      title,
      description,
      alternates: buildAlternates("fr", "/nuans", true),
      ...socialMeta({ title, description, url: nuansUrl("fr"), locale: locale as Locale }),
    };
  }
  if (isEs) {
    const title = "Informe NUANS en línea | Ontario y Canadá | Korporex";
    const description =
      "Pida un informe NUANS oficial para constituirse en Ontario, Alberta o a nivel federal. 39,99 $ + HST por nombre, entregado por correo en pocas horas.";
    return {
      title,
      description,
      alternates: buildAlternates("es", "/nuans", true),
      ...socialMeta({ title, description, url: nuansUrl("es"), locale: locale as Locale }),
    };
  }
  const title = "Order a NUANS Report Online | Ontario & Canada | Korporex";
  const description =
    "Order an official NUANS report for an Ontario, Alberta or federal filing. $39.99 + HST per name, run by our team and emailed to you within hours.";
  return {
    title,
    description,
    alternates: buildAlternates("en", "/nuans", true),
    ...socialMeta({ title, description, url: nuansUrl("en"), locale: "en" }),
  };
}

export default async function NuansReportPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <NuansReportBody />
      <ServiceContentSection locale={locale as Locale} path="/nuans" content={content} />
      <ServiceRelatedGuides locale={locale as Locale} path="/nuans" />
    </>
  );
}
