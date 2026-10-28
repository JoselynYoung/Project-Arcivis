# Arcivis Design and UI System Guidelines

This document defines Arcivis's UI/UX design system, including visual consistency, layout, colors, typography, and UX patterns for developers and AI coding assistants. For technical and folder structure, see `Docs/agents/ARCHITECTURE.md`. For stage and roadmap status, see `Docs/ROADMAP.md`.

---

## 1. Design Philosophy

- **Modern Glassmorphism and Soft Layers**: soft glass surfaces (`backdrop-blur-md`, `bg-white/40`, `bg-white/90`) with thin translucent borders.
- **Rounded and Friendly**: consistent rounded corners (`rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`).
- **Depth and Subtlety**: radial dot pattern on the main background, gradient overlay, and soft shadows (`shadow-xs`, `shadow-sm`, `shadow-lg`).
- **Mobile-First Responsive**: collapsible desktop sidebar and floating glassmorphic mobile bottom bar.

## 2. Color Palette

Defined in `src/routes/layout.css` through Tailwind CSS v4 `@theme`.

### Primary Blue

| Token         | Hex       | Usage                                                     |
| :------------ | :-------- | :-------------------------------------------------------- |
| `primary-50`  | `#eff6ff` | Active/hover item background, pill badge                  |
| `primary-100` | `#dbeafe` | Subtle border (`border-primary-100/60`)                   |
| `primary-200` | `#bfdbfe` | Radial dot pattern background                             |
| `primary-600` | `#1e7dd4` | Brand accent, primary icon, active link                   |
| `primary-700` | `#1565b3` | Hover text state, gradient target                         |
| `primary-800` | `#0f4d8a` | Active-state gradient (`from-primary-800 to-primary-700`) |
| `primary-900` | `#0c3d6e` | High-contrast text                                        |
| `primary-950` | `#0a2540` | Deepest brand text                                        |

**Note**: `primary-300` does not exist; do not assume it does.

### Secondary and Neutrals

- **Accent Cyan**: `--color-accent: #0891b2` (highlight and badge).
- **Muted Surface**: `--color-surface-muted: #f4f9fc` (secondary background).
- **Slate Text**: headings `text-slate-800`/`text-slate-900`, body `text-slate-600`/`text-slate-500`, muted `text-slate-400`.

## 3. Typography

- **Page Heading (H1)**: `text-3xl font-bold text-slate-800 leading-snug`
- **Section Title (H2)**: `text-xl font-semibold text-slate-800`
- **Card Title (H3)**: `text-base font-medium text-slate-700`
- **Body/Description**: `text-sm text-slate-500`
- **Caption/Badge**: `text-xs font-medium`

## 4. UI Components and Design Patterns

### A. Main Page Background

```html
<main
	class="relative min-w-0 flex-1 bg-white bg-[radial-gradient(var(--color-primary-200)_1px,transparent_1px)] bg-size-[24px_24px]"
>
	<div class="absolute inset-0 bg-linear-to-r from-primary-50/60 to-transparent"></div>
	<div class="relative z-10 p-4 sm:p-6 md:p-8">
		<!-- Page Content -->
	</div>
</main>
```

### B. Navigation Sidebar (Desktop)

- Expanded: `w-64 px-4`; collapsed: `w-20 px-3`.
- Active link: `bg-linear-to-br from-primary-800 to-primary-700 text-white shadow-xs`.
- Inactive link: `text-slate-500 hover:bg-primary-50 hover:text-primary-700`.

### C. Floating Bottom Bar (Mobile)

`fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md border border-primary-100/60 rounded-full shadow-lg`

### D. Cards and Containers

- Default: `bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all`.
- Glassmorphic: `bg-white/60 backdrop-blur-md rounded-2xl border border-primary-100/60 p-4`.

### E. Buttons and Badges

- Primary: `bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all`.
- Secondary: `border border-slate-300 bg-white text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all`.
- Badge/Tag: `bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full font-medium`.

## 5. Iconography

- Required library: `@lucide/svelte`.
- Sizes: navigation/menu `size={20}`/`22`, header/brand `size={24}`, small inline icons `size={16}`.
- Icon colors follow state: `text-primary-600` (brand/active), `text-slate-400` (default).

## 6. AI Collaboration Guidelines for New UI

1. **Do not use generic flat colors** (pure red/pure blue); use `primary-*` or `slate-*` tokens.
2. Use `rounded-2xl`/`rounded-3xl` for primary containers/cards and `rounded-xl`/`rounded-full` for buttons/badges.
3. Always use `transition-all` or `transition-colors` on interactive elements.
4. Support every breakpoint (`sm:`/`md:`/`lg:`), not only desktop.
5. Do not pass Tailwind classes to the `style` attribute (for example, `style="background-color: {tailwindClassString}"`); that is not valid CSS and has caused a real invisible-badge bug. Put the value in `class="... {tailwindClassString}"`.
