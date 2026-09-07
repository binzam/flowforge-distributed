import z from "zod";

export const initializePaymentSchema = z.object({
  orderId: z.uuid(),
});
export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;

export const paymentOrderIdParamSchema = z.object({
  orderId: z.uuid(),
});
export type PaymentOrderIdParam = z.infer<typeof paymentOrderIdParamSchema>;

export const chapaCallbackQuerySchema = z.object({
  tx_ref: z.string().min(1),
  status: z.string().optional(),
  ref_id: z.string().optional(),
});
export type ChapaCallbackQuery = z.infer<typeof chapaCallbackQuerySchema>;
