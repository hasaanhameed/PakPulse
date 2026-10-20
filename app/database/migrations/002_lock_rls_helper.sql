-- PakPulse 002: lock down Supabase's RLS helper function
-- Applied to Supabase on 2026-10-20.
-- Supabase's "Run and enable RLS" button (used for 001) adds public.rls_auto_enable(),
-- which the public API roles can call. The Security Advisor flags this. This removes their access.
-- Safe to run on a fresh database where the function does not exist.

do $$
begin
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
