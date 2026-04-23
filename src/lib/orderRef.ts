import { randomBytes } from "crypto";

// Short, human-readable order identifier shared between the intake email
// (sent on Step-7 submit, status: pending payment) and the webhook email
// (sent on checkout.session.completed, status: paid). Format: KPX-YYYYMMDD-XXXX
// where XXXX is 4 base32-ish chars with ambiguous characters removed.

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

export function generateOrderRef(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const bytes = randomBytes(4);
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[bytes[i] % ALPHABET.length];
  return `KPX-${y}${m}${d}-${suffix}`;
}
