import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the federal (CBCA) annual return order form. The
// page carries the service intent ("file my federal annual return for me")
// while the annual returns guide keeps the informational intent. The copy is
// kept distinct from the Ontario return (different registry, deadline and fee)
// and from the annual resolutions (minute-book documents, not a filing).
export const content: ServiceContentByLocale = {
  en: {
    title: "File your federal annual return with Corporations Canada",
    blocks: [
      {
        type: "p",
        parts: [
          "Every corporation incorporated, amalgamated or continued under the Canada Business Corporations Act (CBCA) must file an annual return with Corporations Canada each year, whether or not it was active. Korporex prepares and files the return for you. You tell us about the corporation and confirm whether the information on the public record is still current, and we submit the return to Corporations Canada. For the full picture of federal and Ontario annual filings, read our guide to ",
          { text: "corporate annual returns in Canada", href: "/guides/corporate-annual-returns-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Federal (CBCA) business corporations whose filing window has opened after their anniversary date.",
          "Holding companies and inactive corporations, which must file the return like any other corporation.",
          "Corporations whose return shows as overdue in Corporations Canada's public database.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "p",
        parts: [
          "We prepare the annual return and file it with Corporations Canada. The return reflects the corporation's situation on its anniversary date, including whether it is a distributing corporation (one that has offered its securities to the public) or a non-distributing corporation, as almost every small private corporation is. Since January 22, 2024, information on the corporation's individuals with significant control (ISC) is filed at the same time as the annual return.",
        ],
      },
      {
        type: "p",
        parts: [
          "If the registered office, the directors or the officers have changed since the last filing, you tell us in the form. Under the CBCA, a change of directors or of a director's address and a change of registered office address are each reported to Corporations Canada within 15 days by a separate ",
          { text: "notice of change", href: "/services/notice-of-change" },
          ".",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's legal name and its federal corporation number.",
          "Its anniversary date (the date of incorporation, amalgamation or continuance) and its fiscal year-end.",
          "Whether it is distributing or non-distributing, and the approximate number of shareholders.",
          "The date of the last annual meeting of shareholders, or of the written resolutions signed in its place.",
          "An up-to-date register of individuals with significant control.",
        ],
      },
      { type: "h3", text: "Deadline and government fee" },
      {
        type: "p",
        parts: [
          "The federal annual return is due within the 60 days following the anniversary date, and it cannot be filed before the anniversary date. The Corporations Canada fee is $12 for an online filing. Once the window passes, the corporation's filings show as overdue in the public database. The CBCA allows dissolution after one year of non-filing; Corporations Canada's policy is to dissolve after two years without a return, following a final notice that gives an additional 120 days to file. Because the return asks for the date of the last annual meeting, many corporations prepare their ",
          { text: "federal annual resolutions", href: "/services/annual-resolution-federal" },
          " first.",
        ],
      },
    ],
    faqTitle: "Federal annual return: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the federal annual return filing; for advice on your specific situation, consult a lawyer or accountant.",
    faq: [
      {
        q: "Is the federal annual return the same as the corporate tax return?",
        a: "No. The annual return is a corporate law filing with Corporations Canada that confirms the corporation's information on the public record. The T2 Corporation Income Tax Return is a separate filing with the Canada Revenue Agency, with its own deadline. Filing one does not satisfy the other, so a corporation that is up to date with the CRA can still have overdue annual returns.",
      },
      {
        q: "Can the federal annual return be filed early?",
        a: "No. Corporations Canada requires the information on the annual return to reflect the corporation's situation on its anniversary date. The filing window opens on the anniversary of incorporation, amalgamation or continuance and stays open for the 60 days that follow. A return submitted before the anniversary date is not accepted for that year.",
      },
      {
        q: "What is the government fee for the federal annual return?",
        a: "Corporations Canada charges $12 for an annual return filed online. Each overdue year is a separate return with its own fee. The government fee is separate from the Korporex service fee and is not the same as the fee for any notice of change or other filing the corporation may also need.",
      },
      {
        q: "Does the annual return update our directors or registered office?",
        a: "Not on its own. Under the CBCA, a change in the directors or in a director's address, and a change of registered office address, are each reported to Corporations Canada within 15 days by a separate notice. When those notices are current, the annual return mainly confirms what is already on file.",
      },
      {
        q: "What happens if the federal annual return is not filed?",
        a: "The corporation's filings show as overdue in Corporations Canada's public database, and it cannot obtain a certificate of compliance while they are overdue. The CBCA allows dissolution after one year of non-filing. Corporations Canada's policy is to dissolve after two years without a return, after a final notice giving an additional 120 days to file.",
      },
    ],
  },
  fr: {
    title: "Produisez votre déclaration annuelle fédérale auprès de Corporations Canada",
    blocks: [
      {
        type: "p",
        parts: [
          "Toute société constituée, fusionnée ou prorogée sous le régime de la Loi canadienne sur les sociétés par actions (LCSA) doit produire une déclaration annuelle auprès de Corporations Canada chaque année, qu'elle ait été active ou non. Korporex prépare et produit la déclaration pour vous. Vous nous renseignez sur la société et confirmez si les renseignements au dossier public sont toujours à jour, et nous soumettons la déclaration à Corporations Canada. Pour le portrait complet des dépôts annuels fédéraux et ontariens, lisez notre guide sur les ",
          { text: "déclarations annuelles des sociétés au Canada", href: "/guides/declarations-annuelles-societes-canada" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés par actions fédérales (LCSA) dont la période de dépôt s'est ouverte après leur date anniversaire.",
          "Les sociétés de portefeuille et les sociétés inactives, qui doivent produire la déclaration comme toute autre société.",
          "Les sociétés dont la déclaration figure en retard dans la base de données publique de Corporations Canada.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Nous préparons la déclaration annuelle et la déposons auprès de Corporations Canada. La déclaration reflète la situation de la société à sa date anniversaire, y compris le fait qu'elle soit une société ayant fait appel au public (qui a offert ses valeurs mobilières au public) ou non, comme la quasi-totalité des petites sociétés fermées. Depuis le 22 janvier 2024, les renseignements sur les particuliers ayant un contrôle important (PCI) de la société sont déposés en même temps que la déclaration annuelle.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si le siège social, les administrateurs ou les dirigeants ont changé depuis le dernier dépôt, vous nous l'indiquez dans le formulaire. Sous le régime de la LCSA, un changement d'administrateurs ou de l'adresse d'un administrateur et un changement d'adresse du siège social doivent chacun être signalés à Corporations Canada dans les 15 jours par un ",
          { text: "avis de changement", href: "/services/notice-of-change" },
          " distinct.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale de la société et son numéro de société fédérale.",
          "Sa date anniversaire (date de constitution, de fusion ou de prorogation) et la fin de son exercice.",
          "Le fait qu'elle ait fait appel au public ou non, et le nombre approximatif d'actionnaires.",
          "La date de la dernière assemblée annuelle des actionnaires, ou des résolutions écrites signées au lieu de celle-ci.",
          "Un registre à jour des particuliers ayant un contrôle important.",
        ],
      },
      { type: "h3", text: "Échéance et frais gouvernementaux" },
      {
        type: "p",
        parts: [
          "La déclaration annuelle fédérale est exigible dans les 60 jours suivant la date anniversaire et ne peut pas être produite avant cette date. Les frais de Corporations Canada sont de 12 $ pour un dépôt en ligne. Une fois le délai écoulé, les dépôts de la société figurent en retard dans la base de données publique. La LCSA permet la dissolution après un an sans dépôt; la politique de Corporations Canada est de dissoudre après deux ans sans déclaration, à la suite d'un dernier avis qui accorde 120 jours supplémentaires pour déposer. Comme la déclaration demande la date de la dernière assemblée annuelle, de nombreuses sociétés préparent d'abord leurs ",
          { text: "résolutions annuelles fédérales", href: "/services/annual-resolution-federal" },
          ".",
        ],
      },
    ],
    faqTitle: "Déclaration annuelle fédérale : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt de la déclaration annuelle fédérale; pour des conseils adaptés à votre situation, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "La déclaration annuelle fédérale est-elle la même chose que la déclaration de revenus de la société?",
        a: "Non. La déclaration annuelle est un dépôt de droit des sociétés auprès de Corporations Canada qui confirme les renseignements de la société au dossier public. La déclaration de revenus des sociétés T2 est un dépôt distinct auprès de l'Agence du revenu du Canada, avec sa propre échéance. L'un ne remplace pas l'autre : une société à jour auprès de l'ARC peut quand même avoir des déclarations annuelles en retard.",
      },
      {
        q: "Peut-on produire la déclaration annuelle fédérale à l'avance?",
        a: "Non. Corporations Canada exige que les renseignements de la déclaration annuelle reflètent la situation de la société à sa date anniversaire. La période de dépôt s'ouvre à l'anniversaire de la constitution, de la fusion ou de la prorogation et reste ouverte pendant les 60 jours qui suivent. Une déclaration soumise avant la date anniversaire n'est pas acceptée pour cette année.",
      },
      {
        q: "Quels sont les frais gouvernementaux de la déclaration annuelle fédérale?",
        a: "Corporations Canada exige 12 $ pour une déclaration annuelle produite en ligne. Chaque année en retard est une déclaration distincte avec ses propres frais. Les frais gouvernementaux s'ajoutent aux honoraires de Korporex et ne comprennent pas les frais d'un avis de changement ou d'un autre dépôt dont la société pourrait aussi avoir besoin.",
      },
      {
        q: "La déclaration annuelle met-elle à jour nos administrateurs ou notre siège social?",
        a: "Pas à elle seule. Sous le régime de la LCSA, un changement d'administrateurs ou de l'adresse d'un administrateur, ainsi qu'un changement d'adresse du siège social, sont chacun signalés à Corporations Canada dans les 15 jours par un avis distinct. Lorsque ces avis sont à jour, la déclaration annuelle confirme surtout ce qui figure déjà au dossier.",
      },
      {
        q: "Qu'arrive-t-il si la déclaration annuelle fédérale n'est pas produite?",
        a: "Les dépôts de la société figurent en retard dans la base de données publique de Corporations Canada, et elle ne peut obtenir de certificat de conformité tant qu'ils le demeurent. La LCSA permet la dissolution après un an sans dépôt. La politique de Corporations Canada est de dissoudre après deux ans sans déclaration, après un dernier avis accordant 120 jours supplémentaires pour déposer.",
      },
    ],
  },
  es: {
    title: "Presente su declaración anual federal ante Corporations Canada",
    blocks: [
      {
        type: "p",
        parts: [
          "Toda sociedad constituida, fusionada o continuada bajo la Ley de Sociedades por Acciones de Canadá (CBCA) debe presentar una declaración anual ante Corporations Canada cada año, haya tenido actividad o no. Korporex prepara y presenta la declaración por usted. Usted nos informa sobre la sociedad y confirma si la información que consta en el registro público sigue vigente, y nosotros enviamos la declaración a Corporations Canada. Para el panorama completo de las presentaciones anuales federales y de Ontario, lea nuestra guía sobre las ",
          { text: "declaraciones anuales de sociedades en Canadá", href: "/guides/declaraciones-anuales-sociedades-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades por acciones federales (CBCA) cuyo plazo de presentación se abrió tras su fecha de aniversario.",
          "Sociedades de cartera y sociedades inactivas, que deben presentar la declaración como cualquier otra sociedad.",
          "Sociedades cuya declaración figura como atrasada en la base de datos pública de Corporations Canada.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Preparamos la declaración anual y la presentamos ante Corporations Canada. La declaración refleja la situación de la sociedad en su fecha de aniversario, incluido si es una sociedad emisora (distributing, que ofreció sus valores al público) o no emisora, como casi todas las pequeñas sociedades privadas. Desde el 22 de enero de 2024, la información sobre las personas con control significativo (ISC) de la sociedad se presenta al mismo tiempo que la declaración anual.",
        ],
      },
      {
        type: "p",
        parts: [
          "Si el domicilio social, los directores o los funcionarios cambiaron desde la última presentación, usted nos lo indica en el formulario. Según la CBCA, un cambio de directores o de la dirección de un director y un cambio de dirección del domicilio social se comunican cada uno a Corporations Canada dentro de los 15 días mediante un ",
          { text: "aviso de cambio", href: "/services/notice-of-change" },
          " por separado.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal de la sociedad y su número de sociedad federal.",
          "Su fecha de aniversario (fecha de constitución, fusión o continuación) y el cierre de su ejercicio.",
          "Si es emisora o no emisora, y el número aproximado de accionistas.",
          "La fecha de la última asamblea anual de accionistas, o de las resoluciones escritas firmadas en su lugar.",
          "Un registro al día de las personas con control significativo.",
        ],
      },
      { type: "h3", text: "Plazo y tarifa gubernamental" },
      {
        type: "p",
        parts: [
          "La declaración anual federal vence dentro de los 60 días siguientes a la fecha de aniversario y no puede presentarse antes de esa fecha. La tarifa de Corporations Canada es de 12 $ por una presentación en línea. Una vez vencido el plazo, las presentaciones de la sociedad figuran como atrasadas en la base de datos pública. La CBCA permite la disolución tras un año sin presentar; la política de Corporations Canada es disolver tras dos años sin declaración, después de un aviso final que otorga 120 días adicionales para presentar. Como la declaración pide la fecha de la última asamblea anual, muchas sociedades preparan primero sus ",
          { text: "resoluciones anuales federales", href: "/services/annual-resolution-federal" },
          ".",
        ],
      },
    ],
    faqTitle: "Declaración anual federal: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de la declaración anual federal; para asesoría sobre su situación particular, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿La declaración anual federal es lo mismo que la declaración de impuestos de la sociedad?",
        a: "No. La declaración anual es una presentación de derecho societario ante Corporations Canada que confirma la información de la sociedad en el registro público. La declaración del impuesto de sociedades T2 es una presentación distinta ante la Agencia de Ingresos de Canadá, con su propio plazo. Una no sustituye a la otra: una sociedad al día con la CRA puede tener declaraciones anuales atrasadas.",
      },
      {
        q: "¿Se puede presentar la declaración anual federal por adelantado?",
        a: "No. Corporations Canada exige que la información de la declaración anual refleje la situación de la sociedad en su fecha de aniversario. El plazo de presentación se abre en el aniversario de la constitución, fusión o continuación y permanece abierto durante los 60 días siguientes. Una declaración enviada antes de la fecha de aniversario no se acepta para ese año.",
      },
      {
        q: "¿Cuál es la tarifa gubernamental de la declaración anual federal?",
        a: "Corporations Canada cobra 12 $ por una declaración anual presentada en línea. Cada año atrasado es una declaración distinta con su propia tarifa. La tarifa gubernamental es independiente de la tarifa de servicio de Korporex y no incluye la de un aviso de cambio u otra presentación que la sociedad también pueda necesitar.",
      },
      {
        q: "¿La declaración anual actualiza a nuestros directores o el domicilio social?",
        a: "No por sí sola. Según la CBCA, un cambio de directores o de la dirección de un director, así como un cambio de dirección del domicilio social, se comunican cada uno a Corporations Canada dentro de los 15 días mediante un aviso por separado. Cuando esos avisos están al día, la declaración anual confirma sobre todo lo que ya consta en el registro.",
      },
      {
        q: "¿Qué pasa si no se presenta la declaración anual federal?",
        a: "Las presentaciones de la sociedad figuran como atrasadas en la base de datos pública de Corporations Canada, y no puede obtener un certificado de cumplimiento mientras lo estén. La CBCA permite la disolución tras un año sin presentar. La política de Corporations Canada es disolver tras dos años sin declaración, después de un aviso final que otorga 120 días adicionales para presentar.",
      },
    ],
  },
};
