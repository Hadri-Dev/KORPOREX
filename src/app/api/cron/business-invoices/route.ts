import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  listBusinessAccounts,
  listOpenOrdersForAccount,
  markOrdersInvoiced,
} from "@/lib/businessAccounts";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Monthly billing run for business (credit) accounts, triggered by the
// Vercel cron in vercel.json (same CRON_SECRET + Authorization: Bearer
// convention as /api/cron/office-renewals — Vercel always calls crons via
// GET). For every account with open (unbilled) orders, creates one Stripe
// invoice covering all of them, finalizes it (which triggers the
// auto-charge, since the invoice is collection_method:
// charge_automatically), and marks those orders 'invoiced'. invoice.paid /
// invoice.payment_failed (stripe-webhook) later flip them to 'paid' or flag
// the account 'past_due'.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const accounts = await listBusinessAccounts();
  const results: Array<{ companyName: string; invoiced: number; invoiceId?: string; error?: string }> = [];

  for (const account of accounts) {
    const orders = await listOpenOrdersForAccount(account.id).catch(() => []);
    if (orders.length === 0) continue;

    if (!account.stripeCustomerId) {
      results.push({ companyName: account.companyName, invoiced: 0, error: "No Stripe customer on file" });
      continue;
    }

    try {
      for (const order of orders) {
        await stripe.invoiceItems.create({
          customer: account.stripeCustomerId,
          amount: order.amountCents,
          currency: order.currency,
          description: `${order.orderRef} — ${order.description ?? order.productType}`,
        });
      }

      const invoice = await stripe.invoices.create({
        customer: account.stripeCustomerId,
        collection_method: "charge_automatically",
        auto_advance: true,
        metadata: { businessAccountId: account.id },
      });
      const finalized = await stripe.invoices.finalizeInvoice(invoice.id!);

      await markOrdersInvoiced(
        orders.map((o) => o.id),
        finalized.id!,
      );

      results.push({ companyName: account.companyName, invoiced: orders.length, invoiceId: finalized.id! });
    } catch (err) {
      console.error("[cron/business-invoices] failed for account:", account.id, err);
      results.push({
        companyName: account.companyName,
        invoiced: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  if (results.length > 0) {
    await sendMail(
      {
        subject: `[Business Invoices] Monthly run — ${results.length} account(s) billed`,
        html: `<pre>${results
          .map(
            (r) =>
              `${r.companyName}: ${r.error ? `ERROR — ${r.error}` : `${r.invoiced} order(s) invoiced (${r.invoiceId})`}`,
          )
          .join("\n")}</pre>`,
        to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      },
      "cron-business-invoices",
    ).catch(() => {});
  }

  return NextResponse.json({ ok: true, results });
}
