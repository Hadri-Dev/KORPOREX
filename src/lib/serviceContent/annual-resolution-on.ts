import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Ontario (OBCA) annual resolutions order form.
// Annual resolutions are minute-book documents, not a registry filing, so this
// copy is kept clearly apart from the Ontario annual return. The OBCA
// specifics (s.94 timing, s.104 written resolutions including the majority
// option for non-offering corporations, s.148 audit exemption) distinguish it
// from the federal page.
export const content: ServiceContentByLocale = {
  en: {
    title: "Annual resolutions for your Ontario (OBCA) corporation",
    blocks: [
      {
        type: "p",
        parts: [
          "The directors of a corporation governed by the Ontario Business Corporations Act (OBCA) must call an annual meeting of shareholders. In most closely held Ontario corporations, the meeting is replaced by written resolutions: under section 104 of the OBCA, a resolution in writing signed by all the shareholders entitled to vote on it is as valid as if it had been passed at a meeting. Korporex prepares the annual resolutions of the directors and of the shareholders, ready to sign and keep in the corporation's minute book. Nothing is filed with the Ontario Business Registry. Our guide to the ",
          { text: "corporate minute book", href: "/guides/corporate-minute-book" },
          " explains where these records fit.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Ontario corporations whose shareholders sign written resolutions instead of holding an annual meeting.",
          "Corporations that want to rely on the audit exemption for the year, which requires the written consent of all shareholders.",
          "Corporations catching up on years in which no annual meeting was held and no resolutions were signed.",
        ],
      },
      { type: "h3", text: "What we prepare" },
      {
        type: "list",
        items: [
          "A directors' resolution approving the financial statements for the year. Under the OBCA, the financial statements are approved by the board of directors.",
          "A directors' resolution appointing the officers for the coming year.",
          "A shareholders' resolution receiving the financial statements and electing (or re-electing) the directors.",
          "The treatment of the audit: appointing an auditor, or the shareholders' written consent to the audit exemption. Where an accountant prepares the statements on a review or compilation basis instead of an audit, the resolutions can name the accountant.",
          "Any other matters you ask us to include, such as approving a dividend, ratifying acts of the directors or changing the year-end.",
        ],
      },
      {
        type: "p",
        parts: [
          "Under section 148 of the OBCA, a corporation that is not an offering corporation is exempt for a financial year from the requirements regarding the appointment and duties of an auditor if all of the shareholders consent in writing to the exemption in respect of that year. The consent covers one year, so it is given again each year.",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's legal name, Ontario corporation number and financial year-end.",
          "The date the resolutions will be signed, and the date of the last annual meeting or annual resolutions, if any.",
          "Whether the financial statements for the year are ready.",
          "The directors to be elected, the officers and their positions, and every shareholder who will sign (individual or corporation, with share class if known).",
          "Your confirmation that all shareholders entitled to vote will sign the written resolutions.",
        ],
      },
      { type: "h3", text: "Timing under the OBCA" },
      {
        type: "p",
        parts: [
          "Section 94 of the OBCA requires the first annual meeting no later than 18 months after the corporation comes into existence, and each later one no later than 15 months after the previous meeting. Unlike the CBCA, section 94 does not tie the meeting to the year-end itself, but the financial statements placed before the annual meeting must cover a period that ended not more than six months before the meeting. The annual resolutions are separate from the ",
          { text: "Ontario annual return", href: "/services/annual-return-on" },
          ", a public filing due within six months after the fiscal year-end. If the corporation was never organized with by-laws, registers and share certificates, an ",
          { text: "initial minute book", href: "/services/initial-minute-book" },
          " is a separate service.",
        ],
      },
    ],
    faqTitle: "Ontario annual resolutions: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about annual resolutions under the OBCA; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Are annual resolutions filed with the Ontario Business Registry?",
        a: "No. Annual resolutions are internal records signed by the directors and shareholders, and the OBCA requires a copy of each written shareholder resolution to be kept with the minutes of shareholder meetings. The filing that goes to the Ontario Business Registry is the annual return under the Corporations Information Act, which is a separate obligation.",
      },
      {
        q: "Do all shareholders have to sign the written resolutions?",
        a: "A written resolution signed by all the shareholders entitled to vote satisfies the OBCA's requirements for that meeting. Since July 5, 2021, a non-offering corporation may also pass ordinary resolutions in writing with the signatures of holders of a majority of the voting shares, but it must send written notice to the voting shareholders who did not sign within 10 business days. Korporex prepares resolutions for signature by all voting shareholders.",
      },
      {
        q: "When are the annual resolutions due in Ontario?",
        a: "Section 94 of the OBCA requires the first annual meeting within 18 months after the corporation comes into existence and each later one within 15 months after the previous meeting. The financial statements placed before the shareholders must cover a period that ended not more than six months before the meeting. Written resolutions signed in place of the meeting satisfy the requirements for that meeting.",
      },
      {
        q: "Does a small Ontario corporation need an auditor?",
        a: "Under section 148 of the OBCA, a corporation that is not an offering corporation is exempt from the auditor requirements for a financial year if all of the shareholders consent in writing to the exemption for that year. Because the consent must come from all of the shareholders, a majority written resolution is not enough for the audit exemption.",
      },
      {
        q: "How do the Ontario and federal rules differ?",
        a: "The CBCA ties each annual meeting to both 15 months after the last one and six months after the year-end, while the OBCA sets the 15-month limit and ties the financial statements to a six-month window. The CBCA requires all voting shareholders to sign written resolutions; the OBCA also allows majority written resolutions for ordinary matters in non-offering corporations.",
      },
    ],
  },
  fr: {
    title: "Résolutions annuelles pour votre société ontarienne (LSAO)",
    blocks: [
      {
        type: "p",
        parts: [
          "Les administrateurs d'une société régie par la Loi sur les sociétés par actions de l'Ontario (LSAO) doivent convoquer une assemblée annuelle des actionnaires. Dans la plupart des sociétés ontariennes fermées, l'assemblée est remplacée par des résolutions écrites : en vertu de l'article 104 de la LSAO, une résolution écrite signée par tous les actionnaires habiles à voter sur celle-ci a la même valeur que si elle avait été adoptée en assemblée. Korporex prépare les résolutions annuelles des administrateurs et des actionnaires, prêtes à signer et à verser au livre des procès-verbaux de la société. Rien n'est déposé au Registre des entreprises de l'Ontario. Notre guide sur le ",
          { text: "livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
          " explique où s'inscrivent ces documents.",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés ontariennes dont les actionnaires signent des résolutions écrites au lieu de tenir une assemblée annuelle.",
          "Les sociétés qui veulent se prévaloir de la dispense de vérification pour l'exercice, laquelle exige le consentement écrit de tous les actionnaires.",
          "Les sociétés qui rattrapent des années sans assemblée annuelle ni résolutions signées.",
        ],
      },
      { type: "h3", text: "Ce que nous préparons" },
      {
        type: "list",
        items: [
          "Une résolution des administrateurs approuvant les états financiers de l'exercice. En vertu de la LSAO, les états financiers sont approuvés par le conseil d'administration.",
          "Une résolution des administrateurs nommant les dirigeants pour l'année à venir.",
          "Une résolution des actionnaires prenant acte des états financiers et élisant (ou réélisant) les administrateurs.",
          "Le traitement de la vérification : nomination d'un vérificateur, ou consentement écrit des actionnaires à la dispense de vérification. Lorsqu'un comptable prépare les états financiers dans le cadre d'une mission d'examen ou de compilation plutôt que d'une vérification, les résolutions peuvent nommer ce comptable.",
          "Toute autre question que vous nous demandez d'inclure, comme l'approbation d'un dividende, la ratification d'actes des administrateurs ou le changement de la fin d'exercice.",
        ],
      },
      {
        type: "p",
        parts: [
          "En vertu de l'article 148 de la LSAO, une société qui ne fait pas appel public à l'épargne est dispensée, pour un exercice, des exigences relatives à la nomination et aux fonctions d'un vérificateur si tous les actionnaires consentent par écrit à la dispense pour cet exercice. Le consentement vise un seul exercice; il est donc donné de nouveau chaque année.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale de la société, son numéro de société de l'Ontario et la fin de son exercice.",
          "La date de signature des résolutions et, le cas échéant, la date de la dernière assemblée annuelle ou des dernières résolutions annuelles.",
          "Le fait que les états financiers de l'exercice soient prêts ou non.",
          "Les administrateurs à élire, les dirigeants et leurs postes, et chaque actionnaire qui signera (particulier ou société, avec la catégorie d'actions si elle est connue).",
          "Votre confirmation que tous les actionnaires habiles à voter signeront les résolutions écrites.",
        ],
      },
      { type: "h3", text: "Délais prévus par la LSAO" },
      {
        type: "p",
        parts: [
          "L'article 94 de la LSAO exige que la première assemblée annuelle soit convoquée au plus tard 18 mois après la naissance de la société, puis chaque assemblée suivante au plus tard 15 mois après la précédente. Contrairement à la LCSA, l'article 94 ne rattache pas l'assemblée à la fin de l'exercice, mais les états financiers présentés à l'assemblée annuelle doivent couvrir une période terminée au plus six mois avant celle-ci. Les résolutions annuelles sont distinctes de la ",
          { text: "déclaration annuelle de l'Ontario", href: "/services/annual-return-on" },
          ", un dépôt public exigible dans les six mois suivant la fin de l'exercice. Si la société n'a jamais été organisée avec ses règlements, registres et certificats d'actions, le ",
          { text: "livre des procès-verbaux initial", href: "/services/initial-minute-book" },
          " est un service distinct.",
        ],
      },
    ],
    faqTitle: "Résolutions annuelles de l'Ontario : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur les résolutions annuelles sous le régime de la LSAO; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Les résolutions annuelles sont-elles déposées au Registre des entreprises de l'Ontario?",
        a: "Non. Les résolutions annuelles sont des registres internes signés par les administrateurs et les actionnaires, et la LSAO exige qu'une copie de chaque résolution écrite des actionnaires soit conservée avec les procès-verbaux des assemblées des actionnaires. Le dépôt destiné au Registre des entreprises de l'Ontario est la déclaration annuelle prévue par la Loi sur les renseignements exigés des personnes morales, une obligation distincte.",
      },
      {
        q: "Tous les actionnaires doivent-ils signer les résolutions écrites?",
        a: "Une résolution écrite signée par tous les actionnaires habiles à voter satisfait aux exigences de la LSAO relatives à l'assemblée. Depuis le 5 juillet 2021, une société qui ne fait pas appel public à l'épargne peut aussi adopter des résolutions ordinaires par écrit avec la signature des détenteurs de la majorité des actions avec droit de vote, mais elle doit aviser par écrit les actionnaires votants non signataires dans les 10 jours ouvrables. Korporex prépare des résolutions destinées à être signées par tous les actionnaires votants.",
      },
      {
        q: "Quand les résolutions annuelles doivent-elles être adoptées en Ontario?",
        a: "L'article 94 de la LSAO exige la première assemblée annuelle dans les 18 mois suivant la naissance de la société, puis chaque assemblée suivante dans les 15 mois suivant la précédente. Les états financiers présentés aux actionnaires doivent couvrir une période terminée au plus six mois avant l'assemblée. Les résolutions écrites signées au lieu de l'assemblée satisfont aux exigences relatives à cette assemblée.",
      },
      {
        q: "Une petite société ontarienne a-t-elle besoin d'un vérificateur?",
        a: "En vertu de l'article 148 de la LSAO, une société qui ne fait pas appel public à l'épargne est dispensée des exigences relatives au vérificateur pour un exercice si tous les actionnaires consentent par écrit à la dispense pour cet exercice. Comme le consentement doit venir de tous les actionnaires, une résolution écrite majoritaire ne suffit pas pour la dispense de vérification.",
      },
      {
        q: "En quoi les règles de l'Ontario et du fédéral diffèrent-elles?",
        a: "La LCSA rattache chaque assemblée annuelle à la fois à un délai de 15 mois après la précédente et de six mois après la fin de l'exercice, tandis que la LSAO fixe la limite de 15 mois et rattache les états financiers à une fenêtre de six mois. La LCSA exige la signature de tous les actionnaires votants; la LSAO permet aussi des résolutions écrites majoritaires pour les questions ordinaires dans les sociétés qui ne font pas appel public à l'épargne.",
      },
    ],
  },
  es: {
    title: "Resoluciones anuales para su sociedad de Ontario (OBCA)",
    blocks: [
      {
        type: "p",
        parts: [
          "Los directores de una sociedad regida por la Ley de Sociedades por Acciones de Ontario (OBCA) deben convocar una asamblea anual de accionistas. En la mayoría de las sociedades cerradas de Ontario, la asamblea se sustituye por resoluciones escritas: según el artículo 104 de la OBCA, una resolución escrita firmada por todos los accionistas con derecho a votar sobre ella es tan válida como si se hubiera aprobado en una asamblea. Korporex prepara las resoluciones anuales de los directores y de los accionistas, listas para firmar y archivar en el libro de actas de la sociedad. No se presenta nada ante el Registro de Empresas de Ontario. Nuestra guía sobre el ",
          { text: "libro de actas", href: "/guides/que-es-un-libro-de-actas" },
          " explica dónde encajan estos registros.",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades de Ontario cuyos accionistas firman resoluciones escritas en lugar de celebrar una asamblea anual.",
          "Sociedades que quieren acogerse a la exención de auditoría del ejercicio, que requiere el consentimiento escrito de todos los accionistas.",
          "Sociedades que se ponen al día con años en los que no hubo asamblea anual ni resoluciones firmadas.",
        ],
      },
      { type: "h3", text: "Qué preparamos" },
      {
        type: "list",
        items: [
          "Una resolución de los directores que aprueba los estados financieros del ejercicio. Según la OBCA, los estados financieros los aprueba el consejo de administración.",
          "Una resolución de los directores que nombra a los funcionarios para el año siguiente.",
          "Una resolución de los accionistas que recibe los estados financieros y elige (o reelige) a los directores.",
          "El tratamiento de la auditoría: nombramiento de un auditor, o consentimiento escrito de los accionistas a la exención de auditoría. Cuando un contador prepara los estados financieros mediante un encargo de revisión o compilación en lugar de una auditoría, las resoluciones pueden nombrar a ese contador.",
          "Cualquier otro asunto que nos pida incluir, como aprobar un dividendo, ratificar actos de los directores o cambiar el cierre del ejercicio.",
        ],
      },
      {
        type: "p",
        parts: [
          "Según el artículo 148 de la OBCA, una sociedad que no es una sociedad que ofrece valores al público (offering corporation) queda exenta, para un ejercicio, de los requisitos sobre el nombramiento y las funciones de un auditor si todos los accionistas consienten por escrito la exención para ese ejercicio. El consentimiento cubre un solo ejercicio, por lo que se otorga de nuevo cada año.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal de la sociedad, su número de sociedad de Ontario y el cierre de su ejercicio.",
          "La fecha en que se firmarán las resoluciones y, si la hay, la fecha de la última asamblea anual o de las últimas resoluciones anuales.",
          "Si los estados financieros del ejercicio están listos.",
          "Los directores que se elegirán, los funcionarios y sus cargos, y cada accionista que firmará (persona física o sociedad, con la clase de acciones si la conoce).",
          "Su confirmación de que todos los accionistas con derecho a voto firmarán las resoluciones escritas.",
        ],
      },
      { type: "h3", text: "Plazos según la OBCA" },
      {
        type: "p",
        parts: [
          "El artículo 94 de la OBCA exige convocar la primera asamblea anual a más tardar 18 meses después de que la sociedad comience a existir, y cada asamblea posterior a más tardar 15 meses después de la anterior. A diferencia de la CBCA, el artículo 94 no vincula la asamblea al cierre del ejercicio, pero los estados financieros presentados en la asamblea anual deben cubrir un período que terminó no más de seis meses antes de ella. Las resoluciones anuales son distintas de la ",
          { text: "declaración anual de Ontario", href: "/services/annual-return-on" },
          ", una presentación pública que vence dentro de los seis meses posteriores al cierre del ejercicio. Si la sociedad nunca se organizó con sus reglamentos, registros y certificados de acciones, el ",
          { text: "libro de actas inicial", href: "/services/initial-minute-book" },
          " es un servicio aparte.",
        ],
      },
    ],
    faqTitle: "Resoluciones anuales de Ontario: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre las resoluciones anuales según la OBCA; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Las resoluciones anuales se presentan ante el Registro de Empresas de Ontario?",
        a: "No. Las resoluciones anuales son registros internos firmados por los directores y los accionistas, y la OBCA exige conservar una copia de cada resolución escrita de los accionistas junto con las actas de sus asambleas. Lo que se presenta ante el Registro de Empresas de Ontario es la declaración anual de la Corporations Information Act, una obligación distinta.",
      },
      {
        q: "¿Todos los accionistas deben firmar las resoluciones escritas?",
        a: "Una resolución escrita firmada por todos los accionistas con derecho a voto cumple los requisitos de la OBCA para esa asamblea. Desde el 5 de julio de 2021, una sociedad que no ofrece valores al público también puede aprobar resoluciones ordinarias por escrito con la firma de los titulares de la mayoría de las acciones con voto, pero debe notificar por escrito a los accionistas con voto que no firmaron dentro de los 10 días hábiles. Korporex prepara resoluciones para la firma de todos los accionistas con voto.",
      },
      {
        q: "¿Cuándo deben adoptarse las resoluciones anuales en Ontario?",
        a: "El artículo 94 de la OBCA exige la primera asamblea anual dentro de los 18 meses siguientes a que la sociedad comience a existir, y cada asamblea posterior dentro de los 15 meses siguientes a la anterior. Los estados financieros presentados a los accionistas deben cubrir un período que terminó no más de seis meses antes de la asamblea. Las resoluciones escritas firmadas en lugar de la asamblea cumplen los requisitos de esa asamblea.",
      },
      {
        q: "¿Una sociedad pequeña de Ontario necesita un auditor?",
        a: "Según el artículo 148 de la OBCA, una sociedad que no ofrece valores al público queda exenta de los requisitos de auditoría para un ejercicio si todos los accionistas consienten por escrito la exención para ese ejercicio. Como el consentimiento debe venir de todos los accionistas, una resolución escrita mayoritaria no basta para la exención de auditoría.",
      },
      {
        q: "¿En qué se diferencian las reglas de Ontario y las federales?",
        a: "La CBCA vincula cada asamblea anual tanto a un plazo de 15 meses desde la anterior como a seis meses desde el cierre del ejercicio, mientras que la OBCA fija el límite de 15 meses y vincula los estados financieros a un período de seis meses. La CBCA exige la firma de todos los accionistas con voto; la OBCA también permite resoluciones escritas mayoritarias para asuntos ordinarios en sociedades que no ofrecen valores al público.",
      },
    ],
  },
};
