"use client";

import { useState } from "react";
import CorporationNameSection, {
  type CorporationNameValue,
} from "@/components/incorporate/CorporationNameSection";

export default function PreviewClient() {
  const [value, setValue] = useState<CorporationNameValue>({
    corpNameType: "named",
    businessName: "",
    legalEnding: "",
  });
  const [pkg, setPkg] = useState<"basic" | "standard" | "premium">("standard");
  const [jurisdiction, setJurisdiction] = useState<"federal" | "ontario">("federal");

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-3 mb-6 text-sm text-amber-900">
          <strong>Dev preview:</strong> standalone mount of <code>CorporationNameSection</code>.
          Step&nbsp;3 of the wizard is unchanged. Try names like <em>Acme</em>, <em>Maple Ridge</em>, <em>Korporex</em>, or anything novel
          to see the three result states.
        </div>

        {/* Demo controls — let the reviewer flip the props the real Step 3 will pass */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Package:</span>
            <select
              value={pkg}
              onChange={(e) => setPkg(e.target.value as typeof pkg)}
              className="border border-gray-200 rounded px-2 py-1"
            >
              <option value="basic">Basic (numbered-only)</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Jurisdiction:</span>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as typeof jurisdiction)}
              className="border border-gray-200 rounded px-2 py-1"
            >
              <option value="federal">Federal</option>
              <option value="ontario">Ontario</option>
            </select>
          </label>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-1">Business Details</h1>
          <p className="text-gray-500 text-sm mb-8">
            Tell us about the business you&apos;re incorporating.
          </p>
          <CorporationNameSection
            value={value}
            onChange={setValue}
            basicLocked={pkg === "basic"}
            jurisdiction={jurisdiction}
          />
        </div>

        {/* Live state inspector so the reviewer can see what onChange would feed react-hook-form */}
        <div className="mt-6 bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono">
          <div className="text-gray-400 mb-2">// onChange payload</div>
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(value, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
