import { z } from "zod";

export const createProfileSchema = z.object({
  body: z.object({
    ageRangeId: z.number(),
    seniorityId: z.number(),
    specialtyId: z.number(),
    careerObjectiveId: z.number(),
    stacksId: z.array(z.number()).min(1, "At least one stack is required"),
  }),
});

export type ICreateProfileInputDTO = z.infer<typeof createProfileSchema>["body"] & {
  userId: string;
};
