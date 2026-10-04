import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the Ontario annual return order form. The page
// carries the service intent ("file my Ontario annual return for me") while the
// annual returns guide keeps the informational intent. Kept distinct from the
// federal return (deadline runs from the fiscal year-end, no government fee)
// and from the annual resolutions (minute-book documents, not a filing).
export const content: ServiceContentByLocale = {
  en: {
    title: "File your Ontario annual return through the Ontario Business Registry",
    blocks: [
      {
        type: "p",
        parts: [
          "Corporations incorporated under the Ontario Business Corporations Act (OBCA) file an annual return each year under the Corporations Information Act. The return confirms the corporation's information on the public record, such as its registered office address, directors and officers. Korporex prepares and files the return through the Ontario Business Registry. You confirm whether the information on file is still current, and we take care of the filing. Our guide to ",
          { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" },
          " explains how the Ontario and federal returns differ.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Ontario (OBCA) corporations that have completed a fiscal year.",
          "Owners who assumed their accountant's T2 filing still covered the annual return. Since October 2021, it does not.",
          "Holding companies and inactive corporations, which must file the return like any other corporation.",
          "Corporations with one or more years of returns outstanding.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "p",
        parts: [
          "We prepare the annual return and file it with the Ontario ministry through the Ontario Business Registry. You confirm that the registered office, directors and officers on file are current, or tell us what has changed, and you can update the corporation's primary activity at the same time. Changes are meant to be reported as they happen: in Ontario, a ",
          { text: "notice of change", href: "/services/notice-of-change" },
          " is due within 15 days of a change to the directors, officers or registered office.",
        ],
      },
      {
        type: "p",
        parts: [
          "Before October 2021, most Ontario corporations filed this return together with their T2 through the Canada Revenue Agency. The CRA stopped accepting Ontario annual returns for returns due after October 18, 2021, so the corporate tax return no longer takes care of it. The annual return is also separate from the initial return a new Ontario corporation files within 60 days after incorporating.",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's legal name and its Ontario corporation number.",
          "Its date of incorporation and its fiscal year-end.",
          "The current registered office address, directors and officers, or the details of what has changed.",
          "Optionally, an updated primary activity (NAICS code) or description of the business.",
        ],
      },
      { type: "h3", text: "Deadline and government fee" },
      {
        type: "p",
        parts: [
          "The Ontario annual return is due within six months after the end of the corporation's fiscal year, so a corporation with a December 31 year-end has until June 30 of the following year. Ontario charges no government fee for the return, but it is still mandatory. Under section 241 of the OBCA, a corporation that fails to comply with a filing requirement under the Corporations Information Act can have its certificate cancelled and be dissolved. A corporation dissolved this way may be revived within 20 years through ",
          { text: "Articles of Revival", href: "/services/revive-business" },
          ", with its outstanding filings brought up to date.",
        ],
      },
    ],
    faqTitle: "Ontario annual return: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the Ontario annual return filing; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Does my accountant's T2 filing include the Ontario annual return?",
        a: "Not anymore. Before October 2021, most Ontario corporations filed the annual return with their T2 through the CRA. The CRA stopped accepting Ontario annual returns for returns due after October 18, 2021. The return is now filed directly through the Ontario Business Registry, separately from the corporate tax return.",
      },
      {
        q: "When is the Ontario annual return due?",
        a: "Within six months after the end of the corporation's fiscal year. The deadline runs from the fiscal year-end, not from the incorporation anniversary as it does for federal corporations. A corporation with a December 31 year-end therefore has until June 30 of the following year to file.",
      },
      {
        q: "Is there a government fee for the Ontario annual return?",
        a: "No. Ontario charges no government fee for the annual return filed through the Ontario Business Registry. The filing is still mandatory every year, including for a corporation with no activity, and missing it can eventually lead to the corporation being dissolved. Korporex charges a service fee for preparing and filing it.",
      },
      {
        q: "What happens if the Ontario annual return is not filed?",
        a: "Under section 241 of the OBCA, when a corporation fails to comply with a filing requirement under the Corporations Information Act, the Director may give notice that the corporation will be dissolved unless it complies within 90 days after the notice. If it does not, its certificate of incorporation can be cancelled, which dissolves the corporation.",
      },
      {
        q: "Is the annual return the same as the annual resolutions?",
        a: "No. The annual return is a public filing with the Ontario Business Registry. Annual resolutions are internal decisions of the directors and shareholders, such as electing directors and dealing with the auditor, which are kept in the minute book and not filed with the registry. Korporex also prepares Ontario annual resolutions.",
      },
    ],
  },
  fr: {
    title: "Produisez votre déclaration annuelle de l'Ontario par le Registre des entreprises de l'Ontario",
    blocks: [
      {
        type: "p",
        parts: [
          "Les sociétés constituées sous le régime de la Loi sur les sociétés par actions de l'Ontario (LSAO) produisent chaque année une déclaration annuelle en vertu de la Loi sur les renseignements exigés des personnes morales. La déclaration confirme les renseignements de la société au dossier public, comme l'adresse de son siège social, ses administrateurs et ses dirigeants. Korporex prépare et produit la déclaration par l'entremise du Registre des entreprises de l'Ontario. Vous confirmez si les renseignements au dossier sont toujours à jour, et nous nous occupons du dépôt. Notre guide sur les ",
          { text: "déclarations annuelles des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" },
          " explique en quoi les déclarations ontarienne et fédérale diffèrent.",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés ontariennes (LSAO) qui ont terminé un exercice.",
          "Les propriétaires qui croyaient que la T2 produite par leur comptable couvrait encore la déclaration annuelle. Ce n'est plus le cas depuis octobre 2021.",
          "Les sociétés de portefeuille et les sociétés inactives, qui doivent produire la déclaration comme toute autre société.",
          "Les sociétés qui ont une ou plusieurs années de déclarations en retard.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Nous préparons la déclaration annuelle et la déposons auprès du ministère ontarien par l'entremise du Registre des entreprises de l'Ontario. Vous confirmez que le siège social, les administrateurs et les dirigeants au dossier sont à jour, ou vous nous indiquez ce qui a changé, et vous pouvez mettre à jour l'activité principale de la société en même temps. Les changements doivent être signalés au fur et à mesure : en Ontario, un ",
          { text: "avis de changement", href: "/services/notice-of-change" },
          " est exigible dans les 15 jours suivant un changement touchant les administrateurs, les dirigeants ou le siège social.",
        ],
      },
      {
        type: "p",
        parts: [
          "Avant octobre 2021, la plupart des sociétés ontariennes produisaient cette déclaration avec leur T2 par l'intermédiaire de l'Agence du revenu du Canada. L'ARC a cessé d'accepter les déclarations annuelles ontariennes pour celles exigibles après le 18 octobre 2021; la déclaration de revenus de la société ne s'en charge donc plus. La déclaration annuelle est aussi distincte de la déclaration initiale qu'une nouvelle société ontarienne produit dans les 60 jours suivant sa constitution.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale de la société et son numéro de société de l'Ontario.",
          "Sa date de constitution et la fin de son exercice.",
          "L'adresse actuelle du siège social, les administrateurs et les dirigeants, ou le détail de ce qui a changé.",
          "Au besoin, une activité principale à jour (code SCIAN) ou une description de l'entreprise.",
        ],
      },
      { type: "h3", text: "Échéance et frais gouvernementaux" },
      {
        type: "p",
        parts: [
          "La déclaration annuelle de l'Ontario est exigible dans les six mois suivant la fin de l'exercice de la société; une société dont l'exercice se termine le 31 décembre a donc jusqu'au 30 juin de l'année suivante. L'Ontario n'exige aucuns frais gouvernementaux pour la déclaration, mais celle-ci demeure obligatoire. En vertu de l'article 241 de la LSAO, une société qui ne se conforme pas à une exigence de dépôt prévue par la Loi sur les renseignements exigés des personnes morales peut voir son certificat annulé et être dissoute. Une société dissoute de cette façon peut être reconstituée dans un délai de 20 ans au moyen de ",
          { text: "statuts de reconstitution", href: "/services/revive-business" },
          ", ses dépôts en souffrance étant alors mis à jour.",
        ],
      },
    ],
    faqTitle: "Déclaration annuelle de l'Ontario : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt de la déclaration annuelle de l'Ontario; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "La T2 produite par mon comptable comprend-elle la déclaration annuelle de l'Ontario?",
        a: "Plus maintenant. Avant octobre 2021, la plupart des sociétés ontariennes produisaient la déclaration annuelle avec leur T2 par l'intermédiaire de l'ARC. L'ARC a cessé d'accepter les déclarations annuelles ontariennes pour celles exigibles après le 18 octobre 2021. La déclaration se produit maintenant directement par le Registre des entreprises de l'Ontario, séparément de la déclaration de revenus.",
      },
      {
        q: "Quand la déclaration annuelle de l'Ontario est-elle exigible?",
        a: "Dans les six mois suivant la fin de l'exercice de la société. L'échéance court à partir de la fin de l'exercice, et non de l'anniversaire de constitution comme pour les sociétés fédérales. Une société dont l'exercice se termine le 31 décembre a donc jusqu'au 30 juin de l'année suivante pour produire sa déclaration.",
      },
      {
        q: "Y a-t-il des frais gouvernementaux pour la déclaration annuelle de l'Ontario?",
        a: "Non. L'Ontario n'exige aucuns frais gouvernementaux pour la déclaration annuelle produite par le Registre des entreprises de l'Ontario. Le dépôt demeure obligatoire chaque année, même pour une société sans activité, et l'omettre peut finir par entraîner la dissolution de la société. Korporex facture des honoraires pour la préparer et la déposer.",
      },
      {
        q: "Qu'arrive-t-il si la déclaration annuelle de l'Ontario n'est pas produite?",
        a: "En vertu de l'article 241 de la LSAO, lorsqu'une société ne se conforme pas à une exigence de dépôt prévue par la Loi sur les renseignements exigés des personnes morales, le directeur peut l'aviser qu'elle sera dissoute si elle ne s'y conforme pas dans les 90 jours suivant l'avis. À défaut, son certificat de constitution peut être annulé, ce qui dissout la société.",
      },
      {
        q: "La déclaration annuelle est-elle la même chose que les résolutions annuelles?",
        a: "Non. La déclaration annuelle est un dépôt public auprès du Registre des entreprises de l'Ontario. Les résolutions annuelles sont des décisions internes des administrateurs et des actionnaires, comme l'élection des administrateurs et le traitement de la vérification, qui sont conservées dans le livre des procès-verbaux et ne sont pas déposées au registre. Korporex prépare aussi les résolutions annuelles de l'Ontario.",
      },
    ],
  },
  es: {
    title: "Presente su declaración anual de Ontario a través del Registro de Empresas de Ontario",
    blocks: [
      {
        type: "p",
        parts: [
          "Las sociedades constituidas bajo la Ley de Sociedades por Acciones de Ontario (OBCA) presentan cada año una declaración anual en virtud de la Corporations Information Act. La declaración confirma la información de la sociedad en el registro público, como su domicilio social, sus directores y sus funcionarios. Korporex prepara y presenta la declaración a través del Registro de Empresas de Ontario. Usted confirma si la información registrada sigue vigente, y nosotros nos encargamos de la presentación. Nuestra guía sobre las ",
          { text: "declaraciones anuales de sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" },
          " explica en qué se diferencian las declaraciones de Ontario y federal.",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades de Ontario (OBCA) que han cerrado un ejercicio.",
          "Propietarios que suponían que la T2 presentada por su contador seguía cubriendo la declaración anual. Desde octubre de 2021 ya no es así.",
          "Sociedades de cartera y sociedades inactivas, que deben presentar la declaración como cualquier otra sociedad.",
          "Sociedades con uno o más años de declaraciones pendientes.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Preparamos la declaración anual y la presentamos ante el ministerio de Ontario a través del Registro de Empresas de Ontario. Usted confirma que el domicilio social, los directores y los funcionarios registrados están al día, o nos indica qué cambió, y puede actualizar al mismo tiempo la actividad principal de la sociedad. Los cambios deben comunicarse a medida que ocurren: en Ontario, un ",
          { text: "aviso de cambio", href: "/services/notice-of-change" },
          " vence dentro de los 15 días siguientes a un cambio en los directores, los funcionarios o el domicilio social.",
        ],
      },
      {
        type: "p",
        parts: [
          "Antes de octubre de 2021, la mayoría de las sociedades de Ontario presentaban esta declaración junto con su T2 a través de la Agencia de Ingresos de Canadá. La CRA dejó de aceptar las declaraciones anuales de Ontario para las que vencían después del 18 de octubre de 2021, así que la declaración de impuestos de la sociedad ya no la cubre. La declaración anual también es distinta de la declaración inicial que una nueva sociedad de Ontario presenta dentro de los 60 días siguientes a su constitución.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal de la sociedad y su número de sociedad de Ontario.",
          "Su fecha de constitución y el cierre de su ejercicio.",
          "El domicilio social, los directores y los funcionarios actuales, o el detalle de lo que cambió.",
          "Opcionalmente, una actividad principal actualizada (código NAICS) o una descripción del negocio.",
        ],
      },
      { type: "h3", text: "Plazo y tarifa gubernamental" },
      {
        type: "p",
        parts: [
          "La declaración anual de Ontario vence dentro de los seis meses posteriores al cierre del ejercicio de la sociedad, así que una sociedad cuyo ejercicio cierra el 31 de diciembre tiene hasta el 30 de junio del año siguiente. Ontario no cobra tarifa gubernamental por la declaración, pero sigue siendo obligatoria. Según el artículo 241 de la OBCA, a una sociedad que no cumple con una obligación de presentación de la Corporations Information Act se le puede cancelar el certificado y quedar disuelta. Una sociedad disuelta de esta forma puede reactivarse dentro de los 20 años mediante ",
          { text: "artículos de reactivación", href: "/services/revive-business" },
          ", poniendo al día sus presentaciones pendientes.",
        ],
      },
    ],
    faqTitle: "Declaración anual de Ontario: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de la declaración anual de Ontario; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿La T2 que presenta mi contador incluye la declaración anual de Ontario?",
        a: "Ya no. Antes de octubre de 2021, la mayoría de las sociedades de Ontario presentaban la declaración anual con su T2 a través de la CRA. La CRA dejó de aceptar las declaraciones anuales de Ontario para las que vencían después del 18 de octubre de 2021. Ahora la declaración se presenta directamente a través del Registro de Empresas de Ontario, por separado de la declaración de impuestos.",
      },
      {
        q: "¿Cuándo vence la declaración anual de Ontario?",
        a: "Dentro de los seis meses posteriores al cierre del ejercicio de la sociedad. El plazo corre desde el cierre del ejercicio, no desde el aniversario de constitución como en las sociedades federales. Por eso, una sociedad cuyo ejercicio cierra el 31 de diciembre tiene hasta el 30 de junio del año siguiente para presentarla.",
      },
      {
        q: "¿Hay una tarifa gubernamental por la declaración anual de Ontario?",
        a: "No. Ontario no cobra tarifa gubernamental por la declaración anual presentada a través del Registro de Empresas de Ontario. La presentación sigue siendo obligatoria cada año, incluso para una sociedad sin actividad, y omitirla puede acabar provocando la disolución de la sociedad. Korporex cobra una tarifa de servicio por prepararla y presentarla.",
      },
      {
        q: "¿Qué pasa si no se presenta la declaración anual de Ontario?",
        a: "Según el artículo 241 de la OBCA, cuando una sociedad no cumple con una obligación de presentación de la Corporations Information Act, el Director puede notificarle que será disuelta si no la cumple dentro de los 90 días siguientes al aviso. Si no lo hace, puede cancelarse su certificado de constitución, lo que disuelve la sociedad.",
      },
      {
        q: "¿La declaración anual es lo mismo que las resoluciones anuales?",
        a: "No. La declaración anual es una presentación pública ante el Registro de Empresas de Ontario. Las resoluciones anuales son decisiones internas de los directores y accionistas, como la elección de los directores y el tratamiento de la auditoría, que se conservan en el libro de actas y no se presentan ante el registro. Korporex también prepara las resoluciones anuales de Ontario.",
      },
    ],
  },
};
