import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { dateFormatter } from "@/utils/date-formatter";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeaderWrapper from "../../layouts/PageHeaderWrapper";
import PageTableWrapper from "../../layouts/PageTableWrapper";
import ProductFormModal from "../components/ProductFormModal";
import {
  isProductCategory,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_OPTIONS,
  type ProductCategory,
} from "../constants/product-categories";
import {
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "../hooks/product-hooks";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { type ProductFormValues } from "../schemas/product-schema";
import type {
  GetProductsParams,
  Product,
  ProductPayload,
} from "../types/product-types";
import { target } from "@/tour/onboarding";

const PAGE_SIZE = 10;

const BackOfficeProductsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput.trim());
  const offset = (page - 1) * PAGE_SIZE;

  const params: GetProductsParams = {
    search: debouncedSearch || undefined,
    category: category || undefined,
    limit: PAGE_SIZE,
    offset,
  };

  const { data, isLoading, isError, isPlaceholderData } =
    useGetProducts(params);
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = offset + (data?.data.length ?? 0);
  const hasFilters = debouncedSearch !== "" || category !== "";

  // If the current page no longer exists (e.g. the last item on the last page
  // was deleted), step back to the last valid page.
  useEffect(() => {
    if (!isPlaceholderData && page > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(totalPages);
    }
  }, [isPlaceholderData, page, totalPages]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(isProductCategory(value) ? value : "");
    setPage(1);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = (values: ProductFormValues) => {
    const normalizedDescription = values.description?.trim();
    const payload: ProductPayload = {
      name: values.name,
      description: normalizedDescription ? normalizedDescription : null,
      sku: values.sku,
      price: values.price,
      category: values.category,
    };

    if (modalMode === "create") {
      createProduct(payload, {
        onSuccess: () => closeModal(),
      });
      return;
    }

    if (!selectedProduct) {
      return;
    }

    updateProduct(
      { id: selectedProduct.id, payload },
      { onSuccess: () => closeModal() },
    );
  };

  const handleDelete = useCallback(
    (product: Product) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${product.name}?`,
      );

      if (!confirmed) return;

      deleteProduct(product.id);
    },
    [deleteProduct],
  );

  const columns = useMemo<DataTableColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: (info) => (
          <span className="font-medium text-slate-900">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: (info) => (
          <span className="text-slate-600">{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <span className="text-slate-600">
            {PRODUCT_CATEGORY_LABELS[info.getValue<ProductCategory>()]}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => (
          <span className="text-slate-600">
            ETB {Number(info.getValue<string>()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: (info) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              info.getValue<boolean>()
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {info.getValue<boolean>() ? "Active" : "Inactive"}
          </span>
        ),
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
      {
        id: "actions",
        header: "Actions",
        // Extract 'row' which contains the 'index'
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditModal(row.original)}
              {...(row.index === 0 ? target("product-edit-button") : {})}
              className="inline-flex items-center gap-1 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row.original)}
              disabled={isDeleting}
              {...(row.index === 0 ? target("product-delete-button") : {})}
              className="inline-flex items-center gap-1 border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, isDeleting],
  );

  return (
    <section className="flex flex-col h-full">
      <PageHeaderWrapper className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Manage</p>
          <h1 className="mt-1 text-3xl font-semibold">Products</h1>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </PageHeaderWrapper>
      <PageTableWrapper>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by product name"
              aria-label="Search products by name"
              className="w-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-slate-900"
            />
          </div>

          <select
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            aria-label="Filter products by category"
            className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-900"
          >
            <option value="">All categories</option>
            {PRODUCT_CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div
          className={
            isPlaceholderData ? "opacity-60 transition-opacity" : undefined
          }
          {...target("products-table")}
        >
          <DataTable
            tableId="admin-products"
            columns={columns}
            data={data?.data ?? []}
            getRowId={(product) => product.id}
            isLoading={isLoading}
            isError={isError}
            errorState={
              <div className="py-12 text-red-600">Unable to load products.</div>
            }
            emptyState={
              hasFilters
                ? "No products match your filters."
                : "No products found."
            }
            getRowProps={(_, index) => {
              if (index === 0) {
                return target("products-table-first-row");
              }
              return {};
            }}
          />
        </div>

        {total > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <p>
              Showing {rangeStart}–{rangeEnd} of {total}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <span className="px-1 text-xs">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages || isPlaceholderData}
                className="inline-flex items-center gap-1 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </PageTableWrapper>
      <ProductFormModal
        open={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        isPending={isCreating || isUpdating}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default BackOfficeProductsPage;
