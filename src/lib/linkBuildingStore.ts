// Structured Link Building store. Unlike the flat Dataset/Snapshot model used
// by Backlinks/Competitors/etc., Link Building has multiple related tables
// (prospects, acquired links) that benefit from a typed shape.
//
// Storage: localStorage under `kpx:seo:link-building:v2`. Single key for
// simplicity — the whole structure is small (hundreds of rows tops).

const STORAGE_KEY = "kpx:seo:link-building:v2";

export type ProspectType = "outreach" | "submission";

export type ProspectStatus =
  | "new"
  | "contacted"
  | "negotiating"
  | "agreed"
  | "live"
  | "rejected";

export const PROSPECT_STATUSES: ProspectStatus[] = [
  "new",
  "contacted",
  "negotiating",
  "agreed",
  "live",
  "rejected",
];

export const PIPELINE_STATUSES: ProspectStatus[] = [
  "new",
  "contacted",
  "negotiating",
  "agreed",
  "live",
];

export type RenewalFrequency = "one-time" | "monthly" | "annual";

export interface Prospect {
  id: string;
  type: ProspectType;
  domain: string;
  dr: number;
  traffic: number;
  cost: number;
  contactEmail: string;
  submissionUrl: string;
  status: ProspectStatus;
  renewalFrequency: RenewalFrequency;
  notes: string;
  lastAction: string;        // ISO of last status change / log entry
  createdAt: string;
  updatedAt: string;
}

export type LinkType = "guest_post" | "directory" | "resource" | "homepage" | "other";

export type AcquiredStatus = "active" | "lost" | "pending_renewal";

export interface AcquiredLink {
  id: string;
  prospectId?: string;
  referringDomain: string;
  anchorText: string;
  targetUrl: string;
  linkType: LinkType;
  dateAcquired: string;
  dr: number;
  cost: number;
  billingCycle: RenewalFrequency;
  status: AcquiredStatus;
  lastVerified: string;
  notes: string;
  createdAt: string;
}

export interface OutreachLogEntry {
  id: string;
  prospectId: string;
  action: "email_sent" | "follow_up" | "response" | "agreement" | "rejection" | "note" | "status_change";
  note: string;
  createdAt: string;
}

export interface LinkBuildingData {
  prospects: Prospect[];
  acquired: AcquiredLink[];
  outreachLog: OutreachLogEntry[];
}

