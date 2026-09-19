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
import { useGetPayments } from "../hooks/payment-hooks";
import type { Payment, PaymentStatus } from "../types/payment-types";
import { PAYMENT_STATUSES } from "../types/payment-types";

const PAGE_SIZE = 10;

const statusColors: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  successful: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-slate-200 text-slate-700",
};

const columns: DataTableColumnDef<Payment>[] = [
  {
    accessorKey: "orderId",
    header: "Order",
    cell: (info) => (
      <Link
        to={`/portal/orders/${info.getValue<string>()}`}
        className="font-medium underline"
      >
        #{info.getValue<string>().slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: (info) => (
      <span className="text-slate-600">
        {info.getValue<string | null>() ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<PaymentStatus>();
      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium uppercase ${statusColors[status]}`}
        >
          {status.replace("_", " ")}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
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

const PaymentsPage = () => {
  const { filters, page, setFilter, setPage } = useListQueryParams([
    "status",
  ] as const);

  const status = filters.status as PaymentStatus | undefined;

  const { data, isLoading, isError } = useGetPayments({
    status,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  return (
    <section>
      <PageHeaderWrapper className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Operations</p>
          <h1 className="mt-1 text-3xl font-semibold">Payments</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={status ?? ""}
            onChange={(event) => {
              setFilter("status", event.target.value);
            }}
            className="border border-slate-300 bg-white px-3 py-2 text-sm capitalize"
          >
            <option value="" className="capitalize">
              All statuses
            </option>
            {PAYMENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </PageHeaderWrapper>
      <PageTableWrapper>
        <DataTable
          tableId="admin-payments"
          columns={columns}
          data={data?.data ?? []}
          getRowId={(payment) => payment.id}
          isLoading={isLoading}
          isError={isError}
          errorState={
            <div className="py-12 text-red-600">Unable to load payments.</div>
          }
          emptyState="No payments found."
        />
      </PageTableWrapper>
      <div className="sticky bottom-0 bg-white/90 px-4 md:px-6 lg:px-8 py-2 border-t border-yellow-700">
        <DataTablePagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          itemLabel="payments"
        />
      </div>
    </section>
  );
};

export default PaymentsPage;
