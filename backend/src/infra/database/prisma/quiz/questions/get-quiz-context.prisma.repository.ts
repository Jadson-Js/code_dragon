import { prisma } from "../../../../../../prisma/client";
import { injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type { QuizObjective } from "@/entities/quiz-objective.entity";
import type { QuizSubject } from "@/entities/quiz-subject.entity";
import type { Seniority } from "@/entities/seniority.entity";
import type { Specialty } from "@/entities/specialty.entity";
import type { Stack } from "@/entities/stack.entity";

export interface IGetQuizQuestionContextInput {
  quizObjectiveId: number;
  quizSubjectsId?: number[];
  seniorityId: number;
  specialtyId: number;
  stacksId: number[];
}

export interface IGetQuizQuestionContextOutput {
  quizObjective: QuizObjective;
  quizSubjects: QuizSubject[];
  seniority: Seniority;
  specialty: Specialty;
  stacks: Stack[];
}



@injectable()
export class GetQuizContextPrismaRepository {
  async execute(
    data: IGetQuizQuestionContextInput,
  ): Promise<IGetQuizQuestionContextOutput> {
    return await prisma.$transaction(async (tx) => {
      const [quizObjective, quizSubjects, seniority, specialty, stacks] =
        await Promise.all([
          tx.quizObjective.findUnique({
            where: { id: data.quizObjectiveId },
          }),
          tx.quizSubject.findMany({
            where: { id: { in: data.quizSubjectsId ?? [] } },
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
        quizSubjects: quizSubjects.map((s) => s.toDomain),
        seniority: seniority.toDomain,
        specialty: specialty.toDomain,
        stacks: stacks.map((s) => s.toDomain),
      };
    });
  }
}
