-- 0010_practice_question_counts_rpc.sql
--
-- questions(count) embeds need table-level SELECT, which 0009 revoked to
-- hide answer keys. Counts come through this RPC instead, following the
-- same security-definer pattern as the view-count RPCs.

create or replace function public.get_practice_question_counts()
returns table (content_id uuid, question_count bigint)
language sql
security definer
set search_path = public
as $$
	select q.content_id, count(*)
	from public.questions q
	group by q.content_id
$$;

grant execute on function public.get_practice_question_counts() to anon, authenticated;
