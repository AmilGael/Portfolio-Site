"use client";

import { useEffect, useMemo, useState } from "react";

const COLS = 180;
const ROWS = 90;
const FLIP_INTERVAL_MS = 280;
const FLIPS_PER_TICK = 9;

function randomRow(): string {
  let out = "";
  for (let i = 0; i < COLS; i++) out += Math.random() < 0.5 ? "1" : "0";
  return out;
}

function randomRows(): string[] {
  return Array.from({ length: ROWS }, randomRow);
}

function flip(bit: string): string {
  return bit === "1" ? "0" : "1";
}

export default function BinaryBackground() {
  // Start empty on the server so SSR and client agree on first render.
  const [rows, setRows] = useState<string[]>(() =>
    Array(ROWS).fill("".padEnd(COLS, " ")),
  );

  useEffect(() => {
    setRows(randomRows());

    const id = window.setInterval(() => {
      setRows((prev) => {
        if (prev.length === 0) return prev;
        const next = prev.slice();
        for (let i = 0; i < FLIPS_PER_TICK; i++) {
          const r = Math.floor(Math.random() * ROWS);
          const c = Math.floor(Math.random() * COLS);
          const row = next[r];
          if (row[c] === "0" || row[c] === "1") {
            next[r] = row.slice(0, c) + flip(row[c]) + row.slice(c + 1);
          }
        }
        return next;
      });
    }, FLIP_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  const text = useMemo(() => rows.join("\n"), [rows]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        // Feather the edges so the texture reads as atmosphere, not a wall of numbers
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 85% at 60% 45%, black 30%, transparent 95%)",
        maskImage:
          "radial-gradient(ellipse 90% 85% at 60% 45%, black 30%, transparent 95%)",
      }}
    >
      <pre
        className="ascii absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-rule"
        style={{
          fontSize: "11px",
          lineHeight: 1.15,
          letterSpacing: "0.15em",
          opacity: 0.85,
        }}
      >
        {text}
      </pre>
    </div>
  );
}
