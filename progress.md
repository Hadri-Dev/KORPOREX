# Progress

## Current Focus
Marketing site + multi-step incorporation wizard for Canadian incorporation (Federal / Ontario / BC). Resources section now has real article content at `/resources/[slug]`. Next focus: domain + professional email setup, then form-submission backend.

## Log

### 2026-04-21
- Built real Resources article pages. Added `src/app/resources/articles.ts` with six full articles (typed section data, not markdown), dynamic route `src/app/resources/[slug]/page.tsx` with breadcrumb, TOC sidebar, related-articles, and CTA, and updated `src/app/resources/page.tsx` to use real slugs. No outbound competitor links. Resolves placeholder-anchor issue.
- Fixed site metadata in `src/app/layout.tsx` — removed banned "advisory" phrase per content guidelines; replaced with incorporation-focused title/description.
- Deleted duplicate old project folder at `C:\Users\marke\OneDrive\Documents\Korporex Website\`. Verified uncommitted changes were byte-identical to committed state in this folder before deletion. Resolves the low-sev stale-folder issue.
- Verified `npx tsc --noEmit`, `npm run lint`, and `npm run build` — all pass. 6 article routes statically prerendered.
- **Next**: Register the Korporex domain (likely `korporex.ca` + `korporex.com`); set up the first professional mailboxes (recommend `hello@`, `support@`, `noreply@`). Then wire the contact/hero/wizard forms to a real backend — unblocks the two high-sev form-intake issues. Long-term: add per-article OpenGraph metadata; add a search/filter on `/resources` when article count grows.
- Bootstrapped `progress.md` and `known-issues.md` per universal CLAUDE.md guidelines.
- Untracked `.claude/settings.local.json` and added `.claude/` to `.gitignore` — local Claude Code permissions should not be shared (commit `d9a6aad`).
- Added Resources page (`src/app/resources/page.tsx`) with three category tiles and article list; wired into Navbar and Footer (commit `f4c0dcd`).
- Extracted `HeroContactForm` client component for the home-page hero.
- Removed "Home" link from nav — K logo handles home navigation.
- Updated CLAUDE.md: link to universal guidelines at `../CLAUDE.md`, document tracking files, fix `npm lint` → `npm run lint`, note TypeScript strict mode.
- **Next**: Push commits to GitHub (triggers Vercel deploy). Delete old folder `C:\Users\marke\OneDrive\Documents\Korporex Website` once push verified. Replace stub `#` article links on Resources page when content exists.

### 2026-04-20
- Strengthened CLAUDE.md messaging that Korporex is not a law firm (commit `6f33451`).
- Added initial CLAUDE.md with development guidance (commit `16b2961`).
- Upgraded site to full incorporation platform: 8-step wizard, jurisdiction selector, services categories (commit `b4f37fe`).
- Initial Next.js 14 marketing site build with Tailwind, custom color palette, navbar/footer (commit `5e61588`).
