import { NextResponse } from "next/server";
import { z } from "zod";
import { CONTACT_ADDRESS, sendMail } from "@/lib/mailer";
import { CA_TAX_RATES } from "@/lib/pricing";
import { getSiteUrl, stripe } from "@/lib/stripe";
import { annualFee, getClient, locationLabel, logEvent, updateClient, type OfficeClient } from "@/lib/officeRenewals";
import { verifyRenewalToken } from "@/lib/officeRenewalToken";
import { buildMovingAckEmail, buildOwnerMovingEmail } from "@/lib/officeRenewalEmails";

// Public endpoint behind the private link in each renewal email
// (/office-renewal?t=<token>). The signed token is the only credential: it
// names the client and the term it was issued for, and stops working once the
// term moves forward.
//
//   { choice: "renew", token, region, locale }  -> { url } Stripe Checkout
//   { choice: "moving", token, address, note }  -> { ok }  stops reminders
//
// Tax follows the other checkouts: GST/HST by billing province, and 13%
// Ontario HST when billed outside Canada (same rule as the NUANS checkout).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OUTSIDE_CANADA = "OUTSIDE";
const OUTSIDE_RATE = 0.13;

const BODY = z.discriminatedUnion("choice", [
  z.object({
    choice: z.literal("renew"),
    token: z.string().min(10).max(300),
    region: z.string().refine((r) => r === OUTSIDE_CANADA || r in CA_TAX_RATES),
    locale: z.enum(["en", "fr", "es"]).default("en"),
  }),
  z.object({
    choice: z.literal("moving"),
    token: z.string().min(10).max(300),
    address: z.string().trim().min(1).max(500),
    note: z.string().trim().max(1000).default(""),
    locale: z.enum(["en", "fr", "es"]).default("en"),
  }),
]);

async function resolve(token: string): Promise<OfficeClient | null> {
  const t = verifyRenewalToken(token);
  if (!t) return null;
  const client = await getClient(t.clientId);
  if (!client || client.renewsOn !== t.renewsOn || client.status === "closed") return null;
  return client;
}

export async function POST(req: Request): Promise<Response> {
  let body: z.infer<typeof BODY>;
  try {
    body = BODY.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const client = await resolve(body.token);
  if (!client) return NextResponse.json({ error: "expired" }, { status: 410 });

  const prefix = body.locale === "en" ? "" : `/${body.locale}`;
  const pageUrl = `${getSiteUrl()}${prefix}/office-renewal?t=${encodeURIComponent(body.token)}`;

  if (body.choice === "moving") {
    await updateClient(client.id, { status: "moving", movingAddress: body.address, movingNote: body.note });
    await logEvent(client.id, "moving", {
      termEndsOn: client.renewsOn,
      detail: `New address: ${body.address}${body.note ? ` · Note: ${body.note}` : ""}`,
    });
    const ack = buildMovingAckEmail({ businessName: client.businessName, renewsOn: client.renewsOn });
    const owner = buildOwnerMovingEmail({
      businessName: client.businessName,
      email: client.email,
      renewsOn: client.renewsOn,
      newAddress: body.address,
      note: body.note,
    });
    await Promise.all([
      sendMail(
        { ...ack, to: [{ email: client.email }], replyTo: { email: CONTACT_ADDRESS, name: "Korporex" } },
        "office-renewal-moving-ack",
      ),
      sendMail(
        { ...owner, to: [{ email: CONTACT_ADDRESS, name: "Korporex" }], replyTo: { email: client.email } },
        "office-renewal-moving-owner",
      ),
    ]);
    return NextResponse.json({ ok: true });
  }

  if (!stripe) {
    return NextResponse.json({ error: "payments unavailable" }, { status: 503 });
  }

  const fee = annualFee(client.location);
  const rate = body.region === OUTSIDE_CANADA ? OUTSIDE_RATE : CA_TAX_RATES[body.region];
  const tax = Math.round(fee * rate * 100) / 100;
  const taxPct = rate === 0.14975 ? "14.975" : (rate * 100).toFixed(0);
  const taxRegion = body.region === OUTSIDE_CANADA ? "ON, billed outside Canada" : body.region;

  if (body.region !== client.billingRegion) {
    await updateClient(client.id, { billingRegion: body.region });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: client.email,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `Korporex Registered Office renewal (${locationLabel(client.location)}, 12 months)`,
              description: client.businessName,
            },
            unit_amount: Math.round(fee * 100),
          },
          quantity: 1,
        },
        ...(tax > 0
          ? [
              {
                price_data: {
                  currency: "cad",
                  product_data: { name: `Tax (${taxPct}%, ${taxRegion})`, description: "GST/HST" },
                  unit_amount: Math.round(tax * 100),
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      success_url: `${pageUrl}&paid=1`,
      cancel_url: `${pageUrl}&choice=renew`,
      metadata: {
        productType: "office-renewal",
        clientId: client.id,
        termEndsOn: client.renewsOn,
        businessName: client.businessName.slice(0, 450),
      },
      payment_intent_data: {
        description: `Korporex - Registered Office renewal - ${client.businessName}`.slice(0, 1000),
        metadata: { productType: "office-renewal", clientId: client.id },
      },
    });
    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[office-renewal] Stripe Checkout Session error:", err);
    return NextResponse.json({ error: "checkout" }, { status: 502 });
  }
}
