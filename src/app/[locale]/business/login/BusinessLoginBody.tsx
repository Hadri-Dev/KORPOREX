"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { iCls } from "@/components/wizard/WizardUI";
import { setDemoBusinessSession } from "@/lib/demoBusinessAccount";

// ⚠️ PREVIEW ONLY — see BusinessSignupBody.tsx for context. Accepts any
// email/password and fakes a signed-in session so the NUANS page preview has
// something to react to.

export default function BusinessLoginBody() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setDemoBusinessSession({
      companyName: email.split("@")[0].replace(/[.]/g, " ") + " (demo)",
      billingEmail: email.trim(),
    });
    router.push("/nuans");
  }

  return (
    <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <strong>Preview only.</strong> Any email/password signs you into the demo — this isn&apos;t
          real authentication yet.
        </div>
        <h1 className="font-serif text-2xl font-bold text-navy-900 mb-6">
          Business account sign in
        </h1>
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
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className={iCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Sign in (preview)
          </button>
          <p className="text-xs text-gray-500">
            <Link href="/business/forgot-password" className="text-navy-900 underline">
              Forgot your password?
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            No business account?{" "}
            <Link href="/business/signup" className="text-navy-900 underline">
              Create one
            </Link>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
