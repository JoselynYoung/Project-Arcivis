# Changelog — Arcivis

Semua perubahan signifikan pada Arcivis didokumentasikan di file ini. Format mengikuti [Keep a Changelog](https://keepachangelog.com/).

---

## [v0.3.0] — Stage 3: Frontend Refactoring — 2026-09-08

### Added

- `FilterBar.svelte` — komponen shared untuk search input, filter pills, sort dropdown, dan active filter bar. Dipakai Learning/Articles/Practice.
- `EmptyState.svelte` — komponen shared untuk empty state (icon + title + description + optional reset button). Dipakai Learning/Articles/Practice.
- Testing foundation: Vitest + `@testing-library/svelte` + Playwright.
  - Unit tests: `FilterBar.test.ts` (5 tests), `EmptyState.test.ts` (4 tests) — 9/9 pass.
  - E2E smoke tests: `tests/smoke.spec.ts` (5 tests) — verifikasi halaman utama bisa diakses.
- Bookmark toggle di Articles card & Practice card (sebelumnya cuma Learning yang punya).
- `isBookmark` field ditambahkan ke `PracticePackage` type dan mock data (3 contoh `true`).
- `aria-label`, `role`, `aria-expanded`/`aria-selected`/`aria-pressed` ditambahkan ke FilterBar, EmptyState, dan collection cards untuk aksesibilitas.

### Changed

- Card alignment: icon container disamakan di 3 modul (Learning/Articles/Practice) — ukuran `h-28 sm:h-32`, `rounded-lg`, padding konsisten. Practice card icon menggunakan `subject.color` alih-alih hardcoded `bg-primary-50`.
- "Detail →" distandarkan ke hover-only (`opacity-0 group-hover:opacity-100`) di ketiga collection page.
- Detail page badge style disamakan: solid background tanpa border (`rounded-full px-3 py-1 text-xs font-semibold {color}`) di Learning/Articles/Practice.
- Practice card: difficulty badge & "Terverifikasi" badge dihapus dari rendering (field data tetap ada untuk Stage 7).
- Practice Detail: difficulty badge "Sulit"/"Mudah"/"Sedang" dihapus. Subject badge menggunakan `subject.color` alih-alih outline style.
- Learning Detail: CTA "Baca" diubah menjadi "Pelajari".
- Learning/Articles Detail: metadata "Views" dan "Update Terakhir" dihapus dari metadata bar.

### Removed

- Dead mock fields: `durasi` dan `iconWarna` dari Learning; `duration` dan `group` dari Practice.
- Dead types: `QuestionsByPackage`, `PracticePackageGroup` dari `types/practice.ts`.
- Dead route helper functions: 6 fungsi (`getPracticeDetailRoute`, `getPracticeQuizRoute`, `getLearningDetailRoute`, `getLearningReadRoute`, `getArticleDetailRoute`, `getArticleReadRoute`) dari `constants/routes.ts`.

### Fixed

- Regresi: `Subject.iconName` dan `Subject.color` sempat salah dihapus sebagai "dead field" dalam audit awal — field itu dipakai aktif untuk icon-warna per mapel di `/practice`. Sudah di-restore ke type definition dan mock data, diverifikasi visual.
- Regresi: `subjects` array di `mocks/practice.ts` sempat dikosongkan, menyebabkan Quiz Generator crash (`subjects[0].name` undefined). Sudah diisi ulang dengan 7 mapel.

---

## [v0.2.0] — Stage 2: Frontend Foundation — 2026-08-xx

_Stage 2 mencakup pembangunan semua halaman utama dengan mock data. Detail perubahan per modul tidak didokumentasikan di changelog ini karena dilakukan secara bertahap selama masa pengembangan awal._

---

## [v0.1.0] — Stage 1: Foundation — 2026-xx-xx

_Vision, Mission, Core Philosophy, Domain Model, Content Model, User Roles, Publication Workflow, Initial UI Direction._
