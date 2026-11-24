"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react";
import { iCls } from "@/components/wizard/WizardUI";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function BusinessSignupBody() {
  if (!stripePromise) {
    return (
      <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
        <div className="max-w-md mx-auto text-center text-sm text-gray-600">
          Business account signup is not configured on this environment.
        </div>
      </section>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <SignupForm />
    </Elements>
  );
}

function SignupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null); // holds companyName once created

  const cardElementOptions = useMemo(
    () => ({
      style: {
        base: { fontSize: "14px", color: "#111827", "::placeholder": { color: "#9CA3AF" } },
      },
    }),
    [],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!companyName.trim() || !contactName.trim() || !billingEmail.trim()) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    setSubmitting(true);
    try {
      const signupRes = await fetch("/api/business/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          contactName: contactName.trim(),
          billingEmail: billingEmail.trim(),
          password,
        }),
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.error ?? "Could not start signup.");

      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(
        signupData.setupIntentClientSecret,
        {
          payment_method: {
            card,
            billing_details: { name: companyName.trim(), email: billingEmail.trim() },
          },
        },
      );
      if (stripeError) throw new Error(stripeError.message ?? "Card verification failed.");
      if (!setupIntent || setupIntent.status !== "succeeded") {
        throw new Error("Card verification did not complete.");
      }

      const completeRes = await fetch("/api/business/signup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUserId: signupData.authUserId,
          stripeCustomerId: signupData.stripeCustomerId,
          setupIntentId: setupIntent.id,
          companyName: signupData.companyName,
          contactName: signupData.contactName ?? undefined,
          billingEmail: signupData.billingEmail,
        }),
      });
      const completeData = await completeRes.json();
      if (!completeRes.ok) throw new Error(completeData.error ?? "Could not finish setting up your account.");

      setDone(completeData.companyName as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="bg-white py-16 px-6 min-h-[60vh] flex items-center">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-navy-900">Account created</h1>
          <p className="mt-2 text-sm text-gray-600">
            {done}&apos;s card is verified and your account is active. Orders placed on{" "}
            <Link href="/nuans" className="text-navy-900 underline">
              /nuans
            </Link>{" "}
            while signed in will skip checkout and bill to your account at month end.
          </p>
          <button
            type="button"
            onClick={() => router.push("/nuans")}
            className="mt-6 inline-flex items-center gap-2 bg-navy-900 text-white font-semibold py-3 px-6 text-sm tracking-wide hover:bg-navy-800 transition-colors"
          >
            Go order a NUANS report
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-lg mx-auto">
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
              Contact name *
            </label>
            <input
              className={iCls}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Jordan Smith"
              required
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
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
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
              Confirm password *
            </label>
            <input
              type="password"
              className={iCls}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={15} className="text-navy-900" />
              <span className="text-xs font-bold tracking-[0.08em] uppercase text-navy-900">
                Card on file
              </span>
            </div>
            <div className="border-2 border-gold-200 rounded-md p-4 bg-cream-50 space-y-3">
              <div className="bg-white border-2 border-gold-200 px-4 py-3 rounded-md">
                <CardElement options={cardElementOptions} />
              </div>
              <p className="text-xs text-gray-500 flex items-start gap-1.5">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-gold-600" />
                Your card is stored by Stripe, not in Korporex&apos;s database. It&apos;s verified
                with a $0 authorization (nothing is charged) and becomes what your monthly invoice
                charges automatically.
              </p>
            </div>
          </div>

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting || !stripe}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-50"
          >
            {submitting ? "Verifying card…" : "Create account"}
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
