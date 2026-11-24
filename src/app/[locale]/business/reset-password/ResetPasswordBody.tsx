"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { iCls } from "@/components/wizard/WizardUI";

// ⚠️ PREVIEW ONLY. Real build: this is where Supabase's reset-link redirect
// lands — it carries a one-time token in the URL that authorizes setting a
// new password, nothing else on the page. Shown here reachable directly for
// preview convenience.

export default function ResetPasswordBody() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setDone(true);
  }

  if (done) {
    return (
      <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
        <div className="max-w-sm mx-auto text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-navy-900">Password updated</h1>
          <p className="mt-2 text-sm text-gray-600">
            (Preview — nothing was actually changed.) In the real build you&apos;d be signed in
            and sent straight to your account.
          </p>
          <button
            type="button"
            onClick={() => router.push("/business/login")}
            className="mt-6 inline-flex items-center gap-2 bg-navy-900 text-white font-semibold py-3 px-6 text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Go to sign in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <strong>Preview only.</strong> This is the page a reset-link email would land on.
        </div>
        <h1 className="font-serif text-2xl font-bold text-navy-900 mb-6">Set a new password</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">New password</label>
            <input
              type="password"
              className={iCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              className={iCls}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Update password (preview)
          </button>
        </form>
      </div>
    </section>
  );
}
