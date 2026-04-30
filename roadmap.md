# SEO Dashboard Roadmap

Plan to grow the existing Korporex SEO dashboard from the current 5 CSV-stub pages into the full 10-page feature set inventoried from Hadri's `/admin/seo-dashboard`. **Read [progress.md](progress.md) and [known-issues.md](known-issues.md) before each session.**

Last updated: 2026-04-30 — **all 4 phases shipped**. See progress.md 2026-04-30 entry for the per-phase summary. Outstanding work is operational (apply SQL migrations, rotate JWT, clean up stale Vercel env vars), not code.

---

## 1. Goals & non-goals

### Goals
- Cover all 10 Hadri SEO Dashboard surfaces, adapted for Korporex (incorporation platform, not a law firm).
- Ship in small phases — each phase produces a usable surface, not a half-built mega-feature.
- Preserve the existing CSV-import + localStorage foundation in [seoStore.ts](src/lib/seoStore.ts) where it fits; only introduce server storage when a feature genuinely can't work without it.
- Respect Korporex's "not a law firm" framing throughout (no EEAT, no legal-review gates, no lawyer authoring).

### Non-goals
- ❌ Multi-user / multi-site / agency model — single owner only.
- ❌ Author/EEAT system, lawyer sign-off, legal-review queues (Hadri-specific).
- ❌ Localizing the admin — `/dashboard/*` lives under `(private)/` and is English-only by design (per [CLAUDE.md](CLAUDE.md)).
- ❌ Live Ahrefs API integration in v1 — CSV import only. Wire the API later if/when Korporex pays for Ahrefs.

---

## 2. Storage strategy — ✅ DECIDED 2026-04-30: Option D (Supabase, separate free org)

Today's dashboard uses **localStorage only** (~5 MB cap, single browser, single device). That works for big snapshot imports but fails for:

| Feature | Why localStorage breaks |
|---|---|
| **404 Log** | Server-side middleware needs to write hits — browser storage isn't reachable from a Next.js middleware/route handler. |
| **Internal Links engine** | Linking engine runs server-side at content edit/publish time; needs a persistent keywords table both ends can read. |
| **Outreach Log timestamps** | Status changes from one device must be visible on another (and on the server side if we ever email reminders). |
| **Content Pipeline scheduled dates** | Publishing a scheduled post requires a server cron / scheduled function; that needs server-readable state. |
| **Backlinks/competitor history** | Multi-MB Ahrefs exports blow past localStorage's 5 MB ceiling on a single import. |

### Three options for the user to choose between:

**Option A — Vercel KV (Redis)** *(recommended)*
- ~$1/mo for the hobby tier; serverless-friendly; key-value store is enough for small tables (keywords, 404 paths, outreach log).
- Big imports (backlinks, GSC snapshots) still go to localStorage. KV holds *small* operational state only.
- Pros: zero ops; integrates in 10 lines; Vercel-native.
- Cons: paid (very cheap), key-value model so no rich queries.

**Option B — Neon / Vercel Postgres** *(durable, future-proof)*
- Free tier on Neon; rich SQL queries; supports everything Hadri did on Supabase.
- Pros: real DB, scales to multi-device sync, supports dashboards across browsers, can run analytics.
- Cons: more setup, schema migrations to maintain, slight cold-start latency, requires Prisma or direct SQL.

**Option C — Stay localStorage-only**
- Skip 404 Log, the auto-linking engine, scheduled publishing, and any other server-state feature. Accept that the dashboard is a single-browser tool.
- Pros: zero infra, keeps the current shape.
- Cons: drops 3 of the 10 Hadri pages outright.

**Option D — Supabase (chosen 2026-04-30)**
- Created directly at supabase.com (NOT via Vercel Marketplace) inside a new Free organization, separate from Hadri's Pro org. The Marketplace path inherits the Pro org's billing and triggers ~$10/mo per additional project; the direct path stays on the free tier ($0/mo, 500MB DB, 2 free projects per Free org).
- Connected to Vercel via manually pasted env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) — no Marketplace integration.
- Pros: rich SQL queries, the user already knows the SDK, dashboard table editor for ad-hoc inspection, free, future-proof.
- Cons: shared cold-start risk (Supabase free pauses DB after ~1 week of inactivity); compliance separation from Hadri's law-firm DB is critical (so the separate-org structure is mandatory, not optional).

