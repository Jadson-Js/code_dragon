import { z } from "zod";

export const createUserSetupSchema = z.object({
  body: z.object({
    seniorityId: z.number(),
    specialityId: z.number(),
    careerObjectiveId: z.number(),
    stacksId: z.array(z.number()),
  }),
});
