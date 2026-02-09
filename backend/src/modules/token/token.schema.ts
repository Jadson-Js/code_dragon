import { z } from "zod";

export const createTokenSchema = z.object({
  body: z.object({
    userId: z.string(),
    token: z.string(),
    type: z.any(),
    usedAt: z.string().optional(),
    expiresAt: z.string(),
    user: z.any(),
  }),
});
