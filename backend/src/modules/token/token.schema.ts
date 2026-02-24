import { z } from "zod";

export const createTokenSchema = z.object({
  body: z.object({
    userId: z.string(),
    token: z.string(),
    type: z.any(),
    expiresAt: z.string(),
    user: z.any(),
  }),
});
