import { Link, useSearchParams } from "react-router-dom";
import { useGetMyOrders } from "../hooks/order-hooks";
import type { OrderStatus } from "../types/order-types";

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const MyOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "0");
  const { data, isLoading, isError } = useGetMyOrders({
    limit: 20,
    offset: page * 20,
  });
  const totalPages = Math.ceil((data?.total ?? 0) / 20);

  if (isLoading)
    return (
      <div className="py-24 text-center text-neutral-400">
        Loading your orders...
      </div>
    );
  if (isError)
    return (
      <div className="py-24 text-center text-red-400">
        Unable to load your orders.
      </div>
    );

  return (
    <section className="py-12">
      <p className="text-xs tracking-[0.3em] text-neutral-500">ACCOUNT</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">My orders</h1>
      {data?.data.length ? (
        <div className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
          {data.data.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-4 py-6 hover:bg-neutral-900/50"
            >
              <div>
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <span className="border border-neutral-700 px-3 py-1 text-xs uppercase tracking-widest">
                {order.status.replace("_", " ") as OrderStatus}
              </span>
              <strong>${Number(order.totalAmount).toFixed(2)}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-neutral-400">
          You have not placed an order yet.
        </p>
      )}
      {(data?.total ?? 0) > 20 && (
        <div className="mt-6 flex justify-end gap-3 text-sm">
          <button
            disabled={page === 0}
            onClick={() => setSearchParams({ page: String(page - 1) })}
            className="underline disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setSearchParams({ page: String(page + 1) })}
            className="underline disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default MyOrdersPage;
