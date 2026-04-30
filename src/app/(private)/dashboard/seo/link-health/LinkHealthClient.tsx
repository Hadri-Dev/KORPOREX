"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Plus, RefreshCw, X } from "lucide-react";
import { PAGE_REGISTRY, PAGE_TYPE_LABELS, type RegistryPage } from "@/lib/pageRegistry";
import Tabs from "@/components/dashboard/seo/Tabs";
import SummaryStat from "@/components/dashboard/seo/SummaryStat";

type TabId = "keywords" | "pages" | "orphans";

interface KeywordRow {
  id: number;
  keyword: string;
  target_page: string;
  priority: number;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface ListResponse {
  configured: boolean;
  rows: KeywordRow[];
}

const SUGGESTED_KEYWORDS: Array<{ keyword: string; target_page: string; priority: number }> = [
  { keyword: "federal incorporation", target_page: "/incorporate?jurisdiction=federal", priority: 10 },
  { keyword: "CBCA", target_page: "/incorporate?jurisdiction=federal", priority: 15 },
  { keyword: "Ontario incorporation", target_page: "/incorporate?jurisdiction=ontario", priority: 20 },
  { keyword: "OBCA", target_page: "/incorporate?jurisdiction=ontario", priority: 25 },
  { keyword: "incorporation", target_page: "/incorporate", priority: 100 },
  { keyword: "business formation", target_page: "/services", priority: 110 },
  { keyword: "registered office", target_page: "/services", priority: 120 },
  { keyword: "NUANS search", target_page: "/resources/what-is-nuans-name-search", priority: 130 },
  { keyword: "annual returns", target_page: "/resources/corporate-annual-returns-canada", priority: 140 },
];

export default function LinkHealthClient() {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "keywords") as TabId;
  const tab: TabId = tabParam === "pages" || tabParam === "orphans" ? tabParam : "keywords";

  const [rows, setRows] = useState<KeywordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/seo/link-health/keywords");
      if (!res.ok) {
        setError(`Failed to load (HTTP ${res.status})`);
        setRows([]);
        return;
      }
      const json = (await res.json()) as ListResponse;
      setConfigured(json.configured);
      setRows(json.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  async function handleAdd(payload: { keyword: string; target_page: string; priority: number; is_active: boolean }) {
    const res = await fetch("/api/seo/link-health/keywords", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? `Failed (HTTP ${res.status})`);
      return false;
    }
    await fetchRows();
    return true;
  }

