import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { JURISDICTION_LABELS, PKG_LABELS, REG_OFFICE_ADDON, type Jurisdiction, type Pkg, type RegOfficeAddon } from "@/lib/pricing";
import { LEGAL_CONSULT_RECIPIENTS } from "@/lib/legalConsult";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";
// Webhooks must always run fresh — never cache.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripe) {
    console.warn("[stripe-webhook] received event but STRIPE_SECRET_KEY is not set");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — rejecting event");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // IMPORTANT: must use the raw text body for signature verification —
  // reading as JSON first would break the HMAC check.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutFailed(session);
        break;
      }
      default:
        // Ignore other event types — we don't subscribe to them, but Stripe
        // may still deliver some via the "All events" dashboard setting.
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error:", event.type, err);
    // Return 500 so Stripe retries with exponential backoff.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Only the paid path — ignore unpaid sessions that may fire this event.
  if (session.payment_status !== "paid") {
    console.log(
      "[stripe-webhook] checkout.session.completed with payment_status =",
      session.payment_status,
      "— skipping"
    );
    return;
  }

  const productType = session.metadata?.productType ?? "incorporation";
  if (productType === "legal-consult") {
    await handleLegalConsultPaid(session);
    return;
  }
  if (productType === "registration") {
    await handleRegistrationPaid(session);
    return;
  }
  if (productType === "amendment") {
    await handleAmendmentPaid(session);
    return;
  }
  if (productType === "compliance") {
    await handleCompliancePaid(session);
    return;
  }
  if (productType === "business-update") {
    await handleBusinessUpdatePaid(session);
    return;
  }
  if (productType === "nuans") {
    await handleNuansPaid(session);
    return;
  }

  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "cad").toUpperCase();
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.primaryDirectorEmail ||
    "(unknown)";
  const customerName =
    session.customer_details?.name ||
    session.metadata?.primaryDirectorName ||
    "(unknown)";
  const businessName = session.metadata?.businessName ?? "(unknown)";
  const corpNameType = session.metadata?.corpNameType ?? "";
  const jurisdiction = session.metadata?.jurisdiction ?? "(unknown)";
  const pkg = session.metadata?.pkg ?? "(unknown)";
  const regOfficeAddon = (session.metadata?.regOfficeAddon ?? "none") as RegOfficeAddon;
  const legalEnding = session.metadata?.legalEnding ?? "";
  const shareClassesRaw = session.metadata?.shareClasses ?? "";

  const jurisLabel = JURISDICTION_LABELS[jurisdiction as Jurisdiction] ?? jurisdiction;
  const pkgLabel = PKG_LABELS[pkg as Pkg] ?? pkg;
  const endingSuffix = legalEnding ? ` ${legalEnding}` : "";
  const displayName =
    corpNameType === "numbered"
      ? `Numbered ${jurisLabel}${endingSuffix}`
      : businessName && businessName !== "(numbered)"
        ? `${businessName}${endingSuffix}`
        : `Unnamed ${jurisLabel}${endingSuffix}`;

  const subject = `[PAID] ${orderRef} — ${displayName} — ${pkgLabel} — $${amountTotal} ${currency}`;
  const html = buildPaidBody({
    orderRef,
    amountTotal,
    currency,
    customerEmail,
    customerName,
    businessName: displayName,
    jurisdiction: jurisLabel,
    pkg: pkgLabel,
    legalEnding,
    regOfficeAddon,
    shareClassesRaw,
    sessionId: session.id,
    paymentIntent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "(none)",
  });

  await sendNotification(subject, html, customerEmail, customerName);
}

