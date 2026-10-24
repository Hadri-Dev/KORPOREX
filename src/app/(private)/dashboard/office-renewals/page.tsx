import { AlertCircle } from "lucide-react";
import { annualFee, clientLink, loadOfficeRenewals, locationLabel } from "@/lib/officeRenewals";
import { daysBetween, torontoDate } from "@/lib/officeRenewalLogic";
import { isStripeConfigured } from "@/lib/stripe";
import { OfficeRenewalsBoard, type BoardClient } from "./OfficeRenewalsBoard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Registered Office renewals: every corporation using a Korporex office,
// sorted by where it is in the renewal cycle. Data + reminder rules live in
// src/lib/officeRenewals.ts and src/lib/officeRenewalLogic.ts; the daily
// sender is /api/cron/office-renewals.

export default async function OfficeRenewalsPage() {
  const data = await loadOfficeRenewals();

  if (data.state !== "ok") {
    return (
      <div className="space-y-6">
        <Header />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h2 className="font-semibold text-amber-900">
                {data.state === "not-configured" ? "Supabase not configured" : "One-time setup needed"}
              </h2>
              <p className="mt-1 text-sm text-amber-800">
                {data.state === "not-configured" ? (
                  <>
                    Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                    <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>.
                  </>
                ) : (
                  <>
                    Run <code className="rounded bg-amber-100 px-1">supabase/migrations/0006_office_renewals.sql</code>{" "}
                    in the Supabase SQL Editor, then reload this page. ({data.message})
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const today = torontoDate();
  const clients: BoardClient[] = data.clients.map((c) => ({
    ...c,
    locationLabel: locationLabel(c.location),
    fee: annualFee(c.location),
    daysLeft: daysBetween(today, c.renewsOn),
    link: clientLink(c),
    events: data.events.filter((e) => e.clientId === c.id),
  }));

  return (
    <div className="space-y-6">
      <Header />
      <OfficeRenewalsBoard
        clients={clients}
        settings={data.settings}
        today={today}
        stripeConfigured={isStripeConfigured()}
        cronConfigured={Boolean(process.env.CRON_SECRET)}
      />
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-navy-900">Office Renewals</h1>
      <p className="mt-1 text-sm text-gray-600">
        Every corporation using a Korporex registered office, sorted by where it is in the renewal cycle.
        Reminders send automatically each morning.
      </p>
    </div>
  );
}
