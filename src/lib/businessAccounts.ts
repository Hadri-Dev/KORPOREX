import { getSupabaseServiceClient, isSupabaseConfigured } from "./supabase";

// Server-only store for business (monthly-billed) accounts. Table defined in
// supabase/migrations/0008_business_accounts.sql. Every function uses the
// service-role client; never import this from a client component.

export type BusinessAccountStatus = "active" | "past_due" | "suspended";

export interface BusinessAccount {
  id: string;
  authUserId: string;
  companyName: string;
  contactName: string | null;
  billingEmail: string;
  stripeCustomerId: string | null;
  status: BusinessAccountStatus;
  createdAt: string;
}

export type BusinessOrderStatus = "open" | "invoiced" | "paid" | "void";

export interface BusinessOrder {
  id: string;
  businessAccountId: string;
  orderRef: string;
  productType: string;
  description: string | null;
  amountCents: number;
  currency: string;
  status: BusinessOrderStatus;
  stripeInvoiceId: string | null;
  createdAt: string;
}

interface AccountRow {
  id: string;
  auth_user_id: string;
  company_name: string;
  contact_name: string | null;
  billing_email: string;
  stripe_customer_id: string | null;
  status: BusinessAccountStatus;
  created_at: string;
}

interface OrderRow {
  id: string;
  business_account_id: string;
  order_ref: string;
  product_type: string;
  description: string | null;
  amount_cents: number;
  currency: string;
  status: BusinessOrderStatus;
  stripe_invoice_id: string | null;
  created_at: string;
}

function rowToAccount(r: AccountRow): BusinessAccount {
  return {
    id: r.id,
    authUserId: r.auth_user_id,
    companyName: r.company_name,
    contactName: r.contact_name,
    billingEmail: r.billing_email,
    stripeCustomerId: r.stripe_customer_id,
    status: r.status,
    createdAt: r.created_at,
  };
}

function rowToOrder(r: OrderRow): BusinessOrder {
  return {
    id: r.id,
    businessAccountId: r.business_account_id,
    orderRef: r.order_ref,
    productType: r.product_type,
    description: r.description,
    amountCents: r.amount_cents,
    currency: r.currency,
    status: r.status,
    stripeInvoiceId: r.stripe_invoice_id,
    createdAt: r.created_at,
  };
}

function requireConfigured() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured — set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.");
  }
}

export async function createBusinessAccount(args: {
  authUserId: string;
  companyName: string;
  contactName: string | null;
  billingEmail: string;
  stripeCustomerId: string;
}): Promise<BusinessAccount> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("business_accounts")
    .insert({
      auth_user_id: args.authUserId,
      company_name: args.companyName,
      contact_name: args.contactName,
      billing_email: args.billingEmail,
      stripe_customer_id: args.stripeCustomerId,
      status: "active",
    })
    .select()
    .single();
  if (error) throw error;
  return rowToAccount(data as AccountRow);
}

export async function getBusinessAccountById(id: string): Promise<BusinessAccount | null> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("business_accounts").select().eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToAccount(data as AccountRow) : null;
}

export async function getBusinessAccountByAuthUserId(authUserId: string): Promise<BusinessAccount | null> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("business_accounts")
    .select()
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToAccount(data as AccountRow) : null;
}

export async function getBusinessAccountByStripeCustomerId(stripeCustomerId: string): Promise<BusinessAccount | null> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("business_accounts")
    .select()
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToAccount(data as AccountRow) : null;
}

export async function setBusinessAccountStatus(id: string, status: BusinessAccountStatus): Promise<void> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("business_accounts").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function listBusinessAccounts(): Promise<BusinessAccount[]> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("business_accounts")
    .select()
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as AccountRow[]).map(rowToAccount);
}

export async function recordBusinessOrder(args: {
  businessAccountId: string;
  orderRef: string;
  productType: string;
  description: string;
  amountCents: number;
  currency?: string;
}): Promise<BusinessOrder> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("business_orders")
    .insert({
      business_account_id: args.businessAccountId,
      order_ref: args.orderRef,
      product_type: args.productType,
      description: args.description,
      amount_cents: args.amountCents,
      currency: args.currency ?? "cad",
      status: "open",
    })
    .select()
    .single();
  if (error) throw error;
  return rowToOrder(data as OrderRow);
}

export async function listOpenOrdersForAccount(businessAccountId: string): Promise<BusinessOrder[]> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("business_orders")
    .select()
    .eq("business_account_id", businessAccountId)
    .eq("status", "open")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as OrderRow[]).map(rowToOrder);
}

export interface AccountOrderSummary {
  mtdOrders: number;
  mtdTotalCents: number;
}

/** Open (unbilled, this-month) order count + total for every account, keyed by account id. */
export async function getOpenOrderSummaries(): Promise<Record<string, AccountOrderSummary>> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("business_orders")
    .select("business_account_id, amount_cents")
    .eq("status", "open");
  if (error) throw error;
  const summaries: Record<string, AccountOrderSummary> = {};
  for (const row of data as Array<{ business_account_id: string; amount_cents: number }>) {
    const existing = summaries[row.business_account_id] ?? { mtdOrders: 0, mtdTotalCents: 0 };
    existing.mtdOrders += 1;
    existing.mtdTotalCents += row.amount_cents;
    summaries[row.business_account_id] = existing;
  }
  return summaries;
}

export async function markOrdersInvoiced(orderIds: string[], stripeInvoiceId: string): Promise<void> {
  if (orderIds.length === 0) return;
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("business_orders")
    .update({ status: "invoiced", stripe_invoice_id: stripeInvoiceId })
    .in("id", orderIds);
  if (error) throw error;
}

export async function markInvoiceOrdersPaid(stripeInvoiceId: string): Promise<void> {
  requireConfigured();
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("business_orders")
    .update({ status: "paid" })
    .eq("stripe_invoice_id", stripeInvoiceId);
  if (error) throw error;
}
