"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Inbox,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

interface Row {
  id: number;
  path: string;
  hit_count: number;
  first_seen: string;
  last_seen: string;
  last_referer: string | null;
  last_user_agent: string | null;
  last_ip: string | null;
  archived: boolean;
}

interface ListResponse {
  configured: boolean;
  rows: Row[];
  total: number;
  page: number;
  pageSize: number;
}

type StatusFilter = "active" | "archived" | "all";
type SortKey = "last" | "hits" | "first";

function relative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const sec = Math.round((now - then) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-CA");
}

export default function NotFoundLogClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [status, setStatus] = useState<StatusFilter>("active");
  const [sort, setSort] = useState<SortKey>("last");
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      status,
      sort,
      page: String(page),
    });
    if (qDebounced) params.set("q", qDebounced);

    try {
      const res = await fetch(`/api/seo/not-found-log?${params.toString()}`);
      if (!res.ok) {
        setError(`Failed to load (HTTP ${res.status})`);
        setRows([]);
        setTotal(0);
        return;
      }
      const json = (await res.json()) as ListResponse;
      setRows(json.rows);
      setTotal(json.total);
      setPageSize(json.pageSize);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status, sort, page, qDebounced]);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [status, sort, qDebounced]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someSelected = selected.size > 0;

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  }

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkAction(action: "archive" | "unarchive" | "delete") {
    if (!someSelected) return;
    if (action === "delete") {
      if (
        !confirm(
          `Delete ${selected.size} 404 ${selected.size === 1 ? "entry" : "entries"}? This cannot be undone.`,
        )
      ) {
        return;
      }
    }
    setBusy(true);
    try {
      const res = await fetch("/api/seo/not-found-log/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Bulk action failed (HTTP ${res.status})`);
      } else {
        await fetchRows();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk action failed");
    } finally {
      setBusy(false);
    }
  }

  const summary = useMemo(() => {
    const visibleHits = rows.reduce((acc, r) => acc + r.hit_count, 0);
    return { rowsVisible: rows.length, visibleHits, total };
  }, [rows, total]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">404 Log</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visitor 404s captured by the public site&rsquo;s not-found page.
            Aggregated by path; refresh to see the latest.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchRows()}
          disabled={loading || busy}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-md bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <span>
          <strong className="text-gray-900">{summary.rowsVisible}</strong> shown
          <span className="text-gray-400"> · </span>
          <strong className="text-gray-900">{summary.total}</strong> total
          <span className="text-gray-400"> · </span>
          <strong className="text-gray-900">{summary.visibleHits.toLocaleString("en-CA")}</strong> hits on this page
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search path…"
            className="w-72 rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-navy-900 focus:outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-900 focus:border-navy-900 focus:outline-none"
        >
          <option value="active">Active only</option>
          <option value="archived">Archived only</option>
          <option value="all">All</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-900 focus:border-navy-900 focus:outline-none"
        >
          <option value="last">Sort: last seen</option>
          <option value="hits">Sort: hit count</option>
          <option value="first">Sort: first seen</option>
        </select>

        {someSelected ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">{selected.size} selected</span>
            {status !== "archived" ? (
              <button
                type="button"
                onClick={() => void bulkAction("archive")}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Archive className="h-3 w-3" />
                Archive
              </button>
            ) : null}
            {status !== "active" ? (
              <button
                type="button"
                onClick={() => void bulkAction("unarchive")}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArchiveRestore className="h-3 w-3" />
                Unarchive
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void bulkAction("delete")}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all on this page"
                />
              </th>
              <th className="px-3 py-2 text-left">Path</th>
              <th className="px-3 py-2 text-right">Hits</th>
              <th className="px-3 py-2 text-left">Last seen</th>
              <th className="px-3 py-2 text-left">First seen</th>
              <th className="w-10 px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center text-sm text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center">
                  <Inbox className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    No 404 hits {status === "archived" ? "archived yet" : "yet"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    The beacon writes here when a visitor lands on a page that doesn&rsquo;t exist.
                  </p>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isExpanded = expanded.has(row.id);
                return (
                  <Row
                    key={row.id}
                    row={row}
                    selected={selected.has(row.id)}
                    onToggleSelect={() => toggleSelect(row.id)}
                    expanded={isExpanded}
                    onToggleExpand={() => toggleExpand(row.id)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-3 w-3" />
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  function Row({
    row,
    selected,
    onToggleSelect,
    expanded,
    onToggleExpand,
  }: {
    row: Row;
    selected: boolean;
    onToggleSelect: () => void;
    expanded: boolean;
    onToggleExpand: () => void;
  }) {
    return (
      <>
        <tr className={selected ? "bg-amber-50" : "hover:bg-gray-50"}>
          <td className="px-3 py-2 align-top">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              aria-label={`Select ${row.path}`}
            />
          </td>
          <td className="max-w-md px-3 py-2 align-top">
            <button
              type="button"
              onClick={onToggleExpand}
              className="block w-full truncate text-left font-mono text-xs text-navy-900 hover:underline"
              title={row.path}
            >
              {row.path}
            </button>
            {row.archived ? (
              <span className="mt-0.5 inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-700">
                archived
              </span>
            ) : null}
          </td>
          <td className="px-3 py-2 text-right align-top font-mono text-xs text-gray-900">
            {row.hit_count.toLocaleString("en-CA")}
          </td>
          <td className="px-3 py-2 align-top text-xs text-gray-700" title={row.last_seen}>
            {relative(row.last_seen)}
          </td>
          <td className="px-3 py-2 align-top text-xs text-gray-500" title={row.first_seen}>
            {relative(row.first_seen)}
          </td>
          <td className="px-3 py-2 align-top text-right">
            <button
              type="button"
              onClick={onToggleExpand}
              className="text-xs text-navy-900 hover:underline"
            >
              {expanded ? "Hide" : "Details"}
            </button>
          </td>
        </tr>
        {expanded ? (
          <tr className="bg-gray-50">
            <td></td>
            <td colSpan={5} className="px-3 py-3 text-xs text-gray-700">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-[7rem_1fr]">
                <dt className="text-gray-500">Last referer</dt>
                <dd className="font-mono break-all">{row.last_referer ?? "—"}</dd>
                <dt className="text-gray-500">Last user agent</dt>
                <dd className="font-mono break-all">{row.last_user_agent ?? "—"}</dd>
                <dt className="text-gray-500">Last IP</dt>
                <dd className="font-mono">{row.last_ip ?? "—"}</dd>
                <dt className="text-gray-500">First seen</dt>
                <dd>{new Date(row.first_seen).toLocaleString("en-CA")}</dd>
                <dt className="text-gray-500">Last seen</dt>
                <dd>{new Date(row.last_seen).toLocaleString("en-CA")}</dd>
              </dl>
            </td>
          </tr>
        ) : null}
      </>
    );
  }
}
