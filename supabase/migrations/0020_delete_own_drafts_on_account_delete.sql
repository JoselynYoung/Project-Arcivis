-- 0020_delete_own_drafts_on_account_delete.sql
--
-- Deleting an account used to null the author on ALL of its content
-- (0011). Drafts and direview items must disappear instead — only verified
-- work survives, anonymously. This trigger runs before the FK cascade, so
-- drafts are deleted first and only diverifikasi rows get SET NULL.

create or replace function public.delete_own_drafts_on_account_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	delete from public.content
	where author_id = old.id
		and status in ('draft', 'direview');
	return old;
end;
$$;

drop trigger if exists delete_own_drafts_before_profile_delete on public.profiles;

create trigger delete_own_drafts_before_profile_delete
	before delete on public.profiles
	for each row
	execute function public.delete_own_drafts_on_account_delete();
