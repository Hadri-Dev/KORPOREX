# Progress

## Current Focus
Contact-form backend is live — hero + contact-page forms POST to `/api/contact`, which validates with Zod and posts to Brevo's Transactional Email API to deliver a branded HTML notification to `contact@korporex.com` (reply-to = submitter). Gracefully no-ops when `BREVO_API_KEY` is unset so local dev isn't blocked. User action required: generate a Brevo API key (SMTP & API → API keys tab) and add `BREVO_API_KEY` to Vercel env vars. Next focus: wire the incorporation wizard's step-7 submit to a parallel `/api/incorporate` route (captures order data even before Stripe is live), then Stripe payments.

## Log

### 2026-04-22
- **Wizard polish — red required-asterisks + hover-green Named/Numbered cards.** Modified the shared `Field` component in `src/app/incorporate/page.tsx` to detect a trailing ` *` on labels and render the asterisk in `text-red-500`, so every required field across all 8 wizard steps now shows a red asterisk (one edit, ~25 form fields covered). Applied the `group` / `group-hover:` hover-to-forest-green pattern to the Named / Numbered selection cards on the Business Details step, with white title and gray-300 description on hover. Selected-state navy-50 tint preserved when not hovering. Type-check green.
- **Home jurisdiction cards — parity with pricing hover.** Applied the same `group` / `group-hover:` pattern to the Federal / Ontario / BC cards on the home page: card fades to forest green on hover, all text flips to white / gray-300/400. "Start" button changed from filled-navy to the outlined `border-navy-900 text-navy-900` default, flipping to gold-filled (`bg-gold-500 text-white`) on group-hover — matching the "Get Started" CTA on `/pricing`. Home + pricing now feel visually consistent.
- **Pricing page — hover state.** Added a `group` / `group-hover:` interaction so the hovered tier card flips to forest green (`bg-navy-900`) with white price, gray-200/300 supporting text, and a gold-filled CTA — all with `transition-colors` for a smooth swap. Cursor leaves → card returns to white. Replaces the static "Most Popular" highlight with a uniform-but-interactive treatment so all three tiers compete equally.
- **Pricing page — removed "Most Popular" treatment on Standard tier.** All three tiers (Basic / Standard / Premium) now render with identical styling — white card, gray border, navy text, gold check-marks, outlined CTA. Dropped the `featured` flag from the pricing data model and the conditional styling in `src/app/pricing/page.tsx`. Rationale: customer choice should be driven by the feature list, not a visual thumb-on-the-scale. Type-check green.
- **Contact-form backend live** (hero + contact page). Added `src/app/api/contact/route.ts` — Next.js route handler with Zod schema, posts to `https://api.brevo.com/v3/smtp/email`. Notification email is sent `from contact@korporex.com → to contact@korporex.com` with `replyTo` set to the submitter's email, so clicking "Reply" in Gmail responds directly to the customer. Email body is a clean HTML summary with gold-accent styling matching the brand. Dev fallback: when `BREVO_API_KEY` is missing, submission is logged to the server console and the API returns `{ ok: true, dev: true }` so the UI still completes its success flow. Hero + contact-page forms now show a "Sending…" state and an inline error if the send fails. Type-check, lint, and production build all green (20 routes — `/api/contact` is the new dynamic route). `.env.local.example` updated with a documented `BREVO_API_KEY` entry. Scope: contact forms only — wizard step-7 intake is unchanged in this pass (see updated known-issues entry).
- **Brand assets as SVG** — Created scalable SVG logo + business card files under `public/`:
  - `public/logo/logo-mark.svg` (64×64 K badge)
  - `public/logo/logo-full.svg` (mark + wordmark, light-bg lockup)
  - `public/logo/logo-full-white.svg` (mark + wordmark, dark-bg lockup)
  - `public/business-card/business-card-front.svg` (89×51 mm, navy w/ centered K + tagline)
  - `public/business-card/business-card-back.svg` (89×51 mm, cream w/ `YOUR NAME` / `YOUR TITLE` placeholders + contact)
  - All use exact brand tokens: `#1B4332` forest green, `#C5A35A` gold, `#FAFAF8` cream, Playfair Display serif + Inter sans. Logos are text-based SVG (fonts from next/font on site) — for print, outline fonts to paths in Illustrator/Figma/Inkscape before sending to printer.
  - Navbar unchanged (still uses the inline `<div>`-based KLogo); optional follow-up to swap in `logo-mark.svg` via `next/image`.
  - Exported PNG renders of all five SVGs via Chrome headless (no image-converter dependency added). Outputs in `public/logo/png/` (`logo-mark.png` 512×512, `logo-full.png` / `logo-full-white.png` 1400×320) and `public/business-card/png/` (`business-card-front.png` / `business-card-back.png` 1050×600 — roughly 300 DPI for 89×51 mm cards). Added `/build-tmp` to `.gitignore` for the headless-render scratch folder.
