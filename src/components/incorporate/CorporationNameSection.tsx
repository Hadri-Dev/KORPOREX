"use client";

import { useState } from "react";
import { Check, AlertTriangle, X, Loader2, ExternalLink } from "lucide-react";
import { LEGAL_ENDINGS, type LegalEnding } from "@/lib/legalEndings";

export type CorpNameType = "named" | "numbered";

export type PrecheckMatch = {
  name: string;
  jurisdiction: string;
  status: string;
};

export type PrecheckStatus = "available" | "similar" | "taken";

export type PrecheckResult = {
  status: PrecheckStatus;
  matches: PrecheckMatch[];
};

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
  /** Jurisdiction passed to /api/name-precheck so the backend can scope its lookup. */
  jurisdiction?: "federal" | "ontario" | "bc";
  errors?: {
    corpNameType?: string;
    businessName?: string;
    legalEnding?: string;
  };
};

type HistoryEntry = { name: string; status: PrecheckStatus };

export default function CorporationNameSection({
  value,
  onChange,
  basicLocked = false,
  jurisdiction,
  errors,
}: Props) {
  const [searchInput, setSearchInput] = useState(value.businessName);
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<PrecheckResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchCount, setSearchCount] = useState(0);

  const isNamed = value.corpNameType === "named";
  const hasChosenName = isNamed && value.businessName.length > 0;
  const jurisdictionWord = jurisdiction === "ontario" ? "Ontario" : "Canada";
  // Federal name uniqueness is checked against Corporations Canada's official
  // public registry. Rather than calling an unofficial precheck, we send
  // customers to the government search and capture the name they confirmed.
  const useExternalRegistrySearch = jurisdiction === "federal";

  function setCorpType(t: CorpNameType) {
    onChange({
      corpNameType: t,
      businessName: t === "numbered" ? "" : value.businessName,
      legalEnding: value.legalEnding,
    });
    setResult(null);
  }

  async function runCheck() {
    const name = searchInput.trim();
    if (!name) return;
    setSearching(true);
    try {
      // TODO: replace with the real NUANS-backed endpoint once /api/name-precheck
      // is wired up. Expected response shape: PrecheckResult.
      const res = await fetch("/api/name-precheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, jurisdiction }),
      });
      const data: PrecheckResult = await res.json();
      setResult(data);
      setHistory((h) => [{ name, status: data.status }, ...h.filter((e) => e.name !== name)].slice(0, 5));
      setSearchCount((c) => c + 1);
    } catch {
      setResult({ status: "available", matches: [] });
    } finally {
      setSearching(false);
    }
  }

  function chooseName(name: string) {
    onChange({
      corpNameType: "named",
      businessName: name,
      legalEnding: value.legalEnding,
    });
  }

  function clearChosenName() {
    onChange({
      corpNameType: "named",
      businessName: "",
      legalEnding: value.legalEnding,
    });
    setResult(null);
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

      {/* Named branch: search → choose → confirm */}
      {isNamed && (
        <div className="bg-cream-100 border border-gray-200 rounded-xl p-7">
          {/* STEP A — search for the distinctive name (until one is chosen) */}
          {!hasChosenName && useExternalRegistrySearch && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-900">
                  Search for your business name
                </h3>
              </div>
              <p className="text-sm text-gray-500 ml-10 mb-4 leading-relaxed">
                Federal corporate names must be unique across Canada. Use Corporations
                Canada&apos;s official registry to confirm your{" "}
                <strong className="text-gray-900">distinctive name</strong> isn&apos;t already
                in use — e.g. search &quot;Acme&quot;, not &quot;Acme Inc.&quot; Then enter
                your chosen name below.
              </p>

              <a
                href="https://ised-isde.canada.ca/cbr-rec/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors mb-2"
              >
                <ExternalLink className="w-4 h-4" />
                Search the federal corporate registry
              </a>
              <p className="text-xs text-gray-500 mb-5">
                Opens in a new tab — free, unlimited searches on the Government of Canada
                site.
              </p>

              <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-gray-900 mb-2">
                Your chosen distinctive name <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const n = searchInput.trim();
                      if (n) chooseName(n);
                    }
                  }}
                  placeholder='e.g. "Maple Ridge Consulting"'
                  autoComplete="off"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const n = searchInput.trim();
                    if (n) chooseName(n);
                  }}
                  disabled={!searchInput.trim()}
                  className="bg-navy-900 hover:bg-navy-950 text-white font-semibold px-6 rounded-lg text-sm transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Use this name
                </button>
              </div>

              {errors?.businessName && (
                <p className="text-sm text-red-600 mt-2">{errors.businessName}</p>
              )}
            </div>
          )}

          {!hasChosenName && !useExternalRegistrySearch && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy-900">
                  Search for your business name
                </h3>
              </div>
              <p className="text-sm text-gray-500 ml-10 mb-4 leading-relaxed">
                Enter the <strong className="text-gray-900">distinctive part</strong> of your name
                only — e.g. &quot;Acme&quot; not &quot;Acme Inc.&quot; You can search unlimited times
                until you find one that&apos;s available.
              </p>

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runCheck();
                    }
                  }}
                  placeholder='e.g. "Maple Ridge Consulting"'
                  autoComplete="off"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={runCheck}
                  disabled={searching || !searchInput.trim()}
                  className="bg-navy-900 hover:bg-navy-950 text-white font-semibold px-6 rounded-lg text-sm transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking
                    </>
                  ) : (
                    "Check name"
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {searchCount === 0 ? "Unlimited free searches" : `${searchCount} searches so far`}
              </p>

              {result && (
                <ResultPanel
                  result={result}
                  searchedName={searchInput.trim()}
                  onUseName={chooseName}
                />
              )}

              {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                  <div className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-gray-500 mb-2">
                    Previously searched
                  </div>
                  <div className="space-y-1.5">
                    {history.map((h) => (
                      <div
                        key={h.name}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 text-sm"
                      >
                        <span className="text-gray-900">{h.name}</span>
                        <span className={historyBadge(h.status)}>{statusLabel(h.status)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors?.businessName && !result && (
                <p className="text-sm text-red-600 mt-2">{errors.businessName}</p>
              )}
            </div>
          )}

          {/* STEP B — selected name preview + legal ending picker */}
          {hasChosenName && (
            <div>
              <div className="bg-white border-2 border-navy-900 rounded-lg p-4 mb-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-gray-500 mb-1">
                    Your chosen name
                  </div>
                  <div className="font-serif text-2xl font-semibold text-navy-900">
                    {value.businessName}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearChosenName}
                  className="border border-gray-200 text-gray-500 hover:border-navy-900 hover:text-navy-900 text-xs px-3 py-1.5 rounded-md transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
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
          Every corporation needs a legal ending. They&apos;re interchangeable — pick whichever you
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

      <p className="text-xs text-gray-500 italic leading-relaxed pt-3 border-t border-gray-200">
        {useExternalRegistrySearch ? (
          <>
            The Corporations Canada registry search above is preliminary only. The official
            NUANS Name Reservation Report, required to incorporate, is included in your Korporex
            incorporation package and is filed automatically after checkout. Final name approval
            is at the discretion of the government.
          </>
        ) : (
          <>
            This is a preliminary search powered by NUANS — Canada&apos;s official corporate name database.
            It is not an official NUANS Name Reservation Report. The official report, required to
            incorporate, is included in your Korporex incorporation package and is filed automatically
            after checkout. Final name approval is at the discretion of the government.
          </>
        )}
      </p>
    </div>
  );
}

function ResultPanel({
  result,
  searchedName,
  onUseName,
}: {
  result: PrecheckResult;
  searchedName: string;
  onUseName: (name: string) => void;
}) {
  const palette = {
    available: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", Icon: Check },
    similar: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", Icon: AlertTriangle },
    taken: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", Icon: X },
  }[result.status];

  const headline = {
    available: "Looks available",
    similar: "Similar names exist",
    taken: "This name is taken",
  }[result.status];

  const body = {
    available: `No exact or close matches found for "${searchedName}". You can use this name.`,
    similar: `We found names that share the same distinctive element. You may still be able to use "${searchedName}", but the government may flag it during NUANS review.`,
    taken: `An active corporation already uses "${searchedName}" or a near-identical variant. Choose a different distinctive name.`,
  }[result.status];

  const canUse = result.status !== "taken";

  return (
    <div className={`mt-3 p-4 rounded-lg border ${palette.bg} ${palette.border}`}>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className={`flex items-center gap-2 font-bold text-sm ${palette.text}`}>
          <palette.Icon className="w-4 h-4" />
          {headline}
        </div>
        {canUse && (
          <button
            type="button"
            onClick={() => onUseName(searchedName)}
            className="bg-navy-900 hover:bg-navy-950 text-white font-semibold text-xs px-3 py-1.5 rounded-md transition-colors"
          >
            Use this name
          </button>
        )}
      </div>
      <p className="text-sm text-gray-900 leading-relaxed">{body}</p>
      {result.matches.length > 0 && (
        <ul className="mt-3 pt-3 border-t border-black/10 space-y-1">
          {result.matches.map((m) => (
            <li key={m.name} className="flex justify-between text-sm">
              <span className="text-gray-900">{m.name}</span>
              <span className="text-xs text-gray-500">
                {m.jurisdiction} · {m.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function historyBadge(status: PrecheckStatus): string {
  const base = "text-xs font-semibold px-2 py-0.5 rounded";
  if (status === "available") return `${base} bg-emerald-100 text-emerald-800`;
  if (status === "similar") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-red-100 text-red-800`;
}

function statusLabel(status: PrecheckStatus): string {
  if (status === "available") return "Available";
  if (status === "similar") return "Similar exists";
  return "Taken";
}
