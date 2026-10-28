import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Corporation Profile Report order form.
// Service intent: "get me the official registry record for this corporation".
// Field list per ontario.ca/page/guide-corporation-profile-report; government
// fee per ontario.ca/page/cost-time-required-to-register-change-search-for-business-name-corporation-not-for-profit
// (Profile Report $8, Certificate of Status $26).
export const content: ServiceContentByLocale = {
  en: {
    title: "Get a corporation profile report from the Ontario Business Registry",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex orders the Corporation Profile Report for an Ontario (OBCA) corporation, or for a federal (CBCA) corporation active in Ontario, and emails it to you as a PDF. You give us the corporation's name, and its number if you have it. The price is a flat $19.99 with the government fee included and no tax added.",
        ],
      },
      { type: "h3", text: "What the report shows" },
      {
        type: "list",
        items: [
          "Ontario corporation number, corporation name, type and status.",
          "Incorporation or amalgamation date, and jurisdiction.",
          "Registered office and mailing addresses.",
          "For Ontario corporations, the active directors and officers on the public record.",
          "Corporate name history and whether business names are registered.",
        ],
      },
      { type: "h3", text: "When you might need one" },
      {
        type: "list",
        items: [
          "Opening a business bank account or applying for a loan.",
          "Signing a commercial lease or a major supplier contract.",
          "Checking a company before you buy it, invest in it or do business with it.",
          "Confirming what the registry has on file before an annual return.",
        ],
      },
      {
        type: "p",
        parts: [
          "If the report shows outdated directors or addresses, our ",
          { text: "notice of change", href: "/services/notice-of-change" },
          " and ",
          { text: "Ontario annual return", href: "/services/annual-return-on" },
          " services can bring the record up to date.",
        ],
      },
    ],
    faqTitle: "Corporation profile report: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about corporation profile reports; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Can I order a profile report for a corporation I don't own?",
        a: "Yes. The report reflects the public record held by the Ontario Business Registry, so you can order one for any corporation on the registry, not only your own.",
      },
      {
        q: "Does the report list shareholders?",
        a: "No. The Ontario profile report covers the corporation's details, addresses, and directors and officers. Shareholders are recorded in the corporation's own minute book, not on the public registry.",
      },
      {
        q: "What does it show for a federal corporation?",
        a: "Only the basic information the federal corporation filed in Ontario. The report does not list its directors or officers, and its status refers you to Corporations Canada, which holds the federal record.",
      },
      {
        q: "Is a profile report the same as a certificate of status?",
        a: "No. A certificate of status is a separate registry product that certifies whether the corporation is active. The profile report is a broader snapshot of the corporation's public record as of the date it is ordered.",
      },
      {
        q: "How do I receive the report?",
        a: "We email the PDF to the email address you enter in the order form.",
      },
    ],
  },
  fr: {
    title: "Obtenez un rapport de profil de société du Registre des entreprises de l'Ontario",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex commande le rapport de profil d'une société ontarienne (LSAO), ou d'une société fédérale (LCSA) active en Ontario, et vous l'envoie par courriel en format PDF. Vous nous indiquez la dénomination de la société, et son numéro si vous l'avez. Le prix est de 19,99 $ forfaitaire, droits gouvernementaux inclus et sans taxe ajoutée.",
        ],
      },
      { type: "h3", text: "Ce que contient le rapport" },
      {
        type: "list",
        items: [
          "Le numéro de société de l'Ontario, la dénomination, le type et le statut de la société.",
          "La date de constitution ou de fusion, et la compétence.",
          "Les adresses du siège social et de correspondance.",
          "Pour les sociétés ontariennes, les administrateurs et dirigeants actifs inscrits au registre public.",
          "L'historique des dénominations et l'existence de noms commerciaux enregistrés.",
        ],
      },
      { type: "h3", text: "Quand en avez-vous besoin?" },
      {
        type: "list",
        items: [
          "Pour ouvrir un compte bancaire d'entreprise ou demander un prêt.",
          "Pour signer un bail commercial ou un contrat important avec un fournisseur.",
          "Pour vérifier une société avant de l'acheter, d'y investir ou de faire affaire avec elle.",
          "Pour confirmer les renseignements inscrits au registre avant une déclaration annuelle.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si le rapport montre des administrateurs ou des adresses périmés, nos services d'",
          { text: "avis de modification", href: "/services/notice-of-change" },
          " et de ",
          { text: "déclaration annuelle de l'Ontario", href: "/services/annual-return-on" },
          " permettent de mettre le dossier à jour.",
        ],
      },
    ],
    faqTitle: "Rapport de profil de société : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur les rapports de profil de société; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Puis-je commander le rapport d'une société qui ne m'appartient pas?",
        a: "Oui. Le rapport reflète le dossier public tenu par le Registre des entreprises de l'Ontario; vous pouvez donc le commander pour toute société inscrite au registre, pas seulement la vôtre.",
      },
      {
        q: "Le rapport indique-t-il les actionnaires?",
        a: "Non. Le rapport de profil de l'Ontario porte sur les renseignements de la société, ses adresses ainsi que ses administrateurs et dirigeants. Les actionnaires sont inscrits dans le registre des procès-verbaux de la société, et non au registre public.",
      },
      {
        q: "Que contient-il pour une société fédérale?",
        a: "Seulement les renseignements de base que la société fédérale a déposés en Ontario. Le rapport n'énumère pas ses administrateurs ni ses dirigeants, et son statut renvoie à Corporations Canada, qui tient le dossier fédéral.",
      },
      {
        q: "Le rapport de profil est-il la même chose qu'un certificat de statut?",
        a: "Non. Le certificat de statut est un produit distinct du registre qui atteste si la société est active. Le rapport de profil donne un portrait plus large du dossier public de la société à la date de la commande.",
      },
      {
        q: "Comment vais-je recevoir le rapport?",
        a: "Nous envoyons le PDF à l'adresse courriel que vous indiquez dans le formulaire de commande.",
      },
    ],
  },
  es: {
    title: "Obtenga un informe de perfil corporativo del Registro de Empresas de Ontario",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex solicita el informe de perfil (Corporation Profile Report) de una corporación de Ontario (OBCA), o de una corporación federal (CBCA) activa en Ontario, y se lo envía por correo electrónico en PDF. Usted nos indica el nombre de la corporación y su número, si lo tiene. El precio es una tarifa fija de 19,99 $, con la tasa gubernamental incluida y sin impuestos añadidos.",
        ],
      },
      { type: "h3", text: "Qué muestra el informe" },
      {
        type: "list",
        items: [
          "Número de corporación de Ontario, nombre, tipo y estado de la corporación.",
          "Fecha de constitución o fusión, y jurisdicción.",
          "Domicilio social y dirección postal.",
          "En el caso de las corporaciones de Ontario, los directores y funcionarios activos inscritos en el registro público.",
          "Historial de nombres de la corporación y si tiene nombres comerciales registrados.",
        ],
      },
      { type: "h3", text: "Cuándo podría necesitarlo" },
      {
        type: "list",
        items: [
          "Para abrir una cuenta bancaria empresarial o solicitar un préstamo.",
          "Para firmar un arrendamiento comercial o un contrato importante con un proveedor.",
          "Para verificar una empresa antes de comprarla, invertir en ella o hacer negocios con ella.",
          "Para confirmar la información registrada antes de una declaración anual.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si el informe muestra directores o direcciones desactualizados, nuestros servicios de ",
          { text: "aviso de cambio", href: "/services/notice-of-change" },
          " y de ",
          { text: "declaración anual de Ontario", href: "/services/annual-return-on" },
          " permiten actualizar el registro.",
        ],
      },
    ],
    faqTitle: "Informe de perfil corporativo: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre los informes de perfil corporativo; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Puedo solicitar el informe de una corporación que no es mía?",
        a: "Sí. El informe refleja el registro público que mantiene el Registro de Empresas de Ontario, por lo que puede solicitarlo para cualquier corporación inscrita, no solo la suya.",
      },
      {
        q: "¿El informe incluye a los accionistas?",
        a: "No. El informe de perfil de Ontario abarca los datos de la corporación, sus direcciones y sus directores y funcionarios. Los accionistas constan en el libro de actas de la propia corporación, no en el registro público.",
      },
      {
        q: "¿Qué muestra para una corporación federal?",
        a: "Solo la información básica que la corporación federal presentó en Ontario. El informe no enumera sus directores ni funcionarios, y su estado remite a Corporations Canada, que mantiene el registro federal.",
      },
      {
        q: "¿Es lo mismo un informe de perfil que un certificado de estado?",
        a: "No. El certificado de estado (Certificate of Status) es un producto distinto del registro que certifica si la corporación está activa. El informe de perfil ofrece una visión más amplia del registro público de la corporación a la fecha de la solicitud.",
      },
      {
        q: "¿Cómo recibiré el informe?",
        a: "Enviamos el PDF al correo electrónico que indique en el formulario de pedido.",
      },
    ],
  },
};
