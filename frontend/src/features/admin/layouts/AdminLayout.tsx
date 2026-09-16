import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const AdminLayout = () => {
  const location = useLocation();
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Suspense
              key={location.pathname}
              fallback={<LoadingScreen variant="outlet" label="FLOWFORGE" />}
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
