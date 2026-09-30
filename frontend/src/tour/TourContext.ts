import { createContext, useContext } from "react";
import type { TourContextValue } from "./types";

export const TourContext = createContext<TourContextValue | null>(null);

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTour must be used within a <TourProvider>");
  }
  return ctx;
}
