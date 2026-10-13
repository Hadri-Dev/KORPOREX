import type { Article, ArticleInline, ArticleSection } from "../articles";

// Ontario Initial Return guide (en/fr/es). Targets "initial return ontario"
// and feeds relevance to /services/initial-return-on. Facts mirror the
// verified service copy in src/lib/serviceContent/initial-return-on.ts:
// Corporations Information Act s. 2 (60 days after incorporation,
// amalgamation or continuation), $0 government fee, 15-day Notice of Change,
// and OBCA s. 241 (dissolution after 90 days' notice of non-compliance).
// Federal corporations are deliberately out of scope. Verified 2026-10-12.

// Paragraph with inline links; the plain `text` is derived from the parts.
function p(...parts: ArticleInline[]): ArticleSection {
  return {
    type: "paragraph",
    text: parts.map((x) => (typeof x === "string" ? x : x.text)).join(""),
    parts,
  };
}

const PUBLISHED_AT = "2026-10-12T12:00:00-04:00";
const UPDATED = "2026-10-12";

const en: Article = {
  slug: "ontario-initial-return",
  locale: "en",
  group: "initial-return-ontario",
  category: "Compliance & Maintenance",
  title: "Ontario Initial Return: What It Is and How to File It",
  excerpt:
    "Every new Ontario corporation must file an Initial Return within 60 days of incorporation. Here is what goes on it, how to file it, what it costs, and how it differs from the annual return and the Notice of Change.",
  metaTitle: "Ontario Initial Return: Deadline, Fee and How to File | Korporex",
  metaDescription:
    "The Ontario Initial Return is due within 60 days of incorporation under the Corporations Information Act. What it contains, how to file it, and the $0 fee.",
  readTime: "6 min read",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Incorporating an Ontario corporation is not the last filing. Within 60 days, the corporation must also file an Initial Return with the Ontario Business Registry. It is short, it costs nothing in government fees, and it is easy to forget, because nothing reminds you once the Articles of Incorporation come back endorsed.",
    },
    { type: "heading", id: "what-it-is", text: "What the Initial Return is" },
    {
      type: "paragraph",
      text: "The Initial Return is a one-time filing under Ontario's Corporations Information Act. It puts the corporation's basic information on the public record: where its registered office is, who its directors and officers are, and what it does. It is not a tax return. The corporation's filings with the CRA are entirely separate.",
    },
    { type: "heading", id: "who-files", text: "Who has to file it" },
    {
      type: "paragraph",
      text: "Every corporation incorporated, amalgamated or continued under Ontario law must file an Initial Return. That includes a corporation that has just been incorporated under the Ontario Business Corporations Act, two or more corporations that have amalgamated into one, and a corporation that has moved into Ontario from another jurisdiction by continuance.",
    },
    {
      type: "paragraph",
      text: "This guide covers Ontario corporations only. A federal corporation files its annual return with Corporations Canada, and Ontario's rules for corporations incorporated outside Ontario are separate from the Initial Return described here. The Articles or Certificate show which statute the corporation was created under.",
    },
    { type: "heading", id: "deadline", text: "The deadline: 60 days" },
    {
      type: "paragraph",
      text: "Section 2 of the Corporations Information Act requires the Initial Return within 60 days after the date of incorporation, amalgamation or continuation. That date is the one shown on the Articles. The 60 days run from that date, not from the day the corporation opens a bank account or starts doing business.",
    },
    {
      type: "callout",
      title: "Example",
      text: "A corporation incorporated on October 1 must file its Initial Return by November 30. Counting starts the day after the date on the Articles.",
    },
    { type: "heading", id: "what-it-contains", text: "What goes on the return" },
    {
      type: "paragraph",
      text: "The return reports the corporation's information as it stands on the day it is filed. Have this ready before you start:",
    },
    {
      type: "list",
      items: [
        "The corporation's exact name, its Ontario corporation number and its date of incorporation, as shown on the Articles.",
        "The registered office address, and a mailing address if it is different.",
        "Every current director and officer, with their address and, for officers, their position, such as president or secretary.",
        "The corporation's principal business activity.",
      ],
    },
    {
      type: "paragraph",
      text: "The directors listed should match the people actually elected or named in the Articles, and the officers should match those the directors appointed. If the corporation's records and the return disagree, fix the records first, because the return becomes the public version of them.",
    },
    { type: "heading", id: "how-to-file", text: "How to file it" },
    {
      type: "paragraph",
      text: "The Initial Return is filed online through the Ontario Business Registry. The filer enters the corporation's details, reviews the information, and submits the return. There is no government fee: ServiceOntario charges $0 for the Initial Return, the same as for a Notice of Change and the annual return.",
    },
    {
      type: "paragraph",
      text: "Keep a copy of the filed return with the corporation's records. The minute book is the natural place for it, alongside the Articles, the by-laws and the organizational resolutions.",
    },
    { type: "heading", id: "versus-other-filings", text: "Initial Return, annual return and Notice of Change" },
    {
      type: "paragraph",
      text: "Ontario has three filings under the Corporations Information Act, and they are easy to confuse. The Initial Return comes first and only once. After that, changes and yearly confirmations are handled by the other two.",
    },
    {
      type: "table",
      head: ["Filing", "When", "Government fee"],
      rows: [
        ["Initial Return", "Once, within 60 days of incorporation, amalgamation or continuation", "$0"],
        ["Notice of Change", "Within 15 days after any change to the information on file", "$0"],
        ["Annual return", "Every year after that", "$0"],
      ],
    },
    p(
      "A new director, a departing officer or a new registered office address each calls for a ",
      { text: "Notice of Change", href: "/services/notice-of-change" },
      ". For how the yearly filing works, including its deadline, see our guide on ",
      { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" },
      "."
    ),
    { type: "heading", id: "if-you-miss-it", text: "If the Initial Return is not filed" },
    {
      type: "paragraph",
      text: "Missing the deadline does not cancel the obligation. Under section 241 of the Ontario Business Corporations Act, the Director can give notice to a corporation that has not complied with a filing requirement under the Corporations Information Act. If the corporation still does not comply within 90 days of that notice, the Director can order it dissolved. A late Initial Return is still worth filing as soon as the gap is noticed.",
    },
    { type: "heading", id: "getting-it-done", text: "Getting it done" },
    p(
      "If Korporex incorporated your Ontario corporation, the Initial Return is already part of the package. If you incorporated on your own, Korporex can ",
      { text: "file your Ontario Initial Return", href: "/services/initial-return-on" },
      " for you from the information you provide. Still planning the incorporation itself? Start with our guide to ",
      { text: "incorporating in Ontario", href: "/guides/incorporating-in-ontario" },
      ", and if the corporation has no minute book yet, see what goes into a ",
      { text: "corporate minute book", href: "/guides/corporate-minute-book" },
      "."
    ),
    {
      type: "paragraph",
      text: "Korporex is not a law firm and this guide is general information, not legal advice. For questions about your corporation's specific situation, consult a lawyer or accountant.",
    },
  ],
  faq: [
    {
      q: "When is the Ontario Initial Return due?",
      a: "Within 60 days after the date of incorporation, amalgamation or continuation, under section 2 of the Corporations Information Act. The date is the one shown on the Articles.",
    },
    {
      q: "How much does it cost to file an Initial Return in Ontario?",
      a: "Nothing in government fees. ServiceOntario charges $0 for the Initial Return. A filing service charges its own fee for preparing and submitting it.",
    },
    {
      q: "Is the Initial Return the same as the annual return?",
      a: "No. The Initial Return is filed once, shortly after incorporation. The annual return is filed every year afterwards to confirm or update the corporation's information.",
    },
    {
      q: "Do I need to file a Notice of Change after the Initial Return?",
      a: "Only when something changes. A Notice of Change is due within 15 days after any change to the information on file, such as a new director or a new registered office address.",
    },
    {
      q: "What happens if I never file the Initial Return?",
      a: "Under section 241 of the Ontario Business Corporations Act, the Director can give notice of the default, and if the corporation does not comply within 90 days, the Director can order it dissolved.",
    },
  ],
};