async function handleCheckoutFailed(session: Stripe.Checkout.Session) {
  const productType = session.metadata?.productType ?? "incorporation";
  if (productType === "legal-consult") {
    await handleLegalConsultFailed(session);
    return;
  }
  if (productType === "registration") {
    await handleRegistrationFailed(session);
    return;
  }
  if (productType === "amendment") {
    await handleAmendmentFailed(session);
    return;
  }
  if (productType === "compliance") {
    await handleComplianceFailed(session);
    return;
  }
  if (productType === "business-update") {
    await handleBusinessUpdateFailed(session);
    return;
  }
  if (productType === "nuans") {
    await handleNuansFailed(session);
    return;
  }

  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const businessName = session.metadata?.businessName ?? "(unknown)";
  const corpNameType = session.metadata?.corpNameType ?? "";
  const jurisdiction = session.metadata?.jurisdiction ?? "(unknown)";
  const pkg = session.metadata?.pkg ?? "(unknown)";
  const legalEnding = session.metadata?.legalEnding ?? "";
  const jurisLabel = JURISDICTION_LABELS[jurisdiction as Jurisdiction] ?? jurisdiction;
  const pkgLabel = PKG_LABELS[pkg as Pkg] ?? pkg;
  const endingSuffix = legalEnding ? ` ${legalEnding}` : "";
  const displayName =
    corpNameType === "numbered"
      ? `Numbered ${jurisLabel}${endingSuffix}`
      : businessName && businessName !== "(numbered)"
        ? `${businessName}${endingSuffix}`
        : `Unnamed ${jurisLabel}${endingSuffix}`;
  const subject = `[PAYMENT FAILED] ${orderRef} — ${displayName} — ${pkgLabel}`;
  const html = `<p>Async payment for order <strong>${escapeHtml(orderRef)}</strong> failed. Customer may retry from the confirmation page or a recovery email.</p><p>Stripe session: ${escapeHtml(session.id)}</p>`;
  await sendNotification(subject, html);
}

