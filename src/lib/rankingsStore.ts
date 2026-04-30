// Rankings store. Holds:
//   - moneyPagesConfig: per-money-page metadata (target keywords, notes, status)
//   - gscSnapshots / ahrefsSnapshots: history of imports (each with columns + rows)
//   - localRankings: manually-entered city/keyword/position tracking
//
// Single localStorage key per concern; structured types.

const KEY_MONEY_PAGES = "kpx:seo:rankings:money-pages:v2";
const KEY_GSC_SNAPSHOTS = "kpx:seo:rankings:gsc-snapshots:v2";
const KEY_AHREFS_SNAPSHOTS = "kpx:seo:rankings:ahrefs-snapshots:v2";
const KEY_LOCAL_RANKINGS = "kpx:seo:rankings:local:v2";

export const KORPOREX_MONEY_PAGES: Array<{ path: string; label: string }> = [
  { path: "/incorporate", label: "Incorporate (overview)" },
  { path: "/incorporate?jurisdiction=federal", label: "Federal incorporation" },
  { path: "/incorporate?jurisdiction=ontario", label: "Ontario incorporation" },
  { path: "/pricing", label: "Pricing" },
  { path: "/services", label: "Services" },
  { path: "/legal-consultation", label: "Talk to a Lawyer" },
  { path: "/resources", label: "Resources" },
  { path: "/about", label: "About" },
];

export type PageStatus = "good" | "needs_work" | "underperforming" | "untracked";

export interface MoneyPageConfig {
  path: string;                // canonical path (key)
  targetKeywords: string[];    // comma-separated input → array
  notes: string;
  status: PageStatus;
  manualPosition?: number;     // owner's tracked position; falls back to GSC
}

export interface GscSnapshot {
  id: string;
  importedAt: string;
  source?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  rows: GscRow[];
}

export interface GscRow {
  url: string;
  query?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface AhrefsSnapshot {
  id: string;
  importedAt: string;
  source?: string;
  rows: AhrefsRow[];
}

export interface AhrefsRow {
  keyword: string;
  url: string;
  position: number;
  searchVolume: number;
  traffic: number;
  difficulty: number;
}

export interface LocalRankingEntry {
  id: string;
  city: string;
  keyword: string;
  position: number;
  previousPosition?: number;
  measuredAt: string;
  notes: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Money pages config ─────────────────────────────────────────────────────

export function loadMoneyPagesConfig(): MoneyPageConfig[] {
  if (!isBrowser()) return defaultMoneyPagesConfig();
  try {
    const raw = localStorage.getItem(KEY_MONEY_PAGES);
    if (!raw) return defaultMoneyPagesConfig();
    const parsed = JSON.parse(raw) as MoneyPageConfig[];
    // Merge with the canonical list so newly-added pages show up.
    const byPath = new Map<string, MoneyPageConfig>();
    for (const p of parsed) byPath.set(p.path, p);
    return KORPOREX_MONEY_PAGES.map((mp) =>
      byPath.get(mp.path) ?? defaultPageConfig(mp.path),
    );
  } catch {
    return defaultMoneyPagesConfig();
  }
}

export function saveMoneyPagesConfig(config: MoneyPageConfig[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_MONEY_PAGES, JSON.stringify(config));
}

function defaultMoneyPagesConfig(): MoneyPageConfig[] {
  return KORPOREX_MONEY_PAGES.map((mp) => defaultPageConfig(mp.path));
}

function defaultPageConfig(path: string): MoneyPageConfig {
  return { path, targetKeywords: [], notes: "", status: "untracked" };
}

// ─── GSC snapshots ──────────────────────────────────────────────────────────

export function loadGscSnapshots(): GscSnapshot[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY_GSC_SNAPSHOTS);
    if (!raw) return [];
    return JSON.parse(raw) as GscSnapshot[];
  } catch {
    return [];
  }
}

export function saveGscSnapshots(snapshots: GscSnapshot[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_GSC_SNAPSHOTS, JSON.stringify(snapshots));
}

export function addGscSnapshot(rows: GscRow[], source?: string): GscSnapshot {
  const snap: GscSnapshot = {
    id: uuid(),
    importedAt: new Date().toISOString(),
    source,
    rows,
  };
  const all = loadGscSnapshots();
  saveGscSnapshots([snap, ...all]);
  return snap;
}

