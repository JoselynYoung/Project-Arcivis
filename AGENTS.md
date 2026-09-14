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

This repo has three other reference docs at the root — read the relevant one(s) before starting a task, don't rely on memory of a previous session:

- **`ROADMAP.md`** — current stage, what's in scope, what's deliberately deferred, hard rules. Source of truth for anything roadmap/architecture-decision shaped.
- **`ARCHITECTURE.md`** — folder structure, tech stack, routing conventions, `resolve()` gotchas.
- **`DESIGN_GUIDELINES.md`** — color palette, typography, component patterns.

This file (`AGENTS.md`) doesn't repeat their content. It only covers things specific to working as an agent in this repo. If something here seems to contradict one of those three, they win — flag the mismatch instead of picking one silently.

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
- Variable/function names: currently mixed Indonesian/English on purpose — don't do a rename pass unless `ROADMAP.md` says Stage 3 renaming has started.
- Tailwind utility classes only — never pass a Tailwind class string into a `style="background-color: ..."` attribute; that's not valid CSS and has caused a real invisible-element bug before. Put it in `class` instead.

## Scope discipline

If a task turns up something outside its stated scope — a file that "could use a quick fix while I'm in here," a pattern that "should really be extracted now," anything backend-shaped — stop and ask before touching it. This repo has a history of small unplanned changes causing real regressions (a removed search bar, a silently rewritten routes file, a `stores/` folder reappearing). Report it in the task summary instead of acting on it.

## Verification

`npm run check`/`lint`/`build` passing is necessary but not sufficient for UI/visual tasks — it can't catch a misaligned layout or an invisible element. When a task is visual, say so in the completion report and ask for a screenshot rather than treating a clean build as proof the UI is correct.

## Documentation

All project documentation (ROADMAP.md, ARCHITECTURE.md, DESIGN_GUIDELINES.md, AGENTS.md, CHANGELOG.md, code comments) is written in English, regardless of what language earlier versions used. Exceptions:

UI content/copy stays Indonesian (labels, button text, mock data strings) — that's a product decision, not a docs one.
Indonesian domain/proper terms are kept as-is when quoted (e.g. subject.name values like "Matematika", route labels, field names copied verbatim from data) — don't translate identifiers or data values, just the surrounding documentation prose.

If an existing doc is still partly Indonesian, don't do a full rewrite pass unprompted — translate opportunistically when you're already editing that section for another reason, and note it in the task report.

Write documentation in
