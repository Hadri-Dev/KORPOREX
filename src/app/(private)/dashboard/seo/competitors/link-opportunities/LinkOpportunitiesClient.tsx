"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import {
  type CompetitorsData,
  loadCompetitors,
} from "@/lib/competitorsStore";
import {
  addProspect,
  loadLinkBuilding,
  saveLinkBuilding,
} from "@/lib/linkBuildingStore";

interface Opportunity {
  domain: string;
  competitors: string[]; // competitor names linking from this domain
  totalLinks: number;
  topDr: number;
  alreadyProspect: boolean;
}

export default function LinkOpportunitiesClient() {
  const [data, setData] = useState<CompetitorsData | null>(null);
  const [existingProspectDomains, setExistingProspectDomains] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [minOverlap, setMinOverlap] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    setData(loadCompetitors());
    const lb = loadLinkBuilding();
    setExistingProspectDomains(
      new Set(lb.prospects.map((p) => p.domain.toLowerCase().replace(/^www\./, ""))),
    );
  }, []);

  const opportunities = useMemo<Opportunity[]>(() => {
    if (!data) return [];
    const map = new Map<string, Opportunity>();
    for (const b of data.backlinks) {
      const domain = b.referringDomain.toLowerCase().replace(/^www\./, "");
      if (!domain) continue;
      const competitor = data.competitors.find((c) => c.id === b.competitorId);
      if (!competitor) continue;
      const existing = map.get(domain);
      if (existing) {
        existing.totalLinks++;
        if (!existing.competitors.includes(competitor.name)) {
          existing.competitors.push(competitor.name);
        }
        if (b.dr > existing.topDr) existing.topDr = b.dr;
      } else {
        map.set(domain, {
          domain,
          competitors: [competitor.name],
          totalLinks: 1,
          topDr: b.dr ?? 0,
          alreadyProspect: existingProspectDomains.has(domain),
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) =>
        b.competitors.length - a.competitors.length || b.totalLinks - a.totalLinks,
    );
  }, [data, existingProspectDomains]);

  const filtered = useMemo(() => {
    const ql = search.toLowerCase();
    return opportunities.filter((o) => {
      if (o.competitors.length < minOverlap) return false;
      if (ql && !o.domain.includes(ql)) return false;
      return true;
    });
  }, [opportunities, search, minOverlap]);

  function handleAddAsProspect(domain: string, dr: number) {
    setBusy(domain);
    const lb = loadLinkBuilding();
    const next = addProspect(lb, {
      type: "outreach",
      domain,
      dr,
      notes: "Added from competitor link opportunities",
    });
    saveLinkBuilding(next);
    setExistingProspectDomains((prev) => {
      const s = new Set(prev);
      s.add(domain);
      return s;
    });
    setBusy(null);
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500 shadow-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/seo/competitors"
        className="inline-flex items-center gap-1 text-sm text-navy-900 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to competitors
      </Link>

      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Link Opportunities</h1>
        <p className="mt-1 text-sm text-gray-600">
          Aggregated referring domains across all your competitors&rsquo; backlink imports.
          Domains linking to multiple competitors are likely good outreach targets.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-md bg-gray-50 px-3 py-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter domain…"
          className="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-navy-900 focus:outline-none"
        />
        <label className="flex items-center gap-1 text-xs text-gray-700">
          Min competitor overlap
          <input
            type="number"
            min={1}
            value={minOverlap}
            onChange={(e) => setMinOverlap(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-14 rounded border border-gray-300 bg-white px-1.5 py-1 text-xs"
          />
        </label>
        <span className="text-xs text-gray-500">
          {filtered.length} of {opportunities.length} opportunities
        </span>
      </div>

      {opportunities.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Import competitor backlinks (Competitors → competitor → Backlinks tab) to populate this list.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">Domain</th>
                <th className="px-3 py-2 text-right">Linked competitors</th>
                <th className="px-3 py-2 text-right">Links seen</th>
                <th className="px-3 py-2 text-right">Top DR</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o.domain} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 align-top">
                    <a
                      href={`https://${o.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-navy-900 hover:underline"
                    >
                      {o.domain}
                    </a>
                  </td>
                  <td className="px-3 py-1.5 text-right align-top">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      {o.competitors.length}
                    </span>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      {o.competitors.join(", ")}
                    </p>
                  </td>
                  <td className="px-3 py-1.5 text-right align-top font-mono text-xs">{o.totalLinks}</td>
                  <td className="px-3 py-1.5 text-right align-top font-mono text-xs">{o.topDr}</td>
                  <td className="px-3 py-1.5 text-right align-top">
                    {o.alreadyProspect ? (
                      <span className="text-[11px] text-gray-500">Already a prospect</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddAsProspect(o.domain, o.topDr)}
                        disabled={busy === o.domain}
                        className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" /> Add as prospect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
