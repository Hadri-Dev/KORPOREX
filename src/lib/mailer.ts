import nodemailer, { type Transporter } from "nodemailer";

// Server-side transactional mailer. Sends via Zoho Mail SMTP using the shared
// contact@korporex.ca mailbox. Routes call `sendMail()` and gracefully no-op
// in dev when ZOHO_SMTP_USER/PASS are unset (mirrors the stripe.ts pattern in
// `src/lib/stripe.ts`). Replaced the previous Brevo HTTP-API integration on
// 2026-05-07 once the .ca mailbox + SPF/DKIM/DMARC went live in Zoho.

export const CONTACT_ADDRESS = "contact@korporex.ca";

export type Recipient = { email: string; name?: string };

// Shape used by callers. `content` is base64-encoded; nodemailer accepts the
// `encoding: "base64"` hint and decodes before sending.
export type EmailAttachment = { filename: string; content: string };

export type Mailable = {
  subject: string;
  html: string;
  to: Recipient[];
  replyTo?: Recipient;
  attachments?: EmailAttachment[];
};

let cached: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  if (!user || !pass) return null;
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: "smtp.zohocloud.ca",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  return cached;
}

export function isMailerConfigured(): boolean {
  return !!(process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS);
}

function formatRecipient(r: Recipient): string {
  if (!r.name) return r.email;
  const safeName = r.name.replace(/"/g, '\\"');
  return `"${safeName}" <${r.email}>`;
}

export async function sendMail(
  m: Mailable,
  tag: string
): Promise<{ ok: true; dev: boolean }> {
  const tx = getTransporter();
  if (!tx) {
    console.warn(`[${tag}] ZOHO_SMTP_USER/PASS not set — submission logged, not sent`);
    console.log(`[${tag}] would send:`, {
      subject: m.subject,
      to: m.to.map((r) => r.email),
      attachmentCount: m.attachments?.length ?? 0,
    });
    return { ok: true, dev: true };
  }

  await tx.sendMail({
    from: formatRecipient({ email: CONTACT_ADDRESS, name: "Korporex" }),
    to: m.to.map(formatRecipient),
    replyTo: m.replyTo ? formatRecipient(m.replyTo) : undefined,
    subject: m.subject,
    html: m.html,
    attachments: m.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
      encoding: "base64",
    })),
  });

  return { ok: true, dev: false };
}
