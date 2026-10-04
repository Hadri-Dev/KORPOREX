import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the change of director / officer order form.
// Service intent: "report a new or departing director, file it for me".
// Federal: Form 6, Changes Regarding Directors (CBCA s.113, 15 days).
// Ontario: notice of change under the Corporations Information Act (s.4, 15 days).
export const content: ServiceContentByLocale = {
  en: {
    title: "Change a director or officer of your corporation",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files the government notice when a director or officer of an Ontario (OBCA) or federal (CBCA) corporation is appointed, resigns or ceases to hold office, or when their details change. You list each change, the person's name and residential address, and the date it takes effect, and we file the notice with Corporations Canada or the Ontario Business Registry. Corporations also record director changes in their own corporate records, as our guide to the ",
          { text: "corporate minute book", href: "/guides/corporate-minute-book" },
          " describes.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Corporations adding a new director, for example a new business partner or family member.",
          "Corporations recording a director's or officer's resignation, removal or death.",
          "Corporations updating an existing director's residential address or an officer's position.",
          "Corporations that missed the 15-day deadline for an earlier change and need the public record brought up to date.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "p",
        parts: [
          "For a federal corporation, we file Form 6, Changes Regarding Directors, with Corporations Canada. Form 6 covers the election or appointment of a new director, the resignation, death, removal or disqualification of a director, and a change in a current director's residential address. For an Ontario corporation, we file a notice of change under the Corporations Information Act, which updates the director and officer information on the Ontario public record. One order can include up to 20 changes. You confirm that each appointment or departure has taken effect under the corporation's articles and by-laws.",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's exact legal name and its corporation number (federal) or Ontario Corporation Number (OCN).",
          "For each person: full name, residential address, role (director, officer or both), the officer position if any, and the effective date.",
          "For federal directors: whether the person is a resident Canadian. Under the CBCA, at least 25% of the directors must be resident Canadians, and at least one if the corporation has fewer than four directors.",
        ],
      },
      { type: "h3", text: "Deadlines" },
      {
        type: "p",
        parts: [
          "Under section 113 of the CBCA, a federal corporation must send the notice to Corporations Canada within 15 days after the change among its directors. Under the Corporations Information Act, an Ontario corporation must file a notice of change within 15 days after the change takes place. Neither registry charges a government fee for these filings. If the registered office or the Ontario mailing address is changing at the same time, the combined ",
          { text: "Notice of Change", href: "/services/notice-of-change" },
          " handles everything in one filing. Changes in share ownership are a separate matter, covered by our ",
          { text: "change of shareholder", href: "/services/change-shareholder" },
          " service.",
        ],
      },
    ],
    faqTitle: "Changing directors and officers: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about director and officer change filings; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "What is the deadline to report a new or departing director?",
        a: "Fifteen days. The CBCA requires a federal corporation to notify Corporations Canada within 15 days after a change among its directors, and the Corporations Information Act requires an Ontario corporation to file a notice of change within 15 days after the change takes place.",
      },
      {
        q: "Do officer changes have to be filed with the government?",
        a: "In Ontario, yes: officer information is part of the corporate information filed under the Corporations Information Act, so appointments and departures of officers are reported by notice of change. Federally, Form 6 covers directors only, so an officer change for a federal corporation is recorded in the corporation's own records rather than filed on Form 6.",
      },
      {
        q: "Does a director who is re-elected need a new filing?",
        a: "Not in Ontario. The Corporations Information Act states that a notice of change is not necessary for a director's retirement and re-election for the next term of office. A change in who sits on the board, or in a director's residential address, is reported.",
      },
      {
        q: "Does a federal corporation need a resident Canadian director?",
        a: "Yes. Section 105(3) of the CBCA requires at least 25% of the directors to be resident Canadians, and at least one resident Canadian director if the corporation has fewer than four directors. That is why the order form asks about residency for each director of a federal corporation.",
      },
      {
        q: "Is there a government fee to change a director?",
        a: "No. Corporations Canada does not charge a fee to file Form 6, Changes Regarding Directors, and ServiceOntario lists the notice of change for an Ontario corporation at $0. The government filing is free in both jurisdictions; only the Korporex service fee applies to this order.",
      },
    ],
  },
  fr: {
    title: "Changez un administrateur ou un dirigeant de votre société",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose l'avis gouvernemental lorsqu'un administrateur ou un dirigeant d'une société ontarienne (LSAO) ou fédérale (LCSA) est nommé, démissionne ou cesse d'exercer ses fonctions, ou lorsque ses renseignements changent. Vous indiquez chaque changement, le nom et l'adresse résidentielle de la personne et la date de prise d'effet, et nous déposons l'avis auprès de Corporations Canada ou du Registre des entreprises de l'Ontario. Les sociétés consignent aussi les changements d'administrateurs dans leurs propres registres, comme l'explique notre guide sur ",
          { text: "le livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés qui ajoutent un nouvel administrateur, par exemple un nouvel associé ou un membre de la famille.",
          "Les sociétés qui consignent la démission, la révocation ou le décès d'un administrateur ou d'un dirigeant.",
          "Les sociétés qui mettent à jour l'adresse résidentielle d'un administrateur ou le poste d'un dirigeant.",
          "Les sociétés qui ont laissé passer le délai de 15 jours pour un changement antérieur et doivent mettre le registre public à jour.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Pour une société fédérale, nous déposons le formulaire 6, Changements concernant les administrateurs, auprès de Corporations Canada. Le formulaire 6 vise l'élection ou la nomination d'un nouvel administrateur, la démission, le décès, la révocation ou l'inhabilité d'un administrateur, ainsi que le changement d'adresse résidentielle d'un administrateur en poste. Pour une société ontarienne, nous déposons un avis de modification en vertu de la Loi sur les renseignements exigés des personnes morales, qui met à jour les renseignements sur les administrateurs et les dirigeants inscrits au registre public de l'Ontario. Une même commande peut comprendre jusqu'à 20 changements. Vous confirmez que chaque nomination ou départ a pris effet conformément aux statuts et aux règlements administratifs de la société.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale exacte de la société et son numéro de société (fédéral) ou son numéro de société de l'Ontario (OCN).",
          "Pour chaque personne : nom complet, adresse résidentielle, rôle (administrateur, dirigeant ou les deux), poste de dirigeant le cas échéant et date de prise d'effet.",
          "Pour les administrateurs d'une société fédérale : si la personne est un résident canadien. En vertu de la LCSA, au moins 25 % des administrateurs doivent être des résidents canadiens, et au moins un si la société compte moins de quatre administrateurs.",
        ],
      },
      { type: "h3", text: "Délais" },
      {
        type: "p",
        parts: [
          "En vertu de l'article 113 de la LCSA, une société fédérale doit envoyer l'avis à Corporations Canada dans les 15 jours suivant le changement parmi ses administrateurs. En vertu de la Loi sur les renseignements exigés des personnes morales, une société ontarienne doit déposer un avis de modification dans les 15 jours suivant le changement. Aucun des deux registres n'exige de droits gouvernementaux pour ces dépôts. Si le siège social ou l'adresse postale ontarienne change en même temps, l'",
          { text: "avis de modification combiné", href: "/services/notice-of-change" },
          " regroupe le tout en un seul dépôt. Les changements dans l'actionnariat relèvent d'une autre démarche, couverte par notre service de ",
          { text: "changement d'actionnaire", href: "/services/change-shareholder" },
          ".",
        ],
      },
    ],
    faqTitle: "Changer les administrateurs et les dirigeants : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur les dépôts liés aux changements d'administrateurs et de dirigeants; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Quel est le délai pour déclarer l'arrivée ou le départ d'un administrateur?",
        a: "Quinze jours. La LCSA exige qu'une société fédérale avise Corporations Canada dans les 15 jours suivant un changement parmi ses administrateurs, et la Loi sur les renseignements exigés des personnes morales exige qu'une société ontarienne dépose un avis de modification dans les 15 jours suivant le changement.",
      },
      {
        q: "Les changements de dirigeants doivent-ils être déposés auprès du gouvernement?",
        a: "En Ontario, oui : les renseignements sur les dirigeants font partie des renseignements déposés en vertu de la Loi sur les renseignements exigés des personnes morales, de sorte que leurs nominations et départs sont déclarés par avis de modification. Au fédéral, le formulaire 6 vise seulement les administrateurs; un changement de dirigeant d'une société fédérale est consigné dans les registres de la société plutôt que déposé sur le formulaire 6.",
      },
      {
        q: "Un administrateur réélu exige-t-il un nouveau dépôt?",
        a: "Pas en Ontario. La Loi sur les renseignements exigés des personnes morales précise qu'il n'est pas nécessaire de déposer un avis de modification pour le départ à la retraite d'un administrateur suivi de sa réélection pour le mandat suivant. Un changement dans la composition du conseil, ou dans l'adresse résidentielle d'un administrateur, est déclaré.",
      },
      {
        q: "Une société fédérale doit-elle avoir un administrateur résident canadien?",
        a: "Oui. Le paragraphe 105(3) de la LCSA exige qu'au moins 25 % des administrateurs soient des résidents canadiens, et qu'au moins un administrateur soit résident canadien si la société compte moins de quatre administrateurs. C'est pourquoi le formulaire de commande demande la résidence de chaque administrateur d'une société fédérale.",
      },
      {
        q: "Y a-t-il des droits gouvernementaux pour changer un administrateur?",
        a: "Non. Corporations Canada n'exige aucuns droits pour le dépôt du formulaire 6, Changements concernant les administrateurs, et ServiceOntario indique 0 $ pour l'avis de modification d'une société ontarienne. Le dépôt gouvernemental est gratuit dans les deux compétences; seuls les frais de service de Korporex s'appliquent à cette commande.",
      },
    ],
  },
  es: {
    title: "Cambie un director o funcionario de su sociedad",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta el aviso gubernamental cuando un director o funcionario de una sociedad de Ontario (OBCA) o federal (CBCA) es nombrado, renuncia o deja el cargo, o cuando cambian sus datos. Usted indica cada cambio, el nombre y la dirección residencial de la persona y la fecha en que entra en vigor, y nosotros presentamos el aviso ante Corporations Canada o el Registro de Empresas de Ontario. Las sociedades también registran los cambios de directores en sus propios registros corporativos, como explica nuestra guía sobre ",
          { text: "el libro de actas", href: "/guides/que-es-un-libro-de-actas" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades que incorporan a un nuevo director, por ejemplo un nuevo socio o un familiar.",
          "Sociedades que registran la renuncia, destitución o fallecimiento de un director o funcionario.",
          "Sociedades que actualizan la dirección residencial de un director o el cargo de un funcionario.",
          "Sociedades que dejaron pasar el plazo de 15 días de un cambio anterior y necesitan actualizar el registro público.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Para una sociedad federal, presentamos el Formulario 6, Cambios relativos a los directores, ante Corporations Canada. El Formulario 6 abarca la elección o el nombramiento de un nuevo director, la renuncia, el fallecimiento, la destitución o la inhabilitación de un director, y el cambio de dirección residencial de un director en funciones. Para una sociedad de Ontario, presentamos un aviso de cambio en virtud de la Ley de Información de Sociedades (Corporations Information Act), que actualiza la información de directores y funcionarios en el registro público de Ontario. Un mismo pedido puede incluir hasta 20 cambios. Usted confirma que cada nombramiento o salida tuvo efecto conforme a los estatutos y los estatutos internos de la sociedad.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal exacta de la sociedad y su número de sociedad (federal) o su número de sociedad de Ontario (OCN).",
          "Para cada persona: nombre completo, dirección residencial, función (director, funcionario o ambos), el cargo de funcionario si corresponde y la fecha de entrada en vigor.",
          "Para directores de una sociedad federal: si la persona es residente canadiense. Según la CBCA, al menos el 25 % de los directores deben ser residentes canadienses, y al menos uno si la sociedad tiene menos de cuatro directores.",
        ],
      },
      { type: "h3", text: "Plazos" },
      {
        type: "p",
        parts: [
          "Según el artículo 113 de la CBCA, una sociedad federal debe enviar el aviso a Corporations Canada dentro de los 15 días siguientes al cambio entre sus directores. Según la Ley de Información de Sociedades, una sociedad de Ontario debe presentar un aviso de cambio dentro de los 15 días siguientes al cambio. Ninguno de los dos registros cobra una tarifa gubernamental por estas presentaciones. Si el domicilio social o la dirección postal en Ontario cambian al mismo tiempo, el ",
          { text: "Aviso de Cambio combinado", href: "/services/notice-of-change" },
          " reúne todo en una sola presentación. Los cambios en la titularidad de las acciones son un asunto aparte, cubierto por nuestro servicio de ",
          { text: "cambio de accionista", href: "/services/change-shareholder" },
          ".",
        ],
      },
    ],
    faqTitle: "Cambiar directores y funcionarios: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre las presentaciones de cambios de directores y funcionarios; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Cuál es el plazo para informar la llegada o salida de un director?",
        a: "Quince días. La CBCA exige que una sociedad federal notifique a Corporations Canada dentro de los 15 días siguientes a un cambio entre sus directores, y la Ley de Información de Sociedades exige que una sociedad de Ontario presente un aviso de cambio dentro de los 15 días siguientes al cambio.",
      },
      {
        q: "¿Los cambios de funcionarios deben presentarse ante el gobierno?",
        a: "En Ontario, sí: la información de los funcionarios forma parte de la información presentada según la Ley de Información de Sociedades, por lo que sus nombramientos y salidas se informan mediante un aviso de cambio. A nivel federal, el Formulario 6 abarca solo a los directores; un cambio de funcionario de una sociedad federal se registra en los registros propios de la sociedad y no en el Formulario 6.",
      },
      {
        q: "¿Un director reelegido requiere una nueva presentación?",
        a: "No en Ontario. La Ley de Información de Sociedades establece que no es necesario presentar un aviso de cambio por el retiro de un director y su reelección para el siguiente mandato. Sí se informa un cambio en quiénes integran el consejo o en la dirección residencial de un director.",
      },
      {
        q: "¿Una sociedad federal necesita un director residente canadiense?",
        a: "Sí. El artículo 105(3) de la CBCA exige que al menos el 25 % de los directores sean residentes canadienses, y al menos un director residente canadiense si la sociedad tiene menos de cuatro directores. Por eso el formulario de pedido pregunta la residencia de cada director de una sociedad federal.",
      },
      {
        q: "¿Hay una tarifa gubernamental por cambiar un director?",
        a: "No. Corporations Canada no cobra tarifa por presentar el Formulario 6, Cambios relativos a los directores, y ServiceOntario indica $0 para el aviso de cambio de una sociedad de Ontario. La presentación gubernamental es gratuita en ambas jurisdicciones; a este pedido solo se aplica la tarifa de servicio de Korporex.",
      },
    ],
  },
};
