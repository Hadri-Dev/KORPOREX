import { NextResponse } from "next/server";
import { z } from "zod";
import {
  amendmentRequestSchema,
  type ChangeDirectorSubmission,
  type ChangeShareholderSubmission,
  type ChangeAddressSubmission,
  type ArticlesAmendmentSubmission,
  type AmendmentJurisdiction,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES, type AmendmentServiceSlug } from "@/lib/amendmentServices";
import { getTaxRate } from "@/lib/pricing";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

type Pricing = { subtotal: number; taxRate: number; tax: number; total: number };

function computeAmendmentPricing(
  service: AmendmentServiceSlug,
  billingCountry: string,
  billingRegion: string
): Pricing {
  const subtotal = AMENDMENT_SERVICES[service].price;
  const taxRate = getTaxRate(billingCountry, billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, taxRate, tax, total };
}

type AmendmentPayload =
  | ChangeDirectorSubmission
  | ChangeShareholderSubmission
  | ChangeAddressSubmission
  | ArticlesAmendmentSubmission;

export async function POST(req: Request) {
  let parsed: z.infer<typeof amendmentRequestSchema>;
  try {
    const body = await req.json();
    parsed = amendmentRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const { service, payload } = parsed;
  const meta = AMENDMENT_SERVICES[service];

  // Every amendment payload merges contactSchema + billingSchema, so these
  // fields are present on all variants. The discriminated union hides them
  // from TypeScript on the merged type, so we narrow here.
  const billing = payload.billingAddress;
  const billingName = payload.billingName;
  const pricing = computeAmendmentPricing(service, billing.country, billing.region);
  const orderRef = generateOrderRef();

  const customerEmail = payload.contact.contactEmail;
  const customerName = `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim();
  const jurisdiction = getJurisdiction(service, payload);

  // 1. [PENDING PAYMENT] intake email
  await sendIntakeEmail({
    service,
    serviceLabel: meta.longLabel,
    payload,
    pricing,
    orderRef,
    customerEmail,
    customerName,
    jurisdiction,
  }).catch((err) => {
    console.error("[amendment-request-api] intake email failed:", err);
  });

  // 2. Stripe Checkout
  if (!stripe) {
    console.warn("[amendment-request-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
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
        productType: "amendment",
        service,
        orderRef,
        customerEmail,
        customerName,
        billingName,
        serviceLabel: meta.longLabel,
        jurisdiction: jurisdiction ?? "",
        corpName: getCorpName(service, payload),
        corpNumber: getCorpNumber(service, payload),
      },
      payment_intent_data: {
        description: `Korporex - ${orderRef} - ${meta.longLabel}`,
        metadata: { orderRef, productType: "amendment", service },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[amendment-request-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      { error: `We couldn't start checkout. Please try again or email us at ${CONTACT_ADDRESS}.` },
      { status: 502 }
    );
  }
}

// ── Narrow helpers ──────────────────────────────────────────────────────────

function getJurisdiction(
  service: AmendmentServiceSlug,
  payload: AmendmentPayload
): AmendmentJurisdiction {
  // All four payload variants carry the corporation block.
  switch (service) {
    case "change-director":
      return (payload as ChangeDirectorSubmission).corporation.jurisdiction;
    case "change-shareholder":
      return (payload as ChangeShareholderSubmission).corporation.jurisdiction;
    case "change-address":
      return (payload as ChangeAddressSubmission).corporation.jurisdiction;
    case "articles-amendment":
      return (payload as ArticlesAmendmentSubmission).corporation.jurisdiction;
  }
}

function getCorpName(service: AmendmentServiceSlug, payload: AmendmentPayload): string {
  switch (service) {
    case "change-director":
      return (payload as ChangeDirectorSubmission).corporation.corpName;
    case "change-shareholder":
      return (payload as ChangeShareholderSubmission).corporation.corpName;
    case "change-address":
      return (payload as ChangeAddressSubmission).corporation.corpName;
    case "articles-amendment":
      return (payload as ArticlesAmendmentSubmission).corporation.corpName;
  }
}

function getCorpNumber(service: AmendmentServiceSlug, payload: AmendmentPayload): string {
  switch (service) {
    case "change-director":
      return (payload as ChangeDirectorSubmission).corporation.corpNumber;
    case "change-shareholder":
      return (payload as ChangeShareholderSubmission).corporation.corpNumber;
    case "change-address":
      return (payload as ChangeAddressSubmission).corporation.corpNumber;
    case "articles-amendment":
      return (payload as ArticlesAmendmentSubmission).corporation.corpNumber;
  }
}

