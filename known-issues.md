# Known Issues

## Open

### [Severity: medium] Terms of Service and Privacy Policy are living drafts pending legal review
- **Where**: `src/app/terms/page.tsx` and `src/app/privacy/page.tsx`.
- **Symptom**: Both pages are structurally complete and now reference the correct legal entity (Korporex Business Solutions Inc., CBCA / Ontario HQ) with a confirmed no-refund policy, but have not yet been reviewed by qualified legal counsel.
- **Impact**: Lowered from high to medium because the main substantive unknowns (entity name, refund policy) are now resolved. Still blocks final go-live until user's review pass confirms limitation-of-liability cap (CAD $100 floor), governing-law choice (Ontario), registered-office-service clauses, and any other jurisdiction-specific language.
- **Why not fixed yet**: Waiting on user's legal review pass. Drafts are marked as "living" — both files carry a `NOTE TO REVIEWERS` comment indicating they should be revised as operational processes solidify.
- **Logged**: 2026-04-23 (updated later same day — entity + refund policy resolved)

### [Severity: high] Registered-office add-on uses placeholder physical addresses
- **Where**: `src/lib/pricing.ts` — `REG_OFFICE_ADDON.basic.address` and `REG_OFFICE_ADDON.premium.address`.
- **Symptom**: Customers who select the Basic or Premium add-on get a placeholder Ontario address (Mississauga / 181 Bay Street) on their Articles of Incorporation. These addresses are NOT under Korporex's control.
- **Impact**: **Blocks go-live of the add-on.** If a customer pays for the service today, their filed corporate record lists an address Korporex doesn't operate — legally invalid and would cause mail delivery failures.
- **Why not fixed yet**: Waiting on user to provide the real physical address(es) we'll use for the service. Once provided, it's a one-line-per-field change in `REG_OFFICE_ADDON`.
- **Logged**: 2026-04-23

### [Severity: low] Stripe webhook endpoint still uses Vercel's `.vercel.app` alias
- **Where**: Stripe Dashboard (live mode) → Developers → Webhooks → "Korporex production — checkout" destination. URL: `https://korporex.vercel.app/api/stripe-webhook`.
- **Symptom**: The webhook endpoint URL reveals the hosting provider (Vercel) and is inconsistent with the rest of the site, which is now served at `https://korporex.com` after the 2026-04-23 DNS cutover.
- **Impact**: Cosmetic/branding only. Webhook delivery works identically — the `.vercel.app` alias is a permanent Vercel project alias and will continue resolving to the production deployment indefinitely, regardless of DNS cutover state.
- **Why not fixed yet**: Zero customer impact and any in-place URL change risks missing events during the switch. Recommended cleanup path when ready: create a **second** webhook destination at `https://korporex.com/api/stripe-webhook`, observe both deliver successfully for 24–48 hours, then delete the `.vercel.app` one. No urgency.
- **Logged**: 2026-04-23

### [Severity: low] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` not set for Vercel Preview scope
- **Where**: Vercel project `youness-7473s-projects/korporex`, env var `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Production is set, Preview is not.
- **Symptom**: Any future Preview deployment (PR branch, staging URL) would render `/incorporate` without Google Places autocomplete.
- **Impact**: None today (no active preview deploys). Will affect branch-preview deploys once the workflow ramps up.
- **Why not fixed yet**: Vercel CLI v51.8.0 rejects `vercel env add ... preview --value X --yes` with `git_branch_required` even though the docs say omitting branch = "all preview branches". Dashboard workaround: https://vercel.com/youness-7473s-projects/korporex/settings/environment-variables → Add → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` → check Preview → paste value.
- **Logged**: 2026-04-23

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

