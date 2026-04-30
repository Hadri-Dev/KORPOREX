import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

const POST_BODY = z.object({
  keep_url: z.string().trim().min(1).max(500),
  merge_url: z.string().trim().min(1).max(500),
  status: z.enum(["planned", "approved", "merged", "reverted"]).default("planned"),
  note: z.string().default(""),
  pre_merge_keep_clicks: z.number().int().min(0).nullable().optional(),
  pre_merge_merge_clicks: z.number().int().min(0).nullable().optional(),
});

export async function GET(): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ configured: false, rows: [] });

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("seo_consolidations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("consolidations GET", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ configured: true, rows: data ?? [] });
}

export async function POST(req: NextRequest): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "supabase not configured" }, { status: 503 });

  let payload: z.infer<typeof POST_BODY>;
  try { payload = POST_BODY.parse(await req.json()); }
  catch { return NextResponse.json({ error: "invalid payload" }, { status: 400 }); }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("seo_consolidations")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    console.error("consolidations POST", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ row: data }, { status: 201 });
}
