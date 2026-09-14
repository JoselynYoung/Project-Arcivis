# Changelog

All notable changes to Arcivis are documented in this file. Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [v0.5.0] — Stage 5: Supabase Implementation

### Added

- Supabase project provisioned; schema (`0001`), auth trigger (`0002`), RLS policies (`0003`), and Storage bucket (`0004`) migrations applied and verified against the live project.
- Email/password authentication via Supabase Auth.
- `handle_new_user()` trigger auto-creates a `profiles` row on signup.
- Row Level Security enabled on all 11 tables. Ownership-scoped read/write policies per `SCHEMA.md`; verifiers/admins may change `content.status` to `diverifikasi`, authors may not self-publish.
- `prevent_role_self_escalation` trigger — blocks any user from changing their own `role`, including admins editing their own row (role changes require a different admin's action).
- `content-covers` Storage bucket: public read, 2MB/image-only limit, folder-scoped write access (`{auth.uid()}/...`).
- Isolated dev-only verification routes: `/dev/auth-test`, `/dev/rls-test`, `/dev/storage-test` (not linked in navigation; retained for now as working references, not yet scheduled for removal).

### Verified

- Auth flow end-to-end (signup, profile creation, login, logout) against the live database.
- RLS active on all tables (`relrowsecurity = true`, confirmed via direct query, not application-level inference).
- Storage upload/public-read/delete cycle, including confirmation via the Supabase dashboard that deleted files are actually removed (not just app-reported).

### Known gaps

- Cross-user RLS isolation for `bookmarks`/`attempts` verified by policy design, not by live two-account fixture testing.
- No existing page (Home/Learning/Articles/Practice/etc.) is yet connected to Supabase — all still read mock data. That's Stage 6.

---

## [v0.4.0] — Stage 4: Database Design

### Added

- `SCHEMA.md` — full database schema documentation: ten entities, field definitions, design rationale, and explicitly excluded scope.
- `arcivis-erd.html` — entity-relationship diagram (interactive, zoomable, self-contained).
- Ten approved entities: `profiles`, `content`, `content_resources`, `subjects`, `tags`, `content_tags`, `bookmarks`, `questions`, `attempts`, `announcements`, `schedules`.

### Design Decisions

- Learning, Articles, and Practice are represented by a single unified `content` table (distinguished by a `type` field), rather than one table per content type — consistent with the platform's single-content-model philosophy.
- `content.type` stored as free text, not a database enum, to allow new content categories without a migration.
- `content.subject_id` is nullable, to support content without a defined school subject (classified via `tags` instead).
- `questions.difficulty` and `questions.topic` included at this stage (not deferred), since the Quiz Generator UI already requires filtering on both.
- Aggregate statistics (session count, accuracy, questions completed) are computed from `attempts` at query time, not stored as separate running totals.

### Deferred

- `collections` / `collection_items` — thematic homepage curation (e.g. future brand collaborations). No corresponding UI exists yet.
- `organizations` — partner metadata for collaborative content. No management UI exists.
- `comments`, `reviews`, `verifications`, `reports` — Community Features (Stage 7). No corresponding UI elements exist yet; `content.status` already carries the draft/review/verification state needed for the Profile contribution tab.
- `material` as a distinct entity — functionally redundant with `content_resources`.

### Process note

An intermediate draft of the entity list omitted `announcements`/`schedules` despite both already backing live UI on the Home page (Jadwal Penting section). Caught during pre-approval review and restored before the schema was finalized.

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

- `Subject.iconName`/`Subject.color` were incorrectly removed as "dead fields" during an early audit pass — these fields are actively used for the subject icon row on `/practice`. Restored and visually verified.
- `subjects` mock array was briefly left empty as a side effect of the above, causing the Quiz Generator to fail (`subjects[0].name` undefined). Repopulated with the seven subjects.

---

## [v0.2.0] — Stage 2: Frontend Foundation

Core pages built with mock data: Home, Learning, Articles, Practice, Statistics, Settings, Profile. Detailed per-module changes were not tracked in this changelog, as this stage was completed incrementally over the early development period.

---

## [v0.1.0] — Stage 1: Foundation

Vision, Mission, Core Philosophy, Domain Model, Content Model, User Roles, Publication Workflow, Initial UI Direction.
