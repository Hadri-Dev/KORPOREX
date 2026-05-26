import { NextResponse } from "next/server";
import { z } from "zod";
import {
  nuansRequestSchema,
  type NuansReportSubmission,
  type NuansJurisdiction,
  type NuansIntendedUse,
} from "@/lib/nuansSchemas";
import { NUANS_SERVICES } from "@/lib/nuansServices";
import { getTaxRate } from "@/lib/pricing";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

type Pricing = { subtotal: number; taxRate: number; tax: number; total: number };

function computeNuansPricing(
  billingCountry: string,
  billingRegion: string
): Pricing {
  const subtotal = NUANS_SERVICES["nuans-report"].price;
  const taxRate = getTaxRate(billingCountry, billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, taxRate, tax, total };
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof nuansRequestSchema>;
  try {
    const body = await req.json();
    parsed = nuansRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const { payload } = parsed;
  const meta = NUANS_SERVICES["nuans-report"];

  const billing = payload.billingAddress;
  const billingName = payload.billingName;
  const pricing = computeNuansPricing(billing.country, billing.region);
  const orderRef = generateOrderRef();

  const customerEmail = payload.contact.contactEmail;
  const customerName = `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim();

  // 1. [PENDING PAYMENT] intake email
  await sendIntakeEmail({
    payload,
    pricing,
    orderRef,
    customerEmail,
    customerName,
  }).catch((err) => {
    console.error("[nuans-request-api] intake email failed:", err);
  });

  // 2. Stripe Checkout
  if (!stripe) {
    console.warn("[nuans-request-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
    const siteUrl = getSiteUrl();
    return NextResponse.json({
      url: `${siteUrl}/services/confirmation?ref=${orderRef}&dev=1&service=nuans-report`,
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
        product_data: { name: meta.longLabel, description: meta.tagline },
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${siteUrl}/services/confirmation?session_id={CHECKOUT_SESSION_ID}&ref=${orderRef}&service=nuans-report`,
      cancel_url: `${siteUrl}${meta.path}?cancelled=1&ref=${orderRef}`,
      metadata: {
        productType: "nuans",
        service: "nuans-report",
        orderRef,
        customerEmail,
        customerName,
        billingName,
        serviceLabel: meta.longLabel,
        jurisdiction: payload.jurisdiction,
        proposedName: payload.proposedName,
        intendedUse: payload.intendedUse,
      },
      payment_intent_data: {
        description: `Korporex - ${orderRef} - ${meta.longLabel}`,
        metadata: { orderRef, productType: "nuans", service: "nuans-report" },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[nuans-request-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      { error: `We couldn't start checkout. Please try again or email us at ${CONTACT_ADDRESS}.` },
      { status: 502 }
    );
  }
}

// ── Intake email ────────────────────────────────────────────────────────────

async function sendIntakeEmail(args: {
  payload: NuansReportSubmission;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
}): Promise<void> {
  const { pricing, orderRef, customerEmail, customerName } = args;
  const meta = NUANS_SERVICES["nuans-report"];
  const subject = `[PENDING] ${orderRef} — ${meta.longLabel} — $${pricing.total.toFixed(2)} CAD`;
  const html = buildHtmlBody(args);
  await sendMail(
    {
      subject,
      html,
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo: { email: customerEmail, name: customerName || customerEmail },
    },
    "nuans-request-api"
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

const JURISDICTION_LABEL: Record<NuansJurisdiction, string> = {
  federal: "Federal (CBCA)",
  ontario: "Ontario (OBCA)",
};

const INTENDED_USE_LABEL: Record<NuansIntendedUse, string> = {
  new_incorporation: "New incorporation",
  name_change: "Name change (existing corporation)",
  amalgamation: "Amalgamation",
  trademark_screening: "Trademark pre-screening",
  other: "Other",
};

function buildHtmlBody(args: {
  payload: NuansReportSubmission;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
}): string {
  const { payload, pricing, orderRef } = args;
  const meta = NUANS_SERVICES["nuans-report"];

  const orderRows = [
    row("Order reference", orderRef),
    row("Service", meta.longLabel),
    row("Jurisdiction", JURISDICTION_LABEL[payload.jurisdiction]),
    row("Intended use", INTENDED_USE_LABEL[payload.intendedUse]),
  ].join("");

  const nameRows = [
    row("Primary name", payload.proposedName),
    ...(payload.alternativeName1 ? [row("Alternative 1", payload.alternativeName1)] : []),
    ...(payload.alternativeName2 ? [row("Alternative 2", payload.alternativeName2)] : []),
  ].join("");

  const descBlock = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.6;color:#111827;">${escapeHtml(
    payload.businessDescription
  )}</div>`;

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
    row(meta.longLabel, `$${pricing.subtotal.toFixed(2)}`),
    row(taxLabel, `$${pricing.tax.toFixed(2)}`),
    row("Total (CAD)", `$${pricing.total.toFixed(2)}`),
  ].join("");

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> Run the NUANS search on the primary name only once the [PAID] email arrives. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New NUANS order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from the korporex.ca services page</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section(
    "Names to search",
    `<table style="width:100%;border-collapse:collapse;">${nameRows}</table>`
  )}${section("Business description", descBlock)}${section(
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
