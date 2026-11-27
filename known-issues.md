# Known Issues

## Open

### [Severity: medium] Extra-provincial page copy still offers every province; the form is Ontario only
- **Where**: [serviceContent/extra-provincial.ts](src/lib/serviceContent/extra-provincial.ts) (EN/FR/ES body + FAQ, e.g. "Ontario corporations expanding into another province, such as Quebec, British Columbia or Alberta"), the hero description and Stripe line description in [registrationServices.ts](src/lib/registrationServices.ts) ("another Canadian province"), the `seo.extraProvincial` title/description in `messages/*.json`, and the Alberta extra-provincial guide that links to this page.
- **Symptom**: The page says Korporex registers a corporation in the province the customer chooses. Since 2026-11-27 the form only accepts Ontario as the target and no longer accepts an Ontario corporation.
- **Impact**: An Ontario corporation wanting Quebec, BC or Alberta reads that the service fits, then finds it cannot order. Misleading copy and wasted SEO traffic.
- **Why not fixed yet**: The owner asked for the form change only. Rewriting the page narrows what it ranks for, in three languages, so it needs the owner's decision (Ontario-only for good, or temporary).
- **Logged**: 2026-11-27

### [Severity: low] Extra-provincial form requires an agent for service for every corporation
- **Where**: step 2 of [ExtraProvincialBody.tsx](src/app/[locale]/services/extra-provincial/ExtraProvincialBody.tsx).
- **Symptom**: Agent name and Ontario address are mandatory. The page's own copy says federal and other-province corporations register in Ontario by Initial Return, and only corporations from outside Canada need a licence.
- **Impact**: A customer with no Ontario agent may be blocked from ordering something the filing may not require.
- **Why not fixed yet**: Not confirmed. Whether the agent is needed for Canadian corporations is the owner's call; it was not part of the 2026-11-27 request.
- **Logged**: 2026-11-27

### [Severity: low] Uploaded order documents exist only as email attachments
- **Where**: [lib/uploads.ts](src/lib/uploads.ts), used by the extra-provincial order and the lawyer consultation.
- **Symptom**: Uploads are forwarded on the [PENDING] intake email and stored nowhere else. If that email fails to send, the order still goes to checkout and the PDFs are lost; the customer must be asked to resend. Total size is capped at 4 MB (extra-provincial) because of Vercel's 4.5 MB request limit, so a large scan will not fit.
- **Why not fixed yet**: Same design as the existing consultation uploads. Larger files or durable storage need a storage service, which is a separate decision.
- **Logged**: 2026-11-27

### [Severity: low] `next lint` fails with 30 pre-existing errors after the Next.js 16 / React 19 upgrade
- **Where**: `eslint-config-next` 16.4.6 enables two new rules that flag existing code: `react-hooks/set-state-in-effect` (`src/components/NaicsCombobox.tsx:73`, `src/components/RotatingWords.tsx:38`, `src/components/dashboard/seo/SeoPageShell.tsx:47`, plus others reported by the full lint run) and the React Compiler's "incompatible library" check on `react-hook-form`'s `watch()` (`src/components/wizard/AnnualResolutionWizard.tsx:437`). Two more components use `window.location.href` for internal navigation (`src/components/dashboard/Sidebar.tsx:82`, `src/components/dashboard/TopBar.tsx:12`) — these are warnings, not errors.
- **Symptom**: `npm run lint` exits non-zero (30 errors, 32 warnings). `npm run build` is unaffected — it compiles and type-checks cleanly.
- **Impact**: None in production; this only blocks `next lint` / CI lint gates if one exists. The flagged `setState`-in-effect patterns are a real (if minor) anti-pattern — each causes one extra render on mount/update, not a correctness bug.
- **Why not fixed yet**: Out of scope for the Next.js 16 security upgrade (2026-11-25) — fixing these means restructuring hook logic in several unrelated components, which deserves its own pass rather than being bundled into a CVE patch.
- **Logged**: 2026-11-25

### [Severity: medium] Business accounts have no self-serve way to replace or remove their card
- **Where**: new business-account feature (`src/lib/businessAccounts.ts`, `/api/business/*`). There is no "manage card" page or endpoint at all yet — a card is only ever set once, at signup.
- **Symptom**: a business customer who wants to swap cards must contact support; there's no portal action for it.
- **Impact**: low today (feature just shipped, no accounts yet), but matters as soon as real accounts exist. When built, it must follow the rule agreed with the owner 2026-11-23: never allow an account to end up with zero payment methods (replace-only, no bare delete), and if there's an unbilled balance at the moment of replacement, attempt an immediate invoice against the *old* card before switching (same suspend-on-failure rule as a missed monthly charge) — otherwise a customer could order a stack of reports, swap out their card, and leave Korporex with no way to collect for work already delivered.
- **Why not fixed yet**: deliberately scoped out of the first build rather than rushed — this is real billing-edge-case logic (partial-period invoicing) that deserves its own careful pass, not something to bolt on under time pressure.
- **Logged**: 2026-11-23

