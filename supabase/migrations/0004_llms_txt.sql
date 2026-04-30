-- Phase 4 — Single-row store for /.well-known/llms.txt content.
-- Apply via Supabase Dashboard -> SQL Editor.

create table if not exists public.seo_llms_txt (
  id          smallint primary key default 1,
  content     text not null default '',
  updated_at  timestamptz not null default now(),
  -- Single-row enforcement: id is hardcoded to 1.
  constraint seo_llms_txt_singleton check (id = 1)
);

alter table public.seo_llms_txt enable row level security;
