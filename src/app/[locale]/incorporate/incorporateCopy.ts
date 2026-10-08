// Visible copy for the /incorporate wizard in en/fr/es. Values submitted to the
// API (month names, share-class labels, option values) stay English; only the
// labels rendered on screen come from here.

import { useLocale } from "next-intl";
import { PACKAGE_COPY } from "@/lib/packages";
import type { Pkg } from "@/lib/pricing";

export type Lang = "en" | "fr" | "es";

type PkgText = { name: string; description: string; features: string[] };
type ClassText = { label: string; short: string; description: string };

const pick = (p: Pkg): PkgText => ({
  name: PACKAGE_COPY[p].name,
  description: PACKAGE_COPY[p].description,
  features: [...PACKAGE_COPY[p].features],
});

const en = {
  steps: ["Jurisdiction", "Package", "Business Info", "Directors", "Shareholders", "Officers", "Office Address", "Review & Pay"],
  back: "Back",
  continue: "Continue",
  continueToReview: "Continue to Review",
  remove: "Remove",
  invalidPre:
    "Some required information is missing or needs correcting. Please review the fields marked in red above. If everything looks filled in, email us at ",
  invalidPost: " and we’ll finish the order for you.",
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
  stepAria: (n: number, label: string) => `Step ${n}: ${label}`,
  goTo: (n: number, label: string) => `Go to step ${n}: ${label}`,
  locked: (label: string) => `Complete the earlier steps to reach ${label}`,

  // Address
  selectProvince: "Select province…",
  selectState: "Select state…",
  regionPh: "State / province / region",
  postalPh: "Postal / ZIP code",
  street: "Street Address",
  city: "City",
  state: "State",
  province: "Province",
  region: "Region",
  postal: "Postal / ZIP",
  country: "Country",
  withPrefix: (prefix: string, base: string) => (prefix ? `${prefix} ${base}` : base),
  billingPrefix: "Billing",
  provinces: {} as Record<string, string>,
  countries: {} as Record<string, string>,

  // Step 1
  s1H2: "Choose Your Jurisdiction",
  s1Intro:
    "Each Canadian jurisdiction we support is a valid incorporation route. The right choice depends on where you plan to operate, the name-protection scope you need, and your budget.",
  jurisdictions: {
    federal: {
      label: "Federal",
      sub: "Canada Business Corporations Act",
      desc: "Country-wide name protection. You can carry on business in any province with extra-provincial registration.",
    },
    ontario: {
      label: "Ontario",
      sub: "Ontario Business Corporations Act",
      desc: "Provincial corporation created under Ontario law. Automatic authorization to carry on business in Ontario.",
    },
  },
  faqPrompt: "Still weighing the options?",
  faqLink: "Read our FAQ",

  // Step 2
  s2H2: "Choose Your Package",
  s2Intro: "All prices include government filing fees. Prices in CAD.",
  money: (amt: string | number) => `$${amt}`,
  packages: { basic: pick("basic"), standard: pick("standard"), premium: pick("premium") } as Record<Pkg, PkgText>,

  // Step 3
  s3H2: "Business Details",
  s3Intro: "Tell us about the business you’re incorporating.",
  basicNameStrong: (fed: boolean) => `${fed ? "NUANS name search" : "Ontario name search"} required.`,
  basicNameBody: (fee: string) =>
    ` A ${fee} report fee applies and is shown separately at checkout. Choose a numbered corporation above to skip this fee.`,
  inclStrong: (fed: boolean) => `One ${fed ? "NUANS name search" : "Ontario name search"} included.`,
  inclBody: (pkgName: string, fed: boolean) =>
    ` Your ${pkgName} package covers one ${fed ? "NUANS name search" : "Ontario name search"} report for the name above, with no separate fee at checkout. If that name isn’t available and you want to try another, each additional search is `,
  inclFee: (fee: string) => `$${fee} + HST`,
  inclOrderedAt: ", ordered at ",
  naicsLabel: "Primary Activity (NAICS Code) *",
  naicsHint: "Search by code, activity, or sector.",
  activityLabel: "Business Activity Description *",
  activityHint: "A brief description of what your corporation will do.",
  activityPh: "e.g. Software development and IT consulting for small businesses.",
  officialEmailLabel: "Official Email Address *",
  officialEmailHint: "The corporation's primary contact email for government notices and correspondence.",
  officialEmailPh: "e.g. contact@yourcompany.com",
  fyeMonth: "Fiscal Year End - Month *",
  fyeDay: "Fiscal Year End - Day *",
  monthPh: "Month…",
  dayPh: "Day…",
  selectMonthFirst: "Select month first",
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

  // Step 4
  s4H2: "Directors",
  s4Intro:
    "At least one director is required. Directors must be 18 or older. International directors are supported; residency requirements vary by jurisdiction.",
  countTitle: "Please specify the Number of Directors for your Corporation",
  countP1:
    "The number of directors can be a fixed number of directors (e.g. 3) or a minimum/maximum number (e.g. minimum 3, maximum 5).",
  countP2:
    "If you indicated 3 as the fixed number, you must provide the director information for 3 directors. If you indicated 3 as a minimum and 5 as a maximum, you must provide the information for either 3, 4, or 5 directors.",
  basicCountPre: "Your Basic package includes one director, so the Articles will fix the number of directors at ",
  basicCountPost: ". Choose Standard or Premium if you need more.",
  countLabel: "Number of Directors *",
  fixedOpt: "Fixed Number",
  rangeOpt: "Minimum / Maximum",
  fixedLabel: "Fixed Number of Directors *",
  minLabel: "Minimum Number of Directors *",
  maxLabel: "Maximum Number of Directors *",
  directorN: (n: number) => `Director ${n}`,
  firstName: "First Name *",
  lastName: "Last Name *",
  emailAddr: "Email Address *",
  dob: "Date of Birth *",
  taxResidency: "Country of Tax Residency *",
  selectCountry: "-- Select a country --",
  residencyStatus: "Residency Status *",
  citizenship: { citizen: "Canadian citizen", permanent_resident: "Permanent resident", other: "Other" } as Record<string, string>,
  residentCanadian: "Resident Canadian *",
  iAmResident: "I am a resident Canadian",
  iAmNotResident: "I am not a resident Canadian",
  cbcaIntro: "Per s. 2(1) of the Canada Business Corporations Act, resident Canadian means an individual who is",
  cbcaA: "(a) a Canadian citizen ordinarily resident in Canada,",
  cbcaB: "(b) a Canadian citizen not ordinarily resident in Canada who is a member of a prescribed class of persons, or",
  cbcaC:
    "(c) a permanent resident within the meaning of subsection 2(1) of the Immigration and Refugee Protection Act and ordinarily resident in Canada, except a permanent resident who has been ordinarily resident in Canada for more than one year after the time at which he or she first became eligible to apply for Canadian citizenship; (résident canadien)",
  addDirector: "Add Another Director",

  // Step 5
  s5H2: "Shareholders",
  s5Intro: "List all initial shareholders of the corporation. International shareholders are supported.",
  classesTitle: "Share Classes for Your Corporation",
  classesIntro: (premium: boolean) =>
    `Your ${premium ? "Premium" : "Standard"} package allows up to ${premium ? "five" : "three"} share classes in the Articles of Incorporation. Select the class(es) you want the corporation to be authorized to issue. Each shareholder below can then be assigned to one of the classes you select.`,
  shareClasses: {} as Record<string, ClassText>,
  commonShares: "Common Shares",
  selectClassError: "Select at least one share class for the corporation.",
  classesNotePre:
    "The selected classes are what Korporex will declare in the Articles of Incorporation. Each shareholder below picks which of these classes they will hold. Korporex does not provide legal or tax advice on share structure. If you’re unsure, ",
  lawyerLink: "speak with a corporate lawyer",
  shareholderN: (n: number) => `Shareholder ${n}`,
  shareClassLabel: "Share Class *",
  selectClassFirst: "Select a share class above first",
  numShares: "Number of Shares *",
  pricePerShare: "Price per Share (CAD) *",
  citizenshipLabel: "Citizenship *",
  priceNoteA: "Enter any positive dollar amount per share. The price can be ",
  priceEx1: "$1.00",
  priceNoteB: ". The total subscription amount equals price per share × number of shares (for example, ",
  priceEx2: "100 shares × $1.00 = $100.00 total",
  priceNoteC:
    "). This is a numeric example only. Korporex does not provide legal or tax advice on share pricing. If you’re unsure, ",
  addShareholder: "Add Another Shareholder",

  // Step 6
  s6H2: "Officers",
  s6Intro: "List the corporation’s officers and their positions. At least one officer is required.",
  officerN: (n: number) => `Officer ${n}`,
  position: "Position *",
  pleaseSelect: "-- Please Select --",
  addOfficer: "Add Another Officer",
  signTitle: "Authorized Signing Officers",
  signQ: "Who may sign contracts, instruments and other documents on behalf of the corporation?",
  signLabel: "Authorized Signing Officers *",
  bankTitle: "Banking Signing Authority",
  bankQ:
    "Who may sign cheques and operate the corporation’s bank accounts? Your bank will ask for this when you open the business account.",
  bankLabel: "Banking Signing Authority *",
  authority: {
    all_directors: "All of the directors",
    any_director_or_officer: "Any director or officer",
    president_alone: "President alone",
    president_and_secretary: "President and Secretary together",
    president_and_director: "President and a Director together",
  } as Record<string, string>,
  bankNotePre:
    "Make sure the officers you listed above cover the choices here. Korporex does not provide legal advice on signing authority. If you’re unsure, ",

  // Step 7
  s7H2: "Registered Office",
  s7Intro: (fed: boolean) =>
    `Must be a physical address in ${fed ? "any Canadian province or territory" : "Ontario"}, not a P.O. Box.`,
  howProvide: "How will you provide an address?",
  ownTitle: "I'll provide my own registered office address",
  ownSub: "Enter an address you control in the fields below.",
  torontoTitle: "Korporex office: Toronto",
  torontoSub: "Downtown Toronto address chosen by Korporex. Monthly mail scans emailed to you.",
  burlTitle: "Korporex office: Burlington",
  burlSub: "Burlington, Ontario address chosen by Korporex. Monthly mail scans emailed to you.",
  perMonth: (amt: string) => `$${amt}/mo`,
  billedAnnually: (amt: string) => `billed annually in advance at $${amt} + HST`,
  regOfficeLabel: "Korporex Registered Office",
  locationLabels: { korporex: "Downtown Toronto", burlington: "Burlington" } as Record<string, string>,
  assignedToronto:
    "Korporex selects and assigns the registered office address in downtown Toronto, at our discretion before your Articles of Incorporation are filed. The street address is not disclosed in advance.",
  assignedOther: (loc: string) =>
    `Korporex provides a registered office address in ${loc}, Ontario, chosen by Korporex. The specific street address is not disclosed in advance.`,
  bullet1: "Monthly scanned copy of mail received at the address, emailed to you.",
  bullet2: "The Korporex registered office address appears on your Articles of Incorporation and the public corporate registry.",
  bullet3Pre: (amt: string) => `$${amt} CAD billed annually in advance, plus HST. `,
  nonRefundable: "Non-refundable",
  bullet3Post: ", including if you obtain your own registered office address before the term ends.",
  noAddress: (fed: boolean) =>
    `Don’t have a physical address in ${fed ? "any Canadian province or territory" : "Ontario"}? Use the Korporex registered office option above instead.`,

  // Step 8
  s8H2: "Review & Pay",
  orderSummary: "Order Summary",
  rowJurisdiction: "Jurisdiction",
  rowPackage: "Package",
  rowCorporation: "Corporation",
  rowOfficialEmail: "Official Email",
  rowNumDirectors: "Number of Directors",
  fixedAt: (n: string) => `Fixed at ${n}`,
  minMax: (a: string, b: string) => `Minimum ${a}, maximum ${b}`,
  rowDirectors: "Directors",
  rowShareholders: "Shareholders",
  rowOfficers: "Officers",
  rowSigning: "Signing Officers",
  rowBanking: "Banking Authority",
  rowRegOffice: "Registered Office",
  jurisLabels: { federal: "Federal (Canada)", ontario: "Ontario" } as Record<string, string>,
  numberedCorp: (juris: string) => `Numbered corporation (${juris})`,
  pkgLine: (pkg: string, juris: string) => `${pkg} package (${juris})`,
  nuansLine: "NUANS name-search report",
  addonLine: (loc: string) => `Registered office - ${loc} (12 mo)`,
  subtotal: "Subtotal",
  tax: "Tax",
  taxSelectRegion: "Tax (select region below)",
  taxIntl: "Tax (international, $0)",
  total: "Total (CAD)",
  filingNote: "Government filing fees are included in the package price. Taxes update live based on your billing address below.",
  billingDetails: "Billing Details",
  billingName: "Billing Name *",
  billingPh: "Jane Smith or Acme Ltd.",
  stripePre: "You’ll be redirected to ",
  stripePost: " to complete payment securely. Card details are entered on stripe.com, never on Korporex.",
  submitting: "Redirecting to Stripe…",
  submit: (amt: string) => `Continue to Payment: $${amt}`,
  agreePre: "By continuing you agree to our ",
  terms: "Terms of Service",
  and: " and ",
  privacy: "Privacy Policy",
  genericError: "Something went wrong. Please try again or email us at contact@korporex.ca.",
  submissionFailed: "Submission failed",
  noUrl: "Checkout session did not return a URL",

  // Wizard shell
  restored: "We restored the details you entered last time. Nothing has been submitted or charged yet.",
  startOver: "Start over",
  notSure: "Not sure?",
  speakLawyer: "Speak with a lawyer",
};

