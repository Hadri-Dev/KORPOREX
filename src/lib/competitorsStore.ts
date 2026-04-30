// Competitors store. Like linkBuildingStore, structured (typed) and stored
// as a single localStorage JSON object so all related tables travel together.

const STORAGE_KEY = "kpx:seo:competitors:v2";

export type CompetitorTier = "primary" | "secondary" | "tertiary";

export const TIER_LABELS: Record<CompetitorTier, string> = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
};

export interface Competitor {
  id: string;
  name: string;
  domain: string;
  tier: CompetitorTier;
  jurisdictionCount: number;
  pricingTierCount: number;
  hasPpc: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorMetric {
  id: string;
  competitorId: string;
  snapshotDate: string;
  dr: number;
  ur: number;
  organicTraffic: number;
  organicKeywords: number;
  referringDomains: number;
  referringDomainsDofollow: number;
  totalPages: number;
  top3: number;
  top10: number;
  top100: number;
  avgWordCount: number;
}

export interface CompetitorPage {
  id: string;
  competitorId: string;
  url: string;
  title: string;
  wordCount: number;
  indexed: boolean;
  lastUpdated: string;
}

export interface CompetitorKeyword {
  id: string;
  competitorId: string;
  keyword: string;
  searchVolume: number;
  position: number;
  traffic: number;
  snapshotDate: string;
}

export interface CompetitorBacklink {
  id: string;
  competitorId: string;
  referringUrl: string;
  referringDomain: string;
  dr: number;
  anchorText: string;
  linkType: string;
}

export interface CompetitorsData {
  competitors: Competitor[];
  metrics: CompetitorMetric[];
  pages: CompetitorPage[];
  keywords: CompetitorKeyword[];
  backlinks: CompetitorBacklink[];
}

const EMPTY: CompetitorsData = {
  competitors: [],
  metrics: [],
  pages: [],
  keywords: [],
  backlinks: [],
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadCompetitors(): CompetitorsData {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<CompetitorsData>;
    return {
      competitors: parsed.competitors ?? [],
      metrics: parsed.metrics ?? [],
      pages: parsed.pages ?? [],
      keywords: parsed.keywords ?? [],
      backlinks: parsed.backlinks ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveCompetitors(data: CompetitorsData): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearCompetitors(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Competitor mutations ───────────────────────────────────────────────────

export function addCompetitor(
  data: CompetitorsData,
  partial: Partial<Competitor> & { domain: string },
): CompetitorsData {
  const now = new Date().toISOString();
  const c: Competitor = {
    id: uuid(),
    name: partial.name ?? partial.domain,
    domain: partial.domain,
    tier: partial.tier ?? "secondary",
    jurisdictionCount: partial.jurisdictionCount ?? 0,
    pricingTierCount: partial.pricingTierCount ?? 0,
    hasPpc: partial.hasPpc ?? false,
    notes: partial.notes ?? "",
    createdAt: now,
    updatedAt: now,
  };
  return { ...data, competitors: [c, ...data.competitors] };
}

export function updateCompetitor(
  data: CompetitorsData,
  id: string,
  patch: Partial<Competitor>,
): CompetitorsData {
  const now = new Date().toISOString();
  return {
    ...data,
    competitors: data.competitors.map((c) =>
      c.id === id ? { ...c, ...patch, updatedAt: now } : c,
    ),
  };
}

export function deleteCompetitors(
  data: CompetitorsData,
  ids: string[],
): CompetitorsData {
  const set = new Set(ids);
  return {
    competitors: data.competitors.filter((c) => !set.has(c.id)),
    metrics: data.metrics.filter((m) => !set.has(m.competitorId)),
    pages: data.pages.filter((p) => !set.has(p.competitorId)),
    keywords: data.keywords.filter((k) => !set.has(k.competitorId)),
    backlinks: data.backlinks.filter((b) => !set.has(b.competitorId)),
  };
}

// Auto-snapshot per CSV import: append a metric row with current import date.
export function addMetric(
  data: CompetitorsData,
  competitorId: string,
  partial: Partial<CompetitorMetric>,
): CompetitorsData {
  const m: CompetitorMetric = {
    id: uuid(),
    competitorId,
    snapshotDate: partial.snapshotDate ?? new Date().toISOString().slice(0, 10),
    dr: partial.dr ?? 0,
    ur: partial.ur ?? 0,
    organicTraffic: partial.organicTraffic ?? 0,
    organicKeywords: partial.organicKeywords ?? 0,
    referringDomains: partial.referringDomains ?? 0,
    referringDomainsDofollow: partial.referringDomainsDofollow ?? 0,
    totalPages: partial.totalPages ?? 0,
    top3: partial.top3 ?? 0,
    top10: partial.top10 ?? 0,
    top100: partial.top100 ?? 0,
    avgWordCount: partial.avgWordCount ?? 0,
  };
  return { ...data, metrics: [m, ...data.metrics] };
}

export function addPages(
  data: CompetitorsData,
  competitorId: string,
  rows: Array<Partial<CompetitorPage> & { url: string }>,
): CompetitorsData {
  const items: CompetitorPage[] = rows.map((r) => ({
    id: uuid(),
    competitorId,
    url: r.url,
    title: r.title ?? "",
    wordCount: r.wordCount ?? 0,
    indexed: r.indexed ?? true,
    lastUpdated: r.lastUpdated ?? "",
  }));
  return { ...data, pages: [...items, ...data.pages] };
}

export function addKeywords(
  data: CompetitorsData,
  competitorId: string,
  rows: Array<Partial<CompetitorKeyword> & { keyword: string }>,
): CompetitorsData {
  const today = new Date().toISOString().slice(0, 10);
  const items: CompetitorKeyword[] = rows.map((r) => ({
    id: uuid(),
    competitorId,
    keyword: r.keyword,
    searchVolume: r.searchVolume ?? 0,
    position: r.position ?? 0,
    traffic: r.traffic ?? 0,
    snapshotDate: r.snapshotDate ?? today,
  }));
  return { ...data, keywords: [...items, ...data.keywords] };
}

export function addCompetitorBacklinks(
  data: CompetitorsData,
  competitorId: string,
  rows: Array<Partial<CompetitorBacklink> & { referringDomain: string }>,
): CompetitorsData {
  const items: CompetitorBacklink[] = rows.map((r) => ({
    id: uuid(),
    competitorId,
    referringUrl: r.referringUrl ?? "",
    referringDomain: r.referringDomain,
    dr: r.dr ?? 0,
    anchorText: r.anchorText ?? "",
    linkType: r.linkType ?? "",
  }));
  return { ...data, backlinks: [...items, ...data.backlinks] };
}

// ─── CSV row mappers ────────────────────────────────────────────────────────

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

export function csvRowToMetric(row: Record<string, string>): Partial<CompetitorMetric> {
  return {
    snapshotDate: get(row, "snapshot date", "date") || new Date().toISOString().slice(0, 10),
    dr: num(get(row, "dr", "domain rating")),
    ur: num(get(row, "ur", "url rating")),
    organicTraffic: num(get(row, "organic traffic", "traffic")),
    organicKeywords: num(get(row, "organic keywords", "keywords")),
    referringDomains: num(get(row, "referring domains", "ref domains")),
    referringDomainsDofollow: num(get(row, "ref dofollow", "referring dofollow")),
    totalPages: num(get(row, "total pages", "pages")),
    top3: num(get(row, "top 3", "top3")),
    top10: num(get(row, "top 10", "top10")),
    top100: num(get(row, "top 100", "top100")),
    avgWordCount: num(get(row, "avg word count", "word count")),
  };
}

export function csvRowToPage(row: Record<string, string>): Partial<CompetitorPage> & { url: string } {
  return {
    url: get(row, "url", "page url"),
    title: get(row, "title", "page title"),
    wordCount: num(get(row, "word count", "words")),
    indexed: get(row, "indexed").toLowerCase() !== "no",
    lastUpdated: get(row, "last updated", "updated"),
  };
}

export function csvRowToKeyword(row: Record<string, string>): Partial<CompetitorKeyword> & { keyword: string } {
  return {
    keyword: get(row, "keyword", "query"),
    searchVolume: num(get(row, "search volume", "volume", "sv")),
    position: num(get(row, "position", "current position", "pos")),
    traffic: num(get(row, "traffic")),
    snapshotDate: get(row, "snapshot date", "date"),
  };
}

export function csvRowToCompetitorBacklink(row: Record<string, string>): Partial<CompetitorBacklink> & { referringDomain: string } {
  const url = get(row, "referring page url", "referring url", "source url");
  let domain = get(row, "referring domain", "domain", "source domain");
  if (!domain && url) {
    try { domain = new URL(url).hostname.replace(/^www\./, ""); } catch { domain = ""; }
  }
  return {
    referringDomain: domain,
    referringUrl: url,
    dr: num(get(row, "dr", "domain rating")),
    anchorText: get(row, "anchor", "anchor text"),
    linkType: get(row, "type", "link type"),
  };
}
