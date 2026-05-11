"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, Download, Minus, Trash2, Upload } from "lucide-react";
import Papa from "papaparse";
import {
  type DomainFrequencyEntry,
  type KeywordGroup,
  type SerpSnapshot,
  addSerpSnapshot,
  buildDomainFrequency,
  canonicalKeyword,
  csvRowToSerp,
  deleteSerpKeyword,
  deleteSerpSnapshot,
  detectKeywordFromFilename,
  droppedSinceLast,
  groupByKeyword,
  loadSerpSnapshots,
} from "@/lib/serpOverviewStore";
import { datasetToCsv, downloadCsv } from "@/lib/seoStore";
import { logImport } from "@/lib/importHistory";
import { loadCompetitors } from "@/lib/competitorsStore";
import Tabs from "@/components/dashboard/seo/Tabs";
import SummaryStat from "@/components/dashboard/seo/SummaryStat";

type TabId = "keywords" | "frequency" | "snapshots";

export default function SerpOverviewClient() {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "keywords") as TabId;
  const tab: TabId =
    tabParam === "frequency" || tabParam === "snapshots" ? tabParam : "keywords";

  const [snapshots, setSnapshots] = useState<SerpSnapshot[]>([]);
  const [competitorDomains, setCompetitorDomains] = useState<Map<string, { name: string; tier: string }>>(new Map());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSnapshots(loadSerpSnapshots());
    const comps = loadCompetitors().competitors;
    const map = new Map<string, { name: string; tier: string }>();
    for (const c of comps) {
      const d = c.domain.toLowerCase().replace(/^www\./, "");
      map.set(d, { name: c.name, tier: c.tier });
    }
    setCompetitorDomains(map);
    setHydrated(true);
  }, []);

  function reload() {
    setSnapshots(loadSerpSnapshots());
  }

  const groups = useMemo(() => groupByKeyword(snapshots), [snapshots]);

  const totalKeywords = groups.length;
  const totalSnapshots = snapshots.length;
  const competitorAppearances = useMemo(() => {
    if (groups.length === 0 || competitorDomains.size === 0) return 0;
    let count = 0;
    for (const g of groups) {
      const latest = g.snapshots[0];
      const domains = new Set(latest.rows.slice(0, 10).map((r) => r.domain));
      domains.forEach((d) => {
        if (competitorDomains.has(d)) count++;
      });
    }
    return count;
  }, [groups, competitorDomains]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">SERP Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track who ranks for your target keywords. Import an Ahrefs SERP overview CSV per keyword,
          and we&rsquo;ll surface the top pages, position changes between imports, and how often each
          competitor shows up across your keyword set.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryStat label="Tracked keywords" value={totalKeywords} />
        <SummaryStat label="Snapshots stored" value={totalSnapshots} />
        <SummaryStat
          label="Competitor top-10 hits"
          value={competitorAppearances}
          hint="How many tracked competitors appear in the top 10 across your latest snapshots."
        />
      </div>

      <UploadBar onImported={reload} existingKeywords={groups.map((g) => g.keyword)} />

      <Tabs<TabId>
        active={tab}
        tabs={[
          { id: "keywords", label: "By keyword", count: totalKeywords },
          { id: "frequency", label: "Domain frequency" },
          { id: "snapshots", label: "Snapshots", count: totalSnapshots },
        ]}
      />

      {!hydrated ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Loading…
        </div>
      ) : tab === "keywords" ? (
        <KeywordsTab groups={groups} competitorDomains={competitorDomains} onChange={reload} />
      ) : tab === "frequency" ? (
        <FrequencyTab groups={groups} competitorDomains={competitorDomains} />
      ) : (
        <SnapshotsTab snapshots={snapshots} onChange={reload} />
      )}
    </div>
  );
}

// ─── Upload bar (single + batch) ────────────────────────────────────────────

