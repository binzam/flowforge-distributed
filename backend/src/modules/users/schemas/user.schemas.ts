import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1).max(30),
  email: z.email(),
  password: z.string().min(8),
});

export const userIdSchema = z.object({
  id: z.uuid(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const getUsersQuerySchema = z.object({
  role: z.enum(["customer", "admin", "warehouse"]).optional(),

  limit: z.coerce.number().int().positive().max(100).optional(),

  offset: z.coerce.number().int().nonnegative().optional(),
});
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