- **Outbound email live.** Generated dedicated Brevo SMTP key `gmail-send-as` (Active). Configured Gmail "Send mail as" for `contact@korporex.com` pointing at `smtp-relay.brevo.com:587` (TLS) with the Brevo-auto-generated SMTP login. Verification email flowed: Gmail → Brevo → recipient DNS → Cloudflare Email Routing → owner's Gmail → clicked verification link → confirmed. Sent a live test from Gmail as `contact@korporex.com` — delivered successfully. `contact@korporex.com` is now bidirectional.
- **Scope decisions**: `korporex.com` is the only domain in play — `korporex.ca` is explicitly **not** being registered at this time. First-phase mailboxes are scoped to `contact@` only; `support@` and `noreply@` are **deferred** to a future phase. Update any suggestion / plan / email-relay config to reflect just `contact@korporex.com`.
- **Email infrastructure — inbound live, outbound in progress.**
  - `korporex.com` registered; DNS managed in Cloudflare (nameservers `doug.ns.cloudflare.com`, `melany.ns.cloudflare.com`).
  - Cloudflare Email Routing configured: `contact@korporex.com` forwards to the owner's personal Gmail — inbound verified working.
  - Outbound path chosen: Brevo SMTP relay (`smtp-relay.brevo.com:587`, TLS) + Gmail "Send mail as", so replies/new mail appear to come from `contact@korporex.com` while using the Gmail UI. Brevo free tier = 300 emails/day, adequate for current form-submission volume.
  - Brevo account provisioned; SMTP credentials visible in dashboard (SMTP username is Brevo's auto-generated `*@smtp-brevo.com` login, not the account email — noted because it's a common setup gotcha). Active SMTP key exists; full key only shown once at creation, so regenerate + save if not archived.
  - Pending before outbound is live: (1) merge Brevo into existing SPF record on `korporex.com` — currently `v=spf1 include:_spf.mx.cloudflare.net ~all`, needs `include:spf.brevo.com` added before `~all`; (2) add DKIM records from Brevo's domain-verification wizard; (3) add Gmail send-as entry pointing at Brevo SMTP and click the verification link (routes back via Cloudflare forwarding); (4) add `_dmarc` TXT record with `p=none` for monitoring.
- **Next**: Wire the contact / hero / wizard forms to a real intake path. Recommended approach — **Brevo Transactional API** from a Next.js API route (`/api/contact`, `/api/incorporate`): reuses the existing Brevo account + domain auth, no new service, stays on the free 300/day tier. Send two emails per submission: (1) notification to `contact@korporex.com` with full payload, (2) auto-reply to the submitter confirming receipt. Store nothing server-side initially — email-as-database is fine for launch volume. Closes both high-sev intake issues. Then Stripe for the wizard and finalize NUANS pass-through pricing.
- **Open verification**: confirm Brevo domain verification (DKIM records in Cloudflare) is complete — needed for reliable deliverability to non-Gmail recipients. 2-min check: send test from Gmail-as-`contact@korporex.com` to a fresh `mail-tester.com` address, target 10/10.

### 2026-04-21
- **Google Maps address autofill is now LIVE in production**. Full setup done end-to-end:
  - Created GCP project; enabled Maps JavaScript API + Places API.
  - Generated browser key, restricted to HTTP referrers (`localhost:3000`, `*.vercel.app`, `korporex.com`, `korporex.ca`) and scoped to Maps JS + Places APIs only.
  - Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Vercel across all environments and redeployed.
  - Attached a billing profile to the GCP project — without it, Google returned `BillingNotEnabledMapError` on every request even though the key was valid. Free $200/mo Maps credit covers ~70k autocomplete sessions; real billing only triggers well above current traffic.
  - User verified working: address fields on `/incorporate` return real Google Places suggestions and autofill street/city/region/postal/country on selection.
  - Note: `korporex.com` currently serves a separate WordPress site (unrelated to this Next.js app). DNS cutover to point at Vercel is a future decision — not blocking anything today since the Vercel URL works and the API key's referrer list already includes the domain for whenever it switches over.
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
