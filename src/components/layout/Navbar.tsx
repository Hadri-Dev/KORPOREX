"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 h-[72px]">
      <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-[1.35rem] font-bold text-navy-900 tracking-[0.15em] shrink-0"
        >
          KORPOREX
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-600 hover:text-navy-900 transition-colors tracking-wide"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href="/pricing"
            className="inline-flex items-center bg-navy-900 text-white text-sm font-medium px-5 py-2.5 tracking-wide hover:bg-navy-800 transition-colors"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden text-gray-700 p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden absolute inset-x-0 top-[72px] bg-white border-b border-gray-100 px-6 py-6 shadow-lg">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base text-gray-700 hover:text-navy-900 border-b border-gray-50 last:border-0"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="block mt-4 bg-navy-900 text-white text-sm font-medium px-5 py-3 tracking-wide text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
