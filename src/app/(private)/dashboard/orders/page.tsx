import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";
import { getOrders } from "@/lib/dashboardData";
import { shortTrafficSource } from "@/lib/attribution";
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

  // Paid orders in this view, counted by where the customer first came from.
  const paidBySource = new Map<string, number>();
  for (const order of orders) {
    if (order.paymentStatus !== "paid") continue;
    const label = order.trafficSource ? shortTrafficSource(order.trafficSource) : "not tracked";
    paidBySource.set(label, (paidBySource.get(label) ?? 0) + 1);
  }
  const sourceCounts = Array.from(paidBySource.entries()).sort((a, b) => b[1] - a[1]);

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
        <>
          {sourceCounts.length > 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Paid orders by source
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {sourceCounts.map(([label, count]) => (
                  <li
                    key={label}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                  >
                    {label} <span className="font-semibold text-navy-900">{count}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                &ldquo;Not tracked&rdquo; means the order was placed before every visit was
                being recorded (2026-11-27).
              </p>
            </div>
          ) : null}
          <OrdersTable orders={orders} />
        </>
      )}
    </div>
  );
}
