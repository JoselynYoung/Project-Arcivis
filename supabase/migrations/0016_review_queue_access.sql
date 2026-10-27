-- 0016_review_queue_access.sql
--
-- Reviewers read all unpublished content; the review queue needs it.
-- Reviewers may approve direview content (to diverifikasi) or send it back
-- to draft. Publishing stays with verifiers/admins (existing policy).

-- SELECT: reviewers, verifiers, and admins see everything
create policy "content_select_reviewer_all"
	on public.content
	for select
	using (
		exists (
			select 1 from public.profiles
			where id = auth.uid() and role in ('reviewer', 'verifier', 'admin')
		)
	);

-- UPDATE: reviewers may move direview content to diverifikasi or back to draft
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
		and status in ('draft', 'diverifikasi')
	);
