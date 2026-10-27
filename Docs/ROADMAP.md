# ROADMAP.md — Arcivis

This document is the authoritative reference for Arcivis's development stages. **Any AI (coding assistant, agent, or otherwise) working in this repository must read this file before starting any task**, particularly before modifying folder structure, routing, or adding new features.

If an instruction from the project owner appears to conflict with the sequence below, **ask before executing** — do not assume the order may be skipped without explicit confirmation.

---

## Approach: UI-First

**Product → Pages → Reusable Components → Refactoring → Database → Supabase → Backend Integration → Community → Optimization**

Philosophy: build and validate the UI with mock data across all modules first, then design the database based on a stable UI shape — not the other way around.

---

## Stage 1 — Foundation ✅ Complete

Vision, Mission, Core Philosophy, Domain Model, Content Model, User Roles, Publication Workflow, Initial UI Direction.

## Stage 2 — Frontend Foundation ✅ Complete

**Goal**: build all core pages with mock data. No authentication, database, Supabase queries, or API integration of any kind at this stage.

**Module progress:**

| Module     | Status                                                                                                                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home       | ✅ Complete                                                                                                                                                                                                                        |
| Learning   | ✅ Complete (Collection → Detail → Read)                                                                                                                                                                                           |
| Articles   | ✅ Complete (Collection → Detail → Read)                                                                                                                                                                                           |
| Practice   | ✅ Complete (Collection→Detail→Action migration done; Quiz Generator as a separate tool done; `PracticeQuizSession` as a shared engine finalized)                                                                                  |
| Statistics | ✅ Present (static)                                                                                                                                                                                                                |
| Settings   | ✅ Present (dark mode toggle intentionally cosmetic, not functional)                                                                                                                                                               |
| Profile    | ✅ Present                                                                                                                                                                                                                         |
| Library    | ❌ **Out of scope** — its function is already covered by Article/Learning; no separate module needed                                                                                                                               |
| Community  | ✅ Complete — not a standalone page/module; it is the contribution-history tab (Bacaan/Latihan/Materi) inside **Profile**, passive in function (self-tracking, similar to an activity log), optional and not a platform foundation |

Library was never in scope; Community is complete as part of Profile.

### Key domain clarification for Stage 2

All content (Learning, Articles, Practice Package) is a representation of a single **Content** model, following the pattern:

```
Collection → Detail → Action
```

**Except the Quiz Generator** — this is NOT Content, it is a separate Interaction Tool. Its flow is `Practice → Quiz Generator (setup) → Quiz Session`, not Collection→Detail→Action. Do not force the Card→Detail pattern onto the Quiz Generator.

## Stage 3 — Frontend Refactoring ✅ Complete (v0.3.0)

Carried out after all Stage 2 modules were complete.

**Result:**

- **Reusable components**: `FilterBar.svelte` (search/filter/sort/active filter bar) and `EmptyState.svelte` (icon + title + description + reset), used by Learning/Articles/Practice. `ContentCard` was not built: the three modules' data shapes differ (final).
- **Mock data cleanup**: dead fields/types removed — `durasi`, `iconWarna` (Learning); `duration`, `group` (Practice); `QuestionsByPackage`, `PracticePackageGroup` (types/practice.ts); six dead route helper functions (constants/routes.ts).
- `Subject.iconName`/`Subject.color`: removed in an early audit, then restored — actively used for the subject icon row on `/practice`.
- **Accessibility**: `aria-label`, `role`, `aria-expanded`/`aria-selected`/`aria-pressed` added to `FilterBar`, `EmptyState`, and collection cards (Learning/Articles/Practice).
- **Testing foundation**: Vitest + `@testing-library/svelte` (unit tests for `FilterBar` and `EmptyState`, 9/9 passing) + Playwright (`tests/smoke.spec.ts`, 5/5 passing).
- **Card & Detail alignment**: icon container unified across the three modules (size, border-radius, padding); bookmark toggle added consistently to Learning/Articles/Practice; "Detail →" standardized to hover-only; difficulty and verified badges removed from the Practice card; the difficulty badge removed from the Practice Detail page; subject/category badge styling unified (solid background, no border) across all Detail pages.

**Do not extract reusable components before Stage 3 has begun** — abstractions built too early, from only two or three examples, risk being dismantled once another module needs a different shape.

## Stage 4 — Database Design ✅ Complete (v0.4.0)

ERD, schema, relationships, and constraints. Carried out only after the UI was stable (Stage 2 and 3 complete).

