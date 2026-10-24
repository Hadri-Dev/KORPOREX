// Pure, dependency-free rules for the Registered Office renewal reminders
// (/dashboard/office-renewals + the daily cron). Kept separate from the
// Supabase store in `officeRenewals.ts` so the date math and reminder windows
// can be reasoned about (and tested) without a database.
//
// All dates are calendar dates ("YYYY-MM-DD") in America/Toronto. Day counts
// are computed in UTC on those dates so DST changes never shift a window.

export type OfficeStatus = "active" | "paused" | "moving" | "closed";
export type ReminderKind = "d60" | "d30" | "d7" | "final";

export type ReminderSettings = {
  d60: boolean;
  d30: boolean;
  d7: boolean;
  finalNotice: boolean;
  bccOwner: boolean;
  mondayDigest: boolean;
};

export const DEFAULT_SETTINGS: ReminderSettings = {
  d60: false,
  d30: true,
  d7: true,
  finalNotice: true,
  bccOwner: true,
  mondayDigest: true,
};

const TZ = "America/Toronto";

export function torontoDate(at: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

export function torontoWeekday(at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long" }).format(at);
}

function parts(iso: string): [number, number, number] {
  const [y, m, d] = iso.split("-").map(Number);
  return [y, m, d];
}

export function isIsoDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = parts(v);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function daysBetween(fromIso: string, toIso: string): number {
  const [y1, m1, d1] = parts(fromIso);
  const [y2, m2, d2] = parts(toIso);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = parts(iso);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// Feb 29 + 1 year lands on Feb 28, never Mar 1.
export function addYears(iso: string, n: number): string {
  const [y, m, d] = parts(iso);
  const lastDay = new Date(Date.UTC(y + n, m, 0)).getUTCDate();
  return new Date(Date.UTC(y + n, m - 1, Math.min(d, lastDay))).toISOString().slice(0, 10);
}

export function formatLongDate(iso: string): string {
  const [y, m, d] = parts(iso);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

// Which reminder window a client is in, by days left until renews_on.
// Exactly one window can match, so the cron sends at most one email per
// client per run, and a client imported late (e.g. 5 days out) gets the
// 7-day email rather than a burst of every missed one. Days -1 to -6 are a
// quiet gap after the 7-day email; the final notice goes at day -7 and stays
// eligible until day -60 so a missed cron run still catches it.
export function reminderWindow(daysLeft: number): ReminderKind | null {
  if (daysLeft <= -7 && daysLeft >= -60) return "final";
  if (daysLeft >= 0 && daysLeft <= 7) return "d7";
  if (daysLeft >= 8 && daysLeft <= 30) return "d30";
  if (daysLeft >= 31 && daysLeft <= 60) return "d60";
  return null;
}

export function isReminderEnabled(kind: ReminderKind, s: ReminderSettings): boolean {
  if (kind === "final") return s.finalNotice;
  return s[kind];
}

export function dueReminder(
  daysLeft: number,
  status: OfficeStatus,
  settings: ReminderSettings,
  alreadySent: ReadonlySet<ReminderKind>,
): ReminderKind | null {
  if (status !== "active") return null;
  const kind = reminderWindow(daysLeft);
  if (!kind || !isReminderEnabled(kind, settings) || alreadySent.has(kind)) return null;
  return kind;
}

// Dashboard board column.
export type BoardStage = "upcoming" | "reminder" | "finalWeek" | "overdue" | "renewed" | "leaving";

export function boardStage(args: {
  daysLeft: number;
  status: OfficeStatus;
  lastPaidOn: string | null;
  today: string;
}): BoardStage {
  if (args.status === "moving" || args.status === "closed") return "leaving";
  if (args.lastPaidOn && daysBetween(args.lastPaidOn, args.today) <= 30) return "renewed";
  if (args.daysLeft < 0) return "overdue";
  if (args.daysLeft <= 7) return "finalWeek";
  if (args.daysLeft <= 30) return "reminder";
  return "upcoming";
}
