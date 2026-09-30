import type { Placement } from "@floating-ui/react";
import type { ReactNode } from "react";
import type { TourSelector } from "./tour-targets";

export interface TourStep {
  /** Selector for the element to highlight. Build it with `tourSelector(id)`. */
  target: TourSelector;
  title: string;
  content: ReactNode;
  /** Preferred side for the coach-mark card. Falls back automatically if there's no room. */
  placement?: Placement;
  /** Space (px) between the highlighted element and the spotlight edge. Default 8. */
  padding?: number;
  /** Corner radius (px) of the spotlight cutout. Default 12. */
  radius?: number;
  /** Runs before this step is measured — e.g. switch tabs/views so the target exists. */
    onBeforeShow?: () => void | Promise<void>;
  /** Skip the automatic scroll-into-view for this step. */
  disableScroll?: boolean;
}

/** A named, ordered sequence of steps. */
export interface Tour {
  id: string;
  steps: TourStep[];
}

export interface TourContextValue {
  activeTourId: string | null;
  stepIndex: number;
  totalSteps: number;
  isRunning: boolean;
  startTour: (tour: Tour) => void;
  stopTour: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  hasSeenTour: (tourId: string) => boolean;
}
