-- 0019_author_names_public.sql
--
-- Profiles are no longer world-readable: only id+name are public, served
-- through a security-definer function so UIs keep showing author names
-- without exposing roles or other columns. Reviewers/admins keep full
-- access for moderation; everyone keeps their own row.

create or replace function public.get_author_names(ids uuid[])
returns table (id uuid, name text)
language sql
security definer
set search_path = public
as $$
	select p.id, p.name from public.profiles p where p.id = any (ids);
$$;

grant execute on function public.get_author_names(uuid[]) to anon, authenticated;

-- Authenticated users keep table-level SELECT; row policies below decide
-- which rows they can actually read (own row, or all rows for reviewers).
grant select on public.profiles to authenticated;
-- Anonymous clients lose direct table reads entirely; UI reads author
-- names through get_author_names instead.
revoke select on public.profiles from anon;

drop policy profiles_select_public on public.profiles;

create policy "profiles_select_own"
	on public.profiles
	for select
	using (auth.uid() = id);

create policy "profiles_select_reviewer_admin"
	on public.profiles
	for select
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('reviewer', 'admin')
		)
	);

-- content_tags was world-readable including draft links. It now mirrors the
-- parent content visibility: published, or owned by the reader.
drop policy content_tags_select_all on public.content_tags;

create policy "content_tags_select_visible"
	on public.content_tags
	for select
	using (
		exists (
			select 1 from public.content c
			where c.id = content_tags.content_id
				and (c.status = 'diverifikasi' or c.author_id = auth.uid())
		)
	);
