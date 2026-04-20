import Link from "next/link";
import { ArrowRight, FileText, Shield, TrendingUp, Briefcase, CheckCircle } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Contract & Commercial Advisory",
    description:
      "Your commercial contracts define your business relationships, protect your revenue, and determine your exposure. We work with you to review, negotiate, and structure agreements that hold up when it matters.",
    items: [
      "Commercial contract review and negotiation",
      "Supply chain and supplier agreement structuring",
      "Client and partner agreement frameworks",
      "Terms of business and standard-form contracts",
      "Dispute risk identification and mitigation",
    ],
  },
  {
    icon: Shield,
    title: "Corporate Governance & Compliance",
    description:
      "Growth businesses that neglect governance create unnecessary risk for founders and investors alike. We help you build frameworks that scale — without the bureaucracy.",
    items: [
      "Shareholders' agreement structuring and review",
      "Board composition and governance frameworks",
      "Equity and incentive scheme advisory",
      "Regulatory compliance positioning",
      "Director duties and fiduciary responsibilities",
    ],
  },
  {
    icon: TrendingUp,
    title: "Venture & Transaction Support",
    description:
      "Transactions are high-stakes and time-pressured. We provide the advisory backbone to help you navigate fundraising, acquisitions, and strategic partnerships with clarity.",
    items: [
      "Pre-fundraise commercial readiness",
      "Term sheet review and negotiation support",
      "Acquisition and disposal advisory",
      "Due diligence coordination and support",
      "Post-transaction integration advisory",
    ],
  },
  {
    icon: Briefcase,
    title: "Strategic Business Advisory",
    description:
      "Beyond legal and governance matters, we work as a strategic sounding board for founders navigating complex business decisions — from pricing strategy to market entry to key hires.",
    items: [
      "Commercial strategy and positioning",
      "Partnership and joint venture structuring",
      "Market entry and expansion advisory",
      "Business model and revenue structure review",
      "Ongoing strategic retainer advisory",
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
            What We Do
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Advisory Services Built
            <br />
            for Business Founders
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            Korporex offers four core advisory disciplines — each designed to
            address the most critical commercial and strategic challenges facing
            growing businesses.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {services.map(({ icon: Icon, title, description, items }, idx) => (
            <div
              key={title}
              className={`grid md:grid-cols-2 gap-12 items-start ${
                idx % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-navy-50 mb-6">
                  <Icon size={22} className="text-navy-900" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">
                  {title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
              <div className="bg-cream-50 p-8 border border-gray-100">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-5">
                  What&apos;s included
                </p>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="text-gold-500 shrink-0 mt-0.5"
                      />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-gray-300 mb-8">
            Book a free discovery call and we&apos;ll help identify the right
            advisory support for your business.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            Book a Discovery Call
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