export function deleteGscSnapshot(id: string): void {
  saveGscSnapshots(loadGscSnapshots().filter((s) => s.id !== id));
}

// ─── Ahrefs snapshots ───────────────────────────────────────────────────────

export function loadAhrefsSnapshots(): AhrefsSnapshot[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY_AHREFS_SNAPSHOTS);
    if (!raw) return [];
    return JSON.parse(raw) as AhrefsSnapshot[];
  } catch {
    return [];
  }
}

export function saveAhrefsSnapshots(snapshots: AhrefsSnapshot[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_AHREFS_SNAPSHOTS, JSON.stringify(snapshots));
}

export function addAhrefsSnapshot(rows: AhrefsRow[], source?: string): AhrefsSnapshot {
  const snap: AhrefsSnapshot = {
    id: uuid(),
    importedAt: new Date().toISOString(),
    source,
    rows,
  };
  const all = loadAhrefsSnapshots();
  saveAhrefsSnapshots([snap, ...all]);
  return snap;
}

export function deleteAhrefsSnapshot(id: string): void {
  saveAhrefsSnapshots(loadAhrefsSnapshots().filter((s) => s.id !== id));
}

// ─── Local rankings ─────────────────────────────────────────────────────────

export function loadLocalRankings(): LocalRankingEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY_LOCAL_RANKINGS);
    if (!raw) return [];
    return JSON.parse(raw) as LocalRankingEntry[];
  } catch {
    return [];
  }
}

export function saveLocalRankings(entries: LocalRankingEntry[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_LOCAL_RANKINGS, JSON.stringify(entries));
}

export function addLocalRanking(
  current: LocalRankingEntry[],
  partial: Omit<LocalRankingEntry, "id">,
): LocalRankingEntry[] {
  // If we have a previous entry for the same (city, keyword), use its position
  // as previousPosition automatically.
  const previous = current.find(
    (e) =>
      e.city.toLowerCase() === partial.city.toLowerCase() &&
      e.keyword.toLowerCase() === partial.keyword.toLowerCase(),
  );
  const entry: LocalRankingEntry = {
    id: uuid(),
    ...partial,
    previousPosition: partial.previousPosition ?? previous?.position,
  };
  const next = [entry, ...current];
  saveLocalRankings(next);
  return next;
}

export function deleteLocalRanking(
  current: LocalRankingEntry[],
  id: string,
): LocalRankingEntry[] {
  const next = current.filter((e) => e.id !== id);
  saveLocalRankings(next);
  return next;
}

// ─── CSV mappers ────────────────────────────────────────────────────────────

function get(row: Record<string, string>, ...names: string[]): string {
  for (const n of names) {
    const found = Object.keys(row).find((k) => k.trim().toLowerCase() === n);
    if (found) return row[found] ?? "";
  }
  return "";
}
function num(s: string): number {
  const n = parseFloat(s.replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function csvRowToGsc(row: Record<string, string>): GscRow {
  return {
    url: get(row, "page", "url", "landing page"),
    query: get(row, "query", "search term") || undefined,
    clicks: num(get(row, "clicks")),
    impressions: num(get(row, "impressions")),
    ctr: num(get(row, "ctr")),
    position: num(get(row, "position", "average position")),
  };
}

export function csvRowToAhrefs(row: Record<string, string>): AhrefsRow {
  return {
    keyword: get(row, "keyword"),
    url: get(row, "url", "current url", "page url"),
    position: num(get(row, "current position", "position")),
    searchVolume: num(get(row, "volume", "search volume", "sv")),
    traffic: num(get(row, "current traffic", "traffic")),
    difficulty: num(get(row, "kd", "keyword difficulty", "difficulty")),
  };
}

// Status auto-classification from a position.
export function statusFromPosition(pos?: number): PageStatus {
  if (pos === undefined || pos === 0 || !Number.isFinite(pos)) return "untracked";
  if (pos <= 5) return "good";
  if (pos <= 20) return "needs_work";
  return "underperforming";
}

export const STATUS_LABELS: Record<PageStatus, string> = {
  good: "Good",
  needs_work: "Needs work",
  underperforming: "Underperforming",
  untracked: "Untracked",
};

export const STATUS_COLORS: Record<PageStatus, string> = {
  good: "bg-emerald-100 text-emerald-800",
  needs_work: "bg-amber-100 text-amber-800",
  underperforming: "bg-red-100 text-red-800",
  untracked: "bg-gray-100 text-gray-700",
};
