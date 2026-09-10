import { Link, useSearchParams } from "react-router-dom";
import { useGetInventories } from "../hooks/inventory-hooks";
import { dateFormatter } from "@/utils/date-formatter";

const PAGE_SIZE = 20;

const InventoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const page = Number(searchParams.get("page") ?? "0");
  const { data, isLoading, isError } = useGetInventories({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  const setPage = (nextPage: number) =>
    setSearchParams({
      ...(productId ? { productId } : {}),
      page: String(nextPage),
    });

  if (isLoading)
    return <div className="py-12 text-slate-500">Loading inventory...</div>;
  if (isError)
    return <div className="py-12 text-red-600">Unable to load inventory.</div>;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Manage</p>
          <h1 className="mt-1 text-3xl font-semibold">Inventory</h1>
        </div>
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Reserved</th>
              <th className="px-4 py-3">Available</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-4">
                  <Link
                    to={`/admin/inventory/${item.productId}`}
                    className="font-medium underline"
                  >
                    {item.productName}
                  </Link>
                </td>
                <td className="px-4 py-4 text-slate-600">{item.sku}</td>
                <td className="px-4 py-4 text-slate-600">{item.quantity}</td>
                <td className="px-4 py-4 text-slate-600">
                  {item.reservedQuantity}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {item.availableQuantity}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {dateFormatter(item.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <span>{data?.total ?? 0} items</span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-2 py-1">
            {totalPages === 0 ? 0 : page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default InventoryPage;
