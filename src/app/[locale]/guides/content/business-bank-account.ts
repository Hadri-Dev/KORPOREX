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
      p("To open a business bank account in Canada, a financial institution has to confirm two things: that the business exists, and who is behind it. For a corporation, that means corporate records such as the certificate and articles of incorporation, the names of the directors, the people who own or control 25% or more of the shares, and photo ID for the individuals who will operate the account. For a sole proprietor, the business is not a separate person, so the bank mainly verifies the owner's own identity, along with a business name registration where the business uses a name other than the owner's."),
      p("Those requirements are not just bank preferences. Banks are reporting entities under Canada's anti-money laundering rules, and the Financial Transactions and Reports Analysis Centre of Canada (FINTRAC) sets out what they must obtain and verify. This guide explains those rules in plain terms, lists the documents typically involved for a corporation and for a sole proprietorship, and shows where your corporate records fit in."),
      { type: "heading", id: "why-separate", text: "Why a business gets its own account" },
      p("Ontario's own business guidance draws the line clearly. A corporation is a legal entity that keeps the business separate from the business owner, and its owners have limited liability. A sole proprietorship has no such separation: creditors can take the owner's personal assets and the business to pay debts."),
      p("For a corporation, a bank account in the corporation's name follows from that separation. The corporation earns its own revenue, pays its own expenses and files its own tax return, and an account in its own name keeps those transactions together. For a sole proprietor, a separate account is not a legal requirement in the same sense, but it keeps business activity apart from personal spending, which makes bookkeeping and tax records easier to follow."),
      { type: "heading", id: "fintrac-rules", text: "What the bank must verify under FINTRAC rules" },
      p("FINTRAC guidance sets out what a reporting entity must obtain when it verifies the identity of a corporation: its name, its address and the names of its directors. Acceptable records include a certificate of incorporation, or the most recent version of any other record that confirms the corporation's existence and contains its name, address and the names of its directors, such as a certificate of active corporate status. FINTRAC also notes that this information can be obtained from publicly accessible databases such as Corporations Canada's. The documents relied on must be authentic, valid and current."),
      p("Banks also have to collect beneficial ownership information. For a corporation, FINTRAC lists three items:"),
      {
        type: "list",
        items: [
          "The names of all directors of the corporation.",
          "The names and addresses of all persons who directly or indirectly own or control at least 25% of the shares of the corporation.",
          "Information establishing the ownership, control and structure of the corporation.",
        ],
      },
      p("The bank must then take reasonable measures to confirm that this beneficial ownership information is accurate, and FINTRAC states that those measures cannot be the same as the method used to obtain the information in the first place. Among the ways FINTRAC gives to confirm it are reviewing official records such as the minute book, the shareholder register and the articles of incorporation, or consulting public registries. In practice, this is why a bank asks to see corporate records rather than relying only on what the owner says."),
      p("The individuals dealing with the bank are verified as well. FINTRAC permits several methods for identifying a person, including government-issued photo identification that is authentic, valid and current, a credit file method, and a dual-process method using two different reliable sources. Which method a given institution uses, and in what order, is up to that institution within the rules."),
      { type: "heading", id: "documents-checklist", text: "Documents to open a business bank account in Canada" },
      p("Every institution sets its own document list, and the list can change with the type of business and the account. The table below shows the documents commonly involved, mapped to the legal requirement they answer. It is a guide to what to have on hand, not a list any particular bank has published."),
      {
        type: "table",
        head: ["What the bank needs to confirm", "Corporation", "Sole proprietorship"],
        rows: [
          ["That the business exists", "Certificate of incorporation, or a current record such as a certificate of status or corporate profile", "Business name registration, if the business uses a name other than the owner's own"],
          ["Name and address of the business", "Articles of incorporation and the registered office address on the public record", "The owner's address and the registered business name, if any"],
          ["Who the directors are", "Directors' register or a current government record listing the directors", "Not applicable: there are no directors"],
          ["Who owns or controls 25% or more", "Shareholder register and register of individuals with significant control, from the minute book", "Not applicable: the owner is the business"],
          ["Who can operate the account", "A directors' resolution or list of signing officers authorizing the account", "The owner"],
          ["Identity of each individual involved", "Photo ID or another FINTRAC-permitted method for each signer and, depending on the bank, each director and significant owner", "Photo ID or another FINTRAC-permitted method for the owner"],
        ],
      },
      p("A CRA business number is also commonly requested once the business has one. A corporation receives a business number as part of its incorporation; the ", L("guide to getting a CRA business number", "/guides/how-to-get-a-cra-business-number"), " explains how the BN works and when other businesses register for one."),
      { type: "heading", id: "corporation", text: "Opening a corporate account: where the documents come from" },
      p("Most of what a bank asks a corporation for comes from two places: the documents issued at incorporation, and the corporation's minute book."),
      p("The certificate and ", L("articles of incorporation", "/guides/what-are-articles-of-incorporation"), " show that the corporation exists, its exact legal name, its share structure and its registered office. They are issued by the government when the incorporation is filed."),
      p("The ", L("corporate minute book", "/guides/corporate-minute-book"), " holds the rest: the by-laws, the registers of directors, officers and shareholders, the share issuances, and the resolutions passed by the directors and shareholders. Banks commonly ask for a resolution authorizing the account and naming the signing officers, and the registers are how the corporation shows who its directors and significant owners are."),
      p("The register of individuals with significant control is part of that record. Corporations under the Canada Business Corporations Act must keep a register of individuals with significant control, meaning individuals who own or control 25% or more of the shares (by votes or by fair market value) or who have control in fact. Since January 22, 2024, federal corporations also file that information with Corporations Canada, annually with the annual return and within 15 days of any change to the register. In Ontario, privately held corporations have been required since January 1, 2023 to keep the same kind of information on file and to provide it when requested by law enforcement and regulatory and tax authorities."),
      {
        type: "callout",
        title: "Every Korporex incorporation includes a minute book",
        text: "Each Korporex incorporation package includes a minute book with the corporation's by-laws, organizational resolutions and registers, alongside the certificate and articles. Those are the records banks commonly ask to see when a new corporation opens its first account.",
      },
      { type: "heading", id: "sole-proprietorship", text: "How a sole proprietor opens a business bank account in Canada" },
      p("A sole proprietorship is not a separate legal entity, so there is no corporation for the bank to verify. The identity check centres on the owner, using one of the FINTRAC-permitted methods for individuals, such as government-issued photo ID."),
      p("Where the business operates under a name other than the owner's own full name, Ontario requires that name to be registered under the Business Names Act. The registration, formerly called a Master Business Licence, is valid for five years and is renewed after that. A bank opening an account in a trade name commonly asks to see it, since it links the name to the owner. The ", L("guide to registering a sole proprietorship in Ontario", "/guides/how-to-register-a-sole-proprietorship-in-ontario"), " covers the filing, and Korporex offers ", L("sole proprietorship registration", "/services/sole-proprietorship"), " as a service."),
      { type: "heading", id: "step-by-step", text: "The process, step by step" },
      {
        type: "list",
        items: [
          "Complete the incorporation or business name registration, so the business exists on the public record.",
          "Gather the records: certificate and articles, minute book with registers and a signing resolution for a corporation; the name registration for a sole proprietor using a trade name.",
          "Identify everyone the bank will need to verify: signing officers, and for a corporation, the directors and anyone holding 25% or more of the shares.",
          "Have each of those individuals ready with identification that meets the bank's verification method.",
          "Contact the institution, confirm its current document list for your business type, and submit the application.",
          "Keep the minute book current afterward, since banks confirm ownership information again during ongoing monitoring.",
        ],
      },
      { type: "heading", id: "after-opening", text: "After the account is open" },
      p("FINTRAC guidance treats beneficial ownership confirmation as something that happens both at the start of the relationship and during ongoing monitoring. When directors change, shares are transferred or a new significant owner comes in, the bank may ask for updated records. A corporation whose registers and resolutions are kept up to date can answer those requests from its own minute book."),
      p("For the account itself, the Financial Consumer Agency of Canada (FCAC) oversees federally regulated financial institutions and publishes information on fees and account disclosures. The FCAC's account-opening guidance on its website is written for personal accounts; for business accounts, the institution's own disclosure documents set out the fees and terms."),
      { type: "heading", id: "korporex", text: "Getting the documents ready" },
      p("If your business is not yet incorporated, you can ", L("incorporate with Korporex", "/incorporate"), " federally or in Ontario and receive the certificate, articles and a complete minute book together, ready for the bank. Korporex is not a law firm or a financial institution; questions about a specific bank's requirements belong with that bank."),
    ],
    faq: [
      {
        q: "What documents does a corporation need to open a business bank account in Canada?",
        a: "Requirements vary by institution, but they follow from FINTRAC rules: proof the corporation exists (such as the certificate of incorporation or a current certificate of status), its name and address, the names of its directors, the names and addresses of anyone owning or controlling 25% or more of the shares, information on its ownership and control structure, and identification for the individuals operating the account. Banks commonly also ask for the articles and a resolution naming the signing officers.",
      },
      {
        q: "Why does the bank want to see the minute book?",
        a: "Banks must take reasonable measures to confirm the accuracy of beneficial ownership information, using a method different from the one used to collect it. FINTRAC lists reviewing official records such as the minute book, shareholder register and articles of incorporation as one way to do this.",
      },
      {
        q: "Can a sole proprietor open a business bank account?",
        a: "Yes. A sole proprietorship is not a separate legal entity, so the bank verifies the owner's identity. If the business uses a name other than the owner's own full name, Ontario requires that name to be registered, and banks commonly ask to see the registration.",
      },
      {
        q: "Do all shareholders have to be identified?",
        a: "FINTRAC rules require the bank to obtain the names and addresses of all persons who directly or indirectly own or control at least 25% of the shares. Smaller shareholders are not covered by that specific requirement, though an institution may ask for more information.",
      },
      {
        q: "Does a Korporex incorporation include the records a bank asks for?",
        a: "Every Korporex incorporation package includes the certificate and articles of incorporation and a minute book with by-laws, organizational resolutions and registers. The bank decides which of those it needs to see.",
      },
    ],
  },

  // ── Français ──
  fr: {
    readTime: "9 min de lecture",
    content: [
      p("Pour ouvrir un compte bancaire d'entreprise au Canada, l'institution financière doit confirmer deux choses : que l'entreprise existe, et qui se trouve derrière elle. Pour une société par actions, cela veut dire des documents sociaux comme le certificat et les statuts constitutifs, le nom des administrateurs, les personnes qui détiennent ou contrôlent 25 % ou plus des actions, et une pièce d'identité avec photo pour les personnes qui utiliseront le compte. Pour une entreprise individuelle, l'entreprise n'est pas une personne distincte : la banque vérifie surtout l'identité du propriétaire, ainsi que l'enregistrement du nom commercial lorsque l'entreprise utilise un nom autre que celui du propriétaire."),
      p("Ces exigences ne relèvent pas seulement des préférences de la banque. Les banques sont des entités déclarantes au sens des règles canadiennes contre le blanchiment d'argent, et le Centre d'analyse des opérations et déclarations financières du Canada (CANAFE) précise ce qu'elles doivent obtenir et vérifier. Ce guide explique ces règles simplement, présente les documents habituellement en cause pour une société et pour une entreprise individuelle, et montre où les registres de votre société entrent en jeu."),
      { type: "heading", id: "why-separate", text: "Pourquoi une entreprise a son propre compte" },
      p("Le gouvernement de l'Ontario trace une ligne claire. Une société est une entité juridique qui sépare l'entreprise de son propriétaire, et ses propriétaires bénéficient d'une responsabilité limitée. L'entreprise individuelle n'offre pas cette séparation : les créanciers peuvent saisir les biens personnels du propriétaire et l'entreprise pour payer les dettes."),
      p("Pour une société, un compte bancaire à son nom découle de cette séparation. La société gagne ses propres revenus, paie ses propres dépenses et produit sa propre déclaration de revenus, et un compte à son nom regroupe ces opérations. Pour une entreprise individuelle, un compte distinct n'est pas une exigence juridique au même sens, mais il sépare l'activité de l'entreprise des dépenses personnelles, ce qui simplifie la tenue de livres et les dossiers fiscaux."),
      { type: "heading", id: "fintrac-rules", text: "Ce que la banque doit vérifier selon les règles de CANAFE" },
      p("Les lignes directrices de CANAFE précisent ce qu'une entité déclarante doit obtenir pour vérifier l'identité d'une société : son nom, son adresse et le nom de ses administrateurs. Les documents acceptables comprennent un certificat de constitution, ou la version la plus récente de tout autre document qui confirme l'existence de la société et indique son nom, son adresse et le nom de ses administrateurs, comme un certificat attestant que la société est active. CANAFE mentionne aussi que ces renseignements peuvent être obtenus dans des bases de données accessibles au public, comme celle de Corporations Canada. Les documents utilisés doivent être authentiques, valides et à jour."),
      p("Les banques doivent également recueillir des renseignements sur la propriété effective. Pour une société, CANAFE énumère trois éléments :"),
      {
        type: "list",
        items: [
          "Le nom de tous les administrateurs de la société.",
          "Le nom et l'adresse de toutes les personnes qui détiennent ou contrôlent, directement ou indirectement, au moins 25 % des actions de la société.",
          "Les renseignements qui établissent la propriété, le contrôle et la structure de la société.",
        ],
      },
      p("La banque doit ensuite prendre des mesures raisonnables pour confirmer l'exactitude de ces renseignements, et CANAFE précise que ces mesures ne peuvent pas être les mêmes que la méthode utilisée pour obtenir les renseignements au départ. Parmi les moyens indiqués par CANAFE figurent l'examen de documents officiels comme le livre des procès-verbaux, le registre des actionnaires et les statuts constitutifs, ou la consultation de registres publics. C'est pourquoi, en pratique, la banque demande à voir les registres de la société plutôt que de se fier uniquement à ce que dit le propriétaire."),
      p("Les personnes qui traitent avec la banque sont aussi vérifiées. CANAFE permet plusieurs méthodes pour identifier une personne, notamment une pièce d'identité avec photo délivrée par un gouvernement, authentique, valide et à jour, la méthode du dossier de crédit et la méthode du processus double fondée sur deux sources fiables différentes. Le choix de la méthode, et l'ordre dans lequel elles sont utilisées, appartient à chaque institution dans le respect des règles."),
      { type: "heading", id: "documents-checklist", text: "Documents pour ouvrir un compte bancaire d'entreprise au Canada" },
      p("Chaque institution établit sa propre liste de documents, et cette liste peut varier selon le type d'entreprise et de compte. Le tableau ci-dessous présente les documents habituellement en cause, associés à l'exigence juridique à laquelle ils répondent. Il indique ce qu'il est utile d'avoir sous la main; ce n'est pas une liste publiée par une banque en particulier."),
      {
        type: "table",
        head: ["Ce que la banque doit confirmer", "Société par actions", "Entreprise individuelle"],
        rows: [
          ["Que l'entreprise existe", "Certificat de constitution, ou document à jour comme un certificat de statut ou un profil de société", "Enregistrement du nom commercial, si l'entreprise utilise un nom autre que celui du propriétaire"],
          ["Nom et adresse de l'entreprise", "Statuts constitutifs et adresse du siège social inscrite au registre public", "Adresse du propriétaire et nom commercial enregistré, le cas échéant"],
          ["Qui sont les administrateurs", "Registre des administrateurs ou document gouvernemental à jour qui les énumère", "Sans objet : il n'y a pas d'administrateurs"],
          ["Qui détient ou contrôle 25 % ou plus", "Registre des actionnaires et registre des particuliers ayant un contrôle important, tirés du livre des procès-verbaux", "Sans objet : le propriétaire est l'entreprise"],
          ["Qui peut utiliser le compte", "Résolution des administrateurs ou liste des signataires autorisant le compte", "Le propriétaire"],
          ["Identité de chaque personne concernée", "Pièce d'identité avec photo ou autre méthode permise par CANAFE pour chaque signataire et, selon la banque, chaque administrateur et propriétaire important", "Pièce d'identité avec photo ou autre méthode permise par CANAFE pour le propriétaire"],
        ],
      },
      p("Un numéro d'entreprise de l'ARC est aussi souvent demandé lorsque l'entreprise en a un. Une société reçoit un numéro d'entreprise au moment de sa constitution; le guide ", L("comment obtenir un numéro d'entreprise de l'ARC", "/guides/comment-obtenir-un-numero-dentreprise-arc"), " explique le fonctionnement du NE et les cas où d'autres entreprises s'y inscrivent."),
      { type: "heading", id: "corporation", text: "Ouvrir un compte de société : d'où viennent les documents" },
      p("La plupart des documents demandés à une société proviennent de deux sources : les documents délivrés à la constitution, et le livre des procès-verbaux de la société."),
      p("Le certificat et les ", L("statuts constitutifs", "/guides/que-sont-les-statuts-constitutifs"), " démontrent que la société existe et indiquent sa dénomination exacte, sa structure de capital et son siège social. Ils sont délivrés par le gouvernement au dépôt de la constitution."),
      p("Le ", L("livre des procès-verbaux", "/guides/quest-ce-quun-livre-des-proces-verbaux"), " contient le reste : les règlements administratifs, les registres des administrateurs, des dirigeants et des actionnaires, les émissions d'actions, et les résolutions adoptées par les administrateurs et les actionnaires. Les banques demandent souvent une résolution qui autorise le compte et nomme les signataires, et les registres permettent à la société de démontrer qui sont ses administrateurs et ses propriétaires importants."),
      p("Le registre des particuliers ayant un contrôle important fait partie de ces documents. Les sociétés régies par la Loi canadienne sur les sociétés par actions doivent tenir un registre des particuliers ayant un contrôle important, soit les personnes qui détiennent ou contrôlent 25 % ou plus des actions (en droits de vote ou en juste valeur marchande) ou qui exercent un contrôle de fait. Depuis le 22 janvier 2024, les sociétés fédérales déposent aussi ces renseignements auprès de Corporations Canada, chaque année avec le rapport annuel et dans les 15 jours suivant toute modification du registre. En Ontario, depuis le 1er janvier 2023, les sociétés fermées doivent conserver le même type de renseignements et les fournir sur demande aux organismes d'application de la loi et aux autorités de réglementation et fiscales."),
      {
        type: "callout",
        title: "Chaque constitution Korporex comprend un livre des procès-verbaux",
        text: "Chaque forfait de constitution Korporex comprend un livre des procès-verbaux contenant les règlements administratifs, les résolutions d'organisation et les registres de la société, en plus du certificat et des statuts. Ce sont les documents que les banques demandent souvent à voir lorsqu'une nouvelle société ouvre son premier compte.",
      },
      { type: "heading", id: "sole-proprietorship", text: "Ouvrir un compte bancaire d'entreprise au Canada comme entreprise individuelle" },
      p("Une entreprise individuelle n'est pas une entité juridique distincte : il n'y a donc pas de société à vérifier. La vérification porte sur le propriétaire, selon l'une des méthodes permises par CANAFE pour les particuliers, comme une pièce d'identité avec photo délivrée par un gouvernement."),
      p("Lorsque l'entreprise exerce ses activités sous un nom autre que le nom complet du propriétaire, l'Ontario exige que ce nom soit enregistré en vertu de la Loi sur les noms commerciaux. L'enregistrement, autrefois appelé permis principal d'entreprise, est valide cinq ans et se renouvelle ensuite. Une banque qui ouvre un compte sous un nom commercial demande souvent à le voir, puisqu'il relie le nom au propriétaire. Le guide ", L("comment enregistrer une entreprise individuelle en Ontario", "/guides/comment-enregistrer-une-entreprise-individuelle-en-ontario"), " décrit le dépôt, et Korporex offre l'", L("enregistrement d'entreprise individuelle", "/services/sole-proprietorship"), " comme service."),
      { type: "heading", id: "step-by-step", text: "Les étapes, une à une" },
      {
        type: "list",
        items: [
          "Terminer la constitution ou l'enregistrement du nom commercial, pour que l'entreprise figure au registre public.",
          "Réunir les documents : certificat et statuts, livre des procès-verbaux avec registres et résolution sur les signataires pour une société; enregistrement du nom pour une entreprise individuelle qui utilise un nom commercial.",
          "Repérer toutes les personnes que la banque devra vérifier : les signataires et, pour une société, les administrateurs et toute personne détenant 25 % ou plus des actions.",
          "Prévoir pour chacune de ces personnes une pièce d'identité conforme à la méthode de vérification de la banque.",
          "Communiquer avec l'institution, confirmer sa liste de documents à jour pour votre type d'entreprise, puis présenter la demande.",
          "Tenir le livre des procès-verbaux à jour par la suite, puisque les banques confirment de nouveau les renseignements sur la propriété dans le cadre du contrôle continu.",
        ],
      },
      { type: "heading", id: "after-opening", text: "Une fois le compte ouvert" },
      p("Selon CANAFE, la confirmation de la propriété effective se fait au début de la relation d'affaires et pendant le contrôle continu. Lorsque des administrateurs changent, que des actions sont transférées ou qu'un nouveau propriétaire important arrive, la banque peut demander des documents à jour. Une société dont les registres et les résolutions sont à jour peut répondre à ces demandes à partir de son propre livre des procès-verbaux."),
      p("Pour le compte lui-même, l'Agence de la consommation en matière financière du Canada (ACFC) surveille les institutions financières sous réglementation fédérale et publie de l'information sur les frais et la divulgation des renseignements sur les comptes. Ses conseils sur l'ouverture d'un compte visent les comptes personnels; pour un compte d'entreprise, les documents de divulgation de l'institution précisent les frais et les conditions."),
      { type: "heading", id: "korporex", text: "Préparer les documents" },
      p("Si votre entreprise n'est pas encore constituée, vous pouvez vous ", L("constituer en société avec Korporex", "/incorporate"), ", au fédéral ou en Ontario, et recevoir ensemble le certificat, les statuts et un livre des procès-verbaux complet, prêts pour la banque. Korporex n'est ni un cabinet d'avocats ni une institution financière; les questions sur les exigences d'une banque en particulier relèvent de cette banque."),
    ],
    faq: [
      {
        q: "Quels documents une société doit-elle fournir pour ouvrir un compte bancaire d'entreprise au Canada?",
        a: "Les exigences varient selon l'institution, mais elles découlent des règles de CANAFE : une preuve d'existence de la société (comme le certificat de constitution ou un certificat de statut à jour), son nom et son adresse, le nom de ses administrateurs, le nom et l'adresse de toute personne détenant ou contrôlant 25 % ou plus des actions, des renseignements sur sa structure de propriété et de contrôle, et l'identification des personnes qui utiliseront le compte. Les banques demandent souvent aussi les statuts et une résolution nommant les signataires.",
      },
      {
        q: "Pourquoi la banque veut-elle voir le livre des procès-verbaux?",
        a: "Les banques doivent prendre des mesures raisonnables pour confirmer l'exactitude des renseignements sur la propriété effective, au moyen d'une méthode différente de celle utilisée pour les recueillir. CANAFE mentionne l'examen de documents officiels comme le livre des procès-verbaux, le registre des actionnaires et les statuts constitutifs parmi les moyens d'y parvenir.",
      },
      {
        q: "Une entreprise individuelle peut-elle ouvrir un compte bancaire d'entreprise?",
        a: "Oui. Une entreprise individuelle n'est pas une entité juridique distincte, donc la banque vérifie l'identité du propriétaire. Si l'entreprise utilise un nom autre que le nom complet du propriétaire, l'Ontario exige l'enregistrement de ce nom, et les banques demandent souvent à voir cet enregistrement.",
      },
      {
        q: "Tous les actionnaires doivent-ils être identifiés?",
        a: "Les règles de CANAFE obligent la banque à obtenir le nom et l'adresse de toutes les personnes qui détiennent ou contrôlent, directement ou indirectement, au moins 25 % des actions. Les actionnaires plus petits ne sont pas visés par cette exigence précise, mais une institution peut demander davantage de renseignements.",
      },
      {
        q: "Une constitution Korporex comprend-elle les documents demandés par la banque?",
        a: "Chaque forfait de constitution Korporex comprend le certificat et les statuts constitutifs ainsi qu'un livre des procès-verbaux avec règlements administratifs, résolutions d'organisation et registres. C'est la banque qui décide lesquels elle doit voir.",
      },
    ],
  },

  // ── Español ──
  es: {
    readTime: "9 min de lectura",
    content: [
      p("Para abrir una cuenta bancaria empresarial en Canadá, la institución financiera tiene que confirmar dos cosas: que el negocio existe y quién está detrás de él. Para una sociedad, eso significa documentos corporativos como el certificado y los estatutos de constitución, los nombres de los directores, las personas que poseen o controlan el 25 % o más de las acciones, y una identificación con fotografía de las personas que operarán la cuenta. Para una empresa unipersonal, el negocio no es una persona separada, así que el banco verifica principalmente la identidad del propietario, junto con el registro del nombre comercial cuando el negocio usa un nombre distinto al del propietario."),
      p("Estos requisitos no son solo preferencias del banco. Los bancos son entidades informantes bajo las normas canadienses contra el lavado de dinero, y el Centro de Análisis de Transacciones e Informes Financieros de Canadá (FINTRAC) establece lo que deben obtener y verificar. Esta guía explica esas normas en términos sencillos, enumera los documentos que suelen intervenir para una sociedad y para una empresa unipersonal, y muestra dónde encajan los registros de su sociedad."),
      { type: "heading", id: "why-separate", text: "Por qué un negocio tiene su propia cuenta" },
      p("La propia guía empresarial de Ontario traza una línea clara. Una sociedad es una entidad jurídica que mantiene el negocio separado de su propietario, y sus propietarios tienen responsabilidad limitada. La empresa unipersonal no tiene esa separación: los acreedores pueden tomar los bienes personales del propietario y el negocio para pagar las deudas."),
      p("Para una sociedad, una cuenta bancaria a su nombre se deriva de esa separación. La sociedad obtiene sus propios ingresos, paga sus propios gastos y presenta su propia declaración de impuestos, y una cuenta a su nombre reúne esas operaciones. Para una empresa unipersonal, una cuenta separada no es un requisito legal en el mismo sentido, pero separa la actividad del negocio de los gastos personales, lo que facilita la contabilidad y los registros fiscales."),
      { type: "heading", id: "fintrac-rules", text: "Lo que el banco debe verificar según las normas de FINTRAC" },
      p("La guía de FINTRAC establece lo que una entidad informante debe obtener al verificar la identidad de una sociedad: su nombre, su dirección y los nombres de sus directores. Los documentos aceptables incluyen un certificado de constitución, o la versión más reciente de cualquier otro documento que confirme la existencia de la sociedad y contenga su nombre, su dirección y los nombres de sus directores, como un certificado de que la sociedad está activa. FINTRAC también señala que esta información puede obtenerse en bases de datos de acceso público, como la de Corporations Canada. Los documentos utilizados deben ser auténticos, válidos y vigentes."),
      p("Los bancos también deben recopilar información sobre la propiedad efectiva (beneficiarios reales). Para una sociedad, FINTRAC enumera tres elementos:"),
      {
        type: "list",
        items: [
          "Los nombres de todos los directores de la sociedad.",
          "Los nombres y direcciones de todas las personas que, directa o indirectamente, poseen o controlan al menos el 25 % de las acciones de la sociedad.",
          "La información que establece la propiedad, el control y la estructura de la sociedad.",
        ],
      },
      p("Luego, el banco debe tomar medidas razonables para confirmar que esa información es exacta, y FINTRAC indica que esas medidas no pueden ser las mismas que el método usado para obtener la información en primer lugar. Entre las formas que menciona FINTRAC están revisar documentos oficiales como el libro de actas, el registro de accionistas y los estatutos de constitución, o consultar registros públicos. Por eso, en la práctica, el banco pide ver los registros corporativos en lugar de basarse solo en lo que dice el propietario."),
      p("Las personas que tratan con el banco también se verifican. FINTRAC permite varios métodos para identificar a una persona, entre ellos una identificación con fotografía emitida por un gobierno que sea auténtica, válida y vigente, el método del historial de crédito y el método de doble proceso con dos fuentes confiables distintas. Qué método usa cada institución, y en qué orden, lo decide la propia institución dentro de las normas."),
      { type: "heading", id: "documents-checklist", text: "Documentos para abrir una cuenta bancaria empresarial en Canadá" },
      p("Cada institución fija su propia lista de documentos, y esa lista puede cambiar según el tipo de negocio y de cuenta. La tabla siguiente muestra los documentos que suelen intervenir, relacionados con el requisito legal al que responden. Es una referencia de lo que conviene tener a mano, no una lista publicada por un banco en particular."),
      {
        type: "table",
        head: ["Lo que el banco debe confirmar", "Sociedad", "Empresa unipersonal"],
        rows: [
          ["Que el negocio existe", "Certificado de constitución, o un documento vigente como un certificado de estado o perfil corporativo", "Registro del nombre comercial, si el negocio usa un nombre distinto al del propietario"],
          ["Nombre y dirección del negocio", "Estatutos de constitución y dirección de la oficina registrada que consta en el registro público", "Dirección del propietario y nombre comercial registrado, si lo hay"],
          ["Quiénes son los directores", "Registro de directores o documento gubernamental vigente que los enumere", "No aplica: no hay directores"],
          ["Quién posee o controla el 25 % o más", "Registro de accionistas y registro de personas con control significativo, del libro de actas", "No aplica: el propietario es el negocio"],
          ["Quién puede operar la cuenta", "Resolución de los directores o lista de firmantes autorizados para la cuenta", "El propietario"],
          ["Identidad de cada persona involucrada", "Identificación con fotografía u otro método permitido por FINTRAC para cada firmante y, según el banco, cada director y propietario significativo", "Identificación con fotografía u otro método permitido por FINTRAC para el propietario"],
        ],
      },
      p("También es común que se pida el número de negocio de la CRA cuando el negocio ya lo tiene. Una sociedad recibe un número de negocio como parte de su constitución; la guía ", L("cómo obtener un número de negocio de la CRA", "/guides/como-obtener-un-numero-de-negocio-cra"), " explica cómo funciona el BN y cuándo se registran otros negocios."),
      { type: "heading", id: "corporation", text: "Abrir una cuenta de sociedad: de dónde salen los documentos" },
      p("La mayor parte de lo que un banco pide a una sociedad proviene de dos lugares: los documentos emitidos en la constitución y el libro de actas de la sociedad."),
      p("El certificado y los ", L("estatutos de constitución", "/guides/que-son-los-estatutos-de-constitucion"), " demuestran que la sociedad existe e indican su nombre legal exacto, su estructura de acciones y su oficina registrada. El gobierno los emite cuando se presenta la constitución."),
      p("El ", L("libro de actas", "/guides/que-es-un-libro-de-actas"), " contiene el resto: los reglamentos internos, los registros de directores, funcionarios y accionistas, las emisiones de acciones y las resoluciones aprobadas por los directores y los accionistas. Los bancos suelen pedir una resolución que autorice la cuenta y nombre a los firmantes, y los registros son la forma en que la sociedad demuestra quiénes son sus directores y propietarios significativos."),
      p("El registro de personas con control significativo forma parte de esos documentos. Las sociedades regidas por la Ley de Sociedades Comerciales de Canadá (CBCA) deben llevar un registro de personas con control significativo, es decir, quienes poseen o controlan el 25 % o más de las acciones (por votos o por valor justo de mercado) o ejercen un control de hecho. Desde el 22 de enero de 2024, las sociedades federales también presentan esa información ante Corporations Canada, cada año con la declaración anual y dentro de los 15 días siguientes a cualquier cambio en el registro. En Ontario, desde el 1 de enero de 2023, las sociedades privadas deben conservar el mismo tipo de información y proporcionarla cuando la soliciten las fuerzas del orden y las autoridades regulatorias y fiscales."),
      {
        type: "callout",
        title: "Toda constitución con Korporex incluye un libro de actas",
        text: "Cada paquete de constitución de Korporex incluye un libro de actas con los reglamentos internos, las resoluciones de organización y los registros de la sociedad, además del certificado y los estatutos. Son los documentos que los bancos suelen pedir cuando una sociedad nueva abre su primera cuenta.",
      },
      { type: "heading", id: "sole-proprietorship", text: "Cómo abre una empresa unipersonal una cuenta bancaria empresarial en Canadá" },
      p("Una empresa unipersonal no es una entidad jurídica separada, así que no hay una sociedad que verificar. La verificación se centra en el propietario, con alguno de los métodos permitidos por FINTRAC para personas, como una identificación con fotografía emitida por un gobierno."),
      p("Cuando el negocio opera con un nombre distinto al nombre completo del propietario, Ontario exige registrar ese nombre conforme a la Ley de Nombres Comerciales (Business Names Act). El registro, antes llamado Master Business Licence, tiene una validez de cinco años y luego se renueva. Un banco que abre una cuenta a nombre comercial suele pedir verlo, ya que vincula el nombre con el propietario. La guía ", L("cómo registrar una empresa unipersonal en Ontario", "/guides/como-registrar-una-empresa-unipersonal-en-ontario"), " explica el trámite, y Korporex ofrece el ", L("registro de empresa unipersonal", "/services/sole-proprietorship"), " como servicio."),
      { type: "heading", id: "step-by-step", text: "El proceso, paso a paso" },
      {
        type: "list",
        items: [
          "Completar la constitución o el registro del nombre comercial, para que el negocio conste en el registro público.",
          "Reunir los documentos: certificado y estatutos, libro de actas con registros y una resolución sobre firmantes para una sociedad; el registro del nombre para una empresa unipersonal que usa un nombre comercial.",
          "Identificar a todas las personas que el banco tendrá que verificar: los firmantes y, para una sociedad, los directores y cualquier persona con el 25 % o más de las acciones.",
          "Tener lista para cada una de esas personas una identificación que cumpla con el método de verificación del banco.",
          "Contactar a la institución, confirmar su lista vigente de documentos para su tipo de negocio y presentar la solicitud.",
          "Mantener el libro de actas al día después, ya que los bancos vuelven a confirmar la información de propiedad durante el seguimiento continuo.",
        ],
      },
      { type: "heading", id: "after-opening", text: "Después de abrir la cuenta" },
      p("Según la guía de FINTRAC, la confirmación de la propiedad efectiva ocurre al inicio de la relación y durante el seguimiento continuo. Cuando cambian los directores, se transfieren acciones o entra un nuevo propietario significativo, el banco puede pedir registros actualizados. Una sociedad con sus registros y resoluciones al día puede responder a esas solicitudes con su propio libro de actas."),
      p("En cuanto a la cuenta, la Agencia de Consumo en Materia Financiera de Canadá (FCAC) supervisa a las instituciones financieras reguladas a nivel federal y publica información sobre cargos y divulgación de datos de las cuentas. Su guía sobre apertura de cuentas está dirigida a cuentas personales; para una cuenta empresarial, los documentos de divulgación de la institución establecen los cargos y las condiciones."),
      { type: "heading", id: "korporex", text: "Preparar los documentos" },
      p("Si su negocio todavía no está constituido, puede ", L("constituirse en sociedad con Korporex", "/incorporate"), ", a nivel federal o en Ontario, y recibir juntos el certificado, los estatutos y un libro de actas completo, listos para el banco. Korporex no es un despacho de abogados ni una institución financiera; las preguntas sobre los requisitos de un banco en particular corresponden a ese banco."),
    ],
    faq: [
      {
        q: "¿Qué documentos necesita una sociedad para abrir una cuenta bancaria empresarial en Canadá?",
        a: "Los requisitos varían según la institución, pero se derivan de las normas de FINTRAC: prueba de que la sociedad existe (como el certificado de constitución o un certificado de estado vigente), su nombre y dirección, los nombres de sus directores, los nombres y direcciones de quienes poseen o controlan el 25 % o más de las acciones, información sobre su estructura de propiedad y control, y la identificación de las personas que operarán la cuenta. Los bancos también suelen pedir los estatutos y una resolución que nombre a los firmantes.",
      },
      {
        q: "¿Por qué el banco quiere ver el libro de actas?",
        a: "Los bancos deben tomar medidas razonables para confirmar la exactitud de la información sobre la propiedad efectiva, con un método distinto al usado para recopilarla. FINTRAC menciona la revisión de documentos oficiales como el libro de actas, el registro de accionistas y los estatutos de constitución como una forma de hacerlo.",
      },
      {
        q: "¿Puede una empresa unipersonal abrir una cuenta bancaria empresarial?",
        a: "Sí. Una empresa unipersonal no es una entidad jurídica separada, así que el banco verifica la identidad del propietario. Si el negocio usa un nombre distinto al nombre completo del propietario, Ontario exige registrar ese nombre, y los bancos suelen pedir ver el registro.",
      },
      {
        q: "¿Hay que identificar a todos los accionistas?",
        a: "Las normas de FINTRAC exigen que el banco obtenga los nombres y direcciones de todas las personas que, directa o indirectamente, poseen o controlan al menos el 25 % de las acciones. Los accionistas menores no están cubiertos por ese requisito concreto, aunque una institución puede pedir más información.",
      },
      {
        q: "¿Una constitución con Korporex incluye los documentos que pide el banco?",
        a: "Cada paquete de constitución de Korporex incluye el certificado y los estatutos de constitución, y un libro de actas con reglamentos internos, resoluciones de organización y registros. El banco decide cuáles necesita ver.",
      },
    ],
  },
};
