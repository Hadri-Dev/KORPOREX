"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Trash2, Tag, Loader2 } from "lucide-react";
import { formatCurrency, formatRelative, type OrderSummary } from "@/lib/dashboardData";
import {
  ADMIN_ORDER_STATUSES,
  ADMIN_ORDER_STATUS_LABELS,
  type AdminOrderStatus,
} from "@/lib/orderOverrides";

interface OrdersTableProps {
  orders: OrderSummary[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
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
            <th
              scope="col"
              className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order, idx) => (
            <OrderRow
              key={order.sessionId}
              order={order}
              // Flip the menu UPWARD for the last two rows so it doesn't get
              // clipped by the table wrapper's overflow-hidden (needed for
              // the rounded corners). For upper rows the menu drops down
              // and overlaps subsequent rows, which is fine.
              flipUp={idx >= orders.length - 2}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow({ order, flipUp }: { order: OrderSummary; flipUp: boolean }) {
  return (
    <tr className="hover:bg-gray-50">
      <Td>
        <Link
          href={`/dashboard/orders/${order.sessionId}`}
          className="font-medium text-navy-900 hover:underline"
        >
          {order.orderRef ?? order.sessionId.slice(-10)}
        </Link>
        {order.source !== "incorporate" ? (
          <p className="text-xs text-gray-500">
            {order.source === "legal-consult" ? "Legal consultation" : "Other"}
          </p>
        ) : null}
      </Td>
      <Td>
        <div className="text-sm text-gray-900">{order.customerName ?? "—"}</div>
        <div className="text-xs text-gray-500">{order.customerEmail ?? ""}</div>
      </Td>
      <Td>
        <div className="text-sm text-gray-900">{order.businessName ?? "—"}</div>
        <div className="text-xs text-gray-500">
          {[order.jurisdiction, order.pkg].filter(Boolean).join(" · ")}
        </div>
      </Td>
      <Td>
        <div className="flex flex-col items-start gap-1">
          <StripeStatusPill paymentStatus={order.paymentStatus} status={order.status} />
          {order.adminStatus ? <AdminStatusPill status={order.adminStatus} /> : null}
        </div>
      </Td>
      <Td align="right">
        <span className="font-medium text-navy-900">
          {formatCurrency(order.amountTotal, order.currency)}
        </span>
      </Td>
      <Td align="right">
        <span className="text-xs text-gray-500">{formatRelative(order.createdAt)}</span>
      </Td>
      <td className="px-3 py-3 text-right">
        <RowActions
          sessionId={order.sessionId}
          currentAdminStatus={order.adminStatus}
          flipUp={flipUp}
        />
      </td>
    </tr>
  );
}

function RowActions({
  sessionId,
  currentAdminStatus,
  flipUp,
}: {
  sessionId: string;
  currentAdminStatus: AdminOrderStatus | null;
  flipUp: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<"root" | "modify">("root");
  const [pending, setPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickAway(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSubmenu("root");
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setSubmenu("root");
      }
    }
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function patch(body: { adminStatus?: AdminOrderStatus | null; deleted?: boolean }) {
    setPending(true);
    try {
      const res = await fetch(`/api/admin/orders/${sessionId}/override`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        alert(`Update failed: ${data.error ?? res.statusText}`);
        return;
      }
      setOpen(false);
      setSubmenu("root");
      router.refresh();
    } catch (err) {
      alert(`Update failed: ${(err as Error).message}`);
    } finally {
      setPending(false);
    }
  }

  function onDelete() {
    if (!confirm("Hide this order from your dashboard? This does not refund or affect Stripe.")) {
      return;
    }
    patch({ deleted: true });
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setSubmenu("root");
        }}
        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={pending}
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
      </button>

      {open ? (
        <div
          role="menu"
          className={
            flipUp
              ? "absolute right-0 bottom-full z-10 mb-1 w-56 origin-bottom-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black/5"
              : "absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black/5"
          }
        >
          {submenu === "root" ? (
            <div className="py-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => setSubmenu("modify")}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <Tag className="h-4 w-4 text-gray-400" />
                Modify
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={onDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          ) : (
            <div className="py-1">
              <div className="border-b border-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Set status
              </div>
              {ADMIN_ORDER_STATUSES.map((status) => {
                const active = status === currentAdminStatus;
                return (
                  <button
                    key={status}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => patch({ adminStatus: status })}
                    className={
                      active
                        ? "flex w-full items-center gap-2 bg-navy-50 px-3 py-2 text-left text-sm font-medium text-navy-900"
                        : "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {ADMIN_ORDER_STATUS_LABELS[status]}
                  </button>
                );
              })}
              {currentAdminStatus ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => patch({ adminStatus: null })}
                  className="mt-1 flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2 text-left text-xs text-gray-500 hover:bg-gray-50"
                >
                  Clear admin status
                </button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
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

function StripeStatusPill({
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

function AdminStatusPill({ status }: { status: AdminOrderStatus }) {
  const styles: Record<AdminOrderStatus, string> = {
    transaction_approved: "bg-emerald-100 text-emerald-800",
    money_received: "bg-blue-100 text-blue-800",
    money_not_received: "bg-red-100 text-red-800",
    pending_approval: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {ADMIN_ORDER_STATUS_LABELS[status]}
    </span>
  );
}
