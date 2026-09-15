<!-- antislop:start -->

## antislop

For UI, copy, people, mobile layout, or code comments work, load the antislop skill for the task:

- Core filter, always on: `antislop`
- UI / visual: `antislop-ui`
- Copy & text: `antislop-copywriting`
- People: `antislop-human`
- Mobile / responsive: `antislop-layoutmobile`
- Code comments: `antislop-code`

Before starting, ask the user when antislop applies: during the work, or after it is done.

<!-- antislop:end -->

## Start here

This repo has six reference documents under `Docs/` and `Docs/agents/`. Read the relevant ones before starting a task; do not rely on memory from a previous session:

- **`Docs/ROADMAP.md`** — current stage, what's in scope, what's deliberately deferred, and hard rules. Source of truth for roadmap and architecture decisions.
- **`Docs/agents/ARCHITECTURE.md`** — folder structure, tech stack, routing conventions, and `resolve()` gotchas.
- **`Docs/agents/DESIGN_GUIDELINES.md`** — color palette, typography, and component patterns.

- **`Docs/SCHEMA.md`** — approved database structure and design decisions.

- **`Docs/CHANGELOG.md`** — verified project history and known gaps.

- **`Docs/BACKLOG.md`** — unscheduled ideas. Do not implement backlog items unless the project owner explicitly requests them.

This file (`AGENTS.md`) doesn't repeat their content. It only covers things specific to working as an agent in this repo. If something here seems to contradict one of those reference documents, they win — flag the mismatch instead of picking one silently.

## Repo basics

SvelteKit 2 + Svelte 5 (runes mode) + TypeScript + Tailwind CSS v4. Mock-data only, no backend. Content language is Indonesian.

### Commands

- `npm run dev` — dev server
- `npm run check` — svelte-check (run before lint)
- `npm run lint` — `prettier --check` + eslint (all in one)
- `npm run build` — production build

Don't commit unless asked. Keep new files formatted (`npx prettier --write <file>`).

## Code style

- Comments: English, short title-case (`// Nav Config`, `<!-- Desktop Sidebar -->`), not narrative sentences.
- Variable/function names: currently mixed Indonesian/English on purpose — do not do a rename pass unless `Docs/ROADMAP.md` says Stage 3 renaming has started.
- Tailwind utility classes only — never pass a Tailwind class string into a `style="background-color: ..."` attribute; that's not valid CSS and has caused a real invisible-element bug before. Put it in `class` instead.

## Scope discipline

If a task turns up something outside its stated scope — a file that "could use a quick fix while I'm in here," a pattern that "should really be extracted now," anything backend-shaped — stop and ask before touching it. This repo has a history of small unplanned changes causing real regressions (a removed search bar, a silently rewritten routes file, and a `stores/` folder reappearing). If the task itself authorizes a documentation restructure, update references consistently without changing product or architecture decisions.

## Verification

`npm run check`/`lint`/`build` passing is necessary but not sufficient for UI/visual tasks — it can't catch a misaligned layout or an invisible element. When a task is visual, say so in the completion report and ask for a screenshot rather than treating a clean build as proof the UI is correct.

## Documentation

All project documentation (`Docs/ROADMAP.md`, `Docs/agents/ARCHITECTURE.md`, `Docs/agents/DESIGN_GUIDELINES.md`, `AGENTS.md`, `Docs/SCHEMA.md`, `Docs/CHANGELOG.md`, and code comments) is written in English, regardless of what language earlier versions used. Exceptions:

UI content/copy stays Indonesian (labels, button text, mock data strings) — that's a product decision, not a docs one.
Indonesian domain/proper terms are kept as-is when quoted (e.g. subject.name values like "Matematika", route labels, field names copied verbatim from data) — don't translate identifiers or data values, just the surrounding documentation prose.

If an existing document is still partly Indonesian, do not perform a full rewrite pass without authorization. When the project owner authorizes documentation language cleanup, translate the affected document while preserving technical terms, identifiers, and quoted Indonesian UI/data values.

Write documentation in English. Keep UI content and mock data in Indonesian as described above.
