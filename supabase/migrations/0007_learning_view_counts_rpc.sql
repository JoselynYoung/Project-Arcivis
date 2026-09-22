-- 0007_learning_view_counts_rpc.sql
-- Read-only aggregate counts for published Learning content.

create or replace function public.get_learning_view_counts(content_ids uuid[] default null)
returns table (content_id uuid, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select c.id as content_id, count(e.id)::bigint as view_count
  from public.content c
  left join public.content_view_events e on e.content_id = c.id
  where c.type = 'learning'
    and c.status = 'diverifikasi'
    and (content_ids is null or c.id = any(content_ids))
  group by c.id;
$$;

revoke all on function public.get_learning_view_counts(uuid[]) from public, anon, authenticated;
grant execute on function public.get_learning_view_counts(uuid[]) to anon, authenticated;
