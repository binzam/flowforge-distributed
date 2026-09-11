import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetInventory } from "../hooks/inventory-hooks";
import { dateFormatter } from "@/utils/date-formatter";
import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";

interface InventoryMetricRow {
  metric: string;
  value: ReactNode;
}

const metricColumns: DataTableColumnDef<InventoryMetricRow>[] = [
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

const InventoryDetailPage = () => {
  const { productId = "" } = useParams();
  const { data, isLoading, isError } = useGetInventory(productId);
  const inventory = data?.data;

  if (isLoading)
    return (
      <div className="py-12" style={{ color: "var(--brand-green)" }}>
        Loading inventory...
      </div>
    );
  if (isError || !inventory)
    return (
      <div>
        <Link
          to="/admin/inventory"
          className="text-sm underline"
          style={{ color: "var(--brand-green)" }}
        >
          Back to inventory
        </Link>
        <div className="py-12 text-red-600">Unable to load this inventory.</div>
      </div>
    );

  const metricRows: InventoryMetricRow[] = [
    { metric: "Total Quantity", value: inventory.quantity },
    { metric: "Reserved Quantity", value: inventory.reservedQuantity },
    { metric: "Available Quantity", value: inventory.availableQuantity },
    { metric: "Created", value: dateFormatter(inventory.createdAt) },
  ];

  return (
    <section>
      <Link
        to="/admin/inventory"
        className="text-sm underline"
        style={{ color: "var(--brand-green)" }}
      >
        Back to inventory
      </Link>
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Product
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
            {inventory.productName}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--brand-green)" }}>
            SKU: {inventory.sku}
          </p>
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Last updated: {dateFormatter(inventory.updatedAt)}
          </p>
        </div>
      </div>

      <DataTable
        className="mt-8"
        tableId="inventory-metrics"
        columns={metricColumns}
        data={metricRows}
        getRowId={(row) => row.metric}
      />
    </section>
  );
};

export default InventoryDetailPage;
