import type { Locale } from "@/i18n/routing";

// Server-rendered copy under the dissolution order form. The form is a client
// wizard with almost no crawlable text, so this block carries the page's
// service intent ("dissolve my corporation, file it for me") while the guide at
// /guides/<dissolve slug> keeps the informational "how to" intent. Each block
// links to the guide in the same locale so the two pages reinforce each other
// instead of competing for the same query.
export type Inline = string | { text: string; href: string };

export type DissolveContent = {
  title: string;
  blocks: (
    | { type: "h3"; text: string }
    | { type: "p"; parts: Inline[] }
    | { type: "list"; items: string[] }
  )[];
  faqTitle: string;
  faq: { q: string; a: string }[];
};

export const DISSOLVE_CONTENT: Record<Locale, DissolveContent> = {
  en: {
    title: "Dissolve your corporation online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files Articles of Dissolution for Ontario (OBCA) and federal (CBCA) corporations. You answer a few questions about the corporation, its debts and its assets, and we prepare the filing, submit it to the right registry and send you the confirmation once the corporation is dissolved. If you want to understand every step first, read our guide on ",
          { text: "how to dissolve a corporation in Ontario", href: "/guides/how-to-dissolve-a-corporation-in-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Corporations that never started carrying on business and have no assets or debts.",
          "Corporations that have stopped operating, paid their debts and distributed what was left to the shareholders.",
          "Owners who want to stop the annual return and tax filing obligations of a corporation they no longer use.",
        ],
      },
      { type: "h3", text: "What we file and what you confirm" },
      {
        type: "p",
        parts: [
          "We prepare the Articles of Dissolution and file them with the Ontario Business Registry or Corporations Canada, depending on where the corporation was incorporated. You confirm that the shareholders have approved the dissolution (normally by special resolution), that the corporation's debts are paid or provided for, and that its remaining property has been distributed. The corporation's final tax returns and the closing of its CRA program accounts are handled with your accountant.",
        ],
      },
      { type: "h3", text: "Before you file" },
      {
        type: "list",
        items: [
          "Settle the CRA side first: final corporate tax return, and closing the GST/HST and payroll accounts if the corporation had them.",
          "Distribute or sell any property still held by the corporation. Property left in a dissolved corporation can be forfeited to the Crown.",
          "Keep the minute book and financial records after dissolution. The CRA can still review the final years.",
        ],
      },
      {
        type: "p",
        parts: [
          "Think carefully before filing: a federal corporation can later be revived, but an Ontario corporation that dissolves voluntarily generally cannot be revived under the OBCA. In Ontario, ",
          { text: "Articles of Revival", href: "/services/revive-business" },
          " are for corporations the registry dissolved for default, such as unfiled annual returns.",
        ],
      },
    ],
    faqTitle: "Dissolving a corporation: common questions",
    faq: [
      {
        q: "Is it enough to just stop using the corporation?",
        a: "No. An inactive corporation still exists, so its annual return and tax filing obligations keep running. If they are missed, the registry can eventually dissolve it for default, but that leaves loose ends. A voluntary dissolution closes the corporation on your terms.",
      },
      {
        q: "Do I need to file final tax returns before dissolving?",
        a: "Yes, that is the safer order. File the final corporate tax return and close the GST/HST and payroll accounts before the dissolution, because once the corporation no longer exists it cannot file or be reassessed cleanly. Your accountant should confirm the CRA side is closed.",
      },
      {
        q: "What happens to property left in the corporation?",
        a: "Property a corporation still owns when it is dissolved can be forfeited to the Crown. Before filing, distribute the remaining assets to the shareholders or sell them, and pay or provide for the corporation's debts.",
      },
      {
        q: "Can a dissolved corporation be brought back?",
        a: "It depends. A federal corporation can be revived under the CBCA. In Ontario, Articles of Revival are available to corporations the registry dissolved for default, such as missed annual returns, but a voluntary dissolution generally cannot be undone that way. Treat an Ontario voluntary dissolution as permanent.",
      },
    ],
  },
  fr: {
    title: "Dissolvez votre société en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose les statuts de dissolution des sociétés ontariennes (LSAO) et fédérales (LCSA). Vous répondez à quelques questions sur la société, ses dettes et ses biens, et nous préparons le dépôt, le soumettons au bon registre et vous transmettons la confirmation une fois la société dissoute. Pour comprendre chaque étape d'abord, lisez notre guide sur ",
          { text: "la dissolution d'une société en Ontario", href: "/guides/comment-dissoudre-une-societe-en-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés qui n'ont jamais commencé leurs activités et n'ont ni biens ni dettes.",
          "Les sociétés qui ont cessé leurs activités, payé leurs dettes et distribué le reliquat aux actionnaires.",
          "Les propriétaires qui veulent mettre fin aux déclarations annuelles et aux obligations fiscales d'une société qu'ils n'utilisent plus.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous confirmez" },
      {
        type: "p",
        parts: [
          "Nous préparons les statuts de dissolution et les déposons auprès du Registre des entreprises de l'Ontario ou de Corporations Canada, selon le lieu de constitution de la société. Vous confirmez que les actionnaires ont approuvé la dissolution (normalement par résolution spéciale), que les dettes de la société sont payées ou prévues, et que ses biens restants ont été distribués. Les dernières déclarations fiscales de la société et la fermeture de ses comptes de programme de l'ARC se font avec votre comptable.",
        ],
      },
      { type: "h3", text: "Avant de déposer" },
      {
        type: "list",
        items: [
          "Réglez d'abord le volet ARC : dernière déclaration de revenus de la société, et fermeture des comptes de TPS/TVH et de retenues sur la paie, le cas échéant.",
          "Distribuez ou vendez les biens que la société détient encore. Les biens laissés dans une société dissoute peuvent être confisqués au profit de la Couronne.",
          "Conservez le livre des procès-verbaux et les registres financiers après la dissolution. L'ARC peut encore examiner les dernières années.",
        ],
      },
      {
        type: "p",
        parts: [
          "Réfléchissez bien avant de déposer : une société fédérale peut être reconstituée plus tard, mais une société ontarienne dissoute volontairement ne peut généralement pas être reconstituée en vertu de la LSAO. En Ontario, les ",
          { text: "statuts de reconstitution", href: "/services/revive-business" },
          " visent les sociétés dissoutes par le registre pour défaut, par exemple pour des rapports annuels non déposés.",
        ],
      },
    ],
    faqTitle: "Dissoudre une société : questions fréquentes",
    faq: [
      {
        q: "Suffit-il de cesser d'utiliser la société?",
        a: "Non. Une société inactive existe toujours, de sorte que ses déclarations annuelles et ses obligations fiscales continuent de s'appliquer. Si elles ne sont pas respectées, le registre peut finir par la dissoudre pour défaut, ce qui laisse des questions en suspens. Une dissolution volontaire ferme la société selon vos conditions.",
      },
      {
        q: "Faut-il produire les dernières déclarations fiscales avant la dissolution?",
        a: "Oui, c'est l'ordre le plus sûr. Produisez la dernière déclaration de revenus de la société et fermez les comptes de TPS/TVH et de retenues sur la paie avant la dissolution, car une fois la société disparue, elle ne peut plus produire de déclarations ni faire l'objet d'une nouvelle cotisation proprement. Votre comptable devrait confirmer que tout est réglé avec l'ARC.",
      },
      {
        q: "Qu'arrive-t-il aux biens laissés dans la société?",
        a: "Les biens qu'une société possède encore au moment de sa dissolution peuvent être confisqués au profit de la Couronne. Avant le dépôt, distribuez les biens restants aux actionnaires ou vendez-les, et payez ou prévoyez les dettes de la société.",
      },
      {
        q: "Une société dissoute peut-elle être reconstituée?",
        a: "Cela dépend. Une société fédérale peut être reconstituée en vertu de la LCSA. En Ontario, les statuts de reconstitution s'offrent aux sociétés dissoutes par le registre pour défaut, par exemple pour des rapports annuels non déposés, mais une dissolution volontaire ne peut généralement pas être annulée de cette façon. Considérez une dissolution volontaire en Ontario comme définitive.",
      },
    ],
  },
  es: {
    title: "Disuelva su sociedad en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta los artículos de disolución de sociedades de Ontario (OBCA) y federales (CBCA). Usted responde algunas preguntas sobre la sociedad, sus deudas y sus bienes, y nosotros preparamos la presentación, la enviamos al registro correspondiente y le enviamos la confirmación cuando la sociedad queda disuelta. Si quiere entender cada paso primero, lea nuestra guía sobre ",
          { text: "cómo disolver una sociedad en Ontario", href: "/guides/como-disolver-una-sociedad-en-ontario" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades que nunca comenzaron a operar y no tienen bienes ni deudas.",
          "Sociedades que dejaron de operar, pagaron sus deudas y distribuyeron el remanente entre los accionistas.",
          "Propietarios que quieren poner fin a las declaraciones anuales y obligaciones fiscales de una sociedad que ya no usan.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué confirma usted" },
      {
        type: "p",
        parts: [
          "Preparamos los artículos de disolución y los presentamos ante el Registro de Empresas de Ontario o Corporations Canada, según dónde se constituyó la sociedad. Usted confirma que los accionistas aprobaron la disolución (normalmente mediante una resolución especial), que las deudas de la sociedad están pagadas o previstas y que sus bienes restantes se distribuyeron. Las últimas declaraciones de impuestos de la sociedad y el cierre de sus cuentas de programa ante la CRA se gestionan con su contador.",
        ],
      },
      { type: "h3", text: "Antes de presentar" },
      {
        type: "list",
        items: [
          "Resuelva primero lo relativo a la CRA: la última declaración de impuestos de la sociedad y el cierre de las cuentas de GST/HST y de nómina, si las tenía.",
          "Distribuya o venda los bienes que la sociedad aún tenga. Los bienes que queden en una sociedad disuelta pueden pasar a la Corona.",
          "Conserve el libro de actas y los registros financieros después de la disolución. La CRA todavía puede revisar los últimos años.",
        ],
      },
      {
        type: "p",
        parts: [
          "Piénselo bien antes de presentar: una sociedad federal puede reactivarse más adelante, pero una sociedad de Ontario disuelta voluntariamente por lo general no puede reactivarse en virtud de la OBCA. En Ontario, los ",
          { text: "artículos de reactivación", href: "/services/revive-business" },
          " son para sociedades que el registro disolvió por incumplimiento, por ejemplo por no presentar las declaraciones anuales.",
        ],
      },
    ],
    faqTitle: "Disolver una sociedad: preguntas frecuentes",
    faq: [
      {
        q: "¿Basta con dejar de usar la sociedad?",
        a: "No. Una sociedad inactiva sigue existiendo, por lo que sus declaraciones anuales y obligaciones fiscales continúan. Si no se cumplen, el registro puede acabar disolviéndola por incumplimiento, lo que deja asuntos pendientes. Una disolución voluntaria cierra la sociedad en sus propios términos.",
      },
      {
        q: "¿Hay que presentar las últimas declaraciones de impuestos antes de disolver?",
        a: "Sí, es el orden más seguro. Presente la última declaración de impuestos de la sociedad y cierre las cuentas de GST/HST y de nómina antes de la disolución, porque una vez que la sociedad deja de existir no puede presentar declaraciones ni ser reevaluada con normalidad. Su contador debería confirmar que todo está cerrado con la CRA.",
      },
      {
        q: "¿Qué pasa con los bienes que quedan en la sociedad?",
        a: "Los bienes que una sociedad todavía posea al disolverse pueden pasar a la Corona. Antes de presentar, distribuya los bienes restantes entre los accionistas o véndalos, y pague o prevea las deudas de la sociedad.",
      },
      {
        q: "¿Se puede recuperar una sociedad disuelta?",
        a: "Depende. Una sociedad federal puede reactivarse en virtud de la CBCA. En Ontario, los artículos de reactivación están disponibles para sociedades que el registro disolvió por incumplimiento, por ejemplo por no presentar las declaraciones anuales, pero una disolución voluntaria por lo general no puede revertirse de esa forma. Considere definitiva una disolución voluntaria en Ontario.",
      },
    ],
  },
};
