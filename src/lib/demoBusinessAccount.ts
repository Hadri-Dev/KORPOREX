// ⚠️ PREVIEW ONLY — not the real implementation.
//
// Fakes a signed-in business account purely in the browser (localStorage) so
// the owner can click through the end-to-end look and feel — signup → login
// → NUANS order skipping checkout — before any real Supabase/Stripe backend
// is built. No account, card, or order created here is real. Delete this
// file and its call sites once the real business-account system is built.

const KEY = "kpx_demo_business";

export interface DemoBusinessSession {
  companyName: string;
  billingEmail: string;
}

export function getDemoBusinessSession(): DemoBusinessSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoBusinessSession;
  } catch {
    return null;
  }
}

export function setDemoBusinessSession(session: DemoBusinessSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearDemoBusinessSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
