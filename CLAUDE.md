# Portfolio Site — Claude Code instructions

Static personal portfolio for Gamaliel Leguista. Deployed to Netlify from
`main`, served at the site root on a `*.netlify.app` subdomain until a domain exists.

## Stack

- Next.js 14 (App Router) — exported as a static site (`output: "export"`)
- React 18, TypeScript strict mode
- TailwindCSS 3 with custom theme tokens
- No backend, no API routes, no database
- No test framework configured

## Commands

```bash
npm run dev         # local dev server (no basePath)
npm run build       # production build (static export when NEXT_OUTPUT=export)
npm run lint        # next lint — run before declaring work done
npx tsc --noEmit    # typecheck — run before declaring work done
```

There is no test suite. "Verification" for this project = `lint` + `tsc` + a
manual browser check on the dev server.

## Critical: the basePath gotcha

The site is served from the root on Netlify. Every static asset reference must
still go through `assetPath()` in `lib/paths.ts`, so a future subpath deploy is a
one-variable change through `NEXT_PUBLIC_BASE_PATH`.

```tsx
// WRONG — breaks on subpath deploys
<img src="/avatar.png" />

// RIGHT
import { assetPath } from "@/lib/paths";
<img src={assetPath("/avatar.png")} />
```

Same rule applies to `<a href>` for downloadable files, `<iframe src>`, etc.
Internal route links via `next/link` are fine — Next handles those.

## Project layout

- `app/` — App Router entry (`layout.tsx`, `page.tsx`, `globals.css`)
- `components/` — presentational React components, all client-safe
- `lib/` — pure helpers (`paths.ts`, `projects.ts`, `skills.ts`)
- `public/` — static assets (referenced via `assetPath()`)
- Path alias `@/*` resolves to repo root

## Conventions

- **Tailwind theme tokens** are semantic, not literal. Use `bg-bg`, `text-text`,
  `text-muted`, `text-signal`, `border-rule`, `bg-surface`. Don't introduce raw
  hex values; extend `tailwind.config.ts` if a new token is needed.
- **Font:** mono-only aesthetic. Use `font-mono` (wired to `--font-mono`).
- **`letterSpacing.caps`** (`tracking-caps`) for uppercase headings.
- Components are TSX with named exports for non-default helpers; default export
  for the primary component.
- Strict TypeScript — no `any`, no implicit returns. Prefer `type` aliases over
  `interface` unless extending.

## Static-export constraints

Because the site builds with `output: "export"`:
- No `next/image` optimization (`images.unoptimized: true` is set — keep it)
- No server actions, no route handlers, no middleware
- `public/_headers` is the live security policy on Netlify; `headers()` in
  `next.config.mjs` only matters on Node hosts. Keep both in sync.
- Anything dynamic must be client-side or build-time.

## Deploy

Netlify reads `netlify.toml`, sets `NEXT_OUTPUT=export`, and publishes `out/`.
`NEXT_PUBLIC_BASE_PATH` is unset. Never hard-code a basePath anywhere.

## Don't

- Don't add server-side features (API routes, server actions). They silently
  break the static export.
- Don't introduce new dependencies casually — this is a deliberately small,
  fast-loading site. Justify any addition.
- Don't commit `.next/`, `out/`, `*.tsbuildinfo`, or `next-env.d.ts` (already
  gitignored — but watch for re-adds).
- Don't write tests speculatively. There's no harness; if a feature warrants
  tests, set up the harness in the same PR and explain why.
- Don't add comments that just describe what the code does. Comments are for
  non-obvious *why* — like the basePath fallback in `lib/paths.ts`.
