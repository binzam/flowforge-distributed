import { useCancelOrder } from "../hooks/order-hooks";
import { toast } from "react-toastify";

const CancelOrderButton = ({
  orderId,
  orderStatus,
}: {
  orderId: string;
  orderStatus: string;
}) => {
  const { mutateAsync: cancelOrder, isPending } = useCancelOrder();

  const canCancel = !["cancelled", "delivered", "shipped", "failed"].includes(
    orderStatus,
  );

  if (!canCancel) {
    return <span className="text-slate-600 text-xs">-</span>;
  }
  const handleCancel = () => {
    toast.promise(cancelOrder(orderId), {
      pending: "Cancelling order...",
      success: "Order Cancelled Successfully!",
      error: "Failed to cancel the order.",
    });
  };
  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="cursor-pointer text-red-400 hover:text-red-300 transition-colors border border-neutral-100 px-4 py-2 text-sm uppercase tracking-widest disabled:opacity-40"
    >
      {isPending ? "Cancelling..." : "Cancel"}
    </button>
  );
};

export default CancelOrderButton;
