import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the change of shareholder order form.
// Service intent: "record a share transfer / issuance in my corporate records".
// Not a registry filing: securities register (CBCA s.50 / OBCA s.141) and share
// certificates. ISC register: CBCA s.21.1 + s.21.21 (federal filing within 15
// days); OBCA s.140.2 (record within 15 days; Ontario filing not in force).
export const content: ServiceContentByLocale = {
  en: {
    title: "Record a change of shareholder in your corporate records",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex updates the shareholder records of Ontario (OBCA) and federal (CBCA) corporations when shares are issued, transferred, redeemed or cancelled. You describe the transaction, and we update the corporation's register of shareholders and prepare the new share certificate. Unlike a director change, this is an internal corporate records update: neither Corporations Canada nor the Ontario Business Registry keeps a public list of shareholders, so no notice of change is filed. Our guide to the ",
          { text: "corporate minute book", href: "/guides/corporate-minute-book" },
          " explains where the share register and certificates are kept.",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Corporations bringing in a new shareholder through an issuance of new shares.",
          "Shareholders selling or gifting shares to another person or to a holding company.",
          "Corporations buying back (redeeming) shares or cancelling shares.",
        ],
      },
      { type: "h3", text: "What we prepare and what you confirm" },
      {
        type: "p",
        parts: [
          "We record the transaction in the register of shareholders, with the share class, the number of shares, the consideration and the effective date, and we prepare the new share certificate. You confirm that the transaction was approved as the corporation's articles, by-laws and any shareholder agreement require. Under both statutes, new shares are issued by the directors, subject to the articles, the by-laws and any unanimous shareholder agreement. The articles of many private corporations also restrict share transfers, for example by requiring the consent of the directors, and a ",
          { text: "shareholder agreement", href: "/guides/shareholder-agreements-canada" },
          " can add its own conditions.",
        ],
      },
      { type: "h3", text: "What you need" },
      {
        type: "list",
        items: [
          "The corporation's exact legal name and its corporation number (federal) or Ontario Corporation Number (OCN).",
          "The type of change (issuance, transfer, redemption or cancellation), the share class as named in the articles, and the number of shares.",
          "The name and address of each party: the person or corporation giving up the shares, the one receiving them, or both.",
          "The consideration paid, if any, and the effective date.",
        ],
      },
      { type: "h3", text: "Significant control registers and deadlines" },
      {
        type: "p",
        parts: [
          "A change in shareholdings can also change who has significant control over the corporation. Federal corporations must record changes in their register of individuals with significant control within 15 days after becoming aware of them, and Corporations Canada requires the updated information to be filed within 15 days of any change to that register. Ontario corporations must record new information in their register within 15 days after becoming aware of it; Ontario does not currently require that register to be filed with the registry. These obligations are separate from the share register update described above. If the new owner is also joining the board, the ",
          { text: "change of director", href: "/services/change-director" },
          " filing is a separate government filing with its own 15-day deadline.",
        ],
      },
    ],
    faqTitle: "Changing shareholders: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about recording share issuances and transfers; for advice on your specific situation, including the tax consequences of a transfer, consult a lawyer or accountant.",
    faq: [
      {
        q: "Do I have to file a share transfer with the government?",
        a: "Not as a notice of change. Corporations Canada and the Ontario Business Registry do not keep a public list of shareholders, so a share transfer is recorded in the corporation's own securities register and share certificates. A federal corporation may still have to file updated significant control information with Corporations Canada if the transfer changes its register of individuals with significant control.",
      },
      {
        q: "What is the difference between an issuance and a transfer?",
        a: "In an issuance, the corporation creates new shares and issues them to a person, usually for money, property or past services, which increases the number of shares outstanding. In a transfer, an existing shareholder sells or gives shares to someone else, and the total number of shares outstanding does not change.",
      },
      {
        q: "Who approves a new issuance of shares?",
        a: "The directors. The CBCA and the OBCA both provide that shares may be issued at such times, to such persons and for such consideration as the directors determine, subject to the articles, the by-laws and any unanimous shareholder agreement. The approval is normally documented by a directors' resolution kept in the minute book.",
      },
      {
        q: "Does a share transfer have tax consequences?",
        a: "It can. A sale or gift of shares may trigger a capital gain for the person transferring them, and transfers between related persons or to a holding company have their own tax rules. Korporex records the transaction in the corporate records; the tax treatment is a question for an accountant or tax lawyer.",
      },
    ],
  },
  fr: {
    title: "Consignez un changement d'actionnaire dans les registres de votre société",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex met à jour les registres des actionnaires des sociétés ontariennes (LSAO) et fédérales (LCSA) lorsque des actions sont émises, transférées, rachetées ou annulées. Vous décrivez l'opération, et nous mettons à jour le registre des actionnaires de la société et préparons le nouveau certificat d'actions. Contrairement à un changement d'administrateur, il s'agit d'une mise à jour des registres internes de la société : ni Corporations Canada ni le Registre des entreprises de l'Ontario ne tiennent de liste publique des actionnaires, de sorte qu'aucun avis de modification n'est déposé. Notre guide sur ",
          { text: "le livre des procès-verbaux", href: "/guides/quest-ce-quun-livre-des-proces-verbaux" },
          " explique où sont conservés le registre des actionnaires et les certificats.",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés qui accueillent un nouvel actionnaire au moyen d'une émission de nouvelles actions.",
          "Les actionnaires qui vendent ou donnent des actions à une autre personne ou à une société de portefeuille.",
          "Les sociétés qui rachètent ou annulent des actions.",
        ],
      },
      { type: "h3", text: "Ce que nous préparons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Nous inscrivons l'opération au registre des actionnaires, avec la catégorie d'actions, le nombre d'actions, la contrepartie et la date de prise d'effet, et nous préparons le nouveau certificat d'actions. Vous confirmez que l'opération a été approuvée comme l'exigent les statuts, les règlements administratifs et toute convention d'actionnaires de la société. En vertu des deux lois, les nouvelles actions sont émises par les administrateurs, sous réserve des statuts, des règlements administratifs et de toute convention unanime des actionnaires. Les statuts de nombreuses sociétés fermées restreignent aussi le transfert des actions, par exemple en exigeant le consentement des administrateurs, et une ",
          { text: "convention d'actionnaires", href: "/guides/convention-actionnaires-canada" },
          " peut ajouter ses propres conditions.",
        ],
      },
      { type: "h3", text: "Ce dont vous avez besoin" },
      {
        type: "list",
        items: [
          "La dénomination sociale exacte de la société et son numéro de société (fédéral) ou son numéro de société de l'Ontario (OCN).",
          "Le type de changement (émission, transfert, rachat ou annulation), la catégorie d'actions telle qu'elle est désignée dans les statuts et le nombre d'actions.",
          "Le nom et l'adresse de chaque partie : la personne ou la société qui cède les actions, celle qui les reçoit, ou les deux.",
          "La contrepartie versée, le cas échéant, et la date de prise d'effet.",
        ],
      },
      { type: "h3", text: "Registres des particuliers ayant un contrôle important et délais" },
      {
        type: "p",
        parts: [
          "Un changement dans l'actionnariat peut aussi modifier qui exerce un contrôle important sur la société. Les sociétés fédérales doivent inscrire les changements dans leur registre des particuliers ayant un contrôle important dans les 15 jours suivant le moment où elles en prennent connaissance, et Corporations Canada exige que les renseignements à jour soient déposés dans les 15 jours suivant tout changement à ce registre. Les sociétés ontariennes doivent inscrire les nouveaux renseignements dans leur registre dans les 15 jours suivant le moment où elles en prennent connaissance; l'Ontario n'exige pas actuellement le dépôt de ce registre auprès du registre public. Ces obligations sont distinctes de la mise à jour du registre des actionnaires décrite ci-dessus. Si le nouveau propriétaire se joint aussi au conseil, le ",
          { text: "changement d'administrateur", href: "/services/change-director" },
          " est un dépôt gouvernemental distinct, assorti de son propre délai de 15 jours.",
        ],
      },
    ],
    faqTitle: "Changer d'actionnaires : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur l'inscription des émissions et des transferts d'actions; pour des conseils adaptés à votre situation, y compris les conséquences fiscales d'un transfert, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Faut-il déposer un transfert d'actions auprès du gouvernement?",
        a: "Pas au moyen d'un avis de modification. Corporations Canada et le Registre des entreprises de l'Ontario ne tiennent pas de liste publique des actionnaires; un transfert d'actions est donc consigné dans le registre des valeurs mobilières et les certificats d'actions de la société. Une société fédérale peut toutefois devoir déposer des renseignements à jour sur le contrôle important auprès de Corporations Canada si le transfert modifie son registre des particuliers ayant un contrôle important.",
      },
      {
        q: "Quelle est la différence entre une émission et un transfert?",
        a: "Lors d'une émission, la société crée de nouvelles actions et les émet à une personne, habituellement en échange d'argent, de biens ou de services rendus, ce qui augmente le nombre d'actions en circulation. Lors d'un transfert, un actionnaire existant vend ou donne des actions à quelqu'un d'autre, et le nombre total d'actions en circulation ne change pas.",
      },
      {
        q: "Qui approuve une nouvelle émission d'actions?",
        a: "Les administrateurs. La LCSA et la LSAO prévoient toutes deux que les actions peuvent être émises aux moments, aux personnes et pour la contrepartie que déterminent les administrateurs, sous réserve des statuts, des règlements administratifs et de toute convention unanime des actionnaires. L'approbation est normalement constatée par une résolution des administrateurs conservée dans le livre des procès-verbaux.",
      },
      {
        q: "Un transfert d'actions a-t-il des conséquences fiscales?",
        a: "Cela peut être le cas. La vente ou le don d'actions peut entraîner un gain en capital pour la personne qui les cède, et les transferts entre personnes liées ou à une société de portefeuille obéissent à leurs propres règles fiscales. Korporex consigne l'opération dans les registres de la société; le traitement fiscal relève d'un comptable ou d'un avocat fiscaliste.",
      },
    ],
  },
  es: {
    title: "Registre un cambio de accionista en los registros de su sociedad",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex actualiza los registros de accionistas de sociedades de Ontario (OBCA) y federales (CBCA) cuando se emiten, transfieren, rescatan o cancelan acciones. Usted describe la operación, y nosotros actualizamos el registro de accionistas de la sociedad y preparamos el nuevo certificado de acciones. A diferencia de un cambio de director, se trata de una actualización de los registros internos de la sociedad: ni Corporations Canada ni el Registro de Empresas de Ontario llevan una lista pública de accionistas, por lo que no se presenta ningún aviso de cambio. Nuestra guía sobre el ",
          { text: "libro de actas", href: "/guides/que-es-un-libro-de-actas" },
          " explica dónde se conservan el registro de accionistas y los certificados.",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades que incorporan a un nuevo accionista mediante una emisión de nuevas acciones.",
          "Accionistas que venden o donan acciones a otra persona o a una sociedad de cartera.",
          "Sociedades que rescatan (recompran) o cancelan acciones.",
        ],
      },
      { type: "h3", text: "Qué preparamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Registramos la operación en el registro de accionistas, con la clase de acciones, el número de acciones, la contraprestación y la fecha de entrada en vigor, y preparamos el nuevo certificado de acciones. Usted confirma que la operación se aprobó como lo exigen los estatutos, los estatutos internos y cualquier convenio de accionistas de la sociedad. Según ambas leyes, las nuevas acciones las emiten los directores, sujeto a los estatutos, los estatutos internos y cualquier convenio unánime de accionistas. Los estatutos de muchas sociedades privadas también restringen la transferencia de acciones, por ejemplo exigiendo el consentimiento de los directores, y un ",
          { text: "convenio de accionistas", href: "/guides/convenio-de-accionistas-canada" },
          " puede agregar sus propias condiciones.",
        ],
      },
      { type: "h3", text: "Qué necesita" },
      {
        type: "list",
        items: [
          "La denominación legal exacta de la sociedad y su número de sociedad (federal) o su número de sociedad de Ontario (OCN).",
          "El tipo de cambio (emisión, transferencia, rescate o cancelación), la clase de acciones tal como figura en los estatutos y el número de acciones.",
          "El nombre y la dirección de cada parte: la persona o sociedad que cede las acciones, la que las recibe, o ambas.",
          "La contraprestación pagada, si la hay, y la fecha de entrada en vigor.",
        ],
      },
      { type: "h3", text: "Registros de personas con control significativo y plazos" },
      {
        type: "p",
        parts: [
          "Un cambio en la titularidad de las acciones también puede cambiar quién tiene control significativo sobre la sociedad. Las sociedades federales deben registrar los cambios en su registro de personas con control significativo dentro de los 15 días siguientes a la fecha en que tienen conocimiento de ellos, y Corporations Canada exige presentar la información actualizada dentro de los 15 días siguientes a cualquier cambio en ese registro. Las sociedades de Ontario deben registrar la nueva información en su registro dentro de los 15 días siguientes a la fecha en que tienen conocimiento de ella; Ontario no exige actualmente presentar ese registro ante el registro público. Estas obligaciones son distintas de la actualización del registro de accionistas descrita arriba. Si el nuevo propietario también se une al consejo, el ",
          { text: "cambio de director", href: "/services/change-director" },
          " es una presentación gubernamental aparte, con su propio plazo de 15 días.",
        ],
      },
    ],
    faqTitle: "Cambiar accionistas: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre el registro de emisiones y transferencias de acciones; para asesoría sobre su situación particular, incluidas las consecuencias fiscales de una transferencia, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Hay que presentar una transferencia de acciones ante el gobierno?",
        a: "No mediante un aviso de cambio. Corporations Canada y el Registro de Empresas de Ontario no llevan una lista pública de accionistas, por lo que una transferencia de acciones se registra en el registro de valores y los certificados de acciones de la propia sociedad. Aun así, una sociedad federal puede tener que presentar información actualizada de control significativo ante Corporations Canada si la transferencia modifica su registro de personas con control significativo.",
      },
      {
        q: "¿Cuál es la diferencia entre una emisión y una transferencia?",
        a: "En una emisión, la sociedad crea nuevas acciones y las emite a una persona, normalmente a cambio de dinero, bienes o servicios prestados, lo que aumenta el número de acciones en circulación. En una transferencia, un accionista existente vende o dona acciones a otra persona, y el número total de acciones en circulación no cambia.",
      },
      {
        q: "¿Quién aprueba una nueva emisión de acciones?",
        a: "Los directores. La CBCA y la OBCA establecen que las acciones pueden emitirse en el momento, a las personas y por la contraprestación que determinen los directores, sujeto a los estatutos, los estatutos internos y cualquier convenio unánime de accionistas. La aprobación normalmente se documenta mediante una resolución de los directores que se conserva en el libro de actas.",
      },
      {
        q: "¿Una transferencia de acciones tiene consecuencias fiscales?",
        a: "Puede tenerlas. La venta o donación de acciones puede generar una ganancia de capital para quien las transfiere, y las transferencias entre personas vinculadas o a una sociedad de cartera tienen sus propias reglas fiscales. Korporex registra la operación en los registros de la sociedad; el tratamiento fiscal es una cuestión para un contador o un abogado tributario.",
      },
    ],
  },
};
