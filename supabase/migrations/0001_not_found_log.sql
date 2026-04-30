-- Phase 2a — 404 Log table + RPC.
--
-- Apply by pasting this whole file into Supabase Dashboard -> SQL Editor and
-- clicking "Run". Idempotent — safe to run multiple times.
--
-- Schema choice: `public` (the default Supabase schema). RLS is enabled with
-- no policies, which means anon + authenticated roles can do nothing on this
-- table. Only the service_role key (used server-side from
-- src/lib/supabase.ts -> getSupabaseServiceClient) can read/write it.
--
-- The `record_not_found` RPC exists so the capture path is one round trip
-- (insert-or-increment). It's `security definer` so the service role can
-- call it without the caller needing direct table grants.

create table if not exists public.not_found_log (
  id              bigserial primary key,
  path            text not null unique,
  hit_count       integer not null default 1,
  first_seen      timestamptz not null default now(),
  last_seen       timestamptz not null default now(),
  last_referer    text,
  last_user_agent text,
  last_ip         text,
  archived        boolean not null default false
);

create index if not exists not_found_log_archived_last_seen_idx
  on public.not_found_log (archived, last_seen desc);

create index if not exists not_found_log_hit_count_idx
  on public.not_found_log (hit_count desc);

alter table public.not_found_log enable row level security;
-- No policies = no anon/authenticated access. service_role bypasses RLS.

create or replace function public.record_not_found(
  p_path       text,
  p_referer    text default null,
  p_user_agent text default null,
  p_ip         text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Defensive truncation so a malicious 4MB path can't blow up the index.
  insert into public.not_found_log (path, last_referer, last_user_agent, last_ip)
  values (
    left(p_path, 1024),
    nullif(left(coalesce(p_referer, ''), 1024), ''),
    nullif(left(coalesce(p_user_agent, ''), 512), ''),
    nullif(left(coalesce(p_ip, ''), 64), '')
  )
  on conflict (path) do update set
    hit_count       = public.not_found_log.hit_count + 1,
    last_seen       = now(),
    last_referer    = coalesce(excluded.last_referer,    public.not_found_log.last_referer),
    last_user_agent = coalesce(excluded.last_user_agent, public.not_found_log.last_user_agent),
    last_ip         = coalesce(excluded.last_ip,         public.not_found_log.last_ip),
    archived        = false;
end;
$$;

revoke all on function public.record_not_found(text, text, text, text) from public;
grant execute on function public.record_not_found(text, text, text, text) to service_role;
