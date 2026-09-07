import ProductCard from "../components/ProductCard";
import { useGetProducts } from "../hooks/product-hooks";

const ProductsPage = () => {
  const { data, isLoading, isError } = useGetProducts();

  if (isLoading)
    return (
      <div className="py-24 text-center text-neutral-400">
        Loading products...
      </div>
    );
  if (isError)
    return (
      <div className="py-24 text-center text-red-400">
        Unable to load products.
      </div>
    );

  return (
    <section className="py-12">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] text-neutral-500">
          THE COLLECTION
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Products</h1>
      </div>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsPage;
