import { prisma } from "../../../../../../prisma/client";
import { injectable } from "tsyringe";
import { NotFoundError } from "@/shared/app.error";
import type {
  QuizObjective,
  QuizSubject,
  Seniority,
  Specialty,
  Stack,
} from "generated/prisma/client";

export interface IGetQuizQuestionContextInput {
  quizObjectiveId: number;
  quizSubjectsId?: number[] | undefined;
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
        quizObjective,
        quizSubjects,
        seniority,
        specialty,
        stacks,
      };
    });
  }
}
