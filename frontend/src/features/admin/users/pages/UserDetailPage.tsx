import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetUserById } from "../hooks/user-hooks";
import { dateFormatter } from "@/utils/date-formatter";
import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";

interface UserMetricRow {
  metric: string;
  value: ReactNode;
}

const metricColumns: DataTableColumnDef<UserMetricRow>[] = [
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

const UserDetailPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetUserById(id);
  const user = data?.data;

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading user details...</div>;

  if (isError || !user)
    return (
      <div>
        <Link to="/admin/users" className="text-sm text-slate-500 underline">
          Back to users
        </Link>
        <div className="py-12 text-red-600">Unable to load this user.</div>
      </div>
    );

  const metricRows: UserMetricRow[] = [
    { metric: "Full Name", value: user.name },
    { metric: "Email Address", value: user.email },
    {
      metric: "Role",
      value: <span className="capitalize">{user.role}</span>,
    },
    { metric: "Date Joined", value: dateFormatter(user.createdAt) },
  ];

  if (user.updatedAt) {
    metricRows.push({
      metric: "Last Updated",
      value: dateFormatter(user.updatedAt),
    });
  }

  return (
    <section>
      <Link to="/admin/users" className="text-sm text-slate-500 underline">
        Back to users
      </Link>
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">User Profile</p>
          <h1 className="mt-1 text-3xl font-semibold">{user.name}</h1>
          <p className="mt-2 text-sm text-slate-500">ID: {user.id}</p>
        </div>
      </div>

      <DataTable
        className="mt-8"
        tableId="user-metrics"
        columns={metricColumns}
        data={metricRows}
        getRowId={(row) => row.metric}
      />
    </section>
  );
};

export default UserDetailPage;
