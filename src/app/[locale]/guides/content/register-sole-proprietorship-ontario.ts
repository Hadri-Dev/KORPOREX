import type { ArticleInline, ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

// Builds a paragraph whose plain `text` is always the exact concatenation of
// its parts, so linked and unlinked renderings never drift apart.
function p(...parts: ArticleInline[]): ArticleSection {
  const text = parts.map((x) => (typeof x === "string" ? x : x.text)).join("");
  return parts.some((x) => typeof x !== "string") ? { type: "paragraph", text, parts } : { type: "paragraph", text };
}

function L(text: string, href: string): ArticleInline {
  return { text, href };
}

export const expanded: Record<"en" | "fr" | "es", ExpandedArticle> = {
  // ── English ──
  en: {
    readTime: "8 min read",
    content: [
      p("To register a sole proprietorship in Ontario, the owner registers the business name through the Ontario Business Registry. Online registration costs $60 and is processed immediately, and the registration expires every five years. Registration is needed when the business operates under a name other than the owner's own name. A sole proprietor who trades only under their own name has no business name to register with the province, although tax registrations with the Canada Revenue Agency (CRA) can still apply."),
      p("This guide covers how to register a sole proprietorship in Ontario step by step: when registration is required, what it costs, what the Ontario Business Identification Number (BIN) is and how it differs from a CRA business number, when GST/HST registration comes into play, and how renewal works. For an overview of every business structure and how each one is registered, see the ", L("guide to registering a business in Ontario", "/guides/how-to-register-a-business-in-ontario"), "."),
      { type: "heading", id: "what-is-a-sole-proprietorship", text: "What a sole proprietorship is in Ontario" },
      p("A sole proprietorship is a business owned and run by one individual, with no separate legal entity behind it. The Ontario government's description of the structure sets out its two defining features: the owner is responsible for all debts and losses of the business, and creditors can take the owner's personal assets as well as the business to pay those debts. On the tax side, the business income is taxable at the owner's personal rate, and business losses and expenses can be deducted from the owner's personal income."),
      p("Because there is no separate entity, there is nothing to incorporate and no articles to file. The only provincial filing tied to a sole proprietorship is the registration of its business name, and that filing exists only when a business name is used."),
      { type: "heading", id: "when-registration-is-required", text: "When you have to register a sole proprietorship in Ontario" },
      p("Ontario's guidance is direct: a sole proprietorship needs to be registered if the owner is not using their own name as the business name. The rule comes from Ontario's Business Names Act, which governs the registration of names used by individuals, partnerships and corporations."),
      p("In practice, the line falls between the owner's own name and anything else. A few examples show how it works."),
      {
        type: "table",
        head: ["Name the business uses", "Business name registration in Ontario"],
        rows: [
          ["Jane Smith (the owner's own name only)", "Not required"],
          ["Jane Smith Consulting", "Required, since words are added to the owner's name"],
          ["Maplewind Studio", "Required, since it is a name other than the owner's"],
          ["JS Design", "Required, since it is a name other than the owner's"],
        ],
      },
      p("The same name can also appear on a website, invoices, signage or social media profiles. Once a business identifies itself to the public under a name other than the owner's own, that name falls within the registration rule."),
      { type: "heading", id: "fees-and-timing", text: "Cost and processing time" },
      p("Ontario publishes a schedule of fees and service times for filings under the Business Names Act. For a sole proprietorship, the figures are as follows."),
      {
        type: "table",
        head: ["Filing", "Online", "By mail"],
        rows: [
          ["New business name registration", "$60, immediate", "$60, 15 business days"],
          ["Renewal", "$60, immediate", "$60, 15 business days"],
          ["Amendment (for example, a new address)", "$0, immediate", "$0, 15 business days"],
          ["Cancellation", "$0, immediate", "$0, 15 business days"],
        ],
      },
      p("These are government fees. A service provider that prepares and files the registration charges its own fee on top."),
      { type: "heading", id: "how-to-register", text: "How to register a sole proprietorship in Ontario, step by step" },
      p("Registration is done online through the Ontario Business Registry. According to Ontario, online registration requires a working email address and a valid debit or credit card for payment, and the process involves creating an Ontario.ca Login and an Ontario Business Account."),
      {
        type: "list",
        items: [
          "Choose the business name. A search of the Ontario Business Registry shows names already registered in the province, which helps avoid a name that is already in use.",
          "Create an Ontario.ca Login and an Ontario Business Account, which give access to the Ontario Business Registry.",
          "Select the business name registration for a sole proprietorship and enter the required details: the business name, the owner's name and address, the business address and a description of the business activity.",
          "Pay the $60 government fee by debit or credit card.",
          "Receive the registration, which includes a 9-digit Ontario Business Identification Number (BIN) and a company key used to make later filings for the business.",
          "Keep the registration with the business records. Banks and suppliers dealing with a business name commonly ask to see it.",
        ],
      },
      p("The registration was formerly known as the Master Business Licence. Ontario now calls it a Business Name Registration, and many banks and forms still use the older name."),
      { type: "heading", id: "bin-vs-bn", text: "Ontario BIN vs CRA business number" },
      p("Two different numbers are often confused at this stage. Ontario states that the 9-digit BIN issued by ServiceOntario is different from the business number (BN) provided by the CRA. Registering a business name in Ontario does not create a CRA business number."),
      {
        type: "table",
        head: ["", "Ontario BIN", "CRA business number (BN)"],
        rows: [
          ["Issued by", "ServiceOntario, through the Ontario Business Registry", "Canada Revenue Agency"],
          ["Purpose", "Identifies the registered business name in Ontario", "Identifies the business for federal tax programs"],
          ["When a sole proprietor gets one", "When the business name is registered", "Only when registering for a CRA program account"],
        ],
      },
      p("The CRA explains that an unincorporated business only needs a BN when it registers for program accounts with the CRA, such as GST/HST or payroll. A sole proprietor with no employees who is not registered for GST/HST does not need a BN. The ", L("guide to getting a CRA business number", "/guides/how-to-get-a-cra-business-number"), " walks through that registration."),
      { type: "heading", id: "gst-hst", text: "GST/HST registration for a sole proprietorship" },
      p("GST/HST is a federal registration with the CRA, separate from the Ontario name registration. Under the CRA's small supplier rules, a business generally remains a small supplier, and does not have to register, as long as its taxable revenues do not exceed $30,000 over four consecutive calendar quarters."),
      {
        type: "list",
        items: [
          "If the $30,000 threshold is exceeded in a single calendar quarter, small supplier status ends in that quarter, and the CRA requires registration and the collection of GST/HST starting with the sale that put the business over the limit.",
          "If the threshold is exceeded over four (or fewer) consecutive calendar quarters, but not in a single quarter, small supplier status ends at the end of the month following that quarter.",
          "A business below the threshold that makes taxable sales in Canada can register voluntarily.",
        ],
      },
      p("The details, including how to calculate the threshold and how to apply, are in the ", L("guide to getting a GST/HST number in Ontario", "/guides/how-to-get-gst-hst-number-ontario"), "."),
      { type: "heading", id: "renewal", text: "Renewing the registration every five years" },
      p("A sole proprietorship registration does not last indefinitely. Ontario states that a Business Name Registration, formerly known as a Master Business Licence, expires every 5 years and needs to be renewed within the window from 6 months before to 60 days after the expiry date. The renewal fee is the same as a new registration: $60 for a sole proprietorship."),
      p("Timing matters. If a registration has been expired for more than 60 days, Ontario does not allow it to be renewed. The owner has to register the same business name again, which produces a new BIN and a new company key."),
      { type: "heading", id: "after-registering", text: "After registering: common next steps" },
      p("Registration of the name is usually one of several administrative steps when a sole proprietorship starts operating. Depending on the business, the list often includes:"),
      {
        type: "list",
        items: [
          "A CRA business number and GST/HST account, once the business registers for a CRA program.",
          "A business bank account in the registered name.",
          "Municipal licences or permits, which depend on the city and the type of business.",
          "Amendments to the registration within the required time if the address or other details change.",
        ],
      },
      p("Separate records for business income and expenses also make it easier to report net business income on the owner's personal tax return, since the business has no tax return of its own. The ", L("business bank account guide", "/guides/how-to-open-a-business-bank-account-canada"), " explains the documents a bank asks a sole proprietor for."),
      { type: "heading", id: "sole-prop-vs-incorporating", text: "Sole proprietorship vs incorporating in Ontario" },
      p("Registering a business name does not change the legal nature of the business. The owner remains personally responsible for its debts, and the income is still taxed at the owner's personal rate. A corporation is different: it is a separate legal entity, its shareholders are generally not liable for its debts, and it files its own corporate tax return."),
      {
        type: "table",
        head: ["Feature", "Sole proprietorship", "Corporation"],
        rows: [
          ["Separate legal entity", "No", "Yes"],
          ["Liability for business debts", "Owner, including personal assets", "Generally the corporation, not the shareholders"],
          ["Provincial filing", "Business name registration, only if a name other than the owner's is used", "Articles of incorporation"],
          ["Income tax", "Owner's personal return, at personal rates", "Corporation's own T2 return"],
        ],
      },
      p("The ", L("sole proprietorship vs corporation guide", "/guides/sole-proprietorship-vs-corporation"), " compares the two in more detail, including cost and ongoing obligations."),
      { type: "heading", id: "korporex", text: "Registering with Korporex" },
      p("Korporex prepares and files the business name registration for a ", L("sole proprietorship in Ontario", "/services/sole-proprietorship"), " online, from the name details to the filed registration. Korporex is a document-preparation service, not a law firm or an accounting firm."),
    ],
    faq: [
      {
        q: "Do I need to register a sole proprietorship in Ontario?",
        a: "Only if the business uses a name other than the owner's own name. Ontario states that a sole proprietorship needs to be registered when the owner is not using their own name as the business name. Trading as \"Jane Smith\" does not require registration; \"Jane Smith Consulting\" or \"Maplewind Studio\" does.",
      },
      {
        q: "How much does it cost to register a sole proprietorship in Ontario?",
        a: "The government fee is $60, online or by mail. Online registration is processed immediately, and mail registration takes about 15 business days. Renewal every five years also costs $60.",
      },
      {
        q: "How long is a sole proprietorship registration valid in Ontario?",
        a: "A Business Name Registration expires every 5 years. It can be renewed from 6 months before to 60 days after the expiry date. After 60 days past expiry, it can no longer be renewed and the name has to be registered again, with a new BIN and company key.",
      },
      {
        q: "Is the Ontario BIN the same as a CRA business number?",
        a: "No. Ontario states that the 9-digit BIN from ServiceOntario is different from the business number (BN) provided by the CRA. An unincorporated business only needs a BN when it registers for a CRA program account such as GST/HST or payroll.",
      },
      {
        q: "Does a sole proprietor have to charge GST/HST?",
        a: "Not while the business is a small supplier. Under the CRA's rules, a business generally remains a small supplier as long as its taxable revenues do not exceed $30,000 over four consecutive calendar quarters. Once it exceeds that threshold, GST/HST registration is required. A business below the threshold can register voluntarily.",
      },
    ],
  },

  // ── Français ──
  fr: {
    readTime: "9 min de lecture",
    content: [
      p("Pour enregistrer une entreprise individuelle en Ontario, le propriétaire enregistre le nom commercial de l'entreprise au moyen du Registre des entreprises de l'Ontario. L'enregistrement en ligne coûte 60 $ et est traité immédiatement, et il expire tous les cinq ans. L'enregistrement est nécessaire lorsque l'entreprise exerce ses activités sous un nom autre que celui du propriétaire. Une personne qui exploite son entreprise uniquement sous son propre nom n'a aucun nom commercial à enregistrer auprès de la province, mais des inscriptions fiscales auprès de l'Agence du revenu du Canada (ARC) peuvent tout de même s'appliquer."),
      p("Ce guide explique, étape par étape, comment enregistrer une entreprise individuelle en Ontario : quand l'enregistrement est obligatoire, ce qu'il coûte, ce qu'est le numéro d'identification d'entreprise de l'Ontario (NIE) et en quoi il diffère du numéro d'entreprise de l'ARC, à quel moment la TPS/TVH entre en jeu et comment fonctionne le renouvellement. Pour un survol de toutes les structures d'entreprise et de la façon d'enregistrer chacune, consultez le guide ", L("comment enregistrer une entreprise en Ontario", "/guides/comment-enregistrer-entreprise-ontario"), "."),
      { type: "heading", id: "what-is-a-sole-proprietorship", text: "Qu'est-ce qu'une entreprise individuelle en Ontario" },
      p("Une entreprise individuelle appartient à une seule personne et est exploitée par elle, sans entité juridique distincte. La description qu'en fait le gouvernement de l'Ontario en présente les deux traits principaux : le propriétaire est responsable de toutes les dettes et pertes de l'entreprise, et les créanciers peuvent saisir ses biens personnels, en plus de l'entreprise, pour se faire payer. Sur le plan fiscal, le revenu de l'entreprise est imposable au taux personnel du propriétaire, et les pertes et dépenses de l'entreprise peuvent être déduites de son revenu personnel."),
      p("Comme il n'y a pas d'entité distincte, il n'y a rien à constituer et aucun statut à déposer. Le seul dépôt provincial lié à une entreprise individuelle est l'enregistrement de son nom commercial, et ce dépôt n'existe que si un nom commercial est utilisé."),
      { type: "heading", id: "when-registration-is-required", text: "Quand faut-il enregistrer une entreprise individuelle en Ontario" },
      p("Les indications de l'Ontario sont claires : une entreprise individuelle doit être enregistrée si le propriétaire n'utilise pas son propre nom comme nom d'entreprise. La règle découle de la Loi sur les noms commerciaux de l'Ontario, qui régit l'enregistrement des noms utilisés par les particuliers, les sociétés de personnes et les sociétés par actions."),
      p("En pratique, la ligne de démarcation se situe entre le nom du propriétaire et tout autre nom. Quelques exemples illustrent la règle."),
      {
        type: "table",
        head: ["Nom utilisé par l'entreprise", "Enregistrement du nom commercial en Ontario"],
        rows: [
          ["Julie Tremblay (le seul nom de la propriétaire)", "Non requis"],
          ["Julie Tremblay Consultation", "Requis, puisque des mots s'ajoutent au nom de la propriétaire"],
          ["Studio Érable", "Requis, puisqu'il s'agit d'un nom autre que celui de la propriétaire"],
          ["JT Design", "Requis, puisqu'il s'agit d'un nom autre que celui de la propriétaire"],
        ],
      },
      p("Le même nom peut aussi figurer sur un site Web, des factures, une enseigne ou des profils de médias sociaux. Dès qu'une entreprise se présente au public sous un nom autre que celui du propriétaire, ce nom est visé par la règle d'enregistrement."),
      { type: "heading", id: "fees-and-timing", text: "Coût et délai de traitement" },
      p("L'Ontario publie un barème des droits et des délais de service pour les dépôts faits en vertu de la Loi sur les noms commerciaux. Pour une entreprise individuelle, les données sont les suivantes."),
      {
        type: "table",
        head: ["Dépôt", "En ligne", "Par la poste"],
        rows: [
          ["Nouvel enregistrement du nom commercial", "60 $, immédiat", "60 $, 15 jours ouvrables"],
          ["Renouvellement", "60 $, immédiat", "60 $, 15 jours ouvrables"],
          ["Modification (par exemple, une nouvelle adresse)", "0 $, immédiat", "0 $, 15 jours ouvrables"],
          ["Annulation", "0 $, immédiat", "0 $, 15 jours ouvrables"],
        ],
      },
      p("Il s'agit de droits gouvernementaux. Un fournisseur de services qui prépare et dépose l'enregistrement exige ses propres honoraires en plus."),
      { type: "heading", id: "how-to-register", text: "Comment enregistrer une entreprise individuelle en Ontario, étape par étape" },
      p("L'enregistrement se fait en ligne dans le Registre des entreprises de l'Ontario. Selon l'Ontario, l'enregistrement en ligne exige une adresse courriel fonctionnelle et une carte de débit ou de crédit valide pour le paiement, et le processus comprend la création d'un compte Connexion Ontario et d'un compte d'entreprise de l'Ontario."),
      {
        type: "list",
        items: [
          "Choisir le nom commercial. Une recherche dans le Registre des entreprises de l'Ontario montre les noms déjà enregistrés dans la province, ce qui aide à éviter un nom déjà utilisé.",
          "Créer un compte Connexion Ontario et un compte d'entreprise de l'Ontario, qui donnent accès au Registre des entreprises de l'Ontario.",
          "Choisir l'enregistrement d'un nom commercial pour une entreprise individuelle et saisir les renseignements demandés : le nom commercial, le nom et l'adresse du propriétaire, l'adresse de l'entreprise et une description de ses activités.",
          "Payer les droits gouvernementaux de 60 $ par carte de débit ou de crédit.",
          "Recevoir l'enregistrement, qui comprend un numéro d'identification d'entreprise de l'Ontario (NIE) à 9 chiffres et une clé d'entreprise servant aux dépôts ultérieurs.",
          "Conserver l'enregistrement avec les dossiers de l'entreprise. Les banques et les fournisseurs qui traitent avec un nom commercial demandent souvent à le voir.",
        ],
      },
      p("Cet enregistrement s'appelait auparavant le permis principal d'entreprise (Master Business Licence). L'Ontario parle maintenant d'enregistrement d'un nom commercial, mais bien des banques et des formulaires utilisent encore l'ancien nom."),
      { type: "heading", id: "bin-vs-bn", text: "NIE de l'Ontario et numéro d'entreprise de l'ARC" },
      p("Deux numéros différents sont souvent confondus à cette étape. L'Ontario précise que le NIE à 9 chiffres délivré par ServiceOntario est différent du numéro d'entreprise (NE) fourni par l'ARC. L'enregistrement d'un nom commercial en Ontario ne crée pas de numéro d'entreprise de l'ARC."),
      {
        type: "table",
        head: ["", "NIE de l'Ontario", "Numéro d'entreprise (NE) de l'ARC"],
        rows: [
          ["Délivré par", "ServiceOntario, au moyen du Registre des entreprises de l'Ontario", "Agence du revenu du Canada"],
          ["Utilité", "Identifie le nom commercial enregistré en Ontario", "Identifie l'entreprise pour les programmes fiscaux fédéraux"],
          ["Quand le propriétaire l'obtient", "Lors de l'enregistrement du nom commercial", "Seulement lors de l'inscription à un compte de programme de l'ARC"],
        ],
      },
      p("L'ARC explique qu'une entreprise non constituée en société n'a besoin d'un NE que lorsqu'elle s'inscrit à des comptes de programme de l'ARC, comme la TPS/TVH ou les retenues sur la paie. Un propriétaire unique sans employés qui n'est pas inscrit à la TPS/TVH n'a pas besoin de NE. Le guide ", L("comment obtenir un numéro d'entreprise de l'ARC", "/guides/comment-obtenir-un-numero-dentreprise-arc"), " présente cette inscription."),
      { type: "heading", id: "gst-hst", text: "La TPS/TVH pour une entreprise individuelle" },
      p("La TPS/TVH est une inscription fédérale auprès de l'ARC, distincte de l'enregistrement du nom en Ontario. Selon les règles de l'ARC sur les petits fournisseurs, une entreprise demeure généralement un petit fournisseur, et n'a pas à s'inscrire, tant que ses revenus taxables ne dépassent pas 30 000 $ sur quatre trimestres civils consécutifs."),
      {
        type: "list",
        items: [
          "Si le seuil de 30 000 $ est dépassé au cours d'un seul trimestre civil, le statut de petit fournisseur prend fin dans ce trimestre, et l'ARC exige l'inscription et la perception de la TPS/TVH à partir de la vente qui a fait dépasser le seuil.",
          "Si le seuil est dépassé sur quatre trimestres civils consécutifs ou moins, sans l'être au cours d'un seul trimestre, le statut de petit fournisseur prend fin à la fin du mois suivant ce trimestre.",
          "Une entreprise sous le seuil qui effectue des ventes taxables au Canada peut s'inscrire volontairement.",
        ],
      },
      p("Les détails, dont le calcul du seuil et la façon de s'inscrire, se trouvent dans le guide ", L("comment obtenir un numéro de TPS/TVH en Ontario", "/guides/comment-obtenir-numero-tps-tvh-ontario"), "."),
      { type: "heading", id: "renewal", text: "Le renouvellement tous les cinq ans" },
      p("L'enregistrement d'une entreprise individuelle n'est pas permanent. L'Ontario précise que l'enregistrement d'un nom commercial, autrefois appelé permis principal d'entreprise, expire tous les 5 ans et doit être renouvelé dans la période allant de 6 mois avant à 60 jours après la date d'expiration. Les droits de renouvellement sont les mêmes que pour un nouvel enregistrement : 60 $ pour une entreprise individuelle."),
      p("Le délai a son importance. Si l'enregistrement est expiré depuis plus de 60 jours, l'Ontario ne permet plus de le renouveler. Le propriétaire doit alors enregistrer de nouveau le même nom, ce qui entraîne un nouveau NIE et une nouvelle clé d'entreprise."),
      { type: "heading", id: "after-registering", text: "Après l'enregistrement : les étapes courantes" },
      p("L'enregistrement du nom n'est habituellement qu'une des démarches administratives au démarrage d'une entreprise individuelle. Selon l'entreprise, la liste comprend souvent :"),
      {
        type: "list",
        items: [
          "Un numéro d'entreprise de l'ARC et un compte de TPS/TVH, lorsque l'entreprise s'inscrit à un programme de l'ARC.",
          "Un compte bancaire au nom commercial enregistré.",
          "Des permis municipaux, qui varient selon la ville et le type d'entreprise.",
          "Des modifications à l'enregistrement dans les délais requis si l'adresse ou d'autres renseignements changent.",
        ],
      },
      p("Des registres distincts pour les revenus et les dépenses de l'entreprise facilitent aussi la déclaration du revenu net d'entreprise dans la déclaration de revenus personnelle du propriétaire, puisque l'entreprise ne produit pas de déclaration propre. Le guide sur le ", L("compte bancaire d'entreprise", "/guides/compte-bancaire-entreprise-canada"), " présente les documents qu'une banque demande à un propriétaire unique."),
      { type: "heading", id: "sole-prop-vs-incorporating", text: "Entreprise individuelle ou constitution en société en Ontario" },
      p("L'enregistrement d'un nom commercial ne change pas la nature juridique de l'entreprise. Le propriétaire demeure personnellement responsable de ses dettes, et le revenu reste imposé à son taux personnel. La société par actions est différente : il s'agit d'une entité juridique distincte, ses actionnaires ne sont généralement pas responsables de ses dettes, et elle produit sa propre déclaration de revenus."),
      {
        type: "table",
        head: ["Caractéristique", "Entreprise individuelle", "Société par actions"],
        rows: [
          ["Entité juridique distincte", "Non", "Oui"],
          ["Responsabilité des dettes", "Le propriétaire, y compris sur ses biens personnels", "En général la société, et non les actionnaires"],
          ["Dépôt provincial", "Enregistrement du nom commercial, seulement si un nom autre que celui du propriétaire est utilisé", "Statuts constitutifs"],
          ["Impôt sur le revenu", "Déclaration personnelle du propriétaire, aux taux personnels", "Déclaration T2 de la société"],
        ],
      },
      p("Le guide ", L("entreprise individuelle ou société", "/guides/entreprise-individuelle-ou-societe"), " compare les deux structures plus en détail, y compris les coûts et les obligations continues."),
      { type: "heading", id: "korporex", text: "L'enregistrement avec Korporex" },
      p("Korporex prépare et dépose en ligne l'enregistrement du nom commercial d'une ", L("entreprise individuelle en Ontario", "/services/sole-proprietorship"), ", des renseignements sur le nom jusqu'à l'enregistrement déposé. Korporex est un service de préparation de documents, et non un cabinet d'avocats ou de comptables."),
    ],
    faq: [
      {
        q: "Faut-il enregistrer une entreprise individuelle en Ontario?",
        a: "Seulement si l'entreprise utilise un nom autre que celui du propriétaire. L'Ontario précise qu'une entreprise individuelle doit être enregistrée lorsque le propriétaire n'utilise pas son propre nom comme nom d'entreprise. Exercer sous le nom « Julie Tremblay » n'exige pas d'enregistrement; « Julie Tremblay Consultation » ou « Studio Érable », oui.",
      },
      {
        q: "Combien coûte l'enregistrement d'une entreprise individuelle en Ontario?",
        a: "Les droits gouvernementaux sont de 60 $, en ligne ou par la poste. L'enregistrement en ligne est traité immédiatement, et l'enregistrement par la poste prend environ 15 jours ouvrables. Le renouvellement, tous les cinq ans, coûte aussi 60 $.",
      },
      {
        q: "Combien de temps l'enregistrement est-il valide en Ontario?",
        a: "L'enregistrement d'un nom commercial expire tous les 5 ans. Il peut être renouvelé de 6 mois avant à 60 jours après la date d'expiration. Au-delà de 60 jours après l'expiration, il ne peut plus être renouvelé et le nom doit être enregistré de nouveau, avec un nouveau NIE et une nouvelle clé d'entreprise.",
      },
      {
        q: "Le NIE de l'Ontario est-il le même que le numéro d'entreprise de l'ARC?",
        a: "Non. L'Ontario précise que le NIE à 9 chiffres de ServiceOntario est différent du numéro d'entreprise (NE) fourni par l'ARC. Une entreprise non constituée en société n'a besoin d'un NE que lorsqu'elle s'inscrit à un compte de programme de l'ARC, comme la TPS/TVH ou les retenues sur la paie.",
      },
      {
        q: "Un propriétaire unique doit-il percevoir la TPS/TVH?",
        a: "Pas tant que l'entreprise est un petit fournisseur. Selon les règles de l'ARC, une entreprise demeure généralement un petit fournisseur tant que ses revenus taxables ne dépassent pas 30 000 $ sur quatre trimestres civils consécutifs. Au-delà de ce seuil, l'inscription à la TPS/TVH est obligatoire. Une entreprise sous le seuil peut s'inscrire volontairement.",
      },
    ],
  },

  // ── Español ──
  es: {
    readTime: "9 min de lectura",
    content: [
      p("Para registrar una empresa unipersonal en Ontario, el propietario registra el nombre comercial del negocio en el Registro de Empresas de Ontario (Ontario Business Registry). El registro en línea cuesta 60 $, se procesa de inmediato y vence cada cinco años. El registro es necesario cuando el negocio opera con un nombre distinto al nombre del propietario. Quien opera únicamente con su propio nombre no tiene un nombre comercial que registrar ante la provincia, aunque las inscripciones fiscales ante la Agencia de Ingresos de Canadá (CRA) pueden aplicarse de todos modos."),
      p("Esta guía explica paso a paso cómo registrar una empresa unipersonal en Ontario: cuándo es obligatorio el registro, cuánto cuesta, qué es el número de identificación empresarial de Ontario (BIN) y en qué se diferencia del número de negocio de la CRA, cuándo entra en juego el GST/HST y cómo funciona la renovación. Para una visión general de todas las estructuras y de cómo se registra cada una, consulte la guía ", L("cómo registrar un negocio en Ontario", "/guides/como-registrar-negocio-ontario"), "."),
      { type: "heading", id: "what-is-a-sole-proprietorship", text: "Qué es una empresa unipersonal en Ontario" },
      p("Una empresa unipersonal (sole proprietorship) pertenece a una sola persona y es operada por ella, sin una entidad jurídica separada. La descripción del gobierno de Ontario destaca sus dos rasgos principales: el propietario es responsable de todas las deudas y pérdidas del negocio, y los acreedores pueden tomar sus bienes personales, además del negocio, para cobrar esas deudas. En materia fiscal, el ingreso del negocio tributa a la tasa personal del propietario, y las pérdidas y gastos del negocio pueden deducirse de su ingreso personal."),
      p("Como no existe una entidad separada, no hay nada que constituir ni estatutos que presentar. El único trámite provincial vinculado a una empresa unipersonal es el registro de su nombre comercial, y ese trámite solo existe cuando se usa un nombre comercial."),
      { type: "heading", id: "when-registration-is-required", text: "Cuándo hay que registrar una empresa unipersonal en Ontario" },
      p("La indicación de Ontario es directa: una empresa unipersonal debe registrarse si el propietario no usa su propio nombre como nombre del negocio. La regla proviene de la Ley de Nombres Comerciales de Ontario (Business Names Act), que regula el registro de los nombres que usan las personas físicas, las sociedades de personas y las sociedades."),
      p("En la práctica, la línea divisoria está entre el nombre propio del propietario y cualquier otro nombre. Algunos ejemplos muestran cómo funciona."),
      {
        type: "table",
        head: ["Nombre que usa el negocio", "Registro del nombre comercial en Ontario"],
        rows: [
          ["Ana García (solo el nombre de la propietaria)", "No se requiere"],
          ["Ana García Consulting", "Se requiere, porque se añaden palabras al nombre de la propietaria"],
          ["Maplewind Studio", "Se requiere, porque es un nombre distinto al de la propietaria"],
          ["AG Design", "Se requiere, porque es un nombre distinto al de la propietaria"],
        ],
      },
      p("El mismo nombre puede aparecer también en un sitio web, facturas, letreros o perfiles de redes sociales. Cuando un negocio se presenta al público con un nombre distinto al del propietario, ese nombre queda sujeto a la regla de registro."),
      { type: "heading", id: "fees-and-timing", text: "Costo y plazo de procesamiento" },
      p("Ontario publica una tabla de tarifas y plazos de servicio para los trámites de la Business Names Act. Para una empresa unipersonal, las cifras son las siguientes."),
      {
        type: "table",
        head: ["Trámite", "En línea", "Por correo"],
        rows: [
          ["Nuevo registro de nombre comercial", "60 $, inmediato", "60 $, 15 días hábiles"],
          ["Renovación", "60 $, inmediato", "60 $, 15 días hábiles"],
          ["Modificación (por ejemplo, una nueva dirección)", "0 $, inmediato", "0 $, 15 días hábiles"],
          ["Cancelación", "0 $, inmediato", "0 $, 15 días hábiles"],
        ],
      },
      p("Estas son tarifas del gobierno. Un proveedor de servicios que prepara y presenta el registro cobra además su propia tarifa."),
      { type: "heading", id: "how-to-register", text: "Cómo registrar una empresa unipersonal en Ontario, paso a paso" },
      p("El registro se hace en línea en el Registro de Empresas de Ontario. Según Ontario, el registro en línea requiere una dirección de correo electrónico activa y una tarjeta de débito o crédito válida para el pago, y el proceso incluye crear un Ontario.ca Login y una Ontario Business Account."),
      {
        type: "list",
        items: [
          "Elegir el nombre comercial. Una búsqueda en el Registro de Empresas de Ontario muestra los nombres ya registrados en la provincia, lo que ayuda a evitar un nombre que ya está en uso.",
          "Crear un Ontario.ca Login y una Ontario Business Account, que dan acceso al Registro de Empresas de Ontario.",
          "Seleccionar el registro de nombre comercial para una empresa unipersonal e ingresar los datos requeridos: el nombre comercial, el nombre y la dirección del propietario, la dirección del negocio y una descripción de su actividad.",
          "Pagar la tarifa gubernamental de 60 $ con tarjeta de débito o crédito.",
          "Recibir el registro, que incluye un número de identificación empresarial de Ontario (BIN) de 9 dígitos y una clave de empresa (company key) que se usa para trámites posteriores.",
          "Guardar el registro con los documentos del negocio. Los bancos y proveedores que tratan con un nombre comercial suelen pedir verlo.",
        ],
      },
      p("Este registro antes se llamaba Master Business Licence. Ontario ahora lo denomina Business Name Registration, aunque muchos bancos y formularios siguen usando el nombre anterior."),
      { type: "heading", id: "bin-vs-bn", text: "BIN de Ontario frente al número de negocio de la CRA" },
      p("En esta etapa se suelen confundir dos números distintos. Ontario indica que el BIN de 9 dígitos que emite ServiceOntario es diferente del número de negocio (BN) que proporciona la CRA. Registrar un nombre comercial en Ontario no crea un número de negocio de la CRA."),
      {
        type: "table",
        head: ["", "BIN de Ontario", "Número de negocio (BN) de la CRA"],
        rows: [
          ["Emitido por", "ServiceOntario, mediante el Registro de Empresas de Ontario", "Agencia de Ingresos de Canadá"],
          ["Finalidad", "Identifica el nombre comercial registrado en Ontario", "Identifica el negocio ante los programas fiscales federales"],
          ["Cuándo lo obtiene el propietario", "Al registrar el nombre comercial", "Solo al inscribirse en una cuenta de programa de la CRA"],
        ],
      },
      p("La CRA explica que un negocio no constituido en sociedad solo necesita un BN cuando se inscribe en cuentas de programa de la CRA, como el GST/HST o la nómina. Un propietario sin empleados que no está inscrito en el GST/HST no necesita un BN. La guía ", L("cómo obtener un número de negocio de la CRA", "/guides/como-obtener-un-numero-de-negocio-cra"), " explica esa inscripción."),
      { type: "heading", id: "gst-hst", text: "El GST/HST para una empresa unipersonal" },
      p("El GST/HST es una inscripción federal ante la CRA, distinta del registro del nombre en Ontario. Según las reglas de la CRA sobre pequeños proveedores, un negocio generalmente sigue siendo un pequeño proveedor, y no tiene que inscribirse, mientras sus ingresos gravables no superen 30 000 $ en cuatro trimestres calendario consecutivos."),
      {
        type: "list",
        items: [
          "Si se supera el umbral de 30 000 $ en un solo trimestre calendario, la condición de pequeño proveedor termina en ese trimestre, y la CRA exige la inscripción y el cobro del GST/HST a partir de la venta con la que se superó el límite.",
          "Si el umbral se supera en cuatro trimestres calendario consecutivos o menos, pero no en un solo trimestre, la condición de pequeño proveedor termina al final del mes siguiente a ese trimestre.",
          "Un negocio por debajo del umbral que realiza ventas gravables en Canadá puede inscribirse voluntariamente.",
        ],
      },
      p("Los detalles, incluido cómo calcular el umbral y cómo inscribirse, están en la guía ", L("cómo obtener un número de GST/HST en Ontario", "/guides/como-obtener-numero-gst-hst-ontario"), "."),
      { type: "heading", id: "renewal", text: "La renovación cada cinco años" },
      p("El registro de una empresa unipersonal no es permanente. Ontario indica que el Business Name Registration, antes llamado Master Business Licence, vence cada 5 años y debe renovarse dentro del período que va de 6 meses antes a 60 días después de la fecha de vencimiento. La tarifa de renovación es la misma que la de un nuevo registro: 60 $ para una empresa unipersonal."),
      p("El plazo importa. Si el registro lleva más de 60 días vencido, Ontario ya no permite renovarlo. El propietario debe registrar de nuevo el mismo nombre, lo que genera un nuevo BIN y una nueva clave de empresa."),
      { type: "heading", id: "after-registering", text: "Después del registro: pasos habituales" },
      p("El registro del nombre suele ser solo uno de varios trámites administrativos cuando una empresa unipersonal empieza a operar. Según el negocio, la lista suele incluir:"),
      {
        type: "list",
        items: [
          "Un número de negocio de la CRA y una cuenta de GST/HST, cuando el negocio se inscribe en un programa de la CRA.",
          "Una cuenta bancaria a nombre del nombre comercial registrado.",
          "Licencias o permisos municipales, que dependen de la ciudad y del tipo de negocio.",
          "Modificaciones del registro dentro del plazo requerido si cambian la dirección u otros datos.",
        ],
      },
      p("Llevar registros separados de los ingresos y gastos del negocio también facilita declarar el ingreso neto del negocio en la declaración personal del propietario, ya que el negocio no presenta una declaración propia. La guía sobre la ", L("cuenta bancaria empresarial", "/guides/cuenta-bancaria-empresarial-canada"), " explica los documentos que un banco pide a un propietario único."),
      { type: "heading", id: "sole-prop-vs-incorporating", text: "Empresa unipersonal o constituir una sociedad en Ontario" },
      p("Registrar un nombre comercial no cambia la naturaleza jurídica del negocio. El propietario sigue siendo personalmente responsable de sus deudas, y el ingreso sigue tributando a su tasa personal. Una sociedad es distinta: es una entidad jurídica separada, sus accionistas generalmente no son responsables de sus deudas y presenta su propia declaración de impuestos."),
      {
        type: "table",
        head: ["Característica", "Empresa unipersonal", "Sociedad"],
        rows: [
          ["Entidad jurídica separada", "No", "Sí"],
          ["Responsabilidad por las deudas", "El propietario, incluidos sus bienes personales", "Generalmente la sociedad, no los accionistas"],
          ["Trámite provincial", "Registro del nombre comercial, solo si se usa un nombre distinto al del propietario", "Estatutos de constitución"],
          ["Impuesto sobre la renta", "Declaración personal del propietario, a tasas personales", "Declaración T2 de la sociedad"],
        ],
      },
      p("La guía ", L("empresa unipersonal o sociedad", "/guides/empresa-unipersonal-o-sociedad"), " compara ambas estructuras con más detalle, incluidos los costos y las obligaciones continuas."),
      { type: "heading", id: "korporex", text: "Registrar con Korporex" },
      p("Korporex prepara y presenta en línea el registro del nombre comercial de una ", L("empresa unipersonal en Ontario", "/services/sole-proprietorship"), ", desde los datos del nombre hasta el registro presentado. Korporex es un servicio de preparación de documentos, no un despacho de abogados ni de contadores."),
    ],
    faq: [
      {
        q: "¿Es obligatorio registrar una empresa unipersonal en Ontario?",
        a: "Solo si el negocio usa un nombre distinto al del propietario. Ontario indica que una empresa unipersonal debe registrarse cuando el propietario no usa su propio nombre como nombre del negocio. Operar como \"Ana García\" no requiere registro; \"Ana García Consulting\" o \"Maplewind Studio\" sí.",
      },
      {
        q: "¿Cuánto cuesta registrar una empresa unipersonal en Ontario?",
        a: "La tarifa del gobierno es de 60 $, en línea o por correo. El registro en línea se procesa de inmediato, y el registro por correo tarda unos 15 días hábiles. La renovación cada cinco años también cuesta 60 $.",
      },
      {
        q: "¿Cuánto tiempo es válido el registro en Ontario?",
        a: "El Business Name Registration vence cada 5 años. Puede renovarse desde 6 meses antes hasta 60 días después de la fecha de vencimiento. Pasados 60 días del vencimiento, ya no puede renovarse y el nombre debe registrarse de nuevo, con un nuevo BIN y una nueva clave de empresa.",
      },
      {
        q: "¿El BIN de Ontario es lo mismo que el número de negocio de la CRA?",
        a: "No. Ontario indica que el BIN de 9 dígitos de ServiceOntario es diferente del número de negocio (BN) que proporciona la CRA. Un negocio no constituido en sociedad solo necesita un BN cuando se inscribe en una cuenta de programa de la CRA, como el GST/HST o la nómina.",
      },
      {
        q: "¿Un propietario único debe cobrar el GST/HST?",
        a: "No mientras el negocio sea un pequeño proveedor. Según las reglas de la CRA, un negocio generalmente sigue siendo un pequeño proveedor mientras sus ingresos gravables no superen 30 000 $ en cuatro trimestres calendario consecutivos. Al superar ese umbral, la inscripción en el GST/HST es obligatoria. Un negocio por debajo del umbral puede inscribirse voluntariamente.",
      },
    ],
  },
};
