import {
  FloatingArrow,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { TourStep } from "./types";
import { visibleRectFromElement } from "./utils";

interface TourCardProps {
  step: TourStep;
  targetEl: HTMLElement | null;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onGoTo: (index: number) => void;
}

const ARROW_HEIGHT = 10;
const ARROW_WIDTH = 28;
const VIEWPORT_PADDING = 16;

export function TourCard({
  step,
  targetEl,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onGoTo,
}: TourCardProps) {
  const arrowRef = useRef<SVGSVGElement>(null);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const { refs, floatingStyles, context, placement, middlewareData } =
    useFloating({
      placement: step.placement ?? "bottom",
      // animationFrame keeps the card glued to the target through smooth
      // scrolling and late layout shifts (e.g. table rows arriving).
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, { animationFrame: true }),
      middleware: [
        offset(16),
        // Try the opposite side (and the perpendicular ones) if there's no room.
        flip({ padding: VIEWPORT_PADDING }),
        // crossAxis + no limiter: when no side fits (target fills the
        // viewport), pull the card inside the viewport even if it overlaps
        // the target, instead of leaving it cropped off screen.
        shift({ padding: VIEWPORT_PADDING, crossAxis: true }),
        // eslint-disable-next-line react-hooks/refs
        arrow({ element: arrowRef, padding: 12 }),
      ],
    });

  // Anchor to the on-screen part of the target, not its full box.
  useEffect(() => {
    if (!targetEl) {
      refs.setPositionReference(null);
      return;
    }
    refs.setPositionReference({
      contextElement: targetEl,
      getBoundingClientRect: () => visibleRectFromElement(targetEl),
    });
  }, [targetEl, refs]);

  // If shift had to move the card along the side axis, it now overlaps the
  // target and the arrow would point at the wrong place — hide it.
  const side = placement.split("-")[0];
  const sideAxisShift =
    side === "top" || side === "bottom"
      ? middlewareData.shift?.y
      : middlewareData.shift?.x;
  const isDocked = Math.abs(sideAxisShift ?? 0) > 0.5;

  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className="z-[10001] w-[min(360px,90vw)]"
    >
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, scale: 0.96, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-label={`Guided tour, step ${stepIndex + 1} of ${totalSteps}`}
        className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-surface-raised shadow-popover"
      >
        {!isDocked && (
          <FloatingArrow
            ref={arrowRef}
            context={context}
            width={ARROW_WIDTH}
            height={ARROW_HEIGHT}
            fill="var(--color-surface-raised)"
          />
        )}

        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pt-4">
          <p className="font-mono text-[11px] tracking-wide text-text-faint uppercase">
            Step {stepIndex + 1} of {totalSteps}
          </p>
          <button
            type="button"
            onClick={onSkip}
            aria-label="Skip tour"
            className="cursor-pointer rounded-full p-1 text-text-faint transition-colors hover:bg-ink-900/5 hover:text-text-primary"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-5 pb-4 pt-1">
          <h3 className="font-display text-lg font-semibold leading-snug text-text-primary">
            {step.title}
          </h3>
          <div className="mt-1.5 text-[13.5px] leading-relaxed text-text-muted">
            {step.content}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 shrink-0 items-center justify-between border-t border-ink-900/[0.06] bg-surface-sunken/60 px-5 py-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                onClick={() => onGoTo(i)}
                className="cursor-pointer p-1"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === stepIndex ? "w-4 bg-amber-500" : "w-1.5 bg-ink-900/15"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-[13px] font-medium text-text-muted transition-colors hover:bg-ink-900/5 hover:text-text-primary"
              >
                <ArrowLeft size={14} strokeWidth={2.25} />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1 text-[13px] font-semibold text-ink-950 shadow-sm transition-colors hover:bg-amber-600"
            >
              {isLast ? "Finish" : "Next"}
              {isLast ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <ArrowRight size={14} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