**Result:**

- Full schema documented in `Docs/SCHEMA.md`; entity-relationship diagram in `arcivis-erd.html`.
- Ten entities approved: `profiles`, `content`, `content_resources`, `subjects`, `tags` + `content_tags`, `bookmarks`, `questions`, `attempts`, `announcements`, `schedules`.
- **Key decision**: a single unified `content` table represents Learning, Articles, and Practice, distinguished by a `type` field, consistent with the platform's one-content-model philosophy. Type-specific fields (e.g. question data) live in attached tables, not as extra nullable columns on `content`.
- `content.type` is stored as free text, not a database enum, so new content categories can be added without a migration.
- `content.subject_id` is nullable, to support content without a defined school subject (classified via `tags` instead).
- `questions.difficulty` and `questions.topic` are included now (not deferred), since the Quiz Generator UI already exists and filters on both.
- **Explicitly deferred, not part of this schema**: `collections`/`collection_items` (thematic curation for the homepage, e.g. future brand collaborations), `organizations` (partner metadata), and the Community-feature tables `comments`/`reviews`/`verifications`/`reports` — all deferred to Stage 7, as none currently have a corresponding UI. Rationale and revisit conditions are recorded in `Docs/SCHEMA.md` Section 5.

## Stage 5 — Supabase Implementation ✅ Complete (v0.5.0)

**Verified against the live Supabase project:**

- **Migration `0001_initial_schema.sql`** — 11 tables, verified live via `pg_class.relrowsecurity` query and Table Editor.
- **Migration `0002_profile_on_signup.sql`** — `handle_new_user()` trigger, verified end-to-end via `/dev/auth-test` (signup → matching `profiles` row with correct `auth.uid()`).
- **Migration `0003_rls_policies.sql`** — RLS enabled and policies applied on all 11 tables, including a trigger (`prevent_role_self_escalation`) blocking users from changing their own `role`. All 7 spot-checked tables show `relrowsecurity = true`. Cross-user data isolation (bookmarks/attempts) verified with two real accounts in Phase 4.
- **Migration `0004_storage_covers.sql`** — `content-covers` bucket (public read, 2MB limit, image types only), owner-scoped write via folder-based policy. Verified via `/dev/storage-test`: upload, public-URL render, delete (confirmed via the Storage dashboard), and anonymous-upload rejection. Deleted files may remain briefly reachable via their public URL due to Supabase's Smart CDN cache (up to ~60s propagation).

## Stage 6 — Backend Integration ✅ Complete (v0.6.5)

Replace mock data with Supabase. The UI must not change — only the data source.

- Phases 0-3: subjects, schedules, Learning, Articles, Practice, Quiz Generator, attempts, view counts.
- Phase 4: profile from `profiles` + contributions, bookmark persistence, anonymous-session notices.
- Phase 5: Home cards and greeting from live data (banners, statistics, posters, calendar stay static).
- Security patch A: bookmark queries scoped per user, server-side quiz grading (`grade_answer`), column-locked answer keys, `/dev` routes dev-only.
- Pending decisions: author survival (`SET NULL`), profile bio + join date, `.env.example`.
- Minor audit findings cleared.

## Stage 7 — Community Features ✅ Complete (v0.7.0, 2026-10-28)

**Goal:** let users participate, not just read — discuss, report, contribute, and get reviewed, with full history.

**Result:**

- Fase 1 — Komentar: `comments` table + RLS, `CommentSection` on all three detail page types, plain-text rendering, signed-in posting with anonymous notice.
- Fase 2 — Lapor konten: `reports` table + RLS, `ReportButton` with preset reasons on all three detail page types. Reports are intake-only; triage is manual until a moderation dashboard exists.
- Fase 3 — Kontribusi draft: `/contribute` page (article/learning, subject picker, plain paragraphs become Tiptap v1), drafts visible in the author's own profile.
- Fase 4 — Antrian review: `/review` queue for reviewer/verifier/admin with approve (→ `diverifikasi`) and send-back (→ `draft`); authors submit from their profile contributions.
- Fase 5 — Revisi: `revisions` snapshots on every content update (security-definer trigger), author edit flow (`/contribute/[id]`), expandable history viewer on detail pages.
- Fase 6 — Bank soal komunitas: separate `question_bank` pool with verified list (`/bank`) and member submission (subject, difficulty, options, key, explanation).
- Fase 7 — Aktivitas: `Aktivitas` tab on profiles showing the signed-in user's own comments and reports, newest first.

