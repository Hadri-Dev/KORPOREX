-- Remove the weekly owner digest setting from Registered Office renewals.
--
-- Apply by pasting this whole file into Supabase Dashboard -> SQL Editor and
-- clicking "Run". Idempotent: safe to run multiple times.
--
-- The Monday digest email was removed from the code on 2026-11-16 at the
-- owner's request (it arrived every week, even when nothing was due). No code
-- reads or writes this column any more, so the site works the same whether or
-- not this file has been run; it only clears out the dead setting.

alter table public.office_renewal_settings drop column if exists monday_digest;
