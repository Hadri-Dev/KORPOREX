"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

type FAQ = { q: string; a: string };
type Category = { title: string; items: FAQ[] };

const categories: Category[] = [
  {
    title: "General",
    items: [
      {
        q: "What is Korporex?",
        a: "Korporex is an online business incorporation and registration platform. We make it simple to incorporate a Canadian business, register a business name, and file compliance documents — all online. We serve Canadian entrepreneurs as well as international founders who want to incorporate a Canadian corporation.",
      },
      {
        q: "Who is Korporex for?",
        a: "Korporex is designed for entrepreneurs, freelancers, small business owners, startups, and international founders who want to incorporate or register a Canadian business quickly. Whether you're a first-time founder based in Canada or an overseas founder setting up a Canadian entity, our platform guides you through every step.",
      },
      {
        q: "Is Korporex a law firm?",
        a: "No. Korporex is a technology company and document preparation and filing service. We are not a law firm and do not provide legal advice. If you require legal advice specific to your situation, we can connect you with an independent corporate lawyer from our trusted referral network — see “What if I need personalized legal advice?” below.",
      },
      {
        q: "What if I need personalized legal advice?",
        a: "We can connect you with an independent licensed corporate lawyer from our trusted referral network for a 30-minute consultation ($150 + HST, billed in advance). Fill out a short questionnaire describing your situation, pick a slot from the lawyer’s Calendly, and pay to confirm. The lawyer reviews your questionnaire and any documents you upload before the call. Korporex is not a law firm and is not party to the consultation; no solicitor-client relationship is created with Korporex. Visit /legal-consultation to book.",
      },
      {
        q: "Is my personal information secure?",
        a: "Yes. We take data security seriously. Your personal and business information is encrypted in transit and at rest using industry-standard security practices. We never share your data with third parties except as required to complete your government filings.",
      },
    ],
  },
  {
    title: "Incorporation",
    items: [
      {
        q: "What's the difference between federal and provincial incorporation?",
        a: "A federal corporation (incorporated under the Canada Business Corporations Act) has its name protected nationwide and can carry on business in any province, subject to extra-provincial registration in each one. A provincial corporation (such as Ontario or BC) is created under provincial law and is automatically authorized to carry on business in the incorporating province, with name protection limited to that province. Each route produces a valid corporation — the practical differences are name-protection scope, government fees, and ongoing filings.",
      },
      {
        q: "Which jurisdiction should I choose?",
        a: "There is no universally best jurisdiction — the right choice depends on your specific needs. Federal, Ontario, and British Columbia incorporations are each a valid path, and the decision typically comes down to where you plan to operate, how important nationwide name protection is, and your budget. Our Resources section has dedicated guides on each jurisdiction, and our wizard captures the information needed for any of the three.",
      },
      {
        q: "What is a NUANS name search?",
        a: "NUANS (Newly Upgraded Automated Name Search) is a government database search that checks your proposed corporation name against existing registered corporations and trademarks. It is required for federal, Ontario, and several other named provincial incorporations. If you incorporate as a numbered corporation (e.g., 1234567 Canada Inc.), no NUANS search is required. Korporex coordinates the NUANS search for you when needed, but the NUANS report fee is not included in our package price and is charged separately.",
      },
      {
        q: "What types of corporations can I incorporate?",
        a: "Through Korporex you can incorporate Standard (for-profit) corporations, Professional corporations (for regulated professionals such as doctors, dentists, and accountants), Holding corporations (for managing investments or assets), and Non-Profit corporations. Availability varies by jurisdiction — federal incorporations currently support standard and holding corporations; Ontario and BC support all four types.",
      },
      {
        q: "Do I need a physical office address to incorporate?",
        a: "Yes — every corporation requires a registered office address in its incorporating jurisdiction. This address must be a physical location (not a P.O. Box) where official notices and corporate correspondence can be received. If you don't have one, Korporex offers a registered office address service at checkout for federal and Ontario incorporations: $99.99/month, billed annually in advance at $1,199.88 + HST. The address is in the Greater Toronto Area, chosen by Korporex at our discretion, and includes a monthly scanned copy of received mail emailed to you. The annual fee is non-refundable, including if you obtain your own address before the term ends. BC incorporations require a BC address — email contact@korporex.com for help.",
      },
    ],
  },
  {
    title: "Process",
    items: [
      {
        q: "How long does incorporation take?",
        a: "Most incorporations are filed with the government within 24 hours of your application being submitted and payment processed. Federal incorporations can occasionally take 1–3 business days depending on government processing times. Premium package customers receive priority 12-hour processing. You will be notified by email as soon as your documents are ready.",
      },
      {
        q: "What information do I need to incorporate?",
        a: "You'll need: (1) your proposed corporation name (and at least one alternative in case your first choice is unavailable); (2) the address of your registered office; (3) the full name and address of at least one director; and (4) the name of the initial shareholder(s) and the number and class of shares being issued. Our online form guides you through each of these requirements step by step.",
      },
      {
        q: "Can I change my corporation's details after incorporation?",
        a: "Yes. Directors, shareholders, addresses, and other details can be updated through government filings after incorporation. Some changes (such as a corporate name change or changes to share structure) require Articles of Amendment. Korporex offers all common post-incorporation changes as separate services — you can find them on our Services page.",
      },
      {
        q: "Do I need a lawyer to use Korporex?",
        a: "Korporex is a document preparation and filing service — using our platform does not require engaging a lawyer. That said, if your situation involves complex shareholder arrangements, professional licensing requirements, tax planning, or other questions that require legal or tax judgement, we recommend consulting a qualified professional in addition to using our service.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    items: [
      {
        q: "Are government filing fees included in your prices?",
        a: "Yes. All Korporex prices include government filing fees. There are no hidden charges — the price you see on our pricing page is the total amount you will pay (excluding applicable taxes).",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards including Visa, Mastercard, and American Express. Payment is processed securely at checkout.",
      },
      {
        q: "What is your refund policy?",
        a: "All fees are non-refundable once payment has been submitted. This includes package fees, NUANS pass-through fees, registered office service fees, and applicable taxes. The reason is that incorporation work — including third-party fees and government filings — is commenced immediately upon payment. If a filing is rejected because of an error on our part, we will re-file at no additional service cost (that's rectification, not a refund). Exceptional-circumstance requests can be emailed to contact@korporex.com with your order reference, but we are under no obligation to issue a refund. See our Terms of Service for the full policy.",
      },
      {
        q: "Do prices include taxes?",
        a: "No. All prices are displayed in Canadian dollars (CAD) and exclude applicable Canadian federal and provincial taxes (GST/HST/QST). The applicable tax amount is calculated live as you fill out the incorporation form based on your billing address and shown clearly at checkout. International clients (billing outside Canada) are generally not charged Canadian sales tax.",
      },
      {
        q: "Are NUANS fees included?",
        a: "No. Government-mandated NUANS name-search report fees are not included in our package prices. If your incorporation requires a NUANS report (federal, Ontario, and certain other named provincial corporations), the report fee is charged separately. You can avoid the NUANS fee entirely by choosing a numbered corporation.",
      },
    ],
  },
  {
    title: "After Incorporation",
    items: [
      {
        q: "What documents will I receive?",
        a: "All packages include your Certificate of Incorporation and Articles of Incorporation delivered by email as PDF documents. Standard and Premium packages also include a complete corporate minute book with organizational resolutions, share certificates, and bylaws. Your documents are also stored securely in your Korporex account.",
      },
      {
        q: "What is a minute book and do I need one?",
        a: "A corporate minute book is a collection of your corporation's key documents — articles, bylaws, shareholder and director registers, resolutions, and share certificates. Canadian corporations are legally required to maintain these records. Korporex's Standard and Premium packages include a digital minute book. If you choose the Basic package, you are responsible for preparing and maintaining these records separately.",
      },
      {
        q: "What annual filings are required after incorporation?",
        a: "Requirements vary by jurisdiction. Ontario corporations must file an Annual Return with the Ontario government each year (typically within 60 days of your anniversary date). Federal corporations must file an Annual Return with Corporations Canada. BC corporations must file an Annual Report with the BC Registrar. Failure to file can result in your corporation being dissolved. Korporex offers annual return filing services — available on our Services page.",
      },
      {
        q: "Do I need a business bank account after incorporating?",
        a: "You are not legally required to have a separate business bank account, but it is strongly recommended. Keeping your personal and business finances separate simplifies accounting and protects your limited liability. Most Canadian banks require your Certificate of Incorporation and Articles when opening a business account.",
      },
    ],
  },
];

function AccordionItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-serif text-base font-bold text-navy-900 leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-600 leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            FAQ
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Frequently Asked
            <br />
            Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Everything you need to know about incorporating your business in Canada with Korporex.
            Can&apos;t find your answer?{" "}
            <Link href="/contact" className="text-navy-900 underline underline-offset-2">Contact our support team.</Link>
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-12">
          {/* Category nav */}
          <div className="md:col-span-1">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">
              Categories
            </p>
            <nav className="space-y-1">
              {categories.map(({ title }, idx) => (
                <button
                  key={title}
                  onClick={() => setActiveCategory(idx)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    activeCategory === idx
                      ? "bg-navy-50 text-navy-900 border-l-2 border-navy-900"
                      : "text-gray-600 hover:text-navy-900"
                  }`}
                >
                  {title}
                </button>
              ))}
            </nav>
          </div>

          {/* Questions */}
          <div className="md:col-span-3">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6 pb-4 border-b border-gray-200">
              {categories[activeCategory].title}
            </h2>
            <div>
              {categories[activeCategory].items.map((item) => (
                <AccordionItem key={item.q} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-20 px-6 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-4">Ready to Incorporate?</h2>
          <p className="text-gray-300 mb-8">
            Start your incorporation online in about 10 minutes. We&apos;ll handle the filing
            and deliver your documents within 24 hours.
          </p>
          <Link
            href="/incorporate"
            className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-7 py-3.5 text-sm tracking-wide hover:bg-gold-600 transition-colors"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
