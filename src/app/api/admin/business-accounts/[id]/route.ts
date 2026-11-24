import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getBusinessAccountById, setBusinessAccountStatus } from "@/lib/businessAccounts";
import { getSupabaseServerAnonClient, isSupabaseConfigured } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/stripe";

// Admin-only endpoint for a single business account.
//
//   PATCH /api/admin/business-accounts/<id>
//
// Body: { action: "suspend" | "reactivate" | "reset_password" }

const BODY = z.object({
  action: z.enum(["suspend", "reactivate", "reset_password"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured on this environment" }, { status: 503 });
  }

  const { id } = await params;
  let parsed: z.infer<typeof BODY>;
  try {
    parsed = BODY.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const account = await getBusinessAccountById(id).catch(() => null);
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (parsed.action === "suspend") {
    await setBusinessAccountStatus(id, "suspended");
    return NextResponse.json({ ok: true, status: "suspended" });
  }
  if (parsed.action === "reactivate") {
    await setBusinessAccountStatus(id, "active");
    return NextResponse.json({ ok: true, status: "active" });
  }

  // reset_password — staff triggering it on the customer's behalf (e.g. they
  // called in locked out). Same resetPasswordForEmail Supabase call a
  // customer's own "forgot password" link uses.
  const supabase = getSupabaseServerAnonClient();
  const { error } = await supabase.auth.resetPasswordForEmail(account.billingEmail, {
    redirectTo: `${getSiteUrl()}/business/reset-password`,
  });
  if (error) {
    console.error("[admin/business-accounts] reset_password error:", error);
    return NextResponse.json({ error: "Could not send reset email." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
