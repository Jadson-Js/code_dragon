import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    passwordHash: z.string(),
    birthDate: z.string().optional(),
    verifiedAt: z.string().optional(),
    imageId: z.number().optional(),
    linkedinUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    portfolioUrl: z.string().optional(),
  }),
});
