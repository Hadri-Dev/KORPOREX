"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowRight, ArrowUp, Download, Plus, Trash2, Upload } from "lucide-react";
import Papa from "papaparse";
import {
  type AhrefsRow,
  type AhrefsSnapshot,
  type GscRow,
  type GscSnapshot,
  type LocalRankingEntry,
  type MoneyPageConfig,
  type PageStatus,
  KORPOREX_MONEY_PAGES,
  STATUS_COLORS,
  STATUS_LABELS,
  addAhrefsSnapshot,
  addGscSnapshot,
  addLocalRanking,
  csvRowToAhrefs,
  csvRowToGsc,
  deleteAhrefsSnapshot,
  deleteGscSnapshot,
  deleteLocalRanking,
  loadAhrefsSnapshots,
  loadGscSnapshots,
  loadLocalRankings,
  loadMoneyPagesConfig,
  saveMoneyPagesConfig,
  statusFromPosition,
} from "@/lib/rankingsStore";
import { datasetToCsv, downloadCsv } from "@/lib/seoStore";
import Tabs from "@/components/dashboard/seo/Tabs";
import SummaryStat from "@/components/dashboard/seo/SummaryStat";

type TabId = "money-pages" | "gsc" | "ahrefs" | "local";

export default function RankingsClient() {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "money-pages") as TabId;
  const tab: TabId =
    tabParam === "gsc" || tabParam === "ahrefs" || tabParam === "local"
      ? tabParam
      : "money-pages";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Rankings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track money pages, ingest GSC + Ahrefs CSVs, and log local rankings manually.
        </p>
      </div>

      <Tabs<TabId>
        active={tab}
        tabs={[
          { id: "money-pages", label: "Money pages" },
          { id: "gsc", label: "GSC" },
          { id: "ahrefs", label: "Ahrefs" },
          { id: "local", label: "Local" },
        ]}
      />

      {tab === "money-pages" ? <MoneyPagesTab /> : null}
      {tab === "gsc" ? <GscTab /> : null}
      {tab === "ahrefs" ? <AhrefsTab /> : null}
      {tab === "local" ? <LocalTab /> : null}
    </div>
  );
}

// ─── Money Pages tab ────────────────────────────────────────────────────────

