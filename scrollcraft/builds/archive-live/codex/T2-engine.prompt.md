# T2-engine: wire the scrollcraft runtime into the Next.js app

Read `CLAUDE.md` first. Strict TypeScript, no `any`, no new npm dependencies, comments only for non-obvious why. Do NOT commit. Do NOT touch files outside this list.

## Files

- `public/scrollcraft/scrollcraft.js` (create: byte-for-byte copy)
- `app/scrollcraft.css` (create: byte-for-byte copy)
- `types/scrollcraft.d.ts` (create)
- `lib/scrollcraft.ts` (create)
- `components/ScrollCraftMount.tsx` (create)
- `app/layout.tsx` (edit)
- `app/globals.css` (edit)
- `tailwind.config.ts` (edit one value)

## 1. Copy the engine verbatim

Source files (read-only, outside the repo):

- `/Users/genel/.claude/plugins/cache/nateherk/nateherk-design/0.2.0/skills/scrollcraft/engine/scrollcraft.js` → `public/scrollcraft/scrollcraft.js`
- `/Users/genel/.claude/plugins/cache/nateherk/nateherk-design/0.2.0/skills/scrollcraft/engine/scrollcraft.css` → `app/scrollcraft.css`

Use `cp`. Never edit either copy. Acceptance runs `cmp` on both.

The engine is a vanilla IIFE that assigns `window.ScrollCraft = { mount, reduce, instances }`. It does NOT auto-mount; the page must call `window.ScrollCraft.mount(root)`, which scans `root` for `[data-sc-act]` sections and returns an api object with at least `layout()` (re-measure after the DOM changes height), `read()`, `acts`, `worlds`, `clips`, `lerp`. It adds the class `sc-ready` to `<html>` once running. It also pushes the api onto `window.ScrollCraft.instances`.

## 2. `types/scrollcraft.d.ts`

Ambient declarations (no imports/exports at top level so it stays a script file picked up by `tsconfig`'s `**/*.ts` include):

```ts
type ScrollCraftApi = {
  layout: () => void;
  read: () => void;
  acts: readonly unknown[];
  worlds: readonly unknown[];
  clips: readonly unknown[];
  lerp: number;
};

type ScrollCraftGlobal = {
  mount: (root: Document | HTMLElement) => ScrollCraftApi;
  reduce: unknown;
  instances: ScrollCraftApi[];
};

interface Window {
  ScrollCraft?: ScrollCraftGlobal;
}
```

## 3. `lib/scrollcraft.ts`

A tiny client-safe module (it must not touch `window` at import time):

```ts
export function mountScrollCraft(): ScrollCraftApi | null
```
Mounts once per page: if a module-level `api` already exists, return it; if `window.ScrollCraft` is missing, return `null`; otherwise `api = window.ScrollCraft.mount(document)` and return it.

```ts
export function relayout(): void
```
Calls `api?.layout()` inside a `requestAnimationFrame` so callers can invoke it right after a state change and the engine measures the post-render DOM.

```ts
export function activeActId(): string | null
```
Returns the `id` of the `[data-sc-act]` element whose bounding rect contains the vertical midpoint of the viewport (`window.innerHeight / 2`), or `null`. Pure DOM read, no engine dependency, so the sidebar can derive "where am I" honestly even before the engine mounts.

## 4. `components/ScrollCraftMount.tsx`

`"use client"`. Renders `next/script` with:
- `src={assetPath("/scrollcraft/scrollcraft.js")}` (import `assetPath` from `@/lib/paths`)
- `strategy="afterInteractive"`
- `onLoad={() => mountScrollCraft()}`

Plus a `useEffect` that calls `mountScrollCraft()` on mount, so the engine also attaches when the script was already present (Fast Refresh, cached script whose `onLoad` will not fire again). `mountScrollCraft` is idempotent, so both paths are safe. Renders nothing else.

## 5. `app/layout.tsx`

- Import `./scrollcraft.css` BEFORE `./globals.css` (globals must win the cascade).
- Render `<ScrollCraftMount />` inside `<body>` after `{children}`.
- Update `metadata.description` and `openGraph.description` to exactly: `AI engineer and full-stack developer. Bronx, NY. Client-facing products end to end, from discovery to live demo.` Keep the titles as they are.

## 6. `app/globals.css`

- In `:root`, change `--muted` to `#7a8c76` and ADD the engine token mapping so the runtime inherits the site palette and the mono face:
  ```css
  --sc-canvas: var(--bg);
  --sc-surface: var(--surface);
  --sc-ink: var(--text);
  --sc-ink-soft: var(--muted);
  --sc-accent: var(--signal);
  --sc-accent-ink: var(--bg);
  --sc-font-display: var(--font-mono), ui-monospace, monospace;
  --sc-font-text: var(--font-mono), ui-monospace, monospace;
  --sc-font-mono: var(--font-mono), ui-monospace, monospace;
  ```
- Add `scroll-behavior: auto;` to the existing `html` rule (the engine's stylesheet sets `smooth` globally; the page controls smooth vs instant itself, and the verification harness needs instant jumps).
- DELETE these rules and their keyframes entirely: `.view-fade`, `@keyframes view-fade-in`, `.reveal`, `.reveal.is-visible`, `.card-detail`, `.card-detail > .card-detail-inner`, `.project-card:hover ...` and `.project-card:focus-within ...` blocks, the `@media (hover: none)` block that targets `.card-detail`, `.sidebar-value`, `@keyframes sidebar-swap`, and the `@media (prefers-reduced-motion: reduce)` block (it only referenced deleted classes). Also delete the two comments that introduced those rules.
- Keep everything else byte-for-byte: `html` background/color-scheme/scrollbar, `body`, `::selection`, the scrollbar rules, `.caps`, `.ascii`, `.signal-link` and its hover.

## 7. `tailwind.config.ts`

Change `muted: "#6C7D68"` to `muted: "#7A8C76"`. Nothing else.

## Acceptance (run these yourself)

- `cmp public/scrollcraft/scrollcraft.js /Users/genel/.claude/plugins/cache/nateherk/nateherk-design/0.2.0/skills/scrollcraft/engine/scrollcraft.js` and the same for the CSS: both silent.
- `npm run lint` clean.
- `npx tsc --noEmit` clean. (Existing components still compile; you removed only CSS, not their imports.)
- `NEXT_OUTPUT=export npm run build` succeeds, and `out/scrollcraft/scrollcraft.js` exists.
- `git status --short` shows only the files listed above.
- Finish with a short list of what changed and the command results.
