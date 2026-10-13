import type { Article, ArticleInline, ArticleSection } from "../articles";

// Ontario Articles of Amendment guide (en/fr/es). Targets "articles of
// amendment ontario" and feeds /services/articles-amendment. Facts mirror the
// verified service copy in src/lib/serviceContent/articles-amendment.ts:
// OBCA s. 168, special resolution (two-thirds of votes cast), separate class
// votes, Ontario-biased NUANS for a new word name, $150 Ontario fee, effective
// on the certificate date, director changes go by notice. Verified 2026-10-12.

// Paragraph with inline links; the plain `text` is derived from the parts.
function p(...parts: ArticleInline[]): ArticleSection {
  return {
    type: "paragraph",
    text: parts.map((x) => (typeof x === "string" ? x : x.text)).join(""),
    parts,
  };
}

const PUBLISHED_AT = "2026-10-12T14:00:00-04:00";
const UPDATED = "2026-10-12";

const en: Article = {
  slug: "articles-of-amendment-ontario",
  locale: "en",
  group: "articles-amendment-ontario",
  category: "Compliance & Maintenance",
  title: "Articles of Amendment in Ontario: When You Need Them and How to File",
  excerpt:
    "Changing an Ontario corporation's name, share structure or number of directors means filing Articles of Amendment. Here is what they cover, the shareholder approval required, the $150 government fee, and how the filing works.",
  metaTitle: "Articles of Amendment Ontario: Approval, Fee and Filing | Korporex",
  metaDescription:
    "Articles of Amendment change an Ontario corporation's name, share classes or number of directors. The special resolution, NUANS rules, $150 fee and filing steps.",
  readTime: "6 min read",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "A corporation's articles are not fixed forever. When an Ontario corporation needs a new name, a different share structure or a different number of directors, it changes its articles by filing Articles of Amendment under section 168 of the Ontario Business Corporations Act. Here is what can be changed, what approval is needed first, and how the filing works.",
    },
    { type: "heading", id: "what-they-change", text: "What Articles of Amendment change" },
    p(
      "Articles of Amendment change what is set out in the ",
      { text: "articles of incorporation", href: "/guides/what-are-articles-of-incorporation" },
      " themselves. The most common amendments are:"
    ),
    {
      type: "list",
      items: [
        "Changing the corporate name, including from a numbered name to a word name.",
        "Adding, removing or reorganizing share classes, or changing the voting, dividend, redemption or other rights attached to them.",
        "Changing the fixed number, or the minimum and maximum number, of directors.",
        "Adding or removing restrictions on the business the corporation may carry on, or changing other provisions of the articles.",
      ],
    },
    {
      type: "callout",
      title: "What does not need an amendment",
      text: "Changing who the directors or officers are does not change the articles. A new director, a resignation or a new registered office address is reported by a Notice of Change, not by Articles of Amendment.",
    },
    { type: "heading", id: "approval", text: "The approval: a special resolution" },
    {
      type: "paragraph",
      text: "Before anything is filed, the shareholders must authorize the amendment by special resolution. That means a resolution passed by at least two-thirds of the votes cast at a meeting, or signed by all the shareholders entitled to vote. Where an amendment affects a particular class or series of shares, such as a change to its rights, the holders of that class or series can also be entitled to vote on it separately.",
    },
    {
      type: "paragraph",
      text: "Keep the signed resolution in the corporation's minute book. The filing reports that the resolution was passed and its date, and the minute book is where that resolution lives afterwards.",
    },
    { type: "heading", id: "name-changes", text: "Name changes and NUANS" },
    p(
      "Changing to a new word name needs an Ontario-biased NUANS name search report for that name. A federally biased report is not accepted in Ontario. Changing to a number name needs no report. Our guide on the ",
      { text: "Ontario NUANS report", href: "/guides/nuans-report-ontario" },
      " explains how to order one and what to enter when filing."
    ),
    { type: "heading", id: "directors", text: "Changing the number of directors" },
    {
      type: "paragraph",
      text: "If the amendment changes the number of directors in the articles, the new number must respect the statutory minimum: at least one director, or at least three for an Ontario offering corporation. The articles can set a fixed number or a minimum and a maximum.",
    },
    { type: "heading", id: "filing", text: "Filing, fee and effective date" },
    {
      type: "paragraph",
      text: "Articles of Amendment for an Ontario corporation are filed through the Ontario Business Registry. The government fee is $150. The amendment takes effect on the date shown on the certificate of amendment, and from that date the amended provisions form part of the corporation's articles.",
    },
    {
      type: "table",
      head: ["Step", "What happens"],
      rows: [
        ["1. Decide the change", "Identify exactly which provision of the articles is changing and draft the new wording."],
        ["2. NUANS (name changes only)", "Order an Ontario-biased NUANS report for a new word name."],
        ["3. Special resolution", "Shareholders approve by at least two-thirds of the votes cast, with separate class votes where required."],
        ["4. File", "Submit Articles of Amendment through the Ontario Business Registry and pay the $150 fee."],
        ["5. Update records", "Place the certificate of amendment and the resolution in the minute book."],
      ],
    },
    { type: "heading", id: "federal", text: "Federal corporations" },
    {
      type: "paragraph",
      text: "A federal corporation amends its articles under section 173 of the Canada Business Corporations Act instead, by filing Form 4 with Corporations Canada. The federal fee is $200 to file online, and some federal amendments are free, such as adding an English or French version of the name.",
    },
    { type: "heading", id: "getting-it-done", text: "Getting it done" },
    p(
      "Korporex prepares and files ",
      { text: "Articles of Amendment", href: "/services/articles-amendment" },
      " for Ontario and federal corporations: you describe the change in plain language, and the formal amendment wording is drafted and filed for you. If the only change is the name, the ",
      { text: "change of name service", href: "/services/change-name" },
      " is built for that filing, and a proposed name can be checked first with a ",
      { text: "NUANS report", href: "/nuans" },
      "."
    ),
    {
      type: "paragraph",
      text: "Korporex is not a law firm and this guide is general information, not legal advice. A share reorganization in particular can have tax consequences, so talk to a lawyer or accountant about your corporation's specific situation.",
    },
  ],
  faq: [
    {
      q: "How much does it cost to file Articles of Amendment in Ontario?",
      a: "The Ontario government fee is $150. A federal corporation pays $200 to file online with Corporations Canada, with some federal amendments free. A filing service charges its own fee on top.",
    },
    {
      q: "What approval is needed to amend the articles?",
      a: "A special resolution of the shareholders: at least two-thirds of the votes cast, or signed by all shareholders entitled to vote. A class or series of shares affected by the amendment can also get a separate vote.",
    },
    {
      q: "Do I need Articles of Amendment to change directors?",
      a: "No. Changing who the directors are is reported by a Notice of Change. Articles of Amendment are only needed to change something in the articles, such as the minimum and maximum number of directors.",
    },
    {
      q: "Do I need a NUANS report to change my corporation's name in Ontario?",
      a: "Yes, for a new word name: an Ontario-biased NUANS report is required. A change to a number name needs no report.",
    },
    {
      q: "When does the amendment take effect?",
      a: "On the date shown on the certificate of amendment issued by the registry.",
    },
  ],
};