async function sendNotification(
  subject: string,
  htmlContent: string,
  replyToEmail?: string,
  replyToName?: string
): Promise<void> {
  await sendMail(
    {
      subject,
      html: htmlContent,
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo: replyToEmail
        ? { email: replyToEmail, name: replyToName || replyToEmail }
        : undefined,
    },
    "stripe-webhook"
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

function buildPaidBody(d: {
  orderRef: string;
  amountTotal: string;
  currency: string;
  customerEmail: string;
  customerName: string;
  businessName: string;
  jurisdiction: string;
  pkg: string;
  legalEnding: string;
  regOfficeAddon: RegOfficeAddon;
  shareClassesRaw: string;
  sessionId: string;
  paymentIntent: string;
}) {
  const regOfficeRow: [string, string] | null =
    d.regOfficeAddon === "korporex"
      ? [
          "Registered office add-on",
          `${REG_OFFICE_ADDON.label} — ${REG_OFFICE_ADDON.locationLabel} (12 months, non-refundable)`,
        ]
      : null;
  const legalEndingRow: [string, string] | null = d.legalEnding
    ? ["Legal ending", d.legalEnding]
    : null;
  // Standard-package share-class codes are stored comma-separated in Stripe
  // metadata. Translate the A/B/C codes back to human labels for the email.
  const SHARE_CLASS_LABELS: Record<string, string> = {
    A: "Class A Common (voting)",
    B: "Class B Common (non-voting)",
    C: "Class C Preferred",
    D: "Class D Special",
    E: "Class E Redeemable Preferred",
  };
  const shareClassesRow: [string, string] | null = d.shareClassesRaw
    ? [
        "Share structure",
        d.shareClassesRaw
          .split(",")
          .map((c) => SHARE_CLASS_LABELS[c.trim()] ?? c.trim())
          .filter(Boolean)
          .join("; "),
      ]
    : null;

  const rows = ([
    ["Order reference", d.orderRef],
    ["Customer", `${d.customerName} <${d.customerEmail}>`],
    ["Corporation", d.businessName],
    ["Jurisdiction", d.jurisdiction],
    ["Package", d.pkg],
    ...(legalEndingRow ? [legalEndingRow] : []),
    ...(shareClassesRow ? [shareClassesRow] : []),
    ...(regOfficeRow ? [regOfficeRow] : []),
    ["Amount paid", `$${d.amountTotal} ${d.currency}`],
    ["Stripe session", d.sessionId],
    ["Payment intent", d.paymentIntent],
  ] as Array<[string, string]>)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">Payment received — ${escapeHtml(
    d.orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Stripe <code>checkout.session.completed</code></p><table style="width:100%;border-collapse:collapse;">${rows}</table><p style="margin:24px 0 0;padding:12px 16px;background:#d1fae5;border-left:3px solid #059669;color:#065f46;font-size:13px;line-height:1.6;">Cross-reference with the earlier <strong>[PENDING]</strong> email for this order reference to view the full submission (directors, shareholders, addresses). Customer receives their Stripe receipt automatically; no customer-facing email is sent from this webhook.</p></div></body></html>`;
}

// ─── Legal-consult product type ─────────────────────────────────────────────

async function handleLegalConsultPaid(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "cad").toUpperCase();
  const customerName = session.metadata?.customerName ?? "(unknown)";
  const customerEmail = session.metadata?.customerEmail ?? session.customer_details?.email ?? "(unknown)";
  const customerPhone = session.metadata?.customerPhone ?? "(not provided)";
  const calendlyStartTime = session.metadata?.calendlyStartTime ?? "(not provided)";
  const calendlyEventUri = session.metadata?.calendlyEventUri ?? "";
  const isUrgent = session.metadata?.isUrgent === "yes";

  const subject = `[PAID] Legal consult — ${orderRef} — ${customerName} — $${amountTotal} ${currency}`;
  const rows: Array<[string, string]> = [
    ["Order reference", orderRef],
    ["Customer", `${customerName} <${customerEmail}>`],
    ["Phone", customerPhone],
    ["Booked slot", calendlyStartTime],
    ["Calendly event", calendlyEventUri || "(not recorded)"],
    ["Urgent matter?", isUrgent ? "Yes" : "No"],
    ["Amount paid", `$${amountTotal} ${currency}`],
    ["Stripe session", session.id],
  ];
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">Consultation payment received — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Stripe <code>checkout.session.completed</code></p><table style="width:100%;border-collapse:collapse;">${rowHtml}</table><p style="margin:24px 0 0;padding:12px 16px;background:#d1fae5;border-left:3px solid #059669;color:#065f46;font-size:13px;line-height:1.6;">Cross-reference with the earlier <strong>[PENDING]</strong> email for this order reference to see the full questionnaire and any uploaded documents. The customer's Calendly confirmation will arrive separately.</p></div></body></html>`;

  await sendNotificationToMany(
    LEGAL_CONSULT_RECIPIENTS.map((r) => ({ email: r.email, name: r.name })),
    subject,
    html,
    customerEmail !== "(unknown)" ? customerEmail : undefined,
    customerName !== "(unknown)" ? customerName : undefined
  );
}

async function handleLegalConsultFailed(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const customerName = session.metadata?.customerName ?? "(unknown)";
  const subject = `[PAYMENT FAILED] Legal consult — ${orderRef} — ${customerName}`;
  const html = `<p>Async payment for legal-consult order <strong>${escapeHtml(
    orderRef
  )}</strong> failed. Calendly slot was already reserved at <strong>${escapeHtml(
    session.metadata?.calendlyStartTime ?? "unknown"
  )}</strong> — consider whether to release it.</p><p>Stripe session: ${escapeHtml(session.id)}</p>`;
  await sendNotificationToMany(
    LEGAL_CONSULT_RECIPIENTS.map((r) => ({ email: r.email, name: r.name })),
    subject,
    html
  );
}

async function sendNotificationToMany(
  to: Array<{ email: string; name?: string }>,
  subject: string,
  htmlContent: string,
  replyToEmail?: string,
  replyToName?: string
): Promise<void> {
  await sendMail(
    {
      subject,
      html: htmlContent,
      to,
      replyTo: replyToEmail
        ? { email: replyToEmail, name: replyToName || replyToEmail }
        : undefined,
    },
    "stripe-webhook"
  );
}

// ─── Registration product type ──────────────────────────────────────────────

async function handleRegistrationPaid(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const service = session.metadata?.service ?? "(unknown)";
  const serviceLabel = session.metadata?.serviceLabel ?? service;
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "cad").toUpperCase();
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.customerEmail ||
    "(unknown)";
  const customerName =
    session.customer_details?.name ||
    session.metadata?.customerName ||
    "(unknown)";

  const subject = `[PAID] ${orderRef} — ${serviceLabel} — $${amountTotal} ${currency}`;
  const rows: Array<[string, string]> = [
    ["Order reference", orderRef],
    ["Service", serviceLabel],
    ["Customer", `${customerName} <${customerEmail}>`],
    ["Amount paid", `$${amountTotal} ${currency}`],
    ["Stripe session", session.id],
    [
      "Payment intent",
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "(none)",
    ],
  ];
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">Registration payment received — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Stripe <code>checkout.session.completed</code></p><table style="width:100%;border-collapse:collapse;">${rowHtml}</table><p style="margin:24px 0 0;padding:12px 16px;background:#d1fae5;border-left:3px solid #059669;color:#065f46;font-size:13px;line-height:1.6;">Cross-reference with the earlier <strong>[PENDING]</strong> email for this order reference to see the full submission. Customer receives their Stripe receipt automatically; no customer-facing email is sent from this webhook.</p></div></body></html>`;

  await sendNotification(subject, html, customerEmail, customerName);
}

async function handleRegistrationFailed(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const serviceLabel = session.metadata?.serviceLabel ?? "Registration";
  const subject = `[PAYMENT FAILED] ${orderRef} — ${serviceLabel}`;
  const html = `<p>Async payment for registration order <strong>${escapeHtml(
    orderRef
  )}</strong> failed. Customer may retry from the confirmation page or a recovery email.</p><p>Stripe session: ${escapeHtml(
    session.id
  )}</p>`;
  await sendNotification(subject, html);
}

// ─── Amendment product type ─────────────────────────────────────────────────

async function handleAmendmentPaid(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const service = session.metadata?.service ?? "(unknown)";
  const serviceLabel = session.metadata?.serviceLabel ?? service;
  const corpName = session.metadata?.corpName ?? "";
  const corpNumber = session.metadata?.corpNumber ?? "";
  const jurisdictionRaw = session.metadata?.jurisdiction ?? "";
  const jurisdictionLabel =
    jurisdictionRaw === "federal"
      ? "Federal (CBCA)"
      : jurisdictionRaw === "ontario"
        ? "Ontario (OBCA)"
        : jurisdictionRaw || "(unknown)";
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "cad").toUpperCase();
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.customerEmail ||
    "(unknown)";
  const customerName =
    session.customer_details?.name || session.metadata?.customerName || "(unknown)";

  const subject = `[PAID] ${orderRef} — ${serviceLabel}${corpName ? ` — ${corpName}` : ""} — $${amountTotal} ${currency}`;
  const rows: Array<[string, string]> = [
    ["Order reference", orderRef],
    ["Service", serviceLabel],
    ["Jurisdiction", jurisdictionLabel],
    ...(corpName ? ([["Corporation", corpName]] as Array<[string, string]>) : []),
    ...(corpNumber ? ([["Corporation number", corpNumber]] as Array<[string, string]>) : []),
    ["Customer", `${customerName} <${customerEmail}>`],
    ["Amount paid", `$${amountTotal} ${currency}`],
    ["Stripe session", session.id],
    [
      "Payment intent",
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "(none)",
    ],
  ];
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">Amendment payment received — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Stripe <code>checkout.session.completed</code></p><table style="width:100%;border-collapse:collapse;">${rowHtml}</table><p style="margin:24px 0 0;padding:12px 16px;background:#d1fae5;border-left:3px solid #059669;color:#065f46;font-size:13px;line-height:1.6;">Cross-reference with the earlier <strong>[PENDING]</strong> email for this order reference to see the full submission (the per-change details, addresses, special-resolution date, etc.). Customer receives their Stripe receipt automatically; no customer-facing email is sent from this webhook.</p></div></body></html>`;

  await sendNotification(subject, html, customerEmail, customerName);
}

