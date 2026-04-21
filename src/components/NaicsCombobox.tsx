"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { NAICS_CODES, searchNaics, type NaicsCode } from "@/lib/naics";

type Props = {
  value: string;
  onChange: (code: string, entry: NaicsCode | null) => void;
  placeholder?: string;
  error?: string;
};

export default function NaicsCombobox({ value, onChange, placeholder, error }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => (value ? NAICS_CODES.find((c) => c.code === value) ?? null : null),
    [value]
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return NAICS_CODES.slice(0, 50);
    return searchNaics(q, 50);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query, open]);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[activeIdx];
      if (pick) pickCode(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function pickCode(c: NaicsCode) {
    onChange(c.code, c);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function clear() {
    onChange("", null);
    setQuery("");
    setOpen(true);
    inputRef.current?.focus();
  }

  const borderCls = error
    ? "border-red-400"
    : open
    ? "border-navy-900"
    : "border-gray-200";

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`w-full border ${borderCls} bg-white flex items-center gap-2 transition-colors`}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search size={15} className="text-gray-400 ml-3 shrink-0" />
        {selected && !open ? (
          <div className="flex-1 py-2.5 text-sm text-gray-900 flex items-center justify-between gap-2 pr-3">
            <span className="truncate">
              <span className="font-mono text-xs text-gray-500 mr-2">{selected.code}</span>
              {selected.title}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="text-gray-400 hover:text-gray-700 shrink-0"
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKey}
              placeholder={
                selected
                  ? `${selected.code} — ${selected.title}`
                  : placeholder ?? "Search by code, keyword, or sector…"
              }
              className="flex-1 py-2.5 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
            />
            <ChevronDown
              size={15}
              className={`text-gray-400 mr-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 shadow-lg max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No matches. Try a different keyword.</p>
          ) : (
            <ul role="listbox" className="py-1">
              {results.map((c, idx) => {
                const isActive = idx === activeIdx;
                const isSelected = selected?.code === c.code;
                return (
                  <li
                    key={c.code}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pickCode(c);
                    }}
                    className={`px-4 py-2 cursor-pointer border-l-2 ${
                      isActive ? "bg-navy-50 border-navy-900" : "border-transparent"
                    } ${isSelected ? "bg-cream-50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-gray-500 shrink-0 mt-0.5 w-14">
                        {c.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{c.title}</p>
                        <p className="text-xs text-gray-500 truncate">{c.sector}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-100 bg-cream-50">
            Canadian NAICS 2022 · {NAICS_CODES.length} common codes
          </p>
        </div>
      )}
    </div>
  );
}