<!-- 2026-11-18 Stripe ↔ QuickBooks / GST-HST audit. Code facts were re-verified by a second reviewer; tax-law facts are cited to CRA / Justice Laws. Items marked "accountant decision" must not be changed in code until the owner's accountant confirms the treatment. -->

### [Severity: high] GST/HST is sent to Stripe as an ordinary product line, so Stripe and QuickBooks cannot see the tax
- **Where**: every checkout route (`src/app/api/{incorporate,nuans-report,legal-consult,office-renewal,service-request,compliance-request,change-name-request,amendment-request,business-update-request}/route.ts`). The tax line is a `price_data` item named `Tax (13%, ON)` (`HST (13%)` for legal-consult); no `tax_rates`.
- **Symptom**: Stripe records $0 tax on every payment. Billing province, subtotal and tax amount are not in Session or PaymentIntent metadata (PI carries only `orderRef`/`productType`/`service`). The only record of the province is the tax line's name, and the only full record of the split is the pre-payment [PENDING] email. No Stripe Customer objects are created. The incorporation route sets no `productType`.
- **Impact**: QuickBooks receives net payouts with no way to split service revenue, GST/HST by province, fees and refunds. Any Stripe→QBO sync app would book the "Tax" line as revenue. This is the main reason the books and HST do not reconcile.
- **Why not fixed yet**: Fix at source = province-specific Stripe manual Tax Rates (free; QC as separate GST + QST rates) and province/subtotal/tax in `payment_intent_data.metadata`. That depends on the accountant decisions below. Historical orders need a reconciliation that walks payout → balance transaction → PaymentIntent → Checkout Session → line items.
- **Logged**: 2026-11-18

### [Severity: high] Nova Scotia is charged 15% HST; the rate has been 14% since 2025-04-01
- **Where**: [src/lib/pricing.ts](src/lib/pricing.ts) `CA_TAX_RATES.NS = 0.15` (feeds every province-based route).
- **Symptom**: Every NS-billed order since 2025-04-01 shows `Tax (15%, NS)`. CRA's rate table shows NS 14% on or after April 1, 2025 (CRA Notice 342 transition rule).
- **Impact**: 1% over-collected on NS orders. The excess must be remitted, or refunded/credited to the customer with a credit note within 2 years of collection (ETA s.232(1), s.232(3)).
- **Why not fixed yet**: One-line change to a live checkout. Waiting for owner go-ahead (raised 2026-11-18). Past NS orders need to be listed for the accountant.
- **Logged**: 2026-11-18

### [Severity: high] Quebec is charged 14.975% (GST + QST) in one line, while the code says no QST registration is held
- **Where**: [src/lib/pricing.ts](src/lib/pricing.ts) `CA_TAX_RATES.QC = 0.14975` vs the comment above it ("GST/HST only — PST registrations not currently held").
- **Symptom**: Quebec customers pay `Tax (14.975%, QC)` labelled "GST/HST".
- **Impact**: If Korporex is not QST-registered, 9.975% is being collected with no QST account to remit it to. Amounts collected as tax must be remitted or refunded (ETA s.222/225 federally; Revenu Québec has parallel rules). Below the $30,000 specified-system threshold, only 5% GST applies. If Korporex is registered, the line must be split into GST (CRA) and QST (Revenu Québec) for two separate returns.
- **Why not fixed yet**: Depends on QST registration status (owner/accountant decision).
- **Logged**: 2026-11-18

### [Severity: high] Government filing fees sit inside fully taxed prices, while the site tells customers they are not taxable
- **Where**: incorporation packages ([pricing.ts](src/lib/pricing.ts) `PRICES` + `computePricing`), change-name ([changeNameSchema.ts](src/lib/changeNameSchema.ts), $150 ON / $200 federal included). Contradicted by [govFees.ts](src/lib/govFees.ts) header, the public cost guide `src/app/[locale]/cost-to-incorporate-canada/costCopy.ts` (EN/FR/ES: "Government filing fees are not subject to GST/HST"), and Terms s.5 ("remitted on your behalf", which is agency language). Sole proprietorship / business name ($60 ON fee) are ambiguous: the price could be read either way.
- **Symptom**: HST is charged on the $200/$300 Articles fee ($26/$39 at 13%) on every incorporation, and on the change-name government fee.
- **Impact**: CRA P-209R treats incorporation, registration and name fees paid as the client's agent as non-taxable disbursements, but an all-in bundled price is generally part of the taxable consideration. Today the pricing and the public copy contradict each other, so either the tax or the copy is wrong.
- **Why not fixed yet**: Accountant decision: (a) split government fees into a separate untaxed disbursement line, or (b) keep bundling and correct the copy.
- **Logged**: 2026-11-18

