-- 0013_reports.sql
--
-- User reports against published content. Reports are intake only; triage
-- happens outside the app until the review queue (Stage 7 Phase 4) exists.

create table public.reports (
	id uuid primary key default gen_random_uuid(),
	content_id uuid not null references public.content(id) on delete cascade,
	user_id uuid not null references public.profiles(id) on delete cascade,
	reason text not null check (char_length(reason) between 1 and 500),
	created_at timestamptz not null default now()
);

create index idx_reports_content_id on public.reports(content_id);

alter table public.reports enable row level security;

-- SELECT: own rows only
create policy "reports_select_own"
	on public.reports
	for select
	using (auth.uid() = user_id);

-- INSERT: signed-in users, own rows only
create policy "reports_insert_own"
	on public.reports
	for insert
	with check (auth.uid() = user_id);
