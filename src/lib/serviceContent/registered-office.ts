import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Registered Office address service order form.
// Service intent: "use a registered office address in Toronto / Burlington".
// Law: CBCA s.19 (office in the province named in the articles; Form 3 within
// 15 days; not a PO box per Corporations Canada), OBCA s.14 (office in Ontario;
// directors' resolution within a municipality, special resolution to another),
// records at the registered office or another designated place (CBCA s.20,
// OBCA s.140). Service terms from businessUpdateServices.ts / the order form.
export const content: ServiceContentByLocale = {
  en: {
    title: "Registered office address in Toronto or Burlington, Ontario",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex provides a registered office address in Downtown Toronto or in Burlington, Ontario, for Ontario (OBCA) corporations and for federal (CBCA) corporations whose articles name Ontario as the province of the registered office. The service runs for a 12-month term billed annually in advance, and it includes filing the change of registered office with the registry and a scanned copy of the mail received at the address, emailed to you every month.",
        ],
      },
      { type: "h3", text: "What a registered office is" },
      {
        type: "p",
        parts: [
          "Every corporation must have a registered office at all times. Corporations Canada describes it as the corporation's legal address and states that it cannot be a post office box. Under the CBCA, a federal corporation's registered office must be in the province specified in its articles; under the OBCA, an Ontario corporation's registered office must be in Ontario. The registered office address appears on the public corporate record. The corporation's records may be kept at the registered office or at another place the directors designate: in Canada for a federal corporation, in Ontario for an Ontario corporation. If you are incorporating, our guide to ",
          { text: "incorporating in Ontario", href: "/guides/incorporating-in-ontario" },
          " covers the other choices made at that stage.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Owners who run their business from home and prefer not to have their home address on the public corporate registry.",
          "Corporations without a fixed office in Ontario, such as online businesses or owners who travel.",
          "Federal corporations whose articles name Ontario as the province of the registered office.",
        ],
      },
      { type: "h3", text: "What we do and what you confirm" },
      {
        type: "list",
        items: [
          "You choose Toronto or Burlington. Korporex selects the specific street address; it is not disclosed in advance.",
          "We prepare the resolution for the move and file the change of registered office with Corporations Canada (Form 3) or the Ontario Business Registry (notice of change).",
          "Every month, we email you a scanned copy of the mail received at the address.",
          "You confirm the corporation's current registered office and, for a federal corporation, that its articles name Ontario. You also acknowledge that the annual fee is non-refundable, including if you move the registered office elsewhere before the term ends.",
        ],
      },
      { type: "h3", text: "Rules that apply to the move" },
      {
        type: "p",
        parts: [
          "A federal corporation's directors can change the registered office address within the province named in its articles; if the articles name another province, Articles of Amendment are needed first. Under the OBCA, the directors of an Ontario corporation can move the registered office within the same municipality or geographic township by resolution, while a move to another municipality in Ontario requires a special resolution of the shareholders. Both registries require the change to be reported within 15 days, and neither charges a government fee for it. To move the registered office to an address of your own instead, use our ",
          { text: "address change", href: "/services/change-address" },
          " service.",
        ],
      },
    ],
    faqTitle: "Registered office service: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about registered office requirements and the Korporex address service; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Can a corporation use the owner's home address as its registered office?",
        a: "Yes, if it meets the statutory requirements: for a federal corporation, an address in the province named in the articles that is not a post office box; for an Ontario corporation, an address in Ontario. The registered office address is shown on the public corporate record, which is why many home-based owners use a separate address.",
      },
      {
        q: "Can a federal corporation use a Korporex address?",
        a: "Only if its articles name Ontario as the province of the registered office, because the CBCA requires the registered office to be in the province specified in the articles. If the articles name another province, Articles of Amendment changing the province are needed before the registered office can move to Ontario.",
      },
      {
        q: "How is mail handled?",
        a: "Korporex emails you a scanned copy of the mail received at the address once a month. The address is the corporation's registered office on the public record, so official notices and correspondence sent to the corporation at that address are included in the monthly scans.",
      },
      {
        q: "Is the annual fee refundable if the corporation moves its office?",
        a: "No. The fee covers a 12-month term, is billed annually in advance and is non-refundable, including if the corporation moves its registered office elsewhere before the term ends. Moving to another address requires filing a new change of registered office within 15 days.",
      },
      {
        q: "Do the corporation's records have to be kept at the registered office?",
        a: "Not necessarily. The CBCA allows a federal corporation to keep its records at the registered office or at another place in Canada designated by the directors, and the OBCA allows an Ontario corporation to keep them at the registered office or at another place in Ontario designated by the directors.",
      },
    ],
  },
  fr: {
    title: "Adresse de siège social à Toronto ou à Burlington (Ontario)",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex fournit une adresse de siège social au centre-ville de Toronto ou à Burlington (Ontario) aux sociétés ontariennes (LSAO) et aux sociétés fédérales (LCSA) dont les statuts indiquent l'Ontario comme province du siège social. Le service couvre une période de 12 mois facturée annuellement à l'avance, et il comprend le dépôt du changement de siège social auprès du registre ainsi qu'une copie numérisée du courrier reçu à l'adresse, envoyée par courriel chaque mois.",
        ],
      },
      { type: "h3", text: "Qu'est-ce qu'un siège social" },
      {
        type: "p",
        parts: [
          "Toute société doit avoir un siège social en tout temps. Corporations Canada le décrit comme l'adresse légale de la société et précise qu'il ne peut pas s'agir d'une case postale. En vertu de la LCSA, le siège social d'une société fédérale doit se trouver dans la province indiquée dans ses statuts; en vertu de la LSAO, le siège social d'une société ontarienne doit se trouver en Ontario. L'adresse du siège social figure au registre public des sociétés. Les registres de la société peuvent être conservés au siège social ou à un autre endroit désigné par les administrateurs : au Canada pour une société fédérale, en Ontario pour une société ontarienne. Si vous êtes en voie de constitution, notre guide sur ",
          { text: "la constitution en société en Ontario", href: "/guides/se-constituer-en-societe-en-ontario" },
          " couvre les autres choix à faire à cette étape.",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les propriétaires qui exploitent leur entreprise à domicile et préfèrent que leur adresse personnelle ne figure pas au registre public des sociétés.",
          "Les sociétés sans bureau fixe en Ontario, comme les entreprises en ligne ou les propriétaires qui voyagent.",
          "Les sociétés fédérales dont les statuts indiquent l'Ontario comme province du siège social.",
        ],
      },
      { type: "h3", text: "Ce que nous faisons et ce que vous confirmez" },
      {
        type: "list",
        items: [
          "Vous choisissez Toronto ou Burlington. Korporex choisit l'adresse municipale précise; elle n'est pas communiquée à l'avance.",
          "Nous préparons la résolution relative au déménagement et déposons le changement de siège social auprès de Corporations Canada (formulaire 3) ou du Registre des entreprises de l'Ontario (avis de modification).",
          "Chaque mois, nous vous envoyons par courriel une copie numérisée du courrier reçu à l'adresse.",
          "Vous confirmez le siège social actuel de la société et, pour une société fédérale, que ses statuts indiquent l'Ontario. Vous reconnaissez aussi que les frais annuels ne sont pas remboursables, y compris si vous déplacez le siège social ailleurs avant la fin de la période.",
        ],
      },
      { type: "h3", text: "Règles applicables au déménagement" },
      {
        type: "p",
        parts: [
          "Les administrateurs d'une société fédérale peuvent changer l'adresse du siège social à l'intérieur de la province indiquée dans ses statuts; si les statuts indiquent une autre province, des statuts de modification sont d'abord nécessaires. En vertu de la LSAO, les administrateurs d'une société ontarienne peuvent déplacer le siège social dans la même municipalité ou le même canton géographique par résolution, alors qu'un déplacement vers une autre municipalité de l'Ontario exige une résolution spéciale des actionnaires. Les deux registres exigent que le changement soit déclaré dans les 15 jours, et aucun n'exige de droits gouvernementaux. Pour déplacer plutôt le siège social à votre propre adresse, utilisez notre service de ",
          { text: "changement d'adresse", href: "/services/change-address" },
          ".",
        ],
      },
    ],
    faqTitle: "Service de siège social : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur les exigences relatives au siège social et sur le service d'adresse de Korporex; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Une société peut-elle utiliser l'adresse du domicile de son propriétaire comme siège social?",
        a: "Oui, si elle respecte les exigences de la loi : pour une société fédérale, une adresse dans la province indiquée dans les statuts qui n'est pas une case postale; pour une société ontarienne, une adresse en Ontario. L'adresse du siège social figure au registre public des sociétés, c'est pourquoi de nombreux propriétaires travaillant à domicile utilisent une adresse distincte.",
      },
      {
        q: "Une société fédérale peut-elle utiliser une adresse Korporex?",
        a: "Seulement si ses statuts indiquent l'Ontario comme province du siège social, puisque la LCSA exige que le siège social se trouve dans la province indiquée dans les statuts. Si les statuts indiquent une autre province, des statuts de modification changeant la province sont nécessaires avant que le siège social puisse être déplacé en Ontario.",
      },
      {
        q: "Comment le courrier est-il traité?",
        a: "Korporex vous envoie par courriel, une fois par mois, une copie numérisée du courrier reçu à l'adresse. Cette adresse est le siège social de la société au registre public; les avis officiels et la correspondance envoyés à la société à cette adresse sont donc inclus dans les numérisations mensuelles.",
      },
      {
        q: "Les frais annuels sont-ils remboursables si la société déménage?",
        a: "Non. Les frais couvrent une période de 12 mois, sont facturés annuellement à l'avance et ne sont pas remboursables, y compris si la société déplace son siège social ailleurs avant la fin de la période. Un déménagement vers une autre adresse exige le dépôt d'un nouveau changement de siège social dans les 15 jours.",
      },
      {
        q: "Les registres de la société doivent-ils être conservés au siège social?",
        a: "Pas nécessairement. La LCSA permet à une société fédérale de conserver ses registres au siège social ou à un autre endroit au Canada désigné par les administrateurs, et la LSAO permet à une société ontarienne de les conserver au siège social ou à un autre endroit en Ontario désigné par les administrateurs.",
      },
    ],
  },
  es: {
    title: "Domicilio social en Toronto o Burlington, Ontario",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex ofrece una dirección de domicilio social en el centro de Toronto o en Burlington, Ontario, para sociedades de Ontario (OBCA) y para sociedades federales (CBCA) cuyos estatutos indican Ontario como provincia del domicilio social. El servicio cubre un plazo de 12 meses facturado anualmente por adelantado, e incluye la presentación del cambio de domicilio social ante el registro y una copia escaneada del correo recibido en la dirección, enviada por correo electrónico cada mes.",
        ],
      },
      { type: "h3", text: "Qué es un domicilio social" },
      {
        type: "p",
        parts: [
          "Toda sociedad debe tener un domicilio social en todo momento. Corporations Canada lo describe como la dirección legal de la sociedad e indica que no puede ser un apartado postal. Según la CBCA, el domicilio social de una sociedad federal debe estar en la provincia indicada en sus estatutos; según la OBCA, el domicilio social de una sociedad de Ontario debe estar en Ontario. La dirección del domicilio social figura en el registro público de sociedades. Los registros de la sociedad pueden conservarse en el domicilio social o en otro lugar que designen los directores: en Canadá para una sociedad federal, en Ontario para una sociedad de Ontario. Si está constituyendo su sociedad, nuestra guía sobre ",
          { text: "constituirse en sociedad en Ontario", href: "/guides/constituirse-en-sociedad-en-ontario" },
          " cubre las demás decisiones de esa etapa.",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Propietarios que trabajan desde casa y prefieren que su dirección particular no figure en el registro público de sociedades.",
          "Sociedades sin oficina fija en Ontario, como negocios en línea o propietarios que viajan.",
          "Sociedades federales cuyos estatutos indican Ontario como provincia del domicilio social.",
        ],
      },
      { type: "h3", text: "Qué hacemos y qué confirma usted" },
      {
        type: "list",
        items: [
          "Usted elige Toronto o Burlington. Korporex selecciona la dirección exacta; no se revela por adelantado.",
          "Preparamos la resolución para el traslado y presentamos el cambio de domicilio social ante Corporations Canada (Formulario 3) o el Registro de Empresas de Ontario (aviso de cambio).",
          "Cada mes le enviamos por correo electrónico una copia escaneada del correo recibido en la dirección.",
          "Usted confirma el domicilio social actual de la sociedad y, para una sociedad federal, que sus estatutos indican Ontario. También acepta que la tarifa anual no es reembolsable, incluso si traslada el domicilio social a otro lugar antes de que termine el plazo.",
        ],
      },
      { type: "h3", text: "Reglas que se aplican al traslado" },
      {
        type: "p",
        parts: [
          "Los directores de una sociedad federal pueden cambiar el domicilio social dentro de la provincia indicada en sus estatutos; si los estatutos indican otra provincia, primero se necesitan estatutos de modificación. Según la OBCA, los directores de una sociedad de Ontario pueden trasladar el domicilio social dentro del mismo municipio o municipio geográfico mediante una resolución, mientras que un traslado a otro municipio de Ontario requiere una resolución especial de los accionistas. Ambos registros exigen informar el cambio dentro de 15 días, y ninguno cobra una tarifa gubernamental. Para trasladar el domicilio social a una dirección propia, use nuestro servicio de ",
          { text: "cambio de domicilio", href: "/services/change-address" },
          ".",
        ],
      },
    ],
    faqTitle: "Servicio de domicilio social: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre los requisitos del domicilio social y el servicio de dirección de Korporex; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Puede una sociedad usar la dirección particular del propietario como domicilio social?",
        a: "Sí, si cumple los requisitos de la ley: para una sociedad federal, una dirección en la provincia indicada en los estatutos que no sea un apartado postal; para una sociedad de Ontario, una dirección en Ontario. La dirección del domicilio social figura en el registro público de sociedades, por lo que muchos propietarios que trabajan desde casa usan una dirección distinta.",
      },
      {
        q: "¿Puede una sociedad federal usar una dirección de Korporex?",
        a: "Solo si sus estatutos indican Ontario como provincia del domicilio social, porque la CBCA exige que el domicilio social esté en la provincia indicada en los estatutos. Si los estatutos indican otra provincia, se necesitan estatutos de modificación que cambien la provincia antes de trasladar el domicilio social a Ontario.",
      },
      {
        q: "¿Cómo se maneja el correo?",
        a: "Korporex le envía por correo electrónico, una vez al mes, una copia escaneada del correo recibido en la dirección. Esa dirección es el domicilio social de la sociedad en el registro público, por lo que los avisos oficiales y la correspondencia enviados a la sociedad a esa dirección se incluyen en los escaneos mensuales.",
      },
      {
        q: "¿La tarifa anual es reembolsable si la sociedad se muda?",
        a: "No. La tarifa cubre un plazo de 12 meses, se factura anualmente por adelantado y no es reembolsable, incluso si la sociedad traslada su domicilio social a otro lugar antes de que termine el plazo. Mudarse a otra dirección requiere presentar un nuevo cambio de domicilio social dentro de 15 días.",
      },
      {
        q: "¿Los registros de la sociedad deben conservarse en el domicilio social?",
        a: "No necesariamente. La CBCA permite a una sociedad federal conservar sus registros en el domicilio social o en otro lugar de Canadá que designen los directores, y la OBCA permite a una sociedad de Ontario conservarlos en el domicilio social o en otro lugar de Ontario que designen los directores.",
      },
    ],
  },
};
