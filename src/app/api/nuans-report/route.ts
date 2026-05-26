import { NextResponse } from "next/server";
import {
  nuansReportRequestSchema,
  type NuansReportRequest,
  NUANS_REPORT,
  getJurisdictionLabel,
} from "@/lib/nuansReport";
import { getTaxRate } from "@/lib/pricing";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

type Pricing = { subtotal: number; taxRate: number; tax: number; total: number };

function computePricing(billingCountry: string, billingRegion: string): Pricing {
  const subtotal = NUANS_REPORT.price;
  const taxRate = getTaxRate(billingCountry, billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, taxRate, tax, total };
}

export async function POST(req: Request) {
  let parsed: NuansReportRequest;
  try {
    const body = await req.json();
    parsed = nuansReportRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const billing = parsed.billingAddress;
  const pricing = computePricing(billing.country, billing.region);
  const orderRef = generateOrderRef();
  const customerEmail = parsed.contact.contactEmail;
  const customerName = `${parsed.contact.contactFirstName} ${parsed.contact.contactLastName}`.trim();

  // 1. [PENDING PAYMENT] intake email
  await sendIntakeEmail({ payload: parsed, pricing, orderRef, customerEmail, customerName }).catch(
    (err) => {
      console.error("[nuans-report-api] intake email failed:", err);
    }
  );

  // 2. Stripe Checkout
  if (!stripe) {
    console.warn("[nuans-report-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
    const siteUrl = getSiteUrl();
    return NextResponse.json({
      url: `${siteUrl}/nuans-report/confirmation?ref=${orderRef}&dev=1`,
      orderRef,
      dev: true,
    });
  }

  const siteUrl = getSiteUrl();
  const lineItems: Array<{
    price_data: { currency: string; product_data: { name: string; description?: string }; unit_amount: number };
    quantity: number;
  }> = [
    {
      price_data: {
        currency: "cad",
        product_data: {
          name: NUANS_REPORT.longLabel,
          description: `${parsed.rows.length} proposed ${parsed.rows.length === 1 ? "name" : "names"} searched and bundled into a single PDF report`,
        },
        unit_amount: Math.round(pricing.subtotal * 100),
      },
      quantity: 1,
    },
  ];
  if (pricing.tax > 0) {
    const taxPct = pricing.taxRate === 0.14975 ? "14.975" : (pricing.taxRate * 100).toFixed(0);
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: `Tax (${taxPct}%, ${billing.region})`,
          description: "GST/HST as applicable to billing province",
        },
        unit_amount: Math.round(pricing.tax * 100),
      },
      quantity: 1,
    });
  }

  // Stripe metadata is ~500 chars per value. Truncate the names summary so
  // it always fits, even for 10-row orders. The full list lives in the
  // [PENDING] intake email which the operator cross-references by orderRef.
  const namesSummary = parsed.rows
    .map((r) => `${r.proposedName} [${getJurisdictionLabel(r.jurisdiction)}]`)
    .join("; ");
  const namesSummaryTrunc =
    namesSummary.length > 450 ? namesSummary.slice(0, 447) + "..." : namesSummary;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${siteUrl}/nuans-report/confirmation?session_id={CHECKOUT_SESSION_ID}&ref=${orderRef}`,
      cancel_url: `${siteUrl}/nuans-report?cancelled=1&ref=${orderRef}`,
      metadata: {
        productType: "nuans",
        service: "nuans-report",
        orderRef,
        customerEmail,
        customerName,
        billingName: parsed.billingName,
        serviceLabel: NUANS_REPORT.longLabel,
        rowCount: String(parsed.rows.length),
        namesSummary: namesSummaryTrunc,
        primaryName: parsed.rows[0]?.proposedName ?? "",
        primaryJurisdiction: parsed.rows[0]?.jurisdiction ?? "",
      },
      payment_intent_data: {
        description: `Korporex - ${orderRef} - ${NUANS_REPORT.longLabel}`,
        metadata: { orderRef, productType: "nuans", service: "nuans-report" },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }
    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[nuans-report-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      { error: `We couldn't start checkout. Please try again or email us at ${CONTACT_ADDRESS}.` },
      { status: 502 }
    );
  }
}

