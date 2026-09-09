"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  srcSet?: string;
  alt: string;
  className?: string;
};

const RAMP = " .:-=+*#%@";
const DISSOLVE_START = 0.6;
const SCROLL_LIMIT = 0.85;
const DEVELOP_DURATION_MS = 600;
const REDRAW_THRESHOLD = 0.004;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

export default function DevelopingPortrait({
  src,
  srcSet,
  alt,
  className,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latchedRef = useRef(false);
  const developRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const imageElement = imageRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !imageElement || !canvas) return;

    const showPhoto = () => {
      developRef.current = 1;
      imageElement.style.opacity = "1";
      canvas.style.opacity = "0";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      latchedRef.current = true;
      showPhoto();
      return;
    }

    const context = canvas.getContext("2d");
    const samplingCanvas = document.createElement("canvas");
    const samplingContext = samplingCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context || !samplingContext) {
      latchedRef.current = true;
      showPhoto();
      return;
    }

    imageElement.style.opacity = "0";
    canvas.style.opacity = "0";

    const sourceImage = new Image();
    let imageLoaded = false;
    let disposed = false;
    let failed = false;
    let cssWidth = 0;
    let cssHeight = 0;
    let currentDpr = 0;
    let lastDrawnDevelop = Number.NEGATIVE_INFINITY;

    const updateOpacities = (develop: number) => {
      if (!imageLoaded) {
        imageElement.style.opacity = "0";
        canvas.style.opacity = "0";
        return;
      }

      if (develop <= DISSOLVE_START) {
        imageElement.style.opacity = "0";
        canvas.style.opacity = "1";
        return;
      }

      const alpha = (develop - DISSOLVE_START) / (1 - DISSOLVE_START);
      imageElement.style.opacity = String(alpha);
      canvas.style.opacity = develop === 1 ? "0" : String(1 - alpha * 0.85);
    };

    const prepareSamplingCanvas = () => {
      if (!imageLoaded || cssWidth === 0 || cssHeight === 0) return;

      samplingCanvas.width = cssWidth;
      samplingCanvas.height = cssHeight;

      const scale = Math.max(
        cssWidth / sourceImage.naturalWidth,
        cssHeight / sourceImage.naturalHeight,
      );
      const drawWidth = sourceImage.naturalWidth * scale;
      const drawHeight = sourceImage.naturalHeight * scale;
      const drawX = (cssWidth - drawWidth) / 2;
      const drawY = (cssHeight - drawHeight) / 2;

      samplingContext.clearRect(0, 0, cssWidth, cssHeight);
      samplingContext.drawImage(
        sourceImage,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
      );
    };

    const resizeCanvases = () => {
      const rect = wrapper.getBoundingClientRect();
      const nextWidth = Math.max(0, Math.round(rect.width));
      const nextHeight = Math.max(0, Math.round(rect.height));
      const nextDpr = Math.max(1, window.devicePixelRatio || 1);

      if (
        nextWidth === cssWidth &&
        nextHeight === cssHeight &&
        nextDpr === currentDpr
      ) {
        return false;
      }

      cssWidth = nextWidth;
      cssHeight = nextHeight;
      currentDpr = nextDpr;

      canvas.width = Math.max(1, Math.round(cssWidth * currentDpr));
      canvas.height = Math.max(1, Math.round(cssHeight * currentDpr));
      context.setTransform(currentDpr, 0, 0, currentDpr, 0, 0);
      prepareSamplingCanvas();
      return true;
    };

    const drawCharacters = (develop: number) => {
      if (!imageLoaded || cssWidth === 0 || cssHeight === 0) return;

      const pixels = samplingContext.getImageData(
        0,
        0,
        cssWidth,
        cssHeight,
      ).data;
      const cell =
        develop <= DISSOLVE_START
          ? lerp(14, 4, develop / DISSOLVE_START)
          : 4;
      const step = Math.max(1, Math.round(cell));
      const rootStyles = getComputedStyle(document.documentElement);
      const surface = rootStyles.getPropertyValue("--surface").trim();
      const text = rootStyles.getPropertyValue("--text").trim();
      const signal = rootStyles.getPropertyValue("--signal").trim();
      const muted = rootStyles.getPropertyValue("--muted").trim();
      const fontFamily = getComputedStyle(document.body).fontFamily;

      context.clearRect(0, 0, cssWidth, cssHeight);
      context.fillStyle = surface;
      context.fillRect(0, 0, cssWidth, cssHeight);
      context.font = `${cell * 1.05}px ${fontFamily}`;
      context.textBaseline = "top";

      for (let y = 0; y < cssHeight; y += step) {
        const endY = Math.min(cssHeight, y + step);
        for (let x = 0; x < cssWidth; x += step) {
          const endX = Math.min(cssWidth, x + step);
          let luminanceSum = 0;
          let sampleCount = 0;

          for (let sampleY = y; sampleY < endY; sampleY += 1) {
            let pixelIndex = (sampleY * cssWidth + x) * 4;
            for (let sampleX = x; sampleX < endX; sampleX += 1) {
              luminanceSum +=
                pixels[pixelIndex] * 0.2126 +
                pixels[pixelIndex + 1] * 0.7152 +
                pixels[pixelIndex + 2] * 0.0722;
              sampleCount += 1;
              pixelIndex += 4;
            }
          }

          const luminance = luminanceSum / Math.max(1, sampleCount) / 255;
          const rampIndex = Math.round(luminance * (RAMP.length - 1));
          context.fillStyle =
            luminance > 0.72 ? text : luminance > 0.42 ? signal : muted;
          context.fillText(RAMP[rampIndex], x, y);
        }
      }
    };

    const applyDevelop = (develop: number, forceRedraw = false) => {
      developRef.current = develop;
      updateOpacities(develop);

      if (
        forceRedraw ||
        Math.abs(develop - lastDrawnDevelop) > REDRAW_THRESHOLD
      ) {
        drawCharacters(develop);
        if (imageLoaded) lastDrawnDevelop = develop;
      }
    };

    const calculateScrollDevelop = () => {
      const builds = document.getElementById("builds");
      const end = builds
        ? builds.offsetTop - window.innerHeight * 0.25
        : window.innerHeight * 2;
      const scrollDevelop = clamp(
        window.scrollY / Math.max(1, end),
        0,
        1,
      );
      return Math.min(scrollDevelop, SCROLL_LIMIT);
    };

    const scheduleScrollDevelop = () => {
      if (latchedRef.current || animationFrameRef.current !== null) return;
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        applyDevelop(calculateScrollDevelop());
      });
    };

    const handleArchiveOpen = () => {
      if (latchedRef.current) return;
      latchedRef.current = true;

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      const startingDevelop = developRef.current;
      let startedAt: number | null = null;

      const animate = (timestamp: number) => {
        if (disposed) return;
        startedAt ??= timestamp;
        const progress = clamp(
          (timestamp - startedAt) / DEVELOP_DURATION_MS,
          0,
          1,
        );
        const eased = 1 - Math.pow(1 - progress, 3);
        applyDevelop(lerp(startingDevelop, 1, eased));

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (resizeCanvases()) {
        applyDevelop(developRef.current, true);
      }
    });

    const stopInteractiveWork = () => {
      window.removeEventListener("scroll", scheduleScrollDevelop);
      window.removeEventListener("resize", scheduleScrollDevelop);
      window.removeEventListener("archive:open", handleArchiveOpen);
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const useFallback = () => {
      if (failed || disposed) return;
      failed = true;
      latchedRef.current = true;
      stopInteractiveWork();
      showPhoto();
    };

    sourceImage.onload = () => {
      if (disposed || failed) return;
      imageLoaded = true;
      resizeCanvases();
      prepareSamplingCanvas();
      applyDevelop(developRef.current, true);
    };
    sourceImage.onerror = useFallback;

    resizeCanvases();
    applyDevelop(
      latchedRef.current ? 1 : calculateScrollDevelop(),
      true,
    );
    resizeObserver.observe(wrapper);
    window.addEventListener("scroll", scheduleScrollDevelop, { passive: true });
    window.addEventListener("resize", scheduleScrollDevelop);
    window.addEventListener("archive:open", handleArchiveOpen);
    sourceImage.src = src;

    return () => {
      disposed = true;
      stopInteractiveWork();
      sourceImage.onload = null;
      sourceImage.onerror = null;
    };
  }, [src]);

  const wrapperClassName = [
    "relative aspect-[3/4] overflow-hidden border border-rule bg-surface",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Canvas sampling must match the rendered native image exactly. */}
      <img
        ref={imageRef}
        src={src}
        srcSet={srcSet}
        alt={alt}
        decoding="async"
        draggable={false}
        className="portrait-photo absolute inset-0 h-full w-full select-none object-cover"
        style={{ opacity: 0 }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