const fr: Article = {
  slug: "declaration-initiale-ontario",
  locale: "fr",
  group: "initial-return-ontario",
  category: "Compliance & Maintenance",
  title: "Rapport initial en Ontario : ce que c'est et comment le déposer",
  excerpt:
    "Toute nouvelle société ontarienne doit déposer un rapport initial dans les 60 jours suivant sa constitution. Voici ce qu'il contient, comment le déposer, ce qu'il coûte et en quoi il diffère du rapport annuel et de l'avis de modification.",
  metaTitle: "Rapport initial en Ontario : délai, frais et dépôt | Korporex",
  metaDescription:
    "Le rapport initial ontarien doit être déposé dans les 60 jours suivant la constitution, selon la Loi sur les renseignements exigés des personnes morales. Contenu, dépôt et frais de 0 $.",
  readTime: "6 min de lecture",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "La constitution d'une société ontarienne n'est pas le dernier dépôt. Dans les 60 jours, la société doit aussi déposer un rapport initial auprès du Registre des entreprises de l'Ontario. Il est court, ne coûte rien en frais gouvernementaux et s'oublie facilement, car rien ne vous le rappelle une fois les statuts constitutifs revenus.",
    },
    { type: "heading", id: "ce-que-cest", text: "Ce qu'est le rapport initial" },
    {
      type: "paragraph",
      text: "Le rapport initial est un dépôt unique prévu par la Loi sur les renseignements exigés des personnes morales de l'Ontario. Il inscrit au registre public les renseignements de base de la société : l'adresse de son siège social, ses administrateurs et dirigeants, et son activité. Ce n'est pas une déclaration de revenus. Les déclarations de la société auprès de l'ARC sont entièrement distinctes.",
    },
    { type: "heading", id: "qui-depose", text: "Qui doit le déposer" },
    {
      type: "paragraph",
      text: "Toute société constituée, fusionnée ou prorogée sous le régime de la loi ontarienne doit déposer un rapport initial. Cela comprend une société qui vient d'être constituée en vertu de la Loi sur les sociétés par actions de l'Ontario, des sociétés qui ont fusionné, et une société arrivée en Ontario par prorogation.",
    },
    {
      type: "paragraph",
      text: "Ce guide vise uniquement les sociétés ontariennes. Une société fédérale dépose son rapport annuel auprès de Corporations Canada, et les règles ontariennes applicables aux sociétés constituées hors de l'Ontario sont distinctes du rapport initial décrit ici. Les statuts ou le certificat indiquent la loi sous laquelle la société a été créée.",
    },
    { type: "heading", id: "delai", text: "Le délai : 60 jours" },
    {
      type: "paragraph",
      text: "L'article 2 de la Loi sur les renseignements exigés des personnes morales exige le rapport initial dans les 60 jours suivant la date de constitution, de fusion ou de prorogation. Cette date est celle qui figure sur les statuts. Les 60 jours courent à partir de cette date, et non du jour où la société ouvre un compte bancaire ou commence ses activités.",
    },
    {
      type: "callout",
      title: "Exemple",
      text: "Une société constituée le 1er octobre doit déposer son rapport initial au plus tard le 30 novembre. Le calcul commence le lendemain de la date inscrite sur les statuts.",
    },
    { type: "heading", id: "contenu", text: "Ce que contient le rapport" },
    {
      type: "paragraph",
      text: "Le rapport présente les renseignements de la société tels qu'ils sont le jour du dépôt. Préparez ce qui suit avant de commencer :",
    },
    {
      type: "list",
      items: [
        "La dénomination exacte de la société, son numéro de société ontarienne et sa date de constitution, tels qu'ils figurent sur les statuts.",
        "L'adresse du siège social, et une adresse postale si elle est différente.",
        "Chaque administrateur et dirigeant actuel, avec son adresse et, pour les dirigeants, leur poste, par exemple président ou secrétaire.",
        "L'activité principale de la société.",
      ],
    },
    {
      type: "paragraph",
      text: "Les administrateurs inscrits doivent correspondre aux personnes réellement élues ou nommées dans les statuts, et les dirigeants à ceux que les administrateurs ont nommés. Si les registres de la société et le rapport ne concordent pas, corrigez d'abord les registres, car le rapport en devient la version publique.",
    },
    { type: "heading", id: "comment-deposer", text: "Comment le déposer" },
    {
      type: "paragraph",
      text: "Le rapport initial se dépose en ligne par l'intermédiaire du Registre des entreprises de l'Ontario. Le déposant saisit les renseignements de la société, les vérifie et soumet le rapport. Il n'y a aucuns frais gouvernementaux : ServiceOntario facture 0 $ pour le rapport initial, comme pour l'avis de modification et le rapport annuel.",
    },
    {
      type: "paragraph",
      text: "Conservez une copie du rapport déposé avec les registres de la société. Le livre des procès-verbaux est l'endroit tout indiqué, avec les statuts, les règlements administratifs et les résolutions d'organisation.",
    },
    { type: "heading", id: "autres-depots", text: "Rapport initial, rapport annuel et avis de modification" },
    {
      type: "paragraph",
      text: "L'Ontario prévoit trois dépôts en vertu de la Loi sur les renseignements exigés des personnes morales, et on les confond facilement. Le rapport initial vient en premier et une seule fois. Ensuite, les changements et les confirmations annuelles relèvent des deux autres.",
    },
    {
      type: "table",
      head: ["Dépôt", "Quand", "Frais gouvernementaux"],
      rows: [
        ["Rapport initial", "Une fois, dans les 60 jours suivant la constitution, la fusion ou la prorogation", "0 $"],
        ["Avis de modification", "Dans les 15 jours suivant tout changement aux renseignements déposés", "0 $"],
        ["Rapport annuel", "Chaque année par la suite", "0 $"],
      ],
    },
    p(
      "Un nouvel administrateur, le départ d'un dirigeant ou une nouvelle adresse du siège social exigent chacun un ",
      { text: "avis de modification", href: "/services/notice-of-change" },
      ". Pour le fonctionnement du dépôt annuel, y compris son délai, consultez notre guide sur les ",
      { text: "rapports annuels des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" },
      "."
    ),
    { type: "heading", id: "defaut-de-depot", text: "Si le rapport initial n'est pas déposé" },
    {
      type: "paragraph",
      text: "Manquer le délai n'annule pas l'obligation. En vertu de l'article 241 de la Loi sur les sociétés par actions de l'Ontario, le directeur peut aviser une société qui ne s'est pas conformée à une exigence de dépôt de la Loi sur les renseignements exigés des personnes morales. Si la société ne s'y conforme toujours pas dans les 90 jours suivant cet avis, le directeur peut ordonner sa dissolution. Un rapport initial en retard vaut tout de même la peine d'être déposé dès que l'oubli est constaté.",
    },
    { type: "heading", id: "le-faire", text: "Passer à l'action" },
    p(
      "Si Korporex a constitué votre société ontarienne, le rapport initial fait déjà partie du forfait. Si vous l'avez constituée vous-même, Korporex peut ",
      { text: "déposer votre rapport initial ontarien", href: "/services/initial-return-on" },
      " pour vous à partir des renseignements que vous fournissez. Vous planifiez encore la constitution? Commencez par notre guide pour ",
      { text: "se constituer en société en Ontario", href: "/guides/se-constituer-en-societe-en-ontario" },
      ", et si la société n'a pas encore de livre des procès-verbaux, voyez ",
      { text: "ce qu'il contient", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
      "."
    ),
    {
      type: "paragraph",
      text: "Korporex n'est pas un cabinet d'avocats et ce guide est de l'information générale, et non un avis juridique. Pour toute question sur la situation particulière de votre société, consultez un avocat ou un comptable.",
    },
  ],
  faq: [
    {
      q: "Quand le rapport initial ontarien doit-il être déposé?",
      a: "Dans les 60 jours suivant la date de constitution, de fusion ou de prorogation, selon l'article 2 de la Loi sur les renseignements exigés des personnes morales. La date est celle qui figure sur les statuts.",
    },
    {
      q: "Combien coûte le dépôt d'un rapport initial en Ontario?",
      a: "Aucuns frais gouvernementaux. ServiceOntario facture 0 $ pour le rapport initial. Un service de dépôt facture ses propres honoraires pour le préparer et le soumettre.",
    },
    {
      q: "Le rapport initial est-il le même que le rapport annuel?",
      a: "Non. Le rapport initial est déposé une seule fois, peu après la constitution. Le rapport annuel est déposé chaque année par la suite pour confirmer ou mettre à jour les renseignements de la société.",
    },
    {
      q: "Dois-je déposer un avis de modification après le rapport initial?",
      a: "Seulement si quelque chose change. Un avis de modification doit être déposé dans les 15 jours suivant tout changement aux renseignements déposés, comme un nouvel administrateur ou une nouvelle adresse du siège social.",
    },
    {
      q: "Que se passe-t-il si je ne dépose jamais le rapport initial?",
      a: "En vertu de l'article 241 de la Loi sur les sociétés par actions de l'Ontario, le directeur peut aviser la société du défaut et, si elle ne s'y conforme pas dans les 90 jours, ordonner sa dissolution.",
    },
  ],
};

