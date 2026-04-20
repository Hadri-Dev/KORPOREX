import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-navy-900 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-gold-500 text-lg leading-none">K</span>
              </div>
              <span className="font-serif text-lg font-bold tracking-[0.12em] text-white">
                KORPOREX
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Canada&apos;s online business incorporation platform. Fast, affordable,
              fully online.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-sm text-gray-400 hover:text-gold-500 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-gold-500 transition-colors">
                Twitter
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-500 mb-5">
              Company
            </p>
            <ul className="space-y-3">
              {(
                [
                  ["/", "Home"],
                  ["/about", "About Us"],
                  ["/services", "Services"],
                  ["/pricing", "Pricing"],
                  ["/faq", "FAQ"],
                  ["/contact", "Contact"],
                ] as [string, string][]
              ).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-500 mb-5">
              Services
            </p>
            <ul className="space-y-3">
              {[
                ["Federal Incorporation", "/services"],
                ["Ontario Incorporation", "/services"],
                ["BC Incorporation", "/services"],
                ["Business Name Registration", "/services"],
                ["Annual Returns", "/services"],
                ["Dissolve a Business", "/services"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-500 mb-5">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="mailto:support@korporex.com" className="hover:text-white transition-colors">
                  support@korporex.com
                </a>
              </li>
              <li>+1 (888) 000-0000</li>
              <li className="leading-relaxed">Toronto, Ontario, Canada</li>
            </ul>
            <div className="mt-6">
              <Link
                href="/incorporate"
                className="inline-block bg-gold-500 text-white text-sm font-medium px-4 py-2 hover:bg-gold-600 transition-colors"
              >
                Incorporate Now
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2025 Korporex Technologies Inc. All rights reserved. Korporex is not a law firm and does not provide legal advice.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
