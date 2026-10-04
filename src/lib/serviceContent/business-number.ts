import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the CRA business number registration form. The
// form is a client wizard with almost no crawlable text, so this block carries
// the page's service intent ("get my business number, file it for me") while
// the CRA business number guide keeps the informational intent. Facts are from
// canada.ca (BN and program account pages, GST/HST small supplier rule).
export const content: ServiceContentByLocale = {
  en: {
    title: "Get a CRA business number online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and submits business number (BN) registrations with the Canada Revenue Agency, together with the program accounts you select, such as GST/HST, payroll and corporate income tax. You tell us who is registering, which accounts you need and when they should take effect, and we handle the registration and send you the result. For a full explanation of how the BN works, read our guide on ",
          { text: "how to get a CRA business number", href: "/guides/how-to-get-a-cra-business-number" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Sole proprietors and individuals who need a GST/HST or payroll account for the first time.",
          "Partnerships that need a business number and their first program accounts.",
          "Corporations that do not yet have a business number or need to register for program accounts.",
        ],
      },
      { type: "h3", text: "What we file and what you provide" },
      {
        type: "p",
        parts: [
          "We prepare the CRA registration for the business number and each program account you choose. You provide the legal name of the individual, partnership or corporation, the entity type, its address, the date the registration should take effect, your expected gross revenue (under or over $30,000 a year) and a contact person. You confirm which program accounts you need and that the information is accurate, since the CRA uses it to set up your accounts and filing obligations.",
        ],
      },
      { type: "h3", text: "How the business number works" },
      {
        type: "list",
        items: [
          "The BN is a nine-digit number the CRA uses as a standard identifier for a business or legal entity.",
          "Each program account adds a two-letter identifier and a four-digit reference number to the BN, for example 123456789 RT 0001 for a GST/HST account. RT is GST/HST, RP is payroll deductions and RC is corporation income tax.",
          "An unincorporated business needs a BN only when it registers for a program account, such as GST/HST or payroll.",
          "A corporation incorporated federally or in Ontario and most other provinces receives a BN automatically at incorporation, without a separate CRA registration.",
          "Since October 21, 2024, the import/export (RM) program account has been administered by the Canada Border Services Agency rather than the CRA.",
        ],
      },
      { type: "h3", text: "GST/HST and the $30,000 threshold" },
      {
        type: "p",
        parts: [
          "GST/HST registration is mandatory once a business is no longer a small supplier, which happens when its taxable sales exceed $30,000 in a single calendar quarter or over four consecutive calendar quarters. Small suppliers may register voluntarily. A sole proprietor who also wants to operate under a business name registers that name separately in Ontario through a ",
          { text: "sole proprietorship registration", href: "/services/sole-proprietorship" },
          ". The BN is also different from a corporation number, as our guide on ",
          { text: "business number vs corporation number", href: "/guides/business-number-vs-corporation-number" },
          " explains.",
        ],
      },
    ],
    faqTitle: "CRA business numbers: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about CRA business number registration; for advice on your specific situation, consult an accountant or lawyer.",
    faq: [
      {
        q: "Does a sole proprietor need a business number?",
        a: "Not automatically. The CRA states that an unincorporated business needs a business number only when it registers for a program account, such as GST/HST or payroll. A sole proprietor with no employees whose taxable sales stay at or below the $30,000 small supplier threshold may not need one, although small suppliers can register for GST/HST voluntarily.",
      },
      {
        q: "My corporation was just incorporated. Does it already have a BN?",
        a: "Usually yes. A corporation incorporated federally or in Ontario and most other provinces receives a business number automatically at incorporation. What it may still need are program accounts, such as GST/HST or payroll, which are registered under that same business number.",
      },
      {
        q: "When do I have to register for GST/HST?",
        a: "Once you are no longer a small supplier. That happens when your taxable sales exceed $30,000 in a single calendar quarter, or over the last four consecutive calendar quarters. The CRA sets the effective date of registration according to which test you passed. Below the threshold, registration is voluntary.",
      },
      {
        q: "What is the difference between a business number and a program account?",
        a: "The business number is the nine-digit identifier for the business itself. A program account is a specific tax account attached to it, shown as the BN plus a two-letter code and a four-digit reference, such as 123456789 RT 0001 for GST/HST. One business number can have several program accounts.",
      },
      {
        q: "Who handles import/export accounts now?",
        a: "Since October 21, 2024, the import/export (RM) program account has been administered by the Canada Border Services Agency. The account is still identified with the business number, but the agency responsible for it is the CBSA rather than the CRA.",
      },
    ],
  },
  fr: {
    title: "Obtenez un numéro d'entreprise de l'ARC en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et soumet les inscriptions au numéro d'entreprise (NE) auprès de l'Agence du revenu du Canada, avec les comptes de programme que vous choisissez, comme la TPS/TVH, les retenues sur la paie et l'impôt des sociétés. Vous nous indiquez qui s'inscrit, de quels comptes vous avez besoin et à quelle date ils doivent prendre effet, et nous nous occupons de l'inscription et vous transmettons le résultat. Pour une explication complète du fonctionnement du NE, lisez notre guide sur ",
          { text: "comment obtenir un numéro d'entreprise de l'ARC", href: "/guides/comment-obtenir-un-numero-dentreprise-arc" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les propriétaires uniques et les particuliers qui ont besoin d'un premier compte de TPS/TVH ou de retenues sur la paie.",
          "Les sociétés de personnes qui ont besoin d'un numéro d'entreprise et de leurs premiers comptes de programme.",
          "Les sociétés par actions qui n'ont pas encore de numéro d'entreprise ou doivent s'inscrire à des comptes de programme.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous fournissez" },
      {
        type: "p",
        parts: [
          "Nous préparons l'inscription auprès de l'ARC pour le numéro d'entreprise et chaque compte de programme choisi. Vous fournissez le nom légal du particulier, de la société de personnes ou de la société par actions, le type d'entité, son adresse, la date de prise d'effet de l'inscription, votre revenu brut prévu (moins ou plus de 30 000 $ par année) et une personne-ressource. Vous confirmez les comptes de programme dont vous avez besoin et l'exactitude des renseignements, puisque l'ARC s'en sert pour ouvrir vos comptes et établir vos obligations de déclaration.",
        ],
      },
      { type: "h3", text: "Fonctionnement du numéro d'entreprise" },
      {
        type: "list",
        items: [
          "Le NE est un numéro à neuf chiffres que l'ARC utilise comme identifiant normalisé d'une entreprise ou d'une entité juridique.",
          "Chaque compte de programme ajoute au NE un identificateur de deux lettres et un numéro de référence de quatre chiffres, par exemple 123456789 RT 0001 pour un compte de TPS/TVH. RT désigne la TPS/TVH, RP les retenues sur la paie et RC l'impôt des sociétés.",
          "Une entreprise non constituée en société n'a besoin d'un NE que lorsqu'elle s'inscrit à un compte de programme, comme la TPS/TVH ou les retenues sur la paie.",
          "Une société constituée sous le régime fédéral ou en Ontario et dans la plupart des autres provinces reçoit automatiquement un NE au moment de sa constitution, sans inscription distincte auprès de l'ARC.",
          "Depuis le 21 octobre 2024, le compte de programme d'importations-exportations (RM) est administré par l'Agence des services frontaliers du Canada plutôt que par l'ARC.",
        ],
      },
      { type: "h3", text: "La TPS/TVH et le seuil de 30 000 $" },
      {
        type: "p",
        parts: [
          "L'inscription à la TPS/TVH est obligatoire dès qu'une entreprise n'est plus un petit fournisseur, ce qui arrive lorsque ses ventes taxables dépassent 30 000 $ au cours d'un seul trimestre civil ou de quatre trimestres civils consécutifs. Les petits fournisseurs peuvent s'inscrire volontairement. Un propriétaire unique qui veut aussi exercer sous un nom commercial enregistre ce nom séparément en Ontario au moyen d'un ",
          { text: "enregistrement d'entreprise individuelle", href: "/services/sole-proprietorship" },
          ". Le NE diffère aussi du numéro de société, comme l'explique notre guide ",
          { text: "numéro d'entreprise ou numéro de société", href: "/guides/numero-entreprise-ou-numero-societe" },
          ".",
        ],
      },
    ],
    faqTitle: "Numéros d'entreprise de l'ARC : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur l'inscription au numéro d'entreprise de l'ARC; pour des conseils adaptés à votre situation, consultez un comptable ou un avocat.",
    faq: [
      {
        q: "Un propriétaire unique a-t-il besoin d'un numéro d'entreprise?",
        a: "Pas automatiquement. Selon l'ARC, une entreprise non constituée en société n'a besoin d'un numéro d'entreprise que lorsqu'elle s'inscrit à un compte de programme, comme la TPS/TVH ou les retenues sur la paie. Un propriétaire unique sans employés dont les ventes taxables ne dépassent pas le seuil de 30 000 $ du petit fournisseur peut ne pas en avoir besoin, bien que les petits fournisseurs puissent s'inscrire volontairement à la TPS/TVH.",
      },
      {
        q: "Ma société vient d'être constituée. A-t-elle déjà un NE?",
        a: "Habituellement, oui. Une société constituée sous le régime fédéral ou en Ontario et dans la plupart des autres provinces reçoit automatiquement un numéro d'entreprise au moment de sa constitution. Elle peut toutefois avoir encore besoin de comptes de programme, comme la TPS/TVH ou les retenues sur la paie, qui s'inscrivent sous ce même numéro.",
      },
      {
        q: "Quand dois-je m'inscrire à la TPS/TVH?",
        a: "Dès que vous n'êtes plus un petit fournisseur, c'est-à-dire lorsque vos ventes taxables dépassent 30 000 $ au cours d'un seul trimestre civil ou des quatre derniers trimestres civils consécutifs. L'ARC fixe la date d'entrée en vigueur de l'inscription selon le critère dépassé. Sous le seuil, l'inscription est volontaire.",
      },
      {
        q: "Quelle est la différence entre un numéro d'entreprise et un compte de programme?",
        a: "Le numéro d'entreprise est l'identifiant à neuf chiffres de l'entreprise elle-même. Un compte de programme est un compte fiscal précis qui y est rattaché, présenté comme le NE suivi d'un code de deux lettres et d'une référence de quatre chiffres, par exemple 123456789 RT 0001 pour la TPS/TVH. Un même NE peut compter plusieurs comptes de programme.",
      },
      {
        q: "Qui gère maintenant les comptes d'importations-exportations?",
        a: "Depuis le 21 octobre 2024, le compte de programme d'importations-exportations (RM) est administré par l'Agence des services frontaliers du Canada. Le compte demeure rattaché au numéro d'entreprise, mais l'organisme responsable est l'ASFC plutôt que l'ARC.",
      },
    ],
  },
  es: {
    title: "Obtenga un número de negocio de la CRA en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta registros de número de negocio (BN) ante la Agencia de Ingresos de Canadá (CRA), junto con las cuentas de programa que usted elija, como las de GST/HST, nómina e impuesto sobre la renta de sociedades. Usted nos indica quién se registra, qué cuentas necesita y cuándo deben entrar en vigor, y nosotros nos encargamos del registro y le enviamos el resultado. Para una explicación completa de cómo funciona el BN, lea nuestra guía sobre ",
          { text: "cómo obtener un número de negocio de la CRA", href: "/guides/como-obtener-un-numero-de-negocio-cra" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Propietarios únicos y personas físicas que necesitan por primera vez una cuenta de GST/HST o de nómina.",
          "Sociedades de personas (partnerships) que necesitan un número de negocio y sus primeras cuentas de programa.",
          "Sociedades por acciones que aún no tienen número de negocio o necesitan inscribirse en cuentas de programa.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué proporciona usted" },
      {
        type: "p",
        parts: [
          "Preparamos el registro ante la CRA del número de negocio y de cada cuenta de programa que elija. Usted proporciona el nombre legal de la persona física, la sociedad de personas o la sociedad por acciones, el tipo de entidad, su dirección, la fecha en que el registro debe entrar en vigor, sus ingresos brutos previstos (menos o más de $30,000 al año) y una persona de contacto. Usted confirma qué cuentas de programa necesita y que la información es exacta, ya que la CRA la usa para abrir sus cuentas y fijar sus obligaciones de declaración.",
        ],
      },
      { type: "h3", text: "Cómo funciona el número de negocio" },
      {
        type: "list",
        items: [
          "El BN es un número de nueve dígitos que la CRA usa como identificador estándar de un negocio o entidad jurídica.",
          "Cada cuenta de programa agrega al BN un identificador de dos letras y un número de referencia de cuatro dígitos, por ejemplo 123456789 RT 0001 para una cuenta de GST/HST. RT es GST/HST, RP es retenciones de nómina y RC es impuesto sobre la renta de sociedades.",
          "Un negocio no constituido en sociedad necesita un BN solo cuando se inscribe en una cuenta de programa, como la de GST/HST o la de nómina.",
          "Una sociedad constituida a nivel federal o en Ontario y en la mayoría de las demás provincias recibe un BN automáticamente al constituirse, sin un registro aparte ante la CRA.",
          "Desde el 21 de octubre de 2024, la cuenta de programa de importación y exportación (RM) la administra la Agencia de Servicios Fronterizos de Canadá (CBSA) y no la CRA.",
        ],
      },
      { type: "h3", text: "El GST/HST y el umbral de $30,000" },
      {
        type: "p",
        parts: [
          "La inscripción en el GST/HST es obligatoria cuando un negocio deja de ser pequeño proveedor, lo que ocurre cuando sus ventas gravables superan $30,000 en un solo trimestre calendario o en cuatro trimestres calendario consecutivos. Los pequeños proveedores pueden inscribirse voluntariamente. Un propietario único que además quiere operar con un nombre comercial lo registra por separado en Ontario mediante un ",
          { text: "registro de empresa unipersonal", href: "/services/sole-proprietorship" },
          ". El BN también es distinto del número de sociedad, como explica nuestra guía ",
          { text: "número de negocio o número de sociedad", href: "/guides/numero-negocio-o-numero-sociedad" },
          ".",
        ],
      },
    ],
    faqTitle: "Números de negocio de la CRA: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre el registro del número de negocio ante la CRA; para asesoría sobre su situación particular, consulte a un contador o abogado.",
    faq: [
      {
        q: "¿Un propietario único necesita un número de negocio?",
        a: "No automáticamente. Según la CRA, un negocio no constituido en sociedad necesita un número de negocio solo cuando se inscribe en una cuenta de programa, como la de GST/HST o la de nómina. Un propietario único sin empleados cuyas ventas gravables no superan el umbral de pequeño proveedor de $30,000 puede no necesitarlo, aunque los pequeños proveedores pueden inscribirse voluntariamente en el GST/HST.",
      },
      {
        q: "Mi sociedad acaba de constituirse. ¿Ya tiene un BN?",
        a: "Por lo general, sí. Una sociedad constituida a nivel federal o en Ontario y en la mayoría de las demás provincias recibe un número de negocio automáticamente al constituirse. Lo que todavía puede necesitar son cuentas de programa, como la de GST/HST o la de nómina, que se registran bajo ese mismo número.",
      },
      {
        q: "¿Cuándo tengo que inscribirme en el GST/HST?",
        a: "Cuando deja de ser pequeño proveedor, es decir, cuando sus ventas gravables superan $30,000 en un solo trimestre calendario o en los últimos cuatro trimestres calendario consecutivos. La CRA fija la fecha de entrada en vigor del registro según el criterio que se haya superado. Por debajo del umbral, la inscripción es voluntaria.",
      },
      {
        q: "¿Qué diferencia hay entre un número de negocio y una cuenta de programa?",
        a: "El número de negocio es el identificador de nueve dígitos del propio negocio. Una cuenta de programa es una cuenta fiscal específica vinculada a él, que se muestra como el BN más un código de dos letras y una referencia de cuatro dígitos, por ejemplo 123456789 RT 0001 para el GST/HST. Un mismo BN puede tener varias cuentas de programa.",
      },
      {
        q: "¿Quién gestiona ahora las cuentas de importación y exportación?",
        a: "Desde el 21 de octubre de 2024, la cuenta de programa de importación y exportación (RM) la administra la Agencia de Servicios Fronterizos de Canadá (CBSA). La cuenta sigue identificándose con el número de negocio, pero el organismo responsable es la CBSA y no la CRA.",
      },
    ],
  },
};
