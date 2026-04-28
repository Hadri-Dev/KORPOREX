"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Search } from "lucide-react";

interface Props {
  columns: string[];
  rows: Record<string, string>[];
  pageSize?: number;
}

type SortDir = "asc" | "desc";

function isUrlLike(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isNumericColumn(rows: Record<string, string>[], col: string): boolean {
  const sample = rows.slice(0, 50).map((r) => r[col]).filter(Boolean);
  if (sample.length === 0) return false;
  const numericCount = sample.filter((v) => /^-?[\d,.]+%?$/.test(v.trim())).length;
  return numericCount / sample.length > 0.7;
}

function compareValues(a: string, b: string, numeric: boolean, dir: SortDir): number {
  if (numeric) {
    const an = parseFloat(a.replace(/[,%\s]/g, "")) || 0;
    const bn = parseFloat(b.replace(/[,%\s]/g, "")) || 0;
    return dir === "asc" ? an - bn : bn - an;
  }
  return dir === "asc" ? a.localeCompare(b) : b.localeCompare(a);
}

export default function DataTable({ columns, rows, pageSize = 50 }: Props) {
  const [sort, setSort] = useState<{ col: string; dir: SortDir } | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);

  const numericByCol = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const c of columns) map[c] = isNumericColumn(rows, c);
    return map;
  }, [columns, rows]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return rows;
    const q = filter.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => (row[col] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, columns, filter]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const numeric = numericByCol[sort.col] ?? false;
    return [...filtered].sort((a, b) =>
      compareValues(a[sort.col] ?? "", b[sort.col] ?? "", numeric, sort.dir),
    );
  }, [filtered, sort, numericByCol]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  function toggleSort(col: string) {
    setPage(0);
    setSort((prev) => {
      if (!prev || prev.col !== col) return { col, dir: "asc" };
      if (prev.dir === "asc") return { col, dir: "desc" };
      return null;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
            placeholder="Filter rows…"
            className="block w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
          />
        </div>
        <div className="text-xs text-gray-500">
          {filter
            ? `${sorted.length} of ${rows.length} rows`
            : `${rows.length} rows`}
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => {
                const active = sort?.col === col;
                return (
                  <th
                    key={col}
                    scope="col"
                    className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col)}
                      className="inline-flex items-center gap-1 hover:text-navy-900"
                    >
                      <span>{col}</span>
                      {active && sort?.dir === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : active && sort?.dir === "desc" ? (
                        <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-gray-300" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No matching rows.
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr key={safePage * pageSize + i} className="hover:bg-gray-50">
                  {columns.map((col) => {
                    const v = row[col] ?? "";
                    return (
                      <td
                        key={col}
                        className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 max-w-xs truncate"
                        title={v}
                      >
                        {isUrlLike(v) ? (
                          <a
                            href={v}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-navy-900 hover:underline"
                          >
                            {v}
                          </a>
                        ) : (
                          v
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-gray-500">
            Page {safePage + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
