# Panduan Desain & Sistem UI — Arcivis

Dokumen ini adalah panduan sistem desain UI/UX Arcivis: konsistensi visual, layout, warna, tipografi, dan UX, untuk developer maupun AI coding assistant. Untuk struktur teknis/folder, lihat `ARCHITECTURE.md`. Untuk stage/roadmap, lihat `ROADMAP.md`.

---

## 1. Filosofi Desain

- **Modern Glassmorphism & Soft Layers**: latar berkaca lembut (`backdrop-blur-md`, `bg-white/40`, `bg-white/90`) dengan border tipis transparan.
- **Rounded & Friendly**: sudut melengkung konsisten (`rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`).
- **Depth & Subtlety**: dot radial pattern di background utama + gradient overlay + shadow lembut (`shadow-xs`, `shadow-sm`, `shadow-lg`).
- **Mobile-First Responsive**: Collapsible Sidebar (desktop), Floating Glassmorphic Bottom Bar (mobile).

## 2. Palet Warna

Didefinisikan di `src/routes/layout.css` via Tailwind CSS v4 `@theme`.

### Primary Blue

| Token         | Hex       | Penggunaan                                                |
| :------------ | :-------- | :-------------------------------------------------------- |
| `primary-50`  | `#eff6ff` | Background item aktif/hover, pill badge                   |
| `primary-100` | `#dbeafe` | Border halus (`border-primary-100/60`)                    |
| `primary-200` | `#bfdbfe` | Radial dot pattern background                             |
| `primary-600` | `#1e7dd4` | Brand accent, icon utama, link aktif                      |
| `primary-700` | `#1565b3` | Hover text state, gradient target                         |
| `primary-800` | `#0f4d8a` | Active state gradient (`from-primary-800 to-primary-700`) |
| `primary-900` | `#0c3d6e` | Teks kontras tinggi                                       |
| `primary-950` | `#0a2540` | Brand text paling pekat                                   |

**Catatan**: tidak ada `primary-300` — jangan diasumsikan ada.

### Secondary & Neutrals

- **Accent Cyan**: `--color-accent: #0891b2` (highlight & badge).
- **Surface Muted**: `--color-surface-muted: #f4f9fc` (background sekunder).
- **Slate Text**: heading `text-slate-800`/`text-slate-900`, body `text-slate-600`/`text-slate-500`, muted `text-slate-400`.

## 3. Tipografi

- **Page Heading (H1)**: `text-3xl font-bold text-slate-800 leading-snug`
- **Section Title (H2)**: `text-xl font-semibold text-slate-800`
- **Card Title (H3)**: `text-base font-medium text-slate-700`
- **Body/Description**: `text-sm text-slate-500`
- **Caption/Badge**: `text-xs font-medium`

## 4. Komponen UI & Pola Desain

### A. Background Halaman Utama

```html
<main
	class="relative min-w-0 flex-1 bg-white bg-[radial-gradient(var(--color-primary-200)_1px,transparent_1px)] bg-size-[24px_24px]"
>
	<div class="absolute inset-0 bg-linear-to-r from-primary-50/60 to-transparent"></div>
	<div class="relative z-10 p-4 sm:p-6 md:p-8">
		<!-- Konten Halaman -->
	</div>
</main>
```

### B. Navigation Sidebar (Desktop)

- Expanded: `w-64 px-4` — Collapsed: `w-20 px-3`
- Active link: `bg-linear-to-br from-primary-800 to-primary-700 text-white shadow-xs`
- Inactive link: `text-slate-500 hover:bg-primary-50 hover:text-primary-700`

### C. Floating Bottom Bar (Mobile)

`fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md border border-primary-100/60 rounded-full shadow-lg`

### D. Card & Container

- Default: `bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all`
- Glassmorphic: `bg-white/60 backdrop-blur-md rounded-2xl border border-primary-100/60 p-4`

### E. Buttons & Badges

- Primary: `bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all`
- Secondary: `border border-slate-300 bg-white text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all`
- Badge/Tag: `bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-medium`

## 5. Iconography

- Library wajib: `@lucide/svelte`.
- Ukuran: navigasi/menu `size={20}`/`22`, header/brand `size={24}`, inline kecil `size={16}`.
- Warna icon menyesuaikan state: `text-primary-600` (brand/aktif), `text-slate-400` (default).

## 6. Panduan Kolaborasi AI untuk UI Baru

1. **Jangan pakai warna generik polos** (merah/biru murni) — selalu `primary-*` atau `slate-*`.
2. `rounded-2xl`/`rounded-3xl` untuk container/card utama, `rounded-xl`/`rounded-full` untuk button/badge.
3. Selalu `transition-all`/`transition-colors` di elemen interaktif.
4. Responsif di semua breakpoint (`sm:`/`md:`/`lg:`), bukan cuma desktop.
5. Jangan passing class Tailwind ke atribut `style` (misal `style="background-color: {tailwindClassString}"`) — itu bukan CSS valid dan pernah jadi bug nyata (badge jadi invisible). Pakai `class="... {tailwindClassString}"`.