// ── Intake email ────────────────────────────────────────────────────────────

async function sendIntakeEmail(args: {
  payload: NuansReportRequest;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
}): Promise<void> {
  const { pricing, orderRef, customerEmail, customerName } = args;
  const subject = `[PENDING] ${orderRef} — ${NUANS_REPORT.longLabel} (${args.payload.rows.length}) — $${pricing.total.toFixed(2)} CAD`;
  const html = buildHtmlBody(args);
  await sendMail(
    {
      subject,
      html,
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo: { email: customerEmail, name: customerName || customerEmail },
    },
    "nuans-report-api"
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAddress(a: { street: string; city: string; region: string; postalCode: string; country: string }) {
  return [a.street, a.city, a.region, a.postalCode, a.country].filter(Boolean).join(", ");
}

function row(k: string, v: string) {
  return `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
    k
  )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`;
}

function section(title: string, inner: string) {
  return `<div style="margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb;"><p style="margin:0 0 12px;color:#1B4332;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;">${escapeHtml(
    title
  )}</p>${inner}</div>`;
}

function buildHtmlBody(args: {
  payload: NuansReportRequest;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
}): string {
  const { payload, pricing, orderRef } = args;

  const orderRows = [
    row("Order reference", orderRef),
    row("Service", NUANS_REPORT.longLabel),
    row("Names submitted", String(payload.rows.length)),
  ].join("");

  const namesTable = payload.rows
    .map(
      (r, i) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#6b7280;vertical-align:top;white-space:nowrap;">#${
          i + 1
        }</td><td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827;"><strong>Proposed:</strong> ${escapeHtml(
          r.proposedName
        )}<br><strong>Distinctive:</strong> ${escapeHtml(
          r.distinctiveTerm
        )}<br><strong>Jurisdiction:</strong> ${escapeHtml(getJurisdictionLabel(r.jurisdiction))}</td></tr>`
    )
    .join("");
  const namesHtml = `<table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:6px;overflow:hidden;">${namesTable}</table>`;

  const contactRows = [
    row("Contact", `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim()),
    row("Contact email", payload.contact.contactEmail),
    row("Contact phone", payload.contact.contactPhone),
    ...(payload.contact.contactRole ? [row("Contact role", payload.contact.contactRole)] : []),
  ].join("");

  const billingRows = [
    row("Billing name", payload.billingName),
    row("Billing address", formatAddress(payload.billingAddress)),
  ].join("");

  const taxLabel =
    pricing.taxRate > 0
      ? `Tax (${(pricing.taxRate * 100).toFixed(pricing.taxRate === 0.14975 ? 3 : 0)}% — ${payload.billingAddress.region})`
      : "Tax";
  const pricingRows = [
    row(`${NUANS_REPORT.longLabel} (flat order fee)`, `$${pricing.subtotal.toFixed(2)}`),
    row(taxLabel, `$${pricing.tax.toFixed(2)}`),
    row("Total (CAD)", `$${pricing.total.toFixed(2)}`),
  ].join("");

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> Wait for the [PAID] email before running the NUANS searches. Once paid, run a NUANS search on each row's distinctive term against the registry indicated, then consolidate the results into a single PDF and email it to the customer. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:680px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New NUANS report order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from /nuans-report</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section(
    `Names to search (${payload.rows.length})`,
    namesHtml
  )}${section(
    "Contact",
    `<table style="width:100%;border-collapse:collapse;">${contactRows}</table>`
  )}${section(
    "Pricing",
    `<table style="width:100%;border-collapse:collapse;">${pricingRows}</table>`
  )}${section(
    "Billing",
    `<table style="width:100%;border-collapse:collapse;">${billingRows}</table>`
  )}${note}</div></body></html>`;
}
