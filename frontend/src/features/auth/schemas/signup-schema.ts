import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  birthDate: z.string().refine((date) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(date);
  }, "Data inválida (DD/MM/YYYY)"),
});

export type SignupValues = z.infer<typeof signupSchema>;
