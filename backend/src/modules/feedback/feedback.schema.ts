import { z } from "zod";

export const createFeedbackSchema = z.object({
  body: z.object({
    rate: z.number().min(1).max(5),
    reason: z.string(),
    description: z.string(),
    featureId: z.number().optional(),
    sessionId: z.uuid().optional(),
  }),
});

export type ICreateFeedbackInputDTO = z.infer<
  typeof createFeedbackSchema
>["body"] & {
  userId: string;
};
