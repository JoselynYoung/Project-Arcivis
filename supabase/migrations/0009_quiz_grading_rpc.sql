-- 0009_quiz_grading_rpc.sql
--
-- Answer keys must not be bulk-readable. The app fetches public question
-- fields only; grading goes through grade_answer, which reveals one
-- question's key after it is answered.

create or replace function public.grade_answer(p_question_id uuid, p_answer integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
	v_correct integer;
	v_explanation text;
begin
	select q.correct_index, q.explanation
	into v_correct, v_explanation
	from public.questions q
	join public.content c on c.id = q.content_id
	where q.id = p_question_id
		and c.type = 'practice'
		and c.status = 'diverifikasi';

	if not found then
		return jsonb_build_object('ok', false);
	end if;

	return jsonb_build_object(
		'ok', true,
		'correct', (p_answer = v_correct),
		'correct_index', v_correct,
		'explanation', coalesce(v_explanation, '')
	);
end;
$$;

grant execute on function public.grade_answer(uuid, integer) to anon, authenticated;

-- Hide keys from direct table reads. App queries select explicit public
-- columns; only this RPC (security definer) can see the keys.
revoke select (correct_index, explanation) on public.questions from anon, authenticated;
