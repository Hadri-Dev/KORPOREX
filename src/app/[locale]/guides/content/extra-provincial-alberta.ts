import type { Article, ArticleInline, ArticleSection } from "../articles";

// Extra-provincial registration in Alberta guide (en/fr/es). Targets
// "alberta extra provincial registration" / "extra provincial registration
// alberta" (~350/mo combined, CA) and feeds /services/extra-provincial.
// Facts checked 2026-10-24 against the Business Corporations Act (RSA 2000
// c B-9) Part 21: ss. 277(1) (carrying on business), 279(1) (register before
// or within 30 days), 280 (statement, charter, agent appointment), 282-283
// (names, assumed name), 285 (cancellation after one year in default, 120
// days' notice), 288 (agent for service, public office), 289 (changes within
// one month), 292(1) (annual return), 294-296 (acts valid, no contract
// actions while unregistered, $5,000 fine); the alberta.ca page "Register an
// out-of-province corporation" (NUANS exemptions, documents, NWPTA online
// registration at no cost); and the Registry Agent Product Catalogue
// effective October 1, 2026 ($291.75 registration, $53.05 annual return,
// $0 NWPTA). Re-check the catalogue when fees change.

// Paragraph with inline links; the plain `text` is derived from the parts.
function p(...parts: ArticleInline[]): ArticleSection {
  return {
    type: "paragraph",
    text: parts.map((x) => (typeof x === "string" ? x : x.text)).join(""),
    parts,
  };
}

const PUBLISHED_AT = "2026-10-24T10:00:00-04:00";
const UPDATED = "2026-10-24";

