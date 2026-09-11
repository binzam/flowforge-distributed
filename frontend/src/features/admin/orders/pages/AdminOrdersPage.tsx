import { Link } from "react-router-dom";
import {
  ORDER_STATUSES,
  type OrderStatus,
} from "../../../store-front/orders/types/order-types";
import type { Order } from "../types/order-types";
import { useGetOrders } from "../hooks/order-hooks";
import { dateFormatter } from "@/utils/date-formatter";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

const PAGE_SIZE = 10;

const columns: DataTableColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: (info) => (
      <Link
        to={`/admin/orders/${info.getValue<string>()}`}
        className="font-medium underline"
        style={{ color: "var(--brand-green)" }}
      >
        #{info.getValue<string>().slice(0, 8)}
      </Link>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    accessorFn: (row) => row.customer.name,
    cell: (info) => (
      <span style={{ color: "var(--brand-green)" }}>
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span className="uppercase" style={{ color: "var(--brand-green)" }}>
        {info.getValue<OrderStatus>().replace("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: (info) => (
      <span style={{ color: "var(--brand-dark-green)" }}>
        ETB {Number(info.getValue<string>()).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: (info) => (
      <span style={{ color: "var(--brand-green)" }}>
        {dateFormatter(info.getValue<string>())}
      </span>
    ),
  },
];

const AdminOrdersPage = () => {
  const { filters, page, setFilter, setPage } = useListQueryParams([
    "status",
    "userId",
  ] as const);
  const status = filters.status as OrderStatus | undefined;

  const { data, isLoading, isError } = useGetOrders({
    status,
    userId: filters.userId,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm" style={{ color: "var(--brand-green)" }}>
            Operations
          </p>
          <h1
            className="mt-1 text-3xl font-semibold"
            style={{ color: "var(--brand-dark-green)" }}
          >
            Orders
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={filters.userId ?? ""}
            onChange={(event) => setFilter("userId", event.target.value)}
            placeholder="Filter customer ID"
            className="px-3 py-2 text-sm border rounded"
            style={{ borderColor: "var(--brand-light-green)" }}
          />
          <select
            value={status ?? ""}
            onChange={(event) => setFilter("status", event.target.value)}
            className="border px-3 py-2 text-sm rounded"
            style={{ borderColor: "var(--brand-light-green)" }}
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        className="mt-8"
        tableId="admin-orders"
        columns={columns}
        data={data?.data ?? []}
        getRowId={(order) => order.id}
        isLoading={isLoading}
        isError={isError}
        loadingState={
          <div className="py-12" style={{ color: "var(--brand-green)" }}>
            Loading orders...
          </div>
        }
        errorState={
          <div className="py-12 text-red-600">Unable to load orders.</div>
        }
        emptyState="No orders found."
      />

      <DataTablePagination
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.total ?? 0}
        onPageChange={setPage}
        itemLabel="orders"
      />
    </section>
  );
};

export default AdminOrdersPage;
