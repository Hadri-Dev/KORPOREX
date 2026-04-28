import { SignJWT, jwtVerify } from "jose";

// Single-owner admin login. Password is checked once in /api/admin/login;
// success issues a signed JWT stored in an HttpOnly cookie. Every /admin/*
// request is gated by middleware (which only does JWT verify, no password
// check), so the password never leaves the login route.
//
// jose is used (instead of jsonwebtoken) because middleware runs on the
// Edge runtime and jose works in both Edge and Node. Same module, both runtimes.

export const ADMIN_COOKIE_NAME = "kpx_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const ALG = "HS256";

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or shorter than 32 bytes. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: [ALG] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_TTL_SECONDS = SESSION_TTL_SECONDS;