// ── Intake email (PENDING PAYMENT) ──────────────────────────────────────────

async function sendIntakeEmail(args: {
  service: AmendmentServiceSlug;
  serviceLabel: string;
  payload: AmendmentPayload;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
  jurisdiction: AmendmentJurisdiction;
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
    "amendment-request-api"
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

const JURISDICTION_LABEL: Record<AmendmentJurisdiction, string> = {
  federal: "Federal (CBCA)",
  ontario: "Ontario (OBCA)",
};

function buildHtmlBody(args: {
  service: AmendmentServiceSlug;
  serviceLabel: string;
  payload: AmendmentPayload;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
  jurisdiction: AmendmentJurisdiction;
}): string {
  const { service, serviceLabel, payload, pricing, orderRef, jurisdiction } = args;

  const orderRows = [
    row("Order reference", orderRef),
    row("Service", serviceLabel),
    row("Jurisdiction", JURISDICTION_LABEL[jurisdiction]),
  ].join("");

  const corporationRows = corporationDetailRows(service, payload);
  const detailRows = serviceDetailRows(service, payload);

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

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> This order was captured at Review submit. A second email will follow from the Stripe webhook once payment completes. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New amendment order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from the korporex.ca services page</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section(
    "Corporation",
    `<table style="width:100%;border-collapse:collapse;">${corporationRows}</table>`
  )}${section(
    "Filing details",
    detailRows
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

function corporationDetailRows(
  service: AmendmentServiceSlug,
  payload: AmendmentPayload
): string {
  const corp = (
    payload as
      | ChangeDirectorSubmission
      | ChangeShareholderSubmission
      | ChangeAddressSubmission
      | ArticlesAmendmentSubmission
  ).corporation;
  void service;
  const rows = [
    row("Corporation name", corp.corpName),
    row("Corporation number", corp.corpNumber),
    ...(corp.businessNumber ? [row("Business number (CRA)", corp.businessNumber)] : []),
  ];
  return rows.join("");
}

const CHANGE_KIND_LABEL: Record<string, string> = {
  add: "Add (new appointment)",
  remove: "Remove (resignation / ceasing)",
  update: "Update (existing person — address / role / etc.)",
};

const ROLE_LABEL: Record<string, string> = {
  director: "Director",
  officer: "Officer",
  director_and_officer: "Director and Officer",
};

const SHAREHOLDER_CHANGE_LABEL: Record<string, string> = {
  issuance: "New issuance",
  transfer: "Transfer between parties",
  redemption: "Redemption by the corporation",
  cancellation: "Cancellation",
};

const PARTY_TYPE_LABEL: Record<string, string> = {
  individual: "Individual",
  corporation: "Corporation",
};

const AMENDMENT_CHANGE_LABEL: Record<string, string> = {
  corporate_name: "Corporate name",
  share_structure: "Share structure (authorized classes)",
  share_provisions: "Rights / restrictions attached to shares",
  number_of_directors: "Minimum / maximum number of directors",
  business_restrictions: "Restrictions on the business the corporation may carry on",
  other_provisions: "Other provisions in the Articles",
};

function partySummary(p: {
  partyType: "individual" | "corporation";
  firstName?: string | undefined;
  lastName?: string | undefined;
  corpName?: string | undefined;
  corpNumber?: string | undefined;
  email?: string | undefined;
  address: { street: string; city: string; region: string; postalCode: string; country: string };
}): string {
  const lines: string[] = [];
  lines.push(`<strong>Type:</strong> ${escapeHtml(PARTY_TYPE_LABEL[p.partyType])}`);
  if (p.partyType === "individual") {
    lines.push(`<strong>Name:</strong> ${escapeHtml(`${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "—")}`);
  } else {
    lines.push(`<strong>Corp name:</strong> ${escapeHtml(p.corpName ?? "—")}`);
    if (p.corpNumber) lines.push(`<strong>Corp #:</strong> ${escapeHtml(p.corpNumber)}`);
  }
  if (p.email) lines.push(`<strong>Email:</strong> ${escapeHtml(p.email)}`);
  lines.push(`<strong>Address:</strong> ${escapeHtml(formatAddress(p.address))}`);
  return `<div style="padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;">${lines.join(
    "<br>"
  )}</div>`;
}

function serviceDetailRows(service: AmendmentServiceSlug, payload: AmendmentPayload): string {
  switch (service) {
    case "change-director": {
      const p = payload as ChangeDirectorSubmission;
      const cards = p.changes
        .map((c, i) => {
          const lines: string[] = [];
          lines.push(`<strong>Change ${i + 1}:</strong> ${escapeHtml(CHANGE_KIND_LABEL[c.changeKind])}`);
          lines.push(`<strong>Role:</strong> ${escapeHtml(ROLE_LABEL[c.role])}`);
          lines.push(`<strong>Name:</strong> ${escapeHtml(`${c.firstName} ${c.lastName}`)}`);
          if (c.officerPosition)
            lines.push(`<strong>Officer position:</strong> ${escapeHtml(c.officerPosition)}`);
          if (c.email) lines.push(`<strong>Email:</strong> ${escapeHtml(c.email)}`);
          lines.push(`<strong>Address:</strong> ${escapeHtml(formatAddress(c.address))}`);
          if (typeof c.canadianResident === "boolean")
            lines.push(
              `<strong>Canadian resident (CBCA s.105(3)):</strong> ${c.canadianResident ? "Yes" : "No"}`
            );
          lines.push(`<strong>Effective date:</strong> ${escapeHtml(c.effectiveDate)}`);
          if (c.notes) lines.push(`<strong>Notes:</strong> ${escapeHtml(c.notes)}`);
          return `<div style="margin-bottom:10px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;">${lines.join(
            "<br>"
          )}</div>`;
        })
        .join("");
      return cards;
    }
    case "change-shareholder": {
      const p = payload as ChangeShareholderSubmission;
      const bits: string[] = [];
      bits.push(
        `<table style="width:100%;border-collapse:collapse;">${[
          row("Change type", SHAREHOLDER_CHANGE_LABEL[p.changeType]),
          row("Share class", p.shareClass),
          row("Number of shares", String(p.numberOfShares)),
          ...(p.consideration ? [row("Consideration / price", p.consideration)] : []),
          row("Effective date", p.effectiveDate),
        ].join("")}</table>`
      );
      if (p.fromParty) {
        bits.push(
          `<div style="margin-top:12px;"><p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">From (transferor / redeemed shareholder)</p>${partySummary(
            p.fromParty
          )}</div>`
        );
      }
      if (p.toParty) {
        bits.push(
          `<div style="margin-top:12px;"><p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">To (transferee / new shareholder)</p>${partySummary(
            p.toParty
          )}</div>`
        );
      }
      if (p.notes) {
        bits.push(
          `<p style="margin-top:12px;font-size:13px;color:#111827;"><strong>Notes:</strong> ${escapeHtml(
            p.notes
          )}</p>`
        );
      }
      return bits.join("");
    }
    case "change-address": {
      const p = payload as ChangeAddressSubmission;
      const bits: string[] = [];
      const summary = [
        row(
          "Changing registered office",
          p.changeRegisteredOffice ? "Yes" : "No"
        ),
        row("Changing mailing address", p.changeMailingAddress ? "Yes" : "No"),
        row("Effective date", p.effectiveDate),
      ].join("");
      bits.push(`<table style="width:100%;border-collapse:collapse;">${summary}</table>`);
      if (p.changeRegisteredOffice && p.newRegisteredOffice) {
        bits.push(
          `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;"><strong>New registered office:</strong><br>${escapeHtml(
            formatAddress(p.newRegisteredOffice)
          )}</div>`
        );
      }
      if (p.changeMailingAddress && p.newMailingAddress) {
        bits.push(
          `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;"><strong>New mailing address:</strong><br>${escapeHtml(
            formatAddress(p.newMailingAddress)
          )}</div>`
        );
      }
      return bits.join("");
    }
    case "articles-amendment": {
      const p = payload as ArticlesAmendmentSubmission;
      const changes = p.changeTypes.map((t) => AMENDMENT_CHANGE_LABEL[t] ?? t).join("; ");
      const rows = [
        row("Changes being made", changes),
        ...(p.newCorpName ? [row("New corporate name", `${p.newCorpName} ${p.newLegalEnding ?? ""}`.trim())] : []),
        ...(p.fixedDirectors != null ? [row("Fixed number of directors", String(p.fixedDirectors))] : []),
        ...(p.minDirectors != null && p.maxDirectors != null
          ? [row("Director range", `${p.minDirectors} – ${p.maxDirectors}`)]
          : []),
        row("Effective date", p.effectiveDate),
        row("Special resolution passed", p.specialResolutionPassed ? "Yes" : "No"),
        row("Special resolution date", p.specialResolutionDate),
      ].join("");
      const desc = `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;white-space:pre-wrap;"><strong>Amendment description:</strong><br>${escapeHtml(
        p.amendmentDescription
      )}</div>`;
      return `<table style="width:100%;border-collapse:collapse;">${rows}</table>${desc}`;
    }
  }
}
