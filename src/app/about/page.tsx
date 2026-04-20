import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const values = [
  {
    title: "Clarity Above All",
    description:
      "We cut through complexity to give you clear, actionable advice — not lengthy reports that gather dust. Every engagement ends with a decision you can act on.",
  },
  {
    title: "Commercial Integrity",
    description:
      "Our advice is grounded in what actually works for your business, not what generates more advisory hours. We succeed when you succeed.",
  },
  {
    title: "Results-Driven Partnership",
    description:
      "We treat every client's business as if it were our own. That means rolling up our sleeves, asking hard questions, and holding ourselves accountable for outcomes.",
  },
];

const credentials = [
  "Advised founders across technology, property, finance, and professional services",
  "Deep expertise in commercial contracts, corporate structuring, and transactions",
  "Trusted by venture-backed startups and established mid-market operators alike",
  "Track record spanning early-stage formation through Series A, B, and strategic exits",
  "Experience advising boards, shareholders, and management teams across sectors",
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
            Built for Founders
            <br />
            Who Think Ahead
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            Korporex was founded on a single belief: that business founders
            deserve access to the kind of high-calibre commercial advisory that
            was once only available to large corporations.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-5 text-gray-700 leading-relaxed">
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">
              Our Story
            </h2>
            <p>
              Korporex was established to bridge the gap between traditional
              professional advisory and the fast-paced realities of modern
              business. We saw founders making critical commercial decisions
              without the right guidance — not because they didn&apos;t value
              advice, but because the available options were either too
              expensive, too slow, or too disconnected from the commercial
              realities of growing a business.
            </p>
            <p>
              We set out to build something different: a nimble, founder-focused
              advisory practice that delivers substantive, senior-level guidance
              at every stage of a business journey — from early-stage formation
              to growth, acquisition, and exit.
            </p>
            <p>
              Today, Korporex works with a select group of founders and business
              owners across industries — each one chosen because we believe we
              can genuinely move the needle for their business.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="bg-navy-900 text-white p-8">
              <p className="font-serif text-4xl font-bold text-gold-500 mb-1">
                10+
              </p>
              <p className="text-sm text-gray-300 mb-8">Years advising founders</p>
              <p className="font-serif text-4xl font-bold text-gold-500 mb-1">
                50+
              </p>
              <p className="text-sm text-gray-300 mb-8">Businesses advised</p>
              <p className="font-serif text-4xl font-bold text-gold-500 mb-1">
                $500M+
              </p>
              <p className="text-sm text-gray-300">In transactions supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              How We Work
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy-900">
              Our Values
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(({ title, description }) => (
              <div
                key={title}
                className="bg-white p-8 border border-gray-100"
              >
                <div className="w-8 h-0.5 bg-gold-500 mb-6" />
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-4">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              Track Record
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy-900">
              Credentials &amp; Experience
            </h2>
          </div>
          <ul className="space-y-4">
            {credentials.map((item) => (
              <li key={item} className="flex items-start gap-4">
                <CheckCircle
                  size={18}
                  className="text-gold-500 shrink-0 mt-0.5"
                />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">Work With Us</h2>
          <p className="text-gray-300 mb-8">
            Get in touch to explore how Korporex can support your business.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            Book a Consultation
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