  async function handlePatch(id: number, patch: Partial<KeywordRow>) {
    const res = await fetch(`/api/seo/link-health/keywords/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) await fetchRows();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this keyword? This cannot be undone.")) return;
    const res = await fetch(`/api/seo/link-health/keywords/${id}`, { method: "DELETE" });
    if (res.ok) await fetchRows();
  }

  async function handleSeed() {
    if (!confirm(`Add ${SUGGESTED_KEYWORDS.length} starter keywords (federal incorporation, CBCA, etc.)? Existing duplicates will be skipped.`)) return;
    let added = 0;
    for (const k of SUGGESTED_KEYWORDS) {
      const res = await fetch("/api/seo/link-health/keywords", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...k, is_active: true }),
      });
      if (res.ok) added++;
    }
    await fetchRows();
    alert(`Added ${added} keyword${added === 1 ? "" : "s"}.`);
  }

  // Page analysis (computed client-side from registry + keywords).
  const pageStats = useMemo(() => {
    const stats = PAGE_REGISTRY.map((page) => {
      const kws = rows.filter((r) => r.is_active && r.target_page === page.path);
      return { page, keywordsAssigned: kws.length, keywords: kws };
    });
    const orphans = stats.filter((s) => s.keywordsAssigned === 0);
    const withKeywords = stats.length - orphans.length;
    return {
      total: stats.length,
      withKeywords,
      orphanCount: orphans.length,
      stats,
      orphans,
    };
  }, [rows]);

  if (!configured && !loading) {
    return (
      <div className="space-y-3">
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Link Health</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Supabase isn&rsquo;t configured. Set{" "}
          <code className="rounded bg-white px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="rounded bg-white px-1 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code className="rounded bg-white px-1 text-xs">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel,
          then apply{" "}
          <code className="rounded bg-white px-1 text-xs">supabase/migrations/0002_internal_link_keywords.sql</code>{" "}
          and redeploy.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">Link Health</h1>
          <p className="mt-1 text-sm text-gray-600">
            Internal-link keyword manager + page-link analysis. Keywords drive
            the (still-stub) build-time linking engine that auto-links matching
            phrases to canonical target pages.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add keyword
          </button>
          {!loading && rows.length === 0 ? (
            <button
              type="button"
              onClick={handleSeed}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Seed starter keywords
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => alert("Linking engine isn't wired up yet — Phase 4 of the roadmap. The keyword + page data is ready; the build-time MDX walker is the missing piece.")}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            title="Stub — build-time engine pending"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reprocess content
          </button>
        </div>
      </div>

      <Tabs<TabId>
        active={tab}
        tabs={[
          { id: "keywords", label: "Keywords", count: rows.length },
          { id: "pages", label: "Page analysis" },
          { id: "orphans", label: "Orphans", count: pageStats.orphanCount },
        ]}
      />

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {tab === "keywords" ? (
        <KeywordsTable
          rows={rows}
          loading={loading}
          onPatch={handlePatch}
          onDelete={handleDelete}
        />
      ) : null}
      {tab === "pages" ? <PageAnalysis stats={pageStats} /> : null}
      {tab === "orphans" ? (
        <div className="space-y-3">
          {pageStats.orphans.length === 0 ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-emerald-800">
              No orphan pages — every page has at least one inbound keyword.
            </div>
          ) : (
            <>
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  {pageStats.orphans.length} orphan {pageStats.orphans.length === 1 ? "page" : "pages"}
                </p>
                <p className="mt-1 text-xs">
                  These pages have no keywords pointing to them. Add a keyword + target_page = orphan path
                  to give the linking engine a reason to link them.
                </p>
              </div>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-sm">
                {pageStats.orphans.map(({ page }) => (
                  <li key={page.path} className="flex items-center justify-between px-4 py-2 text-sm">
                    <div>
                      <p className="font-medium text-navy-900">{page.title}</p>
                      <p className="text-xs text-gray-500">{page.path}</p>
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] uppercase text-gray-600">
                      {PAGE_TYPE_LABELS[page.type]}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}

      {showAdd ? (
        <AddKeywordModal
          onClose={() => setShowAdd(false)}
          onSave={async (payload) => {
            const ok = await handleAdd(payload);
            if (ok) setShowAdd(false);
          }}
        />
      ) : null}
    </div>
  );
}

// ─── Keywords table ─────────────────────────────────────────────────────────

function KeywordsTable({
  rows,
  loading,
  onPatch,
  onDelete,
}: {
  rows: KeywordRow[];
  loading: boolean;
  onPatch: (id: number, patch: Partial<KeywordRow>) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-3 py-2 text-left">Keyword</th>
            <th className="px-3 py-2 text-left">Target page</th>
            <th className="px-3 py-2 text-right">Priority</th>
            <th className="px-3 py-2 text-center">Active</th>
            <th className="px-3 py-2 text-right">Usage</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading && rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-500">
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-500">
                No keywords yet. Add one or seed the starter list.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-3 py-1.5 font-medium text-navy-900">{r.keyword}</td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.target_page}
                    onChange={(e) => onPatch(r.id, { target_page: e.target.value })}
                    className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs"
                  >
                    {PAGE_REGISTRY.find((p) => p.path === r.target_page) ? null : (
                      <option value={r.target_page}>(custom) {r.target_page}</option>
                    )}
                    {PAGE_REGISTRY.map((p) => (
                      <option key={p.path} value={p.path}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5 text-right">
                  <input
                    type="number"
                    defaultValue={r.priority}
                    onBlur={(e) => {
                      const n = parseInt(e.target.value, 10);
                      if (Number.isFinite(n) && n !== r.priority) onPatch(r.id, { priority: n });
                    }}
                    className="w-16 rounded border border-gray-200 px-1.5 py-0.5 text-right font-mono text-xs"
                  />
                </td>
                <td className="px-3 py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={r.is_active}
                    onChange={(e) => onPatch(r.id, { is_active: e.target.checked })}
                  />
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-xs">
                  {r.usage_count.toLocaleString("en-CA")}
                </td>
                <td className="px-3 py-1.5 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="text-xs text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page Analysis ──────────────────────────────────────────────────────────

function PageAnalysis({
  stats,
}: {
  stats: {
    total: number;
    withKeywords: number;
    orphanCount: number;
    stats: { page: RegistryPage; keywordsAssigned: number; keywords: KeywordRow[] }[];
  };
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryStat label="Pages tracked" value={stats.total} />
        <SummaryStat label="With keywords" value={stats.withKeywords} tone="good" />
        <SummaryStat label="Orphan pages" value={stats.orphanCount} tone={stats.orphanCount > 0 ? "warn" : "good"} />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Page</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">Keywords pointing here</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats.stats.map(({ page, keywordsAssigned, keywords }) => {
              const status = keywordsAssigned === 0 ? "Orphan" : keywordsAssigned === 1 ? "OK" : "Strong";
              const color =
                status === "Orphan"
                  ? "bg-red-100 text-red-800"
                  : status === "Strong"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-blue-800";
              return (
                <tr key={page.path} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5">
                    <p className="font-medium text-navy-900">{page.title}</p>
                    <p className="text-[11px] text-gray-500">{page.path}</p>
                    {keywords.length > 0 ? (
                      <p className="mt-0.5 text-[11px] text-gray-600">
                        {keywords.map((k) => k.keyword).join(" · ")}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-1.5 text-xs text-gray-700">{PAGE_TYPE_LABELS[page.type]}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-xs">{keywordsAssigned}</td>
                  <td className="px-3 py-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${color}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Add modal ──────────────────────────────────────────────────────────────

function AddKeywordModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (payload: { keyword: string; target_page: string; priority: number; is_active: boolean }) => Promise<void>;
}) {
  const [keyword, setKeyword] = useState("");
  const [targetPage, setTargetPage] = useState(PAGE_REGISTRY[0]?.path ?? "");
  const [priority, setPriority] = useState(100);
  const [isActive, setIsActive] = useState(true);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setBusy(true);
    await onSave({ keyword: keyword.trim(), target_page: targetPage, priority, is_active: isActive });
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Add internal-link keyword</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="block text-xs">
          <span className="text-gray-500">Keyword *</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='e.g. "federal incorporation"'
            required
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-navy-900 focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Target page</span>
          <select
            value={targetPage}
            onChange={(e) => setTargetPage(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
          >
            {PAGE_REGISTRY.map((p) => (
              <option key={p.path} value={p.path}>
                {p.title} ({p.path})
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs">
            <span className="text-gray-500">Priority</span>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10) || 100)}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
            />
            <span className="text-[10px] text-gray-500">Lower = matches first.</span>
          </label>
          <label className="flex items-end gap-2 text-xs">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!keyword.trim() || busy}
            className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
