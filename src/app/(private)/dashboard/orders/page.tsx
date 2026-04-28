import Link from "next/link";
import { AlertCircle, Inbox } from "lucide-react";
import { formatCurrency, formatRelative, getOrders } from "@/lib/dashboardData";

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
          Stripe Checkout sessions, newest first. Click an order for full detail.
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
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Business</Th>
                <Th>Status</Th>
                <Th align="right">Amount</Th>
                <Th align="right">Created</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.sessionId} className="hover:bg-gray-50">
                  <Td>
                    <Link
                      href={`/dashboard/orders/${order.sessionId}`}
                      className="font-medium text-navy-900 hover:underline"
                    >
                      {order.orderRef ?? order.sessionId.slice(-10)}
                    </Link>
                    {order.source !== "incorporate" ? (
                      <p className="text-xs text-gray-500">
                        {order.source === "legal-consult"
                          ? "Legal consultation"
                          : "Other"}
                      </p>
                    ) : null}
                  </Td>
                  <Td>
                    <div className="text-sm text-gray-900">
                      {order.customerName ?? "—"}
                    </div>
                    <div className="text-xs text-gray-500">{order.customerEmail ?? ""}</div>
                  </Td>
                  <Td>
                    <div className="text-sm text-gray-900">
                      {order.businessName ?? "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {[order.jurisdiction, order.pkg].filter(Boolean).join(" · ")}
                    </div>
                  </Td>
                  <Td>
                    <StatusPill paymentStatus={order.paymentStatus} status={order.status} />
                  </Td>
                  <Td align="right">
                    <span className="font-medium text-navy-900">
                      {formatCurrency(order.amountTotal, order.currency)}
                    </span>
                  </Td>
                  <Td align="right">
                    <span className="text-xs text-gray-500">{formatRelative(order.createdAt)}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th
      scope="col"
      className={
        align === "right"
          ? "px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
          : "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
      }
    >
      {children}
    </th>
  );
}

function Td({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <td className={align === "right" ? "px-5 py-3 text-right" : "px-5 py-3 text-left"}>
      {children}
    </td>
  );
}

function StatusPill({
  paymentStatus,
  status,
}: {
  paymentStatus: string;
  status: string | null;
}) {
  if (paymentStatus === "paid") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
        Paid
      </span>
    );
  }
  if (status === "expired") {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
        Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      Pending
    </span>
  );
}
