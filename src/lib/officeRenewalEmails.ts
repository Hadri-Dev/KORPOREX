import { addYears, formatLongDate, type ReminderKind } from "./officeRenewalLogic";

// Email templates for Registered Office renewals. Same visual language as the
// webhook emails in src/app/api/stripe-webhook/route.ts (cream page, white
// card, gold rule, Georgia heading in forest green). Customer emails are
// English only for now; see known-issues.md.
//
// Copy states facts only (renewal date, fee, what happens next). Korporex
// does not give legal advice, so the "not renewing" line just states that the
// registered office address will need to change with the registry.

type Built = { subject: string; html: string };

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(n: number): string {
  return `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Required so every template states who reads it: the owner once mistook an
// internal email for a client email because both carried the client footer.
type Audience = "client" | "owner";

const FOOTER: Record<Audience, string> = {
  client: "You are receiving this because your corporation uses a Korporex registered office address.",
  owner: "Internal Korporex notification. Clients do not receive this email.",
};

function shell(audience: Audience, heading: string, inner: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;letter-spacing:0.04em;color:#1B4332;">KORPOREX<span style="color:#C5A35A;">.</span></p><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">${heading}</h1>${inner}<p style="margin:28px 0 0;color:#6b7280;font-size:12px;line-height:1.6;">Korporex Business Solutions Inc. · contact@korporex.ca<br>${FOOTER[audience]}</p></div></body></html>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 14px;color:#111827;font-size:15px;line-height:1.6;">${text}</p>`;
}

function box(rows: Array<[string, string]>): string {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:4px 0;color:#111827;font-size:14px;font-weight:600;">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;background:#f0f8f5;border-left:3px solid #C5A35A;margin:4px 0 20px;"><tr><td style="padding:12px 16px;"><table style="border-collapse:collapse;">${body}</table></td></tr></table>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:0 0 8px;"><a href="${esc(href)}" style="display:inline-block;background:#C5A35A;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 24px;border-radius:6px;">${esc(label)}</a></p><p style="margin:0 0 20px;color:#6b7280;font-size:12px;">Secure payment by Stripe.</p>`;
}

function movingLine(href: string, renewsOnLong: string, ended: boolean): string {
  const when = ended
    ? "needs to be changed with the corporate registry"
    : `will need to be changed with the corporate registry before ${esc(renewsOnLong)}`;
  return p(
    `Not renewing? Your corporation's registered office address ${when}. <a href="${esc(href)}" style="color:#1B4332;font-weight:600;">Tell us you are moving your registered office</a> and we will stop these reminders.`,
  );
}

export function buildReminderEmail(
  kind: ReminderKind,
  d: {
    businessName: string;
    locationLabel: string;
    annualFee: number;
    renewsOn: string;
    renewLink: string;
    movingLink: string;
  },
): Built {
  const date = formatLongDate(d.renewsOn);
  const nextTerm = formatLongDate(addYears(d.renewsOn, 1));
  const details = box([
    ["Business", d.businessName],
    ["Office", d.locationLabel],
    [kind === "final" ? "Term ended" : "Renewal date", date],
    ["Annual fee", `${money(d.annualFee)} CAD plus applicable tax`],
  ]);
  const name = `<strong>${esc(d.businessName)}</strong>`;

  if (kind === "final") {
    return {
      subject: "Action needed: your Korporex registered office term has ended",
      html: shell(
        "client",
        "Your registered office term has ended",
        p("Hello,") +
          p(`The Korporex registered office term for ${name} ended on <strong>${esc(date)}</strong> and we have not received a renewal.`) +
          details +
          button(d.renewLink, "Renew now") +
          movingLine(d.movingLink, date, true) +
          p("If you have already moved your registered office elsewhere, please let us know with the link above so we can close your file.") +
          p("The Korporex Team"),
      ),
    };
  }

  if (kind === "d7") {
    return {
      subject: "7 days left: renew your Korporex registered office",
      html: shell(
        "client",
        "One week until your renewal date",
        p("Hello,") +
          p(`A quick reminder: the Korporex registered office service for ${name} renews on <strong>${esc(date)}</strong>.`) +
          details +
          button(d.renewLink, "Renew now") +
          movingLine(d.movingLink, date, false) +
          p("Already paid? Please ignore this message.") +
          p("The Korporex Team"),
      ),
    };
  }

  const intro =
    kind === "d60"
      ? `The Korporex registered office service for ${name} renews on <strong>${esc(date)}</strong>, about two months from now. Nothing is needed yet; you can renew any time before that date.`
      : `The Korporex registered office service for ${name} renews on <strong>${esc(date)}</strong>.`;
  return {
    subject: `Your Korporex registered office renews on ${date}`,
    html: shell(
      "client",
      "Your registered office renewal",
      p("Hello,") +
        p(intro) +
        details +
        button(d.renewLink, "Renew now") +
        p(`Once paid, your address stays on file with no action needed, and your new term runs to ${esc(nextTerm)}.`) +
        movingLine(d.movingLink, date, false) +
        p("Questions? Just reply to this email.") +
        p("The Korporex Team"),
    ),
  };
}

