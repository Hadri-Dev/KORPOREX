-- Phase: Registered Office renewal reminders (/dashboard/office-renewals).
--
-- Apply by pasting this whole file into Supabase Dashboard -> SQL Editor and
-- clicking "Run". Idempotent: safe to run multiple times.
--
-- Three tables:
--   - office_clients: one row per corporation using a Korporex registered
--     office address. Auto-created from paid Stripe sessions (incorporation
--     with the regOfficeAddon, or the standalone registered-office service)
--     and editable from the dashboard. renews_on is the end of the current
--     paid term; a paid renewal moves it forward one year.
--   - office_events: activity log per client (imported, reminders sent,
--     paid, moving answer, status changes). The partial unique index on the
--     automatic reminder kinds is what makes the daily cron idempotent: a
--     reminder row is claimed before the email is sent, so a second run on the
--     same day cannot send the same reminder twice. stripe_session_id is
--     unique so a retried Stripe webhook cannot apply one payment twice.
--   - office_renewal_settings: single row (id = 1) of on/off switches for the
--     reminder schedule, owner BCC and the Monday digest.
--
-- RLS is enabled with no policies: only the service_role key (server-side,
-- src/lib/supabase.ts -> getSupabaseServiceClient) reads/writes these tables.

create table if not exists public.office_clients (
  id                uuid primary key default gen_random_uuid(),
  business_name     text not null,
  email             text not null,
  contact_name      text,
  corp_number       text,
  location          text not null check (location in ('korporex', 'burlington')),
  started_on        date not null,
  renews_on         date not null,
  status            text not null default 'active'
                    check (status in ('active', 'paused', 'moving', 'closed')),
  source            text not null default 'manual' check (source in ('stripe', 'manual')),
  stripe_session_id text unique,
  billing_region    text,
  locale            text not null default 'en' check (locale in ('en', 'fr', 'es')),
  last_paid_on      date,
  moving_address    text,
  moving_note       text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists office_clients_renews_on_idx on public.office_clients (renews_on);
create index if not exists office_clients_status_idx on public.office_clients (status);

create table if not exists public.office_events (
  id                bigint generated always as identity primary key,
  client_id         uuid not null references public.office_clients (id) on delete cascade,
  kind              text not null,
  term_ends_on      date,
  detail            text,
  stripe_session_id text unique,
  created_at        timestamptz not null default now()
);

create index if not exists office_events_client_idx on public.office_events (client_id, created_at);

create unique index if not exists office_events_auto_reminder_uniq
  on public.office_events (client_id, kind, term_ends_on)
  where kind in ('reminder_d60', 'reminder_d30', 'reminder_d7', 'reminder_final');

create table if not exists public.office_renewal_settings (
  id            int primary key default 1 check (id = 1),
  d60           boolean not null default false,
  d30           boolean not null default true,
  d7            boolean not null default true,
  final_notice  boolean not null default true,
  bcc_owner     boolean not null default true,
  monday_digest boolean not null default true,
  updated_at    timestamptz not null default now()
);

insert into public.office_renewal_settings (id) values (1) on conflict (id) do nothing;

alter table public.office_clients enable row level security;
alter table public.office_events enable row level security;
alter table public.office_renewal_settings enable row level security;
-- No policies = no anon/authenticated access. service_role bypasses RLS.

create or replace function public.office_clients_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists office_clients_touch_updated_at on public.office_clients;
create trigger office_clients_touch_updated_at
  before update on public.office_clients
  for each row execute function public.office_clients_touch_updated_at();

-- Make the new tables visible to the API immediately.
notify pgrst, 'reload schema';
