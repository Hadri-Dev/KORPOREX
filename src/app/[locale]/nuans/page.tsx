import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { socialMeta } from "@/lib/seoMeta";
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
    const title = "Rapport NUANS Canada | Recherche préliminaire de nom commercial | Korporex";
    const description =
      "Commandez un rapport NUANS officiel pour pré-vérifier un nom de société canadienne avant la constitution. À partir de 40 $ + TVH (40 $ par nom supplémentaire). Livré en quelques heures.";
    return {
      title,
      description,
      ...socialMeta({ title, description, url: nuansUrl("fr"), locale: locale as Locale }),
    };
  }
  if (isEs) {
    const title = "Informe NUANS Canadá | Búsqueda preliminar de nombre corporativo | Korporex";
    const description =
      "Solicite un informe NUANS oficial para verificar un nombre de corporación canadiense antes de incorporar. Desde $40 + HST ($40 por nombre adicional). Entrega en pocas horas.";
    return {
      title,
      description,
      ...socialMeta({ title, description, url: nuansUrl("es"), locale: locale as Locale }),
    };
  }
  const title = "NUANS Report Canada | Pre-Screen a Corporate Name | Korporex";
  const description =
    "Order an official NUANS preliminary name-search report before you incorporate in Canada. Federal and provincial filings supported. From $40 + HST for the first name, $40 + HST for each additional name. Delivered within a few hours.";
  return {
    title,
    description,
    alternates: {
      canonical: nuansUrl("en"),
    },
    ...socialMeta({ title, description, url: nuansUrl("en"), locale: "en" }),
  };
}

export default async function NuansReportPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NuansReportBody />;
}
