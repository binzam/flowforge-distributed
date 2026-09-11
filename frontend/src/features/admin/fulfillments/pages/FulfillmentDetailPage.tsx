import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetFulfillment,
  useUpdateFulfillmentStatus,
} from "../hooks/fulfillment-hooks";
import { dateFormatter } from "@/utils/date-formatter";
import type { FulfillmentStatus, OrderItem } from "../types/fulfillment-types";
import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";

interface FulfillmentMetricRow {
  metric: string;
  value: ReactNode;
}

const FULFILLMENT_STATUS_COLORS: Record<FulfillmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ALLOWED_STATUS_TRANSITIONS: Record<
  FulfillmentStatus,
  FulfillmentStatus[]
> = {
  pending: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const metricColumns: DataTableColumnDef<FulfillmentMetricRow>[] = [
  {
    accessorKey: "metric",
    header: "Metric",
    cell: (info) => (
      <span className="font-medium">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<ReactNode>()}</span>
    ),
  },
];

const itemsColumns: DataTableColumnDef<OrderItem>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: (info) => (
      <span className="font-medium">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: (info) => (
      <span className="text-slate-600 text-sm">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: (info) => (
      <span className="text-slate-600">
        {typeof info.getValue<number | string>() === "string"
          ? info.getValue<string>()
          : info.getValue<number>().toFixed(2)}
      </span>
    ),
  },
];

const FulfillmentDetailPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetFulfillment(id);
  const { mutate: updateStatus, isPending } = useUpdateFulfillmentStatus();
  const [selectedStatus, setSelectedStatus] = useState<FulfillmentStatus | "">(
    "",
  );

  const fulfillment = data?.data;

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading fulfillment...</div>;
  if (isError || !fulfillment)
    return (
      <div>
        <Link
          to="/admin/fulfillments"
          className="text-sm text-slate-500 underline"
        >
          Back to fulfillments
        </Link>
        <div className="py-12 text-red-600">
          Unable to load this fulfillment.
        </div>
      </div>
    );

  const statusColor =
    FULFILLMENT_STATUS_COLORS[fulfillment.status as FulfillmentStatus];
  const allowedTransitions =
    ALLOWED_STATUS_TRANSITIONS[fulfillment.status as FulfillmentStatus] || [];

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedStatus !== fulfillment.status) {
      updateStatus({
        id: fulfillment.id,
        input: { status: selectedStatus },
      });
      setSelectedStatus("");
    }
  };

  const metricRows: FulfillmentMetricRow[] = [
    { metric: "Fulfillment ID", value: fulfillment.id },
    { metric: "Order ID", value: fulfillment.orderId },
    { metric: "Customer Name", value: fulfillment.customerName },
    { metric: "Customer Email", value: fulfillment.customerEmail },
    { metric: "Total Amount", value: fulfillment.totalAmount },
    { metric: "Current Status", value: fulfillment.status },
    { metric: "Created", value: dateFormatter(fulfillment.createdAt) },
    { metric: "Last Updated", value: dateFormatter(fulfillment.updatedAt) },
  ];

  return (
    <section>
      <Link
        to="/admin/fulfillments"
        className="text-sm text-slate-500 underline"
      >
        Back to fulfillments
      </Link>
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Fulfillment Details</p>
          <h1 className="mt-1 text-3xl font-semibold">
            {fulfillment.id.slice(0, 8)}...
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Customer: {fulfillment.customerName}
          </p>
          <p className="text-sm text-slate-500">
            Email: {fulfillment.customerEmail}
          </p>
          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
            >
              {(fulfillment.status as FulfillmentStatus)
                .charAt(0)
                .toUpperCase() +
                (fulfillment.status as FulfillmentStatus).slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Order Total</p>
          <p className="mt-1 text-2xl font-semibold">
            {fulfillment.totalAmount}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div>
          <p className="text-sm text-slate-500">Order Items</p>
          <h3 className="mt-1 text-lg font-semibold">
            Items in Fulfillment ({fulfillment.items.length})
          </h3>
        </div>
        <DataTable
          className="mt-4"
          tableId="fulfillment-items"
          columns={itemsColumns}
          data={fulfillment.items}
          getRowId={(item) => item.productId}
        />
      </div>

      <div className="mt-8">
        <p className="text-sm text-slate-500">Details</p>
        <h3 className="mt-1 text-lg font-semibold">Fulfillment Information</h3>
        <DataTable
          className="mt-4"
          tableId="fulfillment-metrics"
          columns={metricColumns}
          data={metricRows}
          getRowId={(row) => row.metric}
        />
      </div>

      {allowedTransitions.length > 0 && (
        <div className="mt-8 border-t border-slate-200 pt-8">
          <div>
            <p className="text-sm text-slate-500">Update Status</p>
            <h3 className="mt-1 text-lg font-semibold">
              Change Fulfillment Status
            </h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as FulfillmentStatus)
              }
              className="border border-slate-300 px-3 py-2 text-sm"
              disabled={isPending}
            >
              <option value="">Select new status...</option>
              {allowedTransitions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || isPending}
              className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isPending ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FulfillmentDetailPage;
