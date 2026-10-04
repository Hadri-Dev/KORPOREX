import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the amalgamation order form. The form is a client
// wizard with almost no crawlable text, so this block carries the page's
// service intent ("amalgamate my corporations, file it for me"). Government
// fees verified 2026-10-04 against ised-isde.canada.ca (services, fees and
// processing times) and ontario.ca (cost and time to register or change).
export const content: ServiceContentByLocale = {
  en: {
    title: "Amalgamate your corporations online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files Articles of Amalgamation to combine two or more Ontario (OBCA) or federal (CBCA) corporations into a single amalgamated corporation. You tell us which corporations are amalgamating, the type of amalgamation, and the name, registered office, directors and share structure of the amalgamated corporation. We draft the articles and file them with the Ontario Business Registry or Corporations Canada. Amalgamations are common in groups built around a ",
          { text: "holding company", href: "/guides/holding-company-canada" },
          ", where the parent and its subsidiaries are folded into one corporation.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "A holding corporation combining with one or more of its wholly-owned subsidiaries (short-form vertical amalgamation).",
          "Two or more wholly-owned subsidiaries of the same parent combining with each other (short-form horizontal amalgamation).",
          "Separate corporations, with their own shareholders, that have agreed to combine (long-form amalgamation).",
        ],
      },
      { type: "h3", text: "The three types of amalgamation" },
      {
        type: "p",
        parts: [
          "In a long-form amalgamation, the corporations enter into an amalgamation agreement that sets out, among other things, how the shares of each amalgamating corporation are converted, and the shareholders of each corporation adopt it by special resolution (two-thirds of the votes cast). A short-form vertical amalgamation combines a holding corporation with wholly-owned subsidiaries, and a short-form horizontal amalgamation combines wholly-owned subsidiaries of the same parent. Short-form amalgamations are approved by resolutions of the directors of each amalgamating corporation, without a shareholder vote, and the amalgamated corporation's articles follow those of the holding corporation (vertical) or of the subsidiary whose shares are not cancelled (horizontal), apart from the name.",
        ],
      },
      { type: "h3", text: "What we file and what you provide" },
      {
        type: "p",
        parts: [
          "We prepare the Articles of Amalgamation (Form 9 for a federal amalgamation, filed with Form 2 for the amalgamated corporation's registered office and first directors) and submit them to the registry. You provide the name and corporation number of each amalgamating corporation, the amalgamated corporation's name or a numbered name, its registered office address, its directors and a plain-language description of its share structure, the date of the amalgamation agreement or directors' resolutions, the date of the shareholders' special resolutions for a long-form amalgamation, and the effective date you want.",
        ],
      },
      { type: "h3", text: "Key requirements" },
      {
        type: "list",
        items: [
          "All amalgamating corporations must be governed by the same statute. A corporation from another jurisdiction is first continued into the jurisdiction of the amalgamation.",
          "A director or officer of each amalgamating corporation gives a statement (a statutory declaration federally) that there are reasonable grounds to believe each corporation is solvent and that no creditor will be prejudiced, or that adequate notice has been given to known creditors.",
          "Federally, a NUANS report dated within 90 days of filing is required unless the amalgamated corporation keeps the name of an amalgamating corporation, takes a numbered name or changes only the legal element. In Ontario, a proposed name that is not a number name requires an Ontario-biased NUANS report.",
          "Government filing fees: $200 to file online with Corporations Canada ($250 by email or mail), and $330 in Ontario.",
        ],
      },
      {
        type: "p",
        parts: [
          "If one of the corporations is governed by a different statute, our ",
          { text: "continuance service", href: "/services/continuance" },
          " covers the move between jurisdictions. If the amalgamated corporation needs a new name, you can order a ",
          { text: "NUANS name search report", href: "/nuans" },
          " from us before filing.",
        ],
      },
    ],
    faqTitle: "Amalgamating corporations: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the amalgamation filing; for advice on your specific situation, including its tax consequences, consult a lawyer or accountant.",
    faq: [
      {
        q: "What is the difference between a long-form and a short-form amalgamation?",
        a: "A long-form amalgamation needs an amalgamation agreement adopted by special resolution of the shareholders of each amalgamating corporation. A short-form amalgamation is available only to a holding corporation and its wholly-owned subsidiaries, or to wholly-owned subsidiaries of the same parent, and is approved by resolutions of the directors of each corporation without a shareholder vote.",
      },
      {
        q: "Can an Ontario corporation amalgamate with a federal corporation?",
        a: "Not directly. The OBCA and the CBCA each allow amalgamation only between corporations governed by that Act. One corporation is first continued into the other's jurisdiction, and the Articles of Amalgamation are then filed in that jurisdiction. Korporex files both the continuance and the amalgamation.",
      },
      {
        q: "Is a NUANS report required to amalgamate?",
        a: "Only when the amalgamated corporation takes a new word name. Corporations Canada does not require one if the amalgamated corporation keeps the name of an amalgamating corporation, uses a numbered name or changes only the legal element, and a required report must be dated within 90 days of filing. In Ontario, a new name that is not a number name requires an Ontario-biased NUANS report.",
      },
      {
        q: "What happens to the assets, contracts and debts of the amalgamating corporations?",
        a: "The amalgamating corporations continue as one corporation. The amalgamated corporation holds all of their property, rights and privileges and is subject to all of their liabilities, contracts and debts. Legal proceedings by or against an amalgamating corporation continue by or against the amalgamated corporation, and the amalgamating corporations no longer exist as separate entities.",
      },
      {
        q: "When does the amalgamation take effect?",
        a: "On the date shown on the certificate of amalgamation issued by the registry. For a federal amalgamation, that is the date Corporations Canada receives the articles or a later date requested in the filing. When you order, Korporex asks for the effective date you want so it can be reflected in the filing.",
      },
    ],
  },
  fr: {
    title: "Fusionnez vos sociétés en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose les statuts de fusion qui réunissent deux sociétés ontariennes (LSAO) ou fédérales (LCSA) ou plus en une seule société issue de la fusion. Vous nous indiquez quelles sociétés fusionnent, le type de fusion, ainsi que la dénomination, le siège social, les administrateurs et la structure du capital-actions de la société issue de la fusion. Nous rédigeons les statuts et les déposons auprès du Registre des entreprises de l'Ontario ou de Corporations Canada. Les fusions sont courantes dans les groupes organisés autour d'une ",
          { text: "société de portefeuille", href: "/guides/societe-de-portefeuille-canada" },
          ", lorsque la société mère et ses filiales sont regroupées en une seule société.",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Une société mère qui fusionne avec une ou plusieurs de ses filiales en propriété exclusive (fusion simplifiée verticale).",
          "Deux filiales en propriété exclusive ou plus d'une même société mère qui fusionnent entre elles (fusion simplifiée horizontale).",
          "Des sociétés distinctes, ayant leurs propres actionnaires, qui ont convenu de se regrouper (fusion ordinaire).",
        ],
      },
      { type: "h3", text: "Les trois types de fusion" },
      {
        type: "p",
        parts: [
          "Dans une fusion ordinaire, les sociétés concluent une convention de fusion qui précise notamment comment les actions de chaque société fusionnante sont converties, et les actionnaires de chaque société l'adoptent par résolution spéciale (les deux tiers des voix exprimées). Une fusion simplifiée verticale réunit une société mère et des filiales en propriété exclusive, et une fusion simplifiée horizontale réunit des filiales en propriété exclusive d'une même société mère. Les fusions simplifiées sont approuvées par résolution des administrateurs de chaque société fusionnante, sans vote des actionnaires, et les statuts de la société issue de la fusion reprennent ceux de la société mère (verticale) ou de la filiale dont les actions ne sont pas annulées (horizontale), sauf pour la dénomination.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous fournissez" },
      {
        type: "p",
        parts: [
          "Nous préparons les statuts de fusion (formulaire 9 pour une fusion fédérale, déposé avec le formulaire 2 pour le siège social et le premier conseil d'administration de la société issue de la fusion) et les soumettons au registre. Vous fournissez la dénomination et le numéro de société de chaque société fusionnante, la dénomination de la société issue de la fusion ou un matricule, l'adresse de son siège social, ses administrateurs et une description en langage simple de la structure de son capital-actions, la date de la convention de fusion ou des résolutions des administrateurs, la date des résolutions spéciales des actionnaires pour une fusion ordinaire, et la date d'effet souhaitée.",
        ],
      },
      { type: "h3", text: "Exigences principales" },
      {
        type: "list",
        items: [
          "Toutes les sociétés fusionnantes doivent être régies par la même loi. Une société d'un autre ressort est d'abord prorogée dans le ressort de la fusion.",
          "Un administrateur ou un dirigeant de chaque société fusionnante fournit une déclaration (une déclaration solennelle au fédéral) attestant qu'il existe des motifs raisonnables de croire que chaque société est solvable et qu'aucun créancier ne subira de préjudice, ou qu'un avis suffisant a été donné aux créanciers connus.",
          "Au fédéral, un rapport NUANS datant d'au plus 90 jours avant le dépôt est exigé, sauf si la société issue de la fusion conserve la dénomination d'une société fusionnante, prend un matricule ou ne change que l'élément juridique. En Ontario, une dénomination proposée qui n'est pas un matricule exige un rapport NUANS axé sur l'Ontario.",
          "Droits gouvernementaux : 200 $ pour un dépôt en ligne auprès de Corporations Canada (250 $ par courriel ou par la poste) et 330 $ en Ontario.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si l'une des sociétés est régie par une autre loi, notre ",
          { text: "service de prorogation", href: "/services/continuance" },
          " couvre le passage d'un ressort à l'autre. Si la société issue de la fusion a besoin d'une nouvelle dénomination, vous pouvez commander un ",
          { text: "rapport de recherche de nom NUANS", href: "/nuans" },
          " auprès de nous avant le dépôt.",
        ],
      },
    ],
    faqTitle: "Fusionner des sociétés : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt de fusion; pour des conseils adaptés à votre situation, y compris ses conséquences fiscales, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Quelle est la différence entre une fusion ordinaire et une fusion simplifiée?",
        a: "Une fusion ordinaire exige une convention de fusion adoptée par résolution spéciale des actionnaires de chaque société fusionnante. Une fusion simplifiée n'est possible qu'entre une société mère et ses filiales en propriété exclusive, ou entre des filiales en propriété exclusive d'une même société mère, et elle est approuvée par résolution des administrateurs de chaque société, sans vote des actionnaires.",
      },
      {
        q: "Une société ontarienne peut-elle fusionner avec une société fédérale?",
        a: "Pas directement. La LSAO et la LCSA ne permettent chacune la fusion qu'entre des sociétés régies par la même loi. L'une des sociétés est d'abord prorogée dans le ressort de l'autre, puis les statuts de fusion sont déposés dans ce ressort. Korporex dépose à la fois la prorogation et la fusion.",
      },
      {
        q: "Un rapport NUANS est-il exigé pour fusionner?",
        a: "Seulement lorsque la société issue de la fusion prend une nouvelle dénomination nominative. Corporations Canada ne l'exige pas si elle conserve la dénomination d'une société fusionnante, utilise un matricule ou ne change que l'élément juridique, et le rapport exigé doit dater d'au plus 90 jours avant le dépôt. En Ontario, une nouvelle dénomination qui n'est pas un matricule exige un rapport NUANS axé sur l'Ontario.",
      },
      {
        q: "Qu'arrive-t-il aux biens, aux contrats et aux dettes des sociétés fusionnantes?",
        a: "Les sociétés fusionnantes continuent comme une seule société. La société issue de la fusion détient l'ensemble de leurs biens, droits et privilèges et assume l'ensemble de leurs obligations, contrats et dettes. Les poursuites intentées par ou contre une société fusionnante se poursuivent par ou contre la société issue de la fusion, et les sociétés fusionnantes cessent d'exister comme entités distinctes.",
      },
      {
        q: "Quand la fusion prend-elle effet?",
        a: "À la date indiquée sur le certificat de fusion délivré par le registre. Pour une fusion fédérale, il s'agit de la date à laquelle Corporations Canada reçoit les statuts ou d'une date ultérieure demandée dans le dépôt. Lors de votre commande, Korporex vous demande la date d'effet souhaitée afin qu'elle figure dans le dépôt.",
      },
    ],
  },
  es: {
    title: "Fusione sus sociedades en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta los artículos de fusión para unir dos o más sociedades de Ontario (OBCA) o federales (CBCA) en una sola sociedad fusionada. Usted nos indica qué sociedades se fusionan, el tipo de fusión y la denominación, el domicilio social, los directores y la estructura accionaria de la sociedad fusionada. Nosotros redactamos los artículos y los presentamos ante el Registro de Empresas de Ontario o Corporations Canada. Las fusiones son habituales en grupos organizados en torno a una ",
          { text: "sociedad de cartera", href: "/guides/sociedad-de-cartera-canada" },
          ", cuando la sociedad matriz y sus subsidiarias se integran en una sola sociedad.",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Una sociedad matriz que se fusiona con una o más de sus subsidiarias de propiedad total (fusión abreviada vertical).",
          "Dos o más subsidiarias de propiedad total de la misma matriz que se fusionan entre sí (fusión abreviada horizontal).",
          "Sociedades independientes, con sus propios accionistas, que acordaron unirse (fusión ordinaria).",
        ],
      },
      { type: "h3", text: "Los tres tipos de fusión" },
      {
        type: "p",
        parts: [
          "En una fusión ordinaria, las sociedades celebran un acuerdo de fusión que establece, entre otras cosas, cómo se convierten las acciones de cada sociedad que se fusiona, y los accionistas de cada sociedad lo adoptan mediante una resolución especial (dos tercios de los votos emitidos). Una fusión abreviada vertical une a una sociedad matriz con subsidiarias de propiedad total, y una fusión abreviada horizontal une a subsidiarias de propiedad total de la misma matriz. Las fusiones abreviadas se aprueban mediante resoluciones de los directores de cada sociedad que se fusiona, sin voto de los accionistas, y los artículos de la sociedad fusionada siguen los de la matriz (vertical) o los de la subsidiaria cuyas acciones no se cancelan (horizontal), salvo la denominación.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué proporciona usted" },
      {
        type: "p",
        parts: [
          "Preparamos los artículos de fusión (formulario 9 en una fusión federal, que se presenta con el formulario 2 sobre el domicilio social y el primer consejo de administración de la sociedad fusionada) y los enviamos al registro. Usted proporciona la denominación y el número de sociedad de cada sociedad que se fusiona, la denominación de la sociedad fusionada o una denominación numerada, la dirección de su domicilio social, sus directores y una descripción en lenguaje sencillo de su estructura accionaria, la fecha del acuerdo de fusión o de las resoluciones de los directores, la fecha de las resoluciones especiales de los accionistas en una fusión ordinaria y la fecha de entrada en vigor que desea.",
        ],
      },
      { type: "h3", text: "Requisitos principales" },
      {
        type: "list",
        items: [
          "Todas las sociedades que se fusionan deben regirse por la misma ley. Una sociedad de otra jurisdicción primero se continúa en la jurisdicción de la fusión.",
          "Un director o funcionario de cada sociedad que se fusiona presenta una declaración (una declaración jurada en el ámbito federal) de que hay motivos razonables para creer que cada sociedad es solvente y que ningún acreedor resultará perjudicado, o que se notificó adecuadamente a los acreedores conocidos.",
          "En el ámbito federal se exige un informe NUANS con fecha de no más de 90 días antes de la presentación, salvo que la sociedad fusionada conserve la denominación de una sociedad que se fusiona, adopte una denominación numerada o solo cambie el elemento legal. En Ontario, una denominación propuesta que no sea numerada exige un informe NUANS orientado a Ontario.",
          "Tasas gubernamentales: 200 $ por presentación en línea ante Corporations Canada (250 $ por correo electrónico o postal) y 330 $ en Ontario.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si una de las sociedades se rige por otra ley, nuestro ",
          { text: "servicio de continuación", href: "/services/continuance" },
          " cubre el traslado entre jurisdicciones. Si la sociedad fusionada necesita una nueva denominación, puede pedirnos un ",
          { text: "informe de búsqueda de nombre NUANS", href: "/nuans" },
          " antes de presentar.",
        ],
      },
    ],
    faqTitle: "Fusionar sociedades: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de fusión; para asesoría sobre su situación particular, incluidas sus consecuencias fiscales, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Cuál es la diferencia entre una fusión ordinaria y una fusión abreviada?",
        a: "Una fusión ordinaria requiere un acuerdo de fusión adoptado mediante resolución especial de los accionistas de cada sociedad que se fusiona. Una fusión abreviada solo es posible entre una sociedad matriz y sus subsidiarias de propiedad total, o entre subsidiarias de propiedad total de la misma matriz, y se aprueba mediante resoluciones de los directores de cada sociedad, sin voto de los accionistas.",
      },
      {
        q: "¿Puede una sociedad de Ontario fusionarse con una sociedad federal?",
        a: "No directamente. La OBCA y la CBCA solo permiten la fusión entre sociedades regidas por la misma ley. Primero una de las sociedades se continúa en la jurisdicción de la otra y luego los artículos de fusión se presentan en esa jurisdicción. Korporex presenta tanto la continuación como la fusión.",
      },
      {
        q: "¿Se necesita un informe NUANS para fusionarse?",
        a: "Solo cuando la sociedad fusionada adopta una nueva denominación con palabras. Corporations Canada no lo exige si conserva la denominación de una sociedad que se fusiona, usa una denominación numerada o solo cambia el elemento legal, y el informe exigido debe tener no más de 90 días al presentar. En Ontario, una nueva denominación que no sea numerada exige un informe NUANS orientado a Ontario.",
      },
      {
        q: "¿Qué pasa con los bienes, contratos y deudas de las sociedades que se fusionan?",
        a: "Las sociedades que se fusionan continúan como una sola sociedad. La sociedad fusionada posee todos sus bienes, derechos y privilegios y asume todas sus obligaciones, contratos y deudas. Los procesos judiciales iniciados por o contra una sociedad que se fusiona continúan por o contra la sociedad fusionada, y las sociedades que se fusionan dejan de existir como entidades separadas.",
      },
      {
        q: "¿Cuándo entra en vigor la fusión?",
        a: "En la fecha que figura en el certificado de fusión emitido por el registro. En una fusión federal, es la fecha en que Corporations Canada recibe los artículos o una fecha posterior solicitada en la presentación. Al hacer su pedido, Korporex le pide la fecha de entrada en vigor que desea para que conste en la presentación.",
      },
    ],
  },
};
