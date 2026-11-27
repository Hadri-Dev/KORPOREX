import type { EmailAttachment } from "./mailer";

// Server-side validation for files posted with a multipart form. Uploads are
// forwarded as email attachments (there is no file storage), so every limit
// here exists to keep the request and the resulting email deliverable.

export type UploadLimits = {
  maxFiles: number;
  /** Combined raw size of all files, in bytes. */
  maxTotalBytes: number;
  acceptedMimes: readonly string[];
};

export type UploadResult =
  | { ok: true; attachments: EmailAttachment[] }
  | { ok: false; error: string };

const MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

export function bytesToMb(bytes: number): number {
  return bytes / 1024 / 1024;
}

export async function readUploads(
  form: FormData,
  field: string,
  limits: UploadLimits
): Promise<UploadResult> {
  const files = form.getAll(field).filter((x): x is File => x instanceof File && x.size > 0);
  if (files.length > limits.maxFiles) {
    return { ok: false, error: `Too many files. Limit is ${limits.maxFiles}.` };
  }

  const allowed = limits.acceptedMimes.map((m) => MIME_LABELS[m] ?? m).join(", ");
  let totalBytes = 0;
  for (const f of files) {
    totalBytes += f.size;
    if (totalBytes > limits.maxTotalBytes) {
      return { ok: false, error: `Total upload exceeds ${bytesToMb(limits.maxTotalBytes)} MB.` };
    }
    if (!limits.acceptedMimes.includes(f.type)) {
      return { ok: false, error: `File ${f.name}: unsupported type. Allowed: ${allowed}.` };
    }
  }

  const attachments: EmailAttachment[] = [];
  for (const f of files) {
    const buf = Buffer.from(await f.arrayBuffer());
    // The browser-reported type is only a claim; a PDF must also start with
    // the PDF signature before it is forwarded to the operator's inbox.
    if (f.type === "application/pdf" && buf.subarray(0, 5).toString("latin1") !== "%PDF-") {
      return { ok: false, error: `File ${f.name}: not a valid PDF.` };
    }
    attachments.push({ filename: f.name, content: buf.toString("base64") });
  }
  return { ok: true, attachments };
}
