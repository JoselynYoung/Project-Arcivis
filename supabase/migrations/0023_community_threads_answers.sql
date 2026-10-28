-- 0023_community_threads_answers.sql
--
-- Community Q&A lives in its own tables, not in question_bank: answers
-- are a growing one-to-many list (columns cannot hold that), and the
-- quiz pipeline's NOT NULL columns (options, correct_index, difficulty)
-- must not be relaxed for forum posts.
-- Answer bodies are Tiptap JSON (jsonb) from the start so tables, math,
-- and formatting render without a later migration.

create table public.threads (
	id uuid primary key default gen_random_uuid(),
	subject_id uuid references public.subjects(id) on delete set null,
	text text not null,
	author_id uuid not null references public.profiles(id) on delete cascade,
	status text not null default 'open' check (status in ('open', 'resolved')),
	created_at timestamptz not null default now()
);

create table public.answers (
	id uuid primary key default gen_random_uuid(),
	thread_id uuid not null references public.threads(id) on delete cascade,
	author_id uuid not null references public.profiles(id) on delete cascade,
	body jsonb not null,
	is_accepted boolean not null default false,
	is_verified boolean not null default false,
	created_at timestamptz not null default now()
);

create index idx_threads_created on public.threads(created_at desc);
create index idx_answers_thread on public.answers(thread_id, created_at);

alter table public.threads enable row level security;
alter table public.answers enable row level security;

-- Threads are a public forum: anyone reads, signed-in users post.
create policy "threads_select_all"
	on public.threads for select using (true);

create policy "threads_insert_signed_in"
	on public.threads for insert
	with check (auth.uid() = author_id);

create policy "threads_update_own_or_reviewer"
	on public.threads for update
	using (
		auth.uid() = author_id
		or public.is_reviewer_or_admin()
	);

create policy "threads_delete_own_or_admin"
	on public.threads for delete
	using (
		auth.uid() = author_id
		or exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'admin'
		)
	);

-- Answers follow their thread; flags are set through app code:
-- is_accepted by the thread author, is_verified by reviewers only.
create policy "answers_select_all"
	on public.answers for select using (true);

create policy "answers_insert_signed_in"
	on public.answers for insert
	with check (auth.uid() = author_id);

create policy "answers_update_own_or_reviewer"
	on public.answers for update
	using (
		auth.uid() = author_id
		or public.is_reviewer_or_admin()
	);

create policy "answers_delete_own_or_admin"
	on public.answers for delete
	using (
		auth.uid() = author_id
		or exists (
			select 1 from public.profiles
			where id = auth.uid() and role = 'admin'
		)
	);

grant select on public.threads to anon, authenticated;
grant insert, update, delete on public.threads to authenticated;
grant select on public.answers to anon, authenticated;
grant insert, update, delete on public.answers to authenticated;
