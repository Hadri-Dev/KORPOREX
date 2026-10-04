import type { ArticleSection } from "../articles";

export type ExpandedArticle = { readTime: string; content: ArticleSection[]; faq: { q: string; a: string }[] };

export const expanded: Record<"en" | "fr" | "es", ExpandedArticle> = {
  "en": {
    "readTime": "12 min read",
    "content": [
      {
        "type": "paragraph",
        "text": "A NUANS name search is a computerized comparison of a proposed corporate name against a national database of existing Canadian corporate names, business names and trademarks. NUANS stands for Newly Upgraded Automated Name Search. The result, a NUANS report, lists the existing names most similar to yours so that a registry examiner can decide whether your proposed name is distinctive enough to be granted, or likely to be confused with a name already in use."
      },
      {
        "type": "paragraph",
        "text": "If you are incorporating with a word name rather than a number, some form of name search stands between you and your certificate of incorporation. Whether you order a NUANS report yourself, or the registry runs the search for you, depends on where you incorporate. This guide is the overview: what the database is, when a report is needed, what it contains, how long it lasts and how to get one, with links to our more detailed guides on each topic."
      },
      {
        "type": "heading",
        "id": "what-is-nuans",
        "text": "What the NUANS database is, and who runs it"
      },
      {
        "type": "paragraph",
        "text": "NUANS is a federal system. Innovation, Science and Economic Development Canada (ISED) manages it and describes it as the Government of Canada's business name and trademark search tool. A private service provider handles the administration of NUANS memberships, which is why most reports are ordered through a registered search house rather than from a government counter."
      },
      {
        "type": "paragraph",
        "text": "The database brings together corporate names registered federally and by the provinces and territories, business names registered in participating jurisdictions, and trademarks from the Canadian Intellectual Property Office (CIPO). When a search is run, an algorithm compares the proposed name against those records, looking at sound and spelling as well as exact wording, and returns the closest matches."
      },
      {
        "type": "paragraph",
        "text": "Two points are worth holding onto from the start. First, NUANS only knows about names that have been registered somewhere. An established business that never registered its name will not appear in a report. Second, the report is evidence, not a decision. It does not approve or refuse anything by itself; a registry examiner makes that call."
      },
      {
        "type": "heading",
        "id": "when-required",
        "text": "When a NUANS report is required"
      },
      {
        "type": "paragraph",
        "text": "The answer depends on the jurisdiction you incorporate in, and on whether you want a word name at all. The two most common routes are federal incorporation under the Canada Business Corporations Act (CBCA) and Ontario incorporation under the Business Corporations Act (OBCA), and they now handle the search in different ways."
      },
      {
        "type": "heading",
        "id": "federal",
        "text": "Federal incorporation: the search is built in"
      },
      {
        "type": "paragraph",
        "text": "Corporations Canada has integrated the NUANS name search into its Online Filing Centre. When you incorporate federally with a word name, or apply for a corporate name preapproval, the search runs as part of the online application. Corporations Canada's guidance is that you do not need to order a separate report before you submit. ISED lists the cost of a federal name search at $13.80."
      },
      {
        "type": "paragraph",
        "text": "A separately ordered federal NUANS report is still required for some other federal transactions, including revivals and amalgamations under the CBCA. Some applicants also choose to run a preliminary search on their candidate names before they file, because the examiner will compare the name against the same records, and it is better to find a close conflict before the application than after it."
      },
      {
        "type": "paragraph",
        "text": "Federally, you can also apply for a corporate name preapproval before you incorporate. It is optional, and Corporations Canada notes that in most cases it is more efficient to choose the name within the incorporation itself. A preapproval is valid for 90 days from the date you apply."
      },
      {
        "type": "heading",
        "id": "ontario",
        "text": "Ontario incorporation: you supply the report"
      },
      {
        "type": "paragraph",
        "text": "Ontario works the other way. To incorporate an Ontario business corporation with a word name, you must obtain an Ontario-biased (or weighted) NUANS report from a private name search provider. The Ontario government does not run the search for you, and a federally biased report will not be accepted. When the articles are filed through the Ontario Business Registry, you give the report's reference number, the name searched and the date of the report."
      },
      {
        "type": "paragraph",
        "text": "The same rule applies when an existing Ontario corporation changes its name by articles of amendment: a fresh Ontario-biased report is needed unless the new name is a number name. If you are renaming a corporation rather than starting one, see our corporate name change service.",
        "parts": [
          "The same rule applies when an existing Ontario corporation changes its name by articles of amendment: a fresh Ontario-biased report is needed unless the new name is a number name. If you are renaming a corporation rather than starting one, see our ",
          {
            "text": "corporate name change service",
            "href": "/services/change-name"
          },
          "."
        ]
      },
      {
        "type": "heading",
        "id": "by-province",
        "text": "Which provinces require a NUANS report"
      },
      {
        "type": "paragraph",
        "text": "Outside the federal and Ontario systems, Alberta and New Brunswick also require a name search report that you obtain from a private provider. Everywhere else, the name check runs through the registry's own process, and several registries will not accept a NUANS report in place of their own step. The table below is a summary; our guide to which provinces require NUANS sets out each jurisdiction in detail, including where a registry has its own reservation step.",
        "parts": [
          "Outside the federal and Ontario systems, Alberta and New Brunswick also require a name search report that you obtain from a private provider. Everywhere else, the name check runs through the registry's own process, and several registries will not accept a NUANS report in place of their own step. The table below is a summary; our guide to ",
          {
            "text": "which provinces require NUANS",
            "href": "/guides/which-provinces-require-nuans"
          },
          " sets out each jurisdiction in detail, including where a registry has its own reservation step."
        ]
      },
      {
        "type": "table",
        "head": [
          "Jurisdiction",
          "Do you order a NUANS report?",
          "How the name is checked"
        ],
        "rows": [
          [
            "Federal (CBCA)",
            "No separate report for an online incorporation",
            "Search integrated into the Online Filing Centre application"
          ],
          [
            "Ontario (OBCA)",
            "Yes, Ontario-biased, for a word name",
            "Report reference number, name searched and date given with the articles"
          ],
          [
            "Alberta",
            "Yes",
            "Report from a private name search firm"
          ],
          [
            "New Brunswick",
            "Yes",
            "Report from a private name search firm"
          ],
          [
            "Manitoba, Nova Scotia, Prince Edward Island, Saskatchewan, Yukon",
            "No",
            "Name search included in the registry's own application process"
          ],
          [
            "British Columbia, Quebec, Newfoundland and Labrador, Northwest Territories, Nunavut",
            "No",
            "Follow the registry's own name approval or reservation rules (British Columbia, for example, uses a Name Request)"
          ]
        ]
      },
      {
        "type": "heading",
        "id": "numbered",
        "text": "The numbered company exception"
      },
      {
        "type": "paragraph",
        "text": "A numbered corporation needs no name search anywhere in Canada. The registry assigns the number, and the legal name becomes something like 12345678 Canada Inc. federally, or a number followed by \"Ontario\" and a legal ending in Ontario. You can still carry on business under a brand by registering an operating name. Our comparison of named and numbered corporations covers the trade-offs, including what it takes to switch to a word name later.",
        "parts": [
          "A numbered corporation needs no name search anywhere in Canada. The registry assigns the number, and the legal name becomes something like 12345678 Canada Inc. federally, or a number followed by \"Ontario\" and a legal ending in Ontario. You can still carry on business under a brand by registering an operating name. Our comparison of ",
          {
            "text": "named and numbered corporations",
            "href": "/guides/named-vs-numbered-corporation"
          },
          " covers the trade-offs, including what it takes to switch to a word name later."
        ]
      },
      {
        "type": "heading",
        "id": "how-it-works",
        "text": "How a NUANS search works"
      },
      {
        "type": "paragraph",
        "text": "Every search follows the same sequence. You give the full proposed name and identify its distinctive element. The search runs against the database, weighted toward the jurisdiction you chose, and a NUANS report comes back, usually quickly, listing the closest existing names. In Ontario, Alberta and New Brunswick you order that report from a search provider; federally, the search runs inside the Online Filing Centre when you file.",
        "parts": [
          "Every search follows the same sequence. You give the full proposed name and identify its distinctive element. The search runs against the database, weighted toward the jurisdiction you chose, and a ",
          {
            "text": "NUANS report",
            "href": "/nuans"
          },
          " comes back, usually quickly, listing the closest existing names. In Ontario, Alberta and New Brunswick you order that report from a search provider; federally, the search runs inside the Online Filing Centre when you file."
        ]
      },
      {
        "type": "paragraph",
        "text": "The government does not make the final decision based solely on the report. A corporate examiner (federal or provincial) reviews the report and the proposed name, weighs distinctiveness and potential confusion with existing names, and either approves the name or asks for changes. Federally, if the examiner needs more, you receive a Notice of action required with instructions to resubmit."
      },
      {
        "type": "heading",
        "id": "validity",
        "text": "How long a NUANS report is valid"
      },
      {
        "type": "paragraph",
        "text": "A NUANS search is valid for 90 days. Corporations Canada says so directly, and Ontario's filing rules say a report cannot be dated more than 90 days before the articles are filed. Ontario gives its own example: articles received on November 28 could be supported by a report dated as early as August 30, but not earlier. If the window closes before the filing is accepted, a new report is needed."
      },
      {
        "type": "paragraph",
        "text": "The practical lesson is timing. Order the search once the share structure, shareholders and directors are settled, not the day a name first comes up. A report that expires while the rest of the incorporation is still being negotiated is money spent twice."
      },
      {
        "type": "heading",
        "id": "report-contents",
        "text": "What a NUANS report contains"
      },
      {
        "type": "paragraph",
        "text": "A report has a header and a body. The header carries the reference number you quote on the filing, the date and time the search ran (which starts the 90-day clock), the jurisdiction the search was weighted for, and the name exactly as searched. The body is a ranked list of existing corporate names, business names and trademarks that the algorithm judged similar to yours, each with a code showing which register it came from. There is no verdict at the end. Our guide on how to read a NUANS report explains each section and how to tell a serious conflict from background noise.",
        "parts": [
          "A report has a header and a body. The header carries the reference number you quote on the filing, the date and time the search ran (which starts the 90-day clock), the jurisdiction the search was weighted for, and the name exactly as searched. The body is a ranked list of existing corporate names, business names and trademarks that the algorithm judged similar to yours, each with a code showing which register it came from. There is no verdict at the end. Our guide on ",
          {
            "text": "how to read a NUANS report",
            "href": "/guides/how-to-read-a-nuans-report"
          },
          " explains each section and how to tell a serious conflict from background noise."
        ]
      },
      {
        "type": "heading",
        "id": "anatomy-of-a-name",
        "text": "The anatomy of a corporate name"
      },
      {
        "type": "paragraph",
        "text": "A compliant Canadian corporate name has three parts:"
      },
      {
        "type": "list",
        "items": [
          "Distinctive element: a unique or coined word that sets the business apart (e.g., \"Maplewind\").",
          "Descriptive element: describes the business activity (e.g., \"Consulting\").",
          "Legal element: indicates limited liability, such as Inc., Incorporated, Corp., Corporation, Ltd., Limited, Limitée or Ltée."
        ]
      },
      {
        "type": "paragraph",
        "text": "For a federal corporation, the CBCA also allows Incorporée, Société par actions de régime fédéral and S.A.R.F. Ontario's list of legal elements is similar but does not include the two federal-only forms. The legal element is mandatory, but it never makes a name distinctive: \"Vertex Consulting Inc.\" and \"Vertex Consulting Ltd.\" are, for practical purposes, the same name."
      },
      {
        "type": "paragraph",
        "text": "A name that is only descriptive (\"Canadian Consulting Inc.\") will almost always be rejected. A name that is distinctive but very close to an existing registered name (\"Maplewind Consulting Inc.\" vs. an existing \"MapleWynd Consulting Ltd.\") may also be rejected on confusion grounds."
      },
      {
        "type": "paragraph",
        "text": "Working out which part of your name is the distinctive element matters more than it looks, because that is what NUANS actually searches. If you submit the wrong words as the distinctive element, the report is formally valid but searches the wrong thing."
      },
      {
        "type": "heading",
        "id": "rejections",
        "text": "Common reasons names are refused"
      },
      {
        "type": "paragraph",
        "text": "Corporations Canada's name requirements set out the grounds on which a proposed name is refused, and provincial rules are similar in substance. The most common are:"
      },
      {
        "type": "list",
        "items": [
          "Too descriptive: the name only describes the activity, goods or services, with no distinctive element.",
          "Confusing: the name is too close to an existing corporate name, business name or trademark.",
          "Prohibited terms: certain words cannot be used, such as \"RCMP\" or \"Parliament Hill\".",
          "Implied sponsorship: the name suggests a government or institutional connection without consent.",
          "Misdescriptive: the name misleads about the business, its personnel, its products or where they come from.",
          "Obscene words or phrases."
        ]
      },
      {
        "type": "paragraph",
        "text": "A clean report does not guarantee approval, because several of these grounds have nothing to do with similarity. If a name has already been refused, our guide on what to do when a corporate name is rejected walks through the practical routes forward.",
        "parts": [
          "A clean report does not guarantee approval, because several of these grounds have nothing to do with similarity. If a name has already been refused, our guide on ",
          {
            "text": "what to do when a corporate name is rejected",
            "href": "/guides/corporate-name-rejected-canada"
          },
          " walks through the practical routes forward."
        ]
      },
      {
        "type": "paragraph",
        "text": "Federally, you can reduce the back-and-forth by giving the examiner context when you propose the name. Corporations Canada suggests describing the type of business, the geographic area you expect to operate in, your clientele, how you chose the distinctive element, and any similar names or trademarks you already hold. If the name contains a person's family name, explain that person's connection to the corporation."
      },
      {
        "type": "heading",
        "id": "if-unavailable",
        "text": "What if your first choice is unavailable"
      },
      {
        "type": "paragraph",
        "text": "There are three common fallbacks. You can propose a variation with a more distinctive element; you can add a geographic or descriptive modifier that creates meaningful separation; or you can incorporate as a numbered corporation now and adopt an operating name later through a business-name registration. The numbered route is the fastest path when speed matters more than branding."
      },
      {
        "type": "heading",
        "id": "nuans-vs-trademark",
        "text": "NUANS search versus trademark search"
      },
      {
        "type": "paragraph",
        "text": "A NUANS search includes registered trademarks, but it is not a trademark clearance and it gives you no trademark rights. Getting a corporate name approved means the registry was satisfied the name could be used as a corporate name. It does not stop the owner of an earlier trademark from objecting to how you use the name in the market."
      },
      {
        "type": "paragraph",
        "text": "If the name is central to your brand, search the Canadian Trademarks Database, which CIPO maintains, and consider applying to register the name as a trademark under the Trademarks Act. That is a separate process with its own examination and timelines, and it is the step that protects a brand across Canada."
      },
      {
        "type": "callout",
        "text": "A NUANS report does not grant a trademark. If your name is central to your brand, you should also consider a trademark registration through the Canadian Intellectual Property Office. That is a separate process from incorporation."
      },
      {
        "type": "heading",
        "id": "step-by-step",
        "text": "How to get a NUANS report, step by step"
      },
      {
        "type": "list",
        "items": [
          "Decide whether you need a word name at all. If speed matters more than branding, a numbered corporation needs no search.",
          "Choose your jurisdiction. Federal and Ontario are the most common, and they handle the search differently.",
          "Build the name from a distinctive element, a descriptive element and a legal ending, and note which words are the distinctive element.",
          "Shortlist two or three candidates. Searching several names at once costs less than discovering conflicts one refusal at a time.",
          "Order the search. In Ontario, Alberta and New Brunswick, order a report weighted for that jurisdiction from a private search provider. Federally, the search runs inside the Online Filing Centre when you file, and you can run a preliminary search beforehand to screen candidates.",
          "Review the report for identical or near-identical active names, especially in the same industry or jurisdiction, and for live trademarks.",
          "File your articles within the 90-day window, giving the report details where the registry asks for them."
        ]
      },
      {
        "type": "paragraph",
        "text": "Korporex can order NUANS preliminary name-search reports for one or several candidate names on a single order, and can then file your federal or Ontario incorporation once a name clears. Korporex is not a law firm and does not advise on whether a particular name will be granted.",
        "parts": [
          "Korporex can ",
          {
            "text": "order NUANS preliminary name-search reports",
            "href": "/nuans"
          },
          " for one or several candidate names on a single order, and can then ",
          {
            "text": "file your federal or Ontario incorporation",
            "href": "/incorporate"
          },
          " once a name clears. Korporex is not a law firm and does not advise on whether a particular name will be granted."
        ]
      },
      {
        "type": "heading",
        "id": "cost",
        "text": "What a NUANS search costs"
      },
      {
        "type": "paragraph",
        "text": "Keep two kinds of cost apart. On the government side, ISED lists the cost of a federal name search at $13.80, and Corporations Canada lists the online federal incorporation fee at $200; check the fee summary in the Online Filing Centre before you pay to see the total for your application. In Ontario, the report is not sold by the government at all. It comes from a private provider, so its price is set by that provider and does not appear on Ontario's fee schedule. Ontario's government fee for filing articles of incorporation is $300."
      },
      {
        "type": "paragraph",
        "text": "For firms that order searches regularly, the price of the same report varies a great deal by provider and procurement channel. Our NUANS procurement guide for law firms covers what to compare. Government fees change from time to time; the figures here reflect ISED, Corporations Canada and Ontario sources as of October 2026.",
        "parts": [
          "For firms that order searches regularly, the price of the same report varies a great deal by provider and procurement channel. Our ",
          {
            "text": "NUANS procurement guide for law firms",
            "href": "/guides/nuans-report-for-law-firms"
          },
          " covers what to compare. Government fees change from time to time; the figures here reflect ISED, Corporations Canada and Ontario sources as of October 2026."
        ]
      }
    ],
    "faq": [
      {
        "q": "What does NUANS stand for?",
        "a": "NUANS stands for Newly Upgraded Automated Name Search. It is the Government of Canada's name and trademark search system, managed by Innovation, Science and Economic Development Canada. A NUANS report compares a proposed corporate name with existing corporate names, business names and trademarks across Canada, and lists the closest matches so a registry examiner can judge whether the new name can be granted."
      },
      {
        "q": "Do I need a NUANS report to incorporate federally?",
        "a": "Not as a separate step for an online incorporation. Corporations Canada has built the NUANS name search into its Online Filing Centre, so the search runs as part of your application when you propose a word name. A separately ordered federal report is still required for some other transactions, such as revivals and amalgamations. A numbered federal corporation needs no name search."
      },
      {
        "q": "How long is a NUANS report valid?",
        "a": "90 days. Corporations Canada states that a NUANS search is valid for 90 days only, and Ontario will not accept a report dated more than 90 days before the articles are filed. If your filing is not accepted within that window, you need a new report, so it pays to order the search once the rest of the incorporation is ready."
      },
      {
        "q": "Does a NUANS report mean my name is approved?",
        "a": "No. A report is a list of similar existing names, not an approval. The registry examiner decides whether the name is granted, and can refuse it for reasons the report does not address, such as being too descriptive or misleading. Federally, a separate corporate name preapproval is available and is valid for 90 days from the date you apply."
      },
      {
        "q": "Is a NUANS search the same as a trademark search?",
        "a": "No. NUANS includes registered trademarks among the names it compares, but an approved corporate name gives you no trademark rights. If the name matters to your brand, search the Canadian Trademarks Database maintained by the Canadian Intellectual Property Office and consider registering a trademark, which is a separate application with its own examination."
      },
      {
        "q": "Can I incorporate without a NUANS search?",
        "a": "Yes, by incorporating a numbered corporation. No Canadian jurisdiction requires a name search for a numbered company, because the registry assigns the name. You can carry on business under a brand by registering an operating name, and change the corporate name later by articles of amendment, which needs a name search where the jurisdiction requires one."
      }
    ]
  },
  "fr": {
    "readTime": "14 min de lecture",
    "content": [
      {
        "type": "paragraph",
        "text": "Une recherche de nom NUANS est une comparaison informatisée d'un nom de société proposé avec une base de données nationale des dénominations sociales, des noms commerciaux et des marques de commerce existants au Canada. NUANS est l'acronyme de Newly Upgraded Automated Name Search. Le résultat, un rapport NUANS, répertorie les noms existants les plus semblables au vôtre, afin qu'un examinateur du registre puisse déterminer si le nom proposé est suffisamment distinctif pour être accordé, ou s'il risque d'être confondu avec un nom déjà utilisé."
      },
      {
        "type": "paragraph",
        "text": "Si vous vous constituez en société avec un nom plutôt qu'un matricule, une forme de recherche de nom se trouve entre vous et votre certificat de constitution. Que vous deviez commander vous-même un rapport NUANS ou que le registre effectue la recherche pour vous dépend de l'endroit où vous vous constituez. Ce guide offre une vue d'ensemble : ce qu'est la base de données, quand un rapport est requis, ce qu'il contient, combien de temps il reste valide et comment l'obtenir, avec des liens vers nos guides plus détaillés sur chaque sujet."
      },
      {
        "type": "heading",
        "id": "quest-ce-que-nuans",
        "text": "La base de données NUANS et qui l'administre"
      },
      {
        "type": "paragraph",
        "text": "NUANS est un système fédéral. Innovation, Sciences et Développement économique Canada (ISDE) le gère et le décrit comme l'outil de recherche de noms d'entreprises et de marques de commerce du gouvernement du Canada. Un fournisseur de services privé s'occupe de l'administration des adhésions à NUANS, ce qui explique que la plupart des rapports soient commandés auprès d'une maison de recherche inscrite plutôt qu'à un comptoir gouvernemental."
      },
      {
        "type": "paragraph",
        "text": "La base de données regroupe les dénominations sociales enregistrées au fédéral et dans les provinces et territoires, les noms commerciaux enregistrés dans les administrations participantes, ainsi que les marques de commerce de l'Office de la propriété intellectuelle du Canada (OPIC). Lorsqu'une recherche est lancée, un algorithme compare le nom proposé à ces dossiers, en tenant compte de la sonorité et de l'orthographe autant que du libellé exact, et renvoie les correspondances les plus proches."
      },
      {
        "type": "paragraph",
        "text": "Deux points méritent d'être retenus dès le départ. D'abord, NUANS ne connaît que les noms enregistrés quelque part. Une entreprise établie qui n'a jamais enregistré son nom n'apparaîtra pas dans un rapport. Ensuite, le rapport est un élément de preuve, pas une décision. Il n'approuve ni ne refuse rien à lui seul; c'est un examinateur du registre qui tranche."
      },
      {
        "type": "heading",
        "id": "quand-requis",
        "text": "Quand un rapport NUANS est requis"
      },
      {
        "type": "paragraph",
        "text": "La réponse dépend de l'administration où vous vous constituez, et du fait que vous souhaitiez ou non un nom. Les deux voies les plus courantes sont la constitution fédérale en vertu de la Loi canadienne sur les sociétés par actions (LCSA) et la constitution en Ontario en vertu de la Loi sur les sociétés par actions (LSAO), et elles traitent maintenant la recherche différemment."
      },
      {
        "type": "heading",
        "id": "federal",
        "text": "Constitution fédérale : la recherche est intégrée"
      },
      {
        "type": "paragraph",
        "text": "Corporations Canada a intégré la recherche de nom NUANS à son Centre de dépôt en ligne. Lorsque vous vous constituez au fédéral avec un nom, ou que vous demandez l'approbation préalable d'une dénomination sociale, la recherche est effectuée dans le cadre de la demande en ligne. Selon Corporations Canada, vous n'avez pas à commander un rapport distinct avant de présenter la demande. ISDE indique que le coût d'une recherche de nom fédérale est de 13,80 $."
      },
      {
        "type": "paragraph",
        "text": "Un rapport NUANS fédéral commandé séparément reste requis pour certaines autres opérations fédérales, notamment les reconstitutions et les fusions en vertu de la LCSA. Certains demandeurs choisissent aussi d'effectuer une recherche préliminaire sur leurs noms candidats avant le dépôt, puisque l'examinateur comparera le nom aux mêmes dossiers, et qu'il vaut mieux découvrir un conflit proche avant la demande qu'après."
      },
      {
        "type": "paragraph",
        "text": "Au fédéral, vous pouvez aussi demander l'approbation préalable d'une dénomination sociale avant de vous constituer. Cette étape est facultative, et Corporations Canada précise que, dans la plupart des cas, il est plus efficace de choisir le nom dans le cadre de la constitution elle-même. Une approbation préalable est valide pendant 90 jours à compter de la date de la demande."
      },
      {
        "type": "heading",
        "id": "ontario",
        "text": "Constitution en Ontario : vous fournissez le rapport"
      },
      {
        "type": "paragraph",
        "text": "L'Ontario fonctionne à l'inverse. Pour constituer une société par actions ontarienne avec un nom, vous devez obtenir un rapport NUANS à pondération ontarienne auprès d'un fournisseur privé de recherche de noms. Le gouvernement de l'Ontario n'effectue pas la recherche pour vous, et un rapport à pondération fédérale ne sera pas accepté. Lors du dépôt des statuts par le Registre des entreprises de l'Ontario, vous indiquez le numéro de référence du rapport, le nom recherché et la date du rapport."
      },
      {
        "type": "paragraph",
        "text": "La même règle s'applique lorsqu'une société ontarienne existante change de nom par statuts de modification : un nouveau rapport à pondération ontarienne est requis, sauf si le nouveau nom est un matricule. Si vous renommez une société plutôt que d'en créer une, consultez notre service de changement de dénomination sociale.",
        "parts": [
          "La même règle s'applique lorsqu'une société ontarienne existante change de nom par statuts de modification : un nouveau rapport à pondération ontarienne est requis, sauf si le nouveau nom est un matricule. Si vous renommez une société plutôt que d'en créer une, consultez notre ",
          {
            "text": "service de changement de dénomination sociale",
            "href": "/services/change-name"
          },
          "."
        ]
      },
      {
        "type": "heading",
        "id": "par-province",
        "text": "Quelles provinces exigent un rapport NUANS"
      },
      {
        "type": "paragraph",
        "text": "En dehors des régimes fédéral et ontarien, l'Alberta et le Nouveau-Brunswick exigent aussi un rapport de recherche de nom obtenu auprès d'un fournisseur privé. Partout ailleurs, la vérification du nom passe par le processus propre au registre, et plusieurs registres n'acceptent pas un rapport NUANS à la place de leur propre étape. Le tableau ci-dessous est un résumé; notre guide sur les provinces qui exigent un rapport NUANS présente chaque administration en détail, y compris celles qui ont leur propre étape de réservation.",
        "parts": [
          "En dehors des régimes fédéral et ontarien, l'Alberta et le Nouveau-Brunswick exigent aussi un rapport de recherche de nom obtenu auprès d'un fournisseur privé. Partout ailleurs, la vérification du nom passe par le processus propre au registre, et plusieurs registres n'acceptent pas un rapport NUANS à la place de leur propre étape. Le tableau ci-dessous est un résumé; notre guide sur les ",
          {
            "text": "provinces qui exigent un rapport NUANS",
            "href": "/guides/quelles-provinces-exigent-un-rapport-nuans"
          },
          " présente chaque administration en détail, y compris celles qui ont leur propre étape de réservation."
        ]
      },
      {
        "type": "table",
        "head": [
          "Administration",
          "Commandez-vous un rapport NUANS ?",
          "Comment le nom est vérifié"
        ],
        "rows": [
          [
            "Fédéral (LCSA)",
            "Aucun rapport distinct pour une constitution en ligne",
            "Recherche intégrée à la demande dans le Centre de dépôt en ligne"
          ],
          [
            "Ontario (LSAO)",
            "Oui, à pondération ontarienne, pour une société avec un nom",
            "Numéro de référence, nom recherché et date du rapport fournis avec les statuts"
          ],
          [
            "Alberta",
            "Oui",
            "Rapport obtenu auprès d'une entreprise privée de recherche de noms"
          ],
          [
            "Nouveau-Brunswick",
            "Oui",
            "Rapport obtenu auprès d'une entreprise privée de recherche de noms"
          ],
          [
            "Manitoba, Nouvelle-Écosse, Île-du-Prince-Édouard, Saskatchewan, Yukon",
            "Non",
            "Recherche de nom intégrée au processus de demande du registre"
          ],
          [
            "Colombie-Britannique, Québec, Terre-Neuve-et-Labrador, Territoires du Nord-Ouest, Nunavut",
            "Non",
            "Suivre les règles propres au registre en matière d'approbation ou de réservation de nom (la Colombie-Britannique, par exemple, utilise une Name Request)"
          ]
        ]
      },
      {
        "type": "heading",
        "id": "matricule",
        "text": "L'exception de la société à matricule"
      },
      {
        "type": "paragraph",
        "text": "Une société à matricule n'exige aucune recherche de nom, nulle part au Canada. Le registre attribue le numéro, et la dénomination devient par exemple 12345678 Canada Inc. au fédéral, ou un numéro suivi de « Ontario » et d'un élément juridique en Ontario. Vous pouvez tout de même exercer vos activités sous une marque en enregistrant un nom commercial. Notre comparaison entre la société nominative et la société à matricule présente les avantages et inconvénients, y compris ce qu'il faut faire pour passer plus tard à un nom.",
        "parts": [
          "Une société à matricule n'exige aucune recherche de nom, nulle part au Canada. Le registre attribue le numéro, et la dénomination devient par exemple 12345678 Canada Inc. au fédéral, ou un numéro suivi de « Ontario » et d'un élément juridique en Ontario. Vous pouvez tout de même exercer vos activités sous une marque en enregistrant un nom commercial. Notre comparaison entre la ",
          {
            "text": "société nominative et la société à matricule",
            "href": "/guides/societe-nominative-ou-a-matricule"
          },
          " présente les avantages et inconvénients, y compris ce qu'il faut faire pour passer plus tard à un nom."
        ]
      },
      {
        "type": "heading",
        "id": "comment-ca-fonctionne",
        "text": "Comment fonctionne une recherche NUANS"
      },
      {
        "type": "paragraph",
        "text": "Chaque recherche suit la même séquence. Vous fournissez le nom complet proposé et en indiquez l'élément distinctif. La recherche est effectuée dans la base de données, pondérée selon l'administration choisie, et un rapport NUANS vous est remis, habituellement rapidement, avec la liste des noms existants les plus proches. En Ontario, en Alberta et au Nouveau-Brunswick, vous commandez ce rapport auprès d'un fournisseur de recherche; au fédéral, la recherche est effectuée dans le Centre de dépôt en ligne au moment du dépôt.",
        "parts": [
          "Chaque recherche suit la même séquence. Vous fournissez le nom complet proposé et en indiquez l'élément distinctif. La recherche est effectuée dans la base de données, pondérée selon l'administration choisie, et un ",
          {
            "text": "rapport NUANS",
            "href": "/nuans"
          },
          " vous est remis, habituellement rapidement, avec la liste des noms existants les plus proches. En Ontario, en Alberta et au Nouveau-Brunswick, vous commandez ce rapport auprès d'un fournisseur de recherche; au fédéral, la recherche est effectuée dans le Centre de dépôt en ligne au moment du dépôt."
        ]
      },
      {
        "type": "paragraph",
        "text": "Le gouvernement ne prend pas la décision finale uniquement à partir du rapport. Un examinateur des sociétés (fédéral ou provincial) examine le rapport et le nom proposé, soupèse le caractère distinctif et le risque de confusion avec des noms existants, puis approuve le nom ou demande des modifications. Au fédéral, si l'examinateur a besoin de renseignements supplémentaires, vous recevez un avis de mesure requise accompagné d'instructions pour présenter de nouveau la demande."
      },
      {
        "type": "heading",
        "id": "validite",
        "text": "Combien de temps un rapport NUANS est valide"
      },
      {
        "type": "paragraph",
        "text": "Une recherche NUANS est valide pendant 90 jours. Corporations Canada l'indique directement, et les règles de dépôt de l'Ontario prévoient qu'un rapport ne peut être daté de plus de 90 jours avant le dépôt des statuts. L'Ontario donne son propre exemple : des statuts reçus le 28 novembre pourraient être appuyés par un rapport daté au plus tôt du 30 août, mais pas avant. Si le délai expire avant que le dépôt soit accepté, un nouveau rapport est nécessaire."
      },
      {
        "type": "paragraph",
        "text": "La leçon pratique tient au moment choisi. Commandez la recherche une fois que la structure du capital, les actionnaires et les administrateurs sont fixés, et non le jour où un nom est évoqué pour la première fois. Un rapport qui expire pendant que le reste de la constitution est encore en négociation, c'est de l'argent dépensé deux fois."
      },
      {
        "type": "heading",
        "id": "contenu-du-rapport",
        "text": "Ce que contient un rapport NUANS"
      },
      {
        "type": "paragraph",
        "text": "Un rapport comporte un en-tête et un corps. L'en-tête indique le numéro de référence à citer lors du dépôt, la date et l'heure de la recherche (qui marquent le début du délai de 90 jours), l'administration selon laquelle la recherche a été pondérée, et le nom tel qu'il a été recherché. Le corps est une liste classée des dénominations sociales, noms commerciaux et marques de commerce existants que l'algorithme a jugés semblables au vôtre, chacun accompagné d'un code indiquant le registre d'où il provient. Il n'y a aucun verdict à la fin. Notre guide pour lire un rapport NUANS explique chaque section et la façon de distinguer un vrai conflit du bruit de fond.",
        "parts": [
          "Un rapport comporte un en-tête et un corps. L'en-tête indique le numéro de référence à citer lors du dépôt, la date et l'heure de la recherche (qui marquent le début du délai de 90 jours), l'administration selon laquelle la recherche a été pondérée, et le nom tel qu'il a été recherché. Le corps est une liste classée des dénominations sociales, noms commerciaux et marques de commerce existants que l'algorithme a jugés semblables au vôtre, chacun accompagné d'un code indiquant le registre d'où il provient. Il n'y a aucun verdict à la fin. Notre guide pour ",
          {
            "text": "lire un rapport NUANS",
            "href": "/guides/comment-lire-un-rapport-nuans"
          },
          " explique chaque section et la façon de distinguer un vrai conflit du bruit de fond."
        ]
      },
      {
        "type": "heading",
        "id": "anatomie-du-nom",
        "text": "L'anatomie d'une dénomination sociale"
      },
      {
        "type": "paragraph",
        "text": "Une dénomination sociale canadienne conforme comporte trois parties :"
      },
      {
        "type": "list",
        "items": [
          "L'élément distinctif : un mot unique ou inventé qui distingue l'entreprise (p. ex. « Maplewind »).",
          "L'élément descriptif : il décrit l'activité de l'entreprise (p. ex. « Consultation »).",
          "L'élément juridique : il indique la responsabilité limitée, comme Inc., Incorporée, Corp., Corporation, Ltd., Limited, Limitée ou Ltée."
        ]
      },
      {
        "type": "paragraph",
        "text": "Pour une société fédérale, la LCSA permet aussi Incorporated, Société par actions de régime fédéral et S.A.R.F. La liste des éléments juridiques de l'Ontario est semblable, mais ne comprend pas les deux formes propres au fédéral. L'élément juridique est obligatoire, mais il ne rend jamais un nom distinctif : « Vertex Consultation Inc. » et « Vertex Consultation Ltée » sont, en pratique, le même nom."
      },
      {
        "type": "paragraph",
        "text": "Un nom uniquement descriptif (« Consultation Canadienne Inc. ») sera presque toujours refusé. Un nom distinctif mais très proche d'un nom déjà enregistré (« Maplewind Consultation Inc. » par rapport à un « MapleWynd Consultation Ltée » existant) peut aussi être refusé pour cause de confusion."
      },
      {
        "type": "paragraph",
        "text": "Bien cerner l'élément distinctif de votre nom est plus important qu'il n'y paraît, puisque c'est lui que NUANS recherche réellement. Si vous indiquez les mauvais mots comme élément distinctif, le rapport est formellement valide, mais il porte sur la mauvaise chose."
      },
      {
        "type": "heading",
        "id": "refus",
        "text": "Les motifs de refus les plus courants"
      },
      {
        "type": "paragraph",
        "text": "Les exigences de Corporations Canada en matière de dénomination énoncent les motifs pour lesquels un nom proposé est refusé, et les règles provinciales sont semblables sur le fond. Les plus fréquents sont les suivants :"
      },
      {
        "type": "list",
        "items": [
          "Trop descriptif : le nom ne fait que décrire l'activité, les produits ou les services, sans élément distinctif.",
          "Source de confusion : le nom est trop proche d'une dénomination sociale, d'un nom commercial ou d'une marque de commerce existants.",
          "Termes interdits : certains mots ne peuvent pas être utilisés, comme « GRC » ou « Colline du Parlement ».",
          "Parrainage implicite : le nom laisse croire à un lien avec un gouvernement ou une institution sans consentement.",
          "Trompeur : le nom induit en erreur sur l'entreprise, son personnel, ses produits ou leur provenance.",
          "Mots ou expressions obscènes."
        ]
      },
      {
        "type": "paragraph",
        "text": "Un rapport sans conflit ne garantit pas l'approbation, car plusieurs de ces motifs n'ont rien à voir avec la ressemblance. Si un nom a déjà été refusé, notre guide sur la dénomination sociale refusée présente les solutions concrètes.",
        "parts": [
          "Un rapport sans conflit ne garantit pas l'approbation, car plusieurs de ces motifs n'ont rien à voir avec la ressemblance. Si un nom a déjà été refusé, notre guide sur la ",
          {
            "text": "dénomination sociale refusée",
            "href": "/guides/denomination-sociale-refusee-canada"
          },
          " présente les solutions concrètes."
        ]
      },
      {
        "type": "paragraph",
        "text": "Au fédéral, vous pouvez limiter les allers-retours en donnant du contexte à l'examinateur au moment de proposer le nom. Corporations Canada suggère de décrire le type d'entreprise, la région où vous prévoyez exercer vos activités, votre clientèle, la façon dont vous avez choisi l'élément distinctif, ainsi que les noms ou marques de commerce semblables que vous détenez déjà. Si le nom comprend le nom de famille d'une personne, expliquez le lien de cette personne avec la société."
      },
      {
        "type": "heading",
        "id": "si-indisponible",
        "text": "Si votre premier choix n'est pas disponible"
      },
      {
        "type": "paragraph",
        "text": "Il existe trois solutions de rechange courantes. Vous pouvez proposer une variante avec un élément distinctif plus marqué; vous pouvez ajouter un modificateur géographique ou descriptif qui crée une séparation réelle; ou vous pouvez vous constituer dès maintenant comme société à matricule et adopter plus tard un nom commercial par l'enregistrement d'un nom d'entreprise. La voie de la société à matricule est la plus rapide lorsque la vitesse compte plus que l'image de marque."
      },
      {
        "type": "heading",
        "id": "nuans-ou-marque",
        "text": "Recherche NUANS ou recherche de marque de commerce"
      },
      {
        "type": "paragraph",
        "text": "Une recherche NUANS inclut les marques de commerce enregistrées, mais ce n'est pas une vérification de disponibilité de marque et elle ne vous confère aucun droit sur une marque. L'approbation d'une dénomination sociale signifie que le registre a jugé le nom acceptable comme dénomination sociale. Elle n'empêche pas le titulaire d'une marque de commerce antérieure de s'opposer à l'usage que vous faites du nom sur le marché."
      },
      {
        "type": "paragraph",
        "text": "Si le nom est au cœur de votre marque, consultez la Base de données sur les marques de commerce canadiennes, tenue par l'OPIC, et envisagez de demander l'enregistrement du nom comme marque de commerce en vertu de la Loi sur les marques de commerce. Il s'agit d'un processus distinct, avec son propre examen et ses propres délais, et c'est l'étape qui protège une marque partout au Canada."
      },
      {
        "type": "callout",
        "text": "Un rapport NUANS n'accorde pas de marque de commerce. Si votre nom est au cœur de votre marque, vous devriez aussi envisager l'enregistrement d'une marque de commerce auprès de l'Office de la propriété intellectuelle du Canada. C'est un processus distinct de la constitution en société."
      },
      {
        "type": "heading",
        "id": "etapes",
        "text": "Obtenir un rapport NUANS, étape par étape"
      },
      {
        "type": "list",
        "items": [
          "Déterminez si vous avez vraiment besoin d'un nom. Si la rapidité compte plus que l'image de marque, une société à matricule n'exige aucune recherche.",
          "Choisissez votre administration. Le fédéral et l'Ontario sont les plus courants, et ils traitent la recherche différemment.",
          "Composez le nom à partir d'un élément distinctif, d'un élément descriptif et d'un élément juridique, et notez quels mots forment l'élément distinctif.",
          "Retenez deux ou trois noms candidats. Rechercher plusieurs noms à la fois coûte moins cher que de découvrir les conflits un refus à la fois.",
          "Commandez la recherche. En Ontario, en Alberta et au Nouveau-Brunswick, commandez un rapport pondéré pour cette administration auprès d'un fournisseur privé. Au fédéral, la recherche est effectuée dans le Centre de dépôt en ligne au moment du dépôt, et vous pouvez faire une recherche préliminaire au préalable pour filtrer vos candidats.",
          "Examinez le rapport pour repérer les noms actifs identiques ou presque identiques, surtout dans le même secteur ou la même administration, ainsi que les marques de commerce en vigueur.",
          "Déposez vos statuts dans le délai de 90 jours, en fournissant les renseignements du rapport lorsque le registre les demande."
        ]
      },
      {
        "type": "paragraph",
        "text": "Korporex peut commander des rapports de recherche préliminaire NUANS pour un ou plusieurs noms candidats dans une seule commande, puis déposer votre constitution fédérale ou ontarienne une fois le nom dégagé. Korporex n'est pas un cabinet d'avocats et ne donne pas d'avis sur l'acceptation d'un nom en particulier.",
        "parts": [
          "Korporex peut ",
          {
            "text": "commander des rapports de recherche préliminaire NUANS",
            "href": "/nuans"
          },
          " pour un ou plusieurs noms candidats dans une seule commande, puis ",
          {
            "text": "déposer votre constitution fédérale ou ontarienne",
            "href": "/incorporate"
          },
          " une fois le nom dégagé. Korporex n'est pas un cabinet d'avocats et ne donne pas d'avis sur l'acceptation d'un nom en particulier."
        ]
      },
      {
        "type": "heading",
        "id": "cout",
        "text": "Combien coûte une recherche NUANS"
      },
      {
        "type": "paragraph",
        "text": "Distinguez deux types de coûts. Du côté gouvernemental, ISDE indique que le coût d'une recherche de nom fédérale est de 13,80 $, et Corporations Canada indique des droits de 200 $ pour une constitution fédérale en ligne; vérifiez le sommaire des droits dans le Centre de dépôt en ligne avant de payer pour connaître le total de votre demande. En Ontario, le rapport n'est pas vendu par le gouvernement. Il provient d'un fournisseur privé, qui en fixe le prix, et il ne figure donc pas au barème des droits de l'Ontario. Les droits gouvernementaux de l'Ontario pour le dépôt de statuts constitutifs sont de 300 $."
      },
      {
        "type": "paragraph",
        "text": "Pour les cabinets qui commandent régulièrement des recherches, le prix d'un même rapport varie beaucoup selon le fournisseur et le mode d'approvisionnement. Notre guide sur le rapport NUANS pour cabinets d'avocats présente les éléments à comparer. Les droits gouvernementaux changent de temps à autre; les montants indiqués ici reflètent les sources d'ISDE, de Corporations Canada et de l'Ontario en date d'octobre 2026.",
        "parts": [
          "Pour les cabinets qui commandent régulièrement des recherches, le prix d'un même rapport varie beaucoup selon le fournisseur et le mode d'approvisionnement. Notre guide sur le ",
          {
            "text": "rapport NUANS pour cabinets d'avocats",
            "href": "/guides/rapport-nuans-pour-cabinets-davocats"
          },
          " présente les éléments à comparer. Les droits gouvernementaux changent de temps à autre; les montants indiqués ici reflètent les sources d'ISDE, de Corporations Canada et de l'Ontario en date d'octobre 2026."
        ]
      }
    ],
    "faq": [
      {
        "q": "Que signifie NUANS ?",
        "a": "NUANS est l'acronyme de Newly Upgraded Automated Name Search. C'est le système de recherche de noms et de marques de commerce du gouvernement du Canada, géré par Innovation, Sciences et Développement économique Canada. Un rapport NUANS compare un nom de société proposé aux dénominations sociales, noms commerciaux et marques de commerce existants au Canada, et énumère les plus proches pour que l'examinateur puisse décider si le nom peut être accordé."
      },
      {
        "q": "Ai-je besoin d'un rapport NUANS pour me constituer au fédéral ?",
        "a": "Pas comme étape distincte pour une constitution en ligne. Corporations Canada a intégré la recherche de nom NUANS à son Centre de dépôt en ligne : la recherche est effectuée dans le cadre de votre demande lorsque vous proposez un nom. Un rapport fédéral commandé séparément reste requis pour d'autres opérations, comme les reconstitutions et les fusions. Une société fédérale à matricule n'exige aucune recherche de nom."
      },
      {
        "q": "Combien de temps un rapport NUANS est-il valide ?",
        "a": "90 jours. Corporations Canada précise qu'une recherche NUANS n'est valide que 90 jours, et l'Ontario n'accepte pas un rapport daté de plus de 90 jours avant le dépôt des statuts. Si votre dépôt n'est pas accepté dans ce délai, il vous faut un nouveau rapport. Il vaut donc mieux commander la recherche lorsque le reste de la constitution est prêt."
      },
      {
        "q": "Un rapport NUANS signifie-t-il que mon nom est approuvé ?",
        "a": "Non. Un rapport est une liste de noms existants semblables, pas une approbation. L'examinateur du registre décide si le nom est accordé et peut le refuser pour des motifs dont le rapport ne traite pas, par exemple s'il est trop descriptif ou trompeur. Au fédéral, une approbation préalable distincte de la dénomination est offerte et reste valide 90 jours à compter de la demande."
      },
      {
        "q": "Une recherche NUANS équivaut-elle à une recherche de marque de commerce ?",
        "a": "Non. NUANS inclut les marques de commerce enregistrées parmi les noms comparés, mais une dénomination sociale approuvée ne vous confère aucun droit de marque. Si le nom compte pour votre image de marque, consultez la Base de données sur les marques de commerce canadiennes de l'Office de la propriété intellectuelle du Canada et envisagez une demande d'enregistrement, qui suit son propre examen."
      },
      {
        "q": "Puis-je me constituer sans recherche NUANS ?",
        "a": "Oui, en constituant une société à matricule. Aucune administration canadienne n'exige de recherche de nom pour une société à matricule, puisque le registre attribue le nom. Vous pouvez exercer vos activités sous une marque en enregistrant un nom commercial, puis changer la dénomination plus tard par statuts de modification, ce qui exige une recherche de nom là où l'administration en impose une."
      }
    ]
  },
  "es": {
    "readTime": "13 min de lectura",
    "content": [
      {
        "type": "paragraph",
        "text": "Una búsqueda de nombre NUANS es una comparación informatizada de un nombre de sociedad propuesto con una base de datos nacional de denominaciones sociales, nombres comerciales y marcas registradas existentes en Canadá. NUANS es la sigla de Newly Upgraded Automated Name Search. El resultado, un informe NUANS, enumera los nombres existentes más parecidos al suyo para que un examinador del registro pueda decidir si el nombre propuesto es lo bastante distintivo como para concederse, o si puede confundirse con un nombre que ya está en uso."
      },
      {
        "type": "paragraph",
        "text": "Si va a constituirse en sociedad con un nombre en lugar de un número, algún tipo de búsqueda de nombre se interpone entre usted y su certificado de constitución. Que usted mismo deba encargar un informe NUANS o que el registro haga la búsqueda por usted depende de dónde se constituya. Esta guía es la visión general: qué es la base de datos, cuándo se necesita un informe, qué contiene, cuánto tiempo es válido y cómo obtenerlo, con enlaces a nuestras guías más detalladas sobre cada tema."
      },
      {
        "type": "heading",
        "id": "que-es-nuans",
        "text": "Qué es la base de datos NUANS y quién la administra"
      },
      {
        "type": "paragraph",
        "text": "NUANS es un sistema federal. Innovación, Ciencia y Desarrollo Económico de Canadá (ISED, por sus siglas en inglés) lo gestiona y lo describe como la herramienta de búsqueda de nombres comerciales y marcas del Gobierno de Canadá. Un proveedor de servicios privado se encarga de administrar las membresías de NUANS, por lo que la mayoría de los informes se solicitan a través de una casa de búsqueda registrada y no en una ventanilla del gobierno."
      },
      {
        "type": "paragraph",
        "text": "La base de datos reúne las denominaciones sociales registradas a nivel federal y en las provincias y territorios, los nombres comerciales registrados en las jurisdicciones participantes y las marcas de la Oficina de Propiedad Intelectual de Canadá (CIPO, por sus siglas en inglés). Al realizar una búsqueda, un algoritmo compara el nombre propuesto con esos registros, teniendo en cuenta tanto el sonido y la ortografía como la redacción exacta, y devuelve las coincidencias más cercanas."
      },
      {
        "type": "paragraph",
        "text": "Conviene retener dos puntos desde el principio. Primero, NUANS solo conoce los nombres que se han registrado en algún lugar. Un negocio establecido que nunca registró su nombre no aparecerá en un informe. Segundo, el informe es una prueba, no una decisión. No aprueba ni rechaza nada por sí mismo; quien decide es un examinador del registro."
      },
      {
        "type": "heading",
        "id": "cuando-se-requiere",
        "text": "Cuándo se requiere un informe NUANS"
      },
      {
        "type": "paragraph",
        "text": "La respuesta depende de la jurisdicción en la que se constituya y de si desea o no un nombre. Las dos vías más comunes son la constitución federal bajo la Canada Business Corporations Act (CBCA) y la constitución en Ontario bajo la Business Corporations Act (OBCA), y hoy tratan la búsqueda de manera distinta."
      },
      {
        "type": "heading",
        "id": "federal",
        "text": "Constitución federal: la búsqueda está integrada"
      },
      {
        "type": "paragraph",
        "text": "Corporations Canada integró la búsqueda de nombre NUANS en su Centro de Presentación en Línea (Online Filing Centre). Cuando usted se constituye a nivel federal con un nombre, o solicita la aprobación previa de una denominación social, la búsqueda se realiza como parte de la solicitud en línea. Según Corporations Canada, no necesita encargar un informe por separado antes de presentar la solicitud. ISED indica que el costo de una búsqueda de nombre federal es de $13.80."
      },
      {
        "type": "paragraph",
        "text": "Un informe NUANS federal encargado por separado sigue siendo obligatorio para otras operaciones federales, como las reactivaciones y las fusiones bajo la CBCA. Algunos solicitantes también optan por hacer una búsqueda preliminar de sus nombres candidatos antes de presentar la solicitud, ya que el examinador comparará el nombre con los mismos registros, y es mejor encontrar un conflicto cercano antes de la solicitud que después."
      },
      {
        "type": "paragraph",
        "text": "A nivel federal, también puede solicitar la aprobación previa de una denominación social antes de constituirse. Es opcional, y Corporations Canada señala que, en la mayoría de los casos, resulta más eficiente elegir el nombre dentro de la propia constitución. Una aprobación previa es válida por 90 días desde la fecha de la solicitud."
      },
      {
        "type": "heading",
        "id": "ontario",
        "text": "Constitución en Ontario: usted aporta el informe"
      },
      {
        "type": "paragraph",
        "text": "Ontario funciona al revés. Para constituir una sociedad por acciones de Ontario con un nombre, debe obtener un informe NUANS con ponderación de Ontario (Ontario-biased) de un proveedor privado de búsqueda de nombres. El gobierno de Ontario no realiza la búsqueda por usted, y no se acepta un informe con ponderación federal. Al presentar los estatutos a través del Ontario Business Registry, usted indica el número de referencia del informe, el nombre buscado y la fecha del informe."
      },
      {
        "type": "paragraph",
        "text": "La misma regla se aplica cuando una sociedad de Ontario existente cambia de nombre mediante estatutos de modificación: se necesita un nuevo informe con ponderación de Ontario, salvo que el nuevo nombre sea numérico. Si va a cambiar el nombre de una sociedad en lugar de crear una, consulte nuestro servicio de cambio de denominación social.",
        "parts": [
          "La misma regla se aplica cuando una sociedad de Ontario existente cambia de nombre mediante estatutos de modificación: se necesita un nuevo informe con ponderación de Ontario, salvo que el nuevo nombre sea numérico. Si va a cambiar el nombre de una sociedad en lugar de crear una, consulte nuestro ",
          {
            "text": "servicio de cambio de denominación social",
            "href": "/services/change-name"
          },
          "."
        ]
      },
      {
        "type": "heading",
        "id": "por-provincia",
        "text": "Qué provincias exigen un informe NUANS"
      },
      {
        "type": "paragraph",
        "text": "Fuera de los sistemas federal y de Ontario, Alberta y Nuevo Brunswick también exigen un informe de búsqueda de nombre obtenido de un proveedor privado. En el resto del país, la verificación del nombre pasa por el proceso propio del registro, y varios registros no aceptan un informe NUANS en lugar de su propio paso. La tabla siguiente es un resumen; nuestra guía sobre qué provincias exigen un informe NUANS detalla cada jurisdicción, incluidas las que tienen su propio paso de reserva.",
        "parts": [
          "Fuera de los sistemas federal y de Ontario, Alberta y Nuevo Brunswick también exigen un informe de búsqueda de nombre obtenido de un proveedor privado. En el resto del país, la verificación del nombre pasa por el proceso propio del registro, y varios registros no aceptan un informe NUANS en lugar de su propio paso. La tabla siguiente es un resumen; nuestra guía sobre ",
          {
            "text": "qué provincias exigen un informe NUANS",
            "href": "/guides/que-provincias-exigen-un-informe-nuans"
          },
          " detalla cada jurisdicción, incluidas las que tienen su propio paso de reserva."
        ]
      },
      {
        "type": "table",
        "head": [
          "Jurisdicción",
          "¿Encarga usted un informe NUANS?",
          "Cómo se verifica el nombre"
        ],
        "rows": [
          [
            "Federal (CBCA)",
            "No hay informe separado para una constitución en línea",
            "Búsqueda integrada en la solicitud del Centro de Presentación en Línea"
          ],
          [
            "Ontario (OBCA)",
            "Sí, con ponderación de Ontario, para una sociedad con nombre",
            "Número de referencia, nombre buscado y fecha del informe indicados con los estatutos"
          ],
          [
            "Alberta",
            "Sí",
            "Informe de una empresa privada de búsqueda de nombres"
          ],
          [
            "Nuevo Brunswick",
            "Sí",
            "Informe de una empresa privada de búsqueda de nombres"
          ],
          [
            "Manitoba, Nueva Escocia, Isla del Príncipe Eduardo, Saskatchewan, Yukón",
            "No",
            "Búsqueda de nombre incluida en el proceso de solicitud del propio registro"
          ],
          [
            "Columbia Británica, Quebec, Terranova y Labrador, Territorios del Noroeste, Nunavut",
            "No",
            "Seguir las reglas propias del registro sobre aprobación o reserva de nombres (Columbia Británica, por ejemplo, usa una Name Request)"
          ]
        ]
      },
      {
        "type": "heading",
        "id": "numerada",
        "text": "La excepción de la sociedad numérica"
      },
      {
        "type": "paragraph",
        "text": "Una sociedad numérica no necesita búsqueda de nombre en ningún lugar de Canadá. El registro asigna el número, y la denominación pasa a ser algo como 12345678 Canada Inc. a nivel federal, o un número seguido de «Ontario» y un elemento legal en Ontario. Aun así, puede operar bajo una marca registrando un nombre comercial. Nuestra comparación entre la sociedad con nombre y la sociedad numérica explica las ventajas y desventajas, incluido lo que implica pasar a un nombre más adelante.",
        "parts": [
          "Una sociedad numérica no necesita búsqueda de nombre en ningún lugar de Canadá. El registro asigna el número, y la denominación pasa a ser algo como 12345678 Canada Inc. a nivel federal, o un número seguido de «Ontario» y un elemento legal en Ontario. Aun así, puede operar bajo una marca registrando un nombre comercial. Nuestra comparación entre la ",
          {
            "text": "sociedad con nombre y la sociedad numérica",
            "href": "/guides/sociedad-con-nombre-o-numerada"
          },
          " explica las ventajas y desventajas, incluido lo que implica pasar a un nombre más adelante."
        ]
      },
      {
        "type": "heading",
        "id": "como-funciona",
        "text": "Cómo funciona una búsqueda NUANS"
      },
      {
        "type": "paragraph",
        "text": "Toda búsqueda sigue la misma secuencia. Usted indica el nombre completo propuesto e identifica su elemento distintivo. La búsqueda se realiza en la base de datos, ponderada según la jurisdicción elegida, y recibe un informe NUANS, por lo general con rapidez, con la lista de los nombres existentes más cercanos. En Ontario, Alberta y Nuevo Brunswick usted encarga ese informe a un proveedor de búsqueda; a nivel federal, la búsqueda se realiza dentro del Centro de Presentación en Línea al presentar la solicitud.",
        "parts": [
          "Toda búsqueda sigue la misma secuencia. Usted indica el nombre completo propuesto e identifica su elemento distintivo. La búsqueda se realiza en la base de datos, ponderada según la jurisdicción elegida, y recibe un ",
          {
            "text": "informe NUANS",
            "href": "/nuans"
          },
          ", por lo general con rapidez, con la lista de los nombres existentes más cercanos. En Ontario, Alberta y Nuevo Brunswick usted encarga ese informe a un proveedor de búsqueda; a nivel federal, la búsqueda se realiza dentro del Centro de Presentación en Línea al presentar la solicitud."
        ]
      },
      {
        "type": "paragraph",
        "text": "El gobierno no toma la decisión final basándose únicamente en el informe. Un examinador de sociedades (federal o provincial) revisa el informe y el nombre propuesto, sopesa el carácter distintivo y el posible riesgo de confusión con nombres existentes, y aprueba el nombre o pide cambios. A nivel federal, si el examinador necesita más información, usted recibe un aviso de acción requerida (Notice of action required) con instrucciones para volver a presentar la solicitud."
      },
      {
        "type": "heading",
        "id": "validez",
        "text": "Cuánto tiempo es válido un informe NUANS"
      },
      {
        "type": "paragraph",
        "text": "Una búsqueda NUANS es válida por 90 días. Corporations Canada lo dice expresamente, y las reglas de presentación de Ontario establecen que un informe no puede tener una fecha de más de 90 días antes de la presentación de los estatutos. Ontario da su propio ejemplo: unos estatutos recibidos el 28 de noviembre podrían respaldarse con un informe fechado como muy pronto el 30 de agosto, pero no antes. Si el plazo vence antes de que se acepte la presentación, se necesita un informe nuevo."
      },
      {
        "type": "paragraph",
        "text": "La lección práctica es el momento. Encargue la búsqueda cuando la estructura de acciones, los accionistas y los administradores estén definidos, no el día en que surge un nombre por primera vez. Un informe que vence mientras el resto de la constitución todavía se negocia es dinero gastado dos veces."
      },
      {
        "type": "heading",
        "id": "contenido-del-informe",
        "text": "Qué contiene un informe NUANS"
      },
      {
        "type": "paragraph",
        "text": "Un informe tiene un encabezado y un cuerpo. El encabezado incluye el número de referencia que se cita en la presentación, la fecha y hora en que se realizó la búsqueda (que inician el plazo de 90 días), la jurisdicción para la que se ponderó la búsqueda y el nombre exactamente como se buscó. El cuerpo es una lista ordenada de denominaciones sociales, nombres comerciales y marcas existentes que el algoritmo consideró parecidos al suyo, cada uno con un código que indica el registro de origen. No hay ningún veredicto al final. Nuestra guía sobre cómo leer un informe NUANS explica cada sección y cómo distinguir un conflicto serio del ruido de fondo.",
        "parts": [
          "Un informe tiene un encabezado y un cuerpo. El encabezado incluye el número de referencia que se cita en la presentación, la fecha y hora en que se realizó la búsqueda (que inician el plazo de 90 días), la jurisdicción para la que se ponderó la búsqueda y el nombre exactamente como se buscó. El cuerpo es una lista ordenada de denominaciones sociales, nombres comerciales y marcas existentes que el algoritmo consideró parecidos al suyo, cada uno con un código que indica el registro de origen. No hay ningún veredicto al final. Nuestra guía sobre ",
          {
            "text": "cómo leer un informe NUANS",
            "href": "/guides/como-leer-un-informe-nuans"
          },
          " explica cada sección y cómo distinguir un conflicto serio del ruido de fondo."
        ]
      },
      {
        "type": "heading",
        "id": "anatomia-del-nombre",
        "text": "La anatomía de una denominación social"
      },
      {
        "type": "paragraph",
        "text": "Una denominación social canadiense conforme tiene tres partes:"
      },
      {
        "type": "list",
        "items": [
          "Elemento distintivo: una palabra única o inventada que diferencia al negocio (p. ej. «Maplewind»).",
          "Elemento descriptivo: describe la actividad del negocio (p. ej. «Consultoría»).",
          "Elemento legal: indica responsabilidad limitada, como Inc., Incorporated, Corp., Corporation, Ltd., Limited, Limitée o Ltée."
        ]
      },
      {
        "type": "paragraph",
        "text": "Para una sociedad federal, la CBCA también admite Incorporée, Société par actions de régime fédéral y S.A.R.F. La lista de elementos legales de Ontario es similar, pero no incluye las dos formas exclusivamente federales. El elemento legal es obligatorio, pero nunca vuelve distintivo un nombre: «Vertex Consulting Inc.» y «Vertex Consulting Ltd.» son, en la práctica, el mismo nombre."
      },
      {
        "type": "paragraph",
        "text": "Un nombre que es solo descriptivo («Consultoría Canadiense Inc.») casi siempre será rechazado. Un nombre que es distintivo pero muy parecido a un nombre ya registrado («Maplewind Consultoría Inc.» frente a un «MapleWynd Consulting Ltd.» existente) también puede ser rechazado por riesgo de confusión."
      },
      {
        "type": "paragraph",
        "text": "Determinar cuál es el elemento distintivo de su nombre importa más de lo que parece, porque es lo que NUANS busca realmente. Si indica las palabras equivocadas como elemento distintivo, el informe es formalmente válido, pero busca lo que no corresponde."
      },
      {
        "type": "heading",
        "id": "rechazos",
        "text": "Motivos frecuentes de rechazo de un nombre"
      },
      {
        "type": "paragraph",
        "text": "Los requisitos de Corporations Canada sobre denominaciones establecen los motivos por los que se rechaza un nombre propuesto, y las reglas provinciales son similares en lo esencial. Los más frecuentes son:"
      },
      {
        "type": "list",
        "items": [
          "Demasiado descriptivo: el nombre solo describe la actividad, los productos o los servicios, sin elemento distintivo.",
          "Confuso: el nombre se parece demasiado a una denominación social, un nombre comercial o una marca existentes.",
          "Términos prohibidos: ciertas palabras no pueden usarse, como «RCMP» o «Parliament Hill».",
          "Patrocinio implícito: el nombre sugiere un vínculo con el gobierno o una institución sin su consentimiento.",
          "Engañoso: el nombre induce a error sobre el negocio, su personal, sus productos o su origen.",
          "Palabras o expresiones obscenas."
        ]
      },
      {
        "type": "paragraph",
        "text": "Un informe limpio no garantiza la aprobación, porque varios de estos motivos no tienen nada que ver con el parecido. Si un nombre ya fue rechazado, nuestra guía sobre la denominación social rechazada explica las vías prácticas para seguir adelante.",
        "parts": [
          "Un informe limpio no garantiza la aprobación, porque varios de estos motivos no tienen nada que ver con el parecido. Si un nombre ya fue rechazado, nuestra guía sobre la ",
          {
            "text": "denominación social rechazada",
            "href": "/guides/denominacion-social-rechazada-canada"
          },
          " explica las vías prácticas para seguir adelante."
        ]
      },
      {
        "type": "paragraph",
        "text": "A nivel federal, puede reducir las idas y vueltas dando contexto al examinador al proponer el nombre. Corporations Canada sugiere describir el tipo de negocio, la zona geográfica en la que prevé operar, su clientela, cómo eligió el elemento distintivo y los nombres o marcas similares que ya tenga. Si el nombre incluye el apellido de una persona, explique la relación de esa persona con la sociedad."
      },
      {
        "type": "heading",
        "id": "si-no-disponible",
        "text": "Qué hacer si su primera opción no está disponible"
      },
      {
        "type": "paragraph",
        "text": "Hay tres alternativas comunes. Puede proponer una variación con un elemento distintivo más marcado; puede agregar un modificador geográfico o descriptivo que cree una separación real; o puede constituirse ahora como sociedad numérica y adoptar un nombre comercial más adelante mediante el registro de un nombre de negocio. La vía numérica es la más rápida cuando la velocidad importa más que la marca."
      },
      {
        "type": "heading",
        "id": "nuans-o-marca",
        "text": "Búsqueda NUANS frente a búsqueda de marcas"
      },
      {
        "type": "paragraph",
        "text": "Una búsqueda NUANS incluye las marcas registradas, pero no es una verificación de disponibilidad de marca y no le otorga ningún derecho sobre una marca. Que se apruebe una denominación social significa que el registro consideró aceptable el nombre como denominación social. No impide que el titular de una marca anterior se oponga al uso que usted haga del nombre en el mercado."
      },
      {
        "type": "paragraph",
        "text": "Si el nombre es central para su marca, consulte la Base de Datos de Marcas Canadienses (Canadian Trademarks Database), que mantiene la CIPO, y considere solicitar el registro del nombre como marca bajo la Ley de Marcas (Trademarks Act). Es un proceso distinto, con su propio examen y sus propios plazos, y es el paso que protege una marca en todo Canadá."
      },
      {
        "type": "callout",
        "text": "Un informe NUANS no otorga una marca registrada. Si su nombre es central para su marca, también debería considerar registrar una marca ante la Oficina de Propiedad Intelectual de Canadá. Ese es un proceso distinto de la constitución en sociedad."
      },
      {
        "type": "heading",
        "id": "paso-a-paso",
        "text": "Cómo obtener un informe NUANS, paso a paso"
      },
      {
        "type": "list",
        "items": [
          "Decida si realmente necesita un nombre. Si la rapidez importa más que la marca, una sociedad numérica no requiere búsqueda.",
          "Elija su jurisdicción. La federal y la de Ontario son las más comunes, y tratan la búsqueda de forma distinta.",
          "Forme el nombre con un elemento distintivo, un elemento descriptivo y un elemento legal, y anote qué palabras forman el elemento distintivo.",
          "Seleccione dos o tres nombres candidatos. Buscar varios nombres a la vez cuesta menos que descubrir los conflictos de rechazo en rechazo.",
          "Encargue la búsqueda. En Ontario, Alberta y Nuevo Brunswick, encargue a un proveedor privado un informe ponderado para esa jurisdicción. A nivel federal, la búsqueda se realiza dentro del Centro de Presentación en Línea al presentar la solicitud, y puede hacer antes una búsqueda preliminar para filtrar candidatos.",
          "Revise el informe en busca de nombres activos idénticos o casi idénticos, sobre todo en el mismo sector o jurisdicción, y de marcas vigentes.",
          "Presente sus estatutos dentro del plazo de 90 días, indicando los datos del informe cuando el registro los pida."
        ]
      },
      {
        "type": "paragraph",
        "text": "Korporex puede encargar informes de búsqueda preliminar NUANS para uno o varios nombres candidatos en un solo pedido y, una vez aprobado el nombre, presentar su constitución federal o de Ontario. Korporex no es un despacho de abogados y no opina sobre si un nombre concreto será concedido.",
        "parts": [
          "Korporex puede ",
          {
            "text": "encargar informes de búsqueda preliminar NUANS",
            "href": "/nuans"
          },
          " para uno o varios nombres candidatos en un solo pedido y, una vez aprobado el nombre, ",
          {
            "text": "presentar su constitución federal o de Ontario",
            "href": "/incorporate"
          },
          ". Korporex no es un despacho de abogados y no opina sobre si un nombre concreto será concedido."
        ]
      },
      {
        "type": "heading",
        "id": "costo",
        "text": "Cuánto cuesta una búsqueda NUANS"
      },
      {
        "type": "paragraph",
        "text": "Conviene distinguir dos tipos de costo. Del lado del gobierno, ISED indica que el costo de una búsqueda de nombre federal es de $13.80, y Corporations Canada indica una tarifa de $200 para la constitución federal en línea; revise el resumen de tarifas en el Centro de Presentación en Línea antes de pagar para ver el total de su solicitud. En Ontario, el gobierno no vende el informe. Proviene de un proveedor privado, que fija su precio, por lo que no figura en el arancel de Ontario. La tarifa gubernamental de Ontario para presentar los estatutos de constitución es de $300."
      },
      {
        "type": "paragraph",
        "text": "Para los despachos que encargan búsquedas con regularidad, el precio de un mismo informe varía mucho según el proveedor y el canal de compra. Nuestra guía sobre el informe NUANS para despachos de abogados explica qué comparar. Las tarifas gubernamentales cambian de vez en cuando; las cifras aquí reflejan fuentes de ISED, Corporations Canada y Ontario a octubre de 2026.",
        "parts": [
          "Para los despachos que encargan búsquedas con regularidad, el precio de un mismo informe varía mucho según el proveedor y el canal de compra. Nuestra guía sobre el ",
          {
            "text": "informe NUANS para despachos de abogados",
            "href": "/guides/informe-nuans-para-despachos-de-abogados"
          },
          " explica qué comparar. Las tarifas gubernamentales cambian de vez en cuando; las cifras aquí reflejan fuentes de ISED, Corporations Canada y Ontario a octubre de 2026."
        ]
      }
    ],
    "faq": [
      {
        "q": "¿Qué significa NUANS?",
        "a": "NUANS es la sigla de Newly Upgraded Automated Name Search. Es el sistema de búsqueda de nombres y marcas del Gobierno de Canadá, gestionado por Innovación, Ciencia y Desarrollo Económico de Canadá. Un informe NUANS compara un nombre de sociedad propuesto con las denominaciones sociales, nombres comerciales y marcas existentes en Canadá, y enumera los más cercanos para que el examinador decida si el nombre puede concederse."
      },
      {
        "q": "¿Necesito un informe NUANS para constituirme a nivel federal?",
        "a": "No como paso separado en una constitución en línea. Corporations Canada integró la búsqueda de nombre NUANS en su Centro de Presentación en Línea, de modo que la búsqueda se realiza como parte de su solicitud cuando propone un nombre. Un informe federal encargado por separado sigue siendo obligatorio para otras operaciones, como reactivaciones y fusiones. Una sociedad federal numérica no necesita búsqueda."
      },
      {
        "q": "¿Cuánto tiempo es válido un informe NUANS?",
        "a": "90 días. Corporations Canada indica que una búsqueda NUANS solo es válida por 90 días, y Ontario no acepta un informe con fecha de más de 90 días antes de la presentación de los estatutos. Si su presentación no se acepta dentro de ese plazo, necesitará un informe nuevo, así que conviene encargar la búsqueda cuando el resto de la constitución esté listo."
      },
      {
        "q": "¿Un informe NUANS significa que mi nombre está aprobado?",
        "a": "No. Un informe es una lista de nombres existentes parecidos, no una aprobación. El examinador del registro decide si concede el nombre y puede rechazarlo por motivos que el informe no aborda, como ser demasiado descriptivo o engañoso. A nivel federal existe una aprobación previa separada de la denominación, válida por 90 días desde la fecha de la solicitud."
      },
      {
        "q": "¿Una búsqueda NUANS es lo mismo que una búsqueda de marcas?",
        "a": "No. NUANS incluye las marcas registradas entre los nombres que compara, pero una denominación social aprobada no le da ningún derecho de marca. Si el nombre es importante para su marca, consulte la Base de Datos de Marcas Canadienses de la Oficina de Propiedad Intelectual de Canadá y considere registrar una marca, que es una solicitud aparte con su propio examen."
      },
      {
        "q": "¿Puedo constituirme sin una búsqueda NUANS?",
        "a": "Sí, constituyendo una sociedad numérica. Ninguna jurisdicción canadiense exige búsqueda de nombre para una sociedad numérica, porque el registro asigna el nombre. Puede operar bajo una marca registrando un nombre comercial y cambiar la denominación más adelante mediante estatutos de modificación, lo que requiere una búsqueda de nombre donde la jurisdicción la exija."
      }
    ]
  }
};
