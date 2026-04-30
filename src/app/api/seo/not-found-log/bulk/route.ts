import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminOrUnauthorized } from "@/lib/adminApiAuth";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

// Admin-only bulk action on not_found_log rows.
//   POST /api/seo/not-found-log/bulk
//   Body: { ids: number[], action: "archive" | "unarchive" | "delete" }
//
// "delete" is intentionally permitted because the log can grow large; archive
// is the soft-delete counterpart for owners who want to keep history.

const PAYLOAD = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(500),
  action: z.enum(["archive", "unarchive", "delete"]),
});

export async function POST(req: NextRequest): Promise<Response> {
  const unauthorized = await requireAdminOrUnauthorized();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 503 });
  }

  let payload: z.infer<typeof PAYLOAD>;
  try {
    payload = PAYLOAD.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  if (payload.action === "delete") {
    const { error } = await supabase
      .from("not_found_log")
      .delete()
      .in("id", payload.ids);
    if (error) {
      console.error("not_found_log delete failed", error);
      return NextResponse.json({ error: "db error" }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("not_found_log")
      .update({ archived: payload.action === "archive" })
      .in("id", payload.ids);
    if (error) {
      console.error("not_found_log update failed", error);
      return NextResponse.json({ error: "db error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, count: payload.ids.length });
}
