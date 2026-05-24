import { NextResponse } from "next/server";
import { z } from "zod";
import {
  complianceRequestSchema,
  type InitialReturnOntarioSubmission,
  type AnnualReturnOntarioSubmission,
  type AnnualReturnFederalSubmission,
  type NoticeOfChangeSubmission,
  type AmendmentJurisdiction,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES, type ComplianceServiceSlug } from "@/lib/complianceServices";
import { getTaxRate } from "@/lib/pricing";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

type Pricing = { subtotal: number; taxRate: number; tax: number; total: number };

type CompliancePayload =
  | InitialReturnOntarioSubmission
  | AnnualReturnOntarioSubmission
  | AnnualReturnFederalSubmission
  | NoticeOfChangeSubmission;

function computeCompliancePricing(
  service: ComplianceServiceSlug,
  billingCountry: string,
  billingRegion: string
): Pricing {
  const subtotal = COMPLIANCE_SERVICES[service].price;
  const taxRate = getTaxRate(billingCountry, billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, taxRate, tax, total };
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof complianceRequestSchema>;
  try {
    const body = await req.json();
    parsed = complianceRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const { service, payload } = parsed;
  const meta = COMPLIANCE_SERVICES[service];

  const billing = payload.billingAddress;
  const billingName = payload.billingName;
  const pricing = computeCompliancePricing(service, billing.country, billing.region);
  const orderRef = generateOrderRef();

  const customerEmail = payload.contact.contactEmail;
  const customerName = `${payload.contact.contactFirstName} ${payload.contact.contactLastName}`.trim();
  const jurisdiction = payload.corporation.jurisdiction;

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
    console.error("[compliance-request-api] intake email failed:", err);
  });

  // 2. Stripe Checkout
  if (!stripe) {
    console.warn("[compliance-request-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
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
        productType: "compliance",
        service,
        orderRef,
        customerEmail,
        customerName,
        billingName,
        serviceLabel: meta.longLabel,
        jurisdiction,
        corpName: payload.corporation.corpName,
        corpNumber: payload.corporation.corpNumber,
      },
      payment_intent_data: {
        description: `Korporex - ${orderRef} - ${meta.longLabel}`,
        metadata: { orderRef, productType: "compliance", service },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[compliance-request-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      { error: `We couldn't start checkout. Please try again or email us at ${CONTACT_ADDRESS}.` },
      { status: 502 }
    );
  }
}

// ── Intake email ────────────────────────────────────────────────────────────

