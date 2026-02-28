import z from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  birthDate: z
    .string()
    .min(10, "Data de nascimento inválida")
    .regex(/\d{2}\/\d{2}\/\d{4}/, "Data de nascimento inválida"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 dígitos"),
});
export type SignupFormData = z.infer<typeof signupSchema>;
