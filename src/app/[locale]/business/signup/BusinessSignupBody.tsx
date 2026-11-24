"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";
import { iCls } from "@/components/wizard/WizardUI";
import { setDemoBusinessSession } from "@/lib/demoBusinessAccount";

// ⚠️ PREVIEW ONLY. English-only, not localized — this page does not create a
// real account, does not store a card, and does not talk to Stripe or
// Supabase. It exists purely so the owner can see the intended signup flow
// and where "create a business account" is surfaced before the real backend
// (Supabase tables + Stripe SetupIntent) is built.

export default function BusinessSignupBody() {
  const [companyName, setCompanyName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim() || !billingEmail.trim()) return;
    setDemoBusinessSession({ companyName: companyName.trim(), billingEmail: billingEmail.trim() });
    setDone(true);
  }

  if (done) {
    return (
      <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-navy-900">
            Account created (preview)
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            In the real system, {companyName || "your business"}&apos;s card would now be verified
            and the account active immediately — no manual approval step. You&apos;d get a
            confirmation email, and orders placed on{" "}
            <Link href="/nuans" className="text-navy-900 underline">
              /nuans
            </Link>{" "}
            while signed in would skip Stripe Checkout and bill to this account at month end.
          </p>
          <Link
            href="/nuans"
            className="mt-6 inline-flex items-center gap-2 bg-navy-900 text-white font-semibold py-3 px-6 text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Go order a NUANS report as {companyName || "this business"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <strong>Preview only.</strong> This page is a mockup of the intended signup flow. No
          account is created, no card is stored, and nothing is sent to Stripe or Supabase yet.
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2">
          Create a business account
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          For law firms, accountants, and businesses ordering NUANS reports regularly. Add a card
          once, order anytime without checking out, and get one invoice a month — charged
          automatically to the card on file.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Company name *
            </label>
            <input
              className={iCls}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Maple Ridge Law LLP"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Contact name
            </label>
            <input
              className={iCls}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Jordan Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Billing email *
            </label>
            <input
              type="email"
              className={iCls}
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="billing@mapleridgelaw.ca"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input type="password" className={iCls} placeholder="••••••••" disabled />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Confirm password
            </label>
            <input type="password" className={iCls} placeholder="••••••••" disabled />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={15} className="text-navy-900" />
              <span className="text-xs font-bold tracking-[0.08em] uppercase text-navy-900">
                Card on file
              </span>
            </div>
            <div className="border-2 border-gold-200 rounded-md p-4 bg-cream-50 space-y-3">
              <input
                className={`${iCls} bg-white`}
                placeholder="4242 4242 4242 4242"
                disabled
              />
              <div className="grid grid-cols-2 gap-3">
                <input className={`${iCls} bg-white`} placeholder="MM / YY" disabled />
                <input className={`${iCls} bg-white`} placeholder="CVC" disabled />
              </div>
              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-gold-600" />
                Real build: this is a Stripe card field. The card itself is stored by Stripe, not
                in Korporex&apos;s database — Korporex only keeps a reference token. It&apos;s
                verified with a $0 authorization (nothing is charged) and becomes what your
                monthly invoice charges automatically.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Create account (preview)
          </button>
          <p className="text-xs text-gray-500">
            Already have a business account?{" "}
            <Link href="/business/login" className="text-navy-900 underline">
              Sign in
            </Link>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
