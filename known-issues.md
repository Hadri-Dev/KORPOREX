# Known Issues

## Open

### [Severity: high] Incorporation wizard intake is not emailed / stored
- **Where**: `src/app/incorporate/page.tsx` step-7 submit handler, `src/app/incorporate/confirmation/page.tsx`.
- **Symptom**: The wizard still sets local `submitted: true` and navigates to the confirmation page; the 8 steps of collected data (applicant, directors, shareholders, registered office, billing, etc.) are never sent or stored anywhere.
- **Impact**: If a visitor completes the wizard, we have no way to see what they submitted. Hero and contact-page forms are fine (they now email `contact@korporex.com` via `/api/contact`); the wizard is the remaining gap.
- **Why not fixed yet**: Deferred in this pass — wizard payload is larger and tightly bound to the payment-processing issue below. Fastest unblock: add a `/api/incorporate` route that emails the full payload to `contact@korporex.com` *before* wiring Stripe, so orders are captured even without live payment.
- **Logged**: 2026-04-21 (narrowed to wizard on 2026-04-22 after contact forms were wired)

### [Severity: high] Incorporation wizard does not process payments
- **Where**: `src/app/incorporate/page.tsx`, `src/app/incorporate/confirmation/page.tsx`
- **Symptom**: Wizard collects 8 steps of data then navigates to a confirmation page; no payment processor (Stripe/etc) integration.
- **Impact**: Cannot actually incorporate anyone. Confirmation page is misleading until this is fixed or until copy makes the stub status clear.
- **Why not fixed yet**: Payment integration depends on backend decisions (per issue above) and business setup (merchant account, pricing finalization).
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

- **2026-04-22** — Hero + contact-page forms were stub-only — Built `/api/contact` (Next.js route handler in `src/app/api/contact/route.ts`) that validates with Zod and posts to Brevo's Transactional Email API, sending a branded HTML notification to `contact@korporex.com` with the submitter's email in `replyTo`. Wired `HeroContactForm` and the contact page form with submitting / error states. Gracefully no-ops when `BREVO_API_KEY` is unset (logs submission to server console) so local dev isn't blocked. Requires user to generate a Brevo API key (SMTP & API → API keys tab) and add `BREVO_API_KEY` to Vercel env vars for Prod/Preview/Development before deploying.
- **2026-04-22** — Email infrastructure for `contact@korporex.com` — Registered `korporex.com`; Cloudflare DNS + Email Routing forwards inbound to owner's Gmail (inbound live). Provisioned Brevo account, generated dedicated SMTP key `gmail-send-as`, merged `include:spf.brevo.com` into the existing SPF TXT on `korporex.com`, configured Gmail "Send mail as" via `smtp-relay.brevo.com:587` (TLS) with Brevo's auto-generated SMTP login, clicked forwarded verification link, and confirmed with a live send test. `contact@korporex.com` is now bidirectional. Scope note: `korporex.ca`, `support@`, and `noreply@` are explicitly deferred.
- **2026-04-21** — Address autofill was inactive on the deployed wizard — Created a Google Cloud project, enabled Maps JavaScript API + Places API, generated an HTTP-referrer + API-restricted browser key, set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Vercel (all environments), redeployed, and attached a billing profile to the GCP project (required for the APIs to serve requests — free $200/mo Maps credit applies). Verified live on production: `/incorporate` address fields now return Google Places suggestions and autofill street / city / region / postal / country.
- **2026-04-21** — Resources article links were placeholder `#` anchors — Built dynamic article pages at `/resources/[slug]` with full content for all six articles (see `src/app/resources/articles.ts` and `src/app/resources/[slug]/page.tsx`).
- **2026-04-21** — Old project folder duplicate on disk — Verified uncommitted changes were identical to committed state in the active folder, then deleted `C:\Users\marke\OneDrive\Documents\Korporex Website\`.
- **2026-04-21** — Site metadata used banned "advisory" language — Rewrote title and description in `src/app/layout.tsx` to incorporation-focused copy.
- **2026-04-21** — `.claude/settings.local.json` was tracked in git — Untracked via `git rm --cached` and added `.claude/` to `.gitignore` (commit `d9a6aad`).
