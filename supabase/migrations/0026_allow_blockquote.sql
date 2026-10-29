-- 0026_allow_blockquote.sql
--
-- Quote blocks for the post composer (Substack/Medium style). blockquote
-- behaves like paragraph: a content array, no attributes, inline children
-- only (text, image, math). Allowed as a doc and listItem child.

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

  if node_type not in ('doc', 'paragraph', 'blockquote', 'heading', 'orderedList', 'bulletList', 'listItem', 'image', 'math', 'text') then
    raise exception 'Unsupported editor node: %.', node_type;
  end if;

  if node_type = 'doc' and (node ? 'attrs' or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'content')) > 0) then
    raise exception 'Doc nodes contain unsupported attributes.';
  elsif node_type in ('paragraph', 'blockquote') and (node ? 'attrs' or (select count(*) from jsonb_object_keys(node) key where key not in ('type', 'content')) > 0) then
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

  if node_type in ('doc', 'paragraph', 'blockquote', 'heading', 'orderedList', 'bulletList', 'listItem') then
    if node_type <> 'paragraph' and jsonb_typeof(node->'content') <> 'array' then
      raise exception '% nodes require a content array.', node_type;
    end if;

    if node_type = 'paragraph' and node->'content' is null then
      return;
    end if;

    for child in select value from jsonb_array_elements(node->'content') loop
      child_type := child->>'type';

      if node_type = 'doc' and child_type not in ('paragraph', 'blockquote', 'heading', 'orderedList', 'bulletList') then
        raise exception 'Invalid child inside doc.';
      elsif node_type in ('paragraph', 'blockquote', 'heading') and child_type not in ('text', 'image', 'math') then
        raise exception 'Invalid inline child inside %.', node_type;
      elsif node_type in ('orderedList', 'bulletList') and child_type <> 'listItem' then
        raise exception 'Lists may contain only listItem nodes.';
      elsif node_type = 'listItem' and child_type not in ('paragraph', 'blockquote', 'heading', 'orderedList', 'bulletList') then
        raise exception 'Invalid child inside listItem.';
      end if;

      perform public.validate_editor_node(child, content_id, depth + 1);
    end loop;
  end if;
end;
$$;
