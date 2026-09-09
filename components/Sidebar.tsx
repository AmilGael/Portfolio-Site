"use client";

import { useCallback, useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Portrait from "./Portrait";
import TerminalMenu, { type MenuItem } from "./TerminalMenu";
import { activeActId } from "@/lib/scrollcraft";

type Props = {
  menu: MenuItem[];
};

type ArchiveOpenDetail = {
  id: string;
};

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SidebarRow({
  label,
  value,
  valueClassName = "text-[15px] text-text",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="caps block text-[10.5px] text-muted">{label}</span>
      <span className={`block tabular-nums ${valueClassName}`}>{value}</span>
    </div>
  );
}

export default function Sidebar({ menu }: Props) {
  const [active, setActive] = useState("identity");
  const [status, setStatus] = useState("receiving");

  useEffect(() => {
    let frame: number | null = null;

    const updateActive = () => {
      frame = null;
      setActive(activeActId() ?? "identity");
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const { id } = (event as CustomEvent<ArchiveOpenDetail>).detail;
      setStatus(`open: ${id}`);
    };
    const handleClose = () => setStatus("receiving");

    window.addEventListener("archive:open", handleOpen);
    window.addEventListener("archive:close", handleClose);
    return () => {
      window.removeEventListener("archive:open", handleOpen);
      window.removeEventListener("archive:close", handleClose);
    };
  }, []);

  const jump = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const index = Math.max(
    0,
    menu.findIndex((item) => item.id === active),
  );

  const returnToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <>
      <aside className="pointer-events-none fixed left-0 top-0 bottom-0 z-40 hidden w-[30%] flex-col justify-between overflow-y-auto border-r border-rule bg-bg px-8 py-12 md:flex lg:px-12">
        <div className="pointer-events-auto">
          <a
            href="#identity"
            onClick={returnToTop}
            className="caps block text-left text-[12px] text-muted transition-colors hover:text-text"
            aria-label="Return to home"
          >
            <span className="text-signal">GL</span>
            <span className="mx-2 text-rule">//</span>
            <span>Archive</span>
          </a>
          <p className="mt-6 text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.03em] lg:text-[1.95rem]">
            Gamaliel
            <br />
            Leguista
          </p>
          <p className="caps mt-3 text-[11.5px] text-muted">
            AI Engineer · Full-Stack Developer
          </p>
        </div>

        <div className="pointer-events-auto mt-8">
          <TerminalMenu
            items={menu}
            activeId={active}
            onSelect={jump}
            variant="compact"
          />
        </div>

        <div className="pointer-events-auto mt-8 space-y-2">
          <span className="caps block text-[10.5px] text-muted">
            ── Operator ──
          </span>
          <Portrait className="w-full max-w-[160px]" />
          <span className="caps block text-[9.5px] text-muted">
            FILE PHOTO · 2026
          </span>
        </div>

        <div className="pointer-events-auto mt-8 grid grid-cols-2 gap-6">
          <SidebarRow
            label="Pos"
            value={`${String(index + 1).padStart(2, "0")} / 05 · ${active}`}
            valueClassName="text-[13px] text-text"
          />
          <SidebarRow
            label="Status"
            value={status}
            valueClassName="caps text-[13px] text-signal"
          />
        </div>

        <div className="pointer-events-auto caps text-[11px] text-muted/60">
          <span>Archive</span>
          <span className="mx-2">//</span>
          <span>NYC</span>
          <span className="mx-2">//</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </aside>

      <div className="fixed left-0 right-0 top-0 z-40 border-b border-rule bg-bg/95 px-4 py-2 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <a
            href="#identity"
            onClick={returnToTop}
            className="caps text-[11px] text-muted transition-colors hover:text-text"
          >
            <span className="text-signal">GL</span>
            <span className="mx-1.5 text-rule">//</span>
            Archive
          </a>
          <span className="caps text-[11px] text-text">{status}</span>
        </div>
        <div className="mt-2 -mx-1 flex gap-1 overflow-x-auto pb-1 text-[11px]">
          {menu.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                jump(item.id);
              }}
              className={`caps whitespace-nowrap px-2 py-1 transition-colors ${
                item.id === active ? "text-signal" : "text-muted"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
