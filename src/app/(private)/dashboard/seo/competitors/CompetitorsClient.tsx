"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import {
  type Competitor,
  type CompetitorsData,
  type CompetitorTier,
  TIER_LABELS,
  addCompetitor,
  clearCompetitors,
  deleteCompetitors,
  loadCompetitors,
  saveCompetitors,
  updateCompetitor,
} from "@/lib/competitorsStore";

const TIER_COLORS: Record<CompetitorTier, string> = {
  primary: "bg-emerald-100 text-emerald-800 border-emerald-200",
  secondary: "bg-blue-100 text-blue-800 border-blue-200",
  tertiary: "bg-gray-100 text-gray-700 border-gray-200",
};

const STARTER_LIST: Array<{ name: string; domain: string; tier: CompetitorTier }> = [
  { name: "Ownr", domain: "ownr.co", tier: "primary" },
  { name: "LawDepot", domain: "lawdepot.ca", tier: "primary" },
  { name: "Wagepoint Incorpdirect", domain: "incorpdirect.com", tier: "secondary" },
  { name: "Opstart", domain: "opstart.ca", tier: "secondary" },
  { name: "Founded", domain: "founded.co", tier: "secondary" },
  { name: "Wix Business", domain: "wix.com", tier: "tertiary" },
  { name: "Incorporation.com", domain: "incorporation.com", tier: "tertiary" },
];

