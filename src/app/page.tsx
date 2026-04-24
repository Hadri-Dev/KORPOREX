import Link from "next/link";
import { ArrowRight, Clock, Laptop, ShieldCheck, BadgeDollarSign, Star, CheckCircle, FileText, Edit3, ClipboardCheck, RefreshCw } from "lucide-react";
import HeroContactForm from "@/components/HeroContactForm";

const featuredServices = [
  {
    jurisdiction: "Federal",
    subtitle: "Canada Business Corporations Act",
    description: "Incorporate federally under the CBCA. Country-wide name protection and operate in any province (with extra-provincial registration).",
    from: "$499",
    href: "/incorporate?jurisdiction=federal",
  },
  {
    jurisdiction: "Ontario",
    subtitle: "Ontario Business Corporations Act",
    description: "Incorporate provincially in Ontario. Automatic authorization to carry on business throughout the province.",
    from: "$399",
    href: "/incorporate?jurisdiction=ontario",
  },
  {
    jurisdiction: "British Columbia",
    subtitle: "BC Business Corporations Act",
    description: "Incorporate provincially in British Columbia. Modern corporate legislation and a fully online filing system.",
    from: "$449",
    href: "/incorporate?jurisdiction=bc",
  },
];

const otherServices = [
  {
    icon: FileText,
    title: "Registrations",
    description: "Sole proprietorships, business names, and extra-provincial registrations.",
    from: "From $79",
    items: ["Sole proprietorships", "Business name registration", "Extra-provincial registration"],
  },
  {
    icon: Edit3,
    title: "Changes & Amendments",
    description: "Update directors, officers, shareholders, addresses, or articles.",
    from: "From $99",
    items: ["Director / officer changes", "Shareholder changes", "Articles of amendment"],
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Filings",
    description: "Annual returns and statutory filings to keep your corporation in good standing.",
    from: "From $99",
    items: ["Annual returns (federal & Ontario)", "Initial return (Ontario)", "Notice of change"],
  },
  {
    icon: RefreshCw,
    title: "Business Updates",
    description: "Dissolve, revive, amalgamate, or continue your corporation across jurisdictions.",
    from: "From $199",
    items: ["Dissolution & revival", "Amalgamation", "Continuance between jurisdictions"],
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Service",
    description: "Select the jurisdiction and incorporation type that fits your business. Not sure? Our FAQ covers the key differences.",
  },
  {
    number: "02",
    title: "Complete the Online Form",
    description: "Answer a few questions about your business, directors, and shareholders. Takes about 10 minutes, entirely online.",
  },
  {
    number: "03",
    title: "We File Within 24 Hours",
    description: "Your application is submitted to the government and your incorporation documents are delivered by email.",
  },
];

const whyUs = [
  {
    icon: Clock,
    title: "24-Hour Turnaround",
    description: "Most orders are processed and submitted to the government within 24 hours of completion.",
  },
  {
    icon: Laptop,
    title: "100% Online",
    description: "No office visits. No paper forms. Complete your entire incorporation from your phone or laptop.",
  },
  {
    icon: ShieldCheck,
    title: "Government-Compliant",
    description: "Every filing follows current federal and provincial corporate-registry requirements.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Pricing",
    description: "Government filing fees included in our prices. Taxes and NUANS name-search fees are not included and shown separately at checkout.",
  },
];

