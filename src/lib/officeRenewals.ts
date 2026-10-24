import type Stripe from "stripe";
import { getSupabaseServiceClient, isSupabaseConfigured } from "./supabase";
import { getSiteUrl, stripe } from "./stripe";
import { CONTACT_ADDRESS, sendMail } from "./mailer";
import { JURISDICTION_LABELS, REG_OFFICE_OPTIONS, type Jurisdiction, type RegOfficeLocation } from "./pricing";
import {
  DEFAULT_SETTINGS,
  addYears,
  daysBetween,
  reminderWindow,
  torontoDate,
  type OfficeStatus,
  type ReminderKind,
  type ReminderSettings,
} from "./officeRenewalLogic";
import { createRenewalToken } from "./officeRenewalToken";
import {
  buildOwnerPaidEmail,
  buildReceiptEmail,
  buildReminderEmail,
} from "./officeRenewalEmails";

// Server-only store + actions for Registered Office renewals. Tables are
// defined in supabase/migrations/0006_office_renewals.sql. Every function
// uses the service-role client; never import this from a client component.

export type OfficeLocale = "en" | "fr" | "es";

export interface OfficeClient {
  id: string;
  businessName: string;
  email: string;
  contactName: string | null;
  corpNumber: string | null;
  location: RegOfficeLocation;
  startedOn: string;
  renewsOn: string;
  status: OfficeStatus;
  source: "stripe" | "manual";
  stripeSessionId: string | null;
  billingRegion: string | null;
  locale: OfficeLocale;
  lastPaidOn: string | null;
  movingAddress: string | null;
  movingNote: string | null;
  notes: string | null;
  createdAt: string;
}

export interface OfficeEvent {
  id: number;
  clientId: string;
  kind: string;
  termEndsOn: string | null;
  detail: string | null;
  createdAt: string;
}

interface ClientRow {
  id: string;
  business_name: string;
  email: string;
  contact_name: string | null;
  corp_number: string | null;
  location: RegOfficeLocation;
  started_on: string;
  renews_on: string;
  status: OfficeStatus;
  source: "stripe" | "manual";
  stripe_session_id: string | null;
  billing_region: string | null;
  locale: OfficeLocale;
  last_paid_on: string | null;
  moving_address: string | null;
  moving_note: string | null;
  notes: string | null;
  created_at: string;
}

interface EventRow {
  id: number;
  client_id: string;
  kind: string;
  term_ends_on: string | null;
  detail: string | null;
  created_at: string;
}

function rowToClient(r: ClientRow): OfficeClient {
  return {
    id: r.id,
    businessName: r.business_name,
    email: r.email,
    contactName: r.contact_name,
    corpNumber: r.corp_number,
    location: r.location,
    startedOn: r.started_on,
    renewsOn: r.renews_on,
    status: r.status,
    source: r.source,
    stripeSessionId: r.stripe_session_id,
    billingRegion: r.billing_region,
    locale: r.locale,
    lastPaidOn: r.last_paid_on,
    movingAddress: r.moving_address,
    movingNote: r.moving_note,
    notes: r.notes,
    createdAt: r.created_at,
  };
}

function rowToEvent(r: EventRow): OfficeEvent {
  return {
    id: r.id,
    clientId: r.client_id,
    kind: r.kind,
    termEndsOn: r.term_ends_on,
    detail: r.detail,
    createdAt: r.created_at,
  };
}

const UNIQUE_VIOLATION = "23505";

export function annualFee(location: RegOfficeLocation): number {
  return REG_OFFICE_OPTIONS[location].annual;
}

export function locationLabel(location: RegOfficeLocation): string {
  return REG_OFFICE_OPTIONS[location].locationLabel;
}

export function clientLink(client: Pick<OfficeClient, "id" | "renewsOn" | "locale">, choice?: "renew" | "moving"): string | null {
  const token = createRenewalToken(client.id, client.renewsOn);
  if (!token) return null;
  const prefix = client.locale === "en" ? "" : `/${client.locale}`;
  const choiceParam = choice ? `&choice=${choice}` : "";
  return `${getSiteUrl()}${prefix}/office-renewal?t=${encodeURIComponent(token)}${choiceParam}`;
}

