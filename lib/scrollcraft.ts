let api: ScrollCraftApi | null = null;

export function mountScrollCraft(): ScrollCraftApi | null {
  if (api) return api;
  if (!window.ScrollCraft) return null;

  api = window.ScrollCraft.mount(document);
  return api;
}

export function relayout(): void {
  requestAnimationFrame(() => api?.layout());
}

export function activeActId(): string | null {
  const viewportMidpoint = window.innerHeight / 2;
  const acts = document.querySelectorAll<HTMLElement>("[data-sc-act]");

  for (const act of acts) {
    const rect = act.getBoundingClientRect();
    if (rect.top <= viewportMidpoint && rect.bottom >= viewportMidpoint) {
      return act.id || null;
    }
  }

  return null;
}
