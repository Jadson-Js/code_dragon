import { z } from "zod";

export const quizReportSubmitSchema = z.object({
  body: z.object({
    sessionQuizId: z.uuid(),
    answers: z
      .array(
        z.object({
          quizQuestionId: z.uuid(),
          selectedCorrectOption: z.boolean(),
          isLiked: z.boolean(),
          isDisliked: z.boolean(),
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

export const getQuizReportSchema = z.object({
  params: z.object({
    sessionQuizId: z.uuid(),
  }),
});

export type IGetQuizReportInputDTO = z.infer<
  typeof getQuizReportSchema
>["params"];
