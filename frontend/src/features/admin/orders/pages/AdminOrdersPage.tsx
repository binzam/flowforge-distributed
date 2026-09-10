import { Link, useSearchParams } from "react-router-dom";
import {
  ORDER_STATUSES,
  type OrderStatus,
} from "../../../store-front/orders/types/order-types";
import { useGetOrders } from "../hooks/order-hooks";
import { dateFormatter } from "@/utils/date-formatter";

const PAGE_SIZE = 10;

const AdminOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") as OrderStatus | null;
  const userId = searchParams.get("userId") ?? "";
  const page = Number(searchParams.get("page") ?? "0");
  const { data, isLoading, isError } = useGetOrders({
    status: status ?? undefined,
    userId: userId || undefined,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  const setFilter = (value: string) =>
    setSearchParams({
      ...(status ? { status } : {}),
      ...(userId ? { userId } : {}),
      ...(value ? { status: value } : {}),
      page: "0",
    });
  const setUserFilter = (value: string) =>
    setSearchParams({
      ...(status ? { status } : {}),
      ...(value ? { userId: value } : {}),
      page: "0",
    });
  const setPage = (nextPage: number) =>
    setSearchParams({
      ...(status ? { status } : {}),
      ...(userId ? { userId } : {}),
      page: String(nextPage),
    });

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading orders...</div>;
  if (isError)
    return <div className="py-12 text-red-600">Unable to load orders.</div>;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Operations</p>
          <h1 className="mt-1 text-3xl font-semibold">Orders</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={userId}
            onChange={(event) => setUserFilter(event.target.value)}
            placeholder="Filter customer ID"
            className="border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={status ?? ""}
            onChange={(event) => setFilter(event.target.value)}
            className="border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-4">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="font-medium underline"
                  >
                    #{order.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {order.customer.name}
                </td>
                <td className="px-4 py-4 uppercase text-slate-600">
                  {order.status.replace("_", " ")}
                </td>
                <td className="px-4 py-4">
                  ${Number(order.totalAmount).toFixed(2)}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {dateFormatter(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <span>{data?.total ?? 0} orders</span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 py-1">
            {totalPages === 0 ? 0 : page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminOrdersPage;
