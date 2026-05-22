"use client";

import { useState } from "react";
import { ExternalLink, AlertTriangle, Check } from "lucide-react";
import { LEGAL_ENDINGS, type LegalEnding } from "@/lib/legalEndings";

export type CorpNameType = "named" | "numbered";

export type CorporationNameValue = {
  corpNameType: CorpNameType;
  businessName: string;
  legalEnding: LegalEnding | "";
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
  };
};

// Official corporate-name search portal per jurisdiction. We link customers
// out to the government registry rather than running a precheck against a
// snapshot — the binding check happens at filing time via NUANS.
const REGISTRY: Record<
  "federal" | "ontario",
  { url: string; buttonLabel: string; intro: string }
> = {
  federal: {
    url: "https://ised-isde.canada.ca/cbr-rec/",
    buttonLabel: "Search the federal corporate registry",
    intro:
      "Federal corporate names must be unique across Canada. Use Corporations Canada's official registry to confirm your distinctive name isn't already in use.",
  },
  ontario: {
    url: "https://www.appmybizaccount.gov.on.ca/onbis/master/viewInstance/view.pub?id=3abd3bce3cc0ad2a3553f516b33034b80328889fedae6186&_timestamp=1083695347310433",
    buttonLabel: "Search the Ontario business registry",
    intro:
      "Ontario corporate names must be unique within the province. Use the Ontario Business Registry to confirm your distinctive name isn't already in use.",
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
  const registry = REGISTRY[jurisdiction === "ontario" ? "ontario" : "federal"];

  // Confirmation field is local: forces the customer to re-type the business
  // name so a typo in the main field is caught before submission. The main
  // field is the canonical source of truth fed back to the parent form.
  const [nameConfirm, setNameConfirm] = useState("");
  const confirmMatches = nameConfirm.length > 0 && nameConfirm === value.businessName;
  const confirmMismatch = nameConfirm.length > 0 && nameConfirm !== value.businessName;

  function setCorpType(t: CorpNameType) {
    onChange({
      corpNameType: t,
      businessName: t === "numbered" ? "" : value.businessName,
      legalEnding: value.legalEnding,
    });
  }

  function setBusinessName(name: string) {
    onChange({
      corpNameType: "named",
      businessName: name,
      legalEnding: value.legalEnding,
    });
  }

  function setLegalEnding(ending: LegalEnding) {
    onChange({
      corpNameType: value.corpNameType,
      businessName: value.businessName,
      legalEnding: ending,
    });
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Named vs Numbered (hidden for Basic) */}
      {!basicLocked && (
        <div>
          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-3">
            Corporation Name Type <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["named", "numbered"] as const).map((t) => {
              const selected = value.corpNameType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCorpType(t)}
                  className={`text-left border-2 rounded-lg p-5 transition-colors ${
                    selected
                      ? "border-navy-900 bg-navy-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-navy-900 mb-1">
                    {t === "named" ? "Named" : "Numbered"}
                  </div>
                  <div className="text-sm text-gray-500 leading-snug">
                    {t === "named"
                      ? "Pick your own corporate name (e.g. Acme Inc.)"
                      : `Government-assigned (e.g. 1234567 ${jurisdictionWord} Inc.)`}
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
          <strong className="text-gray-800">Numbered corporation:</strong> A unique number will be
          assigned by the government and combined with your selected legal ending below
          (e.g. <em>1234567 {jurisdictionWord} INC.</em>). No name search required.
        </div>
      )}

      {/* Named branch: external registry link + inline name input bound live to businessName */}
      {isNamed && (
        <div className="bg-cream-100 border border-gray-200 rounded-xl p-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <h3 className="font-serif text-xl font-semibold text-navy-900">
              Search for your business name
            </h3>
          </div>
          <p className="text-sm text-gray-500 ml-10 mb-4 leading-relaxed">
            {registry.intro} Search the{" "}
            <strong className="text-gray-900">distinctive part</strong> only. For example,
            &quot;Acme&quot;, not &quot;Acme Inc.&quot; Then enter your chosen name below.
          </p>

          <a
            href={registry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors mb-2"
          >
            <ExternalLink className="w-4 h-4" />
            {registry.buttonLabel}
          </a>
          <p className="text-xs text-gray-500 mb-4">
            Opens in a new tab. Free, unlimited searches on the Government of{" "}
            {jurisdictionWord} site.
          </p>

          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 flex items-start gap-2 text-sm text-amber-900 leading-relaxed">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Check the name on the Canada&apos;s Business Registries before submitting.</strong>{" "}
              We do not verify availability for you at this step. If the name is already taken or
              too similar to an existing corporation, it will be rejected when your incorporation
              is filed.
            </div>
          </div>

          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-2">
            Business name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={value.businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder='e.g. "Maple Ridge Consulting"'
            autoComplete="off"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors bg-white mb-4"
          />

          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-2">
            Retype your business name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={nameConfirm}
            onChange={(e) => setNameConfirm(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder="Retype the exact name above"
            autoComplete="off"
            className={`w-full px-4 py-3 border-2 rounded-lg text-sm text-gray-900 focus:outline-none transition-colors bg-white ${
              confirmMismatch
                ? "border-red-300 focus:border-red-500"
                : confirmMatches
                  ? "border-emerald-400 focus:border-emerald-500"
                  : "border-gray-200 focus:border-navy-900"
            }`}
          />
          {confirmMismatch && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Names don&apos;t match. Please retype it exactly as above.
            </p>
          )}
          {confirmMatches && (
            <p className="text-sm text-emerald-700 mt-2 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Names match.
            </p>
          )}

          {errors?.businessName && (
            <p className="text-sm text-red-600 mt-2">{errors.businessName}</p>
          )}
        </div>
      )}

      {/* Legal ending — always visible; required for both named and numbered. */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {isNamed && (
            <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
          )}
          <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900">
            Legal Ending <span className="text-red-600">*</span>
          </label>
        </div>
        <p className={`text-sm text-gray-500 mb-3 leading-relaxed ${isNamed ? "ml-10" : ""}`}>
          Every corporation needs a legal ending. They&apos;re interchangeable. Pick whichever you
          prefer the look of. <strong className="text-gray-900">The ending has no legal consequences.</strong>
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
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-navy-900 text-sm">{ending}</div>
              </button>
            );
          })}
        </div>

        {value.legalEnding && (
          <div className="bg-navy-900 text-white rounded-lg px-5 py-4 text-center mt-4">
            <div className="text-[0.7rem] tracking-[0.15em] uppercase opacity-70 mb-1">
              Your corporation will be
            </div>
            <div className="font-serif text-xl font-semibold">
              {isNamed ? value.businessName : "[Government-assigned number]"} {value.legalEnding}
            </div>
          </div>
        )}

        {errors?.legalEnding && (
          <p className="text-sm text-red-600 mt-2">{errors.legalEnding}</p>
        )}
      </div>

      {isNamed && (
        <p className="text-xs text-gray-500 italic leading-relaxed pt-3 border-t border-gray-200">
          <strong className="not-italic text-gray-700">
            This is not an official NUANS search.
          </strong>{" "}
          The registry lookup above is a preliminary check against publicly available business
          registries only. The official NUANS Name Reservation Report (required to incorporate) is
          included in your Korporex package and is filed automatically after checkout.{" "}
          <strong className="not-italic text-gray-700">
            Your chosen business name is not guaranteed
          </strong>{" "}
          until it passes the official NUANS review and final government approval, and may still be
          rejected if it conflicts with an existing corporation.
        </p>
      )}
    </div>
  );
}
