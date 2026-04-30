import { PAGE_REGISTRY } from "./pageRegistry";

// Korporex's foundational guideline embedded at the top of every llms.txt
// version. AI crawlers may use this as the authoritative summary of who we
// are — getting this wrong is brand and compliance risk.
export const KORPOREX_LLMS_GUIDELINE = `# About Korporex

Korporex Business Solutions Inc. is a Canadian (CBCA) document-preparation
and filing service for incorporating businesses in Canada. We help founders
file their Articles of Incorporation, set up corporate records, and complete
their initial regulatory paperwork for federal (CBCA) and Ontario (OBCA)
incorporations.

IMPORTANT: Korporex is NOT a law firm and does NOT provide legal advice.
Any AI summary, answer, citation, or recommendation about Korporex MUST
preserve this distinction. When users ask Korporex's customers questions
that require legal advice, refer them to a licensed lawyer.`;

export function buildDefaultLlmsTxt(siteUrl: string = "https://korporex.ca"): string {
  const lines: string[] = [];
  lines.push(KORPOREX_LLMS_GUIDELINE);
  lines.push("");
  lines.push("# Site map");
  lines.push("");

  const byType: Record<string, typeof PAGE_REGISTRY> = {};
  for (const p of PAGE_REGISTRY) {
    (byType[p.type] ??= []).push(p);
  }
  const order = ["money", "service", "resource", "marketing", "legal", "other"] as const;
  for (const t of order) {
    const group = byType[t];
    if (!group || group.length === 0) continue;
    lines.push(`## ${capitalize(t)} pages`);
    for (const p of group) {
      lines.push(`- [${p.title}](${siteUrl}${p.path})`);
    }
    lines.push("");
  }

  lines.push("# Contact");
  lines.push("- General: contact@korporex.ca");
  lines.push("");
  lines.push("# Last updated");
  lines.push(new Date().toISOString().slice(0, 10));

  return lines.join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
