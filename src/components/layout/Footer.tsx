import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/korporex/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/korporex",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61564594212222",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.687 4.533-4.687 1.313 0 2.686.236 2.686.236v2.972h-1.514c-1.49 0-1.955.93-1.955 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/korporex/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/korporexsolutions/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
];

const COMPANY_LINKS = [
  { href: "/services", labelKey: "services" },
  { href: "/pricing", labelKey: "pricing" },
  { href: "/about", labelKey: "about" },
  { href: "/faq", labelKey: "faq" },
  { href: "/resources", labelKey: "resources" },
  { href: "/contact", labelKey: "contact" },
] as const;

const SERVICE_LINKS = [
  { labelKey: "federalIncorporation", href: "/services" },
  { labelKey: "ontarioIncorporation", href: "/services" },
  { labelKey: "annualReturns", href: "/services" },
  { labelKey: "dissolveBusiness", href: "/services" },
  { labelKey: "talkToLawyer", href: "/legal-consultation" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();

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
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{t("tagline")}</p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("socialAria", { network: label })}
                  className="w-9 h-9 flex items-center justify-center border border-white/15 text-gray-400 hover:text-gold-500 hover:border-gold-500 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-500 mb-5">
              {t("companyTitle")}
            </p>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ href, labelKey }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t(`companyLinks.${labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-500 mb-5">
              {t("servicesTitle")}
            </p>
            <ul className="space-y-3">
              {SERVICE_LINKS.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t(`links.${labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-gray-500 mb-5">
              {t("contactTitle")}
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href={`mailto:${tCommon("contactEmail")}`} className="hover:text-white transition-colors">
                  {tCommon("contactEmail")}
                </a>
              </li>
              <li className="leading-relaxed text-xs text-gray-500">{t("responseLine")}</li>
            </ul>
            <div className="mt-6">
              <Link
                href="/incorporate"
                className="inline-block bg-gold-500 text-white text-sm font-medium px-4 py-2 hover:bg-gold-600 transition-colors"
              >
                {tCommon("incorporateNow")}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">{t("copyrightDisclaimer", { year })}</p>
          <div className="flex gap-6 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              {t("links.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              {t("links.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
