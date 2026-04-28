"use client";

import { Link } from "@/i18n/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { REG_OFFICE_ADDON } from "@/lib/pricing";

type Jurisdiction = "federal" | "ontario";

const jurisdictions = [
  { id: "federal" as Jurisdiction, label: "Federal", subtitle: "Canada Business Corporations Act" },
  { id: "ontario" as Jurisdiction, label: "Ontario", subtitle: "Ontario Business Corporations Act" },
];

const pricingData: Record<Jurisdiction, {
  name: string;
  price: string;
  description: string;
  features: string[];
}[]> = {
  federal: [
    {
      name: "Basic",
      price: "$499",
      description: "Everything you need to get incorporated federally, including government fees.",
      features: [
        "Articles of Incorporation filing",
        "NUANS name search included",
        "Federal corporate bylaws",
        "Certificate of Incorporation",
        "Digital document delivery",
        "Digital document storage in your account",
      ],
    },
    {
      name: "Standard",
      price: "$699",
      description: "Complete incorporation package with your full corporate minute book.",
      features: [
        "Everything in Basic",
        "Corporate minute book",
        "Share certificates",
        "Organizational resolutions",
        "Banking resolution",
        "Post-filing support",
      ],
    },
    {
      name: "Premium",
      price: "$999",
      description: "Full-service incorporation with ongoing compliance support for year one.",
      features: [
        "Everything in Standard",
        "First annual return filing",
        "Priority 12-hour processing",
        "Dedicated account support",
        "Annual return reminder service",
      ],
    },
  ],
  ontario: [
    {
      name: "Basic",
      price: "$399",
      description: "Everything you need to get incorporated in Ontario, including government fees.",
      features: [
        "Articles of Incorporation filing",
        "Ontario Business Identifier (OBI)",
        "Corporate bylaws",
        "Certificate of Incorporation",
        "Digital document delivery",
        "Digital document storage in your account",
      ],
    },
    {
      name: "Standard",
      price: "$599",
      description: "Complete incorporation package with your full corporate minute book.",
      features: [
        "Everything in Basic",
        "Corporate minute book",
        "Share certificates",
        "Organizational resolutions",
        "Banking resolution",
        "Post-filing support",
      ],
    },
    {
      name: "Premium",
      price: "$899",
      description: "Full-service incorporation with ongoing compliance support for year one.",
      features: [
        "Everything in Standard",
        "Initial Return filing (Ontario)",
        "First Annual Return filing",
        "Priority 12-hour processing",
        "Annual filing reminder service",
      ],
    },
  ],
};

const everythingIncluded = [
  "All government filing fees (no hidden costs)",
  "Digital document delivery within 24 hours",
  "Secure document storage in your Korporex account",
  "Post-filing Q&A support by email",
  "Filing confirmation and tracking",
  "Available to Canadian and international founders",
];

export default function PricingPage() {
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("federal");
  const tiers = pricingData[jurisdiction];

  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-12 px-6 border-b border-gray-100 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Pricing
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            All prices are in Canadian dollars and include government filing fees.
            Applicable taxes and NUANS name-search fees are not included and will be shown separately at checkout.
          </p>
        </div>
      </section>

      {/* Jurisdiction Tabs */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {jurisdictions.map(({ id, label, subtitle }) => (
              <button
                key={id}
                onClick={() => setJurisdiction(id)}
                className={`px-6 py-3 text-sm font-medium border transition-colors ${
                  jurisdiction === id
                    ? "bg-navy-900 text-white border-navy-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-navy-900 hover:text-navy-900"
                }`}
              >
                {label}
                <span className={`block text-xs mt-0.5 ${jurisdiction === id ? "text-gray-300" : "text-gray-400"}`}>
                  {subtitle}
                </span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tiers.map(({ name, price, description, features }) => (
              <div
                key={name}
                className="group flex flex-col p-8 bg-white border border-gray-200 rounded-lg transition-colors hover:bg-navy-900 hover:border-navy-900"
              >
                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 text-gray-500 transition-colors group-hover:text-gray-400">
                  {name}
                </p>
                <p className="font-serif text-5xl font-bold mb-1 text-navy-900 transition-colors group-hover:text-white">
                  {price}
                </p>
                <p className="text-xs mb-5 text-gray-500 transition-colors group-hover:text-gray-400">
                  all fees included · CAD
                </p>
                <p className="text-sm leading-relaxed mb-8 text-gray-600 transition-colors group-hover:text-gray-300">
                  {description}
                </p>
                <ul className="space-y-3 mb-10 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle size={15} className="text-gold-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 transition-colors group-hover:text-gray-200">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/incorporate?jurisdiction=${jurisdiction}&package=${name.toLowerCase()}`}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium tracking-wide transition-colors border border-navy-900 text-navy-900 group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-white"
                >
                  Get Started
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included in every package */}
      <section className="bg-cream-50 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Included in Every Package
          </p>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-10">
            Standard Across All Korporex Orders
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {everythingIncluded.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white border border-gray-100 rounded-md px-5 py-4">
                <CheckCircle size={16} className="text-navy-900 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registered Office add-on */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              Optional Add-on
            </p>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-3">
              Registered Office Address Service
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&rsquo;t have a physical address for your corporation? Use ours. Available at
              checkout for federal and Ontario incorporations.
            </p>
          </div>
          <div className="border border-navy-900 rounded-lg p-8 bg-cream-50">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold-500 mb-3">
              {REG_OFFICE_ADDON.label}
            </p>
            <p className="font-serif text-4xl font-bold text-navy-900 mb-1">
              ${REG_OFFICE_ADDON.monthly.toFixed(2)}
              <span className="text-lg text-gray-500 font-sans font-normal">/mo</span>
            </p>
            <p className="text-xs text-gray-500 mb-6">
              billed annually in advance at ${REG_OFFICE_ADDON.annual.toFixed(2)} + HST
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle size={15} className="text-gold-500 shrink-0 mt-0.5" />
                <span>Registered office address in the Greater Toronto Area, chosen by Korporex</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={15} className="text-gold-500 shrink-0 mt-0.5" />
                <span>Monthly scanned copy of your mail emailed to you</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={15} className="text-gold-500 shrink-0 mt-0.5" />
                <span>Address listed on your Articles of Incorporation and the public corporate registry</span>
              </li>
            </ul>
            <p className="text-xs text-gray-600 mt-6 pt-4 border-t border-gray-200 leading-relaxed">
              <strong className="text-navy-900">Non-refundable.</strong> The annual fee is billed in
              advance and is not refundable, in whole or in part, including if you obtain your own
              registered office address before the end of the term.
            </p>
          </div>
          <p className="text-xs text-gray-500 text-center mt-6">
            Available for federal and Ontario incorporations.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-12 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">
            Select a package above and complete your incorporation in about 10 minutes.
            Have questions first? Check our FAQ.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/incorporate"
              className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
            >
              Incorporate Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