async function handleAmendmentFailed(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const serviceLabel = session.metadata?.serviceLabel ?? "Amendment";
  const subject = `[PAYMENT FAILED] ${orderRef} — ${serviceLabel}`;
  const html = `<p>Async payment for amendment order <strong>${escapeHtml(
    orderRef
  )}</strong> failed. Customer may retry from the confirmation page or a recovery email.</p><p>Stripe session: ${escapeHtml(
    session.id
  )}</p>`;
  await sendNotification(subject, html);
}

// ─── Compliance product type ────────────────────────────────────────────────

async function handleCompliancePaid(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const service = session.metadata?.service ?? "(unknown)";
  const serviceLabel = session.metadata?.serviceLabel ?? service;
  const corpName = session.metadata?.corpName ?? "";
  const corpNumber = session.metadata?.corpNumber ?? "";
  const jurisdictionRaw = session.metadata?.jurisdiction ?? "";
  const jurisdictionLabel =
    jurisdictionRaw === "federal"
      ? "Federal (CBCA)"
      : jurisdictionRaw === "ontario"
        ? "Ontario (OBCA)"
        : jurisdictionRaw || "(unknown)";
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "cad").toUpperCase();
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.customerEmail ||
    "(unknown)";
  const customerName =
    session.customer_details?.name || session.metadata?.customerName || "(unknown)";

  const subject = `[PAID] ${orderRef} — ${serviceLabel}${corpName ? ` — ${corpName}` : ""} — $${amountTotal} ${currency}`;
  const rows: Array<[string, string]> = [
    ["Order reference", orderRef],
    ["Service", serviceLabel],
    ["Jurisdiction", jurisdictionLabel],
    ...(corpName ? ([["Corporation", corpName]] as Array<[string, string]>) : []),
    ...(corpNumber ? ([["Corporation number", corpNumber]] as Array<[string, string]>) : []),
    ["Customer", `${customerName} <${customerEmail}>`],
    ["Amount paid", `$${amountTotal} ${currency}`],
    ["Stripe session", session.id],
    [
      "Payment intent",
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "(none)",
    ],
  ];
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">Compliance payment received — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Stripe <code>checkout.session.completed</code></p><table style="width:100%;border-collapse:collapse;">${rowHtml}</table><p style="margin:24px 0 0;padding:12px 16px;background:#d1fae5;border-left:3px solid #059669;color:#065f46;font-size:13px;line-height:1.6;">Cross-reference with the earlier <strong>[PENDING]</strong> email for this order reference to see the full submission (director slate, addresses, anniversary/fiscal dates, etc.). Customer receives their Stripe receipt automatically; no customer-facing email is sent from this webhook.</p></div></body></html>`;

  await sendNotification(subject, html, customerEmail, customerName);
}

