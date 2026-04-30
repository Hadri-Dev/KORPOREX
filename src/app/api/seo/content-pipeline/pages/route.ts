import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { PAGE_REGISTRY } from "@/lib/pageRegistry";

// GET  /api/seo/content-pipeline/pages?seed=1 — list (auto-seeds from registry on first call if seed=1)
// POST /api/seo/content-pipeline/pages       — create

const POST_BODY = z.object({
  page_path: z.string().trim().min(1).max(500),
  title: z.string().trim().min(1).max(300),
  page_type: z.string().trim().max(50).default("other"),
  status: z.enum(["draft", "scheduled", "published", "stale"]).default("draft"),
  scheduled_date: z.string().optional().nullable(),
  notes: z.string().default(""),
});

export async function GET(req: NextRequest): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ configured: false, rows: [] });

  const supabase = getSupabaseServiceClient();

  // Auto-seed from page registry if requested AND the table is empty.
  if (req.nextUrl.searchParams.get("seed") === "1") {
    const { count } = await supabase
      .from("seo_content_pages")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) === 0) {
      const seed = PAGE_REGISTRY.map((p) => ({
        page_path: p.path,
        title: p.title,
        page_type: p.type,
        status: "published",
      }));
      await supabase.from("seo_content_pages").insert(seed);
    }
  }

  const { data, error } = await supabase
    .from("seo_content_pages")
    .select("*")
    .order("status", { ascending: true })
    .order("page_path", { ascending: true });
  if (error) {
    console.error("content-pipeline pages GET", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ configured: true, rows: data ?? [] });
}

export async function POST(req: NextRequest): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "supabase not configured" }, { status: 503 });

  let payload: z.infer<typeof POST_BODY>;
  try {
    payload = POST_BODY.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("seo_content_pages")
    .insert({
      page_path: payload.page_path,
      title: payload.title,
      page_type: payload.page_type,
      status: payload.status,
      scheduled_date: payload.scheduled_date ?? null,
      notes: payload.notes,
    })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "duplicate page_path" }, { status: 409 });
    }
    console.error("content-pipeline pages POST", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ row: data }, { status: 201 });
}