> **✅ Phase 2 unblocked as of 2026-04-30** — Supabase project `korporex` (ID `klnxilozjfratddqriue`) provisioned, env vars wired into `.env.local` and the dashboard settings health check. Vercel env-var population still pending (manual paste of the 3 vars into Production + Preview + Development).

---

## 3. Architecture

### Existing (do not break)
- Route group: [`src/app/(private)/dashboard/seo/`](src/app/(private)/dashboard/seo/) — owner-only, gated by [middleware.ts](src/middleware.ts) via `kpx_admin_session` cookie, English-only, `noindex`.
- Storage helpers: [seoStore.ts](src/lib/seoStore.ts) — `Dataset` shape (`columns`, `rows`, `importedAt`, `source`), `getDataset` / `setDataset` / `clearDataset`, CSV helpers.
- Existing 5 pages (CSV-stub level): [link-building/](src/app/(private)/dashboard/seo/link-building/), [backlinks/](src/app/(private)/dashboard/seo/backlinks/), [competitors/](src/app/(private)/dashboard/seo/competitors/), [rankings/](src/app/(private)/dashboard/seo/rankings/), [import-export/](src/app/(private)/dashboard/seo/import-export/).

### New additions (this roadmap)
- **5 net-new pages**: Content Pipeline, LLMs.txt, 404 Log, Link Health, Internal Links.
- **Sidebar nav update** — extend the existing `/dashboard` sidebar to add the new sections (group "SEO" with sub-items, or a second nav block).
- **Server persistence layer** — only if Option A or B is chosen. Lives at `src/lib/seoServerStore.ts` (KV) or `src/lib/db.ts` (Postgres). API routes under `src/app/api/seo/*/route.ts` — each must verify the admin session itself (middleware doesn't cover `/api/*`, per [CLAUDE.md](CLAUDE.md)).
- **Auth gate on every new API route** — read `kpx_admin_session`, call `verifyAdminSession()` from [adminAuth.ts](src/lib/adminAuth.ts), 401 on invalid.

### File conventions
- Page entry: `src/app/(private)/dashboard/seo/<page>/page.tsx` (server component, no localization)
- Heavy client UI: `src/app/(private)/dashboard/seo/<page>/<Page>Client.tsx`
- Shared UI components: `src/components/dashboard/seo/*`
- API: `src/app/api/seo/<endpoint>/route.ts`
- Types: extend [seoStore.ts](src/lib/seoStore.ts) or move shared types to `src/types/seo.ts` if it grows past ~150 lines

---

## 4. Page-by-page scope

Each entry covers: current state in Korporex, target features, acceptance criteria, Korporex-specific de-scopes vs Hadri.

### 4.1 Link Building
**Current:** CSV-stub table at [link-building/](src/app/(private)/dashboard/seo/link-building/). Single dataset, no tabs.
**Target:** 4 tabs (Outreach · Submissions · Outreach Pipeline · Acquired Links), inline edit, kanban drag-drop, summary stats, anchor distribution chart, link budget tracker.

**Acceptance criteria:**
- [ ] Tab navigation between the 4 sub-views with URL params (`?tab=outreach`)
- [ ] Outreach + Submissions tables: sort/filter/search, inline cell editing, bulk select + bulk update
- [ ] Detail modal w/ outreach log (timestamps + action types)
- [ ] Pipeline kanban: drag a card → updates status + appends log entry
- [ ] Acquired Links: form to add, edit, delete; summary stats card; anchor + target distribution charts; link budget vs spend
- [ ] CSV import still works (slot CSV rows into prospect/link table)
- [ ] CSV export of any tab

**De-scopes vs Hadri:**
- Drop multi-site `target_site` scoping (Korporex is one domain).
- Rename `guest_post_price` → `cost`, add `renewal_frequency` for directory listings.
- Drop `competitor_source` auto-population (Korporex won't have a competitor-backlink importer at first).

---

### 4.2 Backlinks
**Current:** CSV-stub at [backlinks/](src/app/(private)/dashboard/seo/backlinks/). One dataset, table.
**Target:** Snapshot selector, summary stats bar, advanced filters (DR range, dofollow toggle), 2 extra tabs (Snapshot Comparison, Domain Breakdown).

**Acceptance criteria:**
- [ ] Multiple snapshots stored, selectable via dropdown (auto-load latest)
- [ ] Summary bar: total backlinks, unique referring domains, do/nofollow split, DR 30+/50+/70+ tiers
- [ ] Filters: text search across 4 fields, dofollow-only, DR min/max
- [ ] Sortable on 6 columns
- [ ] **Snapshot Comparison tab:** pick 2 snapshots → diff table (gained/lost/unchanged) + domain-level deltas
- [ ] **Domain Breakdown tab:** group by domain, expandable rows
- [ ] Virtualized scrolling for >1000 rows

**De-scopes:** None — fully generic, port behavior 1:1.

---

### 4.3 Competitors
**Current:** CSV-stub at [competitors/](src/app/(private)/dashboard/seo/competitors/). Flat list.
**Target:** Tier-classified main list, per-competitor detail view (4 tabs), Compare radar chart, Link Opportunities aggregator.

**Acceptance criteria:**
- [ ] Main list: tier dropdown (Primary/Secondary/Tertiary), inline edit, search, bulk delete/tier change
- [ ] Add/Edit competitor dialog (no `lawyer_count`; replace with `jurisdiction_count` if useful)
- [ ] Detail page at `competitors/[id]/`: 4 tabs (Metrics Over Time, Pages, Backlinks, Keywords)
- [ ] Metrics tab: dual-axis line chart, snapshot dropdown, CSV export
- [ ] Pages/Backlinks/Keywords tabs: paginated tables (100/page) with sort + filter
- [ ] Compare page at `competitors/compare?ids=a,b,c,d`: multi-select up to 4, radar chart on 6 dimensions, side-by-side metrics table with green/red color coding
- [ ] Link Opportunities at `competitors/link-opportunities`: aggregate referring domains across all competitors, dedupe, "Add as Prospect" CTA → writes to Link Building

**De-scopes:**
- Drop `has_spanish` / `spanish_page_count` / `lawyer_count` / `google_review_count` (law-firm-specific).
- Replace with `jurisdiction_count` (FED/ON/BC/AB/etc. coverage) and `pricing_tier_count` if useful.

**Korporex initial competitor list:** Ownr, LawDepot, Wagepoint Incorpdirect, Opstart, Founded, Wix Business, Incorporation.com.

---

### 4.4 Rankings
**Current:** CSV-stub at [rankings/](src/app/(private)/dashboard/seo/rankings/).
**Target:** 4 tabs (Money Pages · GSC · Ahrefs · Local Rankings).

**Acceptance criteria:**
- [ ] Money Pages tab: list of incorporation/service pages with 90d GSC stats, status badge (Good/Needs Work/Underperforming), inline target keywords + position + notes, expand row → mini history chart
- [ ] GSC tab: raw GSC table, date range picker (default 90d), position-bucket filter (top 3/10/20), clicks/impressions line chart, CSV export
- [ ] Ahrefs tab: organic-keywords table from CSV import, snapshot dropdown, gap-analysis filter (positions 11–30)
- [ ] Local Rankings tab: city + keyword selector, current vs 7-day-prior position, trend ↑→↓ — manual entry only in v1 (no SERP API)
- [ ] **GSC sync** is **deferred** to Phase 4 (requires Google OAuth + service-account setup); v1 = CSV import of GSC export only

**De-scopes:** No SERP-API integration in v1 — local rankings are manual-entry. Status-bucket thresholds tuned for incorporation queries (lower-volume than legal queries).

**Korporex money pages:** `/incorporate`, `/incorporate?jurisdiction=federal`, `/incorporate?jurisdiction=ontario`, `/pricing`, `/services`, `/legal-consultation`, `/resources`, `/about`.

---

### 4.5 Import / Export
**Current:** CSV-stub at [import-export/](src/app/(private)/dashboard/seo/import-export/) (existing hub).
**Target:** 4 tabs (Import · Bulk Import · Export · History).

**Acceptance criteria:**
- [ ] Single-file Import: drag-drop, auto-detect type from filename (regex on the 11 supported types), manual override, 10-row preview, duplicate check, progress bar, result summary
- [ ] Bulk Import: multi-file drop, per-file type detection, shared meta fields, real-time progress per file
- [ ] Export: dropdown of all storable tables (current 5 + new ones), filter builder (column/op/value), CSV download
- [ ] History: imports log (filename, type, rows, date, status), expand for details, bulk delete

**Storage note:** History needs server-side persistence if user picks Option A or B. Otherwise (Option C) it's a per-browser localStorage log.

**De-scopes:** Drop competitor-author imports (Hadri-specific). Keep all 11 generic types except `legal_authors` and `practice_area_keywords`.

---

### 4.6 Content Pipeline *(NEW)*
**Current:** Doesn't exist.
**Target:** 4 tabs (Kanban · Master List · Calendar · Consolidation Tracker).

**Acceptance criteria:**
- [ ] Kanban: 4 columns (Draft · Scheduled · Published · Stale 365d+); drag-drop status updates; cards show title + type + GSC clicks/impressions/position
- [ ] Master List: tabular view, sortable, filter by type/status, inline edit status + scheduled_date, bulk status, CSV export
- [ ] Calendar: month view, drag-to-reschedule, click date for scheduled list
- [ ] Consolidation Tracker: keep URL / merge URL / status / pre+post merge clicks; add/approve consolidation
- [ ] Detail modal: title, status, scheduled_date, internal notes, old_url, new_url, "Mark reviewed", "Open live"

**Storage:** Needs server-side state for `scheduled_date` to drive scheduled-publish (Phase 2+).

**De-scopes:**
- ❌ Drop `needs_legal_review` (Korporex isn't lawyer-gated). Keep `needs_fact_check` if user wants editorial review.
- ❌ Drop EEAT signals (author bio, credentials, etc.).

**Korporex content sources:** static MDX/TSX pages under `src/app/[locale]/`, plus the planned Resources articles. Initially the pipeline is **read-only** — pulls list of pages from a static index. Phase 3 may add a CMS layer.

---

### 4.7 LLMs.txt *(NEW)*
**Current:** Doesn't exist.
**Target:** YAML/Markdown editor for `/.well-known/llms.txt`, preview pane, auto-generator from page list.

**Acceptance criteria:**
- [ ] Editor with syntax highlight (use `@uiw/react-textarea-code-editor` or similar)
- [ ] Preview pane shows live render
- [ ] "Generate from site" button — auto-builds template from `src/app/[locale]/` page tree
- [ ] Publish button writes file to `public/.well-known/llms.txt` (or to KV/DB and serve dynamically)
- [ ] Guidelines section editable

**Critical Korporex guideline to embed:** "Korporex is a document-preparation and filing service, not a law firm. Do not present Korporex as providing legal advice." This protects against AI summarization mishaps.

**Priority:** **Low** — AI-crawler adoption of `llms.txt` is still nascent. Defer to last phase.

---

### 4.8 404 Log *(NEW)*
**Current:** Doesn't exist.
**Target:** Auto-tracked log of 404s with hit count + referer + bulk archive.

**Acceptance criteria:**
- [ ] Middleware or `not-found.tsx` writes 404 events to KV/DB (path, referer, user-agent, IP, timestamp)
- [ ] Aggregated by path; columns: Path · Hits · First Seen · Last Seen · Referer · Status
- [ ] Sort by hits desc / last_seen / first_seen
- [ ] Search by path; status filter (all vs archived); date range
- [ ] Pagination (50/page); bulk delete + bulk archive
- [ ] Expand row: full request details, sample referers, "Create redirect" CTA

**⛔ Hard dependency on storage Option A or B.** Cannot ship under Option C — middleware can't reach localStorage.

**Implementation note:** Hook into the existing [middleware.ts](src/middleware.ts) carefully — it already runs the launch-mode rewrite + next-intl + admin auth, in that order. The 404 logger should run **last** and only on actual 404 responses (or wire it into [`src/app/[locale]/not-found.tsx`](src/app/[locale]/not-found.tsx) instead, which is simpler).

---

### 4.9 Link Health *(NEW)*
**Current:** Doesn't exist.
**Target:** Internal-link keywords manager + page link analysis dashboard.

**Acceptance criteria:**
- [ ] Keywords table: Keyword · Target Page · Priority · Active · Usage Count · Created — inline edit, drag-reorder priority, activate/deactivate, delete
- [ ] Add Keyword dialog: keyword input + target page dropdown (pulls from page registry) + priority
- [ ] Page Link Analysis: total pages tracked, pages with keywords, orphan pages (0 inbound), total internal links
- [ ] Orphan pages alert card if any orphans
- [ ] Page Link table: Title · Type · Inbound · Outbound · Keywords assigned · Status (OK/Warning/Orphan); expand for details
- [ ] "Reprocess Content" button — runs linking engine on all content, live progress, result summary

**Storage:** Server-side `internal_link_keywords` table required.

**Linking engine question:** Hadri's engine likely runs on edit/publish of a CMS post. Korporex content is currently static MDX/TSX in the source tree. Two options:
- **Build-time pass** — script in `package.json` (`npm run links:apply`) walks the source tree, applies keyword links, writes back. Run as a pre-commit or pre-build step.
- **Runtime pass** — server component reads keywords table, transforms content on render. Simpler but slower per request.

Recommend **build-time** to start. Decide in Phase 3 design.

**Korporex initial keyword list:**
- "incorporation" → `/incorporate/`
- "federal incorporation" / "CBCA" → `/incorporate?jurisdiction=federal`
- "Ontario incorporation" / "OBCA" → `/incorporate?jurisdiction=ontario`
- "business formation" → `/services`
- "registered office" → `/services` (or anchor)
- "corporate minute book" → relevant resource article
- "NUANS search" → relevant resource article

Priority matters: link "federal incorporation" before bare "incorporation" (specific wins).

---

### 4.10 Internal Links *(NEW)*
**Current:** Doesn't exist.
**Target:** Same data as Link Health — alternate UI focused on the keywords list.

**Decision:** **Merge into Link Health as a second tab** instead of building two pages. Hadri's split is historical; Korporex doesn't need both. Link Health tabs become:
1. **Keywords** (was Internal Links page)
2. **Page Analysis** (was Link Health stats)
3. **Orphans** (alert + list)

Saves a route and reduces nav clutter.

---

## 5. Phased delivery

Each phase is roughly 1 working session. Ship one phase at a time; verify before starting the next.

### **Phase 0 — Decision & sidebar prep** *(½ session)*
- [ ] User picks storage option (A/B/C above) — gates Phase 2+
- [ ] Extend sidebar nav in [`/dashboard/layout.tsx`](src/app/(private)/dashboard/layout.tsx) to group existing 5 pages under "SEO" + reserve placeholders for new 5
- [ ] Add `roadmap.md` link in dashboard footer or settings page so the document is discoverable from inside the app

### **Phase 1 — Upgrade existing 5 pages** *(2-3 sessions)*
Storage-agnostic; works under any option. Each page goes from "CSV stub" to "feature-complete tabs + filters".

1. **Backlinks** (smallest scope, builds confidence) → snapshot selector + comparison + domain breakdown
2. **Competitors** → tier system + detail page with 4 tabs + compare page + link opportunities
3. **Rankings** → 4 tabs (skip GSC API integration, CSV import only)
4. **Link Building** → 4 tabs (outreach, submissions, kanban, acquired links) — biggest scope
5. **Import/Export** → 4 tabs

**Verification per page:** import sample CSV, exercise every tab/filter/bulk action, export back, reload to confirm persistence.

### **Phase 2 — Server-state pages** *(2 sessions)*
Requires Phase 0 storage decision (KV or Postgres).

6. **404 Log** → middleware/not-found hook → KV writer → admin UI
7. **Link Health (merged with Internal Links)** → keywords table + page analysis + orphan alert + build-time linking engine

### **Phase 3 — Content Pipeline** *(1-2 sessions)*
8. **Content Pipeline** — kanban + master list + calendar + consolidation tracker. Read-only initially (pulls list of pages from a static page registry).

### **Phase 4 — Integrations & polish** *(stretch)*
9. **Rankings GSC API integration** — replace CSV import with live GSC sync via service account
10. **LLMs.txt page** — editor + auto-generator + publish to `public/.well-known/llms.txt`
11. **Optional Ahrefs API** if/when Korporex pays for it

---

## 6. Open questions to resolve before kickoff

1. **Storage option** (A: Vercel KV / B: Neon Postgres / C: localStorage-only). Phase 2+ blocked until decided.
2. **Linking engine timing** — build-time pass vs runtime transform. Defer to Phase 3 design but raise early.
3. **GSC integration timing** — wire up in Phase 4 or skip entirely and rely on CSV exports of GSC data?
4. **Dashboard nav layout** — keep flat (10 sidebar items) or group ("SEO" parent + sub-items)?
5. **Should `Backlinks` and `Competitors` use the same multi-snapshot pattern** (Backlinks already needs it — does Competitors get one auto-snapshot per CSV import too)? Suggest yes for consistency.
6. **Do we want bulk-delete safeguards** (confirm modal w/ "type DELETE to confirm" for >50 rows)? Hadri doesn't have this; would be a sensible Korporex addition.

---

## 7. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Scope creep — too much built before review** | High | High | Hard phase gates: don't start Phase 2 until Phase 1 is in production and exercised for at least one CSV-import session. |
| **localStorage 5 MB cap hit on backlink import** | Medium | Medium | In Phase 1, detect oversized payload before write; show "split this snapshot" warning. Phase 2's storage layer makes this moot. |
| **OneDrive `.next` recursive-delete bug** (per [progress.md](progress.md)) | Already known | Low | Workaround documented; `rm -rf .next` from bash before `npm run dev`. |
| **Translations debt** — admin doesn't need translations but new public-facing CTAs (e.g. resources article landing pages) created during pipeline work might. | Low | Low | Admin is `(private)/`-only by design. Keep new admin code English-only; flag any incidental customer-facing text in [known-issues.md](known-issues.md). |
| **Duplicate dashboard nav with Hadri** if user copy-pastes screenshots | Low | Low | Korporex palette + branding are different (forest-green `navy-*`, not Hadri's blue); enforce design tokens. |
| **GSC API setup blocks Rankings** | Medium | Medium | Defer GSC API to Phase 4; v1 = CSV export from GSC dashboard, manually imported. |

---

## 8. What "done" means for the full roadmap

- All 10 surfaces ship and survive a real working session: import CSVs, run filters, drag kanban cards, log a 404, add an internal-link keyword, mark a content item published, etc.
- [progress.md](progress.md) reflects each phase shipping with date + commit ref.
- [known-issues.md](known-issues.md) carries any partial implementations or deferred decisions.
- No customer-facing regressions on `korporex.ca` or `korporex.vercel.app`.
- The roadmap doc is updated at end of each phase: phase moves from "next" → "shipped"; new questions surface as new entries in §6.

---

## Appendix — Korporex DB tables (if Option B is chosen)

For reference if user picks Postgres. KV (Option A) uses the same shape but as JSON values keyed by `seo:<table>:<id>`.

```sql
-- Phase 1 (storage-agnostic, current localStorage shape works too)
seo_link_prospects        (id, prospect_type, domain, dr, traffic, cost, contact_email, submission_url, status, is_linked, renewal_frequency?, notes, created_at, updated_at)
seo_acquired_links        (id, prospect_id?, referring_domain, anchor_text, target_url, link_type, date_acquired, dr, cost, billing_cycle, status, last_verified, created_at)
seo_outreach_log          (id, prospect_id, action_type, note, created_at)
seo_backlinks             (id, snapshot_date, referring_url, referring_domain, dr, ur, anchor_text, target_url, link_type, is_dofollow, first_seen, http_status, traffic)
seo_competitors           (id, firm_name, domain, tier, jurisdiction_count?, has_ppc?, notes, created_at)
seo_competitor_metrics    (id, competitor_id, snapshot_date, dr, ur, organic_traffic, organic_keywords, referring_domains, referring_domains_dofollow, total_pages, top_3, top_10, top_100, avg_word_count)
seo_competitor_pages      (id, competitor_id, url, title, word_count, indexed, last_updated)
seo_competitor_keywords   (id, competitor_id, keyword, search_volume, competitor_position, competitor_traffic, snapshot_date)
seo_competitor_backlinks  (id, competitor_id, referring_url, referring_domain, dr, ur, anchor_text, link_type)

-- Phase 2 (server-state required)
not_found_log             (id, path, referer, user_agent, ip, hit_count, first_seen, last_seen, archived, created_at)
internal_link_keywords    (id, keyword, target_page_id, priority, is_active, usage_count, created_at)

-- Phase 3
seo_pages                 (id, page_path, title, page_type, status, scheduled_date, last_reviewed_at, current_stage, gsc_clicks, gsc_impressions, gsc_position, client_intent, notes, old_url, new_url)
seo_consolidations        (id, keep_url, merge_url, status, note, pre_merge_keep_clicks, pre_merge_merge_clicks, post_merge_clicks, post_merge_measured_at, merged_at, created_at)

-- Phase 4 (optional)
seo_imports               (id, import_type, filename, row_count, snapshot_date, date_range_start, date_range_end, domain, competitor_id, status, errors, imported_at)
seo_gsc_pages             (id, url, clicks, impressions, position, ctr, date_range_start, date_range_end)
seo_gsc_queries           (id, query, url, clicks, impressions, position, ctr, date_range_start, date_range_end)
seo_ahrefs_keywords       (id, keyword, search_volume, traffic, position, url, keyword_difficulty, snapshot_date)
seo_local_rankings        (id, keyword, city, position, previous_position_7d, snapshot_date)
```