### [Severity: high] Legal consultation: flat 13% HST for every province, no address collected, and unclear who the supplier is
- **Where**: [pricing.ts](src/lib/pricing.ts) `LEGAL_CONSULT_TAX_RATE = 0.13` and its comment; [legalConsult.ts](src/lib/legalConsult.ts) (independent lawyer, "referral facilitation only"); [legal-consult/route.ts](src/app/api/legal-consult/route.ts).
- **Symptom**: The code comment says "place-of-supply for legal services follows the lawyer's province". CRA disagrees: under the place-of-supply regulations (SOR/2010-117 s.13) and Memorandum 3-3-6-2 (Example 7), non-litigation advice is supplied where the client's address is. The questionnaire collects no address at all. Korporex's Stripe collects the full $150 + $19.50 with no split to the lawyer.
- **Impact**: Wrong-rate tax for non-Ontario clients. If Korporex acts as agent, the fee and the HST belong on the lawyer's books, not as Korporex revenue and HST.
- **Why not fixed yet**: Owner/accountant decision on principal vs agent. A billing-address field is needed either way.
- **Logged**: 2026-11-18

### [Severity: medium] Foreign customers are taxed inconsistently (0% vs 13%) depending on the product
- **Where**: `getTaxRate` returns 0 for non-Canada (incorporation + 5 service routes); [nuansReport.ts](src/lib/nuansReport.ts) and [office-renewal/route.ts](src/app/api/office-renewal/route.ts) (`OUTSIDE_RATE`) charge 13% "ON"; legal-consult is always 13%.
- **Symptom**: The same registered-office service is 0% at purchase and 13% at renewal for a foreign client. Foreign NUANS orders are labelled `Tax (13%, ON)`, so they look identical to Ontario orders.
- **Impact**: Over- or under-collection on non-resident sales. Non-resident zero-rating was not researched in the audit.
- **Why not fixed yet**: Accountant decision on non-resident treatment, then one rule in `pricing.ts`.
- **Logged**: 2026-11-18

### [Severity: medium] Website orders never produce an invoice, only a Stripe receipt
- **Where**: all 9 `stripe.checkout.sessions.create` calls (`src/app/api/*/route.ts`); none sets `invoice_creation`.
- **Symptom**: Customers who pay on the site get Stripe's generic receipt email. No invoice PDF, no invoice number, no order reference, no Korporex legal name or GST/HST number on the document unless the account tax ID is set in Stripe (Settings > Billing > Invoices > Invoice tax information, which also prints on email receipts).
- **Impact**: Business customers paying $100+ need the supplier's GST/HST registration number on the document to claim input tax credits; the receipt looks generic next to a $599-$1,349 order.
- **Why not fixed yet**: Owner declined for now on 2026-11-18 because of the per-invoice fee (on top of card processing). Customers keep the free Stripe receipt, which now carries the branding and GST/HST tax ID. Manual Dashboard invoices on request remain an option. Fix when wanted = one shared `invoice_creation` builder in `src/lib/stripe.ts` used by all 9 routes (order reference + service as custom fields, legal name in footer). Costs 0.4% per invoice, capped at US$2. Until the GST/HST-as-line-item issue above is fixed with Stripe Tax Rates, the tax prints as an ordinary line ("Tax (13%, ON)") instead of a tax row in the totals, so doing both together gives the clean result.
- **Logged**: 2026-11-18

### [Severity: medium] Seven services advertise government fees "billed separately", but no code ever collects them
- **Where**: annual-return-federal, articles-amendment, amalgamation, continuance, dissolve-business, revive-business, extra-provincial (page copy) vs single-line checkouts in `amendment-request`, `business-update-request`, `compliance-request`, `service-request`.
- **Symptom**: No Stripe invoice, payment link or follow-up charge exists anywhere in the code.
- **Impact**: Either Korporex absorbs these fees (they should be booked as cost of sales), or they are collected by hand outside the order flow and appear in QuickBooks as unmatched deposits. The tax treatment of the separately billed amount is undefined.
- **Why not fixed yet**: Owner to confirm how these fees are actually collected today.
- **Logged**: 2026-11-18

### [Severity: medium] Corporation Profile Report is charged with no tax in any province
- **Where**: [complianceServices.ts](src/lib/complianceServices.ts) `taxExempt: true` (the only exempt flag in the code).
- **Symptom**: $19.99 flat with no tax line. About $11.99 of that is Korporex's service fee on top of the $8 registry fee.
- **Impact**: If the supply is taxable, the tax was never collected and is still owed (RC4022: the supplier is liable for tax it should have charged).
- **Why not fixed yet**: Accountant decision.
- **Logged**: 2026-11-18