// ── Reads ───────────────────────────────────────────────────────────────────

export type LoadResult =
  | { state: "not-configured" }
  | { state: "setup-needed"; message: string }
  | { state: "ok"; clients: OfficeClient[]; events: OfficeEvent[]; settings: ReminderSettings };

export async function loadOfficeRenewals(): Promise<LoadResult> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { state: "not-configured" };
  }
  const supabase = getSupabaseServiceClient();
  const [clientsRes, eventsRes] = await Promise.all([
    supabase.from("office_clients").select("*").order("renews_on", { ascending: true }),
    supabase.from("office_events").select("*").order("created_at", { ascending: true }),
  ]);
  if (clientsRes.error || eventsRes.error) {
    const err = clientsRes.error ?? eventsRes.error;
    return { state: "setup-needed", message: err?.message ?? "unknown error" };
  }
  return {
    state: "ok",
    clients: (clientsRes.data as ClientRow[]).map(rowToClient),
    events: (eventsRes.data as EventRow[]).map(rowToEvent),
    settings: await getSettings(),
  };
}

export async function getClient(id: string): Promise<OfficeClient | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseServiceClient()
    .from("office_clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToClient(data as ClientRow);
}

export async function getSettings(): Promise<ReminderSettings> {
  const { data, error } = await getSupabaseServiceClient()
    .from("office_renewal_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return {
    d60: data.d60,
    d30: data.d30,
    d7: data.d7,
    finalNotice: data.final_notice,
    bccOwner: data.bcc_owner,
    mondayDigest: data.monday_digest,
  };
}

// ── Writes ──────────────────────────────────────────────────────────────────

export type ClientInput = {
  businessName: string;
  email: string;
  contactName?: string | null;
  corpNumber?: string | null;
  location: RegOfficeLocation;
  startedOn: string;
  renewsOn: string;
  billingRegion?: string | null;
  locale?: OfficeLocale;
  notes?: string | null;
};

function inputToRow(i: Partial<ClientInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (i.businessName !== undefined) row.business_name = i.businessName;
  if (i.email !== undefined) row.email = i.email;
  if (i.contactName !== undefined) row.contact_name = i.contactName;
  if (i.corpNumber !== undefined) row.corp_number = i.corpNumber;
  if (i.location !== undefined) row.location = i.location;
  if (i.startedOn !== undefined) row.started_on = i.startedOn;
  if (i.renewsOn !== undefined) row.renews_on = i.renewsOn;
  if (i.billingRegion !== undefined) row.billing_region = i.billingRegion;
  if (i.locale !== undefined) row.locale = i.locale;
  if (i.notes !== undefined) row.notes = i.notes;
  return row;
}

export async function createClient(input: ClientInput): Promise<OfficeClient> {
  const { data, error } = await getSupabaseServiceClient()
    .from("office_clients")
    .insert({ ...inputToRow(input), source: "manual" })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "insert failed");
  const client = rowToClient(data as ClientRow);
  await logEvent(client.id, "created", { detail: "Added manually" });
  return client;
}

export async function updateClient(
  id: string,
  patch: Partial<ClientInput> & { status?: OfficeStatus; movingAddress?: string; movingNote?: string },
): Promise<OfficeClient> {
  const row = inputToRow(patch);
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.movingAddress !== undefined) row.moving_address = patch.movingAddress;
  if (patch.movingNote !== undefined) row.moving_note = patch.movingNote;
  const { data, error } = await getSupabaseServiceClient()
    .from("office_clients")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "update failed");
  return rowToClient(data as ClientRow);
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await getSupabaseServiceClient().from("office_clients").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateSettings(patch: Partial<ReminderSettings>): Promise<ReminderSettings> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.d60 !== undefined) row.d60 = patch.d60;
  if (patch.d30 !== undefined) row.d30 = patch.d30;
  if (patch.d7 !== undefined) row.d7 = patch.d7;
  if (patch.finalNotice !== undefined) row.final_notice = patch.finalNotice;
  if (patch.bccOwner !== undefined) row.bcc_owner = patch.bccOwner;
  if (patch.mondayDigest !== undefined) row.monday_digest = patch.mondayDigest;
  const { error } = await getSupabaseServiceClient()
    .from("office_renewal_settings")
    .upsert({ id: 1, ...row });
  if (error) throw new Error(error.message);
  return getSettings();
}

