import ServiceRelatedGuides from "@/components/ServiceRelatedGuides";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata, localizedUrl } from "@/lib/seoMeta";
import { SITE_URL } from "@/app/[locale]/guides/articles";
import { faqPageSchema, breadcrumbSchema } from "@/lib/structuredData";
import JsonLd from "@/components/JsonLd";
import { CHANGE_NAME_PRICES } from "@/lib/changeNameSchema";
import ChangeNameBody from "./ChangeNameBody";

const PATH = "/services/change-name";

type Lang = "en" | "fr" | "es";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "changeName", PATH);
}

const on = CHANGE_NAME_PRICES.ontario;
const fed = CHANGE_NAME_PRICES.federal;
const frMoney = (n: number) => `${n.toFixed(2).replace(".", ",")} $`;

// Q&A used for BOTH the FAQPage structured data and the visible FAQ accordion,
// kept in one place so they never drift.
const COPY: Record<
  Lang,
  {
    serviceName: string;
    home: string;
    services: string;
    faqH2: string;
    faqIntro: string;
    serviceDescription: string;
    faq: { q: string; a: string }[];
  }
> = {
  en: {
    serviceName: "Change of Business Name",
    home: "Home",
    services: "Services",
    faqH2: "Change of business name: common questions",
    faqIntro: "The questions people search most about changing an Ontario or federal corporation's name.",
    serviceDescription:
      "Legally change an Ontario (OBCA) or federal (CBCA) corporation's name. Korporex prepares and files the Articles of Amendment and runs the required NUANS name search for a flat fee, with the government filing fee and one NUANS search included.",
    faq: [
      {
        q: "How do I legally change my corporation's name in Canada?",
        a: "You file Articles of Amendment with your registry: the Ontario Business Registry for OBCA corporations, or Corporations Canada for CBCA (federal) corporations. The change must first be approved by a special resolution of the shareholders (two-thirds of votes cast), and a NUANS name search confirms the new name is available. Korporex prepares the amendment, runs the search, and files it for you.",
      },
      {
        q: "How much does it cost to change a business name in Ontario or federally?",
        a: `Korporex charges a flat $${on.toFixed(2)} + HST for an Ontario corporation and $${fed.toFixed(2)} + HST for a federal corporation. The government filing fee (Ontario $150 or federal $200) and one NUANS name search are already included, so there are no separate government or NUANS charges.`,
      },
      {
        q: "Do I need a NUANS report to change my corporate name?",
        a: "Yes. Changing to a new named corporation requires a NUANS name search to confirm the name is distinctive and available. One NUANS search is included in your price. If you want to test additional name choices, each further search is $39.99 + HST.",
      },
      {
        q: "How long does a corporate name change take?",
        a: "Once we have your chosen name cleared and your special resolution, the Articles of Amendment are typically filed and processed within 1 to 2 business days. You then receive an updated Certificate and Articles of Amendment reflecting the new name.",
      },
      {
        q: "Do I need to update my minute book after a name change?",
        a: "Your corporate records should reflect the new legal name. For an optional $199 + HST, Korporex prepares the directors' and shareholders' resolutions and updates your minute book so your internal records match the amended articles.",
      },
    ],
  },
  fr: {
    serviceName: "Changement de nom d'entreprise",
    home: "Accueil",
    services: "Services",
    faqH2: "Changement de nom d'entreprise : questions fréquentes",
    faqIntro: "Les questions les plus recherchées sur le changement de nom d'une société ontarienne ou fédérale.",
    serviceDescription:
      "Changez légalement la dénomination d'une société ontarienne (LSAO) ou fédérale (LCSA). Korporex prépare et dépose les clauses modificatrices et effectue la recherche de nom NUANS requise, à prix fixe, droits gouvernementaux et une recherche NUANS inclus.",
    faq: [
      {
        q: "Comment changer légalement le nom de ma société au Canada?",
        a: "Vous déposez des clauses modificatrices auprès de votre registre : le Registre des entreprises de l'Ontario pour les sociétés régies par la LSAO, ou Corporations Canada pour les sociétés régies par la LCSA (fédérales). Le changement doit d'abord être approuvé par résolution spéciale des actionnaires (deux tiers des voix exprimées), et une recherche de nom NUANS confirme que le nouveau nom est disponible. Korporex prépare la modification, effectue la recherche et la dépose pour vous.",
      },
      {
        q: "Combien coûte un changement de nom d'entreprise en Ontario ou au fédéral?",
        a: `Korporex demande un prix fixe de ${frMoney(on)} + TVH pour une société ontarienne et de ${frMoney(fed)} + TVH pour une société fédérale. Les droits de dépôt gouvernementaux (150 $ en Ontario ou 200 $ au fédéral) et une recherche de nom NUANS sont déjà inclus; il n'y a donc aucuns frais gouvernementaux ou NUANS distincts.`,
      },
      {
        q: "Ai-je besoin d'un rapport NUANS pour changer la dénomination de ma société?",
        a: "Oui. Le passage à une nouvelle dénomination exige une recherche de nom NUANS pour confirmer que le nom est distinctif et disponible. Une recherche NUANS est incluse dans votre prix. Si vous souhaitez vérifier d'autres choix de nom, chaque recherche supplémentaire coûte 39,99 $ + TVH.",
      },
      {
        q: "Combien de temps prend un changement de dénomination sociale?",
        a: "Une fois votre nom approuvé et votre résolution spéciale reçue, les clauses modificatrices sont généralement déposées et traitées dans un délai de 1 à 2 jours ouvrables. Vous recevez ensuite un certificat et des clauses modificatrices à jour indiquant le nouveau nom.",
      },
      {
        q: "Dois-je mettre à jour mon registre des procès-verbaux après un changement de nom?",
        a: "Les registres de la société doivent refléter la nouvelle dénomination légale. En option, pour 199 $ + TVH, Korporex prépare les résolutions des administrateurs et des actionnaires et met à jour votre registre des procès-verbaux afin que vos registres internes correspondent aux statuts modifiés. Les documents du registre sont préparés en anglais.",
      },
    ],
  },
  es: {
    serviceName: "Cambio de nombre de la empresa",
    home: "Inicio",
    services: "Servicios",
    faqH2: "Cambio de nombre de la empresa: preguntas frecuentes",
    faqIntro: "Las preguntas más buscadas sobre el cambio de nombre de una sociedad de Ontario o federal.",
    serviceDescription:
      "Cambie legalmente el nombre de una sociedad de Ontario (OBCA) o federal (CBCA). Korporex prepara y presenta los estatutos modificatorios (Articles of Amendment) y realiza la búsqueda de nombre NUANS requerida por una tarifa fija, con la tasa gubernamental y una búsqueda NUANS incluidas.",
    faq: [
      {
        q: "¿Cómo cambio legalmente el nombre de mi sociedad en Canadá?",
        a: "Se presentan estatutos modificatorios (Articles of Amendment) ante su registro: el Registro de Empresas de Ontario para las sociedades OBCA, o Corporations Canada para las sociedades CBCA (federales). El cambio debe aprobarse primero mediante una resolución especial de los accionistas (dos tercios de los votos emitidos), y una búsqueda de nombre NUANS confirma que el nuevo nombre está disponible. Korporex prepara la modificación, realiza la búsqueda y la presenta por usted.",
      },
      {
        q: "¿Cuánto cuesta cambiar el nombre de una empresa en Ontario o a nivel federal?",
        a: `Korporex cobra una tarifa fija de $${on.toFixed(2)} + HST para una sociedad de Ontario y de $${fed.toFixed(2)} + HST para una sociedad federal. La tasa gubernamental de presentación (Ontario $150 o federal $200) y una búsqueda de nombre NUANS ya están incluidas, por lo que no hay cargos gubernamentales ni NUANS por separado.`,
      },
      {
        q: "¿Necesito un informe NUANS para cambiar el nombre de mi sociedad?",
        a: "Sí. Cambiar a un nuevo nombre requiere una búsqueda de nombre NUANS para confirmar que el nombre es distintivo y está disponible. Su precio incluye una búsqueda NUANS. Si desea probar otras opciones de nombre, cada búsqueda adicional cuesta $39.99 + HST.",
      },
      {
        q: "¿Cuánto tarda un cambio de nombre de la sociedad?",
        a: "Una vez aprobado el nombre elegido y recibida su resolución especial, los estatutos modificatorios suelen presentarse y procesarse en 1 a 2 días hábiles. Luego recibe un certificado y estatutos modificatorios actualizados con el nuevo nombre.",
      },
      {
        q: "¿Debo actualizar mi libro de actas después de un cambio de nombre?",
        a: "Los registros de la sociedad deben reflejar el nuevo nombre legal. De forma opcional, por $199 + HST, Korporex prepara las resoluciones de directores y accionistas y actualiza su libro de actas para que sus registros internos coincidan con los estatutos modificados. Los documentos del libro de actas se preparan en inglés.",
      },
    ],
  },
};

