# Lab Soal Community App — Design

Date: 2026-10-28. Status: owner approved.

## Intent and why

The Lab Soal tab is the right home for community Q&A, but today it holds
only the quiz generator card with a lot of empty space. The owner wants a
Brainly-like space (ask, answer, discuss) plus a minimal text editor for
creating questions, articles, and materials — developed separately from
the main reading app, under one login, against one database, without
raising Supabase cost.

## Goals

- Lab Soal tab becomes a two-level page: a compacted generator banner on
  top, a community question feed below (All / Needs Answers / Answered),
  a sticky "Tanya Soal" entry point.
- Question threads carry two badges: "Jawaban Terpilih" (asker's pick,
  nicety) and "Terverifikasi" (curator stamp: clear question, no logic
  flaws, correct answer — the only tier curators may pick up into
  official packages).
- A minimal editor (Tiptap, already in use) for questions, articles, and
  materials, with PDF export via browser print + dedicated print CSS
  (no PDF library in phase 1).
- Separate repo and development ("community app", SvelteKit like the main
  app — no Go): same Supabase project, one login, shared tables
  (`question_bank`, `comments`, `reports`), single billing (Supabase bills
  per project, not per repo).

## Non-goals / anti-goals

- No adoption of external Q&A platforms (Apache Answer, Scoold, Codidact):
  all are separate stacks with separate auth/databases, which breaks the
  one-login requirement and strands community questions outside the
  package pipeline.
- No third repo for the editor: the ask form needs rich input anyway, so
  the editor lives inside the community app.
- No one-click binary PDF in phase 1; no reputation/points system yet.
- Failure = users logging in twice, or community questions that cannot
  flow into official packages.

## Constraints

- Schema migrations live ONLY in the main repo. The community app never
  creates tables.
- Authorship rules stand (D-025): every post tied to an account, no
  anonymous writes; profiles expose display names only (via
  `get_author_names` RPC, "Penulis anonim" fallback).
- Answer keys never leave the server (D-026).
- Supabase free-tier budget: same project, same quotas, no extra cost.
- New repos follow the main app's conventions: `feat:` commits, one
  change per commit, English docs, Indonesian UI copy.

## Approaches

- **A. Separate repo, shared Supabase (picked).** Independent dev and
  deploys, one login, one bill. Risk: schema drift — tamed by the
  migrations-only-in-main rule plus a short written contract.
- B. Monorepo, two apps. Kills drift but needs monorepo tooling;
  rejected because the owner wants separate repos.
- C. Stay in one app. Simplest but rejected: against the owner's call
  and fattens the reading app.

## Decided (owner calls)

- Feed carries both unanswered (help requests) and answered (study
  collection) threads; filter chips mirror the Paket tab pattern.
- Badge hierarchy: Terverifikasi on top, Terpilih below.
- One community repo holds both Q&A and editor.
- PDF via browser print model.
- SvelteKit for the new repo (no Go: CRUD + RLS workload, Postgres does
  the heavy lifting; a second runtime only adds hosting cost).
- Tab stays a tab for now; sidebar later if the menu grows.
- Approach A.

## Left to the builder

- Feed card layout, filter row composition, thread page shape.
- Curator verification flow UI (stamp action, reuse of `/review` queue).
- Print CSS scope (which chrome to hide, page breaks for math).
- The one-paragraph two-repo contract doc.
