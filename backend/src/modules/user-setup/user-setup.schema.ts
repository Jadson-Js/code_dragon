import { z } from "zod";

export const createUserSetupSchema = z.object({
  body: z.object({
    seniorityId: z.number(),
    specialtyId: z.number(),
    careerObjectiveId: z.number(),
    stacksId: z.array(z.number()),
  }),
});
