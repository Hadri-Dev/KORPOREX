import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

const PATCH_BODY = z.object({
  status: z.enum(["planned", "approved", "merged", "reverted"]).optional(),
  note: z.string().optional(),
  post_merge_clicks: z.number().int().min(0).nullable().optional(),
  post_merge_measured_at: z.string().nullable().optional(),
  merged_at: z.string().nullable().optional(),
});

interface RouteContext { params: Promise<{ id: string }> }

function parseId(s: string): number | null {
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function PATCH(req: NextRequest, ctx: RouteContext): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "supabase not configured" }, { status: 503 });

  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  let patch: z.infer<typeof PATCH_BODY>;
  try { patch = PATCH_BODY.parse(await req.json()); }
  catch { return NextResponse.json({ error: "invalid payload" }, { status: 400 }); }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("seo_consolidations")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    console.error("consolidations PATCH", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return NextResponse.json({ row: data });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "supabase not configured" }, { status: 503 });

  const { id: rawId } = await ctx.params;
  const id = parseId(rawId);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("seo_consolidations").delete().eq("id", id);
  if (error) {
    console.error("consolidations DELETE", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
