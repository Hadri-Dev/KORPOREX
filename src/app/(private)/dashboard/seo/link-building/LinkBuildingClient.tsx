"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Download,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Papa from "papaparse";
import {
  type AcquiredLink,
  type LinkBuildingData,
  type Prospect,
  type ProspectStatus,
  type ProspectType,
  PIPELINE_STATUSES,
  PROSPECT_STATUSES,
  addAcquired,
  addProspect,
  clearLinkBuilding,
  convertProspectToAcquired,
  csvRowToAcquired,
  csvRowToProspect,
  deleteAcquired,
  deleteProspects,
  loadLinkBuilding,
  saveLinkBuilding,
  updateAcquired,
  updateProspect,
} from "@/lib/linkBuildingStore";
import { datasetToCsv, downloadCsv } from "@/lib/seoStore";
import SummaryStat from "@/components/dashboard/seo/SummaryStat";
import Tabs from "@/components/dashboard/seo/Tabs";

type TabId = "outreach" | "submissions" | "pipeline" | "acquired";

const STATUS_LABELS: Record<ProspectStatus, string> = {
  new: "New",
  contacted: "Contacted",
  negotiating: "Negotiating",
  agreed: "Agreed",
  live: "Live",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<ProspectStatus, string> = {
  new: "bg-gray-100 text-gray-800",
  contacted: "bg-blue-100 text-blue-800",
  negotiating: "bg-amber-100 text-amber-800",
  agreed: "bg-emerald-100 text-emerald-800",
  live: "bg-emerald-200 text-emerald-900",
  rejected: "bg-red-100 text-red-800",
};

export default function LinkBuildingClient() {
  const search = useSearchParams();
  const tabParam = (search.get("tab") ?? "outreach") as TabId;
  const tab: TabId =
    tabParam === "submissions" || tabParam === "pipeline" || tabParam === "acquired"
      ? tabParam
      : "outreach";

  const [data, setData] = useState<LinkBuildingData>({
    prospects: [],
    acquired: [],
    outreachLog: [],
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadLinkBuilding());
    setHydrated(true);
  }, []);

  function commit(next: LinkBuildingData) {
    setData(next);
    saveLinkBuilding(next);
  }

  const outreach = data.prospects.filter((p) => p.type === "outreach");
  const submissions = data.prospects.filter((p) => p.type === "submission");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">Link Building</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track outreach prospects, directory submissions, and acquired links
            in one place. Data lives in this browser&rsquo;s localStorage.
          </p>
        </div>
        {hydrated && (data.prospects.length > 0 || data.acquired.length > 0) ? (
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Clear all Link Building data (prospects, acquired links, outreach log) from this browser? This cannot be undone.",
                )
              ) {
                clearLinkBuilding();
                setData({ prospects: [], acquired: [], outreachLog: [] });
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear all
          </button>
        ) : null}
      </div>

      <Tabs<TabId>
        active={tab}
        tabs={[
          { id: "outreach", label: "Outreach", count: outreach.length },
          { id: "submissions", label: "Submissions", count: submissions.length },
          { id: "pipeline", label: "Pipeline" },
          { id: "acquired", label: "Acquired", count: data.acquired.length },
        ]}
      />

      {!hydrated ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
          Loading…
        </div>
      ) : tab === "outreach" ? (
        <ProspectsTab
          data={data}
          commit={commit}
          type="outreach"
          prospects={outreach}
        />
      ) : tab === "submissions" ? (
        <ProspectsTab
          data={data}
          commit={commit}
          type="submission"
          prospects={submissions}
        />
      ) : tab === "pipeline" ? (
        <PipelineTab data={data} commit={commit} />
      ) : (
        <AcquiredTab data={data} commit={commit} />
      )}
    </div>
  );
}

// ─── Prospects (Outreach + Submissions) ─────────────────────────────────────