async function sendIntakeEmail(args: {
  service: ComplianceServiceSlug;
  serviceLabel: string;
  payload: CompliancePayload;
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
    "compliance-request-api"
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

const CHANGE_KIND_LABEL: Record<string, string> = {
  add: "Add (new appointment)",
  remove: "Remove (resignation / ceasing)",
  update: "Update (existing person)",
};

const ROLE_LABEL: Record<string, string> = {
  director: "Director",
  officer: "Officer",
  director_and_officer: "Director and Officer",
};

const NOTICE_CHANGE_LABEL: Record<string, string> = {
  registered_office: "Registered office address",
  mailing_address: "Mailing address",
  directors_officers: "Directors / officers",
};

function buildHtmlBody(args: {
  service: ComplianceServiceSlug;
  serviceLabel: string;
  payload: CompliancePayload;
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

  const corp = payload.corporation;
  const corpRows = [
    row("Corporation name", corp.corpName),
    row("Corporation number", corp.corpNumber),
    ...(corp.businessNumber ? [row("Business number (CRA)", corp.businessNumber)] : []),
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

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> This order was captured at Review submit. A second email will follow from the Stripe webhook once payment completes. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New compliance order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from the korporex.ca services page</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section(
    "Corporation",
    `<table style="width:100%;border-collapse:collapse;">${corpRows}</table>`
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

function serviceDetailHtml(service: ComplianceServiceSlug, payload: CompliancePayload): string {
  switch (service) {
    case "initial-return-on": {
      const p = payload as InitialReturnOntarioSubmission;
      const summaryRows = [
        row("Incorporation date", p.incorporationDate),
        row("Registered office", formatAddress(p.registeredOffice)),
        ...(p.mailingAddressDifferent && p.mailingAddress
          ? [row("Mailing address", formatAddress(p.mailingAddress))]
          : []),
        row("NAICS code", p.naicsCode),
        row("Principal activity", p.principalActivity),
      ].join("");
      const directors = p.directors.map(personCard).join("");
      const officers = p.officers.map(personCard).join("");
      return `<table style="width:100%;border-collapse:collapse;">${summaryRows}</table><p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Directors (${p.directors.length})</p>${directors}<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Officers (${p.officers.length})</p>${officers}`;
    }
    case "annual-return-on":
    case "annual-return-federal": {
      const p = payload as AnnualReturnOntarioSubmission | AnnualReturnFederalSubmission;
      const isFederal = service === "annual-return-federal";
      const fed = isFederal ? (p as AnnualReturnFederalSubmission) : null;
      const ont = !isFederal ? (p as AnnualReturnOntarioSubmission) : null;
      const summaryRows = [
        row("Anniversary date", p.anniversaryDate),
        row("Fiscal year-end", p.fiscalYearEnd),
        ...(fed
          ? [
              row(
                "Distributing status",
                fed.distributingStatus === "distributing"
                  ? "Distributing (publicly traded / offering)"
                  : "Non-distributing (private)"
              ),
              row("Number of shareholders", String(fed.numberOfShareholders)),
            ]
          : []),
        row("Information current?", p.informationCurrent ? "Yes — no changes" : "No — see updates below"),
      ].join("");
      let parts = `<table style="width:100%;border-collapse:collapse;">${summaryRows}</table>`;
      if (p.registeredOfficeChanged && p.newRegisteredOffice) {
        parts += `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;"><strong>New registered office:</strong><br>${escapeHtml(formatAddress(p.newRegisteredOffice))}</div>`;
      }
      if (p.directorsChanged && p.directors && p.directors.length > 0) {
        parts += `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Updated directors (${p.directors.length})</p>${p.directors.map(personCard).join("")}`;
      }
      if (p.officersChanged && p.officers && p.officers.length > 0) {
        parts += `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Updated officers (${p.officers.length})</p>${p.officers.map(personCard).join("")}`;
      }
      if (ont && (ont.naicsCode || ont.principalActivity)) {
        parts += `<table style="width:100%;border-collapse:collapse;margin-top:12px;">${[
          ...(ont.naicsCode ? [row("Updated NAICS code", ont.naicsCode)] : []),
          ...(ont.principalActivity ? [row("Updated principal activity", ont.principalActivity)] : []),
        ].join("")}</table>`;
      }
      return parts;
    }
    case "notice-of-change": {
      const p = payload as NoticeOfChangeSubmission;
      const summaryRows = [
        row("Changes being filed", p.changeTypes.map((c) => NOTICE_CHANGE_LABEL[c] ?? c).join("; ")),
        row("Effective date", p.effectiveDate),
      ].join("");
      let parts = `<table style="width:100%;border-collapse:collapse;">${summaryRows}</table>`;
      if (p.newRegisteredOffice) {
        parts += `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;"><strong>New registered office:</strong><br>${escapeHtml(formatAddress(p.newRegisteredOffice))}</div>`;
      }
      if (p.newMailingAddress) {
        parts += `<div style="margin-top:12px;padding:12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;color:#111827;"><strong>New mailing address:</strong><br>${escapeHtml(formatAddress(p.newMailingAddress))}</div>`;
      }
      if (p.directorOfficerChanges && p.directorOfficerChanges.length > 0) {
        parts += `<p style="margin:18px 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Director / officer changes (${p.directorOfficerChanges.length})</p>`;
        parts += p.directorOfficerChanges
          .map((c, i) => {
            const lines: string[] = [];
            lines.push(`<strong>Change ${i + 1}:</strong> ${escapeHtml(CHANGE_KIND_LABEL[c.changeKind] ?? c.changeKind)}`);
            lines.push(`<strong>Role:</strong> ${escapeHtml(ROLE_LABEL[c.role] ?? c.role)}`);
            lines.push(`<strong>Name:</strong> ${escapeHtml(`${c.firstName} ${c.lastName}`)}`);
            if (c.officerPosition) lines.push(`<strong>Officer position:</strong> ${escapeHtml(c.officerPosition)}`);
            if (c.email) lines.push(`<strong>Email:</strong> ${escapeHtml(c.email)}`);
            lines.push(`<strong>Address:</strong> ${escapeHtml(formatAddress(c.address))}`);
            if (typeof c.canadianResident === "boolean")
              lines.push(`<strong>Canadian resident:</strong> ${c.canadianResident ? "Yes" : "No"}`);
            lines.push(`<strong>Effective:</strong> ${escapeHtml(c.effectiveDate)}`);
            if (c.notes) lines.push(`<strong>Notes:</strong> ${escapeHtml(c.notes)}`);
            return `<div style="margin-bottom:8px;padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;font-size:13px;line-height:1.7;color:#111827;">${lines.join(
              "<br>"
            )}</div>`;
          })
          .join("");
      }
      return parts;
    }
  }
}