### [Severity: medium] Refunds, disputes and off-Stripe payments are not recorded anywhere
- **Where**: [stripe-webhook/route.ts](src/app/api/stripe-webhook/route.ts) handles only checkout events. Admin `order_overrides` statuses (`money_received` etc.) and Office Renewals "mark paid" (manual) are independent of Stripe.
- **Symptom**: A refund or chargeback issued in the Stripe Dashboard leaves no Korporex record and no tax split. Manual renewal payments log only "$X CAD + tax".
- **Impact**: Each refund needs a hand-made QuickBooks credit memo reversing revenue and HST. Manual payments arrive as bank deposits with no Stripe counterpart.
- **Why not fixed yet**: Part of the Stripe↔QuickBooks plan (sync app or webhook handlers).
- **Logged**: 2026-11-18

### [Severity: medium] Registered-office deferred revenue: the tracker dates the term from checkout, not from filing
- **Where**: [officeRenewals.ts](src/lib/officeRenewals.ts) `importOfficeClientFromSession` sets `started_on` to the session creation date. The business-update operator note says the term "starts on filing". Taxing at the billing province (not the Ontario premises) is also a place-of-supply question for the accountant.
- **Impact**: The $599.88/$1,199.88 annual fee should be deferred over 12 months (HST is still due in full when paid, ETA s.168(1)). Deferral schedules built from the tracker start on the wrong date.
- **Why not fixed yet**: Needs the filing date captured, plus the accountant's deferral policy.
- **Logged**: 2026-11-18

### [Severity: medium] Dashboard revenue is not a usable control total
- **Where**: [dashboardData.ts](src/lib/dashboardData.ts).
- **Symptom**: "Paid revenue" sums `amount_total`, which includes the tax line, with no refunds or fees subtracted, over only the 100 most recent sessions of any status. `classifySource` returns "unknown" for legal-consult, NUANS, renewals and all service orders. Unverified: `getOrderDetail` expands `customer_details`/`total_details`, which may not be expandable Stripe fields. If Stripe rejects that, the order detail page silently shows nothing.
- **Impact**: Will never match QuickBooks net sales, Stripe net volume or bank deposits.
- **Why not fixed yet**: Logged during the audit; fix together with the metadata changes.
- **Logged**: 2026-11-18

### [Severity: low] A typo in the free-text billing country silently charges 0% tax
- **Where**: `AddressFields` country `<input type="text">`; `isCanadaCountry` accepts only CA/CAN/CANADA; `isKnownTaxRegion` skips province validation for any other value ([pricing.ts](src/lib/pricing.ts)).
- **Symptom**: "Canda" or "Ontario, Canada" passes validation and is charged no tax.
- **Why not fixed yet**: Logged during the audit. Fix: make country a select list (or validate the postal-code format).
- **Logged**: 2026-11-18

### [Severity: low] Renewal checkout region check accepts prototype keys, which drops the tax line
- **Where**: [office-renewal/route.ts](src/app/api/office-renewal/route.ts) validates with `r in CA_TAX_RATES`.
- **Symptom**: A hand-crafted POST with `constructor`/`toString` as the region yields NaN tax, so the checkout is created with no tax line and the bogus region is saved to `office_clients.billing_region`. Requires the client's own valid token.
- **Why not fixed yet**: Logged during the audit. Fix: `Object.hasOwn(CA_TAX_RATES, r)`.
- **Logged**: 2026-11-18

### [Severity: low] No GST/HST registration number on any customer receipt
- **Where**: No `invoice_creation` on any session. The webhook relies on Stripe's automatic receipt, and the renewal receipt email shows only the gross amount.
- **Impact**: Business customers may not have a document that supports an ITC claim. Manually raised QuickBooks invoices for these sales risk double-counting.
- **Why not fixed yet**: Check the Stripe Dashboard receipt settings first.
- **Logged**: 2026-11-18

### [Severity: low] Office renewal emails are English only
- **Where**: [src/lib/officeRenewalEmails.ts](src/lib/officeRenewalEmails.ts). The client page (/office-renewal) is translated en/fr/es and follows the client's `locale` column, but the reminder, receipt and moving-acknowledgement emails are English.
- **Why not fixed yet**: client language is not captured at purchase (Stripe sessions carry no locale), so every imported client defaults to `en`; the owner can set the language per client in the edit form. Translate the templates once FR/ES clients exist.
- **Logged**: 2026-10-24

