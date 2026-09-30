import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TourCard } from "./TourCard";
import type { Tour } from "./types";
import {
  buildSpotlightPath,
  rectFromElement,
  waitForElement,
  type Rect,
} from "./utils";

interface TourOverlayProps {
  tour: Tour;
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onGoTo: (index: number) => void;
}

const DEFAULT_PADDING = 4;
const DEFAULT_RADIUS = 12;
/** Targets taller than this fraction of the viewport are scrolled to their top. */
const TALL_TARGET_RATIO = 0.6;

function scrollTargetIntoView(el: HTMLElement) {
  const isTall =
    el.getBoundingClientRect().height > window.innerHeight * TALL_TARGET_RATIO;
  el.scrollIntoView({
    behavior: "smooth",
    // Centering a huge element shows its middle; its top is what people expect.
    block: isTall ? "start" : "center",
    inline: "nearest",
  });
}

export function TourOverlay({
  tour,
  stepIndex,
  onNext,
  onPrev,
  onSkip,
  onGoTo,
}: TourOverlayProps) {
  const step = tour.steps[stepIndex];
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  // Created once; state (unlike a ref) is safe to read during render.
  const [portalNode] = useState<HTMLElement>(() => {
    const node = document.createElement("div");
    node.setAttribute("data-tour-portal", tour.id);
    return node;
  });

  // Mount/unmount the portal root against document.body.
  useEffect(() => {
    document.body.appendChild(portalNode);
    return () => {
      portalNode.remove();
    };
  }, [portalNode]);

  // Track viewport size so the backdrop path always covers the full screen.
  useEffect(() => {
    const onResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Locate this step's target element (waiting out any navigation or view
  // switch triggered by onBeforeShow), then scroll it into view.
  useEffect(() => {
    let cancelled = false;
    const currentStep = tour.steps[stepIndex];

    async function locate() {
      await currentStep.onBeforeShow?.();
      if (cancelled) return;
      const el = await waitForElement(currentStep.target);
      if (cancelled) return;
      if (!el) {
        console.warn(
          `[tour] Could not find target "${currentStep.target}" — skipping ahead.`,
        );
        onNext();
        return;
      }
      setTargetEl(el);
      if (!currentStep.disableScroll) {
        scrollTargetIntoView(el);
      }
    }

    void locate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, stepIndex]);

  // Continuously track the target's on-screen position (covers scrolling,
  // resizing, and any layout shift) without needing separate scroll listeners.
  useEffect(() => {
    if (!targetEl) return;
    let frame: number;
    const measure = () => {
      const next = rectFromElement(targetEl);
      setRect((prev) => {
        if (
          prev &&
          Math.abs(prev.x - next.x) < 0.5 &&
          Math.abs(prev.y - next.y) < 0.5 &&
          Math.abs(prev.width - next.width) < 0.5 &&
          Math.abs(prev.height - next.height) < 0.5
        ) {
          return prev;
        }
        return next;
      });
      frame = requestAnimationFrame(measure);
    };
    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [targetEl]);

  // Keyboard navigation.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
      else if (e.key === "ArrowRight" || e.key === "Enter") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext, onPrev, onSkip]);

  const padding = step.padding ?? DEFAULT_PADDING;
  const radius = step.radius ?? DEFAULT_RADIUS;
  const clipPath = rect
    ? buildSpotlightPath(viewport.width, viewport.height, rect, padding, radius)
    : undefined;

  const ringStyle = rect
    ? {
        left: rect.x - padding,
        top: rect.y - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius: radius,
      }
    : undefined;

  return createPortal(
    <AnimatePresence>
      {rect && (
        <motion.div
          key="tour-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9998"
        >
          {/* Dark, blurred backdrop with a rounded-rect hole over the target. */}
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-[1px] transition-[clip-path] duration-420 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ clipPath }}
            aria-hidden
          />

          {/* Decorative highlight ring around the spotlighted element. */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="pointer-events-none absolute z-10000 animate-[tour-pulse_2.4s_ease-in-out_infinite] ring-6 ring-amber-500/80"
            style={ringStyle}
          />

          {/* Screen-reader announcement of the current step. */}
          <p role="status" aria-live="polite" className="sr-only">
            Step {stepIndex + 1} of {tour.steps.length}: {step.title}
          </p>

          <AnimatePresence mode="wait">
            <TourCard
              key={stepIndex}
              step={step}
              targetEl={targetEl}
              stepIndex={stepIndex}
              totalSteps={tour.steps.length}
              onNext={onNext}
              onPrev={onPrev}
              onSkip={onSkip}
              onGoTo={onGoTo}
            />
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    portalNode,
  );
}
