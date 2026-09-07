import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCurrentUser } from "@/features/auth/hooks/auth-hook";
import { useCreateOrder } from "@/features/orders/hooks/order-hooks";
import { useCartStore } from "../store/cart-store";
import { getCartTotal } from "../store/cart-utils";

const CartPage = () => {
  const navigate = useNavigate();
  const { data: user } = useGetCurrentUser();
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const createOrderMutation = useCreateOrder();

  const handleCreateOrder = () => {
    if (!user?.data.user) {
      navigate("/login");
      return;
    }
    createOrderMutation.mutate(
      {
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      },
      {
        onSuccess: (response) => {
          clear();
          toast.success("Order created successfully");
          navigate(`/orders/${response.data.id}`);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  if (items.length === 0)
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <Link to="/products" className="mt-6 inline-block underline">
          Browse products
        </Link>
      </div>
    );

  return (
    <section className="py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Your cart</h1>
      <div className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-4 py-6"
          >
            <div>
              <h2 className="font-medium">{product.name}</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {product.price} each
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => decreaseQuantity(product.id)}
                className="text-xl"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => increaseQuantity(product.id)}
                className="text-xl"
              >
                +
              </button>
              <button
                onClick={() => removeItem(product.id)}
                className="text-sm text-neutral-500 underline"
              >
                Remove
              </button>
            </div>
            <strong>${(Number(product.price) * quantity).toFixed(2)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl">
          Total <strong>${getCartTotal(items).toFixed(2)}</strong>
        </p>
        <button
          onClick={handleCreateOrder}
          disabled={createOrderMutation.isPending}
          className="bg-white px-6 py-3 text-sm font-semibold tracking-widest text-black disabled:opacity-50"
        >
          {createOrderMutation.isPending
            ? "CREATING..."
            : user?.data.user
              ? "CREATE ORDER"
              : "LOGIN TO CREATE ORDER"}
        </button>
      </div>
    </section>
  );
};

export default CartPage;
