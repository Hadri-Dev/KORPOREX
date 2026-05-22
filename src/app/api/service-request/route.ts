import { NextResponse } from "next/server";
import { z } from "zod";
import {
  registrationRequestSchema,
  type SoleProprietorshipSubmission,
  type BusinessNameRegistrationSubmission,
  type BusinessNumberSubmission,
  type ExtraProvincialSubmission,
} from "@/lib/registrationSchemas";
import { REGISTRATION_SERVICES, type RegistrationServiceSlug } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

type Pricing = { subtotal: number; taxRate: number; tax: number; total: number };

function computeRegistrationPricing(
  service: RegistrationServiceSlug,
  billingCountry: string,
  billingRegion: string
): Pricing {
  const subtotal = REGISTRATION_SERVICES[service].price;
  const taxRate = getTaxRate(billingCountry, billingRegion);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, taxRate, tax, total };
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof registrationRequestSchema>;
  try {
    const body = await req.json();
    parsed = registrationRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const { service, payload } = parsed;
  const meta = REGISTRATION_SERVICES[service];

  // All payload variants include billingAddress / billingName via the
  // billingSchema merge in registrationSchemas.ts. The discriminated union
  // means TypeScript doesn't see these on the union directly, so narrow first.
  const billing = payload.billingAddress;
  const billingName = payload.billingName;
  const pricing = computeRegistrationPricing(service, billing.country, billing.region);
  const orderRef = generateOrderRef();

  const { customerEmail, customerName } = extractContact(service, payload);

  // 1. [PENDING PAYMENT] intake email — capture even if customer bails on Stripe
  await sendIntakeEmail({
    service,
    serviceLabel: meta.longLabel,
    payload,
    pricing,
    orderRef,
    customerEmail,
    customerName,
  }).catch((err) => {
    console.error("[service-request-api] intake email failed:", err);
  });

  // 2. Stripe Checkout — hand the URL back to the client
  if (!stripe) {
    console.warn("[service-request-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
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
        productType: "registration",
        service,
        orderRef,
        customerEmail,
        customerName,
        billingName,
        serviceLabel: meta.longLabel,
      },
      payment_intent_data: {
        description: `Korporex - ${orderRef} - ${meta.longLabel}`,
        metadata: { orderRef, productType: "registration", service },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[service-request-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      { error: `We couldn't start checkout. Please try again or email us at ${CONTACT_ADDRESS}.` },
      { status: 502 }
    );
  }
}

// ── Contact extraction (per-service) ────────────────────────────────────────
// Each service captures contact info under a different field name; this
// normalizes so the Stripe customer_email + intake email use the right value.
function extractContact(
  service: RegistrationServiceSlug,
  payload:
    | SoleProprietorshipSubmission
    | BusinessNameRegistrationSubmission
    | BusinessNumberSubmission
    | ExtraProvincialSubmission
): { customerEmail: string; customerName: string } {
  switch (service) {
    case "sole-prop-on": {
      const p = payload as SoleProprietorshipSubmission;
      return {
        customerEmail: p.ownerEmail,
        customerName: `${p.ownerFirstName} ${p.ownerLastName}`.trim(),
      };
    }
    case "business-name-on": {
      const p = payload as BusinessNameRegistrationSubmission;
      const name =
        p.entityType === "individual"
          ? `${p.ownerFirstName ?? ""} ${p.ownerLastName ?? ""}`.trim()
          : p.corpName ?? "";
      return { customerEmail: p.contactEmail, customerName: name || p.billingName };
    }
    case "business-number": {
      const p = payload as BusinessNumberSubmission;
      return {
        customerEmail: p.contactEmail,
        customerName: `${p.contactFirstName} ${p.contactLastName}`.trim(),
      };
    }
    case "extra-provincial": {
      const p = payload as ExtraProvincialSubmission;
      return { customerEmail: p.contactEmail, customerName: p.corpName };
    }
  }
}

// ── Intake email (PENDING PAYMENT) ──────────────────────────────────────────

async function sendIntakeEmail(args: {
  service: RegistrationServiceSlug;
  serviceLabel: string;
  payload:
    | SoleProprietorshipSubmission
    | BusinessNameRegistrationSubmission
    | BusinessNumberSubmission
    | ExtraProvincialSubmission;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
}): Promise<void> {
  const { service, serviceLabel, payload, pricing, orderRef, customerEmail, customerName } = args;
  const subject = `[PENDING] ${orderRef} — ${serviceLabel} — $${pricing.total.toFixed(2)} CAD`;
  const html = buildHtmlBody({ service, serviceLabel, payload, pricing, orderRef, customerEmail, customerName });
  await sendMail(
    {
      subject,
      html,
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo: { email: customerEmail, name: customerName || customerEmail },
    },
    "service-request-api"
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
  service: RegistrationServiceSlug;
  serviceLabel: string;
  payload:
    | SoleProprietorshipSubmission
    | BusinessNameRegistrationSubmission
    | BusinessNumberSubmission
    | ExtraProvincialSubmission;
  pricing: Pricing;
  orderRef: string;
  customerEmail: string;
  customerName: string;
}): string {
  const { service, serviceLabel, payload, pricing, orderRef } = args;

  const orderRows = [row("Order reference", orderRef), row("Service", serviceLabel)].join("");

  const detailRows = serviceDetailRows(service, payload);

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

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New registration order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from the korporex.ca services page</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section(
    "Service details",
    `<table style="width:100%;border-collapse:collapse;">${detailRows}</table>`
  )}${section(
    "Pricing",
    `<table style="width:100%;border-collapse:collapse;">${pricingRows}</table>`
  )}${section(
    "Billing",
    `<table style="width:100%;border-collapse:collapse;">${billingRows}</table>`
  )}${note}</div></body></html>`;
}

function serviceDetailRows(
  service: RegistrationServiceSlug,
  payload:
    | SoleProprietorshipSubmission
    | BusinessNameRegistrationSubmission
    | BusinessNumberSubmission
    | ExtraProvincialSubmission
): string {
  switch (service) {
    case "sole-prop-on": {
      const p = payload as SoleProprietorshipSubmission;
      return [
        row("Business name", p.businessName),
        row("NAICS code", p.naicsCode),
        row("Business activity", p.businessActivity),
        row("Business address", formatAddress(p.businessAddress)),
        row("Effective date", p.effectiveDate),
        row("Owner", `${p.ownerFirstName} ${p.ownerLastName}`),
        row("Owner email", p.ownerEmail),
        row("Owner phone", p.ownerPhone),
        row("Owner DOB", p.ownerDob),
        row("Owner home address", formatAddress(p.ownerAddress)),
      ].join("");
    }
    case "business-name-on": {
      const p = payload as BusinessNameRegistrationSubmission;
      const entityRows =
        p.entityType === "individual"
          ? [
              row("Entity type", "Individual"),
              row("Owner", `${p.ownerFirstName ?? ""} ${p.ownerLastName ?? ""}`.trim() || "—"),
              row("Owner DOB", p.ownerDob || "—"),
            ]
          : [
              row("Entity type", "Corporation"),
              row("Corp legal name", p.corpName || "—"),
              row("Corp number", p.corpNumber || "—"),
            ];
      return [
        row("Trade name to register", p.businessName),
        row("NAICS code", p.naicsCode),
        row("Business activity", p.businessActivity),
        row("Business address", formatAddress(p.businessAddress)),
        ...entityRows,
        row("Contact email", p.contactEmail),
        row("Contact phone", p.contactPhone),
      ].join("");
    }
    case "business-number": {
      const p = payload as BusinessNumberSubmission;
      const programs = [
        p.programGst ? "GST/HST" : null,
        p.programPayroll ? "Payroll" : null,
        p.programImportExport ? "Import/Export" : null,
        p.programCorporateIncomeTax ? "Corporate income tax" : null,
      ].filter(Boolean) as string[];
      const entityLabel = {
        individual: "Individual",
        sole_prop: "Sole proprietorship",
        partnership: "Partnership",
        corporation: "Corporation",
      }[p.entityType];
      return [
        row("Legal name", p.legalName),
        row("Entity type", entityLabel),
        row("Entity address", formatAddress(p.entityAddress)),
        row("Expected gross revenue", p.expectedRevenue === "over_30k" ? "Over $30,000/yr" : "Under $30,000/yr"),
        row("Programs requested", programs.length ? programs.join(", ") : "Business Number only"),
        row("Effective date", p.effectiveDate),
        row("Contact", `${p.contactFirstName} ${p.contactLastName}`),
        row("Contact email", p.contactEmail),
        row("Contact phone", p.contactPhone),
      ].join("");
    }
    case "extra-provincial": {
      const p = payload as ExtraProvincialSubmission;
      const homeLabel = {
        federal: "Federal (Canada)",
        ontario: "Ontario",
        bc: "British Columbia",
        alberta: "Alberta",
        quebec: "Quebec",
        other: p.homeJurisdictionOther || "Other",
      }[p.homeJurisdiction];
      const targetLabel = {
        ontario: "Ontario",
        quebec: "Quebec",
        bc: "British Columbia",
        alberta: "Alberta",
        manitoba: "Manitoba",
        saskatchewan: "Saskatchewan",
        nb: "New Brunswick",
        ns: "Nova Scotia",
        pei: "Prince Edward Island",
        nl: "Newfoundland and Labrador",
      }[p.targetProvince];
      return [
        row("Home jurisdiction", homeLabel),
        row("Target province", targetLabel),
        row("Effective date", p.effectiveDate),
        row("Corporation name", p.corpName),
        row("Corporation number", p.corpNumber),
        row("Registered office", formatAddress(p.corpRegisteredOffice)),
        row("Agent for service (name)", p.agentName),
        row("Agent address", formatAddress(p.agentAddress)),
        row("Contact email", p.contactEmail),
        row("Contact phone", p.contactPhone),
      ].join("");
    }
  }
}