const testimonials = [
  {
    quote: "Incorporated my business in less than a day. The process was completely straightforward and the team was incredibly responsive.",
    name: "Michael R.",
    location: "Toronto, ON",
  },
  {
    quote: "I was dreading the incorporation process but Korporex made it completely painless. Highly recommended for any Canadian entrepreneur.",
    name: "Jennifer L.",
    location: "Vancouver, BC",
  },
  {
    quote: "Used Korporex for our federal incorporation and annual filings. Fast, reliable, and exceptional value for money.",
    name: "David K.",
    location: "Ottawa, ON",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
              <span className="text-xs text-gray-300 tracking-widest uppercase font-medium">
                Fast · Online · Affordable
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-8">
              Business Incorporation.{" "}
              <span className="text-gold-400">Easy. Fast.<br />Affordable.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
              Incorporate your business in Canada in as little as 24 hours. 100% online,
              government-compliant filings, and transparent pricing — available to Canadian
              entrepreneurs and international founders alike.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/incorporate"
                className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors"
              >
                Incorporate Now
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
              >
                View Pricing
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> Government fees included</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> Documents in 24 hours</span>
              <span className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> 100% online filings</span>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="w-full">
            <HeroContactForm />
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              Jurisdictions
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              Choose Your Jurisdiction
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Federal, Ontario, and British Columbia — each is a valid choice depending on where you plan to
              operate, the name-protection scope you need, and your budget. None is superior; the right pick
              depends on your business.{" "}
              <Link href="/faq" className="text-navy-900 underline underline-offset-2">See our FAQ.</Link>
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredServices.map(({ jurisdiction, subtitle, description, from, href }) => (
              <div
                key={jurisdiction}
                className="group flex flex-col p-8 border border-gray-200 transition-colors hover:bg-navy-900 hover:border-navy-900"
              >
                <p className="font-serif text-2xl font-bold text-navy-900 mb-1 transition-colors group-hover:text-white">{jurisdiction}</p>
                <p className="text-sm text-gray-500 mb-4 transition-colors group-hover:text-gray-400">{subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 transition-colors group-hover:text-gray-300">{description}</p>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 transition-colors group-hover:text-gray-400">Starting from</p>
                    <p className="font-serif text-3xl font-bold text-navy-900 transition-colors group-hover:text-white">{from}</p>
                  </div>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 border border-navy-900 text-navy-900 text-sm font-medium px-5 py-2.5 transition-colors group-hover:bg-gold-500 group-hover:border-gold-500 group-hover:text-white"
                  >
                    Start <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Corporate Services — beyond incorporation */}
      <section className="bg-cream-50 py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              More Than Incorporation
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              Complete Corporate Services
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Beyond incorporation, Korporex handles the ongoing filings your business needs to
              grow, change, and stay compliant — all online, all at a fixed price.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherServices.map(({ icon: Icon, title, description, from, items }) => (
              <div
                key={title}
                className="group flex flex-col bg-white border border-gray-200 p-7 transition-colors hover:bg-navy-900 hover:border-navy-900"
              >
                <div className="w-11 h-11 bg-navy-50 flex items-center justify-center mb-5 transition-colors group-hover:bg-white/10">
                  <Icon size={20} className="text-navy-900 transition-colors group-hover:text-gold-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-2 transition-colors group-hover:text-white">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 transition-colors group-hover:text-gray-300">
                  {description}
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-gray-700 transition-colors group-hover:text-gray-300"
                    >
                      <CheckCircle size={12} className="text-gold-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 transition-colors group-hover:border-white/20">
                  <p className="text-xs text-gray-500 transition-colors group-hover:text-gray-400">{from}</p>
                  <span className="text-xs font-medium text-navy-900 transition-colors group-hover:text-gold-400">
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-navy-900 text-navy-900 font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-navy-900 hover:text-white transition-colors"
            >
              Browse All Services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              Simple Process
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              Get Incorporated in 3 Steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ number, title, description }, idx) => (
              <div key={number} className="relative">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-px bg-gray-200" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-navy-900 text-white flex items-center justify-center font-serif font-bold text-lg mb-5 shrink-0">
                    {number}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/incorporate"
              className="inline-flex items-center gap-2 bg-navy-900 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-navy-800 transition-colors"
            >
              Start Your Incorporation
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Korporex */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              Why Korporex
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">
              Built for Canadian Entrepreneurs
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-navy-50 flex items-center justify-center mx-auto mb-5">
                  <Icon size={22} className="text-navy-900" />
                </div>
                <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
              What Our Clients Say
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy-900">
              Trusted by Thousands of Canadian Entrepreneurs
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, location }) => (
              <div key={name} className="bg-white p-8 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-24 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Start Your Incorporation Today
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Join thousands of Canadian entrepreneurs who&apos;ve simplified their
            business registration with Korporex. Get incorporated in as little as 24 hours.
          </p>
          <Link
            href="/incorporate"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            Get Started Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