export function buildReceiptEmail(d: {
  businessName: string;
  locationLabel: string;
  amountLabel: string;
  termStart: string;
  termEnd: string;
}): Built {
  const end = formatLongDate(d.termEnd);
  return {
    subject: `Renewed: your Korporex registered office is set until ${end}`,
    html: shell(
      "client",
      "Thank you, your renewal is complete",
      p("Hello,") +
        p(`We have received your payment of <strong>${esc(d.amountLabel)}</strong>.`) +
        box([
          ["Business", d.businessName],
          ["Office", d.locationLabel],
          ["New term", `${formatLongDate(d.termStart)} to ${end}`],
        ]) +
        p("No further action is needed. We will remind you again before your next renewal date.") +
        p("The Korporex Team"),
    ),
  };
}

export function buildMovingAckEmail(d: { businessName: string; renewsOn: string }): Built {
  return {
    subject: "We received your registered office update",
    html: shell(
      "client",
      "Thank you for letting us know",
      p("Hello,") +
        p(`We have noted that <strong>${esc(d.businessName)}</strong> is moving its registered office away from Korporex, and we have stopped the renewal reminders.`) +
        p(`Your corporation's registered office address will need to be changed with the corporate registry before ${esc(formatLongDate(d.renewsOn))}. If you would like Korporex to prepare and file that change for you, just reply to this email.`) +
        p("The Korporex Team"),
    ),
  };
}

export function buildOwnerMovingEmail(d: {
  businessName: string;
  email: string;
  renewsOn: string;
  newAddress: string;
  note: string;
}): Built {
  return {
    subject: `[OFFICE] ${d.businessName} is moving its registered office`,
    html: shell(
      "owner",
      "Client is leaving the registered office service",
      box([
        ["Business", d.businessName],
        ["Email", d.email],
        ["Term ends", formatLongDate(d.renewsOn)],
        ["New address", d.newAddress || "(not given)"],
        ["Note", d.note || "(none)"],
      ]) + p("Reminders for this client are stopped. Close the file in the dashboard once their change of registered office is filed."),
    ),
  };
}

export function buildOwnerPaidEmail(d: {
  businessName: string;
  email: string;
  locationLabel: string;
  amountLabel: string;
  newRenewsOn: string;
  stripeSessionId: string;
}): Built {
  return {
    subject: `[PAID] Office renewal: ${d.businessName} (${d.amountLabel})`,
    html: shell(
      "owner",
      "Registered office renewal paid",
      box([
        ["Business", d.businessName],
        ["Email", d.email],
        ["Office", d.locationLabel],
        ["Amount", d.amountLabel],
        ["Now renews on", formatLongDate(d.newRenewsOn)],
        ["Stripe session", d.stripeSessionId],
      ]) + p("The renewal date was moved forward and the client was sent a confirmation."),
    ),
  };
}
