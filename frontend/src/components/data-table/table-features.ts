import { tableFeatures } from "@tanstack/react-table";

/**
 * Shared table feature set used by every `DataTable` instance in the app.
 *
 * All current list pages (orders, inventory, ...) rely on server-side
 * pagination and filtering driven by URL search params, so no client-side
 * row model features (sorting, pagination, filtering, etc.) are registered
 * here — that keeps the bundle small per TanStack Table v9's opt-in model.
 *
 * If a table ever needs client-side sorting, add `rowSortingFeature` (and
 * `createSortedRowModel`) here. Every column def across the app imports
 * `DataTableColumnDef` from `./data-table`, which is typed against this
 * single instance, so the new APIs become available everywhere at once.
 */
export const tableFeatureSet = tableFeatures({});
