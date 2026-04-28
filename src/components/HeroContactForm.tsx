"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function HeroContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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
        body: JSON.stringify({ ...form, source: "hero" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Send failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error && err.message !== "Send failed" ? err.message : "Something went wrong. Please try again or email us at contact@korporex.ca.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 flex flex-col justify-center min-h-[360px]">
        <div className="w-8 h-0.5 bg-gold-500 mb-6" />
        <p className="font-serif text-2xl font-bold text-navy-900 mb-3">Thank You</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          We&apos;ve received your message and will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8">
      <div className="w-8 h-0.5 bg-gold-500 mb-5" />
      <p className="font-serif text-xl font-bold text-navy-900 mb-1">Have a Question?</p>
      <p className="text-xs text-gray-500 mb-6">We respond within one business day.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            Full Name *
          </label>
          <input
            name="name" type="text" required value={form.name} onChange={handleChange}
            placeholder="Jane Smith"
            className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            Email Address *
          </label>
          <input
            name="email" type="email" required value={form.email} onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            I&apos;m Interested In
          </label>
          <select
            name="service" value={form.service} onChange={handleChange}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors bg-white"
          >
            <option value="">Select a service…</option>
            <option value="federal">Federal Incorporation</option>
            <option value="ontario">Ontario Incorporation</option>
            <option value="registration">Business Name Registration</option>
            <option value="compliance">Compliance Filings</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            Message
          </label>
          <textarea
            name="message" rows={3} value={form.message} onChange={handleChange}
            placeholder="Tell us about your business…"
            className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : (<>Send Message <ArrowRight size={15} /></>)}
        </button>
      </form>
    </div>
  );
}