// Returns false (without throwing) when a unique index rejected the row:
// the reminder was already claimed, or the Stripe session already applied.
export async function logEvent(
  clientId: string,
  kind: string,
  opts: { termEndsOn?: string; detail?: string; stripeSessionId?: string } = {},
): Promise<{ inserted: boolean; id: number | null }> {
  const { data, error } = await getSupabaseServiceClient()
    .from("office_events")
    .insert({
      client_id: clientId,
      kind,
      term_ends_on: opts.termEndsOn ?? null,
      detail: opts.detail ?? null,
      stripe_session_id: opts.stripeSessionId ?? null,
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === UNIQUE_VIOLATION) return { inserted: false, id: null };
    throw new Error(error.message);
  }
  return { inserted: true, id: (data as { id: number }).id };
}

async function removeEvent(id: number): Promise<void> {
  await getSupabaseServiceClient().from("office_events").delete().eq("id", id);
}

// ── Reminders ───────────────────────────────────────────────────────────────

function ownerBcc(settings: ReminderSettings) {
  return settings.bccOwner ? [{ email: CONTACT_ADDRESS, name: "Korporex" }] : undefined;
}

// Automatic reminder: claim the (client, kind, term) row first so concurrent
// cron runs cannot double-send, then send; release the claim if sending fails
// so the next run retries.
export async function sendAutoReminder(
  client: OfficeClient,
  kind: ReminderKind,
  settings: ReminderSettings,
): Promise<boolean> {
  const claim = await logEvent(client.id, `reminder_${kind}`, { termEndsOn: client.renewsOn });
  if (!claim.inserted) return false;
  try {
    await sendReminderEmail(client, kind, settings);
    return true;
  } catch (err) {
    if (claim.id !== null) await removeEvent(claim.id);
    throw err;
  }
}

// "Send reminder now" from the dashboard: uses the template for the window
// the client is currently in (the 30-day one when outside every window) and
// is logged separately so it never blocks the automatic schedule.
export async function sendManualReminder(client: OfficeClient, settings: ReminderSettings): Promise<ReminderKind> {
  const kind = reminderWindow(daysBetween(torontoDate(), client.renewsOn)) ?? "d30";
  await sendReminderEmail(client, kind, settings);
  await logEvent(client.id, "reminder_manual", { termEndsOn: client.renewsOn, detail: kind });
  return kind;
}

async function sendReminderEmail(client: OfficeClient, kind: ReminderKind, settings: ReminderSettings) {
  const renewLink = clientLink(client, "renew");
  const movingLink = clientLink(client, "moving");
  if (!renewLink || !movingLink) throw new Error("ADMIN_SESSION_SECRET is not set; cannot sign client links");
  const email = buildReminderEmail(kind, {
    businessName: client.businessName,
    locationLabel: locationLabel(client.location),
    annualFee: annualFee(client.location),
    renewsOn: client.renewsOn,
    renewLink,
    movingLink,
  });
  await sendMail(
    {
      ...email,
      to: [{ email: client.email, name: client.contactName ?? undefined }],
      bcc: ownerBcc(settings),
      replyTo: { email: CONTACT_ADDRESS, name: "Korporex" },
    },
    `office-renewal-${kind}`,
  );
}

// ── Payments ────────────────────────────────────────────────────────────────

