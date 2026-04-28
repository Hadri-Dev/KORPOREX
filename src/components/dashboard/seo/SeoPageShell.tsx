"use client";

import { useEffect, useState } from "react";
import { Download, Trash2, Inbox } from "lucide-react";
import {
  type Dataset,
  type SeoDatasetKey,
  DATASET_LABELS,
  clearDataset,
  datasetToCsv,
  downloadCsv,
  getDataset,
  setDataset,
} from "@/lib/seoStore";
import CsvImporter from "./CsvImporter";
import DataTable from "./DataTable";

interface Props {
  datasetKey: SeoDatasetKey;
  title: string;
  description: string;
  helperText?: string;
  emptyHint?: string;
}

export default function SeoPageShell({
  datasetKey,
  title,
  description,
  helperText,
  emptyHint,
}: Props) {
  const [data, setData] = useState<Dataset | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(getDataset(datasetKey));
    setHydrated(true);
  }, [datasetKey]);

  function handleImported(dataset: Dataset) {
    setDataset(datasetKey, dataset);
    setData(dataset);
  }

  function handleClear() {
    if (!confirm(`Clear all ${DATASET_LABELS[datasetKey]} data from this browser?`)) return;
    clearDataset(datasetKey);
    setData(null);
  }

  function handleExport() {
    if (!data) return;
    const csv = datasetToCsv(data);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`korporex-${datasetKey}-${stamp}.csv`, csv);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        {data ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        ) : null}
      </div>

      {!hydrated ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
          Loading…
        </div>
      ) : !data ? (
        <>
          <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
            <Inbox className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-700">No data yet</p>
            <p className="mt-1 text-xs text-gray-500">
              {emptyHint ??
                "Paste a CSV below or upload a file. The first row is the header."}
            </p>
          </div>
          <CsvImporter
            onImported={handleImported}
            datasetLabel={DATASET_LABELS[datasetKey]}
            helperText={helperText}
          />
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 rounded-md bg-gray-50 px-4 py-2 text-xs text-gray-600">
            <span>
              <strong className="text-gray-900">{data.rows.length}</strong> rows ·{" "}
              <strong className="text-gray-900">{data.columns.length}</strong> columns
            </span>
            <span className="text-gray-400">·</span>
            <span>
              Imported {new Date(data.importedAt).toLocaleString("en-CA", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {data.source ? ` from ${data.source}` : ""}
            </span>
          </div>

          <DataTable columns={data.columns} rows={data.rows} />

          <details className="rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm">
            <summary className="cursor-pointer font-medium text-gray-700">
              Re-import / replace data
            </summary>
            <div className="mt-3">
              <CsvImporter
                onImported={handleImported}
                datasetLabel={DATASET_LABELS[datasetKey]}
                helperText={helperText}
              />
            </div>
          </details>
        </>
      )}
    </div>
  );
}