const es: Article = {
  slug: "declaracion-inicial-ontario",
  locale: "es",
  group: "initial-return-ontario",
  category: "Compliance & Maintenance",
  title: "Declaración inicial en Ontario: qué es y cómo presentarla",
  excerpt:
    "Toda nueva sociedad de Ontario debe presentar una declaración inicial (Initial Return) dentro de los 60 días siguientes a su constitución. Esto es lo que contiene, cómo se presenta, cuánto cuesta y en qué se diferencia de la declaración anual y del aviso de cambio.",
  metaTitle: "Declaración inicial en Ontario: plazo, tasa y presentación | Korporex",
  metaDescription:
    "La declaración inicial (Initial Return) de Ontario vence 60 días después de la constitución según la Corporations Information Act. Contenido, presentación y tasa de 0 $.",
  readTime: "6 min de lectura",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Constituir una sociedad en Ontario no es la última presentación. Dentro de los 60 días, la sociedad también debe presentar una declaración inicial (Initial Return) ante el Ontario Business Registry. Es breve, no tiene tasa gubernamental y es fácil de olvidar, porque nada se lo recuerda una vez que recibe los estatutos de constitución.",
    },
    { type: "heading", id: "que-es", text: "Qué es la declaración inicial" },
    {
      type: "paragraph",
      text: "La declaración inicial es una presentación única prevista en la Corporations Information Act de Ontario. Inscribe en el registro público la información básica de la sociedad: dónde está su domicilio social, quiénes son sus directores y funcionarios, y a qué se dedica. No es una declaración de impuestos. Las presentaciones de la sociedad ante la CRA son totalmente independientes.",
    },
    { type: "heading", id: "quien-presenta", text: "Quién debe presentarla" },
    {
      type: "paragraph",
      text: "Toda sociedad constituida, fusionada o continuada bajo la ley de Ontario debe presentar una declaración inicial. Esto incluye una sociedad recién constituida bajo la Business Corporations Act de Ontario, sociedades que se han fusionado en una sola, y una sociedad que se trasladó a Ontario por continuación.",
    },
    {
      type: "paragraph",
      text: "Esta guía cubre solo sociedades de Ontario. Una sociedad federal presenta su declaración anual ante Corporations Canada, y las reglas de Ontario para sociedades constituidas fuera de Ontario son distintas de la declaración inicial descrita aquí. Los estatutos o el certificado indican la ley bajo la que se creó la sociedad.",
    },
    { type: "heading", id: "plazo", text: "El plazo: 60 días" },
    {
      type: "paragraph",
      text: "El artículo 2 de la Corporations Information Act exige la declaración inicial dentro de los 60 días siguientes a la fecha de constitución, fusión o continuación. Esa fecha es la que figura en los estatutos. Los 60 días corren desde esa fecha, no desde el día en que la sociedad abre una cuenta bancaria o empieza a operar.",
    },
    {
      type: "callout",
      title: "Ejemplo",
      text: "Una sociedad constituida el 1 de octubre debe presentar su declaración inicial a más tardar el 30 de noviembre. El cómputo empieza el día siguiente a la fecha de los estatutos.",
    },
    { type: "heading", id: "contenido", text: "Qué contiene la declaración" },
    {
      type: "paragraph",
      text: "La declaración refleja la información de la sociedad tal como está el día en que se presenta. Tenga esto listo antes de empezar:",
    },
    {
      type: "list",
      items: [
        "El nombre exacto de la sociedad, su número de sociedad de Ontario y su fecha de constitución, tal como figuran en los estatutos.",
        "La dirección del domicilio social, y una dirección postal si es distinta.",
        "Cada director y funcionario actual, con su dirección y, en el caso de los funcionarios, su cargo, como presidente o secretario.",
        "La actividad principal de la sociedad.",
      ],
    },
    {
      type: "paragraph",
      text: "Los directores indicados deben coincidir con las personas realmente elegidas o nombradas en los estatutos, y los funcionarios con los que nombraron los directores. Si los registros de la sociedad y la declaración no coinciden, corrija primero los registros, porque la declaración se convierte en su versión pública.",
    },
    { type: "heading", id: "como-presentar", text: "Cómo presentarla" },
    {
      type: "paragraph",
      text: "La declaración inicial se presenta en línea a través del Ontario Business Registry. Quien presenta introduce los datos de la sociedad, los revisa y envía la declaración. No hay tasa gubernamental: ServiceOntario cobra 0 $ por la declaración inicial, igual que por el aviso de cambio y la declaración anual.",
    },
    {
      type: "paragraph",
      text: "Guarde una copia de la declaración presentada con los registros de la sociedad. El libro de actas es el lugar natural, junto con los estatutos, los reglamentos internos y las resoluciones de organización.",
    },
    { type: "heading", id: "otras-presentaciones", text: "Declaración inicial, declaración anual y aviso de cambio" },
    {
      type: "paragraph",
      text: "Ontario tiene tres presentaciones bajo la Corporations Information Act y es fácil confundirlas. La declaración inicial va primero y una sola vez. Después, los cambios y las confirmaciones anuales se tramitan con las otras dos.",
    },
    {
      type: "table",
      head: ["Presentación", "Cuándo", "Tasa gubernamental"],
      rows: [
        ["Declaración inicial", "Una vez, dentro de los 60 días siguientes a la constitución, fusión o continuación", "0 $"],
        ["Aviso de cambio", "Dentro de los 15 días siguientes a cualquier cambio en la información registrada", "0 $"],
        ["Declaración anual", "Cada año a partir de entonces", "0 $"],
      ],
    },
    p(
      "Un nuevo director, la salida de un funcionario o un nuevo domicilio social requieren cada uno un ",
      { text: "aviso de cambio", href: "/services/notice-of-change" },
      ". Para saber cómo funciona la presentación anual, incluido su plazo, consulte nuestra guía sobre las ",
      { text: "declaraciones anuales de sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" },
      "."
    ),
    { type: "heading", id: "si-no-se-presenta", text: "Si no se presenta la declaración inicial" },
    {
      type: "paragraph",
      text: "Dejar pasar el plazo no elimina la obligación. Según el artículo 241 de la Business Corporations Act de Ontario, el Director puede notificar a una sociedad que no ha cumplido un requisito de presentación de la Corporations Information Act. Si la sociedad sigue sin cumplir dentro de los 90 días siguientes a esa notificación, el Director puede ordenar su disolución. Aun con retraso, conviene presentar la declaración inicial en cuanto se detecta la omisión.",
    },
    { type: "heading", id: "hacerlo", text: "Cómo resolverlo" },
    p(
      "Si Korporex constituyó su sociedad de Ontario, la declaración inicial ya forma parte del paquete. Si la constituyó por su cuenta, Korporex puede ",
      { text: "presentar su declaración inicial de Ontario", href: "/services/initial-return-on" },
      " por usted con la información que nos facilite. ¿Todavía está planificando la constitución? Empiece por nuestra guía para ",
      { text: "constituirse en sociedad en Ontario", href: "/guides/constituirse-en-sociedad-en-ontario" },
      ", y si la sociedad aún no tiene libro de actas, vea ",
      { text: "qué contiene", href: "/guides/que-es-un-libro-de-actas" },
      "."
    ),
    {
      type: "paragraph",
      text: "Korporex no es un despacho de abogados y esta guía es información general, no asesoramiento jurídico. Para preguntas sobre la situación concreta de su sociedad, consulte a un abogado o a un contador.",
    },
  ],
  faq: [
    {
      q: "¿Cuándo vence la declaración inicial de Ontario?",
      a: "Dentro de los 60 días siguientes a la fecha de constitución, fusión o continuación, según el artículo 2 de la Corporations Information Act. La fecha es la que figura en los estatutos.",
    },
    {
      q: "¿Cuánto cuesta presentar una declaración inicial en Ontario?",
      a: "No hay tasa gubernamental. ServiceOntario cobra 0 $ por la declaración inicial. Un servicio de presentación cobra sus propios honorarios por prepararla y enviarla.",
    },
    {
      q: "¿La declaración inicial es lo mismo que la declaración anual?",
      a: "No. La declaración inicial se presenta una sola vez, poco después de la constitución. La declaración anual se presenta cada año a partir de entonces para confirmar o actualizar la información de la sociedad.",
    },
    {
      q: "¿Tengo que presentar un aviso de cambio después de la declaración inicial?",
      a: "Solo si algo cambia. El aviso de cambio vence dentro de los 15 días siguientes a cualquier cambio en la información registrada, como un nuevo director o un nuevo domicilio social.",
    },
    {
      q: "¿Qué pasa si nunca presento la declaración inicial?",
      a: "Según el artículo 241 de la Business Corporations Act de Ontario, el Director puede notificar el incumplimiento y, si la sociedad no cumple dentro de los 90 días, ordenar su disolución.",
    },
  ],
};

export const initialReturnOntario: Article[] = [en, fr, es];
