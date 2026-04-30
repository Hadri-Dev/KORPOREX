"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Sparkles, Trash2, X } from "lucide-react";
import Tabs from "@/components/dashboard/seo/Tabs";
import SummaryStat from "@/components/dashboard/seo/SummaryStat";

type TabId = "kanban" | "list" | "calendar" | "consolidations";

interface PageRow {
  id: number;
  page_path: string;
  title: string;
  page_type: string;
  status: "draft" | "scheduled" | "published" | "stale";
  scheduled_date: string | null;
  last_reviewed_at: string | null;
  notes: string;
  gsc_clicks: number;
  gsc_impressions: number;
  gsc_position: number;
  needs_fact_check: boolean;
  old_url: string | null;
  new_url: string | null;
  updated_at: string;
}

interface ConsolidationRow {
  id: number;
  keep_url: string;
  merge_url: string;
  status: "planned" | "approved" | "merged" | "reverted";
  note: string;
  pre_merge_keep_clicks: number | null;
  pre_merge_merge_clicks: number | null;
  post_merge_clicks: number | null;
  post_merge_measured_at: string | null;
  merged_at: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<PageRow["status"], string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  stale: "Stale (365d+)",
};

const STATUS_COLORS: Record<PageRow["status"], string> = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  stale: "bg-red-100 text-red-800",
};

const KANBAN_COLUMNS: PageRow["status"][] = ["draft", "scheduled", "published", "stale"];

