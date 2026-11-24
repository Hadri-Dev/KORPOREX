"use client";

import { useState } from "react";
import { KeyRound, Ban, PlayCircle, Info } from "lucide-react";

// ⚠️ PREVIEW ONLY — hardcoded demo rows, no Supabase table behind this yet.
// Shows where business accounts would live in the admin dashboard once the
// real backend (Supabase tables + Stripe Customers) is built.

interface DemoAccount {
  id: string;
  companyName: string;
  billingEmail: string;
  status: "active" | "past_due" | "suspended";
  mtdOrders: number;
  mtdTotal: number;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "1",
    companyName: "Maple Ridge Law LLP",
    billingEmail: "jordan@mapleridgelaw.ca",
    status: "active",
    mtdOrders: 14,
    mtdTotal: 632.46,
  },
  {
    id: "2",
    companyName: "Sterling Chartered Accountants",
    billingEmail: "billing@sterlingca.ca",
    status: "active",
    mtdOrders: 6,
    mtdTotal: 265.34,
  },
  {
    id: "3",
    companyName: "Northgate Paralegal Services",
    billingEmail: "accounts@northgateparalegal.ca",
    status: "past_due",
    mtdOrders: 9,
    mtdTotal: 398.01,
  },
];

export default function BusinessAccountsPreview() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          <strong>Preview only.</strong> These are hardcoded demo rows, not real accounts — no
          Supabase table or Stripe Customer exists behind this page yet. It shows where this will
          live once the real backend is built.
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-navy-900">Business Accounts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Law firms, accountants, and other customers billed monthly instead of per order.
          </p>
        </div>
      </div>

      {note ? (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          {note}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th align="right">Orders (MTD)</Th>
              <Th align="right">Total (MTD)</Th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {DEMO_ACCOUNTS.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <Td>
                  <div className="text-sm font-medium text-navy-900">{account.companyName}</div>
                  <div className="text-xs text-gray-500">{account.billingEmail}</div>
                </Td>
                <Td>
                  <StatusPill status={account.status} />
                </Td>
                <Td align="right">{account.mtdOrders}</Td>
                <Td align="right">${account.mtdTotal.toFixed(2)}</Td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNote(
                          `Preview: a password reset email would now be sent to ${account.billingEmail}.`,
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      Reset password
                    </button>
                    {account.status === "suspended" ? (
                      <button
                        type="button"
                        onClick={() =>
                          setNote(`Preview: ${account.companyName} would be reactivated for credit ordering.`)
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-green-300 bg-white px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Reactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setNote(
                            `Preview: ${account.companyName} would be suspended from new credit orders. They could still order as a normal paying customer via Checkout.`,
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
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

function Td({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <td className={align === "right" ? "px-5 py-3 text-right text-sm text-gray-900" : "px-5 py-3 text-left"}>
      {children}
    </td>
  );
}

function StatusPill({ status }: { status: DemoAccount["status"] }) {
  const styles: Record<DemoAccount["status"], string> = {
    active: "bg-green-100 text-green-800",
    past_due: "bg-amber-100 text-amber-800",
    suspended: "bg-red-100 text-red-800",
  };
  const labels: Record<DemoAccount["status"], string> = {
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
