import z from "zod";

export const quizQuestionsGenerateSchema = z.object({
  quizObjectiveId: z.number(),
  quizSubjectIds: z.array(z.number()).optional(),
  seniorityId: z.number(),
  specialtyId: z.number(),
  stacksId: z.array(z.number()).optional(),
  quantity: z.number().min(1).max(40),
  saveInProfile: z.boolean(),
});
export type QuizQuestionsGenerateFormData = z.infer<
  typeof quizQuestionsGenerateSchema
>;
