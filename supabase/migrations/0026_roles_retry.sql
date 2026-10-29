-- 0026_roles_contributor_moderator_retry.sql
--
-- 0025 failed partway: prevent_role_self_escalation() blocks every
-- profiles UPDATE when auth.uid() is null, which includes migrations
-- and dashboard edits. This retry disables that trigger while the role
-- values move, re-applies every 0025 step idempotently, then installs a
-- trigger that still blocks self-escalation but lets direct database
-- access (migrations, dashboard service key) through.

alter table public.profiles disable trigger prevent_role_change;

alter table public.profiles drop constraint if exists profiles_role_check;

update public.profiles set role = 'moderator' where role in ('reviewer', 'verifier');

update public.profiles set role = 'contributor'
where role = 'member' and id in (
	select author_id from public.content
	union select author_id from public.question_bank
	union select author_id from public.threads
	union select author_id from public.answers
);

alter table public.profiles
	add constraint profiles_role_check
	check (role in ('guest', 'member', 'contributor', 'moderator', 'admin'));

create or replace function public.is_moderator_or_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
	select exists (
		select 1 from public.profiles
		where id = auth.uid() and role in ('moderator', 'admin')
	);
$$;

drop policy if exists "profiles_select_reviewer_admin" on public.profiles;
create policy "profiles_select_moderator_admin"
	on public.profiles
	for select
	using (public.is_moderator_or_admin());

drop policy if exists "content_select_reviewer_all" on public.content;
create policy "content_select_moderator_all"
	on public.content
	for select
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('moderator', 'admin')
		)
	);

drop policy if exists "content_update_reviewer_decide" on public.content;
create policy "content_update_moderator_decide"
	on public.content
	for update
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'moderator'
		)
		and status = 'direview'
	)
	with check (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'moderator'
		)
		and status in ('draft', 'diverifikasi')
	);

drop policy if exists "content_update_verifier_admin" on public.content;
create policy "content_update_moderator_admin"
	on public.content
	for update
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('moderator', 'admin')
		)
	)
	with check (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('moderator', 'admin')
		)
	);

drop policy if exists "content_insert_own_draft" on public.content;
create policy "content_insert_contributor_draft"
	on public.content
	for insert
	with check (
		auth.uid() = author_id
		and status = 'draft'
		and exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('contributor', 'moderator', 'admin')
		)
	);

drop policy if exists "question_bank_update_verifier_admin" on public.question_bank;
create policy "question_bank_update_moderator_admin"
	on public.question_bank
	for update
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('moderator', 'admin')
		)
	)
	with check (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('moderator', 'admin')
		)
	);

drop policy if exists "question_bank_insert_own_draft" on public.question_bank;
create policy "question_bank_insert_contributor_draft"
	on public.question_bank
	for insert
	with check (
		auth.uid() = author_id
		and status = 'draft'
		and exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('contributor', 'moderator', 'admin')
		)
	);

drop policy if exists "threads_update_own_or_reviewer" on public.threads;
create policy "threads_update_own_or_moderator"
	on public.threads
	for update
	using (
		auth.uid() = author_id
		or public.is_moderator_or_admin()
	);

drop policy if exists "threads_insert_signed_in" on public.threads;
create policy "threads_insert_contributor"
	on public.threads
	for insert
	with check (
		auth.uid() = author_id
		and exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('contributor', 'moderator', 'admin')
		)
	);

drop policy if exists "answers_update_own_or_reviewer" on public.answers;
create policy "answers_update_own_or_moderator"
	on public.answers
	for update
	using (
		auth.uid() = author_id
		or public.is_moderator_or_admin()
	);

drop policy if exists "answers_insert_signed_in" on public.answers;
create policy "answers_insert_contributor"
	on public.answers
	for insert
	with check (
		auth.uid() = author_id
		and exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('contributor', 'moderator', 'admin')
		)
	);

drop function if exists public.is_reviewer_or_admin();

-- Self-escalation guard that still lets direct database access through.
-- PostgREST always carries JWT claims; only direct connections (migrations,
-- dashboard service key) arrive without them.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	if new.role is distinct from old.role then
		if current_setting('request.jwt.claims', true) is null then
			return new;
		end if;
		if not exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'admin'
		) then
			raise exception 'Only admins can change role.';
		end if;
	end if;
	return new;
end;
$$;

drop trigger if exists prevent_role_change on public.profiles;
create trigger prevent_role_change
	before update on public.profiles
	for each row execute function public.prevent_role_self_escalation();

alter table public.profiles enable trigger prevent_role_change;
