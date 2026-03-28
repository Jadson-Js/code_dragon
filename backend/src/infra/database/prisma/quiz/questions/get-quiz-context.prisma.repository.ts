import { prisma } from "../../../../../../prisma/client";
import { injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type {
  IGetQuizQuestionContextOutputRepository,
  IGetQuizQuestionContextRepository,
} from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionGenerateInputDTO } from "@/modules/quiz/questions/questions.dto";

@injectable()
export class GetQuizContextPrismaRepository implements IGetQuizQuestionContextRepository {
  async execute(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<IGetQuizQuestionContextOutputRepository> {
    return await prisma.$transaction(async (tx) => {
      const [quizObjective, quizSubjects, seniority, specialty, stacks] =
        await Promise.all([
          tx.quizObjective.findUnique({
            where: { id: data.quizObjectiveId },
          }),
          tx.quizSubject.findMany({
            where: { id: { in: data.quizSubjectId ?? [] } },
          }),
          tx.seniority.findUnique({
            where: { id: data.seniorityId },
          }),
          tx.specialty.findUnique({
            where: { id: data.specialtyId },
          }),
          tx.stack.findMany({
            where: { id: { in: data.stacksId } },
          }),
        ]);

      if (!quizObjective) throw new NotFoundError("Quiz objective not found.");
      if (!seniority) throw new NotFoundError("Seniority not found.");
      if (!specialty) throw new NotFoundError("Specialty not found.");
      if (stacks.length === 0) throw new NotFoundError("Stacks not found.");

      return {
        quizObjective: quizObjective.toDomain,
        quizSubject: quizSubjects.map((s) => s.toDomain),
        seniority: seniority.toDomain,
        specialty: specialty.toDomain,
        stacks: stacks.map((s) => s.toDomain),
      };
    });
  }
}