### [Severity: low] First-name NUANS price ($40) is below Ontario pass-through cost
- **Where**: [src/lib/nuansReport.ts](src/lib/nuansReport.ts) `basePrice: 40` (first name), `additionalPrice: 40` (each extra name). Pass-through reference in [src/lib/pricing.ts](src/lib/pricing.ts) `NUANS_FEES` (federal $20, Ontario $60).
- **Symptom**: A single-name Ontario-jurisdiction NUANS order pays $40 + tax while the search-house pass-through cost is approximately $60. Korporex loses ~$20 on a 1-name Ontario order. Federal 1-name orders net ~$20 margin. Additional names are now also $40 each (was $45), so multi-name Ontario orders carry the same per-name loss-leader margin.
- **Impact**: Per-order margin negative on 1-name Ontario orders only. Volume expected to be low (most NUANS orders are bundled with incorporation packages). Acceptable as a marketing loss-leader.
- **Why not fixed yet**: Per user direction during 2026-05-26 builds — keep base price at $40 to match published marketing. Per-jurisdiction first-name pricing ($40 federal / $80 Ontario) is a one-line change in `NUANS_REPORT.basePrice` plus passing the first row's jurisdiction to `computePricing` in `/api/nuans-report/route.ts`.
- **Logged**: 2026-05-26 (updated same day for the $45 / additional-row tier)
- **Update 2026-11-18**: This entry is stale. The NUANS price is now $39.99 per name, and `NUANS_FEES` in `pricing.ts` holds 39.99/39.99 (the selling price, not the search-house cost). The ~$20 federal / ~$60 Ontario cost figures exist only in this entry. Re-confirm actual search-house costs during the QuickBooks reconciliation. Also, `govFees.ts` says federal online incorporation needs no separate NUANS report, so the search bundled into federal Standard/Premium may have no third-party cost.

### [Severity: high] French + Spanish translations only cover chrome + soon page + homepage; the rest of the site still renders English under /fr/ and /es/ URLs
- **Where**: pages under `src/app/[locale]/` still with hardcoded English text in JSX: services (+ 20 service sub-pages; count updated 2026-08-11 to include the two annual-resolution pages added 2026-08-06 and the new `initial-minute-book` page), order (pricing), terms, privacy, the 8-step incorporation wizard, legal-consultation, both confirmation pages. **Done so far**: homepage, `/soon`, the full guides section, `/contact`, and **`/about` + `/faq` (translated 2026-06-02 — new `about` and `faq` namespaces; FAQ split into server entry + client body)**. Next batch planned: Services + Order, then the 20 service sub-pages, then the wizard, then Terms/Privacy as lawyer-review drafts.
- **Partial progress (2026-06-01)**: the **guides** section is now fully localized — both `guides/page.tsx` and `guides/[slug]/page.tsx` read all chrome from the new `guides` messages namespace, and the batch-1 articles ship in EN/FR/ES with hreflang.
- **Guides section DONE (2026-06-02)**: the 3 remaining English-only guide bodies (`nuans-name-search`, `annual-returns`, `incorporating-ontario`) are now translated into FR + ES — **all 15 guide groups complete in en+fr+es**. Also fixed a language-switch 404 that hit *every* article: the switcher keeps the path and swaps only the locale prefix, but slugs differ per language, so `guides/[slug]/page.tsx` now `redirect()`s via `resolveLocalizedSlug()` to the correct translated slug (works for all current + future articles). The remaining work under this issue is the **non-guides** pages (about, contact, faq, pricing, services, terms, privacy, wizard, legal-consultation, confirmations).
- **Symptom**: Visiting `/fr/about` or `/es/pricing` shows the navbar/footer/language switcher in the chosen language, but page content is English. Internal links use the locale-aware `Link` so the URL prefix is preserved when navigating between pages.
- **Impact**: A visitor switching to French or Spanish sees a partly-translated site. The landing experience (`/<locale>/` and `/<locale>/soon`) is fully translated; deeper pages are not. Until this is resolved, FR and ES are not launch-ready surfaces — the user's lawyer also needs to review the FR/ES translations of legal text (Terms, Privacy, statutory CBCA s.2(1) text in Step 4 of the wizard) before going live.
- **Why not fixed yet**: The infrastructure pass alone took the available session — content extraction across all pages is several more hours of work. Translation quality for the legal pages additionally requires lawyer review (the user has agreed: I translate, lawyer approves the draft).
- **Restore procedure** (per page): (1) Mark the page body as `"use client"` if it uses `t.rich()` with React-element callbacks (split server entry + client body if so). (2) Replace every hardcoded user-visible string with a translation key. (3) Add the keys to `messages/en.json` first, then translate the same keys to `messages/fr.json` and `messages/es.json`. (4) Verify with `npx tsc --noEmit && npm run lint && npm run build`. The CLAUDE.md i18n contract (under `## Internationalization`) describes the rules.
- **Logged**: 2026-04-27

