-- Phase 2b — Internal link keywords table.
--
-- Apply by pasting into Supabase Dashboard → SQL Editor and clicking Run.
-- Idempotent (safe to re-run).

create table if not exists public.internal_link_keywords (
  id            bigserial primary key,
  keyword       text not null,
  target_page   text not null,           -- canonical path on korporex.ca, e.g. /incorporate
  priority      integer not null default 100,
  is_active     boolean not null default true,
  usage_count   integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Lower priority = higher importance (run first when matching). Standard
-- "specific wins": "federal incorporation" gets a lower number than
-- "incorporation" so the longer phrase matches first.
create index if not exists internal_link_keywords_priority_idx
  on public.internal_link_keywords (priority asc);

-- Quick prefix lookup for the keyword text (case-insensitive).
create index if not exists internal_link_keywords_keyword_lower_idx
  on public.internal_link_keywords (lower(keyword));

-- Unique-on-(keyword, target_page) so the user doesn't accidentally double up.
create unique index if not exists internal_link_keywords_uniq_idx
  on public.internal_link_keywords (lower(keyword), target_page);

create or replace function public.bump_internal_link_keywords_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists internal_link_keywords_updated_at on public.internal_link_keywords;
create trigger internal_link_keywords_updated_at
  before update on public.internal_link_keywords
  for each row execute function public.bump_internal_link_keywords_updated_at();

alter table public.internal_link_keywords enable row level security;
-- No policies = service_role only.
