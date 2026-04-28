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
// If multi-device or shared access is needed later, swap this module out for
// a Supabase / KV / file-backed store; the Dataset shape stays the same.

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

export function getStorageUsageBytes(): number {
  if (!isBrowser()) return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    const value = localStorage.getItem(key) ?? "";
    total += key.length + value.length;
  }
  // localStorage is UTF-16 internally — multiply by 2 for a rough byte count.
  return total * 2;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function datasetToCsv(dataset: Dataset): string {
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
