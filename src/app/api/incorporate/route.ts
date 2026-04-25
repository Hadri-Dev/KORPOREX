import { NextResponse } from "next/server";
import { z } from "zod";
import {
  JURISDICTION_LABELS,
  PKG_LABELS,
  REG_OFFICE_ADDON,
  computePricing,
  type Jurisdiction,
  type Pkg,
} from "@/lib/pricing";
import { legalEndingSchema } from "@/lib/legalEndings";
import { officerPositionSchema } from "@/lib/officerPositions";
import { ALL_COUNTRIES } from "@/lib/countries";
import { stripe, getSiteUrl } from "@/lib/stripe";
import { generateOrderRef } from "@/lib/orderRef";

export const runtime = "nodejs";

// Card details (cardNumber / expiry / cvc) are deliberately NOT part of this
// schema. Payment is handled by Stripe Checkout on their domain — card data
// never touches our server.

const addressSchema = z.object({
  street: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  region: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(3).max(12),
  country: z.string().trim().min(2).max(60),
});

const directorSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320),
  dateOfBirth: z.string().trim().min(1).max(20),
  citizenshipStatus: z.enum(["citizen", "permanent_resident", "other"]),
  isCanadianResident: z.boolean(),
  taxResidencyCountry: z.string().trim().min(2).max(10),
  address: addressSchema,
});

const shareholderSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  shareClass: z.string().trim().min(1).max(60),
  numberOfShares: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Positive number required"),
  pricePerShare: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Positive amount required"),
  address: addressSchema,
});

const officerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  position: officerPositionSchema,
  email: z.string().trim().email().max(320),
  address: addressSchema,
});

const schema = z.object({
  jurisdiction: z.enum(["federal", "ontario", "bc"]),
  pkg: z.enum(["basic", "standard", "premium"]),
  corpNameType: z.enum(["named", "numbered"]),
  businessName: z.string().trim().max(120).optional().or(z.literal("")),
  legalEnding: legalEndingSchema,
  officialEmail: z.string().trim().email().max(320),
  naicsCode: z.string().trim().min(4).max(10),
  businessActivity: z.string().trim().min(10).max(2000),
  fiscalYearEndMonth: z.string().trim().min(1).max(20),
  fiscalYearEndDay: z.string().trim().min(1).max(2),
  directors: z.array(directorSchema).min(1).max(20),
  shareholders: z.array(shareholderSchema).min(1).max(50),
  officers: z.array(officerSchema).min(1).max(50),
  regOffice: addressSchema,
  regOfficeAddon: z.enum(["none", "korporex"]).default("none"),
  billingName: z.string().trim().min(1).max(200),
  billingAddress: addressSchema,
});

type Submission = z.infer<typeof schema>;

const CONTACT_ADDRESS = "contact@korporex.com";

