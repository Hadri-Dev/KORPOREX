import type { Metadata } from "next";
import Image from "next/image";
import { Building2, FileText, Edit3, ClipboardCheck, RefreshCw, Clock, Mail } from "lucide-react";
import SoonContactForm from "@/components/SoonContactForm";

export const metadata: Metadata = {
  title: "Korporex — Launching Soon",
  description:
    "Korporex — Canadian business incorporation and corporate services — is launching soon. In the meantime, get in touch and we'll respond within 24 hours.",
};

const capabilities = [
  { icon: Building2, label: "Incorporation", sub: "Federal · Ontario · BC" },
  { icon: FileText, label: "Registrations", sub: "Sole prop & business name" },
  { icon: Edit3, label: "Amendments", sub: "Directors · articles · address" },
  { icon: ClipboardCheck, label: "Compliance", sub: "Annual returns & filings" },
  { icon: RefreshCw, label: "Business Updates", sub: "Dissolve · revive · amalgamate" },
];

export default function SoonPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Top brand strip */}
      <header className="bg-navy-900 py-5 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/logo-mark.svg"
              alt="Korporex"
              width={36}
              height={36}
              priority
            />
            <span className="font-serif text-xl font-bold text-white tracking-tight">Korporex</span>
          </div>
          <a
            href="mailto:contact@korporex.com"
            className="hidden sm:inline-flex items-center gap-2 text-xs text-gray-300 hover:text-gold-400 transition-colors"
          >
            <Mail size={14} />
            contact@korporex.com
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-navy-900 text-white relative overflow-hidden">
        {/* subtle decorative diagonal */}
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-navy-900 via-navy-900 to-black/30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — messaging */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
              <span className="text-xs text-gray-200 tracking-[0.2em] uppercase font-medium">
                Launching Soon
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8">
              Something <span className="text-gold-400">great</span>
              <br className="hidden md:block" /> is on the way.
            </h1>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-10 max-w-lg">
              Korporex is a new Canadian business incorporation and corporate-services platform —
              built to make federal and provincial filings fast, transparent, and fully online.
              Our full site goes live soon.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-10 max-w-lg">
              In the meantime, if you need{" "}
              <span className="text-white font-medium">incorporation</span>, a{" "}
              <span className="text-white font-medium">registration</span>, an{" "}
              <span className="text-white font-medium">amendment</span>, or a{" "}
              <span className="text-white font-medium">compliance filing</span>, get in touch —
              we&apos;re already taking orders.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-9 h-9 bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                <Clock size={16} className="text-gold-400" />
              </div>
              <span>
                We respond within{" "}
                <span className="text-white font-semibold">24 hours</span>.
              </span>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="w-full">
            <SoonContactForm />
          </div>
        </div>
      </section>

      {/* Capabilities strip */}
      <section className="bg-white border-b border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-8">
            What we do
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {capabilities.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center px-2"
              >
                <div className="w-12 h-12 bg-navy-50 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-navy-900" />
                </div>
                <p className="font-serif text-sm font-bold text-navy-900 mb-0.5">{label}</p>
                <p className="text-xs text-gray-500 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-cream-50 py-10 px-6 mt-auto border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 Korporex Business Solutions Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            <a href="mailto:contact@korporex.com" className="hover:text-navy-900 transition-colors">
              contact@korporex.com
            </a>
          </p>
          <p className="text-xs text-gray-400 max-w-md sm:text-right">
            Korporex is not a law firm and does not provide legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