### [Severity: low] British Columbia incorporation temporarily removed from live site
- **Where**: BC was stripped 2026-04-27 from every customer-facing surface and from the `Jurisdiction` type in [src/lib/pricing.ts](src/lib/pricing.ts). All BC-specific code, copy, and data is preserved in [src/archive/bc/](src/archive/bc/) — that folder is excluded from the TypeScript build via [tsconfig.json](tsconfig.json).
- **Symptom**: Customers cannot select BC anywhere — wizard, pricing page, services page, hero/soon/contact forms all show only Federal + Ontario. The BC resource article is not published.
- **Impact**: By design — user direction is to focus operational capacity on Federal + Ontario filings until BC is brought back online. No customer is impacted because no BC orders were ever fulfilled (site has been launch-mode since 2026-04-24, no real-card transactions yet).
- **Why not fixed yet**: Intentional removal, not a bug. Scheduled for re-enablement when ops capacity for BC name-request handling and BC registered-office requirements is in place.
- **Restore procedure**: see [src/archive/bc/README.md](src/archive/bc/README.md). Net effort: re-add `"bc"` to the `Jurisdiction` union in `src/lib/pricing.ts`; paste the archived data files into the matching maps; paste the BC article back into `src/app/resources/articles.ts`; reverse the snippets documented in [src/archive/bc/copy.md](src/archive/bc/copy.md). Then `npx tsc --noEmit && npm run lint && npm run build` to verify.
- **Logged**: 2026-04-27

### [Severity: medium] Terms of Service and Privacy Policy are living drafts pending legal review
- **Where**: `src/app/terms/page.tsx` and `src/app/privacy/page.tsx`.
- **Symptom**: Both pages are structurally complete and now reference the correct legal entity (Korporex Business Solutions Inc., CBCA / Ontario HQ) with a confirmed no-refund policy, but have not yet been reviewed by qualified legal counsel.
- **Impact**: Lowered from high to medium because the main substantive unknowns (entity name, refund policy) are now resolved. Still blocks final go-live until user's review pass confirms limitation-of-liability cap (CAD $100 floor), governing-law choice (Ontario), registered-office-service clauses, and any other jurisdiction-specific language.
- **Why not fixed yet**: Waiting on user's legal review pass. Drafts are marked as "living" — both files carry a `NOTE TO REVIEWERS` comment indicating they should be revised as operational processes solidify.
- **Logged**: 2026-04-23 (updated later same day — entity + refund policy resolved)

### [Severity: medium] Registered-office add-on (Toronto/GTA tier) assigns the actual GTA address operationally per filing
- **Where**: `src/lib/pricing.ts` — `REG_OFFICE_OPTIONS.korporex.address` carries sentinel values (`street: "Assigned by Korporex at filing"`, `postalCode: "TBD"`, `addressAssignedAtFiling: true`); `src/app/api/incorporate/route.ts` flags this in the intake email with an "ACTION REQUIRED" note when the customer selects the **Toronto** add-on. (The **Burlington** tier — `REG_OFFICE_OPTIONS.burlington`, real address 901 Guelph Line, `addressAssignedAtFiling: false` — is NOT affected: the real address is already on file, so no sentinel and no operator action. Its street is simply not shown to the customer — city only.)
- **Symptom**: When a customer pays for the Korporex **Toronto/GTA** registered office add-on, the intake/[PENDING] email shows the sentinel address, not the real GTA street address. Operations must replace it with a real, Korporex-controlled GTA address before filing the Articles of Incorporation. Burlington orders carry the real address (901 Guelph Line) end-to-end — no fill-in needed.
- **Impact**: **No site-side bug** — the wizard, /order page, and Stripe line item describe BOTH services by city/region only ("Greater Toronto Area" / "Burlington, Ontario, chosen by Korporex") and nothing customer-facing reveals a specific street. The risk is purely operational and Toronto-only: if ops files the Articles without substituting the GTA sentinel, the registry would reject (or accept invalid) filings.
- **Why not fixed yet**: This is by design — for the Toronto tier the user requested address selection at Korporex's discretion, not advertised in advance. The sentinel + the [PENDING] email's "ACTION REQUIRED" banner are the operator-side reminder. When the GTA address(es) are finalized, replace the sentinel in `REG_OFFICE_OPTIONS.korporex.address` with the real address and set `addressAssignedAtFiling: false` to drop the "ACTION REQUIRED" banner automatically.
- **Logged**: 2026-04-23 (revised 2026-04-24 — single tier, GTA, address assigned at filing; revised 2026-06-30 — added the Burlington tier; street hidden from customers for both, real Burlington address fixed on file)

