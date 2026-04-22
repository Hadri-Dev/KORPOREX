"use client";

import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-page" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Send failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error && err.message !== "Send failed" ? err.message : "Something went wrong. Please try again or email us at contact@korporex.com.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Contact Us
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            We&apos;re Here to Help
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Have a question about incorporating your business? Our support team responds
            within one business day.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-16">
          <div className="md:col-span-3">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-8">
              Send Us a Message
            </h2>
            {submitted ? (
              <div className="bg-cream-50 border border-gray-200 p-8">
                <div className="w-8 h-0.5 bg-gold-500 mb-6" />
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">Thank You</h3>
                <p className="text-gray-600">
                  We&apos;ve received your message and will respond within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-2">
                      Full Name *
                    </label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-2">
                      Email Address *
                    </label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-2">
                    Company / Business Name
                  </label>
                  <input id="company" name="company" type="text" value={form.company} onChange={handleChange}
                    placeholder="Acme Ltd"
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-2">
                    How Can We Help? *
                  </label>
                  <textarea id="message" name="message" required rows={5} value={form.message} onChange={handleChange}
                    placeholder="Tell us about your business and what you need help with..."
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors resize-none" />
                </div>
                {error && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit"
                  disabled={submitting}
                  className="bg-navy-900 text-white font-medium px-8 py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">
                Contact Information
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <Mail size={18} className="text-gold-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-1">Email</p>
                    <a href="mailto:contact@korporex.com" className="text-sm text-gray-700 hover:text-navy-900">
                      contact@korporex.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      All enquiries — general questions, incorporation orders, and support.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-cream-50 border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare size={18} className="text-gold-500" />
                <h3 className="font-serif text-lg font-bold text-navy-900">
                  Looking for Quick Answers?
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Most common questions are answered in our FAQ — including which jurisdiction
                to choose, what&apos;s included, and how long incorporation takes.
              </p>
              <a href="/faq"
                className="inline-block border border-navy-900 text-navy-900 text-sm font-medium px-5 py-2.5 tracking-wide hover:bg-navy-900 hover:text-white transition-colors">
                Browse the FAQ
              </a>
            </div>

            <div className="border-l-4 border-gold-500 pl-5">
              <p className="text-sm text-gray-600 italic leading-relaxed">
                &ldquo;We respond to every message within one business day. Korporex is 100% online — we serve
                Canadian entrepreneurs and international clients from anywhere.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
