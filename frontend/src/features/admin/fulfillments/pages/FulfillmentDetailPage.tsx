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
  pending: "bg-yellow-50 text-yellow-900 border border-yellow-200",
  processing: "bg-blue-50 text-blue-900 border border-blue-200",
  packed: "bg-purple-50 text-purple-900 border border-purple-200",
  shipped: "bg-indigo-50 text-indigo-900 border border-indigo-200",
  delivered: "bg-green-50 text-green-900 border border-green-200",
  cancelled: "bg-red-50 text-red-900 border border-red-200",
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
      <span
        className="font-medium"
        style={{ color: "var(--brand-dark-green)" }}
      >
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: (info) => (
      <span style={{ color: "var(--brand-green)" }}>
        {info.getValue<ReactNode>()}
      </span>
    ),
  },
];

const itemsColumns: DataTableColumnDef<OrderItem>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: (info) => (
      <span
        className="font-medium"
        style={{ color: "var(--brand-dark-green)" }}
      >
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: (info) => (
      <span style={{ color: "var(--brand-green)" }}>
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: (info) => (
      <span style={{ color: "var(--brand-green)" }}>
        {info.getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: (info) => (
      <span style={{ color: "var(--brand-green)" }}>
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
    return (
      <div className="py-12" style={{ color: "var(--brand-green)" }}>
        Loading fulfillment...
      </div>
    );
  if (isError || !fulfillment)
    return (
      <div>
        <Link
          to="/admin/fulfillments"
          className="text-sm underline"
          style={{ color: "var(--brand-green)" }}
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
        className="text-sm underline"
        style={{ color: "var(--brand-green)" }}
      >
        Back to fulfillments
      </Link>
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Fulfillment Details
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
            {fulfillment.id.slice(0, 8)}...
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--brand-green)" }}>
            Customer: {fulfillment.customerName}
          </p>
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
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
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Order Total
          </p>
          <p
            className="mt-1 text-2xl font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
            {fulfillment.totalAmount}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div>
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Order Items
          </p>
          <h3
            className="mt-1 text-lg font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
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
        <p className="text-sm" style={{ color: "var(--brand-green)" }}>
          Details
        </p>
        <h3
          className="mt-1 text-lg font-semibold"
          style={{ color: "var(--brand-dark-green)" }}
        >
          Fulfillment Information
        </h3>
        <DataTable
          className="mt-4"
          tableId="fulfillment-metrics"
          columns={metricColumns}
          data={metricRows}
          getRowId={(row) => row.metric}
        />
      </div>

      {allowedTransitions.length > 0 && (
        <div
          className="mt-8 border-t pt-8"
          style={{ borderColor: "var(--brand-light-green)" }}
        >
          <div>
            <p className="text-sm" style={{ color: "var(--brand-green)" }}>
              Update Status
            </p>
            <h3
              className="mt-1 text-lg font-semibold"
              style={{ color: "var(--brand-dark-green)" }}
            >
              Change Fulfillment Status
            </h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as FulfillmentStatus)
              }
              className="px-3 py-2 text-sm border rounded"
              style={{ borderColor: "var(--brand-light-green)" }}
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
              className="text-white px-4 py-2 text-sm font-medium rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--brand-light-green)" }}
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
