import { injectable } from "tsyringe";
import { prisma } from "../../../../../../prisma/client";
import type {
  ICreateSessionWithQuizInput,
  ICreateSessionWithQuizOutput,
  ICreateSessionWithQuizRepository,
} from "@/domain/database/repositories/quiz/session/create-session-with-quiz.repository";

@injectable()
export class CreateSessionWithQuizPrismaRepository implements ICreateSessionWithQuizRepository {
  async execute(
    data: ICreateSessionWithQuizInput,
  ): Promise<ICreateSessionWithQuizOutput> {
    return await prisma.$transaction(async (tx) => {
      const createdSession = await tx.session.create({
        data: {
          id: data.session.id,
          userId: data.session.userId,
          featureId: data.session.featureId,
        },
      });

      const createdSessionQuiz = await tx.sessionQuiz.create({
        data: {
          id: data.sessionQuiz.id,
          sessionId: createdSession.id,
          userId: data.sessionQuiz.userId,
          seniorityId: data.sessionQuiz.seniorityId,
          specialtyId: data.sessionQuiz.specialtyId,
          quizObjectiveId: data.sessionQuiz.quizObjectiveId,
          quantityQuestions: data.sessionQuiz.quantityQuestions,
          score: data.sessionQuiz.score,
        },
      });

      await tx.quizSessionStack.createMany({
        data: data.stacksId.map((stackId) => ({
          quizSessionId: createdSessionQuiz.id,
          stackId,
        })),
      });

      if (data.quizSubjectsId && data.quizSubjectsId.length > 0) {
        await tx.quizSessionSubjects.createMany({
          data: data.quizSubjectsId.map((subjectId) => ({
            quizSessionId: createdSessionQuiz.id,
            subjectId,
          })),
        });
      }

      return { sessionQuizId: createdSessionQuiz.id };
    });
  }
}
