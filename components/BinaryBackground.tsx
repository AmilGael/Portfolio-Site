"use client";

import { useEffect, useRef } from "react";

const MASK =
  "radial-gradient(ellipse 90% 85% at 60% 45%, black 30%, transparent 95%)";
const FONT_SIZE = 11;
const ROW_HEIGHT = FONT_SIZE * 1.15;
const LETTER_SPACING = FONT_SIZE * 0.15;
const FLIPS_PER_TICK = 9;
const FLIP_INTERVAL_MS = 280;
const RESIZE_DEBOUNCE_MS = 150;

export default function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let bits = new Uint8Array(0);
    let cols = 0;
    let rows = 0;
    let colAdvance = 0;
    let intervalId: number | null = null;
    let resizeTimeoutId: number | null = null;

    const configureContext = () => {
      const fontFamily = getComputedStyle(document.body).fontFamily;
      const rule = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--rule").trim();

      context.font = `${FONT_SIZE}px ${fontFamily}`;
      context.textBaseline = "top";
      context.fillStyle = rule;
      context.globalAlpha = 0.85;
      colAdvance = context.measureText("0").width + LETTER_SPACING;
    };

    const drawGrid = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.ceil(rect.width));
      const height = Math.max(1, Math.ceil(rect.height));
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      configureContext();

      cols = Math.ceil(width / colAdvance) + 1;
      rows = Math.ceil(height / ROW_HEIGHT) + 1;
      bits = new Uint8Array(cols * rows);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const index = row * cols + col;
          const bit = Math.random() < 0.5 ? 0 : 1;
          bits[index] = bit;
          context.fillText(String(bit), col * colAdvance, row * ROW_HEIGHT);
        }
      }
    };

    const flipCells = () => {
      for (let flip = 0; flip < FLIPS_PER_TICK; flip += 1) {
        const index = Math.floor(Math.random() * bits.length);
        const row = Math.floor(index / cols);
        const col = index % cols;
        const nextBit = bits[index] === 0 ? 1 : 0;
        const x = col * colAdvance;
        const y = row * ROW_HEIGHT;

        bits[index] = nextBit;
        context.clearRect(x, y, colAdvance, ROW_HEIGHT);
        context.fillText(String(nextBit), x, y);
      }
    };

    const stopInterval = () => {
      if (intervalId === null) return;
      window.clearInterval(intervalId);
      intervalId = null;
    };

    const startInterval = () => {
      if (reducedMotion || document.hidden || intervalId !== null) return;
      intervalId = window.setInterval(flipCells, FLIP_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        startInterval();
      }
    };

    const handleResize = () => {
      if (resizeTimeoutId !== null) {
        window.clearTimeout(resizeTimeoutId);
      }
      resizeTimeoutId = window.setTimeout(() => {
        resizeTimeoutId = null;
        drawGrid();
      }, RESIZE_DEBOUNCE_MS);
    };

    drawGrid();
    window.addEventListener("resize", handleResize);

    if (!reducedMotion) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      startInterval();
    }

    return () => {
      stopInterval();
      if (resizeTimeoutId !== null) {
        window.clearTimeout(resizeTimeoutId);
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ WebkitMaskImage: MASK, maskImage: MASK }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
