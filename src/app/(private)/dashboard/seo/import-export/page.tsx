"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Trash2, ExternalLink, Database } from "lucide-react";
import {
  type Dataset,
  type SeoDatasetKey,
  DATASET_LABELS,
  clearDataset,
  datasetToCsv,
  downloadCsv,
  getDataset,
  getStorageUsageBytes,
  formatBytes,
} from "@/lib/seoStore";

const KEYS: SeoDatasetKey[] = ["link-building", "backlinks", "competitors", "rankings"];

const HUB_PATH: Record<SeoDatasetKey, string> = {
  "link-building": "/dashboard/seo/link-building",
  backlinks: "/dashboard/seo/backlinks",
  competitors: "/dashboard/seo/competitors",
  rankings: "/dashboard/seo/rankings",
};

interface Snapshot {
  loaded: boolean;
  datasets: Record<SeoDatasetKey, Dataset | null>;
  usage: number;
}

function emptySnapshot(): Snapshot {
  return {
    loaded: false,
    datasets: {
      "link-building": null,
      backlinks: null,
      competitors: null,
      rankings: null,
    },
    usage: 0,
  };
}

export default function ImportExportHubPage() {
  const [snap, setSnap] = useState<Snapshot>(emptySnapshot());

  function refresh() {
    const datasets = {
      "link-building": getDataset("link-building"),
      backlinks: getDataset("backlinks"),
      competitors: getDataset("competitors"),
      rankings: getDataset("rankings"),
    };
    setSnap({ loaded: true, datasets, usage: getStorageUsageBytes() });
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleExport(key: SeoDatasetKey) {
    const ds = snap.datasets[key];
    if (!ds) return;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`korporex-${key}-${stamp}.csv`, datasetToCsv(ds));
  }

  function handleClear(key: SeoDatasetKey) {
    if (!confirm(`Clear all ${DATASET_LABELS[key]} data from this browser?`)) return;
    clearDataset(key);
    refresh();
  }

  function handleClearAll() {
    if (!confirm("Clear ALL SEO datasets from this browser?")) return;
    KEYS.forEach(clearDataset);
    refresh();
  }

  function handleExportAll() {
    const stamp = new Date().toISOString().slice(0, 10);
    const bundle = {
      exportedAt: new Date().toISOString(),
      datasets: snap.datasets,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `korporex-seo-bundle-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">
          Import / Export
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage every SEO dataset stored in this browser. Each dataset can be
          imported as CSV, exported as CSV, or cleared individually.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-serif text-base font-semibold text-navy-900">
                Local browser storage
              </p>
              <p className="text-xs text-gray-500">
                {snap.loaded ? formatBytes(snap.usage) : "—"} used by SEO datasets
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportAll}
              disabled={!snap.loaded || KEYS.every((k) => !snap.datasets[k])}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              Export bundle (JSON)
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={!snap.loaded || KEYS.every((k) => !snap.datasets[k])}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {KEYS.map((key) => {
          const ds = snap.datasets[key];
          return (
            <div
              key={key}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-semibold text-navy-900">
                    {DATASET_LABELS[key]}
                  </h2>
                  {ds ? (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {ds.rows.length} rows · {ds.columns.length} columns ·
                      imported{" "}
                      {new Date(ds.importedAt).toLocaleDateString("en-CA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-gray-500">No data yet</p>
                  )}
                </div>
                <Link
                  href={HUB_PATH[key]}
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-navy-900 hover:underline"
                >
                  Open
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleExport(key)}
                  disabled={!ds}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                >
                  <Download className="h-3 w-3" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => handleClear(key)}
                  disabled={!ds}
                  className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-60"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="font-semibold">Storage notes</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-900/90">
          <li>
            Data lives in your browser&apos;s localStorage. Signing in from another
            browser or device shows empty datasets.
          </li>
          <li>
            Browsers cap localStorage at ~5 MB. Very large Ahrefs exports may
            need to be split or pre-filtered.
          </li>
          <li>
            Signing out does <strong>not</strong> clear datasets — clearing browser
            data does. Use the per-dataset Clear buttons for explicit removal.
          </li>
        </ul>
      </div>
    </div>
  );
}
