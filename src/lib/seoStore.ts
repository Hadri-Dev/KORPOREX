// Browser-local storage for SEO datasets (Link Building, Backlinks,
// Competitors, Rankings). Single-owner admin → localStorage on the owner's
// browser is the simplest persistence that works without a database.
//
// Tradeoffs:
//   - Data lives in ONE browser. Logging in from another device shows empty.
//   - ~5 MB localStorage limit; very large Ahrefs exports may hit it.
//   - Survives reload + sign-out (logout clears the auth cookie, not local
//     data). To wipe a dataset use the page's "Clear" button or browser tools.
//
// Phase-1 update: Backlinks (and any other dataset that wants snapshot
// history) can use the *snapshots* API below instead of the flat dataset API.
// Snapshots are stored as one localStorage entry per snapshot, plus a small
// index entry. The original Dataset API is preserved for Link Building,
// Competitors, Rankings, Import/Export until they migrate.

export type SeoDatasetKey =
  | "link-building"
  | "backlinks"
  | "competitors"
  | "rankings";

export const DATASET_LABELS: Record<SeoDatasetKey, string> = {
  "link-building": "Link Building",
  backlinks: "Backlinks",
  competitors: "Competitors",
  rankings: "Rankings",
};

export interface Dataset {
  columns: string[];
  rows: Record<string, string>[];
  importedAt: string; // ISO
  source?: string; // e.g. file name
}

const STORAGE_PREFIX = "kpx:seo:";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// ─── Flat dataset API (original; still used by non-snapshot pages) ──────────

export function getDataset(key: SeoDatasetKey): Dataset | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Dataset;
    if (!parsed.columns || !parsed.rows) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setDataset(key: SeoDatasetKey, dataset: Dataset): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(dataset));
}

export function clearDataset(key: SeoDatasetKey): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_PREFIX + key);
}

// ─── Snapshot API (new; Backlinks etc.) ─────────────────────────────────────

export interface SnapshotMeta {
  id: string;            // unique, sortable ISO-derived id
  label?: string;        // optional friendly name
  importedAt: string;    // ISO
  source?: string;       // e.g. file name
  rowCount: number;
}

export interface Snapshot extends SnapshotMeta {
  columns: string[];
  rows: Record<string, string>[];
}

export interface SnapshotIndex {
  snapshots: SnapshotMeta[];
  activeId: string | null;
}

const EMPTY_INDEX: SnapshotIndex = { snapshots: [], activeId: null };

function indexKey(key: SeoDatasetKey): string {
  return `${STORAGE_PREFIX}${key}:index`;
}

function snapshotKey(key: SeoDatasetKey, id: string): string {
  return `${STORAGE_PREFIX}${key}:snap:${id}`;
}

export function getSnapshotIndex(key: SeoDatasetKey): SnapshotIndex {
  if (!isBrowser()) return EMPTY_INDEX;
  try {
    const raw = localStorage.getItem(indexKey(key));
    if (!raw) return EMPTY_INDEX;
    const parsed = JSON.parse(raw) as SnapshotIndex;
    if (!Array.isArray(parsed.snapshots)) return EMPTY_INDEX;
    return parsed;
  } catch {
    return EMPTY_INDEX;
  }
}

export function getSnapshot(
  key: SeoDatasetKey,
  id: string,
): Snapshot | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(snapshotKey(key, id));
    if (!raw) return null;
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

export function getActiveSnapshot(
  key: SeoDatasetKey,
): { snapshot: Snapshot | null; index: SnapshotIndex } {
  const index = getSnapshotIndex(key);
  if (!index.activeId) return { snapshot: null, index };
  const snapshot = getSnapshot(key, index.activeId);
  return { snapshot, index };
}

function makeId(): string {
  // Sortable + unique enough for one-snapshot-per-second cadence.
  const iso = new Date().toISOString().replace(/[:.]/g, "-");
  return iso;
}

// Add a new snapshot from a Dataset. Returns the updated index.
export function addSnapshot(
  key: SeoDatasetKey,
  dataset: Dataset,
  label?: string,
): SnapshotIndex {
  if (!isBrowser()) return EMPTY_INDEX;
  const id = makeId();
  const snapshot: Snapshot = {
    id,
    label,
    importedAt: dataset.importedAt,
    source: dataset.source,
    rowCount: dataset.rows.length,
    columns: dataset.columns,
    rows: dataset.rows,
  };
  localStorage.setItem(snapshotKey(key, id), JSON.stringify(snapshot));

  const current = getSnapshotIndex(key);
  const meta: SnapshotMeta = {
    id,
    label,
    importedAt: snapshot.importedAt,
    source: snapshot.source,
    rowCount: snapshot.rowCount,
  };
  const next: SnapshotIndex = {
    snapshots: [meta, ...current.snapshots], // newest first
    activeId: id,
  };
  localStorage.setItem(indexKey(key), JSON.stringify(next));
  return next;
}

export function setActiveSnapshot(
  key: SeoDatasetKey,
  id: string,
): SnapshotIndex {
  if (!isBrowser()) return EMPTY_INDEX;
  const current = getSnapshotIndex(key);
  if (!current.snapshots.some((s) => s.id === id)) return current;
  const next: SnapshotIndex = { ...current, activeId: id };
  localStorage.setItem(indexKey(key), JSON.stringify(next));
  return next;
}

export function renameSnapshot(
  key: SeoDatasetKey,
  id: string,
  label: string | undefined,
): SnapshotIndex {
  if (!isBrowser()) return EMPTY_INDEX;
  const current = getSnapshotIndex(key);
  const next: SnapshotIndex = {
    ...current,
    snapshots: current.snapshots.map((s) =>
      s.id === id ? { ...s, label } : s,
    ),
  };
  localStorage.setItem(indexKey(key), JSON.stringify(next));
  // also update the snapshot blob so a fresh load matches
  const snap = getSnapshot(key, id);
  if (snap) {
    snap.label = label;
    localStorage.setItem(snapshotKey(key, id), JSON.stringify(snap));
  }
  return next;
}

export function deleteSnapshot(
  key: SeoDatasetKey,
  id: string,
): SnapshotIndex {
  if (!isBrowser()) return EMPTY_INDEX;
  localStorage.removeItem(snapshotKey(key, id));
  const current = getSnapshotIndex(key);
  const remaining = current.snapshots.filter((s) => s.id !== id);
  const activeId =
    current.activeId === id
      ? (remaining[0]?.id ?? null)
      : current.activeId;
  const next: SnapshotIndex = { snapshots: remaining, activeId };
  localStorage.setItem(indexKey(key), JSON.stringify(next));
  return next;
}

export function clearAllSnapshots(key: SeoDatasetKey): void {
  if (!isBrowser()) return;
  const current = getSnapshotIndex(key);
  for (const s of current.snapshots) {
    localStorage.removeItem(snapshotKey(key, s.id));
  }
  localStorage.removeItem(indexKey(key));
}

// ─── Misc ───────────────────────────────────────────────────────────────────

export function getStorageUsageBytes(): number {
  if (!isBrowser()) return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    const value = localStorage.getItem(key) ?? "";
    total += key.length + value.length;
  }
  return total * 2;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function datasetToCsv(dataset: { columns: string[]; rows: Record<string, string>[] }): string {
  const escape = (value: string): string => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };
  const header = dataset.columns.map(escape).join(",");
  const body = dataset.rows
    .map((row) => dataset.columns.map((col) => escape(row[col] ?? "")).join(","))
    .join("\n");
  return body ? `${header}\n${body}` : header;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
