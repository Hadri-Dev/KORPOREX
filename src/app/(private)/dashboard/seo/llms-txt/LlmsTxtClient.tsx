"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { buildDefaultLlmsTxt } from "@/lib/llmsTxt";

export default function LlmsTxtClient() {
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const res = await fetch("/api/seo/llms-txt");
    if (!res.ok) {
      setLoaded(true);
      return;
    }
    const json = await res.json();
    setConfigured(json.configured ?? true);
    setContent(json.content ?? "");
    setUpdatedAt(json.updated_at ?? null);
    setLoaded(true);
  }

  async function save() {
    setBusy(true);
    setStatus("saving");
    const res = await fetch("/api/seo/llms-txt", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setBusy(false);
    if (res.ok) {
      setStatus("saved");
      void load();
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
    }
  }

  function generateFromSite() {
    if (
      content.trim() &&
      !confirm("Replace current content with auto-generated default? Your edits will be lost.")
    )
      return;
    setContent(buildDefaultLlmsTxt());
  }

  if (!configured && loaded) {
    return (
      <div className="space-y-3">
        <h1 className="font-serif text-3xl font-semibold text-navy-900">LLMs.txt</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Supabase isn&rsquo;t configured. The /.well-known/llms.txt route still serves a default
          template (built from the page registry); enable Supabase to make this page editable.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">LLMs.txt</h1>
          <p className="mt-1 text-sm text-gray-600">
            Edit the content served at{" "}
            <a
              href="/.well-known/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-navy-900 hover:underline"
            >
              /.well-known/llms.txt
            </a>
            . The Korporex &ldquo;not a law firm&rdquo; guideline is auto-prepended if missing.
          </p>
          {updatedAt ? (
            <p className="mt-1 text-xs text-gray-500">
              Last published: {new Date(updatedAt).toLocaleString("en-CA")}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={generateFromSite}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate from site
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-md bg-navy-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
          >
            {status === "saving"
              ? "Publishing…"
              : status === "saved"
              ? "Published ✓"
              : status === "error"
              ? "Failed — retry"
              : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Editor
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={28}
            placeholder="(empty — click Generate from site to start)"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs text-gray-900 shadow-sm focus:border-navy-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Preview (rendered as text/plain)
          </label>
          <pre className="mt-1 max-h-[42rem] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-800 whitespace-pre-wrap break-words">
            {content || "(no content yet)"}
          </pre>
        </div>
      </div>
    </div>
  );
}
