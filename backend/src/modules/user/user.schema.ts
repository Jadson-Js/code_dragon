import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email format"),
    passwordHash: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
