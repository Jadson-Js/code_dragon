import z from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string().min(2, "O token deve ter pelo menos 2 caracteres"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 dígitos"),
    confirmPassword: z
      .string()
      .min(8, "A confirmação deve ter no mínimo 8 dígitos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
