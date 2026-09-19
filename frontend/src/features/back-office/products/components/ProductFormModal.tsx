import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  productFormSchema,
  type ProductFormValues,
} from "../schemas/product-schema";
import type { Product } from "../types/product-types";

interface ProductFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  product?: Product | null;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  sku: "",
  price: "",
};

const ProductFormModal = ({
  open,
  mode,
  product,
  isPending = false,
  onClose,
  onSubmit,
}: ProductFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    reset(
      product
        ? {
            name: product.name,
            description: product.description ?? "",
            sku: product.sku,
            price: product.price,
          }
        : defaultValues,
    );
  }, [open, product, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {mode === "create" ? "Create" : "Update"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {mode === "create" ? "Add Product" : "Edit Product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close product form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-5 p-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                Product Name
              </label>
              <input
                id="name"
                {...register("name")}
                className={`w-full border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors ${
                  errors.name
                    ? "border-red-300"
                    : "border-slate-300 focus:border-slate-900"
                }`}
                placeholder="Playstation 4"
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label
                htmlFor="description"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className={`w-full resize-none border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors ${
                  errors.description
                    ? "border-red-300"
                    : "border-slate-300 focus:border-slate-900"
                }`}
                placeholder="Describe the product"
              />
              {errors.description && (
                <p className="text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="sku"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                SKU
              </label>
              <input
                id="sku"
                {...register("sku")}
                className={`w-full border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors ${
                  errors.sku
                    ? "border-red-300"
                    : "border-slate-300 focus:border-slate-900"
                }`}
                placeholder="PS-001"
              />
              {errors.sku && (
                <p className="text-xs text-red-600">{errors.sku.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="price"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                Price
              </label>
              <input
                id="price"
                {...register("price")}
                className={`w-full border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors ${
                  errors.price
                    ? "border-red-300"
                    : "border-slate-300 focus:border-slate-900"
                }`}
                placeholder="1200.00"
              />
              {errors.price && (
                <p className="text-xs text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "create" ? "Saving..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Product"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
