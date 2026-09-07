import type { CartItem } from "./cart-store";

export const getCartItemCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);
export const getCartTotal = (items: CartItem[]) =>
  items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  );
