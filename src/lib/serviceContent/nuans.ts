import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the NUANS report order form. The form carries the
// transactional intent ("order a NUANS report"); the NUANS guides keep the
// informational intent (which jurisdictions require one, how to read one), so
// each locale links to them instead of repeating them. What we order and
// deliver mirrors src/lib/nuansReport.ts and NuansReportBody.tsx.
export const content: ServiceContentByLocale = {
  en: {
    title: "Order a NUANS name search report online",
    blocks: [
      {
        type: "p",
        parts: [
          "A NUANS report compares a proposed corporate name against registered Canadian business names, corporate names and trademarks, and lists the closest existing matches. Korporex runs an official NUANS report for each name you list, weighted for the jurisdiction you choose (an Ontario-biased report for Ontario, an Alberta report for Alberta), and emails all the reports to you together in a single PDF. Each report carries its own reference number, ready to use on your filing. To understand each part of the report once you have it, read our guide on ",
          { text: "how to read a NUANS report", href: "/guides/how-to-read-a-nuans-report" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Founders incorporating a named corporation in Ontario, Alberta or New Brunswick, the three provinces where a NUANS report must be supplied to incorporate.",
          "Corporations preparing a federal revival or amalgamation, where Corporations Canada still requires a NUANS report.",
          "Lawyers, law clerks and accountants ordering reports for clients, several names at a time.",
          "Business owners who want to see the closest existing names across Canada before committing to a brand.",
        ],
      },
      { type: "h3", text: "What we order and what you receive" },
      {
        type: "p",
        parts: [
          "You can list up to 10 proposed names in one order. For each name you give the full proposed name, its distinctive element and the jurisdiction the name is for: federal or any province or territory listed in the form. We run a separate NUANS search on every name and deliver the results together as one PDF, emailed to the address on the order, within a few hours of payment.",
        ],
      },
      { type: "h3", text: "How to enter your names" },
      {
        type: "list",
        items: [
          "For Ontario and other provincial filings, enter the name exactly as it will appear on the certificate, including the legal ending. Abbreviated endings such as Inc., Ltd. or Corp. end with a period.",
          "For a federal (CBCA) name, leave the legal ending off. NUANS compares only the distinctive element of a federal name.",
          "The distinctive element is the unique part of the name: in Maple Ridge Logistics Inc., it is Maple Ridge.",
          "A report is generally treated as valid for 90 days from the date it is generated, and Ontario requires the report filed with the Articles of Incorporation to be dated within 90 days. A report ordered long before filing can expire first.",
        ],
      },
      { type: "h3", text: "What a NUANS report does not do" },
      {
        type: "p",
        parts: [
          "A NUANS report is a search result, not a name approval or a reservation of the name. Federally, a Corporations Canada examiner decides whether the name is granted. Ontario does not review names for similarity at all, so in Ontario it is up to you to check the report for conflicts before you file. For which jurisdictions actually ask for a report, see ",
          { text: "which provinces require a NUANS report", href: "/guides/which-provinces-require-nuans" },
          ". If you are ready to incorporate, the Standard and Premium ",
          { text: "incorporation packages", href: "/incorporate" },
          " include one name search for the name in your order.",
        ],
      },
    ],
    faqTitle: "NUANS reports: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about NUANS name-search reports; Korporex does not advise on whether a particular name will be approved. For advice on your specific situation, consult a lawyer.",
    faq: [
      {
        q: "Can I file the report with my Ontario or Alberta incorporation?",
        a: "Yes. Each report is an official NUANS report, run for the jurisdiction you select and carrying its own reference number. In Ontario you enter the reference number, the name searched and the report date on the Ontario Business Registry; in Alberta the complete report goes in with your filing through a registry agent. File within 90 days of the report date.",
      },
      {
        q: "Do I need a NUANS report to incorporate federally?",
        a: "Not to incorporate. Corporations Canada has built the name search into its online incorporation filing, so no separate NUANS report is required for a new federal corporation. A NUANS report is still required for some federal filings, including the revival or amalgamation of a business corporation. Some founders order a federal report anyway, to see the closest existing names first.",
      },
      {
        q: "How long is a NUANS report valid?",
        a: "A NUANS report is generally treated as valid for 90 days from the date it is generated. For a named Ontario corporation, the report filed with the Articles of Incorporation must be dated within that window. If the filing does not go through in time, a new report has to be ordered.",
      },
      {
        q: "Does a clean NUANS report mean my name is approved?",
        a: "No. The report lists existing names and trademarks that resemble yours, but it does not approve or reserve the name. Federally, a Corporations Canada examiner reviews the name and can still reject it. Ontario does not review names for similarity, so a conflicting name can be challenged after filing, and in Alberta another corporation can object to the Registrar of Corporations. Read the report before you file.",
      },
      {
        q: "Can I search several names in one order?",
        a: "Yes. You can list up to 10 proposed names in a single order, each with its own distinctive element and jurisdiction. Each name is a separate NUANS search and is priced per name. All the results are delivered together in one PDF emailed to you.",
      },
      {
        q: "Does a numbered corporation need a NUANS report?",
        a: "No. No Canadian jurisdiction requires a NUANS report for a numbered corporation, because the government assigns the number and there is no chosen name to search. The corporation can later register a business name or change its name by amending its Articles.",
      },
    ],
  },
  fr: {
    title: "Commandez un rapport de recherche NUANS en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Un rapport NUANS compare une dénomination sociale proposée aux noms d'entreprises, dénominations sociales et marques de commerce enregistrés au Canada, et énumère les correspondances existantes les plus proches. Korporex produit un rapport NUANS officiel pour chaque dénomination que vous indiquez, pondéré pour le territoire de votre choix (un rapport à pondération ontarienne pour l'Ontario, un rapport albertain pour l'Alberta), et vous envoie tous les rapports par courriel dans un seul PDF. Chaque rapport porte son propre numéro de référence, prêt à être utilisé pour votre dépôt. Pour comprendre chaque partie du rapport une fois reçu, lisez notre guide sur ",
          { text: "la lecture d'un rapport NUANS", href: "/guides/comment-lire-un-rapport-nuans" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les fondateurs qui constituent une société nominative en Ontario, en Alberta ou au Nouveau-Brunswick, les trois provinces où un rapport NUANS doit être fourni pour se constituer.",
          "Les sociétés qui préparent une reconstitution ou une fusion fédérale, pour lesquelles Corporations Canada exige toujours un rapport NUANS.",
          "Les avocats, techniciens juridiques et comptables qui commandent des rapports pour leurs clients, plusieurs dénominations à la fois.",
          "Les propriétaires d'entreprise qui veulent voir les noms existants les plus proches au Canada avant de s'engager envers une marque.",
        ],
      },
      { type: "h3", text: "Ce que nous commandons et ce que vous recevez" },
      {
        type: "p",
        parts: [
          "Vous pouvez indiquer jusqu'à 10 dénominations proposées dans une commande. Pour chacune, vous fournissez la dénomination complète proposée, son élément distinctif et le territoire visé : le fédéral ou toute province ou tout territoire offert dans le formulaire. Nous effectuons une recherche NUANS distincte pour chaque dénomination et livrons les résultats ensemble dans un seul PDF, envoyé à l'adresse courriel de la commande, dans les quelques heures suivant le paiement.",
        ],
      },
      { type: "h3", text: "Comment inscrire vos dénominations" },
      {
        type: "list",
        items: [
          "Pour l'Ontario et les autres dépôts provinciaux, inscrivez la dénomination exactement telle qu'elle figurera sur le certificat, y compris la mention juridique. Les formes abrégées comme Inc., Ltd. ou Corp. se terminent par un point.",
          "Pour une dénomination fédérale (LCSA), omettez la mention juridique. NUANS compare seulement l'élément distinctif d'une dénomination fédérale.",
          "L'élément distinctif est la partie unique de la dénomination : dans Maple Ridge Logistics Inc., c'est Maple Ridge.",
          "Un rapport est généralement considéré comme valide pendant 90 jours à compter de sa production, et l'Ontario exige que le rapport déposé avec les statuts constitutifs soit daté de moins de 90 jours. Un rapport commandé longtemps avant le dépôt peut expirer avant celui-ci.",
        ],
      },
      { type: "h3", text: "Ce qu'un rapport NUANS ne fait pas" },
      {
        type: "p",
        parts: [
          "Un rapport NUANS est un résultat de recherche, et non une approbation ni une réservation de la dénomination. Au fédéral, un examinateur de Corporations Canada décide si la dénomination est accordée. L'Ontario n'examine pas du tout la similitude des dénominations; en Ontario, c'est donc à vous de vérifier le rapport avant le dépôt. Pour savoir quels territoires exigent réellement un rapport, consultez ",
          { text: "quelles provinces exigent un rapport NUANS", href: "/guides/quelles-provinces-exigent-un-rapport-nuans" },
          ". Si vous êtes prêt à vous constituer, les ",
          { text: "forfaits de constitution", href: "/incorporate" },
          " Standard et Premium comprennent une recherche pour la dénomination de votre commande.",
        ],
      },
    ],
    faqTitle: "Rapports NUANS : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur les rapports de recherche NUANS; Korporex ne se prononce pas sur l'approbation d'une dénomination donnée. Pour des conseils adaptés à votre situation, consultez un avocat.",
    faq: [
      {
        q: "Puis-je utiliser le rapport pour ma constitution en Ontario ou en Alberta?",
        a: "Oui. Chaque rapport est un rapport NUANS officiel, produit pour le territoire choisi et muni de son propre numéro de référence. En Ontario, vous inscrivez le numéro de référence, le nom recherché et la date du rapport au Registre des entreprises de l'Ontario; en Alberta, le rapport complet accompagne votre dépôt auprès d'un agent d'enregistrement. Déposez dans les 90 jours suivant la date du rapport.",
      },
      {
        q: "Faut-il un rapport NUANS pour se constituer au fédéral?",
        a: "Pas pour se constituer. Corporations Canada a intégré la recherche de dénomination à son dépôt en ligne, de sorte qu'aucun rapport NUANS distinct n'est exigé pour une nouvelle société fédérale. Un rapport NUANS demeure exigé pour certains dépôts fédéraux, notamment la reconstitution ou la fusion d'une société par actions. Certains fondateurs en commandent un quand même, pour voir d'abord les noms existants les plus proches.",
      },
      {
        q: "Combien de temps un rapport NUANS est-il valide?",
        a: "Un rapport NUANS est généralement considéré comme valide pendant 90 jours à compter de sa production. Pour une société ontarienne nominative, le rapport déposé avec les statuts constitutifs doit être daté à l'intérieur de ce délai. Si le dépôt n'est pas fait à temps, il faut commander un nouveau rapport.",
      },
      {
        q: "Un rapport NUANS sans conflit signifie-t-il que ma dénomination est approuvée?",
        a: "Non. Le rapport énumère les noms et marques existants qui ressemblent au vôtre, mais il n'approuve ni ne réserve la dénomination. Au fédéral, un examinateur de Corporations Canada évalue la dénomination et peut encore la refuser. L'Ontario n'examine pas la similitude des dénominations, de sorte qu'un nom conflictuel peut être contesté après le dépôt, et en Alberta une autre société peut s'y opposer auprès du registraire. Lisez le rapport avant de déposer.",
      },
      {
        q: "Puis-je rechercher plusieurs dénominations dans une seule commande?",
        a: "Oui. Vous pouvez indiquer jusqu'à 10 dénominations proposées dans une seule commande, chacune avec son élément distinctif et son territoire. Chaque dénomination fait l'objet d'une recherche NUANS distincte et est facturée séparément. Tous les résultats vous sont livrés ensemble dans un seul PDF envoyé par courriel.",
      },
      {
        q: "Une société à matricule a-t-elle besoin d'un rapport NUANS?",
        a: "Non. Aucun territoire canadien n'exige de rapport NUANS pour une société à matricule, puisque le gouvernement attribue le numéro et qu'il n'y a aucune dénomination choisie à rechercher. La société peut plus tard enregistrer un nom commercial ou changer de dénomination par modification de ses statuts.",
      },
    ],
  },
  es: {
    title: "Solicite un informe de búsqueda NUANS en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Un informe NUANS compara un nombre de sociedad propuesto con los nombres comerciales, nombres de sociedades y marcas registrados en Canadá, y enumera las coincidencias existentes más cercanas. Korporex genera un informe NUANS oficial para cada nombre que usted indique, ponderado para la jurisdicción que elija (un informe con ponderación ontariana para Ontario, un informe de Alberta para Alberta), y le envía todos los informes por correo electrónico en un solo PDF. Cada informe lleva su propio número de referencia, listo para usar en su trámite. Para entender cada parte del informe una vez que lo reciba, lea nuestra guía sobre ",
          { text: "cómo leer un informe NUANS", href: "/guides/como-leer-un-informe-nuans" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Fundadores que constituyen una sociedad con nombre en Ontario, Alberta o Nuevo Brunswick, las tres provincias donde se debe presentar un informe NUANS para constituirse.",
          "Sociedades que preparan una reactivación o una fusión federal, para las cuales Corporations Canada todavía exige un informe NUANS.",
          "Abogados, asistentes legales y contadores que solicitan informes para sus clientes, varios nombres a la vez.",
          "Propietarios de negocios que quieren ver los nombres existentes más cercanos en todo Canadá antes de comprometerse con una marca.",
        ],
      },
      { type: "h3", text: "Qué solicitamos y qué recibe usted" },
      {
        type: "p",
        parts: [
          "Puede indicar hasta 10 nombres propuestos en un pedido. Para cada uno, indica el nombre completo propuesto, su elemento distintivo y la jurisdicción a la que corresponde: federal o cualquier provincia o territorio disponible en el formulario. Realizamos una búsqueda NUANS separada para cada nombre y entregamos los resultados juntos en un solo PDF, enviado al correo electrónico del pedido, dentro de unas pocas horas después del pago.",
        ],
      },
      { type: "h3", text: "Cómo ingresar sus nombres" },
      {
        type: "list",
        items: [
          "Para Ontario y otras presentaciones provinciales, ingrese el nombre exactamente como aparecerá en el certificado, incluida la terminación legal. Las terminaciones abreviadas como Inc., Ltd. o Corp. terminan con punto.",
          "Para un nombre federal (CBCA), omita la terminación legal. NUANS compara solo el elemento distintivo de un nombre federal.",
          "El elemento distintivo es la parte única del nombre: en Maple Ridge Logistics Inc., es Maple Ridge.",
          "Por lo general, un informe se considera válido durante 90 días desde su generación, y Ontario exige que el informe presentado con los estatutos de constitución tenga una antigüedad máxima de 90 días. Un informe solicitado mucho antes de la presentación puede vencer primero.",
        ],
      },
      { type: "h3", text: "Lo que un informe NUANS no hace" },
      {
        type: "p",
        parts: [
          "Un informe NUANS es un resultado de búsqueda, no una aprobación ni una reserva del nombre. A nivel federal, un examinador de Corporations Canada decide si se concede el nombre. Ontario no revisa en absoluto la similitud de los nombres, así que en Ontario le corresponde a usted revisar el informe antes de presentar. Para saber qué jurisdicciones realmente piden un informe, consulte ",
          { text: "qué provincias exigen un informe NUANS", href: "/guides/que-provincias-exigen-un-informe-nuans" },
          ". Si está listo para constituirse, los ",
          { text: "paquetes de constitución", href: "/incorporate" },
          " Standard y Premium incluyen una búsqueda para el nombre de su pedido.",
        ],
      },
    ],
    faqTitle: "Informes NUANS: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre los informes de búsqueda NUANS; Korporex no se pronuncia sobre si un nombre determinado será aprobado. Para asesoría sobre su situación particular, consulte a un abogado.",
    faq: [
      {
        q: "¿Puedo usar el informe para constituirme en Ontario o Alberta?",
        a: "Sí. Cada informe es un informe NUANS oficial, generado para la jurisdicción que elija y con su propio número de referencia. En Ontario se ingresa el número de referencia, el nombre buscado y la fecha del informe en el Ontario Business Registry; en Alberta el informe completo acompaña su trámite ante un agente de registro. Presente dentro de los 90 días siguientes a la fecha del informe.",
      },
      {
        q: "¿Necesito un informe NUANS para constituirme a nivel federal?",
        a: "No para constituirse. Corporations Canada integró la búsqueda de nombre en su presentación de constitución en línea, por lo que no se exige un informe NUANS aparte para una nueva sociedad federal. Todavía se exige un informe NUANS para algunas presentaciones federales, como la reactivación o la fusión de una sociedad por acciones. Algunos fundadores igual solicitan uno, para ver primero los nombres existentes más cercanos.",
      },
      {
        q: "¿Cuánto tiempo es válido un informe NUANS?",
        a: "Por lo general, un informe NUANS se considera válido durante 90 días desde su generación. Para una sociedad de Ontario con nombre, el informe presentado con los estatutos de constitución debe tener una fecha dentro de ese plazo. Si la presentación no se completa a tiempo, hay que solicitar un informe nuevo.",
      },
      {
        q: "¿Un informe NUANS sin conflictos significa que mi nombre está aprobado?",
        a: "No. El informe enumera los nombres y marcas existentes que se parecen al suyo, pero no aprueba ni reserva el nombre. A nivel federal, un examinador de Corporations Canada revisa el nombre y todavía puede rechazarlo. Ontario no revisa la similitud de los nombres, por lo que un nombre en conflicto puede impugnarse después de presentar, y en Alberta otra sociedad puede oponerse ante el Registrar of Corporations. Lea el informe antes de presentar.",
      },
      {
        q: "¿Puedo buscar varios nombres en un solo pedido?",
        a: "Sí. Puede indicar hasta 10 nombres propuestos en un solo pedido, cada uno con su propio elemento distintivo y su jurisdicción. Cada nombre es una búsqueda NUANS separada y tiene su propio precio. Todos los resultados se entregan juntos en un solo PDF enviado por correo electrónico.",
      },
      {
        q: "¿Una sociedad numérica necesita un informe NUANS?",
        a: "No. Ninguna jurisdicción canadiense exige un informe NUANS para una sociedad numérica, porque el gobierno asigna el número y no hay un nombre elegido que buscar. Más adelante, la sociedad puede registrar un nombre comercial o cambiar su nombre modificando sus estatutos.",
      },
    ],
  },
};
