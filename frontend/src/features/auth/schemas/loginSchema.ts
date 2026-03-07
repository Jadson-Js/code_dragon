import z from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 dígitos"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
