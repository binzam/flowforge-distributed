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

const InventoryDetailPage = () => {
  const { productId = "" } = useParams();
  const { data, isLoading, isError } = useGetInventory(productId);
  const inventory = data?.data;

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading inventory...</div>;
  if (isError || !inventory)
    return (
      <div>
        <Link
          to="/admin/inventory"
          className="text-sm text-slate-500 underline"
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
      <Link to="/admin/inventory" className="text-sm text-slate-500 underline">
        Back to inventory
      </Link>
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Product</p>
          <h1 className="mt-1 text-3xl font-semibold">
            {inventory.productName}
          </h1>
          <p className="mt-2 text-sm text-slate-500">SKU: {inventory.sku}</p>
          <p className="text-sm text-slate-500">
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
