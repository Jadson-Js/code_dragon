import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type { IGetQuizContextRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizGenerateQuestionsDTO } from "@/modules/quiz/questions/questions.dto";
import type { IQuizQuestionGenerateByGeminiProvider } from "@/domain/providers/gemini.provider";

@injectable()
export class GetQuizContextPrismaRepository implements IGetQuizContextRepository {
  async execute(
    data: IQuizGenerateQuestionsDTO,
  ): Promise<IQuizQuestionGenerateByGeminiProvider> {
    return await prisma.$transaction(async (tx: any) => {
      const [quizObjective, quizSubjects, seniority, specialties, stacks] =
        await Promise.all([
          tx.quizObjective.findUnique({
            where: { id: data.quizObjectiveId },
            select: { name: true },
          }),
          tx.quizSubject.findMany({
            where: { id: { in: data.quizSubjectId } },
            select: { name: true },
          }),
          tx.seniority.findUnique({
            where: { id: data.seniorityId },
            select: { name: true },
          }),
          tx.specialty.findUnique({
            where: { id: data.specialtyId },
            select: { name: true },
          }),
          tx.stack.findMany({
            where: { id: { in: data.stacksId } },
            select: { name: true },
          }),
        ]);

      if (!quizObjective) throw new NotFoundError("Quiz objective not found.");
      if (!seniority) throw new NotFoundError("Seniority not found.");
      if (!quizSubjects.length)
        throw new NotFoundError("Quiz subjects not found.");
      if (!specialties) throw new NotFoundError("Specialty not found.");

      return {
        quizObjective: quizObjective.name,
        quizSubject: quizSubjects.map((s: { name: string }) => s.name),
        seniority: seniority.name,
        specialty: [specialties.name],
        stacks: stacks.map((s: { name: string }) => s.name),
      };
    });
  }
}
