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
      p("To confirm a GST/HST number in Canada, use the Canada Revenue Agency's GST/HST Registry, a free online lookup. You enter the first nine digits of the supplier's GST/HST account number (without the letters), the supplier's business name as it appears on the invoice or sign, and the transaction date. The registry tells you whether that number was registered for GST/HST on that date. The CRA describes the purpose plainly: confirming the number helps ensure that your input tax credit (ITC) claims only include GST/HST charged by someone who is registered."),
      p("This guide covers how a GST/HST number is built, what the registry asks for, how to read the result, what to do when a number cannot be confirmed, and the separate registries for Quebec's QST and for digital economy businesses."),
      { type: "heading", id: "why-confirm", text: "Why verify a GST/HST number before claiming a credit" },
      p("A business registered for GST/HST can generally recover the GST/HST it pays on business purchases by claiming input tax credits on its returns. Those credits depend on the tax having been charged by a registrant. If a supplier charges GST/HST without being registered, the purchaser has no reliable basis for the credit, and the paperwork behind the claim will not hold up on review."),
      p("Checking the registry is a quick way to close that gap, especially for a new supplier, an unusually large invoice, or a number that looks wrong. The CRA's own instruction after a successful search is to print the Search Details screen, so that the confirmation sits in your records next to the invoice."),
      { type: "heading", id: "number-format", text: "What a GST/HST number looks like" },
      p("A GST/HST account number is 15 characters long. It starts with the business's nine-digit business number (BN), followed by the two letters RT, which identify the GST/HST program, and a four-digit reference number. A typical example is 123456789 RT 0001. The BN is the same root the business uses for its other CRA accounts, such as payroll (RP) and corporation income tax (RC). The ", L("guide to getting a CRA business number", "/guides/how-to-get-a-cra-business-number"), " explains how the BN and program accounts fit together."),
      p("For a registry search, only the first nine digits matter. The CRA's instructions are to enter the first nine digits of the GST/HST account number and not to include letters, so 123456789 RT 0001 is searched as 123456789."),
      { type: "heading", id: "what-you-need", text: "What you need to confirm a GST/HST number" },
      p("The GST/HST Registry is a free service, and the CRA states that all three of the following pieces of information are needed to use it:"),
      {
        type: "list",
        items: [
          "The GST/HST account number: the first nine digits only, with no letters.",
          "The business name: the supplier's legal, operating or trading name, as displayed on an invoice or posted on a sign at the place of business.",
          "The transaction date: the date on the receipt, invoice, contract or other business paper.",
        ],
      },
      p("The transaction date matters because registration status can change over time. A business may register partway through a year, or cancel its registration later. The registry answers the question for the date you enter, which is the date that matters for the credit on that particular invoice."),
      { type: "heading", id: "steps", text: "How to confirm a GST/HST number, step by step" },
      {
        type: "list",
        items: [
          "Take the invoice or receipt and find the supplier's GST/HST account number, the name shown, and the invoice date.",
          "Open the CRA's \"Confirming a GST/HST account number\" page on canada.ca and start a GST/HST Registry search.",
          "Enter the first nine digits of the number, the business name and the transaction date.",
          "Review the result. If the number is confirmed, print the Search Details screen and file it with the invoice.",
          "If there is no result, work through the checks in the next sections before drawing conclusions.",
        ],
      },
      { type: "heading", id: "when-invoice-shows-number", text: "When a supplier has to show its GST/HST number" },
      p("According to the CRA, a supplier must include its GST/HST account number on receipts, invoices, contracts or other business papers it gives out when it supplies taxable goods or services of $100 or more. The CRA's chart of input tax credit information requirements sets out what the purchaser's documentation has to contain, based on the total sale amount:"),
      {
        type: "table",
        head: ["Information on the invoice or receipt", "Under $100", "$100 to $499.99", "$500 or more"],
        rows: [
          ["Supplier's business or trading name (or the intermediary's name)", "Required", "Required", "Required"],
          ["Invoice date, or the date GST/HST was paid or payable", "Required", "Required", "Required"],
          ["Total amount paid or payable", "Required", "Required", "Required"],
          ["Total GST/HST charged, or a statement that the price includes GST/HST", "Not required", "Required", "Required"],
          ["Status of each supply, where taxable and exempt supplies are mixed", "Not required", "Required", "Required"],
          ["Supplier's or intermediary's GST/HST registration number", "Not required", "Required", "Required"],
          ["Buyer's name or trading name (or authorized agent's name)", "Not required", "Not required", "Required"],
          ["Brief description of the property or services", "Not required", "Not required", "Required"],
          ["Terms of payment", "Not required", "Not required", "Required"],
        ],
      },
      p("In practice, that means the GST/HST number is something you can expect to find on any invoice of $100 or more from a registered supplier. A missing number on an invoice of that size is itself a reason to follow up."),
      { type: "heading", id: "reading-the-result", text: "Reading the GST/HST Registry result" },
      p("A confirmed result means the CRA's records show the number as registered for GST/HST on the transaction date you entered. That is the confirmation the CRA suggests printing and keeping."),
      p("No result does not automatically mean the supplier is unregistered. The most common reasons a search fails are simple:"),
      {
        type: "list",
        items: [
          "A typing error in the nine digits, or letters included in the number field.",
          "A name that does not match what the business gave the CRA. The CRA notes that if the displayed name gives no results, the business owner can tell you the exact name they gave the CRA.",
          "A transaction date that falls before the supplier's registration took effect or after it ended.",
          "A supplier that is not actually registered for GST/HST.",
        ],
      },
      { type: "heading", id: "if-not-confirmed", text: "If a GST/HST number cannot be confirmed" },
      p("The CRA sets out a short sequence. If you cannot find the GST/HST account number, contact the supplier. If the supplier does not provide its number, the CRA's business enquiries line can confirm whether the supplier is registered. The same line handles technical problems with the registry itself."),
      p("Until the number is confirmed, the GST/HST shown on that invoice has no confirmed registration behind it. Whether and how to claim a credit in that situation is a question for your accountant; the registry only answers the factual question of whether the number was registered on the date."),
      {
        type: "callout",
        title: "Keep the confirmation with the invoice",
        text: "The CRA generally requires GST/HST registrants to keep sales and purchase invoices and related records for six years from the end of the year to which they relate. A printed Search Details screen filed with the invoice shows when and how the supplier's number was checked.",
      },
      { type: "heading", id: "qst-and-quebec", text: "Quebec QST numbers are checked elsewhere" },
      p("The GST/HST Registry only covers GST/HST. To confirm a Quebec Sales Tax (QST) number, the CRA directs you to Revenu Québec, which runs its own validation tool. There is one exception the CRA calls out: the CRA administers the QST on behalf of Revenu Québec for selected listed financial institutions (SLFIs). Neither the Revenu Québec tool nor the CRA registry can validate a QST number used by an SLFI; for those, the CRA's business enquiries line is the channel."),
      { type: "heading", id: "simplified-registry", text: "The separate Simplified GST/HST Registry" },
      p("Since July 1, 2021, some digital economy businesses register under a simplified GST/HST regime instead of the normal one. Simplified registration is only available to digital economy businesses supplying cross-border digital products and services, or platform-based short-term accommodation. The CRA is required to publicly disclose information about these businesses and publishes a separate list showing each one's legal name, operating name, business number and effective registration date."),
      p("This matters for businesses that buy from those suppliers. The CRA states that a business registered for the normal GST/HST that purchases from a business in the Simplified GST/HST Registry must give that supplier evidence that it is registered for GST/HST in order not to be charged the tax. Otherwise, it will be charged the tax and cannot claim input tax credits or a rebate for the GST/HST paid on those purchases. The normal GST/HST Registry search does not cover simplified registrants, so a number from one of these suppliers is checked against the simplified list instead."),
      { type: "heading", id: "registry-at-a-glance", text: "Which tool to use" },
      {
        type: "table",
        head: ["You want to confirm", "Where to check"],
        rows: [
          ["A GST/HST number of a supplier registered under the normal regime", "CRA GST/HST Registry (Confirming a GST/HST account number)"],
          ["A GST/HST number of a digital economy business registered under the simplified regime", "CRA list of registered simplified GST/HST businesses"],
          ["A Quebec QST number", "Revenu Québec's QST validation tool"],
          ["A QST number used by a selected listed financial institution", "CRA business enquiries line"],
        ],
      },
      { type: "heading", id: "your-own-number", text: "Your own GST/HST number" },
      p("The same registry is what your customers use to check you. If your business is registered, the name you gave the CRA and the number on your invoices are what they will search. A business that is not yet registered, or that is about to cross the $30,000 small supplier threshold, can read the ", L("guide to getting a GST/HST number in Ontario", "/guides/how-to-get-gst-hst-number-ontario"), " for how registration works. Keep in mind that your GST/HST number is built on your BN, which is a different number from your ", L("corporation number", "/guides/business-number-vs-corporation-number"), "."),
      p("When you ", L("incorporate with Korporex", "/incorporate"), ", federally or in Ontario, the corporation's business number is issued as part of the incorporation, and a GST/HST account can be added to it afterward. For an existing business that needs a BN, see the ", L("business number registration service", "/services/business-number"), ". Korporex is not a law firm or accounting firm; questions about claiming input tax credits belong with an accountant."),
    ],
    faq: [
      {
        q: "Is the CRA GST/HST Registry free?",
        a: "Yes. The CRA describes the GST/HST Registry as a free service. You need the first nine digits of the supplier's GST/HST account number, the business name and the transaction date to run a search.",
      },
      {
        q: "Do I enter the full 15-character GST/HST number?",
        a: "No. The CRA's instructions are to enter only the first nine digits of the GST/HST account number and not to include letters. For 123456789 RT 0001, you search 123456789.",
      },
      {
        q: "Why does the registry show no result for a real supplier?",
        a: "Common causes are a typing error, a business name that differs from the one the supplier gave the CRA, or a transaction date outside the supplier's registration period. The CRA suggests contacting the business owner for the exact name they gave the CRA, and calling the business enquiries line if the supplier does not provide its number.",
      },
      {
        q: "Does an invoice under $100 need a GST/HST number?",
        a: "Under the CRA's input tax credit information requirements, the supplier's GST/HST registration number is not required for total sales under $100. It is required for sales of $100 or more.",
      },
      {
        q: "Can I check a Quebec QST number in the GST/HST Registry?",
        a: "No. The CRA directs QST number checks to Revenu Québec. For QST numbers used by selected listed financial institutions, which the CRA administers, neither tool can validate the number and the CRA's business enquiries line handles the request.",
      },
    ],
  },

  // ── French ──
  fr: {
    readTime: "9 min de lecture",
    content: [
      p("Pour vérifier un numéro de TPS/TVH au Canada, on utilise le Registre de la TPS/TVH de l'Agence du revenu du Canada (ARC), un outil de recherche en ligne gratuit. Vous saisissez les neuf premiers chiffres du numéro de compte de TPS/TVH du fournisseur (sans les lettres), le nom de l'entreprise tel qu'il figure sur la facture ou l'enseigne, et la date de la transaction. Le registre indique si ce numéro était inscrit aux fins de la TPS/TVH à cette date. L'ARC en précise l'objectif : la vérification aide à faire en sorte que vos demandes de crédits de taxe sur les intrants (CTI) ne visent que la TPS/TVH exigée par une personne inscrite."),
      p("Ce guide explique comment se compose un numéro de TPS/TVH, ce que demande le registre, comment lire le résultat, que faire lorsqu'un numéro ne peut être confirmé, et quels registres distincts s'appliquent à la TVQ et aux entreprises de l'économie numérique."),
      { type: "heading", id: "pourquoi-verifier", text: "Pourquoi vérifier un numéro de TPS/TVH avant de demander un crédit" },
      p("Une entreprise inscrite à la TPS/TVH peut généralement récupérer la TPS/TVH payée sur ses achats d'entreprise en demandant des crédits de taxe sur les intrants dans ses déclarations. Ces crédits supposent que la taxe a été exigée par un inscrit. Si un fournisseur exige la TPS/TVH sans être inscrit, l'acheteur n'a aucun fondement fiable pour le crédit, et les pièces justificatives de la demande ne tiendront pas lors d'un examen."),
      p("Consulter le registre permet de combler cette lacune rapidement, surtout pour un nouveau fournisseur, une facture inhabituellement élevée ou un numéro qui semble erroné. Après une recherche concluante, l'ARC indique d'imprimer l'écran des détails de la recherche, de sorte que la confirmation soit conservée avec la facture."),
      { type: "heading", id: "format-numero", text: "À quoi ressemble un numéro de TPS/TVH" },
      p("Un numéro de compte de TPS/TVH compte 15 caractères. Il commence par le numéro d'entreprise (NE) de neuf chiffres, suivi des lettres RT, qui désignent le programme de la TPS/TVH, et d'un numéro de référence de quatre chiffres. Par exemple : 123456789 RT 0001. Le NE est la même racine que l'entreprise utilise pour ses autres comptes de l'ARC, comme les retenues sur la paie (RP) et l'impôt sur le revenu des sociétés (RC). Le guide ", L("comment obtenir un numéro d'entreprise de l'ARC", "/guides/comment-obtenir-un-numero-dentreprise-arc"), " explique le lien entre le NE et les comptes de programme."),
      p("Pour une recherche dans le registre, seuls les neuf premiers chiffres comptent. Selon les instructions de l'ARC, il faut saisir les neuf premiers chiffres du numéro de compte de TPS/TVH sans inclure de lettres; le numéro 123456789 RT 0001 se recherche donc sous la forme 123456789."),
      { type: "heading", id: "ce-quil-faut", text: "Ce qu'il faut pour vérifier un numéro de TPS/TVH" },
      p("Le Registre de la TPS/TVH est un service gratuit, et l'ARC précise que les trois renseignements suivants sont tous nécessaires pour l'utiliser :"),
      {
        type: "list",
        items: [
          "Le numéro de compte de TPS/TVH : seulement les neuf premiers chiffres, sans lettres.",
          "Le nom de l'entreprise : la dénomination légale, le nom commercial ou le nom d'exploitation du fournisseur, tel qu'il figure sur une facture ou sur une enseigne à l'établissement.",
          "La date de la transaction : la date inscrite sur le reçu, la facture, le contrat ou tout autre document commercial.",
        ],
      },
      p("La date de la transaction est importante, car le statut d'inscription peut changer avec le temps. Une entreprise peut s'inscrire en cours d'année ou annuler son inscription plus tard. Le registre répond pour la date saisie, soit celle qui compte pour le crédit lié à cette facture précise."),
      { type: "heading", id: "etapes", text: "Comment vérifier un numéro de TPS/TVH, étape par étape" },
      {
        type: "list",
        items: [
          "Repérez sur la facture ou le reçu le numéro de compte de TPS/TVH du fournisseur, le nom affiché et la date de la facture.",
          "Ouvrez la page « Confirmer un numéro de compte de TPS/TVH » de l'ARC sur canada.ca et lancez une recherche dans le Registre de la TPS/TVH.",
          "Saisissez les neuf premiers chiffres du numéro, le nom de l'entreprise et la date de la transaction.",
          "Examinez le résultat. Si le numéro est confirmé, imprimez l'écran des détails de la recherche et classez-le avec la facture.",
          "S'il n'y a aucun résultat, passez en revue les vérifications des sections suivantes avant de tirer une conclusion.",
        ],
      },
      { type: "heading", id: "quand-afficher", text: "Quand un fournisseur doit indiquer son numéro de TPS/TVH" },
      p("Selon l'ARC, un fournisseur doit inscrire son numéro de compte de TPS/TVH sur les reçus, factures, contrats ou autres documents commerciaux qu'il remet lorsqu'il fournit des biens ou services taxables de 100 $ ou plus. Le tableau de l'ARC sur les renseignements exigés pour les CTI indique ce que les pièces justificatives de l'acheteur doivent contenir, selon le montant total de la vente :"),
      {
        type: "table",
        head: ["Renseignement sur la facture ou le reçu", "Moins de 100 $", "De 100 $ à 499,99 $", "500 $ ou plus"],
        rows: [
          ["Nom ou nom commercial du fournisseur (ou nom de l'intermédiaire)", "Exigé", "Exigé", "Exigé"],
          ["Date de la facture, ou date à laquelle la TPS/TVH a été payée ou est payable", "Exigé", "Exigé", "Exigé"],
          ["Montant total payé ou payable", "Exigé", "Exigé", "Exigé"],
          ["Montant total de la TPS/TVH exigée, ou mention que le prix inclut la TPS/TVH", "Non exigé", "Exigé", "Exigé"],
          ["Statut de chaque fourniture, lorsque des fournitures taxables et exonérées sont combinées", "Non exigé", "Exigé", "Exigé"],
          ["Numéro d'inscription à la TPS/TVH du fournisseur ou de l'intermédiaire", "Non exigé", "Exigé", "Exigé"],
          ["Nom ou nom commercial de l'acheteur (ou de son mandataire autorisé)", "Non exigé", "Non exigé", "Exigé"],
          ["Brève description des biens ou des services", "Non exigé", "Non exigé", "Exigé"],
          ["Modalités de paiement", "Non exigé", "Non exigé", "Exigé"],
        ],
      },
      p("En pratique, le numéro de TPS/TVH devrait donc figurer sur toute facture de 100 $ ou plus d'un fournisseur inscrit. L'absence de numéro sur une facture de ce montant est en soi une raison de faire un suivi."),
      { type: "heading", id: "lire-resultat", text: "Lire le résultat du Registre de la TPS/TVH" },
      p("Un résultat confirmé signifie que les dossiers de l'ARC indiquent que le numéro était inscrit aux fins de la TPS/TVH à la date de transaction saisie. C'est cette confirmation que l'ARC suggère d'imprimer et de conserver."),
      p("L'absence de résultat ne signifie pas automatiquement que le fournisseur n'est pas inscrit. Les causes les plus fréquentes d'un échec sont simples :"),
      {
        type: "list",
        items: [
          "Une faute de frappe dans les neuf chiffres, ou des lettres incluses dans le champ du numéro.",
          "Un nom qui ne correspond pas à celui que l'entreprise a fourni à l'ARC. L'ARC précise que si le nom affiché ne donne aucun résultat, le propriétaire de l'entreprise peut vous indiquer le nom exact fourni à l'ARC.",
          "Une date de transaction antérieure à la prise d'effet de l'inscription du fournisseur ou postérieure à sa fin.",
          "Un fournisseur qui n'est pas réellement inscrit à la TPS/TVH.",
        ],
      },
      { type: "heading", id: "si-non-confirme", text: "Si un numéro de TPS/TVH ne peut pas être confirmé" },
      p("L'ARC prévoit une marche à suivre courte. Si vous ne trouvez pas le numéro de compte de TPS/TVH, communiquez avec le fournisseur. Si le fournisseur ne fournit pas son numéro, la ligne des demandes de renseignements des entreprises de l'ARC peut confirmer s'il est inscrit. Cette même ligne traite les problèmes techniques liés au registre."),
      p("Tant que le numéro n'est pas confirmé, la TPS/TVH indiquée sur la facture ne repose sur aucune inscription confirmée. La question de savoir si et comment demander un crédit dans cette situation relève de votre comptable; le registre ne répond qu'à la question factuelle de savoir si le numéro était inscrit à la date donnée."),
      {
        type: "callout",
        title: "Conservez la confirmation avec la facture",
        text: "L'ARC exige généralement que les inscrits à la TPS/TVH conservent leurs factures de ventes et d'achats et les registres connexes pendant six ans après la fin de l'année à laquelle ils se rapportent. Un écran des détails de la recherche imprimé et classé avec la facture montre quand et comment le numéro du fournisseur a été vérifié.",
      },
      { type: "heading", id: "tvq-quebec", text: "Les numéros de TVQ se vérifient ailleurs" },
      p("Le Registre de la TPS/TVH ne vise que la TPS/TVH. Pour vérifier un numéro de taxe de vente du Québec (TVQ), l'ARC vous dirige vers Revenu Québec, qui offre son propre outil de validation. L'ARC signale une exception : elle administre la TVQ au nom de Revenu Québec pour les institutions financières désignées particulières (IFDP). Ni l'outil de Revenu Québec ni le registre de l'ARC ne peuvent valider un numéro de TVQ utilisé par une IFDP; dans ce cas, il faut passer par la ligne des demandes de renseignements des entreprises de l'ARC."),
      { type: "heading", id: "registre-simplifie", text: "Le registre distinct de la TPS/TVH simplifiée" },
      p("Depuis le 1er juillet 2021, certaines entreprises de l'économie numérique s'inscrivent selon un régime simplifié de la TPS/TVH plutôt que selon le régime normal. L'inscription simplifiée n'est offerte qu'aux entreprises de l'économie numérique qui fournissent des produits et services numériques transfrontaliers ou des logements provisoires offerts par l'entremise d'une plateforme. L'ARC est tenue de divulguer publiquement des renseignements sur ces entreprises et publie une liste distincte indiquant la dénomination légale, le nom commercial, le numéro d'entreprise et la date d'entrée en vigueur de l'inscription de chacune."),
      p("Cela a une incidence pour les entreprises qui achètent de ces fournisseurs. Selon l'ARC, une entreprise inscrite sous le régime normal de la TPS/TVH qui achète d'une entreprise figurant au registre de la TPS/TVH simplifiée doit fournir à ce fournisseur une preuve de son inscription à la TPS/TVH pour ne pas se voir exiger la taxe. Sinon, la taxe lui sera exigée et elle ne pourra pas demander de CTI ni de remboursement pour la TPS/TVH payée sur ces achats. La recherche dans le Registre de la TPS/TVH normal ne vise pas les inscrits au régime simplifié; le numéro d'un tel fournisseur se vérifie plutôt dans la liste simplifiée."),
      { type: "heading", id: "quel-outil", text: "Quel outil utiliser" },
      {
        type: "table",
        head: ["Vous voulez vérifier", "Où vérifier"],
        rows: [
          ["Le numéro de TPS/TVH d'un fournisseur inscrit sous le régime normal", "Registre de la TPS/TVH de l'ARC (Confirmer un numéro de compte de TPS/TVH)"],
          ["Le numéro de TPS/TVH d'une entreprise de l'économie numérique inscrite au régime simplifié", "Liste de l'ARC des entreprises inscrites à la TPS/TVH simplifiée"],
          ["Un numéro de TVQ", "Outil de validation de la TVQ de Revenu Québec"],
          ["Un numéro de TVQ utilisé par une institution financière désignée particulière", "Ligne des demandes de renseignements des entreprises de l'ARC"],
        ],
      },
      { type: "heading", id: "votre-numero", text: "Votre propre numéro de TPS/TVH" },
      p("Ce même registre est celui qu'utilisent vos clients pour vous vérifier. Si votre entreprise est inscrite, ils chercheront le nom que vous avez fourni à l'ARC et le numéro inscrit sur vos factures. Une entreprise qui n'est pas encore inscrite, ou qui s'apprête à dépasser le seuil du petit fournisseur de 30 000 $, peut consulter le ", L("guide pour obtenir un numéro de TPS/TVH en Ontario", "/guides/comment-obtenir-numero-tps-tvh-ontario"), " pour comprendre l'inscription. Rappelons que votre numéro de TPS/TVH repose sur votre NE, qui est un numéro différent de votre ", L("numéro de société", "/guides/numero-entreprise-ou-numero-societe"), "."),
      p("Lorsque vous vous ", L("constituez en société avec Korporex", "/incorporate"), ", sous le régime fédéral ou en Ontario, le numéro d'entreprise de la société est attribué dans le cadre de la constitution, et un compte de TPS/TVH peut y être ajouté par la suite. Pour une entreprise existante qui a besoin d'un NE, consultez le ", L("service d'inscription au numéro d'entreprise", "/services/business-number"), ". Korporex n'est ni un cabinet d'avocats ni un cabinet comptable; les questions sur les demandes de crédits de taxe sur les intrants relèvent d'un comptable."),
    ],
    faq: [
      {
        q: "Le Registre de la TPS/TVH de l'ARC est-il gratuit ?",
        a: "Oui. L'ARC décrit le Registre de la TPS/TVH comme un service gratuit. Il faut les neuf premiers chiffres du numéro de compte de TPS/TVH du fournisseur, le nom de l'entreprise et la date de la transaction pour effectuer une recherche.",
      },
      {
        q: "Dois-je saisir le numéro de TPS/TVH complet de 15 caractères ?",
        a: "Non. Selon les instructions de l'ARC, il faut saisir seulement les neuf premiers chiffres du numéro de compte de TPS/TVH, sans lettres. Pour 123456789 RT 0001, vous cherchez 123456789.",
      },
      {
        q: "Pourquoi le registre n'affiche-t-il aucun résultat pour un vrai fournisseur ?",
        a: "Les causes fréquentes sont une faute de frappe, un nom d'entreprise différent de celui fourni à l'ARC ou une date de transaction hors de la période d'inscription du fournisseur. L'ARC suggère de demander au propriétaire le nom exact fourni à l'ARC, et d'appeler la ligne des demandes de renseignements des entreprises si le fournisseur ne fournit pas son numéro.",
      },
      {
        q: "Une facture de moins de 100 $ doit-elle indiquer un numéro de TPS/TVH ?",
        a: "Selon les exigences de l'ARC en matière de renseignements pour les CTI, le numéro d'inscription à la TPS/TVH du fournisseur n'est pas exigé pour les ventes totales de moins de 100 $. Il est exigé pour les ventes de 100 $ ou plus.",
      },
      {
        q: "Puis-je vérifier un numéro de TVQ dans le Registre de la TPS/TVH ?",
        a: "Non. L'ARC dirige les vérifications de numéros de TVQ vers Revenu Québec. Pour les numéros de TVQ utilisés par des institutions financières désignées particulières, que l'ARC administre, aucun des deux outils ne peut valider le numéro et c'est la ligne des demandes de renseignements des entreprises de l'ARC qui traite la demande.",
      },
    ],
  },

  // ── Spanish ──
  es: {
    readTime: "9 min de lectura",
    content: [
      p("Para verificar un número de GST/HST en Canadá, se usa el GST/HST Registry de la Agencia de Ingresos de Canadá (CRA), una herramienta de consulta en línea gratuita. Usted ingresa los primeros nueve dígitos del número de cuenta de GST/HST del proveedor (sin las letras), el nombre de la empresa tal como aparece en la factura o en el letrero, y la fecha de la transacción. El registro indica si ese número estaba registrado para el GST/HST en esa fecha. La CRA explica el objetivo con claridad: verificar el número ayuda a que sus solicitudes de créditos fiscales por insumos (input tax credits, ITC) incluyan solo el GST/HST cobrado por alguien que está registrado."),
      p("Esta guía explica cómo se compone un número de GST/HST, qué pide el registro, cómo leer el resultado, qué hacer cuando un número no puede confirmarse, y qué registros separados existen para el QST de Quebec y para las empresas de la economía digital."),
      { type: "heading", id: "por-que-verificar", text: "Por qué verificar un número de GST/HST antes de reclamar un crédito" },
      p("Una empresa registrada para el GST/HST generalmente puede recuperar el GST/HST que paga en sus compras empresariales reclamando créditos fiscales por insumos en sus declaraciones. Esos créditos dependen de que el impuesto haya sido cobrado por un registrante. Si un proveedor cobra GST/HST sin estar registrado, el comprador no tiene una base confiable para el crédito, y la documentación de la solicitud no se sostendrá en una revisión."),
      p("Consultar el registro es una forma rápida de cerrar esa brecha, sobre todo con un proveedor nuevo, una factura inusualmente alta o un número que parece incorrecto. Tras una búsqueda exitosa, la CRA indica imprimir la pantalla de detalles de la búsqueda (Search Details), para que la confirmación quede en sus registros junto a la factura."),
      { type: "heading", id: "formato-numero", text: "Cómo es un número de GST/HST" },
      p("Un número de cuenta de GST/HST tiene 15 caracteres. Comienza con el número de negocio (BN) de nueve dígitos de la empresa, seguido de las letras RT, que identifican el programa de GST/HST, y un número de referencia de cuatro dígitos. Un ejemplo típico es 123456789 RT 0001. El BN es la misma raíz que la empresa usa para sus otras cuentas de la CRA, como nómina (RP) e impuesto sobre la renta de sociedades (RC). La guía ", L("cómo obtener un número de negocio de la CRA", "/guides/como-obtener-un-numero-de-negocio-cra"), " explica cómo se relacionan el BN y las cuentas de programa."),
      p("Para una búsqueda en el registro, solo cuentan los primeros nueve dígitos. Las instrucciones de la CRA son ingresar los primeros nueve dígitos del número de cuenta de GST/HST sin incluir letras, así que 123456789 RT 0001 se busca como 123456789."),
      { type: "heading", id: "que-necesita", text: "Qué necesita para verificar un número de GST/HST" },
      p("El GST/HST Registry es un servicio gratuito, y la CRA indica que se necesitan los tres datos siguientes para usarlo:"),
      {
        type: "list",
        items: [
          "El número de cuenta de GST/HST: solo los primeros nueve dígitos, sin letras.",
          "El nombre de la empresa: el nombre legal, operativo o comercial del proveedor, tal como aparece en una factura o en un letrero en el lugar de negocio.",
          "La fecha de la transacción: la fecha del recibo, factura, contrato u otro documento comercial.",
        ],
      },
      p("La fecha de la transacción importa porque el estado de registro puede cambiar con el tiempo. Una empresa puede registrarse a mitad de año o cancelar su registro más adelante. El registro responde para la fecha que usted ingresa, que es la fecha relevante para el crédito de esa factura en particular."),
      { type: "heading", id: "pasos", text: "Cómo verificar un número de GST/HST, paso a paso" },
      {
        type: "list",
        items: [
          "Tome la factura o el recibo y ubique el número de cuenta de GST/HST del proveedor, el nombre que aparece y la fecha de la factura.",
          "Abra la página de la CRA \"Confirming a GST/HST account number\" en canada.ca e inicie una búsqueda en el GST/HST Registry.",
          "Ingrese los primeros nueve dígitos del número, el nombre de la empresa y la fecha de la transacción.",
          "Revise el resultado. Si el número se confirma, imprima la pantalla de detalles de la búsqueda y archívela con la factura.",
          "Si no hay resultado, revise los puntos de las secciones siguientes antes de sacar conclusiones.",
        ],
      },
      { type: "heading", id: "cuando-mostrar", text: "Cuándo un proveedor debe mostrar su número de GST/HST" },
      p("Según la CRA, un proveedor debe incluir su número de cuenta de GST/HST en los recibos, facturas, contratos u otros documentos comerciales que entrega cuando suministra bienes o servicios gravables de 100 $ o más. La tabla de la CRA sobre la información requerida para los ITC establece qué debe contener la documentación del comprador, según el monto total de la venta:"),
      {
        type: "table",
        head: ["Información en la factura o recibo", "Menos de 100 $", "De 100 $ a 499,99 $", "500 $ o más"],
        rows: [
          ["Nombre o nombre comercial del proveedor (o nombre del intermediario)", "Requerido", "Requerido", "Requerido"],
          ["Fecha de la factura, o fecha en que el GST/HST se pagó o es pagadero", "Requerido", "Requerido", "Requerido"],
          ["Monto total pagado o pagadero", "Requerido", "Requerido", "Requerido"],
          ["Monto total de GST/HST cobrado, o indicación de que el precio incluye GST/HST", "No requerido", "Requerido", "Requerido"],
          ["Estado de cada suministro, cuando se combinan suministros gravables y exentos", "No requerido", "Requerido", "Requerido"],
          ["Número de registro de GST/HST del proveedor o del intermediario", "No requerido", "Requerido", "Requerido"],
          ["Nombre o nombre comercial del comprador (o de su agente autorizado)", "No requerido", "No requerido", "Requerido"],
          ["Breve descripción de los bienes o servicios", "No requerido", "No requerido", "Requerido"],
          ["Condiciones de pago", "No requerido", "No requerido", "Requerido"],
        ],
      },
      p("En la práctica, el número de GST/HST es algo que cabe esperar en cualquier factura de 100 $ o más de un proveedor registrado. La falta de número en una factura de ese monto es en sí misma un motivo para hacer seguimiento."),
      { type: "heading", id: "leer-resultado", text: "Cómo leer el resultado del GST/HST Registry" },
      p("Un resultado confirmado significa que los registros de la CRA muestran el número como registrado para el GST/HST en la fecha de transacción ingresada. Esa es la confirmación que la CRA sugiere imprimir y conservar."),
      p("La falta de resultado no significa automáticamente que el proveedor no esté registrado. Las causas más comunes de una búsqueda fallida son sencillas:"),
      {
        type: "list",
        items: [
          "Un error de tipeo en los nueve dígitos, o letras incluidas en el campo del número.",
          "Un nombre que no coincide con el que la empresa dio a la CRA. La CRA señala que si el nombre mostrado no da resultados, el propietario de la empresa puede indicarle el nombre exacto que dio a la CRA.",
          "Una fecha de transacción anterior al inicio del registro del proveedor o posterior a su fin.",
          "Un proveedor que en realidad no está registrado para el GST/HST.",
        ],
      },
      { type: "heading", id: "si-no-se-confirma", text: "Si un número de GST/HST no puede confirmarse" },
      p("La CRA establece una secuencia breve. Si no encuentra el número de cuenta de GST/HST, comuníquese con el proveedor. Si el proveedor no proporciona su número, la línea de consultas empresariales de la CRA puede confirmar si está registrado. Esa misma línea atiende los problemas técnicos con el registro."),
      p("Mientras el número no esté confirmado, el GST/HST que figura en esa factura no tiene un registro confirmado que lo respalde. Si se debe reclamar un crédito en esa situación, y cómo, es una pregunta para su contador; el registro solo responde a la pregunta de hecho de si el número estaba registrado en esa fecha."),
      {
        type: "callout",
        title: "Conserve la confirmación con la factura",
        text: "La CRA generalmente exige que los registrantes de GST/HST conserven las facturas de ventas y compras y los registros relacionados durante seis años desde el final del año al que corresponden. Una pantalla de detalles de la búsqueda impresa y archivada con la factura muestra cuándo y cómo se verificó el número del proveedor.",
      },
      { type: "heading", id: "qst-quebec", text: "Los números de QST de Quebec se verifican en otro lugar" },
      p("El GST/HST Registry solo cubre el GST/HST. Para verificar un número del impuesto sobre las ventas de Quebec (QST), la CRA lo remite a Revenu Québec, que tiene su propia herramienta de validación. La CRA señala una excepción: administra el QST en nombre de Revenu Québec para las instituciones financieras designadas especiales (selected listed financial institutions, SLFI). Ni la herramienta de Revenu Québec ni el registro de la CRA pueden validar un número de QST usado por una SLFI; en ese caso, el canal es la línea de consultas empresariales de la CRA."),
      { type: "heading", id: "registro-simplificado", text: "El registro separado del GST/HST simplificado" },
      p("Desde el 1 de julio de 2021, algunas empresas de la economía digital se registran bajo un régimen simplificado del GST/HST en lugar del régimen normal. El registro simplificado solo está disponible para empresas de la economía digital que suministran productos y servicios digitales transfronterizos, o alojamiento de corta duración a través de plataformas. La CRA está obligada a divulgar públicamente información sobre estas empresas y publica una lista separada con el nombre legal, el nombre comercial, el número de negocio y la fecha de entrada en vigor del registro de cada una."),
      p("Esto importa para las empresas que compran a esos proveedores. Según la CRA, una empresa registrada para el GST/HST normal que compra a una empresa del registro del GST/HST simplificado debe entregarle a ese proveedor una prueba de que está registrada para el GST/HST para que no se le cobre el impuesto. De lo contrario, se le cobrará el impuesto y no podrá reclamar créditos fiscales por insumos ni un reembolso por el GST/HST pagado en esas compras. La búsqueda en el GST/HST Registry normal no cubre a los registrantes simplificados, así que el número de uno de esos proveedores se verifica en la lista simplificada."),
      { type: "heading", id: "que-herramienta", text: "Qué herramienta usar" },
      {
        type: "table",
        head: ["Quiere verificar", "Dónde verificar"],
        rows: [
          ["El número de GST/HST de un proveedor registrado bajo el régimen normal", "GST/HST Registry de la CRA (Confirming a GST/HST account number)"],
          ["El número de GST/HST de una empresa de la economía digital registrada bajo el régimen simplificado", "Lista de la CRA de empresas registradas para el GST/HST simplificado"],
          ["Un número de QST de Quebec", "Herramienta de validación del QST de Revenu Québec"],
          ["Un número de QST usado por una institución financiera designada especial", "Línea de consultas empresariales de la CRA"],
        ],
      },
      { type: "heading", id: "su-propio-numero", text: "Su propio número de GST/HST" },
      p("Este mismo registro es el que usan sus clientes para verificarlo a usted. Si su empresa está registrada, buscarán el nombre que usted dio a la CRA y el número que aparece en sus facturas. Una empresa que aún no está registrada, o que está por superar el umbral de pequeño proveedor de 30 000 $, puede consultar la ", L("guía para obtener un número de GST/HST en Ontario", "/guides/como-obtener-numero-gst-hst-ontario"), " para entender el registro. Recuerde que su número de GST/HST se basa en su BN, que es un número distinto de su ", L("número de sociedad", "/guides/numero-negocio-o-numero-sociedad"), "."),
      p("Cuando usted se ", L("constituye en sociedad con Korporex", "/incorporate"), ", a nivel federal o en Ontario, el número de negocio de la sociedad se asigna como parte de la constitución, y después se le puede añadir una cuenta de GST/HST. Para una empresa existente que necesita un BN, consulte el ", L("servicio de registro del número de negocio", "/services/business-number"), ". Korporex no es un despacho de abogados ni una firma de contabilidad; las preguntas sobre cómo reclamar créditos fiscales por insumos corresponden a un contador."),
    ],
    faq: [
      {
        q: "¿El GST/HST Registry de la CRA es gratuito?",
        a: "Sí. La CRA describe el GST/HST Registry como un servicio gratuito. Para hacer una búsqueda necesita los primeros nueve dígitos del número de cuenta de GST/HST del proveedor, el nombre de la empresa y la fecha de la transacción.",
      },
      {
        q: "¿Debo ingresar el número de GST/HST completo de 15 caracteres?",
        a: "No. Las instrucciones de la CRA son ingresar solo los primeros nueve dígitos del número de cuenta de GST/HST, sin letras. Para 123456789 RT 0001, usted busca 123456789.",
      },
      {
        q: "¿Por qué el registro no muestra resultados para un proveedor real?",
        a: "Las causas comunes son un error de tipeo, un nombre de empresa distinto del que el proveedor dio a la CRA o una fecha de transacción fuera del período de registro del proveedor. La CRA sugiere pedir al propietario el nombre exacto que dio a la CRA, y llamar a la línea de consultas empresariales si el proveedor no proporciona su número.",
      },
      {
        q: "¿Una factura de menos de 100 $ debe mostrar un número de GST/HST?",
        a: "Según los requisitos de información de la CRA para los ITC, el número de registro de GST/HST del proveedor no se exige para ventas totales de menos de 100 $. Se exige para ventas de 100 $ o más.",
      },
      {
        q: "¿Puedo verificar un número de QST de Quebec en el GST/HST Registry?",
        a: "No. La CRA remite la verificación de números de QST a Revenu Québec. Para los números de QST usados por instituciones financieras designadas especiales, que administra la CRA, ninguna de las dos herramientas puede validar el número y la solicitud se atiende en la línea de consultas empresariales de la CRA.",
      },
    ],
  },
};