**Deferred to later (not part of v0.7.0):** wiring the question bank into the Quiz Generator as a pool source; a moderation dashboard for reports.

## Stage 8 — Enhancement (not started)

Notifications, recommendations, improved search, analytics, performance optimization, SEO, offline support. Plus the hardening backlog from the technical audit: author-account deletion without content loss, tighter RLS (profiles/tags/content_tags visibility), and server-side attempts validation.

---

## Hard Rules

These apply throughout the project unless a specific stage explicitly overrides one.

1. **No backend, Supabase, auth, or API of any kind — including ordinary state persistence** (bookmarks, dark mode, quiz results) **during Stages 2–4.** This restriction lifts starting Stage 5. The Contribution UI is built directly against the real database from Stage 5 onward, not mocked twice.
2. **Do not extract reusable components before Stage 3 has begun.**
   - **What this means**: do not extract a UI pattern that has only just started appearing similarly across two or three modules (e.g. cards, filter/search/sort in Learning vs. Articles vs. Practice) — its final shape isn't yet certain; wait for more examples.
   - **What this does NOT cover**: a single engine or logic unit reused by multiple entry points for the _same_ interaction — for example, `PracticeQuizSession.svelte`, used by both `/practice/[id]/quiz` and the Quiz Generator session, both of which run a quiz session, differing only in question source. This is not a cross-content-type abstraction; it is one engine for one kind of interaction (final).
3. **Do not touch files outside a task's stated scope.** If something outside scope seems fixable "while in there," stop and ask the project owner first — do not act on it. Out-of-scope changes have caused regressions that had to be reverted.
4. **Official folder structure** (see `AGENTS.md` for technical detail):
   ```
   src/lib/
   ├── components/
   ├── mocks/
   ├── types/
   ├── constants/
   ├── icons/
   ├── utils/
   └── services/
   ```
   No `stores/`, `features/`, `repositories/`, or `hooks/` — that is the old structure and has been replaced.
5. **Routing**: all routes are in English (`practice/`, `learning/`, `articles/`, `profile/`, `settings/`), following the pattern `/{module}` → `/{module}/[id]` → `/{module}/[id]/{action}`. (`library/` is not used — out of scope. The "community" feature lives as a tab inside `profile/`, not as its own route.)
6. **Mock data does not need to be complete or fully realistic** — only enough to validate the UI. Do not spend significant effort filling in data that will be discarded during migration to Supabase, unless the project owner explicitly requests it.
7. **Deliberate placeholders** (do not "fix" without being asked): the "Unduh PDF" button (`alert()`), the dark mode toggle (cosmetic only), the Community section placeholder (inside Practice).
8. **`AGENTS.md`** may contain technical detail and implementation gotchas, but must not unilaterally decide new roadmap or architecture direction — decisions at that level must trace back to project-owner-approved instructions, recorded in this file.
9. **Do not invent new stages or sub-stages** (e.g. "Stage 3.5," "Final Polish Phase") for small work items. Minor or cosmetic findings that surface after a stage has closed are recorded as a single backlog line, not treated as grounds for opening a new process or holding up the transition to the next stage. When in doubt whether something is blocking, the default is: **proceed**, record it, ask the project owner later.
10. **`Docs/SCHEMA.md`** is the authoritative source for database structure once Stage 4 begins. Schema changes must trace back to a project-owner-approved decision, recorded there — not introduced unilaterally during implementation.
11. **Documentation language**: all project documentation (`Docs/ROADMAP.md`, `Docs/agents/ARCHITECTURE.md`, `Docs/agents/DESIGN_GUIDELINES.md`, `AGENTS.md`, `Docs/SCHEMA.md`, `Docs/CHANGELOG.md`, code comments) is written in English. UI copy (labels, button text, mock data content) remains in Indonesian — this is a product decision, not a documentation one. Indonesian domain terms or literal data values quoted in documentation are not translated.

---

## Open Items (undecided — do not assume)

- Functional dark mode.
- Making the Home calendar dynamic.
- Cover image upload workflow for contributors (the `content.cover_image` field exists in the schema; the upload UI itself is not yet built).
- Final domain name.
- Cross-user RLS isolation (bookmarks, attempts) verified by policy design and code review, not by live fixture-data testing. Revisit if any data-leak symptom appears after Stage 6 goes live.

---

_This document must be updated whenever a new roadmap decision is approved by the project owner. Do not let it go stale — if a stage or module status changes, update it here, not only in conversation._
