import Link from "next/link";
import { CheckCircle, ArrowRight, Mail, Clock, FileText, Building2 } from "lucide-react";
import { stripe } from "@/lib/stripe";

// Render on demand so we can verify the Stripe session when the user arrives
// from a successful checkout redirect.
export const dynamic = "force-dynamic";

type SearchParams = {
  session_id?: string | string[];
  ref?: string | string[];
  dev?: string | string[];
};

type PageProps = { searchParams?: SearchParams };

const nextSteps = [
  {
    icon: Clock,
    title: "Filing in Progress",
    body: "Your application will be submitted to the appropriate government registry within 24 hours (12 hours for Premium orders).",
  },
  {
    icon: Mail,
    title: "Check Your Email",
    body: "You'll receive a Stripe receipt immediately. Once your incorporation documents are ready, we'll send them as PDF attachments to the email address you provided.",
  },
  {
    icon: FileText,
    title: "Your Documents",
    body: "Depending on your package, you'll receive your Certificate of Incorporation, Articles, and corporate minute book — all stored securely in your Korporex account.",
  },
  {
    icon: Building2,
    title: "Open a Business Bank Account",
    body: "Once you have your Certificate of Incorporation, you can open a business bank account. Most Canadian banks require your Certificate and Articles of Incorporation.",
  },
];

function firstParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const sessionId = firstParam(searchParams?.session_id);
  const refFromUrl = firstParam(searchParams?.ref);
  const isDev = firstParam(searchParams?.dev) === "1";

  let displayRef = refFromUrl;
  let amountPaid: string | null = null;
  let paid = false;

  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      displayRef = session.metadata?.orderRef || refFromUrl || displayRef;
      if (session.amount_total != null) {
        amountPaid = `$${(session.amount_total / 100).toFixed(2)} ${(session.currency ?? "cad").toUpperCase()}`;
      }
    } catch (err) {
      console.error("[confirmation] failed to retrieve Stripe session:", err);
    }
  } else if (isDev) {
    // Dev fallback path — Stripe is not configured locally.
    paid = true;
  }

  return (
    <>
      <section className="bg-cream-50 py-12 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-navy-900 flex items-center justify-center">
              <CheckCircle size={32} className="text-gold-500" />
            </div>
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            {paid ? "Payment Confirmed" : "Order Received"}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Your Incorporation
            <br />
            Is Being Processed
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Thank you — your application has been received. You&apos;ll receive your
            incorporation documents within 24 hours.
          </p>
          {(displayRef || amountPaid) && (
            <div className="mt-8 inline-block bg-white border border-gray-200 rounded-lg px-6 py-4 text-left">
              {displayRef && (
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                  Order Reference
                </p>
              )}
              {displayRef && (
                <p className="font-mono text-sm font-semibold text-navy-900">{displayRef}</p>
              )}
              {amountPaid && (
                <p className="text-xs text-gray-500 mt-2">
                  Amount paid: <span className="font-medium text-gray-800">{amountPaid}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="w-8 h-0.5 bg-gold-500 mb-8" />
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-10">
            What Happens Next
          </h2>
          <div className="space-y-8">
            {nextSteps.map(({ icon: Icon, title, body }, idx) => (
              <div key={title} className="flex gap-5">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 bg-navy-50 flex items-center justify-center">
                    <Icon size={18} className="text-navy-900" />
                  </div>
                  {idx < nextSteps.length - 1 && (
                    <div className="w-px flex-1 bg-gray-100 mt-3" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-serif text-lg font-bold text-navy-900 mb-2">{title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-12 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-base font-bold text-navy-900 mb-1">Have a Question?</p>
              <p className="text-sm text-gray-600">
                Our support team responds within one business day.{" "}
                <Link href="/contact" className="text-navy-900 underline underline-offset-2">
                  Contact us
                </Link>{" "}
                or{" "}
                <Link href="/faq" className="text-navy-900 underline underline-offset-2">
                  browse the FAQ
                </Link>
                {displayRef && (
                  <>
                    {" "}— please quote <span className="font-mono text-navy-900">{displayRef}</span>
                  </>
                )}
                .
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-navy-900 text-white font-medium px-6 py-3 text-sm tracking-wide hover:bg-navy-800 transition-colors shrink-0"
            >
              Back to Home <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
