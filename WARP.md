# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## What this repo is
A single Next.js application (App Router) written in TypeScript with Tailwind CSS.

Key choices/config:
- Next.js config lives in `next.config.ts` (includes a Turbopack `root: __dirname` override).
- TypeScript is `strict` and uses a path alias: `@/*` → `src/*` (`tsconfig.json`).
- ESLint uses a flat config in `eslint.config.mjs` (Next core-web-vitals + Next TypeScript presets + `eslint-config-prettier`).
- Prettier is configured in `.prettierrc.json` (notably `printWidth: 100` and `trailingComma: "all"`).
- `.editorconfig` enforces LF line endings + 2-space indentation.
- Tailwind v4 is wired through PostCSS (`postcss.config.mjs`) and imported via `@import "tailwindcss";` in `src/app/globals.css` (no `tailwind.config.*` in this repo).

## Common commands (npm)
Install deps:
- `npm ci`

Dev server:
- `npm run dev`

Production build / run:
- `npm run build`
- `npm run start`

Lint / format:
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`

Target a single file (useful when iterating):
- Lint one file: `npx eslint src/app/page.tsx`
- Format one file: `npx prettier src/app/page.tsx --write`

Tests:
- No test runner is currently configured (there is no `test` script in `package.json`).

## High-level architecture
### Routing and rendering (App Router)
- `src/app` is the routing tree.
  - `src/app/layout.tsx` defines the root layout (HTML shell), imports `src/app/globals.css`, and configures fonts via `next/font/google`.
  - `src/app/page.tsx` is the home route.

### Styling
- Global styles live in `src/app/globals.css`.
  - Imports Tailwind (`@import "tailwindcss";`).
  - Defines CSS variables for `--background`/`--foreground` and maps them into Tailwind theme tokens via `@theme inline`.
  - Dark mode is currently driven by `prefers-color-scheme: dark`.

### Shared code organization
This repo is intended to scale into a larger platform:
- `src/lib`: shared non-UI modules (domain logic, API clients, utilities).
- `src/components`: reusable UI components.

### Assets
- Static assets are served from `public/`.
- Components typically reference them via `next/image` and `/...` paths (see `src/app/page.tsx`).

## Files worth reading first
- `README.md` (project intent + basic commands)
- `package.json` (scripts and toolchain)
- `eslint.config.mjs` (lint rules/ignores)
- `tsconfig.json` (strict TS + `@/*` path alias)
- `next.config.ts` (Next/Turbopack settings)
- `src/app/layout.tsx` + `src/app/globals.css` (global shell + styling primitives)
