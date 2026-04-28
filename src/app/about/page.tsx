import Link from "next/link";
import { ArrowRight, Zap, Eye, ShieldCheck, Globe } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Speed",
    description: "When you're ready to start your business, every day matters. We've engineered our entire process around 24-hour turnaround — because your time is valuable.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "No hidden fees. No surprise invoices. Every price includes government filing fees. You know exactly what you're paying before you start.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    description: "Every filing follows current federal and provincial corporate-registry requirements. We build checks into the platform so your application is filed correctly the first time.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Incorporation shouldn't require a trip to a government office. We've made it as simple as shopping online — available to Canadian and international founders.",
  },
];

const stats = [
  { value: "5,000+", label: "Businesses Incorporated" },
  { value: "24 hrs", label: "Average Turnaround" },
  { value: "99.8%", label: "Filing Accuracy Rate" },
  { value: "3", label: "Jurisdictions Supported" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            About Korporex
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Making Canadian Incorporation
            <br />
            Simple for Everyone
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            Korporex is a Canadian technology company that makes it simple for entrepreneurs
            to incorporate and manage their businesses entirely online — fast, transparent,
            and accessible to Canadian and international founders.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-5 text-gray-700 leading-relaxed">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">Our Story</h2>
            <p>
              Korporex was built to make Canadian business incorporation straightforward and
              affordable. Too often, founders delayed incorporation altogether because the process
              felt daunting, or paid more than they needed to for what is, for most businesses, a
              standard government filing.
            </p>
            <p>
              By combining technology with practical knowledge of Canadian corporate-registration
              requirements, we built a platform that lets any founder — based in Canada or
              internationally — incorporate and manage a Canadian business entirely online, in a
              fraction of the time and cost of the traditional route.
            </p>
            <p>
              Our mission is simple: make Canadian business incorporation as easy as opening a
              bank account, for anyone who wants to start a business here.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-navy-900 text-white p-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="mb-6 last:mb-0">
                  <p className="font-serif text-4xl font-bold text-gold-400 mb-0.5">{value}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              What We Stand For
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy-900">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-lg p-7 border border-gray-100">
                <div className="w-10 h-10 bg-navy-50 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-navy-900" />
                </div>
                <h3 className="font-serif text-lg font-bold text-navy-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-cream-50 border border-gray-200 rounded-lg px-8 py-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-800">Important notice:</strong> Korporex is a document preparation
              and filing service. We are not a law firm and do not provide legal advice. For questions specific
              to your business structure, tax position, or legal obligations, we recommend consulting a
              qualified professional.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Incorporate?</h2>
          <p className="text-gray-300 mb-8">
            Start your incorporation online today. It takes about 10 minutes and we handle the rest.
          </p>
          <Link
            href="/incorporate"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
