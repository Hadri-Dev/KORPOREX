// Tracks every CSV import done across all SEO tools, so the user has a record
// of what was imported, when, and how many rows. Browser-local; oldest 200
// kept (older entries auto-pruned).

const KEY = "kpx:seo:imports-history:v1";
const MAX_ENTRIES = 200;

export type ImportType =
  | "backlinks"
  | "outreach-prospects"
  | "submission-prospects"
  | "acquired-links"
  | "competitor-metric"
  | "competitor-pages"
  | "competitor-keywords"
  | "competitor-backlinks"
  | "gsc"
  | "ahrefs-keywords";

export const IMPORT_TYPE_LABELS: Record<ImportType, string> = {
  backlinks: "Backlinks",
  "outreach-prospects": "Outreach prospects",
  "submission-prospects": "Submission prospects",
  "acquired-links": "Acquired links",
  "competitor-metric": "Competitor metric",
  "competitor-pages": "Competitor pages",
  "competitor-keywords": "Competitor keywords",
  "competitor-backlinks": "Competitor backlinks",
  gsc: "GSC export",
  "ahrefs-keywords": "Ahrefs organic keywords",
};

export interface ImportHistoryEntry {
  id: string;
  type: ImportType;
  filename: string;
  rowCount: number;
  importedAt: string;
  status: "ok" | "partial" | "error";
  message?: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `imp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadImportHistory(): ImportHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ImportHistoryEntry[];
  } catch {
    return [];
  }
}

export function logImport(entry: Omit<ImportHistoryEntry, "id" | "importedAt">): void {
  if (!isBrowser()) return;
  const next: ImportHistoryEntry = {
    ...entry,
    id: uuid(),
    importedAt: new Date().toISOString(),
  };
  const all = loadImportHistory();
  const merged = [next, ...all].slice(0, MAX_ENTRIES);
  localStorage.setItem(KEY, JSON.stringify(merged));
}

export function clearImportHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
}

// Detect import type from filename — first matching pattern wins.
const PATTERNS: Array<{ type: ImportType; re: RegExp }> = [
  { type: "backlinks", re: /backlinks?/i },
  { type: "ahrefs-keywords", re: /(ahrefs|organic[-_ ]?keywords|keyword[-_ ]?explorer)/i },
  { type: "gsc", re: /(gsc|search[-_ ]?console|performance)/i },
  { type: "competitor-keywords", re: /competitor.*keywords/i },
  { type: "competitor-backlinks", re: /competitor.*backlinks/i },
  { type: "competitor-pages", re: /competitor.*pages/i },
  { type: "competitor-metric", re: /competitor.*(metric|overview)/i },
  { type: "outreach-prospects", re: /outreach/i },
  { type: "submission-prospects", re: /submission/i },
  { type: "acquired-links", re: /acquired/i },
];

export function detectImportType(filename: string): ImportType | null {
  for (const { type, re } of PATTERNS) {
    if (re.test(filename)) return type;
  }
  return null;
}
