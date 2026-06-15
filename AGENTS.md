# AGENTS.md

## What this is

Nebula is an open-source documentation platform built on Astro 6 + MDX + Tailwind v4. All user-facing copy, docs content, and `aria-label`s are in **Spanish** (`<html lang="es">` in `src/layouts/BaseLayout.astro`). The design system reference is `DESIGN.md` at the repo root.

## Stack

- Astro `^6.4.4` with `@astrojs/mdx`, `@astrojs/sitemap`, and `astro:assets`
- Tailwind v4 via `@tailwindcss/vite` — **no `tailwind.config.js`, no PostCSS**
- TypeScript strict (`extends: astro/tsconfigs/strict`)
- pnpm; Node `>=22.12.0` (see `package.json` `engines`)
- `lenis` is in `dependencies` but **not yet wired in** (script tag in `BaseLayout.astro` is commented out)

## Commands

- `pnpm dev` — dev server (auto-opens browser via `--open`)
- `pnpm build` — static build to `dist/`
- `pnpm preview` — serve the build
- `pnpm exec astro ...` — any other Astro CLI

There is **no `test`, `lint`, or `format` script** in `package.json` and no CI. To format, run `pnpm exec prettier .` (config: `.prettierrc`; uses `prettier-plugin-astro` + `prettier-plugin-tailwindcss`). `tailwindStylesheet` in `.prettierrc` points at `src/styles/global.css` so the Tailwind class-sort plugin knows the custom theme.

## Layout

- `src/pages/` — `index.astro` (marketing), `404.astro`, `docs/[...slug].astro` (catch-all docs route)
- `src/layouts/` — `BaseLayout` (root: font preloads, `<ClientRouter />`, `global.css`), `PageLayout` (marketing wrapper), `DocsLayout` (Header + Sidebar + Article + ToC grid)
- `src/components/`
  - `ui/` — generic Button, Link, Logo
  - `icons/` — inline-SVG icons (Chevron, Copy, Github, Search)
  - `layout/` — Header, Footer, Sidebar, SidebarNode, Article, TableOfContents
  - `mdx/` — per-element renderers used by the docs collection
  - `sections/hero/Hero.astro`
- `src/content/docs/` — `01-getting-started/`, `02-components/01-button/`, `02-components/02-input/` (MDX files)
- `src/content.config.ts` — `docs` collection, glob loader, `retainBody: false`, Zod schema requires `title` + `description`
- `src/styles/global.css` — Tailwind v4 entry; design tokens in `@theme { ... }`; component layer defines `.btn-primary`, `.btn-secondary`, `.markdown-body`
- `src/scripts/` — `config/lenis.ts` (not imported), `utils/copy.ts` (clipboard helper used by `mdx/Pre.astro`), `lib/toc.ts` (empty placeholder)

## Path aliases (`tsconfig.json`)

- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@scripts/*` → `src/scripts/*`
- `@styles/*` → `src/styles/*`

## Docs content collection

- Source glob: `src/content/docs/**/*.{md,mdx}`. Frontmatter must have `title` and `description` (Zod enforces it; build fails otherwise).
- Folders use a `NN-name` prefix (`01-getting-started`, `02-components/01-button`). `Sidebar.astro` builds the nav tree by walking `entry.id` segments, so **adding a folder under `src/content/docs/` automatically creates a sidebar group**.
- `retainBody: false` means entries carry frontmatter only; do not read `entry.body` — use the rendered `Content` component from `await render(entry)`.
- The HTML element → component map lives in `src/pages/docs/[...slug].astro` under `<Content components={{...}} />`. To override a new element, add a file under `src/components/mdx/` and register it in that map.
- `BaseLayout.astro` enables `<ClientRouter />` (view transitions). Stateful scripts that bind DOM listeners must either be inlined per page or re-bind on the `astro:page-load` event — see `src/scripts/config/lenis.ts` for the canonical pattern.

## Tailwind v4

- Tokens (colors, shadows, fonts) are declared in `src/styles/global.css` via `@theme { ... }` and `@theme inline { ... }`. There is **no `tailwind.config.js`**; do not create one. To add a token, edit the CSS and update the matching row in `DESIGN.md`.
- Custom color tokens (use as `bg-iron-slate`, `text-halo-pale`, etc.): `--color-iron-slate`, `--color-halo-pale`, `--color-shadow-tint`, `--color-subtle-gray`, `--color-iridescent-glow`, `--color-spectrum-flare`, `--color-vivid-crimson`, `--color-goldenrod`, `--color-emerald-green`, plus `--color-dark-rainbow-gradient`.
- `--font-sans` and `--font-mono` are mapped in `@theme inline` to `--font-host-grotesk` and `--font-inter` (declared in `astro.config.mjs` `fonts` and preloaded in `BaseLayout.astro`).
- Base typography (h1..h6, body, scrollbar) and global resets live in `@layer base` of `global.css` — that is where to change global element styling.

## Known gaps / WIP — verify before relying

- `src/components/layout/Sidebar.astro` has a leftover `console.log(navigation)` debug line. Remove before commit.
- `src/components/layout/SidebarNode.astro` is half-finished: both the `isGroup` and the leaf branch are wrapped in HTML comments; only a placeholder `<li>` renders. The recursion call (`<Astro.self ... />`) in the group branch is also commented out, so the file is effectively dead code. If you need to render a nested tree, finish this component first.
- `src/scripts/lib/toc.ts` tracks active ToC section via IntersectionObserver and passive scroll listener.
- `src/scripts/config/lenis.ts` exists but is **not imported anywhere** (the `<script src="...">` in `BaseLayout.astro` is commented out). Lenis is installed but does nothing yet.
- `@astrojs/markdown-satteri` is in `dependencies` and was just re-added in the uncommitted diff, but `processor: satteri({...})` in `astro.config.mjs` is commented out. Do not assume the satteri processor is active.
- `astro.config.mjs` has `site: 'https://example.com'` — placeholder. Update before relying on `@astrojs/sitemap` output URLs.
- `BaseLayout.astro` links `/favicon.svg` but the file is not in `public/` (only `logo.webp`, `character-render-app.webm`, `robots.txt`).
- `master` has uncommitted changes (a Sidebar/SidebarNode refactor). Run `git status` and `git diff` before committing.

## Conventions

- Default branch: `master`.
- Conventional Commits with a **ticket-scoped** subject, e.g. `feat(4G-001): ...`, `style(4G-123): ...`, `fix(4G-001): ...`. The scope is the ticket id, not a component name.
- Never add `Co-Authored-By:` trailers.
- No CI workflows, pre-commit hooks, or automated test suite. Don't waste cycles looking for them.
- Project-local skills live in `.agents/skills/` (symlinked into `.claude/skills/`). Index at `.atl/skill-registry.md` (gitignored, auto-generated). Most relevant here: `astro`, `tailwind-css-patterns`, `frontend-design`, `accessibility`, `seo`.
- `.astro/` is generated (gitignored) and contains content collection types, fonts, and data store. Don't commit it; let `astro dev`/`build` regenerate.

## Prohibitions

- **Never write comments in code.** Use clean, self-documenting code. Function/variable names should explain intent. This is non-negotiable.
