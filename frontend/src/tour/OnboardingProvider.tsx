import type { ReactNode } from "react";
import { TourProvider } from "./onboarding";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  return (
    <TourProvider
      classNames={{
        footer: "flex-col",
      }}
    >
      {children}
    </TourProvider>
  );
}