function MoneyPagesTab() {
  const [config, setConfig] = useState<MoneyPageConfig[]>([]);
  const [latestGsc, setLatestGsc] = useState<GscSnapshot | null>(null);

  useEffect(() => {
    setConfig(loadMoneyPagesConfig());
    const snaps = loadGscSnapshots();
    setLatestGsc(snaps[0] ?? null);
  }, []);

  function commit(next: MoneyPageConfig[]) {
    setConfig(next);
    saveMoneyPagesConfig(next);
  }

  function update(path: string, patch: Partial<MoneyPageConfig>) {
    commit(config.map((c) => (c.path === path ? { ...c, ...patch } : c)));
  }

  // For each money page, find aggregated GSC stats from latest snapshot
  // (sum across queries that mention this URL).
  function gscFor(path: string): { clicks: number; impressions: number; position: number } | null {
    if (!latestGsc) return null;
    const matches = latestGsc.rows.filter((r) => {
      try {
        const u = new URL(r.url);
        return u.pathname + u.search === path || u.pathname === path;
      } catch {
        return r.url === path || r.url.endsWith(path);
      }
    });
    if (matches.length === 0) return null;
    const clicks = matches.reduce((acc, r) => acc + r.clicks, 0);
    const impressions = matches.reduce((acc, r) => acc + r.impressions, 0);
    const totalPos = matches.reduce((acc, r) => acc + r.position, 0);
    return {
      clicks,
      impressions,
      position: matches.length ? totalPos / matches.length : 0,
    };
  }

  return (
    <div className="space-y-3">
      {config.map((cfg) => {
        const meta = KORPOREX_MONEY_PAGES.find((p) => p.path === cfg.path);
        const gsc = gscFor(cfg.path);
        const computedPos = cfg.manualPosition ?? gsc?.position;
        const computedStatus: PageStatus = cfg.status === "untracked" ? statusFromPosition(computedPos) : cfg.status;
        return (
          <details
            key={cfg.path}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3 hover:bg-gray-50">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[computedStatus]}`}>
                {STATUS_LABELS[computedStatus]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-navy-900">{meta?.label ?? cfg.path}</p>
                <p className="truncate text-xs text-gray-500" title={cfg.path}>{cfg.path}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs">
                {gsc ? (
                  <span title="GSC clicks (latest snapshot)">
                    <span className="font-mono text-gray-900">{gsc.clicks.toLocaleString()}</span>
                    <span className="ml-1 text-gray-500">clicks</span>
                  </span>
                ) : null}
                {gsc ? (
                  <span title="GSC impressions">
                    <span className="font-mono text-gray-900">{gsc.impressions.toLocaleString()}</span>
                    <span className="ml-1 text-gray-500">impr</span>
                  </span>
                ) : null}
                {computedPos ? (
                  <span title="Avg position (manual or GSC)">
                    <span className="font-mono text-gray-900">{computedPos.toFixed(1)}</span>
                    <span className="ml-1 text-gray-500">pos</span>
                  </span>
                ) : null}
                {cfg.targetKeywords.length > 0 ? (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                    {cfg.targetKeywords.length} target keyword{cfg.targetKeywords.length === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>
            </summary>
            <div className="grid gap-3 border-t border-gray-100 bg-gray-50 px-4 py-3 sm:grid-cols-2">
              <label className="block text-xs">
                <span className="text-gray-500">Target keywords (comma-separated)</span>
                <input
                  type="text"
                  defaultValue={cfg.targetKeywords.join(", ")}
                  onBlur={(e) =>
                    update(cfg.path, {
                      targetKeywords: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </label>
              <label className="block text-xs">
                <span className="text-gray-500">Manual position (overrides GSC)</span>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={cfg.manualPosition ?? ""}
                  onBlur={(e) =>
                    update(cfg.path, {
                      manualPosition: e.target.value === "" ? undefined : parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </label>
              <label className="block text-xs sm:col-span-2">
                <span className="text-gray-500">Notes</span>
                <textarea
                  defaultValue={cfg.notes}
                  onBlur={(e) => update(cfg.path, { notes: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </label>
              <label className="block text-xs">
                <span className="text-gray-500">Status override</span>
                <select
                  value={cfg.status}
                  onChange={(e) => update(cfg.path, { status: e.target.value as PageStatus })}
                  className="mt-1 block w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                >
                  <option value="untracked">Auto (from position)</option>
                  <option value="good">Good</option>
                  <option value="needs_work">Needs work</option>
                  <option value="underperforming">Underperforming</option>
                </select>
              </label>
            </div>
          </details>
        );
      })}
      {!latestGsc ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          No GSC snapshot yet — click data is empty. Import a GSC export from the &ldquo;GSC&rdquo; tab to populate
          clicks / impressions / position per page.
        </div>
      ) : null}
    </div>
  );
}

// ─── GSC tab ────────────────────────────────────────────────────────────────

function GscTab() {
  const [snapshots, setSnapshots] = useState<GscSnapshot[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bucket, setBucket] = useState<"all" | "top3" | "top10" | "top20">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const snaps = loadGscSnapshots();
    setSnapshots(snaps);
    setActiveId(snaps[0]?.id ?? null);
  }, []);

  function reload() {
    const snaps = loadGscSnapshots();
    setSnapshots(snaps);
    if (!snaps.find((s) => s.id === activeId)) setActiveId(snaps[0]?.id ?? null);
  }

  function handleCsv(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        const rows = r.data.map(csvRowToGsc).filter((row) => row.url);
        if (rows.length === 0) {
          alert("No rows parsed. Expected columns: Page (or URL), Query, Clicks, Impressions, CTR, Position.");
          return;
        }
        const snap = addGscSnapshot(rows, file.name);
        setSnapshots(loadGscSnapshots());
        setActiveId(snap.id);
      },
    });
  }

  const active = snapshots.find((s) => s.id === activeId);
  const filtered = useMemo(() => {
    if (!active) return [] as GscRow[];
    const ql = q.toLowerCase();
    return active.rows.filter((r) => {
      if (bucket === "top3" && r.position > 3) return false;
      if (bucket === "top10" && r.position > 10) return false;
      if (bucket === "top20" && r.position > 20) return false;
      if (ql && !r.url.toLowerCase().includes(ql) && !(r.query ?? "").toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [active, bucket, q]);

  const totals = useMemo(() => {
    if (!active) return { clicks: 0, impressions: 0 };
    return active.rows.reduce(
      (acc, r) => ({ clicks: acc.clicks + r.clicks, impressions: acc.impressions + r.impressions }),
      { clicks: 0, impressions: 0 },
    );
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={activeId ?? ""}
          onChange={(e) => setActiveId(e.target.value || null)}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          {snapshots.length === 0 ? (
            <option value="">No snapshots imported</option>
          ) : (
            snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.importedAt).toLocaleString("en-CA")} · {s.rows.length} rows · {s.source ?? "untitled"}
              </option>
            ))
          )}
        </select>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Upload className="h-3.5 w-3.5" />
          Import GSC CSV
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
        {active ? (
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this snapshot?")) {
                deleteGscSnapshot(active.id);
                reload();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete snapshot
          </button>
        ) : null}
      </div>

      {active ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryStat label="Total clicks" value={totals.clicks} />
            <SummaryStat label="Total impressions" value={totals.impressions} />
            <SummaryStat
              label="Avg CTR"
              value={
                totals.impressions
                  ? `${((totals.clicks / totals.impressions) * 100).toFixed(2)}%`
                  : "—"
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter URL or query…"
              className="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-navy-900 focus:outline-none"
            />
            <select
              value={bucket}
              onChange={(e) => setBucket(e.target.value as "all" | "top3" | "top10" | "top20")}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="all">All positions</option>
              <option value="top3">Top 3</option>
              <option value="top10">Top 10</option>
              <option value="top20">Top 20</option>
            </select>
            <span className="text-xs text-gray-500">
              {filtered.length.toLocaleString()} of {active.rows.length.toLocaleString()}
            </span>
            <button
              type="button"
              onClick={() => {
                const cols = ["url", "query", "clicks", "impressions", "ctr", "position"];
                const rows = filtered.map((r) => ({
                  url: r.url,
                  query: r.query ?? "",
                  clicks: String(r.clicks),
                  impressions: String(r.impressions),
                  ctr: String(r.ctr),
                  position: String(r.position),
                }));
                downloadCsv(`korporex-gsc-${new Date().toISOString().slice(0, 10)}.csv`, datasetToCsv({ columns: cols, rows }));
              }}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>

          <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">URL</th>
                  <th className="px-3 py-2 text-left">Query</th>
                  <th className="px-3 py-2 text-right">Clicks</th>
                  <th className="px-3 py-2 text-right">Impressions</th>
                  <th className="px-3 py-2 text-right">CTR</th>
                  <th className="px-3 py-2 text-right">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.slice(0, 200).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="max-w-xs truncate px-3 py-1.5" title={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-navy-900 hover:underline">
                        {r.url}
                      </a>
                    </td>
                    <td className="max-w-xs truncate px-3 py-1.5" title={r.query}>{r.query ?? ""}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{r.clicks.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{r.impressions.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{(r.ctr * 100).toFixed(2)}%</td>
                    <td className="px-3 py-1.5 text-right font-mono">{r.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 200 ? (
              <p className="border-t border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
                Showing first 200 of {filtered.length.toLocaleString()}.
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          No GSC snapshots yet. Export a Performance report from Search Console (CSV)
          and upload it above.
        </div>
      )}
    </div>
  );
}

// ─── Ahrefs tab ─────────────────────────────────────────────────────────────

function AhrefsTab() {
  const [snapshots, setSnapshots] = useState<AhrefsSnapshot[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [gapOnly, setGapOnly] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const snaps = loadAhrefsSnapshots();
    setSnapshots(snaps);
    setActiveId(snaps[0]?.id ?? null);
  }, []);

  function reload() {
    const snaps = loadAhrefsSnapshots();
    setSnapshots(snaps);
    if (!snaps.find((s) => s.id === activeId)) setActiveId(snaps[0]?.id ?? null);
  }

  function handleCsv(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        const rows = r.data.map(csvRowToAhrefs).filter((row) => row.keyword);
        if (rows.length === 0) {
          alert("No rows parsed. Expected columns include Keyword, Current URL, Current Position, Volume.");
          return;
        }
        const snap = addAhrefsSnapshot(rows, file.name);
        setSnapshots(loadAhrefsSnapshots());
        setActiveId(snap.id);
      },
    });
  }

  const active = snapshots.find((s) => s.id === activeId);
  const filtered = useMemo<AhrefsRow[]>(() => {
    if (!active) return [];
    const ql = q.toLowerCase();
    return active.rows.filter((r) => {
      if (gapOnly && (r.position < 11 || r.position > 30)) return false;
      if (ql && !r.keyword.toLowerCase().includes(ql) && !r.url.toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [active, gapOnly, q]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={activeId ?? ""}
          onChange={(e) => setActiveId(e.target.value || null)}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          {snapshots.length === 0 ? (
            <option value="">No snapshots imported</option>
          ) : (
            snapshots.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.importedAt).toLocaleString("en-CA")} · {s.rows.length} rows · {s.source ?? "untitled"}
              </option>
            ))
          )}
        </select>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Upload className="h-3.5 w-3.5" />
          Import Ahrefs CSV
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
        {active ? (
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this Ahrefs snapshot?")) {
                deleteAhrefsSnapshot(active.id);
                reload();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete snapshot
          </button>
        ) : null}
      </div>

      {active ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter keyword or URL…"
              className="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-navy-900 focus:outline-none"
            />
            <label className="flex items-center gap-1 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={gapOnly}
                onChange={(e) => setGapOnly(e.target.checked)}
              />
              Gap analysis (positions 11–30)
            </label>
            <span className="text-xs text-gray-500">
              {filtered.length.toLocaleString()} of {active.rows.length.toLocaleString()}
            </span>
          </div>

          <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Keyword</th>
                  <th className="px-3 py-2 text-left">URL</th>
                  <th className="px-3 py-2 text-right">Position</th>
                  <th className="px-3 py-2 text-right">Volume</th>
                  <th className="px-3 py-2 text-right">Traffic</th>
                  <th className="px-3 py-2 text-right">KD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.slice(0, 200).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="max-w-xs truncate px-3 py-1.5" title={r.keyword}>{r.keyword}</td>
                    <td className="max-w-xs truncate px-3 py-1.5" title={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-navy-900 hover:underline">
                        {r.url}
                      </a>
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono">{r.position}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{r.searchVolume.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{r.traffic.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right font-mono">{r.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 200 ? (
              <p className="border-t border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
                Showing first 200 of {filtered.length.toLocaleString()}.
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          No Ahrefs snapshots yet. Export an Organic Keywords report and upload here.
        </div>
      )}
    </div>
  );
}

// ─── Local rankings tab ─────────────────────────────────────────────────────

function LocalTab() {
  const [entries, setEntries] = useState<LocalRankingEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setEntries(loadLocalRankings());
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Log a position
        </button>
        <span className="text-xs text-gray-500">
          {entries.length} entries · manual entry only (no SERP API)
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">When</th>
              <th className="px-3 py-2 text-left">City</th>
              <th className="px-3 py-2 text-left">Keyword</th>
              <th className="px-3 py-2 text-right">Position</th>
              <th className="px-3 py-2 text-right">7-day prior</th>
              <th className="px-3 py-2 text-center">Trend</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-gray-500">
                  No local rankings logged yet.
                </td>
              </tr>
            ) : (
              entries.map((e) => {
                const trend =
                  e.previousPosition === undefined
                    ? null
                    : e.position < e.previousPosition
                    ? "up"
                    : e.position > e.previousPosition
                    ? "down"
                    : "flat";
                return (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 text-xs">{new Date(e.measuredAt).toLocaleDateString("en-CA")}</td>
                    <td className="px-3 py-1.5">{e.city}</td>
                    <td className="px-3 py-1.5">{e.keyword}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-xs">{e.position}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-xs">{e.previousPosition ?? "—"}</td>
                    <td className="px-3 py-1.5 text-center">
                      {trend === "up" ? (
                        <ArrowUp className="mx-auto h-3.5 w-3.5 text-emerald-600" />
                      ) : trend === "down" ? (
                        <ArrowDown className="mx-auto h-3.5 w-3.5 text-red-600" />
                      ) : trend === "flat" ? (
                        <ArrowRight className="mx-auto h-3.5 w-3.5 text-gray-400" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => setEntries(deleteLocalRanking(entries, e.id))}
                        className="text-xs text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <AddLocalRanking
          onClose={() => setShowAdd(false)}
          onSave={(partial) => {
            const next = addLocalRanking(entries, partial);
            setEntries(next);
            setShowAdd(false);
          }}
        />
      ) : null}
    </div>
  );
}

function AddLocalRanking({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (partial: Omit<LocalRankingEntry, "id">) => void;
}) {
  const [city, setCity] = useState("Toronto");
  const [keyword, setKeyword] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const pos = parseFloat(position);
    if (!city.trim() || !keyword.trim() || !Number.isFinite(pos)) return;
    onSave({
      city: city.trim(),
      keyword: keyword.trim(),
      position: pos,
      measuredAt: new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 shadow-xl"
      >
        <h2 className="font-serif text-lg font-semibold text-navy-900">Log local ranking</h2>
        <label className="block text-xs">
          <span className="text-gray-500">City</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Keyword *</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='e.g. "Ontario incorporation"'
            required
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Position (1 = top result) *</span>
          <input
            type="number"
            step="1"
            min="1"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs"
          />
        </label>
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
