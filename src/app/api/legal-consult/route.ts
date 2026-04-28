import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import {
  legalConsultSchema,
  LEGAL_CONSULT_RECIPIENTS,
  LEGAL_CONSULT_MAX_FILES,
  LEGAL_CONSULT_MAX_FILE_BYTES,
  LEGAL_CONSULT_ACCEPTED_MIMES,
  type LegalConsultInput,
} from "@/lib/legalConsult";
import { LEGAL_CONSULT_TAX_RATE, getLegalConsultPricing } from "@/lib/pricing";

export const runtime = "nodejs";

const CONTACT_ADDRESS = "contact@korporex.ca";

type EmailAttachment = { name: string; content: string };

export async function POST(req: Request) {
  // The form posts multipart/form-data so we can carry optional file uploads
  // alongside the questionnaire fields. JSON would have forced a separate
  // upload step or base64-in-JSON which is awkward.
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Reconstruct the structured payload from FormData. Booleans / arrays come
  // through as strings — coerce here before Zod-validating.
  let payload: LegalConsultInput;
  try {
    const topics = form.getAll("topics").map(String);
    const raw = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      incorpStatus: String(form.get("incorpStatus") ?? ""),
      existingCorpName: String(form.get("existingCorpName") ?? ""),
      existingJurisdiction: String(form.get("existingJurisdiction") ?? ""),
      incorpThroughKorporex: String(form.get("incorpThroughKorporex") ?? "false") === "true",
      topics,
      description: String(form.get("description") ?? ""),
      isUrgent: String(form.get("isUrgent") ?? "false") === "true",
      willShareDocuments: String(form.get("willShareDocuments") ?? "false") === "true",
      additionalNotes: String(form.get("additionalNotes") ?? ""),
      calendlyEventUri: String(form.get("calendlyEventUri") ?? ""),
      calendlyInviteeUri: String(form.get("calendlyInviteeUri") ?? ""),
      calendlyStartTime: String(form.get("calendlyStartTime") ?? ""),
    };
    payload = legalConsultSchema.parse(raw);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof z.ZodError ? "Some required fields are missing or invalid." : "Invalid submission." },
      { status: 400 }
    );
  }

  // Collect uploaded files. Cap count + total size + per-file MIME so an
  // oversized upload doesn't trip Brevo's 10 MB email-size limit downstream.
  const fileEntries = form.getAll("documents").filter((x): x is File => x instanceof File && x.size > 0);
  if (fileEntries.length > LEGAL_CONSULT_MAX_FILES) {
    return NextResponse.json(
      { error: `Too many files — limit is ${LEGAL_CONSULT_MAX_FILES}.` },
      { status: 400 }
    );
  }
  let totalBytes = 0;
  for (const f of fileEntries) {
    totalBytes += f.size;
    if (totalBytes > LEGAL_CONSULT_MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `Total upload exceeds ${LEGAL_CONSULT_MAX_FILE_BYTES / 1024 / 1024} MB.` },
        { status: 400 }
      );
    }
    if (!(LEGAL_CONSULT_ACCEPTED_MIMES as readonly string[]).includes(f.type)) {
      return NextResponse.json(
        { error: `File ${f.name}: unsupported type. Allowed: PDF, JPG, PNG.` },
        { status: 400 }
      );
    }
  }

  const attachments: EmailAttachment[] = [];
  for (const f of fileEntries) {
    const buf = Buffer.from(await f.arrayBuffer());
    attachments.push({ name: f.name, content: buf.toString("base64") });
  }

  const orderRef = generateOrderRef();
  const pricing = getLegalConsultPricing();

  // Send the [PENDING] intake email to BOTH Korporex and the trusted-network
  // lawyer immediately, so the lawyer has the questionnaire + uploaded
  // documents in hand even if payment is delayed. Failure here must NOT
  // block checkout — payment is the critical path; email is observability.
  await sendIntakeEmail(payload, pricing, orderRef, attachments).catch((err) => {
    console.error("[legal-consult-api] intake email failed:", err);
  });

  // Stripe Checkout. Dev fallback when no key is set sends the customer
  // straight to the confirmation page so local end-to-end testing works.
  if (!stripe) {
    console.warn("[legal-consult-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
    const siteUrl = getSiteUrl();
    return NextResponse.json({
      url: `${siteUrl}/legal-consultation/confirmation?ref=${orderRef}&dev=1`,
      orderRef,
      dev: true,
    });
  }

  const siteUrl = getSiteUrl();
  const taxPct = (LEGAL_CONSULT_TAX_RATE * 100).toFixed(0);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: payload.email,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Legal consultation — 30 minutes",
              description: `Independent lawyer from Korporex's referral network. Booked slot: ${payload.calendlyStartTime}.`,
            },
            unit_amount: Math.round(pricing.fee * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `HST (${taxPct}%)`,
              description: "Ontario HST on legal consultation",
            },
            unit_amount: Math.round(pricing.tax * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/legal-consultation/confirmation?session_id={CHECKOUT_SESSION_ID}&ref=${orderRef}`,
      cancel_url: `${siteUrl}/legal-consultation?cancelled=1&ref=${orderRef}`,
      metadata: {
        orderRef,
        productType: "legal-consult",
        customerName: payload.fullName,
        customerEmail: payload.email,
        customerPhone: payload.phone,
        calendlyStartTime: payload.calendlyStartTime,
        calendlyEventUri: payload.calendlyEventUri,
        isUrgent: payload.isUrgent ? "yes" : "no",
      },
      payment_intent_data: {
        description: `Korporex — Legal consult — ${orderRef}`,
        metadata: { orderRef, productType: "legal-consult" },
      },
    });

    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[legal-consult-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't start checkout. Please try again or email us at " + CONTACT_ADDRESS + ".",
      },
      { status: 502 }
    );
  }
}

// ─── Intake email (PENDING PAYMENT) ──────────────────────────────────────────

async function sendIntakeEmail(
  payload: LegalConsultInput,
  pricing: ReturnType<typeof getLegalConsultPricing>,
  orderRef: string,
  attachments: EmailAttachment[]
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[legal-consult-api] BREVO_API_KEY not set — intake logged, not emailed");
    console.log("[legal-consult-api] intake:", { orderRef, pricing, ...payload, attachmentCount: attachments.length });
    return;
  }

  const subject = `[PENDING] Legal consult — ${orderRef} — ${payload.fullName} — $${pricing.total.toFixed(2)} CAD`;
  const html = buildHtmlBody(payload, pricing, orderRef, attachments.map((a) => a.name));

  const body: Record<string, unknown> = {
    sender: { email: CONTACT_ADDRESS, name: "Korporex" },
    to: LEGAL_CONSULT_RECIPIENTS.map((r) => ({ email: r.email, name: r.name })),
    replyTo: { email: payload.email, name: payload.fullName },
    subject,
    htmlContent: html,
  };
  if (attachments.length) body.attachment = attachments;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo ${res.status}: ${detail}`);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function buildHtmlBody(
  d: LegalConsultInput,
  p: ReturnType<typeof getLegalConsultPricing>,
  orderRef: string,
  attachmentFilenames: string[]
) {
  const customerRows = [
    row("Full name", d.fullName),
    row("Email", d.email),
    row("Phone", d.phone),
  ].join("");

  const contextRows = [
    row("Incorporation status", d.incorpStatus),
    d.existingCorpName ? row("Existing corp name", d.existingCorpName) : "",
    d.existingJurisdiction ? row("Existing jurisdiction", d.existingJurisdiction) : "",
    row("Korporex client?", d.incorpThroughKorporex ? "Yes" : "No"),
    row("Urgent matter?", d.isUrgent ? "Yes" : "No"),
  ]
    .filter(Boolean)
    .join("");

  const topicsList = d.topics
    .map((t) => `<li style="margin:4px 0;color:#111827;font-size:14px;">${escapeHtml(t)}</li>`)
    .join("");

  const calendlyRows = [
    row("Slot start time", d.calendlyStartTime),
    row("Calendly event", d.calendlyEventUri),
    row("Calendly invitee", d.calendlyInviteeUri),
  ].join("");

  const pricingRows = [
    row("Consultation (30 min)", `$${p.fee.toFixed(2)}`),
    row(`HST (${(LEGAL_CONSULT_TAX_RATE * 100).toFixed(0)}%)`, `$${p.tax.toFixed(2)}`),
    row("Total (CAD)", `$${p.total.toFixed(2)}`),
  ].join("");

  const docsBlock = attachmentFilenames.length
    ? `<ul style="margin:0;padding-left:20px;">${attachmentFilenames
        .map((n) => `<li style="margin:4px 0;color:#111827;font-size:14px;">${escapeHtml(n)} (attached)</li>`)
        .join("")}</ul>`
    : `<p style="margin:0;color:#6b7280;font-size:14px;">No documents uploaded with the questionnaire.${
        d.willShareDocuments ? " Customer indicated they will share documents — follow up after the call." : ""
      }</p>`;

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> Customer has booked the Calendly slot above and been redirected to Stripe Checkout. A second email will follow once payment completes. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout — consider whether to release the Calendly slot.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">Legal consultation booking — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from korporex.com /legal-consultation</p>${section(
    "Customer",
    `<table style="width:100%;border-collapse:collapse;">${customerRows}</table>`
  )}${section(
    "Context",
    `<table style="width:100%;border-collapse:collapse;">${contextRows}</table>`
  )}${section(
    "Topics",
    `<ul style="margin:0;padding-left:20px;">${topicsList}</ul>`
  )}${section(
    "Description",
    `<p style="margin:0;color:#111827;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(d.description)}</p>`
  )}${
    d.additionalNotes
      ? section(
          "Additional notes",
          `<p style="margin:0;color:#111827;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(d.additionalNotes)}</p>`
        )
      : ""
  }${section(
    "Documents",
    docsBlock
  )}${section(
    "Booked slot",
    `<table style="width:100%;border-collapse:collapse;">${calendlyRows}</table>`
  )}${section(
    "Pricing",
    `<table style="width:100%;border-collapse:collapse;">${pricingRows}</table>`
  )}${note}</div></body></html>`;
}

