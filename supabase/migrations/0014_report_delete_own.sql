-- 0014_report_delete_own.sql
--
-- Allow users to withdraw their own reports. No admin UI yet; triage
-- still happens outside the app.

create policy "reports_delete_own"
	on public.reports
	for delete
	using (auth.uid() = user_id);
