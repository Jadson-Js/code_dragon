import { prisma } from "../../../../../prisma/client";
import { injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type {
  IGetQuizQuestionContextOutputRepository,
  IGetQuizQuestionContextRepository,
} from "@/domain/database/repositories/quiz/question/get-quiz-question-context.repository";
import type { IQuizQuestionGenerateInputDTO } from "@/modules/quiz/questions/questions.dto";
import { QuizObjective } from "@/domain/entities/quiz-objective.entity";
import { QuizSubject } from "@/domain/entities/quiz-subject.entity";
import { Seniority } from "@/domain/entities/seniority.entity";
import { Specialty } from "@/domain/entities/specialty.entity";
import { Stack } from "@/domain/entities/stack.entity";

@injectable()
export class GetQuizContextPrismaRepository implements IGetQuizQuestionContextRepository {
  async execute(
    data: IQuizQuestionGenerateInputDTO,
  ): Promise<IGetQuizQuestionContextOutputRepository> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await prisma.$transaction(async (tx: any) => {
      const [quizObjective, quizSubjects, seniority, specialty, stacks] =
        await Promise.all([
          tx.quizObjective.findUnique({
            where: { id: data.quizObjectiveId },
          }),
          tx.quizSubject.findMany({
            where: { id: { in: data.quizSubjectId } },
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
      if (!quizSubjects.length)
        throw new NotFoundError("Quiz subjects not found.");
      if (!specialty) throw new NotFoundError("Specialty not found.");

      return {
        quizObjective: QuizObjective.create({
          id: quizObjective.id,
          name: quizObjective.name,
          description: quizObjective.description,
          slug: quizObjective.slug,
          createdAt: quizObjective.createdAt,
          updatedAt: quizObjective.updatedAt,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        quizSubject: quizSubjects.map((s: any) =>
          QuizSubject.create({
            id: s.id,
            name: s.name,
            description: s.description,
            slug: s.slug,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          }),
        ),
        seniority: Seniority.create({
          id: seniority.id,
          name: seniority.name,
          description: seniority.description,
          slug: seniority.slug,
          order: seniority.order,
          createdAt: seniority.createdAt,
          updatedAt: seniority.updatedAt,
        }),
        specialty: Specialty.create({
          id: specialty.id,
          name: specialty.name,
          description: specialty.description,
          slug: specialty.slug,
          order: specialty.order,
          createdAt: specialty.createdAt,
          updatedAt: specialty.updatedAt,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stacks: stacks.map((s: any) =>
          Stack.create({
            id: s.id,
            name: s.name,
            slug: s.slug,
            usageCount: s.usageCount,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          }),
        ),
      };
    });
  }
}
