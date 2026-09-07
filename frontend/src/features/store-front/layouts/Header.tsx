import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetCurrentUser, useLogoutUser } from "../../auth/hooks/auth-hook";

export const Header = () => {
  const { data: user } = useGetCurrentUser();

  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="text-neutral-400 hover:text-white md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <Link
            to="/"
            className="text-xl font-bold tracking-tighter text-white"
          >
            FLOWFORGE.
          </Link>
        </div>

        <nav className="hidden space-x-8 md:block text-sm font-medium tracking-wide text-neutral-400">
          <Link to="/shop" className="hover:text-white transition-colors">
            SHOP
          </Link>
          <Link
            to="/collections"
            className="hover:text-white transition-colors"
          >
            COLLECTIONS
          </Link>
          <Link to="/studio" className="hover:text-white transition-colors">
            STUDIO
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            ABOUT
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-neutral-400">
          <button className="hover:text-white transition-colors">
            <Search className="h-5 w-5" />
          </button>
          {!user?.data ? (
            <Link to="/login" className="hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <button onClick={() => logoutUser()}>
              {isLoggingOut ? "Good Bye" : "Logout"}
            </button>
          )}
          <button className="hover:text-white transition-colors relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
