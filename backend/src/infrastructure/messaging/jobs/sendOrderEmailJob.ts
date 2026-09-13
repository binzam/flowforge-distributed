import { z } from "zod";

export const sendOrderEmailJobSchema = z.object({
  orderId: z.uuid(),
  email: z.email(),
  customerName: z.string().min(1),
});

export type SendOrderEmailJob = z.infer<typeof sendOrderEmailJobSchema>;
