"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GOV_FEES, feesLastVerified, type JurisdictionCode } from "@/lib/govFees";
import { PRICES } from "@/lib/pricing";
import { COST_COPY, type CostLang } from "./costCopy";

type NameType = "named" | "numbered";
type RowKind = "once" | "year" | "opt";
type Row = { key: string; label: string; note: string; amount: number | null | "na"; kind: RowKind; selected?: boolean };

const EXPRESS_FEE = GOV_FEES.federal.express?.amount ?? 0;

export default function CostCalculatorBody() {
  const locale = useLocale();
  const lang: CostLang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COST_COPY[lang];

  const [jur, setJur] = useState<JurisdictionCode>("federal");
  const [nameType, setNameType] = useState<NameType>("named");
  const [express, setExpress] = useState(false);
  const [firstYear, setFirstYear] = useState(true);

  const j = GOV_FEES[jur];
  const useExpress = express && jur === "federal";
  const money = (n: number) => t.money(n);

  const rows: Row[] =
    jur === "federal"
      ? [
          { key: "inc", label: t.rows.incorporation, note: t.notes.fedIncorporation, amount: j.incorporation.amount, kind: "once" },
          { key: "express", label: t.rows.express, note: t.notes.fedExpress, amount: EXPRESS_FEE, kind: "opt", selected: useExpress },
          { key: "name", label: t.rows.nuans, note: t.notes.fedNuans, amount: null, kind: "once" },
          { key: "annual", label: t.rows.annual, note: t.notes.fedAnnual, amount: j.annualReturn.amount, kind: "year" },
        ]
      : [
          { key: "inc", label: t.rows.incorporation, note: t.notes.onIncorporation, amount: j.incorporation.amount, kind: "once" },
          {
            key: "name",
            label: t.rows.nuans,
            note: nameType === "named" ? t.notes.onNuansNamed : t.notes.onNuansNumbered,
            amount: nameType === "named" ? j.nameSearch.amount : "na",
            kind: "once",
          },
          { key: "initial", label: t.rows.initialReturn, note: t.notes.onInitial, amount: null, kind: "once" },
          { key: "annual", label: t.rows.annualOn, note: t.notes.onAnnual, amount: null, kind: "year" },
        ];

  let oneTime = 0;
  let yearly = 0;
  for (const r of rows) {
    if (typeof r.amount !== "number") continue;
    if (r.kind === "opt") {
      if (r.selected) oneTime += r.amount;
    } else if (r.kind === "year") yearly += r.amount;
    else oneTime += r.amount;
  }
  oneTime = Math.round(oneTime * 100) / 100;
  const total = Math.round((oneTime + (firstYear ? yearly : 0)) * 100) / 100;

  // Cheapest package that fits the choice: Basic is numbered-only, Standard
  // includes one NUANS search for a named corporation. Package prices include
  // the government filing fee.
  const pkg = nameType === "named" ? "standard" : "basic";
  const kxPrice = PRICES[jur][pkg];
  const verified = t.date(feesLastVerified());

  const tag = (kind: RowKind) =>
    kind === "year" ? (
      <span className="ml-2 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 align-middle">{t.tagYearly}</span>
    ) : kind === "opt" ? (
      <span className="ml-2 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 align-middle">{t.tagOptional}</span>
    ) : (
      <span className="ml-2 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cream-200 text-stone-600 align-middle">{t.tagOnce}</span>
    );

  const segBtn = (active: boolean) =>
    `text-left border-2 rounded-lg p-3 transition-colors ${active ? "border-navy-900 bg-navy-50" : "border-gold-200 hover:border-navy-900"}`;

  return (
    <>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{t.h1}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{t.lede}</p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-navy-900 bg-navy-50 border border-navy-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {t.verifiedPre}
            <strong>{verified}</strong>
          </p>
        </div>
      </section>

      <section className="bg-white py-10 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[320px_1fr] gap-7 items-start">
          {/* Controls */}
          <div className="border border-gray-200 rounded-xl p-5 lg:sticky lg:top-24">
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-black mb-2">{t.jurisdiction}</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {(["federal", "ontario"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setJur(v)} className={segBtn(jur === v)}>
                  <span className="block text-sm font-semibold text-navy-900">{t.jurLabel[v]}</span>
                  <span className="block text-xs text-gray-500">{t.jurSub[v]}</span>
                </button>
              ))}
            </div>

            <p className="text-xs font-bold tracking-[0.12em] uppercase text-black mb-2">{t.corpName}</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {(["named", "numbered"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setNameType(v)} className={segBtn(nameType === v)}>
                  <span className="block text-sm font-semibold text-navy-900">{t.nameLabel[v]}</span>
                  <span className="block text-xs text-gray-500">
                    {v === "named" ? t.namedEg : t.numberedEg(jur === "ontario" ? "Ontario" : "Canada")}
                  </span>
                </button>
              ))}
            </div>

            <label className={`flex items-start gap-3 text-sm text-gray-700 mb-3 ${jur === "federal" ? "cursor-pointer" : "opacity-50"}`}>
              <input
                type="checkbox"
                checked={useExpress}
                disabled={jur !== "federal"}
                onChange={(e) => setExpress(e.target.checked)}
                className="mt-1 accent-navy-900"
              />
              <span>
                {t.expressLabel}
                <span className="block text-xs text-gray-500">{t.expressHint}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={firstYear} onChange={(e) => setFirstYear(e.target.checked)} className="mt-1 accent-navy-900" />
              <span>
                {t.firstYearLabel}
                <span className="block text-xs text-gray-500">{t.firstYearHint}</span>
              </span>
            </label>

            <div className="mt-5 bg-navy-900 text-white rounded-lg p-4">
              <p className="text-[11px] tracking-[0.14em] uppercase opacity-75">{t.totalLabel}</p>
              <p className="font-serif text-3xl font-bold mt-1">{money(total)}</p>
              <p className="text-xs opacity-80 mt-1">
                {firstYear ? t.totalSplit(money(oneTime), money(yearly)) : t.totalOnce}
              </p>
            </div>
          </div>

          {/* Fee table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 pt-5 pb-2">
              <h2 className="font-serif text-2xl font-bold text-navy-900">{t.tableTitle[jur]}</h2>
              <p className="text-sm text-gray-500 mt-1">{t.tableSub[jur]}</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 border-y border-gray-200">
                  <th className="text-left text-[11px] tracking-[0.12em] uppercase text-gray-500 font-bold px-5 py-3">{t.colFiling}</th>
                  <th className="text-right text-[11px] tracking-[0.12em] uppercase text-gray-500 font-bold px-5 py-3">{t.colFee}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-b border-gray-200 align-top">
                    <td className="px-5 py-4">
                      <strong className="text-gray-900">{r.label}</strong>
                      {tag(r.kind)}
                      <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{r.note}</p>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap font-semibold text-navy-900">
                      {r.amount === "na"
                        ? t.notRequired
                        : r.amount === null
                          ? <span className="text-emerald-600">{money(0)}</span>
                          : r.kind === "opt" && !r.selected
                            ? t.notSelected(money(r.amount))
                            : money(r.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-5 py-4 text-[13px] text-gray-500 bg-cream-50">
              {t.sourcePre}
              <a href={j.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline text-navy-900">
                {t.sourceLabel[jur]}
              </a>
              {t.sourcePost}
              {jur === "ontario" && nameType === "named" && <span className="block mt-1">{t.nuansFootnote}</span>}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-10 px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.compareH2}</h2>
          <p className="text-gray-500 mb-5">{t.compareIntro}</p>
          <div className="border border-gray-200 rounded-xl bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 border-b border-gray-200">
                  <th className="px-4 py-3" />
                  <th className="px-4 py-3 text-center text-[11px] tracking-[0.12em] uppercase text-gray-500">{t.diy}</th>
                  <th className="px-4 py-3 text-center text-[11px] tracking-[0.12em] uppercase text-gray-500 bg-navy-50">{t.kxPkg(t.pkgName[pkg])}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3">{t.cmpPrice}</td>
                  <td className="px-4 py-3 text-center">{t.govOnly(money(oneTime))}</td>
                  <td className="px-4 py-3 text-center bg-navy-50"><strong>{money(kxPrice)}</strong>{t.plusTax}</td>
                </tr>
                {t.cmpRows.map(([label, diy]) => (
                  <tr key={label} className="border-b border-gray-200 last:border-0">
                    <td className="px-4 py-3">{label}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{diy ?? <span className="text-red-700 font-bold">&#10007;</span>}</td>
                    <td className="px-4 py-3 text-center bg-navy-50"><span className="text-emerald-600 font-bold">&#10003;</span></td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3">{t.cmpTurnaround}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{t.dependsOnYou}</td>
                  <td className="px-4 py-3 text-center bg-navy-50">{t.hours24}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">{t.compareNote}</p>
        </div>
      </section>

      <section className="bg-white py-10 px-6">
        <div className="max-w-5xl mx-auto bg-navy-900 text-white rounded-2xl p-7 flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-1">{t.ctaH}</h2>
            <p className="opacity-85">{t.ctaP}</p>
          </div>
          <Link href="/incorporate" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-sm px-5 py-3 rounded-lg transition-colors">
            {t.ctaBtn}
          </Link>
        </div>
      </section>

      <section className="bg-white pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">{t.faqH2}</h2>
          <p className="text-gray-500 mb-5">{t.faqIntro}</p>
          <div className="space-y-3">
            {t.faq.map(({ q, a }) => (
              <details key={q} className="group bg-white border border-gray-200 rounded-lg px-5 py-1">
                <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4 font-semibold text-navy-900 text-[15px]">
                  {q}
                  <span className="text-gold-600 text-xl leading-none group-open:hidden">+</span>
                  <span className="text-gold-600 text-xl leading-none hidden group-open:inline">–</span>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed pb-4">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-7 border border-dashed border-gold-500 bg-[#fffdf7] rounded-xl p-5">
            <p className="font-semibold text-navy-900">{t.citeH}</p>
            <p className="text-xs text-gray-500 mt-1">{t.citeP}</p>
            <code className="block bg-white border border-gold-200 rounded-lg p-3 text-xs text-gray-700 mt-3 break-all">
              {`<a href="${t.citeUrl}">${t.citeAnchor}</a>`}
            </code>
          </div>

          <p className="text-xs text-gray-500 border-t border-gray-200 pt-4 mt-7">{t.disclaimer}</p>
        </div>
      </section>
    </>
  );
}
