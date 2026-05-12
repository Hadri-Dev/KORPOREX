import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";
import { getOrders } from "@/lib/dashboardData";
import { OrdersTable } from "./OrdersTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Filter = "all" | "paid" | "open";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "open", label: "Pending / abandoned" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const filter: Filter =
    sp.status === "paid" ? "paid" : sp.status === "open" ? "open" : "all";
  const { configured, orders } = await getOrders(filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          Stripe Checkout sessions, newest first. Click an order for full detail, or use the row
          menu to set an admin status or hide it from this view.
        </p>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => {
          const active = tab.key === filter;
          const href = tab.key === "all" ? "/dashboard/orders" : `/dashboard/orders?status=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              className={
                active
                  ? "border-b-2 border-navy-900 px-4 py-2 text-sm font-medium text-navy-900"
                  : "border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {!configured ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h2 className="font-semibold text-amber-900">Stripe not configured</h2>
              <p className="mt-1 text-sm text-amber-800">
                Set <code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code>{" "}
                to fetch orders.
              </p>
            </div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm">
          <Inbox className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-700">No orders match this filter</p>
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
