export const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 pt-16 pb-8 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-16">
          <div className="md:col-span-2">
            <span className="text-2xl font-bold tracking-tighter text-white">
              FLOWFORGE.
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Elevating everyday essentials through meticulous design and
              sustainable craftsmanship. Built for the modern aesthete.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Latest Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Object Gallery
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-white uppercase mb-4">
              Connect
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Journal
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between border-t border-neutral-800 pt-8 text-xs">
          <p>
            &copy; {new Date().getFullYear()} FlowForge Studio. All rights
            reserved.
          </p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
