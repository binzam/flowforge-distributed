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
