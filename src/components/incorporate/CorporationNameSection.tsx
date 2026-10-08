"use client";

import { ExternalLink, AlertTriangle, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LEGAL_ENDINGS, type LegalEnding } from "@/lib/legalEndings";

export type CorpNameType = "named" | "numbered";

export type CorporationNameValue = {
  corpNameType: CorpNameType;
  businessName: string;
  legalEnding: LegalEnding | "";
  // Customer must re-type the business name to confirm spelling. Lifted to the
  // parent form so the Zod schema can enforce the match and block submit.
  nameConfirmation: string;
};

type Props = {
  value: CorporationNameValue;
  onChange: (next: CorporationNameValue) => void;
  /** When true, hides the Named/Numbered picker and forces "numbered" (Basic package). */
  basicLocked?: boolean;
  /** Jurisdiction controls which official corporate registry the customer is sent to. */
  jurisdiction?: "federal" | "ontario" | "bc";
  errors?: {
    corpNameType?: string;
    businessName?: string;
    legalEnding?: string;
    nameConfirmation?: string;
  };
};

// Both jurisdictions link to Canada's Business Registries, a federated public
// search across federal Corporations Canada and participating provincial
// registries. The binding check happens at filing time via NUANS.
const REGISTRY_URL = "https://ised-isde.canada.ca/cbr-rec/";

type Lang = "en" | "fr" | "es";

