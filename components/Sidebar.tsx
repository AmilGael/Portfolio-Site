"use client";

import { useEffect, useState } from "react";
import TerminalMenu, { type MenuItem } from "./TerminalMenu";

type Props = {
  entry: string;
  total: string;
  status: string;
  showIdentity: boolean;
  activeId: string;
  menu: MenuItem[];
};

export default function Sidebar({
  entry,
  total,
  status,
  showIdentity,
  activeId,
  menu,
}: Props) {
  const [clock, setClock] = useState<string>(() => formatNycTime(new Date()));

  useEffect(() => {
    const tick = () => setClock(formatNycTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      {/* Desktop: fixed left column, full-height, internally scrolls if tight */}
      <aside className="pointer-events-none fixed left-0 top-0 bottom-0 z-40 hidden w-[30%] flex-col justify-between overflow-y-auto border-r border-rule px-8 py-12 md:flex lg:px-12">
        <div
          className={`pointer-events-auto transition-all duration-700 ease-out ${
            showIdentity
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
          aria-hidden={!showIdentity}
        >
          <div className="caps text-[12px] text-muted">
            <span className="text-signal">GL</span>
            <span className="mx-2 text-rule">//</span>
            <span>Archive</span>
          </div>
          <p className="mt-6 text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.03em] lg:text-[1.95rem]">
            Gamaliel
            <br />
            Leguista
          </p>
          <p className="caps mt-3 text-[11.5px] text-muted">
            Engineer · Writer · Operator
          </p>
        </div>

        <div className="pointer-events-auto mt-8">
          <TerminalMenu items={menu} activeId={activeId} />
        </div>

        <div className="pointer-events-auto mt-8 space-y-6">
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
              label="Entry"
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

      {/* Mobile: thin top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-rule bg-bg/95 px-4 py-3 backdrop-blur md:hidden">
        <span className="caps text-[11px] text-muted">
          <span className="text-signal">GL</span>
          <span className="mx-1.5 text-rule">//</span>
          Archive
        </span>
        <span className="caps text-[11px] text-muted">
          <span key={status} className="sidebar-value text-text">
            {status}
          </span>
          <span className="mx-1.5 text-rule">·</span>
          <span key={entry} className="sidebar-value">
            {entry} / {total}
          </span>
        </span>
      </div>
    </>
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
