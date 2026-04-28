"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import type { Dataset } from "@/lib/seoStore";

// Domains we treat as "internal" — anything in a backlink dataset whose
// source URL is one of these isn't actually a backlink, it's an internal
// link from korporex.com to korporex.com (or a Vercel preview / .ca alias
// pointing at the same site). Trailing slashes / paths / subdomains are
// matched substring-wise so e.g. "www.korporex.com/about" is caught.
const INTERNAL_DOMAINS = [
  "korporex.com",
  "korporex.ca",
  "korporex.vercel.app",
];

// Column-name patterns that indicate "the source URL of the backlink"
// (i.e. the page that links to us). Ahrefs default is "Referring page URL".
// Order matters — earlier patterns win when more than one column matches.
const SOURCE_PATTERNS = [
  /^referring page url$/i,
  /^referring url$/i,
  /^source url$/i,
  /^url from$/i,
  /^from url$/i,
  /referring/i,
  /source/i,
  /from/i,
];

// Patterns that indicate the TARGET column, used to disqualify columns
// that match a "source" pattern but really are about the destination.
const TARGET_PATTERNS = [/target/i, /destination/i, /^to url$/i, /\bto\b/i];

function detectSourceColumn(columns: string[]): string | null {
  const candidates = columns.filter(
    (c) => !TARGET_PATTERNS.some((p) => p.test(c)),
  );
  for (const pattern of SOURCE_PATTERNS) {
    const match = candidates.find((c) => pattern.test(c));
    if (match) return match;
  }
  return null;
}

function isInternalUrl(value: string): boolean {
  if (!value) return false;
  const lower = value.toLowerCase();
  return INTERNAL_DOMAINS.some((d) => lower.includes(d));
}

interface Props {
  data: Dataset;
  onUpdate: (next: Dataset) => void;
}

export default function RemoveInternalLinksButton({ data, onUpdate }: Props) {
  const [busy, setBusy] = useState(false);

  const sourceCol = useMemo(() => detectSourceColumn(data.columns), [data.columns]);

  const internalCount = useMemo(() => {
    if (!sourceCol) {
      // Fallback: scan every column. Slower but works on un-named exports.
      return data.rows.filter((row) =>
        Object.values(row).some(isInternalUrl),
      ).length;
    }
    return data.rows.filter((row) => isInternalUrl(row[sourceCol] ?? "")).length;
  }, [data, sourceCol]);

  function handleClick() {
    if (internalCount === 0) {
      alert("No internal-link rows found in this dataset.");
      return;
    }
    const colDescription = sourceCol
      ? `the "${sourceCol}" column`
      : "any column";
    const ok = confirm(
      `Remove ${internalCount} row${internalCount === 1 ? "" : "s"} where ${colDescription} contains ${INTERNAL_DOMAINS.join(", ")}?\n\nThis cannot be undone (export to CSV first if you want a backup).`,
    );
    if (!ok) return;
    setBusy(true);
    const filtered = data.rows.filter((row) => {
      if (sourceCol) return !isInternalUrl(row[sourceCol] ?? "");
      return !Object.values(row).some(isInternalUrl);
    });
    onUpdate({
      ...data,
      rows: filtered,
      importedAt: new Date().toISOString(),
      source: data.source ? `${data.source} (cleaned)` : "cleaned",
    });
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy || internalCount === 0}
      title={
        sourceCol
          ? `Filters on "${sourceCol}". ${internalCount} internal-link rows found.`
          : `No source-URL column auto-detected; will scan all columns. ${internalCount} potential internal-link rows.`
      }
      className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Filter className="h-3.5 w-3.5" />
      Remove internal links
      {internalCount > 0 ? (
        <span className="rounded-full bg-amber-200 px-1.5 py-0.5 text-xs font-semibold text-amber-900">
          {internalCount}
        </span>
      ) : null}
    </button>
  );
}
