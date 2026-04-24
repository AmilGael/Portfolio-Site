"use client";

export type MenuItem = {
  id: string;
  label: string;
  href?: string;
  download?: boolean;
  external?: boolean;
};

type Props = {
  items: MenuItem[];
  activeId: string;
  onSelect: (id: string) => void;
  variant?: "hero" | "compact";
};

export default function TerminalMenu({
  items,
  activeId,
  onSelect,
  variant = "compact",
}: Props) {
  const rowSize =
    variant === "hero"
      ? "text-[16px] px-5 py-2"
      : "text-[13.5px] px-4 py-[5px]";
  const legendSize =
    variant === "hero" ? "text-[12px]" : "text-[10.5px]";
  const framePad = variant === "hero" ? "pt-8 pb-5" : "pt-6 pb-4";
  const indexWidth = variant === "hero" ? "w-[2em]" : "w-[1.6em]";

  return (
    <nav
      aria-label="Primary"
      className={`relative inline-block min-w-[16rem] border border-rule ${framePad}`}
    >
      <span
        aria-hidden
        className={`caps absolute left-4 top-0 -translate-y-1/2 bg-bg px-2 tracking-[0.16em] text-signal ${legendSize}`}
      >
        ── NAV ──
      </span>

      <ul className="space-y-[2px]">
        {items.map((item, i) => {
          const active = item.id === activeId;
          const isLink = Boolean(item.href);

          const rowClass = `group flex items-baseline gap-2 leading-tight transition-colors duration-200 ${rowSize} ${
            active
              ? "bg-surface text-text"
              : "text-muted hover:bg-surface hover:text-text"
          }`;

          const inner = (
            <>
              <span
                aria-hidden
                className={`w-[0.9em] text-signal ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                }`}
              >
                &gt;
              </span>
              <span className={`${indexWidth} text-rule`}>[{i + 1}]</span>
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
            </>
          );

          return (
            <li key={item.id}>
              {isLink ? (
                <a
                  href={item.href}
                  download={item.download || undefined}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className={rowClass}
                >
                  {inner}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`${rowClass} w-full text-left`}
                >
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
