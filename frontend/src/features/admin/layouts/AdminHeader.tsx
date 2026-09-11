import { useLogoutUser } from "../../auth/hooks/auth-hook";

const AdminHeader = () => {
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutUser();
  return (
    <header
      className="h-16 shrink-0 border-b flex items-center justify-between px-4 md:px-6"
      style={{
        backgroundColor: "var(--brand-cream)",
        borderColor: "var(--brand-light-green)",
      }}
    >
      {/* Left side (e.g., Mobile Menu Button or Breadcrumbs) */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-md transition-colors"
          style={{ color: "var(--brand-green)" }}
        >
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
        <h1
          className="text-sm font-medium hidden sm:block"
          style={{ color: "var(--brand-dark-green)" }}
        >
          Dashboard / Overview
        </h1>
      </div>

      {/* Right side (e.g., Profile, Notifications) */}
      <div className="flex items-center gap-4">
        <div
          className="h-8 w-8 rounded-full border"
          style={{
            backgroundColor: "var(--brand-light-green)",
            borderColor: "var(--brand-green)",
          }}
        ></div>
        <button
          onClick={() => logoutUser()}
          className="px-3 py-2 rounded text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--brand-light-green)",
            color: "white",
          }}
        >
          {isLoggingOut ? "Good Bye" : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
