-- 0024_thread_rich_body.sql
--
-- Community questions need tables and formatted content (e.g. UTBK
-- stimulus tables), so threads get a Tiptap JSON body next to the
-- plain-text summary. text stays the list-display fallback; body is
-- the full rich document when the editor was used.

alter table public.threads
	add column body jsonb;