- **2026-04-23** — `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` was empty in Vercel Production — Removed the empty entry (`vercel env rm`), re-added the correct key (`vercel env add`), and triggered a production redeploy (`vercel deploy --prod`). Added `.vercelignore` excluding `build-tmp/` so the scratch folder's locked Chrome files don't break uploads again. Preview scope still pending — blocked by a CLI v51.8.0 quirk and tracked as its own low-sev issue.
- **2026-04-23** — Incorporation wizard did not process payments — Wired Stripe Checkout (hosted) end-to-end. Step 7 POSTs to `/api/incorporate`, which creates a Checkout Session (package + NUANS + tax as CAD line items, pricing recalculated server-side from `@/lib/pricing`) and returns the URL; the browser full-page redirects to stripe.com. Card fields removed from the wizard UI (PCI stays on stripe.com). On payment success, `/api/stripe-webhook` (signature-verified via raw body) sends a "[PAID]" follow-up email to `contact@korporex.com` referencing the shared `KPX-YYYYMMDD-XXXX` order ref so operators can cross-reference with the earlier "[PENDING]" intake. Confirmation page is now dynamic and retrieves the Stripe session to surface the order ref + amount paid. Currently wired for test mode (card `4242 4242 4242 4242`); live-mode is a key swap in Vercel.
- **2026-04-23** — Incorporation wizard intake was not emailed / stored — Built `/api/incorporate` (Next.js route handler in `src/app/api/incorporate/route.ts`) that validates the full wizard payload with Zod, recalculates pricing server-side from the shared `@/lib/pricing` module, and emails a structured HTML summary to `contact@korporex.com` via Brevo with `replyTo` set to the primary director. Step 7 is now async with submitting / error states — on success it navigates to the confirmation page. Card details (`cardNumber` / `expiry` / `cvc` / `cardholderName`) are deliberately excluded from the schema and stripped client-side, so PCI data never reaches the server. Dev fallback without `BREVO_API_KEY` logs submissions to the console. Issue [Severity: high] "Incorporation wizard does not process payments" remains open as the separate Stripe scope.
- **2026-04-22** — Hero + contact-page forms were stub-only — Built `/api/contact` (Next.js route handler in `src/app/api/contact/route.ts`) that validates with Zod and posts to Brevo's Transactional Email API, sending a branded HTML notification to `contact@korporex.com` with the submitter's email in `replyTo`. Wired `HeroContactForm` and the contact page form with submitting / error states. Gracefully no-ops when `BREVO_API_KEY` is unset (logs submission to server console) so local dev isn't blocked. Requires user to generate a Brevo API key (SMTP & API → API keys tab) and add `BREVO_API_KEY` to Vercel env vars for Prod/Preview/Development before deploying.
- **2026-04-22** — Email infrastructure for `contact@korporex.com` — Registered `korporex.com`; Cloudflare DNS + Email Routing forwards inbound to owner's Gmail (inbound live). Provisioned Brevo account, generated dedicated SMTP key `gmail-send-as`, merged `include:spf.brevo.com` into the existing SPF TXT on `korporex.com`, configured Gmail "Send mail as" via `smtp-relay.brevo.com:587` (TLS) with Brevo's auto-generated SMTP login, clicked forwarded verification link, and confirmed with a live send test. `contact@korporex.com` is now bidirectional. Scope note: `korporex.ca`, `support@`, and `noreply@` are explicitly deferred.
- **2026-04-21** — Address autofill was inactive on the deployed wizard — Created a Google Cloud project, enabled Maps JavaScript API + Places API, generated an HTTP-referrer + API-restricted browser key, set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Vercel (all environments), redeployed, and attached a billing profile to the GCP project (required for the APIs to serve requests — free $200/mo Maps credit applies). Verified live on production: `/incorporate` address fields now return Google Places suggestions and autofill street / city / region / postal / country.
- **2026-04-21** — Resources article links were placeholder `#` anchors — Built dynamic article pages at `/resources/[slug]` with full content for all six articles (see `src/app/resources/articles.ts` and `src/app/resources/[slug]/page.tsx`).
- **2026-04-21** — Old project folder duplicate on disk — Verified uncommitted changes were identical to committed state in the active folder, then deleted `C:\Users\marke\OneDrive\Documents\Korporex Website\`.
- **2026-04-21** — Site metadata used banned "advisory" language — Rewrote title and description in `src/app/layout.tsx` to incorporation-focused copy.
- **2026-04-21** — `.claude/settings.local.json` was tracked in git — Untracked via `git rm --cached` and added `.claude/` to `.gitignore` (commit `d9a6aad`).
