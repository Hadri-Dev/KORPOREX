# Archived: British Columbia incorporation service

BC incorporation was removed from the live site on **2026-04-27** while we focus
operational capacity on Federal and Ontario filings. This folder preserves the
BC-specific code and copy so the offering can be restored without recreating
anything from scratch.

The files here are **not imported by the app**. The Next.js build does not
compile this folder (it's excluded in `tsconfig.json`).

## What is preserved

| File | Original location | Notes |
|---|---|---|
| [`article.ts`](article.ts) | `src/app/resources/articles.ts` (entry: `incorporating-in-bc`) | Full "Incorporating in BC: A Step-by-Step Overview" article, ready to splice back into the `articles` array. |
| [`data.ts`](data.ts) | `src/lib/pricing.ts` | BC-specific entries that were removed: package prices, NUANS fee (BC charges $0 for NUANS — uses its own Name Request system), `JURISDICTION_LABELS.bc`, and the `regOfficeAddonAvailable` BC carve-out. |
| [`services.ts`](services.ts) | `src/app/services/page.tsx` | The four BC service entries (Standard / Professional / Non-Profit / Holding) plus the BC sole-proprietorship and business-name registration entries. |
| [`pricing-page.ts`](pricing-page.ts) | `src/app/pricing/page.tsx` | The BC jurisdiction tab definition and the BC pricing-card data. |
| [`copy.md`](copy.md) | Various | Plain-English snippets that were edited to drop BC mentions (FAQ answers, homepage copy, soon-page sub-line, layout metadata, etc.) — kept verbatim so re-adding BC reads naturally. |

## How to restore

1. **Type** — re-add `"bc"` to `Jurisdiction` in [`src/lib/pricing.ts`](../../lib/pricing.ts).
2. **Pricing data** — paste the entries from [`data.ts`](data.ts) back into the
   matching maps in `pricing.ts` (`PRICES.bc`, `NUANS_FEES.bc`,
   `JURISDICTION_LABELS.bc`) and re-add the BC carve-out in
   `regOfficeAddonAvailable`.
3. **Wizard** — in [`src/app/incorporate/page.tsx`](../../app/incorporate/page.tsx),
   re-add the BC card in the jurisdiction array (Step 1), re-add the BC name-
   approval callout on Step 3, the BC-resident director carve-out on Step 4,
   the BC-records-office copy on Step 7, and the `regionLock`/`jurisLabel` BC
   branches.
4. **API** — in [`src/app/api/incorporate/route.ts`](../../app/api/incorporate/route.ts),
   add `"bc"` back to the `jurisdiction` Zod enum and re-add the BC-resident
   row in the intake email (gated by `d.jurisdiction !== "ontario"`, the same
   pattern used pre-removal).
5. **Forms / nav** — re-add the BC option in
   [`HeroContactForm.tsx`](../../components/HeroContactForm.tsx),
   [`SoonContactForm.tsx`](../../components/SoonContactForm.tsx), and the
   "BC Incorporation" footer link in
   [`Footer.tsx`](../../components/layout/Footer.tsx).
6. **Pricing & services pages** — paste back from
   [`pricing-page.ts`](pricing-page.ts) and [`services.ts`](services.ts).
7. **Resources article** — paste the entry in [`article.ts`](article.ts) back
   into the `articles` array in `src/app/resources/articles.ts`.
8. **Copy edits** — undo the edits documented in [`copy.md`](copy.md) (homepage
   jurisdictions block, FAQ answers that drop BC, soon-page sub-line, layout
   metadata, terms/privacy registry enumeration, legal-consultation hint).
9. **Verify** — `npx tsc --noEmit && npm run lint && npm run build`.
