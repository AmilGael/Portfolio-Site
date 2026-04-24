"use client";

import { useEffect, useRef, useState } from "react";
import TerminalMenu, { type MenuItem } from "./TerminalMenu";
import { assetPath } from "@/lib/paths";

type Props = {
  entry: string;
  total: string;
  status: string;
  view: string;
  menu: MenuItem[];
  onNav: (id: string) => void;
};

export default function Sidebar({
  entry,
  total,
  status,
  view,
  menu,
  onNav,
}: Props) {
  const [clock, setClock] = useState<string>(() => formatNycTime(new Date()));

  useEffect(() => {
    const tick = () => setClock(formatNycTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const isLanding = view === "landing";

  return (
    <>
      {/* Desktop: fixed left column, full-height */}
      <aside className="pointer-events-none fixed left-0 top-0 bottom-0 z-40 hidden w-[30%] flex-col justify-between overflow-y-auto border-r border-rule bg-bg px-8 py-12 md:flex lg:px-12">
        <div
          className={`pointer-events-auto transition-all duration-500 ease-out ${
            !isLanding ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
          aria-hidden={isLanding}
        >
          <button
            type="button"
            onClick={() => onNav("landing")}
            className="caps block text-left text-[12px] text-muted transition-colors hover:text-text"
            aria-label="Return to home"
          >
            <span className="text-signal">GL</span>
            <span className="mx-2 text-rule">//</span>
            <span>Archive</span>
          </button>
          <p className="mt-6 text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.03em] lg:text-[1.95rem]">
            Gamaliel
            <br />
            Leguista
          </p>
          <p className="caps mt-3 text-[11.5px] text-muted">
            Engineer · Writer · Operator
          </p>
        </div>

        <div
          className={`pointer-events-auto mt-8 transition-all duration-500 ease-out ${
            !isLanding
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
          aria-hidden={isLanding}
        >
          <TerminalMenu
            items={menu}
            activeId={view}
            onSelect={onNav}
            variant="compact"
          />
        </div>

        <div className="pointer-events-auto mt-8 space-y-6">
          <AvatarFrame
            src={assetPath("/IMG_0779.png")}
            alt="Gamaliel Leguista"
            caption="FILE PHOTO · 2026"
          />
          <SidebarRow
            label="Local Time"
            value={clock}
            valueClassName="text-[22px] tracking-[0.02em] text-text"
            liveKey={clock}
          />
          <div className="grid grid-cols-2 gap-6">
            <SidebarRow
              label="Status"
              value={status}
              valueClassName="caps text-[14.5px] text-signal"
              liveKey={status}
            />
            <SidebarRow
              label="View"
              value={`${entry} / ${total}`}
              valueClassName="text-[16px] tabular-nums text-text"
              liveKey={entry}
            />
          </div>
        </div>

        <div className="pointer-events-auto caps text-[11px] text-rule">
          <span>Archive</span>
          <span className="mx-2">//</span>
          <span>NYC</span>
          <span className="mx-2">//</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </aside>

      {/* Mobile: top bar with inline menu */}
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-rule bg-bg/95 px-4 py-2 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNav("landing")}
            className="caps text-[11px] text-muted transition-colors hover:text-text"
          >
            <span className="text-signal">GL</span>
            <span className="mx-1.5 text-rule">//</span>
            Archive
          </button>
          <span className="caps text-[11px] text-muted">
            <span key={status} className="sidebar-value text-text">
              {status}
            </span>
          </span>
        </div>
        <div className="mt-2 -mx-1 flex gap-1 overflow-x-auto pb-1 text-[11px]">
          {menu.map((item) => {
            const active = item.id === view;
            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  download={item.download || undefined}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="caps whitespace-nowrap px-2 py-1 text-muted"
                >
                  {item.label}
                  {item.download && (
                    <span className="ml-1 text-signal">↓</span>
                  )}
                </a>
              );
            }
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNav(item.id)}
                className={`caps whitespace-nowrap px-2 py-1 transition-colors ${
                  active ? "text-signal" : "text-muted"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AvatarFrame({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setErrored(true);
    }
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  const openable = loaded && !errored;

  return (
    <div className="space-y-2">
      <span className="caps block text-[10.5px] text-rule">── Operator ──</span>
      <button
        type="button"
        onClick={() => openable && setExpanded(true)}
        aria-label={openable ? "Expand photo" : "Photo"}
        className={`group relative block w-full max-w-[140px] overflow-hidden border border-rule bg-surface text-left transition-colors ${
          openable ? "cursor-zoom-in hover:border-signal" : "cursor-default"
        }`}
      >
        <div className="relative aspect-square w-full">
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity duration-500 ${
              loaded && !errored ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden={loaded && !errored}
          >
            <span className="text-[28px] font-semibold leading-none text-muted">
              GL
            </span>
            <span className="caps text-[9.5px] text-rule">
              {errored ? "image pending" : "loading"}
            </span>
          </div>

          {!errored && (
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {openable && (
            <span
              aria-hidden
              className="caps pointer-events-none absolute bottom-1 right-1 bg-bg/80 px-1.5 py-0.5 text-[8.5px] text-signal opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              [ expand ]
            </span>
          )}
        </div>
      </button>
      <span className="caps block text-[9.5px] text-rule">{caption}</span>

      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photo"
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/92 p-6 backdrop-blur-sm md:p-12"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full max-w-full"
          >
            <img
              src={src}
              alt={alt}
              className="block max-h-[85vh] max-w-[85vw] border border-rule bg-surface object-contain"
            />
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="caps absolute -top-9 right-0 text-[11px] tracking-[0.16em] text-signal hover:text-text"
            >
              [ close ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarRow({
  label,
  value,
  valueClassName = "text-[15px] text-text",
  liveKey,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  liveKey?: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="caps block text-[10.5px] text-rule">{label}</span>
      <span
        key={liveKey ?? value}
        className={`sidebar-value block tabular-nums ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

function formatNycTime(d: Date) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(d);
    const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${lookup.hour}:${lookup.minute}:${lookup.second} EST`;
  } catch {
    return d.toISOString().slice(11, 19);
  }
}
