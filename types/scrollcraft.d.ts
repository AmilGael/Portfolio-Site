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
