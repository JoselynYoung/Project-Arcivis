-- 0017_revision_history.sql
--
-- Every content update snapshots the previous title/body/status. Authors get
-- an edit UI for their own drafts; the history viewer reads these rows.

create table public.revisions (
	id uuid primary key default gen_random_uuid(),
	content_id uuid not null references public.content(id) on delete cascade,
	editor_id uuid references public.profiles(id) on delete set null,
	title text not null,
	body jsonb,
	status text not null,
	created_at timestamptz not null default now()
);

create index idx_revisions_content_id on public.revisions(content_id);

alter table public.revisions enable row level security;

-- SELECT: visible wherever the parent content is visible
create policy "revisions_select_visible"
	on public.revisions
	for select
	using (
		exists (
			select 1 from public.content c
			where c.id = revisions.content_id
				and (c.status = 'diverifikasi' or c.author_id = auth.uid())
		)
	);

-- No INSERT/UPDATE/DELETE policies: rows are written by the trigger below
-- (security definer), never directly by clients.

create or replace function public.snapshot_content_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	insert into public.revisions (content_id, editor_id, title, body, status)
	values (old.id, auth.uid(), old.title, old.body, old.status);
	return new;
end;
$$;

drop trigger if exists snapshot_revision_on_content_update on public.content;

create trigger snapshot_revision_on_content_update
	before update on public.content
	for each row
	when (old.title is distinct from new.title
		or old.body is distinct from new.body
		or old.status is distinct from new.status)
	execute function public.snapshot_content_revision();
