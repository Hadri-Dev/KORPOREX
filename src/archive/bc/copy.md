# Archived 2026-04-27 — copy snippets that were edited to drop BC mentions

These are the verbatim "before" versions of copy edited when BC was removed
from the live site. To restore BC, paste each block back over the current
edited version in the file noted.

---

## `src/app/page.tsx` — Featured Services jurisdictions array

```ts
const featuredServices = [
  {
    jurisdiction: "Federal",
    subtitle: "Canada Business Corporations Act",
    description: "Incorporate federally under the CBCA. Country-wide name protection and operate in any province (with extra-provincial registration).",
    from: "$499",
    href: "/incorporate?jurisdiction=federal",
  },
  {
    jurisdiction: "Ontario",
    subtitle: "Ontario Business Corporations Act",
    description: "Incorporate provincially in Ontario. Automatic authorization to carry on business throughout the province.",
    from: "$399",
    href: "/incorporate?jurisdiction=ontario",
  },
  {
    jurisdiction: "British Columbia",
    subtitle: "BC Business Corporations Act",
    description: "Incorporate provincially in British Columbia. Modern corporate legislation and a fully online filing system.",
    from: "$449",
    href: "/incorporate?jurisdiction=bc",
  },
];
```

## `src/app/page.tsx` — Jurisdictions copy block

```
Federal, Ontario, and British Columbia — each is a valid choice depending on where you plan to
operate, the name-protection scope you need, and your budget. None is superior; the right pick
depends on your business.
```

## `src/app/page.tsx` — testimonial location

The Vancouver, BC testimonial (Jennifer L.) was kept in place — testimonials
are not jurisdiction-gated and the customer's location is incidental to the
quote. No change needed on restore.

---

## `src/app/layout.tsx` — site description metadata

```
Incorporate your Canadian business online in about 10 minutes. Federal, Ontario, and BC filings handled end-to-end and delivered within 24 hours.
```

---

## `src/app/soon/page.tsx` — Incorporation feature sub-line

```
{ icon: Building2, label: "Incorporation", sub: "Federal · Ontario · BC" }
```

---

## `src/components/HeroContactForm.tsx` — service select option

```html
<option value="bc">BC Incorporation</option>
```

## `src/components/SoonContactForm.tsx` — service array entry

```ts
{ value: "bc", label: "BC incorporation" },
```

---

## `src/components/layout/Footer.tsx` — Services column entry

```ts
["BC Incorporation", "/services"],
```

---

## `src/app/services/page.tsx`

See [`services.ts`](services.ts) in this folder.

---

## `src/app/pricing/page.tsx`

See [`pricing-page.ts`](pricing-page.ts) in this folder. Also restore the
footnote under the registered-office add-on card:

```
Available for federal and Ontario incorporations. BC incorporations require a BC registered office —
email contact@korporex.com for BC.
```

(The current edited footnote omits the BC sentence.)

---

## `src/app/faq/page.tsx` — answers that enumerated jurisdictions

### "Which jurisdiction should I incorporate in?" (id: `which-jurisdiction`)

```
There is no universally best jurisdiction — the right choice depends on your specific needs. Federal, Ontario, and British Columbia incorporations are each a valid path, and the decision typically comes down to where you plan to operate, how important nationwide name protection is, and your budget. Our Resources section has dedicated guides on each jurisdiction, and our wizard captures the information needed for any of the three.
```

### "What types of corporations can I form through Korporex?"

```
Through Korporex you can incorporate Standard (for-profit) corporations, Professional corporations (for regulated professionals such as doctors, dentists, and accountants), Holding corporations (for managing investments or assets), and Non-Profit corporations. Availability varies by jurisdiction — federal incorporations currently support standard and holding corporations; Ontario and BC support all four types.
```

### "What ongoing requirements does my corporation have?"

```
Requirements vary by jurisdiction. Ontario corporations must file an Annual Return with the Ontario government each year (typically within 60 days of your anniversary date). Federal corporations must file an Annual Return with Corporations Canada. BC corporations must file an Annual Report with the BC Registrar. Failure to file can result in your corporation being dissolved. Korporex offers annual return filing services — available on our Services page.
```

---

## `src/app/resources/page.tsx` — article description on jurisdiction guide

```
Federal vs. Ontario vs. BC — understand the differences before you choose.
```

---

## `src/app/resources/articles.ts` — BC mentions inside other articles

These BC references appear inside non-BC articles. Restore by re-adding the BC
phrasing in the relevant paragraphs.

### `incorporation-101` article — paragraph in "Federal incorporation" section

```
Federal incorporation does not, however, exempt the corporation from provincial rules. If a federal corporation carries on business in a province — has an office, employees, or a physical presence there — it must register extra-provincially in that province and pay the associated fee. A federal corporation operating in Ontario, Alberta, and BC effectively maintains four registrations: one federal plus one in each province.
```

### `incorporation-101` — paragraph in "Provincial incorporation" section

```
A provincial corporation is created under the business corporations act of a specific province (e.g., Ontario's OBCA, BC's BCA, Alberta's ABCA). The corporation is automatically authorized to carry on business throughout that province. Name protection, however, is limited to that province — a business in another province could, in principle, register a similar name there.
```

### `incorporation-101` — table row

```
["NUANS name search", "Mandatory", "Required in ON/BC/AB; optional or province-specific elsewhere"],
```

### `incorporation-101` — table row on director residency

```
["Director residency", "No Canadian-resident director requirement (as of 2022)", "Varies; Ontario removed its requirement in 2021, BC has none"],
```

### `incorporation-101` — closing paragraph

```
Once you've decided on the jurisdiction, the rest of the incorporation process is largely the same: choose a name (or opt for a numbered corporation), draft articles, appoint directors, file, and receive your certificate of incorporation. Korporex handles the entire filing online for federal, Ontario, and BC jurisdictions.
```

### `naming-your-corporation` (or similar) — list entry

```
"British Columbia — BC uses its own Name Request system through BC Registries, not NUANS."
```

### `corporate-records` (or similar) — minute book section

```
"British Columbia corporations"
"Filed with BC Registries and Online Services."
```

(The current edited articles drop the BC line items but keep the federal and
Ontario ones; restore by re-inserting BC at the original position.)

---

## `src/app/legal-consultation/page.tsx` — questionnaire hint

```
hint="Federal, Ontario, BC, or other province"
```

---

## `src/app/terms/page.tsx` — registry enumeration (two locations)

```
(currently Corporations Canada, the Ontario Business Registry, and the BC
Corporate Registry)
```

```
Canada, the Ontario Business Registry, and the BC Corporate Registry
```

---

## `src/app/privacy/page.tsx` — registry enumeration

```
operated by Corporations Canada, the Ontario Business Registry, the BC
Corporate Registry, and similar Canadian registries
```
