import { useCallback, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  DataTable,
  type DataTableColumnDef,
} from "@/components/data-table/data-table";
import { dateFormatter } from "@/utils/date-formatter";
import ProductFormModal from "../components/ProductFormModal";
import {
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "../hooks/product-hooks";
import { type ProductFormValues } from "../schemas/product-schema";
import type {
  Product,
  ProductPayload,
  UpdateProductPayload,
} from "../types/product-types";

const AdminProductsPage = () => {
  const { data, isLoading, isError } = useGetProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    const payload = {
      ...values,
      description: normalizedDescription ? normalizedDescription : null,
    };

    if (modalMode === "create") {
      createProduct(payload as ProductPayload, {
        onSuccess: () => closeModal(),
      });
      return;
    }

    if (!selectedProduct) {
      return;
    }

    const patchPayload: UpdateProductPayload = {
      name: payload.name,
      description: payload.description,
      sku: payload.sku,
      price: payload.price,
    };

    updateProduct(
      { id: selectedProduct.id, payload: patchPayload },
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
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditModal(row.original)}
              className="inline-flex items-center gap-1 border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row.original)}
              disabled={isDeleting}
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
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
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
      </div>

      <DataTable
        className="mt-8"
        tableId="admin-products"
        columns={columns}
        data={data?.data ?? []}
        getRowId={(product) => product.id}
        isLoading={isLoading}
        isError={isError}
        loadingState={
          <div className="py-12 text-slate-500">Loading products...</div>
        }
        errorState={
          <div className="py-12 text-red-600">Unable to load products.</div>
        }
        emptyState="No products found."
      />

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

export default AdminProductsPage;
