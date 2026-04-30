"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import Papa from "papaparse";
import {
  type CompetitorMetric,
  type CompetitorsData,
  addCompetitorBacklinks,
  addKeywords,
  addMetric,
  addPages,
  csvRowToCompetitorBacklink,
  csvRowToKeyword,
  csvRowToMetric,
  csvRowToPage,
  loadCompetitors,
  saveCompetitors,
} from "@/lib/competitorsStore";
import Tabs from "@/components/dashboard/seo/Tabs";
import SummaryStat from "@/components/dashboard/seo/SummaryStat";

type TabId = "metrics" | "pages" | "keywords" | "backlinks";

export default function CompetitorDetailClient({ id }: { id: string }) {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "metrics") as TabId;
  const tab: TabId =
    tabParam === "pages" || tabParam === "keywords" || tabParam === "backlinks"
      ? tabParam
      : "metrics";

  const [data, setData] = useState<CompetitorsData | null>(null);

  useEffect(() => {
    setData(loadCompetitors());
  }, []);

  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
        Loading…
      </div>
    );
  }

  const competitor = data.competitors.find((c) => c.id === id);
  if (!competitor) {
    return (
      <div className="space-y-3">
        <Link href="/dashboard/seo/competitors" className="inline-flex items-center gap-1 text-sm text-navy-900 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to competitors
        </Link>
        <p className="text-sm text-gray-600">Competitor not found.</p>
      </div>
    );
  }

  function commit(next: CompetitorsData) {
    setData(next);
    saveCompetitors(next);
  }

  const metrics = data.metrics
    .filter((m) => m.competitorId === id)
    .sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate));
  const pages = data.pages.filter((p) => p.competitorId === id);
  const keywords = data.keywords.filter((k) => k.competitorId === id);
  const backlinks = data.backlinks.filter((b) => b.competitorId === id);

  const latest: CompetitorMetric | null = metrics[metrics.length - 1] ?? null;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/seo/competitors" className="inline-flex items-center gap-1 text-sm text-navy-900 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to competitors
      </Link>

      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">{competitor.name}</h1>
        <a
          href={`https://${competitor.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-navy-900 hover:underline"
        >
          {competitor.domain} →
        </a>
      </div>

      {latest ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryStat label="DR (latest)" value={latest.dr} />
          <SummaryStat label="Organic traffic" value={latest.organicTraffic} />
          <SummaryStat label="Organic keywords" value={latest.organicKeywords} />
          <SummaryStat label="Referring domains" value={latest.referringDomains} />
        </div>
      ) : null}

      <Tabs<TabId>
        active={tab}
        tabs={[
          { id: "metrics", label: "Metrics", count: metrics.length },
          { id: "pages", label: "Pages", count: pages.length },
          { id: "keywords", label: "Keywords", count: keywords.length },
          { id: "backlinks", label: "Backlinks", count: backlinks.length },
        ]}
      />

      {tab === "metrics" ? (
        <MetricsTab
          metrics={metrics}
          onImport={(rows) => {
            let next = data;
            for (const r of rows) next = addMetric(next, id, csvRowToMetric(r));
            commit(next);
          }}
          onAddManual={(partial) => commit(addMetric(data, id, partial))}
        />
      ) : null}
      {tab === "pages" ? (
        <SimpleImportTable
          label="pages"
          rows={pages.map((p) => ({
            URL: p.url,
            Title: p.title,
            "Word count": String(p.wordCount),
            Indexed: p.indexed ? "Yes" : "No",
            "Last updated": p.lastUpdated,
          }))}
          onImport={(parsed) => {
            const items = parsed.map(csvRowToPage).filter((p) => p.url);
            commit(addPages(data, id, items));
          }}
          helperText="Columns: URL, Title, Word count, Indexed, Last updated."
        />
      ) : null}
      {tab === "keywords" ? (
        <SimpleImportTable
          label="keywords"
          rows={keywords.map((k) => ({
            Keyword: k.keyword,
            "Search volume": String(k.searchVolume),
            Position: String(k.position),
            Traffic: String(k.traffic),
            "Snapshot date": k.snapshotDate,
          }))}
          onImport={(parsed) => {
            const items = parsed.map(csvRowToKeyword).filter((k) => k.keyword);
            commit(addKeywords(data, id, items));
          }}
          helperText="Columns: Keyword, Search volume, Position, Traffic. Auto-assigns today's date if missing."
        />
      ) : null}
      {tab === "backlinks" ? (
        <SimpleImportTable
          label="backlinks"
          rows={backlinks.map((b) => ({
            "Referring domain": b.referringDomain,
            "Referring URL": b.referringUrl,
            DR: String(b.dr),
            Anchor: b.anchorText,
            Type: b.linkType,
          }))}
          onImport={(parsed) => {
            const items = parsed
              .map(csvRowToCompetitorBacklink)
              .filter((b) => b.referringDomain);
            commit(addCompetitorBacklinks(data, id, items));
          }}
          helperText="Ahrefs-style: Referring page URL, Referring domain, DR, Anchor, Type."
        />
      ) : null}
    </div>
  );
}

function MetricsTab({
  metrics,
  onImport,
  onAddManual,
}: {
  metrics: CompetitorMetric[];
  onImport: (rows: Record<string, string>[]) => void;
  onAddManual: (partial: Partial<CompetitorMetric>) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const sorted = [...metrics].sort((a, b) =>
    b.snapshotDate.localeCompare(a.snapshotDate),
  );

  function handleCsv(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => onImport(r.data),
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
        >
          Add snapshot
        </button>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Upload className="h-3.5 w-3.5" />
          CSV import
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleCsv(f);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-xs text-gray-500">{metrics.length} snapshots</span>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Snapshot</th>
              <th className="px-3 py-2 text-right">DR</th>
              <th className="px-3 py-2 text-right">UR</th>
              <th className="px-3 py-2 text-right">Traffic</th>
              <th className="px-3 py-2 text-right">Keywords</th>
              <th className="px-3 py-2 text-right">Ref domains</th>
              <th className="px-3 py-2 text-right">Pages</th>
              <th className="px-3 py-2 text-right">Top 3 / 10</th>
              <th className="px-3 py-2 text-right">Avg words</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                  No snapshots yet.
                </td>
              </tr>
            ) : (
              sorted.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 align-top">{m.snapshotDate}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">{m.dr}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">{m.ur}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">{m.organicTraffic.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">{m.organicKeywords.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">{m.referringDomains.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">{m.totalPages.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">
                    {m.top3} / {m.top10}
                  </td>
                  <td className="px-3 py-1.5 text-right align-top font-mono">{m.avgWordCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <AddMetricModal
          onClose={() => setShowAdd(false)}
          onSave={(p) => {
            onAddManual(p);
            setShowAdd(false);
          }}
        />
      ) : null}
    </div>
  );
}

function AddMetricModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (partial: Partial<CompetitorMetric>) => void;
}) {
  const [snapshotDate, setSnapshotDate] = useState(new Date().toISOString().slice(0, 10));
  const [dr, setDr] = useState("");
  const [organicTraffic, setOrganicTraffic] = useState("");
  const [organicKeywords, setOrganicKeywords] = useState("");
  const [referringDomains, setReferringDomains] = useState("");
  const [totalPages, setTotalPages] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      snapshotDate,
      dr: parseFloat(dr) || 0,
      organicTraffic: parseFloat(organicTraffic) || 0,
      organicKeywords: parseFloat(organicKeywords) || 0,
      referringDomains: parseFloat(referringDomains) || 0,
      totalPages: parseFloat(totalPages) || 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 shadow-xl"
      >
        <h2 className="font-serif text-lg font-semibold text-navy-900">Add metric snapshot</h2>
        <label className="block text-xs">
          <span className="text-gray-500">Snapshot date</span>
          <input
            type="date"
            value={snapshotDate}
            onChange={(e) => setSnapshotDate(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="DR" value={dr} onChange={setDr} />
          <NumberField label="Organic traffic" value={organicTraffic} onChange={setOrganicTraffic} />
          <NumberField label="Organic keywords" value={organicKeywords} onChange={setOrganicKeywords} />
          <NumberField label="Referring domains" value={referringDomains} onChange={setReferringDomains} />
          <NumberField label="Total pages" value={totalPages} onChange={setTotalPages} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs">
      <span className="text-gray-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
      />
    </label>
  );
}

function SimpleImportTable({
  label,
  rows,
  onImport,
  helperText,
}: {
  label: string;
  rows: Record<string, string>[];
  onImport: (parsed: Record<string, string>[]) => void;
  helperText: string;
}) {
  const cols = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows]);

  function handleCsv(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => onImport(r.data),
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Upload className="h-3.5 w-3.5" />
          CSV import
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleCsv(f);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-xs text-gray-500">
          {rows.length} {label} stored. {helperText}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No {label} imported yet.
        </div>
      ) : (
        <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
              <tr>
                {cols.map((c) => (
                  <th key={c} className="px-3 py-2 text-left">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.slice(0, 200).map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {cols.map((c) => {
                    const v = row[c] ?? "";
                    return (
                      <td key={c} className="max-w-xs truncate px-3 py-1.5 align-top" title={v}>
                        {v.startsWith("http") ? (
                          <a href={v} target="_blank" rel="noopener noreferrer" className="text-navy-900 hover:underline">
                            {v}
                          </a>
                        ) : (
                          v
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 200 ? (
            <p className="border-t border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
              Showing first 200 of {rows.length}.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
