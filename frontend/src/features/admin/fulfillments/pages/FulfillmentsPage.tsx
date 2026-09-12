import { Link } from "react-router-dom";
import { useGetFulfillments } from "../hooks/fulfillment-hooks";
import type {
  FulfillmentListItem,
  FulfillmentStatus,
} from "../types/fulfillment-types";
import { dateFormatter } from "@/utils/date-formatter";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

const PAGE_SIZE = 20;

const FULFILLMENT_STATUS_COLORS: Record<FulfillmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const columns: DataTableColumnDef<FulfillmentListItem>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: (info) => (
      <Link
        to={`/admin/fulfillments/${info.row.original.id}`}
        className="font-medium underline"
      >
        {info.getValue<string>().slice(0, 8)}...
      </Link>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
    cell: (info) => (
      <span className="text-slate-600 text-sm">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "itemCount",
    header: "Items",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<number>()}</span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: (info) => (
      <span className="font-medium">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<FulfillmentStatus>();
      const colorClass = FULFILLMENT_STATUS_COLORS[status];
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
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

const FulfillmentsPage = () => {
  const { filters, page, setFilter, setPage } = useListQueryParams([
    "status",
  ] as const);

  const { data, isLoading, isError } = useGetFulfillments({
    status: filters.status as FulfillmentStatus | undefined,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Manage</p>
          <h1 className="mt-1 text-3xl font-semibold">Fulfillments</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.status ?? ""}
            onChange={(event) => {
              setFilter("status", event.target.value || undefined);
              setPage(0);
            }}
            className="border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <DataTable
        className="mt-8"
        tableId="admin-fulfillments"
        columns={columns}
        data={data?.data ?? []}
        getRowId={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        loadingState={
          <div className="py-12 text-slate-500">Loading fulfillments...</div>
        }
        errorState={
          <div className="py-12 text-red-600">Unable to load fulfillments.</div>
        }
        emptyState="No fulfillments found."
      />

      <DataTablePagination
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.total ?? 0}
        onPageChange={setPage}
        itemLabel="fulfillments"
      />
    </section>
  );
};

export default FulfillmentsPage;
