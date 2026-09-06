import { useGetProducts } from "../hooks/product-hooks";

export const TrendingSection = () => {
  const { data } = useGetProducts();
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter">
              CURATED OBJECTS
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Our latest studio editions.
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:block text-sm font-medium uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {data?.data.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 mb-4">
                <div className="absolute inset-0 bg-neutral-800 transition-transform duration-500 group-hover:scale-105" />

                <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button className="w-full bg-white py-3 text-xs font-semibold tracking-widest text-black hover:bg-neutral-200">
                    ADD TO CART
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start text-sm">
                <div>
                  <h3 className="font-medium text-white">{product.name}</h3>
                  <p className="mt-1 text-neutral-500">{product.description}</p>
                </div>
                <p className="font-medium text-white">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
