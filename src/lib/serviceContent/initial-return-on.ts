import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Ontario Initial Return order form. The form is
// a client wizard with almost no crawlable text, so this block carries the
// service intent ("file my Ontario Initial Return for me"); the annual returns
// guide keeps the informational intent. Contents mirror
// src/lib/complianceServices.ts and initialReturnOntarioSchema; the $0
// government fee mirrors src/lib/govFees.ts.
export const content: ServiceContentByLocale = {
  en: {
    title: "File your Ontario Initial Return online",
    blocks: [
      {
        type: "p",
        parts: [
          "Every corporation incorporated, amalgamated or continued under Ontario law must file an Initial Return under the Corporations Information Act within 60 days after that date. Korporex prepares the return from the information you give us and files it with the Ontario Business Registry within 2 business days. The government charges no fee for the Initial Return. For how the Initial Return fits with the yearly filings that follow, read our guide on ",
          { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Ontario (OBCA) corporations that incorporated on their own through the Ontario Business Registry and have not yet filed the Initial Return.",
          "Corporations that were amalgamated or continued under the OBCA, where the 60 days run from the date on the Articles of Amalgamation or Articles of Continuance.",
          "Owners who want the return filed for them rather than navigating the registry themselves.",
          "Corporations close to the 60-day deadline that want the filing handled quickly.",
        ],
      },
      {
        type: "p",
        parts: [
          "This service is for Ontario corporations only. A federal corporation files its annual return with Corporations Canada, and Ontario's filing rules for corporations incorporated outside Ontario are separate. Korporex incorporation packages already include the mandatory post-incorporation filings.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "p",
        parts: [
          "We prepare the Initial Return and file it with the Ontario Business Registry. You confirm the corporation's information as of the filing date: its registered office address and mailing address, the full slate of current directors and officers with their addresses and officer positions, and its principal business activity. The return reports the corporation's information as it stands on the date it is filed.",
        ],
      },
      { type: "h3", text: "What you need before you file" },
      {
        type: "list",
        items: [
          "The corporation's exact name, its Ontario corporation number and its date of incorporation, as shown on the Articles of Incorporation. The CRA business number is optional.",
          "The registered office address, and a mailing address if it is different.",
          "The name and address of every current director and officer, each officer's position and, optionally, the dates they were elected or appointed.",
          "The corporation's primary activity (NAICS code), a short description of what it does, and a contact person we can reach with questions.",
        ],
      },
      { type: "h3", text: "After filing" },
      {
        type: "p",
        parts: [
          "After the Initial Return, the Corporations Information Act requires a Notice of Change within 15 days after any change to the information on file, such as a new director or a new registered office, and an ",
          { text: "annual return", href: "/services/annual-return-on" },
          " every year. If the corporation also has no minute book yet, see our ",
          { text: "initial minute book service", href: "/services/initial-minute-book" },
          ".",
        ],
      },
    ],
    faqTitle: "Ontario Initial Return: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the Ontario Initial Return filing; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "When is the Ontario Initial Return due?",
        a: "Under section 2 of the Corporations Information Act, the Initial Return must be filed within 60 days after the date of incorporation, amalgamation or continuation of the corporation. The date of incorporation is the date shown on the Articles of Incorporation. The 60 days run from that date, not from the date the corporation starts doing business.",
      },
      {
        q: "Is there a government fee for the Initial Return?",
        a: "No. ServiceOntario charges $0 to file an Initial Return, whether it is filed online or by mail. The same is true of the Notice of Change and the Ontario annual return. The price shown in the form is the Korporex service fee for preparing and filing the return.",
      },
      {
        q: "Is the Initial Return the same as the annual return?",
        a: "No. The Initial Return is filed once, within 60 days of incorporation, to put the corporation's directors, officers and addresses on the public record. The annual return is filed every year afterwards to confirm or update that information. Neither one is a tax return; the corporation's tax filings with the CRA are separate.",
      },
      {
        q: "What happens if the Initial Return is not filed?",
        a: "Under section 241 of the OBCA, the Director can give notice to a corporation that has not complied with a filing requirement under the Corporations Information Act. If the corporation does not comply within 90 days of the notice, the Director can order the corporation dissolved.",
      },
      {
        q: "My corporation is federal. Does this service apply?",
        a: "No. This service covers corporations incorporated, amalgamated or continued under Ontario law. A federal corporation files its annual return with Corporations Canada, and Ontario's rules for corporations incorporated outside Ontario are separate from the Initial Return described here. If you are unsure which regime applies, the Articles or Certificate show the statute the corporation was created under.",
      },
    ],
  },
  fr: {
    title: "Déposez votre rapport initial de l'Ontario en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Toute société constituée, fusionnée ou prorogée en vertu des lois de l'Ontario doit déposer un rapport initial en vertu de la Loi sur les renseignements exigés des personnes morales dans les 60 jours suivant cette date. Korporex prépare le rapport à partir des renseignements que vous nous fournissez et le dépose auprès du Registre des entreprises de l'Ontario dans un délai de 2 jours ouvrables. Le gouvernement n'exige aucuns droits pour le rapport initial. Pour voir comment le rapport initial s'inscrit parmi les dépôts annuels qui suivent, lisez notre guide sur ",
          { text: "les déclarations annuelles des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés ontariennes (LSAO) constituées par leurs propriétaires auprès du Registre des entreprises de l'Ontario qui n'ont pas encore déposé le rapport initial.",
          "Les sociétés fusionnées ou prorogées en vertu de la LSAO, pour lesquelles les 60 jours courent à partir de la date figurant dans les statuts de fusion ou de prorogation.",
          "Les propriétaires qui préfèrent faire déposer le rapport pour eux plutôt que de naviguer eux-mêmes dans le registre.",
          "Les sociétés qui approchent de l'échéance de 60 jours et veulent que le dépôt soit fait rapidement.",
        ],
      },
      {
        type: "p",
        parts: [
          "Ce service s'adresse uniquement aux sociétés ontariennes. Une société fédérale dépose sa déclaration annuelle auprès de Corporations Canada, et les règles de dépôt de l'Ontario pour les sociétés constituées hors de l'Ontario sont distinctes. Les forfaits de constitution Korporex comprennent déjà les dépôts obligatoires postérieurs à la constitution.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Nous préparons le rapport initial et le déposons auprès du Registre des entreprises de l'Ontario. Vous confirmez les renseignements de la société à la date du dépôt : l'adresse de son siège social et son adresse postale, la liste complète des administrateurs et dirigeants actuels avec leurs adresses et les postes des dirigeants, ainsi que son activité principale. Le rapport présente les renseignements de la société tels qu'ils sont à la date du dépôt.",
        ],
      },
      { type: "h3", text: "Ce qu'il vous faut avant de déposer" },
      {
        type: "list",
        items: [
          "La dénomination exacte de la société, son numéro de société de l'Ontario et sa date de constitution, tels qu'ils figurent dans les statuts constitutifs. Le numéro d'entreprise de l'ARC est facultatif.",
          "L'adresse du siège social, et une adresse postale si elle est différente.",
          "Le nom et l'adresse de chaque administrateur et dirigeant actuel, le poste de chaque dirigeant et, de façon facultative, les dates de leur élection ou nomination.",
          "L'activité principale de la société (code SCIAN), une courte description de ce qu'elle fait, et une personne-ressource que nous pouvons joindre pour toute question.",
        ],
      },
      { type: "h3", text: "Après le dépôt" },
      {
        type: "p",
        parts: [
          "Après le rapport initial, la Loi sur les renseignements exigés des personnes morales exige un avis de modification dans les 15 jours suivant tout changement aux renseignements au dossier, comme un nouvel administrateur ou un nouveau siège social, ainsi qu'une ",
          { text: "déclaration annuelle", href: "/services/annual-return-on" },
          " chaque année. Si la société n'a pas encore de livre des procès-verbaux, consultez notre ",
          { text: "service de livre des procès-verbaux initial", href: "/services/initial-minute-book" },
          ".",
        ],
      },
    ],
    faqTitle: "Rapport initial de l'Ontario : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt du rapport initial de l'Ontario; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Quand le rapport initial de l'Ontario doit-il être déposé?",
        a: "En vertu de l'article 2 de la Loi sur les renseignements exigés des personnes morales, le rapport initial doit être déposé dans les 60 jours suivant la date de constitution, de fusion ou de prorogation de la société. La date de constitution est celle qui figure dans les statuts constitutifs. Les 60 jours courent à partir de cette date, et non de la date où la société commence ses activités.",
      },
      {
        q: "Y a-t-il des droits gouvernementaux pour le rapport initial?",
        a: "Non. ServiceOntario exige 0 $ pour le dépôt d'un rapport initial, en ligne ou par la poste. Il en va de même pour l'avis de modification et la déclaration annuelle de l'Ontario. Le prix affiché dans le formulaire correspond aux frais de service de Korporex pour la préparation et le dépôt du rapport.",
      },
      {
        q: "Le rapport initial est-il la même chose que la déclaration annuelle?",
        a: "Non. Le rapport initial est déposé une seule fois, dans les 60 jours suivant la constitution, pour inscrire au registre public les administrateurs, les dirigeants et les adresses de la société. La déclaration annuelle est déposée chaque année par la suite pour confirmer ou mettre à jour ces renseignements. Ni l'un ni l'autre n'est une déclaration de revenus; les dépôts fiscaux auprès de l'ARC sont distincts.",
      },
      {
        q: "Qu'arrive-t-il si le rapport initial n'est pas déposé?",
        a: "En vertu de l'article 241 de la LSAO, le directeur peut aviser une société qui ne s'est pas conformée à une exigence de dépôt prévue par la Loi sur les renseignements exigés des personnes morales. Si la société ne s'y conforme pas dans les 90 jours suivant l'avis, le directeur peut ordonner sa dissolution.",
      },
      {
        q: "Ma société est fédérale. Ce service s'applique-t-il?",
        a: "Non. Ce service vise les sociétés constituées, fusionnées ou prorogées en vertu des lois de l'Ontario. Une société fédérale dépose sa déclaration annuelle auprès de Corporations Canada, et les règles de l'Ontario pour les sociétés constituées hors de l'Ontario sont distinctes du rapport initial décrit ici. Les statuts ou le certificat indiquent la loi en vertu de laquelle la société a été constituée.",
      },
    ],
  },
  es: {
    title: "Presente su declaración inicial de Ontario en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Toda sociedad constituida, fusionada o continuada según las leyes de Ontario debe presentar una declaración inicial conforme a la Corporations Information Act dentro de los 60 días siguientes a esa fecha. Korporex prepara la declaración con la información que usted nos da y la presenta ante el Registro de Empresas de Ontario en un plazo de 2 días hábiles. El gobierno no cobra ninguna tasa por la declaración inicial. Para ver cómo encaja la declaración inicial con las presentaciones anuales que siguen, lea nuestra guía sobre ",
          { text: "las declaraciones anuales de las sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades de Ontario (OBCA) que se constituyeron por su cuenta en el Registro de Empresas de Ontario y aún no han presentado la declaración inicial.",
          "Sociedades fusionadas o continuadas según la OBCA, para las cuales los 60 días se cuentan desde la fecha que figura en los estatutos de fusión o de continuación.",
          "Propietarios que prefieren que se presente la declaración por ellos en lugar de navegar el registro por su cuenta.",
          "Sociedades cercanas al plazo de 60 días que quieren que la presentación se haga rápidamente.",
        ],
      },
      {
        type: "p",
        parts: [
          "Este servicio es solo para sociedades de Ontario. Una sociedad federal presenta su declaración anual ante Corporations Canada, y las reglas de presentación de Ontario para sociedades constituidas fuera de Ontario son distintas. Los paquetes de constitución de Korporex ya incluyen las presentaciones obligatorias posteriores a la constitución.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Preparamos la declaración inicial y la presentamos ante el Registro de Empresas de Ontario. Usted confirma la información de la sociedad a la fecha de presentación: la dirección de su domicilio social y su dirección postal, la lista completa de directores y funcionarios actuales con sus direcciones y los cargos de los funcionarios, y su actividad principal. La declaración refleja la información de la sociedad tal como está en la fecha en que se presenta.",
        ],
      },
      { type: "h3", text: "Qué necesita antes de presentar" },
      {
        type: "list",
        items: [
          "El nombre exacto de la sociedad, su número de sociedad de Ontario y su fecha de constitución, tal como figuran en los estatutos de constitución. El número de negocio de la CRA es opcional.",
          "La dirección del domicilio social, y una dirección postal si es distinta.",
          "El nombre y la dirección de cada director y funcionario actual, el cargo de cada funcionario y, de forma opcional, las fechas de su elección o nombramiento.",
          "La actividad principal de la sociedad (código NAICS), una breve descripción de lo que hace y una persona de contacto a quien podamos consultar.",
        ],
      },
      { type: "h3", text: "Después de la presentación" },
      {
        type: "p",
        parts: [
          "Después de la declaración inicial, la Corporations Information Act exige un aviso de cambio dentro de los 15 días siguientes a cualquier cambio en la información registrada, como un nuevo director o un nuevo domicilio social, y una ",
          { text: "declaración anual", href: "/services/annual-return-on" },
          " cada año. Si la sociedad todavía no tiene libro de actas, consulte nuestro ",
          { text: "servicio de libro de actas inicial", href: "/services/initial-minute-book" },
          ".",
        ],
      },
    ],
    faqTitle: "Declaración inicial de Ontario: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de la declaración inicial de Ontario; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Cuándo vence la declaración inicial de Ontario?",
        a: "Según el artículo 2 de la Corporations Information Act, la declaración inicial debe presentarse dentro de los 60 días siguientes a la fecha de constitución, fusión o continuación de la sociedad. La fecha de constitución es la que figura en los estatutos de constitución. Los 60 días se cuentan desde esa fecha, no desde que la sociedad empieza a operar.",
      },
      {
        q: "¿Hay una tasa gubernamental por la declaración inicial?",
        a: "No. ServiceOntario cobra $0 por presentar una declaración inicial, ya sea en línea o por correo. Lo mismo ocurre con el aviso de cambio y la declaración anual de Ontario. El precio que muestra el formulario es la tarifa de servicio de Korporex por preparar y presentar la declaración.",
      },
      {
        q: "¿La declaración inicial es lo mismo que la declaración anual?",
        a: "No. La declaración inicial se presenta una sola vez, dentro de los 60 días siguientes a la constitución, para inscribir en el registro público a los directores, los funcionarios y las direcciones de la sociedad. La declaración anual se presenta cada año a partir de entonces para confirmar o actualizar esa información. Ninguna de las dos es una declaración de impuestos; las presentaciones fiscales ante la CRA son aparte.",
      },
      {
        q: "¿Qué pasa si no se presenta la declaración inicial?",
        a: "Según el artículo 241 de la OBCA, el Director puede notificar a una sociedad que no cumplió con una obligación de presentación prevista en la Corporations Information Act. Si la sociedad no cumple dentro de los 90 días siguientes a la notificación, el Director puede ordenar su disolución.",
      },
      {
        q: "Mi sociedad es federal. ¿Se aplica este servicio?",
        a: "No. Este servicio cubre sociedades constituidas, fusionadas o continuadas según las leyes de Ontario. Una sociedad federal presenta su declaración anual ante Corporations Canada, y las reglas de Ontario para sociedades constituidas fuera de Ontario son distintas de la declaración inicial que se describe aquí. Los estatutos o el certificado indican la ley según la cual se creó la sociedad.",
      },
    ],
  },
};
