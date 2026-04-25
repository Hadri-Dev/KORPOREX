import Link from "next/link";
import { ArrowRight, Building2, FileText, Edit3, ClipboardCheck, RefreshCw, ScaleIcon } from "lucide-react";

type Service = { name: string; from: string; href: string };
type Category = {
  icon: React.ElementType;
  title: string;
  description: string;
  services: Service[];
};

const categories: Category[] = [
  {
    icon: Building2,
    title: "Incorporation",
    description: "Incorporate your business federally or provincially. Choose from standard, professional, holding, or non-profit corporations.",
    services: [
      { name: "Federal Incorporation — Standard Corp", from: "$499", href: "/incorporate?jurisdiction=federal&type=standard" },
      { name: "Federal Incorporation — Professional Corp", from: "$549", href: "/incorporate?jurisdiction=federal&type=professional" },
      { name: "Federal Incorporation — Holding Corp", from: "$499", href: "/incorporate?jurisdiction=federal&type=holding" },
      { name: "Ontario Incorporation — Standard Corp", from: "$399", href: "/incorporate?jurisdiction=ontario&type=standard" },
      { name: "Ontario Incorporation — Professional Corp", from: "$449", href: "/incorporate?jurisdiction=ontario&type=professional" },
      { name: "Ontario Incorporation — Non-Profit", from: "$399", href: "/incorporate?jurisdiction=ontario&type=nonprofit" },
      { name: "Ontario Incorporation — Holding Corp", from: "$399", href: "/incorporate?jurisdiction=ontario&type=holding" },
      { name: "BC Incorporation — Standard Corp", from: "$449", href: "/incorporate?jurisdiction=bc&type=standard" },
      { name: "BC Incorporation — Professional Corp", from: "$499", href: "/incorporate?jurisdiction=bc&type=professional" },
      { name: "BC Incorporation — Non-Profit", from: "$449", href: "/incorporate?jurisdiction=bc&type=nonprofit" },
      { name: "BC Incorporation — Holding Corp", from: "$449", href: "/incorporate?jurisdiction=bc&type=holding" },
    ],
  },
  {
    icon: FileText,
    title: "Registrations",
    description: "Register a sole proprietorship, business name, or expand your existing corporation to operate in a new province.",
    services: [
      { name: "Sole Proprietorship Registration — Ontario", from: "$99", href: "/services" },
      { name: "Sole Proprietorship Registration — BC", from: "$99", href: "/services" },
      { name: "Business Name Registration — Ontario", from: "$79", href: "/services" },
      { name: "Business Name Registration — BC", from: "$79", href: "/services" },
      { name: "Extra-Provincial Registration", from: "$199", href: "/services" },
    ],
  },
  {
    icon: Edit3,
    title: "Changes & Amendments",
    description: "Update your corporation's directors, officers, address, or articles after incorporation.",
    services: [
      { name: "Change of Director / Officer", from: "$149", href: "/services" },
      { name: "Change of Shareholder", from: "$149", href: "/services" },
      { name: "Corporation Address Change", from: "$99", href: "/services" },
      { name: "Articles of Amendment", from: "$199", href: "/services" },
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Filings",
    description: "Stay in good standing with required government filings for Ontario and federal corporations.",
    services: [
      { name: "Initial Return (Ontario)", from: "$99", href: "/services" },
      { name: "Annual Return — Ontario", from: "$149", href: "/services" },
      { name: "Annual Return — Federal", from: "$149", href: "/services" },
      { name: "Notice of Change", from: "$129", href: "/services" },
    ],
  },
  {
    icon: RefreshCw,
    title: "Business Updates",
    description: "Dissolve, revive, amalgamate, or continue your corporation between jurisdictions.",
    services: [
      { name: "Dissolve a Business", from: "$199", href: "/services" },
      { name: "Revive a Business", from: "$249", href: "/services" },
      { name: "Amalgamation", from: "$499", href: "/services" },
      { name: "Continuance Between Jurisdictions", from: "$349", href: "/services" },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            All Services
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Everything Your Business
            <br />
            Needs to Stay Compliant
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            From your first incorporation to ongoing compliance filings, Korporex handles
            every government filing your business needs — fast, online, and at a fixed price.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {categories.map(({ icon: Icon, title, description, services }) => (
            <div key={title}>
              <div className="flex items-start gap-4 mb-8">
                <div className="w-11 h-11 bg-navy-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={20} className="text-navy-900" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 mb-1">{title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-0 md:ml-15">
                {services.map(({ name, from, href }) => (
                  <Link
                    key={name}
                    href={href}
                    className="flex items-center justify-between bg-cream-50 border border-gray-100 px-5 py-4 hover:border-navy-900 hover:bg-white group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-navy-900 transition-colors">
                        {name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">From {from}</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-400 group-hover:text-navy-900 shrink-0 ml-3 transition-colors" />
                  </Link>
                ))}
              </div>
              <div className="border-b border-gray-100 mt-14" />
            </div>
          ))}
        </div>
      </section>

      {/* Lawyer-referral callout */}
      <section className="bg-cream-50 py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-12 h-12 bg-navy-900 flex items-center justify-center shrink-0">
              <ScaleIcon size={22} className="text-gold-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">
                Need Personalized Legal Advice?
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-3">
                Talk to a Trusted Corporate Lawyer
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Korporex isn&rsquo;t a law firm — but if you need personalized legal advice on incorporation strategy,
                shareholder agreements, restructuring, or anything else corporate-law related, we can connect you with an
                independent corporate lawyer from our trusted referral network. Book a 30-minute consultation for{" "}
                <span className="font-semibold text-navy-900">$150 + HST</span>.
              </p>
              <Link
                href="/legal-consultation"
                className="inline-flex items-center gap-2 bg-navy-900 text-white font-medium px-6 py-3 text-sm tracking-wide hover:bg-navy-800 transition-colors"
              >
                Book a Consultation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-gray-300 mb-8">
            Most businesses start with a federal or provincial incorporation. If you&apos;re
            unsure which is right for you, check our FAQ or start the incorporation flow
            and we&apos;ll guide you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/incorporate"
              className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
            >
              Incorporate Now
              <ArrowRight size={16} />
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