const COPY = {
  en: {
    nameType: "Corporation Name Type",
    named: "Named",
    numbered: "Numbered",
    namedHint: "Pick your own corporate name (e.g. Acme Inc.)",
    numberedHint: (j: string) => `Government-assigned (e.g. 1234567 ${j} Inc.)`,
    numberedStrong: "Numbered corporation:",
    numberedPre:
      " A unique number will be assigned by the government and combined with your selected legal ending below (e.g. ",
    numberedPost: "). No name search required.",
    searchH3: "Search for your business name",
    registryIntro:
      "Corporate names must be unique within their jurisdiction. Use Canada's Business Registries to confirm your distinctive name isn't already in use.",
    searchThe: " Search the ",
    distinctive: "distinctive part",
    searchPost: ' only. For example, "Acme", not "Acme Inc." Then enter your chosen name below.',
    registryButton: "Search Canada's Business Registries",
    newTab: "Opens in a new tab. Free, unlimited searches on the Government of Canada site.",
    checkStrong: "Check the name on Canada's Business Registries before submitting.",
    checkBody:
      " We do not verify availability for you at this step. If the name is already taken or too similar to an existing corporation, it will be rejected when your incorporation is filed.",
    nuansStrong: "This is not an official NUANS search.",
    nuansPre:
      " The registry lookup above is a preliminary check against publicly available business registries only. Your Korporex package includes ",
    nuansOne: "one (1)",
    nuansPost:
      " official NUANS Name Reservation Report (required for a named Ontario corporation), for the single name you submit here. It is ordered automatically after checkout.",
    notGuaranteedStrong: "Your business name is not guaranteed.",
    notGuaranteedBody:
      " Final approval rests with the government. The name may still be rejected if it conflicts with an existing corporation or fails the official NUANS review. Because the included search is already used at that point, any further name you want to search is a separate order at ",
    businessName: "Business name",
    businessNamePlaceholder: 'e.g. "Maple Ridge Consulting"',
    retype: "Retype your business name",
    retypePlaceholder: "Retype the exact name above",
    mismatch: "Names don't match. Please retype it exactly as above.",
    match: "Names match.",
    legalEnding: "Legal Ending",
    endingIntro:
      "Every corporation needs a legal ending. They're interchangeable. Pick whichever you prefer the look of. ",
    endingStrong: "The ending has no legal consequences.",
    willBe: "Your corporation will be",
    govNumber: "[Government-assigned number]",
  },
  fr: {
    nameType: "Type de dénomination",
    named: "Nommée",
    numbered: "À numéro",
    namedHint: "Choisissez votre propre dénomination sociale (p. ex. Acme Inc.)",
    numberedHint: (j: string) => `Attribuée par le gouvernement (p. ex. 1234567 ${j} Inc.)`,
    numberedStrong: "Société à numéro :",
    numberedPre:
      " un numéro unique sera attribué par le gouvernement et combiné à l'élément juridique choisi ci-dessous (p. ex. ",
    numberedPost: "). Aucune recherche de nom n'est requise.",
    searchH3: "Recherchez votre dénomination",
    registryIntro:
      "Les dénominations sociales doivent être uniques dans leur ressort. Utilisez les Registres d'entreprises canadiens pour confirmer que votre nom distinctif n'est pas déjà utilisé.",
    searchThe: " Recherchez seulement la ",
    distinctive: "partie distinctive",
    searchPost: ". Par exemple « Acme » et non « Acme Inc. ». Inscrivez ensuite le nom choisi ci-dessous.",
    registryButton: "Rechercher dans les Registres d'entreprises canadiens",
    newTab: "S'ouvre dans un nouvel onglet. Recherches gratuites et illimitées sur le site du gouvernement du Canada.",
    checkStrong: "Vérifiez le nom dans les Registres d'entreprises canadiens avant de soumettre.",
    checkBody:
      " Nous ne vérifions pas la disponibilité à cette étape. Si le nom est déjà pris ou trop semblable à celui d'une société existante, il sera refusé lors du dépôt de votre constitution.",
    nuansStrong: "Il ne s'agit pas d'une recherche NUANS officielle.",
    nuansPre:
      " La recherche ci-dessus n'est qu'une vérification préliminaire dans les registres d'entreprises publics. Votre forfait Korporex comprend ",
    nuansOne: "un (1)",
    nuansPost:
      " rapport de réservation de nom NUANS officiel (requis pour une société ontarienne nommée), pour le seul nom que vous soumettez ici. Il est commandé automatiquement après le paiement.",
    notGuaranteedStrong: "Votre dénomination n'est pas garantie.",
    notGuaranteedBody:
      " L'approbation finale appartient au gouvernement. Le nom peut encore être refusé s'il entre en conflit avec une société existante ou échoue à l'examen NUANS officiel. Comme la recherche incluse est alors déjà utilisée, toute autre recherche de nom fait l'objet d'une commande distincte sur ",
    businessName: "Dénomination sociale",
    businessNamePlaceholder: "p. ex. « Conseils Maple Ridge »",
    retype: "Retapez votre dénomination",
    retypePlaceholder: "Retapez exactement le nom ci-dessus",
    mismatch: "Les noms ne correspondent pas. Retapez-le exactement comme ci-dessus.",
    match: "Les noms correspondent.",
    legalEnding: "Élément juridique",
    endingIntro:
      "Toute société doit avoir un élément juridique dans sa dénomination. Ils sont interchangeables; choisissez celui que vous préférez. ",
    endingStrong: "L'élément choisi n'a aucune conséquence juridique.",
    willBe: "Votre société s'appellera",
    govNumber: "[Numéro attribué par le gouvernement]",
  },
  es: {
    nameType: "Tipo de nombre de la sociedad",
    named: "Con nombre",
    numbered: "Numerada",
    namedHint: "Elija su propio nombre (p. ej., Acme Inc.)",
    numberedHint: (j: string) => `Asignado por el gobierno (p. ej., 1234567 ${j} Inc.)`,
    numberedStrong: "Sociedad numerada:",
    numberedPre:
      " el gobierno asignará un número único que se combinará con la terminación legal que elija abajo (p. ej., ",
    numberedPost: "). No se requiere búsqueda de nombre.",
    searchH3: "Busque el nombre de su empresa",
    registryIntro:
      "Los nombres de sociedades deben ser únicos en su jurisdicción. Use los Registros de Empresas de Canadá (Canada's Business Registries) para confirmar que su nombre distintivo no está ya en uso.",
    searchThe: " Busque solo la ",
    distinctive: "parte distintiva",
    searchPost: '. Por ejemplo, "Acme", no "Acme Inc.". Luego escriba el nombre elegido abajo.',
    registryButton: "Buscar en los Registros de Empresas de Canadá",
    newTab: "Se abre en una pestaña nueva. Búsquedas gratuitas e ilimitadas en el sitio del Gobierno de Canadá.",
    checkStrong: "Verifique el nombre en los Registros de Empresas de Canadá antes de enviar.",
    checkBody:
      " No verificamos la disponibilidad en este paso. Si el nombre ya está en uso o es demasiado parecido al de una sociedad existente, será rechazado al presentar su constitución.",
    nuansStrong: "Esta no es una búsqueda NUANS oficial.",
    nuansPre:
      " La consulta anterior es solo una verificación preliminar en registros de empresas públicos. Su paquete Korporex incluye ",
    nuansOne: "un (1)",
    nuansPost:
      " informe oficial de reserva de nombre NUANS (requerido para una sociedad de Ontario con nombre), para el único nombre que envíe aquí. Se solicita automáticamente después del pago.",
    notGuaranteedStrong: "El nombre de su empresa no está garantizado.",
    notGuaranteedBody:
      " La aprobación final corresponde al gobierno. El nombre aún puede ser rechazado si entra en conflicto con una sociedad existente o no supera la revisión NUANS oficial. Como la búsqueda incluida ya se habrá usado, cualquier otro nombre que quiera buscar es un pedido aparte en ",
    businessName: "Nombre de la empresa",
    businessNamePlaceholder: 'p. ej., "Maple Ridge Consulting"',
    retype: "Vuelva a escribir el nombre",
    retypePlaceholder: "Vuelva a escribir exactamente el nombre anterior",
    mismatch: "Los nombres no coinciden. Vuelva a escribirlo exactamente como arriba.",
    match: "Los nombres coinciden.",
    legalEnding: "Terminación legal",
    endingIntro: "Toda sociedad necesita una terminación legal. Son intercambiables; elija la que prefiera. ",
    endingStrong: "La terminación no tiene consecuencias legales.",
    willBe: "Su sociedad se llamará",
    govNumber: "[Número asignado por el gobierno]",
  },
};