const en: Article = {
  slug: "extra-provincial-registration-alberta",
  locale: "en",
  group: "extra-provincial-alberta",
  category: "Compliance & Maintenance",
  title: "Alberta Extra-Provincial Registration: How It Works",
  excerpt:
    "A corporation incorporated outside Alberta must register in Alberta before or within 30 days after it starts carrying on business there. Here is who has to register, what it costs, the documents involved and the filings that follow.",
  metaTitle: "Alberta Extra-Provincial Registration | Korporex",
  metaDescription:
    "Alberta extra-provincial registration: the 30-day deadline, the $291.75 government fee, NUANS and agent for service rules, required documents and annual returns.",
  readTime: "7 min read",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Alberta extra-provincial registration applies to any corporation incorporated outside Alberta that carries on business in the province, whether it was incorporated in Ontario, under federal law or in another country. Alberta's Business Corporations Act requires the corporation to register before it starts carrying on business in Alberta or within 30 days after. The corporation stays incorporated where it is. Registration adds it to Alberta's Corporate Registry so it can operate there.",
    },
    { type: "heading", id: "carrying-on-business", text: "When a corporation carries on business in Alberta" },
    {
      type: "paragraph",
      text: "Section 277(1) of the Act lists the situations in which an extra-provincial corporation carries on business in Alberta. They include when:",
    },
    {
      type: "list",
      items: [
        "its name, or a name it does business under, is listed in an Alberta telephone directory or appears in an advertisement giving an Alberta address;",
        "it has a resident agent or representative, or a warehouse, office or place of business in Alberta;",
        "it solicits business in Alberta;",
        "it owns any estate or interest in land in Alberta;",
        "it is licensed or registered, or required to be, under an Alberta law that entitles it to do business; or",
        "it otherwise carries on business in Alberta.",
      ],
    },
    {
      type: "paragraph",
      text: "The list is broader than Ontario's. Soliciting customers in Alberta or advertising with an Alberta address is enough on its own, even without an office in the province. The Act also has specific rules for commercial vehicle operators.",
    },
    { type: "heading", id: "deadline-and-cost", text: "Deadline and government fees" },
    {
      type: "paragraph",
      text: "Section 279(1) requires registration before, or within 30 days after, the corporation begins carrying on business in Alberta. The government fee depends on the corporation's home jurisdiction.",
    },
    {
      type: "table",
      head: ["Home jurisdiction", "How it registers", "Government fee"],
      rows: [
        ["British Columbia, Manitoba or Saskatchewan", "Alberta's online extra-provincial registration", "$0"],
        ["Ontario, federal (CBCA), other provinces and territories, outside Canada", "Through a registry agent or authorized service provider", "$291.75"],
      ],
    },
    {
      type: "paragraph",
      text: "The fees above are from Alberta's Registry Agent Product Catalogue effective October 1, 2026. Registry agents and service providers add their own service charge on top of the government fee, and that charge is set by each provider.",
    },
    { type: "heading", id: "nuans", text: "Step 1: an Alberta NUANS report" },
    p(
      "Most corporations registering in Alberta need an Alberta NUANS report on their existing name, less than 91 days old when the registration is filed. Alberta does not require one for a federal (CBCA) corporation or for a corporation with a number name assigned by its home jurisdiction. If the name is too similar to a name already in use in Alberta, the corporation can register and carry on business under an assumed name approved by the Registrar, which needs its own NUANS report. Our guide to the ",
      { text: "Alberta NUANS report", href: "/guides/nuans-report-alberta" },
      " explains when a report is needed and how to read it."
    ),
    { type: "heading", id: "agent-for-service", text: "Step 2: an agent for service in Alberta" },
    {
      type: "paragraph",
      text: "Every extra-provincial corporation registered in Alberta keeps an agent for service: an individual located in Alberta who can accept notices and legal documents on the corporation's behalf. The agent does not need to be a lawyer, but must consent to the appointment. Section 288 requires the agent's address to be an office that is accessible to the public during normal business hours and readily identifiable from the address on file. A corporation can also appoint an alternative agent for service, who must be an Alberta resident.",
    },
    {
      type: "paragraph",
      text: "If the agent dies, resigns or is replaced, the corporation must file a new appointment right away. An agent who intends to resign gives the corporation at least 60 days' notice.",
    },
    { type: "heading", id: "documents", text: "Step 3: documents and forms" },
    {
      type: "paragraph",
      text: "The registration package filed with a registry agent or service provider includes:",
    },
    {
      type: "list",
      items: [
        "A Statement of Registration.",
        "A Notice of Agent for Service for Alberta or Extra-provincial Corporation.",
        "A Notice of Assumed Name, if the corporation will use one.",
        "A copy of the corporation's charter documents, such as its articles or certificate of incorporation and all amendments, certified by a company official or a notary public.",
        "Proof of the corporation's current status in its home jurisdiction, usually a document issued by that jurisdiction's corporate registry.",
        "The Alberta NUANS report, unless an exemption applies.",
        "A notarized English translation, for a charter from outside Canada that is not in English.",
      ],
    },
    {
      type: "paragraph",
      text: "If everything meets the requirements, the service provider enters the registration into the Corporate Registry and issues a certificate of registration. Under section 284(2), that certificate is conclusive proof that the corporation is registered as of the date it shows.",
    },
    { type: "heading", id: "after-registering", text: "Filings after registration" },
    {
      type: "list",
      items: [
        "An Alberta annual return each year, on or before the last day of the month after the corporation's anniversary month (section 292). The government fee is $53.05.",
        "Within one month, a copy of any amendment to the corporation's charter and a notice of any change to its head office address or its board of directors (section 289). A change that takes effect in the anniversary month or the month after can be reported on the annual return instead.",
        "Within one month, a copy of any amalgamation of the corporation with other extra-provincial corporations (section 290).",
        "A notice to the Registrar if the corporation stops carrying on business in Alberta (section 285(4)).",
      ],
    },
    {
      type: "paragraph",
      text: "Section 287 also requires the corporation's name to appear legibly on its contracts, invoices, negotiable instruments and orders issued in the course of its Alberta business.",
    },
    { type: "heading", id: "if-not-registered", text: "If the corporation does not register" },
    {
      type: "paragraph",
      text: "Section 295 says an unregistered extra-provincial corporation cannot start or maintain a lawsuit in an Alberta court about a contract made in Alberta while it was unregistered. Registering later cures this: a lawsuit started before registration can continue once the corporation is registered. The corporation's acts and property transfers are not invalid only because it was unregistered (section 294). Contravening Part 21 of the Act is an offence with a fine of up to $5,000 (section 296).",
    },
    {
      type: "paragraph",
      text: "Once registered, a corporation that falls a year behind on its required filings or fees can have its registration cancelled by the Registrar, after at least 120 days' notice (section 285).",
    },
    { type: "heading", id: "getting-it-done", text: "Getting it done" },
    p(
      "Korporex can prepare and file an ",
      { text: "extra-provincial registration", href: "/services/extra-provincial" },
      " in Alberta or another province from the information you provide, and order the ",
      { text: "NUANS report", href: "/nuans" },
      " it needs. If the corporation also operates in Ontario, see how ",
      { text: "extra-provincial registration in Ontario", href: "/guides/extra-provincial-registration-ontario" },
      " works, since the rules are quite different."
    ),
    {
      type: "paragraph",
      text: "Korporex is not a law firm and this guide is general information, not legal advice. For questions about your corporation's specific situation, including whether it carries on business in Alberta, consult a lawyer or accountant.",
    },
  ],
  faq: [
    {
      q: "How much does extra-provincial registration cost in Alberta?",
      a: "As of October 1, 2026, the government fee is $291.75, plus the service charge of the registry agent or service provider. Corporations from British Columbia, Manitoba and Saskatchewan register online at no cost.",
    },
    {
      q: "What is the deadline to register an extra-provincial corporation in Alberta?",
      a: "Section 279(1) of Alberta's Business Corporations Act requires registration before, or within 30 days after, the corporation begins carrying on business in Alberta.",
    },
    {
      q: "Does a federal corporation need to register in Alberta?",
      a: "Yes, if it carries on business in Alberta. A federal (CBCA) corporation registers as an extra-provincial corporation, but Alberta does not require it to provide a NUANS report.",
    },
    {
      q: "Who can be an agent for service in Alberta?",
      a: "An individual located in Alberta who consents to the appointment. The agent does not need to be a lawyer, and the agent's address must be an office open to the public during normal business hours.",
    },
    {
      q: "Do extra-provincial corporations file annual returns in Alberta?",
      a: "Yes. Section 292 requires a registered extra-provincial corporation to file an Alberta annual return each year, on or before the last day of the month after its anniversary month. The government fee is $53.05.",
    },
  ],
};

