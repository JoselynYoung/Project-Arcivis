# Dokumentasi Arsitektur Proyek — Arcivis

Dokumen ini berisi panduan arsitektur folder, konvensi kode, dan struktur proyek Arcivis, untuk developer maupun AI coding assistant. Untuk status stage/roadmap, lihat `ROADMAP.md` di root repo — dokumen ini murni referensi teknis.

---

## 1. Stack Teknologi

- **Framework**: SvelteKit 2 dengan **Svelte 5** (Runes).
- **Bahasa**: TypeScript.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`).
- **Icons**: `@lucide/svelte` (bukan `lucide-svelte` yang deprecated).
- **Path Alias**: `$lib` → `./src/lib`.

## 2. Struktur Direktori (resmi — jangan menyimpang tanpa persetujuan)

```text
src/
├── app.d.ts
├── app.html
├── lib/
│   ├── components/       # Reusable UI. Saat ini: PracticeQuizSession.svelte
│   ├── constants/        # routes.ts, navigation.ts
│   ├── mocks/            # Mock data: home.ts, practice.ts, learning.ts, articles.ts
│   ├── types/            # practice.ts (Learning/Article types inline di mock-nya masing-masing)
│   ├── icons/
│   ├── utils/            # Helper + shared cross-page state (quizGeneratorState.svelte.ts)
│   └── services/         # Kosong sampai Stage 5 (Supabase)
└── routes/
    ├── +layout.svelte    # Sidebar + mobile nav
    ├── layout.css        # Import Tailwind v4 + palet warna via @theme
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
    │   ├── +page.svelte           # Collection: paket kurasi + kartu Quiz Generator
    │   ├── [id]/
    │   │   ├── +page.svelte       # Detail paket (Content)
    │   │   └── quiz/+page.svelte  # Quiz session (paket kurasi)
    │   └── quiz-generator/
    │       ├── +page.svelte       # Setup (Interaction Tool, bukan Content)
    │       └── session/+page.svelte
    ├── profile/+page.svelte       # Termasuk tab riwayat kontribusi (fungsi "Community")
    ├── settings/+page.svelte
    └── statistics/+page.svelte
```

**Tidak ada** `stores/`, `features/`, `repositories/`, `hooks/`, `assets/` — itu struktur lama, sudah diganti. `library/` tidak ada dan tidak dalam scope (fungsinya sudah tercakup Article/Learning).

## 3. Konvensi Routing

Pola: `/{module}` (collection) → `/{module}/[id]` (detail) → `/{module}/[id]/{action}` (action). Contoh: `/learning/[id]/read`.

**Practice punya 2 hal berbeda di bawah 1 module:**

- `PracticePackage` = Content, ikut pola penuh: `/practice` → `/practice/[id]` (detail, tombol "Mulai Kerjakan") → `/practice/[id]/quiz`.
- **Quiz Generator** = Interaction Tool, BUKAN Content: `/practice/quiz-generator` (setup) → `/practice/quiz-generator/session`. Jangan dipaksa ke pola collection→detail→action.

Dynamic segment selalu lowercase (`[id]`).

**`resolve()` wajib** untuk semua navigasi internal (dari `$app/paths`):

- Raw string `href`/`goto()` gagal lint (`svelte/no-navigation-without-resolve`).
- `resolve()` butuh literal route pattern + `params` object, BUKAN string hasil `$derived`. Untuk link dinamis: `resolve('/practice/[id]', { id: String(pkg.id) })` inline di template.

**Shared quiz engine**: `src/lib/components/PracticeQuizSession.svelte` (props: `questions`, `title`, `backRoute`, `backParams`), dipakai `/practice/[id]/quiz` dan generator session. Ini satu mesin untuk satu jenis interaksi (menjalankan sesi quiz) — bukan reusable-component-lintas-modul yang ditunda ke Stage 3.

## 4. Data & State

- `constants/routes.ts`: object `ROUTES` (lowercase key) + helper function per modul (`getLearningDetailRoute`, dst).
- `constants/navigation.ts`: struktur menu sidebar (label, icon, route).
- `types/practice.ts`: interface Practice (soal, kuis, hasil, `PracticePackage` dengan `subject`/`difficulty`/`topics[]`/`author`/`isVerified`).
- Quiz Generator config: `utils/quizGeneratorState.svelte.ts` — module-level `$state`, dipassing page→page (bukan URL query, untuk menghindari batasan literal-pattern `resolve()`).
- Kontribusi (kalau fitur Contribution UI dibangun): persist ke `localStorage['arcivis:contributions']` — pengecualian yang disengaja untuk fitur itu saja, bukan pola umum.

## 5. Konvensi Kolaborasi AI

1. **Halaman baru**: folder di `src/routes/<fitur>/` + `+page.svelte`, daftarkan di `constants/routes.ts` & `constants/navigation.ts`.
2. **Komponen reusable**: `src/lib/components/`, import via `$lib/components/...`. Cek dulu apakah ini "satu engine dipakai berulang" (boleh) atau "pola UI mirip di beberapa modul" (tunda ke Stage 3) — lihat `ROADMAP.md` Hard Rule #2.
3. **Svelte 5 Runes** wajib: `$state`, `$derived`, `$props`, `$effect`. Bukan `export let`/`$:`.
4. **Styling**: Tailwind utility classes, hindari inline `style` untuk apapun yang bisa diekspresikan Tailwind (pernah jadi bug nyata: class Tailwind di-passing ke `style="background-color: ..."` dan gagal render).
5. **Icons**: `@lucide/svelte`, import individual.

Untuk sistem desain (warna, tipografi, pola komponen), lihat `DESIGN_GUIDELINES.md`. Untuk stage/roadmap/hard rules, lihat `ROADMAP.md`.
