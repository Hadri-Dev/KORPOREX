import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowUpRight,
  Inbox,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import {
  formatCurrency,
  formatRelative,
  getDashboardStats,
} from "@/lib/dashboardData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">
            Overview
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Live snapshot of incorporation orders from Stripe.
          </p>
        </div>
        {stats.configured ? (
          <span
            className={
              stats.liveMode
                ? "inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                : "inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
            }
          >
            Stripe {stats.liveMode ? "live mode" : "test mode"}
          </span>
        ) : null}
      </div>

      {!stats.configured ? (
        <NotConfiguredBanner />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Paid orders"
              value={stats.paidLast30Days.toString()}
              hint="Last 30 days"
              icon={CheckCircle2}
              href="/dashboard/orders?status=paid"
            />
            <StatCard
              title="Revenue"
              value={formatCurrency(stats.paidRevenueLast30Days, "cad")}
              hint="Last 30 days, paid only"
              icon={CreditCard}
              href="/dashboard/orders?status=paid"
            />
            <StatCard
              title="Abandoned"
              value={stats.abandonedLast30Days.toString()}
              hint="Last 30 days, unpaid"
              icon={AlertCircle}
              emphasis={stats.abandonedLast30Days > 0 ? "warning" : "default"}
              href="/dashboard/orders?status=open"
            />
            <StatCard
              title="Total sessions"
              value={stats.totalSessionsLast30Days.toString()}
              hint="Last 30 days, all states"
              icon={Activity}
              href="/dashboard/orders"
            />
          </div>

          <RecentOrders orders={stats.recentOrders} />
        </>
      )}
    </div>
  );
}

function NotConfiguredBanner() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <h2 className="font-semibold text-amber-900">Stripe not configured</h2>
          <p className="mt-1 text-sm text-amber-800">
            <code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code> is not set
            on this environment. Once it&apos;s set, this page shows live orders, revenue,
            and abandoned-cart counts pulled from Stripe Checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

function RecentOrders({ orders }: { orders: Awaited<ReturnType<typeof getDashboardStats>>["recentOrders"] }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="font-serif text-lg font-semibold text-navy-900">Recent orders</h2>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 hover:underline"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      {orders.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <Inbox className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-700">No orders yet</p>
          <p className="mt-1 text-xs text-gray-500">
            New Stripe Checkout sessions will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {orders.map((order) => (
            <li key={order.sessionId}>
              <Link
                href={`/dashboard/orders/${order.sessionId}`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-navy-900">
                      {order.orderRef ?? order.sessionId.slice(-10)}
                    </p>
                    <StatusPill paymentStatus={order.paymentStatus} status={order.status} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {[
                      order.customerName,
                      order.customerEmail,
                      order.businessName,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy-900">
                    {formatCurrency(order.amountTotal, order.currency)}
                  </p>
                  <p className="text-xs text-gray-500">{formatRelative(order.createdAt)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
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
