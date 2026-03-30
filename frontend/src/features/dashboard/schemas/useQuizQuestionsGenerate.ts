import z from "zod";

export const quizQuestionsGenerateSchema = z.object({
  quizObjectiveId: z.number().min(1, "O objetivo do quiz é obrigatório"),
  quizSubjectIds: z.array(z.number()),
  seniorityId: z.number().min(1, "A sênioridade é obrigatória"),
  specialtyId: z.number().min(1, "A área de atuação é obrigatória"),
  stacksId: z.array(z.number()).min(1, "Pelo menos uma stack deve ser selecionada"),
  quantity: z.number().min(1, "O tamanho do quiz é obrigatório"),
  saveInProfile: z.boolean(),
});
export type QuizQuestionsGenerateFormData = z.infer<
  typeof quizQuestionsGenerateSchema
>;
