# Progress

## Current Focus
Marketing site + multi-step incorporation wizard for Canadian incorporation (Federal / Ontario / BC). Recently restructured the repo into the `Projects/` container; bootstrapping tracking files per universal CLAUDE.md guidelines.

## Log

### 2026-04-21
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
