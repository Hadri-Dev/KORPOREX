import { NextResponse } from "next/server";
import { loadOfficeRenewals, sendAutoReminder, syncFromStripe } from "@/lib/officeRenewals";
import { daysBetween, dueReminder, torontoDate, type ReminderKind } from "@/lib/officeRenewalLogic";

// Daily Registered Office renewal run, triggered by the Vercel cron in
// vercel.json (13:00 UTC = 9 AM Toronto in summer, 8 AM in winter).
//
//   1. Pull the last 3 days of paid Stripe sessions so any Registered Office
//      buyer the webhook missed still lands on the board.
//   2. For each active client, send the one reminder whose window they are in
//      (see reminderWindow in officeRenewalLogic.ts), if not already sent for
//      the current term.
//
// Emails go only to clients whose renewal date is near. There is deliberately
// no recurring owner summary: the owner removed the Monday digest (2026-11-16)
// because it arrived every week even with nothing due. The dashboard board is
// the overview; per-event owner alerts (paid, moving) still fire.
//
// Vercel sends `Authorization: Bearer $CRON_SECRET`; anything else is refused.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not set" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let synced: Record<string, number> | { error: string };
  try {
    synced = await syncFromStripe(Math.floor(Date.now() / 1000) - 3 * 86_400);
  } catch (err) {
    console.error("[cron/office-renewals] Stripe sync failed:", err);
    synced = { error: String(err) };
  }

  const data = await loadOfficeRenewals();
  if (data.state !== "ok") {
    return NextResponse.json({ error: data.state, synced }, { status: 503 });
  }

  const today = torontoDate();
  const sent: Array<{ business: string; kind: ReminderKind }> = [];
  const failed: Array<{ business: string; error: string }> = [];

  for (const client of data.clients) {
    const already = new Set<ReminderKind>(
      data.events
        .filter((e) => e.clientId === client.id && e.termEndsOn === client.renewsOn && e.kind.startsWith("reminder_"))
        .map((e) => e.kind.slice("reminder_".length) as ReminderKind),
    );
    const kind = dueReminder(daysBetween(today, client.renewsOn), client.status, data.settings, already);
    if (!kind) continue;
    try {
      if (await sendAutoReminder(client, kind, data.settings)) {
        sent.push({ business: client.businessName, kind });
      }
    } catch (err) {
      console.error("[cron/office-renewals] reminder failed:", client.id, kind, err);
      failed.push({ business: client.businessName, error: String(err) });
    }
  }

  return NextResponse.json({ today, synced, sent, failed });
}
