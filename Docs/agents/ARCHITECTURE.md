# Arcivis Project Architecture

This document defines Arcivis's folder architecture, code conventions, and project structure for developers and AI coding assistants. For stage and roadmap status, see `Docs/ROADMAP.md`; this document is strictly a technical reference.

---

## 1. Technology Stack

- **Framework**: SvelteKit 2 with **Svelte 5** (Runes).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`).
- **Icons**: `@lucide/svelte`, not the deprecated `lucide-svelte` package.
- **Path alias**: `$lib` → `./src/lib`.

## 2. Directory Structure (official; do not deviate without approval)

```text
src/
├── app.d.ts
├── app.html
├── lib/
│   ├── components/       # Reusable UI. Currently: PracticeQuizSession.svelte
│   ├── constants/        # routes.ts, navigation.ts
│   ├── mocks/            # Mock data: home.ts, practice.ts, learning.ts, articles.ts
│   ├── types/            # practice.ts (Learning/Article types remain inline in their mocks)
│   ├── icons/
│   ├── utils/            # Helpers and shared cross-page state (quizGeneratorState.svelte.ts)
│   └── services/         # Supabase services introduced in Stage 5
└── routes/
    ├── +layout.svelte    # Sidebar and mobile navigation
    ├── layout.css        # Tailwind v4 import and @theme color palette
    ├── +page.svelte      # Home ('/')
    ├── articles/
    │   ├── +page.svelte
    │   └── [id]/
    │       ├── +page.svelte
    │       └── read/+page.svelte
    ├── learning/
    │   ├── +page.svelte
    │   └── [id]/
    │       ├── +page.svelte
    │       └── read/+page.svelte
    ├── practice/
    │   ├── +page.svelte           # Collection: curated packages and Quiz Generator card
    │   ├── [id]/
    │   │   ├── +page.svelte       # Package detail (Content)
    │   │   └── quiz/+page.svelte  # Quiz session (curated package)
    │   └── quiz-generator/
    │       ├── +page.svelte       # Setup (Interaction Tool, not Content)
    │       └── session/+page.svelte
    ├── profile/+page.svelte       # Includes the contribution-history tab ("Community" function)
    ├── settings/+page.svelte
    └── statistics/+page.svelte
```

There is no `stores/`, `features/`, `repositories/`, `hooks/`, or `assets/`; these belong to the retired structure. `library/` does not exist and is out of scope because its function is covered by Articles and Learning.

## 3. Routing Conventions

Pattern: `/{module}` (collection) → `/{module}/[id]` (detail) → `/{module}/[id]/{action}` (action). Example: `/learning/[id]/read`.

**Practice contains two different flows under one module:**

- `PracticePackage` = Content and follows the full pattern: `/practice` → `/practice/[id]` (detail, "Mulai Kerjakan" button) → `/practice/[id]/quiz`.
- **Quiz Generator** = an Interaction Tool, not Content: `/practice/quiz-generator` (setup) → `/practice/quiz-generator/session`. Do not force it into the collection → detail → action pattern.

Dynamic segments are always lowercase (`[id]`).

**`resolve()` is required** for all internal navigation (from `$app/paths`):

- Raw string `href`/`goto()` fails lint (`svelte/no-navigation-without-resolve`).
- `resolve()` requires a literal route pattern plus a `params` object, not a string produced by `$derived`. For dynamic links, use `resolve('/practice/[id]', { id: String(pkg.id) })` inline in the template.

**Shared quiz engine**: `src/lib/components/PracticeQuizSession.svelte` (props: `questions`, `title`, `backRoute`, `backParams`), used by `/practice/[id]/quiz` and the generator session. This is one engine for one interaction type, not a cross-module UI abstraction deferred to Stage 3.

## 4. Data and State

- `constants/routes.ts`: `ROUTES` object (lowercase keys) plus per-module helper functions (`getLearningDetailRoute`, and so on).
- `constants/navigation.ts`: sidebar menu structure (label, icon, route).
- `types/practice.ts`: Practice interfaces (questions, quizzes, results, and `PracticePackage` with `subject`/`difficulty`/`topics[]`/`author`/`isVerified`).
- Quiz Generator config: `utils/quizGeneratorState.svelte.ts` uses module-level `$state`, passed from page to page rather than URL query parameters to avoid `resolve()` literal-pattern constraints.
- If Contribution UI is built: persist to `localStorage['arcivis:contributions']`. This is an intentional exception for that feature only, not a general pattern.

## 5. AI Collaboration Conventions

1. **New pages**: add a folder at `src/routes/<feature>/` with `+page.svelte`, then register it in `constants/routes.ts` and `constants/navigation.ts`.
2. **Reusable components**: place them in `src/lib/components/` and import them through `$lib/components/...`. First determine whether the component is one engine reused repeatedly (allowed) or a similar UI pattern across modules (defer to Stage 3); see Hard Rule #2 in `Docs/ROADMAP.md`.
3. **Svelte 5 Runes** are required: `$state`, `$derived`, `$props`, and `$effect`. Do not use `export let` or `$:`.
4. **Styling**: use Tailwind utility classes. Avoid inline `style` for anything expressible with Tailwind. Passing a Tailwind class string into `style="background-color: ..."` is invalid CSS and has caused a real rendering bug.
5. **Icons**: use `@lucide/svelte` and import icons individually.

For the design system (colors, typography, and component patterns), see `Docs/agents/DESIGN_GUIDELINES.md`. For stages, roadmap, and hard rules, see `Docs/ROADMAP.md`.
