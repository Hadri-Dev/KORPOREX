# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Inherits from** [`../CLAUDE.md`](../CLAUDE.md) — the universal development guidelines (project structure, tracking files, hard rules, session workflow). Read both at session start.

## Tracking Files

- [`progress.md`](progress.md) — current state, recent edits, next steps (update after every edit)
- [`known-issues.md`](known-issues.md) — open bugs, deferred decisions, technical debt (read before editing nearby code)

If either file is missing, create it from the templates in [`../CLAUDE.md`](../CLAUDE.md) before doing other work.

## Quick Start

- **Dev server**: `npm run dev` — runs on `http://localhost:3000`
- **Build**: `npm run build` — builds for production
- **Lint**: `npm run lint` — runs ESLint (Next.js config)
- **Production server**: `npm start` — after building

TypeScript is in **strict mode** (`tsconfig.json`) — no implicit `any`, strict null checks. Resolve type errors at the source; do not use `as any` or `// @ts-ignore` to silence them.

## Environment Variables

Copy `.env.local.example` to `.env.local` (gitignored) and fill in. For Vercel, add the same variables in the project dashboard under **Settings → Environment Variables**, or via `vercel env add <NAME>` if the project is linked with `vercel link`.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No (feature-gated) | Enables Google Places address autocomplete in the incorporation wizard. Without it, address inputs fall back to plain text (the wizard still works). The `NEXT_PUBLIC_` prefix exposes the key to the browser — it must be HTTP-referrer restricted and API-scoped to Maps JavaScript + Places in Google Cloud Console. See `.env.local.example` for setup steps. |
| `BREVO_API_KEY` | No (degrades) | Transactional email API key. `/api/contact` (contact + hero forms) and `/api/incorporate` (wizard intake) use it to email submissions to `contact@korporex.com`. Without it, both routes log to the server console and return success — so local dev isn't blocked. |
| `STRIPE_SECRET_KEY` | No (degrades) | Server-side Stripe key (`sk_test_...` for test mode, `sk_live_...` for live). `/api/incorporate` creates a Checkout Session when set. Without it, the wizard falls back to redirecting straight to `/incorporate/confirmation?dev=1` — useful for local dev, **must not ship to prod without the live key**. |
| `STRIPE_WEBHOOK_SECRET` | No (degrades) | Signing secret for `/api/stripe-webhook`. Locally, get this from `stripe listen --forward-to localhost:3000/api/stripe-webhook`. In prod, each Stripe Dashboard webhook endpoint has its own `whsec_...`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No (currently unused) | Reserved for future migration to Stripe Elements / Embedded Checkout. Not referenced by current code (hosted Checkout doesn't need it client-side). |
| `NEXT_PUBLIC_SITE_URL` | No (degrades) | Absolute origin used to build Stripe `success_url` / `cancel_url`. Falls back to `VERCEL_URL` then `http://localhost:3000`. Set explicitly on Vercel once DNS cuts over. |

## Payments — Stripe Checkout

**Flow**: wizard Step 7 → `POST /api/incorporate` → server sends "[PENDING]" email + creates Checkout Session → browser redirects to `session.url` (stripe.com) → Stripe posts to `POST /api/stripe-webhook` on success → webhook sends "[PAID]" follow-up email → Stripe redirects browser to `/incorporate/confirmation?session_id=...&ref=...` which verifies the session and displays the order ref.

**Key architecture decisions**:
- **Hosted Checkout, not Elements** — zero PCI scope on our server; card data only touches stripe.com. Switching to Embedded Checkout later is a small change (replace redirect with `Stripe.js` mount).
- **Order reference (`KPX-YYYYMMDD-XXXX`)** is generated in `src/lib/orderRef.ts` and shared between the "[PENDING]" intake email and the "[PAID]" webhook email. It's how the operator cross-references a paid order with its full submission data (which is only in the intake email — Stripe metadata is limited to ~500 chars/value).
- **Pricing recalculates server-side** in `src/lib/pricing.ts` — do not trust totals from the client. Tax is passed to Stripe as an explicit line item (we don't have Stripe Tax enabled).
- **Intake email fires before payment**, deliberately. Even abandoned carts are logged so the operator can follow up. The webhook's "[PAID]" email is the signal that money actually moved.
- **Webhook signature verification uses the raw body** (`req.text()`) — never parse the body as JSON before `stripe.webhooks.constructEvent`.
- **Card fields are NOT in the wizard UI** — Stripe's hosted page handles them. Step 7 collects billing name + billing address only; these are kept in our system and also passed as Stripe session metadata so the [PAID] email shows who paid.

**Test card**: `4242 4242 4242 4242` with any future expiry and any 3-digit CVC (Stripe test mode only — see `.env.local.example` for keys).

**Local webhook testing**:
```bash
# terminal 1
npm run dev
# terminal 2
stripe listen --forward-to localhost:3000/api/stripe-webhook
# paste the whsec_... it prints into STRIPE_WEBHOOK_SECRET in .env.local, then restart dev
```

**Production webhook**: add endpoint `https://<domain>/api/stripe-webhook` in Stripe Dashboard → Developers → Webhooks, subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`. Copy the endpoint's signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS (custom color palette)
- **Forms**: React Hook Form + Zod (type-safe validation)
- **Icons**: lucide-react
- **Fonts**: Playfair Display (serif headings) and Inter (body) via next/font/google
- **Deployment**: GitHub → Vercel (auto-deploys on push to main)

## Project Context

**Korporex** is an online business incorporation platform for Canadian entrepreneurs. It handles federal and provincial (Ontario, BC) incorporation with a modern, design-forward web experience.

⚠️ **CRITICAL: Korporex is NOT a law firm and does NOT provide legal advice.** This is non-negotiable. Never frame Korporex as providing legal services, consulting, or advisory. The platform is a document preparation and filing service only. All content must make this distinction clear.

**Korporex is completely separate from Hadri Law.** They are independent entities with no affiliation. Do not confuse or combine the two brands.

## Key Design Decisions

### Color Palette

The Tailwind config uses the class name `navy-` for forest green (#1B4332) for historical reasons. All `navy-900`, `navy-50`, etc. are shades of green, not blue. `gold-500` is the warm gold accent (#C5A35A). `cream-50` is an off-white background (#FAFAF8).

### Navigation Structure

**Navbar tabs** (in order): Services, Pricing, About, FAQ, Resources, Contact
- The K logo links home
- "Incorporate Now" button in nav always points to `/incorporate`
- Removed "Home" tab because the logo provides home navigation

**Sidebar resources pages** (e.g., `/faq`) use client-side state for filtering/selection (see AccordionItem in `src/app/faq/page.tsx`).

### Page Architecture

Each main page is a server component (no `"use client"` at the top level). Form and interactive UI is split into separate client components:
- `src/components/HeroContactForm.tsx` — interactive form in hero section
- `src/app/incorporate/page.tsx` — 8-step multi-step form with local React state

When a new interactive feature is needed, extract it as a separate client component and import it into the server page.

### Forms & Validation

Multi-step forms use:
1. **React Hook Form** (`useForm`, `useFieldArray`) for state and submission
2. **Zod schemas** for runtime validation
3. **Local React state** (`useState`) to track the current step and form data
4. **Backends**: `/api/contact` (hero + contact-page forms) and `/api/incorporate` (wizard Step 7) — both POST JSON and return `{ ok }` / `{ url }` / `{ error }`. See **Payments — Stripe Checkout** below for the wizard flow.

Example pattern:
```tsx
const schema = z.object({ name: z.string().min(1) });
const { register, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

When adding dynamic fields, use `useFieldArray` to add/remove items (e.g., directors, shareholders in the incorporation wizard).

## File Structure

```
src/
  app/
    layout.tsx           # Root layout with fonts, navbar, footer, pt-[72px] for fixed navbar
    page.tsx             # Home (hero with contact form, services, how-it-works, testimonials)
    about/               # About page
    contact/             # Contact page
    services/            # Services listing (5 categories with expandable services)
    pricing/             # Pricing with jurisdiction selector (Federal/Ontario/BC)
    faq/                 # FAQ with category sidebar (accordion pattern)
    resources/           # Resource articles hub (stub for now)
    incorporate/         # 8-step incorporation wizard
      page.tsx           # Wizard with all 8 steps
      confirmation/page.tsx  # Confirmation after payment stub
  components/
    HeroContactForm.tsx      # Client form for home page hero
    layout/
      Navbar.tsx             # Fixed navbar with K logo
      Footer.tsx             # Footer with company links, contact, CTA
```

## Common Development Tasks

### Add a New Page

1. Create `src/app/page-name/page.tsx` as a server component
2. Use the existing page structure: hero, content sections, CTA footer
3. If the page needs interactive UI (forms, tabs, modals), extract those as client components

### Update Navigation

1. Edit `src/components/layout/Navbar.tsx` — update the `links` array
2. Edit `src/components/layout/Footer.tsx` — update the company links array
3. Keep tabs in this order: Services, Pricing, About, FAQ, Resources, Contact

### Add Form Validation

1. Create a Zod schema at the top of the component
2. Use `zodResolver(schema)` in `useForm()`
3. Access validation errors via `formState.errors`
4. For dynamic fields, wrap with `useFieldArray`

### Style with Tailwind

- Use the custom `navy-*`, `gold-*`, `cream-*` color tokens (defined in `tailwind.config.ts`)
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- Fixed navbar is 72px (`h-[72px]`) — all pages include `pt-[72px]` in main content
- Use serif font with `font-serif` class (Playfair Display), body uses default sans

## Key Constraints & Patterns

1. **Forms POST to API routes** — `/api/contact` for contact/hero, `/api/incorporate` for the wizard. Routes live in `src/app/api/*/route.ts`.
2. **Multi-step form navigation** — step state lives in `useState`, data is accumulated in a single object, validated at submit time
3. **Jurisdiction selection** — always Federal, Ontario, or BC (three supported jurisdictions)
4. **Postal codes** — Canadian format only (regex: `/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i`)
5. **Services page** — 5 categories with multiple services each; links pass jurisdiction/type as query params to `/incorporate`
6. **Payments** — Stripe Checkout (hosted). Never add card fields to the Korporex UI — Stripe's hosted page handles PCI. See **Payments — Stripe Checkout** section above.

## Content Guidelines

- **NOT a law firm** — Korporex is a document preparation and filing service. Never frame services as legal advice, legal consulting, or legal assistance. Banned phrases: "legal advice", "legal services", "legal consulting", "advisory", "lawyer", "attorney", "counsel"
- **What we ARE** — "online incorporation platform", "document preparation service", "filing service", "business registration platform"
- **Zero legal language** — never imply legal expertise or professional legal judgment
- **Focus on simplicity and speed** — "24 hours", "100% online", "no lawyer required" are key themes
- **Canadian context** — always reference Canadian jurisdictions, NUANS searches, corporate minute books, etc.
- **Tone** — professional but approachable; speak to entrepreneurs
- **Disclaimer** — footer includes: "Korporex is not a law firm and does not provide legal advice"

## Git & Deployment

- Branch: `main`
- Push to GitHub (`https://github.com/Hadri-Dev/KORPOREX.git`) → auto-deploys to Vercel
- Commit messages should clearly describe the change (e.g., "Add Resources page", "Fix Navbar tab order")
- No force-pushing to main
