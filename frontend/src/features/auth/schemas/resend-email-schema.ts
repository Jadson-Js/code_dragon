import { z } from "zod";

export const resendEmailSchema = z.object({
  email: z.email("E-mail inválido"),
});

export type ResendEmailValues = z.infer<typeof resendEmailSchema>;