export type Copy = typeof en;

const fr: Copy = {
  steps: ["Territoire", "Forfait", "Entreprise", "Administrateurs", "Actionnaires", "Dirigeants", "Siège social", "Vérification et paiement"],
  back: "Retour",
  continue: "Continuer",
  continueToReview: "Passer à la vérification",
  remove: "Supprimer",
  invalidPre:
    "Certains renseignements obligatoires sont manquants ou doivent être corrigés. Veuillez vérifier les champs indiqués en rouge ci-dessus. Si tout semble rempli, écrivez-nous à ",
  invalidPost: " et nous terminerons la commande pour vous.",
  stepOf: (n, total) => `Étape ${n} sur ${total}`,
  stepAria: (n, label) => `Étape ${n} : ${label}`,
  goTo: (n, label) => `Aller à l'étape ${n} : ${label}`,
  locked: (label) => `Terminez les étapes précédentes pour accéder à : ${label}`,

  selectProvince: "Choisir la province…",
  selectState: "Choisir l'État…",
  regionPh: "État / province / région",
  postalPh: "Code postal",
  street: "Adresse municipale",
  city: "Ville",
  state: "État",
  province: "Province",
  region: "Région",
  postal: "Code postal",
  country: "Pays",
  withPrefix: (prefix, base) => (prefix ? `${base} (${prefix})` : base),
  billingPrefix: "facturation",
  provinces: {
    AB: "Alberta", BC: "Colombie-Britannique", MB: "Manitoba", NB: "Nouveau-Brunswick",
    NL: "Terre-Neuve-et-Labrador", NS: "Nouvelle-Écosse", NT: "Territoires du Nord-Ouest", NU: "Nunavut",
    ON: "Ontario", PE: "Île-du-Prince-Édouard", QC: "Québec", SK: "Saskatchewan", YT: "Yukon",
  },
  countries: {
    CA: "Canada", US: "États-Unis", GB: "Royaume-Uni", AU: "Australie", IN: "Inde", DE: "Allemagne",
    FR: "France", IE: "Irlande", NZ: "Nouvelle-Zélande", SG: "Singapour", AE: "Émirats arabes unis",
    OTHER: "Autre / non listé",
  },

  s1H2: "Choisissez votre territoire de constitution",
  s1Intro:
    "Chaque territoire canadien que nous offrons est une voie valable de constitution en société. Le bon choix dépend de l'endroit où vous prévoyez exercer vos activités, de l'étendue de la protection du nom dont vous avez besoin et de votre budget.",
  jurisdictions: {
    federal: {
      label: "Fédéral",
      sub: "Loi canadienne sur les sociétés par actions (LCSA)",
      desc: "Protection du nom à l'échelle du pays. Vous pouvez exercer des activités dans toute province au moyen d'un enregistrement extraprovincial.",
    },
    ontario: {
      label: "Ontario",
      sub: "Loi sur les sociétés par actions de l'Ontario (LSAO)",
      desc: "Société provinciale constituée en vertu des lois de l'Ontario. Autorisation automatique d'exercer des activités en Ontario.",
    },
  },
  faqPrompt: "Vous hésitez encore?",
  faqLink: "Consultez notre FAQ",

  s2H2: "Choisissez votre forfait",
  s2Intro: "Tous les prix comprennent les frais de dépôt gouvernementaux. Prix en dollars canadiens.",
  money: (amt) => `${amt} $`,
  packages: {
    basic: {
      name: "Basique",
      description:
        "Pour les fondateurs seuls.\nLa façon la plus simple de constituer une société. Idéal pour les consultants, les travailleurs autonomes et les sociétés de portefeuille à propriétaire unique.",
      features: [
        "Dépôt des statuts constitutifs, y compris le certificat de constitution et la clé d'entreprise",
        "Société à numéro",
        "1 catégorie d'actions",
        "1 actionnaire, 1 administrateur et 1 dirigeant",
        "Registre des procès-verbaux numérique standard (documents en anglais)",
        "Tous les dépôts obligatoires après la constitution",
        "Traitement en 24 heures",
      ],
    },
    standard: {
      name: "Standard",
      description:
        "Pour les équipes fondatrices.\nConçu pour les cofondateurs, les conjoints qui se constituent en société ensemble et les petites associations prêtes à exercer leurs activités sous une dénomination sociale.",
      features: [
        "Dépôt des statuts constitutifs, y compris le certificat de constitution et la clé d'entreprise",
        "Société à numéro ou société avec dénomination sociale (une recherche de nom NUANS incluse)",
        "Jusqu'à 3 catégories d'actions",
        "Jusqu'à 3 actionnaires, 3 administrateurs et 3 dirigeants",
        "Registre des procès-verbaux numérique standard (documents en anglais)",
        "Tous les dépôts obligatoires après la constitution",
        "Traitement en 24 heures",
      ],
    },
    premium: {
      name: "Premium",
      description:
        "Pour les entreprises à plusieurs parties prenantes.\nConçu pour les entreprises qui comptent plusieurs fondateurs, conseillers ou membres de la famille, avec la structure d'actions correspondante.",
      features: [
        "Dépôt des statuts constitutifs, y compris le certificat de constitution et la clé d'entreprise",
        "Société à numéro ou société avec dénomination sociale (une recherche de nom NUANS incluse)",
        "Jusqu'à 5 catégories d'actions",
        "Jusqu'à 5 actionnaires, 5 administrateurs et 5 dirigeants",
        "Registre des procès-verbaux numérique standard (documents en anglais)",
        "Tous les dépôts obligatoires après la constitution",
        "Traitement en 24 heures",
      ],
    },
  },

  s3H2: "Renseignements sur l'entreprise",
  s3Intro: "Parlez-nous de l'entreprise que vous constituez en société.",
  basicNameStrong: (fed) => `${fed ? "Recherche de nom NUANS" : "Recherche de nom en Ontario"} requise.`,
  basicNameBody: (fee) =>
    ` Des frais de rapport de ${fee} s'appliquent et sont indiqués séparément au paiement. Choisissez une société à numéro ci-dessus pour éviter ces frais.`,
  inclStrong: (fed) => `Une ${fed ? "recherche de nom NUANS" : "recherche de nom en Ontario"} incluse.`,
  inclBody: (pkgName, fed) =>
    ` Votre forfait ${pkgName} couvre un rapport de ${fed ? "recherche de nom NUANS" : "recherche de nom en Ontario"} pour la dénomination ci-dessus, sans frais distincts au paiement. Si cette dénomination n'est pas disponible et que vous souhaitez en essayer une autre, chaque recherche supplémentaire coûte `,
  inclFee: (fee) => `${fee} $ + TVH`,
  inclOrderedAt: ", à commander sur ",
  naicsLabel: "Activité principale (code SCIAN) *",
  naicsHint: "Recherchez par code, activité ou secteur.",
  activityLabel: "Description de l'activité de l'entreprise *",
  activityHint: "Une brève description de ce que fera votre société.",
  activityPh: "p. ex. Développement de logiciels et services-conseils en TI pour les petites entreprises.",
  officialEmailLabel: "Adresse courriel officielle *",
  officialEmailHint: "Le courriel principal de la société pour les avis gouvernementaux et la correspondance.",
  officialEmailPh: "p. ex. contact@votreentreprise.com",
  fyeMonth: "Fin d'exercice - Mois *",
  fyeDay: "Fin d'exercice - Jour *",
  monthPh: "Mois…",
  dayPh: "Jour…",
  selectMonthFirst: "Choisissez d'abord le mois",
  months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],

  s4H2: "Administrateurs",
  s4Intro:
    "Au moins un administrateur est requis. Les administrateurs doivent avoir 18 ans ou plus. Les administrateurs étrangers sont acceptés; les exigences de résidence varient selon le territoire.",
  countTitle: "Veuillez préciser le nombre d'administrateurs de votre société",
  countP1:
    "Le nombre d'administrateurs peut être un nombre fixe (p. ex. 3) ou un nombre minimal et maximal (p. ex. minimum 3, maximum 5).",
  countP2:
    "Si vous indiquez 3 comme nombre fixe, vous devez fournir les renseignements de 3 administrateurs. Si vous indiquez un minimum de 3 et un maximum de 5, vous devez fournir les renseignements de 3, 4 ou 5 administrateurs.",
  basicCountPre: "Votre forfait Basique comprend un administrateur; les statuts fixeront donc le nombre d'administrateurs à ",
  basicCountPost: ". Choisissez le forfait Standard ou Premium s'il vous en faut davantage.",
  countLabel: "Nombre d'administrateurs *",
  fixedOpt: "Nombre fixe",
  rangeOpt: "Minimum / maximum",
  fixedLabel: "Nombre fixe d'administrateurs *",
  minLabel: "Nombre minimal d'administrateurs *",
  maxLabel: "Nombre maximal d'administrateurs *",
  directorN: (n) => `Administrateur ${n}`,
  firstName: "Prénom *",
  lastName: "Nom de famille *",
  emailAddr: "Adresse courriel *",
  dob: "Date de naissance *",
  taxResidency: "Pays de résidence fiscale *",
  selectCountry: "-- Choisir un pays --",
  residencyStatus: "Statut de résidence *",
  citizenship: { citizen: "Citoyen canadien", permanent_resident: "Résident permanent", other: "Autre" },
  residentCanadian: "Résident canadien *",
  iAmResident: "Je suis résident canadien",
  iAmNotResident: "Je ne suis pas résident canadien",
  cbcaIntro: "Selon le paragraphe 2(1) de la Loi canadienne sur les sociétés par actions, résident canadien s'entend d'un particulier qui est, selon le cas :",
  cbcaA: "a) un citoyen canadien résidant habituellement au Canada;",
  cbcaB: "b) un citoyen canadien ne résidant pas habituellement au Canada et faisant partie d'une catégorie réglementaire de personnes;",
  cbcaC:
    "c) un résident permanent au sens du paragraphe 2(1) de la Loi sur l'immigration et la protection des réfugiés et résidant habituellement au Canada, à l'exception de celui qui y réside habituellement depuis plus d'un an après avoir acquis pour la première fois le droit de demander la citoyenneté canadienne.",
  addDirector: "Ajouter un administrateur",

  s5H2: "Actionnaires",
  s5Intro: "Indiquez tous les actionnaires initiaux de la société. Les actionnaires étrangers sont acceptés.",
  classesTitle: "Catégories d'actions de votre société",
  classesIntro: (premium) =>
    `Votre forfait ${premium ? "Premium" : "Standard"} permet jusqu'à ${premium ? "cinq" : "trois"} catégories d'actions dans les statuts constitutifs. Choisissez la ou les catégories que la société sera autorisée à émettre. Chaque actionnaire ci-dessous pourra ensuite être associé à l'une des catégories choisies.`,
  shareClasses: {
    A: {
      label: "Actions ordinaires de catégorie A",
      short: "Droit de vote, dividendes, participation",
      description:
        "Comportent un droit de vote par action. Donnent droit aux dividendes si, quand et dans la mesure où les administrateurs en déclarent. Donnent droit de participer au reliquat des biens de la société à sa dissolution.",
    },
    B: {
      label: "Actions ordinaires de catégorie B (sans droit de vote)",
      short: "Sans droit de vote, dividendes, participation",
      description:
        "Ne comportent aucun droit de vote. Donnent droit aux dividendes si, quand et dans la mesure où les administrateurs en déclarent. Donnent droit de participer au reliquat des biens de la société à sa dissolution.",
    },
    C: {
      label: "Actions privilégiées de catégorie C",
      short: "Sans droit de vote, dividende fixe, priorité sur le capital",
      description:
        "Ne comportent aucun droit de vote. Donnent droit à un dividende fixe ou préférentiel si, quand et dans la mesure où les administrateurs en déclarent. Donnent droit, à la dissolution, au remboursement du montant de rachat en priorité sur les actions ordinaires. Ne participent pas au reliquat des biens de la société au-delà du montant de rachat. Rachetables par la société et encaissables par le porteur à un montant de rachat déterminé.",
    },
    D: {
      label: "Actions spéciales de catégorie D",
      short: "Sans droit de vote, dividende discrétionnaire",
      description:
        "Ne comportent aucun droit de vote ni droit fixe aux dividendes. Peuvent recevoir des dividendes si, quand et dans la mesure où les administrateurs en déclarent, séparément et en montants différents des autres catégories. Donnent droit, à la dissolution, au remboursement du montant versé sur les actions, sans autre participation.",
    },
    E: {
      label: "Actions privilégiées rachetables de catégorie E",
      short: "Sans droit de vote, rachetables, priorité sur le capital",
      description:
        "Ne comportent aucun droit de vote. Rachetables par la société et encaissables par le porteur à un montant de rachat fixe. Donnent droit, à la dissolution, au remboursement du montant de rachat en priorité sur les actions ordinaires. Ne participent pas au reliquat des biens de la société au-delà du montant de rachat.",
    },
  },
  commonShares: "Actions ordinaires",
  selectClassError: "Choisissez au moins une catégorie d'actions pour la société.",
  classesNotePre:
    "Les catégories choisies sont celles que Korporex déclarera dans les statuts constitutifs. Chaque actionnaire ci-dessous indique la catégorie qu'il détiendra. Korporex ne fournit pas de conseils juridiques ou fiscaux sur la structure du capital-actions. En cas de doute, ",
  lawyerLink: "consultez un avocat en droit des sociétés",
  shareholderN: (n) => `Actionnaire ${n}`,
  shareClassLabel: "Catégorie d'actions *",
  selectClassFirst: "Choisissez d'abord une catégorie d'actions ci-dessus",
  numShares: "Nombre d'actions *",
  pricePerShare: "Prix par action (CAD) *",
  citizenshipLabel: "Citoyenneté *",
  priceNoteA: "Entrez tout montant positif en dollars par action. Le prix peut être de ",
  priceEx1: "1,00 $",
  priceNoteB: ". Le montant total de la souscription est égal au prix par action × le nombre d'actions (par exemple, ",
  priceEx2: "100 actions × 1,00 $ = 100,00 $ au total",
  priceNoteC:
    "). Il s'agit uniquement d'un exemple numérique. Korporex ne fournit pas de conseils juridiques ou fiscaux sur le prix des actions. En cas de doute, ",
  addShareholder: "Ajouter un actionnaire",

  s6H2: "Dirigeants",
  s6Intro: "Indiquez les dirigeants de la société et leurs postes. Au moins un dirigeant est requis.",
  officerN: (n) => `Dirigeant ${n}`,
  position: "Poste *",
  pleaseSelect: "-- Veuillez choisir --",
  addOfficer: "Ajouter un dirigeant",
  signTitle: "Signataires autorisés",
  signQ: "Qui peut signer les contrats, les actes et les autres documents au nom de la société?",
  signLabel: "Signataires autorisés *",
  bankTitle: "Pouvoir de signature bancaire",
  bankQ:
    "Qui peut signer les chèques et gérer les comptes bancaires de la société? Votre banque vous le demandera à l'ouverture du compte d'entreprise.",
  bankLabel: "Pouvoir de signature bancaire *",
  authority: {
    all_directors: "Tous les administrateurs",
    any_director_or_officer: "Tout administrateur ou dirigeant",
    president_alone: "Le président seul",
    president_and_secretary: "Le président et le secrétaire conjointement",
    president_and_director: "Le président et un administrateur conjointement",
  },
  bankNotePre:
    "Assurez-vous que les dirigeants indiqués ci-dessus correspondent aux choix faits ici. Korporex ne fournit pas de conseils juridiques sur le pouvoir de signature. En cas de doute, ",

  s7H2: "Siège social",
  s7Intro: (fed) =>
    `Doit être une adresse physique ${fed ? "dans une province ou un territoire du Canada" : "en Ontario"}, et non une case postale.`,
  howProvide: "Comment fournirez-vous une adresse?",
  ownTitle: "Je fournirai ma propre adresse de siège social",
  ownSub: "Entrez ci-dessous une adresse dont vous avez le contrôle.",
  torontoTitle: "Bureau Korporex : Toronto",
  torontoSub: "Adresse au centre-ville de Toronto choisie par Korporex. Numérisation mensuelle du courrier envoyée par courriel.",
  burlTitle: "Bureau Korporex : Burlington",
  burlSub: "Adresse à Burlington (Ontario) choisie par Korporex. Numérisation mensuelle du courrier envoyée par courriel.",
  perMonth: (amt) => `${amt} $/mois`,
  billedAnnually: (amt) => `facturé annuellement à l'avance à ${amt} $ + TVH`,
  regOfficeLabel: "Siège social Korporex",
  locationLabels: { korporex: "Centre-ville de Toronto", burlington: "Burlington" },
  assignedToronto:
    "Korporex choisit et attribue l'adresse du siège social au centre-ville de Toronto, à sa discrétion, avant le dépôt de vos statuts constitutifs. L'adresse municipale n'est pas communiquée à l'avance.",
  assignedOther: (loc) =>
    `Korporex fournit une adresse de siège social à ${loc} (Ontario), choisie par Korporex. L'adresse municipale précise n'est pas communiquée à l'avance.`,
  bullet1: "Copie numérisée mensuelle du courrier reçu à l'adresse, envoyée par courriel.",
  bullet2: "L'adresse du siège social Korporex figure dans vos statuts constitutifs et au registre public des sociétés.",
  bullet3Pre: (amt) => `${amt} $ CAD facturés annuellement à l'avance, plus TVH. `,
  nonRefundable: "Non remboursable",
  bullet3Post: ", y compris si vous obtenez votre propre adresse de siège social avant la fin de la période.",
  noAddress: (fed) =>
    `Vous n'avez pas d'adresse physique ${fed ? "dans une province ou un territoire du Canada" : "en Ontario"}? Choisissez plutôt l'option de siège social Korporex ci-dessus.`,

  s8H2: "Vérification et paiement",
  orderSummary: "Résumé de la commande",
  rowJurisdiction: "Territoire",
  rowPackage: "Forfait",
  rowCorporation: "Société",
  rowOfficialEmail: "Courriel officiel",
  rowNumDirectors: "Nombre d'administrateurs",
  fixedAt: (n) => `Fixé à ${n}`,
  minMax: (a, b) => `Minimum ${a}, maximum ${b}`,
  rowDirectors: "Administrateurs",
  rowShareholders: "Actionnaires",
  rowOfficers: "Dirigeants",
  rowSigning: "Signataires autorisés",
  rowBanking: "Pouvoir bancaire",
  rowRegOffice: "Siège social",
  jurisLabels: { federal: "Fédéral (Canada)", ontario: "Ontario" },
  numberedCorp: (juris) => `Société à numéro (${juris})`,
  pkgLine: (pkg, juris) => `Forfait ${pkg} (${juris})`,
  nuansLine: "Rapport de recherche de nom NUANS",
  addonLine: (loc) => `Siège social - ${loc} (12 mois)`,
  subtotal: "Sous-total",
  tax: "Taxe",
  taxSelectRegion: "Taxe (choisissez la région ci-dessous)",
  taxIntl: "Taxe (international, 0 $)",
  total: "Total (CAD)",
  filingNote: "Les frais de dépôt gouvernementaux sont compris dans le prix du forfait. Les taxes se mettent à jour selon votre adresse de facturation ci-dessous.",
  billingDetails: "Renseignements de facturation",
  billingName: "Nom de facturation *",
  billingPh: "Jeanne Tremblay ou Acme Ltée",
  stripePre: "Vous serez redirigé vers ",
  stripePost: " pour effectuer le paiement en toute sécurité. Les données de carte sont saisies sur stripe.com, jamais sur Korporex.",
  submitting: "Redirection vers Stripe…",
  submit: (amt) => `Passer au paiement : ${amt} $`,
  agreePre: "En continuant, vous acceptez nos ",
  terms: "conditions d'utilisation",
  and: " et notre ",
  privacy: "politique de confidentialité",
  genericError: "Une erreur s'est produite. Veuillez réessayer ou nous écrire à contact@korporex.ca.",
  submissionFailed: "L'envoi a échoué",
  noUrl: "La session de paiement n'a pas renvoyé d'adresse URL",

  restored: "Nous avons restauré les renseignements saisis lors de votre dernière visite. Rien n'a encore été soumis ni facturé.",
  startOver: "Recommencer",
  notSure: "Vous hésitez?",
  speakLawyer: "Consultez un avocat",
};

