# Known Issues

## Open

### [Severity: high] No backend integration on any form
- **Where**: `src/components/HeroContactForm.tsx`, `src/app/incorporate/page.tsx`, contact page
- **Symptom**: Form submissions set local `submitted: true` and show a thank-you state, but data is never sent or stored anywhere.
- **Impact**: Cannot collect leads, contact requests, or incorporation orders in production. The site is a brochure with no functional intake.
- **Why not fixed yet**: Backend / form-submission destination (email, CRM, database) not yet decided or built.
- **Logged**: 2026-04-21

### [Severity: high] Incorporation wizard does not process payments
- **Where**: `src/app/incorporate/page.tsx`, `src/app/incorporate/confirmation/page.tsx`
- **Symptom**: Wizard collects 8 steps of data then navigates to a confirmation page; no payment processor (Stripe/etc) integration.
- **Impact**: Cannot actually incorporate anyone. Confirmation page is misleading until this is fixed or until copy makes the stub status clear.
- **Why not fixed yet**: Payment integration depends on backend decisions (per issue above) and business setup (merchant account, pricing finalization).
- **Logged**: 2026-04-21

### [Severity: medium] No custom domain or professional email addresses yet
- **Where**: Site-wide — currently deployed on Vercel's `*.vercel.app` subdomain; no `@korporex.*` email.
- **Symptom**: Marketing site and (future) form-submission flow have no branded domain or email identity. The site currently exposes `contact@korporex.com` as the enquiry address, but the mailbox doesn't exist yet.
- **Impact**: Credibility cost on a professional service site; any message sent to `contact@korporex.com` bounces today; can't launch form backend (receiving/sending email) until mailboxes exist.
- **Why not fixed yet**: Domain registration and Google Workspace / Zoho setup are user-action steps, not code. Recommended starter mailboxes: `contact@` (live, listed), `support@`, `noreply@`.
- **Logged**: 2026-04-21

### [Severity: low] NUANS pass-through fee is a placeholder
- **Where**: `src/app/incorporate/page.tsx` — `NUANS_FEE = 45`.
- **Symptom**: Review step shows a $45 NUANS line item for federal and Ontario named corporations. This is an indicative number, not a confirmed pass-through price.
- **Impact**: Customer-facing price may differ from actual NUANS report cost + handling once finalized.
- **Why not fixed yet**: Pricing decision is pending. Constant is documented in a code comment so it's a one-line adjustment when final.
- **Logged**: 2026-04-21

### [Severity: low] Canadian sales-tax rates cover GST/HST only (no PST)
- **Where**: `src/app/incorporate/page.tsx` — `CA_TAX_RATES` / `getTaxRate()`.
- **Symptom**: Tax is charged as 5% in BC / SK / MB (GST-only) instead of the province-specific combined rate, because Korporex isn't currently registered to collect PST in any province.
- **Impact**: Under-collects tax in PST provinces *if* Korporex ever registers to collect there. Correct today while unregistered.
- **Why not fixed yet**: Accurate today given registration status. Revisit when/if PST registrations are obtained.
- **Logged**: 2026-04-21

### [Severity: medium] No automated tests
- **Where**: Project-wide.
- **Symptom**: No unit, integration, or e2e test setup. Regressions caught only by manual testing.
- **Impact**: Risk grows as multi-step form logic, validation, and (future) backend code expand.
- **Why not fixed yet**: Early stage; backend integration will significantly change the test surface, so deferring until that lands.
- **Logged**: 2026-04-21

### [Severity: low] Tailwind `navy-*` tokens are actually green
- **Where**: `tailwind.config.ts` and every component using `navy-900`, `navy-50`, etc.
- **Symptom**: Class name suggests navy blue, but `navy-900` is forest green (`#1B4332`). Confusing for new developers.
- **Impact**: Cosmetic / DX only — visuals are correct.
- **Why not fixed yet**: Renaming requires editing every `className` across the codebase. Documented in `CLAUDE.md` as a deliberate naming choice. Defer until a larger styling pass.
- **Logged**: 2026-04-21

## Resolved

- **2026-04-21** — Address autofill was inactive on the deployed wizard — Created a Google Cloud project, enabled Maps JavaScript API + Places API, generated an HTTP-referrer + API-restricted browser key, set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Vercel (all environments), redeployed, and attached a billing profile to the GCP project (required for the APIs to serve requests — free $200/mo Maps credit applies). Verified live on production: `/incorporate` address fields now return Google Places suggestions and autofill street / city / region / postal / country.
- **2026-04-21** — Resources article links were placeholder `#` anchors — Built dynamic article pages at `/resources/[slug]` with full content for all six articles (see `src/app/resources/articles.ts` and `src/app/resources/[slug]/page.tsx`).
- **2026-04-21** — Old project folder duplicate on disk — Verified uncommitted changes were identical to committed state in the active folder, then deleted `C:\Users\marke\OneDrive\Documents\Korporex Website\`.
- **2026-04-21** — Site metadata used banned "advisory" language — Rewrote title and description in `src/app/layout.tsx` to incorporation-focused copy.
- **2026-04-21** — `.claude/settings.local.json` was tracked in git — Untracked via `git rm --cached` and added `.claude/` to `.gitignore` (commit `d9a6aad`).
