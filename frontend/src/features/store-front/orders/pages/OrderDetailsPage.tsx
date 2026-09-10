import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { queryClient } from "@/lib/query-client";
import { useGetOrder } from "../hooks/order-hooks";
import {
  getPaymentErrorMessage,
  useGetPaymentForOrder,
  useInitializePayment,
} from "../hooks/payment-hooks";
import type { OrderStatus } from "../types/order-types";

const PAYABLE_STATUSES: OrderStatus[] = ["pending", "payment_pending"];

const OrderDetailsPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetOrder(id);
  const order = data?.data;

  const [paymentError, setPaymentError] = useState<string | null>(null);

  const initializePaymentMutation = useInitializePayment();

  const paymentQuery = useGetPaymentForOrder(
    id,
    order?.status === "payment_pending",
  );

  useEffect(() => {
    const paymentStatus = paymentQuery.data?.data.status;
    if (paymentStatus === "successful" || paymentStatus === "failed") {
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    }
  }, [paymentQuery.data?.data.status, id]);

  const handlePay = () => {
    if (!order) return;
    setPaymentError(null);
    initializePaymentMutation.mutate(
      { orderId: order.id },
      {
        onSuccess: (response) => {
          window.location.href = response.data.checkoutUrl;
        },
        onError: (error) => {
          setPaymentError(getPaymentErrorMessage(error));
        },
      },
    );
  };

  if (isLoading)
    return (
      <div className="py-24 text-center text-neutral-400">Loading order...</div>
    );
  if (isError || !order)
    return (
      <div className="py-24 text-center text-red-400">
        Unable to load this order.
      </div>
    );

  const isPayable = PAYABLE_STATUSES.includes(order.status);
  const isFailed = order.status === "failed";
  const isConfirmingPayment =
    order.status === "payment_pending" &&
    paymentQuery.data?.data.status !== "successful" &&
    paymentQuery.data?.data.status !== "failed";

  return (
    <section className="py-12">
      <Link to="/orders" className="text-sm text-neutral-400 underline">
        Back to orders
      </Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-neutral-500">ORDER</p>
          <h1 className="mt-3 text-4xl font-semibold">
            #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="border border-neutral-700 px-3 py-1 text-xs uppercase tracking-widest">
          {order.status.replace("_", " ")}
        </span>
      </div>

      {isConfirmingPayment && (
        <p className="mt-6 border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-300">
          Confirming your payment with Chapa. This can take a few seconds...
        </p>
      )}

      {(isPayable || isFailed) && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={handlePay}
            disabled={initializePaymentMutation.isPending}
            className="border border-neutral-100 px-4 py-2 text-sm uppercase tracking-widest disabled:opacity-40"
          >
            {initializePaymentMutation.isPending
              ? "Redirecting..."
              : isFailed
                ? "Retry payment"
                : "Pay now"}
          </button>
          {paymentError && (
            <p className="text-sm text-red-400">{paymentError}</p>
          )}
        </div>
      )}

      <div className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
        {order.items.map((item) => (
          <div
            key={item.product.id}
            className="flex flex-wrap justify-between gap-4 py-5"
          >
            <div>
              <p className="font-medium">
                {item.product.name}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Quantity {item.quantity} at ${Number(item.unitPrice).toFixed(2)}
              </p>
            </div>
            <strong>
              ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>
      <p className="mt-8 text-right text-xl">
        Total <strong>${Number(order.totalAmount).toFixed(2)}</strong>
      </p>
    </section>
  );
};

export default OrderDetailsPage;
