import { SignJWT, jwtVerify } from "jose";

// Business-account session cookie. Credentials themselves live in Supabase
// Auth (auth.users) — /api/business/login verifies email+password there via
// the anon client, then signs this JWT so every other request can check the
// session at the edge without hitting Supabase again. Same jose/HS256
// pattern as src/lib/adminAuth.ts, deliberately kept as a separate secret so
// rotating one session type never invalidates the other.

export const BUSINESS_COOKIE_NAME = "kpx_biz_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const ALG = "HS256";

function getSecretKey(): Uint8Array {
  const secret = process.env.BUSINESS_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "BUSINESS_SESSION_SECRET is missing or shorter than 32 bytes. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return new TextEncoder().encode(secret);
}

export interface BusinessSessionPayload {
  accountId: string;
}

export async function signBusinessSession(accountId: string): Promise<string> {
  return new SignJWT({ accountId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyBusinessSession(token: string | undefined): Promise<BusinessSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: [ALG] });
    if (typeof payload.accountId !== "string") return null;
    return { accountId: payload.accountId };
  } catch {
    return null;
  }
}

export const BUSINESS_SESSION_TTL_SECONDS = SESSION_TTL_SECONDS;
