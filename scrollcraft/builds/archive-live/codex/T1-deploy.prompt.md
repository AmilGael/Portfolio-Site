# T1-deploy: move the static export from GitHub Pages (subpath) to Netlify (root)

You are editing a Next.js 14 App Router static-export site (`output: "export"`). Read `CLAUDE.md` first; its rules apply. Do NOT commit. Do NOT add dependencies. Do NOT touch any file outside the list below.

## Files you may change

- `next.config.mjs` (edit)
- `lib/paths.ts` (edit)
- `netlify.toml` (create)
- `public/_headers` (create)
- `.github/workflows/deploy.yml` (delete; remove the now-empty `.github/` directory)
- `public/.nojekyll` (delete)
- `CLAUDE.md` (edit the deploy-related sections only)
- `README.md` (edit: nothing yet except the deploy note at the very bottom if one exists; leave the project list alone, it is replaced in a later task)

## Required behaviour

1. **basePath comes only from `NEXT_PUBLIC_BASE_PATH`.** In `next.config.mjs`:
   - `const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";`
   - Static export is enabled when `process.env.NEXT_OUTPUT === "export"`. Remove the `GITHUB_ACTIONS` trigger and every hard-coded `/Portfolio-Site` string.
   - Keep: `reactStrictMode`, `poweredByHeader: false`, `images: { unoptimized: true }`, `trailingSlash: isStaticExport`, `assetPrefix: basePath || undefined`, the `env.NEXT_PUBLIC_BASE_PATH` passthrough, and the `headers()` block for hosts that run Next at request time (it stays a no-op on static hosts).
   - Update the top-of-file comment so it describes the new reality (Netlify at root; subpath only if `NEXT_PUBLIC_BASE_PATH` is set). Comments explain why, not what.
2. **`lib/paths.ts`:** remove `PRODUCTION_FALLBACK` and the `NODE_ENV === "production"` branch. `BASE_PATH` is `process.env.NEXT_PUBLIC_BASE_PATH ?? ""`. Keep `assetPath()` with the same signature and the same "non-slash paths pass through" behaviour. Rewrite the comment: `assetPath` remains the single seam for any future subpath deploy; the hard-coded fallback existed for `actions/configure-pages` and is gone with it.
3. **`netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "out"

   [build.environment]
     NEXT_OUTPUT = "export"
     NODE_VERSION = "20"
   ```
4. **`public/_headers`** (Netlify header file format: a `/*` path line, then two-space-indented `Header: value` lines). It must carry the SAME policy as the `securityHeaders` array in `next.config.mjs`, production form (no `'unsafe-eval'`, no `ws:`). Header list: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-DNS-Prefetch-Control`. Keep `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'` (Next's static export inlines scripts and styles). Keep `font-src 'self'` (next/font self-hosts). Keep `frame-ancestors 'none'`. Drop `frame-src 'self'` from BOTH places (the in-page PDF iframe is being removed). Everything else in the array stays.
   The policy is duplicated (config array for Node hosts, `_headers` for Netlify); add a one-line comment in `next.config.mjs` above `cspDirectives` saying `public/_headers` must be kept in sync with it.
5. **Delete** `.github/workflows/deploy.yml` and `public/.nojekyll`.
6. **`CLAUDE.md`:** update the intro line (deployed to Netlify from `main`, served at the site root on a `*.netlify.app` subdomain until a domain exists), the "Critical: the basePath gotcha" section (the site is now served from the root; `assetPath()` stays mandatory for every `public/` reference so a future subpath deploy is a one-variable change; the WRONG/RIGHT example stays), the "Static-export constraints" bullet about `headers()` (now: `public/_headers` is the live policy on Netlify; `headers()` only matters on Node hosts; keep both in sync), and the "Deploy" section (Netlify reads `netlify.toml`, sets `NEXT_OUTPUT=export`, publishes `out/`; `NEXT_PUBLIC_BASE_PATH` is unset; never hard-code a basePath anywhere). Keep the rest of the file byte-for-byte.

## Acceptance (run these yourself before finishing)

- `npm run lint` clean.
- `npx tsc --noEmit` clean.
- `NEXT_OUTPUT=export npm run build` succeeds and `grep -rl "Portfolio-Site" out/ | wc -l` prints `0`.
- `git status --short` shows only the files listed above.
- Finish with a short list of what changed and the three command results. No prose beyond that.