async function handleComplianceFailed(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const serviceLabel = session.metadata?.serviceLabel ?? "Compliance filing";
  const subject = `[PAYMENT FAILED] ${orderRef} — ${serviceLabel}`;
  const html = `<p>Async payment for compliance order <strong>${escapeHtml(
    orderRef
  )}</strong> failed. Customer may retry from the confirmation page or a recovery email.</p><p>Stripe session: ${escapeHtml(
    session.id
  )}</p>`;
  await sendNotification(subject, html);
}

// ─── Business-update product type ───────────────────────────────────────────

async function handleBusinessUpdatePaid(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const service = session.metadata?.service ?? "(unknown)";
  const serviceLabel = session.metadata?.serviceLabel ?? service;
  const corpName = session.metadata?.corpName ?? "";
  const corpNumber = session.metadata?.corpNumber ?? "";
  const jurisdictionRaw = session.metadata?.jurisdiction ?? "";
  // Amalgamation / continuance pass a non-simple jurisdiction string ("federal",
  // "ontario", or "from → to" for continuance). Pretty-print only the simple cases.
  const jurisdictionLabel =
    jurisdictionRaw === "federal"
      ? "Federal (CBCA)"
      : jurisdictionRaw === "ontario"
        ? "Ontario (OBCA)"
        : jurisdictionRaw || "(unknown)";
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "cad").toUpperCase();
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.customerEmail ||
    "(unknown)";
  const customerName =
    session.customer_details?.name || session.metadata?.customerName || "(unknown)";

  const subject = `[PAID] ${orderRef} — ${serviceLabel}${corpName ? ` — ${corpName}` : ""} — $${amountTotal} ${currency}`;
  const rows: Array<[string, string]> = [
    ["Order reference", orderRef],
    ["Service", serviceLabel],
    ["Jurisdiction", jurisdictionLabel],
    ...(corpName ? ([["Corporation", corpName]] as Array<[string, string]>) : []),
    ...(corpNumber ? ([["Corporation number", corpNumber]] as Array<[string, string]>) : []),
    ["Customer", `${customerName} <${customerEmail}>`],
    ["Amount paid", `$${amountTotal} ${currency}`],
    ["Stripe session", session.id],
    [
      "Payment intent",
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "(none)",
    ],
  ];
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">Business-update payment received — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Stripe <code>checkout.session.completed</code></p><table style="width:100%;border-collapse:collapse;">${rowHtml}</table><p style="margin:24px 0 0;padding:12px 16px;background:#d1fae5;border-left:3px solid #059669;color:#065f46;font-size:13px;line-height:1.6;">Cross-reference with the earlier <strong>[PENDING]</strong> email for this order reference to see the full submission (dissolution / revival / amalgamation / continuance details). Customer receives their Stripe receipt automatically; no customer-facing email is sent from this webhook.</p></div></body></html>`;

  await sendNotification(subject, html, customerEmail, customerName);
}

