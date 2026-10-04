import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Initial Minute Book order form. The form is a
// client wizard with almost no crawlable text, so this block carries the
// service intent ("prepare my minute book for me"); the minute book guide keeps
// the informational "what is a minute book" intent. Contents mirror
// src/lib/businessUpdateServices.ts and the initialMinuteBookSchema.
export const content: ServiceContentByLocale = {
  en: {
    title: "Get a minute book for your corporation",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares a complete digital initial minute book for a federal (CBCA) or Ontario (OBCA) corporation that was incorporated without one. From the details you give us about the corporation, its share structure, shareholders, directors and officers, we draft the by-laws, organizational resolutions, share certificates and the registers of directors, officers and shareholders, ready for signature. Delivery is within 3 to 5 business days. For background on what a minute book holds, read our guide on ",
          { text: "the corporate minute book", href: "/guides/corporate-minute-book" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Owners who incorporated on their own through Corporations Canada or the Ontario Business Registry and never organized the corporation.",
          "Corporations that have their Certificate and Articles of Incorporation but no by-laws, organizational resolutions or share certificates on record.",
          "Corporations with one or several shareholders, directors, officers and classes of shares.",
        ],
      },
      { type: "h3", text: "What is included" },
      {
        type: "list",
        items: [
          "By-laws of the corporation.",
          "Organizational resolutions of the directors and shareholders.",
          "Share certificates for the shares issued to each shareholder.",
          "Registers of directors, officers and shareholders.",
        ],
      },
      {
        type: "p",
        parts: [
          "The base order covers one class of shares, one shareholder, one director and one officer. Additional classes, shareholders, directors and officers can be added in the form. The rights attached to each class of shares are transcribed from your Articles.",
        ],
      },
      { type: "h3", text: "What the law requires" },
      {
        type: "p",
        parts: [
          "Section 20 of the CBCA and section 140 of the OBCA require a corporation to keep its articles and by-laws, the minutes and resolutions of its shareholders and directors, a register of directors and a securities register, along with adequate accounting records. These records are kept at the registered office or another place the directors designate; for an Ontario corporation, that place must be in Ontario. The government issues the Certificate and Articles of Incorporation, but it does not prepare the by-laws, resolutions, certificates or registers.",
        ],
      },
      { type: "h3", text: "What you need before you order" },
      {
        type: "list",
        items: [
          "Your Certificate and Articles of Incorporation, for the corporation's name, number, date of incorporation and registered office.",
          "Each class of shares exactly as it is named in the Articles.",
          "For each shareholder: name, address, class of shares, number of shares and price per share, and the issue date if it differs from the incorporation date.",
          "The name and address of each director and officer, each officer's position and, for a federal corporation, whether each director is a resident Canadian.",
        ],
      },
      { type: "h3", text: "After delivery" },
      {
        type: "p",
        parts: [
          "Once the directors and shareholders sign the documents, they form the corporation's minute book. An Ontario corporation that has not yet filed its ",
          { text: "Initial Return", href: "/services/initial-return-on" },
          " must do so within 60 days of incorporation. Every Korporex ",
          { text: "incorporation package", href: "/incorporate" },
          " already includes a standard digital minute book, so this service is for corporations incorporated elsewhere.",
        ],
      },
    ],
    faqTitle: "Initial minute books: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about preparing a corporate minute book; for advice on your specific situation, including your share structure and the tax treatment of share issuances, consult a lawyer or accountant.",
    faq: [
      {
        q: "Is a minute book legally required?",
        a: "The CBCA (section 20) and the OBCA (section 140) require every corporation to keep its articles, by-laws, minutes and resolutions, a register of directors and a securities register. The statutes do not use the words minute book, but these records are what a minute book holds. They are kept by the corporation, not filed with the government.",
      },
      {
        q: "I incorporated myself. Didn't I already get a minute book?",
        a: "No. When you incorporate on your own, the registry issues the Certificate and Articles of Incorporation. It does not prepare by-laws, organizational resolutions, share certificates or the registers of directors, officers and shareholders. Those are the corporation's own records, and an initial minute book supplies them.",
      },
      {
        q: "What if the shares were issued after the date of incorporation?",
        a: "The form has an optional issue date for each shareholder's shares. If you leave it blank, the issue date defaults to the date of incorporation. If the shares were issued, or will be issued, on a later date, enter that date so the resolutions, certificates and securities register reflect it.",
      },
      {
        q: "Does this work for both federal and Ontario corporations?",
        a: "Yes. The service covers corporations incorporated under the CBCA and under the OBCA. For a federal corporation, the form also asks whether each director is a resident Canadian, because the CBCA requires at least 25% of the directors, and at least one if there are fewer than four, to be resident Canadians.",
      },
      {
        q: "How is the minute book delivered?",
        a: "The minute book is prepared in digital form and delivered within 3 to 5 business days, ready for signature by the directors and shareholders. The price shown in the form covers one class of shares, one shareholder, one director and one officer, with each additional item added to the order.",
      },
    ],
  },
  fr: {
    title: "Obtenez un livre des procès-verbaux pour votre société",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare un livre des procès-verbaux initial numérique complet pour une société fédérale (LCSA) ou ontarienne (LSAO) constituée sans en avoir un. À partir des renseignements que vous nous fournissez sur la société, sa structure de capital, ses actionnaires, ses administrateurs et ses dirigeants, nous rédigeons les règlements administratifs, les résolutions d'organisation, les certificats d'actions et les registres des administrateurs, des dirigeants et des actionnaires, prêts à signer. La livraison se fait dans un délai de 3 à 5 jours ouvrables. Pour savoir ce que contient un livre des procès-verbaux, lisez notre guide ",
          { text: "Qu'est-ce qu'un livre des procès-verbaux?", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les propriétaires qui se sont constitués eux-mêmes auprès de Corporations Canada ou du Registre des entreprises de l'Ontario et n'ont jamais organisé la société.",
          "Les sociétés qui ont leur certificat et leurs statuts constitutifs, mais aucun règlement administratif, aucune résolution d'organisation ni aucun certificat d'actions dans leurs registres.",
          "Les sociétés comptant un ou plusieurs actionnaires, administrateurs, dirigeants et catégories d'actions.",
        ],
      },
      { type: "h3", text: "Ce qui est inclus" },
      {
        type: "list",
        items: [
          "Les règlements administratifs de la société.",
          "Les résolutions d'organisation des administrateurs et des actionnaires.",
          "Les certificats d'actions pour les actions émises à chaque actionnaire.",
          "Les registres des administrateurs, des dirigeants et des actionnaires.",
        ],
      },
      {
        type: "p",
        parts: [
          "La commande de base couvre une catégorie d'actions, un actionnaire, un administrateur et un dirigeant. Des catégories, actionnaires, administrateurs et dirigeants supplémentaires peuvent être ajoutés dans le formulaire. Les droits rattachés à chaque catégorie d'actions sont transcrits à partir de vos statuts.",
        ],
      },
      { type: "h3", text: "Ce qu'exige la loi" },
      {
        type: "p",
        parts: [
          "L'article 20 de la LCSA et l'article 140 de la LSAO exigent qu'une société tienne ses statuts et ses règlements administratifs, les procès-verbaux et résolutions de ses actionnaires et de ses administrateurs, un registre des administrateurs et un registre des valeurs mobilières, ainsi que des documents comptables adéquats. Ces registres sont conservés au siège social ou à un autre lieu désigné par les administrateurs; pour une société ontarienne, ce lieu doit se trouver en Ontario. Le gouvernement délivre le certificat et les statuts constitutifs, mais il ne prépare ni les règlements administratifs, ni les résolutions, ni les certificats, ni les registres.",
        ],
      },
      { type: "h3", text: "Ce qu'il vous faut avant de commander" },
      {
        type: "list",
        items: [
          "Votre certificat et vos statuts constitutifs, pour la dénomination, le numéro, la date de constitution et le siège social de la société.",
          "Chaque catégorie d'actions exactement telle qu'elle est désignée dans les statuts.",
          "Pour chaque actionnaire : le nom, l'adresse, la catégorie d'actions, le nombre d'actions et le prix par action, ainsi que la date d'émission si elle diffère de la date de constitution.",
          "Le nom et l'adresse de chaque administrateur et dirigeant, le poste de chaque dirigeant et, pour une société fédérale, si chaque administrateur est un résident canadien.",
        ],
      },
      { type: "h3", text: "Après la livraison" },
      {
        type: "p",
        parts: [
          "Une fois signés par les administrateurs et les actionnaires, les documents forment le livre des procès-verbaux de la société. Une société ontarienne qui n'a pas encore déposé son ",
          { text: "rapport initial", href: "/services/initial-return-on" },
          " doit le faire dans les 60 jours suivant sa constitution. Chaque ",
          { text: "forfait de constitution", href: "/incorporate" },
          " Korporex comprend déjà un livre des procès-verbaux numérique standard; ce service s'adresse donc aux sociétés constituées ailleurs.",
        ],
      },
    ],
    faqTitle: "Livre des procès-verbaux initial : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur la préparation d'un livre des procès-verbaux; pour des conseils adaptés à votre situation, y compris votre structure de capital et le traitement fiscal des émissions d'actions, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Un livre des procès-verbaux est-il obligatoire?",
        a: "La LCSA (article 20) et la LSAO (article 140) exigent que chaque société tienne ses statuts, ses règlements administratifs, ses procès-verbaux et résolutions, un registre des administrateurs et un registre des valeurs mobilières. Les lois n'emploient pas l'expression livre des procès-verbaux, mais c'est ce que contient un tel livre. Ces registres sont conservés par la société et ne sont pas déposés auprès du gouvernement.",
      },
      {
        q: "Je me suis constitué moi-même. N'ai-je pas déjà un livre des procès-verbaux?",
        a: "Non. Lorsque vous vous constituez vous-même, le registre délivre le certificat et les statuts constitutifs. Il ne prépare ni les règlements administratifs, ni les résolutions d'organisation, ni les certificats d'actions, ni les registres des administrateurs, des dirigeants et des actionnaires. Ce sont les registres propres de la société, et un livre des procès-verbaux initial les fournit.",
      },
      {
        q: "Et si les actions ont été émises après la date de constitution?",
        a: "Le formulaire comporte une date d'émission facultative pour les actions de chaque actionnaire. Si vous la laissez vide, la date d'émission est par défaut la date de constitution. Si les actions ont été ou seront émises à une date ultérieure, inscrivez cette date pour que les résolutions, les certificats et le registre des valeurs mobilières en tiennent compte.",
      },
      {
        q: "Ce service vise-t-il les sociétés fédérales et ontariennes?",
        a: "Oui. Le service couvre les sociétés constituées en vertu de la LCSA et de la LSAO. Pour une société fédérale, le formulaire demande aussi si chaque administrateur est un résident canadien, car la LCSA exige qu'au moins 25 % des administrateurs, et au moins un s'il y en a moins de quatre, soient des résidents canadiens.",
      },
      {
        q: "Comment le livre des procès-verbaux est-il livré?",
        a: "Le livre des procès-verbaux est préparé en format numérique et livré dans un délai de 3 à 5 jours ouvrables, prêt à être signé par les administrateurs et les actionnaires. Le prix affiché dans le formulaire couvre une catégorie d'actions, un actionnaire, un administrateur et un dirigeant, chaque élément supplémentaire s'ajoutant à la commande.",
      },
    ],
  },
  es: {
    title: "Obtenga un libro de actas para su sociedad",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara un libro de actas inicial digital completo para una sociedad federal (CBCA) o de Ontario (OBCA) que se constituyó sin uno. A partir de los datos que usted nos da sobre la sociedad, su estructura accionaria, sus accionistas, directores y funcionarios, redactamos los estatutos internos, las resoluciones de organización, los certificados de acciones y los registros de directores, funcionarios y accionistas, listos para firmar. La entrega se realiza en un plazo de 3 a 5 días hábiles. Para saber qué contiene un libro de actas, lea nuestra guía ",
          { text: "¿Qué es un libro de actas?", href: "/guides/que-es-un-libro-de-actas" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Propietarios que se constituyeron por su cuenta ante Corporations Canada o el Registro de Empresas de Ontario y nunca organizaron la sociedad.",
          "Sociedades que tienen su certificado y sus estatutos de constitución, pero no tienen estatutos internos, resoluciones de organización ni certificados de acciones en sus registros.",
          "Sociedades con uno o varios accionistas, directores, funcionarios y clases de acciones.",
        ],
      },
      { type: "h3", text: "Qué incluye" },
      {
        type: "list",
        items: [
          "Los estatutos internos de la sociedad.",
          "Las resoluciones de organización de los directores y los accionistas.",
          "Los certificados de acciones por las acciones emitidas a cada accionista.",
          "Los registros de directores, funcionarios y accionistas.",
        ],
      },
      {
        type: "p",
        parts: [
          "El pedido básico cubre una clase de acciones, un accionista, un director y un funcionario. Se pueden agregar clases, accionistas, directores y funcionarios adicionales en el formulario. Los derechos de cada clase de acciones se transcriben de sus estatutos de constitución.",
        ],
      },
      { type: "h3", text: "Qué exige la ley" },
      {
        type: "p",
        parts: [
          "El artículo 20 de la CBCA y el artículo 140 de la OBCA exigen que una sociedad conserve sus estatutos de constitución y sus estatutos internos, las actas y resoluciones de sus accionistas y directores, un registro de directores y un registro de valores, además de registros contables adecuados. Estos registros se conservan en el domicilio social o en otro lugar que designen los directores; para una sociedad de Ontario, ese lugar debe estar en Ontario. El gobierno emite el certificado y los estatutos de constitución, pero no prepara los estatutos internos, las resoluciones, los certificados ni los registros.",
        ],
      },
      { type: "h3", text: "Qué necesita antes de hacer el pedido" },
      {
        type: "list",
        items: [
          "Su certificado y sus estatutos de constitución, para el nombre, el número, la fecha de constitución y el domicilio social de la sociedad.",
          "Cada clase de acciones exactamente como figura en los estatutos de constitución.",
          "Para cada accionista: nombre, dirección, clase de acciones, número de acciones y precio por acción, y la fecha de emisión si es distinta de la fecha de constitución.",
          "El nombre y la dirección de cada director y funcionario, el cargo de cada funcionario y, para una sociedad federal, si cada director es residente canadiense.",
        ],
      },
      { type: "h3", text: "Después de la entrega" },
      {
        type: "p",
        parts: [
          "Una vez que los directores y los accionistas firman los documentos, estos forman el libro de actas de la sociedad. Una sociedad de Ontario que aún no haya presentado su ",
          { text: "declaración inicial", href: "/services/initial-return-on" },
          " debe hacerlo dentro de los 60 días siguientes a su constitución. Cada ",
          { text: "paquete de constitución", href: "/incorporate" },
          " de Korporex ya incluye un libro de actas digital estándar, por lo que este servicio es para sociedades constituidas por otra vía.",
        ],
      },
    ],
    faqTitle: "Libro de actas inicial: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la preparación de un libro de actas; para asesoría sobre su situación particular, incluida su estructura accionaria y el tratamiento fiscal de las emisiones de acciones, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Es obligatorio tener un libro de actas?",
        a: "La CBCA (artículo 20) y la OBCA (artículo 140) exigen que toda sociedad conserve sus estatutos, estatutos internos, actas y resoluciones, un registro de directores y un registro de valores. Las leyes no usan la expresión libro de actas, pero esos registros son lo que contiene un libro de actas. La sociedad los conserva; no se presentan ante el gobierno.",
      },
      {
        q: "Me constituí por mi cuenta. ¿No recibí ya un libro de actas?",
        a: "No. Cuando usted se constituye por su cuenta, el registro emite el certificado y los estatutos de constitución. No prepara estatutos internos, resoluciones de organización, certificados de acciones ni los registros de directores, funcionarios y accionistas. Esos son registros propios de la sociedad, y un libro de actas inicial los proporciona.",
      },
      {
        q: "¿Qué pasa si las acciones se emitieron después de la fecha de constitución?",
        a: "El formulario tiene una fecha de emisión opcional para las acciones de cada accionista. Si la deja en blanco, la fecha de emisión será la fecha de constitución. Si las acciones se emitieron, o se emitirán, en una fecha posterior, ingrese esa fecha para que las resoluciones, los certificados y el registro de valores la reflejen.",
      },
      {
        q: "¿Sirve para sociedades federales y de Ontario?",
        a: "Sí. El servicio cubre sociedades constituidas según la CBCA y según la OBCA. Para una sociedad federal, el formulario también pregunta si cada director es residente canadiense, porque la CBCA exige que al menos el 25 % de los directores, y al menos uno si hay menos de cuatro, sean residentes canadienses.",
      },
      {
        q: "¿Cómo se entrega el libro de actas?",
        a: "El libro de actas se prepara en formato digital y se entrega en un plazo de 3 a 5 días hábiles, listo para la firma de los directores y los accionistas. El precio que muestra el formulario cubre una clase de acciones, un accionista, un director y un funcionario, y cada elemento adicional se suma al pedido.",
      },
    ],
  },
};
