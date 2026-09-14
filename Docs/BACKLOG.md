# Backlog — Not in Active Roadmap

Ideas discussed and roughly scoped, but deliberately not scheduled into any current Stage. No timeline, no commitment. Revisit when Stage 7 (Community Features) actually starts, or sooner if it becomes relevant.

## Learning — Multi-format resource
- PDF/book, infographic, mindmap (check: static image vs interactive — different structural needs), cheatsheet, video, audio/podcast.
- No new entity needed — all covered via `content_resources.resource_type` (free text).

## Practice — Future Adaptive / Customizable Experience
- One primary practice CTA: **Kerjakan**.
- Future practice customization may include:
  - stopwatch on/off;
  - learning/reading mode vs. practice mode;
  - show/hide explanations, comments, and notes;
  - accessibility customization such as font size, color/background choices, and dyslexia-friendly font.
- Timer/benchmark modes are optional customization, not mandatory per-question timeouts:
  - total package/page timer;
  - per-question benchmark timer that resets when moving to the next question;
  - fixed official-style time allocation.
- Do not imply that any of this is being implemented now.

## Practice — Future Question Bank
- Record the agreed architectural direction:
  - The current Stage 5 schema remains **CONTENT → QUESTIONS**.
  - Future Community/Question Bank work may allow one question to be reused across multiple practice packages through a join table.
  - Do NOT turn questions into a full standalone CONTENT entity unless a future approved design explicitly requires it.
  - Do NOT modify SCHEMA.md as part of this documentation task.

## Article — Reading ecosystem
- Curated external sources (NASA, NatGeo, BBC, etc. — link/reference only, not scraping).
- Community writing (already covered by the standard Content workflow).

## Community & Contribution model (the big one — needs real design work before touching schema)
- **Problem**: current model assumes one author builds one complete package (`content` → `questions`), then publishes. Doesn't fit atomic contribution (one contributor submits one question, usable immediately, without belonging to any package yet).
- **Direction agreed**: Question Bank — questions reusable across multiple packages via a join table (`question_id` ↔ `package_id`), not `Question` becoming its own standalone Content entity with its own workflow. Keeps future migration light.
- Two tiers, coexisting (not competing): Community content (usable as soon as it passes basic validation — "rolling release") vs. Verified/Official package (curated, recommended — "stable release").
- Flow: Upload (draft) → basic validation → Community Content (public, usable) → curator selects → Official Package.
- **Role vs. content status — kept separate**: Roles (Guest, Member, Contributor, Reviewer, Verifier, Admin) can stack on one person (e.g. a trusted teacher = Contributor + Reviewer). Content status stays a fixed linear flow: `draft → direview → diverifikasi → published`. Reviewer ≠ Verifier: Reviewer judges content quality ("is this correct and well-made"), Verifier judges publication trust ("does the source/author meet Arcivis's standard"). This distinction is core to Arcivis's sanad/isnad philosophy — do not collapse it into one step.
- Admin/Reviewer/Verifier dashboards (`/review-dashboard`, `/verification-panel`, etc.) — not MVP, database can be role-ready without the UI existing yet.
- Open questions, unresolved on purpose: does small-scale contribution need a new entity (`suggestion`/`revision`), or can it reuse the existing content workflow? Does Community content show publicly immediately or after minimal review? Is a contributor reputation system needed? How does a curator select which community questions make it into an official package?

## Community — Atomic Contribution
- Clarify the future model:
  - Community contributors may eventually submit atomic contributions, such as individual questions, without first constructing a complete official package.
  - Such contributions may become usable community content after the appropriate validation.
  - Curators may later select community items for inclusion in verified/official packages.
- Preserve the existing distinction between:
  - community/rolling content;
  - verified/official/stable content.
- Keep Reviewer and Verifier distinct.
  - Reviewer: evaluates quality/correctness.
  - Verifier: evaluates trust/source/publication eligibility.
- Do not create role tables, dashboards, revision tables, or Community schema in this documentation task.

## Collections / Thematic Curation
- If not already sufficiently captured, record that future `collections` / `collection_items` may provide a thematic curation/presentation layer across Learning, Articles, and Practice.
- Examples may include future collaborations or themed collections.
- Do not schedule this into Stage 6.

## Content Authoring Tool
- Preserve the existing direction:
  - Future dedicated authoring/editor application.
  - Separate codebase to avoid loading heavy editor/export dependencies for ordinary Arcivis visitors.
  - Shares Arcivis Supabase backend/auth.
  - Publishing writes directly into the shared `content`/`questions` tables rather than requiring manual export-then-upload.
  - Exact supported content types remain undecided.
- Do not expand the scope beyond what is already recorded.

## Content Authoring Tool (new idea, not previously scoped)
- A dedicated writing/editor tool — rich text (bold, etc.), math formula support, export to plain PDF, DOCX, and LaTeX-rendered PDF. Originally conceived to avoid manually formatting Word templates for practice questions.
- **Architecture direction agreed**: semi-separate. Built and maintained as its own codebase/app (so its heavier editor/export dependencies never load for regular Arcivis visitors who are just reading), but shares the same Supabase backend/auth — a user logs in once with their Arcivis account, and publishing from the tool writes directly into the same `content`/`questions` tables. Not a fully standalone tool requiring manual export-then-upload.
- Scope (which content types it covers — Practice only vs. also Article/Learning) not yet decided; the shared-backend approach means adding more content types later doesn't require rebuilding the pipeline, just the type-specific form.