// Moves the term forward one year from the old renewal date (not from the
// payment date, so paying early or late never shortens or stretches a term).
// `termEndsOn` must match the client's current renews_on, which stops a stale
// link or a second payment for the same term from adding an extra year.
export async function applyRenewalPayment(args: {
  clientId: string;
  termEndsOn: string;
  amountLabel: string;
  method: "stripe" | "manual";
  stripeSessionId?: string;
}): Promise<{ applied: boolean; client: OfficeClient | null }> {
  const client = await getClient(args.clientId);
  if (!client) return { applied: false, client: null };

  const claim = await logEvent(client.id, "paid", {
    termEndsOn: args.termEndsOn,
    detail: `${args.amountLabel} (${args.method === "stripe" ? "Stripe" : "marked paid manually"})`,
    stripeSessionId: args.stripeSessionId,
  });
  if (!claim.inserted) return { applied: false, client };

  // Only the date move is rolled back on failure (so a Stripe retry can redo
  // it). Emails after that are best effort: failing them must not undo or
  // repeat the renewal.
  const newRenewsOn = addYears(args.termEndsOn, 1);
  let updated: OfficeClient | null = null;
  try {
    if (client.renewsOn === args.termEndsOn) {
      const { data, error } = await getSupabaseServiceClient()
        .from("office_clients")
        .update({ renews_on: newRenewsOn, last_paid_on: torontoDate(), status: "active" })
        .eq("id", client.id)
        .eq("renews_on", args.termEndsOn)
        .select("*")
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (data) updated = rowToClient(data as ClientRow);
    }
  } catch (err) {
    if (claim.id !== null) await removeEvent(claim.id);
    throw err;
  }

  const ownerEmail = (current: OfficeClient, renewsOn: string) =>
    buildOwnerPaidEmail({
      businessName: current.businessName,
      email: current.email,
      locationLabel: locationLabel(current.location),
      amountLabel: args.amountLabel,
      newRenewsOn: renewsOn,
      stripeSessionId: args.stripeSessionId ?? "",
    });

  if (!updated) {
    await logEvent(client.id, "note", {
      detail: `Payment received for the term ending ${args.termEndsOn}, but the renewal date was already ${client.renewsOn}. Date left unchanged; check for a double payment.`,
    });
    if (args.method === "stripe") {
      const owner = ownerEmail(client, client.renewsOn);
      await sendMail(
        { ...owner, subject: `[CHECK] ${owner.subject} for an old term`, to: [{ email: CONTACT_ADDRESS, name: "Korporex" }] },
        "office-renewal-paid-owner",
      ).catch((err) => console.error("[office-renewals] owner email failed:", err));
    }
    return { applied: false, client };
  }

  try {
    const receipt = buildReceiptEmail({
      businessName: updated.businessName,
      locationLabel: locationLabel(updated.location),
      amountLabel: args.amountLabel,
      termStart: args.termEndsOn,
      termEnd: newRenewsOn,
    });
    await sendMail(
      {
        ...receipt,
        to: [{ email: updated.email, name: updated.contactName ?? undefined }],
        replyTo: { email: CONTACT_ADDRESS, name: "Korporex" },
      },
      "office-renewal-receipt",
    );
    await logEvent(updated.id, "receipt", { termEndsOn: newRenewsOn });
  } catch (err) {
    console.error("[office-renewals] receipt email failed:", err);
    await logEvent(updated.id, "note", { detail: "Renewal applied, but the confirmation email failed to send." });
  }

  if (args.method === "stripe") {
    await sendMail(
      { ...ownerEmail(updated, newRenewsOn), to: [{ email: CONTACT_ADDRESS, name: "Korporex" }] },
      "office-renewal-paid-owner",
    ).catch((err) => console.error("[office-renewals] owner email failed:", err));
  }
  return { applied: true, client: updated };
}

// ── Stripe import ───────────────────────────────────────────────────────────

type ImportResult = "created" | "exists" | "duplicate" | "skip";

function sessionDate(session: Stripe.Checkout.Session): string {
  return torontoDate(new Date(session.created * 1000));
}