const fr: Article = {
  slug: "enregistrement-extraprovincial-alberta",
  locale: "fr",
  group: "extra-provincial-alberta",
  category: "Compliance & Maintenance",
  title: "Enregistrement extraprovincial en Alberta : comment ça fonctionne",
  excerpt:
    "Une société constituée hors de l'Alberta doit s'y enregistrer avant de commencer à y exercer ses activités ou dans les 30 jours suivants. Voici qui doit s'enregistrer, ce que cela coûte, les documents requis et les dépôts qui suivent.",
  metaTitle: "Enregistrement extraprovincial en Alberta | Korporex",
  metaDescription:
    "Enregistrement extraprovincial en Alberta : délai de 30 jours, droits de 291,75 $, règles sur le NUANS et le mandataire aux fins de signification, documents et rapports annuels.",
  readTime: "7 min de lecture",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "L'enregistrement extraprovincial en Alberta vise toute société constituée hors de l'Alberta qui exerce ses activités dans la province, qu'elle ait été constituée en Ontario, sous le régime fédéral ou dans un autre pays. La Business Corporations Act de l'Alberta exige que la société s'enregistre avant de commencer à exercer ses activités en Alberta ou dans les 30 jours suivants. La société demeure constituée là où elle l'est. L'enregistrement l'inscrit au registre des sociétés de l'Alberta pour qu'elle puisse y exercer ses activités.",
    },
    { type: "heading", id: "carrying-on-business", text: "Quand une société exerce ses activités en Alberta" },
    {
      type: "paragraph",
      text: "Le paragraphe 277(1) de la Loi énumère les situations où une société extraprovinciale exerce ses activités en Alberta, notamment lorsque :",
    },
    {
      type: "list",
      items: [
        "son nom, ou un nom sous lequel elle exerce ses activités, figure dans un annuaire téléphonique de l'Alberta ou dans une annonce indiquant une adresse en Alberta;",
        "elle a en Alberta un mandataire ou représentant résident, ou un entrepôt, un bureau ou un établissement;",
        "elle sollicite des clients en Alberta;",
        "elle détient un droit ou un intérêt foncier en Alberta;",
        "elle est titulaire d'un permis ou d'un enregistrement, ou tenue de l'être, en vertu d'une loi albertaine qui l'autorise à exercer ses activités;",
        "elle exerce par ailleurs ses activités en Alberta.",
      ],
    },
    {
      type: "paragraph",
      text: "Cette liste est plus large que celle de l'Ontario. Solliciter des clients en Alberta ou annoncer une adresse albertaine suffit, même sans bureau dans la province. La Loi prévoit aussi des règles particulières pour les exploitants de véhicules commerciaux.",
    },
    { type: "heading", id: "deadline-and-cost", text: "Délai et droits gouvernementaux" },
    {
      type: "paragraph",
      text: "Le paragraphe 279(1) exige l'enregistrement avant le début des activités en Alberta ou dans les 30 jours suivants. Les droits gouvernementaux dépendent du territoire d'origine de la société.",
    },
    {
      type: "table",
      head: ["Territoire d'origine", "Mode d'enregistrement", "Droits gouvernementaux"],
      rows: [
        ["Colombie-Britannique, Manitoba ou Saskatchewan", "Enregistrement extraprovincial en ligne de l'Alberta", "0 $"],
        ["Ontario, sociétés fédérales (LCSA), autres provinces et territoires, hors du Canada", "Par un agent d'enregistrement (registry agent) ou un fournisseur de services autorisé", "291,75 $"],
      ],
    },
    {
      type: "paragraph",
      text: "Ces droits proviennent du catalogue des produits des agents d'enregistrement de l'Alberta en vigueur le 1er octobre 2026. Les agents et fournisseurs de services ajoutent leurs propres frais de service, fixés par chacun d'eux.",
    },
    { type: "heading", id: "nuans", text: "Étape 1 : un rapport NUANS albertain" },
    p(
      "La plupart des sociétés qui s'enregistrent en Alberta ont besoin d'un rapport NUANS albertain sur leur nom actuel, datant de moins de 91 jours au moment du dépôt. L'Alberta n'en exige pas pour une société fédérale (LCSA) ni pour une société portant un nom numérique attribué par son territoire d'origine. Si le nom est trop semblable à un nom déjà utilisé en Alberta, la société peut s'enregistrer et exercer ses activités sous un nom d'emprunt approuvé par le registraire, qui exige son propre rapport NUANS. Notre guide sur le ",
      { text: "rapport NUANS en Alberta", href: "/guides/rapport-nuans-alberta" },
      " explique quand il est exigé et comment le lire."
    ),
    { type: "heading", id: "agent-for-service", text: "Étape 2 : un mandataire aux fins de signification en Alberta" },
    {
      type: "paragraph",
      text: "Toute société extraprovinciale enregistrée en Alberta maintient un mandataire aux fins de signification : un particulier situé en Alberta qui peut recevoir les avis et documents juridiques au nom de la société. Le mandataire n'a pas besoin d'être avocat, mais doit consentir à sa nomination. L'article 288 exige que son adresse soit un bureau accessible au public pendant les heures normales d'ouverture et facilement repérable à partir de l'adresse déposée. La société peut aussi nommer un mandataire suppléant, qui doit résider en Alberta.",
    },
    {
      type: "paragraph",
      text: "Si le mandataire décède, démissionne ou est remplacé, la société doit déposer immédiatement une nouvelle nomination. Un mandataire qui entend démissionner donne à la société un préavis d'au moins 60 jours.",
    },
    { type: "heading", id: "documents", text: "Étape 3 : documents et formulaires" },
    {
      type: "paragraph",
      text: "Le dossier d'enregistrement déposé auprès d'un agent d'enregistrement ou d'un fournisseur de services comprend :",
    },
    {
      type: "list",
      items: [
        "Une déclaration d'enregistrement (Statement of Registration).",
        "Un avis de nomination du mandataire aux fins de signification (Notice of Agent for Service for Alberta or Extra-provincial Corporation).",
        "Un avis de nom d'emprunt (Notice of Assumed Name), si la société en utilise un.",
        "Une copie des documents constitutifs de la société, comme ses statuts ou son certificat de constitution et toutes leurs modifications, certifiée par un dirigeant de la société ou un notaire.",
        "Une preuve du statut actuel de la société dans son territoire d'origine, généralement un document délivré par le registre des sociétés de ce territoire.",
        "Le rapport NUANS albertain, sauf exemption.",
        "Une traduction anglaise notariée, pour des documents constitutifs étrangers qui ne sont pas rédigés en anglais.",
      ],
    },
    {
      type: "paragraph",
      text: "Si tout est conforme, le fournisseur de services inscrit l'enregistrement au registre des sociétés et délivre un certificat d'enregistrement. Selon le paragraphe 284(2), ce certificat constitue une preuve concluante que la société est enregistrée à la date qui y figure.",
    },
    { type: "heading", id: "after-registering", text: "Les dépôts après l'enregistrement" },
    {
      type: "list",
      items: [
        "Un rapport annuel albertain chaque année, au plus tard le dernier jour du mois qui suit le mois anniversaire de la société (article 292). Les droits gouvernementaux sont de 53,05 $.",
        "Dans un délai d'un mois, une copie de toute modification des documents constitutifs et un avis de tout changement de l'adresse du siège social ou du conseil d'administration (article 289). Un changement qui prend effet pendant le mois anniversaire ou le mois suivant peut plutôt être déclaré dans le rapport annuel.",
        "Dans un délai d'un mois, une copie de toute fusion de la société avec d'autres sociétés extraprovinciales (article 290).",
        "Un avis au registraire si la société cesse d'exercer ses activités en Alberta (paragraphe 285(4)).",
      ],
    },
    {
      type: "paragraph",
      text: "L'article 287 exige aussi que le nom de la société figure lisiblement sur ses contrats, factures, effets de commerce et commandes émis dans le cadre de ses activités en Alberta.",
    },
    { type: "heading", id: "if-not-registered", text: "Si la société ne s'enregistre pas" },
    {
      type: "paragraph",
      text: "Selon l'article 295, une société extraprovinciale non enregistrée ne peut intenter ni poursuivre une action devant un tribunal albertain relativement à un contrat conclu en Alberta pendant qu'elle n'était pas enregistrée. L'enregistrement ultérieur corrige la situation : une action intentée avant l'enregistrement peut se poursuivre une fois la société enregistrée. Les actes et transferts de biens de la société ne sont pas invalides du seul fait qu'elle n'était pas enregistrée (article 294). Toute contravention à la partie 21 de la Loi constitue une infraction passible d'une amende maximale de 5 000 $ (article 296).",
    },
    {
      type: "paragraph",
      text: "Une fois enregistrée, une société qui accuse un an de retard dans ses dépôts ou droits exigés peut voir son enregistrement annulé par le registraire, après un préavis d'au moins 120 jours (article 285).",
    },
    { type: "heading", id: "getting-it-done", text: "Passer à l'action" },
    p(
      "Korporex peut préparer et déposer un ",
      { text: "enregistrement extraprovincial", href: "/services/extra-provincial" },
      " en Alberta ou dans une autre province à partir des renseignements que vous fournissez, et commander le ",
      { text: "rapport NUANS", href: "/nuans" },
      " nécessaire. Si la société exerce aussi ses activités en Ontario, voyez comment fonctionne l'",
      { text: "enregistrement extraprovincial en Ontario", href: "/guides/enregistrement-extraprovincial-ontario" },
      ", car les règles y sont très différentes."
    ),
    {
      type: "paragraph",
      text: "Korporex n'est pas un cabinet d'avocats et ce guide présente de l'information générale, et non des conseils juridiques. Pour toute question sur la situation particulière de votre société, notamment pour savoir si elle exerce ses activités en Alberta, consultez un avocat ou un comptable.",
    },
  ],
  faq: [
    {
      q: "Combien coûte l'enregistrement extraprovincial en Alberta?",
      a: "Au 1er octobre 2026, les droits gouvernementaux sont de 291,75 $, plus les frais de service de l'agent d'enregistrement ou du fournisseur de services. Les sociétés de la Colombie-Britannique, du Manitoba et de la Saskatchewan s'enregistrent en ligne sans frais.",
    },
    {
      q: "Quel est le délai pour enregistrer une société extraprovinciale en Alberta?",
      a: "Le paragraphe 279(1) de la Business Corporations Act de l'Alberta exige l'enregistrement avant le début des activités de la société en Alberta ou dans les 30 jours suivants.",
    },
    {
      q: "Une société fédérale doit-elle s'enregistrer en Alberta?",
      a: "Oui, si elle exerce ses activités en Alberta. Une société fédérale (LCSA) s'enregistre comme société extraprovinciale, mais l'Alberta n'exige pas qu'elle fournisse un rapport NUANS.",
    },
    {
      q: "Qui peut être mandataire aux fins de signification en Alberta?",
      a: "Un particulier situé en Alberta qui consent à sa nomination. Il n'a pas besoin d'être avocat, et son adresse doit être un bureau ouvert au public pendant les heures normales d'ouverture.",
    },
    {
      q: "Les sociétés extraprovinciales déposent-elles un rapport annuel en Alberta?",
      a: "Oui. L'article 292 exige qu'une société extraprovinciale enregistrée dépose chaque année un rapport annuel albertain, au plus tard le dernier jour du mois qui suit son mois anniversaire. Les droits gouvernementaux sont de 53,05 $.",
    },
  ],
};

