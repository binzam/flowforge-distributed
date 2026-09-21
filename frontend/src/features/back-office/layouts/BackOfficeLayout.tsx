import { Outlet, useLocation } from "react-router-dom";
import BackOfficeHeader from "./BackOfficeHeader";
import BackOfficeSidebar from "./BackOfficeSidebar";
import { Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const BackOfficeLayout = () => {
  const location = useLocation();
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      <BackOfficeSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <BackOfficeHeader />
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
