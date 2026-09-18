export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  variant?: "light" | "dark";
}

const THEME_STYLES = {
  light: {
    container: "text-slate-600",
    button: "border-slate-300 hover:bg-slate-50",
  },
  dark: {
    container: "text-neutral-400",
    button: "border-neutral-700 hover:bg-neutral-800 text-neutral-200",
  },
};

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  itemLabel = "results",
  variant = "light",
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const canGoPrevious = page > 0;
  const canGoNext = page + 1 < totalPages;

  const theme = THEME_STYLES[variant];

  return (
    <div
      className={`flex items-center justify-between text-[12px]/4 ${theme.container}`}
    >
      <span>
        {total} {itemLabel}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          className={`rounded border px-3 py-0.75 disabled:opacity-40 transition-colors ${theme.button}`}
        >
          Previous
        </button>
        <span className="px-2 py-0.75">
          {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className={`rounded border px-3 py-0.75 disabled:opacity-40 transition-colors ${theme.button}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
