-- 0005_phase2_content_contract.sql
-- Stage 6 Phase 2: structured content bodies, taxonomy semantics, and private view events

-- Body fields on the unified content model
alter table public.content
  add column body jsonb,
  add column editor_schema_version integer not null default 1;

alter table public.content
  add constraint content_editor_schema_version_check
  check (editor_schema_version = 1);

-- Canonical tag identity
alter table public.tags
  add column slug text;

update public.tags
set slug = regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g');

update public.tags
set slug = regexp_replace(slug, '(^-|-$)', '', 'g');

do $$
begin
  if exists (
    select 1
    from (
      select slug
      from public.tags
      group by slug
      having count(*) > 1
    ) collisions
  ) then
    raise exception 'Canonical tag slug collisions exist. Resolve them explicitly before applying 0005.';
  end if;
end;
$$;

alter table public.tags
  alter column slug set not null,
  add constraint tags_slug_format_check
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

create unique index tags_slug_unique on public.tags (slug);

create or replace function public.normalize_tag_identity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.slug := regexp_replace(
    regexp_replace(lower(trim(new.name)), '[^a-z0-9]+', '-', 'g'),
    '(^-|-$)',
    '',
    'g'
  );

  if new.slug = '' then
    raise exception 'Tag name must contain at least one ASCII letter or number.';
  end if;

  return new;
end;
$$;

create trigger normalize_tag_identity_before_write
before insert or update of name, slug on public.tags
for each row execute function public.normalize_tag_identity();

-- Structured body validation helpers
create or replace function public.validate_editor_marks(marks jsonb)
returns void
language plpgsql
immutable
set search_path = public
as $$
declare
  mark jsonb;
  mark_type text;
  value text;
begin
  if marks is null then
    return;
  end if;

  if jsonb_typeof(marks) <> 'array' then
    raise exception 'Editor marks must be an array.';
  end if;

  for mark in select value from jsonb_array_elements(marks) loop
    if jsonb_typeof(mark) <> 'object' or jsonb_typeof(mark->'type') <> 'string' then
      raise exception 'Editor mark must be an object with a type.';
    end if;

    mark_type := mark->>'type';

    if mark_type not in ('bold', 'italic', 'underline', 'fontFamily', 'fontSize') then
      raise exception 'Unsupported editor mark: %.', mark_type;
    end if;

    if mark_type in ('bold', 'italic', 'underline') and jsonb_object_length(mark) <> 1 then
      raise exception 'Simple editor marks cannot contain attributes.';
    end if;

    if mark_type in ('fontFamily', 'fontSize')
      and (
        jsonb_object_length(mark) <> 2
        or jsonb_typeof(mark->'attrs') <> 'object'
        or jsonb_object_length(mark->'attrs') <> 1
        or (select count(*) from jsonb_object_keys(mark->'attrs') key where key <> mark_type) <> 0
      ) then
      raise exception 'Font marks require exactly one attrs value.';
    end if;

    if mark_type = 'fontFamily' then
      value := mark->'attrs'->>'fontFamily';
      if value is null or value not in ('Arial', 'Georgia', 'Times New Roman', 'Verdana') then
        raise exception 'Unsupported font family.';
      end if;
    elsif mark_type = 'fontSize' then
      value := mark->'attrs'->>'fontSize';
      if value is null or value not in ('12px', '14px', '16px', '18px', '24px', '32px') then
        raise exception 'Unsupported font size.';
      end if;
    end if;
  end loop;
end;
$$;

create or replace function public.validate_editor_node(node jsonb, content_id uuid, depth integer default 0)
returns void
language plpgsql
stable
security definer
set search_path = public, storage
as $$
declare
  node_type text;
  child jsonb;
  child_type text;
  level integer;
  path text;
  latex text;
