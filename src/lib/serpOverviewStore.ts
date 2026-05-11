// SERP Overview store. Each snapshot represents a single Ahrefs SERP-overview
// export for one keyword (the top N pages currently ranking for it). Snapshots
// are kept indefinitely so we can show position deltas between imports.
//
// Single localStorage key; structured types. Newest snapshot first within each
// keyword (so [0] is "latest" everywhere).

const KEY_SNAPSHOTS = "kpx:seo:serp-overview:snapshots:v1";

export interface SerpEntry {
  position: number;
  url: string;
  domain: string;
  title: string;
  type?: string;          // "organic" | "featured snippet" | "people also ask" | …
  domainRating?: number;
  urlRating?: number;
  backlinks?: number;
  referringDomains?: number;
  pageTraffic?: number;   // estimated traffic to this URL (Ahrefs "Traffic")
  searchVolume?: number;  // monthly volume of the keyword (constant across rows; copied into each row for export)
  topKeyword?: string;
  topKeywordVolume?: number;
}

export interface SerpSnapshot {
  id: string;
  keyword: string;        // canonicalised lowercase
  importedAt: string;     // ISO
  source?: string;        // original filename
  country?: string;       // optional — Ahrefs country code if user provides
  rows: SerpEntry[];
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `serp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function canonicalKeyword(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

export function loadSerpSnapshots(): SerpSnapshot[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY_SNAPSHOTS);
    if (!raw) return [];
    return JSON.parse(raw) as SerpSnapshot[];
  } catch {
    return [];
  }
}

export function saveSerpSnapshots(snapshots: SerpSnapshot[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEY_SNAPSHOTS, JSON.stringify(snapshots));
}

export function addSerpSnapshot(
  partial: { keyword: string; rows: SerpEntry[]; source?: string; country?: string },
): SerpSnapshot {
  const snap: SerpSnapshot = {
    id: uuid(),
    keyword: canonicalKeyword(partial.keyword),
    importedAt: new Date().toISOString(),
    source: partial.source,
    country: partial.country,
    rows: partial.rows,
  };
  const all = loadSerpSnapshots();
  saveSerpSnapshots([snap, ...all]);
  return snap;
}

export function deleteSerpSnapshot(id: string): void {
  saveSerpSnapshots(loadSerpSnapshots().filter((s) => s.id !== id));
}

export function deleteSerpKeyword(keyword: string): void {
  const k = canonicalKeyword(keyword);
  saveSerpSnapshots(loadSerpSnapshots().filter((s) => s.keyword !== k));
}

// ─── Keyword grouping helpers ───────────────────────────────────────────────

export interface KeywordGroup {
  keyword: string;
  snapshots: SerpSnapshot[]; // newest first
}

export function groupByKeyword(all: SerpSnapshot[]): KeywordGroup[] {
  const map = new Map<string, SerpSnapshot[]>();
  for (const s of all) {
    const list = map.get(s.keyword) ?? [];
    list.push(s);
    map.set(s.keyword, list);
  }
  // Sort each keyword's snapshots newest-first, and groups by latest import desc.
  const groups: KeywordGroup[] = Array.from(map.entries()).map(([keyword, snapshots]) => ({
    keyword,
    snapshots: snapshots.slice().sort((a, b) => b.importedAt.localeCompare(a.importedAt)),
  }));
  groups.sort((a, b) => b.snapshots[0].importedAt.localeCompare(a.snapshots[0].importedAt));
  return groups;
}

// Domain frequency — across the latest snapshot of every tracked keyword,
// how many times does each domain appear in the top N?
export interface DomainFrequencyEntry {
  domain: string;
  appearances: number;          // # of distinct keywords domain appears in
  totalKeywords: number;        // total tracked keywords
  averagePosition: number;      // mean position across appearances
  bestPosition: number;         // smallest position seen
  inTop3: number;
  inTop10: number;
  exampleKeywords: string[];    // first 3 keywords where it ranks
}

export function buildDomainFrequency(
  groups: KeywordGroup[],
  topN: number,
): DomainFrequencyEntry[] {
  const totalKeywords = groups.length;
  const byDomain = new Map<string, {
    positions: number[];
    keywords: string[];
  }>();

  for (const group of groups) {
    const latest = group.snapshots[0];
    if (!latest) continue;
    const seenInThisKeyword = new Set<string>();
    for (const row of latest.rows) {
      if (row.position > topN) continue;
      if (!row.domain) continue;
      // count each domain at most once per keyword (use best position)
      if (seenInThisKeyword.has(row.domain)) {
        const bucket = byDomain.get(row.domain)!;
        const last = bucket.positions[bucket.positions.length - 1];
        if (row.position < last) bucket.positions[bucket.positions.length - 1] = row.position;
        continue;
      }
      seenInThisKeyword.add(row.domain);
      const bucket = byDomain.get(row.domain) ?? { positions: [], keywords: [] };
      bucket.positions.push(row.position);
      bucket.keywords.push(group.keyword);
      byDomain.set(row.domain, bucket);
    }
  }

  const entries: DomainFrequencyEntry[] = Array.from(byDomain.entries()).map(([domain, b]) => {
    const sum = b.positions.reduce((a, c) => a + c, 0);
    return {
      domain,
      appearances: b.positions.length,
      totalKeywords,
      averagePosition: b.positions.length ? sum / b.positions.length : 0,
      bestPosition: b.positions.length ? Math.min(...b.positions) : 0,
      inTop3: b.positions.filter((p) => p <= 3).length,
      inTop10: b.positions.filter((p) => p <= 10).length,
      exampleKeywords: b.keywords.slice(0, 3),
    };
  });

  entries.sort((a, b) => b.appearances - a.appearances || a.averagePosition - b.averagePosition);
  return entries;
}

// ─── Position-delta helper ──────────────────────────────────────────────────

export interface PositionDelta {
  current: number;
  previous?: number;
  delta?: number;        // positive = improved (moved up); negative = dropped
  isNew: boolean;        // domain wasn't in previous snapshot
  dropped: boolean;      // present in previous but not current (only filled by the dropped-rows builder)
}

export function deltaForUrl(
  current: SerpSnapshot,
  previous: SerpSnapshot | undefined,
  url: string,
  position: number,
): PositionDelta {
  if (!previous) return { current: position, isNew: false, dropped: false };
  const prev = previous.rows.find((r) => r.url === url);
  if (!prev) return { current: position, isNew: true, dropped: false };
  return {
    current: position,
    previous: prev.position,
    delta: prev.position - position, // positive = improved
    isNew: false,
    dropped: false,
  };
}

export function droppedSinceLast(current: SerpSnapshot, previous?: SerpSnapshot): SerpEntry[] {
  if (!previous) return [];
  const currentUrls = new Set(current.rows.map((r) => r.url));
  return previous.rows.filter((r) => !currentUrls.has(r.url));
}

// ─── Filename → keyword detection ───────────────────────────────────────────

// Ahrefs SERP overview filenames look like one of:
//   serp-overview_united-states_ontario-incorporation_2025-05-10_xx.csv
//   keyword-explorer_serp_ontario-incorporation_2025-05-10.csv
//   serp_overview-ontario_incorporation-20250510.csv
// We strip known prefixes/suffixes (date, locale, "serp", "overview", "ahrefs",
// "keyword explorer") and convert the remainder back to a keyword phrase.
const STRIP_TOKENS = [
  /^ahrefs/i,
  /^keyword[-_ ]?explorer$/i,
  /^serp$/i,
  /^overview$/i,
  /^export$/i,
  /^\d{4}[-_]?\d{2}[-_]?\d{2}$/,                     // 2025-05-10
  /^\d{8}$/,                                          // 20250510
  /^\d{1,3}$/,                                        // trailing index counter
  /^(en|fr|es|us|ca|uk|gb|au|de|it|jp|cn)$/i,         // locale/country
  /^(united[-_ ]?states|canada|united[-_ ]?kingdom|australia|germany|france)$/i,
];

export function detectKeywordFromFilename(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, "");
  // Split on common separators, drop stripped tokens, join surviving tokens with a space.
  const parts = stem.split(/[_\-\s.]+/).filter(Boolean);
  const kept = parts.filter((p) => !STRIP_TOKENS.some((re) => re.test(p)));
  return kept.join(" ").trim();
}

// ─── CSV mapper ─────────────────────────────────────────────────────────────

function get(row: Record<string, string>, ...names: string[]): string {
  for (const n of names) {
    const found = Object.keys(row).find((k) => k.trim().toLowerCase() === n);
    if (found) return row[found] ?? "";
  }
  return "";
}

function num(s: string): number {
  if (!s) return 0;
  const n = parseFloat(s.replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function domainFromUrl(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase();
  }
}

export function csvRowToSerp(row: Record<string, string>): SerpEntry {
  const url = get(row, "url", "page url", "current url");
  return {
    position: num(get(row, "#", "position", "current position", "rank")),
    url,
    domain: get(row, "domain") || domainFromUrl(url),
    title: get(row, "page", "title", "page title"),
    type: get(row, "type", "serp feature") || undefined,
    domainRating: num(get(row, "domain rating", "dr")) || undefined,
    urlRating: num(get(row, "url rating", "ur")) || undefined,
    backlinks: num(get(row, "backlinks")) || undefined,
    referringDomains: num(get(row, "referring domains", "ref domains", "rd")) || undefined,
    pageTraffic: num(get(row, "page traffic", "traffic", "at", "ahrefs traffic")) || undefined,
    searchVolume: num(get(row, "volume", "search volume", "keyword volume")) || undefined,
    topKeyword: get(row, "top keyword") || undefined,
    topKeywordVolume: num(get(row, "top keyword volume")) || undefined,
  };
}
