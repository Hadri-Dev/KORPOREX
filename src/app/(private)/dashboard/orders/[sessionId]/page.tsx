import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getOrderDetail,
} from "@/lib/dashboardData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const detail = await getOrderDetail(sessionId);

  if (!detail.configured) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
          Stripe is not configured.
        </div>
      </div>
    );
  }
  if (!detail.session) notFound();

  const session = detail.session;
  const md = session.metadata ?? {};
  const cd = session.customer_details;
  const stripeUrl = `https://dashboard.stripe.com/${session.livemode ? "" : "test/"}checkout/sessions/${session.id}`;

  return (
    <div className="space-y-6">
      <BackLink />

      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {detail.source === "incorporate"
              ? "Incorporation order"
              : detail.source === "legal-consult"
                ? "Legal consultation"
                : "Order"}
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-navy-900">
            {md.orderRef ?? session.id.slice(-12)}
          </h1>
          <p className="mt-1 text-sm text-gray-600">{formatDate(session.created)}</p>
        </div>
        <a
          href={stripeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Open in Stripe
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Status">
            <Field
              label="Payment"
              value={
                <span
                  className={
                    session.payment_status === "paid"
                      ? "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                      : "inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                  }
                >
                  {session.payment_status}
                </span>
              }
            />
            <Field label="Session" value={session.status ?? "open"} />
            <Field
              label="Mode"
              value={session.livemode ? "Live" : "Test"}
            />
            {detail.paymentIntent ? (
              <Field
                label="Payment intent"
                value={
                  <code className="text-xs text-gray-700">{detail.paymentIntent.id}</code>
                }
              />
            ) : null}
          </Section>

          <Section title="Line items">
            {detail.lineItems.length === 0 ? (
              <p className="text-sm text-gray-500">No line items returned.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {detail.lineItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium text-navy-900">
                        {item.description ?? "Item"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity ?? 1}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-navy-900">
                      {formatCurrency(item.amount_total, session.currency ?? "cad")}
                    </p>
                  </li>
                ))}
                <li className="flex items-center justify-between border-t-2 border-gray-300 pt-3">
                  <p className="text-sm font-semibold text-gray-900">Total</p>
                  <p className="text-sm font-semibold text-navy-900">
                    {formatCurrency(session.amount_total ?? 0, session.currency ?? "cad")}
                  </p>
                </li>
              </ul>
            )}
          </Section>

          <Section title="Submission metadata">
            {Object.keys(md).length === 0 ? (
              <p className="text-sm text-gray-500">No metadata.</p>
            ) : (
              <dl className="grid gap-3 sm:grid-cols-2">
                {Object.entries(md).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {key}
                    </dt>
                    <dd className="mt-0.5 break-all text-sm text-gray-900">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Customer">
            <Field
              label="Name"
              value={md.billingName ?? cd?.name ?? md.primaryDirectorName ?? "—"}
            />
            <Field
              label="Email"
              value={
                cd?.email ?? session.customer_email ?? md.primaryDirectorEmail ?? "—"
              }
            />
            {cd?.phone ? <Field label="Phone" value={cd.phone} /> : null}
            {cd?.address ? (
              <Field
                label="Billing address"
                value={
                  <div className="whitespace-pre-line text-sm text-gray-900">
                    {[
                      cd.address.line1,
                      cd.address.line2,
                      [cd.address.city, cd.address.state, cd.address.postal_code]
                        .filter(Boolean)
                        .join(", "),
                      cd.address.country,
                    ]
                      .filter(Boolean)
                      .join("\n")}
                  </div>
                }
              />
            ) : null}
          </Section>

          <Section title="Order">
            <Field label="Jurisdiction" value={md.jurisdiction ?? "—"} />
            <Field label="Package" value={md.pkg ?? "—"} />
            <Field label="Business name" value={md.businessName ?? "—"} />
            {md.legalEnding ? (
              <Field label="Legal ending" value={md.legalEnding} />
            ) : null}
            {md.regOfficeAddon === "true" || md.regOfficeAddon === "yes" ? (
              <Field label="Registered office" value="Add-on selected" />
            ) : null}
          </Section>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/dashboard/orders"
      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-navy-900"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to orders
    </Link>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-navy-900">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="col-span-2 text-sm text-gray-900">{value}</dd>
    </div>
  );
}
