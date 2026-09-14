-- 0004_storage_covers.sql
-- Storage bucket for content cover images
-- Generated for Stage 5: Supabase Implementation

-- Create bucket for content cover images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-covers',
  'content-covers',
  true,
  2097152, -- 2MB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Public read access for cover images
create policy "content_covers_select_all"
  on storage.objects for select
  using (bucket_id = 'content-covers');

-- Authenticated users can upload only into their own folder (auth.uid() as folder name)
create policy "content_covers_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'content-covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete only their own files; admins can delete any
create policy "content_covers_delete_own_or_admin"
  on storage.objects for delete
  using (
    bucket_id = 'content-covers'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      )
    )
  );

-- No UPDATE policy — re-uploading means delete + insert a new file