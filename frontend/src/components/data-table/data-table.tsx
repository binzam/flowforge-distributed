import type { ReactNode } from "react";
import { useTable } from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import { tableFeatureSet } from "./table-features";

export type DataTableColumnDef<TData extends RowData> = ColumnDef<
  typeof tableFeatureSet,
  TData
>;

export type DataTableVariant = "light" | "dark";

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  tableId?: string;
  isLoading?: boolean;
  isError?: boolean;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  emptyState?: ReactNode;
  className?: string;
  "aria-label"?: string;
  variant?: DataTableVariant;
}

const THEME_STYLES = {
  light: {
    wrapper: "border-slate-200 bg-white",
    thead: "border-slate-200 bg-slate-50 text-slate-500",
    row: "border-slate-100",
    text: "text-slate-500",
    errorText: "text-red-600",
  },
  dark: {
    wrapper: "border-neutral-800 bg-transparent text-neutral-200",
    thead: "border-neutral-800 bg-neutral-900/50 text-neutral-400",
    row: "border-neutral-800 hover:bg-neutral-900/20",
    text: "text-neutral-400",
    errorText: "text-red-400",
  },
};

export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  tableId,
  isLoading = false,
  isError = false,
  loadingState,
  errorState,
  emptyState = "No results found.",
  className,
  "aria-label": ariaLabel,
  variant = "light",
}: DataTableProps<TData>) {
  const table = useTable({
    key: tableId,
    features: tableFeatureSet,
    columns,
    data,
    getRowId,
  });

  const theme = THEME_STYLES[variant];

  if (isLoading) {
    return (
      <div className={className}>
        {loadingState ?? (
          <div className={`py-12 text-center text-sm ${theme.text}`}>
            Loading...
          </div>
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={className}>
        {errorState ?? (
          <div className={`py-12 text-center text-sm ${theme.errorText}`}>
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    );
  }

  const rows = table.getRowModel().rows;
  const wrapperClassName = [
    "overflow-x-auto rounded-md border",
    theme.wrapper,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      <table className="w-full text-left text-sm" aria-label={ariaLabel}>
        <thead className={`border-b text-xs uppercase ${theme.thead}`}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium">
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`px-4 py-12 text-center ${theme.text}`}
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b last:border-0 ${theme.row}`}
              >
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
