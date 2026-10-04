import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the combined Notice of Change order form.
// Service intent: "report several corporate changes at once, file it for me".
// Ontario: Form 1, Initial Return/Notice of Change, Corporations Information
// Act s.4 (15 days, $0). Federal: Form 3 (CBCA s.19(4)) and Form 6 (s.113).
export const content: ServiceContentByLocale = {
  en: {
    title: "File a notice of change for your corporation",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files a combined notice of change when an Ontario (OBCA) or federal (CBCA) corporation has more than one update to report at the same time: a new registered office, a new mailing address, and changes to its directors or officers. You select what is changing and give us the details in one order, and we file everything with the Ontario Business Registry or Corporations Canada. For a single change, our dedicated ",
          { text: "change of director or officer", href: "/services/change-director" },
          " and ",
          { text: "address change", href: "/services/change-address" },
          " services cover it.",
        ],
      },
      { type: "h3", text: "What a notice of change is" },
      {
        type: "p",
        parts: [
          "Under Ontario's Corporations Information Act, every corporation must file a notice of change for every change in the information it has filed, within 15 days after the change takes place. The filing is made on Form 1, Initial Return/Notice of Change, through the Ontario Business Registry, and it keeps the public record of the corporation's registered office address, mailing address, directors and officers accurate. Federal corporations report the same kinds of changes to Corporations Canada on separate forms: Form 3 for the registered office address and Form 6 for directors.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Corporations going through a reorganization, where a director leaves, another joins and the office moves.",
          "Ontario corporations updating several entries at once, such as a new officer and a new mailing address.",
          "Corporations that have let several changes pile up and want them reported in a single order.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "list",
        items: [
          "Ontario corporations: one notice of change under the Corporations Information Act covering the registered office address, the mailing address and the director and officer changes you select.",
          "Federal corporations: Form 3 for a new registered office address and Form 6 for director changes, filed together with Corporations Canada.",
          "You confirm the new information, the effective date of each change, and that each change was approved within the corporation as its articles, by-laws and the governing statute require.",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's exact legal name and its corporation number (federal) or Ontario Corporation Number (OCN).",
          "Any new registered office address, and any new mailing address for an Ontario corporation.",
          "For each director or officer change: full name, residential address, role, officer position if any, and effective date.",
        ],
      },
      { type: "h3", text: "Deadlines and government fees" },
      {
        type: "p",
        parts: [
          "In Ontario, the notice of change is due within 15 days after the change. Federally, the CBCA requires notice within 15 days of a change of registered office address and within 15 days after a change among the directors. ServiceOntario lists the notice of change at $0, and Corporations Canada does not charge a fee for Form 3 or Form 6. A notice of change is separate from the annual return, which confirms the corporation's information once a year; our guide to ",
          { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" },
          " covers that filing.",
        ],
      },
    ],
    faqTitle: "Notice of change: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about notice of change filings; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "What is the difference between a notice of change and an annual return?",
        a: "A notice of change reports a specific change, such as a new director or a new registered office, within 15 days after it happens. An annual return is filed once a year and confirms the corporation's information as of that date. Waiting for the annual return does not satisfy the 15-day deadline for a change made during the year.",
      },
      {
        q: "Which changes does an Ontario notice of change cover?",
        a: "It updates the information filed under the Corporations Information Act, including the registered office address, the mailing address, and the corporation's directors and officers. The Act lists exceptions: no notice is needed for a director's retirement and re-election for the next term, or when an Ontario corporation changes only its name, which is done by Articles of Amendment.",
      },
      {
        q: "Is there a government fee for a notice of change?",
        a: "No. ServiceOntario lists the Initial Return/Notice of Change for an Ontario corporation at $0, whether filed online or by mail. Corporations Canada does not charge a fee for Form 3, Change of Registered Office Address, or Form 6, Changes Regarding Directors. Only the Korporex service fee applies to this order.",
      },
      {
        q: "Can several changes go in one notice?",
        a: "Yes. Under the Corporations Information Act, a notice of change specifies the changes that have taken place and the date of each one, so a new registered office, a new mailing address and several director or officer changes can be reported together. For a federal corporation, the address and director changes go on Form 3 and Form 6 respectively.",
      },
    ],
  },
  fr: {
    title: "Déposez un avis de modification pour votre société",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose un avis de modification combiné lorsqu'une société ontarienne (LSAO) ou fédérale (LCSA) a plus d'un changement à déclarer en même temps : un nouveau siège social, une nouvelle adresse postale et des changements à ses administrateurs ou dirigeants. Vous sélectionnez ce qui change et nous transmettez les détails dans une seule commande, et nous déposons le tout auprès du Registre des entreprises de l'Ontario ou de Corporations Canada. Pour un seul changement, nos services dédiés de ",
          { text: "changement d'administrateur ou de dirigeant", href: "/services/change-director" },
          " et de ",
          { text: "changement d'adresse", href: "/services/change-address" },
          " s'en chargent.",
        ],
      },
      { type: "h3", text: "Qu'est-ce qu'un avis de modification" },
      {
        type: "p",
        parts: [
          "En vertu de la Loi sur les renseignements exigés des personnes morales de l'Ontario, chaque société doit déposer un avis de modification pour tout changement dans les renseignements qu'elle a déposés, dans les 15 jours suivant le changement. Le dépôt se fait au moyen de la formule 1, Rapport initial/Avis de modification, par l'entremise du Registre des entreprises de l'Ontario, et il maintient à jour le registre public de l'adresse du siège social, de l'adresse postale, des administrateurs et des dirigeants de la société. Les sociétés fédérales déclarent les mêmes types de changements à Corporations Canada sur des formulaires distincts : le formulaire 3 pour l'adresse du siège social et le formulaire 6 pour les administrateurs.",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés en réorganisation, où un administrateur part, un autre arrive et le siège social déménage.",
          "Les sociétés ontariennes qui mettent à jour plusieurs renseignements à la fois, comme un nouveau dirigeant et une nouvelle adresse postale.",
          "Les sociétés qui ont accumulé plusieurs changements et veulent les déclarer en une seule commande.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "list",
        items: [
          "Sociétés ontariennes : un seul avis de modification en vertu de la Loi sur les renseignements exigés des personnes morales, couvrant l'adresse du siège social, l'adresse postale et les changements d'administrateurs et de dirigeants que vous sélectionnez.",
          "Sociétés fédérales : le formulaire 3 pour une nouvelle adresse de siège social et le formulaire 6 pour les changements d'administrateurs, déposés ensemble auprès de Corporations Canada.",
          "Vous confirmez les nouveaux renseignements, la date de prise d'effet de chaque changement et l'approbation de chaque changement au sein de la société, comme l'exigent ses statuts, ses règlements administratifs et la loi applicable.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale exacte de la société et son numéro de société (fédéral) ou son numéro de société de l'Ontario (OCN).",
          "Toute nouvelle adresse de siège social, et toute nouvelle adresse postale pour une société ontarienne.",
          "Pour chaque changement d'administrateur ou de dirigeant : nom complet, adresse résidentielle, rôle, poste de dirigeant le cas échéant et date de prise d'effet.",
        ],
      },
      { type: "h3", text: "Délais et droits gouvernementaux" },
      {
        type: "p",
        parts: [
          "En Ontario, l'avis de modification doit être déposé dans les 15 jours suivant le changement. Au fédéral, la LCSA exige un avis dans les 15 jours suivant un changement d'adresse du siège social et dans les 15 jours suivant un changement parmi les administrateurs. ServiceOntario indique 0 $ pour l'avis de modification, et Corporations Canada n'exige aucuns droits pour les formulaires 3 et 6. L'avis de modification est distinct de la déclaration annuelle, qui confirme les renseignements de la société une fois par année; notre guide sur ",
          { text: "les déclarations annuelles des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" },
          " traite de ce dépôt.",
        ],
      },
    ],
    faqTitle: "Avis de modification : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt d'un avis de modification; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Quelle est la différence entre un avis de modification et une déclaration annuelle?",
        a: "Un avis de modification déclare un changement précis, comme un nouvel administrateur ou un nouveau siège social, dans les 15 jours suivant ce changement. La déclaration annuelle est déposée une fois par année et confirme les renseignements de la société à cette date. Attendre la déclaration annuelle ne respecte pas le délai de 15 jours applicable à un changement survenu en cours d'année.",
      },
      {
        q: "Quels changements un avis de modification ontarien couvre-t-il?",
        a: "Il met à jour les renseignements déposés en vertu de la Loi sur les renseignements exigés des personnes morales, notamment l'adresse du siège social, l'adresse postale ainsi que les administrateurs et les dirigeants de la société. La Loi prévoit des exceptions : aucun avis n'est requis pour le départ à la retraite d'un administrateur suivi de sa réélection, ni lorsqu'une société ontarienne change seulement sa dénomination, ce qui se fait par statuts de modification.",
      },
      {
        q: "Y a-t-il des droits gouvernementaux pour un avis de modification?",
        a: "Non. ServiceOntario indique 0 $ pour le rapport initial/avis de modification d'une société ontarienne, qu'il soit déposé en ligne ou par la poste. Corporations Canada n'exige aucuns droits pour le formulaire 3, Changement d'adresse du siège social, ni pour le formulaire 6, Changements concernant les administrateurs. Seuls les frais de service de Korporex s'appliquent à cette commande.",
      },
      {
        q: "Plusieurs changements peuvent-ils figurer dans un seul avis?",
        a: "Oui. En vertu de la Loi sur les renseignements exigés des personnes morales, l'avis de modification précise les changements survenus et la date de chacun, de sorte qu'un nouveau siège social, une nouvelle adresse postale et plusieurs changements d'administrateurs ou de dirigeants peuvent être déclarés ensemble. Pour une société fédérale, les changements d'adresse et d'administrateurs vont respectivement sur les formulaires 3 et 6.",
      },
    ],
  },
  es: {
    title: "Presente un aviso de cambio para su sociedad",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta un aviso de cambio combinado cuando una sociedad de Ontario (OBCA) o federal (CBCA) tiene más de una actualización que informar al mismo tiempo: un nuevo domicilio social, una nueva dirección postal y cambios en sus directores o funcionarios. Usted selecciona qué cambia y nos da los detalles en un solo pedido, y nosotros presentamos todo ante el Registro de Empresas de Ontario o Corporations Canada. Para un solo cambio, nuestros servicios específicos de ",
          { text: "cambio de director o funcionario", href: "/services/change-director" },
          " y de ",
          { text: "cambio de domicilio", href: "/services/change-address" },
          " lo cubren.",
        ],
      },
      { type: "h3", text: "Qué es un aviso de cambio" },
      {
        type: "p",
        parts: [
          "Según la Ley de Información de Sociedades (Corporations Information Act) de Ontario, toda sociedad debe presentar un aviso de cambio por cada cambio en la información que ha presentado, dentro de los 15 días siguientes al cambio. La presentación se hace con el Formulario 1, Declaración inicial/Aviso de cambio, a través del Registro de Empresas de Ontario, y mantiene al día el registro público del domicilio social, la dirección postal, los directores y los funcionarios de la sociedad. Las sociedades federales informan los mismos tipos de cambios a Corporations Canada en formularios separados: el Formulario 3 para el domicilio social y el Formulario 6 para los directores.",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades en reorganización, donde un director sale, otro entra y la oficina se muda.",
          "Sociedades de Ontario que actualizan varios datos a la vez, como un nuevo funcionario y una nueva dirección postal.",
          "Sociedades que acumularon varios cambios y quieren informarlos en un solo pedido.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "list",
        items: [
          "Sociedades de Ontario: un solo aviso de cambio según la Ley de Información de Sociedades, que abarca el domicilio social, la dirección postal y los cambios de directores y funcionarios que usted seleccione.",
          "Sociedades federales: el Formulario 3 para un nuevo domicilio social y el Formulario 6 para cambios de directores, presentados juntos ante Corporations Canada.",
          "Usted confirma la nueva información, la fecha de entrada en vigor de cada cambio y que cada cambio se aprobó dentro de la sociedad como lo exigen sus estatutos, sus estatutos internos y la ley aplicable.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal exacta de la sociedad y su número de sociedad (federal) o su número de sociedad de Ontario (OCN).",
          "Cualquier nuevo domicilio social, y cualquier nueva dirección postal para una sociedad de Ontario.",
          "Para cada cambio de director o funcionario: nombre completo, dirección residencial, función, cargo de funcionario si corresponde y fecha de entrada en vigor.",
        ],
      },
      { type: "h3", text: "Plazos y tarifas gubernamentales" },
      {
        type: "p",
        parts: [
          "En Ontario, el aviso de cambio debe presentarse dentro de los 15 días siguientes al cambio. A nivel federal, la CBCA exige el aviso dentro de los 15 días siguientes a un cambio de domicilio social y dentro de los 15 días siguientes a un cambio entre los directores. ServiceOntario indica $0 para el aviso de cambio, y Corporations Canada no cobra tarifa por los Formularios 3 y 6. El aviso de cambio es distinto de la declaración anual, que confirma la información de la sociedad una vez al año; nuestra guía sobre ",
          { text: "las declaraciones anuales de sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" },
          " trata esa presentación.",
        ],
      },
    ],
    faqTitle: "Aviso de cambio: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de un aviso de cambio; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Cuál es la diferencia entre un aviso de cambio y una declaración anual?",
        a: "Un aviso de cambio informa un cambio concreto, como un nuevo director o un nuevo domicilio social, dentro de los 15 días siguientes a que ocurra. La declaración anual se presenta una vez al año y confirma la información de la sociedad a esa fecha. Esperar a la declaración anual no cumple el plazo de 15 días aplicable a un cambio hecho durante el año.",
      },
      {
        q: "¿Qué cambios abarca un aviso de cambio de Ontario?",
        a: "Actualiza la información presentada según la Ley de Información de Sociedades, incluidos el domicilio social, la dirección postal y los directores y funcionarios de la sociedad. La Ley prevé excepciones: no se requiere aviso por el retiro de un director y su reelección para el siguiente mandato, ni cuando una sociedad de Ontario cambia solo su denominación, lo que se hace mediante estatutos de modificación.",
      },
      {
        q: "¿Hay una tarifa gubernamental por un aviso de cambio?",
        a: "No. ServiceOntario indica $0 para la Declaración inicial/Aviso de cambio de una sociedad de Ontario, ya sea en línea o por correo. Corporations Canada no cobra tarifa por el Formulario 3, Cambio de domicilio social, ni por el Formulario 6, Cambios relativos a los directores. A este pedido solo se aplica la tarifa de servicio de Korporex.",
      },
      {
        q: "¿Se pueden incluir varios cambios en un solo aviso?",
        a: "Sí. Según la Ley de Información de Sociedades, el aviso de cambio especifica los cambios ocurridos y la fecha de cada uno, por lo que un nuevo domicilio social, una nueva dirección postal y varios cambios de directores o funcionarios pueden informarse juntos. Para una sociedad federal, los cambios de domicilio y de directores van en los Formularios 3 y 6, respectivamente.",
      },
    ],
  },
};
