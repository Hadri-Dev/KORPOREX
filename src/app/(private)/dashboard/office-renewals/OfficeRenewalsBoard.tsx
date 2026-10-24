"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, AlertTriangle, Building2, DollarSign, RefreshCw, Plus, X, Search } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { boardStage, type BoardStage, type ReminderSettings } from "@/lib/officeRenewalLogic";
import type { OfficeClient, OfficeEvent } from "@/lib/officeRenewals";

export type BoardClient = OfficeClient & {
  locationLabel: string;
  fee: number;
  daysLeft: number;
  link: string | null;
  events: OfficeEvent[];
};

type Props = {
  clients: BoardClient[];
  settings: ReminderSettings;
  today: string;
  stripeConfigured: boolean;
  cronConfigured: boolean;
};

const COLUMNS: { key: BoardStage; label: string; tone: string }[] = [
  { key: "upcoming", label: "Upcoming", tone: "text-gray-600" },
  { key: "reminder", label: "Within 30 days", tone: "text-amber-700" },
  { key: "finalWeek", label: "Final week", tone: "text-orange-700" },
  { key: "overdue", label: "Overdue", tone: "text-red-700" },
  { key: "renewed", label: "Renewed (30 days)", tone: "text-navy-700" },
  { key: "leaving", label: "Moving / closed", tone: "text-gray-500" },
];

const REMINDER_ORDER = ["d60", "d30", "d7", "final"] as const;

const EVENT_LABELS: Record<string, string> = {
  imported: "Added from Stripe",
  created: "Added manually",
  reminder_d60: "Reminder sent: 60 days before",
  reminder_d30: "Reminder sent: 30 days before",
  reminder_d7: "Reminder sent: 7 days before",
  reminder_final: "Final notice sent",
  reminder_manual: "Reminder sent manually",
  paid: "Renewal paid",
  receipt: "Confirmation email sent",
  moving: "Client answered: moving registered office",
  status: "Status changed",
  duplicate: "Possible duplicate order",
  note: "Note",
};

const SETTING_ROWS: { key: keyof ReminderSettings; title: string; hint: string }[] = [
  { key: "d60", title: "60 days before", hint: "Early heads-up." },
  { key: "d30", title: "30 days before", hint: "Main reminder with the Renew now button." },
  { key: "d7", title: "7 days before", hint: "Short nudge, only if still unpaid." },
  { key: "finalNotice", title: "7 days after", hint: "Final notice: renew or change the registered office." },
  { key: "bccOwner", title: "Copy me on reminders", hint: "BCC contact@korporex.ca." },
  { key: "mondayDigest", title: "Monday digest", hint: "Weekly summary email to contact@korporex.ca." },
];

