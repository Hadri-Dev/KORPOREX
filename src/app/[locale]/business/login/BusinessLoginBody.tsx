"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { iCls } from "@/components/wizard/WizardUI";

export default function BusinessLoginBody() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/business/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not sign in.");
      router.push("/nuans");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
      <div className="max-w-sm mx-auto w-full">
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
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
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
