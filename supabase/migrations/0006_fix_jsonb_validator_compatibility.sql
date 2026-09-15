-- 0006_fix_jsonb_validator_compatibility.sql
-- Replace unavailable jsonb_object_length(jsonb) calls from 0005.

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

    if mark_type in ('bold', 'italic', 'underline')
      and (select count(*) from jsonb_object_keys(mark)) <> 1 then
      raise exception 'Simple editor marks cannot contain attributes.';
    end if;

    if mark_type in ('fontFamily', 'fontSize')
      and (
        (select count(*) from jsonb_object_keys(mark)) <> 2
        or jsonb_typeof(mark->'attrs') <> 'object'
        or (select count(*) from jsonb_object_keys(mark->'attrs')) <> 1
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
    if (select count(*) from jsonb_object_keys(node)) not between 1 and 2
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
    if (select count(*) from jsonb_object_keys(node->'attrs')) <> 1
      or (select count(*) from jsonb_object_keys(node)) <> 2
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
    if (select count(*) from jsonb_object_keys(node->'attrs')) <> 1
      or (select count(*) from jsonb_object_keys(node)) <> 2
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
    if (select count(*) from jsonb_object_keys(node->'attrs')) <> 1
      or (select count(*) from jsonb_object_keys(node)) <> 3
      or not (node ? 'content')
      or (select count(*) from jsonb_object_keys(node->'attrs') key where key <> 'level') > 0
      or jsonb_typeof(node->'attrs'->'level') <> 'number' then
      raise exception 'Heading nodes require exactly level, type, and content.';
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