const EMPTY: LinkBuildingData = { prospects: [], acquired: [], outreachLog: [] };

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `lb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadLinkBuilding(): LinkBuildingData {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<LinkBuildingData>;
    return {
      prospects: parsed.prospects ?? [],
      acquired: parsed.acquired ?? [],
      outreachLog: parsed.outreachLog ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveLinkBuilding(data: LinkBuildingData): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearLinkBuilding(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Mutations (return new state, don't persist — caller saves) ─────────────

export function addProspect(
  data: LinkBuildingData,
  partial: Partial<Prospect> & { domain: string; type: ProspectType },
): LinkBuildingData {
  const now = new Date().toISOString();
  const prospect: Prospect = {
    id: uuid(),
    type: partial.type,
    domain: partial.domain,
    dr: partial.dr ?? 0,
    traffic: partial.traffic ?? 0,
    cost: partial.cost ?? 0,
    contactEmail: partial.contactEmail ?? "",
    submissionUrl: partial.submissionUrl ?? "",
    status: partial.status ?? "new",
    renewalFrequency: partial.renewalFrequency ?? "one-time",
    notes: partial.notes ?? "",
    lastAction: now,
    createdAt: now,
    updatedAt: now,
  };
  return { ...data, prospects: [prospect, ...data.prospects] };
}

export function updateProspect(
  data: LinkBuildingData,
  id: string,
  patch: Partial<Prospect>,
): LinkBuildingData {
  const now = new Date().toISOString();
  const prospects = data.prospects.map((p) =>
    p.id === id ? { ...p, ...patch, updatedAt: now } : p,
  );
  let outreachLog = data.outreachLog;
  if (patch.status) {
    outreachLog = [
      {
        id: uuid(),
        prospectId: id,
        action: "status_change",
        note: `Status → ${patch.status}`,
        createdAt: now,
      },
      ...outreachLog,
    ];
  }
  return { ...data, prospects, outreachLog };
}

export function deleteProspects(
  data: LinkBuildingData,
  ids: string[],
): LinkBuildingData {
  const set = new Set(ids);
  return {
    ...data,
    prospects: data.prospects.filter((p) => !set.has(p.id)),
    outreachLog: data.outreachLog.filter((l) => !set.has(l.prospectId)),
  };
}

export function addAcquired(
  data: LinkBuildingData,
  partial: Partial<AcquiredLink> & { referringDomain: string },
): LinkBuildingData {
  const now = new Date().toISOString();
  const link: AcquiredLink = {
    id: uuid(),
    prospectId: partial.prospectId,
    referringDomain: partial.referringDomain,
    anchorText: partial.anchorText ?? "",
    targetUrl: partial.targetUrl ?? "",
    linkType: partial.linkType ?? "other",
    dateAcquired: partial.dateAcquired ?? now.slice(0, 10),
    dr: partial.dr ?? 0,
    cost: partial.cost ?? 0,
    billingCycle: partial.billingCycle ?? "one-time",
    status: partial.status ?? "active",
    lastVerified: partial.lastVerified ?? now.slice(0, 10),
    notes: partial.notes ?? "",
    createdAt: now,
  };
  return { ...data, acquired: [link, ...data.acquired] };
}

export function updateAcquired(
  data: LinkBuildingData,
  id: string,
  patch: Partial<AcquiredLink>,
): LinkBuildingData {
  return {
    ...data,
    acquired: data.acquired.map((l) => (l.id === id ? { ...l, ...patch } : l)),
  };
}

export function deleteAcquired(
  data: LinkBuildingData,
  ids: string[],
): LinkBuildingData {
  const set = new Set(ids);
  return { ...data, acquired: data.acquired.filter((l) => !set.has(l.id)) };
}

export function addLogEntry(
  data: LinkBuildingData,
  prospectId: string,
  action: OutreachLogEntry["action"],
  note: string,
): LinkBuildingData {
  const now = new Date().toISOString();
  const entry: OutreachLogEntry = {
    id: uuid(),
    prospectId,
    action,
    note,
    createdAt: now,
  };
  const prospects = data.prospects.map((p) =>
    p.id === prospectId ? { ...p, lastAction: now, updatedAt: now } : p,
  );
  return { ...data, outreachLog: [entry, ...data.outreachLog], prospects };
}

// Convert a prospect to an acquired link (also marks prospect status=live).
export function convertProspectToAcquired(
  data: LinkBuildingData,
  prospectId: string,
  partial: Partial<AcquiredLink>,
): LinkBuildingData {
  const prospect = data.prospects.find((p) => p.id === prospectId);
  if (!prospect) return data;
  const next = addAcquired(data, {
    referringDomain: partial.referringDomain ?? prospect.domain,
    anchorText: partial.anchorText ?? "",
    targetUrl: partial.targetUrl ?? "",
    linkType: partial.linkType ?? "other",
    dateAcquired: partial.dateAcquired,
    dr: partial.dr ?? prospect.dr,
    cost: partial.cost ?? prospect.cost,
    billingCycle: partial.billingCycle ?? prospect.renewalFrequency,
    status: "active",
    lastVerified: partial.lastVerified,
    notes: partial.notes ?? "",
    prospectId,
  });
  return updateProspect(next, prospectId, { status: "live" });
}

// ─── CSV import helpers ─────────────────────────────────────────────────────

// Map a free-form CSV row into a Prospect by best-effort header matching.
// Caller is responsible for assigning a `type` (outreach vs submission).
export function csvRowToProspect(
  row: Record<string, string>,
  type: ProspectType,
): Partial<Prospect> & { domain: string; type: ProspectType } {
  const get = (...names: string[]) => {
    for (const n of names) {
      const found = Object.keys(row).find((k) => k.trim().toLowerCase() === n);
      if (found) return row[found] ?? "";
    }
    return "";
  };
  const num = (s: string) => {
    const n = parseFloat(s.replace(/[$,%\s]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  return {
    type,
    domain: get("domain", "referring domain", "site", "url"),
    dr: num(get("dr", "domain rating")),
    traffic: num(get("traffic", "organic traffic", "domain traffic")),
    cost: num(get("cost", "price", "guest_post_price", "fee")),
    contactEmail: get("contact email", "email", "contact"),
    submissionUrl: get("submission url", "submission_url", "submit url"),
    notes: get("notes", "comments"),
  };
}

export function csvRowToAcquired(
  row: Record<string, string>,
): Partial<AcquiredLink> & { referringDomain: string } {
  const get = (...names: string[]) => {
    for (const n of names) {
      const found = Object.keys(row).find((k) => k.trim().toLowerCase() === n);
      if (found) return row[found] ?? "";
    }
    return "";
  };
  const num = (s: string) => {
    const n = parseFloat(s.replace(/[$,%\s]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  return {
    referringDomain: get("referring domain", "domain", "site"),
    anchorText: get("anchor", "anchor text"),
    targetUrl: get("target url", "target", "destination url"),
    linkType: (get("link type", "type") as LinkType) || "other",
    dateAcquired: get("date acquired", "date", "acquired"),
    dr: num(get("dr", "domain rating")),
    cost: num(get("cost", "price")),
    notes: get("notes", "comments"),
  };
}
