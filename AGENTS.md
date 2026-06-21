# Agent Notes — Nebula

Astro 6 static documentation site with MDX content collections, Tailwind CSS v4, and native Astro i18n.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (`astro dev --open`) |
| `pnpm build` | Build static site to `dist/` |
| `pnpm preview` | Preview the built site |
| `pnpm prettier --write .` | Format with Prettier (no script alias in `package.json`) |

Use **pnpm**; `pnpm-lock.yaml` is the lockfile. Node `>=22.12.0`.

## Architecture

- **Framework**: Astro 6.4, static output, TypeScript strict.
- **Styling**: Tailwind v4 via `@tailwindcss/vite`. Theme and custom utilities live in `src/styles/global.css`.
- **Content**: `src/content/docs/{locale}/**/*.mdx` under the `docs` collection. Entry IDs include the locale prefix (`es/01-getting-started/...`).
- **Routing**:
  - Docs: `src/pages/[locale]/docs/[...slug].astro`
  - Home: `src/pages/[locale]/index.astro` (requires `getStaticPaths`)
  - Root: `src/pages/index.astro` redirects `/` → `/en/`
- **i18n**: Native Astro i18n in `astro.config.mjs`:
  - `defaultLocale: 'en'`, `locales: ['en', 'es']`, `prefixDefaultLocale: true`
  - UI strings in `src/i18n/ui.ts`; import via `@i18n/ui`
- **Search**: `astro-pagefind` indexes the build automatically.
- **Design tokens**: `DESIGN.md` has the visual reference (colors, typography, spacing).

## Path Aliases

Defined in `tsconfig.json`:

- `@components/*` → `src/components/*`
- `@i18n/*` → `src/i18n/*`
- `@layouts/*` → `src/layouts/*`
- `@scripts/*` → `src/scripts/*`
- `@styles/*` → `src/styles/*`

## Conventions

- **Prettier**: `printWidth: 120`, `singleQuote: true`, `tabWidth: 2`. Astro files use the `astro` parser; Tailwind class sorting via `prettier-plugin-tailwindcss`.
- **Icons**: SVG icons are components in `src/components/icons/*Icon.astro`.
- **MDX overrides**: Custom components are mapped in `[locale]/docs/[...slug].astro` (`a`, `ul`, `pre`, `img`, etc.).
- **Content ordering**: Numeric folder/file prefixes (e.g., `01-getting-started/01-getting-started.mdx`) drive sidebar order; the sidebar strips the prefix for display.

## Gotchas

- **No test runner** is configured.
- **Experimental native APIs** are used intentionally without JS:
  - `command` / `commandfor` for opening dialogs
  - `closedby="any"` on `<dialog>`
  - `popover` / `popovertarget` for dropdowns
- **Astro i18n does not auto-localize `src/pages/index.astro`**: the home must live under `[locale]/index.astro` with explicit `getStaticPaths`, and a root redirect page is needed.
- **Search modal import**: the component imports `SearchIcon.astro`, not `Search.astro`.
- **Build artifacts** `dist/` and `.astro/` are gitignored; do not commit them.
