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
        "Commandez un rapport NUANS officiel pour pré-vérifier un nom de société canadienne avant la constitution. À partir de 40 $ + TVH (45 $ par nom supplémentaire). Livré en quelques heures.",
    };
  }
  if (isEs) {
    return {
      title: "Informe NUANS Canadá | Búsqueda preliminar de nombre corporativo | Korporex",
      description:
        "Solicite un informe NUANS oficial para verificar un nombre de corporación canadiense antes de incorporar. Desde $40 + HST ($45 por nombre adicional). Entrega en pocas horas.",
    };
  }
  return {
    title: "NUANS Report Canada | Pre-Screen a Corporate Name | Korporex",
    description:
      "Order an official NUANS preliminary name-search report before you incorporate in Canada. Federal and provincial filings supported. From $40 + HST for the first name, $45 + HST for each additional name. Delivered within a few hours.",
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
