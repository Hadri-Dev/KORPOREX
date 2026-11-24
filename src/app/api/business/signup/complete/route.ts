import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { createBusinessAccount, getBusinessAccountByAuthUserId } from "@/lib/businessAccounts";
import { BUSINESS_COOKIE_NAME, BUSINESS_SESSION_TTL_SECONDS, signBusinessSession } from "@/lib/businessAuth";

export const runtime = "nodejs";

const bodySchema = z.object({
  authUserId: z.string().uuid(),
  stripeCustomerId: z.string().min(1),
  setupIntentId: z.string().min(1),
  companyName: z.string().trim().min(1).max(200),
  contactName: z.string().trim().max(200).optional(),
  billingEmail: z.string().trim().email(),
});

// Step 2 of 2. Verifies the SetupIntent actually succeeded server-side
// (never trust the client's word that the card was saved), sets it as the
// customer's default payment method for future invoice auto-charges, then
// creates the business_accounts row — active immediately, since a verified
// card is the only approval gate by design.
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 500 });
  }
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Accounts are not configured." }, { status: 500 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Confirm this authUserId genuinely owns this email — the client echoes
  // these back from step 1, so this guards against a tampered pairing.
  const supabase = getSupabaseServiceClient();
  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(body.authUserId);
  if (userError || userData.user?.email?.toLowerCase() !== body.billingEmail.toLowerCase()) {
    return NextResponse.json({ error: "Could not verify account." }, { status: 400 });
  }

  const existing = await getBusinessAccountByAuthUserId(body.authUserId).catch(() => null);
  if (existing) {
    return NextResponse.json({ error: "This account is already set up." }, { status: 409 });
  }

  let setupIntent: Awaited<ReturnType<typeof stripe.setupIntents.retrieve>>;
  try {
    setupIntent = await stripe.setupIntents.retrieve(body.setupIntentId);
  } catch (err) {
    console.error("[business/signup/complete] setupIntent retrieve failed:", err);
    return NextResponse.json({ error: "Could not verify your card." }, { status: 502 });
  }

  const setupIntentCustomer =
    typeof setupIntent.customer === "string" ? setupIntent.customer : setupIntent.customer?.id;
  if (setupIntent.status !== "succeeded" || setupIntentCustomer !== body.stripeCustomerId) {
    return NextResponse.json({ error: "Card verification did not complete." }, { status: 400 });
  }

  const paymentMethodId =
    typeof setupIntent.payment_method === "string"
      ? setupIntent.payment_method
      : setupIntent.payment_method?.id;
  if (!paymentMethodId) {
    return NextResponse.json({ error: "Card verification did not complete." }, { status: 400 });
  }

  await stripe.customers.update(body.stripeCustomerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  const account = await createBusinessAccount({
    authUserId: body.authUserId,
    companyName: body.companyName,
    contactName: body.contactName ?? null,
    billingEmail: body.billingEmail,
    stripeCustomerId: body.stripeCustomerId,
  });

  const token = await signBusinessSession(account.id);
  const res = NextResponse.json({ ok: true, companyName: account.companyName });
  res.cookies.set(BUSINESS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: BUSINESS_SESSION_TTL_SECONDS,
  });
  return res;
}
