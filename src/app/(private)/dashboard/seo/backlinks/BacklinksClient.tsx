"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Inbox, Trash2, Filter as FilterIcon } from "lucide-react";
import {
  type Dataset,
  type Snapshot,
  type SnapshotIndex,
  addSnapshot,
  clearAllSnapshots,
  datasetToCsv,
  deleteSnapshot,
  downloadCsv,
  getActiveSnapshot,
  getSnapshot,
  renameSnapshot,
  setActiveSnapshot,
} from "@/lib/seoStore";
import {
  resolveBacklinkColumns,
  rowDomain,
  rowDr,
  rowIsDofollow,
  getCell,
  type BacklinkColumns,
} from "@/lib/backlinkColumns";
import CsvImporter from "@/components/dashboard/seo/CsvImporter";
import SnapshotPicker from "@/components/dashboard/seo/SnapshotPicker";
import SummaryStat from "@/components/dashboard/seo/SummaryStat";
import Tabs from "@/components/dashboard/seo/Tabs";

type TabId = "overview" | "comparison" | "domains";

export default function BacklinksClient() {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "overview") as TabId;
  const tab: TabId =
    tabParam === "comparison" || tabParam === "domains"
      ? tabParam
      : "overview";

  const [hydrated, setHydrated] = useState(false);
  const [index, setIndex] = useState<SnapshotIndex>({ snapshots: [], activeId: null });
  const [active, setActive] = useState<Snapshot | null>(null);

  useEffect(() => {
    const { snapshot, index } = getActiveSnapshot("backlinks");
    setIndex(index);
    setActive(snapshot);
    setHydrated(true);
  }, []);

  function handleImported(dataset: Dataset) {
    const next = addSnapshot("backlinks", dataset);
    setIndex(next);
    if (next.activeId) setActive(getSnapshot("backlinks", next.activeId));
  }

  function handleSelect(id: string) {
    const next = setActiveSnapshot("backlinks", id);
    setIndex(next);
    setActive(getSnapshot("backlinks", id));
  }

  function handleRename(id: string, label: string | undefined) {
    setIndex(renameSnapshot("backlinks", id, label));
  }

  function handleDelete(id: string) {
    const next = deleteSnapshot("backlinks", id);
    setIndex(next);
    if (next.activeId) setActive(getSnapshot("backlinks", next.activeId));
    else setActive(null);
  }

  function handleClearAll() {
    if (
      !confirm(
        `Delete all ${index.snapshots.length} backlinks snapshots from this browser?`,
      )
    )
      return;
    clearAllSnapshots("backlinks");
    setIndex({ snapshots: [], activeId: null });
    setActive(null);
  }

  function handleExport() {
    if (!active) return;
    const csv = datasetToCsv({ columns: active.columns, rows: active.rows });
    const stamp = new Date(active.importedAt).toISOString().slice(0, 10);
    const lbl = active.label
      ? active.label.replace(/[^a-z0-9-]+/gi, "-").toLowerCase()
      : stamp;
    downloadCsv(`korporex-backlinks-${lbl}.csv`, csv);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">Backlinks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Inbound links from Ahrefs / SEMrush exports. Each import is stored as a snapshot —
            switch between snapshots to compare history.
          </p>
        </div>
        {active ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export active
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
        ) : null}
      </div>

      {!hydrated ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
          Loading…
        </div>
      ) : index.snapshots.length === 0 ? (
        <>
          <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
            <Inbox className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No snapshots yet</p>
            <p className="mt-1 text-xs text-gray-500">
              Paste a CSV below or upload a file to create the first snapshot.
            </p>
          </div>
          <CsvImporter
            onImported={handleImported}
            datasetLabel="Backlinks"
            helperText="Typical Ahrefs columns: Referring page URL, Referring domain, Domain rating, URL rating, Anchor, Target URL, Type."
          />
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="space-y-4">
            <SnapshotPicker
              index={index}
              onSelect={handleSelect}
              onRename={handleRename}
              onDelete={handleDelete}
            />
            <details className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
              <summary className="cursor-pointer font-medium text-gray-700">
                Import new snapshot
              </summary>
              <div className="mt-2">
                <CsvImporter
                  onImported={handleImported}
                  datasetLabel="Backlinks"
                />
              </div>
            </details>
          </aside>

          <div className="min-w-0 space-y-5">
            {active ? (
              <>
                <SnapshotSummary snapshot={active} />
                <Tabs<TabId>
                  active={tab}
                  tabs={[
                    { id: "overview", label: "Overview" },
                    { id: "comparison", label: "Comparison" },
                    { id: "domains", label: "Domains" },
                  ]}
                />
                {tab === "overview" ? <OverviewTab snapshot={active} /> : null}
                {tab === "comparison" ? (
                  <ComparisonTab activeId={active.id} index={index} />
                ) : null}
                {tab === "domains" ? <DomainsTab snapshot={active} /> : null}
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
                Pick a snapshot from the left.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary stats ──────────────────────────────────────────────────────────

function SnapshotSummary({ snapshot }: { snapshot: Snapshot }) {
  const cols = useMemo(() => resolveBacklinkColumns(snapshot.columns), [snapshot.columns]);
  const stats = useMemo(() => computeStats(snapshot, cols), [snapshot, cols]);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryStat label="Total backlinks" value={stats.total} />
      <SummaryStat
        label="Unique referring domains"
        value={stats.uniqueDomains}
      />
      <SummaryStat
        label="Dofollow / Nofollow"
        value={`${stats.dofollow.toLocaleString("en-CA")} / ${stats.nofollow.toLocaleString("en-CA")}`}
        hint={
          stats.total
            ? `${Math.round((stats.dofollow / stats.total) * 100)}% dofollow`
            : undefined
        }
      />
      <SummaryStat
        label="High-DR (30+ / 50+ / 70+)"
        value={`${stats.dr30}/${stats.dr50}/${stats.dr70}`}
        hint="Referring domains by Domain Rating tier"
      />
    </div>
  );
}

function computeStats(snapshot: Snapshot, cols: BacklinkColumns) {
  const total = snapshot.rows.length;
  const domains = new Set<string>();
  const drByDomain = new Map<string, number>();
  let dofollow = 0;
  let nofollow = 0;
  for (const row of snapshot.rows) {
    const domain = rowDomain(row, cols);
    if (domain) {
      domains.add(domain);
      const dr = rowDr(row, cols);
      const prev = drByDomain.get(domain) ?? 0;
      if (dr > prev) drByDomain.set(domain, dr);
    }
    if (rowIsDofollow(row, cols)) dofollow++;
    else nofollow++;
  }
  let dr30 = 0;
  let dr50 = 0;
  let dr70 = 0;
  drByDomain.forEach((dr) => {
    if (dr >= 30) dr30++;
    if (dr >= 50) dr50++;
    if (dr >= 70) dr70++;
  });
  return {
    total,
    uniqueDomains: domains.size,
    dofollow,
    nofollow,
    dr30,
    dr50,
    dr70,
  };
}

// ─── Overview tab ───────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

function OverviewTab({ snapshot }: { snapshot: Snapshot }) {
  const cols = useMemo(
    () => resolveBacklinkColumns(snapshot.columns),
    [snapshot.columns],
  );

  const [q, setQ] = useState("");
  const [dofollowOnly, setDofollowOnly] = useState(false);
  const [drMin, setDrMin] = useState<number | "">("");
  const [drMax, setDrMax] = useState<number | "">("");
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" } | null>(
    cols.domainRating ? { col: cols.domainRating, dir: "desc" } : null,
  );
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return snapshot.rows.filter((row) => {
      if (dofollowOnly && !rowIsDofollow(row, cols)) return false;
      const dr = rowDr(row, cols);
      if (typeof drMin === "number" && dr < drMin) return false;
      if (typeof drMax === "number" && dr > drMax) return false;
      if (ql) {
        const haystack = [
          getCell(row, cols, "sourceUrl"),
          getCell(row, cols, "sourceDomain"),
          getCell(row, cols, "anchor"),
          getCell(row, cols, "targetUrl"),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(ql)) return false;
      }
      return true;
    });
  }, [snapshot.rows, cols, q, dofollowOnly, drMin, drMax]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const numeric =
      sort.col === cols.domainRating ||
      sort.col === cols.urlRating ||
      sort.col === cols.traffic;
    return [...filtered].sort((a, b) => {
      const av = a[sort.col] ?? "";
      const bv = b[sort.col] ?? "";
      if (numeric) {
        const an = parseFloat(av.replace(/[%,\s]/g, "")) || 0;
        const bn = parseFloat(bv.replace(/[%,\s]/g, "")) || 0;
        return sort.dir === "asc" ? an - bn : bn - an;
      }
      return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sort, cols]);

  useEffect(() => setPage(0), [q, dofollowOnly, drMin, drMax, snapshot.id]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function toggleSort(col: string) {
    setSort((prev) => {
      if (!prev || prev.col !== col) return { col, dir: "desc" };
      if (prev.dir === "desc") return { col, dir: "asc" };
      return null;
    });
  }

  // Show a curated subset of columns when we recognize Ahrefs shape;
  // otherwise fall back to ALL columns from the import.
  const displayCols = useMemo(() => {
    const known = [
      cols.sourceUrl,
      cols.sourceDomain,
      cols.domainRating,
      cols.urlRating,
      cols.anchor,
      cols.targetUrl,
      cols.linkType,
      cols.traffic,
    ].filter((c): c is string => Boolean(c));
    return known.length >= 4 ? known : snapshot.columns;
  }, [cols, snapshot.columns]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm">
        <FilterIcon className="h-3.5 w-3.5 text-gray-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search URL / domain / anchor / target…"
          className="flex-1 min-w-[12rem] rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-navy-900 focus:outline-none"
        />
        <label className="flex items-center gap-1.5 text-xs text-gray-700">
          <input
            type="checkbox"
            checked={dofollowOnly}
            onChange={(e) => setDofollowOnly(e.target.checked)}
          />
          Dofollow only
        </label>
        <label className="flex items-center gap-1 text-xs text-gray-700">
          DR min
          <input
            type="number"
            value={drMin}
            onChange={(e) =>
              setDrMin(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-14 rounded border border-gray-300 bg-white px-1.5 py-1 text-xs"
          />
        </label>
        <label className="flex items-center gap-1 text-xs text-gray-700">
          DR max
          <input
            type="number"
            value={drMax}
            onChange={(e) =>
              setDrMax(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-14 rounded border border-gray-300 bg-white px-1.5 py-1 text-xs"
          />
        </label>
        <span className="ml-auto text-xs text-gray-500">
          {sorted.length.toLocaleString("en-CA")} of{" "}
          {snapshot.rows.length.toLocaleString("en-CA")} rows
        </span>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr>
              {displayCols.map((c) => {
                const isActive = sort?.col === c;
                return (
                  <th
                    key={c}
                    className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c)}
                      className="hover:text-navy-900"
                    >
                      {c}
                      {isActive ? (sort?.dir === "asc" ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={displayCols.length}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  No matching rows.
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr key={safePage * PAGE_SIZE + i} className="hover:bg-gray-50">
                  {displayCols.map((c) => {
                    const v = row[c] ?? "";
                    return (
                      <td
                        key={c}
                        className="max-w-xs truncate px-3 py-1.5 align-top"
                        title={v}
                      >
                        {v.startsWith("http") ? (
                          <a
                            href={v}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy-900 hover:underline"
                          >
                            {v}
                          </a>
                        ) : (
                          v
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            Page {safePage + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Comparison tab ─────────────────────────────────────────────────────────

function ComparisonTab({
  activeId,
  index,
}: {
  activeId: string;
  index: SnapshotIndex;
}) {
  const otherChoices = index.snapshots.filter((s) => s.id !== activeId);
  const [otherId, setOtherId] = useState<string | null>(otherChoices[0]?.id ?? null);

  const a = useMemo(() => (otherId ? getSnapshot("backlinks", otherId) : null), [otherId]);
  const b = useMemo(() => getSnapshot("backlinks", activeId), [activeId]);

  if (!a || !b) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
        {index.snapshots.length < 2
          ? "Import at least one more snapshot to enable comparison."
          : "Pick a snapshot to compare against."}
      </div>
    );
  }

  const colsA = resolveBacklinkColumns(a.columns);
  const colsB = resolveBacklinkColumns(b.columns);

  const aUrls = new Map<string, Record<string, string>>();
  const bUrls = new Map<string, Record<string, string>>();
  for (const r of a.rows) {
    const url = getCell(r, colsA, "sourceUrl");
    if (url) aUrls.set(url, r);
  }
  for (const r of b.rows) {
    const url = getCell(r, colsB, "sourceUrl");
    if (url) bUrls.set(url, r);
  }

  const lost: string[] = [];
  const gained: string[] = [];
  aUrls.forEach((_, url) => {
    if (!bUrls.has(url)) lost.push(url);
  });
  bUrls.forEach((_, url) => {
    if (!aUrls.has(url)) gained.push(url);
  });
  const unchanged = aUrls.size - lost.length;

  const aDomains = new Set<string>();
  const bDomains = new Set<string>();
  for (const r of a.rows) aDomains.add(rowDomain(r, colsA));
  for (const r of b.rows) bDomains.add(rowDomain(r, colsB));
  aDomains.delete("");
  bDomains.delete("");
  const lostDomains = Array.from(aDomains).filter((d) => !bDomains.has(d));
  const gainedDomains = Array.from(bDomains).filter((d) => !aDomains.has(d));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-md bg-gray-50 px-3 py-2 text-sm">
        <label className="text-xs text-gray-700">
          Compare against
          <select
            value={otherId ?? ""}
            onChange={(e) => setOtherId(e.target.value || null)}
            className="ml-2 rounded border border-gray-300 bg-white px-2 py-1 text-xs"
          >
            {otherChoices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? new Date(s.importedAt).toLocaleString("en-CA")} · {s.rowCount.toLocaleString()} rows
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryStat label="Lost links (URLs)" value={lost.length} tone="bad" />
        <SummaryStat label="Gained links (URLs)" value={gained.length} tone="good" />
        <SummaryStat label="Unchanged" value={unchanged} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryStat
          label="Lost domains"
          value={lostDomains.length}
          tone="bad"
          hint="In old snapshot, gone from current"
        />
        <SummaryStat
          label="New domains"
          value={gainedDomains.length}
          tone="good"
          hint="In current snapshot, not in old one"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DiffList title="Gained" tone="good" urls={gained.slice(0, 200)} total={gained.length} />
        <DiffList title="Lost" tone="bad" urls={lost.slice(0, 200)} total={lost.length} />
      </div>
    </div>
  );
}

function DiffList({
  title,
  urls,
  tone,
  total,
}: {
  title: string;
  urls: string[];
  tone: "good" | "bad";
  total: number;
}) {
  const ring = tone === "good" ? "border-emerald-200" : "border-red-200";
  const head = tone === "good" ? "text-emerald-800" : "text-red-800";
  return (
    <div className={`overflow-hidden rounded-lg border ${ring} bg-white shadow-sm`}>
      <header className="border-b border-gray-100 px-3 py-2">
        <p className={`text-xs font-semibold uppercase tracking-wide ${head}`}>
          {title}
          <span className="ml-2 text-gray-500">
            {total > urls.length ? `${urls.length} of ${total}` : total}
          </span>
        </p>
      </header>
      {urls.length === 0 ? (
        <p className="px-3 py-4 text-xs text-gray-500">None.</p>
      ) : (
        <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto text-xs">
          {urls.map((u) => (
            <li key={u} className="truncate px-3 py-1.5" title={u}>
              <a
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-900 hover:underline"
              >
                {u}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Domains tab ────────────────────────────────────────────────────────────

interface DomainGroup {
  domain: string;
  count: number;
  topDr: number;
  dofollow: number;
  nofollow: number;
  sampleUrls: string[];
}

function DomainsTab({ snapshot }: { snapshot: Snapshot }) {
  const cols = useMemo(
    () => resolveBacklinkColumns(snapshot.columns),
    [snapshot.columns],
  );
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const map = new Map<string, DomainGroup>();
    for (const row of snapshot.rows) {
      const domain = rowDomain(row, cols);
      if (!domain) continue;
      const existing = map.get(domain);
      const url = getCell(row, cols, "sourceUrl");
      const dr = rowDr(row, cols);
      const dofollow = rowIsDofollow(row, cols);
      if (existing) {
        existing.count++;
        if (dr > existing.topDr) existing.topDr = dr;
        if (dofollow) existing.dofollow++;
        else existing.nofollow++;
        if (url && existing.sampleUrls.length < 5) existing.sampleUrls.push(url);
      } else {
        map.set(domain, {
          domain,
          count: 1,
          topDr: dr,
          dofollow: dofollow ? 1 : 0,
          nofollow: dofollow ? 0 : 1,
          sampleUrls: url ? [url] : [],
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [snapshot, cols]);

  const filtered = useMemo(() => {
    if (!q.trim()) return groups;
    const ql = q.toLowerCase();
    return groups.filter((g) => g.domain.includes(ql));
  }, [groups, q]);

  function toggle(d: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter domains…"
          className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:border-navy-900 focus:outline-none"
        />
        <span className="text-xs text-gray-500">
          {filtered.length.toLocaleString("en-CA")} of{" "}
          {groups.length.toLocaleString("en-CA")} domains
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Domain</th>
              <th className="px-3 py-2 text-right">Links</th>
              <th className="px-3 py-2 text-right">Top DR</th>
              <th className="px-3 py-2 text-right">Dofollow / Nofollow</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((g) => {
              const expanded = open.has(g.domain);
              return (
                <FragmentRow
                  key={g.domain}
                  group={g}
                  expanded={expanded}
                  onToggle={() => toggle(g.domain)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentRow({
  group,
  expanded,
  onToggle,
}: {
  group: DomainGroup;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-3 py-1.5 align-top">
          <a
            href={`https://${group.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy-900 hover:underline"
          >
            {group.domain}
          </a>
        </td>
        <td className="px-3 py-1.5 text-right align-top font-mono">{group.count}</td>
        <td className="px-3 py-1.5 text-right align-top font-mono">{group.topDr}</td>
        <td className="px-3 py-1.5 text-right align-top font-mono">
          {group.dofollow} / {group.nofollow}
        </td>
        <td className="px-3 py-1.5 text-right align-top">
          <button
            type="button"
            onClick={onToggle}
            className="text-xs text-navy-900 hover:underline"
          >
            {expanded ? "Hide" : "Show URLs"}
          </button>
        </td>
      </tr>
      {expanded ? (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-3 py-2">
            <ul className="space-y-1">
              {group.sampleUrls.map((u) => (
                <li key={u} className="truncate" title={u}>
                  <a
                    href={u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-navy-900 hover:underline"
                  >
                    {u}
                  </a>
                </li>
              ))}
              {group.count > group.sampleUrls.length ? (
                <li className="text-xs text-gray-500">
                  …and {group.count - group.sampleUrls.length} more
                </li>
              ) : null}
            </ul>
          </td>
        </tr>
      ) : null}
    </>
  );
}
