import z from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 dígitos"),
});
export type SignupFormData = z.infer<typeof signupSchema>;
