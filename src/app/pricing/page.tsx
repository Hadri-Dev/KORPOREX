"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

type Jurisdiction = "federal" | "ontario" | "bc";

const jurisdictions = [
  { id: "federal" as Jurisdiction, label: "Federal", subtitle: "Canada Business Corporations Act" },
  { id: "ontario" as Jurisdiction, label: "Ontario", subtitle: "Ontario Business Corporations Act" },
  { id: "bc" as Jurisdiction, label: "British Columbia", subtitle: "BC Business Corporations Act" },
];

const pricingData: Record<Jurisdiction, {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
}[]> = {
  federal: [
    {
      name: "Basic",
      price: "$499",
      description: "Everything you need to get incorporated federally, including government fees.",
      featured: false,
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
      featured: true,
      features: [
        "Everything in Basic",
        "Corporate minute book",
        "Share certificates",
        "Organizational resolutions",
        "Banking resolution",
        "Registered office (1 month)",
        "Post-filing support",
      ],
    },
    {
      name: "Premium",
      price: "$999",
      description: "Full-service incorporation with ongoing compliance support for year one.",
      featured: false,
      features: [
        "Everything in Standard",
        "1-year registered office address",
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
      featured: false,
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
      featured: true,
      features: [
        "Everything in Basic",
        "Corporate minute book",
        "Share certificates",
        "Organizational resolutions",
        "Banking resolution",
        "Registered office (1 month)",
        "Post-filing support",
      ],
    },
    {
      name: "Premium",
      price: "$899",
      description: "Full-service incorporation with ongoing compliance support for year one.",
      featured: false,
      features: [
        "Everything in Standard",
        "1-year registered office address",
        "Initial Return filing (Ontario)",
        "First Annual Return filing",
        "Priority 12-hour processing",
        "Annual filing reminder service",
      ],
    },
  ],
  bc: [
    {
      name: "Basic",
      price: "$449",
      description: "Everything you need to get incorporated in British Columbia, including government fees.",
      featured: false,
      features: [
        "Certificate and Articles of Incorporation",
        "BC Company registration number",
        "Corporate bylaws",
        "BC Business Registry filing",
        "Digital document delivery",
        "Digital document storage in your account",
      ],
    },
    {
      name: "Standard",
      price: "$649",
      description: "Complete incorporation package with your full corporate minute book.",
      featured: true,
      features: [
        "Everything in Basic",
        "Corporate minute book",
        "Share certificates",
        "Organizational resolutions",
        "Banking resolution",
        "Registered office (1 month)",
        "Post-filing support",
      ],
    },
    {
      name: "Premium",
      price: "$949",
      description: "Full-service incorporation with ongoing compliance support for year one.",
      featured: false,
      features: [
        "Everything in Standard",
        "1-year registered office address",
        "First annual report filing",
        "Priority 12-hour processing",
        "Dedicated account support",
        "Annual report reminder service",
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
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100 text-center">
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
            {tiers.map(({ name, price, description, features, featured }) => (
              <div
                key={name}
                className={`flex flex-col p-8 ${
                  featured
                    ? "bg-navy-900 text-white ring-2 ring-gold-500"
                    : "bg-white border border-gray-200"
                }`}
              >
                {featured && (
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold-400 mb-3">
                    Most Popular
                  </p>
                )}
                <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-3 ${featured ? "text-gray-400" : "text-gray-500"}`}>
                  {name}
                </p>
                <p className={`font-serif text-5xl font-bold mb-1 ${featured ? "text-white" : "text-navy-900"}`}>
                  {price}
                </p>
                <p className={`text-xs mb-5 ${featured ? "text-gray-400" : "text-gray-500"}`}>
                  all fees included · CAD
                </p>
                <p className={`text-sm leading-relaxed mb-8 ${featured ? "text-gray-300" : "text-gray-600"}`}>
                  {description}
                </p>
                <ul className="space-y-3 mb-10 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle size={15} className="text-gold-500 shrink-0 mt-0.5" />
                      <span className={`text-sm ${featured ? "text-gray-200" : "text-gray-700"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/incorporate?jurisdiction=${jurisdiction}&package=${name.toLowerCase()}`}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium tracking-wide transition-colors ${
                    featured
                      ? "bg-gold-500 text-white hover:bg-gold-600"
                      : "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white"
                  }`}
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
              <div key={item} className="flex items-start gap-3 bg-white border border-gray-100 px-5 py-4">
                <CheckCircle size={16} className="text-navy-900 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
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
