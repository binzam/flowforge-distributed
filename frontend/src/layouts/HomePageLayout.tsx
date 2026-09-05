import { type ReactNode } from "react";
import { Header } from "../features/store-front/components/Header";
import { Footer } from "../features/store-front/components/Footer";

const HomePageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-white selection:text-black">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default HomePageLayout;
