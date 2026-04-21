# Progress

## Current Focus
Marketing site + multi-step incorporation wizard. Resources section has real articles. Content cleaned up to remove legal/advisory language, jurisdiction superiority, placeholder phone/address, and "expert team review" phrasing. Wizard upgraded for international founders: numbered-corporation option, international addresses, NAICS picker, Google Places autofill (with no-key fallback), live GST/HST/QST tax calculation, and separate NUANS line item. Next focus: domain + professional email setup, then form-submission backend.

## Log

### 2026-04-21
- **Wizard upgrade** — Full rewrite of `src/app/incorporate/page.tsx`:
  - Step 3: toggle between **named** and **numbered** corporation (numbered skips NUANS fee).
  - Step 3: added **NAICS industry combobox** (`src/components/NaicsCombobox.tsx` backed by `src/lib/naics.ts` with ~420 curated Canadian NAICS 2022 codes + `searchNaics()` scoring).
  - Step 3: fiscal year end now captures **month + day** (day options derive from the selected month's length).
  - Steps 4, 5, 7: addresses are now **international-friendly** via a shared `AddressFields` subform (country-aware region selector, generic postal/ZIP field).
  - All address inputs wired to **`AddressAutocomplete`** (`src/components/AddressAutocomplete.tsx`) — uses Google Places when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set, falls back to plain text input when absent. Autofills street/city/region/postal/country from the selected place.
  - Step 6 (registered office) is Canada-only with province locked to ON or BC for provincial incorporations; federal lets the user pick any Canadian province/territory.
  - Step 7 (Review & Pay) now captures **billing name + billing address** and shows a **live tax calculation** based on the billing address (GST/HST/QST for Canadian provinces, 0% international) plus a separate **NUANS fee line** for federal/Ontario named corporations (`NUANS_FEE = 45`, flagged in comments as pass-through — adjust when final pricing confirmed).
  - Step 1 copy rewritten to remove jurisdiction-superiority language (no more "preferred by investors", "best for businesses based in...").
- **Content pass** across marketing pages (home, about, contact, pricing, FAQ, footer, confirmation):
  - Removed placeholder phone number `+1 (888) 000-0000`, fake Toronto office address, and `support@korporex.com` — replaced with `contact@korporex.com` as the single enquiry address.
  - Removed "expert team review" / "Our team reviews your application" phrasing throughout (we're a document-prep & filing platform, not a reviewing team).
  - Removed "no lawyers required" and similar implicit-legal language; positioned as "100% online" instead.
  - Added international-founder positioning ("Canadian and international founders alike") where appropriate.
  - Rewrote federal/provincial explanation in FAQ and home to neutral ("each is a valid route — depends on where you operate, name-protection scope, budget") rather than presenting one as superior.
  - Added a dedicated "Are NUANS fees included?" FAQ entry + made NUANS-fee-not-included explicit in pricing hero copy.
  - Removed "Most Popular" badge from home jurisdiction cards — jurisdiction is not a product tier.
- **New shared components**:
  - `src/components/NaicsCombobox.tsx` — searchable, keyboard-navigable combobox over NAICS codes with sector grouping.
  - `src/components/AddressAutocomplete.tsx` — Google Places-powered input with graceful no-key fallback and structured parsing.
- Verified `npx tsc --noEmit`, `npm run lint`, and `npm run build` — all pass (19 static pages prerendered; wizard route weight 59.4 kB / 156 kB first-load).
- **Next**: Register the Korporex domain (likely `korporex.ca` + `korporex.com`); set up the first professional mailboxes (`contact@`, `support@`, `noreply@`). Configure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Vercel to enable address autofill. Then wire the contact/hero/wizard forms to a real backend — unblocks the two high-sev form-intake issues. Finalize NUANS pass-through pricing and update `NUANS_FEE` if different from $45. Long-term: add per-article OpenGraph metadata; add search/filter on `/resources` when article count grows.
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
