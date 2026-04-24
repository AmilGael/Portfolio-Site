// Prefix a public asset URL with the deployment basePath so that images, PDFs,
// and iframe sources resolve correctly when the site is served from a subpath
// like /Portfolio-Site/ on GitHub Pages. Empty in local dev and on Vercel.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE}${path}`;
}
