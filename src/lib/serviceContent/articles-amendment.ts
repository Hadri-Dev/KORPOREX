import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Articles of Amendment order form. The form is
// a client wizard with almost no crawlable text, so this block carries the
// page's service intent ("amend my articles, file it for me"), while the guide
// on articles of incorporation keeps the informational intent. Fees verified
// 2026-10-04: federal $200 online (GOV_FEES.federal.amendment, some amendments
// free) on ised-isde.canada.ca; Ontario $150 on ontario.ca.
export const content: ServiceContentByLocale = {
  en: {
    title: "File Articles of Amendment online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files Articles of Amendment for federal (CBCA) and Ontario (OBCA) corporations. Articles of Amendment change what is set out in a corporation's articles: its name, its share classes and the rights attached to them, the number of directors, restrictions on its business, and other provisions. You describe the change in plain language, and we draft the formal amendment wording and file it with Corporations Canada or the Ontario Business Registry. For background on what the articles contain, read our guide on ",
          { text: "what articles of incorporation are", href: "/guides/what-are-articles-of-incorporation" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Corporations changing their legal name, including from a numbered name to a word name.",
          "Corporations adding, removing or reorganizing share classes, or changing the voting, dividend, redemption or other rights of existing classes.",
          "Corporations changing the fixed number, or the minimum and maximum number, of directors set out in their articles.",
          "Corporations adding or removing restrictions on the business they may carry on, or changing other provisions of their articles.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "p",
        parts: [
          "For a federal corporation, we prepare Form 4, Articles of Amendment, under section 173 of the CBCA. For an Ontario corporation, we prepare Articles of Amendment under section 168 of the OBCA. You identify the corporation, select the types of change, describe the amendment and give the effective date you want, which must be on or after the filing date. You also confirm that the shareholders have passed a special resolution authorizing the amendment and give the date of that resolution.",
        ],
      },
      { type: "h3", text: "Key requirements" },
      {
        type: "list",
        items: [
          "An amendment to the articles is authorized by special resolution of the shareholders, meaning at least two-thirds of the votes cast. Holders of a class or series of shares can also be entitled to vote separately on an amendment that affects that class or series.",
          "A new word name needs a NUANS name search report: federally, a report dated within 90 days of filing, unless the name is a numbered name; in Ontario, an Ontario-biased report, unless the name is a number name.",
          "The number of directors in the articles must respect the statutory minimum: at least one director, or at least three for a federal distributing corporation or an Ontario offering corporation.",
          "Government filing fees: $200 to file online with Corporations Canada, with some amendments free, such as adding an English or French version of the name; $150 in Ontario.",
          "A change of directors or officers is reported by a notice, not by Articles of Amendment.",
        ],
      },
      {
        type: "p",
        parts: [
          "If the only change is the corporate name, our ",
          { text: "change of name service", href: "/services/change-name" },
          " is built for that filing. A proposed name can be checked in advance with a ",
          { text: "NUANS name search report", href: "/nuans" },
          ", and our guide on ",
          { text: "named vs numbered corporations", href: "/guides/named-vs-numbered-corporation" },
          " explains the two naming options.",
        ],
      },
    ],
    faqTitle: "Articles of Amendment: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the Articles of Amendment filing; for advice on your specific situation, including the tax effect of a share reorganization, consult a lawyer or accountant.",
    faq: [
      {
        q: "What approval is needed to amend the articles?",
        a: "A special resolution of the shareholders, which is a resolution passed by at least two-thirds of the votes cast, or signed by all shareholders entitled to vote. Some amendments, such as changes to the rights of a class of shares, also give that class a separate vote. The resolution is passed before the Articles of Amendment are filed.",
      },
      {
        q: "What does it cost in government fees to amend the articles?",
        a: "Corporations Canada charges $200 to file Articles of Amendment online. Some federal amendments are free, such as adding an English or French version of the corporate name or a name change directed by Corporations Canada. Ontario charges $150 to file Articles of Amendment. These government fees are separate from Korporex's service fee.",
      },
      {
        q: "Is a NUANS report required to change the corporate name?",
        a: "Yes, for a new word name. Federally, the Articles of Amendment must be accompanied by a NUANS report dated no more than 90 days before Corporations Canada receives them; a numbered name needs no report. In Ontario, a name change to a name that is not a number name requires an Ontario-biased NUANS report.",
      },
      {
        q: "Are Articles of Amendment needed to change the directors?",
        a: "Not to change who the directors are. A change of directors or officers is reported to the registry by a notice. Articles of Amendment are needed when the change concerns something set out in the articles themselves, such as the minimum and maximum number of directors, the share structure or the corporate name.",
      },
      {
        q: "When does the amendment take effect?",
        a: "On the date shown on the certificate of amendment issued by the registry. The order form asks for the effective date you want, which must be on or after the filing date. From that date, the amended provisions form part of the corporation's articles.",
      },
    ],
  },
  fr: {
    title: "Déposez des statuts de modification en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose les statuts de modification des sociétés fédérales (LCSA) et ontariennes (LSAO). Les statuts de modification changent ce qui figure dans les statuts d'une société : sa dénomination, ses catégories d'actions et les droits qui s'y rattachent, le nombre d'administrateurs, les restrictions sur ses activités et d'autres dispositions. Vous décrivez le changement en langage simple, et nous rédigeons le libellé officiel de la modification et le déposons auprès de Corporations Canada ou du Registre des entreprises de l'Ontario. Pour comprendre ce que contiennent les statuts, lisez notre guide sur ",
          { text: "les statuts constitutifs", href: "/guides/que-sont-les-statuts-constitutifs" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés qui changent de dénomination sociale, y compris pour passer d'un matricule à une dénomination nominative.",
          "Les sociétés qui ajoutent, suppriment ou réorganisent des catégories d'actions, ou qui modifient les droits de vote, de dividende, de rachat ou autres de catégories existantes.",
          "Les sociétés qui modifient le nombre fixe, ou les nombres minimal et maximal, d'administrateurs prévus dans leurs statuts.",
          "Les sociétés qui ajoutent ou retirent des restrictions sur les activités qu'elles peuvent exercer, ou qui modifient d'autres dispositions de leurs statuts.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Pour une société fédérale, nous préparons le formulaire 4, Clauses modificatrices, en vertu de l'article 173 de la LCSA. Pour une société ontarienne, nous préparons les statuts de modification en vertu de l'article 168 de la LSAO. Vous identifiez la société, choisissez les types de changement, décrivez la modification et indiquez la date d'effet souhaitée, qui doit être le jour du dépôt ou une date ultérieure. Vous confirmez aussi que les actionnaires ont adopté une résolution spéciale autorisant la modification et indiquez la date de cette résolution.",
        ],
      },
      { type: "h3", text: "Exigences principales" },
      {
        type: "list",
        items: [
          "Une modification des statuts est autorisée par résolution spéciale des actionnaires, soit au moins les deux tiers des voix exprimées. Les détenteurs d'une catégorie ou d'une série d'actions peuvent aussi avoir le droit de voter séparément sur une modification qui touche cette catégorie ou cette série.",
          "Une nouvelle dénomination nominative exige un rapport de recherche de nom NUANS : au fédéral, un rapport datant d'au plus 90 jours avant le dépôt, sauf pour un matricule; en Ontario, un rapport axé sur l'Ontario, sauf pour un matricule.",
          "Le nombre d'administrateurs prévu dans les statuts doit respecter le minimum légal : au moins un administrateur, ou au moins trois pour une société fédérale ayant fait appel au public ou une société ontarienne faisant appel public à l'épargne.",
          "Droits gouvernementaux : 200 $ pour un dépôt en ligne auprès de Corporations Canada, certaines modifications étant gratuites, comme l'ajout d'une version française ou anglaise de la dénomination; 150 $ en Ontario.",
          "Un changement d'administrateurs ou de dirigeants se déclare au moyen d'un avis, et non de statuts de modification.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si le seul changement porte sur la dénomination sociale, notre ",
          { text: "service de changement de dénomination", href: "/services/change-name" },
          " est conçu pour ce dépôt. Une dénomination proposée peut être vérifiée à l'avance au moyen d'un ",
          { text: "rapport de recherche de nom NUANS", href: "/nuans" },
          ", et notre guide sur ",
          { text: "la société avec nom ou à matricule", href: "/guides/societe-nominative-ou-a-matricule" },
          " explique les deux options.",
        ],
      },
    ],
    faqTitle: "Statuts de modification : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt de statuts de modification; pour des conseils adaptés à votre situation, y compris l'effet fiscal d'une réorganisation du capital-actions, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Quelle approbation faut-il pour modifier les statuts?",
        a: "Une résolution spéciale des actionnaires, c'est-à-dire une résolution adoptée par au moins les deux tiers des voix exprimées, ou signée par tous les actionnaires habiles à voter. Certaines modifications, comme un changement aux droits d'une catégorie d'actions, donnent aussi à cette catégorie un vote distinct. La résolution est adoptée avant le dépôt des statuts de modification.",
      },
      {
        q: "Combien coûtent les droits gouvernementaux pour modifier les statuts?",
        a: "Corporations Canada exige 200 $ pour un dépôt en ligne de clauses modificatrices. Certaines modifications fédérales sont gratuites, comme l'ajout d'une version française ou anglaise de la dénomination ou un changement de dénomination ordonné par Corporations Canada. L'Ontario exige 150 $ pour le dépôt de statuts de modification. Ces droits gouvernementaux s'ajoutent aux frais de service de Korporex.",
      },
      {
        q: "Un rapport NUANS est-il exigé pour changer de dénomination sociale?",
        a: "Oui, pour une nouvelle dénomination nominative. Au fédéral, les clauses modificatrices doivent être accompagnées d'un rapport NUANS datant d'au plus 90 jours avant leur réception par Corporations Canada; un matricule n'exige aucun rapport. En Ontario, le passage à une dénomination qui n'est pas un matricule exige un rapport NUANS axé sur l'Ontario.",
      },
      {
        q: "Faut-il des statuts de modification pour changer d'administrateurs?",
        a: "Pas pour changer l'identité des administrateurs. Un changement d'administrateurs ou de dirigeants se déclare au registre au moyen d'un avis. Les statuts de modification sont nécessaires lorsque le changement touche un élément figurant dans les statuts eux-mêmes, comme les nombres minimal et maximal d'administrateurs, la structure du capital-actions ou la dénomination sociale.",
      },
      {
        q: "Quand la modification prend-elle effet?",
        a: "À la date indiquée sur le certificat de modification délivré par le registre. Le formulaire de commande vous demande la date d'effet souhaitée, qui doit être le jour du dépôt ou une date ultérieure. À compter de cette date, les dispositions modifiées font partie des statuts de la société.",
      },
    ],
  },
  es: {
    title: "Presente artículos de modificación en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta los artículos de modificación de sociedades federales (CBCA) y de Ontario (OBCA). Los artículos de modificación cambian lo que figura en los estatutos de una sociedad: su denominación, sus clases de acciones y los derechos que conllevan, el número de directores, las restricciones sobre su actividad y otras disposiciones. Usted describe el cambio en lenguaje sencillo, y nosotros redactamos el texto formal de la modificación y lo presentamos ante Corporations Canada o el Registro de Empresas de Ontario. Para entender qué contienen los estatutos, lea nuestra guía sobre ",
          { text: "los estatutos de constitución", href: "/guides/que-son-los-estatutos-de-constitucion" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades que cambian su denominación legal, incluso de una denominación numerada a una con palabras.",
          "Sociedades que agregan, eliminan o reorganizan clases de acciones, o que cambian los derechos de voto, dividendos, rescate u otros de clases existentes.",
          "Sociedades que cambian el número fijo, o el número mínimo y máximo, de directores que establecen sus estatutos.",
          "Sociedades que agregan o eliminan restricciones sobre la actividad que pueden ejercer, o que cambian otras disposiciones de sus estatutos.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Para una sociedad federal, preparamos el formulario 4, artículos de modificación, en virtud del artículo 173 de la CBCA. Para una sociedad de Ontario, preparamos los artículos de modificación en virtud del artículo 168 de la OBCA. Usted identifica la sociedad, selecciona los tipos de cambio, describe la modificación e indica la fecha de entrada en vigor que desea, que debe ser igual o posterior a la fecha de presentación. También confirma que los accionistas aprobaron una resolución especial que autoriza la modificación e indica la fecha de esa resolución.",
        ],
      },
      { type: "h3", text: "Requisitos principales" },
      {
        type: "list",
        items: [
          "Una modificación de los estatutos se autoriza mediante resolución especial de los accionistas, es decir, al menos dos tercios de los votos emitidos. Los titulares de una clase o serie de acciones también pueden tener derecho a votar por separado sobre una modificación que afecte a esa clase o serie.",
          "Una nueva denominación con palabras requiere un informe de búsqueda de nombre NUANS: en el ámbito federal, un informe con no más de 90 días al presentar, salvo para una denominación numerada; en Ontario, un informe orientado a Ontario, salvo para una denominación numerada.",
          "El número de directores de los estatutos debe respetar el mínimo legal: al menos un director, o al menos tres para una sociedad federal que hace oferta pública de valores o una sociedad de Ontario que hace oferta pública.",
          "Tasas gubernamentales: 200 $ por presentación en línea ante Corporations Canada, con algunas modificaciones gratuitas, como agregar una versión en inglés o francés de la denominación; 150 $ en Ontario.",
          "Un cambio de directores o funcionarios se informa mediante un aviso, no mediante artículos de modificación.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si el único cambio es la denominación social, nuestro ",
          { text: "servicio de cambio de denominación", href: "/services/change-name" },
          " está pensado para esa presentación. Una denominación propuesta puede verificarse con antelación mediante un ",
          { text: "informe de búsqueda de nombre NUANS", href: "/nuans" },
          ", y nuestra guía sobre ",
          { text: "la sociedad con nombre o numerada", href: "/guides/sociedad-con-nombre-o-numerada" },
          " explica las dos opciones.",
        ],
      },
    ],
    faqTitle: "Artículos de modificación: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de artículos de modificación; para asesoría sobre su situación particular, incluido el efecto fiscal de una reorganización accionaria, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Qué aprobación se necesita para modificar los estatutos?",
        a: "Una resolución especial de los accionistas, es decir, una resolución aprobada por al menos dos tercios de los votos emitidos, o firmada por todos los accionistas con derecho a voto. Algunas modificaciones, como un cambio en los derechos de una clase de acciones, también dan a esa clase un voto separado. La resolución se aprueba antes de presentar los artículos de modificación.",
      },
      {
        q: "¿Cuánto cuestan las tasas gubernamentales para modificar los estatutos?",
        a: "Corporations Canada cobra 200 $ por presentar artículos de modificación en línea. Algunas modificaciones federales son gratuitas, como agregar una versión en inglés o francés de la denominación o un cambio de denominación ordenado por Corporations Canada. Ontario cobra 150 $ por presentar artículos de modificación. Estas tasas gubernamentales son aparte de la tarifa de servicio de Korporex.",
      },
      {
        q: "¿Se necesita un informe NUANS para cambiar la denominación social?",
        a: "Sí, para una nueva denominación con palabras. En el ámbito federal, los artículos de modificación deben ir acompañados de un informe NUANS con fecha de no más de 90 días antes de que Corporations Canada los reciba; una denominación numerada no requiere informe. En Ontario, el cambio a una denominación que no sea numerada exige un informe NUANS orientado a Ontario.",
      },
      {
        q: "¿Se necesitan artículos de modificación para cambiar de directores?",
        a: "No para cambiar quiénes son los directores. Un cambio de directores o funcionarios se informa al registro mediante un aviso. Los artículos de modificación son necesarios cuando el cambio afecta algo que figura en los propios estatutos, como el número mínimo y máximo de directores, la estructura accionaria o la denominación social.",
      },
      {
        q: "¿Cuándo entra en vigor la modificación?",
        a: "En la fecha que figura en el certificado de modificación emitido por el registro. El formulario de pedido le pide la fecha de entrada en vigor que desea, que debe ser igual o posterior a la fecha de presentación. A partir de esa fecha, las disposiciones modificadas forman parte de los estatutos de la sociedad.",
      },
    ],
  },
};
