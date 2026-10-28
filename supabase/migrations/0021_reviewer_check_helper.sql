-- 0021_reviewer_check_helper.sql
--
-- 0019 introduced a self-referencing profiles policy
-- (profiles_select_reviewer_admin queries public.profiles inside its own
-- USING clause). Any role check against profiles -- e.g. the review-queue
-- access policy on content -- then recurses forever (Postgres 42P17).
-- A SECURITY DEFINER helper bypasses RLS, so the check never re-enters
-- policy evaluation.

create or replace function public.is_reviewer_or_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
	select exists (
		select 1 from public.profiles
 		where id = auth.uid() and role in ('reviewer', 'admin')
	);
$$;

drop policy if exists "profiles_select_reviewer_admin" on public.profiles;

create policy "profiles_select_reviewer_admin"
	on public.profiles
	for select
	using (public.is_reviewer_or_admin());