begin
  if depth > 20 then
    raise exception 'Editor document is too deeply nested.';
  end if;

  if jsonb_typeof(node) <> 'object' or jsonb_typeof(node->'type') <> 'string' then
    raise exception 'Editor node must be an object with a type.';
  end if;

  node_type := node->>'type';

  if node_type not in ('doc', 'paragraph', 'heading', 'orderedList', 'bulletList', 'listItem', 'image', 'math', 'text') then
    raise exception 'Unsupported editor node: %.', node_type;
  end if;

  if node_type = 'doc' and (node ? 'attrs' or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'content')) > 0) then
    raise exception 'Doc nodes contain unsupported attributes.';
  elsif node_type = 'paragraph' and (node ? 'attrs' or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'content')) > 0) then
    raise exception 'Paragraph nodes contain unsupported attributes.';
  elsif node_type in ('orderedList', 'bulletList', 'listItem') and (node ? 'attrs' or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'content')) > 0) then
    raise exception 'List nodes contain unsupported attributes.';
  end if;

  if node_type = 'text' then
    if jsonb_typeof(node->'text') <> 'string' then
      raise exception 'Text nodes require text content.';
    end if;
    if length(node->>'text') > 20000 then
      raise exception 'Text nodes exceed the 20,000 character limit.';
    end if;
    if jsonb_object_length(node) not between 1 and 2
      or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'text', 'marks')) > 0 then
      raise exception 'Text nodes contain unsupported attributes.';
    end if;
    perform public.validate_editor_marks(node->'marks');
    return;
  end if;

  if node_type = 'image' then
    path := node->'attrs'->>'path';
    if path is null or path = '' or length(path) > 500 or path like 'data:%' or path like '%..%' then
      raise exception 'Image nodes require a safe Storage path.';
    end if;
    if jsonb_object_length(node->'attrs') <> 1
      or jsonb_object_length(node) <> 2
      or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'attrs')) > 0
      or (select count(*) from jsonb_object_keys(node->'attrs') key where key <> 'path') > 0
      or jsonb_typeof(node->'attrs'->'path') <> 'string' then
      raise exception 'Image nodes require exactly a path attribute.';
    end if;
    if split_part(path, '/', 1) <> content_id::text then
      raise exception 'Image Storage path must belong to its content.';
    end if;
    if not exists (
      select 1 from storage.objects o
      where o.bucket_id = 'content-body-assets' and o.name = path
    ) then
      raise exception 'Image Storage path does not exist.';
    end if;
    return;
  end if;

  if node_type = 'math' then
    latex := node->'attrs'->>'latex';
    if latex is null or length(latex) = 0 or length(latex) > 10000 then
      raise exception 'Math nodes require a valid LaTeX value.';
    end if;
    if jsonb_object_length(node->'attrs') <> 1
      or jsonb_object_length(node) <> 2
      or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'attrs')) > 0
      or (select count(*) from jsonb_object_keys(node->'attrs') key where key <> 'latex') > 0
      or jsonb_typeof(node->'attrs'->'latex') <> 'string' then
      raise exception 'Math nodes require exactly a latex attribute.';
    end if;
    return;
  end if;

  if node_type = 'heading' then
    level := (node->'attrs'->>'level')::integer;
    if level is null or level < 1 or level > 3 then
      raise exception 'Heading level must be between 1 and 3.';
    end if;
    if jsonb_object_length(node->'attrs') <> 1
      or jsonb_object_length(node) <> 3
      or not (node ? 'content')
      or (select count(*) from jsonb_object_keys(node->'attrs') key where key <> 'level') > 0
      or jsonb_typeof(node->'attrs'->'level') <> 'number' then
      raise exception 'Heading nodes require exactly level, type, and content.';
    end if;
    if jsonb_object_length(node->'attrs') <> 1 then
      raise exception 'Heading nodes require exactly a level attribute.';
    end if;
  end if;

  if node_type in ('doc', 'paragraph', 'heading', 'orderedList', 'bulletList', 'listItem') then
    if node_type <> 'paragraph' and jsonb_typeof(node->'content') <> 'array' then
      raise exception '% nodes require a content array.', node_type;
    end if;

    if node_type = 'paragraph' and node->'content' is null then
      return;
    end if;

    for child in select value from jsonb_array_elements(node->'content') loop
      child_type := child->>'type';

      if node_type = 'doc' and child_type not in ('paragraph', 'heading', 'orderedList', 'bulletList') then
        raise exception 'Invalid child inside doc.';
      elsif node_type in ('paragraph', 'heading') and child_type not in ('text', 'image', 'math') then
        raise exception 'Invalid inline child inside %.', node_type;
      elsif node_type in ('orderedList', 'bulletList') and child_type <> 'listItem' then
        raise exception 'Lists may contain only listItem nodes.';
      elsif node_type = 'listItem' and child_type not in ('paragraph', 'heading', 'orderedList', 'bulletList') then
        raise exception 'Invalid child inside listItem.';
      end if;

      perform public.validate_editor_node(child, content_id, depth + 1);
    end loop;
  end if;
end;
$$;

create or replace function public.validate_content_body(body jsonb, content_id uuid)
returns void
language plpgsql
stable
security definer
set search_path = public, storage
as $$
declare
  _node_count bigint;
  _image_count bigint;
  _max_depth integer;
  _max_text_length integer;
  _max_latex_length integer;
  _max_path_length integer;
begin
  if pg_column_size(body) > 1048576 then
    raise exception 'Content body exceeds the 1 MB limit.';
  end if;

  if jsonb_typeof(body) <> 'object' or body->>'type' <> 'doc' then
    raise exception 'Content body must have a doc root.';
  end if;

  with recursive nodes(value, depth) as (
    select body, 0
    union all
    select child.value, nodes.depth + 1
    from nodes
    cross join lateral jsonb_array_elements(coalesce(nodes.value->'content', '[]'::jsonb)) child
    where nodes.depth < 21
  )
  select count(*),
    count(*) filter (where value->>'type' = 'image'),
    max(depth),
    max(length(value->>'text')),
    max(length(value->'attrs'->>'latex')),
    max(length(value->'attrs'->>'path'))
  into strict
    _node_count,
    _image_count,
    _max_depth,
    _max_text_length,
    _max_latex_length,
    _max_path_length
  from nodes;

  if _node_count > 2000 then
    raise exception 'Content body exceeds the 2,000 node limit.';
  elsif _image_count > 100 then
    raise exception 'Content body exceeds the 100 image node limit.';
  elsif _max_depth > 20 then
    raise exception 'Content body exceeds the depth limit.';
  elsif _max_text_length > 20000 then
    raise exception 'Content body contains text exceeding the 20,000 character limit.';
  elsif _max_latex_length > 10000 then
    raise exception 'Content body contains LaTeX exceeding the 10,000 character limit.';
  elsif _max_path_length > 500 then
    raise exception 'Content body contains an image path exceeding the 500 character limit.';
  end if;

  perform public.validate_editor_node(body, content_id, 0);
