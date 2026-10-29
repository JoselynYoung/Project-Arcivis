-- 0025_roles_contributor_moderator.sql
--
-- Roles become guest / member / contributor / moderator / admin.
-- reviewer+verifier merge into moderator; existing accounts move over.
-- Members who already authored content, bank rows, threads, or answers
-- become contributors so nothing they own gets locked out.
-- Submitting drafts now requires the contributor role or above.

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

-- Profiles: moderators/admins read all rows.
drop policy if exists "profiles_select_reviewer_admin" on public.profiles;
create policy "profiles_select_moderator_admin"
	on public.profiles
	for select
	using (public.is_moderator_or_admin());

-- Content: moderators/admins see everything, including drafts in review.
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

-- Content: moderators decide direview rows (approve or send back).
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

-- Content: moderators/admins may update and publish any row.
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

-- Content: inserting drafts requires the contributor role or above.
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

-- Bank: moderators/admins may decide any row.
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

-- Bank: submitting drafts requires the contributor role or above.
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

-- Threads: moderators keep full access; posting needs contributor or above.
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

-- Answers: moderators verify; posting needs contributor or above.
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
