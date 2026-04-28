import { z } from "zod";

export const quizReportSubmitSchema = z.object({
  body: z.object({
    sessionQuizId: z.uuid(),
    answers: z
      .array(
        z.object({
          quizQuestionId: z.uuid(),
          selectedCorrectOption: z.boolean(),
        }),
      )
      .min(1),
  }),
});

export type IQuizReportSubmitInputDTO = z.infer<
  typeof quizReportSubmitSchema
>["body"] & {
  userId: string;
};
