"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  type CompetitorMetric,
  type CompetitorsData,
  loadCompetitors,
} from "@/lib/competitorsStore";

const MAX_COMPARE = 4;

const METRIC_ROWS: Array<{ key: keyof CompetitorMetric; label: string; numericFormat: "int" | "fixed" }> = [
  { key: "dr", label: "Domain Rating", numericFormat: "int" },
  { key: "ur", label: "URL Rating", numericFormat: "int" },
  { key: "organicTraffic", label: "Organic traffic", numericFormat: "int" },
  { key: "organicKeywords", label: "Organic keywords", numericFormat: "int" },
  { key: "referringDomains", label: "Referring domains", numericFormat: "int" },
  { key: "totalPages", label: "Total pages", numericFormat: "int" },
  { key: "top3", label: "Top 3 keywords", numericFormat: "int" },
  { key: "top10", label: "Top 10 keywords", numericFormat: "int" },
  { key: "avgWordCount", label: "Avg word count", numericFormat: "int" },
];

function formatVal(n: number, fmt: "int" | "fixed"): string {
  if (fmt === "int") return n.toLocaleString("en-CA");
  return n.toFixed(1);
}

export default function CompareClient() {
  const [data, setData] = useState<CompetitorsData | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setData(loadCompetitors());
  }, []);

  const competitors = data?.competitors ?? [];
  const visible = competitors.filter((c) => selected.includes(c.id));

  // For each selected competitor, take the latest metric snapshot.
  const latestMetrics = useMemo(() => {
    const map = new Map<string, CompetitorMetric | null>();
    if (!data) return map;
    for (const c of visible) {
      const ms = data.metrics
        .filter((m) => m.competitorId === c.id)
        .sort((a, b) => b.snapshotDate.localeCompare(a.snapshotDate));
      map.set(c.id, ms[0] ?? null);
    }
    return map;
  }, [data, visible]);

  // Find best (max) value per row across selected competitors for highlighting.
  const bestPerRow = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of METRIC_ROWS) {
      let bestId: string | null = null;
      let bestVal = -Infinity;
      for (const c of visible) {
        const m = latestMetrics.get(c.id);
        if (!m) continue;
        const v = (m[r.key] as number) ?? 0;
        if (v > bestVal) {
          bestVal = v;
          bestId = c.id;
        }
      }
      if (bestId) map.set(r.key as string, bestId);
    }
    return map;
  }, [visible, latestMetrics]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= MAX_COMPARE) {
        alert(`Pick at most ${MAX_COMPARE} competitors to compare.`);
        return prev;
      }
      return [...prev, id];
    });
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/seo/competitors"
        className="inline-flex items-center gap-1 text-sm text-navy-900 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to competitors
      </Link>

      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">
          Compare competitors
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Pick up to {MAX_COMPARE}. Side-by-side view uses each competitor&rsquo;s
          most recent metric snapshot. Best value per row highlighted in green.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Pick competitors ({selected.length}/{MAX_COMPARE})
        </p>
        <div className="flex flex-wrap gap-2">
          {competitors.map((c) => {
            const on = selected.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  on
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {c.name}
              </button>
            );
          })}
          {competitors.length === 0 ? (
            <p className="text-xs text-gray-500">
              No competitors yet —{" "}
              <Link href="/dashboard/seo/competitors" className="underline">
                add one
              </Link>
              .
            </p>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
          Pick at least 2 competitors to start comparing.
        </div>
      ) : (
        <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">Metric</th>
                {visible.map((c) => (
                  <th key={c.id} className="px-3 py-2 text-right">
                    <Link
                      href={`/dashboard/seo/competitors/${c.id}`}
                      className="font-semibold text-navy-900 hover:underline"
                    >
                      {c.name}
                    </Link>
                    <p className="text-[10px] font-normal normal-case tracking-normal text-gray-500">
                      {latestMetrics.get(c.id)?.snapshotDate ?? "no snapshot"}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {METRIC_ROWS.map((row) => (
                <tr key={String(row.key)} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 align-top text-gray-700">{row.label}</td>
                  {visible.map((c) => {
                    const m = latestMetrics.get(c.id);
                    const val = m ? ((m[row.key] as number) ?? 0) : null;
                    const isBest = bestPerRow.get(row.key as string) === c.id && val !== null && val > 0;
                    return (
                      <td
                        key={c.id}
                        className={`px-3 py-1.5 text-right align-top font-mono ${
                          isBest ? "bg-emerald-50 font-semibold text-emerald-800" : ""
                        }`}
                      >
                        {val === null ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          formatVal(val, row.numericFormat)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
