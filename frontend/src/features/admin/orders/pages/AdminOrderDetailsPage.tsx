import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { OrderStatus } from "../../../store-front/orders/types/order-types";
import type { Order } from "../types/order-types";
import { useGetOrder, useUpdateOrderStatus } from "../hooks/order-hooks";
import { dateFormatter } from "@/utils/date-formatter";
import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";

type OrderItem = Order["items"][number];

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

const orderItemColumns: DataTableColumnDef<OrderItem>[] = [
  {
    id: "product",
    header: "Product",
    accessorFn: (row) => row.product.name,
    cell: (info) => info.getValue<string>(),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: (info) => info.getValue<number>(),
  },
  {
    accessorKey: "unitPrice",
    header: "Unit price",
    cell: (info) => `$${Number(info.getValue<string>()).toFixed(2)}`,
  },
  {
    id: "lineTotal",
    header: "Line total",
    accessorFn: (row) => Number(row.unitPrice) * row.quantity,
    cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
  },
];

const AdminOrderDetailsPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const order = data?.data;

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading order...</div>;
  if (isError || !order)
    return (
      <div>
        <Link to="/admin/orders" className="text-sm text-slate-500 underline">
          Back to orders
        </Link>
        <div className="py-12 text-red-600">Unable to load this order.</div>
      </div>
    );

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
            Customer: {order.customer.name}
          </p>
          <p className="text-sm text-slate-500">
            {dateFormatter(order.createdAt)}
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

      <DataTable
        className="mt-8"
        tableId="order-items"
        columns={orderItemColumns}
        data={order.items}
        getRowId={(item) => item.product.id}
        emptyState="No items on this order."
      />

      <p className="mt-6 text-right text-lg font-semibold">
        Total: ${Number(order.totalAmount).toFixed(2)}
      </p>
    </section>
  );
};

export default AdminOrderDetailsPage;
