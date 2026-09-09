# T5-surface: rebuild the page as a scroll-driven live surface

Read `CLAUDE.md` first. Strict TypeScript (no `any`, `type` aliases, named exports for helpers, default export for the primary component), no new dependencies, Tailwind semantic tokens only (`bg-bg`, `bg-surface`, `text-text`, `text-muted`, `text-signal`, `text-rule`, `border-rule`), `font-mono` is the only face, `tracking-caps`/`.caps` for uppercase labels, no raw hex in TSX, comments only for non-obvious why. Every `public/` URL goes through `assetPath()` from `@/lib/paths`. Do NOT commit. Do NOT touch files outside this list.

All copy below is final. Transcribe it exactly. Never introduce an em dash (—) anywhere visible; use periods, commas, colons or parentheses. Never add a "scroll" hint, arrow, or animated mouse. Never add `01 / 06`-style counters to section headings.

## Files

- `app/page.tsx` (rewrite)
- `components/Sidebar.tsx` (rewrite)
- `components/TerminalMenu.tsx` (rewrite)
- `components/AsciiArt.tsx` (edit: drop the `Reveal` wrappers, keep everything else)
- `components/BuildsList.tsx` (create)
- `components/Prompt.tsx` (create)
- `components/EntryHeader.tsx`, `components/Reveal.tsx`, `components/ProjectCard.tsx` (delete)
- `app/globals.css` (append rules listed at the end; change nothing else)

Already in place and to be used as-is (do not edit): `components/DevelopingPortrait.tsx` (`{ src, srcSet?, alt, className? }`), `components/BinaryBackground.tsx` (default export, no props), `components/ScrollCraftMount.tsx` (mounted in `app/layout.tsx`), `lib/scrollcraft.ts` (`relayout()`, `activeActId()`), `lib/projects.ts` (`projects`, `Project`, `Link`, `Person`, `Figure`), `lib/skills.ts` (`skills`, `SkillGroup`), `lib/paths.ts` (`assetPath`).

## Engine contract (the runtime in `public/scrollcraft/scrollcraft.js`, mounted after hydration)

- An act is `<section data-sc-act="pin|flow|pan" data-sc-span="N">`. Pinned acts (`pin`, `pan`) own `N` viewport-heights of scroll; the engine sets the section's height and makes its first `[data-sc-stage]` child sticky at `100svh` with `overflow: clip`. `flow` acts are normal document sections.
- Every act gets `--sc-p` (0..1) on the section element, readable in CSS by descendants.
- `data-sc-cue="from to [rampIn [rampOut]]"` on any element inside an act drives its opacity and a small rise; the engine writes inline `opacity` and `transform`, so cued elements must not carry their own transforms. Forms: `"0 1 0 0"` = visible from p=0 and held; `"0 0.9 0"` = visible at p=0 then fades out by 0.9; `"0.2 0.5"` = in at 0.2, out at 0.5. Rule: on every act except the LAST, the final cue must be a two-value window ending at 1; only the last act's cue holds.
- `data-sc-in` on an element reveals it once when it enters the viewport; add `data-sc-stagger="60"` to stagger its direct children by 60ms.
- `data-sc-pan="0.06"` on a horizontal `display:flex` rail inside a `pan` act's stage: the engine translates the rail by exactly `scrollWidth - innerWidth` across the act (plus 6% overshoot). The rail must be wider than the window or nothing moves.
- Reduced motion is handled by the engine for cues and rails.

## Layout

`app/page.tsx` is a `"use client"` default export `Page` that renders, in order: `<BinaryBackground />`, `<Sidebar menu={MENU} />`, then `<main className="relative z-10 md:ml-[30%]">` containing the five `<section>` acts below. The right column's horizontal padding is `px-5 md:px-10 lg:px-20`. Inside every pinned stage, wrap the content in `<div className="flex h-full flex-col justify-center pt-[104px] md:pt-0 px-5 md:px-10 lg:px-20">` so the mobile top bar (104px tall, fixed) never covers it. The `pt-[104px]` also applies to the first flow section on mobile.

```ts
const MENU: MenuItem[] = [
  { id: "identity", label: "identity" },
  { id: "builds", label: "builds" },
  { id: "profile", label: "profile" },
  { id: "stack", label: "stack" },
  { id: "contact", label: "contact" },
];
```

