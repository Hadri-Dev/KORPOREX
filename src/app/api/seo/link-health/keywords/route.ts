import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

// GET  /api/seo/link-health/keywords      → list all (admin)
// POST /api/seo/link-health/keywords      → create (admin)

const POST_BODY = z.object({
  keyword: z.string().trim().min(1).max(200),
  target_page: z.string().trim().min(1).max(500),
  priority: z.number().int().min(0).max(10000).default(100),
  is_active: z.boolean().default(true),
});

export async function GET(): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, rows: [] });
  }
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("internal_link_keywords")
    .select("*")
    .order("priority", { ascending: true })
    .order("keyword", { ascending: true });
  if (error) {
    console.error("link-health keywords GET", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ configured: true, rows: data ?? [] });
}

export async function POST(req: NextRequest): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 503 });
  }

  let payload: z.infer<typeof POST_BODY>;
  try {
    payload = POST_BODY.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("internal_link_keywords")
    .insert({
      keyword: payload.keyword,
      target_page: payload.target_page,
      priority: payload.priority,
      is_active: payload.is_active,
    })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "duplicate (keyword + target_page)" }, { status: 409 });
    }
    console.error("link-health keywords POST", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ row: data }, { status: 201 });
}
