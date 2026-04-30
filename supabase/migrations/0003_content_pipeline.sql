-- Phase 3 — Content Pipeline (pages tracking + consolidation tracker).
--
-- Apply by pasting into Supabase Dashboard → SQL Editor and clicking Run.
-- Idempotent.

create table if not exists public.seo_content_pages (
  id                  bigserial primary key,
  page_path           text not null unique,
  title               text not null,
  page_type           text not null default 'other',
  status              text not null default 'draft',  -- draft|scheduled|published|stale
  scheduled_date      date,
  last_reviewed_at    timestamptz,
  notes               text not null default '',
  gsc_clicks          integer not null default 0,
  gsc_impressions     integer not null default 0,
  gsc_position        numeric(6,2) not null default 0,
  needs_fact_check    boolean not null default false,
  old_url             text,
  new_url             text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists seo_content_pages_status_idx on public.seo_content_pages (status);
create index if not exists seo_content_pages_scheduled_idx on public.seo_content_pages (scheduled_date);

create or replace function public.bump_seo_content_pages_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists seo_content_pages_updated_at on public.seo_content_pages;
create trigger seo_content_pages_updated_at
  before update on public.seo_content_pages
  for each row execute function public.bump_seo_content_pages_updated_at();

alter table public.seo_content_pages enable row level security;

-- ─── Consolidations ────────────────────────────────────────────────────────

create table if not exists public.seo_consolidations (
  id                       bigserial primary key,
  keep_url                 text not null,
  merge_url                text not null,
  status                   text not null default 'planned',  -- planned|approved|merged|reverted
  note                     text not null default '',
  pre_merge_keep_clicks    integer,
  pre_merge_merge_clicks   integer,
  post_merge_clicks        integer,
  post_merge_measured_at   date,
  merged_at                date,
  created_at               timestamptz not null default now()
);

create index if not exists seo_consolidations_status_idx on public.seo_consolidations (status);

alter table public.seo_consolidations enable row level security;