const es: Copy = {
  steps: ["Jurisdicción", "Paquete", "Empresa", "Directores", "Accionistas", "Funcionarios", "Domicilio social", "Revisión y pago"],
  back: "Atrás",
  continue: "Continuar",
  continueToReview: "Continuar a la revisión",
  remove: "Eliminar",
  invalidPre:
    "Falta información obligatoria o debe corregirse. Revise los campos marcados en rojo arriba. Si todo parece completo, escríbanos a ",
  invalidPost: " y terminaremos el pedido por usted.",
  stepOf: (n, total) => `Paso ${n} de ${total}`,
  stepAria: (n, label) => `Paso ${n}: ${label}`,
  goTo: (n, label) => `Ir al paso ${n}: ${label}`,
  locked: (label) => `Complete los pasos anteriores para llegar a: ${label}`,

  selectProvince: "Seleccione la provincia…",
  selectState: "Seleccione el estado…",
  regionPh: "Estado / provincia / región",
  postalPh: "Código postal",
  street: "Dirección",
  city: "Ciudad",
  state: "Estado",
  province: "Provincia",
  region: "Región",
  postal: "Código postal",
  country: "País",
  withPrefix: (prefix, base) => (prefix ? `${base} (${prefix})` : base),
  billingPrefix: "facturación",
  provinces: {
    AB: "Alberta", BC: "Columbia Británica", MB: "Manitoba", NB: "Nuevo Brunswick",
    NL: "Terranova y Labrador", NS: "Nueva Escocia", NT: "Territorios del Noroeste", NU: "Nunavut",
    ON: "Ontario", PE: "Isla del Príncipe Eduardo", QC: "Quebec", SK: "Saskatchewan", YT: "Yukón",
  },
  countries: {
    CA: "Canadá", US: "Estados Unidos", GB: "Reino Unido", AU: "Australia", IN: "India", DE: "Alemania",
    FR: "Francia", IE: "Irlanda", NZ: "Nueva Zelanda", SG: "Singapur", AE: "Emiratos Árabes Unidos",
    OTHER: "Otro / no listado",
  },

  s1H2: "Elija su jurisdicción",
  s1Intro:
    "Cada jurisdicción canadiense que ofrecemos es una vía válida de constitución de sociedad. La opción adecuada depende de dónde planea operar, del alcance de protección del nombre que necesita y de su presupuesto.",
  jurisdictions: {
    federal: {
      label: "Federal",
      sub: "Canada Business Corporations Act (CBCA)",
      desc: "Protección del nombre en todo el país. Puede operar en cualquier provincia mediante un registro extraprovincial.",
    },
    ontario: {
      label: "Ontario",
      sub: "Ontario Business Corporations Act (OBCA)",
      desc: "Sociedad provincial constituida conforme a la ley de Ontario. Autorización automática para operar en Ontario.",
    },
  },
  faqPrompt: "¿Aún está evaluando las opciones?",
  faqLink: "Lea nuestras preguntas frecuentes",

  s2H2: "Elija su paquete",
  s2Intro: "Todos los precios incluyen las tasas gubernamentales de presentación. Precios en CAD.",
  money: (amt) => `$${amt}`,
  packages: {
    basic: {
      name: "Básico",
      description:
        "Para fundadores individuales.\nLa forma más sencilla de constituir una sociedad. Ideal para consultores, trabajadores independientes y sociedades holding de un solo propietario.",
      features: [
        "Presentación de los estatutos de constitución, incluido el certificado de constitución y la clave de la empresa",
        "Sociedad numerada",
        "1 clase de acciones",
        "1 accionista, 1 director y 1 funcionario",
        "Libro de actas digital estándar (documentos en inglés)",
        "Todas las presentaciones obligatorias posteriores a la constitución",
        "Tramitación en 24 horas",
      ],
    },
    standard: {
      name: "Estándar",
      description:
        "Para equipos fundadores.\nPensado para cofundadores, cónyuges que se constituyen juntos y pequeñas asociaciones listas para operar bajo una denominación social.",
      features: [
        "Presentación de los estatutos de constitución, incluido el certificado de constitución y la clave de la empresa",
        "Sociedad numerada o con denominación social (incluye una búsqueda de nombre NUANS)",
        "Hasta 3 clases de acciones",
        "Hasta 3 accionistas, 3 directores y 3 funcionarios",
        "Libro de actas digital estándar (documentos en inglés)",
        "Todas las presentaciones obligatorias posteriores a la constitución",
        "Tramitación en 24 horas",
      ],
    },
    premium: {
      name: "Premium",
      description:
        "Para empresas con múltiples partes interesadas.\nDiseñado para empresas con varios fundadores, asesores o familiares, y la estructura accionarial correspondiente.",
      features: [
        "Presentación de los estatutos de constitución, incluido el certificado de constitución y la clave de la empresa",
        "Sociedad numerada o con denominación social (incluye una búsqueda de nombre NUANS)",
        "Hasta 5 clases de acciones",
        "Hasta 5 accionistas, 5 directores y 5 funcionarios",
        "Libro de actas digital estándar (documentos en inglés)",
        "Todas las presentaciones obligatorias posteriores a la constitución",
        "Tramitación en 24 horas",
      ],
    },
  },

  s3H2: "Datos de la empresa",
  s3Intro: "Cuéntenos sobre la empresa que está constituyendo.",
  basicNameStrong: (fed) => `Se requiere ${fed ? "una búsqueda de nombre NUANS" : "una búsqueda de nombre en Ontario"}.`,
  basicNameBody: (fee) =>
    ` Se aplica una tarifa de informe de ${fee}, que se muestra por separado al pagar. Elija una sociedad numerada arriba para evitar esta tarifa.`,
  inclStrong: (fed) => `Incluye ${fed ? "una búsqueda de nombre NUANS" : "una búsqueda de nombre en Ontario"}.`,
  inclBody: (pkgName, fed) =>
    ` Su paquete ${pkgName} cubre un informe de ${fed ? "búsqueda de nombre NUANS" : "búsqueda de nombre en Ontario"} para el nombre indicado arriba, sin cargo adicional al pagar. Si ese nombre no está disponible y desea probar otro, cada búsqueda adicional cuesta `,
  inclFee: (fee) => `$${fee} + HST`,
  inclOrderedAt: ", y se solicita en ",
  naicsLabel: "Actividad principal (código NAICS) *",
  naicsHint: "Busque por código, actividad o sector.",
  activityLabel: "Descripción de la actividad de la empresa *",
  activityHint: "Una breve descripción de lo que hará su sociedad.",
  activityPh: "p. ej. Desarrollo de software y consultoría de TI para pequeñas empresas.",
  officialEmailLabel: "Correo electrónico oficial *",
  officialEmailHint: "El correo principal de la sociedad para avisos gubernamentales y correspondencia.",
  officialEmailPh: "p. ej. contacto@suempresa.com",
  fyeMonth: "Cierre del ejercicio fiscal - Mes *",
  fyeDay: "Cierre del ejercicio fiscal - Día *",
  monthPh: "Mes…",
  dayPh: "Día…",
  selectMonthFirst: "Seleccione primero el mes",
  months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],

  s4H2: "Directores",
  s4Intro:
    "Se requiere al menos un director. Los directores deben tener 18 años o más. Se admiten directores internacionales; los requisitos de residencia varían según la jurisdicción.",
  countTitle: "Indique el número de directores de su sociedad",
  countP1:
    "El número de directores puede ser un número fijo (p. ej. 3) o un número mínimo y máximo (p. ej. mínimo 3, máximo 5).",
  countP2:
    "Si indicó 3 como número fijo, debe proporcionar la información de 3 directores. Si indicó un mínimo de 3 y un máximo de 5, debe proporcionar la información de 3, 4 o 5 directores.",
  basicCountPre: "Su paquete Básico incluye un director, por lo que los estatutos fijarán el número de directores en ",
  basicCountPost: ". Elija Estándar o Premium si necesita más.",
  countLabel: "Número de directores *",
  fixedOpt: "Número fijo",
  rangeOpt: "Mínimo / máximo",
  fixedLabel: "Número fijo de directores *",
  minLabel: "Número mínimo de directores *",
  maxLabel: "Número máximo de directores *",
  directorN: (n) => `Director ${n}`,
  firstName: "Nombre *",
  lastName: "Apellido *",
  emailAddr: "Correo electrónico *",
  dob: "Fecha de nacimiento *",
  taxResidency: "País de residencia fiscal *",
  selectCountry: "-- Seleccione un país --",
  residencyStatus: "Estatus de residencia *",
  citizenship: { citizen: "Ciudadano canadiense", permanent_resident: "Residente permanente", other: "Otro" },
  residentCanadian: "Residente canadiense *",
  iAmResident: "Soy residente canadiense",
  iAmNotResident: "No soy residente canadiense",
  cbcaIntro: "Según el artículo 2(1) de la Canada Business Corporations Act, residente canadiense significa una persona física que es",
  cbcaA: "(a) un ciudadano canadiense que reside habitualmente en Canadá,",
  cbcaB: "(b) un ciudadano canadiense que no reside habitualmente en Canadá y que pertenece a una categoría de personas prescrita, o",
  cbcaC:
    "(c) un residente permanente en el sentido del artículo 2(1) de la Immigration and Refugee Protection Act que reside habitualmente en Canadá, excepto un residente permanente que haya residido habitualmente en Canadá durante más de un año después del momento en que pudo solicitar por primera vez la ciudadanía canadiense.",
  addDirector: "Agregar otro director",

  s5H2: "Accionistas",
  s5Intro: "Indique todos los accionistas iniciales de la sociedad. Se admiten accionistas internacionales.",
  classesTitle: "Clases de acciones de su sociedad",
  classesIntro: (premium) =>
    `Su paquete ${premium ? "Premium" : "Estándar"} permite hasta ${premium ? "cinco" : "tres"} clases de acciones en los estatutos de constitución. Seleccione la(s) clase(s) que la sociedad estará autorizada a emitir. Luego, cada accionista indicado abajo puede asignarse a una de las clases seleccionadas.`,
  shareClasses: {
    A: {
      label: "Acciones ordinarias de clase A",
      short: "Con voto, dividendos, participación",
      description:
        "Otorgan un voto por acción. Dan derecho a recibir dividendos si, cuando y en la medida en que los declaren los directores. Dan derecho a participar en el remanente de los bienes de la sociedad en caso de disolución.",
    },
    B: {
      label: "Acciones ordinarias de clase B (sin voto)",
      short: "Sin voto, dividendos, participación",
      description:
        "No otorgan derecho de voto. Dan derecho a recibir dividendos si, cuando y en la medida en que los declaren los directores. Dan derecho a participar en el remanente de los bienes de la sociedad en caso de disolución.",
    },
    C: {
      label: "Acciones preferentes de clase C",
      short: "Sin voto, dividendo fijo, prioridad de capital",
      description:
        "No otorgan derecho de voto. Dan derecho a un dividendo fijo o preferente si, cuando y en la medida en que lo declaren los directores. Tienen prioridad sobre las acciones ordinarias para la devolución del importe de rescate en caso de disolución. No participan en el remanente de los bienes de la sociedad más allá del importe de rescate. Rescatables por la sociedad y retractables por el titular a un importe de rescate determinado.",
    },
    D: {
      label: "Acciones especiales de clase D",
      short: "Sin voto, dividendo discrecional",
      description:
        "No otorgan derecho de voto ni derecho fijo a dividendos. Pueden recibir dividendos si, cuando y en la medida en que los declaren los directores, por separado y en importes distintos de las demás clases. Dan derecho a la devolución del importe pagado por las acciones en caso de disolución, sin participación adicional.",
    },
    E: {
      label: "Acciones preferentes rescatables de clase E",
      short: "Sin voto, rescatables, prioridad de capital",
      description:
        "No otorgan derecho de voto. Rescatables por la sociedad y retractables por el titular a un importe de rescate fijo. Tienen prioridad sobre las acciones ordinarias para la devolución del importe de rescate en caso de disolución. No participan en el remanente de los bienes de la sociedad más allá del importe de rescate.",
    },
  },
  commonShares: "Acciones ordinarias",
  selectClassError: "Seleccione al menos una clase de acciones para la sociedad.",
  classesNotePre:
    "Las clases seleccionadas son las que Korporex declarará en los estatutos de constitución. Cada accionista indicado abajo elige cuál de estas clases tendrá. Korporex no ofrece asesoramiento legal ni fiscal sobre la estructura accionarial. Si tiene dudas, ",
  lawyerLink: "consulte a un abogado corporativo",
  shareholderN: (n) => `Accionista ${n}`,
  shareClassLabel: "Clase de acciones *",
  selectClassFirst: "Seleccione primero una clase de acciones arriba",
  numShares: "Número de acciones *",
  pricePerShare: "Precio por acción (CAD) *",
  citizenshipLabel: "Ciudadanía *",
  priceNoteA: "Ingrese cualquier importe positivo en dólares por acción. El precio puede ser ",
  priceEx1: "$1.00",
  priceNoteB: ". El importe total de suscripción es igual al precio por acción × el número de acciones (por ejemplo, ",
  priceEx2: "100 acciones × $1.00 = $100.00 en total",
  priceNoteC:
    "). Es solo un ejemplo numérico. Korporex no ofrece asesoramiento legal ni fiscal sobre el precio de las acciones. Si tiene dudas, ",
  addShareholder: "Agregar otro accionista",

  s6H2: "Funcionarios",
  s6Intro: "Indique los funcionarios de la sociedad y sus cargos. Se requiere al menos un funcionario.",
  officerN: (n) => `Funcionario ${n}`,
  position: "Cargo *",
  pleaseSelect: "-- Seleccione --",
  addOfficer: "Agregar otro funcionario",
  signTitle: "Firmantes autorizados",
  signQ: "¿Quién puede firmar contratos, instrumentos y otros documentos en nombre de la sociedad?",
  signLabel: "Firmantes autorizados *",
  bankTitle: "Autoridad de firma bancaria",
  bankQ:
    "¿Quién puede firmar cheques y operar las cuentas bancarias de la sociedad? Su banco lo pedirá al abrir la cuenta empresarial.",
  bankLabel: "Autoridad de firma bancaria *",
  authority: {
    all_directors: "Todos los directores",
    any_director_or_officer: "Cualquier director o funcionario",
    president_alone: "El presidente solo",
    president_and_secretary: "El presidente y el secretario conjuntamente",
    president_and_director: "El presidente y un director conjuntamente",
  },
  bankNotePre:
    "Asegúrese de que los funcionarios indicados arriba cubran las opciones elegidas aquí. Korporex no ofrece asesoramiento legal sobre la autoridad de firma. Si tiene dudas, ",

  s7H2: "Domicilio social",
  s7Intro: (fed) =>
    `Debe ser una dirección física ${fed ? "en cualquier provincia o territorio de Canadá" : "en Ontario"}, no un apartado postal.`,
  howProvide: "¿Cómo proporcionará una dirección?",
  ownTitle: "Proporcionaré mi propia dirección de domicilio social",
  ownSub: "Ingrese abajo una dirección que usted controle.",
  torontoTitle: "Oficina Korporex: Toronto",
  torontoSub: "Dirección en el centro de Toronto elegida por Korporex. Escaneo mensual del correo enviado por correo electrónico.",
  burlTitle: "Oficina Korporex: Burlington",
  burlSub: "Dirección en Burlington, Ontario, elegida por Korporex. Escaneo mensual del correo enviado por correo electrónico.",
  perMonth: (amt) => `$${amt}/mes`,
  billedAnnually: (amt) => `facturado anualmente por adelantado a $${amt} + HST`,
  regOfficeLabel: "Domicilio social Korporex",
  locationLabels: { korporex: "Centro de Toronto", burlington: "Burlington" },
  assignedToronto:
    "Korporex selecciona y asigna la dirección del domicilio social en el centro de Toronto, a su criterio, antes de presentar sus estatutos de constitución. La dirección no se revela por adelantado.",
  assignedOther: (loc) =>
    `Korporex proporciona una dirección de domicilio social en ${loc}, Ontario, elegida por Korporex. La dirección específica no se revela por adelantado.`,
  bullet1: "Copia escaneada mensual del correo recibido en la dirección, enviada por correo electrónico.",
  bullet2: "La dirección del domicilio social de Korporex figura en sus estatutos de constitución y en el registro público de sociedades.",
  bullet3Pre: (amt) => `$${amt} CAD facturados anualmente por adelantado, más HST. `,
  nonRefundable: "No reembolsable",
  bullet3Post: ", incluso si obtiene su propia dirección de domicilio social antes de que finalice el plazo.",
  noAddress: (fed) =>
    `¿No tiene una dirección física ${fed ? "en alguna provincia o territorio de Canadá" : "en Ontario"}? Use la opción de domicilio social Korporex de arriba.`,

  s8H2: "Revisión y pago",
  orderSummary: "Resumen del pedido",
  rowJurisdiction: "Jurisdicción",
  rowPackage: "Paquete",
  rowCorporation: "Sociedad",
  rowOfficialEmail: "Correo oficial",
  rowNumDirectors: "Número de directores",
  fixedAt: (n) => `Fijo en ${n}`,
  minMax: (a, b) => `Mínimo ${a}, máximo ${b}`,
  rowDirectors: "Directores",
  rowShareholders: "Accionistas",
  rowOfficers: "Funcionarios",
  rowSigning: "Firmantes autorizados",
  rowBanking: "Autoridad bancaria",
  rowRegOffice: "Domicilio social",
  jurisLabels: { federal: "Federal (Canadá)", ontario: "Ontario" },
  numberedCorp: (juris) => `Sociedad numerada (${juris})`,
  pkgLine: (pkg, juris) => `Paquete ${pkg} (${juris})`,
  nuansLine: "Informe de búsqueda de nombre NUANS",
  addonLine: (loc) => `Domicilio social - ${loc} (12 meses)`,
  subtotal: "Subtotal",
  tax: "Impuesto",
  taxSelectRegion: "Impuesto (seleccione la región abajo)",
  taxIntl: "Impuesto (internacional, $0)",
  total: "Total (CAD)",
  filingNote: "Las tasas gubernamentales de presentación están incluidas en el precio del paquete. Los impuestos se actualizan según su dirección de facturación abajo.",
  billingDetails: "Datos de facturación",
  billingName: "Nombre de facturación *",
  billingPh: "Juana Pérez o Acme Ltd.",
  stripePre: "Será redirigido a ",
  stripePost: " para completar el pago de forma segura. Los datos de la tarjeta se ingresan en stripe.com, nunca en Korporex.",
  submitting: "Redirigiendo a Stripe…",
  submit: (amt) => `Continuar al pago: $${amt}`,
  agreePre: "Al continuar, acepta nuestros ",
  terms: "Términos del servicio",
  and: " y nuestra ",
  privacy: "Política de privacidad",
  genericError: "Algo salió mal. Inténtelo de nuevo o escríbanos a contact@korporex.ca.",
  submissionFailed: "El envío falló",
  noUrl: "La sesión de pago no devolvió una URL",

  restored: "Restauramos los datos que ingresó la última vez. Todavía no se ha enviado ni cobrado nada.",
  startOver: "Empezar de nuevo",
  notSure: "¿No está seguro?",
  speakLawyer: "Consulte a un abogado",
};

