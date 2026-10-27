-- 0015_trigger_definer_for_body_contract.sql
--
-- Authenticated inserts with a body failed with
-- "permission denied for function validate_content_body": the trigger ran
-- as the invoker while the validators are revoked from anon/authenticated.
-- The trigger now runs as the definer so validation applies to everyone.

create or replace function public.enforce_content_body_contract()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.editor_schema_version <> 1 then
    raise exception 'Unsupported editor schema version.';
  end if;

  if new.type in ('learning', 'article') and new.status in ('direview', 'diverifikasi') and new.body is null then
    raise exception 'Published Learning and Article content requires a body.';
  end if;

  if new.body is not null then
    perform public.validate_content_body(new.body, new.id);
  end if;

  return new;
end;
$$;
