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
  skeletonRows?: number;
}

const THEME_STYLES = {
  light: {
    wrapper: "border-slate-200 bg-white",
    thead: "border-slate-200 bg-slate-50 text-slate-500",
    row: "border-slate-100",
    text: "text-slate-500",
    errorText: "text-red-600",
    skeletonBase: "bg-slate-200",
    skeletonShimmer: "rgba(255,255,255,0.75)",
  },
  dark: {
    wrapper: "border-neutral-800 bg-transparent text-neutral-200",
    thead: "border-neutral-800 bg-neutral-900/50 text-neutral-400",
    row: "border-neutral-800 hover:bg-neutral-900/20",
    text: "text-neutral-400",
    errorText: "text-red-400",
    skeletonBase: "bg-neutral-800",
    skeletonShimmer: "rgba(255,255,255,0.10)",
  },
};

const WIDTH_CYCLE = ["88%", "62%", "76%", "50%", "70%", "42%"];

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
  skeletonRows = 6,
}: DataTableProps<TData>) {
  const table = useTable({
    key: tableId,
    features: tableFeatureSet,
    columns,
    data,
    getRowId,
  });

  const theme = THEME_STYLES[variant];
  const wrapperClassName = [
    "overflow-x-auto rounded-md border",
    theme.wrapper,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (isLoading) {
    if (loadingState) {
      return <div className={className}>{loadingState}</div>;
    }

    return (
      <div className={wrapperClassName}>
        <style>{`
          @keyframes dt-shimmer-sweep {
            0% { background-position: 150% 0; }
            100% { background-position: -50% 0; }
          }
          .dt-skeleton-bar {
            background-size: 200% 100%;
            animation: dt-shimmer-sweep 1.6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .dt-skeleton-bar {
              animation: none;
            }
          }
        `}</style>
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
          <tbody aria-hidden="true">
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b last:border-0 ${theme.row}`}
              >
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-4">
                    <div
                      className={`dt-skeleton-bar h-3.5 rounded-full ${theme.skeletonBase}`}
                      style={{
                        width:
                          WIDTH_CYCLE[
                            (rowIndex + colIndex) % WIDTH_CYCLE.length
                          ],
                        backgroundImage: `linear-gradient(90deg, transparent 0%, ${theme.skeletonShimmer} 50%, transparent 100%)`,
                        animationDelay: `${rowIndex * 70}ms`,
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <span className="sr-only">Loading table data</span>
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
          {!isLoading && rows.length === 0 ? (
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
