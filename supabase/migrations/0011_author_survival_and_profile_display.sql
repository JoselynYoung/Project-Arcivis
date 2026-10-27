-- 0011_author_survival_and_profile_display.sql
--
-- Verified content survives author deletion (author set to null); drafts
-- are reassigned or removed by admins, never silently cascade-deleted.
-- Profiles gain a bio line and a join date for the profile header.

alter table public.profiles
	add column bio text not null default '',
	add column created_at timestamptz not null default now();

alter table public.content
	alter column author_id drop not null,
	drop constraint content_author_id_fkey,
	add constraint content_author_id_fkey
		foreign key (author_id) references public.profiles(id) on delete set null;
