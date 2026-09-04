import z from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