export default function CompetitorsClient() {
  const [data, setData] = useState<CompetitorsData>({
    competitors: [],
    metrics: [],
    pages: [],
    keywords: [],
    backlinks: [],
  });
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<CompetitorTier | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setData(loadCompetitors());
    setHydrated(true);
  }, []);

  function commit(next: CompetitorsData) {
    setData(next);
    saveCompetitors(next);
  }

  const filtered = useMemo(() => {
    const ql = search.toLowerCase();
    return data.competitors.filter((c) => {
      if (tierFilter !== "all" && c.tier !== tierFilter) return false;
      if (!ql) return true;
      return (
        c.name.toLowerCase().includes(ql) ||
        c.domain.toLowerCase().includes(ql) ||
        c.notes.toLowerCase().includes(ql)
      );
    });
  }, [data.competitors, search, tierFilter]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (filtered.every((c) => selected.has(c.id))) setSelected(new Set());
    else setSelected(new Set(filtered.map((c) => c.id)));
  }

  function handleBulkDelete() {
    if (selected.size === 0) return;
    if (
      !confirm(
        `Delete ${selected.size} competitor${selected.size === 1 ? "" : "s"} and all their imported data (metrics, pages, keywords, backlinks)?`,
      )
    )
      return;
    commit(deleteCompetitors(data, Array.from(selected)));
    setSelected(new Set());
  }

  function handleSeed() {
    let next = data;
    let added = 0;
    for (const c of STARTER_LIST) {
      if (next.competitors.some((existing) => existing.domain === c.domain)) continue;
      next = addCompetitor(next, c);
      added++;
    }
    commit(next);
    if (added === 0) alert("All starter competitors are already in your list.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">Competitors</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track competitors by tier. Open a competitor to manage their metric history,
            pages, keywords, and backlinks.
          </p>
          <div className="mt-2 flex gap-3 text-xs">
            <Link
              href="/dashboard/seo/competitors/compare"
              className="text-navy-900 underline hover:opacity-80"
            >
              Compare side-by-side →
            </Link>
            <Link
              href="/dashboard/seo/competitors/link-opportunities"
              className="text-navy-900 underline hover:opacity-80"
            >
              Link opportunities →
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add competitor
          </button>
          {hydrated && data.competitors.length === 0 ? (
            <button
              type="button"
              onClick={handleSeed}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Seed starter list
            </button>
          ) : null}
          {hydrated && data.competitors.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Clear ALL competitor data (competitors + metrics + pages + keywords + backlinks)?",
                  )
                ) {
                  clearCompetitors();
                  setData({
                    competitors: [],
                    metrics: [],
                    pages: [],
                    keywords: [],
                    backlinks: [],
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name / domain / notes…"
          className="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-navy-900 focus:outline-none"
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as CompetitorTier | "all")}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="all">All tiers</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="tertiary">Tertiary</option>
        </select>
        <span className="text-xs text-gray-500">
          {filtered.length} of {data.competitors.length}
        </span>
        {selected.size > 0 ? (
          <button
            type="button"
            onClick={handleBulkDelete}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete {selected.size}
          </button>
        ) : null}
      </div>

      {!hydrated ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
          Loading…
        </div>
      ) : data.competitors.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-700">No competitors yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Click &ldquo;Seed starter list&rdquo; to load Ownr, LawDepot, Opstart, etc., or
            add your own.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="w-10 px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 &&
                      filtered.every((c) => selected.has(c.id))
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Domain</th>
                <th className="px-3 py-2 text-left">Tier</th>
                <th className="px-3 py-2 text-right">Jurisdictions</th>
                <th className="px-3 py-2 text-right">Pricing tiers</th>
                <th className="px-3 py-2 text-left">PPC</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => {
                const metricCount = data.metrics.filter((m) => m.competitorId === c.id).length;
                return (
                  <tr key={c.id} className={selected.has(c.id) ? "bg-amber-50" : "hover:bg-gray-50"}>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Link
                        href={`/dashboard/seo/competitors/${c.id}`}
                        className="font-medium text-navy-900 hover:underline"
                      >
                        {c.name}
                      </Link>
                      {metricCount > 0 ? (
                        <span className="ml-2 text-[10px] text-gray-400">
                          {metricCount} metric snapshot{metricCount === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 align-top text-xs">
                      <a
                        href={`https://${c.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-900 hover:underline"
                      >
                        {c.domain}
                      </a>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <select
                        value={c.tier}
                        onChange={(e) =>
                          commit(updateCompetitor(data, c.id, { tier: e.target.value as CompetitorTier }))
                        }
                        className={`rounded border px-1.5 py-0.5 text-xs font-medium ${TIER_COLORS[c.tier]}`}
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="tertiary">Tertiary</option>
                      </select>
                    </td>
                    <EditableNumberCell
                      value={c.jurisdictionCount}
                      onChange={(v) => commit(updateCompetitor(data, c.id, { jurisdictionCount: v }))}
                    />
                    <EditableNumberCell
                      value={c.pricingTierCount}
                      onChange={(v) => commit(updateCompetitor(data, c.id, { pricingTierCount: v }))}
                    />
                    <td className="px-3 py-2 align-top text-xs">
                      <input
                        type="checkbox"
                        checked={c.hasPpc}
                        onChange={(e) => commit(updateCompetitor(data, c.id, { hasPpc: e.target.checked }))}
                      />
                    </td>
                    <td className="px-3 py-2 align-top text-right">
                      <Link
                        href={`/dashboard/seo/competitors/${c.id}`}
                        className="text-xs text-navy-900 hover:underline"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAdd ? (
        <AddCompetitorModal
          onClose={() => setShowAdd(false)}
          onSave={(c) => {
            commit(addCompetitor(data, c));
            setShowAdd(false);
          }}
        />
      ) : null}
    </div>
  );
}

function EditableNumberCell({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <td className="px-3 py-2 text-right align-top">
      <input
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const n = parseFloat(draft);
          if (Number.isFinite(n) && n !== value) onChange(n);
        }}
        className="w-16 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-right font-mono text-xs"
      />
    </td>
  );
}

function AddCompetitorModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (c: Partial<Competitor> & { domain: string }) => void;
}) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [tier, setTier] = useState<CompetitorTier>("secondary");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    onSave({ name: name.trim() || domain.trim(), domain: domain.trim(), tier, notes: notes.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Add competitor</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="block text-xs">
          <span className="text-gray-500">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ownr"
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-navy-900 focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Domain *</span>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. ownr.co"
            required
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-navy-900 focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Tier</span>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as CompetitorTier)}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="primary">{TIER_LABELS.primary}</option>
            <option value="secondary">{TIER_LABELS.secondary}</option>
            <option value="tertiary">{TIER_LABELS.tertiary}</option>
          </select>
        </label>
        <label className="block text-xs">
          <span className="text-gray-500">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-navy-900 focus:outline-none"
          />
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!domain.trim()}
            className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
