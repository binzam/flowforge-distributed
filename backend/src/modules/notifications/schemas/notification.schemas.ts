import z from "zod";

export const getNotificationsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});
export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>;

export const notificationIdSchema = z.object({
  id: z.uuid(),
});
