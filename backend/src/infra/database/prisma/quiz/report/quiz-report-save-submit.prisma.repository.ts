import { injectable } from "tsyringe";
import { prisma } from "../../../../../../prisma/client";
import type { IQuizReportSubmitResponse } from "@/modules/quiz/report/use-cases/submit.use-case";

@injectable()
export class QuizReportSaveSubmitPrismaRepository {
  async execute(
    data: IQuizReportSubmitResponse,
    dislikedQuestionIds: string[],
  ) {
    return await prisma.$transaction(async (tx) => {
      await tx.sessionQuiz.update({
        where: {
          id: data.sessionQuizId,
        },
        data: {
          status: "COMPLETED",
        },
      });

      for (const questionId of dislikedQuestionIds) {
        await tx.quizQuestion.update({
          where: { id: questionId },
          data: {
            dislikes: { increment: 1 },
          },
        });
      }

      for (const stack of data.stacks) {
        await tx.sessionQuizStack.update({
          where: {
            quizSessionId_stackId: {
              quizSessionId: data.sessionQuizId,
              stackId: stack.id,
            },
          },
          data: {
            score: stack.score.user,
            averageScore: stack.score.community,
          },
        });
      }

      for (const subject of data.subjects) {
        await tx.sessionQuizSubject.update({
          where: {
            quizSessionId_subjectId: {
              quizSessionId: data.sessionQuizId,
              subjectId: subject.id,
            },
          },
          data: {
            score: subject.score.user,
            averageScore: subject.score.community,
          },
        });
      }

      await tx.sessionQuizResult.create({
        data: {
          quizSessionId: data.sessionQuizId,
          score: data.score.user,
          averageScore: data.score.community,
          title: data.insights.title,
          description: data.insights.description,
          strongPoints: data.insights.strongPoints,
          weakPoints: data.insights.weakPoints,
          correctAnswers: data.correctAnswers,
          wrongAnswers: data.wrongAnswers,
          ignoredAnswers: data.ignoredAnswers,
          ranking: data.ranking,
          percentile: data.percentile,
        },
      });

      for (const roadmap of data.roadmap) {
        await tx.sessionQuizRoadmap.create({
          data: {
            quizSessionId: data.sessionQuizId,
            title: roadmap.title,
            description: roadmap.description,
            priority: roadmap.priority,
          },
        });
      }
    });
  }
}
