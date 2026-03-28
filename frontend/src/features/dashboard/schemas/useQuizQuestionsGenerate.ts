import z from "zod";

export const quizQuestionsGenerateSchema = z.object({
  quizObjectiveId: z.number(),
  quizSubjectId: z.array(z.number()).optional(),
  seniorityId: z.number(),
  specialtyId: z.number(),
  stacksId: z.array(z.number()).min(1),
  quantity: z.number().min(1).max(20),
  saveInProfile: z.boolean(),
});
export type QuizQuestionsGenerateFormData = z.infer<
  typeof quizQuestionsGenerateSchema
>;
