import { NextResponse } from "next/server";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { buildDefaultLlmsTxt, KORPOREX_LLMS_GUIDELINE } from "@/lib/llmsTxt";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public route. Mapped from /.well-known/llms.txt via next.config rewrites.
// Returns plain text. If Supabase has a published row use that; otherwise
// fall back to a generated template so we always serve a valid response.
export async function GET(): Promise<Response> {
  let body = buildDefaultLlmsTxt();
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServiceClient();
      const { data } = await supabase
        .from("seo_llms_txt")
        .select("content")
        .eq("id", 1)
        .single();
      if (data?.content?.trim()) {
        // Even on user override, prepend our guideline if it isn't there —
        // protects against accidental removal of the "not a law firm" notice.
        if (!data.content.includes("not a law firm")) {
          body = KORPOREX_LLMS_GUIDELINE + "\n\n" + data.content;
        } else {
          body = data.content;
        }
      }
    } catch {
      // Fall through to generated template on any error
    }
  }
  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
