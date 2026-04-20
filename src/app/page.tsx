import Link from "next/link";
import { ArrowRight, FileText, Shield, TrendingUp, Star } from "lucide-react";

const stats = [
  { value: "50+", label: "Founders Advised" },
  { value: "$500M+", label: "In Transactions Supported" },
  { value: "10+", label: "Years of Advisory Experience" },
  { value: "95%", label: "Client Retention Rate" },
];

const features = [
  {
    icon: FileText,
    title: "Commercial Clarity",
    description:
      "Navigate contracts, commercial agreements, and business relationships with confidence. We identify risk, protect your interests, and structure deals that work in your favour.",
  },
  {
    icon: Shield,
    title: "Governance That Scales",
    description:
      "Build the corporate frameworks and governance structures that allow your business to grow without growing pains — from board advisory to shareholder matters.",
  },
  {
    icon: TrendingUp,
    title: "Growth & Transaction Support",
    description:
      "Whether raising capital, acquiring a business, or preparing for an exit — we provide the advisory backbone to get transactions done and protect your position.",
  },
];

const testimonials = [
  {
    quote:
      "Korporex gave us the strategic clarity we were missing. Their advice on our shareholder structure saved us significant complexity down the line.",
    name: "Sarah M.",
    title: "Founder, Series A Tech Company",
  },
  {
    quote:
      "Working with Korporex was like having a seasoned commercial advisor in our corner — without the costs and formality of a traditional firm.",
    name: "James T.",
    title: "CEO, Mid-Market Distribution Group",
  },
];

const pricingPreview = [
  {
    tier: "Starter",
    price: "$499",
    period: "/month",
    tagline: "For early-stage founders getting the basics right.",
    featured: false,
  },
  {
    tier: "Growth",
    price: "$1,499",
    period: "/month",
    tagline: "For scaling businesses with active advisory needs.",
    featured: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "Bespoke advisory for complex, high-growth businesses.",
    featured: false,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-28 md:py-36 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-6">
            Advisory Services for Business Founders
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 max-w-4xl">
            Strategic Counsel for Every Stage of{" "}
            <span className="text-gold-500">Growth</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10">
            Korporex delivers expert corporate and commercial advisory to
            entrepreneurs and mid-market founders — helping you structure your
            business, manage risk, and unlock the next stage of growth.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
            >
              Explore Services
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-navy-900">
                {value}
              </p>
              <p className="text-sm text-gray-500 mt-1 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-cream-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              What We Deliver
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              Advisory That Moves
              <br />
              Your Business Forward
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-8 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-navy-50 flex items-center justify-center mb-6">
                  <Icon size={22} className="text-navy-900" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">
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

      {/* Testimonials */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              Client Perspectives
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              Trusted by Founders
              <br />
              Who Value Clarity
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(({ quote, name, title }) => (
              <div
                key={name}
                className="bg-cream-50 p-8 border-l-4 border-gold-500"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-gold-500 fill-gold-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-cream-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              Transparent Pricing
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              Simple, Predictable Plans
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              No billable hours. No surprises. Choose the advisory level that
              fits your business.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPreview.map(({ tier, price, period, tagline, featured }) => (
              <div
                key={tier}
                className={`p-8 ${
                  featured
                    ? "bg-navy-900 text-white"
                    : "bg-white border border-gray-100"
                }`}
              >
                <p
                  className={`text-xs font-semibold tracking-[0.15em] uppercase mb-4 ${
                    featured ? "text-gold-500" : "text-gray-500"
                  }`}
                >
                  {tier}
                </p>
                <p
                  className={`font-serif text-4xl font-bold ${
                    featured ? "text-white" : "text-navy-900"
                  }`}
                >
                  {price}
                  <span
                    className={`text-sm font-sans font-normal ${
                      featured ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {period}
                  </span>
                </p>
                <p
                  className={`text-sm mt-3 leading-relaxed ${
                    featured ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {tagline}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-navy-900 text-navy-900 font-medium px-7 py-3 text-sm tracking-wide hover:bg-navy-900 hover:text-white transition-colors"
            >
              View Full Pricing Details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-24 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready to Work with Korporex?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Book a consultation and discover how strategic advisory can
            strengthen your commercial position and accelerate your growth.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            Book a Consultation
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
