import { HeroSection } from "../components/HeroSection";
import { TrendingSection } from "../components/TrendingSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />

      <div className="w-full border-b border-neutral-800 bg-neutral-900 py-4 overflow-hidden">
        <p className="whitespace-nowrap text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase text-center">
          Free worldwide shipping on orders over $200 — Sustainably packaged —
          Designed in Tokyo
        </p>
      </div>

      <TrendingSection />

      <section className="border-t border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-auto lg:h-[70vh]">
          <div className="bg-neutral-900 h-96 lg:h-full flex items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-800">
            <span className="text-neutral-700 font-medium tracking-widest">
              EDITORIAL IMAGE
            </span>
          </div>
          <div className="flex flex-col justify-center px-8 py-16 sm:px-16 lg:px-24">
            <h2 className="text-3xl font-bold tracking-tighter mb-6">
              THE ART OF ESSENTIALISM
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-8 max-w-md">
              We believe in removing the noise. Our design philosophy centers
              around crafting products that offer visual calm and tactile
              satisfaction. Less, but better.
            </p>
            <button className="self-start text-sm font-semibold tracking-widest uppercase pb-1 border-b border-white hover:text-neutral-300 hover:border-neutral-300 transition-colors">
              Read the Journal
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
