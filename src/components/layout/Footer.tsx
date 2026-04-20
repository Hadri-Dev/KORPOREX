import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="font-serif text-xl font-bold tracking-[0.15em] text-white">
              KORPOREX
            </span>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              Strategic corporate and commercial advisory for business founders
              and mid-market entrepreneurs.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-gold-500 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-gold-500 transition-colors"
              >
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
                  ["/contact", "Contact"],
                ] as [string, string][]
              ).map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
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
                "Contract Advisory",
                "Corporate Governance",
                "Transaction Support",
                "Strategic Advisory",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {s}
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
              <li>contact@korporex.com</li>
              <li>+1 (888) 000-0000</li>
              <li className="leading-relaxed">
                123 Business Avenue
                <br />
                Suite 400, New York, NY
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2025 Korporex Advisory Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
