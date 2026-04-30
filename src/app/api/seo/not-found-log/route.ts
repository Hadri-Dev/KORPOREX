import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

// Admin-only list of 404 hits, paginated.
//   GET /api/seo/not-found-log?status=active|archived|all
//                              &sort=hits|last|first
//                              &page=1
//                              &q=<path search>
//
// Bulk action lives at POST /api/seo/not-found-log/bulk.

const PAGE_SIZE = 50;

const QUERY = z.object({
  status: z.enum(["active", "archived", "all"]).default("active"),
  sort: z.enum(["hits", "last", "first"]).default("last"),
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().trim().max(200).optional(),
});

export async function GET(req: NextRequest): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      rows: [],
      total: 0,
      page: 1,
      pageSize: PAGE_SIZE,
    });
  }

  const sp = req.nextUrl.searchParams;
  let parsed: z.infer<typeof QUERY>;
  try {
    parsed = QUERY.parse({
      status: sp.get("status") ?? undefined,
      sort: sp.get("sort") ?? undefined,
      page: sp.get("page") ?? undefined,
      q: sp.get("q") ?? undefined,
    });
  } catch {
    return NextResponse.json({ error: "invalid query" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  let query = supabase
    .from("not_found_log")
    .select("*", { count: "exact" });

  if (parsed.status === "active") query = query.eq("archived", false);
  else if (parsed.status === "archived") query = query.eq("archived", true);

  if (parsed.q) query = query.ilike("path", `%${parsed.q}%`);

  const sortColumn =
    parsed.sort === "hits" ? "hit_count" :
    parsed.sort === "first" ? "first_seen" :
    "last_seen";
  query = query.order(sortColumn, { ascending: false });

  const from = (parsed.page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("not_found_log list failed", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    rows: data ?? [],
    total: count ?? 0,
    page: parsed.page,
    pageSize: PAGE_SIZE,
  });
}
