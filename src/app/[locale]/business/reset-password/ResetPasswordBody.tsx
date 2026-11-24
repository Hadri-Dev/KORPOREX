"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { iCls } from "@/components/wizard/WizardUI";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

// Reached via the link in a reset-password email. Supabase puts a one-time
// recovery token in the URL; its JS client picks that up automatically on
// load and fires a PASSWORD_RECOVERY auth event, which is the only thing
// that authorizes the updateUser({ password }) call below — there's no
// separate token-in-URL handling needed here.
export default function ResetPasswordBody() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // In case the event already fired before this listener attached.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
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
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
        <div className="max-w-sm mx-auto text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-navy-900">Password updated</h1>
          <p className="mt-2 text-sm text-gray-600">You can now sign in with your new password.</p>
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

  if (!ready) {
    return (
      <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
        <div className="max-w-sm mx-auto text-center text-sm text-gray-600">
          This link is invalid or has expired. Request a new one from{" "}
          <a href="/business/forgot-password" className="text-navy-900 underline">
            the password reset page
          </a>
          .
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
      <div className="max-w-sm mx-auto w-full">
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
            Update password
          </button>
        </form>
      </div>
    </section>
  );
}
