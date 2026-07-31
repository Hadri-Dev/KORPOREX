import { NextResponse } from "next/server";
import { z } from "zod";
import {
  changeNameRequestSchema,
  computeChangeNamePricing,
  MINUTE_BOOK_ADDON_FEE,
  NUANS_INCLUDED_COUNT,
  type ChangeNameSubmission,
  type ChangeNamePricing,
} from "@/lib/changeNameSchema";
import { JURISDICTION_LABELS, type Jurisdiction } from "@/lib/pricing";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

const SERVICE = "change-name";
const SERVICE_PATH = "/services/change-name";

function serviceLabelFor(jurisdiction: Jurisdiction): string {
  return `Change of Business Name (${JURISDICTION_LABELS[jurisdiction]})`;
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof changeNameRequestSchema>;
  try {
    const body = await req.json();
    parsed = changeNameRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const payload = parsed.payload;
  const jurisdiction = payload.corporation.jurisdiction;
  const billing = payload.billingAddress;

  // Price is re-derived server-side from the jurisdiction + add-on flag — never
  // trusted from the client.
  const pricing = computeChangeNamePricing({
    jurisdiction,
    updateMinuteBook: payload.updateMinuteBook,
    billingCountry: billing.country,
    billingRegion: billing.region,
  });

  const orderRef = generateOrderRef();
  const serviceLabel = serviceLabelFor(jurisdiction);
  const customerEmail = payload.contact.contactEmail;
  const customerName = `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim();

  // 1. [PENDING PAYMENT] intake email to the operator.
  await sendIntakeEmail({ payload, pricing, orderRef, serviceLabel }).catch((err) => {
    console.error("[change-name-request-api] intake email failed:", err);
  });

  // 2. Stripe Checkout.
  if (!stripe) {
    console.warn("[change-name-request-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
    const siteUrl = getSiteUrl();
    return NextResponse.json({
      url: `${siteUrl}/services/confirmation?ref=${orderRef}&dev=1&service=${SERVICE}`,
      orderRef,
      dev: true,
    });
  }

  const siteUrl = getSiteUrl();
  const newName = `${payload.newCorpName} ${payload.newLegalEnding}`.trim();

  const lineItems: Array<{
    price_data: { currency: string; product_data: { name: string; description?: string }; unit_amount: number };
    quantity: number;
  }> = [
    {
      price_data: {
        currency: "cad",
        product_data: {
          name: serviceLabel,
          description: "Articles of Amendment (name change). Government filing fee and one NUANS name search included.",
        },
        unit_amount: Math.round(pricing.base * 100),
      },
      quantity: 1,
    },
  ];
  if (pricing.minuteBookFee > 0) {
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: "Minute book update",
          description: "Directors' & shareholders' resolutions + minute book updated to the new name.",
        },
        unit_amount: Math.round(pricing.minuteBookFee * 100),
      },
      quantity: 1,
    });
  }
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
      success_url: `${siteUrl}/services/confirmation?session_id={CHECKOUT_SESSION_ID}&ref=${orderRef}&service=${SERVICE}`,
      cancel_url: `${siteUrl}${SERVICE_PATH}?cancelled=1&ref=${orderRef}`,
      // productType "amendment" so the existing stripe-webhook [PAID] handler
      // (handleAmendmentPaid) recognises it with no webhook changes — it reads
      // only these generic metadata fields.
      metadata: {
        productType: "amendment",
        service: SERVICE,
        orderRef,
        customerEmail,
        customerName,
        billingName: payload.billingName,
        serviceLabel,
        jurisdiction,
        corpName: payload.corporation.corpName,
        corpNumber: payload.corporation.corpNumber,
        newName,
        updateMinuteBook: payload.updateMinuteBook ? "yes" : "no",
      },
      payment_intent_data: {
        description: `Korporex - ${orderRef} - ${serviceLabel}`,
        metadata: { orderRef, productType: "amendment", service: SERVICE },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[change-name-request-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      { error: `We couldn't start checkout. Please try again or email us at ${CONTACT_ADDRESS}.` },
      { status: 502 }
    );
  }
}

// ── Intake email (PENDING PAYMENT) ───────────────────────────────────────────

async function sendIntakeEmail(args: {
  payload: ChangeNameSubmission;
  pricing: ChangeNamePricing;
  orderRef: string;
  serviceLabel: string;
}): Promise<void> {
  const { payload, pricing, orderRef, serviceLabel } = args;
  const subject = `[PENDING] ${orderRef} — ${serviceLabel} — $${pricing.total.toFixed(2)} CAD`;
  const html = buildHtmlBody(args);
  await sendMail(
    {
      subject,
      html,
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo: {
        email: payload.contact.contactEmail,
        name:
          `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim() ||
          payload.contact.contactEmail,
      },
    },
    "change-name-request-api"
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
  payload: ChangeNameSubmission;
  pricing: ChangeNamePricing;
  orderRef: string;
  serviceLabel: string;
}): string {
  const { payload, pricing, orderRef, serviceLabel } = args;
  const jurisdiction = payload.corporation.jurisdiction;
  const jurisdictionLabel = jurisdiction === "federal" ? "Federal (CBCA)" : "Ontario (OBCA)";
  const newName = `${payload.newCorpName} ${payload.newLegalEnding}`.trim();

  const orderRows = [
    row("Order reference", orderRef),
    row("Service", serviceLabel),
    row("Jurisdiction", jurisdictionLabel),
  ].join("");

  const corporationRows = [
    row("Current legal name", payload.corporation.corpName),
    row("Corporation number", payload.corporation.corpNumber),
    row("Company key", payload.companyKey),
    ...(payload.corporation.businessNumber
      ? [row("Business number (CRA)", payload.corporation.businessNumber)]
      : []),
  ].join("");

  const filingRows = [
    row("New corporate name", newName),
    row("Effective date", payload.effectiveDate),
    row("Special resolution passed", payload.specialResolutionPassed ? "Yes" : "No"),
    row("Special resolution date", payload.specialResolutionDate),
    row("NUANS searches included", String(NUANS_INCLUDED_COUNT)),
    row("Update minute book", payload.updateMinuteBook ? `Yes (+$${MINUTE_BOOK_ADDON_FEE.toFixed(2)})` : "No"),
  ].join("");

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
    row(serviceLabel, `$${pricing.base.toFixed(2)}`),
    ...(pricing.minuteBookFee > 0 ? [row("Minute book update", `$${pricing.minuteBookFee.toFixed(2)}`)] : []),
    row(taxLabel, `$${pricing.tax.toFixed(2)}`),
    row("Total (CAD)", `$${pricing.total.toFixed(2)}`),
  ].join("");

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> This order was captured at Review submit. A second email will follow from the Stripe webhook once payment completes. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout. The flat price includes the government filing fee and one NUANS search.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New name-change order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from the korporex.ca services page</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section(
    "Corporation",
    `<table style="width:100%;border-collapse:collapse;">${corporationRows}</table>`
  )}${section(
    "Filing details",
    `<table style="width:100%;border-collapse:collapse;">${filingRows}</table>`
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
