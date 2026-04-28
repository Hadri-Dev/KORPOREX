"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "federal", label: "Federal incorporation" },
  { value: "ontario", label: "Ontario incorporation" },
  { value: "registration", label: "Business name / sole prop registration" },
  { value: "amendment", label: "Changes & amendments" },
  { value: "compliance", label: "Compliance filing (annual return, etc.)" },
  { value: "update", label: "Dissolve / revive / amalgamate / continue" },
  { value: "other", label: "Something else" },
];

export default function SoonContactForm() {
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
        body: JSON.stringify({ ...form, source: "soon" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Send failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Send failed"
          ? err.message
          : "Something went wrong. Please try again or email us at contact@korporex.com."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 md:p-10 border border-gold-500/30 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gold-500 flex items-center justify-center">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div className="w-10 h-0.5 bg-gold-500" />
        </div>
        <p className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-3">
          Thank you — we&apos;ve received your message.
        </p>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          A member of our team will respond within <span className="font-semibold text-navy-900">24 hours</span> at
          the email you provided. In the meantime, you can also reach us directly at{" "}
          <a href="mailto:contact@korporex.com" className="text-navy-900 underline underline-offset-2">
            contact@korporex.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-10 shadow-xl">
      <div className="w-10 h-0.5 bg-gold-500 mb-5" />
      <p className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2">Tell Us About Your Business</p>
      <p className="text-sm text-gray-600 mb-7">
        Leave your details and we&apos;ll respond within{" "}
        <span className="font-semibold text-navy-900">24 hours</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            What do you need?
          </label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors bg-white"
          >
            <option value="">Select a service…</option>
            {SERVICE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
            Message
          </label>
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Briefly describe what you need…"
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
          className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            "Sending…"
          ) : (
            <>
              Send Message
              <ArrowRight size={15} />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center pt-1">
          By submitting, you agree we may contact you about your enquiry.
        </p>
      </form>
    </div>
  );
}
