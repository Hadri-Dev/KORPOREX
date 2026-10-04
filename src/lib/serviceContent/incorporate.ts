import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the incorporation wizard. The wizard is a client
// component with almost no crawlable text, so this block carries the page's
// transactional intent ("incorporate my business, file it for me") while the
// guides keep the informational "how to incorporate" intent. Package contents
// mirror src/lib/packages.ts; government fees mirror src/lib/govFees.ts.
export const content: ServiceContentByLocale = {
  en: {
    title: "Incorporate your business online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files Articles of Incorporation for federal corporations under the Canada Business Corporations Act (CBCA) and Ontario corporations under the Ontario Business Corporations Act (OBCA). You complete the order form with the corporation's name, share structure, directors, shareholders, officers and registered office, and we prepare the Articles, file them with Corporations Canada or the Ontario Business Registry and send you the results. For the whole process step by step, read our guide on ",
          { text: "how to incorporate a business in Canada", href: "/guides/how-to-incorporate-a-business-in-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Solo founders, consultants and freelancers setting up a single-owner corporation or holding company.",
          "Co-founders, spouses and small partnerships incorporating together.",
          "Businesses with several founders, advisors or family members that need more than one class of shares.",
          "Owners who want a numbered corporation now, or a named corporation from day one.",
        ],
      },
      { type: "h3", text: "What is included" },
      {
        type: "p",
        parts: [
          "Every package covers the Articles of Incorporation filing, the Certificate of Incorporation and company key, a standard digital minute book and the mandatory post-incorporation filings, with a 24-hour turnaround. The packages differ in what the Articles and minute book can carry:",
        ],
      },
      {
        type: "list",
        items: [
          "Basic: a numbered corporation with one class of shares and one shareholder, one director and one officer.",
          "Standard: a numbered or named corporation with up to three classes of shares and up to three shareholders, directors and officers, with one name search included.",
          "Premium: a numbered or named corporation with up to five classes of shares and up to five shareholders, directors and officers, with one name search included.",
        ],
      },
      {
        type: "p",
        parts: [
          "If you do not have an address to use as the registered office, a Korporex office in Toronto or Burlington can be added during the order.",
        ],
      },
      { type: "h3", text: "What the registry requires" },
      {
        type: "list",
        items: [
          "Government filing fee: $200 for federal Articles of Incorporation filed online, and $300 for Ontario Articles of Incorporation.",
          "Name: a numbered corporation needs no name search. A named Ontario corporation requires an Ontario-biased NUANS report dated within 90 days of filing. Federally, the name search is built into Corporations Canada's online filing, so no separate NUANS report is needed to incorporate.",
          "Directors: under the CBCA, at least 25% of the directors must be resident Canadians, and at least one if there are fewer than four directors. Ontario has had no director residency requirement since July 5, 2021.",
        ],
      },
      { type: "h3", text: "What you need before you start" },
      {
        type: "list",
        items: [
          "The full name, residential address and email address of each director, and the name and address of each shareholder and officer.",
          "For each shareholder, the class of shares, the number of shares and the price per share.",
          "The corporation's primary activity (NAICS code), a short description of the business, an official email address and a fiscal year end.",
          "For a named corporation, the exact name and legal ending. A free check on Canada's Business Registries is not an official NUANS search. Federally, Corporations Canada examines the name; Ontario does not review names for similarity, so checking the NUANS report for conflicts is your responsibility.",
        ],
      },
      { type: "h3", text: "After filing" },
      {
        type: "p",
        parts: [
          "An Ontario corporation must file an Initial Return within 60 days of incorporation under the Corporations Information Act, and both federal and Ontario corporations file an annual return each year. If you want to search more names before you order, use our ",
          { text: "NUANS report service", href: "/nuans" },
          ". Still choosing a jurisdiction? See ",
          { text: "federal vs provincial incorporation", href: "/guides/federal-vs-provincial-incorporation" },
          ".",
        ],
      },
    ],
    faqTitle: "Incorporating online: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the incorporation filing; for advice on your specific situation, including the choice of jurisdiction and share structure, consult a lawyer or accountant.",
    faq: [
      {
        q: "What is the difference between a federal and an Ontario corporation?",
        a: "A federal corporation is created under the CBCA and its name is protected across Canada; it may need to register extra-provincially in the provinces where it carries on business. An Ontario corporation is created under the OBCA and is authorized to carry on business in Ontario. The government filing fee is $200 federally and $300 in Ontario.",
      },
      {
        q: "Do I need a NUANS report to incorporate?",
        a: "Not for a numbered corporation. A named Ontario corporation requires an Ontario-biased NUANS report dated within 90 days of filing. For a federal incorporation, Corporations Canada runs the name search inside its online filing, so no separate report is required. The Standard and Premium packages include one name search for the name in your order.",
      },
      {
        q: "What is a numbered corporation?",
        a: "A numbered corporation has no chosen name. The government assigns a unique number, which is combined with the jurisdiction and the legal ending, for example 1234567 Ontario Inc. or 1234567 Canada Inc. No name search is required, and the corporation can later register a business name or change its name by amending its Articles.",
      },
      {
        q: "Do the directors have to live in Canada?",
        a: "It depends on the jurisdiction. Under the CBCA, at least 25% of the directors of a federal corporation must be resident Canadians, and at least one director if the corporation has fewer than four. Ontario repealed its director residency requirement on July 5, 2021, so an Ontario corporation's directors can all live outside Canada.",
      },
      {
        q: "What do I receive once the corporation is incorporated?",
        a: "You receive the filed Articles of Incorporation, the Certificate of Incorporation and the company key, together with a standard digital minute book. Each package also includes the mandatory post-incorporation filings, such as the Ontario Initial Return, which is due within 60 days of incorporation.",
      },
    ],
  },
  fr: {
    title: "Constituez votre société en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose les statuts constitutifs des sociétés fédérales régies par la Loi canadienne sur les sociétés par actions (LCSA) et des sociétés ontariennes régies par la Loi sur les sociétés par actions de l'Ontario (LSAO). Vous remplissez le formulaire de commande avec la dénomination de la société, sa structure de capital, ses administrateurs, ses actionnaires, ses dirigeants et son siège social, et nous préparons les statuts, les déposons auprès de Corporations Canada ou du Registre des entreprises de l'Ontario et vous transmettons les résultats. Pour connaître tout le processus étape par étape, lisez notre guide sur ",
          { text: "la constitution d'une entreprise au Canada", href: "/guides/comment-constituer-une-entreprise-au-canada" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les fondateurs seuls, consultants et travailleurs autonomes qui créent une société à actionnaire unique ou une société de portefeuille.",
          "Les cofondateurs, conjoints et petites associations qui se constituent ensemble.",
          "Les entreprises comptant plusieurs fondateurs, conseillers ou membres d'une famille qui ont besoin de plus d'une catégorie d'actions.",
          "Les propriétaires qui veulent une société à matricule dès maintenant, ou une société nominative dès le départ.",
        ],
      },
      { type: "h3", text: "Ce qui est inclus" },
      {
        type: "p",
        parts: [
          "Chaque forfait comprend le dépôt des statuts constitutifs, le certificat de constitution et la clé d'entreprise (company key), un livre des procès-verbaux numérique standard et les dépôts obligatoires postérieurs à la constitution, avec un délai de traitement de 24 heures. Les forfaits diffèrent selon ce que les statuts et le livre des procès-verbaux peuvent prévoir :",
        ],
      },
      {
        type: "list",
        items: [
          "Basic : une société à matricule avec une catégorie d'actions, un actionnaire, un administrateur et un dirigeant.",
          "Standard : une société à matricule ou nominative avec jusqu'à trois catégories d'actions et jusqu'à trois actionnaires, administrateurs et dirigeants, avec une recherche de dénomination incluse.",
          "Premium : une société à matricule ou nominative avec jusqu'à cinq catégories d'actions et jusqu'à cinq actionnaires, administrateurs et dirigeants, avec une recherche de dénomination incluse.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si vous n'avez pas d'adresse à utiliser comme siège social, un bureau Korporex à Toronto ou à Burlington peut être ajouté pendant la commande.",
        ],
      },
      { type: "h3", text: "Ce qu'exige le registre" },
      {
        type: "list",
        items: [
          "Droits gouvernementaux : 200 $ pour des statuts constitutifs fédéraux déposés en ligne, et 300 $ pour des statuts constitutifs en Ontario.",
          "Dénomination : une société à matricule n'exige aucune recherche de dénomination. Une société ontarienne nominative exige un rapport NUANS axé sur l'Ontario daté de moins de 90 jours au moment du dépôt. Au fédéral, la recherche de dénomination est intégrée au dépôt en ligne de Corporations Canada, de sorte qu'aucun rapport NUANS distinct n'est nécessaire pour se constituer.",
          "Administrateurs : en vertu de la LCSA, au moins 25 % des administrateurs doivent être des résidents canadiens, et au moins un s'il y a moins de quatre administrateurs. L'Ontario n'impose plus d'exigence de résidence aux administrateurs depuis le 5 juillet 2021.",
        ],
      },
      { type: "h3", text: "Ce qu'il vous faut avant de commencer" },
      {
        type: "list",
        items: [
          "Le nom complet, l'adresse résidentielle et l'adresse courriel de chaque administrateur, ainsi que le nom et l'adresse de chaque actionnaire et dirigeant.",
          "Pour chaque actionnaire, la catégorie d'actions, le nombre d'actions et le prix par action.",
          "L'activité principale de la société (code SCIAN), une courte description de l'entreprise, une adresse courriel officielle et une date de fin d'exercice.",
          "Pour une société nominative, la dénomination exacte et la mention juridique. Une vérification gratuite dans les Registres d'entreprises canadiens n'est pas une recherche NUANS officielle. Au fédéral, Corporations Canada examine la dénomination; l'Ontario n'examine pas la similitude des noms, de sorte qu'il vous revient de vérifier le rapport NUANS.",
        ],
      },
      { type: "h3", text: "Après le dépôt" },
      {
        type: "p",
        parts: [
          "Une société ontarienne doit déposer un rapport initial dans les 60 jours suivant sa constitution en vertu de la Loi sur les renseignements exigés des personnes morales, et les sociétés fédérales comme ontariennes déposent une déclaration annuelle chaque année. Pour rechercher d'autres dénominations avant de commander, utilisez notre ",
          { text: "service de rapport NUANS", href: "/nuans" },
          ". Vous hésitez encore sur le lieu de constitution? Consultez notre guide sur ",
          { text: "la constitution en société en Ontario", href: "/guides/se-constituer-en-societe-en-ontario" },
          ".",
        ],
      },
    ],
    faqTitle: "Se constituer en ligne : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt de constitution; pour des conseils adaptés à votre situation, y compris le choix du lieu de constitution et de la structure de capital, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Quelle est la différence entre une société fédérale et une société ontarienne?",
        a: "Une société fédérale est constituée en vertu de la LCSA et sa dénomination est protégée partout au Canada; elle peut devoir s'enregistrer à titre extraprovincial dans les provinces où elle exerce ses activités. Une société ontarienne est constituée en vertu de la LSAO et est autorisée à exercer ses activités en Ontario. Les droits gouvernementaux sont de 200 $ au fédéral et de 300 $ en Ontario.",
      },
      {
        q: "Ai-je besoin d'un rapport NUANS pour me constituer?",
        a: "Pas pour une société à matricule. Une société ontarienne nominative exige un rapport NUANS axé sur l'Ontario daté de moins de 90 jours au moment du dépôt. Pour une constitution fédérale, Corporations Canada effectue la recherche de dénomination dans son dépôt en ligne, de sorte qu'aucun rapport distinct n'est exigé. Les forfaits Standard et Premium comprennent une recherche pour la dénomination de votre commande.",
      },
      {
        q: "Qu'est-ce qu'une société à matricule?",
        a: "Une société à matricule n'a pas de dénomination choisie. Le gouvernement lui attribue un numéro unique, combiné au territoire et à la mention juridique, par exemple 1234567 Ontario Inc. ou 1234567 Canada Inc. Aucune recherche de dénomination n'est exigée, et la société peut plus tard enregistrer un nom commercial ou changer de dénomination par modification de ses statuts.",
      },
      {
        q: "Les administrateurs doivent-ils habiter au Canada?",
        a: "Cela dépend du lieu de constitution. En vertu de la LCSA, au moins 25 % des administrateurs d'une société fédérale doivent être des résidents canadiens, et au moins un administrateur si la société en compte moins de quatre. L'Ontario a abrogé son exigence de résidence le 5 juillet 2021, de sorte que tous les administrateurs d'une société ontarienne peuvent habiter à l'extérieur du Canada.",
      },
      {
        q: "Que recevez-vous une fois la société constituée?",
        a: "Vous recevez les statuts constitutifs déposés, le certificat de constitution et la clé d'entreprise, ainsi qu'un livre des procès-verbaux numérique standard. Chaque forfait comprend aussi les dépôts obligatoires postérieurs à la constitution, comme le rapport initial de l'Ontario, qui doit être déposé dans les 60 jours suivant la constitution.",
      },
    ],
  },
  es: {
    title: "Constituya su sociedad en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta los estatutos de constitución de sociedades federales regidas por la Ley de Sociedades por Acciones de Canadá (CBCA) y de sociedades de Ontario regidas por la Ley de Sociedades por Acciones de Ontario (OBCA). Usted completa el formulario con el nombre de la sociedad, su estructura accionaria, sus directores, accionistas y funcionarios y su domicilio social, y nosotros preparamos los estatutos, los presentamos ante Corporations Canada o el Registro de Empresas de Ontario y le enviamos los resultados. Para conocer todo el proceso paso a paso, lea nuestra guía sobre ",
          { text: "cómo constituir una empresa en Canadá", href: "/guides/como-constituir-una-empresa-en-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Fundadores individuales, consultores y profesionales independientes que crean una sociedad de un solo dueño o una sociedad de cartera.",
          "Cofundadores, cónyuges y pequeñas asociaciones que se constituyen juntos.",
          "Empresas con varios fundadores, asesores o familiares que necesitan más de una clase de acciones.",
          "Propietarios que quieren una sociedad numérica ahora, o una sociedad con nombre desde el inicio.",
        ],
      },
      { type: "h3", text: "Qué incluye" },
      {
        type: "p",
        parts: [
          "Cada paquete incluye la presentación de los estatutos de constitución, el certificado de constitución y la clave de la empresa (company key), un libro de actas digital estándar y las presentaciones obligatorias posteriores a la constitución, con un plazo de entrega de 24 horas. Los paquetes se diferencian en lo que pueden contener los estatutos y el libro de actas:",
        ],
      },
      {
        type: "list",
        items: [
          "Basic: una sociedad numérica con una clase de acciones, un accionista, un director y un funcionario.",
          "Standard: una sociedad numérica o con nombre con hasta tres clases de acciones y hasta tres accionistas, directores y funcionarios, con una búsqueda de nombre incluida.",
          "Premium: una sociedad numérica o con nombre con hasta cinco clases de acciones y hasta cinco accionistas, directores y funcionarios, con una búsqueda de nombre incluida.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si no tiene una dirección que pueda usar como domicilio social, puede agregar una oficina de Korporex en Toronto o Burlington durante el pedido.",
        ],
      },
      { type: "h3", text: "Qué exige el registro" },
      {
        type: "list",
        items: [
          "Tasa gubernamental: $200 por los estatutos de constitución federales presentados en línea y $300 por los estatutos de constitución de Ontario.",
          "Nombre: una sociedad numérica no requiere búsqueda de nombre. Una sociedad de Ontario con nombre requiere un informe NUANS orientado a Ontario con una antigüedad máxima de 90 días al presentar. A nivel federal, la búsqueda de nombre está integrada en la presentación en línea de Corporations Canada, por lo que no se necesita un informe NUANS por separado para constituirse.",
          "Directores: según la CBCA, al menos el 25 % de los directores deben ser residentes canadienses, y al menos uno si hay menos de cuatro directores. Ontario no exige residencia a los directores desde el 5 de julio de 2021.",
        ],
      },
      { type: "h3", text: "Qué necesita antes de empezar" },
      {
        type: "list",
        items: [
          "El nombre completo, la dirección residencial y el correo electrónico de cada director, y el nombre y la dirección de cada accionista y funcionario.",
          "Para cada accionista, la clase de acciones, el número de acciones y el precio por acción.",
          "La actividad principal de la sociedad (código NAICS), una breve descripción del negocio, un correo electrónico oficial y una fecha de cierre del ejercicio fiscal.",
          "Para una sociedad con nombre, el nombre exacto y la terminación legal. Una consulta gratuita en los Registros de Empresas de Canadá no es una búsqueda NUANS oficial. A nivel federal, Corporations Canada examina el nombre; Ontario no revisa la similitud de los nombres, así que revisar el informe NUANS le corresponde a usted.",
        ],
      },
      { type: "h3", text: "Después de la presentación" },
      {
        type: "p",
        parts: [
          "Una sociedad de Ontario debe presentar una declaración inicial dentro de los 60 días siguientes a su constitución según la Ley de Información de Sociedades (Corporations Information Act), y tanto las sociedades federales como las de Ontario presentan una declaración anual cada año. Para buscar más nombres antes de hacer el pedido, use nuestro ",
          { text: "servicio de informe NUANS", href: "/nuans" },
          ". ¿Todavía está eligiendo jurisdicción? Consulte nuestra guía sobre ",
          { text: "constituirse en sociedad en Ontario", href: "/guides/constituirse-en-sociedad-en-ontario" },
          ".",
        ],
      },
    ],
    faqTitle: "Constituirse en línea: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de constitución; para asesoría sobre su situación particular, incluida la elección de jurisdicción y de estructura accionaria, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Cuál es la diferencia entre una sociedad federal y una de Ontario?",
        a: "Una sociedad federal se constituye según la CBCA y su nombre está protegido en todo Canadá; puede tener que registrarse como sociedad extraprovincial en las provincias donde opere. Una sociedad de Ontario se constituye según la OBCA y está autorizada a operar en Ontario. La tasa gubernamental es de $200 a nivel federal y de $300 en Ontario.",
      },
      {
        q: "¿Necesito un informe NUANS para constituirme?",
        a: "No para una sociedad numérica. Una sociedad de Ontario con nombre requiere un informe NUANS orientado a Ontario con una antigüedad máxima de 90 días al presentar. En una constitución federal, Corporations Canada realiza la búsqueda de nombre dentro de su presentación en línea, por lo que no se exige un informe aparte. Los paquetes Standard y Premium incluyen una búsqueda para el nombre de su pedido.",
      },
      {
        q: "¿Qué es una sociedad numérica?",
        a: "Una sociedad numérica no tiene un nombre elegido. El gobierno le asigna un número único, que se combina con la jurisdicción y la terminación legal, por ejemplo 1234567 Ontario Inc. o 1234567 Canada Inc. No requiere búsqueda de nombre, y más adelante la sociedad puede registrar un nombre comercial o cambiar su nombre modificando sus estatutos.",
      },
      {
        q: "¿Los directores tienen que vivir en Canadá?",
        a: "Depende de la jurisdicción. Según la CBCA, al menos el 25 % de los directores de una sociedad federal deben ser residentes canadienses, y al menos un director si la sociedad tiene menos de cuatro. Ontario derogó su requisito de residencia el 5 de julio de 2021, por lo que todos los directores de una sociedad de Ontario pueden vivir fuera de Canadá.",
      },
      {
        q: "¿Qué recibe una vez constituida la sociedad?",
        a: "Recibe los estatutos de constitución presentados, el certificado de constitución y la clave de la empresa, junto con un libro de actas digital estándar. Cada paquete también incluye las presentaciones obligatorias posteriores a la constitución, como la declaración inicial de Ontario, que vence dentro de los 60 días siguientes a la constitución.",
      },
    ],
  },
};
