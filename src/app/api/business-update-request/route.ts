import { NextResponse } from "next/server";
import { z } from "zod";
import {
  businessUpdateRequestSchema,
  type DissolutionSubmission,
  type RevivalSubmission,
  type AmalgamationSubmission,
  type ContinuanceSubmission,
} from "@/lib/businessUpdateSchemas";
import {
  BUSINESS_UPDATE_SERVICES,
  type BusinessUpdateServiceSlug,
} from "@/lib/businessUpdateServices";
import { getTaxRate } from "@/lib/pricing";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

type Pricing = { subtotal: number; taxRate: number; tax: number; total: number };

type BusinessUpdatePayload =
  | DissolutionSubmission
  | RevivalSubmission
  | AmalgamationSubmission
  | ContinuanceSubmission;

function computeBusinessUpdatePricing(
  service: BusinessUpdateServiceSlug,
  billingCountry: string,
  billingRegion: string
): Pricing {
  const subtotal = BUSINESS_UPDATE_SERVICES[service].price;
  const taxRate = getTaxRate(billingCountry, billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, taxRate, tax, total };
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof businessUpdateRequestSchema>;
  try {
    const body = await req.json();
    parsed = businessUpdateRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const { service, payload } = parsed;
  const meta = BUSINESS_UPDATE_SERVICES[service];

  const billing = payload.billingAddress;
  const billingName = payload.billingName;
  const pricing = computeBusinessUpdatePricing(service, billing.country, billing.region);
  const orderRef = generateOrderRef();

  const customerEmail = payload.contact.contactEmail;
  const customerName = `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim();
  const summary = extractSummary(service, payload);

  // 1. [PENDING PAYMENT] intake email
  await sendIntakeEmail({
    service,
    serviceLabel: meta.longLabel,
    payload,
    pricing,
    orderRef,
    customerEmail,
    customerName,
    summary,
  }).catch((err) => {
    console.error("[business-update-request-api] intake email failed:", err);
  });

  // 2. Stripe Checkout
  if (!stripe) {
    console.warn("[business-update-request-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
    const siteUrl = getSiteUrl();
    return NextResponse.json({
      url: `${siteUrl}/services/confirmation?ref=${orderRef}&dev=1&service=${service}`,
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
      success_url: `${siteUrl}/services/confirmation?session_id={CHECKOUT_SESSION_ID}&ref=${orderRef}&service=${service}`,
      cancel_url: `${siteUrl}${meta.path}?cancelled=1&ref=${orderRef}`,
      metadata: {
        productType: "business-update",
        service,
        orderRef,
        customerEmail,
        customerName,
        billingName,
        serviceLabel: meta.longLabel,
        jurisdiction: summary.jurisdiction,
        corpName: summary.corpName,
        corpNumber: summary.corpNumber,
      },
      payment_intent_data: {
        description: `Korporex - ${orderRef} - ${meta.longLabel}`,
        metadata: { orderRef, productType: "business-update", service },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[business-update-request-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      { error: `We couldn't start checkout. Please try again or email us at ${CONTACT_ADDRESS}.` },
      { status: 502 }
    );
  }
}

// ── Summary extraction (per-service) ────────────────────────────────────────
// Each service stores corporation identifiers under a different field shape;
// this normalizes them into a single { jurisdiction, corpName, corpNumber }
// triple for Stripe metadata + email subject lines.

type Summary = { jurisdiction: string; corpName: string; corpNumber: string };

function extractSummary(
  service: BusinessUpdateServiceSlug,
  payload: BusinessUpdatePayload
): Summary {
  switch (service) {
    case "dissolve-business":
    case "revive-business": {
      const p = payload as DissolutionSubmission | RevivalSubmission;
      return {
        jurisdiction: p.corporation.jurisdiction,
        corpName: p.corporation.corpName,
        corpNumber: p.corporation.corpNumber,
      };
    }
    case "amalgamation": {
      const p = payload as AmalgamationSubmission;
      return {
        jurisdiction: p.newJurisdiction,
        corpName:
          p.newCorpNameType === "named"
            ? `${p.newCorpName ?? ""} ${p.newLegalEnding ?? ""}`.trim()
            : "(numbered, assigned at filing)",
        corpNumber: `Amalgamating ${p.predecessors.length} corporations`,
      };
    }
    case "continuance": {
      const p = payload as ContinuanceSubmission;
      return {
        jurisdiction: `${p.currentJurisdiction} → ${p.destinationJurisdiction}`,
        corpName: p.currentCorpName,
        corpNumber: p.currentCorpNumber,
      };
    }
  }
}