const fr: Article = {
  slug: "statuts-de-modification-ontario",
  locale: "fr",
  group: "articles-amendment-ontario",
  category: "Compliance & Maintenance",
  title: "Statuts de modification en Ontario : quand en avez-vous besoin et comment les déposer",
  excerpt:
    "Changer la dénomination, la structure du capital ou le nombre d'administrateurs d'une société ontarienne exige le dépôt de statuts de modification. Voici ce qu'ils couvrent, l'approbation requise des actionnaires, les frais de 150 $ et le déroulement du dépôt.",
  metaTitle: "Statuts de modification en Ontario : approbation, frais et dépôt | Korporex",
  metaDescription:
    "Les statuts de modification changent la dénomination, les catégories d'actions ou le nombre d'administrateurs d'une société ontarienne. Résolution spéciale, NUANS, frais de 150 $ et étapes.",
  readTime: "6 min de lecture",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Les statuts d'une société ne sont pas figés pour toujours. Lorsqu'une société ontarienne a besoin d'une nouvelle dénomination, d'une autre structure de capital ou d'un nombre différent d'administrateurs, elle modifie ses statuts en déposant des statuts de modification en vertu de l'article 168 de la Loi sur les sociétés par actions de l'Ontario. Voici ce qui peut être modifié, l'approbation requise au préalable et le déroulement du dépôt.",
    },
    { type: "heading", id: "ce-quils-modifient", text: "Ce que modifient les statuts de modification" },
    p(
      "Les statuts de modification changent ce qui figure dans les ",
      { text: "statuts constitutifs", href: "/guides/que-sont-les-statuts-constitutifs" },
      " eux-mêmes. Les modifications les plus courantes sont :"
    ),
    {
      type: "list",
      items: [
        "Changer la dénomination sociale, y compris passer d'une dénomination numérique à une dénomination nominative.",
        "Ajouter, supprimer ou réorganiser des catégories d'actions, ou modifier les droits de vote, de dividende, de rachat ou autres qui s'y rattachent.",
        "Changer le nombre fixe, ou les nombres minimal et maximal, d'administrateurs.",
        "Ajouter ou supprimer des restrictions sur les activités que la société peut exercer, ou modifier d'autres dispositions des statuts.",
      ],
    },
    {
      type: "callout",
      title: "Ce qui n'exige pas de modification",
      text: "Changer l'identité des administrateurs ou des dirigeants ne modifie pas les statuts. Un nouvel administrateur, une démission ou une nouvelle adresse du siège social se déclarent par un avis de modification, et non par des statuts de modification.",
    },
    { type: "heading", id: "approbation", text: "L'approbation : une résolution spéciale" },
    {
      type: "paragraph",
      text: "Avant tout dépôt, les actionnaires doivent autoriser la modification par résolution spéciale, c'est-à-dire une résolution adoptée par au moins les deux tiers des voix exprimées lors d'une assemblée, ou signée par tous les actionnaires habiles à voter. Lorsqu'une modification touche une catégorie ou une série d'actions en particulier, par exemple un changement à ses droits, les détenteurs de cette catégorie ou série peuvent aussi avoir droit à un vote distinct.",
    },
    {
      type: "paragraph",
      text: "Conservez la résolution signée dans le livre des procès-verbaux de la société. Le dépôt indique que la résolution a été adoptée et à quelle date, et c'est dans le livre des procès-verbaux qu'elle est conservée ensuite.",
    },
    { type: "heading", id: "changement-de-denomination", text: "Changement de dénomination et NUANS" },
    p(
      "Passer à une nouvelle dénomination nominative exige un rapport de recherche NUANS à pondération ontarienne pour cette dénomination. Un rapport à pondération fédérale n'est pas accepté en Ontario. Passer à une dénomination numérique n'exige aucun rapport. Notre guide sur le ",
      { text: "rapport NUANS en Ontario", href: "/guides/rapport-nuans-ontario" },
      " explique comment en commander un et quoi inscrire au moment du dépôt."
    ),
    { type: "heading", id: "administrateurs", text: "Changer le nombre d'administrateurs" },
    {
      type: "paragraph",
      text: "Si la modification change le nombre d'administrateurs prévu aux statuts, le nouveau nombre doit respecter le minimum légal : au moins un administrateur, ou au moins trois pour une société ontarienne faisant appel public à l'épargne. Les statuts peuvent fixer un nombre précis ou un minimum et un maximum.",
    },
    { type: "heading", id: "depot", text: "Dépôt, frais et date d'effet" },
    {
      type: "paragraph",
      text: "Les statuts de modification d'une société ontarienne se déposent par l'intermédiaire du Registre des entreprises de l'Ontario. Les frais gouvernementaux sont de 150 $. La modification prend effet à la date indiquée sur le certificat de modification et, dès cette date, les dispositions modifiées font partie des statuts de la société.",
    },
    {
      type: "table",
      head: ["Étape", "Ce qui se passe"],
      rows: [
        ["1. Définir le changement", "Déterminer précisément quelle disposition des statuts change et rédiger le nouveau libellé."],
        ["2. NUANS (changement de dénomination seulement)", "Commander un rapport NUANS à pondération ontarienne pour une nouvelle dénomination nominative."],
        ["3. Résolution spéciale", "Les actionnaires approuvent par au moins les deux tiers des voix exprimées, avec des votes distincts par catégorie au besoin."],
        ["4. Dépôt", "Déposer les statuts de modification par le Registre des entreprises de l'Ontario et payer les frais de 150 $."],
        ["5. Mise à jour des registres", "Placer le certificat de modification et la résolution dans le livre des procès-verbaux."],
      ],
    },
    { type: "heading", id: "societes-federales", text: "Sociétés fédérales" },
    {
      type: "paragraph",
      text: "Une société fédérale modifie plutôt ses statuts en vertu de l'article 173 de la Loi canadienne sur les sociétés par actions, en déposant le formulaire 4 auprès de Corporations Canada. Les frais fédéraux sont de 200 $ pour un dépôt en ligne, et certaines modifications fédérales sont gratuites, comme l'ajout d'une version française ou anglaise de la dénomination.",
    },
    { type: "heading", id: "le-faire", text: "Passer à l'action" },
    p(
      "Korporex prépare et dépose des ",
      { text: "statuts de modification", href: "/services/articles-amendment" },
      " pour les sociétés ontariennes et fédérales : vous décrivez le changement en langage courant, et le libellé officiel de la modification est rédigé et déposé pour vous. Si seule la dénomination change, le ",
      { text: "service de changement de dénomination", href: "/services/change-name" },
      " est conçu pour ce dépôt, et une dénomination proposée peut d'abord être vérifiée au moyen d'un ",
      { text: "rapport NUANS", href: "/nuans" },
      "."
    ),
    {
      type: "paragraph",
      text: "Korporex n'est pas un cabinet d'avocats et ce guide est de l'information générale, et non un avis juridique. Une réorganisation du capital en particulier peut avoir des conséquences fiscales; consultez un avocat ou un comptable au sujet de la situation précise de votre société.",
    },
  ],
  faq: [
    {
      q: "Combien coûte le dépôt de statuts de modification en Ontario?",
      a: "Les frais gouvernementaux de l'Ontario sont de 150 $. Une société fédérale paie 200 $ pour un dépôt en ligne auprès de Corporations Canada, certaines modifications fédérales étant gratuites. Un service de dépôt facture ses propres honoraires en plus.",
    },
    {
      q: "Quelle approbation faut-il pour modifier les statuts?",
      a: "Une résolution spéciale des actionnaires : au moins les deux tiers des voix exprimées, ou signée par tous les actionnaires habiles à voter. Une catégorie ou série d'actions touchée par la modification peut aussi avoir un vote distinct.",
    },
    {
      q: "Faut-il des statuts de modification pour changer d'administrateurs?",
      a: "Non. Un changement d'administrateurs se déclare par un avis de modification. Les statuts de modification ne sont nécessaires que pour changer un élément des statuts, comme le nombre minimal et maximal d'administrateurs.",
    },
    {
      q: "Faut-il un rapport NUANS pour changer la dénomination de ma société en Ontario?",
      a: "Oui, pour une nouvelle dénomination nominative : un rapport NUANS à pondération ontarienne est exigé. Le passage à une dénomination numérique n'exige aucun rapport.",
    },
    {
      q: "Quand la modification prend-elle effet?",
      a: "À la date indiquée sur le certificat de modification délivré par le registre.",
    },
  ],
};

