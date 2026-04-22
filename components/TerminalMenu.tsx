"use client";

export type MenuItem = {
  id: string;
  label: string;
  href: string;
  download?: boolean;
  external?: boolean;
};

type Props = {
  items: MenuItem[];
  activeId: string;
};

export default function TerminalMenu({ items, activeId }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="relative border border-rule px-0 pb-4 pt-6"
    >
      <span
        aria-hidden
        className="caps absolute left-4 top-0 -translate-y-1/2 bg-bg px-2 text-[10.5px] tracking-[0.16em] text-signal"
      >
        ── NAV ──
      </span>

      <ul className="space-y-[2px]">
        {items.map((item, i) => {
          const active = item.id === activeId;
          const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (item.download || item.external) return;
            e.preventDefault();
            const el = document.getElementById(item.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              history.replaceState(null, "", `#${item.id}`);
            }
          };
          return (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={onClick}
                download={item.download || undefined}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className={`group flex items-baseline gap-2 px-4 py-[5px] text-[13.5px] leading-tight transition-colors duration-200 ${
                  active
                    ? "bg-surface text-text"
                    : "text-muted hover:bg-surface hover:text-text"
                }`}
              >
                <span
                  aria-hidden
                  className={`w-[0.9em] text-signal ${active ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
                >
                  &gt;
                </span>
                <span className="w-[1.6em] text-rule">
                  [{i + 1}]
                </span>
                <span className="truncate">{item.label}</span>
                {item.download && (
                  <span aria-hidden className="ml-auto text-signal">
                    ↓
                  </span>
                )}
                {item.external && !item.download && (
                  <span aria-hidden className="ml-auto text-rule">
                    ↗
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
