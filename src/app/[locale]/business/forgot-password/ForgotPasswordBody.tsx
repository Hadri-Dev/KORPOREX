"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { iCls } from "@/components/wizard/WizardUI";

// ⚠️ PREVIEW ONLY. Real build: this calls Supabase Auth's
// resetPasswordForEmail(email), which emails a reset link regardless of
// whether the address has an account — the same message is shown either way
// so the page can't be used to probe which companies have accounts.

export default function ForgotPasswordBody() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  }

  if (sent) {
    return (
      <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
        <div className="max-w-sm mx-auto text-center">
          <MailCheck className="mx-auto h-12 w-12 text-navy-900" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-navy-900">Check your email</h1>
          <p className="mt-2 text-sm text-gray-600">
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset the
            password. (Preview — no email was actually sent.)
          </p>
          <p className="mt-6 text-xs text-gray-500">
            Can&apos;t access that email?{" "}
            <Link href="/contact" className="text-navy-900 underline">
              Contact us
            </Link>{" "}
            and we can reset it for you after verifying your account.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <strong>Preview only.</strong> No email is actually sent yet.
        </div>
        <h1 className="font-serif text-2xl font-bold text-navy-900 mb-2">Reset your password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter the email on your business account and we&apos;ll send you a link to reset your
          password.
        </p>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className={iCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="billing@mapleridgelaw.ca"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Send reset link (preview)
          </button>
          <p className="text-xs text-gray-500">
            <Link href="/business/login" className="text-navy-900 underline">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
