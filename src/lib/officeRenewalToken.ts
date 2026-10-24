import { createHmac, timingSafeEqual } from "crypto";
import { isIsoDate } from "./officeRenewalLogic";

// ── Client links ────────────────────────────────────────────────────────────
// The reminder emails link to /office-renewal?t=<token>. The token binds the
// client id to the current term end, so once a renewal moves renews_on the
// old link stops working by itself. Signed with HMAC-SHA256; the key is
// OFFICE_RENEWAL_SECRET, falling back to a derivation of ADMIN_SESSION_SECRET
// so no new env var is strictly required.

function signingKey(): string | null {
  const own = process.env.OFFICE_RENEWAL_SECRET;
  if (own) return own;
  const admin = process.env.ADMIN_SESSION_SECRET;
  return admin ? `office-renewal:${admin}` : null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createRenewalToken(clientId: string, renewsOn: string): string | null {
  const key = signingKey();
  if (!key) return null;
  const payload = `${clientId}.${renewsOn}`;
  return `${payload}.${sign(payload, key)}`;
}

export function verifyRenewalToken(token: string): { clientId: string; renewsOn: string } | null {
  const key = signingKey();
  if (!key) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return null;
  const payload = token.slice(0, lastDot);
  const given = Buffer.from(token.slice(lastDot + 1));
  const expected = Buffer.from(sign(payload, key));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  const sep = payload.lastIndexOf(".");
  const clientId = payload.slice(0, sep);
  const renewsOn = payload.slice(sep + 1);
  if (!clientId || !isIsoDate(renewsOn)) return null;
  return { clientId, renewsOn };
}
