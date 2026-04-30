"use client";

import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { SnapshotIndex, SnapshotMeta } from "@/lib/seoStore";

interface Props {
  index: SnapshotIndex;
  onSelect: (id: string) => void;
  onRename?: (id: string, label: string | undefined) => void;
  onDelete?: (id: string) => void;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLabel(meta: SnapshotMeta): string {
  if (meta.label) return meta.label;
  return formatTimestamp(meta.importedAt);
}

export default function SnapshotPicker({ index, onSelect, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");

  if (index.snapshots.length === 0) return null;

  function startRename(meta: SnapshotMeta) {
    setEditing(meta.id);
    setDraftLabel(meta.label ?? "");
  }

  function commitRename(id: string) {
    if (onRename) onRename(id, draftLabel.trim() || undefined);
    setEditing(null);
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Snapshots ({index.snapshots.length})
      </h3>
      <ul className="space-y-1">
        {index.snapshots.map((meta) => {
          const active = index.activeId === meta.id;
          const isEditing = editing === meta.id;
          return (
            <li
              key={meta.id}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm ${
                active
                  ? "border-navy-900 bg-navy-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(meta.id)}
                className="flex flex-1 items-center gap-2 overflow-hidden text-left"
                title={`${meta.rowCount.toLocaleString()} rows · imported ${formatTimestamp(meta.importedAt)}${meta.source ? ` from ${meta.source}` : ""}`}
              >
                {active ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-navy-900" />
                ) : (
                  <span className="h-3.5 w-3.5 shrink-0" />
                )}
                {isEditing ? (
                  <input
                    autoFocus
                    type="text"
                    value={draftLabel}
                    onChange={(e) => setDraftLabel(e.target.value)}
                    onBlur={() => commitRename(meta.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(meta.id);
                      if (e.key === "Escape") setEditing(null);
                    }}
                    className="flex-1 rounded border border-gray-300 px-1.5 py-0.5 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className={`truncate text-xs ${active ? "font-medium text-navy-900" : "text-gray-700"}`}>
                    {formatLabel(meta)}
                  </span>
                )}
                <span className="shrink-0 text-[10px] text-gray-400">
                  {meta.rowCount.toLocaleString()}
                </span>
              </button>
              {onRename ? (
                <button
                  type="button"
                  onClick={() => startRename(meta)}
                  className="text-gray-400 hover:text-gray-700"
                  aria-label="Rename"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              ) : null}
              {onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Delete snapshot "${formatLabel(meta)}"? This cannot be undone.`,
                      )
                    )
                      onDelete(meta.id);
                  }}
                  className="text-gray-400 hover:text-red-600"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
