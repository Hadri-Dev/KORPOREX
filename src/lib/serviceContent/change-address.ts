import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the registered office address change order form.
// Service intent: "change my corporation's registered office address, file it
// for me". Federal: Form 3 (CBCA s.19). Ontario: notice of change under the
// Corporations Information Act (s.4), with the OBCA s.14 resolution rules.
export const content: ServiceContentByLocale = {
  en: {
    title: "Change your corporation's registered office address",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files the change of registered office address for Ontario (OBCA) and federal (CBCA) corporations. You tell us which corporation is moving, the new address and the date it takes effect, and we file the change with Corporations Canada or the Ontario Business Registry. Ontario corporations can also update their mailing address in the same order. The registered office address is also confirmed every year on the annual return, which our guide to ",
          { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" },
          " explains.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Corporations moving to a new office, or whose owner has moved home when the home address was the registered office.",
          "Ontario corporations that need to update their mailing address, with or without a registered office change.",
          "Corporations replacing an old address that no longer receives the corporation's mail.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "p",
        parts: [
          "For a federal corporation, we file Form 3, Change of Registered Office Address, with Corporations Canada. For an Ontario corporation, we file a notice of change under the Corporations Information Act, which updates the registered office address, the mailing address, or both. You confirm the new address and the effective date, and that the change has been approved within the corporation as the statute requires.",
        ],
      },
      { type: "h3", text: "Rules that apply to the new address" },
      {
        type: "list",
        items: [
          "Federal: the registered office must be in the province named in the articles, and it cannot be a post office box. The directors can move it anywhere within that province.",
          "Federal: moving the registered office to another province requires Articles of Amendment, not just Form 3.",
          "Ontario: the registered office must be in Ontario. Under the OBCA, the directors can move it within the same municipality or geographic township by resolution; a move to another municipality in Ontario requires a special resolution of the shareholders.",
        ],
      },
      {
        type: "p",
        parts: [
          "If the province named in a federal corporation's articles has to change, that is done with ",
          { text: "Articles of Amendment", href: "/services/articles-amendment" },
          ". If the address is changing at the same time as directors or officers, the combined ",
          { text: "Notice of Change", href: "/services/notice-of-change" },
          " covers several changes in one filing.",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's exact legal name and its corporation number (federal) or Ontario Corporation Number (OCN).",
          "The complete new street address, and the new mailing address if an Ontario corporation is changing it.",
          "The date the new address takes effect.",
        ],
      },
      { type: "h3", text: "Deadlines and government fees" },
      {
        type: "p",
        parts: [
          "The CBCA requires notice to Corporations Canada within 15 days of a change of registered office address. The Corporations Information Act requires an Ontario corporation to file a notice of change within 15 days after the change takes place. Neither registry charges a government fee for this filing.",
        ],
      },
    ],
    faqTitle: "Changing a registered office address: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the change of registered office filing; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "How long do I have to report a new registered office address?",
        a: "Fifteen days in both cases. A federal corporation must send the notice to Corporations Canada within 15 days of the change of address, and an Ontario corporation must file a notice of change within 15 days after the change takes place. The effective date you give us is the date the new address takes effect.",
      },
      {
        q: "Can a federal corporation move its registered office to another province?",
        a: "Not with Form 3 alone. Form 3 changes the address within the province named in the articles. To move the registered office to a different province, the articles must first be amended to name the new province, which requires Articles of Amendment approved by special resolution of the shareholders.",
      },
      {
        q: "Can the registered office be a post office box?",
        a: "Not for a federal corporation: Corporations Canada describes the registered office as the corporation's legal address and states that it cannot be a post office box. An Ontario corporation's registered office must be at a location in Ontario. A separate mailing address can be filed for an Ontario corporation.",
      },
      {
        q: "Is there a government fee to change the address?",
        a: "No. Corporations Canada does not charge a fee to file a change of registered office address, and ServiceOntario lists the notice of change for an Ontario corporation at $0. The government filing is free in both jurisdictions; only the Korporex service fee applies to this order.",
      },
      {
        q: "Who approves a change of registered office?",
        a: "For a federal corporation, the CBCA lets the directors change the address within the province named in the articles. For an Ontario corporation, the OBCA lets the directors move the registered office within the same municipality or geographic township by resolution, while a move to another municipality in Ontario requires a special resolution of the shareholders.",
      },
    ],
  },
  fr: {
    title: "Changez l'adresse du siège social de votre société",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose le changement d'adresse du siège social des sociétés ontariennes (LSAO) et fédérales (LCSA). Vous nous indiquez la société visée, la nouvelle adresse et la date à laquelle elle prend effet, et nous déposons le changement auprès de Corporations Canada ou du Registre des entreprises de l'Ontario. Les sociétés ontariennes peuvent aussi mettre à jour leur adresse postale dans la même commande. L'adresse du siège social est aussi confirmée chaque année dans la déclaration annuelle, comme l'explique notre guide sur ",
          { text: "les déclarations annuelles des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés qui déménagent dans de nouveaux locaux, ou dont le propriétaire a déménagé alors que son domicile servait de siège social.",
          "Les sociétés ontariennes qui doivent mettre à jour leur adresse postale, avec ou sans changement de siège social.",
          "Les sociétés qui remplacent une ancienne adresse où elles ne reçoivent plus leur courrier.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Pour une société fédérale, nous déposons le formulaire 3, Changement d'adresse du siège social, auprès de Corporations Canada. Pour une société ontarienne, nous déposons un avis de modification en vertu de la Loi sur les renseignements exigés des personnes morales, qui met à jour l'adresse du siège social, l'adresse postale, ou les deux. Vous confirmez la nouvelle adresse et la date de prise d'effet, ainsi que l'approbation du changement au sein de la société, comme l'exige la loi.",
        ],
      },
      { type: "h3", text: "Règles applicables à la nouvelle adresse" },
      {
        type: "list",
        items: [
          "Société fédérale : le siège social doit se trouver dans la province indiquée dans les statuts et ne peut pas être une case postale. Les administrateurs peuvent le déplacer n'importe où dans cette province.",
          "Société fédérale : le déplacement du siège social dans une autre province exige des statuts de modification, et non seulement le formulaire 3.",
          "Société ontarienne : le siège social doit se trouver en Ontario. En vertu de la LSAO, les administrateurs peuvent le déplacer dans la même municipalité ou le même canton géographique par résolution; un déplacement vers une autre municipalité de l'Ontario exige une résolution spéciale des actionnaires.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si la province indiquée dans les statuts d'une société fédérale doit changer, cela se fait au moyen de ",
          { text: "statuts de modification", href: "/services/articles-amendment" },
          ". Si l'adresse change en même temps que les administrateurs ou les dirigeants, l'",
          { text: "avis de modification combiné", href: "/services/notice-of-change" },
          " regroupe plusieurs changements en un seul dépôt.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale exacte de la société et son numéro de société (fédéral) ou son numéro de société de l'Ontario (OCN).",
          "La nouvelle adresse municipale complète, et la nouvelle adresse postale si une société ontarienne la modifie.",
          "La date de prise d'effet de la nouvelle adresse.",
        ],
      },
      { type: "h3", text: "Délais et droits gouvernementaux" },
      {
        type: "p",
        parts: [
          "La LCSA exige d'aviser Corporations Canada dans les 15 jours suivant un changement d'adresse du siège social. La Loi sur les renseignements exigés des personnes morales exige qu'une société ontarienne dépose un avis de modification dans les 15 jours suivant le changement. Aucun des deux registres n'exige de droits gouvernementaux pour ce dépôt.",
        ],
      },
    ],
    faqTitle: "Changer l'adresse du siège social : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt d'un changement d'adresse du siège social; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "De combien de temps dispose-t-on pour déclarer une nouvelle adresse de siège social?",
        a: "Quinze jours dans les deux cas. Une société fédérale doit envoyer l'avis à Corporations Canada dans les 15 jours suivant le changement d'adresse, et une société ontarienne doit déposer un avis de modification dans les 15 jours suivant le changement. La date de prise d'effet que vous nous indiquez est celle où la nouvelle adresse s'applique.",
      },
      {
        q: "Une société fédérale peut-elle déplacer son siège social dans une autre province?",
        a: "Pas avec le seul formulaire 3. Ce formulaire change l'adresse à l'intérieur de la province indiquée dans les statuts. Pour déplacer le siège social dans une autre province, il faut d'abord modifier les statuts pour y indiquer la nouvelle province, au moyen de statuts de modification approuvés par résolution spéciale des actionnaires.",
      },
      {
        q: "Le siège social peut-il être une case postale?",
        a: "Pas pour une société fédérale : Corporations Canada définit le siège social comme l'adresse légale de la société et précise qu'il ne peut pas s'agir d'une case postale. Le siège social d'une société ontarienne doit se trouver à un emplacement en Ontario. Une société ontarienne peut déclarer une adresse postale distincte.",
      },
      {
        q: "Y a-t-il des droits gouvernementaux pour changer l'adresse?",
        a: "Non. Corporations Canada n'exige aucuns droits pour le dépôt d'un changement d'adresse du siège social, et ServiceOntario indique 0 $ pour l'avis de modification d'une société ontarienne. Le dépôt gouvernemental est gratuit dans les deux compétences; seuls les frais de service de Korporex s'appliquent à cette commande.",
      },
      {
        q: "Qui approuve un changement de siège social?",
        a: "Pour une société fédérale, la LCSA permet aux administrateurs de changer l'adresse à l'intérieur de la province indiquée dans les statuts. Pour une société ontarienne, la LSAO permet aux administrateurs de déplacer le siège social dans la même municipalité ou le même canton géographique par résolution, alors qu'un déplacement vers une autre municipalité de l'Ontario exige une résolution spéciale des actionnaires.",
      },
    ],
  },
  es: {
    title: "Cambie el domicilio social de su sociedad",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta el cambio de domicilio social de sociedades de Ontario (OBCA) y federales (CBCA). Usted nos indica qué sociedad se muda, la nueva dirección y la fecha en que entra en vigor, y nosotros presentamos el cambio ante Corporations Canada o el Registro de Empresas de Ontario. Las sociedades de Ontario también pueden actualizar su dirección postal en el mismo pedido. El domicilio social también se confirma cada año en la declaración anual, como explica nuestra guía sobre ",
          { text: "las declaraciones anuales de sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades que se mudan a una nueva oficina, o cuyo propietario se mudó cuando su domicilio particular era el domicilio social.",
          "Sociedades de Ontario que necesitan actualizar su dirección postal, con o sin cambio de domicilio social.",
          "Sociedades que reemplazan una dirección antigua donde ya no reciben su correo.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Para una sociedad federal, presentamos el Formulario 3, Cambio de domicilio social, ante Corporations Canada. Para una sociedad de Ontario, presentamos un aviso de cambio en virtud de la Ley de Información de Sociedades (Corporations Information Act), que actualiza el domicilio social, la dirección postal o ambos. Usted confirma la nueva dirección y la fecha de entrada en vigor, y que el cambio se aprobó dentro de la sociedad como lo exige la ley.",
        ],
      },
      { type: "h3", text: "Reglas que se aplican a la nueva dirección" },
      {
        type: "list",
        items: [
          "Sociedad federal: el domicilio social debe estar en la provincia indicada en los estatutos y no puede ser un apartado postal. Los directores pueden trasladarlo a cualquier lugar dentro de esa provincia.",
          "Sociedad federal: trasladar el domicilio social a otra provincia requiere estatutos de modificación, no solo el Formulario 3.",
          "Sociedad de Ontario: el domicilio social debe estar en Ontario. Según la OBCA, los directores pueden trasladarlo dentro del mismo municipio o municipio geográfico mediante una resolución; un traslado a otro municipio de Ontario requiere una resolución especial de los accionistas.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si debe cambiar la provincia indicada en los estatutos de una sociedad federal, eso se hace con ",
          { text: "estatutos de modificación", href: "/services/articles-amendment" },
          ". Si la dirección cambia al mismo tiempo que los directores o funcionarios, el ",
          { text: "Aviso de Cambio combinado", href: "/services/notice-of-change" },
          " reúne varios cambios en una sola presentación.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal exacta de la sociedad y su número de sociedad (federal) o su número de sociedad de Ontario (OCN).",
          "La nueva dirección completa, y la nueva dirección postal si una sociedad de Ontario la cambia.",
          "La fecha en que entra en vigor la nueva dirección.",
        ],
      },
      { type: "h3", text: "Plazos y tarifas gubernamentales" },
      {
        type: "p",
        parts: [
          "La CBCA exige notificar a Corporations Canada dentro de los 15 días siguientes a un cambio de domicilio social. La Ley de Información de Sociedades exige que una sociedad de Ontario presente un aviso de cambio dentro de los 15 días siguientes al cambio. Ninguno de los dos registros cobra una tarifa gubernamental por esta presentación.",
        ],
      },
    ],
    faqTitle: "Cambiar el domicilio social: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación del cambio de domicilio social; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Cuánto tiempo hay para informar un nuevo domicilio social?",
        a: "Quince días en ambos casos. Una sociedad federal debe enviar el aviso a Corporations Canada dentro de los 15 días siguientes al cambio de dirección, y una sociedad de Ontario debe presentar un aviso de cambio dentro de los 15 días siguientes al cambio. La fecha de entrada en vigor que usted nos indica es la fecha en que se aplica la nueva dirección.",
      },
      {
        q: "¿Puede una sociedad federal trasladar su domicilio social a otra provincia?",
        a: "No solo con el Formulario 3. Ese formulario cambia la dirección dentro de la provincia indicada en los estatutos. Para trasladar el domicilio social a otra provincia, primero deben modificarse los estatutos para indicar la nueva provincia, mediante estatutos de modificación aprobados por resolución especial de los accionistas.",
      },
      {
        q: "¿Puede el domicilio social ser un apartado postal?",
        a: "No para una sociedad federal: Corporations Canada describe el domicilio social como la dirección legal de la sociedad e indica que no puede ser un apartado postal. El domicilio social de una sociedad de Ontario debe estar en un lugar dentro de Ontario. Una sociedad de Ontario puede registrar una dirección postal distinta.",
      },
      {
        q: "¿Hay una tarifa gubernamental por cambiar la dirección?",
        a: "No. Corporations Canada no cobra tarifa por presentar un cambio de domicilio social, y ServiceOntario indica $0 para el aviso de cambio de una sociedad de Ontario. La presentación gubernamental es gratuita en ambas jurisdicciones; a este pedido solo se aplica la tarifa de servicio de Korporex.",
      },
      {
        q: "¿Quién aprueba un cambio de domicilio social?",
        a: "Para una sociedad federal, la CBCA permite a los directores cambiar la dirección dentro de la provincia indicada en los estatutos. Para una sociedad de Ontario, la OBCA permite a los directores trasladar el domicilio social dentro del mismo municipio o municipio geográfico mediante una resolución, mientras que un traslado a otro municipio de Ontario requiere una resolución especial de los accionistas.",
      },
    ],
  },
};
