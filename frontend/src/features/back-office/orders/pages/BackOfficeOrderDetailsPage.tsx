import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { dateFormatter } from "@/utils/date-formatter";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { OrderStatus } from "../../../store-front/orders/types/order-types";
import PageHeaderWrapper from "../../layouts/PageHeaderWrapper";
import PageTableWrapper from "../../layouts/PageTableWrapper";
import { useGetOrder, useUpdateOrderStatus } from "../hooks/order-hooks";
import type { Order } from "../types/order-types";

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

const BackOfficeOrderDetailsPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const order = data?.data;

  if (isError || !order)
    return (
      <div>
        <Link to="/portal/orders" className="text-sm text-slate-500 underline">
          Back to orders
        </Link>
        <div className="py-12 text-red-600">Unable to load this order.</div>
      </div>
    );

  const currentStatus = order.status.toLowerCase() as OrderStatus;
  const availableStatuses = nextStatuses[currentStatus] || [];

  const changeStatus = (status: string) => {
    if (!status) return;

    updateStatus.mutate(
      { id: order.id, status: status as OrderStatus },
      {
        onSuccess: () => toast.success("Order status updated"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <section>
      <PageHeaderWrapper>
        <Link to="/portal/orders" className="text-sm text-slate-500 underline">
          Back to orders
        </Link>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm text-slate-500">Order</p>
            <p className="mt-2 text-sm text-slate-500">
              Customer: {order.customer?.name ?? "Unknown"}
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
                updateStatus.isPending || availableStatuses.length === 0
              }
              value=""
              onChange={(event) => changeStatus(event.target.value)}
              className="mt-3 border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">
                {updateStatus.isPending ? "Updating..." : "Change status"}
              </option>
              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </PageHeaderWrapper>
      <PageTableWrapper>
        <DataTable
          className="mt-8"
          tableId="order-items"
          columns={orderItemColumns}
          data={order.items}
          isLoading={isLoading}
          getRowId={(item) => item.product.id}
          emptyState="No items on this order."
        />
        <p className="mt-6 text-right text-lg font-semibold">
          Total: ${Number(order.totalAmount).toFixed(2)}
        </p>
      </PageTableWrapper>
    </section>
  );
};

export default BackOfficeOrderDetailsPage;
