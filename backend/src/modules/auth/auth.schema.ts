import { z } from "zod";

export const signupAuthSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  }),
});

export const resendEmailSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});
