import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerAnonClient, isSupabaseConfigured } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

const bodySchema = z.object({ email: z.string().trim().email() });

export async function POST(req: Request) {
  // Always respond the same way whether or not the email has an account —
  // never let this endpoint be used to probe which companies have signed up.
  const ok = NextResponse.json({ ok: true });

  if (!isSupabaseConfigured()) return ok;

  let email: string;
  try {
    email = bodySchema.parse(await req.json()).email;
  } catch {
    return ok;
  }

  try {
    const supabase = getSupabaseServerAnonClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/business/reset-password`,
    });
  } catch (err) {
    console.error("[business/forgot-password] error:", err);
  }
  return ok;
}
