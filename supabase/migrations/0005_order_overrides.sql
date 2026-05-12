-- Phase: admin order management — per-Stripe-session override row.
--
-- Apply by pasting this whole file into Supabase Dashboard -> SQL Editor and
-- clicking "Run". Idempotent — safe to run multiple times.
--
-- Rationale: Stripe Checkout sessions are immutable from our side (we cannot
-- delete them or change their payment_status). To let the operator manage
-- orders from /dashboard/orders, we attach a side-row keyed by the Stripe
-- session id. Each override row carries:
--   - admin_status: an admin-set lifecycle stage layered on top of Stripe
--     (transaction_approved / money_received / money_not_received /
--     pending_approval). Nullable so "no admin status yet" is representable.
--   - deleted: soft-hide flag. When true the order disappears from the
--     dashboard's tabs but the underlying Stripe session is untouched.
--   - notes: optional free-text field for future use.
--
-- RLS is enabled with no policies — anon and authenticated roles can do
-- nothing. Only the service_role key (used server-side from
-- src/lib/supabase.ts -> getSupabaseServiceClient) reads/writes the table.

create table if not exists public.order_overrides (
  session_id   text primary key,
  admin_status text check (admin_status in (
    'transaction_approved',
    'money_received',
    'money_not_received',
    'pending_approval'
  )),
  deleted      boolean not null default false,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists order_overrides_deleted_idx
  on public.order_overrides (deleted);

create index if not exists order_overrides_admin_status_idx
  on public.order_overrides (admin_status);

alter table public.order_overrides enable row level security;
-- No policies = no anon/authenticated access. service_role bypasses RLS.

-- Touch updated_at on every change.
create or replace function public.order_overrides_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists order_overrides_touch_updated_at on public.order_overrides;
create trigger order_overrides_touch_updated_at
  before update on public.order_overrides
  for each row execute function public.order_overrides_touch_updated_at();
