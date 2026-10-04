import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Ontario business name registration form. The
// form is a client wizard with almost no crawlable text, so this block carries
// the page's service intent ("register my business name, file it for me") while
// the register-a-business guide keeps the informational intent. Facts mirror
// the sourced guide content (Business Names Act, ontario.ca fee schedule).
export const content: ServiceContentByLocale = {
  en: {
    title: "Register a business name in Ontario online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files business name registrations with the Ontario Business Registry under Ontario's Business Names Act. You tell us the name you want to operate under, what the business does and who is registering it, either you as an individual or an existing corporation, and we prepare the registration, file it and send you the result. For the bigger picture of starting out in the province, read our guide on ",
          { text: "how to register a business in Ontario", href: "/guides/how-to-register-a-business-in-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Individuals who carry on business in Ontario under a name other than their own legal name, such as \"Maple Ridge Consulting\" or \"Jane Smith Design\".",
          "Ontario and federal corporations that operate or identify themselves to the public under a name other than their corporate name, for example a numbered company trading under a brand.",
          "Owners whose earlier registration has lapsed and who want the name registered again.",
        ],
      },
      { type: "h3", text: "What we file and what you provide" },
      {
        type: "p",
        parts: [
          "We prepare the business name registration and file it with the Ontario Business Registry. You provide the name to register, the business address, a short description of the activity and its NAICS code. If you register as an individual, you give your full name and date of birth; if you register for a corporation, you give its legal name and its Ontario or federal corporation number. You confirm that the information is accurate, because the registration is a public record of who is behind the name.",
        ],
      },
      { type: "h3", text: "Key rules under the Business Names Act" },
      {
        type: "list",
        items: [
          "An individual must register any business name other than their own name. Adding words to your own name, such as \"Smith Consulting\", makes it a different name.",
          "A corporation must register any name it uses other than its corporate name.",
          "The government fee is $60 to register and $60 to renew. A registration is effective for five years and has to be renewed to stay in force.",
          "A business carried on under an unregistered name cannot maintain a proceeding in an Ontario court in connection with that business without the court's leave.",
          "Registration is a public notice, not an exclusive right. Ontario does not stop someone else from registering the same or a similar name, and trademark rights are a separate matter.",
        ],
      },
      {
        type: "p",
        parts: [
          "A business name is not a separate legal entity. Registering \"Maple Ridge Consulting\" as an individual means you operate as a ",
          { text: "sole proprietorship", href: "/services/sole-proprietorship" },
          " and remain personally responsible for the business. Many owners who want a separate legal entity ",
          { text: "incorporate", href: "/incorporate" },
          " instead, and then register additional trade names for the corporation if needed.",
        ],
      },
    ],
    faqTitle: "Registering a business name: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about business name registration in Ontario; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Do I need to register if I use my own name?",
        a: "Not as a business name. Under the Business Names Act, an individual only has to register a name that is different from their own name. Once you add anything to it, such as \"Consulting\" or \"& Associates\", or use a different name altogether, the name has to be registered before you carry on business or identify the business to the public under it.",
      },
      {
        q: "How long does an Ontario business name registration last?",
        a: "A registration under the Business Names Act is effective for five years. To keep using the name, the registration has to be renewed, and the government fee for a renewal is $60, the same as for a new registration. A lapsed registration leaves the business operating under an unregistered name.",
      },
      {
        q: "Does registering a business name protect it?",
        a: "No. A business name registration is a public record of who is carrying on business under the name. It does not give an exclusive right to the name, and Ontario does not prevent someone else from registering an identical or similar name. Protection of a brand comes from trademark law, which is separate from this registration.",
      },
      {
        q: "Can a corporation register a business name?",
        a: "Yes. A corporation that operates or identifies itself to the public under a name other than its corporate name must register that name. This is common for numbered corporations that trade under a brand. The registration is filed in the corporation's name, using its Ontario or federal corporation number, and the corporation remains the legal entity behind the business.",
      },
      {
        q: "Is a business name the same as a business number?",
        a: "No. The business name registration is filed with the Ontario Business Registry. The business number is a nine-digit identifier issued by the Canada Revenue Agency and used for tax accounts such as GST/HST and payroll. They are separate registrations with different government bodies.",
      },
    ],
  },
  fr: {
    title: "Enregistrez un nom commercial en Ontario en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose les enregistrements de noms commerciaux auprès du Registre des entreprises de l'Ontario, en vertu de la Loi sur les noms commerciaux de l'Ontario. Vous nous indiquez le nom sous lequel vous voulez exercer, ce que fait l'entreprise et qui l'enregistre, vous-même à titre de particulier ou une société existante, et nous préparons l'enregistrement, le déposons et vous transmettons le résultat. Pour une vue d'ensemble du démarrage dans la province, lisez notre guide sur ",
          { text: "comment enregistrer une entreprise en Ontario", href: "/guides/comment-enregistrer-entreprise-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les particuliers qui exercent des activités en Ontario sous un nom autre que leur propre nom, par exemple « Conseils Érablière » ou « Design Jeanne Tremblay ».",
          "Les sociétés ontariennes et fédérales qui exercent leurs activités ou s'identifient auprès du public sous un nom autre que leur dénomination sociale, par exemple une société à numéro qui exerce sous une marque.",
          "Les propriétaires dont l'enregistrement antérieur est expiré et qui veulent enregistrer le nom de nouveau.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous fournissez" },
      {
        type: "p",
        parts: [
          "Nous préparons l'enregistrement du nom commercial et le déposons auprès du Registre des entreprises de l'Ontario. Vous fournissez le nom à enregistrer, l'adresse de l'entreprise, une courte description de l'activité et son code SCIAN. Si vous enregistrez à titre de particulier, vous indiquez votre nom complet et votre date de naissance; si vous enregistrez pour une société, vous indiquez sa dénomination sociale et son numéro de société ontarien ou fédéral. Vous confirmez l'exactitude des renseignements, car l'enregistrement est un registre public de la personne qui se trouve derrière le nom.",
        ],
      },
      { type: "h3", text: "Règles clés de la Loi sur les noms commerciaux" },
      {
        type: "list",
        items: [
          "Un particulier doit enregistrer tout nom commercial autre que son propre nom. Ajouter des mots à votre nom, comme « Tremblay Conseils », en fait un nom différent.",
          "Une société doit enregistrer tout nom qu'elle utilise autre que sa dénomination sociale.",
          "Les droits gouvernementaux sont de 60 $ pour l'enregistrement et de 60 $ pour le renouvellement. Un enregistrement est en vigueur pendant cinq ans et doit être renouvelé pour demeurer valide.",
          "Une entreprise exploitée sous un nom non enregistré ne peut pas intenter une poursuite devant un tribunal de l'Ontario relativement à cette entreprise sans l'autorisation du tribunal.",
          "L'enregistrement est un avis public, pas un droit exclusif. L'Ontario n'empêche pas une autre personne d'enregistrer un nom identique ou semblable, et les droits liés aux marques de commerce sont une question distincte.",
        ],
      },
      {
        type: "p",
        parts: [
          "Un nom commercial n'est pas une entité juridique distincte. Enregistrer « Conseils Érablière » à titre de particulier signifie que vous exercez en tant qu'",
          { text: "entreprise individuelle", href: "/services/sole-proprietorship" },
          " et que vous demeurez personnellement responsable de l'entreprise. Bien des propriétaires qui veulent une entité juridique distincte choisissent plutôt de ",
          { text: "se constituer en société", href: "/incorporate" },
          ", puis d'enregistrer au besoin des noms commerciaux supplémentaires pour la société.",
        ],
      },
    ],
    faqTitle: "Enregistrer un nom commercial : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur l'enregistrement d'un nom commercial en Ontario; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Dois-je m'enregistrer si j'utilise mon propre nom?",
        a: "Pas à titre de nom commercial. En vertu de la Loi sur les noms commerciaux, un particulier n'a à enregistrer qu'un nom différent du sien. Dès que vous y ajoutez quelque chose, comme « Conseils » ou « et associés », ou que vous utilisez un tout autre nom, celui-ci doit être enregistré avant que vous exerciez des activités ou identifiiez l'entreprise auprès du public sous ce nom.",
      },
      {
        q: "Combien de temps dure l'enregistrement d'un nom commercial en Ontario?",
        a: "Un enregistrement en vertu de la Loi sur les noms commerciaux est en vigueur pendant cinq ans. Pour continuer d'utiliser le nom, il faut le renouveler, et les droits gouvernementaux de renouvellement sont de 60 $, comme pour un nouvel enregistrement. Un enregistrement expiré laisse l'entreprise exercer sous un nom non enregistré.",
      },
      {
        q: "L'enregistrement d'un nom commercial le protège-t-il?",
        a: "Non. L'enregistrement d'un nom commercial est un registre public de la personne qui exerce des activités sous ce nom. Il ne confère aucun droit exclusif sur le nom, et l'Ontario n'empêche pas une autre personne d'enregistrer un nom identique ou semblable. La protection d'une marque relève du droit des marques de commerce, distinct de cet enregistrement.",
      },
      {
        q: "Une société peut-elle enregistrer un nom commercial?",
        a: "Oui. Une société qui exerce ses activités ou s'identifie auprès du public sous un nom autre que sa dénomination sociale doit enregistrer ce nom. C'est courant pour les sociétés à numéro qui exercent sous une marque. L'enregistrement est déposé au nom de la société, avec son numéro de société ontarien ou fédéral, et la société demeure l'entité juridique derrière l'entreprise.",
      },
      {
        q: "Un nom commercial est-il la même chose qu'un numéro d'entreprise?",
        a: "Non. L'enregistrement du nom commercial est déposé auprès du Registre des entreprises de l'Ontario. Le numéro d'entreprise est un identifiant à neuf chiffres attribué par l'Agence du revenu du Canada et utilisé pour les comptes fiscaux comme la TPS/TVH et les retenues sur la paie. Ce sont deux enregistrements distincts, auprès de deux organismes différents.",
      },
    ],
  },
  es: {
    title: "Registre un nombre comercial en Ontario en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta registros de nombres comerciales ante el Registro de Empresas de Ontario, en virtud de la Ley de Nombres Comerciales de Ontario (Business Names Act). Usted nos indica el nombre bajo el cual quiere operar, a qué se dedica el negocio y quién lo registra, usted como persona física o una sociedad existente, y nosotros preparamos el registro, lo presentamos y le enviamos el resultado. Para una visión general de cómo empezar en la provincia, lea nuestra guía sobre ",
          { text: "cómo registrar un negocio en Ontario", href: "/guides/como-registrar-negocio-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Personas que operan un negocio en Ontario bajo un nombre distinto de su propio nombre legal, como \"Maple Ridge Consulting\" o \"Diseño Ana García\".",
          "Sociedades de Ontario y federales que operan o se identifican ante el público con un nombre distinto de su denominación social, por ejemplo una sociedad numerada que opera bajo una marca.",
          "Propietarios cuyo registro anterior venció y que quieren volver a registrar el nombre.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué proporciona usted" },
      {
        type: "p",
        parts: [
          "Preparamos el registro del nombre comercial y lo presentamos ante el Registro de Empresas de Ontario. Usted proporciona el nombre a registrar, la dirección del negocio, una breve descripción de la actividad y su código SCIAN (NAICS). Si registra como persona física, indica su nombre completo y su fecha de nacimiento; si registra para una sociedad, indica su denominación social y su número de sociedad de Ontario o federal. Usted confirma que la información es exacta, porque el registro es un registro público de quién está detrás del nombre.",
        ],
      },
      { type: "h3", text: "Reglas clave de la Ley de Nombres Comerciales" },
      {
        type: "list",
        items: [
          "Una persona física debe registrar cualquier nombre comercial distinto de su propio nombre. Agregar palabras a su nombre, como \"García Consultoría\", lo convierte en un nombre distinto.",
          "Una sociedad debe registrar cualquier nombre que use distinto de su denominación social.",
          "El cargo gubernamental es de $60 por el registro y de $60 por la renovación. Un registro tiene vigencia de cinco años y debe renovarse para seguir en vigor.",
          "Un negocio que opera bajo un nombre no registrado no puede iniciar una demanda ante un tribunal de Ontario en relación con ese negocio sin permiso del tribunal.",
          "El registro es un aviso público, no un derecho exclusivo. Ontario no impide que otra persona registre un nombre idéntico o similar, y los derechos de marca son un asunto aparte.",
        ],
      },
      {
        type: "p",
        parts: [
          "Un nombre comercial no es una entidad jurídica separada. Registrar \"Maple Ridge Consulting\" como persona física significa que usted opera como ",
          { text: "empresa unipersonal", href: "/services/sole-proprietorship" },
          " y sigue siendo personalmente responsable del negocio. Muchos propietarios que quieren una entidad jurídica separada optan por ",
          { text: "constituir una sociedad", href: "/incorporate" },
          " y luego, si hace falta, registran nombres comerciales adicionales para la sociedad.",
        ],
      },
    ],
    faqTitle: "Registrar un nombre comercial: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre el registro de nombres comerciales en Ontario; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Tengo que registrarme si uso mi propio nombre?",
        a: "No como nombre comercial. Según la Ley de Nombres Comerciales, una persona física solo tiene que registrar un nombre distinto del suyo. En cuanto le agrega algo, como \"Consultoría\" o \"y Asociados\", o usa un nombre totalmente diferente, ese nombre debe registrarse antes de operar o identificar el negocio ante el público con él.",
      },
      {
        q: "¿Cuánto dura el registro de un nombre comercial en Ontario?",
        a: "Un registro en virtud de la Ley de Nombres Comerciales tiene vigencia de cinco años. Para seguir usando el nombre hay que renovarlo, y el cargo gubernamental por la renovación es de $60, igual que por un registro nuevo. Un registro vencido deja al negocio operando bajo un nombre no registrado.",
      },
      {
        q: "¿Registrar un nombre comercial lo protege?",
        a: "No. El registro de un nombre comercial es un registro público de quién opera un negocio bajo ese nombre. No otorga un derecho exclusivo sobre el nombre, y Ontario no impide que otra persona registre un nombre idéntico o similar. La protección de una marca proviene del derecho de marcas, que es independiente de este registro.",
      },
      {
        q: "¿Puede una sociedad registrar un nombre comercial?",
        a: "Sí. Una sociedad que opera o se identifica ante el público con un nombre distinto de su denominación social debe registrar ese nombre. Es habitual en sociedades numeradas que operan bajo una marca. El registro se presenta a nombre de la sociedad, con su número de sociedad de Ontario o federal, y la sociedad sigue siendo la entidad jurídica detrás del negocio.",
      },
      {
        q: "¿Un nombre comercial es lo mismo que un número de negocio?",
        a: "No. El registro del nombre comercial se presenta ante el Registro de Empresas de Ontario. El número de negocio es un identificador de nueve dígitos que emite la Agencia de Ingresos de Canadá (CRA) y que se usa para cuentas fiscales como el GST/HST y la nómina. Son registros distintos ante organismos distintos.",
      },
    ],
  },
};
