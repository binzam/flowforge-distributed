import type { Product } from "../types/product-types";
import { useCartStore } from "../../cart/store/cart-store";
import { toast } from "react-toastify";
import { useGetCurrentUser } from "@/features/auth/hooks/auth-hook";

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { data: currentUser } = useGetCurrentUser();
  const role = currentUser?.data.user.role;
  const canAddToCart = role === undefined || role === "customer";

  const handleAddToCart = () => {
    if (!canAddToCart) {
      toast.error("Only customer accounts can add items to cart");
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div key={product.id} className="group cursor-pointer">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-900 mb-4">
        <div className="absolute inset-0 bg-neutral-800 transition-transform duration-500 group-hover:scale-105" />

        {canAddToCart && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="w-full bg-white py-3 text-xs font-semibold tracking-widest text-black hover:bg-neutral-200"
            >
              ADD TO CART
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-start text-sm">
        <div>
          <h3 className="font-medium text-white">{product.name}</h3>
          <p className="mt-1 text-neutral-500">{product.description}</p>
        </div>
        <p className="font-medium text-white">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
