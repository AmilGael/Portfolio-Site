# T4-canvas: two self-contained canvas components

Read `CLAUDE.md` first. Strict TypeScript, no `any`, no new dependencies, comments only for non-obvious why, Tailwind semantic tokens only (`bg-bg`, `bg-surface`, `text-text`, `text-muted`, `text-signal`, `border-rule`), no raw hex in TSX. Do NOT commit. Do NOT touch files outside this list. Other components are rewritten in a later task; you only create/replace these two files. `npx tsc --noEmit` and `npm run lint` must stay clean.

## Files

- `components/DevelopingPortrait.tsx` (create)
- `components/BinaryBackground.tsx` (replace entirely)

Both are `"use client"` components. Both must be safe under SSR (no `window`/`document` access outside effects). Both clean up every listener, observer, interval and rAF on unmount. Both read colours from CSS custom properties at runtime via `getComputedStyle(document.documentElement).getPropertyValue("--signal")` etc. (the variables `--bg`, `--text`, `--muted`, `--signal`, `--rule`, `--surface` exist on `:root` in `app/globals.css`); never hard-code a colour.

---

## A. `components/DevelopingPortrait.tsx`

The site's signature interaction. A portrait that starts as a character render of the real photograph and develops into the photograph as the visitor scrolls, completing only when they open their first build.

### Props

```ts
type Props = {
  src: string;        // already run through assetPath() by the caller
  srcSet?: string;    // optional 2x descriptor string, already through assetPath()
  alt: string;
  className?: string; // applied to the outer wrapper
};
```

### Markup

Outer `<div>` with `className` merged with: `relative overflow-hidden border border-rule bg-surface` and `aspect-[3/4]` (the image is a 3:4 portrait). Inside, in this order:

1. `<img>` with `src`, `srcSet`, `alt`, `decoding="async"`, `draggable={false}`, classes `absolute inset-0 h-full w-full object-cover select-none`. Its `style.opacity` is driven (see below). It is ALWAYS in the DOM so assistive tech and no-JS get the photo.
2. `<canvas aria-hidden="true">` with classes `pointer-events-none absolute inset-0 h-full w-full`, its `style.opacity` also driven.

### The develop value `d` (0 → 1)

Compute in a rAF-throttled `scroll` listener plus `resize` and on mount:

```
const builds = document.getElementById("builds");
const end = builds ? builds.offsetTop - window.innerHeight * 0.25 : window.innerHeight * 2;
const scrollD = clamp(window.scrollY / Math.max(1, end), 0, 1);
```
`d = min(scrollD, 0.85)` until the window receives a `CustomEvent` named `"archive:open"` (dispatched by the builds list when any build is opened for the first time). From that moment, `d` eases from its current value to `1` over 600ms (ease-out cubic, driven by rAF) and LATCHES at 1 for the rest of the session regardless of scroll. Keep a `useRef` for the latch, the current `d`, and the rAF handle.

Only redraw when `d` changes by more than `0.004` or the element resized.

### Rendering

On mount, load the image via `new Image()` from `src` (same origin). When loaded, build a sampling canvas: draw the image with `object-fit: cover` semantics into an offscreen `<canvas>` sized to the display box (CSS pixels, not DPR) so sampling matches what the `<img>` shows.

Character stage (`d` in `[0, 0.6]`):
- Cell size in CSS px: `cell = lerp(14, 4, d / 0.6)`.
- For each cell, average luminance (`0.2126 R + 0.7152 G + 0.0722 B`, 0..1) over the cell's pixels from the sampling canvas (use `getImageData` once per redraw at the sampling resolution; integer-step the loops; this must stay under ~4ms for a 320×427 box at cell 4).
- Ramp: `" .:-=+*#%@"`. Index = `round(lum * (ramp.length - 1))`.
- Draw with `fillText` in the site's mono face (read `getComputedStyle(document.body).fontFamily`) at font-size `cell * 1.05`, `textBaseline = "top"`. Fill colour: cells with `lum > 0.72` use `--text`, cells with `lum > 0.42` use `--signal`, others use `--muted`. Background `--surface`.
- The canvas is sized for `devicePixelRatio` (backing store = CSS size × DPR, context scaled) so glyphs stay crisp.
- During this stage: canvas `opacity = 1`, img `opacity = 0`.

Dissolve stage (`d` in `(0.6, 1]`):
- Keep drawing the character grid at `cell = 4`.
- `alpha = (d - 0.6) / 0.4`; img `opacity = alpha`; canvas `opacity = 1 - alpha * 0.85` (a faint grid remains visible until `d = 1`; at exactly `d = 1` set canvas opacity `0`).

`ResizeObserver` on the wrapper re-sizes both canvases and redraws.

### Fallbacks

- `prefers-reduced-motion: reduce` (check once on mount with `matchMedia`): skip all canvas work, set `d = 1`, img opacity `1`, canvas opacity `0`, no listeners.
- Canvas 2D context unavailable or image load error: same as reduced motion.
- Before the image has loaded: canvas shows nothing (surface colour only) and img opacity stays `0`; the wrapper's `bg-surface` is the placeholder. Do not render a "loading" label.

---

## B. `components/BinaryBackground.tsx`

Replace the current implementation (a 90×180 character `<pre>` that re-renders through React every 280ms) with a canvas that looks the same and costs nothing.

### Markup

```tsx
<div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ WebkitMaskImage: MASK, maskImage: MASK }}>
  <canvas ref={ref} className="absolute inset-0 h-full w-full" />
</div>
```
with `MASK = "radial-gradient(ellipse 90% 85% at 60% 45%, black 30%, transparent 95%)"` (unchanged from the current file, it is what makes the texture read as atmosphere).

### Behaviour

- Grid metrics: font-size `11px`, mono face from `getComputedStyle(document.body).fontFamily`, line height `1.15` → row height `12.65px`; column advance = measured width of the glyph `"0"` at that font plus `0.15em` letter-spacing (`11 * 0.15 = 1.65px`). Compute `cols = ceil(width / colAdvance) + 1`, `rows = ceil(height / rowHeight) + 1`.
- Fill colour `--rule` at `globalAlpha = 0.85`, background transparent (the page `bg` shows through).
- On mount and on (debounced 150ms) resize: size the canvas for `devicePixelRatio`, regenerate a `Uint8Array` of `cols * rows` random bits, draw every cell once.
- Every `280ms` (a `setInterval`, paused while `document.hidden` via `visibilitychange`), flip `9` random cells: for each, `clearRect` that cell and `fillText` the new bit. Never redraw the whole grid on a tick.
- `prefers-reduced-motion: reduce`: draw once, no interval.
- Cleanup on unmount: interval, resize listener, visibility listener.

No props. Default export, as now, so `app/page.tsx` keeps importing it unchanged.

---

## Acceptance (run these yourself)

- `npm run lint` clean.
- `npx tsc --noEmit` clean.
- `git status --short` shows only the two files.
- Finish with a short list of what changed and the command results.
