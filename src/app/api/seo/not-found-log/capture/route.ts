import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

// Public endpoint hit by the client-side beacon in src/app/[locale]/not-found.tsx
// when a visitor lands on a 404. Records the path + request metadata in the
// not_found_log table via the record_not_found() RPC.
//
// Auth: none. The beacon fires from any visitor's browser; rate-limit + spam
// risk is accepted because the log is owner-only and easy to clear. We do
// gate by origin so cross-site beacons can't pollute the log from off-site.

const PAYLOAD = z.object({
  path: z.string().min(1).max(2048),
});

const ALLOWED_ORIGIN_HOSTS = new Set([
  "korporex.ca",
  "www.korporex.ca",
  "korporex.vercel.app",
  "localhost",
]);

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    if (ALLOWED_ORIGIN_HOSTS.has(host)) return true;
    if (host.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

function clientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip");
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    // Fail soft so dev/preview without Supabase doesn't error every 404.
    return new NextResponse(null, { status: 204 });
  }

  let payload: z.infer<typeof PAYLOAD>;
  try {
    payload = PAYLOAD.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.rpc("record_not_found", {
    p_path: payload.path,
    p_referer: req.headers.get("referer"),
    p_user_agent: req.headers.get("user-agent"),
    p_ip: clientIp(req),
  });
  if (error) {
    console.error("record_not_found RPC failed", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
