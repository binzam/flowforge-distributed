import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative h-[85vh] w-full flex items-center border-b border-neutral-800">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 opacity-50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl lg:text-8xl">
            FORM MEETS <br className="hidden sm:block" /> FUNCTION.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-400">
            A curated collection of minimalist essentials designed to seamlessly
            integrate into your daily rhythm.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <button className="group flex items-center justify-center gap-2 bg-white px-8 py-4 text-sm font-semibold tracking-wide text-black transition-transform hover:bg-neutral-200">
              SHOP COLLECTION
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="text-sm font-medium tracking-wide text-white hover:text-neutral-300 underline-offset-4 hover:underline">
              DISCOVER STUDIO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
