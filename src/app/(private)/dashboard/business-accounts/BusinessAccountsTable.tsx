"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Ban, PlayCircle, Inbox, Loader2 } from "lucide-react";
import type { BusinessAccount, BusinessAccountStatus } from "@/lib/businessAccounts";

interface Row extends BusinessAccount {
  mtdOrders: number;
  mtdTotalCents: number;
}

export default function BusinessAccountsTable({ accounts }: { accounts: Row[] }) {
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function act(id: string, action: "suspend" | "reactivate" | "reset_password") {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/business-accounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setNote(`Failed: ${data.error ?? res.statusText}`);
        return;
      }
      if (action === "reset_password") {
        setNote("Password reset email sent.");
      } else {
        setNote(action === "suspend" ? "Account suspended from new credit orders." : "Account reactivated.");
        router.refresh();
      }
    } catch (err) {
      setNote(`Failed: ${(err as Error).message}`);
    } finally {
      setPendingId(null);
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
        <Inbox className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-700">No business accounts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {note ? (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{note}</div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th align="right">Open orders</Th>
              <Th align="right">Open total</Th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {accounts.map((account) => {
              const pending = pendingId === account.id;
              return (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="text-sm font-medium text-navy-900">{account.companyName}</div>
                    <div className="text-xs text-gray-500">{account.billingEmail}</div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={account.status} />
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-gray-900">{account.mtdOrders}</td>
                  <td className="px-5 py-3 text-right text-sm text-gray-900">
                    ${(account.mtdTotalCents / 100).toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => act(account.id, "reset_password")}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
                        Reset password
                      </button>
                      {account.status === "suspended" ? (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => act(account.id, "reactivate")}
                          className="inline-flex items-center gap-1 rounded-md border border-green-300 bg-white px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                        >
                          <PlayCircle className="h-3.5 w-3.5" />
                          Reactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => act(account.id, "suspend")}
                          className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

function StatusPill({ status }: { status: BusinessAccountStatus }) {
  const styles: Record<BusinessAccountStatus, string> = {
    active: "bg-green-100 text-green-800",
    past_due: "bg-amber-100 text-amber-800",
    suspended: "bg-red-100 text-red-800",
  };
  const labels: Record<BusinessAccountStatus, string> = {
    active: "Active",
    past_due: "Past due",
    suspended: "Suspended",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