export async function POST(req: Request) {
  let payload: Submission;
  try {
    const body = await req.json();
    payload = schema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const pricing = computePricing({
    jurisdiction: payload.jurisdiction,
    pkg: payload.pkg,
    corpNameType: payload.corpNameType,
    billingCountry: payload.billingAddress.country,
    billingRegion: payload.billingAddress.region,
    regOfficeAddon: payload.regOfficeAddon,
  });

  const orderRef = generateOrderRef();
  const primaryDirector = payload.directors[0];

  // 1. Send the "PENDING PAYMENT" intake email so we capture the order even if
  //    the customer bails on the Stripe page. Failure here must NOT block
  //    checkout — payment is the critical path; email is observability.
  await sendIntakeEmail(payload, pricing, orderRef).catch((err) => {
    console.error("[incorporate-api] intake email failed:", err);
  });

  // 2. Create the Stripe Checkout Session and hand the URL back to the client.
  if (!stripe) {
    console.warn("[incorporate-api] STRIPE_SECRET_KEY not set — skipping Checkout Session");
    // Dev fallback: simulate a successful redirect to the confirmation page
    // so the wizard flow is testable end-to-end without Stripe credentials.
    const siteUrl = getSiteUrl();
    return NextResponse.json({
      url: `${siteUrl}/incorporate/confirmation?ref=${orderRef}&dev=1`,
      orderRef,
      dev: true,
    });
  }

  const siteUrl = getSiteUrl();
  const jurisLabel = JURISDICTION_LABELS[payload.jurisdiction as Jurisdiction];
  const pkgLabel = PKG_LABELS[payload.pkg as Pkg];
  const corpDesc =
    payload.corpNameType === "numbered"
      ? `Numbered corporation (${jurisLabel}) — ending: ${payload.legalEnding}`
      : payload.businessName
        ? `${payload.businessName} ${payload.legalEnding}`
        : `Unnamed corporation (${jurisLabel}) — ending: ${payload.legalEnding}`;

  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string; description?: string };
      unit_amount: number;
    };
    quantity: number;
  }> = [
    {
      price_data: {
        currency: "cad",
        product_data: {
          name: `${pkgLabel} incorporation — ${jurisLabel}`,
          description: corpDesc,
        },
        unit_amount: Math.round(pricing.price * 100),
      },
      quantity: 1,
    },
  ];

  if (pricing.nuansFee > 0) {
    const nuansLabel =
      payload.jurisdiction === "ontario"
        ? "Ontario name search report"
        : "NUANS name search report";
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: nuansLabel,
          description: `${JURISDICTION_LABELS[payload.jurisdiction as Jurisdiction]} named-corporation name-search pass-through fee`,
        },
        unit_amount: Math.round(pricing.nuansFee * 100),
      },
      quantity: 1,
    });
  }

  if (pricing.regOfficeFee > 0 && payload.regOfficeAddon === "korporex") {
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: `${REG_OFFICE_ADDON.label} (12 months)`,
          description: `${REG_OFFICE_ADDON.locationLabel}. Korporex assigns the address before filing. Monthly mail scans emailed to customer. $${REG_OFFICE_ADDON.monthly.toFixed(2)}/mo × 12. Non-refundable.`,
        },
        unit_amount: Math.round(pricing.regOfficeFee * 100),
      },
      quantity: 1,
    });
  }

  if (pricing.tax > 0) {
    const taxPct =
      pricing.taxRate === 0.14975 ? "14.975" : (pricing.taxRate * 100).toFixed(0);
    lineItems.push({
      price_data: {
        currency: "cad",
        product_data: {
          name: `Tax (${taxPct}% — ${payload.billingAddress.region})`,
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
      customer_email: primaryDirector.email,
      line_items: lineItems,
      success_url: `${siteUrl}/incorporate/confirmation?session_id={CHECKOUT_SESSION_ID}&ref=${orderRef}`,
      cancel_url: `${siteUrl}/incorporate?cancelled=1&ref=${orderRef}`,
      metadata: {
        orderRef,
        jurisdiction: payload.jurisdiction,
        pkg: payload.pkg,
        corpNameType: payload.corpNameType,
        businessName: payload.businessName || "(numbered)",
        legalEnding: payload.legalEnding,
        regOfficeAddon: payload.regOfficeAddon,
        primaryDirectorEmail: primaryDirector.email,
        primaryDirectorName:
          `${primaryDirector.firstName} ${primaryDirector.lastName}`.trim(),
        billingName: payload.billingName,
      },
      payment_intent_data: {
        description: `Korporex — ${orderRef} — ${corpDesc}`,
        metadata: { orderRef },
      },
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a URL");
    }

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("[incorporate-api] Stripe Checkout Session error:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't start checkout. Please try again or email us at " +
          CONTACT_ADDRESS +
          ".",
      },
      { status: 502 }
    );
  }
}

// ─── Intake email (PENDING PAYMENT) ──────────────────────────────────────────

async function sendIntakeEmail(
  payload: Submission,
  pricing: ReturnType<typeof computePricing>,
  orderRef: string
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[incorporate-api] BREVO_API_KEY not set — intake logged, not emailed");
    console.log("[incorporate-api] intake:", { orderRef, pricing, ...payload });
    return;
  }

  const primaryDirector = payload.directors[0];
  const replyTo = {
    email: primaryDirector.email,
    name: `${primaryDirector.firstName} ${primaryDirector.lastName}`.trim(),
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: CONTACT_ADDRESS, name: "Korporex" },
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo,
      subject: buildSubject(payload, pricing.total, orderRef),
      htmlContent: buildHtmlBody(payload, pricing, orderRef),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo ${res.status}: ${detail}`);
  }
}

function buildSubject(d: Submission, total: number, orderRef: string) {
  const jurisLabel = JURISDICTION_LABELS[d.jurisdiction as Jurisdiction];
  const pkgLabel = PKG_LABELS[d.pkg as Pkg];
  const name =
    d.corpNameType === "numbered"
      ? `Numbered ${jurisLabel} ${d.legalEnding}`
      : d.businessName
        ? `${d.businessName} ${d.legalEnding}`
        : `Unnamed ${jurisLabel} ${d.legalEnding}`;
  return `[PENDING] ${orderRef} — ${name} — ${pkgLabel} — $${total.toFixed(2)} CAD`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAddress(a: Submission["billingAddress"]) {
  const parts = [a.street, a.city, a.region, a.postalCode, a.country].filter(Boolean);
  return parts.join(", ");
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

function personBlock(label: string, items: Array<Record<string, string>>) {
  if (!items.length) return "";
  return items
    .map(
      (item, idx) =>
        `<div style="padding:12px 16px;background:#fafaf8;border-left:3px solid #C5A35A;margin-bottom:8px;"><p style="margin:0 0 6px;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(
          label
        )} ${idx + 1}</p><table style="width:100%;border-collapse:collapse;">${Object.entries(item)
          .map(([k, v]) => row(k, v))
          .join("")}</table></div>`
    )
    .join("");
}

function buildHtmlBody(
  d: Submission,
  p: ReturnType<typeof computePricing>,
  orderRef: string
) {
  const jurisLabel = JURISDICTION_LABELS[d.jurisdiction as Jurisdiction];
  const pkgLabel = PKG_LABELS[d.pkg as Pkg];
  const corpName =
    d.corpNameType === "numbered"
      ? `Numbered corporation (${jurisLabel}) — ${d.legalEnding}`
      : d.businessName
        ? `${d.businessName} ${d.legalEnding}`
        : "—";

  const orderRows = [
    row("Order reference", orderRef),
    row("Jurisdiction", jurisLabel),
    row("Package", pkgLabel),
    row("Corporation", corpName),
    row("Legal ending", d.legalEnding),
    row("Official email", d.officialEmail),
    row("NAICS code", d.naicsCode),
    row("Business activity", d.businessActivity),
    row("Fiscal year end", `${d.fiscalYearEndMonth} ${d.fiscalYearEndDay}`),
  ].join("");

  const addonLabel =
    d.regOfficeAddon === "korporex"
      ? `Registered office — ${REG_OFFICE_ADDON.label} (12 mo)`
      : "";

  const pricingRows = [
    row(`${pkgLabel} package (${jurisLabel})`, `$${p.price.toFixed(2)}`),
    p.nuansFee > 0 ? row("NUANS name-search report", `$${p.nuansFee.toFixed(2)}`) : "",
    p.regOfficeFee > 0 ? row(addonLabel, `$${p.regOfficeFee.toFixed(2)}`) : "",
    row("Subtotal", `$${p.subtotal.toFixed(2)}`),
    row(
      p.taxRate > 0
        ? `Tax (${(p.taxRate * 100).toFixed(p.taxRate === 0.14975 ? 3 : 0)}% — ${d.billingAddress.region})`
        : "Tax",
      `$${p.tax.toFixed(2)}`
    ),
    row("Total (CAD)", `$${p.total.toFixed(2)}`),
  ]
    .filter(Boolean)
    .join("");

  const directors = personBlock(
    "Director",
    d.directors.map((x) => {
      const country = ALL_COUNTRIES.find((c) => c.code === x.taxResidencyCountry);
      const taxRes = country ? `${country.name} (${country.code})` : x.taxResidencyCountry || "—";
      const citizenshipLabel =
        x.citizenshipStatus === "citizen"
          ? "Canadian citizen"
          : x.citizenshipStatus === "permanent_resident"
            ? "Permanent resident"
            : "Other";
      return {
        Name: `${x.firstName} ${x.lastName}`,
        Email: x.email,
        "Date of birth": x.dateOfBirth,
        Citizenship: citizenshipLabel,
        "CBCA resident Canadian": x.isCanadianResident ? "Yes" : "No",
        "Tax residency": taxRes,
        Address: formatAddress(x.address),
      };
    })
  );

  const shareholders = personBlock(
    "Shareholder",
    d.shareholders.map((x) => {
      const shares = Number(x.numberOfShares);
      const price = Number(x.pricePerShare);
      const subscription = isFinite(shares * price) ? (shares * price).toFixed(2) : "—";
      return {
        Name: `${x.firstName} ${x.lastName}`,
        "Share class": x.shareClass,
        Shares: x.numberOfShares,
        "Price per share": `$${Number(x.pricePerShare).toFixed(2)} CAD`,
        "Subscription total": `$${subscription} CAD`,
        Address: formatAddress(x.address),
      };
    })
  );

  const officers = personBlock(
    "Officer",
    d.officers.map((x) => ({
      Name: `${x.firstName} ${x.lastName}`,
      Position: x.position,
      Email: x.email,
      Address: formatAddress(x.address),
    }))
  );

  const regOfficeHeader =
    d.regOfficeAddon === "korporex"
      ? `<p style="margin:0 0 6px;color:#C5A35A;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(
          REG_OFFICE_ADDON.label
        )} — ${escapeHtml(REG_OFFICE_ADDON.locationLabel)}</p>`
      : "";
  const regOfficeNote =
    d.regOfficeAddon === "korporex"
      ? `<p style="margin:6px 0 0;color:#92400e;font-size:12px;line-height:1.6;"><strong>ACTION REQUIRED:</strong> assign actual GTA address before filing. Customer paid 12-month non-refundable term.</p>`
      : "";
  const regOffice = `${regOfficeHeader}<p style="margin:0;color:#111827;font-size:14px;line-height:1.6;">${escapeHtml(
    formatAddress(d.regOffice)
  )}</p>${regOfficeNote}`;

  const billing = `<table style="width:100%;border-collapse:collapse;">${row(
    "Billing name",
    d.billingName
  )}${row("Billing address", formatAddress(d.billingAddress))}</table>`;

  const note = `<p style="margin:24px 0 0;padding:12px 16px;background:#fef3c7;border-left:3px solid #C5A35A;color:#78350f;font-size:13px;line-height:1.6;"><strong>Status: PENDING PAYMENT.</strong> This order was captured at Review submit. A second email will follow from the Stripe webhook once payment completes. If no "[PAID]" email arrives for <strong>${escapeHtml(
    orderRef
  )}</strong>, the customer did not finish checkout.</p>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New incorporation order — ${escapeHtml(
    orderRef
  )}</h1><p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Submitted from the korporex.com wizard</p>${section(
    "Order",
    `<table style="width:100%;border-collapse:collapse;">${orderRows}</table>`
  )}${section(
    "Pricing",
    `<table style="width:100%;border-collapse:collapse;">${pricingRows}</table>`
  )}${section("Directors", directors)}${section(
    "Shareholders",
    shareholders
  )}${section("Officers", officers)}${section("Registered office", regOffice)}${section(
    "Billing",
    billing
  )}${note}</div></body></html>`;
}