### [Severity: low] Stripe webhook endpoint still uses Vercel's `.vercel.app` alias
- **Where**: Stripe Dashboard (live mode) → Developers → Webhooks → "Korporex production — checkout" destination. URL: `https://korporex.vercel.app/api/stripe-webhook`.
- **Symptom**: The webhook endpoint URL reveals the hosting provider (Vercel) and is inconsistent with the rest of the site, which now serves at `https://korporex.ca` (the `.com` domain has been retired).
- **Impact**: Cosmetic/branding only. Webhook delivery works identically — the `.vercel.app` alias is a permanent Vercel project alias and will continue resolving to the production deployment indefinitely, regardless of DNS state.
- **Why not fixed yet**: Zero customer impact and any in-place URL change risks missing events during the switch. Recommended cleanup path when ready: create a **second** webhook destination at `https://korporex.ca/api/stripe-webhook`, observe both deliver successfully for 24–48 hours, then delete the `.vercel.app` one. No urgency.
- **Logged**: 2026-04-23

### [Severity: low] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` not set for Vercel Preview scope
- **Where**: Vercel project `youness-7473s-projects/korporex`, env var `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Production is set, Preview is not.
- **Symptom**: Any future Preview deployment (PR branch, staging URL) would render `/incorporate` without Google Places autocomplete.
- **Impact**: None today (no active preview deploys). Will affect branch-preview deploys once the workflow ramps up.
- **Why not fixed yet**: Vercel CLI v51.8.0 rejects `vercel env add ... preview --value X --yes` with `git_branch_required` even though the docs say omitting branch = "all preview branches". Dashboard workaround: https://vercel.com/youness-7473s-projects/korporex/settings/environment-variables → Add → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` → check Preview → paste value.
- **Logged**: 2026-04-23

### [Severity: low] Canadian sales-tax rates cover GST/HST only (no PST)
- **Where**: [src/lib/pricing.ts](src/lib/pricing.ts) — `CA_TAX_RATES` / `getTaxRate()` (path corrected 2026-11-18). Note: QC is the exception. It charges 14.975% (GST + QST), which contradicts this entry; see the Quebec entry above.
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