Section heading style used everywhere (the surface's own idiom; there are no display headings on this page): an `<h2>` with classes `caps text-[12px] tracking-[0.14em] text-signal` whose first child is `<span aria-hidden className="text-muted">&gt; </span>` followed by the command text. Acts 3 to 5 use this. Act 1 has a visually hidden `<h1>`.

### Act 1: `identity` (`pin`, span `2.0`)

Stage content, top to bottom:
1. `<h1 className="sr-only">Gamaliel Leguista</h1>`
2. `<div data-sc-cue="0 0.9 0" className="overflow-x-auto pb-2"><AsciiArt /></div>`
3. On mobile only (`md:hidden`), directly under the banner: `<DevelopingPortrait src={assetPath("/portrait.jpg")} srcSet={`${assetPath("/portrait@2x.jpg")} 2x`} alt="Gamaliel Leguista" className="mt-6 w-[160px]" />`
4. A `<dl className="mt-10 space-y-4 max-w-xl">` of three status lines, each a `<div data-sc-cue="…" className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4">` with `<dt className="caps text-[12px] text-muted">` and `<dd className="text-[15.5px] leading-[1.6] text-text">`:
   - cue `"0.08 0.5"`: dt `&gt; whoami`, dd `AI Engineer · Full-Stack Developer`
   - cue `"0.26 0.72"`: dt `&gt; locale`, dd `Bronx, NY · EN / ES`
   - cue `"0.46 1"`: dt `&gt; status`, dd `Pursuit AI-Native fellowship · Urban Health Plan · concurrently`

### Act 2: `builds` (`flow`, the peak)

`<section id="builds" data-sc-act="flow" className="px-5 md:px-10 lg:px-20 pt-6 pb-16 md:pt-10 md:pb-24">` containing:
1. `<h2>` in the heading style: `ls builds/` then `<span className="ml-3 text-muted normal-case tracking-normal">05 entries. Open a row.</span>` (this is app copy, not a section counter; keep it).
2. `<BuildsList projects={projects} />` with `mt-8`.

### Act 3: `profile` (`pin`, span `2.4`)

Stage content (max width `max-w-[62ch]`):
1. `<h2>`: `cat profile.md`
2. `<div className="profile-lines relative mt-8 min-h-[16rem] md:min-h-[14rem]">` holding five `<p>` lines, each `className="absolute inset-x-0 top-0 text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.55] text-text"` with these cues and texts, exactly:
   - `"0 0.26 0"`: `I keep records for a living. At Urban Health Plan I have handled chart custody under HIPAA since 2023: who asked, what left, when it came back.`
   - `"0.18 0.44"`: `That is why the builds look the way they do. Sentry signs every movement pass. Raphel chains every site entry to the one before it. A record you can quietly edit is not a record.`
   - `"0.36 0.62"`: `Vantage ranks healthcare executives for a private equity client. I did not borrow the domain; I came from it.`
   - `"0.54 0.80"`: `I work in two languages. Raphel is built for Dominican construction sites. Daysi's site opens in Spanish. I have volunteered in the Dominican Republic with Light a Candle Foundation since 2016.`
   - `"0.72 1"`: `I take products end to end: discovery on site, a requirements document through three revisions, a live demo in front of Blackstone's investment team. Twenty CRM merged my fix for 27 languages.`
3. A static (no cue) `<p className="mt-10 caps text-[12px] text-muted">`: `Pursuit AI-Native fellowship since September 2025, alongside the clinic. Bronx, NY.`

### Act 4: `stack` (`pan`, span `1.8`)

Stage content is NOT centred with padding on the rail itself; the stage holds `<div className="flex h-full items-center">` then the rail: `<ul className="stack-rail flex items-stretch gap-8 pl-5 md:pl-10 lg:pl-20 pr-[40vw]" data-sc-pan="0.06">`. Items are `<li>` with `className="shrink-0 w-[clamp(17rem,24vw,22rem)] border border-rule bg-surface/60 p-6"` and `style={{ "--i": index } as React.CSSProperties}`:
- Item 0 (heading item, no border, transparent): the `<h2>` in heading style, `cat stack.txt`, plus `<p className="mt-4 text-[14.5px] leading-[1.7] text-muted max-w-[28ch]">Four groups. What I reach for when the pressure is on.</p>`
- Items 1 to 4: one per `skills` group: `<h3 className="caps text-[12px] text-signal">{label}</h3>` and `<ul className="mt-4 space-y-1.5 text-[14.5px] leading-[1.6] text-text/90">` with one `<li>` per item.
- Item 5 (closing note, same box style): `<p className="text-[14.5px] leading-[1.7] text-muted">The long form is on the resume.</p>` and an `<a href={assetPath("/resume.pdf")} target="_blank" rel="noreferrer" className="signal-link mt-4 inline-block text-[14.5px]">resume.pdf ↗</a>`.

Measure once in the browser: `document.querySelector(".stack-rail").scrollWidth - innerWidth` must be at least `innerWidth / 2` at 1440px wide. If it is not, widen `pr-[40vw]`.

### Act 5: `contact` (`pin`, span `1.4`, the closing act)

Stage content wrapped in a single `<div data-sc-cue="0 1 0 0" className="max-w-[62ch]">`:
1. `<h2>`: `ls contact/`
2. `<ul className="mt-6 space-y-4">` of three rows built by a local `ContactRow` (copy the current `ContactRow` grid layout from the existing `app/page.tsx`, minus `Reveal` and minus the `download` prop):
   - label `GitHub`, href `https://github.com/AmilGael`, display `github.com/AmilGael`
   - label `LinkedIn`, href `https://www.linkedin.com/in/gamaliel-leguista-725958191/`, display `linkedin.com/in/gamaliel-leguista`
   - label `Resume`, href `assetPath("/resume.pdf")`, display `resume.pdf`, opens in a new tab with `rel="noreferrer"`
3. `<Prompt />` with `mt-10`.

Nothing renders after this section. No footer.

## `components/BuildsList.tsx`

`"use client"`. Props: `{ projects: Project[] }`. Renders `<ol className="border-t border-rule" data-sc-in data-sc-stagger="60">` with one `<li className="border-b border-rule">` per project.

Row header: `<h3>` containing a `<button type="button" id={`build-${id}-button`} aria-expanded={open} aria-controls={`build-${id}-panel`} className="grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 px-2 py-4 text-left transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none md:grid-cols-[2.5rem_1fr_6rem_8rem_5rem]">` showing: `[0n]` index in `text-rule text-[12px]`; the name in `text-[1.05rem] md:text-[1.15rem] font-semibold tracking-[-0.01em] text-text`; year and status in `caps text-[11.5px] text-muted` (status hidden on mobile); a trailing cell that reads `live ↗` in `text-signal caps text-[11.5px]` when `project.live` exists, else `open` in `text-rule`. When the row is open, the `[0n]` index turns `text-signal` and a `&gt;` prefix appears before the name (`aria-hidden`).

Panel: `<div id={`build-${id}-panel`} role="region" aria-labelledby={`build-${id}-button`} className="build-panel" data-open={open}>` with a single inner `<div>` (the grid-rows trick needs exactly one child with `overflow: hidden`) containing `<div className="grid gap-x-8 gap-y-5 px-2 pb-8 pt-2 md:grid-cols-[9rem_1fr]">` of label/value pairs, labels `caps text-[11.5px] text-muted pt-1`, values `text-[14.5px] leading-[1.75] text-text/90`:
- `What it does` → `project.what`
- `My part` → `project.role`
- `Stack` → `project.stack.join(" · ")`
- `Live` → `<a className="signal-link" target="_blank" rel="noreferrer">` with `live.label` and a trailing `↗`, or the text `not deployed` in `text-muted`
- `Repo` → link the same way, or `private, available on request` in `text-muted`
- `With` → collaborators as links when `url` exists (same link style) joined by `, `, or `solo` in `text-muted`
- `Client` → only when present
- `Program` → only when present
- `Figures` → only when present: each as `<span className="tabular-nums text-[1.6rem] font-semibold text-text">{animated value}</span> <span className="caps text-[11.5px] text-muted">{label}</span>`; the number counts from 0 to the integer value over 500ms (ease-out, rAF) each time the panel opens, or shows the value immediately under `prefers-reduced-motion: reduce`.
Every link inside a closed panel gets `tabIndex={-1}` and the panel gets `aria-hidden={!open}`.

Behaviour:
- One open at a time (`useState<string | null>`). Clicking the open row closes it.
- On open: `history.replaceState(null, "", `#builds/${id}`)`; scroll so the row's top sits at 20% of the viewport (`window.scrollTo({ top: rowTop - innerHeight * 0.2, behavior })` where `behavior` is `"smooth"` unless reduced motion); dispatch `window.dispatchEvent(new CustomEvent("archive:open", { detail: { id } }))`. On close: `history.replaceState(null, "", "#builds")` and dispatch `archive:close`.
- After every open/close call `relayout()` immediately AND again on the panel's `transitionend` (the engine must re-measure the page once the height has settled).
- On mount: if `location.hash` matches `/^#builds\/([a-z0-9-]+)$/` and the id exists, open it and scroll to it with `behavior: "instant"`.
- Keyboard on the row buttons: ArrowDown/ArrowUp move focus to the next/previous button (wrapping), Home/End to first/last, Escape closes the open row and focuses its button. Enter/Space are native.

## `components/Prompt.tsx`

`"use client"`. A real `<form>` that composes an email.
- `<label htmlFor="line" className="caps text-[12px] text-muted">` reading `&gt; mail gamaleguista@gmail.com`
- `<div className="mt-3 flex items-baseline gap-3 border-b border-rule pb-2 focus-within:border-signal">` with `<span aria-hidden className="text-signal">&gt;</span>`, then `<input id="line" name="line" type="text" autoComplete="off" placeholder="Open a line. Type, then Enter." className="min-w-0 flex-1 bg-transparent text-[15.5px] text-text placeholder:text-muted focus:outline-none" />`, then a `<span aria-hidden className="prompt-caret text-signal">_</span>` shown only while the input is empty and not focused.
- `<button type="submit" className="signal-link mt-5 text-[13px] caps">Open a line</button>`
- On submit (`preventDefault`): `window.location.href = `mailto:gamaleguista@gmail.com?subject=${encodeURIComponent("From the archive")}&body=${encodeURIComponent(value)}``. Works with an empty body too.
- Under the button, one `<p className="mt-3 text-[12px] text-muted">`: `Hiring, or a product that needs building. Either one.`

## `components/Sidebar.tsx`

`"use client"`. Props: `{ menu: MenuItem[] }`. Keep the current two-part structure (desktop `<aside>` fixed left 30% column; mobile fixed top bar `md:hidden`), the current classes for both containers, and the `── Operator ──` / `FILE PHOTO · 2026` captions. Remove: the clock and `formatNycTime`, `AvatarFrame` and its dialog, all `isLanding` show/hide logic, `entry/total/status/view` props.

Desktop column, top to bottom:
1. Mark: `<a href="#identity" onClick=…>` styled like the current mark button (`GL // Archive`), scrolling to top.
2. Name `Gamaliel Leguista` in the current `1.7rem/1.95rem` semibold style; under it `AI Engineer · Full-Stack Developer` in `caps text-[11.5px] text-muted`.
3. `<TerminalMenu items={menu} activeId={active} onSelect={jump} variant="compact" />`
4. Portrait block: caption, `<DevelopingPortrait src={assetPath("/portrait.jpg")} srcSet={`${assetPath("/portrait@2x.jpg")} 2x`} alt="Gamaliel Leguista" className="w-full max-w-[160px]" />`, caption.
5. Readouts in a two-column grid (reuse the current `SidebarRow` label/value pattern without the animation class): `Pos` → `${String(index + 1).padStart(2, "0")} / 05 · ${activeId}` and `Status` → `receiving` by default, `open: ${id}` after an `archive:open` event, back to `receiving` on `archive:close`.
6. Footer line `Archive // NYC // {year}` as now.

Mobile top bar: mark, the `Status` value on the right, and the horizontal jump strip of `<a href="#id">` items (active one `text-signal`), as now.

State: `active` comes from `activeActId()` (from `@/lib/scrollcraft`) read in a rAF-throttled `scroll` listener plus `resize`, defaulting to `"identity"`. `jump(id)` scrolls `document.getElementById(id)` into view with `behavior: "smooth"` unless reduced motion, then focuses nothing (the acts are landmarks, not focus targets).

## `components/TerminalMenu.tsx`

Simplify `MenuItem` to `{ id: string; label: string }`. Rows become `<a href={`#${item.id}`}>` with `onClick` that calls `e.preventDefault()` then `onSelect(item.id)`. Keep the `── NAV ──` legend, the `[n]` index, the `>` marker, the hover/active classes and the `hero | compact` sizing exactly as they are. Drop the `download`/`external` branches.

## `app/globals.css` additions (append at the end)

```css
/* Builds list: height animates on the grid track so layout never jumps */
.build-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
}
.build-panel > div {
  overflow: hidden;
  opacity: 0;
  transition: opacity 320ms ease-out;
}
.build-panel[data-open="true"] { grid-template-rows: 1fr; }
.build-panel[data-open="true"] > div { opacity: 1; }

/* Stack rail: items settle in sequence as the act progresses (devices.md §3) */
@media (prefers-reduced-motion: no-preference) {
  [data-sc-act="pan"] .stack-rail > * {
    opacity: clamp(0.55, calc(var(--sc-p, 0) * 6 - var(--i, 0) + 1), 1);
  }
  [data-sc-act="pan"] .stack-rail > :first-child { opacity: 1; }
}

/* Profile lines stack vertically until the engine is driving them */
html:not(.sc-ready) .profile-lines > p { position: static; margin-top: 1rem; }
html:not(.sc-ready) [data-sc-cue] { opacity: 1; }

.prompt-caret { animation: caret-blink 1.1s steps(1) infinite; }
@keyframes caret-blink { 50% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .build-panel, .build-panel > div { transition: none; }
  .prompt-caret { animation: none; }
}
```

## Acceptance (run these yourself)

- `npm run lint` clean.
- `npx tsc --noEmit` clean.
- `NEXT_OUTPUT=export npm run build` succeeds.
- `grep -rn "—" app components lib` prints nothing. `grep -rn "ENTRY" app components` prints nothing. `grep -rn "transition: all\|transition-all" app components` prints nothing.
- `git status --short` shows only the files in the list (deletions included).
- Finish with a short list of what changed and the command results.
