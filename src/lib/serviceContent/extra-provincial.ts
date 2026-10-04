import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the extra-provincial registration form. The form
// is a client wizard with almost no crawlable text, so this block carries the
// page's service intent ("register my corporation in another province, file it
// for me"). Ontario facts are from the Extra-Provincial Corporations Act, the
// Corporations Information Act (s. 3) and the ontario.ca fee schedule; other
// provinces are described only in general terms because their rules differ.
export const content: ServiceContentByLocale = {
  en: {
    title: "Register your corporation extra-provincially",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files extra-provincial registrations for corporations that carry on business in a Canadian province other than the one where they were incorporated. Your corporation keeps its existing incorporation and registers in the new province as an extra-provincial corporation. You tell us about the corporation, the province you are expanding into and your agent for service there, and we prepare the filing and submit it to that province's registry. For background on how federal and provincial incorporation compare, read our guide on ",
          { text: "federal vs provincial incorporation", href: "/guides/federal-vs-provincial-incorporation" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Ontario corporations expanding into another province, such as Quebec, British Columbia or Alberta.",
          "Federal (CBCA) corporations that carry on business in a province. Federal incorporation does not remove the need to register in each province where the corporation carries on business.",
          "Corporations from other provinces that start carrying on business in Ontario.",
        ],
      },
      { type: "h3", text: "What we file and what you provide" },
      {
        type: "p",
        parts: [
          "We prepare the extra-provincial registration for the province you choose and file it with that province's registry. You provide the corporation's home jurisdiction, its legal name, its corporation number, its registered office address and the date the registration should take effect. For the new province, you provide the name and address of an agent for service there: a person or firm in that province who can accept legal documents on the corporation's behalf. You confirm that the information matches the corporation's records in its home jurisdiction. Provincial government filing fees vary by province and are invoiced separately after submission.",
        ],
      },
      { type: "h3", text: "Registering in Ontario" },
      {
        type: "list",
        items: [
          "Under Ontario's Extra-Provincial Corporations Act, corporations from other provinces (class 1) and federal corporations (class 2) may carry on business in Ontario without a licence.",
          "They still register under the Corporations Information Act by filing an Initial Return within 60 days after beginning to carry on business in Ontario. There is no government fee for that return.",
          "Only corporations incorporated outside Canada (class 3) need an extra-provincial licence in Ontario, for a government fee of $330.",
          "A corporation that operates in Ontario under a name other than its corporate name must also register that name under the Business Names Act.",
        ],
      },
      {
        type: "p",
        parts: [
          "Outside Ontario, each province sets its own extra-provincial registration rules, forms, fees and agent for service requirements, so what is filed depends on the target province. Registering extra-provincially does not change where the corporation is incorporated. If the corporation uses a trade name in Ontario, see our ",
          { text: "business name registration", href: "/services/business-name" },
          " service. If you have not incorporated yet, you can ",
          { text: "incorporate with Korporex", href: "/incorporate" },
          " first.",
        ],
      },
    ],
    faqTitle: "Extra-provincial registration: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about extra-provincial registration; for advice on your specific situation, including whether your corporation carries on business in a province, consult a lawyer or accountant.",
    faq: [
      {
        q: "Does a federal corporation need to register in each province?",
        a: "Yes, in each province where it carries on business. Federal incorporation under the CBCA does not replace provincial registration. In Ontario, for example, a federal corporation does not need a licence, but it must file an Initial Return within 60 days after it begins carrying on business in the province.",
      },
      {
        q: "Is an Ontario corporation extra-provincial in Ontario?",
        a: "No. An Ontario corporation is not extra-provincial in Ontario. The extra-provincial rules apply when it carries on business in another province, where it registers under that province's legislation. Each province has its own forms, fees and requirements for corporations incorporated elsewhere.",
      },
      {
        q: "What is the difference between an Ontario licence and an Ontario registration?",
        a: "Under the Extra-Provincial Corporations Act, corporations from other Canadian provinces and federal corporations can carry on business in Ontario without a licence, and register by filing an Initial Return. Corporations incorporated outside Canada fall in class 3 and need an extra-provincial licence, which carries a government fee of $330.",
      },
      {
        q: "What is an agent for service?",
        a: "An agent for service is a person or firm located in the province who can accept legal documents, such as notices or claims, on the corporation's behalf. Whether a province requires one, and who can act, depends on that province's rules. Our form asks for the agent's full name and address in the target province.",
      },
      {
        q: "Does extra-provincial registration move my corporation?",
        a: "No. The corporation stays incorporated in its home jurisdiction and keeps its corporation number there. Extra-provincial registration only records it in the additional province. Moving a corporation to another jurisdiction of incorporation is a different process, called a continuance, which changes the statute the corporation is governed by.",
      },
    ],
  },
  fr: {
    title: "Enregistrez votre société à titre extraprovincial",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose les enregistrements extraprovinciaux des sociétés qui exercent leurs activités dans une province canadienne autre que celle où elles ont été constituées. Votre société conserve sa constitution existante et s'enregistre dans la nouvelle province à titre de société extraprovinciale. Vous nous renseignez sur la société, la province où vous vous étendez et votre mandataire aux fins de signification dans cette province, et nous préparons le dépôt et le soumettons au registre de cette province. Pour comparer la constitution fédérale et la constitution provinciale, lisez notre guide sur ",
          { text: "comment se constituer en société au Canada", href: "/guides/comment-se-constituer-societe-canada" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés ontariennes qui s'étendent dans une autre province, comme le Québec, la Colombie-Britannique ou l'Alberta.",
          "Les sociétés fédérales (LCSA) qui exercent des activités dans une province. La constitution fédérale ne dispense pas de s'enregistrer dans chaque province où la société exerce ses activités.",
          "Les sociétés d'autres provinces qui commencent à exercer des activités en Ontario.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous fournissez" },
      {
        type: "p",
        parts: [
          "Nous préparons l'enregistrement extraprovincial pour la province choisie et le déposons auprès du registre de cette province. Vous fournissez le territoire de constitution de la société, sa dénomination sociale, son numéro de société, l'adresse de son siège social et la date de prise d'effet de l'enregistrement. Pour la nouvelle province, vous fournissez le nom et l'adresse d'un mandataire aux fins de signification : une personne ou un cabinet de cette province qui peut recevoir des documents juridiques au nom de la société. Vous confirmez que les renseignements correspondent aux dossiers de la société dans son territoire de constitution. Les droits gouvernementaux de dépôt varient selon la province et sont facturés séparément après le dépôt.",
        ],
      },
      { type: "h3", text: "S'enregistrer en Ontario" },
      {
        type: "list",
        items: [
          "En vertu de la Loi sur les personnes morales extraprovinciales de l'Ontario, les sociétés d'autres provinces (catégorie 1) et les sociétés fédérales (catégorie 2) peuvent exercer des activités en Ontario sans permis.",
          "Elles s'enregistrent tout de même en vertu de la Loi sur les renseignements exigés des personnes morales en déposant un rapport initial dans les 60 jours suivant le début de leurs activités en Ontario. Aucuns droits gouvernementaux ne s'appliquent à ce rapport.",
          "Seules les sociétés constituées à l'extérieur du Canada (catégorie 3) ont besoin d'un permis extraprovincial en Ontario, moyennant des droits gouvernementaux de 330 $.",
          "Une société qui exerce en Ontario sous un nom autre que sa dénomination sociale doit aussi enregistrer ce nom en vertu de la Loi sur les noms commerciaux.",
        ],
      },
      {
        type: "p",
        parts: [
          "Hors de l'Ontario, chaque province fixe ses propres règles, formulaires, droits et exigences relatives au mandataire aux fins de signification pour l'enregistrement extraprovincial; le dépôt dépend donc de la province visée. L'enregistrement extraprovincial ne change pas le lieu de constitution de la société. Si la société utilise un nom commercial en Ontario, consultez notre service d'",
          { text: "enregistrement de nom commercial", href: "/services/business-name" },
          ". Si vous n'êtes pas encore constitué en société, vous pouvez d'abord ",
          { text: "vous constituer en société avec Korporex", href: "/incorporate" },
          ".",
        ],
      },
    ],
    faqTitle: "Enregistrement extraprovincial : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur l'enregistrement extraprovincial; pour des conseils adaptés à votre situation, notamment pour savoir si votre société exerce des activités dans une province, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Une société fédérale doit-elle s'enregistrer dans chaque province?",
        a: "Oui, dans chaque province où elle exerce ses activités. La constitution fédérale en vertu de la LCSA ne remplace pas l'enregistrement provincial. En Ontario, par exemple, une société fédérale n'a pas besoin de permis, mais elle doit déposer un rapport initial dans les 60 jours suivant le début de ses activités dans la province.",
      },
      {
        q: "Une société ontarienne est-elle extraprovinciale en Ontario?",
        a: "Non. Une société ontarienne n'est pas extraprovinciale en Ontario. Les règles extraprovinciales s'appliquent lorsqu'elle exerce ses activités dans une autre province, où elle s'enregistre en vertu de la législation de cette province. Chaque province a ses propres formulaires, droits et exigences pour les sociétés constituées ailleurs.",
      },
      {
        q: "Quelle est la différence entre un permis et un enregistrement en Ontario?",
        a: "En vertu de la Loi sur les personnes morales extraprovinciales, les sociétés d'autres provinces canadiennes et les sociétés fédérales peuvent exercer des activités en Ontario sans permis et s'enregistrent en déposant un rapport initial. Les sociétés constituées à l'extérieur du Canada font partie de la catégorie 3 et ont besoin d'un permis extraprovincial, assorti de droits gouvernementaux de 330 $.",
      },
      {
        q: "Qu'est-ce qu'un mandataire aux fins de signification?",
        a: "Un mandataire aux fins de signification est une personne ou un cabinet situé dans la province qui peut recevoir des documents juridiques, comme des avis ou des demandes, au nom de la société. L'obligation d'en nommer un, et les personnes pouvant agir, dépendent des règles de chaque province. Notre formulaire demande le nom complet et l'adresse du mandataire dans la province visée.",
      },
      {
        q: "L'enregistrement extraprovincial déplace-t-il ma société?",
        a: "Non. La société demeure constituée dans son territoire d'origine et y conserve son numéro de société. L'enregistrement extraprovincial ne fait que l'inscrire dans la province supplémentaire. Transférer une société vers un autre territoire de constitution est une démarche distincte, appelée prorogation, qui change la loi qui régit la société.",
      },
    ],
  },
  es: {
    title: "Registre su sociedad como extraprovincial",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta registros extraprovinciales para sociedades que operan en una provincia canadiense distinta de aquella en la que se constituyeron. Su sociedad conserva su constitución actual y se registra en la nueva provincia como sociedad extraprovincial. Usted nos informa sobre la sociedad, la provincia a la que se expande y su agente para notificaciones allí, y nosotros preparamos la presentación y la enviamos al registro de esa provincia. Para comparar la constitución federal y la provincial, lea nuestra guía sobre ",
          { text: "cómo constituirse en sociedad en Canadá", href: "/guides/como-constituirse-sociedad-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades de Ontario que se expanden a otra provincia, como Quebec, Columbia Británica o Alberta.",
          "Sociedades federales (CBCA) que operan en una provincia. La constitución federal no elimina la necesidad de registrarse en cada provincia donde la sociedad opera.",
          "Sociedades de otras provincias que comienzan a operar en Ontario.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué proporciona usted" },
      {
        type: "p",
        parts: [
          "Preparamos el registro extraprovincial para la provincia que usted elija y lo presentamos ante el registro de esa provincia. Usted proporciona la jurisdicción de origen de la sociedad, su denominación social, su número de sociedad, la dirección de su domicilio social y la fecha en que el registro debe entrar en vigor. Para la nueva provincia, proporciona el nombre y la dirección de un agente para notificaciones allí: una persona o firma de esa provincia que puede recibir documentos legales en nombre de la sociedad. Usted confirma que la información coincide con los registros de la sociedad en su jurisdicción de origen. Los cargos gubernamentales de presentación varían según la provincia y se facturan por separado después de la presentación.",
        ],
      },
      { type: "h3", text: "Registrarse en Ontario" },
      {
        type: "list",
        items: [
          "Según la Ley de Sociedades Extraprovinciales de Ontario (Extra-Provincial Corporations Act), las sociedades de otras provincias (clase 1) y las sociedades federales (clase 2) pueden operar en Ontario sin licencia.",
          "Aun así se registran conforme a la Ley de Información de Sociedades (Corporations Information Act) presentando una declaración inicial dentro de los 60 días siguientes al inicio de sus actividades en Ontario. Esa declaración no tiene cargo gubernamental.",
          "Solo las sociedades constituidas fuera de Canadá (clase 3) necesitan una licencia extraprovincial en Ontario, con un cargo gubernamental de $330.",
          "Una sociedad que opera en Ontario con un nombre distinto de su denominación social también debe registrar ese nombre conforme a la Ley de Nombres Comerciales.",
        ],
      },
      {
        type: "p",
        parts: [
          "Fuera de Ontario, cada provincia fija sus propias reglas, formularios, cargos y requisitos sobre el agente para notificaciones en el registro extraprovincial, por lo que lo que se presenta depende de la provincia de destino. El registro extraprovincial no cambia el lugar de constitución de la sociedad. Si la sociedad usa un nombre comercial en Ontario, consulte nuestro servicio de ",
          { text: "registro de nombre comercial", href: "/services/business-name" },
          ". Si todavía no se ha constituido, puede ",
          { text: "constituir su sociedad con Korporex", href: "/incorporate" },
          " primero.",
        ],
      },
    ],
    faqTitle: "Registro extraprovincial: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre el registro extraprovincial; para asesoría sobre su situación particular, incluido si su sociedad opera en una provincia, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Una sociedad federal debe registrarse en cada provincia?",
        a: "Sí, en cada provincia donde opera. La constitución federal conforme a la CBCA no sustituye el registro provincial. En Ontario, por ejemplo, una sociedad federal no necesita licencia, pero debe presentar una declaración inicial dentro de los 60 días siguientes al inicio de sus actividades en la provincia.",
      },
      {
        q: "¿Una sociedad de Ontario es extraprovincial en Ontario?",
        a: "No. Una sociedad de Ontario no es extraprovincial en Ontario. Las reglas extraprovinciales se aplican cuando opera en otra provincia, donde se registra conforme a la legislación de esa provincia. Cada provincia tiene sus propios formularios, cargos y requisitos para las sociedades constituidas en otro lugar.",
      },
      {
        q: "¿Qué diferencia hay entre una licencia y un registro en Ontario?",
        a: "Según la Ley de Sociedades Extraprovinciales, las sociedades de otras provincias canadienses y las sociedades federales pueden operar en Ontario sin licencia y se registran presentando una declaración inicial. Las sociedades constituidas fuera de Canadá pertenecen a la clase 3 y necesitan una licencia extraprovincial, con un cargo gubernamental de $330.",
      },
      {
        q: "¿Qué es un agente para notificaciones?",
        a: "Un agente para notificaciones es una persona o firma ubicada en la provincia que puede recibir documentos legales, como avisos o demandas, en nombre de la sociedad. Si una provincia exige uno, y quién puede actuar como tal, depende de las reglas de esa provincia. Nuestro formulario pide el nombre completo y la dirección del agente en la provincia de destino.",
      },
      {
        q: "¿El registro extraprovincial traslada mi sociedad?",
        a: "No. La sociedad sigue constituida en su jurisdicción de origen y conserva allí su número de sociedad. El registro extraprovincial solo la inscribe en la provincia adicional. Trasladar una sociedad a otra jurisdicción de constitución es un trámite distinto, llamado continuación (continuance), que cambia la ley que rige a la sociedad.",
      },
    ],
  },
};