function UploadBar({
  onImported,
  existingKeywords,
}: {
  onImported: () => void;
  existingKeywords: string[];
}) {
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [busy, setBusy] = useState(false);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const items: PendingFile[] = Array.from(files).map((f) => ({
      id: `pf_${Math.random().toString(36).slice(2)}`,
      file: f,
      keyword: detectKeywordFromFilename(f.name),
      country: "",
      status: "queued",
    }));
    setPending((prev) => [...prev, ...items]);
  }

  function update(id: string, patch: Partial<PendingFile>) {
    setPending((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function remove(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  async function runAll() {
    setBusy(true);
    for (const item of pending) {
      if (item.status !== "queued" || !item.keyword.trim()) continue;
      update(item.id, { status: "running" });
      const rows = await new Promise<Record<string, string>[]>((resolve) =>
        Papa.parse<Record<string, string>>(item.file, {
          header: true,
          skipEmptyLines: true,
          complete: (r) => resolve(r.data),
          error: () => resolve([]),
        }),
      );
      const parsed = rows.map(csvRowToSerp).filter((r) => r.url);
      if (parsed.length === 0) {
        update(item.id, { status: "error", message: "No SERP rows found (need at least URL + position)." });
        logImport({
          type: "serp-overview",
          filename: item.file.name,
          rowCount: 0,
          status: "error",
          message: "No SERP rows found",
        });
        continue;
      }
      addSerpSnapshot({
        keyword: item.keyword,
        rows: parsed,
        source: item.file.name,
        country: item.country.trim() || undefined,
      });
      logImport({
        type: "serp-overview",
        filename: item.file.name,
        rowCount: parsed.length,
        status: "ok",
        message: `Keyword: ${canonicalKeyword(item.keyword)}`,
      });
      update(item.id, { status: "done", rowCount: parsed.length });
    }
    setBusy(false);
    onImported();
  }

  function clearDone() {
    setPending((prev) => prev.filter((p) => p.status !== "done"));
  }

  const hasRunnable = pending.some((p) => p.status === "queued" && p.keyword.trim());
  const existingSet = new Set(existingKeywords);

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800">
          <Upload className="h-3.5 w-3.5" />
          Add SERP CSV(s)
          <input
            type="file"
            accept=".csv,text/csv"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <p className="text-xs text-gray-500">
          Drop one Ahrefs SERP overview CSV per keyword (single or batch). The keyword is
          auto-detected from the filename — confirm or override below before running.
        </p>
      </div>

      {pending.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">File</th>
                  <th className="px-3 py-2 text-left">Keyword</th>
                  <th className="px-3 py-2 text-left">Country</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pending.map((p) => {
                  const keywordKey = canonicalKeyword(p.keyword);
                  const existing = keywordKey && existingSet.has(keywordKey);
                  return (
                    <tr key={p.id}>
                      <td className="max-w-xs truncate px-3 py-1.5 text-xs text-gray-700" title={p.file.name}>
                        {p.file.name}
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={p.keyword}
                          onChange={(e) => update(p.id, { keyword: e.target.value })}
                          disabled={p.status !== "queued"}
                          placeholder="Required"
                          className="w-56 rounded border border-gray-300 px-2 py-1 text-xs"
                        />
                        {existing ? (
                          <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                            ↑ adds snapshot
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={p.country}
                          onChange={(e) => update(p.id, { country: e.target.value })}
                          disabled={p.status !== "queued"}
                          placeholder="CA"
                          className="w-16 rounded border border-gray-300 px-2 py-1 text-xs uppercase"
                        />
                      </td>
                      <td className="px-3 py-1.5 text-xs">
                        {p.status === "queued" ? (
                          <span className="text-gray-500">Queued</span>
                        ) : p.status === "running" ? (
                          <span className="text-blue-700">Running…</span>
                        ) : p.status === "done" ? (
                          <span className="text-emerald-700">Done · {p.rowCount} rows</span>
                        ) : (
                          <span className="text-red-700">{p.message ?? "Error"}</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {p.status !== "running" ? (
                          <button
                            type="button"
                            onClick={() => remove(p.id)}
                            className="text-xs text-red-700 hover:underline"
                          >
                            Remove
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={runAll}
              disabled={busy || !hasRunnable}
              className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
            >
              {busy
                ? "Importing…"
                : `Import ${pending.filter((p) => p.status === "queued" && p.keyword.trim()).length} file${pending.filter((p) => p.status === "queued" && p.keyword.trim()).length === 1 ? "" : "s"}`}
            </button>
            {pending.some((p) => p.status === "done") ? (
              <button
                type="button"
                onClick={clearDone}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Clear completed
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

interface PendingFile {
  id: string;
  file: File;
  keyword: string;
  country: string;
  status: "queued" | "running" | "done" | "error";
  rowCount?: number;
  message?: string;
}

// ─── By-keyword tab ─────────────────────────────────────────────────────────

function KeywordsTab({
  groups,
  competitorDomains,
  onChange,
}: {
  groups: KeywordGroup[];
  competitorDomains: Map<string, { name: string; tier: string }>;
  onChange: () => void;
}) {
  const [activeKeyword, setActiveKeyword] = useState<string | null>(groups[0]?.keyword ?? null);
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);

  // If the selected keyword no longer exists (deleted), pick the first available.
  useEffect(() => {
    if (!groups.find((g) => g.keyword === activeKeyword)) {
      setActiveKeyword(groups[0]?.keyword ?? null);
      setActiveSnapshotId(null);
    }
  }, [groups, activeKeyword]);

  if (groups.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
        No keywords tracked yet. Upload an Ahrefs SERP overview CSV above to get started.
      </div>
    );
  }

  const activeGroup = groups.find((g) => g.keyword === activeKeyword) ?? groups[0];
  const snapshot =
    activeGroup.snapshots.find((s) => s.id === activeSnapshotId) ?? activeGroup.snapshots[0];
  const previousSnapshot = activeGroup.snapshots[activeGroup.snapshots.indexOf(snapshot) + 1];

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      {/* Left: keyword list */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-[11px] uppercase tracking-wide text-gray-500">
          Tracked keywords
        </div>
        <ul className="max-h-[600px] divide-y divide-gray-100 overflow-y-auto">
          {groups.map((g) => {
            const latest = g.snapshots[0];
            const isActive = g.keyword === activeGroup.keyword;
            return (
              <li key={g.keyword}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveKeyword(g.keyword);
                    setActiveSnapshotId(null);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    isActive ? "bg-navy-50/60 font-medium text-navy-900" : "text-gray-700"
                  }`}
                >
                  <div className="truncate">{g.keyword}</div>
                  <div className="mt-0.5 text-[11px] text-gray-500">
                    {latest.rows.length} results · {g.snapshots.length} snapshot
                    {g.snapshots.length === 1 ? "" : "s"} · {new Date(latest.importedAt).toLocaleDateString("en-CA")}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right: SERP table for active snapshot */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-serif text-lg font-semibold text-navy-900">{activeGroup.keyword}</h2>
          <select
            value={snapshot.id}
            onChange={(e) => setActiveSnapshotId(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs"
          >
            {activeGroup.snapshots.map((s, i) => (
              <option key={s.id} value={s.id}>
                {i === 0 ? "Latest · " : ""}
                {new Date(s.importedAt).toLocaleString("en-CA")}
                {s.country ? ` · ${s.country}` : ""}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const cols = ["position", "domain", "url", "title", "type", "domain_rating", "page_traffic", "backlinks", "referring_domains"];
              const rows = snapshot.rows.map((r) => ({
                position: String(r.position),
                domain: r.domain,
                url: r.url,
                title: r.title,
                type: r.type ?? "",
                domain_rating: r.domainRating != null ? String(r.domainRating) : "",
                page_traffic: r.pageTraffic != null ? String(r.pageTraffic) : "",
                backlinks: r.backlinks != null ? String(r.backlinks) : "",
                referring_domains: r.referringDomains != null ? String(r.referringDomains) : "",
              }));
              const slug = activeGroup.keyword.replace(/[^a-z0-9]+/gi, "-");
              downloadCsv(
                `korporex-serp-${slug}-${new Date().toISOString().slice(0, 10)}.csv`,
                datasetToCsv({ columns: cols, rows }),
              );
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-3 w-3" /> Export
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Delete all ${activeGroup.snapshots.length} snapshot(s) for "${activeGroup.keyword}"?`,
                )
              ) {
                deleteSerpKeyword(activeGroup.keyword);
                onChange();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" /> Delete keyword
          </button>
        </div>

        <SerpTable
          snapshot={snapshot}
          previous={previousSnapshot}
          competitorDomains={competitorDomains}
        />

        {previousSnapshot ? (
          <DroppedRowsSection current={snapshot} previous={previousSnapshot} competitorDomains={competitorDomains} />
        ) : null}
      </div>
    </div>
  );
}

function SerpTable({
  snapshot,
  previous,
  competitorDomains,
}: {
  snapshot: SerpSnapshot;
  previous?: SerpSnapshot;
  competitorDomains: Map<string, { name: string; tier: string }>;
}) {
  return (
    <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-3 py-2 text-right">#</th>
            {previous ? <th className="px-3 py-2 text-right">Δ</th> : null}
            <th className="px-3 py-2 text-left">Domain</th>
            <th className="px-3 py-2 text-left">Page</th>
            <th className="px-3 py-2 text-right">DR</th>
            <th className="px-3 py-2 text-right">Page traffic</th>
            <th className="px-3 py-2 text-right">Backlinks</th>
            <th className="px-3 py-2 text-right">Ref domains</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {snapshot.rows.map((row, i) => {
            const prev = previous?.rows.find((r) => r.url === row.url);
            const delta = prev ? prev.position - row.position : undefined;
            const isNew = previous && !prev;
            const competitor = competitorDomains.get(row.domain);
            return (
              <tr key={`${row.url}_${i}`} className="hover:bg-gray-50">
                <td className="px-3 py-1.5 text-right font-mono text-xs">{row.position}</td>
                {previous ? (
                  <td className="px-3 py-1.5 text-right">
                    <DeltaCell delta={delta} isNew={!!isNew} />
                  </td>
                ) : null}
                <td className="max-w-[14rem] truncate px-3 py-1.5" title={row.domain}>
                  <span className="font-medium text-navy-900">{row.domain}</span>
                  {competitor ? (
                    <span
                      className="ml-1.5 inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800"
                      title={`Tracked competitor — ${competitor.name} (${competitor.tier})`}
                    >
                      ★ {competitor.name}
                    </span>
                  ) : null}
                  {row.type && row.type.toLowerCase() !== "organic" ? (
                    <span className="ml-1.5 inline-flex items-center rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">
                      {row.type}
                    </span>
                  ) : null}
                </td>
                <td className="max-w-md truncate px-3 py-1.5" title={row.url}>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-900 hover:underline"
                  >
                    {row.title || row.url}
                  </a>
                </td>
                <td className="px-3 py-1.5 text-right font-mono">{row.domainRating ?? "—"}</td>
                <td className="px-3 py-1.5 text-right font-mono">
                  {row.pageTraffic != null ? row.pageTraffic.toLocaleString("en-CA") : "—"}
                </td>
                <td className="px-3 py-1.5 text-right font-mono">
                  {row.backlinks != null ? row.backlinks.toLocaleString("en-CA") : "—"}
                </td>
                <td className="px-3 py-1.5 text-right font-mono">
                  {row.referringDomains != null ? row.referringDomains.toLocaleString("en-CA") : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DeltaCell({ delta, isNew }: { delta?: number; isNew: boolean }) {
  if (isNew) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
        new
      </span>
    );
  }
  if (delta === undefined) return <span className="text-gray-400">—</span>;
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-700">
        <ArrowUp className="h-3 w-3" />
        <span className="font-mono">{delta}</span>
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-red-700">
        <ArrowDown className="h-3 w-3" />
        <span className="font-mono">{Math.abs(delta)}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-gray-400">
      <Minus className="h-3 w-3" />
    </span>
  );
}

function DroppedRowsSection({
  current,
  previous,
  competitorDomains,
}: {
  current: SerpSnapshot;
  previous: SerpSnapshot;
  competitorDomains: Map<string, { name: string; tier: string }>;
}) {
  const dropped = useMemo(() => droppedSinceLast(current, previous), [current, previous]);
  if (dropped.length === 0) return null;
  return (
    <details className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <summary className="cursor-pointer text-xs font-medium text-gray-700">
        {dropped.length} URL{dropped.length === 1 ? "" : "s"} dropped out of the SERP since the previous snapshot
      </summary>
      <ul className="mt-2 space-y-1 text-xs">
        {dropped.slice(0, 20).map((r, i) => {
          const competitor = competitorDomains.get(r.domain);
          return (
            <li key={`${r.url}_${i}`} className="flex items-baseline gap-2">
              <span className="font-mono text-gray-500">was #{r.position}</span>
              <span className="font-medium text-navy-900">{r.domain}</span>
              {competitor ? (
                <span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-800">★ {competitor.name}</span>
              ) : null}
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="truncate text-navy-700 hover:underline">
                {r.url}
              </a>
            </li>
          );
        })}
        {dropped.length > 20 ? (
          <li className="text-[11px] text-gray-500">…and {dropped.length - 20} more.</li>
        ) : null}
      </ul>
    </details>
  );
}

// ─── Domain frequency tab ───────────────────────────────────────────────────

function FrequencyTab({
  groups,
  competitorDomains,
}: {
  groups: KeywordGroup[];
  competitorDomains: Map<string, { name: string; tier: string }>;
}) {
  const [topN, setTopN] = useState<3 | 10 | 20>(10);
  const [q, setQ] = useState("");
  const [competitorsOnly, setCompetitorsOnly] = useState(false);

  const entries: DomainFrequencyEntry[] = useMemo(
    () => buildDomainFrequency(groups, topN),
    [groups, topN],
  );

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return entries.filter((e) => {
      if (competitorsOnly && !competitorDomains.has(e.domain)) return false;
      if (ql && !e.domain.includes(ql)) return false;
      return true;
    });
  }, [entries, q, competitorsOnly, competitorDomains]);

  if (groups.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
        Import at least one SERP overview to see domain frequency.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1 text-xs text-gray-700">
          Top
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value) as 3 | 10 | 20)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs"
          >
            <option value={3}>3</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter domain…"
          className="w-56 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-navy-900 focus:outline-none"
        />
        <label className="flex items-center gap-1 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={competitorsOnly}
            onChange={(e) => setCompetitorsOnly(e.target.checked)}
          />
          Tracked competitors only
        </label>
        <span className="text-xs text-gray-500">
          {filtered.length.toLocaleString("en-CA")} of {entries.length.toLocaleString("en-CA")} domains
        </span>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Domain</th>
              <th className="px-3 py-2 text-right">Appears in (top {topN})</th>
              <th className="px-3 py-2 text-right">Top 3</th>
              <th className="px-3 py-2 text-right">Top 10</th>
              <th className="px-3 py-2 text-right">Best #</th>
              <th className="px-3 py-2 text-right">Avg #</th>
              <th className="px-3 py-2 text-left">Example keywords</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.slice(0, 200).map((e) => {
              const competitor = competitorDomains.get(e.domain);
              return (
                <tr key={e.domain} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5">
                    <span className="font-medium text-navy-900">{e.domain}</span>
                    {competitor ? (
                      <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                        ★ {competitor.name}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono">
                    {e.appearances} / {e.totalKeywords}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono">{e.inTop3}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{e.inTop10}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{e.bestPosition}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{e.averagePosition.toFixed(1)}</td>
                  <td className="max-w-md px-3 py-1.5 text-[11px] text-gray-600">
                    {e.exampleKeywords.join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length > 200 ? (
          <p className="border-t border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-500">
            Showing first 200 of {filtered.length.toLocaleString("en-CA")}.
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ─── Snapshots tab ──────────────────────────────────────────────────────────

function SnapshotsTab({
  snapshots,
  onChange,
}: {
  snapshots: SerpSnapshot[];
  onChange: () => void;
}) {
  if (snapshots.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
        No snapshots stored yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-3 py-2 text-left">When</th>
            <th className="px-3 py-2 text-left">Keyword</th>
            <th className="px-3 py-2 text-left">Country</th>
            <th className="px-3 py-2 text-right">Rows</th>
            <th className="px-3 py-2 text-left">Source file</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {snapshots.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-3 py-1.5 text-xs">{new Date(s.importedAt).toLocaleString("en-CA")}</td>
              <td className="px-3 py-1.5 font-medium text-navy-900">{s.keyword}</td>
              <td className="px-3 py-1.5 text-xs text-gray-600">{s.country ?? "—"}</td>
              <td className="px-3 py-1.5 text-right font-mono text-xs">{s.rows.length.toLocaleString("en-CA")}</td>
              <td className="max-w-md truncate px-3 py-1.5 text-xs text-gray-600" title={s.source}>
                {s.source ?? "—"}
              </td>
              <td className="px-3 py-1.5 text-right">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this snapshot?")) {
                      deleteSerpSnapshot(s.id);
                      onChange();
                    }
                  }}
                  className="text-xs text-red-700 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
