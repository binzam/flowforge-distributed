import { Link, useParams } from "react-router-dom";
import { useGetInventory } from "../hooks/inventory-hooks";
import { dateFormatter } from "@/utils/date-formatter";

const InventoryDetailPage = () => {
  const { productId = "" } = useParams();
  const { data, isLoading, isError } = useGetInventory(productId);
  const inventory = data?.data;

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading inventory...</div>;
  if (isError || !inventory)
    return (
      <div className="py-12 text-red-600">Unable to load this inventory.</div>
    );

  return (
    <section>
      <Link to="/admin/inventory" className="text-sm text-slate-500 underline">
        Back to inventory
      </Link>
      <div className="mt-6 flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Product</p>
          <h1 className="mt-1 text-3xl font-semibold">
            {inventory.productName}
          </h1>
          <p className="mt-2 text-sm text-slate-500">SKU: {inventory.sku}</p>
          <p className="text-sm text-slate-500">
            Last updated: {dateFormatter(inventory.updatedAt)}
          </p>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-4 font-medium">Total Quantity</td>
              <td className="px-4 py-4 text-slate-600">{inventory.quantity}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-4 font-medium">Reserved Quantity</td>
              <td className="px-4 py-4 text-slate-600">
                {inventory.reservedQuantity}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-4 py-4 font-medium">Available Quantity</td>
              <td className="px-4 py-4 text-slate-600">
                {inventory.availableQuantity}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-4 font-medium">Created</td>
              <td className="px-4 py-4 text-slate-600">
                {dateFormatter(inventory.createdAt)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InventoryDetailPage;
