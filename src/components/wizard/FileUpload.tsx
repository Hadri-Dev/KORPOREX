"use client";

import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { useLocale } from "next-intl";

const COPY = {
  en: {
    chooseFiles: "Choose Files",
    remove: "Remove",
    typeNotAccepted: "file type not accepted.",
    totalOver: (mb: number) => `Total upload over ${mb} MB.`,
    tooMany: (max: number) => `You can attach up to ${max} files.`,
  },
  fr: {
    chooseFiles: "Choisir des fichiers",
    remove: "Retirer",
    typeNotAccepted: "type de fichier non accepté.",
    totalOver: (mb: number) => `Le téléversement total dépasse ${mb} Mo.`,
    tooMany: (max: number) => `Vous pouvez joindre jusqu'à ${max} fichiers.`,
  },
  es: {
    chooseFiles: "Elegir archivos",
    remove: "Quitar",
    typeNotAccepted: "tipo de archivo no aceptado.",
    totalOver: (mb: number) => `La carga total supera ${mb} MB.`,
    tooMany: (max: number) => `Puede adjuntar hasta ${max} archivos.`,
  },
} as const;

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  title: string;
  hint: string;
  maxFiles: number;
  /** Combined raw size of all files, in bytes. */
  maxTotalBytes: number;
  acceptedMimes: readonly string[];
  /** Validation message owned by the parent form (e.g. "at least one file"). */
  error?: string;
};

/**
 * File picker for forms that forward uploads with the submission. The parent
 * owns the file list; rejected picks (wrong type, over the size or count
 * limit) are reported here and never reach the list.
 */
export default function FileUpload({
  files,
  onChange,
  title,
  hint,
  maxFiles,
  maxTotalBytes,
  acceptedMimes,
  error,
}: Props) {
  const locale = useLocale();
  const t = COPY[locale === "fr" || locale === "es" ? locale : "en"];
  const [pickError, setPickError] = useState<string | null>(null);

  function addFiles(picked: FileList | null) {
    if (!picked) return;
    setPickError(null);
    const next = [...files];
    let total = files.reduce((sum, f) => sum + f.size, 0);
    for (const f of Array.from(picked)) {
      if (next.length >= maxFiles) {
        setPickError(t.tooMany(maxFiles));
        break;
      }
      if (!acceptedMimes.includes(f.type)) {
        setPickError(`${f.name}: ${t.typeNotAccepted}`);
        continue;
      }
      if (total + f.size > maxTotalBytes) {
        setPickError(t.totalOver(maxTotalBytes / 1024 / 1024));
        break;
      }
      next.push(f);
      total += f.size;
    }
    onChange(next);
  }

  const shownError = pickError ?? error;
  // Same convention as Field in WizardUI: a title ending in " *" is mandatory.
  const required = title.endsWith(" *");

  return (
    <div className={`border border-dashed p-4 bg-cream-50 ${shownError ? "border-red-400" : "border-gray-300"}`}>
      <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
        {required ? title.slice(0, -2) : title}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{hint}</p>
      <label className="inline-flex items-center gap-2 border border-navy-900 px-4 py-2.5 text-sm text-navy-900 cursor-pointer hover:bg-navy-50 transition-colors">
        <Upload size={14} /> {t.chooseFiles}
        <input
          type="file"
          multiple
          accept={acceptedMimes.join(",")}
          onChange={(e) => {
            addFiles(e.target.files);
            // Reset so picking the same file again (after removing it) fires onChange.
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-md px-3 py-2"
            >
              <span className="flex items-center gap-2 text-gray-700">
                <FileText size={14} className="text-navy-900" />
                {f.name}
                <span className="text-xs text-gray-500">· {(f.size / 1024).toFixed(0)} KB</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPickError(null);
                  onChange(files.filter((_, idx) => idx !== i));
                }}
                className="text-gray-400 hover:text-red-500"
                aria-label={`${t.remove} ${f.name}`}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {shownError && (
        <p className="text-xs text-red-500 mt-2" role="alert">
          {shownError}
        </p>
      )}
    </div>
  );
}