- **2026-11-16** — Owner-only Registered Office emails (weekly digest, [OFFICE] moving alert, [PAID] alert) used the client footer "You are receiving this because your corporation uses a Korporex registered office address", so the owner read the empty Monday digest as a weekly email going to customers. Digest removed at owner's request; [officeRenewalEmails.ts](src/lib/officeRenewalEmails.ts) `shell()` now requires an `audience` and owner emails carry an "internal, clients do not receive this" footer.
- **2026-06-30** — Dashboard order detail never showed the registered-office add-on. [orders/[sessionId]/page.tsx](src/app/(private)/dashboard/orders/[sessionId]/page.tsx) gated the row on `md.regOfficeAddon === "true" || === "yes"`, but the Stripe metadata value is only ever `"none"` / `"korporex"` / `"burlington"` — so the row never rendered for any order. Fixed while adding the Burlington tier: now renders the actual location label (e.g. "Greater Toronto Area (12 mo, non-refundable)") via `REG_OFFICE_OPTIONS`, guarded by an `in REG_OFFICE_OPTIONS` check.
- **2026-06-02** — Duplicate `<title>` tags across 54 pages (SEMRUSH site-audit Error). Most pages inherited the site-wide default title from [layout.tsx](src/app/[locale]/layout.tsx) (26 EN + 17 FR + 5 ES sharing one string), and Terms/Privacy hard-coded one English title across all three locales. Added a shared [src/lib/seoMeta.ts](src/lib/seoMeta.ts) `buildSeoMetadata()` helper (unique localized title + description + canonical + en/fr/es/x-default hreflang) plus a new `seo` namespace (23 entries × en/fr/es) in the message files. Wired `generateMetadata` into the 4 server pages (home, /services, Terms, Privacy) and split the 19 client pages (3 wizards + 16 service sub-pages) into a thin server `page.tsx` + `<Name>Body.tsx` so each can export metadata. Verified on a clean `npm start`: every sampled page has a unique title in every locale (incl. FR/ES which were previously identical), with correct canonical + hreflang. `npx tsc --noEmit` + `npm run build` clean. **Note**: this localizes the *titles/meta* of the still-English-bodied pages (services, wizards, order, legal-consultation) — the body-copy translation remains open under the i18n issue above.
- **2026-05-24** — Business Updates service tiles were placeholder. Shipped 4 wizards (Dissolve $199 / Revive $249 / Amalgamation $499 / Continuance $349) under [src/app/[locale]/services/dissolve-business/](src/app/[locale]/services/dissolve-business/page.tsx), [revive-business](src/app/[locale]/services/revive-business/page.tsx), [amalgamation](src/app/[locale]/services/amalgamation/page.tsx), [continuance](src/app/[locale]/services/continuance/page.tsx), backed by [businessUpdateServices.ts](src/lib/businessUpdateServices.ts), [businessUpdateSchemas.ts](src/lib/businessUpdateSchemas.ts), [/api/business-update-request](src/app/api/business-update-request/route.ts) and a new `business-update` productType branch in [stripe-webhook](src/app/api/stripe-webhook/route.ts). Every service tile on the services page now routes to a real wizard.
- **2026-05-24** — Compliance Filings + Changes & Amendments service tiles were placeholder. Shipped 8 wizards across the two categories — see earlier same-day Resolved entries for details.
- **2026-05-22** — Mock name precheck retired in favor of official registry links. Both Federal and Ontario "named" customers now click out to the government registry (Corporations Canada at `https://ised-isde.canada.ca/cbr-rec/` for federal; Ontario Business Registry at `appmybizaccount.gov.on.ca/onbis/...` for Ontario), then type their chosen distinctive name into a live-bound input. Deleted the mock `/api/name-precheck` route, the dev preview at `/[locale]/dev/name-precheck/`, and ~100 lines of dead code in `CorporationNameSection` (`runCheck`, `ResultPanel`, history/result/searchCount state, `PrecheckMatch`/`PrecheckStatus`/`PrecheckResult` types). The mock had set false "available/taken" expectations based on a 10-row in-memory list; the binding check at filing time was always the NUANS report Korporex files post-checkout, which now matches what the UI represents.
- **2026-05-12** — Hero "guarantee" line dropped the word "legal". English now reads "All-inclusive pricing with no surprises..."; French dropped "juridique"; Spanish dropped "legales". Resolved the [medium] issue flagged earlier the same day about the borderline framing against CLAUDE.md's "NOT a law firm" rule. Footer/FAQ/About disclaimers retained their "legal advice" wording since those are protective disclaimers, not service framings.
- **2026-05-07** — `contact@korporex.ca` mailbox + transactional sending. Provisioned a Zoho Mail Lite mailbox at `contact@korporex.ca` on Zoho's Canadian data center (`mail.zoho.ca` / `smtp.zoho.ca`). DNS on Vercel: domain verification TXT, three MX records (`mx.zohocloud.ca` / `mx2.zohocloud.ca` / `mx3.zohocloud.ca`), SPF (`v=spf1 include:zohocloud.ca ~all`), DKIM (`zmail._domainkey`, regenerated once after the initial key cache-stuck on Zoho's verifier), and DMARC (`_dmarc` → `p=quarantine`). Inbound + outbound confirmed end-to-end. Replaced the prior Brevo HTTP-API integration with a shared `src/lib/mailer.ts` module backed by `nodemailer` + Zoho SMTP (port 465 SSL). All four routes (`/api/contact`, `/api/incorporate`, `/api/legal-consult`, `/api/stripe-webhook`) now go through `sendMail()`. Env vars `BREVO_API_KEY` removed; `ZOHO_SMTP_USER` and `ZOHO_SMTP_PASS` (Zoho app-specific password) take their place — must be added to Vercel Production/Preview/Development before launch.
- **2026-04-29** — `korporex.com` and `www.korporex.com` returned `DEPLOYMENT_NOT_FOUND` — Resolved by retiring the `.com` domain entirely. User confirmed `.com` has been replaced by `.ca` going forward. Code references swept to `.ca` (middleware `LAUNCH_MODE_HOSTS`, terms, privacy, intake email subject lines for `/api/contact`, `/api/incorporate`, `/api/legal-consult`, business-card SVG, CLAUDE.md, `.env.local.example`). Historical mentions in `progress.md` and `src/archive/` left untouched.
- **2026-04-29** — Launch-mode rewrite returned 404 for English visitors — Bug introduced in commit `e691731` (`localePrefix: "as-needed"` switch) targeted `/soon` for English, but the App Router page lives at `app/[locale]/soon/page.tsx`. next-intl middleware does not re-run on rewrites issued from our middleware, so `/soon` never got remapped to `/en/soon`. Fixed in commit `6bb9417` by always rewriting to `/${locale}/soon`, including the default locale.
- **2026-04-24** — NUANS pass-through fee was a placeholder ($45 flat across federal + Ontario) — User confirmed real per-jurisdiction pricing: $20 for federal NUANS, $60 for Ontario name search. Replaced the single `NUANS_FEE = 45` constant with `NUANS_FEES: Record<Jurisdiction, number> = { federal: 20, ontario: 60, bc: 0 }` plus a `getNuansFee(jurisdiction)` helper in `src/lib/pricing.ts`. Wizard Step 3 callout now reads the fee from the helper, so it shows "$20" on federal and "$60" on Ontario; Stripe line item also adapts ("NUANS name search report" for federal vs "Ontario name search report" for Ontario).
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
