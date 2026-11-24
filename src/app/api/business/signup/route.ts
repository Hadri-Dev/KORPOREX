import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const bodySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  contactName: z.string().trim().min(1, "Contact name is required").max(200),
  billingEmail: z.string().trim().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

// Step 1 of 2. Creates the Supabase Auth login (credentials only) and a
// Stripe Customer + SetupIntent, but NOT the business_accounts row — that
// only gets created in /api/business/signup/complete once the card is
// actually verified. A visitor who abandons the flow here is left with
// login credentials but no business account; /api/business/login reports
// that clearly rather than silently failing.
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

  const supabase = getSupabaseServiceClient();
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: body.billingEmail,
    password: body.password,
    email_confirm: true, // the verified card is the real gate, not email confirmation
  });
  if (userError || !userData.user) {
    const message =
      userError?.message?.toLowerCase().includes("already") || userError?.status === 422
        ? "An account already exists for that email. Try signing in instead."
        : "Could not create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let customer: { id: string };
  let setupIntent: { client_secret: string | null };
  try {
    customer = await stripe.customers.create({
      email: body.billingEmail,
      name: body.companyName,
    });
    const intent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      payment_method_types: ["card"],
    });
    setupIntent = intent;
  } catch (err) {
    console.error("[business/signup] Stripe error:", err);
    // Roll back the auth user so a retry doesn't hit "already exists".
    await supabase.auth.admin.deleteUser(userData.user.id).catch(() => {});
    return NextResponse.json({ error: "Could not start card verification." }, { status: 502 });
  }

  if (!setupIntent.client_secret) {
    return NextResponse.json({ error: "Could not start card verification." }, { status: 502 });
  }

  return NextResponse.json({
    authUserId: userData.user.id,
    stripeCustomerId: customer.id,
    setupIntentClientSecret: setupIntent.client_secret,
    companyName: body.companyName,
    contactName: body.contactName ?? null,
    billingEmail: body.billingEmail,
  });
}
