// Keep public asset URLs behind one seam so a future subpath deploy remains a
// one-variable change. The old hard-coded fallback existed for
// actions/configure-pages and is gone with it.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
