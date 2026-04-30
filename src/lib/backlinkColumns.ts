// Ahrefs / SEMrush backlink-export column shapes vary slightly between
// vendors, sources, and product versions. These helpers normalize a row
// from any reasonable export so the Backlinks page can compute summary
// stats, group by domain, diff snapshots, etc., without forcing the user
// to rename headers before importing.
//
// All matching is case-insensitive. The first-matching pattern wins, so
// list more specific patterns first.

type ColumnKey =
  | "sourceUrl"
  | "sourceDomain"
  | "targetUrl"
  | "anchor"
  | "domainRating"
  | "urlRating"
  | "linkType"
  | "isDofollow"
  | "traffic"
  | "firstSeen"
  | "lastSeen";

const PATTERNS: Record<ColumnKey, RegExp[]> = {
  sourceUrl: [
    /^referring page url$/i,
    /^referring url$/i,
    /^source url$/i,
    /^url from$/i,
    /^from url$/i,
  ],
  sourceDomain: [
    /^referring domain$/i,
    /^source domain$/i,
    /^from domain$/i,
    /^domain$/i,
  ],
  targetUrl: [
    /^target url$/i,
    /^target page url$/i,
    /^destination url$/i,
    /^to url$/i,
  ],
  anchor: [/^anchor$/i, /^anchor text$/i],
  domainRating: [/^domain rating$/i, /^dr$/i, /\bdr\b/i],
  urlRating: [/^url rating$/i, /^ur$/i, /\bur\b/i],
  linkType: [/^link type$/i, /^type$/i],
  isDofollow: [
    /^dofollow$/i,
    /^is.dofollow$/i,
    /^nofollow$/i,
    /^is.nofollow$/i,
  ],
  traffic: [/^domain traffic$/i, /^organic traffic$/i, /^traffic$/i],
  firstSeen: [/^first seen$/i, /^first.seen.\(.+\)$/i, /^discovered$/i],
  lastSeen: [/^last seen$/i, /^last.seen.\(.+\)$/i, /^last check$/i],
};

export type BacklinkColumns = Partial<Record<ColumnKey, string>>;

export function resolveBacklinkColumns(headers: string[]): BacklinkColumns {
  const out: BacklinkColumns = {};
  for (const [key, patterns] of Object.entries(PATTERNS) as [
    ColumnKey,
    RegExp[],
  ][]) {
    for (const p of patterns) {
      const match = headers.find((h) => p.test(h.trim()));
      if (match) {
        out[key] = match;
        break;
      }
    }
  }
  return out;
}

export function getCell(
  row: Record<string, string>,
  cols: BacklinkColumns,
  key: ColumnKey,
): string {
  const c = cols[key];
  if (!c) return "";
  return row[c] ?? "";
}

export function rowDr(row: Record<string, string>, cols: BacklinkColumns): number {
  const raw = getCell(row, cols, "domainRating");
  const n = parseFloat(raw.replace(/[%,\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function rowIsDofollow(
  row: Record<string, string>,
  cols: BacklinkColumns,
): boolean {
  // "Type" / "Link type" sometimes contains "dofollow" / "nofollow" directly.
  const linkType = getCell(row, cols, "linkType").toLowerCase();
  if (linkType) {
    if (linkType.includes("nofollow")) return false;
    if (linkType.includes("dofollow")) return true;
    if (linkType.includes("ugc") || linkType.includes("sponsored")) return false;
  }
  // Some exports use a separate dofollow / nofollow boolean-ish column.
  const flag = getCell(row, cols, "isDofollow").toLowerCase().trim();
  if (!flag) return true; // Ahrefs default if unspecified
  if (flag === "true" || flag === "yes" || flag === "1") {
    // Was the column a "nofollow" column or a "dofollow" column?
    const colName = (cols.isDofollow ?? "").toLowerCase();
    return !colName.includes("nofollow");
  }
  if (flag === "false" || flag === "no" || flag === "0") {
    const colName = (cols.isDofollow ?? "").toLowerCase();
    return colName.includes("nofollow");
  }
  return !flag.includes("nofollow");
}

export function rowDomain(
  row: Record<string, string>,
  cols: BacklinkColumns,
): string {
  const direct = getCell(row, cols, "sourceDomain").trim().toLowerCase();
  if (direct) return direct.replace(/^www\./, "");
  const url = getCell(row, cols, "sourceUrl").trim();
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