function money(n: number): string {
  return `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-CA", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function addYear(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const last = new Date(Date.UTC(y + 1, m, 0)).getUTCDate();
  return new Date(Date.UTC(y + 1, m - 1, Math.min(d, last))).toISOString().slice(0, 10);
}

function DaysPill({ n }: { n: number }) {
  const cls =
    n < 0
      ? "bg-red-50 text-red-700"
      : n <= 7
        ? "bg-orange-50 text-orange-700"
        : n <= 30
          ? "bg-amber-50 text-amber-800"
          : "bg-navy-50 text-navy-700";
  const label = n < 0 ? `${-n}d overdue` : n === 0 ? "Today" : `${n}d left`;
  return <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{label}</span>;
}

async function call(url: string, method: string, body?: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : `Request failed (${res.status})`);
  return json;
}

export function OfficeRenewalsBoard({ clients, settings, today, stripeConfigured, cronConfigured }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BoardClient | "new" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [localSettings, setLocalSettings] = useState(settings);

  const staged = useMemo(
    () =>
      clients.map((c) => ({
        c,
        stage: boardStage({ daysLeft: c.daysLeft, status: c.status, lastPaidOn: c.lastPaidOn, today }),
      })),
    [clients, today],
  );

  const q = query.trim().toLowerCase();
  const visible = q
    ? staged.filter(({ c }) => `${c.businessName} ${c.email} ${c.corpNumber ?? ""}`.toLowerCase().includes(q))
    : staged;

  const open = clients.filter((c) => c.status === "active" || c.status === "paused");
  const due = open.filter((c) => c.daysLeft >= 0 && c.daysLeft <= 30);
  const overdue = open.filter((c) => c.daysLeft < 0);
  const recurring = open.reduce((s, c) => s + c.fee, 0);
  const selected = clients.find((c) => c.id === openId) ?? null;

  async function run(label: string, fn: () => Promise<string | void>) {
    setBusy(label);
    setFlash(null);
    try {
      const msg = await fn();
      if (msg) setFlash({ ok: true, text: msg });
      router.refresh();
    } catch (err) {
      setFlash({ ok: false, text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setBusy(null);
    }
  }

  function toggleSetting(key: keyof ReminderSettings) {
    const next = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(next);
    void run("settings", async () => {
      await call("/api/admin/office-renewals", "POST", { op: "settings", settings: { [key]: next[key] } });
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
          <span className={`h-2 w-2 rounded-full ${cronConfigured ? "bg-green-500" : "bg-amber-500"}`} />
          {cronConfigured ? "Daily reminders on (around 9 AM ET)" : "Daily reminders off: CRON_SECRET not set"}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          disabled={!stripeConfigured || busy !== null}
          onClick={() =>
            run("sync", async () => {
              const r = await call("/api/admin/office-renewals", "POST", { op: "sync" });
              const counts = r.counts as Record<string, number>;
              return `Stripe sync done: ${counts.created} added, ${counts.exists} already here, ${counts.duplicate} possible duplicates.`;
            })
          }
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-navy-900 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${busy === "sync" ? "animate-spin" : ""}`} />
          {busy === "sync" ? "Syncing…" : "Sync from Stripe"}
        </button>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <Plus className="h-4 w-4" /> Add client
        </button>
      </div>

      {flash ? (
        <div
          className={`rounded-md border px-4 py-2 text-sm ${
            flash.ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {flash.text}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active clients" value={String(open.length)} hint="Using a Korporex office" icon={Building2} />
        <StatCard title="Due in 30 days" value={String(due.length)} hint={`${money(due.reduce((s, c) => s + c.fee, 0))} to collect`} icon={CalendarClock} />
        <StatCard
          title="Overdue"
          value={String(overdue.length)}
          hint={`${money(overdue.reduce((s, c) => s + c.fee, 0))} at risk`}
          icon={AlertTriangle}
          emphasis={overdue.length ? "warning" : "default"}
        />
        <StatCard title="Annual recurring" value={money(recurring)} hint="Before tax" icon={DollarSign} />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search business, email or corporation number…"
          className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-navy-500 focus:outline-none"
        />
      </div>

      {clients.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
          <Building2 className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-700">No clients yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Click <strong>Sync from Stripe</strong> to import past Registered Office orders, or add one manually.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 overflow-x-auto pb-2 [grid-template-columns:repeat(6,minmax(210px,1fr))]">
          {COLUMNS.map((col) => {
            const items = visible.filter((v) => v.stage === col.key).map((v) => v.c);
            return (
              <div key={col.key} className="min-h-[180px] rounded-lg bg-gray-100 p-3">
                <h3 className={`mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide ${col.tone}`}>
                  {col.label}
                  <span className="rounded-full bg-white px-2 text-gray-600">{items.length}</span>
                </h3>
                {items.length === 0 ? <p className="px-1 text-xs text-gray-400">Nothing here</p> : null}
                {items.map((c) => (
                  <ClientTile key={c.id} c={c} stage={col.key} onOpen={() => setOpenId(c.id)} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-navy-900">Reminder schedule</h2>
          <div className="mt-2 divide-y divide-gray-100">
            {SETTING_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{row.title}</p>
                  <p className="text-xs text-gray-500">{row.hint}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={localSettings[row.key]}
                  aria-label={row.title}
                  onClick={() => toggleSetting(row.key)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${localSettings[row.key] ? "bg-navy-500" : "bg-gray-200"}`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${localSettings[row.key] ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-navy-900">How it works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>New Registered Office purchases (with an incorporation or on their own) are added here automatically.</li>
            <li>Each morning, clients reaching a reminder date get an email with a private link to renew or tell us they are moving.</li>
            <li>When a client pays, reminders stop, the renewal date moves forward one year and they get a confirmation.</li>
            <li>Clients who are moving land in <strong>Moving / closed</strong>; close the file once their change of registered office is filed.</li>
            <li>Paid by e-transfer? Open the client and use <strong>Mark paid</strong>.</li>
          </ol>
        </div>
      </div>

      {selected ? (
        <ClientDrawer
          c={selected}
          busy={busy}
          onClose={() => setOpenId(null)}
          onEdit={() => setEditing(selected)}
          run={run}
          onDeleted={() => setOpenId(null)}
        />
      ) : null}

      {editing ? (
        <ClientForm
          initial={editing === "new" ? null : editing}
          today={today}
          onClose={() => setEditing(null)}
          onSaved={(msg) => {
            setEditing(null);
            setFlash({ ok: true, text: msg });
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function ClientTile({ c, stage, onOpen }: { c: BoardClient; stage: BoardStage; onOpen: () => void }) {
  const sent = new Set(c.events.filter((e) => e.termEndsOn === c.renewsOn).map((e) => e.kind));
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mb-2 w-full rounded-md border border-gray-200 bg-white p-3 text-left transition hover:-translate-y-px hover:shadow-md"
    >
      <p className="truncate text-sm font-semibold text-gray-900">{c.businessName}</p>
      <p className="truncate text-xs text-gray-500">{c.email}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        {stage === "renewed" && c.lastPaidOn ? (
          <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-700">Paid {fmtDate(c.lastPaidOn)}</span>
        ) : c.status === "moving" ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">Moving</span>
        ) : c.status === "closed" ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">Closed</span>
        ) : (
          <DaysPill n={c.daysLeft} />
        )}
        <span className="flex gap-1" title="Reminders sent this term: 60d, 30d, 7d, final">
          {REMINDER_ORDER.map((k) => (
            <i key={k} className={`block h-1.5 w-4 rounded ${sent.has(`reminder_${k}`) ? "bg-gold-500" : "bg-gray-200"}`} />
          ))}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
        <span className="uppercase tracking-wide">
          {c.locationLabel} · {fmtDate(c.renewsOn)}
        </span>
        <span>{c.status === "paused" ? "Paused" : money(c.fee)}</span>
      </div>
    </button>
  );
}

function ClientDrawer({
  c,
  busy,
  onClose,
  onEdit,
  run,
  onDeleted,
}: {
  c: BoardClient;
  busy: string | null;
  onClose: () => void;
  onEdit: () => void;
  run: (label: string, fn: () => Promise<string | void>) => Promise<void>;
  onDeleted: () => void;
}) {
  const url = `/api/admin/office-renewals/${c.id}`;
  const [copied, setCopied] = useState(false);
  const btn = "rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-900 hover:bg-gray-50 disabled:opacity-50";
  const setStatus = (status: string, label: string) => run(label, async () => void (await call(url, "PATCH", { status })));

  return (
    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
      <aside
        className="absolute bottom-0 right-0 top-0 w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-xl font-semibold text-navy-900">{c.businessName}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-gray-500">Email</dt>
          <dd className="break-all">{c.email}</dd>
          {c.contactName ? (
            <>
              <dt className="text-gray-500">Contact</dt>
              <dd>{c.contactName}</dd>
            </>
          ) : null}
          <dt className="text-gray-500">Corporation no.</dt>
          <dd>{c.corpNumber ?? "Not set"}</dd>
          <dt className="text-gray-500">Office</dt>
          <dd>{c.locationLabel}</dd>
          <dt className="text-gray-500">Started</dt>
          <dd>{fmtDate(c.startedOn)}</dd>
          <dt className="text-gray-500">Renewal date</dt>
          <dd className="flex items-center gap-2 font-semibold">
            {fmtDate(c.renewsOn)} <DaysPill n={c.daysLeft} />
          </dd>
          <dt className="text-gray-500">Annual fee</dt>
          <dd>{money(c.fee)} + tax</dd>
          <dt className="text-gray-500">Status</dt>
          <dd className="capitalize">{c.status}</dd>
          {c.movingAddress ? (
            <>
              <dt className="text-gray-500">Moving to</dt>
              <dd>{c.movingAddress}</dd>
            </>
          ) : null}
          {c.notes ? (
            <>
              <dt className="text-gray-500">Notes</dt>
              <dd className="whitespace-pre-line">{c.notes}</dd>
            </>
          ) : null}
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
            disabled={busy !== null || c.status === "closed"}
            onClick={() =>
              run("remind", async () => {
                await call(url, "POST", { action: "send-reminder" });
                return `Reminder emailed to ${c.email}.`;
              })
            }
          >
            {busy === "remind" ? "Sending…" : "Send reminder now"}
          </button>
          <button
            type="button"
            className={btn}
            disabled={!c.link}
            onClick={async () => {
              if (!c.link) return;
              await navigator.clipboard.writeText(c.link);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Copied" : "Copy client link"}
          </button>
          <button
            type="button"
            className={btn}
            disabled={busy !== null}
            onClick={() => {
              if (!window.confirm(`Mark the term ending ${fmtDate(c.renewsOn)} as paid? The renewal date moves to ${fmtDate(addYear(c.renewsOn))} and the client gets a confirmation email.`)) return;
              void run("paid", async () => {
                await call(url, "POST", { action: "mark-paid", termEndsOn: c.renewsOn });
                return `${c.businessName} renewed until ${fmtDate(addYear(c.renewsOn))}.`;
              });
            }}
          >
            Mark paid (e-transfer)
          </button>
          {c.status === "active" ? (
            <button type="button" className={btn} disabled={busy !== null} onClick={() => setStatus("paused", "pause")}>
              Pause reminders
            </button>
          ) : (
            <button type="button" className={btn} disabled={busy !== null} onClick={() => setStatus("active", "resume")}>
              {c.status === "paused" ? "Resume reminders" : "Reopen (active)"}
            </button>
          )}
          {c.status !== "closed" ? (
            <button
              type="button"
              className={`${btn} text-red-700`}
              disabled={busy !== null}
              onClick={() => {
                if (window.confirm(`Close the file for ${c.businessName}? Reminders stop for good.`)) void setStatus("closed", "close");
              }}
            >
              Not renewing (close)
            </button>
          ) : null}
          <button type="button" className={btn} onClick={onEdit}>
            Edit
          </button>
          <button
            type="button"
            className={`${btn} text-red-700`}
            disabled={busy !== null}
            onClick={() => {
              if (!window.confirm(`Delete ${c.businessName} and its history? This cannot be undone.`)) return;
              void run("delete", async () => {
                await call(url, "DELETE");
                onDeleted();
                return `${c.businessName} deleted.`;
              });
            }}
          >
            Delete
          </button>
        </div>

        <h3 className="mt-8 font-serif text-lg font-semibold text-navy-900">Activity</h3>
        <ol className="mt-3 space-y-4 border-l-2 border-gray-200 pl-5">
          {[...c.events].reverse().map((e) => (
            <li key={e.id} className="relative text-sm">
              <span
                className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                  e.kind === "paid" ? "bg-navy-500" : e.kind.startsWith("reminder") ? "bg-gold-500" : e.kind === "moving" ? "bg-red-500" : "bg-gray-400"
                }`}
              />
              <p className="text-gray-900">{EVENT_LABELS[e.kind] ?? e.kind}</p>
              {e.detail ? <p className="text-xs text-gray-600">{e.detail}</p> : null}
              <p className="text-[11px] text-gray-400">{fmtDate(e.createdAt)}</p>
            </li>
          ))}
          {c.events.length === 0 ? <li className="text-sm text-gray-500">No activity yet.</li> : null}
        </ol>
      </aside>
    </div>
  );
}

function ClientForm({
  initial,
  today,
  onClose,
  onSaved,
}: {
  initial: BoardClient | null;
  today: string;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [f, setF] = useState({
    businessName: initial?.businessName ?? "",
    email: initial?.email ?? "",
    contactName: initial?.contactName ?? "",
    corpNumber: initial?.corpNumber ?? "",
    location: initial?.location ?? "burlington",
    startedOn: initial?.startedOn ?? today,
    renewsOn: initial?.renewsOn ?? addYear(today),
    locale: initial?.locale ?? "en",
    notes: initial?.notes ?? "",
  });
  const [renewTouched, setRenewTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof f, v: string) => setF((prev) => ({ ...prev, [k]: v }));
  const input = "mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none";
  const label = "block text-xs font-medium text-gray-600";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (initial) {
        await call(`/api/admin/office-renewals/${initial.id}`, "PATCH", f);
        onSaved(`${f.businessName} updated.`);
      } else {
        await call("/api/admin/office-renewals", "POST", { op: "create", client: f });
        onSaved(`${f.businessName} added.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
      >
        <h2 className="font-serif text-xl font-semibold text-navy-900">{initial ? "Edit client" : "Add client"}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>
            Business name
            <input required className={input} value={f.businessName} onChange={(e) => set("businessName", e.target.value)} />
          </label>
          <label className={label}>
            Email address
            <input required type="email" className={input} value={f.email} onChange={(e) => set("email", e.target.value)} />
          </label>
          <label className={label}>
            Contact name (optional)
            <input className={input} value={f.contactName} onChange={(e) => set("contactName", e.target.value)} />
          </label>
          <label className={label}>
            Corporation number (optional)
            <input className={input} value={f.corpNumber} onChange={(e) => set("corpNumber", e.target.value)} />
          </label>
          <label className={label}>
            Office
            <select className={input} value={f.location} onChange={(e) => set("location", e.target.value)}>
              <option value="burlington">Burlington ($599.88/yr)</option>
              <option value="korporex">Downtown Toronto ($1,199.88/yr)</option>
            </select>
          </label>
          <label className={label}>
            Date started using our office
            <input
              required
              type="date"
              className={input}
              value={f.startedOn}
              onChange={(e) => {
                set("startedOn", e.target.value);
                if (!renewTouched && e.target.value) set("renewsOn", addYear(e.target.value));
              }}
            />
          </label>
          <label className={label}>
            Renewal date
            <input
              required
              type="date"
              className={input}
              value={f.renewsOn}
              onChange={(e) => {
                setRenewTouched(true);
                set("renewsOn", e.target.value);
              }}
            />
          </label>
          <label className={label}>
            Client page language
            <select className={input} value={f.locale} onChange={(e) => set("locale", e.target.value)}>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </label>
          <label className={`${label} sm:col-span-2`}>
            Notes (optional)
            <textarea rows={3} className={input} value={f.notes} onChange={(e) => set("notes", e.target.value)} />
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save client"}
          </button>
        </div>
      </form>
    </div>
  );
}
