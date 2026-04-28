"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, X } from "lucide-react";
import type { Dataset } from "@/lib/seoStore";

interface Props {
  onImported: (dataset: Dataset) => void;
  // Used to label the textarea + file picker, e.g. "Backlinks CSV".
  datasetLabel: string;
  // Optional helper text describing typical column headers.
  helperText?: string;
}

interface ParseResult {
  rows: Record<string, string>[];
  columns: string[];
  errors: string[];
}

function parseCsv(text: string): ParseResult {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });
  const rows = result.data
    .filter((row) => Object.values(row).some((v) => v && String(v).trim().length > 0))
    .map((row) => {
      const out: Record<string, string> = {};
      for (const key of Object.keys(row)) {
        out[key] = row[key] === null || row[key] === undefined ? "" : String(row[key]);
      }
      return out;
    });
  const columns = result.meta.fields?.map((f) => f.trim()).filter(Boolean) ?? [];
  const errors = (result.errors ?? [])
    .filter((e) => e.type !== "FieldMismatch")
    .slice(0, 3)
    .map((e) => `Row ${e.row ?? "?"}: ${e.message}`);
  return { rows, columns, errors };
}

export default function CsvImporter({ onImported, datasetLabel, helperText }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      setText(result);
      setBusy(false);
    };
    reader.onerror = () => {
      setError("Could not read the file.");
      setBusy(false);
    };
    reader.readAsText(file);
  }

  function handleImport() {
    setError(null);
    if (!text.trim()) {
      setError("Paste CSV content or upload a file first.");
      return;
    }
    setBusy(true);
    try {
      const { rows, columns, errors } = parseCsv(text);
      if (rows.length === 0 || columns.length === 0) {
        setError("Could not find any rows. Make sure the first line is the header row.");
        setBusy(false);
        return;
      }
      if (errors.length > 0) {
        // Surface non-blocking parser warnings but still import.
        console.warn("CSV import warnings:", errors);
      }
      const dataset: Dataset = {
        columns,
        rows,
        importedAt: new Date().toISOString(),
        source: fileName ?? "pasted",
      };
      onImported(dataset);
      setText("");
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-base font-semibold text-navy-900">
            Import {datasetLabel}
          </h3>
          {helperText ? (
            <p className="mt-0.5 text-xs text-gray-500">{helperText}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload CSV
          </button>
        </div>
      </div>

      {fileName ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
          <FileText className="h-3.5 w-3.5" />
          {fileName}
          <button
            type="button"
            onClick={() => {
              setFileName(null);
              setText("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="ml-1 text-gray-400 hover:text-gray-700"
            aria-label="Clear selected file"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="…or paste CSV here. First row must be the header."
        rows={6}
        className="mt-3 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-900"
      />

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={handleImport}
          disabled={busy || !text.trim()}
          className="rounded-md bg-navy-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-navy-800 disabled:opacity-60"
        >
          {busy ? "Importing…" : "Import"}
        </button>
      </div>
    </div>
  );
}
