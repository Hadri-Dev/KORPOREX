import { isSupabaseConfigured } from "@/lib/supabase";
import { getOpenOrderSummaries, listBusinessAccounts } from "@/lib/businessAccounts";
import BusinessAccountsTable from "./BusinessAccountsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BusinessAccountsPage() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Business Accounts</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
          Supabase is not configured on this environment.
        </div>
      </div>
    );
  }

  const [accounts, summaries] = await Promise.all([listBusinessAccounts(), getOpenOrderSummaries()]);
  const rows = accounts.map((a) => ({
    ...a,
    mtdOrders: summaries[a.id]?.mtdOrders ?? 0,
    mtdTotalCents: summaries[a.id]?.mtdTotalCents ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Business Accounts</h1>
        <p className="mt-1 text-sm text-gray-600">
          Law firms, accountants, and other customers billed monthly instead of per order.
        </p>
      </div>
      <BusinessAccountsTable accounts={rows} />
    </div>
  );
}
