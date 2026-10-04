import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Ontario sole proprietorship registration form.
// The form is a client wizard with almost no crawlable text, so this block
// carries the page's service intent ("register my sole proprietorship, file it
// for me") while the sole proprietorship guide keeps the informational intent.
// Facts mirror the sourced guide content (Business Names Act, CRA pages).
export const content: ServiceContentByLocale = {
  en: {
    title: "Register a sole proprietorship in Ontario online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex registers Ontario sole proprietorships online. In Ontario, a sole proprietorship is registered by registering its business name with the Ontario Business Registry under the Business Names Act. You tell us the name, what the business does, where it operates and when it starts, and we prepare the registration, file it and send you the result. For a step-by-step explanation first, read our guide on ",
          { text: "how to register a sole proprietorship in Ontario", href: "/guides/how-to-register-a-sole-proprietorship-in-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Individuals starting a business on their own in Ontario under a name other than their own legal name.",
          "Freelancers, consultants and contractors who already operate and now want to use a business name.",
          "Sole proprietors whose earlier business name registration has expired.",
        ],
      },
      { type: "h3", text: "What we file and what you provide" },
      {
        type: "p",
        parts: [
          "We prepare the business name registration for you as the sole proprietor and file it with the Ontario Business Registry. You provide the business name, a short description of the activity and its NAICS code, the business address and the date the business starts (or today, if it is already active). You also provide your full name, date of birth, home address, email and phone number as the owner. You confirm that the information is accurate, because the registration is a public record of who is behind the business.",
        ],
      },
      { type: "h3", text: "Key facts about sole proprietorships" },
      {
        type: "list",
        items: [
          "A sole proprietorship is not a separate legal entity. The owner is the business and is personally responsible for its debts and obligations.",
          "An individual who carries on business under their own name only does not have to register it. Any other name, including your name with added words such as \"Smith Consulting\", must be registered.",
          "The government fee is $60 to register and $60 to renew. The registration is effective for five years.",
          "A business carried on under an unregistered name cannot maintain a proceeding in an Ontario court in connection with that business without the court's leave.",
          "Business income is reported on the owner's personal income tax return, not on a separate corporate return.",
        ],
      },
      { type: "h3", text: "After you register" },
      {
        type: "p",
        parts: [
          "The Ontario registration and the CRA are separate. An unincorporated business needs a ",
          { text: "CRA business number", href: "/services/business-number" },
          " once it opens a program account, such as GST/HST or payroll. GST/HST registration is mandatory once taxable sales exceed $30,000 in a single calendar quarter or over four consecutive calendar quarters. Many owners compare the options in our guide on ",
          { text: "sole proprietorship vs corporation", href: "/guides/sole-proprietorship-vs-corporation" },
          " before choosing a structure.",
        ],
      },
    ],
    faqTitle: "Registering a sole proprietorship: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about registering a sole proprietorship in Ontario; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Do I have to register a sole proprietorship in Ontario?",
        a: "Only if you use a name other than your own. Under the Business Names Act, an individual carrying on business under their own name, such as \"Jane Smith\", does not have to register it. A different name, or your name with anything added to it, must be registered with the Ontario Business Registry before you carry on business under it.",
      },
      {
        q: "How long does the registration last?",
        a: "The business name registration is effective for five years. To keep operating under the name after that, it has to be renewed. The government fee is $60 for the initial registration and $60 for each renewal. If the registration expires, the business is operating under an unregistered name until it is registered again.",
      },
      {
        q: "Does registering protect me from personal liability?",
        a: "No. A sole proprietorship is not a separate legal entity, so registering a business name does not change the owner's personal responsibility for the business's debts and obligations. Limited liability comes from a separate legal entity, such as a corporation, which is a different registration.",
      },
      {
        q: "Do I need a business number as a sole proprietor?",
        a: "Not automatically. The Canada Revenue Agency issues a business number to an unincorporated business when it registers for a program account, such as GST/HST or payroll. GST/HST registration is mandatory once taxable sales pass the $30,000 small supplier threshold, and small suppliers may register voluntarily.",
      },
      {
        q: "Can I register a sole proprietorship with a partner?",
        a: "No. A sole proprietorship has a single owner. Two or more people carrying on business together form a partnership, which is registered differently. This service registers a business name for one individual operating on their own, with that individual named as the registrant on the Ontario Business Registry.",
      },
    ],
  },
  fr: {
    title: "Enregistrez une entreprise individuelle en Ontario en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex enregistre en ligne les entreprises individuelles de l'Ontario. En Ontario, une entreprise individuelle s'enregistre en enregistrant son nom commercial auprès du Registre des entreprises de l'Ontario, en vertu de la Loi sur les noms commerciaux. Vous nous indiquez le nom, ce que fait l'entreprise, où elle exerce et quand elle commence, et nous préparons l'enregistrement, le déposons et vous transmettons le résultat. Pour une explication étape par étape, lisez d'abord notre guide sur ",
          { text: "comment enregistrer une entreprise individuelle en Ontario", href: "/guides/comment-enregistrer-une-entreprise-individuelle-en-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les particuliers qui démarrent seuls une entreprise en Ontario sous un nom autre que leur propre nom.",
          "Les pigistes, consultants et entrepreneurs qui exercent déjà et veulent maintenant utiliser un nom commercial.",
          "Les propriétaires uniques dont l'enregistrement antérieur du nom commercial est expiré.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous fournissez" },
      {
        type: "p",
        parts: [
          "Nous préparons l'enregistrement du nom commercial en votre nom à titre de propriétaire unique et le déposons auprès du Registre des entreprises de l'Ontario. Vous fournissez le nom commercial, une courte description de l'activité et son code SCIAN, l'adresse de l'entreprise et la date de début des activités (ou la date du jour si l'entreprise est déjà active). Vous fournissez aussi, à titre de propriétaire, votre nom complet, votre date de naissance, votre adresse domiciliaire, votre courriel et votre numéro de téléphone. Vous confirmez l'exactitude des renseignements, car l'enregistrement est un registre public de la personne qui se trouve derrière l'entreprise.",
        ],
      },
      { type: "h3", text: "Faits clés sur l'entreprise individuelle" },
      {
        type: "list",
        items: [
          "Une entreprise individuelle n'est pas une entité juridique distincte. Le propriétaire est l'entreprise et répond personnellement de ses dettes et obligations.",
          "Un particulier qui exerce uniquement sous son propre nom n'a pas à l'enregistrer. Tout autre nom, y compris votre nom auquel s'ajoutent des mots comme « Tremblay Conseils », doit être enregistré.",
          "Les droits gouvernementaux sont de 60 $ pour l'enregistrement et de 60 $ pour le renouvellement. L'enregistrement est en vigueur pendant cinq ans.",
          "Une entreprise exploitée sous un nom non enregistré ne peut pas intenter une poursuite devant un tribunal de l'Ontario relativement à cette entreprise sans l'autorisation du tribunal.",
          "Le revenu d'entreprise est déclaré dans la déclaration de revenus personnelle du propriétaire, et non dans une déclaration de société distincte.",
        ],
      },
      { type: "h3", text: "Après l'enregistrement" },
      {
        type: "p",
        parts: [
          "L'enregistrement ontarien et l'ARC sont distincts. Une entreprise non constituée en société a besoin d'un ",
          { text: "numéro d'entreprise de l'ARC", href: "/services/business-number" },
          " dès qu'elle ouvre un compte de programme, comme la TPS/TVH ou les retenues sur la paie. L'inscription à la TPS/TVH devient obligatoire lorsque les ventes taxables dépassent 30 000 $ au cours d'un seul trimestre civil ou de quatre trimestres civils consécutifs. Bien des propriétaires comparent les options dans notre guide ",
          { text: "entreprise individuelle ou société", href: "/guides/entreprise-individuelle-ou-societe" },
          " avant de choisir une structure.",
        ],
      },
    ],
    faqTitle: "Enregistrer une entreprise individuelle : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur l'enregistrement d'une entreprise individuelle en Ontario; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Dois-je enregistrer une entreprise individuelle en Ontario?",
        a: "Seulement si vous utilisez un nom autre que le vôtre. En vertu de la Loi sur les noms commerciaux, un particulier qui exerce sous son propre nom, comme « Jeanne Tremblay », n'a pas à l'enregistrer. Un nom différent, ou votre nom auquel s'ajoute quoi que ce soit, doit être enregistré auprès du Registre des entreprises de l'Ontario avant que vous exerciez sous ce nom.",
      },
      {
        q: "Combien de temps dure l'enregistrement?",
        a: "L'enregistrement du nom commercial est en vigueur pendant cinq ans. Pour continuer d'exercer sous ce nom par la suite, il faut le renouveler. Les droits gouvernementaux sont de 60 $ pour l'enregistrement initial et de 60 $ pour chaque renouvellement. Si l'enregistrement expire, l'entreprise exerce sous un nom non enregistré jusqu'à ce qu'il soit enregistré de nouveau.",
      },
      {
        q: "L'enregistrement me protège-t-il contre la responsabilité personnelle?",
        a: "Non. Une entreprise individuelle n'est pas une entité juridique distincte, de sorte que l'enregistrement d'un nom commercial ne change rien à la responsabilité personnelle du propriétaire pour les dettes et obligations de l'entreprise. La responsabilité limitée découle d'une entité juridique distincte, comme une société par actions, qui fait l'objet d'un autre enregistrement.",
      },
      {
        q: "Ai-je besoin d'un numéro d'entreprise à titre de propriétaire unique?",
        a: "Pas automatiquement. L'Agence du revenu du Canada attribue un numéro d'entreprise à une entreprise non constituée en société lorsqu'elle s'inscrit à un compte de programme, comme la TPS/TVH ou les retenues sur la paie. L'inscription à la TPS/TVH est obligatoire une fois le seuil de 30 000 $ du petit fournisseur dépassé, et les petits fournisseurs peuvent s'inscrire volontairement.",
      },
      {
        q: "Puis-je enregistrer une entreprise individuelle avec un associé?",
        a: "Non. Une entreprise individuelle n'a qu'un seul propriétaire. Deux personnes ou plus qui exercent ensemble des activités forment une société de personnes, qui s'enregistre différemment. Ce service enregistre un nom commercial pour un seul particulier qui exerce seul, ce particulier étant inscrit comme déclarant au Registre des entreprises de l'Ontario.",
      },
    ],
  },
  es: {
    title: "Registre una empresa unipersonal en Ontario en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex registra en línea empresas unipersonales de Ontario. En Ontario, una empresa unipersonal se registra inscribiendo su nombre comercial ante el Registro de Empresas de Ontario, en virtud de la Ley de Nombres Comerciales (Business Names Act). Usted nos indica el nombre, a qué se dedica el negocio, dónde opera y cuándo comienza, y nosotros preparamos el registro, lo presentamos y le enviamos el resultado. Para una explicación paso a paso, lea primero nuestra guía sobre ",
          { text: "cómo registrar una empresa unipersonal en Ontario", href: "/guides/como-registrar-una-empresa-unipersonal-en-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Personas que inician un negocio por su cuenta en Ontario con un nombre distinto de su propio nombre legal.",
          "Trabajadores independientes, consultores y contratistas que ya operan y ahora quieren usar un nombre comercial.",
          "Propietarios únicos cuyo registro anterior del nombre comercial venció.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué proporciona usted" },
      {
        type: "p",
        parts: [
          "Preparamos el registro del nombre comercial a su nombre como propietario único y lo presentamos ante el Registro de Empresas de Ontario. Usted proporciona el nombre comercial, una breve descripción de la actividad y su código SCIAN (NAICS), la dirección del negocio y la fecha de inicio de actividades (o la fecha de hoy, si el negocio ya está activo). Como propietario, también proporciona su nombre completo, fecha de nacimiento, dirección particular, correo electrónico y teléfono. Usted confirma que la información es exacta, porque el registro es un registro público de quién está detrás del negocio.",
        ],
      },
      { type: "h3", text: "Datos clave sobre la empresa unipersonal" },
      {
        type: "list",
        items: [
          "Una empresa unipersonal no es una entidad jurídica separada. El propietario es el negocio y responde personalmente por sus deudas y obligaciones.",
          "Una persona que opera solo con su propio nombre no tiene que registrarlo. Cualquier otro nombre, incluido su nombre con palabras agregadas como \"García Consultoría\", debe registrarse.",
          "El cargo gubernamental es de $60 por el registro y de $60 por la renovación. El registro tiene vigencia de cinco años.",
          "Un negocio que opera bajo un nombre no registrado no puede iniciar una demanda ante un tribunal de Ontario en relación con ese negocio sin permiso del tribunal.",
          "Los ingresos del negocio se declaran en la declaración de impuestos personal del propietario, no en una declaración de sociedad aparte.",
        ],
      },
      { type: "h3", text: "Después de registrarse" },
      {
        type: "p",
        parts: [
          "El registro de Ontario y la CRA son trámites separados. Un negocio no constituido en sociedad necesita un ",
          { text: "número de negocio de la CRA", href: "/services/business-number" },
          " en cuanto abre una cuenta de programa, como la de GST/HST o la de nómina. La inscripción en el GST/HST es obligatoria cuando las ventas gravables superan $30,000 en un solo trimestre calendario o en cuatro trimestres calendario consecutivos. Muchos propietarios comparan las opciones en nuestra guía ",
          { text: "empresa unipersonal o sociedad", href: "/guides/empresa-unipersonal-o-sociedad" },
          " antes de elegir una estructura.",
        ],
      },
    ],
    faqTitle: "Registrar una empresa unipersonal: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre el registro de una empresa unipersonal en Ontario; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Tengo que registrar una empresa unipersonal en Ontario?",
        a: "Solo si usa un nombre distinto del suyo. Según la Ley de Nombres Comerciales, una persona que opera con su propio nombre, como \"Ana García\", no tiene que registrarlo. Un nombre diferente, o su nombre con cualquier agregado, debe registrarse ante el Registro de Empresas de Ontario antes de operar con él.",
      },
      {
        q: "¿Cuánto dura el registro?",
        a: "El registro del nombre comercial tiene vigencia de cinco años. Para seguir operando con ese nombre después, hay que renovarlo. El cargo gubernamental es de $60 por el registro inicial y de $60 por cada renovación. Si el registro vence, el negocio opera bajo un nombre no registrado hasta que se registre de nuevo.",
      },
      {
        q: "¿Registrarme me protege de la responsabilidad personal?",
        a: "No. Una empresa unipersonal no es una entidad jurídica separada, por lo que registrar un nombre comercial no cambia la responsabilidad personal del propietario por las deudas y obligaciones del negocio. La responsabilidad limitada proviene de una entidad jurídica separada, como una sociedad por acciones, que es un registro distinto.",
      },
      {
        q: "¿Necesito un número de negocio como propietario único?",
        a: "No automáticamente. La Agencia de Ingresos de Canadá emite un número de negocio a un negocio no constituido en sociedad cuando se inscribe en una cuenta de programa, como la de GST/HST o la de nómina. La inscripción en el GST/HST es obligatoria al superar el umbral de pequeño proveedor de $30,000, y los pequeños proveedores pueden inscribirse voluntariamente.",
      },
      {
        q: "¿Puedo registrar una empresa unipersonal con un socio?",
        a: "No. Una empresa unipersonal tiene un solo propietario. Dos o más personas que operan un negocio juntas forman una sociedad de personas (partnership), que se registra de otra manera. Este servicio registra un nombre comercial para una sola persona que opera por su cuenta, que figura como titular del registro en el Registro de Empresas de Ontario.",
      },
    ],
  },
};
