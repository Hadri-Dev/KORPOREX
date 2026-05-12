import { getSupabaseServiceClient, isSupabaseConfigured } from "./supabase";

// Admin-managed metadata layered on top of Stripe Checkout sessions. See
// supabase/migrations/0005_order_overrides.sql for the table definition.
//
// All functions in this module are server-only. They use the service-role
// Supabase client and must not be imported from client components.

export type AdminOrderStatus =
  | "transaction_approved"
  | "money_received"
  | "money_not_received"
  | "pending_approval";

export const ADMIN_ORDER_STATUSES: ReadonlyArray<AdminOrderStatus> = [
  "transaction_approved",
  "money_received",
  "money_not_received",
  "pending_approval",
];

export const ADMIN_ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  transaction_approved: "Transaction Approved",
  money_received: "Money Received",
  money_not_received: "Money Not Received",
  pending_approval: "Pending Approval",
};

export interface OrderOverride {
  sessionId: string;
  adminStatus: AdminOrderStatus | null;
  deleted: boolean;
}

interface OrderOverrideRow {
  session_id: string;
  admin_status: AdminOrderStatus | null;
  deleted: boolean;
}

function rowToOverride(row: OrderOverrideRow): OrderOverride {
  return {
    sessionId: row.session_id,
    adminStatus: row.admin_status,
    deleted: row.deleted,
  };
}

export async function listOrderOverrides(sessionIds: string[]): Promise<Map<string, OrderOverride>> {
  const result = new Map<string, OrderOverride>();
  if (!isSupabaseConfigured() || sessionIds.length === 0) return result;
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("order_overrides")
    .select("session_id, admin_status, deleted")
    .in("session_id", sessionIds);
  if (error || !data) return result;
  for (const row of data as OrderOverrideRow[]) {
    result.set(row.session_id, rowToOverride(row));
  }
  return result;
}

export async function getOrderOverride(sessionId: string): Promise<OrderOverride | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("order_overrides")
    .select("session_id, admin_status, deleted")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (error || !data) return null;
  return rowToOverride(data as OrderOverrideRow);
}

export async function upsertOrderOverride(args: {
  sessionId: string;
  adminStatus?: AdminOrderStatus | null;
  deleted?: boolean;
}): Promise<OrderOverride | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseServiceClient();

  // Read existing values so we preserve fields the caller didn't pass.
  const existing = await getOrderOverride(args.sessionId);
  const payload: OrderOverrideRow = {
    session_id: args.sessionId,
    admin_status:
      args.adminStatus !== undefined ? args.adminStatus : (existing?.adminStatus ?? null),
    deleted: args.deleted !== undefined ? args.deleted : (existing?.deleted ?? false),
  };

  const { data, error } = await supabase
    .from("order_overrides")
    .upsert(payload, { onConflict: "session_id" })
    .select("session_id, admin_status, deleted")
    .single();
  if (error || !data) return null;
  return rowToOverride(data as OrderOverrideRow);
}
