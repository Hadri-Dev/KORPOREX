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

### [Severity: medium] Resources article links are placeholder anchors
- **Where**: `src/app/resources/page.tsx` — every `Article.slug` is `"#"`.
- **Symptom**: Clicking "Read more" on any article does nothing (jumps to top of page).
- **Impact**: Visitors hit dead ends; SEO loses any potential article-page indexing.
- **Why not fixed yet**: Article content not yet written; individual article pages not built.
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

### [Severity: low] Old project folder still on disk
- **Where**: `C:\Users\marke\OneDrive\Documents\Korporex Website\` (separate from this `Projects\Korporex Website\`).
- **Symptom**: Two clones of the same repo; risk of editing the wrong one.
- **Impact**: Confusion, wasted disk space.
- **Why not fixed yet**: Pending verification that latest commits push successfully to GitHub before old folder is deleted.
- **Logged**: 2026-04-21

## Resolved

- **2026-04-21** — `.claude/settings.local.json` was tracked in git — Untracked via `git rm --cached` and added `.claude/` to `.gitignore` (commit `d9a6aad`).