function describeSession(session: Stripe.Checkout.Session): {
  businessName: string;
  email: string;
  contactName: string | null;
  corpNumber: string | null;
  location: RegOfficeLocation;
  notes: string | null;
} | null {
  const md = session.metadata ?? {};
  const productType = md.productType ?? "incorporation";
  const email = session.customer_details?.email || session.customer_email || "";

  if (productType === "incorporation") {
    const addon = md.regOfficeAddon;
    if (addon !== "korporex" && addon !== "burlington") return null;
    const ending = md.legalEnding ? ` ${md.legalEnding}` : "";
    const juris = JURISDICTION_LABELS[md.jurisdiction as Jurisdiction] ?? md.jurisdiction ?? "";
    const numbered = md.corpNameType === "numbered" || !md.businessName || md.businessName === "(numbered)";
    return {
      businessName: numbered ? `Numbered ${juris} corporation${ending}`.trim() : `${md.businessName}${ending}`,
      email: email || md.primaryDirectorEmail || "",
      contactName: session.customer_details?.name || md.primaryDirectorName || null,
      corpNumber: null,
      location: addon,
      notes: numbered
        ? `Imported from incorporation order ${md.orderRef ?? session.id}. Numbered company: update the name once the corporation number is assigned.`
        : `Imported from incorporation order ${md.orderRef ?? session.id}.`,
    };
  }

  if (productType === "business-update" && md.service === "registered-office") {
    const loc = md.regOfficeLocation;
    if (loc !== "korporex" && loc !== "burlington") return null;
    return {
      businessName: md.corpName || "(corporation name not provided)",
      email: email || md.customerEmail || "",
      contactName: session.customer_details?.name || md.customerName || null,
      corpNumber: md.corpNumber || null,
      location: loc,
      notes: `Imported from Registered Office order ${md.orderRef ?? session.id}.`,
    };
  }

  return null;
}

// ilike is used for a case-insensitive exact match, so escape its wildcards.
function escapeLike(v: string): string {
  return v.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export async function importOfficeClientFromSession(session: Stripe.Checkout.Session): Promise<ImportResult> {
  if (session.payment_status !== "paid") return "skip";
  const d = describeSession(session);
  if (!d || !d.email) return "skip";

  const supabase = getSupabaseServiceClient();
  const existing = await supabase
    .from("office_clients")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing.data) return "exists";

  // Same business + email already on file (e.g. a second Registered Office
  // purchase on the public service page): don't create a twin row. Flag it
  // instead so the owner can decide whether it was an early renewal.
  const twin = await supabase
    .from("office_clients")
    .select("id")
    .ilike("email", escapeLike(d.email))
    .ilike("business_name", escapeLike(d.businessName))
    .neq("status", "closed")
    .limit(1)
    .maybeSingle();
  if (twin.data) {
    await logEvent((twin.data as { id: string }).id, "duplicate", {
      detail: `Another paid Registered Office order was found (Stripe ${session.id}). Check whether it was meant as a renewal.`,
      stripeSessionId: session.id,
    });
    return "duplicate";
  }

  const startedOn = sessionDate(session);
  const { data, error } = await supabase
    .from("office_clients")
    .insert({
      business_name: d.businessName,
      email: d.email,
      contact_name: d.contactName,
      corp_number: d.corpNumber,
      location: d.location,
      started_on: startedOn,
      renews_on: addYears(startedOn, 1),
      source: "stripe",
      stripe_session_id: session.id,
      billing_region: session.customer_details?.address?.state || null,
      notes: d.notes,
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === UNIQUE_VIOLATION) return "exists";
    throw new Error(error.message);
  }
  await logEvent((data as { id: string }).id, "imported", { detail: d.notes ?? undefined });
  return "created";
}

export async function syncFromStripe(sinceUnix?: number): Promise<Record<ImportResult, number>> {
  const counts: Record<ImportResult, number> = { created: 0, exists: 0, duplicate: 0, skip: 0 };
  if (!stripe) return counts;
  const params: Stripe.Checkout.SessionListParams = { status: "complete", limit: 100 };
  if (sinceUnix) params.created = { gte: sinceUnix };
  for await (const session of stripe.checkout.sessions.list(params)) {
    counts[await importOfficeClientFromSession(session)]++;
  }
  return counts;
}
