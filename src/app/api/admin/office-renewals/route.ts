import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createClient, syncFromStripe, updateSettings } from "@/lib/officeRenewals";
import { CLIENT_FIELDS, SETTINGS_PATCH } from "./schemas";

// Admin-only collection endpoint for /dashboard/office-renewals.
//
//   POST /api/admin/office-renewals  { op: "create", client: {...} }
//   POST /api/admin/office-renewals  { op: "sync" }      import paid Stripe orders
//   POST /api/admin/office-renewals  { op: "settings", settings: {...} }

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BODY = z.discriminatedUnion("op", [
  z.object({ op: z.literal("create"), client: CLIENT_FIELDS }),
  z.object({ op: z.literal("sync") }),
  z.object({ op: z.literal("settings"), settings: SETTINGS_PATCH }),
]);

export async function POST(req: Request): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured on this environment" }, { status: 503 });
  }

  let body: z.infer<typeof BODY>;
  try {
    body = BODY.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: err instanceof z.ZodError ? err.issues[0]?.message : "invalid body" }, { status: 400 });
  }

  try {
    if (body.op === "create") {
      return NextResponse.json({ client: await createClient(body.client) });
    }
    if (body.op === "sync") {
      return NextResponse.json({ counts: await syncFromStripe() });
    }
    return NextResponse.json({ settings: await updateSettings(body.settings) });
  } catch (err) {
    console.error("[admin/office-renewals]", body.op, err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