export const COPY: Record<Lang, Copy> = { en, fr, es };

export function useCopy(): { lang: Lang; t: Copy } {
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  return { lang, t: COPY[lang] };
}

// Exact English messages produced by the schemas this page validates with
// (local schemas in IncorporateBody plus legalEndings, officerPositions and
// incorporateOptions).
const ERROR_TEXT: Record<Exclude<Lang, "en">, Record<string, string>> = {
  fr: {
    Required: "Obligatoire",
    "Valid email required": "Adresse courriel valide requise",
    "Select citizenship status": "Choisissez le statut de citoyenneté",
    "Select a country": "Choisissez un pays",
    "Must be a positive number": "Doit être un nombre positif",
    "Must be a positive amount": "Doit être un montant positif",
    "Please select an industry classification": "Veuillez choisir une classification d'industrie",
    "Describe your business activity in at least a sentence": "Décrivez votre activité en au moins une phrase",
    "Select a month": "Choisissez un mois",
    "Select a day": "Choisissez un jour",
    "At least 2 characters required": "Au moins 2 caractères requis",
    "Names don't match. Please retype it exactly as above.": "Les dénominations ne correspondent pas. Veuillez la saisir exactement comme ci-dessus.",
    "Enter a whole number of 1 or more": "Entrez un nombre entier égal ou supérieur à 1",
    "Maximum must be the same as or greater than the minimum": "Le maximum doit être égal ou supérieur au minimum",
    "Select a position": "Choisissez un poste",
    "Select a legal ending": "Choisissez un élément juridique",
    "Select who may sign for the corporation": "Indiquez qui peut signer pour la société",
    "Select who may sign on the bank account": "Indiquez qui peut signer pour le compte bancaire",
    "Select how the number of directors is set": "Indiquez comment le nombre d'administrateurs est fixé",
  },
  es: {
    Required: "Obligatorio",
    "Valid email required": "Se requiere un correo electrónico válido",
    "Select citizenship status": "Seleccione el estatus de ciudadanía",
    "Select a country": "Seleccione un país",
    "Must be a positive number": "Debe ser un número positivo",
    "Must be a positive amount": "Debe ser un importe positivo",
    "Please select an industry classification": "Seleccione una clasificación de industria",
    "Describe your business activity in at least a sentence": "Describa la actividad de su empresa en al menos una oración",
    "Select a month": "Seleccione un mes",
    "Select a day": "Seleccione un día",
    "At least 2 characters required": "Se requieren al menos 2 caracteres",
    "Names don't match. Please retype it exactly as above.": "Los nombres no coinciden. Vuelva a escribirlo exactamente como arriba.",
    "Enter a whole number of 1 or more": "Ingrese un número entero igual o mayor que 1",
    "Maximum must be the same as or greater than the minimum": "El máximo debe ser igual o mayor que el mínimo",
    "Select a position": "Seleccione un cargo",
    "Select a legal ending": "Seleccione una terminación legal",
    "Select who may sign for the corporation": "Indique quién puede firmar por la sociedad",
    "Select who may sign on the bank account": "Indique quién puede firmar en la cuenta bancaria",
    "Select how the number of directors is set": "Indique cómo se fija el número de directores",
  },
};