export default function ContentPipelineClient() {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "kanban") as TabId;
  const tab: TabId =
    tabParam === "list" || tabParam === "calendar" || tabParam === "consolidations"
      ? tabParam
      : "kanban";

  const [pages, setPages] = useState<PageRow[]>([]);
  const [consolidations, setConsolidations] = useState<ConsolidationRow[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    const seedFlag = pages.length === 0 ? "?seed=1" : "";
    const res = await fetch(`/api/seo/content-pipeline/pages${seedFlag}`);
    if (!res.ok) {
      setError(`Pages load failed (HTTP ${res.status})`);
      return;
    }
    const json = await res.json();
    setConfigured(json.configured ?? true);
    setPages(json.rows ?? []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConsolidations = useCallback(async () => {
    const res = await fetch("/api/seo/content-pipeline/consolidations");
    if (!res.ok) return;
    const json = await res.json();
    setConsolidations(json.rows ?? []);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPages(), fetchConsolidations()]).finally(() => setLoading(false));
  }, [fetchPages, fetchConsolidations]);

  async function patchPage(id: number, patch: Partial<PageRow>) {
    const res = await fetch(`/api/seo/content-pipeline/pages/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const json = await res.json();
      setPages((prev) => prev.map((p) => (p.id === id ? json.row : p)));
    }
  }

  async function deletePage(id: number) {
    if (!confirm("Delete this page row from the pipeline (won't affect the actual site)?")) return;
    const res = await fetch(`/api/seo/content-pipeline/pages/${id}`, { method: "DELETE" });
    if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
  }

  if (!configured && !loading) {
    return (
      <div className="space-y-3">
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Content Pipeline</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Supabase isn&rsquo;t configured. Apply{" "}
          <code className="rounded bg-white px-1 text-xs">supabase/migrations/0003_content_pipeline.sql</code>{" "}
          and ensure the env vars are populated.
        </div>
      </div>
    );
  }

  const summary = {
    total: pages.length,
    draft: pages.filter((p) => p.status === "draft").length,
    scheduled: pages.filter((p) => p.status === "scheduled").length,
    published: pages.filter((p) => p.status === "published").length,
    stale: pages.filter((p) => p.status === "stale").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">Content Pipeline</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track every page through draft → scheduled → published → stale,
            and plan content consolidations.
          </p>
        </div>
        <NewPageInline onCreated={(p) => setPages((prev) => [...prev, p])} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryStat label="Total pages" value={summary.total} />
        <SummaryStat label="Draft" value={summary.draft} />
        <SummaryStat label="Scheduled" value={summary.scheduled} tone="warn" />
        <SummaryStat label="Published" value={summary.published} tone="good" />
        <SummaryStat label="Stale (365d+)" value={summary.stale} tone={summary.stale > 0 ? "bad" : "good"} />
      </div>

      <Tabs<TabId>
        active={tab}
        tabs={[
          { id: "kanban", label: "Kanban" },
          { id: "list", label: "Master list", count: pages.length },
          { id: "calendar", label: "Calendar" },
          { id: "consolidations", label: "Consolidations", count: consolidations.length },
        ]}
      />

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{error}</div>
      ) : null}

      {tab === "kanban" ? <Kanban pages={pages} onPatch={patchPage} onDelete={deletePage} /> : null}
      {tab === "list" ? <MasterList pages={pages} onPatch={patchPage} onDelete={deletePage} /> : null}
      {tab === "calendar" ? <CalendarView pages={pages} onPatch={patchPage} /> : null}
      {tab === "consolidations" ? (
        <Consolidations
          rows={consolidations}
          onCreate={async (payload) => {
            const res = await fetch("/api/seo/content-pipeline/consolidations", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (res.ok) {
              const json = await res.json();
              setConsolidations((prev) => [json.row, ...prev]);
              return true;
            }
            return false;
          }}
          onPatch={async (id, patch) => {
            const res = await fetch(`/api/seo/content-pipeline/consolidations/${id}`, {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(patch),
            });
            if (res.ok) {
              const json = await res.json();
              setConsolidations((prev) => prev.map((c) => (c.id === id ? json.row : c)));
            }
          }}
          onDelete={async (id) => {
            if (!confirm("Delete this consolidation entry?")) return;
            const res = await fetch(`/api/seo/content-pipeline/consolidations/${id}`, { method: "DELETE" });
            if (res.ok) setConsolidations((prev) => prev.filter((c) => c.id !== id));
          }}
        />
      ) : null}
    </div>
  );
}

// ─── Inline new-page bar ────────────────────────────────────────────────────

function NewPageInline({ onCreated }: { onCreated: (p: PageRow) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [path, setPath] = useState("");
  const [status, setStatus] = useState<PageRow["status"]>("draft");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
      >
        <Plus className="h-3.5 w-3.5" />
        New page
      </button>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !path.trim()) return;
    const res = await fetch("/api/seo/content-pipeline/pages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: title.trim(), page_path: path.trim(), status, page_type: "other" }),
    });
    if (res.ok) {
      const json = await res.json();
      onCreated(json.row);
      setTitle("");
      setPath("");
      setOpen(false);
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? `Failed (HTTP ${res.status})`);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-40 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="/path"
        className="w-44 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as PageRow["status"])}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
      >
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
        <option value="stale">Stale</option>
      </select>
      <button type="submit" className="rounded-md bg-navy-900 px-3 py-1 text-sm font-medium text-white">Create</button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:underline">
        Cancel
      </button>
    </form>
  );
}

// ─── Kanban ─────────────────────────────────────────────────────────────────

function Kanban({
  pages,
  onPatch,
  onDelete,
}: {
  pages: PageRow[];
  onPatch: (id: number, patch: Partial<PageRow>) => void;
  onDelete: (id: number) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<PageRow["status"], PageRow[]>();
    for (const s of KANBAN_COLUMNS) map.set(s, []);
    for (const p of pages) map.get(p.status)?.push(p);
    return map;
  }, [pages]);

  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {KANBAN_COLUMNS.map((status) => {
        const items = grouped.get(status) ?? [];
        return (
          <div key={status} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <header className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                {STATUS_LABELS[status]}
              </h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600">
                {items.length}
              </span>
            </header>
            <ul className="space-y-2">
              {items.map((p) => (
                <li key={p.id} className="rounded-md border border-gray-200 bg-white p-2 text-xs shadow-sm">
                  <div className="flex items-start justify-between gap-1">
                    <p className="truncate font-medium text-navy-900" title={p.title}>{p.title}</p>
                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      className="text-gray-300 hover:text-red-600"
                      title="Remove from pipeline"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="truncate text-[11px] text-gray-500" title={p.page_path}>
                    {p.page_path}
                  </p>
                  {p.gsc_clicks > 0 ? (
                    <p className="mt-1 flex items-center gap-2 text-[10px] text-gray-500">
                      <span>{p.gsc_clicks.toLocaleString()} clicks</span>
                      <span>·</span>
                      <span>pos {p.gsc_position.toFixed(1)}</span>
                    </p>
                  ) : null}
                  <select
                    value={p.status}
                    onChange={(e) => onPatch(p.id, { status: e.target.value as PageRow["status"] })}
                    className={`mt-1 w-full rounded px-1.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}
                  >
                    {KANBAN_COLUMNS.map((s) => (
                      <option key={s} value={s}>
                        Move to {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
              {items.length === 0 ? (
                <li className="rounded-md border border-dashed border-gray-200 bg-white p-3 text-center text-[11px] text-gray-400">
                  Empty
                </li>
              ) : null}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ─── Master list ────────────────────────────────────────────────────────────

function MasterList({
  pages,
  onPatch,
  onDelete,
}: {
  pages: PageRow[];
  onPatch: (id: number, patch: Partial<PageRow>) => void;
  onDelete: (id: number) => void;
}) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<PageRow["status"] | "all">("all");

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return pages.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!ql) return true;
      return (
        p.title.toLowerCase().includes(ql) ||
        p.page_path.toLowerCase().includes(ql) ||
        p.notes.toLowerCase().includes(ql)
      );
    });
  }, [pages, q, statusFilter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title / path / notes…"
          className="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PageRow["status"] | "all")}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="all">All statuses</option>
          {KANBAN_COLUMNS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-500">{filtered.length} of {pages.length}</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Path</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Scheduled</th>
              <th className="px-3 py-2 text-right">Clicks</th>
              <th className="px-3 py-2 text-right">Position</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-3 py-1.5 font-medium text-navy-900">{p.title}</td>
                <td className="max-w-xs truncate px-3 py-1.5 text-xs text-gray-700" title={p.page_path}>
                  {p.page_path}
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={p.status}
                    onChange={(e) => onPatch(p.id, { status: e.target.value as PageRow["status"] })}
                    className={`rounded px-1.5 py-0.5 text-xs ${STATUS_COLORS[p.status]}`}
                  >
                    {KANBAN_COLUMNS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="date"
                    defaultValue={p.scheduled_date ?? ""}
                    onBlur={(e) =>
                      onPatch(p.id, { scheduled_date: e.target.value || null })
                    }
                    className="rounded border border-gray-200 px-1.5 py-0.5 text-xs"
                  />
                </td>
                <td className="px-3 py-1.5 text-right">
                  <input
                    type="number"
                    defaultValue={p.gsc_clicks}
                    onBlur={(e) => {
                      const n = parseInt(e.target.value, 10);
                      if (Number.isFinite(n) && n !== p.gsc_clicks) onPatch(p.id, { gsc_clicks: n });
                    }}
                    className="w-16 rounded border border-gray-200 px-1.5 py-0.5 text-right font-mono text-xs"
                  />
                </td>
                <td className="px-3 py-1.5 text-right">
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={p.gsc_position}
                    onBlur={(e) => {
                      const n = parseFloat(e.target.value);
                      if (Number.isFinite(n) && n !== p.gsc_position) onPatch(p.id, { gsc_position: n });
                    }}
                    className="w-16 rounded border border-gray-200 px-1.5 py-0.5 text-right font-mono text-xs"
                  />
                </td>
                <td className="px-3 py-1.5 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="text-xs text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Calendar (basic month view) ────────────────────────────────────────────

function CalendarView({
  pages,
  onPatch,
}: {
  pages: PageRow[];
  onPatch: (id: number, patch: Partial<PageRow>) => void;
}) {
  const [cursor, setCursor] = useState(new Date());
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthLabel = monthStart.toLocaleString("en-CA", { month: "long", year: "numeric" });
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const startDay = monthStart.getDay(); // 0 = Sunday

  const cells: Array<Date | null> = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const scheduled = useMemo(() => {
    const map = new Map<string, PageRow[]>();
    for (const p of pages) {
      if (!p.scheduled_date) continue;
      const arr = map.get(p.scheduled_date) ?? [];
      arr.push(p);
      map.set(p.scheduled_date, arr);
    }
    return map;
  }, [pages]);

  function moveBy(months: number) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + months, 1));
  }

  function dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => moveBy(-1)} className="rounded border border-gray-300 px-2 py-1 text-xs">
          ← Prev
        </button>
        <h3 className="font-medium">{monthLabel}</h3>
        <button type="button" onClick={() => moveBy(1)} className="rounded border border-gray-300 px-2 py-1 text-xs">
          Next →
        </button>
        <button type="button" onClick={() => setCursor(new Date())} className="ml-2 text-xs text-navy-900 underline">
          Today
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-2 py-1.5 text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const key = d ? dateKey(d) : "blank-" + i;
            const day = d ? d.getDate() : null;
            const items = d ? scheduled.get(dateKey(d)) ?? [] : [];
            return (
              <div
                key={key}
                className={`min-h-[5rem] border-b border-r border-gray-100 p-1.5 text-xs ${
                  d ? "bg-white" : "bg-gray-50"
                }`}
              >
                {day !== null ? (
                  <>
                    <p className="text-[11px] text-gray-500">{day}</p>
                    <ul className="mt-1 space-y-0.5">
                      {items.map((p) => (
                        <li
                          key={p.id}
                          className="cursor-pointer truncate rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-900 hover:bg-amber-200"
                          title={`${p.title} — ${STATUS_LABELS[p.status]}`}
                          onClick={() => {
                            const next = prompt(
                              "Reschedule to (YYYY-MM-DD), or empty to clear:",
                              p.scheduled_date ?? "",
                            );
                            if (next === null) return;
                            onPatch(p.id, { scheduled_date: next.trim() || null });
                          }}
                        >
                          {p.title}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Consolidations ─────────────────────────────────────────────────────────

function Consolidations({
  rows,
  onCreate,
  onPatch,
  onDelete,
}: {
  rows: ConsolidationRow[];
  onCreate: (payload: { keep_url: string; merge_url: string; status: ConsolidationRow["status"]; note: string }) => Promise<boolean>;
  onPatch: (id: number, patch: Partial<ConsolidationRow>) => void;
  onDelete: (id: number) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Plan a consolidation
        </button>
        <span className="text-xs text-gray-500">
          {rows.length} entries
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Keep URL</th>
              <th className="px-3 py-2 text-left">Merge URL</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Pre clicks (keep + merge)</th>
              <th className="px-3 py-2 text-right">Post clicks</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-500">
                  No consolidations planned yet.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="max-w-xs truncate px-3 py-1.5 text-xs text-gray-700" title={c.keep_url}>
                    {c.keep_url}
                  </td>
                  <td className="max-w-xs truncate px-3 py-1.5 text-xs text-gray-700" title={c.merge_url}>
                    {c.merge_url}
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={c.status}
                      onChange={(e) => onPatch(c.id, { status: e.target.value as ConsolidationRow["status"] })}
                      className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs"
                    >
                      <option value="planned">Planned</option>
                      <option value="approved">Approved</option>
                      <option value="merged">Merged</option>
                      <option value="reverted">Reverted</option>
                    </select>
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono text-xs">
                    {(c.pre_merge_keep_clicks ?? 0) + (c.pre_merge_merge_clicks ?? 0) || "—"}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <input
                      type="number"
                      defaultValue={c.post_merge_clicks ?? ""}
                      onBlur={(e) => {
                        const n = parseInt(e.target.value, 10);
                        const next = Number.isFinite(n) ? n : null;
                        if (next !== c.post_merge_clicks)
                          onPatch(c.id, {
                            post_merge_clicks: next,
                            post_merge_measured_at: new Date().toISOString().slice(0, 10),
                          });
                      }}
                      className="w-16 rounded border border-gray-200 px-1.5 py-0.5 text-right font-mono text-xs"
                    />
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(c.id)}
                      className="text-xs text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <AddConsolidation
          onClose={() => setShowAdd(false)}
          onSave={async (p) => {
            const ok = await onCreate(p);
            if (ok) setShowAdd(false);
          }}
        />
      ) : null}
    </div>
  );
}

function AddConsolidation({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (payload: { keep_url: string; merge_url: string; status: "planned" | "approved" | "merged" | "reverted"; note: string }) => Promise<void>;
}) {
  const [keepUrl, setKeepUrl] = useState("");
  const [mergeUrl, setMergeUrl] = useState("");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!keepUrl.trim() || !mergeUrl.trim()) return;
    await onSave({
      keep_url: keepUrl.trim(),
      merge_url: mergeUrl.trim(),
      status: "planned",
      note: note.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg space-y-3 rounded-lg bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Plan consolidation</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="block text-xs">
          <span className="text-gray-500">Keep URL (the page that stays) *</span>
          <input
            type="text"
            value={keepUrl}
            onChange={(e) => setKeepUrl(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Merge URL (the page that gets folded in) *</span>
          <input
            type="text"
            value={mergeUrl}
            onChange={(e) => setMergeUrl(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Note (why)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs"
          />
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800">
            Plan
          </button>
        </div>
      </form>
    </div>
  );
}
