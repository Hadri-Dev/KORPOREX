"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import Papa from "papaparse";
import {
  type ImportHistoryEntry,
  type ImportType,
  IMPORT_TYPE_LABELS,
  clearImportHistory,
  detectImportType,
  loadImportHistory,
  logImport,
} from "@/lib/importHistory";
import {
  type Dataset,
  addSnapshot,
  datasetToCsv,
  downloadCsv,
  getActiveSnapshot,
  getSnapshotIndex,
  getSnapshot as getRawSnapshot,
} from "@/lib/seoStore";
import {
  addAcquired,
  addProspect,
  csvRowToAcquired,
  csvRowToProspect,
  loadLinkBuilding,
  saveLinkBuilding,
} from "@/lib/linkBuildingStore";
import {
  addAhrefsSnapshot,
  addGscSnapshot,
  csvRowToAhrefs,
  csvRowToGsc,
  loadAhrefsSnapshots,
  loadGscSnapshots,
} from "@/lib/rankingsStore";
import Tabs from "@/components/dashboard/seo/Tabs";

type TabId = "import" | "bulk" | "export" | "history";

export default function ImportExportClient() {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "import") as TabId;
  const tab: TabId =
    tabParam === "bulk" || tabParam === "export" || tabParam === "history"
      ? tabParam
      : "import";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Import / Export</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bulk import CSVs across the dashboard or export anything stored locally.
        </p>
      </div>

      <Tabs<TabId>
        active={tab}
        tabs={[
          { id: "import", label: "Import" },
          { id: "bulk", label: "Bulk import" },
          { id: "export", label: "Export" },
          { id: "history", label: "History" },
        ]}
      />

      {tab === "import" ? <ImportTab /> : null}
      {tab === "bulk" ? <BulkImportTab /> : null}
      {tab === "export" ? <ExportTab /> : null}
      {tab === "history" ? <HistoryTab /> : null}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function runImport(type: ImportType, parsedRows: Record<string, string>[], filename: string): { count: number; status: "ok" | "partial" | "error"; message?: string } {
  try {
    let count = 0;
    if (type === "backlinks") {
      const dataset: Dataset = {
        columns: parsedRows[0] ? Object.keys(parsedRows[0]) : [],
        rows: parsedRows,
        importedAt: new Date().toISOString(),
        source: filename,
      };
      addSnapshot("backlinks", dataset, filename);
      count = parsedRows.length;
    } else if (type === "outreach-prospects" || type === "submission-prospects") {
      let lb = loadLinkBuilding();
      for (const r of parsedRows) {
        const partial = csvRowToProspect(r, type === "outreach-prospects" ? "outreach" : "submission");
        if (!partial.domain) continue;
        lb = addProspect(lb, partial);
        count++;
      }
      saveLinkBuilding(lb);
    } else if (type === "acquired-links") {
      let lb = loadLinkBuilding();
      for (const r of parsedRows) {
        const partial = csvRowToAcquired(r);
        if (!partial.referringDomain) continue;
        lb = addAcquired(lb, partial);
        count++;
      }
      saveLinkBuilding(lb);
    } else if (type === "gsc") {
      const rows = parsedRows.map(csvRowToGsc).filter((r) => r.url);
      addGscSnapshot(rows, filename);
      count = rows.length;
    } else if (type === "ahrefs-keywords") {
      const rows = parsedRows.map(csvRowToAhrefs).filter((r) => r.keyword);
      addAhrefsSnapshot(rows, filename);
      count = rows.length;
    } else {
      return {
        count: 0,
        status: "error",
        message: `Type "${type}" must be imported from its own page (Competitors → competitor → tab).`,
      };
    }
    return { count, status: count > 0 ? "ok" : "partial", message: count === 0 ? "No matching rows found in file." : undefined };
  } catch (err) {
    return { count: 0, status: "error", message: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Import tab ─────────────────────────────────────────────────────────────

function ImportTab() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<ImportType | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [parsed, setParsed] = useState<Record<string, string>[] | null>(null);
  const [busy, setBusy] = useState(false);

  function handleSelect(f: File) {
    setFile(f);
    const detected = detectImportType(f.name);
    if (detected) setType(detected);
    Papa.parse<Record<string, string>>(f, {
      header: true,
      skipEmptyLines: true,
      preview: 0,
      complete: (r) => {
        setParsed(r.data);
        setPreview(r.data.slice(0, 10));
      },
      error: (err) => alert(`Parse failed: ${err.message}`),
    });
  }

  function handleRun() {
    if (!file || !type || !parsed) return;
    setBusy(true);
    const res = runImport(type, parsed, file.name);
    logImport({ type, filename: file.name, rowCount: res.count, status: res.status, message: res.message });
    alert(
      `${res.status === "ok" ? "✓" : res.status === "partial" ? "!" : "✗"} ${IMPORT_TYPE_LABELS[type]}: ${res.count} row${res.count === 1 ? "" : "s"}${res.message ? ` — ${res.message}` : ""}`,
    );
    setBusy(false);
    setFile(null);
    setType(null);
    setParsed(null);
    setPreview([]);
  }

  const cols = preview[0] ? Object.keys(preview[0]) : [];

  return (
    <div className="space-y-4">
      <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-sm text-gray-600 hover:border-navy-900 hover:bg-gray-50">
        <Upload className="h-6 w-6 text-gray-400" />
        <p className="mt-2 font-medium">
          {file ? file.name : "Drop a CSV here or click to browse"}
        </p>
        <p className="text-xs text-gray-500">Type is auto-detected from filename — override below if needed.</p>
        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleSelect(f);
          }}
        />
      </label>

      {file ? (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <label className="block text-xs">
              <span className="text-gray-500">Import as</span>
              <select
                value={type ?? ""}
                onChange={(e) => setType((e.target.value as ImportType) || null)}
                className="mt-1 block w-64 rounded border border-gray-300 px-2 py-1.5 text-sm"
              >
                <option value="">Pick a type…</option>
                {Object.entries(IMPORT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-xs text-gray-500">
              {parsed?.length.toLocaleString() ?? 0} rows · {cols.length} columns
            </span>
            <button
              type="button"
              onClick={handleRun}
              disabled={!type || busy}
              className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
            >
              {busy ? "Importing…" : "Run import"}
            </button>
          </div>

          {preview.length > 0 ? (
            <div className="overflow-auto rounded border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-[11px]">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {cols.map((c) => (
                      <th key={c} className="whitespace-nowrap px-2 py-1 text-left">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.map((row, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      {cols.map((c) => (
                        <td key={c} className="max-w-xs truncate px-2 py-1" title={row[c] ?? ""}>
                          {row[c] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t bg-gray-50 px-2 py-1 text-[10px] text-gray-500">Preview: first 10 rows.</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ─── Bulk import ────────────────────────────────────────────────────────────

interface BulkFileEntry {
  id: string;
  file: File;
  type: ImportType | null;
  rowCount: number;
  status: "queued" | "running" | "done" | "error";
  message?: string;
}

function BulkImportTab() {
  const [entries, setEntries] = useState<BulkFileEntry[]>([]);
  const [busy, setBusy] = useState(false);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newEntries: BulkFileEntry[] = Array.from(files).map((f) => ({
      id: `bulk_${Math.random().toString(36).slice(2)}`,
      file: f,
      type: detectImportType(f.name),
      rowCount: 0,
      status: "queued",
    }));
    setEntries((prev) => [...prev, ...newEntries]);
  }

  async function runAll() {
    setBusy(true);
    for (const entry of entries) {
      if (entry.status !== "queued" || !entry.type) continue;
      // mark running
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "running" } : e)));
      const parsed = await new Promise<Record<string, string>[]>((resolve) =>
        Papa.parse<Record<string, string>>(entry.file, {
          header: true,
          skipEmptyLines: true,
          complete: (r) => resolve(r.data),
          error: () => resolve([]),
        }),
      );
      const res = runImport(entry.type, parsed, entry.file.name);
      logImport({ type: entry.type, filename: entry.file.name, rowCount: res.count, status: res.status, message: res.message });
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? {
                ...e,
                status: res.status === "ok" ? "done" : res.status === "partial" ? "done" : "error",
                rowCount: res.count,
                message: res.message,
              }
            : e,
        ),
      );
    }
    setBusy(false);
  }

  function setEntryType(id: string, type: ImportType | null) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, type } : e)));
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-3">
      <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-sm text-gray-600 hover:border-navy-900 hover:bg-gray-50">
        <Upload className="h-5 w-5 text-gray-400" />
        <p className="mt-1 font-medium">Drop multiple CSVs or click to browse</p>
        <input
          type="file"
          accept=".csv,text/csv"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {entries.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">File</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-right">Rows</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="max-w-xs truncate px-3 py-1.5" title={e.file.name}>
                    {e.file.name}
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={e.type ?? ""}
                      onChange={(ev) => setEntryType(e.id, (ev.target.value as ImportType) || null)}
                      disabled={e.status !== "queued"}
                      className="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs"
                    >
                      <option value="">—</option>
                      {Object.entries(IMPORT_TYPE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono text-xs">
                    {e.rowCount > 0 ? e.rowCount : "—"}
                  </td>
                  <td className="px-3 py-1.5 text-xs">
                    {e.status === "queued" ? (
                      <span className="text-gray-500">Queued</span>
                    ) : e.status === "running" ? (
                      <span className="text-blue-700">Running…</span>
                    ) : e.status === "done" ? (
                      <span className="text-emerald-700">Done</span>
                    ) : (
                      <span className="text-red-700">{e.message ?? "Error"}</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {e.status !== "running" ? (
                      <button
                        type="button"
                        onClick={() => remove(e.id)}
                        className="text-xs text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {entries.length > 0 ? (
        <button
          type="button"
          onClick={runAll}
          disabled={busy || entries.every((e) => e.status !== "queued" || !e.type)}
          className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
        >
          {busy ? "Running…" : `Run ${entries.filter((e) => e.status === "queued" && e.type).length} import${entries.filter((e) => e.status === "queued" && e.type).length === 1 ? "" : "s"}`}
        </button>
      ) : null}
    </div>
  );
}

// ─── Export tab ─────────────────────────────────────────────────────────────

interface ExportSource {
  id: string;
  label: string;
  rowCount: number;
  exporter: () => { columns: string[]; rows: Record<string, string>[] };
}

function ExportTab() {
  const [sources, setSources] = useState<ExportSource[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSources(buildExportSources());
  }, []);

  const selected = sources.find((s) => s.id === selectedId);

  function handleExport() {
    if (!selected) return;
    const data = selected.exporter();
    const csv = datasetToCsv(data);
    const stamp = new Date().toISOString().slice(0, 10);
    const slug = selected.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    downloadCsv(`korporex-${slug}-${stamp}.csv`, csv);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Pick a data source to export. Whatever&rsquo;s currently in your browser&rsquo;s storage gets
        written to CSV.
      </p>
      <select
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(e.target.value || null)}
        className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Pick a source…</option>
        {sources.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label} ({s.rowCount.toLocaleString()} rows)
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleExport}
        disabled={!selected || selected.rowCount === 0}
        className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </button>
    </div>
  );
}

function buildExportSources(): ExportSource[] {
  const sources: ExportSource[] = [];

  // Backlinks active snapshot
  const blIndex = getSnapshotIndex("backlinks");
  if (blIndex.activeId) {
    const blSnap = getActiveSnapshot("backlinks").snapshot;
    if (blSnap) {
      sources.push({
        id: "backlinks-active",
        label: "Backlinks (active snapshot)",
        rowCount: blSnap.rows.length,
        exporter: () => ({ columns: blSnap.columns, rows: blSnap.rows }),
      });
    }
  }
  for (const meta of blIndex.snapshots) {
    sources.push({
      id: `backlinks-${meta.id}`,
      label: `Backlinks · ${meta.label ?? new Date(meta.importedAt).toLocaleDateString("en-CA")}`,
      rowCount: meta.rowCount,
      exporter: () => {
        const s = getRawSnapshot("backlinks", meta.id);
        return s ? { columns: s.columns, rows: s.rows } : { columns: [], rows: [] };
      },
    });
  }

  // Link Building tables
  const lb = loadLinkBuilding();
  const outreach = lb.prospects.filter((p) => p.type === "outreach");
  const submissions = lb.prospects.filter((p) => p.type === "submission");
  if (outreach.length) {
    sources.push({
      id: "lb-outreach",
      label: "Outreach prospects",
      rowCount: outreach.length,
      exporter: () => ({
        columns: ["domain", "dr", "cost", "contact_email", "status", "notes"],
        rows: outreach.map((p) => ({
          domain: p.domain,
          dr: String(p.dr),
          cost: String(p.cost),
          contact_email: p.contactEmail,
          status: p.status,
          notes: p.notes,
        })),
      }),
    });
  }
  if (submissions.length) {
    sources.push({
      id: "lb-submissions",
      label: "Submission prospects",
      rowCount: submissions.length,
      exporter: () => ({
        columns: ["domain", "dr", "cost", "submission_url", "status", "notes"],
        rows: submissions.map((p) => ({
          domain: p.domain,
          dr: String(p.dr),
          cost: String(p.cost),
          submission_url: p.submissionUrl,
          status: p.status,
          notes: p.notes,
        })),
      }),
    });
  }
  if (lb.acquired.length) {
    sources.push({
      id: "lb-acquired",
      label: "Acquired links",
      rowCount: lb.acquired.length,
      exporter: () => ({
        columns: [
          "referring_domain",
          "anchor_text",
          "target_url",
          "link_type",
          "date_acquired",
          "dr",
          "cost",
          "billing_cycle",
          "status",
        ],
        rows: lb.acquired.map((l) => ({
          referring_domain: l.referringDomain,
          anchor_text: l.anchorText,
          target_url: l.targetUrl,
          link_type: l.linkType,
          date_acquired: l.dateAcquired,
          dr: String(l.dr),
          cost: String(l.cost),
          billing_cycle: l.billingCycle,
          status: l.status,
        })),
      }),
    });
  }

  // GSC + Ahrefs latest snapshot
  const gscSnaps = loadGscSnapshots();
  if (gscSnaps[0]) {
    const s = gscSnaps[0];
    sources.push({
      id: `gsc-${s.id}`,
      label: `GSC (${new Date(s.importedAt).toLocaleDateString("en-CA")})`,
      rowCount: s.rows.length,
      exporter: () => ({
        columns: ["url", "query", "clicks", "impressions", "ctr", "position"],
        rows: s.rows.map((r) => ({
          url: r.url,
          query: r.query ?? "",
          clicks: String(r.clicks),
          impressions: String(r.impressions),
          ctr: String(r.ctr),
          position: String(r.position),
        })),
      }),
    });
  }
  const ahrefsSnaps = loadAhrefsSnapshots();
  if (ahrefsSnaps[0]) {
    const s = ahrefsSnaps[0];
    sources.push({
      id: `ahrefs-${s.id}`,
      label: `Ahrefs keywords (${new Date(s.importedAt).toLocaleDateString("en-CA")})`,
      rowCount: s.rows.length,
      exporter: () => ({
        columns: ["keyword", "url", "position", "search_volume", "traffic", "kd"],
        rows: s.rows.map((r) => ({
          keyword: r.keyword,
          url: r.url,
          position: String(r.position),
          search_volume: String(r.searchVolume),
          traffic: String(r.traffic),
          kd: String(r.difficulty),
        })),
      }),
    });
  }

  return sources;
}

// ─── History tab ────────────────────────────────────────────────────────────

function HistoryTab() {
  const [entries, setEntries] = useState<ImportHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadImportHistory());
  }, []);

  const summary = useMemo(() => {
    const byType = new Map<ImportType, number>();
    for (const e of entries) {
      byType.set(e.type, (byType.get(e.type) ?? 0) + e.rowCount);
    }
    return Array.from(byType.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">{entries.length} imports logged</span>
        {entries.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear import history? This is just the log; imported data is unaffected.")) {
                clearImportHistory();
                setEntries([]);
              }
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear log
          </button>
        ) : null}
      </div>

      {summary.length > 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total rows imported by type
          </p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {summary.map(([t, count]) => (
              <li key={t} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{IMPORT_TYPE_LABELS[t]}</span>
                <span className="font-mono text-gray-900">{count.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">When</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">File</th>
              <th className="px-3 py-2 text-right">Rows</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-500">
                  No imports logged yet.
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 text-xs">
                    {new Date(e.importedAt).toLocaleString("en-CA")}
                  </td>
                  <td className="px-3 py-1.5">{IMPORT_TYPE_LABELS[e.type]}</td>
                  <td className="max-w-xs truncate px-3 py-1.5 align-top text-xs text-gray-700" title={e.filename}>
                    <FileText className="mr-1 inline h-3 w-3 text-gray-400" />
                    {e.filename}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono text-xs">{e.rowCount.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-xs">
                    {e.status === "ok" ? (
                      <span className="text-emerald-700">OK</span>
                    ) : e.status === "partial" ? (
                      <span className="text-amber-700">Partial</span>
                    ) : (
                      <span className="text-red-700">Error</span>
                    )}
                    {e.message ? <span className="ml-2 text-[10px] text-gray-500">{e.message}</span> : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
