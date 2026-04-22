import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  source: z.enum(["hero", "contact-page"]).optional(),
});

type Submission = z.infer<typeof schema>;

const CONTACT_ADDRESS = "contact@korporex.com";

export async function POST(req: Request) {
  let payload: Submission;
  try {
    const body = await req.json();
    payload = schema.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    // Dev-mode fallback so the site is testable without a real API key.
    // Production deployments must set BREVO_API_KEY in Vercel env vars.
    console.warn("[contact-api] BREVO_API_KEY not set — submission logged, not sent");
    console.log("[contact-api] submission:", payload);
    return NextResponse.json({ ok: true, dev: true });
  }

  const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: CONTACT_ADDRESS, name: "Korporex" },
      to: [{ email: CONTACT_ADDRESS, name: "Korporex" }],
      replyTo: { email: payload.email, name: payload.name },
      subject: buildSubject(payload),
      htmlContent: buildHtmlBody(payload),
    }),
  });

  if (!brevoResponse.ok) {
    const detail = await brevoResponse.text().catch(() => "");
    console.error("[contact-api] Brevo error:", brevoResponse.status, detail);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again or email us at " + CONTACT_ADDRESS + "." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function buildSubject(d: Submission) {
  const sourceLabel = d.source === "hero" ? "homepage" : d.source === "contact-page" ? "contact page" : "site";
  return `New enquiry from ${d.name} (${sourceLabel})`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtmlBody(d: Submission) {
  const rows: Array<[string, string]> = [
    ["Name", d.name],
    ["Email", d.email],
  ];
  if (d.company) rows.push(["Company", d.company]);
  if (d.service) rows.push(["Service of interest", d.service]);
  if (d.source) rows.push(["Source form", d.source]);

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;white-space:nowrap;">${escapeHtml(k)}</td><td style="padding:8px 0;color:#111827;font-size:14px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const messageBlock = d.message
    ? `<div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb;"><p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</p><p style="margin:0;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(d.message)}</p></div>`
    : "";

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border:1px solid #e5e7eb;"><div style="width:32px;height:2px;background:#C5A35A;margin-bottom:20px;"></div><h1 style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#1B4332;">New enquiry from korporex.com</h1><table style="width:100%;border-collapse:collapse;">${tableRows}</table>${messageBlock}<p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;line-height:1.5;">Reply directly to this email to respond to ${escapeHtml(d.name)} — the reply-to header is set to their email address.</p></div></body></html>`;
}
