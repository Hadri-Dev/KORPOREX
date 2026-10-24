import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  annualFee,
  applyRenewalPayment,
  deleteClient,
  getClient,
  getSettings,
  logEvent,
  sendManualReminder,
  updateClient,
} from "@/lib/officeRenewals";
import { isIsoDate } from "@/lib/officeRenewalLogic";
import { CLIENT_PATCH } from "../schemas";

// Admin-only per-client endpoint for /dashboard/office-renewals.
//
//   PATCH  /api/admin/office-renewals/<id>   edit fields and/or status
//   DELETE /api/admin/office-renewals/<id>   remove client + its activity
//   POST   /api/admin/office-renewals/<id>   { action: "send-reminder" | "mark-paid" }

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const STATUS_LABELS: Record<string, string> = {
  active: "Reminders active",
  paused: "Reminders paused",
  moving: "Marked as moving away",
  closed: "File closed (not renewing)",
};

async function guard(): Promise<Response | null> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured on this environment" }, { status: 503 });
  }
  return null;
}

function fail(err: unknown): Response {
  console.error("[admin/office-renewals/id]", err);
  return NextResponse.json({ error: err instanceof Error ? err.message : "failed" }, { status: 500 });
}

export async function PATCH(req: Request, { params }: Ctx): Promise<Response> {
  const blocked = await guard();
  if (blocked) return blocked;
  const { id } = await params;

  let patch: z.infer<typeof CLIENT_PATCH>;
  try {
    patch = CLIENT_PATCH.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: err instanceof z.ZodError ? err.issues[0]?.message : "invalid body" }, { status: 400 });
  }

  try {
    const before = await getClient(id);
    if (!before) return NextResponse.json({ error: "not found" }, { status: 404 });
    const client = await updateClient(id, patch);
    if (patch.status && patch.status !== before.status) {
      await logEvent(id, "status", { detail: STATUS_LABELS[patch.status] });
    }
    if (patch.renewsOn && patch.renewsOn !== before.renewsOn) {
      await logEvent(id, "note", { detail: `Renewal date changed from ${before.renewsOn} to ${patch.renewsOn}` });
    }
    return NextResponse.json({ client });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx): Promise<Response> {
  const blocked = await guard();
  if (blocked) return blocked;
  const { id } = await params;
  try {
    await deleteClient(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

// mark-paid carries the term the owner saw on screen, so a double click (or a
// stale tab) cannot add a second year: applyRenewalPayment only advances when
// it still matches renews_on.
const ACTION = z.discriminatedUnion("action", [
  z.object({ action: z.literal("send-reminder") }),
  z.object({ action: z.literal("mark-paid"), termEndsOn: z.string().refine(isIsoDate) }),
]);

export async function POST(req: Request, { params }: Ctx): Promise<Response> {
  const blocked = await guard();
  if (blocked) return blocked;
  const { id } = await params;

  let body: z.infer<typeof ACTION>;
  try {
    body = ACTION.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  try {
    const client = await getClient(id);
    if (!client) return NextResponse.json({ error: "not found" }, { status: 404 });

    if (body.action === "send-reminder") {
      const kind = await sendManualReminder(client, await getSettings());
      return NextResponse.json({ ok: true, kind });
    }

    const fee = annualFee(client.location).toFixed(2);
    const result = await applyRenewalPayment({
      clientId: client.id,
      termEndsOn: body.termEndsOn,
      amountLabel: `$${fee} CAD + tax`,
      method: "manual",
    });
    return NextResponse.json({ ok: result.applied, client: result.client });
  } catch (err) {
    return fail(err);
  }
}
