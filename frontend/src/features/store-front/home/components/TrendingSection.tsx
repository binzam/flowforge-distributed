import ProductCard from "../../products/components/ProductCard";
import { useGetProducts } from "../../products/hooks/product-hooks";

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
