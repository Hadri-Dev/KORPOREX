import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$499",
    period: "per month",
    description:
      "For early-stage founders who need commercial guidance as they build the foundations of their business.",
    features: [
      "2 hours of advisory per month",
      "Contract review (up to 2 per month)",
      "Email support within 48 hours",
      "Access to Korporex document library",
      "Monthly advisory check-in call",
      "Governance starter framework",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Growth",
    price: "$1,499",
    period: "per month",
    description:
      "For scaling businesses with active advisory needs — transactions, governance, and commercial strategy.",
    features: [
      "6 hours of advisory per month",
      "Unlimited contract reviews",
      "Priority response within 24 hours",
      "Full Korporex document library access",
      "Weekly strategic advisory calls",
      "Transaction and deal support (ad hoc)",
      "Board and governance advisory",
      "Dedicated advisory relationship",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored to your business",
    description:
      "For established or high-growth businesses requiring comprehensive, embedded advisory across all commercial matters.",
    features: [
      "Unlimited advisory hours",
      "Full commercial and governance advisory",
      "On-call access to senior advisors",
      "Transaction support included",
      "Custom document and framework development",
      "Board attendance and advisory",
      "Dedicated advisory team",
      "Monthly strategic review sessions",
    ],
    cta: "Contact Us",
    featured: false,
  },
];

const faqs = [
  {
    q: "Is Korporex a law firm?",
    a: "No. Korporex is a non-legal commercial advisory firm. We do not provide legal advice. Where legal advice is required, we work alongside your legal counsel or can refer you to appropriate specialists.",
  },
  {
    q: "Can I change plans as my business grows?",
    a: "Yes. You can upgrade or downgrade your plan at any time. We're designed to grow with your business and our team will proactively recommend the right tier as your advisory needs evolve.",
  },
  {
    q: "What happens if I need more hours than my plan includes?",
    a: "Additional advisory hours are available on an ad hoc basis. Growth and Enterprise clients also have the option to roll over unused hours from the previous month.",
  },
  {
    q: "Do you offer a free consultation?",
    a: "Yes. We offer a complimentary 30-minute discovery call to understand your business and determine whether Korporex is the right fit for your advisory needs.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Pricing
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 mb-6">
            Simple, Transparent Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            No billable hours. No surprise invoices. Choose the advisory level
            that fits your business today — and scale as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tiers.map(({ name, price, period, description, features, cta, featured }) => (
              <div
                key={name}
                className={`flex flex-col p-8 ${
                  featured
                    ? "bg-navy-900 text-white ring-2 ring-gold-500"
                    : "bg-white border border-gray-200"
                }`}
              >
                {featured && (
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold-500 mb-3">
                    Most Popular
                  </p>
                )}
                <p
                  className={`text-xs font-semibold tracking-[0.15em] uppercase mb-3 ${
                    featured ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {name}
                </p>
                <p
                  className={`font-serif text-5xl font-bold mb-1 ${
                    featured ? "text-white" : "text-navy-900"
                  }`}
                >
                  {price}
                </p>
                <p
                  className={`text-sm mb-5 ${
                    featured ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {period}
                </p>
                <p
                  className={`text-sm leading-relaxed mb-8 ${
                    featured ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {description}
                </p>
                <ul className="space-y-3 mb-10 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle
                        size={15}
                        className="text-gold-500 shrink-0 mt-0.5"
                      />
                      <span
                        className={`text-sm ${
                          featured ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={
                    cta === "Contact Us"
                      ? "/contact"
                      : `/contact?plan=${name.toLowerCase()}`
                  }
                  className={`inline-flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium tracking-wide transition-colors ${
                    featured
                      ? "bg-gold-500 text-white hover:bg-gold-600"
                      : "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white"
                  }`}
                >
                  {cta}
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-cream-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              FAQ
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy-900">
              Common Questions
            </h2>
          </div>
          <div className="space-y-8">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-gray-200 pb-8">
                <h3 className="font-serif text-lg font-bold text-navy-900 mb-3">
                  {q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Start With a Free Call
          </h2>
          <p className="text-gray-300 mb-8">
            Not sure which plan is right for you? Book a 30-minute discovery
            call — no commitment, no hard sell.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            Book a Free Discovery Call
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