const es: Article = {
  slug: "registro-extraprovincial-alberta",
  locale: "es",
  group: "extra-provincial-alberta",
  category: "Compliance & Maintenance",
  title: "Registro extraprovincial en Alberta: cómo funciona",
  excerpt:
    "Una sociedad constituida fuera de Alberta debe registrarse allí antes de comenzar a operar en la provincia o dentro de los 30 días siguientes. Quién debe registrarse, cuánto cuesta, qué documentos se necesitan y qué presentaciones vienen después.",
  metaTitle: "Registro extraprovincial en Alberta | Korporex",
  metaDescription:
    "Registro extraprovincial en Alberta: plazo de 30 días, tasa de $291.75, reglas sobre el informe NUANS y el agente para notificaciones, documentos y declaraciones anuales.",
  readTime: "7 min de lectura",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "El registro extraprovincial en Alberta se aplica a toda sociedad constituida fuera de Alberta que realiza actividades comerciales en la provincia, ya sea que se haya constituido en Ontario, conforme a la ley federal o en otro país. La Business Corporations Act de Alberta exige que la sociedad se registre antes de comenzar a operar en Alberta o dentro de los 30 días siguientes. La sociedad sigue constituida donde está. El registro la incorpora al registro de sociedades de Alberta para que pueda operar allí.",
    },
    { type: "heading", id: "carrying-on-business", text: "Cuándo una sociedad realiza actividades comerciales en Alberta" },
    {
      type: "paragraph",
      text: "El artículo 277(1) de la Ley enumera las situaciones en las que una sociedad extraprovincial realiza actividades en Alberta, entre ellas cuando:",
    },
    {
      type: "list",
      items: [
        "su nombre, o un nombre con el que opera, aparece en una guía telefónica de Alberta o en un anuncio que indica una dirección en Alberta;",
        "tiene en Alberta un agente o representante residente, o un almacén, oficina o establecimiento;",
        "solicita clientes en Alberta;",
        "es titular de un derecho o interés sobre un terreno en Alberta;",
        "tiene una licencia o registro, o está obligada a tenerlo, conforme a una ley de Alberta que la habilita para operar; o",
        "realiza actividades en Alberta de cualquier otra forma.",
      ],
    },
    {
      type: "paragraph",
      text: "Esta lista es más amplia que la de Ontario. Solicitar clientes en Alberta o anunciarse con una dirección de Alberta basta por sí solo, aunque no haya una oficina en la provincia. La Ley también tiene reglas específicas para los operadores de vehículos comerciales.",
    },
    { type: "heading", id: "deadline-and-cost", text: "Plazo y tasas gubernamentales" },
    {
      type: "paragraph",
      text: "El artículo 279(1) exige el registro antes de que la sociedad comience a operar en Alberta o dentro de los 30 días siguientes. La tasa gubernamental depende de la jurisdicción de origen de la sociedad.",
    },
    {
      type: "table",
      head: ["Jurisdicción de origen", "Cómo se registra", "Tasa gubernamental"],
      rows: [
        ["Columbia Británica, Manitoba o Saskatchewan", "Registro extraprovincial en línea de Alberta", "$0"],
        ["Ontario, sociedades federales (CBCA), otras provincias y territorios, fuera de Canadá", "A través de un agente de registro (registry agent) o un proveedor de servicios autorizado", "$291.75"],
      ],
    },
    {
      type: "paragraph",
      text: "Estas tasas provienen del catálogo de productos de los agentes de registro de Alberta vigente desde el 1 de octubre de 2026. Los agentes y proveedores de servicios cobran además su propio cargo por servicio, que fija cada uno.",
    },
    { type: "heading", id: "nuans", text: "Paso 1: un informe NUANS de Alberta" },
    p(
      "La mayoría de las sociedades que se registran en Alberta necesitan un informe NUANS de Alberta sobre su nombre actual, con menos de 91 días de antigüedad al presentar el registro. Alberta no lo exige a una sociedad federal (CBCA) ni a una sociedad con un nombre numérico asignado por su jurisdicción de origen. Si el nombre se parece demasiado a uno ya usado en Alberta, la sociedad puede registrarse y operar con un nombre asumido aprobado por el registrador, que requiere su propio informe NUANS. Nuestra guía sobre el ",
      { text: "informe NUANS de Alberta", href: "/guides/informe-nuans-alberta" },
      " explica cuándo se necesita y cómo leerlo."
    ),
    { type: "heading", id: "agent-for-service", text: "Paso 2: un agente para notificaciones en Alberta" },
    {
      type: "paragraph",
      text: "Toda sociedad extraprovincial registrada en Alberta mantiene un agente para notificaciones: una persona ubicada en Alberta que puede recibir avisos y documentos legales en nombre de la sociedad. El agente no necesita ser abogado, pero debe consentir su nombramiento. El artículo 288 exige que su dirección sea una oficina accesible al público en horario comercial normal y fácil de identificar a partir de la dirección registrada. La sociedad también puede nombrar un agente suplente, que debe residir en Alberta.",
    },
    {
      type: "paragraph",
      text: "Si el agente fallece, renuncia o es sustituido, la sociedad debe presentar de inmediato un nuevo nombramiento. Un agente que piensa renunciar debe avisar a la sociedad con al menos 60 días de antelación.",
    },
    { type: "heading", id: "documents", text: "Paso 3: documentos y formularios" },
    {
      type: "paragraph",
      text: "El expediente de registro que se presenta ante un agente de registro o proveedor de servicios incluye:",
    },
    {
      type: "list",
      items: [
        "Una declaración de registro (Statement of Registration).",
        "Un aviso de nombramiento del agente para notificaciones (Notice of Agent for Service for Alberta or Extra-provincial Corporation).",
        "Un aviso de nombre asumido (Notice of Assumed Name), si la sociedad va a usar uno.",
        "Una copia de los documentos constitutivos de la sociedad, como sus estatutos o certificado de constitución y todas sus modificaciones, certificada por un directivo de la sociedad o un notario.",
        "Prueba de la situación actual de la sociedad en su jurisdicción de origen, normalmente un documento emitido por el registro de sociedades de esa jurisdicción.",
        "El informe NUANS de Alberta, salvo exención.",
        "Una traducción notarial al inglés, para documentos constitutivos extranjeros que no estén en inglés.",
      ],
    },
    {
      type: "paragraph",
      text: "Si todo cumple los requisitos, el proveedor de servicios ingresa el registro en el registro de sociedades y emite un certificado de registro. Según el artículo 284(2), ese certificado es prueba concluyente de que la sociedad está registrada desde la fecha que indica.",
    },
    { type: "heading", id: "after-registering", text: "Presentaciones después del registro" },
    {
      type: "list",
      items: [
        "Una declaración anual de Alberta cada año, a más tardar el último día del mes siguiente al mes de aniversario de la sociedad (artículo 292). La tasa gubernamental es de $53.05.",
        "Dentro de un mes, una copia de cualquier modificación de los documentos constitutivos y un aviso de cualquier cambio en la dirección de la sede o en el consejo de administración (artículo 289). Un cambio que entra en vigor en el mes de aniversario o el mes siguiente puede informarse en la declaración anual.",
        "Dentro de un mes, una copia de cualquier fusión de la sociedad con otras sociedades extraprovinciales (artículo 290).",
        "Un aviso al registrador si la sociedad deja de operar en Alberta (artículo 285(4)).",
      ],
    },
    {
      type: "paragraph",
      text: "El artículo 287 también exige que el nombre de la sociedad figure de forma legible en sus contratos, facturas, títulos negociables y pedidos emitidos en el curso de sus actividades en Alberta.",
    },
    { type: "heading", id: "if-not-registered", text: "Si la sociedad no se registra" },
    {
      type: "paragraph",
      text: "Según el artículo 295, una sociedad extraprovincial no registrada no puede iniciar ni mantener una acción ante un tribunal de Alberta sobre un contrato celebrado en Alberta mientras no estaba registrada. Registrarse después corrige la situación: una acción iniciada antes del registro puede continuar una vez registrada la sociedad. Los actos y transferencias de bienes de la sociedad no son inválidos solo por no haber estado registrada (artículo 294). Infringir la parte 21 de la Ley es un delito con una multa de hasta $5,000 (artículo 296).",
    },
    {
      type: "paragraph",
      text: "Una vez registrada, una sociedad que acumula un año de atraso en sus presentaciones o tasas obligatorias puede ver cancelado su registro por el registrador, con un aviso previo de al menos 120 días (artículo 285).",
    },
    { type: "heading", id: "getting-it-done", text: "Cómo hacerlo" },
    p(
      "Korporex puede preparar y presentar un ",
      { text: "registro extraprovincial", href: "/services/extra-provincial" },
      " en Alberta o en otra provincia a partir de la información que usted proporcione, y solicitar el ",
      { text: "informe NUANS", href: "/nuans" },
      " necesario. Si la sociedad también opera en Ontario, vea cómo funciona el ",
      { text: "registro extraprovincial en Ontario", href: "/guides/registro-extraprovincial-ontario" },
      ", ya que las reglas son muy diferentes."
    ),
    {
      type: "paragraph",
      text: "Korporex no es un despacho de abogados y esta guía es información general, no asesoramiento legal. Para preguntas sobre la situación concreta de su sociedad, incluido si realiza actividades en Alberta, consulte a un abogado o contador.",
    },
  ],
  faq: [
    {
      q: "¿Cuánto cuesta el registro extraprovincial en Alberta?",
      a: "Desde el 1 de octubre de 2026, la tasa gubernamental es de $291.75, más el cargo por servicio del agente de registro o proveedor de servicios. Las sociedades de Columbia Británica, Manitoba y Saskatchewan se registran en línea sin costo.",
    },
    {
      q: "¿Cuál es el plazo para registrar una sociedad extraprovincial en Alberta?",
      a: "El artículo 279(1) de la Business Corporations Act de Alberta exige el registro antes de que la sociedad comience a operar en Alberta o dentro de los 30 días siguientes.",
    },
    {
      q: "¿Una sociedad federal debe registrarse en Alberta?",
      a: "Sí, si realiza actividades en Alberta. Una sociedad federal (CBCA) se registra como sociedad extraprovincial, pero Alberta no le exige presentar un informe NUANS.",
    },
    {
      q: "¿Quién puede ser agente para notificaciones en Alberta?",
      a: "Una persona ubicada en Alberta que consienta su nombramiento. No necesita ser abogado, y su dirección debe ser una oficina abierta al público en horario comercial normal.",
    },
    {
      q: "¿Las sociedades extraprovinciales presentan declaraciones anuales en Alberta?",
      a: "Sí. El artículo 292 exige que una sociedad extraprovincial registrada presente cada año una declaración anual de Alberta, a más tardar el último día del mes siguiente a su mes de aniversario. La tasa gubernamental es de $53.05.",
    },
  ],
};

export const extraProvincialAlberta: Article[] = [en, fr, es];