function serviceSchema(locale: Locale, c: (typeof COPY)[Lang]) {
  const url = localizedUrl(locale, PATH);
  const offer = (jurLabel: string, price: number) => ({
    "@type": "Offer",
    name: `${c.serviceName} (${jurLabel})`,
    price: price.toFixed(2),
    priceCurrency: "CAD",
    url,
    availability: "https://schema.org/InStock",
  });
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: c.serviceName,
    serviceType: "Corporate name change (Articles of Amendment)",
    description: c.serviceDescription,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "CA",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: on.toFixed(2),
      highPrice: fed.toFixed(2),
      offerCount: 2,
      offers: [offer("Ontario", on), offer(locale === "en" ? "Federal" : locale === "fr" ? "Fédéral" : "Federal", fed)],
    },
  };
}

function breadcrumb(locale: Locale, c: (typeof COPY)[Lang]) {
  return breadcrumbSchema([
    { name: c.home, url: localizedUrl(locale, "/") },
    { name: c.services, url: localizedUrl(locale, "/services") },
    { name: c.serviceName, url: localizedUrl(locale, PATH) },
  ]);
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const c = COPY[lang];
  return (
    <>
      <JsonLd data={[serviceSchema(locale, c), faqPageSchema(c.faq), breadcrumb(locale, c)]} />
      <ChangeNameBody />

      {/* FAQ: visible on-page content that mirrors the FAQPage structured data. */}
      <section className="bg-cream-50 py-12 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2">{c.faqH2}</h2>
          <p className="text-gray-500 text-sm mb-6">{c.faqIntro}</p>
          <div className="space-y-3">
            {c.faq.map(({ q, a }) => (
              <details key={q} className="group bg-white border border-gray-200 rounded-lg px-5 py-1">
                <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4 font-semibold text-navy-900 text-[15px]">
                  {q}
                  <span className="text-gold-600 text-xl leading-none group-open:hidden">+</span>
                  <span className="text-gold-600 text-xl leading-none hidden group-open:inline">–</span>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed pb-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <ServiceRelatedGuides locale={locale} path="/services/change-name" />
    </>
  );
}
