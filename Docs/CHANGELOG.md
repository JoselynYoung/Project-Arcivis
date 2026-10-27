# Changelog

All notable changes to Arcivis are documented in this file. Format follows [Keep a Changelog](https://keepachangelog.com/): each release lists what changed under `Added` / `Changed` / `Fixed` / `Removed`. A release line names the stage it belongs to and the migration files the live database needs, if any.

---

## [v0.7.0] — Stage 7: Community

Opens Stage 7: per-content discussion, reports, draft contributions, curator review, revision history, community question bank, and a personal activity feed. Requires migrations `0012_comments.sql` through `0018_question_bank.sql` on the live database.

### Added

- `comments` table with RLS: visible wherever the parent content is visible, signed-in-only posts, owner-only deletes.
- `reports` table with RLS: signed-in-only posts, owner-only reads and deletes.
- `CommentSection` on Learning, Articles, and Practice detail pages: plain-text rendering, 2000-character limit, empty state, and a sign-in notice for visitors.
- `ReportButton` on Learning, Articles, and Practice detail pages: preset reasons, signed-in-only submit, and a sign-in notice for visitors.
- `/review` queue for reviewer/verifier/admin roles with approve and send-back actions; authors submit drafts from their profile contributions.
- `/contribute` page with profile entry point: article/learning drafts with subject picker; plain paragraphs become a Tiptap v1 document.
- Edit flow for authors (`/contribute/[id]`) with automatic revision snapshots and a history viewer on detail pages.
- `/bank`: community question pool with verified list and member submission (subject, difficulty, options, key, explanation).
- `Aktivitas` tab on profiles: the signed-in user's own comments and reports, newest first.

### Fixed

- Body-contract trigger runs as definer: authenticated inserts with a body no longer fail validation with a permission error.

---

## [v0.6.5] — Audit Findings (Minor)

Clears the minor backlog from the technical audit. No migration required.

### Added

- Read pages record views on client-side navigation with a session helper that survives insecure contexts and locked storage.
- Generator session shows loading and error states and redirects direct visits back to the configurator.
- ContentBody fallbacks for h4-h6 headings, images, math labels, unknown blocks, and newer schema versions.

### Fixed

- Read-page bookmark toggles persist through the shared service instead of local-only state.
- Collection-card bookmark buttons sit outside the card link (valid HTML, keyboard safe).
- Single malformed question rows are skipped instead of emptying the quiz; view-count failures degrade to zero.
- Home calendar uses real month math with full-date schedule dots, surfaces schedule load errors, and wires the pager and see-all links.
- Quiz anonymous notice follows auth changes.

### Removed

- Orphaned mock modules (`mocks/learning.ts`, `mocks/articles.ts`, `mocks/practice.ts`) and dead symbols in `mocks/home.ts`.

---

## [v0.6.4] — Pending Decisions

Resolves the open product questions. Requires migration `0011_author_survival_and_profile_display.sql` on the live database.

### Added

- `profiles.bio` and `profiles.created_at`; the profile header shows the bio (role label fallback) and the join month.
- `.env.example` lists the required public keys.

### Fixed

- `content.author_id` is nullable with `ON DELETE SET NULL`: deleting an account preserves its content.

---

## [v0.6.3] — Security Patch A

Fixes the critical findings of the technical audit. Requires migrations `0009_quiz_grading_rpc.sql` and `0010_practice_question_counts_rpc.sql` on the live database.

### Added

- `grade_answer` RPC (migration `0009`): grades one answered question server-side and reveals only that question's key. Quiz sessions grade through it; bulk answer-key reads are revoked.
- `get_practice_question_counts` RPC (migration `0010`): practice package counts without table-level `questions` reads, keeping the key lockdown intact.
- `/dev` routes render only in development builds; production requests return 404.

### Fixed

- Bookmark queries scope every read and delete to the signed-in user's own rows instead of relying on RLS alone.
- Question fetches select public fields only; answer keys no longer ship with the question list.

---

## [v0.6.2] — Stage 6: Phase 5 (Home)

Home cards and greeting run on real data. Banners, statistics, posters, and the calendar remain static.

### Added

- Home loader fetches the three newest verified learning materials and practice packages alongside schedules; the "Materi Fresh" and "Paket Latihan Soal" cards render live titles and subject names.
- Home greeting reads the signed-in account's name from `profiles` (falls back to "Pejuang" for visitors).

---

## [v0.6.1] — Stage 6: Phase 4 (Profil, Bookmark, RLS)

Profile identity, bookmarks, and the anonymous-session notice run on real data.

### Added

- `src/lib/services/bookmarks.ts` — reads the signed-in user's bookmarked content ids and toggles rows (insert/delete). Wired into Learning list/detail, Articles list/detail, and Practice list/detail: initial state comes from the database and the icon only changes when the write succeeds. Signed-out clicks change nothing and show the shared notice line.
- `src/lib/services/profile.ts` and a data-driven profile page — name and role from `profiles`, the three contribution tabs from `content` where `author_id = auth.uid()`, with real `status`. Signed-out visitors see "Pengunjung" with empty lists.
- Sign-in prompts for anonymous users: the shared `PracticeQuizSession` finished screen shows "Hasil tidak tersimpan. Masuk untuk menyimpan skor latihan." and a signed-out bookmark click shows "Bookmark belum tersimpan. Masuk untuk menyimpannya." Both render through the new `src/lib/components/AuthNotice.svelte`, visible only to signed-out users.

---

## [v0.6.0] — Stage 6: Backend Integration (Phases 0-3)

Replace mock data with Supabase without changing the UI.

### Added

- Phase 1 — `src/lib/services/subjects.ts`, `src/lib/services/schedules.ts`, and `supabase/seed/public_data.sql` (7 subjects + schedules). `announcements` deliberately skipped (no UI consumer). Subject/schedule colors are frontend constants (`src/lib/constants/publicData.ts`), not database columns.
- Phase 2 — `src/lib/services/learning.ts`, `src/lib/services/articles.ts` (strict UUID validation), `src/lib/components/ContentBody.svelte` for rendering version-controlled JSONB bodies, view tracking integration (`content_view_events` + the two read-only aggregate RPCs), and migrations `0005` through `0008` (content contract, JSONB validator fix, learning/article view-count RPCs).
- Phase 3 — `src/lib/services/practice.ts`, `questions.ts`, `attempts.ts` (+ unit tests). Practice packages and questions now read from `content`/`questions`; quiz completion writes to `attempts` for both curated packages and the Quiz Generator. `PracticeQuizSession` gained an optional `onComplete` callback.
- Quiz Generator reads the question pool directly (`getPracticeQuestions` with subject/topic/difficulty filters over published practice content) instead of finding one matching package first. Topic options are now derived from live question rows (`getPracticeTopics`), with "Semua Topik" meaning no topic filter. This replaces the hardcoded mock topic list.

### Changed

- `src/routes/practice/*` loaders now fetch from Supabase; mock imports removed from the module.
- `types/practice.ts`: `PracticePackage.id` widened to `number | string` during migration.
- `vitest.config.ts`: `$lib` and `$env/static/public` aliases added so service tests can run in Node.
- `Docs/SCHEMA.md` and `src/lib/types/database.types.ts` reformatted with Prettier (pre-existing formatting debt, committed separately as `chore`).

### Fixed

- Unauthenticated quiz sessions are not saved; the user is now told on the result screen (see v0.6.1).

---

## [v0.5.0] — Stage 5: Supabase Implementation

### Added

- Supabase project provisioned; schema (`0001`), auth trigger (`0002`), RLS policies (`0003`), and Storage bucket (`0004`) migrations applied to the live project.
- Email/password authentication via Supabase Auth.
- `handle_new_user()` trigger auto-creates a `profiles` row on signup.
- Row Level Security enabled on all 11 tables. Ownership-scoped read/write policies per `Docs/SCHEMA.md`; verifiers/admins may change `content.status` to `diverifikasi`, authors may not self-publish.
- `prevent_role_self_escalation` trigger — blocks any user from changing their own `role`, including admins editing their own row (role changes require a different admin's action).
- `content-covers` Storage bucket: public read, 2MB/image-only limit, folder-scoped write access (`{auth.uid()}/...`).
- Isolated dev-only verification routes: `/dev/auth-test`, `/dev/rls-test`, `/dev/storage-test` (not linked in navigation).

---

## [v0.4.0] — Stage 4: Database Design

### Added

- `Docs/SCHEMA.md` — full database schema documentation: ten entities, field definitions, design rationale, and explicitly excluded scope.
- `arcivis-erd.html` — entity-relationship diagram (interactive, zoomable, self-contained).
- Ten entities: `profiles`, `content`, `content_resources`, `subjects`, `tags`, `content_tags`, `bookmarks`, `questions`, `attempts`, `announcements`, `schedules`.
- Learning, Articles, and Practice share a single unified `content` table (distinguished by a `type` field); `content.type` is free text, not a database enum.
- `content.subject_id` is nullable to support content without a defined school subject (classified via `tags` instead).
- `questions.difficulty` and `questions.topic` included at this stage, since the Quiz Generator UI already filters on both.
- Aggregate statistics (session count, accuracy, questions completed) are computed from `attempts` at query time, not stored as running totals.

---

## [v0.3.0] — Stage 3: Frontend Refactoring

### Added

- `FilterBar.svelte` — shared component for search input, filter pills, sort dropdown, and active filter bar. Used by Learning/Articles/Practice.
- `EmptyState.svelte` — shared component for empty states (icon + title + description + optional reset button). Used by Learning/Articles/Practice.
- Testing foundation: Vitest + `@testing-library/svelte` + Playwright.
  - Unit tests: `FilterBar.test.ts` (5 tests), `EmptyState.test.ts` (4 tests) — 9/9 passing.
  - E2E smoke tests: `tests/smoke.spec.ts` (5 tests) — verifies core pages load.
- Bookmark toggle added to Articles and Practice cards (previously Learning only).
- `isBookmark` field added to `PracticePackage` type and mock data.
- Accessibility attributes (`aria-label`, `role`, `aria-expanded`/`aria-selected`/`aria-pressed`) added to `FilterBar`, `EmptyState`, and collection cards.

### Changed

- Card alignment: icon container unified across Learning/Articles/Practice (size, border-radius, padding). Practice card icon uses `subject.color` instead of a hardcoded background.
- "Detail →" standardized to hover-only reveal across all three collection pages.
- Detail page badge styling unified (solid background, no border) across Learning/Articles/Practice.
- Practice card: difficulty and "Terverifikasi" badges removed from rendering (fields retained in data for Stage 7).
- Practice Detail: difficulty badge removed. Subject badge uses `subject.color` instead of an outline style.
- Learning Detail: CTA changed from "Baca" to "Pelajari".
- Learning/Articles Detail: "Views" and "Update Terakhir" metadata removed.

### Removed

- Dead mock fields: `durasi`, `iconWarna` (Learning); `duration`, `group` (Practice).
- Dead types: `QuestionsByPackage`, `PracticePackageGroup` (`types/practice.ts`).
- Dead route helper functions (six total, `constants/routes.ts`).

### Fixed

- `Subject.iconName`/`Subject.color` restored; both are actively used for the subject icon row on `/practice`.
- `subjects` mock array repopulated; the Quiz Generator requires `subjects[0].name`.

---

## [v0.2.0] — Stage 2: Frontend Foundation

Core pages built with mock data: Home, Learning, Articles, Practice, Statistics, Settings, Profile.

---

## [v0.1.0] — Stage 1: Foundation

Vision, Mission, Core Philosophy, Domain Model, Content Model, User Roles, Publication Workflow, Initial UI Direction.
