-- 0029_add_ditolak_status.sql
--
-- The Contribute page filters a unified queue (Draft / Menunggu persetujuan /
-- Ditolak) per type, so rejected content needs its own status instead of
-- silently returning to draft.

do $$
declare
	r record;
begin
	for r in
		select conname from pg_constraint
		where conrelid = 'public.content'::regclass
			and contype = 'c'
			and pg_get_constraintdef(oid) like '%status%'
	loop
		execute 'alter table public.content drop constraint ' || quote_ident(r.conname);
	end loop;
	for r in
		select conname from pg_constraint
		where conrelid = 'public.question_bank'::regclass
			and contype = 'c'
			and pg_get_constraintdef(oid) like '%status%'
	loop
		execute 'alter table public.question_bank drop constraint ' || quote_ident(r.conname);
	end loop;
end;
$$;

alter table public.content
	add constraint content_status_check
	check (status in ('draft', 'direview', 'diverifikasi', 'ditolak'));

alter table public.question_bank
	add constraint question_bank_status_check
	check (status in ('draft', 'direview', 'diverifikasi', 'ditolak'));

-- Authors may edit and resubmit their own rejected rows.
drop policy if exists "content_update_own_not_publish" on public.content;
create policy "content_update_own_not_publish"
	on public.content
	for update
	using (auth.uid() = author_id)
	with check (
		auth.uid() = author_id
		and status in ('draft', 'direview', 'ditolak')
	);

-- Authors may delete their own rejected rows.
drop policy if exists "content_delete_own_draft_or_admin" on public.content;
create policy "content_delete_own_draft_or_admin"
	on public.content
	for delete
	using (
		(auth.uid() = author_id and status in ('draft', 'ditolak'))
		or exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'admin'
		)
	);

-- Reviewers may reject direview content to ditolak (in addition to draft/diverifikasi).
drop policy if exists "content_update_reviewer_decide" on public.content;
create policy "content_update_reviewer_decide"
	on public.content
	for update
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'reviewer'
		)
		and status = 'direview'
	)
	with check (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'reviewer'
		)
		and status in ('draft', 'diverifikasi', 'ditolak')
	);

-- Authors may edit their own rejected bank rows.
drop policy if exists "question_bank_update_own_not_publish" on public.question_bank;
create policy "question_bank_update_own_not_publish"
	on public.question_bank
	for update
	using (auth.uid() = author_id)
	with check (auth.uid() = author_id and status in ('draft', 'direview', 'ditolak'));