// ── Intake email ────────────────────────────────────────────────────────────

async function sendIntakeEmail(args: {
  service: BusinessUpdateServiceSlug;
  serviceLabel: string;
  payload: BusinessUpdatePayload;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
  summary: Summary;
}): Promise<void> {
  const { serviceLabel, pricing, orderRef, customerEmail, customerName } = args;
  const subject = `[PENDING] ${orderRef} — ${serviceLabel} — $${pricing.total.toFixed(2)} CAD`;
  const html = buildHtmlBody(args);
  await sendMail(
    {
      subject,
      html,
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo: { email: customerEmail, name: customerName || customerEmail },
    },
    "business-update-request-api"
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

const JURISDICTION_LABEL: Record<string, string> = {
  federal: "Federal (CBCA)",
  ontario: "Ontario (OBCA)",
  bc: "British Columbia",
  alberta: "Alberta",
  quebec: "Quebec",
  other: "Other",
};

const DISSOLUTION_PATH_LABEL: Record<string, string> = {
  never_commenced: "Never commenced business / no shareholders",
  no_property_no_liabilities: "No property and no liabilities",
  wound_up_with_assets: "Wound up after distributing assets",
};

const DEBT_LABEL: Record<string, string> = {
  no_debts: "No outstanding debts",
  all_debts_paid: "All debts have been paid",
  creditors_consent: "All creditors have consented to dissolution",
};

const ASSET_LABEL: Record<string, string> = {
  no_property: "No remaining property",
  distributed_to_shareholders: "All remaining property distributed to shareholders",
};

const REVIVAL_REASON_LABEL: Record<string, string> = {
  voluntary: "Originally dissolved voluntarily",
  default_failure_to_file: "Dissolved by the registrar for failure to file",
  court_order: "Dissolved by court order",
  other: "Other",
};

const REQUESTOR_LABEL: Record<string, string> = {
  former_director: "Former director",
  former_shareholder: "Former shareholder",
  creditor: "Creditor",
  court_order: "Court order",
  other: "Other",
};

const AMALGAMATION_TYPE_LABEL: Record<string, string> = {
  long_form: "Long-form (separate corporations, amalgamation agreement + special resolutions)",
  short_form_vertical: "Short-form vertical (parent + wholly-owned subsidiary)",
  short_form_horizontal: "Short-form horizontal (wholly-owned sister corporations)",
};

function personCard(p: {
  firstName: string;
  lastName: string;
  position?: string | undefined;
  email?: string | undefined;
  canadianResident?: boolean | undefined;
  electedDate?: string | undefined;
  appointedDate?: string | undefined;
  address: { street: string; city: string; region: string; postalCode: string; country: string };
}): string {
  const lines: string[] = [];
  lines.push(`<strong>Name:</strong> ${escapeHtml(`${p.firstName} ${p.lastName}`)}`);
  if (p.position) lines.push(`<strong>Position:</strong> ${escapeHtml(p.position)}`);
  if (p.email) lines.push(`<strong>Email:</strong> ${escapeHtml(p.email)}`);
  if (typeof p.canadianResident === "boolean")
    lines.push(`<strong>Canadian resident:</strong> ${p.canadianResident ? "Yes" : "No"}`);
  if (p.electedDate) lines.push(`<strong>Elected:</strong> ${escapeHtml(p.electedDate)}`);
  if (p.appointedDate) lines.push(`<strong>Appointed:</strong> ${escapeHtml(p.appointedDate)}`);
  lines.push(`<strong>Address:</strong> ${escapeHtml(formatAddress(p.address))}`);
  return `<div style="margin-bottom:8px;padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;">${lines.join(
    "<br>"
  )}</div>`;
}

function buildHtmlBody(args: {
  service: BusinessUpdateServiceSlug;
  serviceLabel: string;
  payload: BusinessUpdatePayload;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
  summary: Summary;
}): string {
  const { service, serviceLabel, payload, pricing, orderRef, summary } = args;

  const orderRows = [
    row("Order reference", orderRef),
    row("Service", serviceLabel),
    row("Jurisdiction", JURISDICTION_LABEL[summary.jurisdiction] ?? summary.jurisdiction),
    row("Corporation", summary.corpName),
    row("Corporation number", summary.corpNumber),
  ].join("");

  const detailHtml = serviceDetailHtml(service, payload);

  const contactRows = [
    row(
      "Contact",
      `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim()
    ),
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
    row(serviceLabel, `$${pricing.subtotal.toFixed(2)}`),
    row(taxLabel, `$${pricing.tax.toFixed(2)}`),
    row("Total (CAD)", `$${pricing.total.toFixed(2)}`),
  ].join("");

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> A second email will follow from the Stripe webhook once payment completes. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New business-update order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from the korporex.ca services page</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section("Filing details", detailHtml)}${section(
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

function serviceDetailHtml(
  service: BusinessUpdateServiceSlug,
  payload: BusinessUpdatePayload
): string {
  switch (service) {
    case "dissolve-business": {
      const p = payload as DissolutionSubmission;
      const rows = [
        row("Dissolution pathway", DISSOLUTION_PATH_LABEL[p.dissolutionPath] ?? p.dissolutionPath),
        row("Cessation date", p.cessationDate),
        row("Debts statement", DEBT_LABEL[p.debtsStatement] ?? p.debtsStatement),
        row("Assets statement", ASSET_LABEL[p.assetsStatement] ?? p.assetsStatement),
        row("Special resolution passed", p.specialResolutionPassed ? "Yes" : "No"),
        ...(p.specialResolutionDate ? [row("Special resolution date", p.specialResolutionDate)] : []),
        row("Effective date", p.effectiveDate),
        row("Final tax / GST / payroll returns filed", p.finalReturnsFiled ? "Yes" : "No"),
      ].join("");
      const notes = p.notes
        ? `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;white-space:pre-wrap;"><strong>Notes:</strong><br>${escapeHtml(p.notes)}</div>`
        : "";
      return `<table style="width:100%;border-collapse:collapse;">${rows}</table>${notes}`;
    }
    case "revive-business": {
      const p = payload as RevivalSubmission;
      const rows = [
        row("Dissolution date", p.dissolutionDate),
        row(
          "Reason for original dissolution",
          (REVIVAL_REASON_LABEL[p.dissolutionReason] ?? p.dissolutionReason) +
            (p.dissolutionReason === "other" && p.dissolutionReasonOther ? ` — ${p.dissolutionReasonOther}` : "")
        ),
        ...(p.dissolutionReason === "default_failure_to_file"
          ? [
              row(
                "Outstanding filings brought current",
                p.outstandingFilingsBroughtCurrent ? "Yes" : "No"
              ),
            ]
          : []),
        row(
          "Requestor relationship",
          (REQUESTOR_LABEL[p.requestorRelationship] ?? p.requestorRelationship) +
            (p.requestorRelationship === "other" && p.requestorRelationshipOther
              ? ` — ${p.requestorRelationshipOther}`
              : "")
        ),
        row("Effective date", p.effectiveDate),
      ].join("");
      const office = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;"><strong>Registered office (post-revival):</strong><br>${escapeHtml(
        formatAddress(p.revivedRegisteredOffice)
      )}</div>`;
      const reason = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;white-space:pre-wrap;"><strong>Reason for revival:</strong><br>${escapeHtml(p.reasonForRevival)}</div>`;
      const directors = `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Current directors (${p.directors.length})</p>${p.directors.map(personCard).join("")}`;
      const officers = `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Current officers (${p.officers.length})</p>${p.officers.map(personCard).join("")}`;
      return `<table style="width:100%;border-collapse:collapse;">${rows}</table>${office}${reason}${directors}${officers}`;
    }
    case "amalgamation": {
      const p = payload as AmalgamationSubmission;
      const newName =
        p.newCorpNameType === "named"
          ? `${p.newCorpName ?? ""} ${p.newLegalEnding ?? ""}`.trim()
          : "(numbered, assigned by registrar at filing)";
      const rows = [
        row("Amalgamation type", AMALGAMATION_TYPE_LABEL[p.amalgamationType] ?? p.amalgamationType),
        row("New corporation name", newName),
        row("Agreement / resolution date", p.agreementDate),
        ...(p.specialResolutionsDate
          ? [row("Predecessor special resolutions date", p.specialResolutionsDate)]
          : []),
        row("Effective date", p.effectiveDate),
      ].join("");
      const predecessors = `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Amalgamating corporations (${p.predecessors.length})</p>${p.predecessors
        .map(
          (c, i) =>
            `<div style="margin-bottom:8px;padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;"><strong>Corp ${
              i + 1
            }:</strong> ${escapeHtml(c.corpName)}<br><strong>Number:</strong> ${escapeHtml(
              c.corpNumber
            )}${c.businessNumber ? `<br><strong>BN:</strong> ${escapeHtml(c.businessNumber)}` : ""}</div>`
        )
        .join("")}`;
      const office = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;"><strong>Registered office (amalgamated corp):</strong><br>${escapeHtml(
        formatAddress(p.registeredOffice)
      )}</div>`;
      const shares = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;white-space:pre-wrap;"><strong>Share structure (notes):</strong><br>${escapeHtml(p.shareStructureNotes)}</div>`;
      const directors = `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Directors of amalgamated corp (${p.directors.length})</p>${p.directors.map(personCard).join("")}`;
      const notes = p.notes
        ? `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;white-space:pre-wrap;"><strong>Notes:</strong><br>${escapeHtml(p.notes)}</div>`
        : "";
      return `<table style="width:100%;border-collapse:collapse;">${rows}</table>${predecessors}${office}${shares}${directors}${notes}`;
    }
    case "continuance": {
      const p = payload as ContinuanceSubmission;
      const fromLabel =
        p.currentJurisdiction === "other"
          ? `Other — ${p.currentJurisdictionOther}`
          : JURISDICTION_LABEL[p.currentJurisdiction] ?? p.currentJurisdiction;
      const toLabel =
        p.destinationJurisdiction === "other"
          ? `Other — ${p.destinationJurisdictionOther}`
          : JURISDICTION_LABEL[p.destinationJurisdiction] ?? p.destinationJurisdiction;
      const newName = p.nameChanging
        ? `${p.newCorpName ?? ""} ${p.newLegalEnding ?? ""}`.trim()
        : "(name unchanged)";
      const rows = [
        row("Korporex coordinates", p.direction === "into" ? "Continuance INTO Federal / Ontario" : "Continuance OUT OF Federal / Ontario"),
        row("From (current)", `${fromLabel} — ${p.currentCorpName} (${p.currentCorpNumber})`),
        row("To (destination)", toLabel),
        row("Name changing on continuance?", p.nameChanging ? "Yes" : "No"),
        row("New corporate name", newName),
        row("Special resolution passed", p.specialResolutionPassed ? "Yes" : "No"),
        row("Special resolution date", p.specialResolutionDate),
        row("Effective date", p.effectiveDate),
      ].join("");
      const reason = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;white-space:pre-wrap;"><strong>Reason for continuance:</strong><br>${escapeHtml(p.reasonForContinuance)}</div>`;
      const office = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;"><strong>New registered office (destination):</strong><br>${escapeHtml(
        formatAddress(p.newRegisteredOffice)
      )}</div>`;
      const directors = `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Directors of continued corp (${p.directors.length})</p>${p.directors.map(personCard).join("")}`;
      return `<table style="width:100%;border-collapse:collapse;">${rows}</table>${reason}${office}${directors}`;
    }
  }
}
