import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Insira um e-mail válido"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
