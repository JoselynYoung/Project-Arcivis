-- 0022_anon_profiles_grant.sql
--
-- 0019 revoked table-level SELECT on profiles from anon to force author
-- display through get_author_names. That broke other tables' policies:
-- role checks like "exists (select 1 from profiles ...)" run as the
-- calling role, so anonymous content reads now fail with 42501
-- (permission denied) instead of recursing.
--
-- A table grant is not row access: RLS still applies, and for anon both
-- profiles policies evaluate to false (own-row needs auth.uid(), the
-- reviewer check needs a login), so direct anon reads return zero rows.
-- Re-granting restores the role checks while keeping names RPC-only.

grant select on public.profiles to anon;
