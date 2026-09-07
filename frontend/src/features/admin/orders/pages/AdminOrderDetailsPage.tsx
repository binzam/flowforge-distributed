import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetOrder,
  useUpdateOrderStatus,
} from "../../../orders/hooks/order-hooks";
import type { OrderStatus } from "../../../orders/types/order-types";

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  pending: ["payment_pending", "cancelled"],
  payment_pending: ["paid", "failed", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  failed: [],
};

const AdminOrderDetailsPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const order = data?.data;

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading order...</div>;
  if (isError || !order)
    return <div className="py-12 text-red-600">Unable to load this order.</div>;

  const changeStatus = (status: OrderStatus) =>
    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: (error) => toast.error(error.message),
      },
    );

  return (
    <section>
      <Link to="/admin/orders" className="text-sm text-slate-500 underline">
        Back to orders
      </Link>
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Order</p>
          <h1 className="mt-1 text-3xl font-semibold">
            #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Customer ID: {order.userId}
          </p>
          <p className="text-sm text-slate-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Current status</p>
          <p className="mt-2 font-semibold uppercase">
            {order.status.replace("_", " ")}
          </p>
          <select
            disabled={
              updateStatus.isPending || nextStatuses[order.status].length === 0
            }
            value=""
            onChange={(event) =>
              changeStatus(event.target.value as OrderStatus)
            }
            className="mt-3 border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">
              {updateStatus.isPending ? "Updating..." : "Change status"}
            </option>
            {nextStatuses[order.status].map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Unit price</th>
              <th className="px-4 py-3">Line total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-4">{item.productId}</td>
                <td className="px-4 py-4">{item.quantity}</td>
                <td className="px-4 py-4">
                  ${Number(item.unitPrice).toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-right text-lg font-semibold">
        Total: ${Number(order.totalAmount).toFixed(2)}
      </p>
    </section>
  );
};

export default AdminOrderDetailsPage;
