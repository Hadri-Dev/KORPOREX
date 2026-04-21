import Link from "next/link";
import { ArrowRight, BookOpen, FileText, HelpCircle } from "lucide-react";

type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
};

type ResourceCategory = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const categories: ResourceCategory[] = [
  {
    icon: BookOpen,
    title: "Incorporation Guides",
    description: "Step-by-step guides to incorporating your business federally or provincially in Canada.",
  },
  {
    icon: FileText,
    title: "Compliance & Maintenance",
    description: "How to keep your corporation in good standing — annual returns, record-keeping, and more.",
  },
  {
    icon: HelpCircle,
    title: "Jurisdiction Comparisons",
    description: "Federal vs. Ontario vs. BC — understand the differences before you choose.",
  },
];

const articles: Article[] = [
  {
    slug: "#",
    category: "Incorporation Guides",
    title: "Federal vs. Provincial Incorporation: Which Is Right for Your Business?",
    excerpt:
      "Choosing between a federal and provincial corporation is one of the first decisions you'll make. We break down the key differences, costs, and trade-offs so you can choose with confidence.",
    readTime: "6 min read",
  },
  {
    slug: "#",
    category: "Incorporation Guides",
    title: "What Is a NUANS Name Search — and Do You Need One?",
    excerpt:
      "If you're incorporating federally or in certain provinces, a NUANS search is mandatory. Learn what it is, how it works, and what happens if your first-choice name is unavailable.",
    readTime: "4 min read",
  },
  {
    slug: "#",
    category: "Compliance & Maintenance",
    title: "Corporate Annual Returns in Canada: A Complete Guide",
    excerpt:
      "Every Canadian corporation must file an annual return. Deadlines, fees, and consequences of missing a filing differ by jurisdiction. Here's everything you need to know.",
    readTime: "5 min read",
  },
  {
    slug: "#",
    category: "Compliance & Maintenance",
    title: "What Is a Corporate Minute Book and Why Does Your Corporation Need One?",
    excerpt:
      "Canadian corporations are legally required to maintain a minute book. We explain what goes in it, who is responsible for keeping it, and what happens if you don't have one.",
    readTime: "4 min read",
  },
  {
    slug: "#",
    category: "Jurisdiction Comparisons",
    title: "Incorporating in Ontario: Everything You Need to Know",
    excerpt:
      "Ontario is home to the majority of Canadian small businesses. This guide walks through the Ontario Business Corporations Act, costs, timelines, and what you'll receive after filing.",
    readTime: "7 min read",
  },
  {
    slug: "#",
    category: "Jurisdiction Comparisons",
    title: "Incorporating in BC: A Step-by-Step Overview",
    excerpt:
      "British Columbia uses the BC Business Corporations Act and the BC Business Registry. Learn what makes BC incorporation unique and whether it's the right choice for your business.",
    readTime: "6 min read",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Resources
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Guides &amp; Articles for
            <br />
            Canadian Entrepreneurs
          </h1>
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
            Plain-language guides on incorporation, compliance, and corporate maintenance
            to help you make informed decisions about your business.
          </p>
        </div>
      </section>

      {/* Category overview */}
      <section className="bg-white py-14 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
          {categories.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 items-start p-6 bg-cream-50 border border-gray-100">
              <div className="w-10 h-10 bg-navy-900 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gold-500" />
              </div>
              <div>
                <p className="font-serif text-base font-bold text-navy-900 mb-1">{title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-2">
            All Articles
          </p>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-10">
            Latest Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(({ slug, category, title, excerpt, readTime }) => (
              <Link
                key={title}
                href={slug}
                className="group flex flex-col border border-gray-100 hover:border-navy-900 transition-colors bg-cream-50 hover:bg-white"
              >
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-semibold tracking-[0.1em] uppercase text-gold-500 mb-3">
                    {category}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-navy-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                    {excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{readTime}</span>
                    <ArrowRight size={14} className="text-gray-400 group-hover:text-navy-900 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 border border-dashed border-gray-200 p-8 text-center">
            <p className="font-serif text-lg font-bold text-navy-900 mb-2">More Articles Coming Soon</p>
            <p className="text-sm text-gray-600">
              We&apos;re regularly publishing new guides on incorporation, compliance, and running a Canadian corporation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Incorporate?</h2>
          <p className="text-gray-300 mb-8">
            Start your incorporation online in about 10 minutes. We&apos;ll handle the
            filing and deliver your documents within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/incorporate"
              className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
            >
              Get Started <ArrowRight size={16} />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-navy-900 transition-colors"
            >
              Browse the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