function ProspectsTab({
  data,
  commit,
  type,
  prospects,
}: {
  data: LinkBuildingData;
  commit: (next: LinkBuildingData) => void;
  type: ProspectType;
  prospects: Prospect[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const ql = search.toLowerCase();
    return prospects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!ql) return true;
      return (
        p.domain.toLowerCase().includes(ql) ||
        p.contactEmail.toLowerCase().includes(ql) ||
        p.notes.toLowerCase().includes(ql)
      );
    });
  }, [prospects, search, statusFilter]);

  function toggleAll() {
    if (filtered.every((p) => selected.has(p.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  }
  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBulkDelete() {
    if (selected.size === 0) return;
    if (
      !confirm(
        `Delete ${selected.size} ${type === "outreach" ? "outreach" : "submission"} prospect${selected.size === 1 ? "" : "s"}? This cannot be undone.`,
      )
    )
      return;
    commit(deleteProspects(data, Array.from(selected)));
    setSelected(new Set());
  }

  function handleStatusChange(id: string, status: ProspectStatus) {
    commit(updateProspect(data, id, { status }));
  }

  function handleEdit(id: string, patch: Partial<Prospect>) {
    commit(updateProspect(data, id, patch));
  }

  function handleConvert(p: Prospect) {
    const target = prompt(
      "Target URL on korporex.ca (e.g. https://korporex.ca/services):",
      "https://korporex.ca/",
    );
    if (!target) return;
    const anchor = prompt("Anchor text:", "Korporex") ?? "";
    commit(
      convertProspectToAcquired(data, p.id, {
        anchorText: anchor,
        targetUrl: target,
        linkType: type === "submission" ? "directory" : "guest_post",
        dateAcquired: new Date().toISOString().slice(0, 10),
      }),
    );
  }

  function handleCsvImport(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let next = data;
        let added = 0;
        for (const row of results.data) {
          const partial = csvRowToProspect(row, type);
          if (!partial.domain) continue;
          next = addProspect(next, partial);
          added++;
        }
        commit(next);
        alert(`Imported ${added} ${type} prospect${added === 1 ? "" : "s"}.`);
      },
      error: (err) => alert(`CSV import failed: ${err.message}`),
    });
  }

  function handleExport() {
    const cols = [
      "domain",
      "dr",
      "traffic",
      "cost",
      "contact_email",
      "submission_url",
      "status",
      "renewal_frequency",
      "notes",
      "last_action",
      "created_at",
    ];
    const rows = prospects.map((p) => ({
      domain: p.domain,
      dr: String(p.dr),
      traffic: String(p.traffic),
      cost: String(p.cost),
      contact_email: p.contactEmail,
      submission_url: p.submissionUrl,
      status: p.status,
      renewal_frequency: p.renewalFrequency,
      notes: p.notes,
      last_action: p.lastAction,
      created_at: p.createdAt,
    }));
    const csv = datasetToCsv({ columns: cols, rows });
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`korporex-${type}-${stamp}.csv`, csv);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search domain / email / notes…"
          className="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-navy-900 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProspectStatus | "all")}
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="all">All statuses</option>
          {PROSPECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-500">
          {filtered.length} of {prospects.length}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            <Plus className="h-3.5 w-3.5" />
            New {type === "outreach" ? "prospect" : "submission"}
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
                if (f) handleCsvImport(f);
                e.target.value = "";
              }}
            />
          </label>
          {prospects.length > 0 ? (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          ) : null}
          {selected.size > 0 ? (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete {selected.size}
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 &&
                    filtered.every((p) => selected.has(p.id))
                  }
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2 text-left">Domain</th>
              <th className="px-3 py-2 text-right">DR</th>
              <th className="px-3 py-2 text-right">Cost</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">{type === "submission" ? "Submission URL" : "Contact email"}</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-gray-500">
                  No {type} prospects yet. Use &ldquo;New {type === "outreach" ? "prospect" : "submission"}&rdquo; or CSV import.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const isExpanded = expanded === p.id;
                return (
                  <ProspectRow
                    key={p.id}
                    prospect={p}
                    selected={selected.has(p.id)}
                    onToggle={() => toggle(p.id)}
                    expanded={isExpanded}
                    onExpand={() => setExpanded(isExpanded ? null : p.id)}
                    onStatusChange={(s) => handleStatusChange(p.id, s)}
                    onEdit={(patch) => handleEdit(p.id, patch)}
                    onConvert={() => handleConvert(p)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <NewProspectModal
          type={type}
          onClose={() => setShowAdd(false)}
          onSave={(partial) => {
            commit(addProspect(data, partial));
            setShowAdd(false);
          }}
        />
      ) : null}
    </div>
  );
}

