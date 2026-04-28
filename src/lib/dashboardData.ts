import type Stripe from "stripe";
import { stripe } from "./stripe";

// Korporex doesn't have a database — Stripe Checkout sessions ARE the order
// log. This module wraps the Stripe API into shapes the dashboard pages
// render: a 30-day summary for the home stats grid, a paginated list for
// the orders page, and a session detail for the drill-in page.
//
// All functions return safe shapes when Stripe is not configured (e.g. no
// STRIPE_SECRET_KEY in dev) so the dashboard renders an empty state instead
// of crashing.

export type OrderSource = "incorporate" | "legal-consult" | "unknown";

export interface OrderSummary {
  sessionId: string;
  orderRef: string | null;
  source: OrderSource;
  status: Stripe.Checkout.Session["status"];
  paymentStatus: Stripe.Checkout.Session["payment_status"];
  amountTotal: number; // cents
  currency: string;
  customerEmail: string | null;
  customerName: string | null;
  jurisdiction: string | null;
  pkg: string | null;
  businessName: string | null;
  createdAt: number; // unix seconds
}

export interface DashboardStats {
  configured: boolean;
  liveMode: boolean | null;
  paidLast30Days: number;
  paidRevenueLast30Days: number; // cents
  abandonedLast30Days: number;
  totalSessionsLast30Days: number;
  recentOrders: OrderSummary[];
}

function classifySource(metadata: Stripe.Metadata | null): OrderSource {
  if (!metadata) return "unknown";
  // Incorporation orders set jurisdiction + pkg + businessName.
  if (metadata.jurisdiction && metadata.pkg) return "incorporate";
  // Legal consult orders set legalConsultRef or have a description hint.
  if (metadata.legalConsultRef || metadata.consultRef) return "legal-consult";
  return "unknown";
}

function summarize(session: Stripe.Checkout.Session): OrderSummary {
  const md = session.metadata ?? null;
  const customerName =
    md?.billingName?.toString() ||
    md?.primaryDirectorName?.toString() ||
    session.customer_details?.name ||
    null;
  const customerEmail =
    md?.primaryDirectorEmail?.toString() ||
    session.customer_details?.email ||
    session.customer_email ||
    null;
  return {
    sessionId: session.id,
    orderRef: md?.orderRef?.toString() ?? null,
    source: classifySource(md),
    status: session.status ?? "open",
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total ?? 0,
    currency: (session.currency ?? "cad").toLowerCase(),
    customerEmail,
    customerName,
    jurisdiction: md?.jurisdiction?.toString() ?? null,
    pkg: md?.pkg?.toString() ?? null,
    businessName: md?.businessName?.toString() ?? null,
    createdAt: session.created,
  };
}

async function listAllRecentSessions(maxToFetch = 100): Promise<Stripe.Checkout.Session[]> {
  if (!stripe) return [];
  const sessions: Stripe.Checkout.Session[] = [];
  // Newest first. The Stripe SDK auto-paginates; we cap by maxToFetch to keep
  // the dashboard fast for accounts with thousands of sessions.
  const params: Stripe.Checkout.SessionListParams = { limit: 100 };
  for await (const session of stripe.checkout.sessions.list(params)) {
    sessions.push(session);
    if (sessions.length >= maxToFetch) break;
  }
  return sessions;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!stripe) {
    return {
      configured: false,
      liveMode: null,
      paidLast30Days: 0,
      paidRevenueLast30Days: 0,
      abandonedLast30Days: 0,
      totalSessionsLast30Days: 0,
      recentOrders: [],
    };
  }

  const sessions = await listAllRecentSessions(100);
  const cutoff = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  let paidLast30Days = 0;
  let paidRevenueLast30Days = 0;
  let abandonedLast30Days = 0;
  let totalSessionsLast30Days = 0;
  let liveMode: boolean | null = null;

  for (const session of sessions) {
    if (liveMode === null) liveMode = session.livemode;
    if (session.created < cutoff) continue;
    totalSessionsLast30Days += 1;
    if (session.payment_status === "paid") {
      paidLast30Days += 1;
      paidRevenueLast30Days += session.amount_total ?? 0;
    } else if (session.status === "expired" || session.status === "open") {
      abandonedLast30Days += 1;
    }
  }

  const recentOrders = sessions.slice(0, 8).map(summarize);

  return {
    configured: true,
    liveMode,
    paidLast30Days,
    paidRevenueLast30Days,
    abandonedLast30Days,
    totalSessionsLast30Days,
    recentOrders,
  };
}

export interface OrdersPageResult {
  configured: boolean;
  orders: OrderSummary[];
}

export async function getOrders(filter?: "paid" | "open" | "all"): Promise<OrdersPageResult> {
  if (!stripe) return { configured: false, orders: [] };
  const sessions = await listAllRecentSessions(200);
  const filtered = sessions.filter((s) => {
    if (!filter || filter === "all") return true;
    if (filter === "paid") return s.payment_status === "paid";
    if (filter === "open") {
      return s.payment_status !== "paid" && (s.status === "open" || s.status === "expired");
    }
    return true;
  });
  return { configured: true, orders: filtered.map(summarize) };
}

export interface OrderDetail {
  configured: boolean;
  session: Stripe.Checkout.Session | null;
  lineItems: Stripe.LineItem[];
  paymentIntent: Stripe.PaymentIntent | null;
  source: OrderSource;
}

export async function getOrderDetail(sessionId: string): Promise<OrderDetail> {
  if (!stripe) {
    return { configured: false, session: null, lineItems: [], paymentIntent: null, source: "unknown" };
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer_details", "total_details"],
    });
    const lineItemsList = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });
    const paymentIntent =
      typeof session.payment_intent === "object" ? session.payment_intent : null;
    return {
      configured: true,
      session,
      lineItems: lineItemsList.data,
      paymentIntent,
      source: classifySource(session.metadata),
    };
  } catch {
    return { configured: true, session: null, lineItems: [], paymentIntent: null, source: "unknown" };
  }
}

export function formatCurrency(amountCents: number, currency: string): string {
  const amount = amountCents / 100;
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(unixSeconds: number): string {
  const diffMs = Date.now() - unixSeconds * 1000;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(unixSeconds * 1000).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
