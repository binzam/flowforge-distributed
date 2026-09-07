import { Link, useParams } from "react-router-dom";
import { useGetOrder } from "../hooks/order-hooks";

const OrderDetailsPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetOrder(id);
  const order = data?.data;

  if (isLoading)
    return (
      <div className="py-24 text-center text-neutral-400">Loading order...</div>
    );
  if (isError || !order)
    return (
      <div className="py-24 text-center text-red-400">
        Unable to load this order.
      </div>
    );

  return (
    <section className="py-12">
      <Link to="/orders" className="text-sm text-neutral-400 underline">
        Back to orders
      </Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-neutral-500">ORDER</p>
          <h1 className="mt-3 text-4xl font-semibold">
            #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="border border-neutral-700 px-3 py-1 text-xs uppercase tracking-widest">
          {order.status.replace("_", " ")}
        </span>
      </div>
      <div className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap justify-between gap-4 py-5"
          >
            <div>
              <p className="font-medium">
                Product #{item.productId.slice(0, 8)}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Quantity {item.quantity} at ${Number(item.unitPrice).toFixed(2)}
              </p>
            </div>
            <strong>
              ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>
      <p className="mt-8 text-right text-xl">
        Total <strong>${Number(order.totalAmount).toFixed(2)}</strong>
      </p>
    </section>
  );
};

export default OrderDetailsPage;
