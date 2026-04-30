import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

// Admin endpoints for the llms.txt content row.
//   GET  /api/seo/llms-txt   → current content
//   PUT  /api/seo/llms-txt   → upsert (single-row id=1)

const PUT_BODY = z.object({
  content: z.string().max(100_000),
});

export async function GET(): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ configured: false, content: "" });

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("seo_llms_txt")
    .select("content, updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("llms-txt GET", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({
    configured: true,
    content: data?.content ?? "",
    updated_at: data?.updated_at ?? null,
  });
}

export async function PUT(req: NextRequest): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "supabase not configured" }, { status: 503 });

  let payload: z.infer<typeof PUT_BODY>;
  try {
    payload = PUT_BODY.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("seo_llms_txt")
    .upsert({ id: 1, content: payload.content, updated_at: new Date().toISOString() });
  if (error) {
    console.error("llms-txt PUT", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
