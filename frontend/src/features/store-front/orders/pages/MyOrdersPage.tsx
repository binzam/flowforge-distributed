import { Link } from "react-router-dom";
import { useGetMyOrders } from "../hooks/order-hooks";
import {
  ORDER_STATUSES,
  type OrderStatus,
  type Order,
} from "../types/order-types";
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
        to={`/orders/${info.getValue<string>()}`}
        className="font-medium underline"
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
      <span className="text-slate-600">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <span className="uppercase text-slate-600">
        {info.getValue<OrderStatus>().replace("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: (info) => `ETB ${Number(info.getValue<string>()).toFixed(2)}`,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: (info) => (
      <span className="text-slate-600">
        {dateFormatter(info.getValue<string>())}
      </span>
    ),
  },
];

const MyOrdersPage = () => {
  const { filters, page, setFilter, setPage } = useListQueryParams([
    "status",
  ] as const);
  const status = filters.status as OrderStatus | undefined;

  const { data, isLoading, isError } = useGetMyOrders({
    status,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  return (
    <section className="py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-neutral-500">ACCOUNT</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            My orders
          </h1>
        </div>
        <div>
          <select
            value={status ?? ""}
            onChange={(event) => setFilter("status", event.target.value)}
            className="border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
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
        className="mt-10"
        tableId="my-orders"
        columns={columns}
        data={data?.data ?? []}
        getRowId={(order) => order.id}
        isLoading={isLoading}
        isError={isError}
        loadingState={
          <div className="py-24 text-center text-neutral-400">
            Loading your orders...
          </div>
        }
        errorState={
          <div className="py-24 text-center text-red-400">
            Unable to load your orders.
          </div>
        }
        emptyState="You have not placed an order yet."
        variant="dark"
      />

      <DataTablePagination
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.total ?? 0}
        onPageChange={setPage}
        itemLabel="orders"
        variant="dark"
      />
    </section>
  );
};

export default MyOrdersPage;
