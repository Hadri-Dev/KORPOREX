import Link from "next/link";
import { CheckCircle, ArrowRight, Mail, CalendarClock, ScaleIcon } from "lucide-react";
import { stripe } from "@/lib/stripe";

// Render on demand so we can verify the Stripe session when the customer
// arrives from a successful checkout redirect.
export const dynamic = "force-dynamic";

type SearchParams = {
  session_id?: string | string[];
  ref?: string | string[];
  dev?: string | string[];
};

type PageProps = { searchParams?: SearchParams };

const nextSteps = [
  {
    icon: CalendarClock,
    title: "Calendar Invite Coming",
    body: "Calendly will email you a calendar invite for the slot you reserved. Add it to your calendar so you don't miss the call.",
  },
  {
    icon: Mail,
    title: "Receipt + Confirmation",
    body: "You'll get a Stripe receipt immediately. The lawyer received your questionnaire and any documents you uploaded — they'll come to the consultation prepared.",
  },
  {
    icon: ScaleIcon,
    title: "On the Call",
    body: "Plan for 30 focused minutes. The lawyer will answer your questions and outline next steps. If further legal work is needed, that engagement is between you and the lawyer at their standard rates.",
  },
];

function firstParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function LegalConsultConfirmationPage({ searchParams }: PageProps) {
  const sessionId = firstParam(searchParams?.session_id);
  const refFromUrl = firstParam(searchParams?.ref);
  const isDev = firstParam(searchParams?.dev) === "1";

  let displayRef = refFromUrl;
  let amountPaid: string | null = null;
  let slotTime: string | null = null;
  let paid = false;

  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      displayRef = session.metadata?.orderRef || refFromUrl || displayRef;
      if (session.amount_total != null) {
        amountPaid = `$${(session.amount_total / 100).toFixed(2)} ${(session.currency ?? "cad").toUpperCase()}`;
      }
      slotTime = session.metadata?.calendlyStartTime || null;
    } catch (err) {
      console.error("[legal-consult-confirmation] failed to retrieve Stripe session:", err);
    }
  } else if (isDev) {
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
            {paid ? "Consultation Booked" : "Order Received"}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Your Consultation
            <br />
            Is Confirmed
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            The lawyer has your questionnaire and any documents you shared. We&rsquo;ll see you at the scheduled time.
          </p>
          {(displayRef || amountPaid || slotTime) && (
            <div className="mt-8 inline-block bg-white border border-gray-200 rounded-lg px-6 py-4 text-left">
              {displayRef && (
                <>
                  <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                    Order Reference
                  </p>
                  <p className="font-mono text-sm font-semibold text-navy-900">{displayRef}</p>
                </>
              )}
              {slotTime && (
                <p className="text-xs text-gray-500 mt-2">
                  Slot: <span className="font-medium text-gray-800">{formatSlotTime(slotTime)}</span>
                </p>
              )}
              {amountPaid && (
                <p className="text-xs text-gray-500 mt-1">
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
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-10">What Happens Next</h2>
          <div className="space-y-8">
            {nextSteps.map(({ icon: Icon, title, body }, idx) => (
              <div key={title} className="flex gap-5">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 bg-navy-50 flex items-center justify-center">
                    <Icon size={18} className="text-navy-900" />
                  </div>
                  {idx < nextSteps.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-3" />}
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
              <p className="font-serif text-base font-bold text-navy-900 mb-1">Need to reschedule?</p>
              <p className="text-sm text-gray-600">
                Use the link in your Calendly confirmation email, or contact{" "}
                <a className="text-navy-900 underline underline-offset-2" href="mailto:contact@korporex.ca">
                  contact@korporex.ca
                </a>
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
          <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
            Korporex is not a law firm. The consultation is provided by an independent licensed lawyer.
            No solicitor-client relationship is created with Korporex.
          </p>
        </div>
      </section>
    </>
  );
}

function formatSlotTime(s: string) {
  if (!s || s.startsWith("(")) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