export default function CorporationNameSection({
  value,
  onChange,
  basicLocked = false,
  jurisdiction,
  errors,
}: Props) {
  const isNamed = value.corpNameType === "named";
  const jurisdictionWord = jurisdiction === "ontario" ? "Ontario" : "Canada";
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];

  // Match feedback compares the canonical business name to the confirmation
  // field (now lifted to the parent form so Zod can block submit on mismatch).
  const confirmMatches =
    value.nameConfirmation.length > 0 && value.nameConfirmation === value.businessName;
  const confirmMismatch =
    value.nameConfirmation.length > 0 && value.nameConfirmation !== value.businessName;

  function setCorpType(type: CorpNameType) {
    onChange({
      corpNameType: type,
      businessName: type === "numbered" ? "" : value.businessName,
      legalEnding: value.legalEnding,
      nameConfirmation: type === "numbered" ? "" : value.nameConfirmation,
    });
  }

  function setBusinessName(name: string) {
    onChange({
      corpNameType: "named",
      businessName: name,
      legalEnding: value.legalEnding,
      nameConfirmation: value.nameConfirmation,
    });
  }

  function setNameConfirmation(name: string) {
    onChange({
      corpNameType: value.corpNameType,
      businessName: value.businessName,
      legalEnding: value.legalEnding,
      nameConfirmation: name,
    });
  }

  function setLegalEnding(ending: LegalEnding) {
    onChange({
      corpNameType: value.corpNameType,
      businessName: value.businessName,
      legalEnding: ending,
      nameConfirmation: value.nameConfirmation,
    });
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Named vs Numbered (hidden for Basic) */}
      {!basicLocked && (
        <div>
          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-3">
            {t.nameType} <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["named", "numbered"] as const).map((type) => {
              const selected = value.corpNameType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCorpType(type)}
                  className={`text-left border-2 rounded-lg p-5 transition-colors ${
                    selected
                      ? "border-navy-900 bg-navy-50"
                      : "border-gold-200 hover:border-navy-900"
                  }`}
                >
                  <div className="font-semibold text-navy-900 mb-1">
                    {type === "named" ? t.named : t.numbered}
                  </div>
                  <div className="text-sm text-gray-500 leading-snug">
                    {type === "named" ? t.namedHint : t.numberedHint(jurisdictionWord)}
                  </div>
                </button>
              );
            })}
          </div>
          {errors?.corpNameType && (
            <p className="text-sm text-red-600 mt-2">{errors.corpNameType}</p>
          )}
        </div>
      )}

      {/* Numbered branch: short notice, then jump straight to legal ending */}
      {!isNamed && (
        <div className="bg-cream-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
          <strong className="text-gray-800">{t.numberedStrong}</strong>
          {t.numberedPre}
          <em>1234567 {jurisdictionWord} INC.</em>
          {t.numberedPost}
        </div>
      )}

      {/* Named branch: external registry link + inline name input bound live to businessName */}
      {isNamed && (
        <div className="bg-cream-100 border border-gray-200 rounded-xl p-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <h3 className="font-serif text-xl font-semibold text-navy-900">{t.searchH3}</h3>
          </div>
          <p className="text-sm text-gray-500 ml-10 mb-4 leading-relaxed">
            {t.registryIntro}
            {t.searchThe}
            <strong className="text-gray-900">{t.distinctive}</strong>
            {t.searchPost}
          </p>

          <a
            href={REGISTRY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors mb-2"
          >
            <ExternalLink className="w-4 h-4" />
            {t.registryButton}
          </a>
          <p className="text-xs text-gray-500 mb-4">{t.newTab}</p>

          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4 flex items-start gap-2 text-sm text-amber-900 leading-relaxed">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p>
                <strong>{t.checkStrong}</strong>
                {t.checkBody}
              </p>
              <p>
                <strong>{t.nuansStrong}</strong>
                {t.nuansPre}
                <strong>{t.nuansOne}</strong>
                {t.nuansPost}
              </p>
              <p>
                <strong>{t.notGuaranteedStrong}</strong>
                {t.notGuaranteedBody}
                <Link href="/nuans" className="underline underline-offset-2">korporex.ca/nuans</Link>.
              </p>
            </div>
          </div>

          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-2">
            {t.businessName} <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={value.businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t.businessNamePlaceholder}
            autoComplete="off"
            className="w-full px-4 py-3 border-2 border-gold-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors bg-white mb-4"
          />

          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-2">
            {t.retype} <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={value.nameConfirmation}
            onChange={(e) => setNameConfirmation(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={t.retypePlaceholder}
            autoComplete="off"
            className={`w-full px-4 py-3 border-2 rounded-lg text-sm text-gray-900 focus:outline-none transition-colors bg-white ${
              confirmMismatch
                ? "border-red-300 focus:border-red-500"
                : confirmMatches
                  ? "border-emerald-400 focus:border-emerald-500"
                  : "border-gold-200 focus:border-navy-900"
            }`}
          />
          {confirmMismatch && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              {t.mismatch}
            </p>
          )}
          {confirmMatches && (
            <p className="text-sm text-emerald-700 mt-2 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              {t.match}
            </p>
          )}

          {errors?.businessName && (
            <p className="text-sm text-red-600 mt-2">{errors.businessName}</p>
          )}
          {errors?.nameConfirmation && !confirmMismatch && (
            <p className="text-sm text-red-600 mt-2">{errors.nameConfirmation}</p>
          )}
        </div>
      )}

      {/* Legal ending: always visible; required for both named and numbered. */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {isNamed && (
            <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
          )}
          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900">
            {t.legalEnding} <span className="text-red-600">*</span>
          </label>
        </div>
        <p className={`text-sm text-gray-500 mb-3 leading-relaxed ${isNamed ? "ml-10" : ""}`}>
          {t.endingIntro}
          <strong className="text-gray-900">{t.endingStrong}</strong>
        </p>

        <div className="grid grid-cols-3 gap-2">
          {LEGAL_ENDINGS.map((ending) => {
            const selected = value.legalEnding === ending;
            return (
              <button
                key={ending}
                type="button"
                onClick={() => setLegalEnding(ending)}
                className={`bg-white border-2 rounded-lg px-2 py-3 text-center transition-colors ${
                  selected
                    ? "border-navy-900 bg-navy-50"
                    : "border-gold-200 hover:border-navy-900"
                }`}
              >
                <div className="font-bold text-navy-900 text-sm">{ending}</div>
              </button>
            );
          })}
        </div>

        {value.legalEnding && (
          <div className="bg-navy-900 text-white rounded-lg px-5 py-4 text-center mt-4">
            <div className="text-[0.7rem] tracking-[0.15em] uppercase opacity-70 mb-1">{t.willBe}</div>
            <div className="font-serif text-xl font-semibold">
              {isNamed ? value.businessName : t.govNumber} {value.legalEnding}
            </div>
          </div>
        )}

        {errors?.legalEnding && (
          <p className="text-sm text-red-600 mt-2">{errors.legalEnding}</p>
        )}
      </div>
    </div>
  );
}
