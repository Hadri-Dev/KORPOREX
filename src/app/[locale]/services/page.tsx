import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Building2, FileText, Edit3, ClipboardCheck, RefreshCw, ScaleIcon, Check, Star } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildSeoMetadata } from "@/lib/seoMeta";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildSeoMetadata(locale, "services", "/services");
}

type Service = { name: string; from: string; href: string };
type Category = {
  icon: React.ElementType;
  title: string;
  description: string;
  services: Service[];
};

const jurisdictionOptions = [
  {
    id: "federal",
    name: "Federal Incorporation",
    statute: "Canada Business Corporations Act (CBCA)",
    pitch: "Operate across Canada under one corporate name.",
    from: "$749",
    href: "/incorporate?jurisdiction=federal",
  },
  {
    id: "ontario",
    name: "Ontario Incorporation",
    statute: "Ontario Business Corporations Act (OBCA)",
    pitch: "Operate as an Ontario corporation, with lower government filing fees.",
    from: "$599",
    href: "/incorporate?jurisdiction=ontario",
  },
];

const packageSummary = [
  {
    name: "Basic",
    pkg: "basic",
    price: "$599",
    audience: "For solo founders",
    blurb: "Consultants, freelancers, and single-owner holding companies.",
    highlights: [
      "Numbered corporation",
      "1 director, 1 shareholder, 1 officer",
      "1 class of shares",
    ],
  },
  {
    name: "Standard",
    pkg: "standard",
    price: "$899",
    audience: "For founding teams",
    blurb: "Co-founders, spouses incorporating together, and small partnerships ready to operate under a business name.",
    highlights: [
      "Named or numbered (NUANS included)",
      "Up to 3 directors, 3 shareholders, 3 officers",
      "Up to 3 classes of shares",
    ],
    popular: true,
  },
  {
    name: "Premium",
    pkg: "premium",
    price: "$1,199",
    audience: "For multi-stakeholder businesses",
    blurb: "Multiple founders, advisors, or family members with a layered share structure.",
    highlights: [
      "Named or numbered (NUANS included)",
      "Up to 5 directors, 5 shareholders, 5 officers",
      "Up to 5 classes of shares",
    ],
  },
];

