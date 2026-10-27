-- 0018_question_bank.sql
--
-- Community question pool, separate from curated packages. Members submit
-- questions as drafts; verified rows become usable community content.
-- Reuse across packages via a join table is a later step (see BACKLOG).

create table public.question_bank (
	id uuid primary key default gen_random_uuid(),
	subject_id uuid references public.subjects(id) on delete set null,
	topic text,
	difficulty text not null check (difficulty in ('Mudah', 'Sedang', 'Sulit')),
	text text not null,
	options jsonb not null,
	correct_index integer not null,
	explanation text,
	author_id uuid not null references public.profiles(id) on delete cascade,
	status text not null default 'draft' check (status in ('draft', 'direview', 'diverifikasi')),
	created_at timestamptz not null default now()
);

create index idx_question_bank_status on public.question_bank(status);

alter table public.question_bank enable row level security;

-- SELECT: verified rows are public; own rows always visible
create policy "question_bank_select_visible"
	on public.question_bank
	for select
	using (status = 'diverifikasi' or auth.uid() = author_id);

-- INSERT: signed-in users, own rows, drafts only
create policy "question_bank_insert_own_draft"
	on public.question_bank
	for insert
	with check (auth.uid() = author_id and status = 'draft');

-- UPDATE: authors may set their own rows to draft/direview
create policy "question_bank_update_own_not_publish"
	on public.question_bank
	for update
	using (auth.uid() = author_id)
	with check (auth.uid() = author_id and status in ('draft', 'direview'));

-- UPDATE: verifiers/admins may decide any row
create policy "question_bank_update_verifier_admin"
	on public.question_bank
	for update
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('verifier', 'admin')
		)
	)
	with check (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('verifier', 'admin')
		)
	);

-- DELETE: own rows only
create policy "question_bank_delete_own"
	on public.question_bank
	for delete
	using (auth.uid() = author_id);
