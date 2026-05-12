import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import {
  ADMIN_ORDER_STATUSES,
  upsertOrderOverride,
  type AdminOrderStatus,
} from "@/lib/orderOverrides";
import { isSupabaseConfigured } from "@/lib/supabase";

// Admin-only endpoint for managing per-order overrides — the side row that
// /dashboard/orders uses to layer admin lifecycle status + soft-delete onto
// the underlying Stripe Checkout session.
//
//   PATCH /api/admin/orders/<sessionId>/override
//
// Body fields (all optional, at least one required):
//   - adminStatus: one of ADMIN_ORDER_STATUSES, or null to clear
//   - deleted:     boolean. true hides the order from every dashboard tab.
//
// The Stripe session itself is never modified; this only touches the
// public.order_overrides table.

const BODY = z
  .object({
    adminStatus: z
      .enum(ADMIN_ORDER_STATUSES as unknown as [AdminOrderStatus, ...AdminOrderStatus[]])
      .nullable()
      .optional(),
    deleted: z.boolean().optional(),
  })
  .refine((v) => v.adminStatus !== undefined || v.deleted !== undefined, {
    message: "Provide adminStatus or deleted",
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured on this environment" },
      { status: 503 },
    );
  }

  const { sessionId } = await params;
  if (!sessionId) {
    return NextResponse.json({ error: "missing sessionId" }, { status: 400 });
  }

  let parsed: z.infer<typeof BODY>;
  try {
    parsed = BODY.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const result = await upsertOrderOverride({
    sessionId,
    adminStatus: parsed.adminStatus,
    deleted: parsed.deleted,
  });
  if (!result) {
    return NextResponse.json({ error: "failed to persist override" }, { status: 500 });
  }
  return NextResponse.json({ override: result });
}
