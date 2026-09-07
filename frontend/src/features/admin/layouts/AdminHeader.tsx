import { useLogoutUser } from "../../auth/hooks/auth-hook";

const AdminHeader = () => {
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutUser();
  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
      {/* Left side (e.g., Mobile Menu Button or Breadcrumbs) */}
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
          {/* Hamburger Icon Placeholder */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-sm font-medium text-slate-500 hidden sm:block">
          Dashboard / Overview
        </h1>
      </div>

      {/* Right side (e.g., Profile, Notifications) */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300"></div>
        <button onClick={() => logoutUser()}>
          {isLoggingOut ? "Good Bye" : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
