import {
    DataTable,
    type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { dateFormatter } from "@/utils/date-formatter";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeaderWrapper from "../../layouts/PageHeaderWrapper";
import PageTableWrapper from "../../layouts/PageTableWrapper";
import { useGetInventory } from "../hooks/inventory-hooks";

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

  if (isError || !inventory)
    return (
      <div>
        <Link
          to="/portal/inventory"
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
    <section className="flex flex-col h-full">
      <PageHeaderWrapper>
        <Link
          to="/portal/inventory"
          className="text-sm text-slate-500 underline"
        >
          Back to inventory
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
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
      </PageHeaderWrapper>
      <PageTableWrapper>
        <DataTable
          tableId="inventory-metrics"
          columns={metricColumns}
          data={metricRows}
          isLoading={isLoading}
          getRowId={(row) => row.metric}
        />
      </PageTableWrapper>
    </section>
  );
};

export default InventoryDetailPage;
