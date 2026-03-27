import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type { IGetQuizContextRepository } from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionGenerateInputDTO } from "@/modules/quiz/questions/questions.dto";
import type { IQuizQuestionGenerateByGeminiInputProvider } from "@/domain/providers/gemini.provider";

@injectable()
export class GetQuizContextPrismaRepository implements IGetQuizContextRepository {
  async execute(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<IQuizQuestionGenerateByGeminiInputProvider> {
    return await prisma.$transaction(async (tx: any) => {
      const [quizObjective, quizSubjects, seniority, specialties, stacks] =
        await Promise.all([
          tx.quizObjective.findUnique({
            where: { id: data.quizObjectiveId },
            select: { id: true, name: true, description: true },
          }),
          tx.quizSubject.findMany({
            where: { id: { in: data.quizSubjectId } },
            select: { id: true, name: true, description: true },
          }),
          tx.seniority.findUnique({
            where: { id: data.seniorityId },
            select: { id: true, name: true, description: true },
          }),
          tx.specialty.findUnique({
            where: { id: data.specialtyId },
            select: { id: true, name: true },
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
        quizObjective: {
          id: quizObjective.id,
          name: quizObjective.name,
          description: quizObjective.description,
        },
        quizSubject: quizSubjects.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
        })),
        seniority: { id: seniority.id, name: seniority.name },
        specialty: { id: specialties.id, name: specialties.name },
        stacks: stacks.map((s: any) => ({ id: s.id, name: s.name })),
      };
    });
  }
}
