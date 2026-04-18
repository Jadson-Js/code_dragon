import { z } from "zod";

export const quizQuestionGenerateSchema = z.object({
  body: z.object({
    quizObjectiveId: z.number(),
    quizSubjectsId: z.array(z.number()).optional(),
    seniorityId: z.number(),
    specialtyId: z.number(),
    stacksId: z.array(z.number()).min(1),
    quantity: z.number().min(1).max(20),
    saveInProfile: z.boolean(),
  }),
});

export type IQuizQuestionGenerateInputDTO = z.infer<
  typeof quizQuestionGenerateSchema
>["body"] & {
  userId: string;
};

export const quizQuestionStreamSchema = z.object({
  params: z.object({
    session_quiz_id: z.string(),
  }),
});

// No IQuizQuestionStreamInputDTO here
