# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

- **Dev server**: `npm run dev` — runs on `http://localhost:3000`
- **Build**: `npm run build` — builds for production
- **Lint**: `npm lint` — runs ESLint
- **Production server**: `npm start` — after building

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

**Navbar tabs** (in order): About, Services, Pricing, FAQ, Resources, Contact
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
4. **No backend integration** — forms are stubbed to navigate to confirmation pages

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
3. Keep tabs in this order: About, Services, Pricing, FAQ, Resources, Contact

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

1. **No async/server actions in interactive forms** — forms are client-side with local state, no backend calls
2. **Contact form submissions are stubbed** — they set `submitted: true` and show a thank-you state; no email integration yet
3. **Multi-step form navigation** — step state lives in `useState`, data is accumulated in a single object, validated at submit time
4. **Jurisdiction selection** — always Federal, Ontario, or BC (three supported jurisdictions)
5. **Postal codes** — Canadian format only (regex: `/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i`)
6. **Services page** — 5 categories with multiple services each; links pass jurisdiction/type as query params to `/incorporate`

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
