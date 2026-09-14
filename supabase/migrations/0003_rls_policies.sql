-- 0003_rls_policies.sql
-- Row Level Security policies for Arcivis
-- Generated for Stage 5: Supabase Implementation

-- ============================================================================
-- Helper function: prevent role self-escalation
-- ============================================================================
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    ) then
      raise exception 'Only admins can change role.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_role_change on public.profiles;

create trigger prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- ============================================================================
-- profiles
-- ============================================================================
alter table public.profiles enable row level security;

-- SELECT: public-safe fields for everyone (needed for authorship display)
create policy "profiles_select_public"
  on public.profiles
  for select
  using (true);

-- UPDATE: own row only (role protection via trigger)
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No INSERT policy (created by handle_new_user trigger, security definer)
-- No DELETE policy

-- ============================================================================
-- content
-- ============================================================================
alter table public.content enable row level security;

-- SELECT: published (diverifikasi) OR own content (any status)
create policy "content_select_published_or_own"
  on public.content
  for select
  using (
    status = 'diverifikasi'
    or auth.uid() = author_id
  );

-- INSERT: own content, must start as draft
create policy "content_insert_own_draft"
  on public.content
  for insert
  with check (
    auth.uid() = author_id
    and status = 'draft'
  );

-- UPDATE policy 1: authors can update own content, but cannot set status to 'diverifikasi'
create policy "content_update_own_not_publish"
  on public.content
  for update
  using (auth.uid() = author_id)
  with check (
    auth.uid() = author_id
    and status in ('draft', 'direview')
  );

-- UPDATE policy 2: verifiers/admins can update any content, including publishing
create policy "content_update_verifier_admin"
  on public.content
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('verifier', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('verifier', 'admin')
    )
  );

-- DELETE: own drafts only, or admin
create policy "content_delete_own_draft_or_admin"
  on public.content
  for delete
  using (
    (auth.uid() = author_id and status = 'draft')
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- content_resources
-- ============================================================================
alter table public.content_resources enable row level security;

-- SELECT: visible if parent content is visible
create policy "content_resources_select_visible"
  on public.content_resources
  for select
  using (
    exists (
      select 1 from public.content c
      where c.id = content_resources.content_id
        and (c.status = 'diverifikasi' or c.author_id = auth.uid())
    )
  );

-- INSERT/UPDATE/DELETE: owner or admin
create policy "content_resources_modify_owner_admin"
  on public.content_resources
  for all
  using (
    exists (
      select 1 from public.content c
      where c.id = content_resources.content_id
        and (c.author_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          ))
    )
  )
  with check (
    exists (
      select 1 from public.content c
      where c.id = content_resources.content_id
        and (c.author_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          ))
    )
  );

-- ============================================================================
-- subjects
-- ============================================================================
alter table public.subjects enable row level security;

-- SELECT: everyone
create policy "subjects_select_all"
  on public.subjects
  for select
  using (true);

-- INSERT/UPDATE/DELETE: admin only
create policy "subjects_modify_admin"
  on public.subjects
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- tags
-- ============================================================================
alter table public.tags enable row level security;

-- SELECT: everyone
create policy "tags_select_all"
  on public.tags
  for select
  using (true);

-- INSERT: any authenticated user
create policy "tags_insert_authenticated"
  on public.tags
  for insert
  with check (auth.uid() is not null);

-- UPDATE/DELETE: admin only
create policy "tags_modify_admin"
  on public.tags
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- content_tags
-- ============================================================================
alter table public.content_tags enable row level security;

-- SELECT: everyone
create policy "content_tags_select_all"
  on public.content_tags
  for select
  using (true);

-- INSERT/DELETE: owner or admin
create policy "content_tags_modify_owner_admin"
  on public.content_tags
  for all
  using (
    exists (
      select 1 from public.content c
      where c.id = content_tags.content_id
        and (c.author_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          ))
    )
  )
  with check (
    exists (
      select 1 from public.content c
      where c.id = content_tags.content_id
        and (c.author_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          ))
    )
  );

-- ============================================================================
-- bookmarks
-- ============================================================================
alter table public.bookmarks enable row level security;

-- SELECT/INSERT/DELETE: own only
create policy "bookmarks_own"
  on public.bookmarks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================================
-- questions
-- ============================================================================
alter table public.questions enable row level security;

-- SELECT: visible if parent content is visible
create policy "questions_select_visible"
  on public.questions
  for select
  using (
    exists (
      select 1 from public.content c
      where c.id = questions.content_id
        and (c.status = 'diverifikasi' or c.author_id = auth.uid())
    )
  );

-- INSERT/UPDATE/DELETE: owner or admin
create policy "questions_modify_owner_admin"
  on public.questions
  for all
  using (
    exists (
      select 1 from public.content c
      where c.id = questions.content_id
        and (c.author_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          ))
    )
  )
  with check (
    exists (
      select 1 from public.content c
      where c.id = questions.content_id
        and (c.author_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'admin'
          ))
    )
  );

-- ============================================================================
-- attempts
-- ============================================================================
alter table public.attempts enable row level security;

-- SELECT/INSERT: own only
create policy "attempts_own"
  on public.attempts
  for select
  using (auth.uid() = user_id);

create policy "attempts_insert_own"
  on public.attempts
  for insert
  with check (auth.uid() = user_id);

-- No UPDATE or DELETE policy (append-only history)

-- ============================================================================
-- announcements
-- ============================================================================
alter table public.announcements enable row level security;

-- SELECT: everyone
create policy "announcements_select_all"
  on public.announcements
  for select
  using (true);

-- INSERT/UPDATE/DELETE: admin only
create policy "announcements_modify_admin"
  on public.announcements
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================================
-- schedules
-- ============================================================================
alter table public.schedules enable row level security;

-- SELECT: everyone
create policy "schedules_select_all"
  on public.schedules
  for select
  using (true);

-- INSERT/UPDATE/DELETE: admin only
create policy "schedules_modify_admin"
  on public.schedules
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );