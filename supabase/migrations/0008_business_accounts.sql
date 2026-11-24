-- Phase: business (monthly-billed) accounts for repeat NUANS/order customers
-- (law firms, accountants, etc.) — card verified at signup via Stripe
-- SetupIntent, orders placed while signed in skip Stripe Checkout and are
-- billed on one Stripe Invoice a month, auto-charged to the card on file.
--
-- Apply by pasting this whole file into Supabase Dashboard -> SQL Editor and
-- clicking "Run". Idempotent — safe to run multiple times.
--
-- business_accounts.auth_user_id links to Supabase Auth (auth.users), which
-- holds the actual login credentials — this table never stores a password.
-- status:
--   active    — can place credit ("bill later") orders
--   past_due  — most recent monthly auto-charge failed; blocked from new
--               credit orders until it's resolved (still works as a normal
--               paying guest via Checkout); auto-returns to 'active' once an
--               invoice for this account is paid
--   suspended — manually cut off by an admin (abuse, etc.); does NOT
--               auto-reactivate on payment — requires an explicit admin action
--
-- RLS is enabled with no policies — anon and authenticated roles can do
-- nothing directly. Only the service_role key (src/lib/supabase.ts ->
-- getSupabaseServiceClient) reads/writes these tables; all customer-facing
-- access goes through API routes that authorize via the business session
-- cookie, never direct client queries.

create table if not exists public.business_accounts (
  id                 uuid primary key default gen_random_uuid(),
  auth_user_id       uuid not null unique,
  company_name       text not null,
  contact_name       text,
  billing_email      text not null,
  stripe_customer_id text unique,
  status             text not null default 'active' check (status in ('active', 'past_due', 'suspended')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists business_accounts_status_idx on public.business_accounts (status);

alter table public.business_accounts enable row level security;
-- No policies = no anon/authenticated access. service_role bypasses RLS.

create or replace function public.business_accounts_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists business_accounts_touch_updated_at on public.business_accounts;
create trigger business_accounts_touch_updated_at
  before update on public.business_accounts
  for each row execute function public.business_accounts_touch_updated_at();

create table if not exists public.business_orders (
  id                     uuid primary key default gen_random_uuid(),
  business_account_id    uuid not null references public.business_accounts (id),
  order_ref              text not null,
  product_type           text not null,
  description            text,
  amount_cents           integer not null,
  currency               text not null default 'cad',
  status                 text not null default 'open' check (status in ('open', 'invoiced', 'paid', 'void')),
  stripe_invoice_id      text,
  stripe_invoice_item_id text,
  created_at             timestamptz not null default now()
);

create index if not exists business_orders_account_idx on public.business_orders (business_account_id);
create index if not exists business_orders_status_idx on public.business_orders (status);

alter table public.business_orders enable row level security;
-- No policies = no anon/authenticated access. service_role bypasses RLS.
