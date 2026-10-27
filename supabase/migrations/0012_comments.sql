-- 0012_comments.sql
--
-- Per-content discussion. Visible wherever the parent content is visible;
-- only signed-in users can post, and only to published content or their own
-- drafts. Authors can delete their own comments.

create table public.comments (
	id uuid primary key default gen_random_uuid(),
	content_id uuid not null references public.content(id) on delete cascade,
	user_id uuid not null references public.profiles(id) on delete cascade,
	body text not null check (char_length(body) between 1 and 2000),
	created_at timestamptz not null default now()
);

create index idx_comments_content_id on public.comments(content_id);

alter table public.comments enable row level security;

-- SELECT: visible if parent content is visible
create policy "comments_select_visible"
	on public.comments
	for select
	using (
		exists (
			select 1 from public.content c
			where c.id = comments.content_id
				and (c.status = 'diverifikasi' or c.author_id = auth.uid())
		)
	);

-- INSERT: signed-in users, own rows only
create policy "comments_insert_own"
	on public.comments
	for insert
	with check (auth.uid() = user_id);

-- DELETE: own rows only
create policy "comments_delete_own"
	on public.comments
	for delete
	using (auth.uid() = user_id);
