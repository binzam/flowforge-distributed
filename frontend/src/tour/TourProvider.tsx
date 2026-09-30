import { useCallback, useMemo, useState, type ReactNode } from "react";
import { TourContext } from "./TourContext";
import { TourOverlay } from "./TourOverlay";
import type { Tour, TourContextValue } from "./types";

const STORAGE_PREFIX = "ekub.tour.seen.";

function readSeen(tourId: string): boolean {
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + tourId) === "1";
  } catch {
    return false;
  }
}

function writeSeen(tourId: string): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + tourId, "1");
  } catch {
    // Private browsing / disabled storage — not marking as seen just means
    // the tour may auto-offer itself again, which is a fine fallback.
  }
}

export function TourProvider({ children }: { children: ReactNode }) {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const startTour = useCallback((tour: Tour) => {
    if (tour.steps.length === 0) return;
    setActiveTour(tour);
    setStepIndex(0);
  }, []);

  const stopTour = useCallback(() => {
    setActiveTour((current) => {
      if (current) writeSeen(current.id);
      return null;
    });
    setStepIndex(0);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (!activeTour) return;
      setStepIndex(Math.min(Math.max(index, 0), activeTour.steps.length - 1));
    },
    [activeTour],
  );

  const next = useCallback(() => {
    if (!activeTour) return;
    if (stepIndex + 1 >= activeTour.steps.length) {
      writeSeen(activeTour.id);
      setActiveTour(null);
      setStepIndex(0);
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [activeTour, stepIndex]);

  const prev = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const value = useMemo<TourContextValue>(
    () => ({
      activeTourId: activeTour?.id ?? null,
      stepIndex,
      totalSteps: activeTour?.steps.length ?? 0,
      isRunning: activeTour !== null,
      startTour,
      stopTour,
      next,
      prev,
      goTo,
      hasSeenTour: readSeen,
    }),
    [activeTour, stepIndex, startTour, stopTour, next, prev, goTo],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {activeTour && (
        <TourOverlay
          tour={activeTour}
          stepIndex={stepIndex}
          onNext={next}
          onPrev={prev}
          onSkip={stopTour}
          onGoTo={goTo}
        />
      )}
    </TourContext.Provider>
  );
}
