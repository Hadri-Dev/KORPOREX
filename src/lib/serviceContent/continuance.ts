import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the continuance order form. The form is a client
// wizard with almost no crawlable text, so this block carries the page's
// service intent ("move my corporation to another jurisdiction, file it for
// me"). Requirements verified 2026-10-04 against OBCA ss. 180-181, CBCA
// ss. 187-188, Corporations Canada's import/export continuance policies and the
// fee schedules on ised-isde.canada.ca and ontario.ca.
export const content: ServiceContentByLocale = {
  en: {
    title: "Continue your corporation into a new jurisdiction",
    blocks: [
      {
        type: "p",
        parts: [
          "A continuance moves a corporation from the statute it is governed by today to the corporate statute of another jurisdiction, for example from the Ontario Business Corporations Act (OBCA) to the Canada Business Corporations Act (CBCA), or the reverse. The corporation keeps its existence, property and obligations; what changes is the law that governs it and the registry it reports to. Korporex prepares the filings for a continuance into or out of federal or Ontario jurisdiction and coordinates both sides of the process. For the differences between the two regimes, see our guide on ",
          { text: "federal vs. provincial incorporation", href: "/guides/federal-vs-provincial-incorporation" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Ontario corporations moving to federal jurisdiction (export from Ontario, import into the CBCA).",
          "Federal corporations moving to Ontario (export from the CBCA, import into the OBCA).",
          "Corporations from another province, such as British Columbia, Alberta or Quebec, moving into federal or Ontario jurisdiction, and federal or Ontario corporations moving to another province.",
          "Groups that need two corporations under the same statute before an amalgamation.",
        ],
      },
      { type: "h3", text: "How a continuance works" },
      {
        type: "p",
        parts: [
          "Every continuance has two sides. The exporting jurisdiction authorizes the corporation to leave, and the importing jurisdiction issues a certificate of continuance. Leaving Ontario, the shareholders approve the continuance by special resolution and the Director endorses an Application for Authorization to Continue in Another Jurisdiction; that authorization expires six months after endorsement unless the corporation is continued within that time, and a copy of the new jurisdiction's instrument of continuance is filed in Ontario within 60 days of its issue. Leaving the CBCA, the shareholders pass a special resolution, Corporations Canada issues a letter of satisfaction valid for 90 days, and it issues a certificate of discontinuance once it receives the importing jurisdiction's certificate.",
        ],
      },
      { type: "h3", text: "What we file and what you provide" },
      {
        type: "p",
        parts: [
          "We prepare the exporting jurisdiction's authorization filing and the Articles of Continuance for the importing jurisdiction (Form 11, with Form 2, for a continuance into the CBCA). You provide the direction of the move, the current and destination jurisdictions, the corporation's current name, corporation number and business number, any new name, the new registered office in the destination jurisdiction, the reason for the continuance, the date of the shareholders' special resolution, the directors of the continued corporation and the effective date you want.",
        ],
      },
      { type: "h3", text: "Key requirements" },
      {
        type: "list",
        items: [
          "The shareholders authorize the continuance by special resolution. Under both the OBCA and the CBCA, shareholders who dissent are entitled to be paid the fair value of their shares.",
          "Corporations Canada needs the Ontario authorization (an endorsed Application for Authorization to Continue) to import an Ontario corporation, and a word name must be pre-approved by Corporations Canada.",
          "Ontario's Articles of Continuance are supported by the home jurisdiction's authorization, and a name that is not a number name requires an Ontario-biased NUANS report.",
          "Government filing fees: Corporations Canada charges $200 to import online and nothing to export; Ontario charges $330 for Articles of Continuance and $330 for an authorization to continue out.",
        ],
      },
      {
        type: "p",
        parts: [
          "If the move is a step toward combining two corporations, our ",
          { text: "amalgamation service", href: "/services/amalgamation" },
          " covers the next filing. A new name for the continued corporation can be checked first with a ",
          { text: "NUANS name search report", href: "/nuans" },
          ".",
        ],
      },
    ],
    faqTitle: "Continuing a corporation: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the continuance filing; for advice on your specific situation, including its tax consequences, consult a lawyer or accountant.",
    faq: [
      {
        q: "Is a continuance the same as dissolving and incorporating again?",
        a: "No. A continued corporation is the same legal entity: it keeps its property, contracts, rights and liabilities, and proceedings by or against it continue. Only the statute that governs it and the registry it reports to change. Dissolving and incorporating a new corporation would instead create a separate legal person.",
      },
      {
        q: "Why does a continuance involve two registries?",
        a: "The corporation needs permission to leave its current jurisdiction and a certificate from the new one. The exporting registry authorizes the departure, the importing registry issues the certificate of continuance, and the exporting registry then records that the corporation has left. Korporex coordinates both filings.",
      },
      {
        q: "Do the shareholders have to approve a continuance?",
        a: "Yes. Under both the OBCA and the CBCA, a continuance out of the jurisdiction is authorized by special resolution of the shareholders, meaning at least two-thirds of the votes cast. Under the CBCA, every share carries a vote on a continuance, even shares that are otherwise non-voting, and dissenting shareholders can claim the fair value of their shares.",
      },
      {
        q: "Can the corporation change its name when it continues?",
        a: "Yes. The Articles of Continuance can set out a new name, and some corporations change names because the existing name conflicts with one in the destination registry. A word name continuing into the CBCA must be pre-approved by Corporations Canada, and a name continuing into Ontario that is not a number name requires an Ontario-biased NUANS report.",
      },
      {
        q: "When is the corporation governed by its new jurisdiction?",
        a: "From the date on the certificate of continuance issued by the importing jurisdiction. A corporation continued into the CBCA becomes subject to it on the date shown on its federal certificate of continuance. A federal corporation that leaves ceases to be governed by the CBCA on the date of its certificate of discontinuance.",
      },
    ],
  },
  fr: {
    title: "Prorogez votre société dans un nouveau ressort",
    blocks: [
      {
        type: "p",
        parts: [
          "La prorogation fait passer une société de la loi qui la régit aujourd'hui à la loi sur les sociétés d'un autre ressort, par exemple de la Loi sur les sociétés par actions de l'Ontario (LSAO) à la Loi canadienne sur les sociétés par actions (LCSA), ou l'inverse. La société conserve son existence, ses biens et ses obligations; ce qui change, c'est la loi qui la régit et le registre auquel elle fait rapport. Korporex prépare les dépôts pour une prorogation vers le fédéral ou l'Ontario, ou à partir de ceux-ci, et coordonne les deux volets du processus. Pour les différences entre les deux régimes, consultez notre guide sur ",
          { text: "la constitution fédérale ou provinciale", href: "/guides/comment-se-constituer-societe-canada" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés ontariennes qui passent sous le régime fédéral (exportation de l'Ontario, importation sous la LCSA).",
          "Les sociétés fédérales qui passent sous le régime de l'Ontario (exportation de la LCSA, importation sous la LSAO).",
          "Les sociétés d'une autre province, comme la Colombie-Britannique, l'Alberta ou le Québec, qui passent sous le régime fédéral ou ontarien, et les sociétés fédérales ou ontariennes qui passent dans une autre province.",
          "Les groupes qui doivent placer deux sociétés sous la même loi avant une fusion.",
        ],
      },
      { type: "h3", text: "Le fonctionnement d'une prorogation" },
      {
        type: "p",
        parts: [
          "Toute prorogation comporte deux volets. Le ressort d'origine autorise la société à partir, et le ressort d'accueil délivre un certificat de prorogation. Pour quitter l'Ontario, les actionnaires approuvent la prorogation par résolution spéciale et le directeur appose son autorisation sur une demande d'autorisation de prorogation dans un autre ressort; cette autorisation expire six mois après son apposition si la société n'est pas prorogée dans ce délai, et une copie de l'acte de prorogation du nouveau ressort est déposée en Ontario dans les 60 jours de sa délivrance. Pour quitter la LCSA, les actionnaires adoptent une résolution spéciale, Corporations Canada délivre une lettre d'approbation valide 90 jours, puis un certificat de cessation dès qu'il reçoit le certificat du ressort d'accueil.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous fournissez" },
      {
        type: "p",
        parts: [
          "Nous préparons le dépôt d'autorisation du ressort d'origine et les statuts de prorogation du ressort d'accueil (formulaire 11, avec le formulaire 2, pour une prorogation sous la LCSA). Vous fournissez le sens du transfert, le ressort actuel et le ressort de destination, la dénomination actuelle de la société, son numéro de société et son numéro d'entreprise, toute nouvelle dénomination, le nouveau siège social dans le ressort de destination, le motif de la prorogation, la date de la résolution spéciale des actionnaires, les administrateurs de la société prorogée et la date d'effet souhaitée.",
        ],
      },
      { type: "h3", text: "Exigences principales" },
      {
        type: "list",
        items: [
          "Les actionnaires autorisent la prorogation par résolution spéciale. En vertu de la LSAO comme de la LCSA, les actionnaires dissidents ont le droit de se faire verser la juste valeur de leurs actions.",
          "Corporations Canada exige l'autorisation de l'Ontario (une demande d'autorisation de prorogation revêtue de l'autorisation) pour importer une société ontarienne, et une dénomination nominative doit être préapprouvée par Corporations Canada.",
          "Les statuts de prorogation de l'Ontario sont appuyés par l'autorisation du ressort d'origine, et une dénomination qui n'est pas un matricule exige un rapport NUANS axé sur l'Ontario.",
          "Droits gouvernementaux : Corporations Canada exige 200 $ pour une importation en ligne et rien pour une exportation; l'Ontario exige 330 $ pour les statuts de prorogation et 330 $ pour une autorisation de prorogation à l'extérieur.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si le transfert prépare le regroupement de deux sociétés, notre ",
          { text: "service de fusion", href: "/services/amalgamation" },
          " couvre le dépôt suivant. Une nouvelle dénomination pour la société prorogée peut d'abord être vérifiée au moyen d'un ",
          { text: "rapport de recherche de nom NUANS", href: "/nuans" },
          ".",
        ],
      },
    ],
    faqTitle: "Proroger une société : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt de prorogation; pour des conseils adaptés à votre situation, y compris ses conséquences fiscales, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "La prorogation équivaut-elle à dissoudre la société et à en constituer une nouvelle?",
        a: "Non. Une société prorogée est la même entité juridique : elle conserve ses biens, contrats, droits et obligations, et les poursuites intentées par ou contre elle se poursuivent. Seuls la loi qui la régit et le registre auquel elle fait rapport changent. Une dissolution suivie d'une nouvelle constitution créerait plutôt une personne morale distincte.",
      },
      {
        q: "Pourquoi une prorogation fait-elle intervenir deux registres?",
        a: "La société a besoin de la permission de quitter son ressort actuel et d'un certificat du nouveau ressort. Le registre d'origine autorise le départ, le registre d'accueil délivre le certificat de prorogation, puis le registre d'origine constate que la société est partie. Korporex coordonne les deux dépôts.",
      },
      {
        q: "Les actionnaires doivent-ils approuver la prorogation?",
        a: "Oui. En vertu de la LSAO comme de la LCSA, la prorogation à l'extérieur du ressort est autorisée par résolution spéciale des actionnaires, soit au moins les deux tiers des voix exprimées. Sous la LCSA, chaque action confère un droit de vote sur la prorogation, même une action par ailleurs sans droit de vote, et les actionnaires dissidents peuvent réclamer la juste valeur de leurs actions.",
      },
      {
        q: "La société peut-elle changer de dénomination lors de la prorogation?",
        a: "Oui. Les statuts de prorogation peuvent énoncer une nouvelle dénomination, et certaines sociétés en changent parce que la dénomination existante entre en conflit avec une autre dans le registre de destination. Une dénomination nominative prorogée sous la LCSA doit être préapprouvée par Corporations Canada, et une dénomination prorogée en Ontario qui n'est pas un matricule exige un rapport NUANS axé sur l'Ontario.",
      },
      {
        q: "À partir de quand la société est-elle régie par son nouveau ressort?",
        a: "À compter de la date du certificat de prorogation délivré par le ressort d'accueil. Une société prorogée sous la LCSA y est assujettie à la date indiquée sur son certificat de prorogation fédéral. Une société fédérale qui quitte la LCSA cesse d'y être assujettie à la date de son certificat de cessation.",
      },
    ],
  },
  es: {
    title: "Continúe su sociedad en una nueva jurisdicción",
    blocks: [
      {
        type: "p",
        parts: [
          "La continuación traslada una sociedad de la ley que la rige hoy a la ley de sociedades de otra jurisdicción, por ejemplo de la Ley de Sociedades por Acciones de Ontario (OBCA) a la Ley de Sociedades por Acciones de Canadá (CBCA), o a la inversa. La sociedad conserva su existencia, sus bienes y sus obligaciones; lo que cambia es la ley que la rige y el registro ante el que informa. Korporex prepara las presentaciones para una continuación hacia o desde la jurisdicción federal o de Ontario y coordina ambos lados del proceso. Para conocer las diferencias entre los dos regímenes, lea nuestra guía sobre ",
          { text: "la constitución federal o provincial", href: "/guides/como-constituirse-sociedad-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades de Ontario que pasan a la jurisdicción federal (exportación desde Ontario, importación bajo la CBCA).",
          "Sociedades federales que pasan a Ontario (exportación desde la CBCA, importación bajo la OBCA).",
          "Sociedades de otra provincia, como Columbia Británica, Alberta o Quebec, que pasan a la jurisdicción federal o de Ontario, y sociedades federales o de Ontario que pasan a otra provincia.",
          "Grupos que necesitan dos sociedades bajo la misma ley antes de una fusión.",
        ],
      },
      { type: "h3", text: "Cómo funciona una continuación" },
      {
        type: "p",
        parts: [
          "Toda continuación tiene dos lados. La jurisdicción de origen autoriza a la sociedad a salir y la jurisdicción de destino emite un certificado de continuación. Para salir de Ontario, los accionistas aprueban la continuación mediante resolución especial y el Director respalda una solicitud de autorización para continuar en otra jurisdicción; esa autorización vence seis meses después de su respaldo si la sociedad no se continúa en ese plazo, y una copia del instrumento de continuación de la nueva jurisdicción se presenta en Ontario dentro de los 60 días siguientes a su emisión. Para salir de la CBCA, los accionistas aprueban una resolución especial, Corporations Canada emite una carta de conformidad válida por 90 días y luego un certificado de cese cuando recibe el certificado de la jurisdicción de destino.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué proporciona usted" },
      {
        type: "p",
        parts: [
          "Preparamos la presentación de autorización de la jurisdicción de origen y los artículos de continuación de la jurisdicción de destino (formulario 11, con el formulario 2, en una continuación bajo la CBCA). Usted proporciona la dirección del traslado, las jurisdicciones actual y de destino, la denominación actual de la sociedad, su número de sociedad y su número de negocio, cualquier nueva denominación, el nuevo domicilio social en la jurisdicción de destino, el motivo de la continuación, la fecha de la resolución especial de los accionistas, los directores de la sociedad continuada y la fecha de entrada en vigor que desea.",
        ],
      },
      { type: "h3", text: "Requisitos principales" },
      {
        type: "list",
        items: [
          "Los accionistas autorizan la continuación mediante resolución especial. Tanto en la OBCA como en la CBCA, los accionistas disidentes tienen derecho a que se les pague el valor justo de sus acciones.",
          "Corporations Canada exige la autorización de Ontario (una solicitud de autorización para continuar respaldada) para importar una sociedad de Ontario, y una denominación con palabras debe ser preaprobada por Corporations Canada.",
          "Los artículos de continuación de Ontario se acompañan de la autorización de la jurisdicción de origen, y una denominación que no sea numerada exige un informe NUANS orientado a Ontario.",
          "Tasas gubernamentales: Corporations Canada cobra 200 $ por una importación en línea y nada por una exportación; Ontario cobra 330 $ por los artículos de continuación y 330 $ por una autorización para continuar fuera de la provincia.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si el traslado es un paso previo para unir dos sociedades, nuestro ",
          { text: "servicio de fusión", href: "/services/amalgamation" },
          " cubre la siguiente presentación. Una nueva denominación para la sociedad continuada puede verificarse primero con un ",
          { text: "informe de búsqueda de nombre NUANS", href: "/nuans" },
          ".",
        ],
      },
    ],
    faqTitle: "Continuar una sociedad: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de continuación; para asesoría sobre su situación particular, incluidas sus consecuencias fiscales, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Una continuación equivale a disolver la sociedad y constituir otra?",
        a: "No. Una sociedad continuada es la misma entidad jurídica: conserva sus bienes, contratos, derechos y obligaciones, y los procesos iniciados por o contra ella continúan. Solo cambian la ley que la rige y el registro ante el que informa. Disolver y constituir una nueva sociedad crearía, en cambio, una persona jurídica distinta.",
      },
      {
        q: "¿Por qué una continuación involucra dos registros?",
        a: "La sociedad necesita permiso para salir de su jurisdicción actual y un certificado de la nueva. El registro de origen autoriza la salida, el registro de destino emite el certificado de continuación y luego el registro de origen deja constancia de que la sociedad salió. Korporex coordina ambas presentaciones.",
      },
      {
        q: "¿Los accionistas deben aprobar la continuación?",
        a: "Sí. Tanto en la OBCA como en la CBCA, la continuación fuera de la jurisdicción se autoriza mediante resolución especial de los accionistas, es decir, al menos dos tercios de los votos emitidos. En la CBCA, cada acción da derecho a voto sobre la continuación, incluso las que de otro modo no votan, y los accionistas disidentes pueden reclamar el valor justo de sus acciones.",
      },
      {
        q: "¿Puede la sociedad cambiar de denominación al continuarse?",
        a: "Sí. Los artículos de continuación pueden establecer una nueva denominación, y algunas sociedades la cambian porque la existente entra en conflicto con otra en el registro de destino. Una denominación con palabras que se continúa bajo la CBCA debe ser preaprobada por Corporations Canada, y una denominación que se continúa en Ontario y no es numerada exige un informe NUANS orientado a Ontario.",
      },
      {
        q: "¿Desde cuándo se rige la sociedad por su nueva jurisdicción?",
        a: "Desde la fecha del certificado de continuación emitido por la jurisdicción de destino. Una sociedad continuada bajo la CBCA queda sujeta a ella en la fecha que figura en su certificado federal de continuación. Una sociedad federal que sale deja de regirse por la CBCA en la fecha de su certificado de cese.",
      },
    ],
  },
};
