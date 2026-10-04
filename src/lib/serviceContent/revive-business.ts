import type { ServiceContentByLocale } from "./types";

// Server-rendered copy under the revival order form. The form is a client
// wizard with almost no crawlable text, so this block carries the page's
// service intent ("revive my dissolved corporation, file it for me").
// Verified 2026-10-04 against CBCA s. 209, OBCA s. 241, Corporations Canada's
// Form 15 instructions and fee schedule, and ontario.ca's fee schedule. Mirrors
// revivalSchema: Korporex does not file Ontario revivals of voluntary or
// court-ordered dissolutions, because OBCA s. 241(9) only covers corporations
// dissolved by the Director under s. 241(4).
export const content: ServiceContentByLocale = {
  en: {
    title: "Revive a dissolved corporation online",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepares and files Articles of Revival to bring a dissolved federal (CBCA) or Ontario (OBCA) corporation back into existence. You tell us which corporation was dissolved, when and why, your relationship to it, and who its directors, officers and registered office will be after revival. We prepare the articles and supporting documents and file them with Corporations Canada or the Ontario Business Registry. Many revivals follow a dissolution for missed ",
          { text: "corporate annual returns", href: "/guides/corporate-annual-returns-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Who this service is for" },
      {
        type: "list",
        items: [
          "Federal corporations dissolved by Corporations Canada, for example for unfiled annual returns, or dissolved voluntarily.",
          "Ontario corporations dissolved by the Director, for example for unfiled annual returns or another default.",
          "Former directors, officers and shareholders, creditors and other interested persons who need the corporation restored, for example to resume operations, deal with property still in its name or settle a claim.",
        ],
      },
      { type: "h3", text: "Federal and Ontario rules are different" },
      {
        type: "p",
        parts: [
          "Under section 209 of the CBCA, any interested person may apply to revive a dissolved federal corporation, whether it was dissolved voluntarily or by Corporations Canada. Interested persons include shareholders, directors, officers, employees, creditors and persons with a contract with the corporation. Under subsection 241(9) of the OBCA, revival is available only for a corporation dissolved by the Director under subsection 241(4), and the application cannot be made more than 20 years after the dissolution. An Ontario corporation dissolved voluntarily, by filing ",
          { text: "Articles of Dissolution", href: "/services/dissolve-business" },
          ", or by court order cannot be revived by filing Articles of Revival, so Korporex does not accept those Ontario requests.",
        ],
      },
      { type: "h3", text: "What we file and what you provide" },
      {
        type: "p",
        parts: [
          "Federally, we prepare Form 15 (Articles of Revival) with the cover letter and supporting documents Corporations Canada requires, including the reason the corporation needs to be revived. In Ontario, we prepare the Articles of Revival for the Ontario Business Registry. You provide the corporation's name, number and business number, the dissolution date and reason, your relationship to the corporation, the reason for revival, the registered office, directors and officers after revival, and the effective date you want, and you confirm that outstanding annual returns and other required filings have been or will be brought up to date.",
        ],
      },
      { type: "h3", text: "Key requirements" },
      {
        type: "list",
        items: [
          "Federally, a NUANS report dated within 90 days is required unless the corporation was dissolved less than two years ago or has a numbered name, and outstanding annual returns for the two most recent years are filed on revival.",
          "In Ontario, outstanding Corporations Information Act returns are filed immediately on revival, and filings and defaults under Ontario tax statutes are remedied.",
          "In Ontario, property forfeited to the Crown on dissolution can stay with the Crown if the corporation is revived three or more years after it was dissolved.",
          "Government filing fees: $250 for a federal revival (non-refundable if the application is refused) and $330 in Ontario.",
        ],
      },
      {
        type: "p",
        parts: [
          "Once the corporation is revived, staying in good standing means filing its annual return each year. Korporex files the ",
          { text: "Ontario annual return", href: "/services/annual-return-on" },
          " and the ",
          { text: "federal annual return", href: "/services/annual-return-federal" },
          ".",
        ],
      },
    ],
    faqTitle: "Reviving a corporation: common questions",
    disclaimer: "Korporex is not a law firm and does not provide legal advice. This page is general information about the revival filing; for advice on your specific situation, including whether revival is available, consult a lawyer or accountant.",
    faq: [
      {
        q: "What does revival do?",
        a: "A revived corporation is restored as if it had not been dissolved. Under the CBCA, it regains its previous position in law and remains liable for its obligations, subject to reasonable terms imposed by Corporations Canada and to rights acquired by any person after the dissolution. Under the OBCA, it is deemed never to have been dissolved, subject to the Director's terms, rights acquired during the dissolution and the forfeited property rules.",
      },
      {
        q: "Can an Ontario corporation that I dissolved voluntarily be revived?",
        a: "Not by filing Articles of Revival. Subsection 241(9) of the OBCA allows revival only of a corporation dissolved by the Director under subsection 241(4), for example for unfiled annual returns or another default. Korporex does not file Ontario revivals of voluntary or court-ordered dissolutions. A federal corporation, by contrast, can be revived under the CBCA however it was dissolved.",
      },
      {
        q: "Who can apply to revive a corporation?",
        a: "Federally, any interested person, which includes a shareholder, director, officer, employee or creditor of the dissolved corporation, a person with a contract with it, and its trustee in bankruptcy or liquidator. In Ontario, any interested person may apply, which expressly includes a director, officer or shareholder. The order form asks for your relationship to the corporation.",
      },
      {
        q: "Is a NUANS report required to revive a federal corporation?",
        a: "Usually. Corporations Canada requires a NUANS report dated no more than 90 days before it receives the Articles of Revival, unless the corporation was dissolved less than two years earlier or has a numbered name. Korporex can order the report for you.",
      },
      {
        q: "What happens to annual returns that were missed?",
        a: "They have to be dealt with as part of the revival. Federally, outstanding annual returns for the two most recent years are filed on revival. In Ontario, outstanding Corporations Information Act returns are filed immediately on revival. The order form asks you to confirm that these filings have been or will be brought up to date.",
      },
    ],
  },
  fr: {
    title: "Reconstituez une société dissoute en ligne",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prépare et dépose les statuts de reconstitution pour faire revivre une société fédérale (LCSA) ou ontarienne (LSAO) dissoute. Vous nous indiquez quelle société a été dissoute, quand et pourquoi, votre lien avec elle, et qui seront ses administrateurs, ses dirigeants et son siège social après la reconstitution. Nous préparons les statuts et les documents à l'appui et les déposons auprès de Corporations Canada ou du Registre des entreprises de l'Ontario. Bien des reconstitutions font suite à une dissolution pour des ",
          { text: "déclarations annuelles", href: "/guides/declarations-annuelles-societes-canada" },
          " non déposées.",
        ],
      },
      { type: "h3", text: "À qui s'adresse ce service" },
      {
        type: "list",
        items: [
          "Les sociétés fédérales dissoutes par Corporations Canada, par exemple pour des rapports annuels non déposés, ou dissoutes volontairement.",
          "Les sociétés ontariennes dissoutes par le directeur, par exemple pour des rapports annuels non déposés ou un autre défaut.",
          "Les anciens administrateurs, dirigeants et actionnaires, les créanciers et les autres intéressés qui ont besoin que la société soit rétablie, par exemple pour reprendre ses activités, régler la situation de biens encore à son nom ou régler une réclamation.",
        ],
      },
      { type: "h3", text: "Les règles fédérales et ontariennes diffèrent" },
      {
        type: "p",
        parts: [
          "En vertu de l'article 209 de la LCSA, tout intéressé peut demander la reconstitution d'une société fédérale dissoute, qu'elle ait été dissoute volontairement ou par Corporations Canada. Les intéressés comprennent les actionnaires, administrateurs, dirigeants, employés et créanciers ainsi que les personnes ayant un contrat avec la société. En vertu du paragraphe 241(9) de la LSAO, la reconstitution n'est possible que pour une société dissoute par le directeur en vertu du paragraphe 241(4), et la demande ne peut être présentée plus de 20 ans après la dissolution. Une société ontarienne dissoute volontairement, par le dépôt de ",
          { text: "statuts de dissolution", href: "/services/dissolve-business" },
          ", ou par ordonnance judiciaire ne peut être reconstituée par le dépôt de statuts de reconstitution; Korporex n'accepte donc pas ces demandes ontariennes.",
        ],
      },
      { type: "h3", text: "Ce que nous déposons et ce que vous fournissez" },
      {
        type: "p",
        parts: [
          "Au fédéral, nous préparons le formulaire 15 (statuts de reconstitution) avec la lettre d'accompagnement et les documents à l'appui qu'exige Corporations Canada, y compris le motif pour lequel la société doit être reconstituée. En Ontario, nous préparons les statuts de reconstitution pour le Registre des entreprises de l'Ontario. Vous fournissez la dénomination, le numéro de société et le numéro d'entreprise, la date et le motif de la dissolution, votre lien avec la société, le motif de la reconstitution, le siège social, les administrateurs et les dirigeants après la reconstitution et la date d'effet souhaitée, et vous confirmez que les rapports annuels et autres dépôts en retard ont été ou seront mis à jour.",
        ],
      },
      { type: "h3", text: "Exigences principales" },
      {
        type: "list",
        items: [
          "Au fédéral, un rapport NUANS datant d'au plus 90 jours est exigé, sauf si la société a été dissoute il y a moins de deux ans ou porte un matricule, et les rapports annuels en retard des deux dernières années sont déposés lors de la reconstitution.",
          "En Ontario, les rapports en retard exigés par la Loi sur les renseignements exigés des personnes morales sont déposés dès la reconstitution, et les dépôts et défauts prévus par les lois fiscales de l'Ontario sont régularisés.",
          "En Ontario, les biens confisqués au profit de la Couronne lors de la dissolution peuvent lui rester acquis si la société est reconstituée trois ans ou plus après sa dissolution.",
          "Droits gouvernementaux : 250 $ pour une reconstitution fédérale (non remboursables si la demande est refusée) et 330 $ en Ontario.",
        ],
      },
      {
        type: "p",
        parts: [
          "Une fois la société reconstituée, le maintien de sa bonne réputation passe par le dépôt de son rapport annuel chaque année. Korporex dépose le ",
          { text: "rapport annuel de l'Ontario", href: "/services/annual-return-on" },
          " et le ",
          { text: "rapport annuel fédéral", href: "/services/annual-return-federal" },
          ".",
        ],
      },
    ],
    faqTitle: "Reconstituer une société : questions fréquentes",
    disclaimer: "Korporex n'est pas un cabinet d'avocats et ne fournit pas de conseils juridiques. Cette page présente de l'information générale sur le dépôt de reconstitution; pour des conseils adaptés à votre situation, y compris sur l'admissibilité à la reconstitution, consultez un avocat ou un comptable.",
    faq: [
      {
        q: "Quel est l'effet d'une reconstitution?",
        a: "Une société reconstituée est rétablie comme si elle n'avait pas été dissoute. Sous la LCSA, elle recouvre sa situation juridique antérieure et demeure responsable de ses obligations, sous réserve des conditions raisonnables imposées par Corporations Canada et des droits acquis par toute personne après la dissolution. Sous la LSAO, elle est réputée n'avoir jamais été dissoute, sous réserve des conditions du directeur, des droits acquis pendant la dissolution et des règles sur les biens confisqués.",
      },
      {
        q: "Une société ontarienne que j'ai dissoute volontairement peut-elle être reconstituée?",
        a: "Pas par le dépôt de statuts de reconstitution. Le paragraphe 241(9) de la LSAO ne permet la reconstitution que d'une société dissoute par le directeur en vertu du paragraphe 241(4), par exemple pour des rapports annuels non déposés ou un autre défaut. Korporex ne dépose pas de reconstitution ontarienne après une dissolution volontaire ou judiciaire. Une société fédérale, elle, peut être reconstituée sous la LCSA quel que soit le mode de dissolution.",
      },
      {
        q: "Qui peut demander la reconstitution d'une société?",
        a: "Au fédéral, tout intéressé, ce qui comprend un actionnaire, un administrateur, un dirigeant, un employé ou un créancier de la société dissoute, une personne ayant un contrat avec elle, ainsi que son syndic de faillite ou son liquidateur. En Ontario, tout intéressé peut présenter la demande, ce qui comprend expressément un administrateur, un dirigeant ou un actionnaire. Le formulaire de commande vous demande votre lien avec la société.",
      },
      {
        q: "Un rapport NUANS est-il exigé pour reconstituer une société fédérale?",
        a: "En général, oui. Corporations Canada exige un rapport NUANS datant d'au plus 90 jours avant la réception des statuts de reconstitution, sauf si la société a été dissoute moins de deux ans auparavant ou porte un matricule. Korporex peut commander le rapport pour vous.",
      },
      {
        q: "Qu'arrive-t-il aux rapports annuels non déposés?",
        a: "Ils doivent être réglés dans le cadre de la reconstitution. Au fédéral, les rapports annuels en retard des deux dernières années sont déposés lors de la reconstitution. En Ontario, les rapports en retard exigés par la Loi sur les renseignements exigés des personnes morales sont déposés dès la reconstitution. Le formulaire de commande vous demande de confirmer que ces dépôts ont été ou seront mis à jour.",
      },
    ],
  },
  es: {
    title: "Reactive una sociedad disuelta en línea",
    blocks: [
      {
        type: "p",
        parts: [
          "Korporex prepara y presenta los artículos de reactivación para devolver a la existencia una sociedad federal (CBCA) o de Ontario (OBCA) disuelta. Usted nos indica qué sociedad se disolvió, cuándo y por qué, su relación con ella, y quiénes serán sus directores, funcionarios y domicilio social después de la reactivación. Preparamos los artículos y los documentos de respaldo y los presentamos ante Corporations Canada o el Registro de Empresas de Ontario. Muchas reactivaciones se deben a una disolución por no presentar las ",
          { text: "declaraciones anuales", href: "/guides/declaraciones-anuales-sociedades-canada" },
          ".",
        ],
      },
      { type: "h3", text: "Para quién es este servicio" },
      {
        type: "list",
        items: [
          "Sociedades federales disueltas por Corporations Canada, por ejemplo por no presentar las declaraciones anuales, o disueltas voluntariamente.",
          "Sociedades de Ontario disueltas por el Director, por ejemplo por no presentar las declaraciones anuales u otro incumplimiento.",
          "Antiguos directores, funcionarios y accionistas, acreedores y otros interesados que necesitan restablecer la sociedad, por ejemplo para reanudar operaciones, gestionar bienes que siguen a su nombre o resolver un reclamo.",
        ],
      },
      { type: "h3", text: "Las reglas federales y de Ontario son distintas" },
      {
        type: "p",
        parts: [
          "Según el artículo 209 de la CBCA, cualquier interesado puede solicitar la reactivación de una sociedad federal disuelta, ya sea que se haya disuelto voluntariamente o por decisión de Corporations Canada. Los interesados incluyen accionistas, directores, funcionarios, empleados, acreedores y personas que tienen un contrato con la sociedad. Según el apartado 241(9) de la OBCA, la reactivación solo está disponible para una sociedad disuelta por el Director en virtud del apartado 241(4), y la solicitud no puede presentarse más de 20 años después de la disolución. Una sociedad de Ontario disuelta voluntariamente, mediante ",
          { text: "artículos de disolución", href: "/services/dissolve-business" },
          ", o por orden judicial no puede reactivarse presentando artículos de reactivación, por lo que Korporex no acepta esas solicitudes de Ontario.",
        ],
      },
      { type: "h3", text: "Qué presentamos y qué proporciona usted" },
      {
        type: "p",
        parts: [
          "En el ámbito federal, preparamos el formulario 15 (artículos de reactivación) con la carta de presentación y los documentos de respaldo que exige Corporations Canada, incluido el motivo por el que la sociedad necesita reactivarse. En Ontario, preparamos los artículos de reactivación para el Registro de Empresas de Ontario. Usted proporciona la denominación, el número de sociedad y el número de negocio, la fecha y el motivo de la disolución, su relación con la sociedad, el motivo de la reactivación, el domicilio social, los directores y los funcionarios después de la reactivación y la fecha de entrada en vigor que desea, y confirma que las declaraciones anuales y demás presentaciones pendientes se pusieron o se pondrán al día.",
        ],
      },
      { type: "h3", text: "Requisitos principales" },
      {
        type: "list",
        items: [
          "En el ámbito federal se exige un informe NUANS con no más de 90 días, salvo que la sociedad se haya disuelto hace menos de dos años o tenga una denominación numerada, y las declaraciones anuales pendientes de los dos años más recientes se presentan al reactivarse.",
          "En Ontario, las declaraciones pendientes de la Ley de Información de Sociedades (Corporations Information Act) se presentan de inmediato al reactivarse, y se subsanan las presentaciones e incumplimientos previstos en las leyes tributarias de Ontario.",
          "En Ontario, los bienes que pasaron a la Corona con la disolución pueden quedarse con la Corona si la sociedad se reactiva tres años o más después de disolverse.",
          "Tasas gubernamentales: 250 $ por una reactivación federal (no reembolsables si se rechaza la solicitud) y 330 $ en Ontario.",
        ],
      },
      {
        type: "p",
        parts: [
          "Una vez reactivada, mantener la sociedad al día implica presentar su declaración anual cada año. Korporex presenta la ",
          { text: "declaración anual de Ontario", href: "/services/annual-return-on" },
          " y la ",
          { text: "declaración anual federal", href: "/services/annual-return-federal" },
          ".",
        ],
      },
    ],
    faqTitle: "Reactivar una sociedad: preguntas frecuentes",
    disclaimer: "Korporex no es un bufete de abogados y no brinda asesoría legal. Esta página ofrece información general sobre la presentación de reactivación; para asesoría sobre su situación particular, incluido si la reactivación es posible, consulte a un abogado o contador.",
    faq: [
      {
        q: "¿Qué efecto tiene la reactivación?",
        a: "Una sociedad reactivada se restablece como si no se hubiera disuelto. Según la CBCA, recupera su situación jurídica anterior y sigue siendo responsable de sus obligaciones, sujeto a las condiciones razonables que imponga Corporations Canada y a los derechos que cualquier persona haya adquirido después de la disolución. Según la OBCA, se considera que nunca se disolvió, sujeto a las condiciones del Director, a los derechos adquiridos durante la disolución y a las reglas sobre bienes confiscados.",
      },
      {
        q: "¿Puede reactivarse una sociedad de Ontario que disolví voluntariamente?",
        a: "No mediante artículos de reactivación. El apartado 241(9) de la OBCA solo permite reactivar una sociedad disuelta por el Director en virtud del apartado 241(4), por ejemplo por no presentar las declaraciones anuales u otro incumplimiento. Korporex no presenta reactivaciones de Ontario tras una disolución voluntaria o judicial. En cambio, una sociedad federal puede reactivarse según la CBCA sin importar cómo se disolvió.",
      },
      {
        q: "¿Quién puede solicitar la reactivación de una sociedad?",
        a: "En el ámbito federal, cualquier interesado, lo que incluye a un accionista, director, funcionario, empleado o acreedor de la sociedad disuelta, a una persona que tenga un contrato con ella y a su síndico de quiebra o liquidador. En Ontario, cualquier interesado puede presentar la solicitud, lo que incluye expresamente a un director, funcionario o accionista. El formulario de pedido le pregunta su relación con la sociedad.",
      },
      {
        q: "¿Se necesita un informe NUANS para reactivar una sociedad federal?",
        a: "Por lo general, sí. Corporations Canada exige un informe NUANS con fecha de no más de 90 días antes de recibir los artículos de reactivación, salvo que la sociedad se haya disuelto hace menos de dos años o tenga una denominación numerada. Korporex puede pedir el informe por usted.",
      },
      {
        q: "¿Qué pasa con las declaraciones anuales no presentadas?",
        a: "Deben resolverse como parte de la reactivación. En el ámbito federal, las declaraciones anuales pendientes de los dos años más recientes se presentan al reactivarse. En Ontario, las declaraciones pendientes de la Corporations Information Act se presentan de inmediato al reactivarse. El formulario de pedido le pide confirmar que esas presentaciones se pusieron o se pondrán al día.",
      },
    ],
  },
};
