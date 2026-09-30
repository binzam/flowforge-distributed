import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BackOfficeHeader from "./BackOfficeHeader";
import BackOfficeSidebar from "./BackOfficeSidebar";
import { Suspense, useMemo, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useAutoStartTour, useTour } from "@/tour";
import { createDashboardTour } from "@/tour/dashboardTour";
import { useAuth } from "@/features/auth/hooks/use-auth";

const BackOfficeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view] = useState<"dashboard" | "members">("dashboard");
  const { startTour } = useTour();

  const dashboardTour = useMemo(
    () => createDashboardTour({ role: user?.role, navigate }),
    [user?.role, navigate],
  );
  useAutoStartTour(dashboardTour, { enabled: view === "dashboard" });

  function handleStartTour() {
    startTour(dashboardTour);
  }
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      <BackOfficeSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <BackOfficeHeader onStartTour={handleStartTour} />
        <main className="flex-1 flex flex-col overflow-y-auto scroll-container">
          <Suspense
            key={location.pathname}
            fallback={<LoadingScreen variant="outlet" label="FLOWFORGE" />}
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default BackOfficeLayout;
