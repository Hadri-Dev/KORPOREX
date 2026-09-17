// Client-side draft persistence for the incorporation wizard.
//
// Customers routinely fill several steps, leave, and never come back,
// and the order is lost before it ever reaches checkout. We keep an
// in-progress copy of the wizard state in the browser's localStorage so
// returning to /incorporate restores exactly where they stopped.
//
// Scope and privacy: the draft never leaves the customer's own browser.
// Nothing is sent to Korporex until they submit Step 8, which is the same
// point as before this was added. The draft is cleared once the order
// reaches the confirmation page, and expires on its own after 30 days.

const KEY = "korporex.incorporate.draft.v1";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export interface IncorporateDraft<T> {
  /** Wizard step the customer was on (1-8). */
  step: number;
  /** Full wizard payload as of the last completed step. */
  data: T;
  /** Epoch ms of the last write, used for the 30-day expiry. */
  savedAt: number;
}

export function loadDraft<T>(): IncorporateDraft<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IncorporateDraft<T>;
    if (!parsed || typeof parsed.step !== "number" || !parsed.data) return null;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    // Private browsing, disabled storage, or corrupt JSON: behave as if
    // there were no draft rather than breaking the wizard.
    return null;
  }
}

export function saveDraft<T>(step: number, data: T): void {
  if (typeof window === "undefined") return;
  try {
    const payload: IncorporateDraft<T> = { step, data, savedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded or storage blocked. Drafting is best-effort.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // no-op
  }
}
