import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

const StoreFrontLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-white selection:text-black flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StoreFrontLayout;