async function handleBusinessUpdateFailed(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const serviceLabel = session.metadata?.serviceLabel ?? "Business update";
  const subject = `[PAYMENT FAILED] ${orderRef} — ${serviceLabel}`;
  const html = `<p>Async payment for business-update order <strong>${escapeHtml(
    orderRef
  )}</strong> failed. Customer may retry from the confirmation page or a recovery email.</p><p>Stripe session: ${escapeHtml(
    session.id
  )}</p>`;
  await sendNotification(subject, html);
}

// ─── NUANS report product type ──────────────────────────────────────────────

async function handleNuansPaid(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const serviceLabel = session.metadata?.serviceLabel ?? "NUANS Report";
  const proposedName = session.metadata?.proposedName ?? "";
  const jurisdictionRaw = session.metadata?.jurisdiction ?? "";
  const jurisdictionLabel =
    jurisdictionRaw === "federal"
      ? "Federal (CBCA)"
      : jurisdictionRaw === "ontario"
        ? "Ontario (OBCA)"
        : jurisdictionRaw || "(unknown)";
  const intendedUse = session.metadata?.intendedUse ?? "(unknown)";
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const currency = (session.currency ?? "cad").toUpperCase();
  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.customerEmail ||
    "(unknown)";
  const customerName =
    session.customer_details?.name || session.metadata?.customerName || "(unknown)";

  const subject = `[PAID] ${orderRef} — ${serviceLabel}${proposedName ? ` — ${proposedName}` : ""} — $${amountTotal} ${currency}`;
  const rows: Array<[string, string]> = [
    ["Order reference", orderRef],
    ["Service", serviceLabel],
    ["Jurisdiction", jurisdictionLabel],
    ...(proposedName ? ([["Primary name", proposedName]] as Array<[string, string]>) : []),
    ["Intended use", intendedUse],
    ["Customer", `${customerName} <${customerEmail}>`],
    ["Amount paid", `$${amountTotal} ${currency}`],
    ["Stripe session", session.id],
    [
      "Payment intent",
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "(none)",
    ],
  ];
  const rowHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">NUANS payment received — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Stripe <code>checkout.session.completed</code></p><table style="width:100%;border-collapse:collapse;">${rowHtml}</table><p style="margin:24px 0 0;padding:12px 16px;background:#d1fae5;border-left:3px solid #059669;color:#065f46;font-size:13px;line-height:1.6;">Cross-reference with the earlier <strong>[PENDING]</strong> email for this order reference to see the alternative names and business description. Run the NUANS search on the primary name and email the PDF report to the customer. Customer receives their Stripe receipt automatically.</p></div></body></html>`;

  await sendNotification(subject, html, customerEmail, customerName);
}

async function handleNuansFailed(session: Stripe.Checkout.Session) {
  const orderRef = session.metadata?.orderRef ?? "(no ref)";
  const serviceLabel = session.metadata?.serviceLabel ?? "NUANS Report";
  const subject = `[PAYMENT FAILED] ${orderRef} — ${serviceLabel}`;
  const html = `<p>Async payment for NUANS order <strong>${escapeHtml(
    orderRef
  )}</strong> failed. No search has been run yet. Customer may retry from the confirmation page or a recovery email.</p><p>Stripe session: ${escapeHtml(
    session.id
  )}</p>`;
  await sendNotification(subject, html);
}