export function localizeError(lang: Lang, msg: string | undefined): string | undefined {
  if (!msg || lang === "en") return msg;
  const exact = ERROR_TEXT[lang][msg];
  if (exact) return exact;
  const fixed = msg.match(/^You set a fixed number of (\d+) directors?, .* You have (\d+)\.$/);
  if (fixed) {
    const [, n, have] = fixed;
    return lang === "fr"
      ? `Vous avez fixé le nombre d'administrateurs à ${n}; veuillez donc fournir les renseignements d'exactement ${n} administrateur(s). Vous en avez ${have}.`
      : `Fijó el número de directores en ${n}, así que proporcione la información de exactamente ${n} director(es). Tiene ${have}.`;
  }
  const range = msg.match(/^You set a minimum of (\d+) and a maximum of (\d+), .* You have (\d+)\.$/);
  if (range) {
    const [, min, max, have] = range;
    return lang === "fr"
      ? `Vous avez fixé un minimum de ${min} et un maximum de ${max}; veuillez donc fournir les renseignements de ${min} à ${max} administrateurs. Vous en avez ${have}.`
      : `Fijó un mínimo de ${min} y un máximo de ${max}, así que proporcione la información de entre ${min} y ${max} directores. Tiene ${have}.`;
  }
  return msg;
}