const categories: Category[] = [
  {
    icon: FileText,
    title: "Registrations",
    description: "Register a sole proprietorship, business name, business number, or expand your existing corporation to operate in a new province.",
    services: [
      { name: "Sole Proprietorship Registration - Ontario", from: "$99", href: "/services/sole-proprietorship" },
      { name: "Business Name Registration - Ontario", from: "$79", href: "/services/business-name" },
      { name: "Business Number Registration - CRA", from: "$99", href: "/services/business-number" },
      { name: "Extra-Provincial Registration", from: "$199", href: "/services/extra-provincial" },
    ],
  },
  {
    icon: Edit3,
    title: "Changes & Amendments",
    description: "Update your corporation's directors, officers, address, name, or articles after incorporation.",
    services: [
      { name: "Change of Business Name", from: "$399.99", href: "/services/change-name" },
      { name: "Change of Director / Officer", from: "$149", href: "/services/change-director" },
      { name: "Change of Shareholder", from: "$149", href: "/services/change-shareholder" },
      { name: "Corporation Address Change", from: "$99", href: "/services/change-address" },
      { name: "Articles of Amendment", from: "$199", href: "/services/articles-amendment" },
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Filings",
    description: "Stay in good standing with required government filings for Ontario and federal corporations.",
    services: [
      { name: "Initial Return (Ontario)", from: "$99", href: "/services/initial-return-on" },
      { name: "Annual Return - Ontario", from: "$149", href: "/services/annual-return-on" },
      { name: "Annual Return - Federal", from: "$149", href: "/services/annual-return-federal" },
      { name: "Notice of Change", from: "$129", href: "/services/notice-of-change" },
    ],
  },
  {
    icon: RefreshCw,
    title: "Business Updates",
    description: "Dissolve, revive, amalgamate, or continue your corporation between jurisdictions.",
    services: [
      { name: "Dissolve a Business", from: "$199", href: "/services/dissolve-business" },
      { name: "Revive a Business", from: "$249", href: "/services/revive-business" },
      { name: "Amalgamation", from: "$499", href: "/services/amalgamation" },
      { name: "Continuance Between Jurisdictions", from: "$349", href: "/services/continuance" },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
            Everything Your Business
            <br />
            Needs to Stay Compliant
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
            From your first incorporation to ongoing compliance filings, Korporex handles
            every government filing your business needs: fast, online, and at a fixed price.
          </p>
        </div>
      </section>

      {/* Service Categories — each in an elevated cream card with gold stripe,
          matching the /nuans 'Your proposed names' card treatment. */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Incorporation — custom block, styled to match the category cards below */}
          <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Green header band with inset gold underline */}
            <div className="relative flex items-start gap-4 bg-navy-900 text-white px-6 py-5">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight">Incorporation</h2>
                <p className="text-xs text-gray-300 leading-snug mt-1 max-w-2xl">
                  Incorporate federally or in Ontario, fully online, in 24 hours. Pick your
                  jurisdiction below, then choose the package that fits your business.
                </p>
              </div>
              <span className="absolute left-6 right-6 bottom-0 h-0.5 bg-gold-500" />
            </div>

            <div className="p-6 md:p-8">
              {/* Jurisdiction picker — fills green on hover, matching the service rows */}
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {jurisdictionOptions.map(({ id, name, statute, pitch, from, href }) => (
                  <Link
                    key={id}
                    href={href}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 transition-all hover:bg-navy-900 hover:border-navy-900 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-xl font-semibold text-navy-900 transition-colors group-hover:text-white">{name}</h3>
                      <ArrowRight
                        size={18}
                        className="text-gray-400 group-hover:text-gold-500 shrink-0 mt-1 transition-colors"
                      />
                    </div>
                    <p className="text-xs font-medium text-gold-600 tracking-wide mb-3 transition-colors group-hover:text-gold-500">{statute}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 transition-colors group-hover:text-gray-200">{pitch}</p>
                    <p className="text-sm font-semibold text-navy-900 transition-colors group-hover:text-white">From {from}</p>
                  </Link>
                ))}
              </div>

              {/* Package summary — secondary, informational */}
              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-3 mb-5">
                  <h3 className="font-serif text-lg font-semibold text-navy-900">
                    Three packages, one transparent price
                  </h3>
                  <Link
                    href="/order"
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-navy-900 hover:text-navy-700 inline-flex items-center gap-1"
                  >
                    Compare full features
                    <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {packageSummary.map(({ name, pkg, price, audience, blurb, highlights, popular }) => (
                    <Link
                      key={name}
                      href={`/incorporate?package=${pkg}`}
                      className={`group relative flex flex-col bg-white rounded-lg p-6 border transition-all hover:bg-navy-900 hover:border-navy-900 hover:shadow-md ${
                        popular ? "border-navy-900 shadow-sm" : "border-gray-200"
                      }`}
                    >
                      {popular && (
                        <div className="absolute -top-3 left-6 bg-navy-900 text-white text-[0.65rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm inline-flex items-center gap-1 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                          <Star size={10} className="fill-gold-500 text-gold-500 transition-colors group-hover:fill-navy-900 group-hover:text-navy-900" />
                          Most Popular
                        </div>
                      )}
                      <div className="flex items-baseline gap-2 mb-1">
                        <h4 className="font-serif text-xl font-bold text-navy-900 transition-colors group-hover:text-white">{name}</h4>
                        <span className="text-sm font-semibold text-gray-500 transition-colors group-hover:text-gray-300">{price}</span>
                      </div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-3 transition-colors group-hover:text-gold-500">
                        {audience}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 transition-colors group-hover:text-gray-200">{blurb}</p>
                      <ul className="space-y-2">
                        {highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-gray-700 transition-colors group-hover:text-gray-200">
                            <Check size={14} className="text-navy-900 shrink-0 mt-0.5 transition-colors group-hover:text-gold-500" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="mt-5 pt-4 border-t border-gray-100 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-navy-900 transition-all group-hover:gap-2.5 group-hover:border-white/20 group-hover:text-white">
                        Start with {name}
                        <ArrowRight size={13} className="text-gold-600 transition-colors group-hover:text-gold-500" />
                      </span>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  All packages include the Articles of Incorporation filing, Certificate of
                  Incorporation, Company key, Standard Digital Minute Book, all mandatory
                  post-incorporation filings, and 24-hour turnaround.
                </p>
              </div>
            </div>
          </div>

          {/* Service categories — green header band + service list (Version 2) */}
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map(({ icon: Icon, title, description, services }) => (
              <div
                key={title}
                className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Green header band with inset gold underline */}
                <div className="relative flex items-start gap-4 bg-navy-900 text-white px-6 py-5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl md:text-2xl font-bold leading-tight">{title}</h2>
                    <p className="text-xs text-gray-300 leading-snug mt-1">{description}</p>
                  </div>
                  <span className="absolute left-6 right-6 bottom-0 h-0.5 bg-gold-500" />
                </div>

                {/* Service list — each row fills solid green on hover */}
                <div className="p-3 sm:p-4">
                  {services.map(({ name, from, href }, i) => (
                    <Link
                      key={name}
                      href={href}
                      className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-navy-900 hover:border-transparent ${
                        i > 0 ? "border-t border-gray-100" : ""
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-800 group-hover:text-white transition-colors">
                        {name}
                      </span>
                      <span className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-semibold text-gray-500 group-hover:text-gold-500 whitespace-nowrap transition-colors">
                          From {from}
                        </span>
                        <ArrowRight
                          size={15}
                          className="text-gray-300 opacity-0 transition-all group-hover:opacity-100 group-hover:text-gold-500"
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyer-referral callout */}
      <section className="bg-cream-50 py-12 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
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
                Korporex isn&rsquo;t a law firm, but if you need personalized legal advice on incorporation strategy,
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
      <section className="bg-navy-900 py-12 px-6 text-center text-white">
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
