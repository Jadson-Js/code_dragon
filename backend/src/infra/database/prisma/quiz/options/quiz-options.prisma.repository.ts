import { prisma } from "../../../../../../prisma/client";
import { injectable } from "tsyringe";
import type {
  QuizObjective,
  QuizSubject,
  Seniority,
  Specialty,
  Stack,
} from "generated/prisma/client";

export interface IGetQuizOptionsRepositoryOutput {
  quizObjectives: QuizObjective[];
  quizSubjects: QuizSubject[];
  seniorities: Seniority[];
  specialties: (Specialty & { subjects: QuizSubject[] })[];
  stacks: Stack[];
}



@injectable()
export class QuizOptionsPrismaRepository {
  async execute(): Promise<IGetQuizOptionsRepositoryOutput> {
    const [quizObjectives, quizSubjects, seniorities, specialties, stacks] =
      await prisma.$transaction([
        prisma.quizObjective.findMany({ orderBy: { name: "asc" } }),
        prisma.quizSubject.findMany({ orderBy: { name: "asc" } }),
        prisma.seniority.findMany({ orderBy: { order: "asc" } }),
        prisma.specialty.findMany({
          orderBy: { order: "asc" },
          include: {
            quizSubjects: {
              include: { quizSubject: true },
              orderBy: { quizSubject: { name: "asc" } },
            },
          },
        }),
        prisma.stack.findMany({ orderBy: { name: "asc" } }),
      ]);

    return {
      quizObjectives,
      quizSubjects,
      seniorities,
      specialties: specialties.map((s) => ({
        ...s,
        subjects: (s.quizSubjects ?? []).map((qs) => qs.quizSubject),
      })),
      stacks,
    };
  }
}
