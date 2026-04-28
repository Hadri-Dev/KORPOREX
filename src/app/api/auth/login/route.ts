import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  signAdminSession,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

const schema = z.object({
  username: z.string().min(1).max(128),
  password: z.string().min(1).max(512),
});

function constantTimeEquals(a: string, b: string): boolean {
  // Constant-time compare; pad the shorter input with a dummy compare so
  // length mismatch doesn't leak via timing.
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: Request) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { error: "Login is not configured on this server." },
      { status: 503 },
    );
  }

  let submitted: { username: string; password: string };
  try {
    const body = await req.json();
    submitted = schema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Username compare is case-insensitive (UX — the password is the secret).
  // Both compares run regardless of which one fails so timing is uniform.
  const usernameOk = constantTimeEquals(
    submitted.username.trim().toLowerCase(),
    expectedUsername.trim().toLowerCase(),
  );
  const passwordOk = constantTimeEquals(submitted.password, expectedPassword);

  if (!usernameOk || !passwordOk) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const token = await signAdminSession();

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return res;
}