function ProspectRow({
  prospect: p,
  selected,
  onToggle,
  expanded,
  onExpand,
  onStatusChange,
  onEdit,
  onConvert,
}: {
  prospect: Prospect;
  selected: boolean;
  onToggle: () => void;
  expanded: boolean;
  onExpand: () => void;
  onStatusChange: (s: ProspectStatus) => void;
  onEdit: (patch: Partial<Prospect>) => void;
  onConvert: () => void;
}) {
  const showSubmission = p.type === "submission";
  return (
    <>
      <tr className={selected ? "bg-amber-50" : "hover:bg-gray-50"}>
        <td className="px-3 py-2 align-top">
          <input type="checkbox" checked={selected} onChange={onToggle} />
        </td>
        <td className="max-w-[14rem] px-3 py-2 align-top">
          <button
            type="button"
            onClick={onExpand}
            className="block truncate text-left font-medium text-navy-900 hover:underline"
            title={p.domain}
          >
            {p.domain || "(no domain)"}
          </button>
        </td>
        <td className="px-3 py-2 text-right align-top font-mono text-xs">{p.dr}</td>
        <td className="px-3 py-2 text-right align-top font-mono text-xs">${p.cost}</td>
        <td className="px-3 py-2 align-top">
          <select
            value={p.status}
            onChange={(e) => onStatusChange(e.target.value as ProspectStatus)}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]} border-0 focus:outline-none focus:ring-2 focus:ring-navy-900`}
          >
            {PROSPECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </td>
        <td className="max-w-[16rem] px-3 py-2 align-top text-xs text-gray-600">
          <span className="block truncate" title={showSubmission ? p.submissionUrl : p.contactEmail}>
            {showSubmission ? (
              p.submissionUrl ? (
                <a
                  href={p.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-900 hover:underline"
                >
                  {p.submissionUrl}
                </a>
              ) : (
                <span className="text-gray-400">—</span>
              )
            ) : (
              p.contactEmail || <span className="text-gray-400">—</span>
            )}
          </span>
        </td>
        <td className="px-3 py-2 align-top text-right">
          {p.status !== "live" ? (
            <button
              type="button"
              onClick={onConvert}
              className="text-xs text-emerald-700 hover:underline"
              title="Convert to acquired link"
            >
              Mark live
            </button>
          ) : null}
        </td>
      </tr>
      {expanded ? (
        <tr className="bg-gray-50">
          <td></td>
          <td colSpan={6} className="px-3 py-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Notes"
                value={p.notes}
                onChange={(v) => onEdit({ notes: v })}
                multiline
              />
              <div className="space-y-2">
                <Field
                  label={p.type === "submission" ? "Submission URL" : "Contact email"}
                  value={p.type === "submission" ? p.submissionUrl : p.contactEmail}
                  onChange={(v) =>
                    onEdit(p.type === "submission" ? { submissionUrl: v } : { contactEmail: v })
                  }
                />
                <Field
                  label="Cost (CAD)"
                  value={String(p.cost)}
                  onChange={(v) => onEdit({ cost: parseFloat(v) || 0 })}
                />
                <Field
                  label="DR"
                  value={String(p.dr)}
                  onChange={(v) => onEdit({ dr: parseFloat(v) || 0 })}
                />
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <label className="block text-xs">
      <span className="text-gray-500">{label}</span>
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== value && onChange(draft)}
          rows={3}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-navy-900 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== value && onChange(draft)}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-navy-900 focus:outline-none"
        />
      )}
    </label>
  );
}

function NewProspectModal({
  type,
  onClose,
  onSave,
}: {
  type: ProspectType;
  onClose: () => void;
  onSave: (partial: { type: ProspectType; domain: string; dr?: number; cost?: number; contactEmail?: string; submissionUrl?: string; notes?: string }) => void;
}) {
  const [domain, setDomain] = useState("");
  const [dr, setDr] = useState("");
  const [cost, setCost] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    onSave({
      type,
      domain: domain.trim(),
      dr: parseFloat(dr) || 0,
      cost: parseFloat(cost) || 0,
      contactEmail: contactEmail.trim(),
      submissionUrl: submissionUrl.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <div
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg space-y-3 rounded-lg bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-navy-900">
            New {type === "outreach" ? "outreach prospect" : "submission target"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <Input label="Domain" value={domain} onChange={setDomain} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="DR" value={dr} onChange={setDr} type="number" />
          <Input label="Cost (CAD)" value={cost} onChange={setCost} type="number" />
        </div>
        {type === "outreach" ? (
          <Input
            label="Contact email"
            value={contactEmail}
            onChange={setContactEmail}
            type="email"
          />
        ) : (
          <Input label="Submission URL" value={submissionUrl} onChange={setSubmissionUrl} />
        )}
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

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number" | "email";
  required?: boolean;
}) {
  return (
    <label className="block text-xs">
      <span className="text-gray-500">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-navy-900 focus:outline-none"
      />
    </label>
  );
}

// ─── Pipeline kanban ────────────────────────────────────────────────────────

function PipelineTab({
  data,
  commit,
}: {
  data: LinkBuildingData;
  commit: (next: LinkBuildingData) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<ProspectStatus, Prospect[]>();
    for (const s of PIPELINE_STATUSES) map.set(s, []);
    for (const p of data.prospects) {
      if (p.status === "rejected") continue;
      const arr = map.get(p.status);
      if (arr) arr.push(p);
    }
    return map;
  }, [data]);

  function advance(p: Prospect) {
    const idx = PIPELINE_STATUSES.indexOf(p.status);
    if (idx < 0 || idx >= PIPELINE_STATUSES.length - 1) return;
    commit(updateProspect(data, p.id, { status: PIPELINE_STATUSES[idx + 1] }));
  }

  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {PIPELINE_STATUSES.map((status) => {
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
                <li
                  key={p.id}
                  className="rounded-md border border-gray-200 bg-white p-2 text-xs shadow-sm"
                >
                  <p className="truncate font-medium text-navy-900" title={p.domain}>
                    {p.domain}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500">
                    <span>DR {p.dr}</span>
                    {p.cost > 0 ? <span>· ${p.cost}</span> : null}
                    <span className="text-gray-300">·</span>
                    <span className="capitalize">{p.type}</span>
                  </p>
                  {status !== "live" ? (
                    <button
                      type="button"
                      onClick={() => advance(p)}
                      className="mt-2 inline-flex items-center gap-1 rounded text-[11px] font-medium text-navy-900 hover:underline"
                    >
                      → {STATUS_LABELS[PIPELINE_STATUSES[PIPELINE_STATUSES.indexOf(status) + 1] ?? "live"]}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ) : null}
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

// ─── Acquired ───────────────────────────────────────────────────────────────

const LINK_TYPE_LABELS: Record<string, string> = {
  guest_post: "Guest post",
  directory: "Directory",
  resource: "Resource",
  homepage: "Homepage",
  other: "Other",
};

function AcquiredTab({
  data,
  commit,
}: {
  data: LinkBuildingData;
  commit: (next: LinkBuildingData) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const ql = search.toLowerCase();
    if (!ql) return data.acquired;
    return data.acquired.filter(
      (l) =>
        l.referringDomain.toLowerCase().includes(ql) ||
        l.anchorText.toLowerCase().includes(ql) ||
        l.targetUrl.toLowerCase().includes(ql),
    );
  }, [data.acquired, search]);

  const stats = useMemo(() => {
    const active = data.acquired.filter((l) => l.status === "active");
    const oneTimeSpend = active
      .filter((l) => l.billingCycle === "one-time")
      .reduce((acc, l) => acc + l.cost, 0);
    const monthlySpend = active
      .filter((l) => l.billingCycle === "monthly")
      .reduce((acc, l) => acc + l.cost, 0);
    const annualSpend = active
      .filter((l) => l.billingCycle === "annual")
      .reduce((acc, l) => acc + l.cost, 0);
    const avgDr = active.length
      ? Math.round(active.reduce((acc, l) => acc + l.dr, 0) / active.length)
      : 0;
    return {
      activeCount: active.length,
      oneTimeSpend,
      monthlySpend,
      annualSpend,
      avgDr,
    };
  }, [data.acquired]);

  function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} acquired link${selected.size === 1 ? "" : "s"}?`)) return;
    commit(deleteAcquired(data, Array.from(selected)));
    setSelected(new Set());
  }

  function handleStatusChange(id: string, status: AcquiredLink["status"]) {
    commit(updateAcquired(data, id, { status }));
  }

  function handleCsvImport(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let next = data;
        let added = 0;
        for (const row of results.data) {
          const partial = csvRowToAcquired(row);
          if (!partial.referringDomain) continue;
          next = addAcquired(next, partial);
          added++;
        }
        commit(next);
        alert(`Imported ${added} acquired link${added === 1 ? "" : "s"}.`);
      },
    });
  }

  function handleExport() {
    const cols = [
      "referring_domain",
      "anchor_text",
      "target_url",
      "link_type",
      "date_acquired",
      "dr",
      "cost",
      "billing_cycle",
      "status",
      "last_verified",
      "notes",
    ];
    const rows = data.acquired.map((l) => ({
      referring_domain: l.referringDomain,
      anchor_text: l.anchorText,
      target_url: l.targetUrl,
      link_type: l.linkType,
      date_acquired: l.dateAcquired,
      dr: String(l.dr),
      cost: String(l.cost),
      billing_cycle: l.billingCycle,
      status: l.status,
      last_verified: l.lastVerified,
      notes: l.notes,
    }));
    const csv = datasetToCsv({ columns: cols, rows });
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`korporex-acquired-links-${stamp}.csv`, csv);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryStat label="Active links" value={stats.activeCount} />
        <SummaryStat label="Avg DR (active)" value={stats.avgDr} />
        <SummaryStat
          label="One-time spend"
          value={`$${stats.oneTimeSpend.toLocaleString("en-CA")}`}
          hint="Active links, paid once"
        />
        <SummaryStat
          label="Monthly recurring"
          value={`$${stats.monthlySpend.toLocaleString("en-CA")}`}
          hint="Per month, ongoing"
        />
        <SummaryStat
          label="Annual recurring"
          value={`$${stats.annualSpend.toLocaleString("en-CA")}`}
          hint="Per year, ongoing"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search domain / anchor / target…"
          className="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-navy-900 focus:outline-none"
        />
        <span className="text-xs text-gray-500">
          {filtered.length} of {data.acquired.length}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            <Plus className="h-3.5 w-3.5" />
            New link
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
                if (f) handleCsvImport(f);
                e.target.value = "";
              }}
            />
          </label>
          {data.acquired.length > 0 ? (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          ) : null}
          {selected.size > 0 ? (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete {selected.size}
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 &&
                    filtered.every((l) => selected.has(l.id))
                  }
                  onChange={() => {
                    if (filtered.every((l) => selected.has(l.id))) {
                      setSelected(new Set());
                    } else {
                      setSelected(new Set(filtered.map((l) => l.id)));
                    }
                  }}
                />
              </th>
              <th className="px-3 py-2 text-left">Domain</th>
              <th className="px-3 py-2 text-left">Anchor / Target</th>
              <th className="px-3 py-2 text-right">DR</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">Cost</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-gray-500">
                  No acquired links yet.
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className={selected.has(l.id) ? "bg-amber-50" : "hover:bg-gray-50"}>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="checkbox"
                      checked={selected.has(l.id)}
                      onChange={() => {
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(l.id)) next.delete(l.id);
                          else next.add(l.id);
                          return next;
                        });
                      }}
                    />
                  </td>
                  <td className="max-w-[12rem] px-3 py-2 align-top truncate font-medium text-navy-900" title={l.referringDomain}>
                    {l.referringDomain}
                  </td>
                  <td className="max-w-[18rem] px-3 py-2 align-top">
                    <p className="truncate text-xs" title={l.anchorText}>{l.anchorText}</p>
                    <p className="truncate text-[11px] text-gray-500" title={l.targetUrl}>
                      {l.targetUrl ? (
                        <a
                          href={l.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy-900 hover:underline"
                        >
                          → {l.targetUrl}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </td>
                  <td className="px-3 py-2 text-right align-top font-mono text-xs">{l.dr}</td>
                  <td className="px-3 py-2 align-top text-xs text-gray-700">
                    {LINK_TYPE_LABELS[l.linkType] ?? l.linkType}
                  </td>
                  <td className="px-3 py-2 text-right align-top">
                    <span className="font-mono text-xs">${l.cost}</span>
                    <span className="ml-1 text-[10px] text-gray-500">{l.billingCycle}</span>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <select
                      value={l.status}
                      onChange={(e) => handleStatusChange(l.id, e.target.value as AcquiredLink["status"])}
                      className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs"
                    >
                      <option value="active">Active</option>
                      <option value="lost">Lost</option>
                      <option value="pending_renewal">Pending renewal</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <NewAcquiredModal
          onClose={() => setShowAdd(false)}
          onSave={(partial) => {
            commit(addAcquired(data, partial));
            setShowAdd(false);
          }}
        />
      ) : null}
    </div>
  );
}

function NewAcquiredModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (partial: Partial<AcquiredLink> & { referringDomain: string }) => void;
}) {
  const [referringDomain, setReferringDomain] = useState("");
  const [anchorText, setAnchorText] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [linkType, setLinkType] = useState<AcquiredLink["linkType"]>("guest_post");
  const [dateAcquired, setDateAcquired] = useState(new Date().toISOString().slice(0, 10));
  const [dr, setDr] = useState("");
  const [cost, setCost] = useState("");
  const [billingCycle, setBillingCycle] = useState<AcquiredLink["billingCycle"]>("one-time");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!referringDomain.trim()) return;
    onSave({
      referringDomain: referringDomain.trim(),
      anchorText: anchorText.trim(),
      targetUrl: targetUrl.trim(),
      linkType,
      dateAcquired,
      dr: parseFloat(dr) || 0,
      cost: parseFloat(cost) || 0,
      billingCycle,
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
          <h2 className="font-serif text-lg font-semibold text-navy-900">New acquired link</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <Input label="Referring domain" value={referringDomain} onChange={setReferringDomain} required />
        <Input label="Anchor text" value={anchorText} onChange={setAnchorText} />
        <Input label="Target URL on korporex.ca" value={targetUrl} onChange={setTargetUrl} />
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs">
            <span className="text-gray-500">Link type</span>
            <select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value as AcquiredLink["linkType"])}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="guest_post">Guest post</option>
              <option value="directory">Directory</option>
              <option value="resource">Resource</option>
              <option value="homepage">Homepage</option>
              <option value="other">Other</option>
            </select>
          </label>
          <Input
            label="Date acquired"
            value={dateAcquired}
            onChange={setDateAcquired}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="DR" value={dr} onChange={setDr} type="number" />
          <Input label="Cost (CAD)" value={cost} onChange={setCost} type="number" />
          <label className="block text-xs">
            <span className="text-gray-500">Billing</span>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value as AcquiredLink["billingCycle"])}
              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </label>
        </div>
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
            disabled={!referringDomain.trim()}
            className="rounded-md bg-navy-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