end;
$$;

revoke all on function public.validate_editor_marks(jsonb) from public, anon, authenticated;
revoke all on function public.validate_editor_node(jsonb, uuid, integer) from public, anon, authenticated;
revoke all on function public.validate_content_body(jsonb, uuid) from public, anon, authenticated;

create or replace function public.enforce_content_body_contract()
returns trigger
language plpgsql
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

update public.content
set body = '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb
where type in ('learning', 'article')
  and status in ('direview', 'diverifikasi')
  and body is null;

do $$
declare
  existing_content record;
begin
  for existing_content in
    select id, type, status, body
    from public.content
    where type in ('learning', 'article') and status in ('direview', 'diverifikasi')
  loop
    if existing_content.body is null then
      raise exception 'Existing published Learning/Article content % has no body.', existing_content.id;
    end if;
    perform public.validate_content_body(existing_content.body, existing_content.id);
  end loop;
end;
$$;

create trigger enforce_content_body_before_write
before insert or update of type, status, body, editor_schema_version on public.content
for each row execute function public.enforce_content_body_contract();

-- Private body-image storage, scoped to the content UUID in the first path segment
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-body-assets',
  'content-body-assets',
  false,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "content_body_assets_select_visible"
  on storage.objects for select
  using (
    bucket_id = 'content-body-assets'
    and exists (
      select 1 from public.content c
      where c.id::text = (storage.foldername(name))[1]
        and (c.status = 'diverifikasi' or c.author_id = auth.uid())
    )
  );

create policy "content_body_assets_insert_author"
  on storage.objects for insert
  with check (
    bucket_id = 'content-body-assets'
    and exists (
      select 1 from public.content c
      where c.id::text = (storage.foldername(name))[1]
        and c.author_id = auth.uid()
        and c.type in ('learning', 'article')
    )
  );

create policy "content_body_assets_delete_author_or_admin"
  on storage.objects for delete
  using (
    bucket_id = 'content-body-assets'
    and (
      exists (
        select 1 from public.content c
        where c.id::text = (storage.foldername(name))[1]
          and c.author_id = auth.uid()
      )
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    )
  );

-- Private raw view events
create table public.content_view_events (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  session_id text,
  created_at timestamptz not null default now(),
  constraint content_view_events_identity_check
    check (user_id is not null or session_id is not null),
  constraint content_view_events_session_check
    check (session_id is null or session_id ~ '^[A-Za-z0-9_-]{16,128}$')
);

create index content_view_events_content_created_idx
  on public.content_view_events (content_id, created_at);

create index content_view_events_user_dedupe_idx
  on public.content_view_events (content_id, user_id, created_at);

create index content_view_events_session_dedupe_idx
  on public.content_view_events (content_id, session_id, created_at);

alter table public.content_view_events enable row level security;

revoke all on public.content_view_events from anon, authenticated;

create or replace function public.record_content_view(target_content_id uuid, anonymous_session_id text default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  dedupe_key text;
begin
  if current_user_id is null and anonymous_session_id is null then
    return false;
  end if;

  if current_user_id is null and anonymous_session_id !~ '^[A-Za-z0-9_-]{16,128}$' then
    return false;
  end if;

  if not exists (
    select 1 from public.content c
    where c.id = target_content_id and c.status = 'diverifikasi'
  ) then
    return false;
  end if;

  dedupe_key := target_content_id::text || ':' || coalesce(current_user_id::text, anonymous_session_id);
  perform pg_advisory_xact_lock(hashtextextended(dedupe_key, 0));

  if exists (
    select 1 from public.content_view_events e
    where e.content_id = target_content_id
      and e.created_at >= now() - interval '24 hours'
      and (
        (current_user_id is not null and e.user_id = current_user_id)
        or (current_user_id is null and e.user_id is null and e.session_id = anonymous_session_id)
      )
  ) then
    return false;
  end if;

  insert into public.content_view_events (content_id, user_id, session_id)
  values (target_content_id, current_user_id, case when current_user_id is null then anonymous_session_id else null end);

  return true;
end;
$$;

revoke all on function public.record_content_view(uuid, text) from public, anon, authenticated;
grant execute on function public.record_content_view(uuid, text) to anon, authenticated;
