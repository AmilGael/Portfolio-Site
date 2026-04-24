// Prefix a public asset URL with the deployment basePath so that images, PDFs,
// and iframe sources resolve correctly when the site is served from a subpath
// like /Portfolio-Site/ on GitHub Pages.
//
// Priority:
//   1. NEXT_PUBLIC_BASE_PATH env var (propagated through next.config.mjs)
//   2. Hardcoded /Portfolio-Site on any production build
//   3. Empty string in dev
//
// The hardcoded fallback exists because actions/configure-pages@v5 with
// static_site_generator: next can strip Next.js config env blocks. If you
// later deploy to Vercel/Netlify at the root (no basePath), remove the
// production fallback below.
const envBase = process.env.NEXT_PUBLIC_BASE_PATH;
const PRODUCTION_FALLBACK = "/Portfolio-Site";

const BASE_PATH =
  envBase && envBase !== ""
    ? envBase
    : process.env.NODE_ENV === "production"
      ? PRODUCTION_FALLBACK
      : "";

export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
