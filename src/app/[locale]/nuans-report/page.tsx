import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import NuansReportBody from "./NuansReportBody";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  const isEs = locale === "es";

  if (isFr) {
    return {
      title: "Rapport NUANS Canada | Recherche préliminaire de nom commercial | Korporex",
      description:
        "Commandez un rapport NUANS officiel pour pré-vérifier un nom de société canadienne avant la constitution. 40 $ + TVH. Livré sous un jour ouvrable.",
    };
  }
  if (isEs) {
    return {
      title: "Informe NUANS Canadá | Búsqueda preliminar de nombre corporativo | Korporex",
      description:
        "Solicite un informe NUANS oficial para verificar un nombre de corporación canadiense antes de incorporar. $40 + HST. Entrega en 1 día hábil.",
    };
  }
  return {
    title: "NUANS Report Canada | Pre-Screen a Corporate Name | Korporex",
    description:
      "Order an official NUANS preliminary name-search report before you incorporate in Canada. Federal and provincial filings supported. Flat $40 + HST, delivered within one business day.",
    alternates: {
      canonical: "https://korporex.ca/nuans-report",
    },
  };
}

export default async function NuansReportPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NuansReportBody />;
}
