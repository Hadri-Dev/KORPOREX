import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerAnonClient, isSupabaseConfigured } from "@/lib/supabase";
import { getBusinessAccountByAuthUserId } from "@/lib/businessAccounts";
import { BUSINESS_COOKIE_NAME, BUSINESS_SESSION_TTL_SECONDS, signBusinessSession } from "@/lib/businessAuth";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Accounts are not configured." }, { status: 500 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const supabase = getSupabaseServerAnonClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });
  if (error || !data.user) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const account = await getBusinessAccountByAuthUserId(data.user.id).catch(() => null);
  if (!account) {
    return NextResponse.json(
      { error: "No business account found for this login. If you just signed up, finish adding your card first." },
      { status: 404 },
    );
  }

  const token = await signBusinessSession(account.id);
  const res = NextResponse.json({ ok: true, companyName: account.companyName, status: account.status });
  res.cookies.set(BUSINESS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: BUSINESS_SESSION_TTL_SECONDS,
  });
  return res;
}
