import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the federal (CBCA) annual resolutions order form.
// Annual resolutions are minute-book documents, not a registry filing, so this
// copy is kept clearly apart from the federal annual return. The CBCA
// specifics (s.133 timing tied to the year-end, unanimous written resolutions
// under s.142, s.163 auditor waiver) distinguish it from the Ontario page.
export const content: ServiceContentByLocale = {
  en: {
    title: "Annual resolutions for your federal (CBCA) corporation",
    blocks: [
      {
        type: "p",
        parts: [
          "Each year, the directors of a corporation governed by the Canada Business Corporations Act (CBCA) must call an annual meeting of shareholders. In most closely held corporations, that meeting is replaced by written resolutions: under section 142 of the CBCA, a resolution in writing signed by all the shareholders entitled to vote on it is as valid as if it had been passed at a meeting. Korporex prepares the annual resolutions of the directors and of the shareholders, ready to sign and keep in the corporation's minute book. Nothing is filed with Corporations Canada. To see where these documents fit, read our guide to the ",
          { text: "corporate minute book", href: "/guides/corporate-minute-book" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Federal corporations whose shareholders sign written resolutions instead of holding an annual meeting.",
          "Corporations catching up on years in which no annual meeting was held and no resolutions were signed.",
          "Corporations preparing their federal annual return, which asks for the date of the last annual meeting or annual resolutions.",
        ],
      },
      { type: "h3", text: "What we prepare" },
      {
        type: "list",
        items: [
          "A directors' resolution approving the financial statements for the year. Under section 158 of the CBCA, the directors approve the statements before they are placed before the shareholders.",
          "A directors' resolution appointing the officers for the coming year.",
          "A shareholders' resolution receiving the financial statements and electing (or re-electing) the directors.",
          "The treatment of the audit: appointing an auditor, or the shareholders' resolution not to appoint one. Where an accountant prepares the statements on a review or compilation basis instead of an audit, the resolutions can name the accountant.",
          "Any other matters you ask us to include, such as approving a dividend, ratifying acts of the directors or changing the year-end.",
        ],
      },
      {
        type: "p",
        parts: [
          "Under section 163 of the CBCA, the shareholders of a corporation that is not a distributing corporation may resolve not to appoint an auditor. That resolution must be consented to by all the shareholders, including those not otherwise entitled to vote, and it is valid only until the next annual meeting, which is why it is renewed each year.",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's legal name, federal corporation number and financial year-end.",
          "The date the resolutions will be signed, and the date of the last annual meeting or annual resolutions, if any.",
          "Whether the financial statements for the year are ready.",
          "The directors to be elected, the officers and their positions, and every shareholder who will sign (individual or corporation, with share class if known).",
          "Your confirmation that all shareholders entitled to vote will sign the written resolutions.",
        ],
      },
      { type: "h3", text: "Timing under the CBCA" },
      {
        type: "p",
        parts: [
          "Section 133 of the CBCA requires the first annual meeting no later than 18 months after the corporation comes into existence, and each later one no later than 15 months after the previous meeting and no later than six months after the end of the preceding financial year. The financial statements placed before the shareholders must cover a period that ended not more than six months before the meeting. The date of the resolutions is then reported on the ",
          { text: "federal annual return", href: "/services/annual-return-federal" },
          ". If the corporation was never organized with by-laws, registers and share certificates, an ",
          { text: "initial minute book", href: "/services/initial-minute-book" },
          " is a separate service.",
        ],
      },
    ],
    faqTitle: "Federal annual resolutions: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about annual resolutions under the CBCA; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Are annual resolutions filed with Corporations Canada?",
        a: "No. Annual resolutions are internal records of the corporation. They are signed by the directors and shareholders and kept with the minutes in the minute book. What goes to Corporations Canada is the annual return, a separate filing that asks for the date of the last annual meeting or of the written resolutions signed in its place.",
      },
      {
        q: "Can written resolutions replace the annual meeting of a federal corporation?",
        a: "Yes. Under section 142 of the CBCA, a written resolution dealing with all the matters required to be dealt with at a meeting, and signed by all the shareholders entitled to vote at that meeting, satisfies the CBCA's requirements for that meeting. The CBCA requires the signature of every shareholder entitled to vote, not a majority.",
      },
      {
        q: "When are the annual resolutions due?",
        a: "Section 133 of the CBCA requires each annual meeting no later than 15 months after the previous one and no later than six months after the end of the preceding financial year. The first must be held within 18 months after the corporation comes into existence. Written resolutions signed in place of the meeting satisfy the requirements for that meeting.",
      },
      {
        q: "Does a small federal corporation need an auditor?",
        a: "A corporation that is not a distributing corporation may resolve not to appoint an auditor under section 163 of the CBCA. The resolution needs the consent of all the shareholders, including non-voting shareholders, and it is valid only until the next annual meeting, so it is renewed each year with the annual resolutions.",
      },
      {
        q: "What if the corporation missed several years of annual resolutions?",
        a: "Many corporations bring their minute book up to date by preparing resolutions for each missed year. Each set records the financial statements, directors, officers and auditor treatment for that year. You can place a separate order for each year, giving the financial year-end and the signing date of each set of resolutions.",
      },
    ],
  },
  fr: {
    title: "Résolutions annuelles pour votre société fédérale (LCSA)",
    blocks: [
      {
        type: "p",
        parts: [
          "Chaque année, les administrateurs d'une société régie par la Loi canadienne sur les sociétés par actions (LCSA) doivent convoquer une assemblée annuelle des actionnaires. Dans la plupart des sociétés fermées, cette assemblée est remplacée par des résolutions écrites : en vertu de l'article 142 de la LCSA, une résolution écrite signée par tous les actionnaires habiles à voter sur celle-ci a la même valeur que si elle avait été adoptée en assemblée. Korporex prépare les résolutions annuelles des administrateurs et des actionnaires, prêtes à signer et à verser au livre des procès-verbaux de la société. Rien n'est déposé auprès de Corporations Canada. Pour voir où s'inscrivent ces documents, lisez notre guide sur le ",
          { text: "livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés fédérales dont les actionnaires signent des résolutions écrites au lieu de tenir une assemblée annuelle.",
          "Les sociétés qui rattrapent des années sans assemblée annuelle ni résolutions signées.",
          "Les sociétés qui préparent leur déclaration annuelle fédérale, laquelle demande la date de la dernière assemblée annuelle ou des dernières résolutions annuelles.",
        ],
      },
      { type: "h3", text: "Ce que nous préparons" },
      {
        type: "list",
        items: [
          "Une résolution des administrateurs approuvant les états financiers de l'exercice. En vertu de l'article 158 de la LCSA, les administrateurs approuvent les états financiers avant qu'ils soient présentés aux actionnaires.",
          "Une résolution des administrateurs nommant les dirigeants pour l'année à venir.",
          "Une résolution des actionnaires prenant acte des états financiers et élisant (ou réélisant) les administrateurs.",
          "Le traitement de la vérification : nomination d'un vérificateur, ou résolution des actionnaires de ne pas en nommer. Lorsqu'un comptable prépare les états financiers dans le cadre d'une mission d'examen ou de compilation plutôt que d'une vérification, les résolutions peuvent nommer ce comptable.",
          "Toute autre question que vous nous demandez d'inclure, comme l'approbation d'un dividende, la ratification d'actes des administrateurs ou le changement de la fin d'exercice.",
        ],
      },
      {
        type: "p",
        parts: [
          "En vertu de l'article 163 de la LCSA, les actionnaires d'une société autre qu'une société ayant fait appel au public peuvent décider de ne pas nommer de vérificateur. Cette résolution doit recevoir le consentement de tous les actionnaires, y compris ceux qui n'ont pas par ailleurs le droit de vote, et elle n'est valide que jusqu'à l'assemblée annuelle suivante; c'est pourquoi elle est renouvelée chaque année.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale de la société, son numéro de société fédérale et la fin de son exercice.",
          "La date de signature des résolutions et, le cas échéant, la date de la dernière assemblée annuelle ou des dernières résolutions annuelles.",
          "Le fait que les états financiers de l'exercice soient prêts ou non.",
          "Les administrateurs à élire, les dirigeants et leurs postes, et chaque actionnaire qui signera (particulier ou société, avec la catégorie d'actions si elle est connue).",
          "Votre confirmation que tous les actionnaires habiles à voter signeront les résolutions écrites.",
        ],
      },
      { type: "h3", text: "Délais prévus par la LCSA" },
      {
        type: "p",
        parts: [
          "L'article 133 de la LCSA exige que la première assemblée annuelle soit convoquée au plus tard 18 mois après la naissance de la société, puis chaque assemblée suivante au plus tard 15 mois après la précédente et au plus tard six mois après la fin de l'exercice précédent. Les états financiers présentés aux actionnaires doivent couvrir une période terminée au plus six mois avant l'assemblée. La date des résolutions est ensuite indiquée dans la ",
          { text: "déclaration annuelle fédérale", href: "/services/annual-return-federal" },
          ". Si la société n'a jamais été organisée avec ses règlements, registres et certificats d'actions, le ",
          { text: "livre des procès-verbaux initial", href: "/services/initial-minute-book" },
          " est un service distinct.",
        ],
      },
    ],
    faqTitle: "Résolutions annuelles fédérales : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur les résolutions annuelles sous le régime de la LCSA; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Les résolutions annuelles sont-elles déposées auprès de Corporations Canada?",
        a: "Non. Les résolutions annuelles sont des registres internes de la société. Elles sont signées par les administrateurs et les actionnaires et conservées avec les procès-verbaux dans le livre des procès-verbaux. Ce qui est déposé auprès de Corporations Canada, c'est la déclaration annuelle, un dépôt distinct qui demande la date de la dernière assemblée annuelle ou des résolutions écrites signées à sa place.",
      },
      {
        q: "Des résolutions écrites peuvent-elles remplacer l'assemblée annuelle d'une société fédérale?",
        a: "Oui. En vertu de l'article 142 de la LCSA, une résolution écrite portant sur toutes les questions qui doivent être traitées en assemblée, et signée par tous les actionnaires habiles à voter à cette assemblée, satisfait aux exigences de la LCSA relatives à cette assemblée. La LCSA exige la signature de chaque actionnaire habile à voter, et non d'une majorité.",
      },
      {
        q: "Quand les résolutions annuelles doivent-elles être adoptées?",
        a: "L'article 133 de la LCSA exige chaque assemblée annuelle au plus tard 15 mois après la précédente et au plus tard six mois après la fin de l'exercice précédent. La première doit avoir lieu dans les 18 mois suivant la naissance de la société. Les résolutions écrites signées au lieu de l'assemblée satisfont aux exigences relatives à cette assemblée.",
      },
      {
        q: "Une petite société fédérale a-t-elle besoin d'un vérificateur?",
        a: "Une société qui n'a pas fait appel au public peut décider de ne pas nommer de vérificateur en vertu de l'article 163 de la LCSA. La résolution exige le consentement de tous les actionnaires, y compris les actionnaires sans droit de vote, et n'est valide que jusqu'à l'assemblée annuelle suivante; elle est donc renouvelée chaque année avec les résolutions annuelles.",
      },
      {
        q: "Que faire si la société a manqué plusieurs années de résolutions annuelles?",
        a: "De nombreuses sociétés mettent leur livre des procès-verbaux à jour en préparant des résolutions pour chaque année manquée. Chaque ensemble consigne les états financiers, les administrateurs, les dirigeants et le traitement de la vérification pour l'année visée. Vous pouvez passer une commande distincte pour chaque année, en indiquant la fin d'exercice et la date de signature de chaque ensemble.",
      },
    ],
  },
  es: {
    title: "Resoluciones anuales para su sociedad federal (CBCA)",
    blocks: [
      {
        type: "p",
        parts: [
          "Cada año, los directores de una sociedad regida por la Ley de Sociedades por Acciones de Canadá (CBCA) deben convocar una asamblea anual de accionistas. En la mayoría de las sociedades cerradas, esa asamblea se sustituye por resoluciones escritas: según el artículo 142 de la CBCA, una resolución escrita firmada por todos los accionistas con derecho a votar sobre ella es tan válida como si se hubiera aprobado en una asamblea. Korporex prepara las resoluciones anuales de los directores y de los accionistas, listas para firmar y archivar en el libro de actas de la sociedad. No se presenta nada ante Corporations Canada. Para ver dónde encajan estos documentos, lea nuestra guía sobre el ",
          { text: "libro de actas", href: "/guides/que-es-un-libro-de-actas" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades federales cuyos accionistas firman resoluciones escritas en lugar de celebrar una asamblea anual.",
          "Sociedades que se ponen al día con años en los que no hubo asamblea anual ni resoluciones firmadas.",
          "Sociedades que preparan su declaración anual federal, que pide la fecha de la última asamblea anual o de las últimas resoluciones anuales.",
        ],
      },
      { type: "h3", text: "Qué preparamos" },
      {
        type: "list",
        items: [
          "Una resolución de los directores que aprueba los estados financieros del ejercicio. Según el artículo 158 de la CBCA, los directores aprueban los estados antes de que se presenten a los accionistas.",
          "Una resolución de los directores que nombra a los funcionarios para el año siguiente.",
          "Una resolución de los accionistas que recibe los estados financieros y elige (o reelige) a los directores.",
          "El tratamiento de la auditoría: nombramiento de un auditor, o resolución de los accionistas de no nombrarlo. Cuando un contador prepara los estados financieros mediante un encargo de revisión o compilación en lugar de una auditoría, las resoluciones pueden nombrar a ese contador.",
          "Cualquier otro asunto que nos pida incluir, como aprobar un dividendo, ratificar actos de los directores o cambiar el cierre del ejercicio.",
        ],
      },
      {
        type: "p",
        parts: [
          "Según el artículo 163 de la CBCA, los accionistas de una sociedad que no es emisora (distributing) pueden resolver no nombrar un auditor. Esa resolución requiere el consentimiento de todos los accionistas, incluidos los que no tienen derecho a voto, y solo es válida hasta la siguiente asamblea anual, por lo que se renueva cada año.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal de la sociedad, su número de sociedad federal y el cierre de su ejercicio.",
          "La fecha en que se firmarán las resoluciones y, si la hay, la fecha de la última asamblea anual o de las últimas resoluciones anuales.",
          "Si los estados financieros del ejercicio están listos.",
          "Los directores que se elegirán, los funcionarios y sus cargos, y cada accionista que firmará (persona física o sociedad, con la clase de acciones si la conoce).",
          "Su confirmación de que todos los accionistas con derecho a voto firmarán las resoluciones escritas.",
        ],
      },
      { type: "h3", text: "Plazos según la CBCA" },
      {
        type: "p",
        parts: [
          "El artículo 133 de la CBCA exige convocar la primera asamblea anual a más tardar 18 meses después de que la sociedad comience a existir, y cada asamblea posterior a más tardar 15 meses después de la anterior y a más tardar seis meses después del cierre del ejercicio anterior. Los estados financieros presentados a los accionistas deben cubrir un período que terminó no más de seis meses antes de la asamblea. La fecha de las resoluciones se indica luego en la ",
          { text: "declaración anual federal", href: "/services/annual-return-federal" },
          ". Si la sociedad nunca se organizó con sus reglamentos, registros y certificados de acciones, el ",
          { text: "libro de actas inicial", href: "/services/initial-minute-book" },
          " es un servicio aparte.",
        ],
      },
    ],
    faqTitle: "Resoluciones anuales federales: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre las resoluciones anuales según la CBCA; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Las resoluciones anuales se presentan ante Corporations Canada?",
        a: "No. Las resoluciones anuales son registros internos de la sociedad. Las firman los directores y los accionistas y se conservan con las actas en el libro de actas. Lo que se presenta ante Corporations Canada es la declaración anual, una presentación distinta que pide la fecha de la última asamblea anual o de las resoluciones escritas firmadas en su lugar.",
      },
      {
        q: "¿Pueden las resoluciones escritas sustituir la asamblea anual de una sociedad federal?",
        a: "Sí. Según el artículo 142 de la CBCA, una resolución escrita que trate todos los asuntos que deben tratarse en una asamblea, firmada por todos los accionistas con derecho a voto en esa asamblea, cumple los requisitos de la CBCA para esa asamblea. La CBCA exige la firma de cada accionista con derecho a voto, no de una mayoría.",
      },
      {
        q: "¿Cuándo deben adoptarse las resoluciones anuales?",
        a: "El artículo 133 de la CBCA exige cada asamblea anual a más tardar 15 meses después de la anterior y a más tardar seis meses después del cierre del ejercicio anterior. La primera debe celebrarse dentro de los 18 meses siguientes a que la sociedad comience a existir. Las resoluciones escritas firmadas en lugar de la asamblea cumplen los requisitos de esa asamblea.",
      },
      {
        q: "¿Una sociedad federal pequeña necesita un auditor?",
        a: "Una sociedad que no es emisora puede resolver no nombrar un auditor según el artículo 163 de la CBCA. La resolución requiere el consentimiento de todos los accionistas, incluidos los que no tienen derecho a voto, y solo es válida hasta la siguiente asamblea anual, por lo que se renueva cada año junto con las resoluciones anuales.",
      },
      {
        q: "¿Qué pasa si la sociedad omitió varios años de resoluciones anuales?",
        a: "Muchas sociedades ponen al día su libro de actas preparando resoluciones para cada año omitido. Cada conjunto registra los estados financieros, los directores, los funcionarios y el tratamiento de la auditoría de ese año. Puede hacer un pedido separado para cada año, indicando el cierre del ejercicio y la fecha de firma de cada conjunto de resoluciones.",
      },
    ],
  },
};
