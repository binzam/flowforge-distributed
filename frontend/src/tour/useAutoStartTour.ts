import { useEffect } from "react";
import { useTour } from "./TourContext";
import type { Tour } from "./types";

/**
 * Starts a tour automatically the first time a user reaches a view, unless
 * they've already seen it (tracked in localStorage) or a tour is already
 * running. Handy for first-run onboarding — call it once near the top of
 * the view the tour belongs to.
 */
export function useAutoStartTour(
  tour: Tour,
  options: { enabled?: boolean; delay?: number } = {},
) {
  const { enabled = true, delay = 500 } = options;
  const { startTour, hasSeenTour, isRunning } = useTour();

  useEffect(() => {
    if (!enabled || isRunning || hasSeenTour(tour.id)) return;
    const timer = window.setTimeout(() => startTour(tour), delay);
    return () => window.clearTimeout(timer);
  }, [tour.id, enabled]);
}
