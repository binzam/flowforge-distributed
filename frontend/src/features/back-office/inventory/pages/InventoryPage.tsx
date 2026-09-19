import {
    DataTable,
    type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import { dateFormatter } from "@/utils/date-formatter";
import { Link } from "react-router-dom";
import PageHeaderWrapper from "../../layouts/PageHeaderWrapper";
import PageTableWrapper from "../../layouts/PageTableWrapper";
import { useGetInventories } from "../hooks/inventory-hooks";
import type { Inventory } from "../types/inventory-types";

const PAGE_SIZE = 20;

const columns: DataTableColumnDef<Inventory>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: (info) => (
      <Link
        to={`/portal/inventory/${info.row.original.productId}`}
        className="font-medium underline"
      >
        {info.getValue<string>()}
      </Link>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<string>()}</span>
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
    accessorKey: "reservedQuantity",
    header: "Reserved",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "availableQuantity",
    header: "Available",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: (info) => (
      <span className="text-slate-600">
        {dateFormatter(info.getValue<string>())}
      </span>
    ),
  },
];

const InventoryPage = () => {
  const { filters, page, setFilter, setPage } = useListQueryParams([
    "productId",
  ] as const);

  const { data, isLoading, isError } = useGetInventories({
    productId: filters.productId,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  return (
    <section>
      <PageHeaderWrapper className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Manage</p>
          <h1 className="mt-1 text-3xl font-semibold">Inventory</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={filters.productId ?? ""}
            onChange={(event) => setFilter("productId", event.target.value)}
            placeholder="Filter product ID"
            className="border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </PageHeaderWrapper>
      <PageTableWrapper>
        <DataTable
          tableId="admin-inventory"
          columns={columns}
          data={data?.data ?? []}
          getRowId={(item) => item.id}
          isLoading={isLoading}
          isError={isError}
          loadingState={
            <div className="py-12 text-slate-500">Loading inventory...</div>
          }
          errorState={
            <div className="py-12 text-red-600">Unable to load inventory.</div>
          }
          emptyState="No inventory items found."
        />
      </PageTableWrapper>
      <div className="sticky bottom-0 bg-white/90 px-4 md:px-6 lg:px-8 py-2 border-t border-yellow-700">
        <DataTablePagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          itemLabel="items"
        />
      </div>
    </section>
  );
};

export default InventoryPage;
