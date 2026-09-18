import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import type { User, UsersQuery } from "../types/user-types";
import { Link } from "react-router-dom";
import { dateFormatter } from "@/utils/date-formatter";
import { useGetUsers } from "../hooks/user-hooks";
import { useListQueryParams } from "@/hooks/use-list-query-params";
import PageTableWrapper from "../../layouts/PageTableWrapper";
import PageHeaderWrapper from "../../layouts/PageHeaderWrapper";

const PAGE_SIZE = 10;

const columns: DataTableColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "User",
    cell: (info) => (
      <Link
        to={`/admin/users/${info.getValue<string>()}`}
        className="font-medium underline"
      >
        #{info.getValue<string>().slice(0, 8)}
      </Link>
    ),
  },
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => row.name,
    cell: (info) => (
      <span className="text-slate-600">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => (
      <span className="capitalize text-slate-600">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
    cell: (info) => (
      <span className="text-slate-600">
        {dateFormatter(info.getValue<string>())}
      </span>
    ),
  },
];
const UsersPage = () => {
  const { filters, page, setFilter, setPage } = useListQueryParams([
    "role",
    "userId",
  ] as const);
  const { data, isLoading, isError } = useGetUsers({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    role: filters.role as UsersQuery["role"],
  });
  return (
    <section>
      <PageHeaderWrapper className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Manage</p>
          <h1 className="mt-1 text-3xl font-semibold">Users</h1>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="role-filter" className="text-sm text-slate-600">
            Filter by Role:
          </label>
          <select
            id="role-filter"
            value={filters.role ?? ""}
            onChange={(e) => setFilter("role", e.target.value || undefined)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </div>
      </PageHeaderWrapper>
      <PageTableWrapper>
        <DataTable
          tableId="admin-users"
          columns={columns}
          data={data?.data ?? []}
          getRowId={(user) => user.id}
          isLoading={isLoading}
          isError={isError}
          errorState={
            <div className="py-12 text-red-600">Unable to load users.</div>
          }
          emptyState="No users found."
        />
      </PageTableWrapper>
      <div className="sticky bottom-0 bg-white/90 px-4 md:px-6 lg:px-8 py-2 border-t border-yellow-700">
        <DataTablePagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          itemLabel="users"
        />
      </div>
    </section>
  );
};

export default UsersPage;
