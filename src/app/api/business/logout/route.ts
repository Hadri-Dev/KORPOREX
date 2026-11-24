import { NextResponse } from "next/server";
import { BUSINESS_COOKIE_NAME } from "@/lib/businessAuth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BUSINESS_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