const es: Article = {
  slug: "estatutos-de-modificacion-ontario",
  locale: "es",
  group: "articles-amendment-ontario",
  category: "Compliance & Maintenance",
  title: "Estatutos de modificación en Ontario: cuándo se necesitan y cómo presentarlos",
  excerpt:
    "Cambiar el nombre, la estructura de acciones o el número de directores de una sociedad de Ontario exige presentar estatutos de modificación (Articles of Amendment). Esto es lo que cubren, la aprobación de los accionistas, la tasa de 150 $ y cómo se presentan.",
  metaTitle: "Estatutos de modificación en Ontario: aprobación, tasa y trámite | Korporex",
  metaDescription:
    "Los estatutos de modificación (Articles of Amendment) cambian el nombre, las clases de acciones o el número de directores de una sociedad de Ontario. Resolución especial, NUANS, tasa de 150 $ y pasos.",
  readTime: "6 min de lectura",
  updated: UPDATED,
  publishedAt: PUBLISHED_AT,
  content: [
    {
      type: "paragraph",
      text: "Los estatutos de una sociedad no quedan fijos para siempre. Cuando una sociedad de Ontario necesita un nombre nuevo, otra estructura de acciones o un número distinto de directores, modifica sus estatutos presentando estatutos de modificación (Articles of Amendment) según el artículo 168 de la Business Corporations Act de Ontario. Esto es lo que se puede cambiar, la aprobación que se necesita antes y cómo funciona la presentación.",
    },
    { type: "heading", id: "que-cambian", text: "Qué cambian los estatutos de modificación" },
    p(
      "Los estatutos de modificación cambian lo que figura en los propios ",
      { text: "estatutos de constitución", href: "/guides/que-son-los-estatutos-de-constitucion" },
      ". Las modificaciones más habituales son:"
    ),
    {
      type: "list",
      items: [
        "Cambiar el nombre de la sociedad, incluido el paso de un nombre numerado a un nombre con palabras.",
        "Añadir, eliminar o reorganizar clases de acciones, o cambiar los derechos de voto, dividendo, rescate u otros que llevan aparejados.",
        "Cambiar el número fijo, o el número mínimo y máximo, de directores.",
        "Añadir o eliminar restricciones sobre la actividad que puede ejercer la sociedad, o cambiar otras disposiciones de los estatutos.",
      ],
    },
    {
      type: "callout",
      title: "Lo que no requiere modificación",
      text: "Cambiar quiénes son los directores o funcionarios no modifica los estatutos. Un nuevo director, una renuncia o un nuevo domicilio social se comunican mediante un aviso de cambio, no con estatutos de modificación.",
    },
    { type: "heading", id: "aprobacion", text: "La aprobación: una resolución especial" },
    {
      type: "paragraph",
      text: "Antes de presentar nada, los accionistas deben autorizar la modificación por resolución especial, es decir, una resolución aprobada por al menos dos tercios de los votos emitidos en una junta, o firmada por todos los accionistas con derecho a voto. Cuando una modificación afecta a una clase o serie concreta de acciones, por ejemplo un cambio en sus derechos, los titulares de esa clase o serie también pueden tener derecho a votarla por separado.",
    },
    {
      type: "paragraph",
      text: "Guarde la resolución firmada en el libro de actas de la sociedad. La presentación indica que la resolución se aprobó y en qué fecha, y el libro de actas es donde queda archivada después.",
    },
    { type: "heading", id: "cambio-de-nombre", text: "Cambios de nombre y NUANS" },
    p(
      "Cambiar a un nuevo nombre con palabras exige un informe de búsqueda NUANS con ponderación ontariana para ese nombre. Un informe con ponderación federal no se acepta en Ontario. Cambiar a un nombre numerado no requiere informe. Nuestra guía sobre el ",
      { text: "informe NUANS en Ontario", href: "/guides/informe-nuans-ontario" },
      " explica cómo pedirlo y qué introducir al presentar."
    ),
    { type: "heading", id: "directores", text: "Cambiar el número de directores" },
    {
      type: "paragraph",
      text: "Si la modificación cambia el número de directores de los estatutos, el nuevo número debe respetar el mínimo legal: al menos un director, o al menos tres para una sociedad de Ontario que hace oferta pública. Los estatutos pueden fijar un número exacto o un mínimo y un máximo.",
    },
    { type: "heading", id: "presentacion", text: "Presentación, tasa y fecha de efecto" },
    {
      type: "paragraph",
      text: "Los estatutos de modificación de una sociedad de Ontario se presentan a través del Ontario Business Registry. La tasa gubernamental es de 150 $. La modificación surte efecto en la fecha que figura en el certificado de modificación, y desde esa fecha las disposiciones modificadas forman parte de los estatutos de la sociedad.",
    },
    {
      type: "table",
      head: ["Paso", "Qué ocurre"],
      rows: [
        ["1. Definir el cambio", "Identificar exactamente qué disposición de los estatutos cambia y redactar el nuevo texto."],
        ["2. NUANS (solo cambios de nombre)", "Pedir un informe NUANS con ponderación ontariana para un nuevo nombre con palabras."],
        ["3. Resolución especial", "Los accionistas aprueban por al menos dos tercios de los votos emitidos, con votos separados por clase cuando corresponda."],
        ["4. Presentación", "Presentar los estatutos de modificación a través del Ontario Business Registry y pagar la tasa de 150 $."],
        ["5. Actualizar registros", "Archivar el certificado de modificación y la resolución en el libro de actas."],
      ],
    },
    { type: "heading", id: "sociedades-federales", text: "Sociedades federales" },
    {
      type: "paragraph",
      text: "Una sociedad federal modifica sus estatutos según el artículo 173 de la Canada Business Corporations Act, presentando el formulario 4 ante Corporations Canada. La tasa federal es de 200 $ en línea, y algunas modificaciones federales son gratuitas, como añadir una versión en inglés o francés del nombre.",
    },
    { type: "heading", id: "hacerlo", text: "Cómo resolverlo" },
    p(
      "Korporex prepara y presenta ",
      { text: "estatutos de modificación", href: "/services/articles-amendment" },
      " para sociedades de Ontario y federales: usted describe el cambio con sus propias palabras, y el texto formal de la modificación se redacta y presenta por usted. Si solo cambia el nombre, el ",
      { text: "servicio de cambio de nombre", href: "/services/change-name" },
      " está pensado para ese trámite, y un nombre propuesto puede comprobarse antes con un ",
      { text: "informe NUANS", href: "/nuans" },
      "."
    ),
    {
      type: "paragraph",
      text: "Korporex no es un despacho de abogados y esta guía es información general, no asesoramiento jurídico. Una reorganización de acciones en particular puede tener consecuencias fiscales; consulte a un abogado o a un contador sobre la situación concreta de su sociedad.",
    },
  ],
  faq: [
    {
      q: "¿Cuánto cuesta presentar estatutos de modificación en Ontario?",
      a: "La tasa del gobierno de Ontario es de 150 $. Una sociedad federal paga 200 $ por presentarlos en línea ante Corporations Canada, y algunas modificaciones federales son gratuitas. Un servicio de presentación cobra sus propios honorarios aparte.",
    },
    {
      q: "¿Qué aprobación se necesita para modificar los estatutos?",
      a: "Una resolución especial de los accionistas: al menos dos tercios de los votos emitidos, o firmada por todos los accionistas con derecho a voto. Una clase o serie de acciones afectada por la modificación también puede tener un voto separado.",
    },
    {
      q: "¿Necesito estatutos de modificación para cambiar de directores?",
      a: "No. Un cambio de directores se comunica con un aviso de cambio. Los estatutos de modificación solo hacen falta para cambiar algo de los estatutos, como el número mínimo y máximo de directores.",
    },
    {
      q: "¿Necesito un informe NUANS para cambiar el nombre de mi sociedad en Ontario?",
      a: "Sí, para un nuevo nombre con palabras: se exige un informe NUANS con ponderación ontariana. Cambiar a un nombre numerado no requiere informe.",
    },
    {
      q: "¿Cuándo surte efecto la modificación?",
      a: "En la fecha que figura en el certificado de modificación emitido por el registro.",
    },
  ],
};

export const articlesAmendmentOntario: Article[] = [en, fr, es];
